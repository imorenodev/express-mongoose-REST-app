var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Dishes = require('../models/dishes');

var dishRouter = express.Router();
// middleware to parse body of request
dishRouter.use(bodyParser.json());

dishRouter.route('/')
  .get(function(req, res, next) {
    // empty object as first param will return ALL dishes
    Dishes.find({}, function(err, dish) {
      if (err) throw err;
      res.json(dish);
    });
  })
  .post(function(req, res, next) {
    Dishes.create(req.body, function(err, dish) {
      if (err) throw err;

      console.log('Dish created!');
      var id = dish._id;
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      res.end(`Added the dish with id: ${id}`);
    });
  })
  .delete(function(req, res, next) {
    Dishes.remove({}, function(err, resp) {
      if (err) throw err;
      res.json(resp);
    });
  })
  .all(function(req, res, next) {
    res.end('ERROR: ' + req.method + ' not supported.');
  });

dishRouter.route('/:dishId')
  .get(function(req, res, next) {
    // req.params.dishId allows us to access :dishId from URI
    Dishes.findById(req.params.dishId, function(err, dish) {
      if (err) throw err;
      res.json(dish);
    });
  })
  .put(function(req, res, next) {
    Dishes.findByIdAndUpdate(req.params.dishId, 
      {
        $set: req.body
      },
      {
        // callback function will return updated dish value
        new: true
      }, 
      function(err, dish) {
        if (err) throw err;
        res.json(dish);
      }
    );
  })
  .delete(function(req, res, next) {
    Dishes.remove(req.params.dishId, function(err, resp) {
      if (err) throw err;
      res.json(resp);
    });
  })
  .all(function(req, res, next) {
    res.end('ERROR: ' + req.method + ' not supported.');
  });

dishRouter.route('/:dishId/comments')
  .get(function(req, res, next) {
    Dishes.findById(req.params.dishId, function(err, dish) {
      if (err) throw err;
      res.json(dish.comments);
    });
  })
  .post(function(req, res, next) {
    Dishes.findById(req.params.dishId, function(err, dish) {
      if (err) throw err;
      dish.comments.push(req.body);
      dish.save(function(err, dish) {
        if (err) throw err;
        console.log('Updated comments!');
        res.json(dish);
      });
    });
  })
  .delete(function(req, res, next) {
    Dishes.findById(req.params.dishId, function(err, dish) {
      if (erro) throw err;
      for (var i = 0; i < dish.comments.length; i++) {
        // find dish by id, then for every comment in its comments
        // array, grab the _id and pass to queried dish.comments.id()
        // and call .remove() to delete comment from that dish's
        // comments array.
        dish.comments.id(dish.comments[i]._id).remove();
      }
      dish.save(function(err, result) {
        if (err) throw err;
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Deleted all comments!');
      });
    });
  });

dishRouter.route('/:dishId/comments/:commentId')
  .get(function(req, res, next) {
    Dishes.findById(req.params.dishId, function(err, dish) {
      if (err) throw err;
      res.json(dish.comments.id(req.params.commentId));
    });
  })
  .put(function(req, res, next) {
    // We delete the existing comment and insert the updated comment
    // as a new comment 
    Dishes.findById(req.params.dishId, function(err, dish) {
      if (err) throw err;
      dish.comments.id(req.params.commentId).remove();
      dish.comments.push(req.body);
      dish.save(function(err, result) {
        if (err) throw err;
        console.log('Updated comment!');
        console.log(dish);
        res.json(dish);
      });
    });
  })
  .delete(function(req, res, next) {
    Dishes.findById(req.params.dishId, function(err, dish) {
      if (err) throw err;
      dish.comments.id(req.params.commentId).remove();
      dish.save(function(err, resp) {
        if (err) throw err;
        res.json(resp);
      });
    });
  });
 
module.exports = dishRouter;

