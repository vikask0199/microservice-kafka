const Product = require('../models/product');

exports.addProduct = async (req, res) => {
    const { name, quantity } = req.body;
    const product = new Product({ name, quantity });
    await product.save();
    res.status(201).send(product);
};

exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.status(204).send();
};

exports.getProducts = async (req, res) => {
    const products = await Product.find();
    res.status(200).send(products);
};

exports.updateQuantity = async (req, res) => {
    const { id, quantity } = req.body;
    const product = await Product.findById(id);
    if (product) {
        product.quantity = quantity;
        await product.save();
        res.status(200).send(product);
    } else {
        res.status(404).send({ message: 'Product not found' });
    }
};
