const db = require('../db');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = db.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        uniqueCaseInsensitive: true
    },
    email: {
        type: String,
        unique: true,
        uniqueCaseInsensitive: true
    },
    password: String,
    created: {
        type: Date,
        default: Date.now
    },
    // role: {
    //     type:String,
    //     default: 'user',
    //     required: false
    // }
});

UserSchema.plugin(uniqueValidator, {message: '{VALUE} is already taken.'});

// UserSchema.plugin(require('mongoose-role'), {
//     roles: ['user', 'admin'],
//     accessLevels: {
//         'admin': ['admin']
//     }
// });

const users = db.model('user', UserSchema);

module.exports = users;