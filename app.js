/**
 * Module dependencies.
 */
var express = require('express');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var favicon = require('serve-favicon');
var session = require('express-session');
var bodyParser = require('body-parser');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var lusca = require('lusca');
var methodOverride = require('method-override');

var _ = require('lodash');
var MongoStore = require('connect-mongo')(session);
var flash = require('express-flash');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var expressValidator = require('express-validator');
var sass = require('node-sass-middleware');


/**
 * Controllers (route handlers).
 */
var homeController = require('./controllers/home');
var userController = require('./controllers/user');
var apiController = require('./controllers/api');
var contactController = require('./controllers/contact');
var countryController = require('./controllers/countryController');
var canyonController = require('./controllers/canyonController');
var regionController = require('./controllers/regionController');
var abenteuerController = require('./controllers/abenteuerController');
var cartController = require('./controllers/cartController');
var orderController = require('./controllers/orderController');
/**
 * API keys and Passport configuration.
 */
var secrets = require('./config/secrets');
var passportConf = require('./config/passport');

/**
 * Create Express server.
 */
var app = express();

/**
 * Connect to MongoDB.
 */
mongoose.connect(secrets.db);
mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(compress());
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  debug: true,
  outputStyle: 'expanded'
}));
app.use(logger('dev'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: secrets.sessionSecret,
  store: new MongoStore({ url: secrets.db, autoReconnect: true })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca({
  csrf: true,
  xframe: 'SAMEORIGIN',
  xssProtection: true
}));
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});
app.use(function(req, res, next) {
  if (/api/i.test(req.path)) {
    req.session.returnTo = req.path;
  }
  next();
});
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

//*** Primary app routes
app.get('/', homeController.index);

app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
app.get('/forgot', userController.getForgot);
app.post('/forgot', userController.postForgot);
app.get('/reset/:token', userController.getReset);
app.post('/reset/:token', userController.postReset);
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);
app.get('/contact', contactController.getContact);
app.post('/contact', contactController.postContact);
app.get('/account', passportConf.isAuthenticated, userController.getAccount);
app.post('/account/profile', passportConf.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConf.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConf.isAuthenticated, userController.postDeleteAccount);
app.get('/account/unlink/:provider', passportConf.isAuthenticated, userController.getOauthUnlink);

// *** country routes
app.get('/country/new', countryController.new);
app.get('/country/:id', countryController.show);
app.get('/country/edit/:id', countryController.edit);
app.post('/country', countryController.create);
app.post('/country/:id', countryController.update);
app.get('/countries', countryController.index);
app.post('/country/delete/:id', countryController.delete);

// *** canyon routes
app.get('/canyon/new', canyonController.new);
app.get('/canyon/:id', canyonController.show);
app.get('/canyon/edit/:id', canyonController.edit);
app.post('/canyon', canyonController.create);
app.post('/canyon/:id', canyonController.update);
app.get('/canyons', canyonController.index);
app.post('/canyon/delete/:id', canyonController.delete);

// *** regionen routes
app.get('/region/new', regionController.new);
app.get('/region/:id', regionController.show);
app.get('/region/edit/:id', regionController.edit);
app.post('/region', regionController.create);
app.post('/region/:id', regionController.update);
app.get('/regions', regionController.index);
app.post('/region/delete/:id', regionController.delete);

// *** abenteuer routes
app.post('/abenteuer/new', abenteuerController.new);
app.get('/abenteuer/:id', abenteuerController.show);
app.get('/abenteuer/edit/:id', abenteuerController.edit);
app.post('/abenteuer', abenteuerController.create);
app.post('/abenteuer/:id', abenteuerController.update);
app.get('/abenteuer', abenteuerController.index);
app.post('/abenteuer/delete/:id', abenteuerController.delete);

app.get('/cart', cartController.cart);
app.post('/cart', cartController.add_item);
app.post('/cart/plus', cartController.plus);
app.post('/cart/minus', cartController.minus);
app.get('/cart/delete', cartController.remove_item);
app.post('/cart/remove', cartController.remove);

//*** API examples routes.
app.get('/api', apiController.getApi);
app.get('/api/paypal', apiController.getPayPal);
app.get('/api/paypal/success', apiController.getPayPalSuccess);
app.get('/api/paypal/cancel', apiController.getPayPalCancel);


app.get('/order', orderController.order);
app.get('/execute', orderController.execute);
app.get('/cancel', orderController.cancel);

//*** Error Handler
app.use(errorHandler());

//*** Start Express server.
app.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;