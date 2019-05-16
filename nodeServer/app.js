var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//var createDBrouter = require('./routes/createdb');
var DBrouter = require('./routes/test');
///
var sequelize = require('./models').sequelize;

var app = express();
sequelize.sync();
////
//var Medicine = require('./models').Medicine;
////

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/db', DBrouter); 
///////
//app.use('/createdb', createDBrouter);


////////////
/////////////////
app.post('/test', function(req, res) {
	var test1 = req.body.testA;
	var test2 = req.body.testB;

	console.log(test1);
	console.log(test2);
	
	var test3 = "hello, world!";
	res.send(test3);
	console.log("sucessfully send");
});

app.post('/test1', function(req, res) {
	
	console.log("hehehehehehe");
});

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
