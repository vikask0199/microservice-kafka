const kafka = require('kafka-node');

const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });
const admin = new kafka.Admin(client);

const topics = [
    {
        topic: 'cartCheckout',
        partitions: 1,
        replicationFactor: 1
    },
    {
        topic: 'orderCreated',
        partitions: 1,
        replicationFactor: 1
    }
];

admin.createTopics(topics, (err, res) => {
    if (err) {
        console.error('Error creating topics:', err);
    } else {
        console.log('Topics created successfully:', res);
    }
    client.close();
});
