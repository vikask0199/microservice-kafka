const express = require('express');
const { createOrder } = require('../controllers/orderController');
const { addToCart, getCart, checkoutCart } = require('../controllers/cartController')

const router = express.Router();

router.post('/create', createOrder);
router.post('/add', addToCart);
router.get('/:userId', getCart);
router.post('/checkout/:userId', checkoutCart);

module.exports = router;
