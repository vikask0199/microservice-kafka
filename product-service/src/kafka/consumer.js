const kafka = require('kafka-node');
const Product = require('../models/product');


const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });

const consumer = new kafka.Consumer(
    client,
    [
        { topic: 'cartCheckout' },
        { topic: 'orderCreated' }
    ],
    { autoCommit: false }
);

const offsetMap = new Map();

consumer.on('message', async (message) => {
    const { topic, partition, offset } = message;

    // Check if this message has already been processed
    if (offsetMap.has(`${topic}-${partition}`) && offsetMap.get(`${topic}-${partition}`) >= offset) {
        console.log(`Skipping duplicate message: ${topic}-${partition}-${offset}`);
        return;
    }

    const payload = JSON.parse(message.value);

    try {
        if (topic === 'cartCheckout') {
            await handleCartCheckout(payload);
        } else if (topic === 'orderCreated') {
            await handleOrderCreated(payload);
        }

        consumer.commit((error, data) => {
            if (error) {
                console.error('Error committing offset:', error);
            } else {
                console.log(`Offset ${offset} committed successfully for ${topic}-${partition}`);
                offsetMap.set(`${topic}-${partition}`, offset);
            }
        });
    } catch (error) {
        console.error('Error processing message:', error);
    }
});

async function handleCartCheckout(payload) {
    const { userId, productId, quantity } = payload;
    const product = await Product.findById(productId);
    if (!product) {
        console.log(`Product not found: ${productId}`);
        return;
    }

    if (product.quantity < quantity) {
        console.log(`Insufficient stock for product: ${productId}`);
        return;
    }

    product.quantity -= quantity;
    await product.save();
    console.log(`Product ${productId} quantity updated to ${product.quantity}`);
}

async function handleOrderCreated(payload) {
    const { productId, quantity } = payload;
    const product = await Product.findById(productId);
    if (!product) {
        console.log(`Product not found: ${productId}`);
        return;
    }

    product.quantity -= quantity;
    const data = await product.save();
    console.log(`Updated product ${product._id} quantity to ${product.quantity}`);
}

consumer.on('error', (err) => {
    console.error('Kafka Consumer error:', err);
});

module.exports = consumer;
