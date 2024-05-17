const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    quantity: Number
});

module.exports = mongoose.model('Product', productSchema);
