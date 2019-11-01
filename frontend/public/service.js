const http = require('https');
const request = require('request');

const baseurl = 'localhost:3000';

function insert() {

}

function query() {
  request(baseurl + '/daily?symbol=AAPL&interval=1d', { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    console.log(body.url);
    console.log(body.explanation);
    console.log(res);
  });
}

function delete() {
}

function update() {

}
