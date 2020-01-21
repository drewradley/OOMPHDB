const validator = require('express-validator');
var User = require('../models/users');
var Book = require('../models/book');
var async = require('async');
// // Display list of all User.
// exports.user_list = function(req, res) {
//     res.send('NOT IMPLEMENTED: User list');
// };
// Display list of all Authors.
exports.user_list = function(req, res, next) {

    User.find()
      .sort([['email', 'ascending']])
      .exec(function (err, list_users) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('user_list', { title: 'User List', user_list: list_users });
      });
  
  };
// Display detail page for a specific User.
// Display detail page for a specific User.
exports.user_detail = function(req, res, next) {

    async.parallel({
        genre: function(callback) {
            User.findById(req.params.id)
              .exec(callback);
        },

        user_books: function(callback) {
            Book.find({ 'genre': req.params.id })
              .exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.genre==null) { // No results.
            var err = new Error('User not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('user_detail', { title: 'User Detail', genre: results.genre, user_books: results.user_books } );
    });

};

// Display User create form on GET.
exports.user_create_get = function(req, res, next) {     
    res.render('user_form', { title: 'Create User' });
  };

//   exports.user_create_post = function(req, res) {
//     console.log("here")
//     res.send('NOT IMPLEMENTED: user_create_post');
// };
  // Handle User create on POST.
exports.user_create_post =  [
  
    // Validate that the name field is not empty.
    validator.body('name', 'User name required').isLength({ min: 1 }).trim(),
    
    // Sanitize (escape) the name field.
    validator.sanitizeBody('name').escape(),
  
    // Process request after validation and sanitization.
    (req, res, next) => {
      // Extract the validation errors from a request.
      const errors = validator.validationResult(req);
  
      // Create a genre object with escaped and trimmed data.
      var genre = new User(
        { name: req.body.name,
        email: req.body.email}
      );
      console.log('post')

      if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.
        res.render('user_form', { title: 'Create User', genre: genre, errors: errors.array()});
        return;
      }
      else {
        // Data from form is valid.
        // Check if User with same name already exists.
        User.findOne({ 'name': req.body.name })
          .exec( function(err, found_genre) {
             if (err) { return next(err); }
  
             if (found_genre) {
               // User exists, redirect to its detail page.
               res.redirect(found_genre.url);
             }
             else {
  
               genre.save(function (err) {
                 if (err) { return next(err); }
                 // User saved. Redirect to genre detail page.
                 res.redirect(genre.url);
               });
  
             }
  
           });
      }
    }
  ];

// Display User delete form on GET.
exports.user_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: User delete GET');
};

// Handle User delete on POST.
exports.user_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: User delete POST');
};

// Display User update form on GET.
exports.user_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: User update GET');
};

// Handle User update on POST.
exports.user_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: User update POST');
};
