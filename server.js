var Config = require('./config'),
    conf = new Config();
console.log(process.env.DB);
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

mongoose.connect(process.env.DB);

require('./app/routes.food')(app);
require('./app/routes.user')(app);


app.use(express.static(__dirname + '/public'));

app.set('port', process.env.PORT || 3001);
app.listen(app.get('port'));
console.log("the server is running on http://localhost:" + app.get('port') + ", with database: " + process.env.DB);
