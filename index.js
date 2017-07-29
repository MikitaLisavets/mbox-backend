const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const cheerio = require('cheerio');
const moment = require('moment-timezone');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var router = express.Router();

router.get('/menu', function(req, res) {
  var menus = ['time', 'weather', 'work'];
  res.json(Object.assign({}, menus, {length: menus.length}));
});

router.get('/time', function(req, res) {
  const date = moment().tz("Europe/Minsk")

  res.json({
    lineOne: date.format('ddd') + ' ' + date.format("MMM/DD/YYYY"),
    lineTwo: date.format('HH:mm:ss')
  })
});

router.get('/weather', function(req, res) {
  request('http://www.google.com', function (error, response, body) {
    res.send(body);
  });
});

app.use('/api', router);

app.listen(port, function() {
  console.log('Node app is running on port', port);
});

