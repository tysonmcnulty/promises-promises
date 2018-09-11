# promises-promises

## Notes

1. Get token: https://developer.spotify.com/documentation/web-playback-sdk/quick-start/
1. Update token in `player/public/player-init.js`
1. Start player:
  ```
  cd ~/workspace/promises-promises/player
  node app.js
  ```
1. Go to `http://localhost:3000`
1. Get device ID form console
1. Update token and device id in `secrets.js`.

In REPL:
```
var wrapper = require('./spotify-thing-doer')

wrapper.findTracksForArtist('track', 'artist').then(console.log)
wrapper.api.play({ device_id: 'ID', uris: ['spotify:track:5yZT3gqgZNBkTPX6G3XDTL'] })
```
