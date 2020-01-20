var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var catalogRouter = require('./routes/catalog');  //Import routes for "catalog" area of site
var compression = require('compression');
var helmet = require('helmet');
require('dotenv').config({ path: '.env.local' });

var genre_controller = require('./controllers/genreController');

var app = express();
const session = require('express-session');
const { ExpressOIDC } = require('@okta/oidc-middleware');

//Set up mongoose connection
var mongoose = require('mongoose');
var dev_db_url = `mongodb+srv://drewradley:${process.env.MONGO_PW}@cluster0-xfvkm.mongodb.net/local_library?retryWrites=true&w=majority`;

var mongoDB = process.env.MONGODB_URI || dev_db_url;
// session support is required to use ExpressOIDC 
app.use(session({
  secret: process.env.CLIENT_SECRET_ADMIN || process.env.MONGODB_CLIENT_SECRET_ADMIN,
  resave: true,
  saveUninitialized: false
}));
const oidc = new ExpressOIDC({
  issuer: `https://dev-149346.okta.com/oauth2/default`,
  client_id: process.env.CLIENT_ID_ADMIN || process.env.MONGODB_CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET_ADMIN || process.env.MONGODB_CLIENT_SECRET_ADMIN,
  redirect_uri: 'http://localhost:8080/authorization-code/callback' ||'https://peaceful-oasis-24168.herokuapp.com/authorization-code/callback',
  scope: 'openid profile',
  appBaseUrl: 'http://localhost:8080' || 'https://peaceful-oasis-24168.herokuapp.com/catalog'
});

mongoose.connect(mongoDB, { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(helmet());
app.use(compression()); //Compress all routes
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(oidc.router);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);  // Add catalog routes to middleware chain.
app.use('/genre/create', oidc.ensureAuthenticated(), genre_controller.genre_create_get);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
//app.get('/genre/create', oidc.ensureAuthenticated());

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
oidc.on('ready', () => {
  app.listen(process.env.PORT ||8080, () => console.log(`Started 8080!`));
});

oidc.on('error', err => {
  console.log('Unable to configure ExpressOIDC', err);
})
module.exports = app;
