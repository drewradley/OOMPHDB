var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UsersSchema = new Schema(
  {
    name: {type: String, required: true, max: 100, min: 3},
    email: {type: String, required: true, max: 100, min: 3},
  }
);

// Virtual for book's URL
UsersSchema
.virtual('url')
.get(function () {
  return '/users/' + this._id;
});

//Export model
module.exports = mongoose.model('users', UsersSchema);