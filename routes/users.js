var express = require('express');
var router = express.Router();
const path = require('path');


// fs.readFile('D:/OOMPHDB/views/test.html', function (err, html) {
//   if (err) {
//       throw err; 
//   }       
//   http.createServer(function(request, response) {  
//       response.writeHeader(200, {"Content-Type": "text/html"});  
//       response.write(html);  
//       response.end();  
//   }).listen(3000);
// });
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  //res.sendFile(path.join(__dirname+'/views/test.html'));
  //res.render('test.html')
});

module.exports = router;
