// order-service/controllers/cartController.js
const Cart = require('../models/cart');
const producer = require('../kafka/producer');


exports.addToCart = async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const existingItem = cart.items.find(item => item.productId.equals(productId));
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ productId, quantity });
        }

        await cart.save();
        res.status(200).send(cart);
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

exports.getCart = async (req, res) => {
    const { userId } = req.params;

    try {
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart) {
            return res.status(404).send({ message: 'Cart not found' });
        }

        res.status(200).send(cart);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

exports.checkoutCart = async (req, res) => {
    const { userId } = req.params;

    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).send({ message: 'Cart not found' });
        }

        const payloads = cart.items.map(item => ({
            topic: 'cartCheckout',
            messages: JSON.stringify({ userId, productId: item.productId, quantity: item.quantity }),
            partition: 0
        }));

        producer.send(payloads, async (err, data) => {
            if (err) {
                console.error('Error sending Kafka message', err);
                return res.status(500).send({ message: 'Internal Server Error' });
            }

            await Cart.deleteOne({ userId });
            res.status(200).send({ message: 'Order placed successfully', data });
        });
    } catch (error) {
        console.error('Error during checkout:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};
