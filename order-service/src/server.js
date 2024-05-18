const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const port = 3001;

mongoose.connect('mongodb://localhost:27017/orders', { });

app.use(bodyParser.json());
app.use('/orders', orderRoutes);

app.listen(port, () => {
    console.log(`Order service listening on port ${port}`);
});
