var express = require('express');
var app = express();
var path = require('path');
const {NodeMediaServer} = require('node-media-server');
var twilio = require('twilio');

var config = require('./config');
console.log(config);

var port = process.env.PORT || 8081;
var twilioClient = new twilio(config.twilio.restSID, config.twilio.authToken);

app.use(express.static(path.join(__dirname, 'public')));

console.log(`Starting Yuna on port ${port}...`);

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/notify-disconnect', function(req, res) {
  console.log('DISCONNECT fired');

  if (config.twilio.allowSMS) {
    twilioClient.messages.create({
      body: 'Disconnected from RTMP',
      to: config.twilio.destinationPhone,  // Text this number
      from: config.twilio.sourcePhone // From a valid Twilio number
    }).then((message) => {
      console.log(message.sid);
      res.sendStatus(200);
    });
  }
});

app.listen(port);

const rtmpConfig = {
    logType: 2,

    rtmp: {
      port: 1935,
      chunk_size: 60000,
      gop_cache: true,
      ping: 60,
      ping_timeout: 30
    },
    http: {
      port: 8000,
      mediaroot: './media',
      allow_origin: '*'
    },
  };
   
  var nms = new NodeMediaServer(rtmpConfig)
  nms.run();