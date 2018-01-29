const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Admin = require('../../models/schemas/admin');

router.register = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    const admin = {username, password};
    const newAdmin = new Admin(admin);
    newAdmin.password = bcrypt.hashSync(password, 10);

    newAdmin.save()
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

router.login = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    Admin.findOne({'username': username})
        .then(admin => {
            if (!admin) {
                res.status(401).json({message: 'User not found.'})

            } else if (admin) {
                if (admin && !bcrypt.compareSync(password, admin.password)) {
                    res.status(401).json({message: 'Wrong password.'})
                }
            }
            if (admin && bcrypt.compareSync(password, admin.password)) {
                // req.session.adminId = admin._id;
                // localStorage.setItem('adminId', admin._id)

                const token = jwt.sign({
                    username: admin.username,
                    _id: admin._id,
                }, 'secret_key');
                return res.status(200).json({token})
            }
        })
        .catch(err => console.log(err))
};

module.exports = router;




