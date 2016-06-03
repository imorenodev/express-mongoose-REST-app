var User = require('../models/user');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config.js');

exports.getToken = function (user) {
  return jwt.sign(user, config.secretKey, {
    expiresIn: 3600
  });
};

exports.verifyOrdinaryUser = function (req, res, next) {
  // check header or url params or post params for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  
  // decode token
  if (token) {
    // verify secret and check expiration
    jwt.verify(token, config.secretKey, function (err, decoded) {
      if (err) {
        var err = new Error('You are not authenticated!');
        err.status(401);
        return next(err);
      } else {
        // if everything is good, save to req for use in other routes
        req.decoded = decoded;
        next();
      }
    });
  } else {
    // if no token
    var err = new Error('No token provided!');
    err.status = 403;
    return next(err);
  }
};