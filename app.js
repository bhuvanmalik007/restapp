var express = require('express');

var mongoose = require('mongoose');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var db = mongoose.connect('mongodb://root:admin@ds039684.mongolab.com:39684/apptest');
var Book = require('./models/bookModel');


var bookRouter = express.Router();

bookRouter.route('/books').post(function(req,res){
  console.log(req.body);
      var book = new Book(req.body);
      console.log(book);
      res.send(book);
    })


    .get(function(req,res){
      var query={};
  if(req.query.genre){
    query.genre=req.query.genre;
  }

  Book.find(query, function(err,books){
    if(err)
        console.log(err);
    else
        res.json(books);
  });

});  //bookRouter.route('/books')

bookRouter.route('/books/:bookId').get(function(req,res){

  Book.findById(req.params.bookId, function(err,book){
    if(err)
      console.log(err);
    else
      res.json(book);
  });

});


app.use('/api',bookRouter);


app.get('/',function(req,res){
res.send("ReST baby <3 <3 <3");
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

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
