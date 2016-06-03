var express = require('express');
var morgan = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var hostname = 'localhost';
var port = 3000;
var app = express();

// apply morgan loggin
app.use(morgan('dev'));

// applies a session object to incoming req object.
app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: true,
  resave: true,
  store: new FileStore()
}));

function auth (req, res, next) {
  console.log(req.headers);

  // check if req already has a session with user property
  if (!req.session.user) {
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
      req.session.user = 'admin';
      next(); // authorized
    } else {
      var err = new Error('You are not authenticated!');
      err.status = 401;
      next(err);
    }
    // else cookie.user is already included in header (user already authed);
  } else {
    if (req.session.user === 'admin') {
      console.log('req.session:', req.session);
      next();
    } else {
      var err = new Error('You are not authenticated!');
      err.status = 401;
      next(err);
    }
  }
}

// apply auth function
app.use(auth);

// serve static files from public folder
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
