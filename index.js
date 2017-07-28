var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var router = express.Router();

router.get('/menu', function(req, res) {
  var menus = ['time', 'weather', 'work'];
  res.json(Object.assign({}, menus, {length: menus.length}));
});

router.get('/time', function(req, res) {
  var date = new Date();
  res.json({
    lineOne: date.toString().slice(0, 16),
    lineTwo: date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
  })
});

router.get('/weather', function(req, res) {
  res.json({ lineOne: "very very long long my my text text" })
});

app.use('/api', router);

app.listen(port, function() {
  console.log('Node app is running on port', app.get('port'));
});

