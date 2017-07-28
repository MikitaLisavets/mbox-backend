var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var router = express.Router();

router.get('/menu', function(req, res) {
  res.json({
    payload: ['weather', 'time', 'work']
   })
});

router.get('/weather', function(req, res) {
  res.json({ test: 228 })
});

app.use('/api', router);

app.listen(port, function() {
  console.log('Node app is running on port', app.get('port'));
});

