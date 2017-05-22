/**
 * New node file
 */

// Import dependencies
const passport = require('passport');
const express = require('express');
const config = require('../config/database');
const jwt = require('jsonwebtoken');

// Set up middleware
const requireAuth = passport.authenticate('jwt', { session: false });

// Load models
const User = require('../models/user');

// Export the routes for our app to use
module.exports = function(app) {
  // API Route Section

  // Initialize passport for use
  //app.use(passport.initialize());

  // Bring in defined Passport Strategy
  require('../config/passport')(passport);

  // Create API group routes
  const apiRoutes = express.Router();

  // Register new users
  apiRoutes.post('/register', function(req, res) {
    console.log(req.body);
    if(!req.body.email || !req.body.password) {
      res.status(400).json({ success: false, message: 'Please enter email and password.' });
    } else {
      const newUser = new User({
        email: req.body.email,
        password: req.body.password
      });

      // Attempt to save the user
      newUser.save(function(err) {
        if (err) {
          return res.status(400).json({ success: false, message: 'That email address already exists.'});
        }
        return res.status(201).json({ success: true, message: 'Successfully created new user.' });
      });
    }
  });

//forget password

// Register new users
apiRoutes.post('/forget', function(req, res) {
  console.log(req.body);

  User.findOne({
    email: req.body.email
  }, function(err, user) {
    console.log("user finding error"+err);
    if (err) throw err;

    if (!user) {
      res.status(401).json({ success: false, message: 'Found user. User not found.' });
    } else {
      return res.status(200).json({ success: true, message: 'Account recovery email sent '+req.body.email+' If you don\'t see this email in your inbox within 15 minutes, look for it in your junk mail folder. If you find it there, please mark it as "Not Junk"..' });

    }
  });
});


  // Authenticate the user and get a JSON Web Token to include in the header of future requests.
  apiRoutes.post('/authenticate', function(req, res) {
    User.findOne({
      email: req.body.email
    }, function(err, user) {
      console.log("user finding error"+err);
      if (err) throw err;

      if (!user) {
        res.status(401).json({ success: false, message: 'Authentication failed. User not found.' });
      } else {
        // Check if password matches
        user.comparePassword(req.body.password, function(err, isMatch) {
          if (isMatch && !err) {
            // Create token if the password matched and no error was thrown
            const token = jwt.sign(user, config.secret, {
              expiresIn: 10080 // in seconds
            });
            res.status(200).json({ success: true,user:user, token:"JWT " + token });
          } else {
            res.status(401).json({ success: false, message: 'Authentication failed. Passwords did not match.' });
          }
        });
      }
    });
  });

  // Protect  routes with JWT
  // GET messages for authenticated user
  apiRoutes.post('/listOf', requireAuth, function(req, res) {
      console.log("allUser successfully");
      	res.send("Featching all user data /...... Please have patience ");
//	  User.findOne({
//	      email: req.body.email},
//	      function(err, user) {
//	          if (err) throw err;  if (err)
//        res.status(400).send(err);
//
//      res.status(400).json(messages);
//    });
  });

//note how to all use
// header Authorization = JWT //eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwiZ2V0dGVycyI6e30sIndhc1BvcHVsYXRlZCI6ZmFsc2UsImFjdGl2ZVBhdGhzIjp7InBhdGhzIjp7InBhc3N3b3JkIjoiaW5pdCIsImVtYWlsIjoiaW5pdCIsIl9fdiI6ImluaXQiLCJfaWQiOiJpbml0In0sInN0YXRlcyI6eyJpZ25vcmUiOnt9LCJkZWZhdWx0Ijp7fSwiaW5pdCI6eyJfX3YiOnRydWUsInBhc3N3b3JkIjp0cnVlLCJlbWFpbCI6dHJ1ZSwiX2lkIjp0cnVlfSwibW9kaWZ5Ijp7fSwicmVxdWlyZSI6e319LCJzdGF0ZU5hbWVzIjpbInJlcXVpcmUiLCJtb2RpZnkiLCJpbml0IiwiZGVmYXVsdCIsImlnbm9yZSJdfSwiZW1pdHRlciI6eyJkb21haW4iO//m51bGwsIl9ldmVudHMiOnt9LCJfZXZlbnRzQ291bnQiOjAsIl9tYXhMaXN0ZW5lcnMiOjB9fSwiaXNOZXciOmZhbHNlLCJfZG9jIjp7Il9fdiI6MCwicGFzc3dvcmQiOiIkMmEkMTAkdTAybWNnWHFjWVQvdE41MlkzZ2l3dVROd3ZMWW9ZTlFXejlUcThyaDIwR09IMlhHY3haZWUiLCJlbWFpbCI6Im1hZGFuLmRhbGUxQGdtYWlsLmNvbSIsIl9pZCI6IjU5MjEzYzYyYWM2ODZlMGMyNzI2MjgzMiJ9LCJfcHJlcyI6eyIkX19vcmlnaW5hbF9zYXZlIjpbbnVsbCxudWxsLG51bGxdLCIkX19vcmlnaW5hbF92YWxpZGF0ZSI6W251bGxdLCIkX19vcmlnaW5hbF9yZW1vdmUiOltudWxsXX0sIl9wb3N0cyI6eyIkX19vcmlnaW5hbF9zYXZlIjpbXSwiJF9fb3JpZ2luYWx//fdmFsaWRhdGUiOltdLCIkX19vcmlnaW5hbF9yZW1vdmUiOltdfSwiaWF0IjoxNDk1MzUwNzA5LCJleHAiOjE0OTUzNjA3ODl9.BkyB0LjKB4FIsCtnM5FcpcBLvKed_j7rCCxZddwiYnU



  // Set url for API group routes
  app.use('/api', apiRoutes);
};
