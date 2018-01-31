const db = require('../db');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = db.Schema;

const CartSchema = new Schema({
    prod_id: {
        type: String,
        // unique: true
    },
    user_id: {
        type: String,
    }
});

CartSchema.plugin(uniqueValidator, {message: 'This product is already added to cart.'})

const cart = db.model('cart', CartSchema);

module.exports = cart;