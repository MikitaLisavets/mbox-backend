const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const cheerio = require('cheerio');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var router = express.Router();

router.get('/menu', function(req, res) {
  var menus = ['time', 'weather', 'work'];
  res.json(Object.assign({}, menus, {length: menus.length}));
});

router.get('/time', function(req, res) {
  request('https://time.is/Belarus', function (error, response, body) {
    const $ = cheerio.load(body);
    const date = $('#dd').text().split(' ');
    const formatDate = date[0].slice(0, 3)
      + ' '
      + date[1].slice(0, 3)
      + ' '
      + date[2]
      + ' '
      + date[3].slice(0, -1);
    res.json({
      lineOne: formatDate,
      lineTwo: "Привет"
    })
  });
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

