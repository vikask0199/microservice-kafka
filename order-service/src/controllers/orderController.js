const Order = require('../models/order');
const producer = require('../kafka/producer');

exports.createOrder = async (req, res) => {
    const { productId, quantity } = req.body;
    const order = new Order({ productId, quantity });
    await order.save();

    const payloads = [
        { topic: 'orderCreated', messages: JSON.stringify({ productId, quantity }), partition: 0 }
    ];

    producer.send(payloads, (err, data) => {
        if (err) {
            console.error('Error sending Kafka message', err);
            res.status(500).send(err);
        } else {
            res.status(201).send(data);
        }
    });
};
