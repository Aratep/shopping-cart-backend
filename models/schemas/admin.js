const db = require('../db');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = db.Schema;

const AdminSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// AdminSchema.plugin(uniqueValidator, {message: '{VALUE} is already taken.'})

const admin = db.model('admin', AdminSchema);

module.exports = admin;