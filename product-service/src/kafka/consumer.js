const kafka = require('kafka-node');
const Product = require('../models/product');

const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });
console.log(client)

const consumer = new kafka.Consumer(
    client,
    [{ topic: 'orderCreated', partition: 0 }],
    { autoCommit: true }
);

console.log("consumer",consumer)

consumer.on('message', async (message) => {
    console.log("message", message)
    const order = JSON.parse(message.value);
    const product = await Product.findById(order.productId);
    console.log("product", product)
    if (product) {
        product.quantity -= order.quantity;
        await product.save();
        console.log(`Updated product ${product._id} quantity to ${product.quantity}`);
    } else {
        console.log(`Product not found: ${order.productId}`);
    }
});

consumer.on('error', (err) => {
    console.error('Kafka Consumer error:', err);
});

module.exports = consumer;
