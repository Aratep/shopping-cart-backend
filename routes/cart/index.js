const express = require('express');
const router = express.Router();

const cart = require('../../controllers/cart/cart');

/* GET home page. */
router.post('/add-to-cart', cart.add_to_cart);
router.post('/cart-list', cart.get_cart_list);
// router.put('/update', product.update_product);
// router.delete('/delete', product.delete_product);

module.exports = router;
