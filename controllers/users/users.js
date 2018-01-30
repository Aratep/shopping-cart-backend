const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

const User = require('../../models/schemas/users');
const generateToken = require('../../lib/helperFunctions');
const sendVerificationMail = require('../../mailer/sendMail');

if (typeof localStorage === "undefined" || localStorage === null) {
    const LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

router.register = (req, res, next) => {
    const username = req.body.username_reg;
    const email = req.body.email_reg;
    const password = req.body.password_reg_confirm;
    const userToRegister = {
        username, email, password
    };
    const newUser = new User(userToRegister);
    newUser.password = bcrypt.hashSync(password, 10);
    console.log(req.body);

    newUser.save()
        .then((user) => {
            user.password = undefined;
            return res.json(user);
        })
        .catch(err => {
            for (let i in err.errors) {
                return res.status(400).send({
                    message: err.errors[i].message
                });
            }
        })
};

router.sign_in = (req, res) => {
    const username = req.body.username;
    const email = req.body.username;
    const password = req.body.password;
    console.log(req.body);

    User.findOne({$or: [{'email': email}, {'username': username}]})
        .then(user => {
            if (!user) {
                res.status(401).json({message: 'Authentication failed. User not found.'})

            } else if (user) {
                if (user && !bcrypt.compareSync(password, user.password)) {
                    res.status(401).json({message: 'Authentication failed. Wrong password.'})
                }
            }
            if (user && bcrypt.compareSync(password, user.password)) {
                req.session.userId = user._id;
                localStorage.setItem('userId', user._id);

                const token = jwt.sign({
                    email: user.email,
                    username: user.username,
                    _id: user._id,
                    isLoggedin: true
                }, 'secret_key');
                res.status(200).json({token: token})
            }
        })
        .catch(err => console.log(err))
};

router.edit_user = (req, res) => {
    const username = req.body.values.usernameupdate;
    const email = req.body.values.emailupdate;
    const id = req.body.id;
    const userId = localStorage.getItem('userId');

    User.findOne({_id: id})
        .then(user => {
            if (userId !== id) {

                res.status(401).send({message: 'You have no permissions to edit this user'})
                return
            }
            if (user) {
                User.updateOne(
                    {_id: id},
                    {$set: {username: username, email: email, created: Date.now()}},
                    {runValidators: true, context: 'query'}
                )
                    .then(() => {
                            res.status(200).json({
                                    token: jwt.sign(
                                        {email: email, username: username, _id: user._id}, 'secret_key')
                                }
                            );
                        }
                    )
                    .catch(err => {
                        for (let i in err.errors) {
                            return res.status(400).send({
                                message: err.errors[i].message
                            });
                        }
                    })
            }
        })
        .catch(err => console.log(err));
};

router.reset_password = (req, res) => {
    const password = bcrypt.hashSync(req.body.passwordreset_confirm, 10);
    const username = req.body.usernamereset;

    User.findOne({$or: [{'email': username}, {'username': username}]})
        .then(user => {
            if (!user) {
                res.status(401).json({message: `${username} is not registered user.`})

            } else if (user) {
                User.updateOne(
                    {$or: [{'email': username}, {'username': username}]},
                    {$set: {password: password, created: Date.now()}}
                )
                    .then(() => {
                            // sendVerificationMail(user);
                            res.status(200).json({
                                token: jwt.sign(
                                    {email: user.email, username: user.username, _id: user._id},
                                    'secret_key')
                            })
                        }
                    )
            }
        })
        .catch(err => console.log(err))
};

router.get_all_users = (req, res) => {
    User.find({}).exec((err, users) => {
        if (err) throw err;
        User.count().then(count => {
            const token = jwt.sign({users: users, countOfUsers: count}, 'secret_key');
            res.status(200).json({
                token: token
            })
        })
    })
};

router.delete_single_user = (req, res) => {
    const id = req.body.id;
    const userId = localStorage.getItem('userId');

    User.findOne({_id: id})
        .then(user => {
            if (userId !== id) {
                res.status(401).send({message: 'You have no permissions to delete this user'})
                return
            }
            if (user) {
                User.remove({_id: id})
                    .then(() => res.status(200).json({message: `${user.username} is deleted`}))
                localStorage.removeItem('_token')
            }
        })
        .catch(err => console.log(err))
};

router.generate_token = (req, res) => {
    const token = generateToken();
    res.json({token})
}

module.exports = router;