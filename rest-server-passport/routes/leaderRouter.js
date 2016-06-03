var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Leaders = require('../models/leaders');
var Verify = require('./verify');

var leaderRouter = express.Router();
// middleware to parse body of request
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
  .get(Verify.verifyOrdinaryUser, function(req, res, next) {
    // empty object as first param will return ALL leaders
    Leaders.find({}, function(err, leader) {
      if (err) throw err;
      res.json(leader);
    });
  })
  .post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    Leaders.create(req.body, function(err, leader) {
      if (err) throw err;

      console.log('leader created!');
      var id = leader._id;
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      res.end(`Added the leader with id: ${id}`);
    });
  })
  .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    Leaders.remove({}, function(err, resp) {
      if (err) throw err;
      res.json(resp);
    });
  })
  .all(function(req, res, next) {
    res.end('ERROR: ' + req.method + ' not supported.');
  });

leaderRouter.route('/:leaderId')
  .get(Verify.verifyOrdinaryUser, function(req, res, next) {
    // req.params.leaderId allows us to access :leaderId from URI
    Leaders.findById(req.params.leaderId, function(err, leader) {
      if (err) throw err;
      res.json(leader);
    });
  })
  .put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    Leaders.findByIdAndUpdate(req.params.leaderId, 
      {
        $set: req.body
      },
      {
        // callback function will return updated leader value
        new: true
      }, 
      function(err, leader) {
        if (err) throw err;
        res.json(leader);
      }
    );
  })
  .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    Leaders.remove(req.params.leaderId, function(err, resp) {
      if (err) throw err;
      res.json(resp);
    });
  })
  .all(function(req, res, next) {
    res.end('ERROR: ' + req.method + ' not supported.');
  });

module.exports = leaderRouter;

