

var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
// var database = require('./database.js');
var mongoose = require('mongoose');


var app = express();

// var COMMENTS_FILE = path.join(__dirname, 'comments.json');

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



// mongoose.connect('mongodb://localhost/xmasdraw');


app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});