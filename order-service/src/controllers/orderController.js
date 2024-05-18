const Order = require('../models/order');
const producer = require('../kafka/producer');

exports.createOrder = async (req, res) => {
    const { productId, quantity } = req.body;
    const order = new Order({ productId, quantity });
    const orderdDate = await order.save();

    
    const payloads = [
        { topic: 'orderCreated', messages: JSON.stringify({ productId, quantity }) }
    ];
    
    res.status(201).json({ Order_Status: orderdDate, message: "Order Created Successfully" });
    
    producer.send(payloads, (err, data) => {
        if (err) {
            console.error('Error sending Kafka message', err);
            res.status(500).send(err);
        } else {
            
        }
    });
};
