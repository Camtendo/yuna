# yuna
An implementation of flvjs and node media server optimized for streaming rtmp video in OBS Studio

## Features
- Hosts an RTMP server and http server so you can push and view video from the same application
- Allows for reliable reconnection instead of using native plugins in OBS and XSplit
- Can be captured via browser plugins to allow using alerts/"low bandwidth or disconnect" scenes and gifs when RTMP video state changes

## TODO Features
- Server disconnect resiliency
- OBS Remote integration
- Configurable stream urls

## How to use
1. Clone repo
2. `npm install` at repo root
3. Create a `config.js` in repo root containing Twilio information (`config.twilio.allowSMS = false;` if you don't want to use Twilio)
4. `node server.js` in repo root
5. Navigate to configured port (default is localhost:8081)
6. Load url from step 5 in browser or browser source plugin in streaming software such as OBS/XSplit
7. On disconnect, the video will unmount and show whatever sources you have underneath. The instant video is available again, the video will remount.

### Example architecture
https://docs.google.com/presentation/d/1ZgS-EJLMgO5gSusIhb9GooRljtle5gZ1kck5yv0JCCI/edit?usp=sharing
