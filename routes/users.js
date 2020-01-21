var express = require('express');
var router = express.Router();
const path = require('path');
var user_controller = require('../controllers/userController');
//GET request for list of all users.
router.get('/', user_controller.user_list);


// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
//   //res.sendFile(path.join(__dirname+'/views/test.html'));
//   //res.render('test.html')
// });

module.exports = router;
