var express = require('express');
var morgan = require('morgan');
var hostname = 'localhost';
var port = 3000;
var app = express();

// first apply morgan loggin
app.use(morgan('dev'));

function auth (req, res, next) {
  console.log(req.headers);
  // extract auth from request headers
  var authHeader = req.headers.authorization;
  // if authHeader === null then user is not authed
  if (!authHeader) {
    var err = new Error('You are not authenticated!');
    err.status = 401;
    next(err);
    return;
  }
  var auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':');
  var user = auth[0];
  var pass = auth[1];

  if (user === 'admin' && pass === 'password') {
    next();
  } else {
    var err = new Error('You are not authenticated!');
    err.status = 401;
    next(err);
  }
}

// second apply auth function
app.use(auth);

// third we serve static files from public folder
// will not server static files unless authed.
app.use(express.static(__dirname + '/public'));

// if there is an error, we use error middleware function
app.use(function(err, req, res, next) {
  res.writeHead(err.status || 500, {
    'WWW-Authenticate': 'Basic',
    'Content-Type': 'text/plain'
  });
  res.end(err.message);
});

app.listen(port, hostname, function() {
  console.log(`Server running at http://${hostname}:${port}`);
});
