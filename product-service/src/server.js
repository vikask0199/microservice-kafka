const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoutes');
const consumer = require('./kafka/consumer'); // Import Kafka consumer

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/products', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
app.use('/products', productRoutes);

app.listen(port, () => {
    console.log(`Product service listening on port ${port}`);
});
