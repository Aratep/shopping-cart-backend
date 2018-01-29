const db = require('../db');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = db.Schema;

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    imagePath: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    available_quantity: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    // variants : {
    //     variant_name: {
    //         type: String,
    //         required: true
    //     },
    //     variant_price: {
    //         type: Number,
    //         required: true
    //     },
    //     variant_status: {
    //         type: String,
    //         required: true
    //     }
    // }
});

// ProductSchema.plugin(uniqueValidator, {message: '{VALUE} is already taken.'})

const product = db.model('product', ProductSchema);

module.exports = product;