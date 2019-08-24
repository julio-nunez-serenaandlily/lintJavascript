var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

app.use(cors());

if(2===2){
	console.log("test1")
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/',function(req,res){

	res.json({status: 'Success'});
});

app.post('/upload', function(req, res){
	res.json({status: 'SucessUpload'})
})

// Faking chris service
var fs = require('fs');
var fileName = './entity.json';
var file = require(fileName);


app.get('/entityAccess/:type/:id', function(req, res){
	res.json(file)
})

app.post('/entityAccess/:type/:id/user/:userName', function(req, res){

	if(file.sharedAccess.find(o => o.memberUserName === req.params.userName)){
		res.json({'error': 'User already added!'});
		return;
	}
	file.sharedAccess.push({memberUserName: req.params.userName})

	fs.writeFile(fileName, JSON.stringify(file), function (err) {
	  if (err) return console.log(err);
	  console.log(JSON.stringify(file));
	  console.log('writing to ' + fileName);
	});

	res.json(file)
})

app.delete('/entityAccess/:type/:id/user/:userName', function(req, res){

	file.sharedAccess = file.sharedAccess.filter(o => o.memberUserName !== req.params.userName);

	fs.writeFile(fileName, JSON.stringify(file), function (err) {
	  if (err) return console.log(err);
	  console.log(JSON.stringify(file));
	  console.log('writing to ' + fileName);
	});

	res.json(file)
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
