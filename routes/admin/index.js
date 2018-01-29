const express = require('express');
const router = express.Router();

const admin = require('../../controllers/admin/login');

/* GET home page. */
router.post('/login', admin.login);
router.post('/register', admin.register);

module.exports = router;
