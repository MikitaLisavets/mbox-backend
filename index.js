const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');
const cheerio = require('cheerio');
const moment = require('moment-timezone');
const cyrillicToTranslit = require('cyrillic-to-translit-js');
const translit = cyrillicToTranslit().transform;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var router = express.Router();

router.get('/menu', function(req, res) {
  var menus = ['time', 'weather', 'tweet'];
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
  const key = req.query.key;

  request('https://pogoda.tut.by/', function (error, response, body) {
    const $ = cheerio.load(body);
    const t = $('#tab-normal td .temp-i');
    const titles = $('#tab-normal .fcurrent-h');
    const desc = $('#tab-normal .fcurrent-descr');
    const formatT = $(t[0]).text() + ' | ' + $(t[1]).text() + ' | ' + $(t[2]).text() + ' | ' + $(t[3]).text()

    let formatTitles = '';

    $(titles).each(function(i, elem) {
      formatTitles += ' ' + getPeriodSymbol($(this).text()) + '  ';
    });

    switch(key) {
      case '1':
        res.json({
          lineOne: translit($(desc[0]).text()),
          lineTwo: $(t[0]).text().replace(/°/g, ' ') + translit($(titles[0]).text()),
        });
        break;
      case '2':
        res.json({
          lineOne: translit($(desc[1]).text()),
          lineTwo: $(t[1]).text().replace(/°/g, ' ') + translit($(titles[1]).text()),
        });
        break;
      case '3':
        res.json({
          lineOne: translit($(desc[2]).text()),
          lineTwo: $(t[2]).text().replace(/°/g, ' ') + translit($(titles[2]).text()),
        });
        break;
      case '4':
        res.json({
          lineOne: translit($(desc[3]).text()),
          lineTwo: $(t[3]).text().replace(/°/g, ' ') + translit($(titles[3]).text()),
        });
        break;
      default:
        res.json({
          lineOne: formatTitles,
          lineTwo: formatT.replace(/°/g, '')
        });
    }
  });

  function getPeriodSymbol(title) {
    switch(title) {
      case 'Завтра утром':
      case 'Утром': return 'M';
      case 'Завтра днем':
      case 'Днем': return 'A';
      case 'Завтра вечером':
      case 'Вечером': return 'E';
      case 'Завтра ночью':
      case 'Ночью': return 'N';
      default: return '*';
    }
  }
});

router.get('/tweet', function(req, res) {
  request('https://twitter.com/funnyrandom1?lang=en', function (error, response, body) {
    const $ = cheerio.load(body);
    const tweet = $('.stream-item:first-child .tweet-text').text();

    res.json({
      lineOne: tweet.slice(0, 15),
      lineTwo: tweet.slice(16)
    });
  });
});

app.use('/api', router);

app.listen(port, function() {
  console.log('Node app is running on port', port);
});

