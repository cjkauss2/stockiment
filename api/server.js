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

var currentHourly = 0;
// Schedule insert hourly price tasks to be run on the server
// We only have 500 api calls a day, so we have to limit how often we insert data
// Update hourly prices every minute from 10:00 to 16:00 US/Eastern
cron.schedule("*/1 9-15 * * *", function() {
  con.query('SELECT * FROM Stock', function (error, results, fields) {
    if (error) {
      console.log(error);
    } else if (currentHourly >= results.length) {
      currentHourly = 0;
    }

    request({
      url: 'http://localhost:3000/inserthourly?symbol=' + results[currentHourly].Symbol,
      method: "POST",
      json: true,
    });

    currentHourly++;
  });
});

var currentDaily = 0;
// Schedule insert daily price tasks to be run on the server
// Update daily price every 15 seconds from 17:00 to 17:10 US/Eastern (Up to 40 stocks)
cron.schedule("*/15 0-10 16 * * *", function() {
  con.query('SELECT * FROM Stock', function (error, results, fields) {
    if (error) {
      console.log(error);
    } else if (currentDaily >= results.length) {
      currentDaily = 0;
    }

    request({
      url: 'http://localhost:3000/insertdaily?symbol=' + results[currentDaily].Symbol,
      method: "POST",
      json: true,
    });

    currentDaily++;
  });
});


// Schedule delete hourly price task to be run on the server
// Delete old hourly prices everyday at 18:00 US/Eastern
cron.schedule("0 17 * * *", function() {
  request({
    url: 'http://localhost:3000/deletehourly',
    method: "DELETE",
    json: true,
  });
});



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
  console.log(symbol);
  console.log(interval);
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
        console.log(symbol + ' daily update. Number of records inserted: ' + results.affectedRows)
        return res.send(symbol + ' daily update. Number of records inserted: ' + results.affectedRows);
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

      var rows = [];

      for (var datetime in obj['Time Series (' + interval + ')']) {
        var prices = obj['Time Series (' + interval + ')'][datetime];

        rows.push([symbol, datetime, prices['1. open'], prices['2. high'], prices['3. low'], prices['4. close'], prices['5. volume']]);
      }

      con.query(sql, [rows], function (error, results, fields) {
        if (error) throw error;
        console.log(symbol + ' hourly update. Number of records inserted: ' + results.affectedRows)
        return res.send(symbol + ' hourly update. Number of records inserted: ' + results.affectedRows);
      });
    }
  })
});

app.post('/updatesentiment', function(req, res){

  var sql = 'INSERT INTO HourlyPrice\
              (Symbol, DateTime, Sentiment)\
          VALUES\
              (?, ?, ?)\
          ON DUPLICATE KEY UPDATE\
              Sentiment = ?'

  con.query(sql, ['AAPL', '2019-11-01 14:00:00', 0.9, 0.9], function (error, results, fields) {
    if (error) throw error;
      return res.send(results );
  });
});


//  Delete old hourly prices (older than 10 days ago)
app.delete('/deletehourly', function (req, res) {
  var d = new Date();
  d.setDate(d.getDate() - 10);

  con.query('DELETE FROM HourlyPrice WHERE DateTime < ?', [d], function (error, results, fields) {
    if (error) throw error;
    console.log('Deleted old hourly prices. Number of records deleted: ' + results.affectedRows);
    return res.send('Deleted old hourly prices. Number of records deleted: ' + results.affectedRows);
  });
});



// Retrieve stocks with increasing price and sentiment
// app.get('/trending', function (req, res) {
//   var sql = 'SELECT s1.StockName, d1.Symbol, d1.Close - d2.Close as PriceChange, d1.Sentiment - d2.Sentiment as SentimentChange\
//             FROM Stock s1 INNER JOIN
// (DailyPrice d1 INNER JOIN DailyPrice d2 ON d1.Date = DATE_ADD(d2.Date, INTERVAL 1 DAY) AND d1.Symbol = d2.Symbol) ON d1.Symbol = s1.Symbol\
//             WHERE d1.date = curdate() AND d1.Close > d2.Close AND d1.Sentiment > d2.Sentiment'
//   con.query(sql, function (error, results, fields) {
//     if (error) throw error;
//       return res.send(results );
//   });
// });


module.exports = app;
