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
  request('https://www.timeanddate.com/weather/belarus/minsk', function (error, response, body) {
    const $ = cheerio.load(body);
    const icons = $('#wt-48 tbody tr:nth-child(1) td');
    const t = $('#wt-48 tbody tr:nth-child(2) td');

    res.json({
      lineOne: "test",
      lineTwo: $(t[0]).text() + ' | ' + $(t[1]).text() + ' | ' + $(t[2]).text()
    });
  });
});

app.use('/api', router);

app.listen(port, function() {
  console.log('Node app is running on port', port);
});

