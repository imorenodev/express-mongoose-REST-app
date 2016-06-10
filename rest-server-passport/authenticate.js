var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('./models/user');
var config = require('./config');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.facebook = passport.use(new FacebookStrategy(
  {
    clientID: config.facebook.clientSecret,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    // check if user already exists in db
    User.findOne({ OauthId: profile.id }, 
      function(err, user) {
        if (err) {
          console.log(err); // handle errors
        }
        if (!err && user !== null) {
          // if user is already in db then return user
          done(null, user);
        } else {
          // create new user
          user = new User({
            username: profile.displayName
          });
          user.OauthId = profile.id;
          user.OauthToken = accessToken;
          user.save(function(err) {
            if (err) {
              console.log(err);
            } else {
              console.log('saving user ...');
              done(null, user);
            }
          });
        }
      })
  }
));
