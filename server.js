var express = require('express');
var app = express();
var path = require('path');
const {NodeMediaServer} = require('node-media-server');

var port = process.env.PORT || 8081;

app.use(express.static(path.join(__dirname, 'public')));

console.log(`Starting Yuna on port ${port}...`);

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(port);

const config = {
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
   
  var nms = new NodeMediaServer(config)
  nms.run();