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
    /*trans: {
      ffmpeg: '/ffmpeg/bin/ffmpeg.exe',
      tasks: [
        {
          app: 'live',
          hls: true,
          hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
          dash: true,
          dashFlags: '[f=dash:window_size=3:extra_window_size=5]'
        }
      ]
    }*/
  };
   
  var nms = new NodeMediaServer(config)
  nms.run();