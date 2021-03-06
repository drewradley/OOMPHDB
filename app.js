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
var user_controller = require('./controllers/userController');

var app = express();
const session = require('express-session');

//Set up mongoose connection
var mongoose = require('mongoose');
var dev_db_url = `mongodb+srv://drewradley:${process.env.MONGO_PW}@cluster0-xfvkm.mongodb.net/local_library?retryWrites=true&w=majority`;

var mongoDB = process.env.MONGODB_URI || dev_db_url;


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

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);  // Add catalog routes to middleware chain.
app.use('/genre/create',genre_controller.genre_create_get);// oidc.ensureAuthenticated(), 
app.use('/user/create',user_controller.user_create_get);// oidc.ensureAuthenticated(), 

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
