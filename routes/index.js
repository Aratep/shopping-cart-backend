const express = require('express');
const router = express.Router();

const generateToken = require('../lib/helperFunctions');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/token', function(req, res, next) {
    const token = generateToken();
    res.json({token})
});

module.exports = router;
