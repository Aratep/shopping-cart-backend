const express = require('express');
const app = express();
const router = express.Router();

const users = require('../../controllers/users/users');
const verifyToken = require('../../middlewares/verifyToken');

router.get('/token', users.generate_token);
router.post('/register', users.register);
router.put('/reset_password', users.reset_password);
// router.use(verifyToken);

router.post('/sign_in', users.sign_in);
router.put('/edit_user', users.edit_user);
router.delete('/delete_single_user', users.delete_single_user);
router.get('/all-users', users.get_all_users);



module.exports = router;