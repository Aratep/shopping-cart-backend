const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');

const index = require('./routes/index');
const products = require('./routes/products/index');
const admin = require('./routes/admin/index');
const users = require('./routes/users/index');
const cart = require('./routes/cart/index');
const accessControl = require('./middlewares/accessControl');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(session({
    secret: "mySecretWord",
    key: "SESSIONID",
    resave: true,
    saveUninitialized: true,
    cookie: {
        path: "/",
        maxAge: null,
        httpOnly: true
    }
}));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));


app.use(accessControl.access_controls);

app.use('/', index);
app.use('/users', users);
app.use('/products', products);
app.use('/admin', admin);
app.use('/cart', cart);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        console.log(err);
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

module.exports = app;
