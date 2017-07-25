var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.get('/', function(request, response) {
  response.sendStatus(200);
});

app.get('/weather', function(request, response) {
  response.json({"test": 1});
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


