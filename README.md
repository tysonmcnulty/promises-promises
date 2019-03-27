# promises-promises

## Getting started

1. `npm install`
1. Clone credentials files:
  ```
  cp secrets.js.example secrets.js
  cp player/public/token-init.js.example player/public/token-init.js
  ```
1. Get token: https://developer.spotify.com/documentation/web-playback-sdk/quick-start/
1. Update `ACCESS_TOKEN` in `player/public/token-init.js`
1. Start player:
  ```
  cd ~/workspace/promises-promises/player
  node app.js
  ```
1. Go to `http://localhost:3000`
1. Get Device ID from console (it should say "Ready with Device ID <device-id>")
1. `cp secrets.js.example secrets.js`
1. Update `ACCESS_TOKEN` and `DEVICE_ID` in `secrets.js`.

In REPL:
```
var wrapper = require('./spotify-thing-doer')
var muzak = require('./muzak');

wrapper.findTrack('Toxic', 'Britney').then(wrapper.play);
setTimeout(wrapper.pause, 5000);
```

## Code examples
```

// Search with object polling
var out;

wrapper.searchWithObjectPolling('Toxic', 'Britney', out);
// wait and poll your object yourself
wrapper.play(out.track);


// Search with callback
wrapper.searchWithCallback('Toxic', 'Britney', wrapper.play);

// Search with promises
var promise;
promise = wrapper.searchWithPromises('Toxic', 'Britney');
promise.then(wrapper.play);

// Search with async/await
async function searchWithAsyncAwait() {
  var track = await wrapper.searchWithPromises('Toxic', 'Britney');
  wrapper.play(track);
}

// Search with fibers (using synchronize)
var sync = require('synchronize');

sync.fiber(() => {
  var track = wrapper.searchWithFibers('Toxic', 'Britney');
  wrapper.play(track);
});
```
