const http = require('http');
const fs = require('fs');
const BigNumber = require('bignumber.js');
const precision = 1000000
BigNumber.config({ DECIMAL_PLACES: precision })
let total = new BigNumber(0)

//Settings
let postCount = 0;
const nodeCount = 4;
const host = '0.0.0.0';
const port = 4000;


const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    //console.log('POST');
    let body = '';
    req.on('data', data => {
      body += data;
      //console.log(`Partial body: ${body}`);
    });
    req.on('end', () => {
      if (body == "reset"){
        total = new BigNumber(0);
        postCount = 0;
        console.log("Reset! Source: "+req.connection.remoteAddress);
      }
      else if (postCount < nodeCount) {
        //console.log(`Partial body: ${body}`);
        let received_ = new BigNumber(body);
        //console.log(received_.toString());
        total = total.plus(received_);
        //console.log(total.toString());
        console.log("Got a POST from: "+req.connection.remoteAddress+" Current POST count: "+(postCount+1));
        postCount = postCount + 1;
      }
      else { console.log("Too many POSTs, ignoring") }
    });
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('post received');
  } else {
    console.log('GET');
    var text = total.toString();
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(text);
  }
});

server.listen(port, host);
console.log(`Listening at http://${host}:${port}`);
