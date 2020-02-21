//var path = require('path');
//var express = require('express');

//var app = express();
// // set the view engine to ejs
// app.set('view engine', 'ejs');
// // index page
// app.get('/', function(req, res) {
//     res.render('./src/js/index');
// });

const express = require('express');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();

// the __dirname is the current directory from where the script is running
app.use(express.static(__dirname));

//----------------------------------------
////   Development Serrver
// app.set('port', process.env.PORT || 8080);
// var server = app.listen(app.get('port'), function() {
//   console.log('listening on port ', server.address().port);
// });
//-----------------------------------------------

// send the user to index html page inspite of the url
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});
