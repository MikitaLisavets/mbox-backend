const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');
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
  request('https://pogoda.tut.by/', function (error, response, body) {
    const $ = cheerio.load(body);
    const t = $('#tab-normal td .temp-i');
    const temp = $(t[0]).text() + '|' + $(t[1]).text() + '| ' + $(t[2]).text() + '|' + $(t[3]).text()

    res.json({
      lineOne: '\u00E3',
      lineTwo: temp.replace(/°/g, '')
    });
  });
});

app.use('/api', router);

app.listen(port, function() {
  console.log('Node app is running on port', port);
});

