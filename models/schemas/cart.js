const db = require('../db');

const Schema = db.Schema;

const CartSchema = new Schema({
    prod_id: {
        type: String,
    },
    user_id: {
        type: String,
    }
});

// ProductSchema.plugin(uniqueValidator, {message: '{VALUE} is already taken.'})

const cart = db.model('cart', CartSchema);

module.exports = cart;