const kafka = require('kafka-node');
const mongoose = require('mongoose');
const Product = require('../../product-service/src/models/product');

mongoose.connect('mongodb://localhost:27017/products', {  });

const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });
const consumer = new kafka.Consumer(client, [{ topic: 'orderCreated' }], { autoCommit: false });

consumer.on('message', async (message) => {
    const { productId, quantity } = JSON.parse(message.value);

    const product = await Product.findById(productId);
    if (product) {
        product.quantity -= quantity;
        await product.save();
        console.log(`Product ${productId} quantity updated`);
    } else {
        console.error(`Product ${productId} not found`);
    }
});

consumer.on('error', (error) => {
    console.error('Kafka Consumer error:', error);
});
