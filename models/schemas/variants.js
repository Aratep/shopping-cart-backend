const db = require('../db');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = db.Schema;

const VariantsSchema = new Schema({
    variant_name: {
        type: String,
    },
    variant_price: {
        type: Number,
    },
    variant_status: {
        type: String,
    },
    prod_id: {
        type: String
    }
});

// ProductSchema.plugin(uniqueValidator, {message: '{VALUE} is already taken.'})

const variants = db.model('variants', VariantsSchema);

module.exports = variants;