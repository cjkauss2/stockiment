const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const request = require('request');
const mysql = require('mysql');
const cron = require('node-cron');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: true
}));

// default route
app.get('/', function (req, res) {
   return res.send('Team Higher Us API')
});

// set port
app.listen(3000, function () {
   console.log('Node app is running on port 3000');
});

//connection configurations
var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'Stocks',
  port: '3306'
});

// connect to database
con.connect(function(err) {
  if(err){
    console.log(err);
    return;
  }
  console.log('Connection established');
});

// schedule tasks to be run on the server
// cron.schedule("* * * * *", function() {
//   console.log("running a task every minute");
// });

// Retrieve all stocks
app.get('/stocks', function (req, res) {
  var sql = 'SELECT * FROM Stock';
  con.query(sql, function (error, results, fields) {
    if (error) throw error;
      return res.send(results );
  });
});

// Retrieve daily prices for given stock
app.get('/daily', function (req, res) {
  var symbol = req.query.symbol;
  var interval = req.query.interval;
  if (!symbol || !interval) {
      return res.status(400).send('Please provide stock symbol and interval (6mo or 1mo)');
  }

  var d = new Date();
  if (interval == '6mo') {
    d.setDate(d.getDate() - 168);
  } else {
    d.setDate(d.getDate() - 28);
  }

  var sql = 'SELECT * FROM DailyPrice WHERE Symbol = ? AND Date > ?';
  con.query(sql, [symbol, d], function (error, results, fields) {
    if (error) throw error;
      return res.send(results);
  });
});

// Retrieve hourly prices for given stock
app.get('/hourly', function (req, res) {
  var symbol = req.query.symbol;
  var interval = req.query.interval;
  if (!symbol || !interval) {
      return res.status(400).send('Please provide stock symbol and interval (1wk or 1d)');
  }

  var d = new Date();
  if (interval == '1wk') {
    d.setDate(d.getDate() - 7);
  } else {
    d.setDate(d.getDate() - 1);
  }

  var sql = 'SELECT * FROM HourlyPrice WHERE Symbol = ? AND DateTime > ?';
  con.query(sql, [symbol, d], function (error, results, fields) {
    if (error) throw error;
      return res.send(results);
  });
});

app.post('/insertdaily', function(req, res){
  //var demo = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&apikey=demo'
  var symbol = req.query.symbol;
  if (!symbol) {
      return res.status(400).send('Please provide stock symbol');
  }

  var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + symbol + '&apikey=X5C49C68WA63PPB1';
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var obj = JSON.parse(body)
      var sql = 'INSERT IGNORE INTO DailyPrice (Symbol, Date, Open, High, Low, Close, Volume) Values ?';

      console.log(symbol + ' daily update');
      var rows = [];

      for (var date in obj['Time Series (Daily)']) {
        var prices = obj['Time Series (Daily)'][date];

        rows.push([symbol, date, prices['1. open'], prices['2. high'], prices['3. low'], prices['4. close'], prices['5. volume']]);
      }

      con.query(sql, [rows], function (error, results, fields) {
        if (error) throw error;
        console.log('Number of records inserted: ' + results.affectedRows)
        return res.send('Number of records inserted: ' + results.affectedRows);
      });
    }
  })
});

app.post('/inserthourly', function(req, res){
  //var demo = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=5min&apikey=demo'
  var symbol = req.query.symbol;
  if (!symbol) {
      return res.status(400).send('Please provide stock symbol');
  }

  var interval = '5min';
  var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=' + symbol + '&interval=' + interval + '&outputsize=full&apikey=X5C49C68WA63PPB1';
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var obj = JSON.parse(body)
      var sql = 'INSERT IGNORE INTO HourlyPrice (Symbol, DateTime, Open, High, Low, Close, Volume) Values ?';

      console.log(symbol + ' hourly update');
      var rows = [];

      for (var datetime in obj['Time Series (' + interval + ')']) {
        var prices = obj['Time Series (' + interval + ')'][datetime];

        rows.push([symbol, datetime, prices['1. open'], prices['2. high'], prices['3. low'], prices['4. close'], prices['5. volume']]);
      }

      con.query(sql, [rows], function (error, results, fields) {
        if (error) throw error;
        console.log('Number of records inserted: ' + results.affectedRows)
        return res.send('Number of records inserted: ' + results.affectedRows);
      });
    }
  })
});


//  Delete old hourly prices (older than 7 days ago)
app.delete('/deletehourly', function (req, res) {
  var d = new Date();
  d.setDate(d.getDate() - 7);

  con.query('DELETE FROM HourlyPrice WHERE DateTime < ?', [d], function (error, results, fields) {
    if (error) throw error;
    return res.send('Number of records deleted: ' + results.affectedRows);
  });
});



// Retrieve stocks with increasing price and sentiment
app.get('/trending', function (req, res) {
  var today = new Date().toISOString().split('T')[0];
  var yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday = yesterday.toISOString().split('T')[0];

  console.log(yesterday);

  var sql = '(SELECT * FROM DailyPrice d1 WHERE d1.Date = ?';
  con.query(sql, [today], function (error, results, fields) {
    if (error) throw error;
      return res.send(results );
  });
});


module.exports = app;
