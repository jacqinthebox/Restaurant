var Config = require('./config'),
    conf = new Config();

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
console.log(process.env.NODE_ENV);
console.log(process.env.DB);
//mongoose.connect('mongodb://localhost:27017/restaurant');
mongoose.connect('mongodb://localhost:27017/' + process.env.DB);


require('./app/routes.food')(app);
require('./app/routes.user')(app);


app.use(express.static(__dirname + '/public'));

app.set('port', process.env.PORT || 3001);
app.listen(app.get('port'));
console.log("the server is running on http://localhost:" + app.get('port'));
