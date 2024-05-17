const express = require('express');
const { addProduct, deleteProduct, getProducts, updateQuantity } = require('../controllers/productController');
const router = express.Router();

router.post('/add', addProduct);
router.delete('/:id', deleteProduct);
router.get('/', getProducts);
router.put('/update-quantity', updateQuantity);


module.exports = router;