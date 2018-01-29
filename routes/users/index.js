const express = require('express');
const app = express();
const router = express.Router();
const jwt = require('jsonwebtoken');

const users = require('../../controllers/users/users');

router.get('/token', users.generate_token);
router.post('/register', users.register);
router.put('/reset_password', users.reset_password);

router.use(function(req, res, next) {
    // check header or url parameters or post parameters for token
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, 'secret_key', (err, decoded) => {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }
});

// // router.post('/upload_file', upload.upload_file);
router.post('/sign_in', users.sign_in);
router.put('/edit_user', users.edit_user);
router.delete('/delete_single_user', users.delete_single_user);
router.get('/list_all_users', users.get_all_users);



module.exports = router;