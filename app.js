var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = express.Router();

require('./routes/weather/weather')(routes);
require('./routes/weather/settings')(routes);
require('./routes/weather/myLocations')(routes);
require('./routes/weather/locationwise')(routes);
require('./routes/weather/weekly')(routes);
require('./routes/weather/hourly')(routes);
require('./routes/weather/locationSuggestions')(routes);

require('./routes/traffic/traffic')(routes);
require('./routes/traffic/myRoutes')(routes);

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  next();
});

app.use(routes);

app.disable('etag');

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
  res.end();
});


module.exports = app;
