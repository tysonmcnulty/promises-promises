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
var cb = wrapper.play
wrapper.searchWithCallback('Toxic', 'Britney', cb);

// Search with promises
var promise;
promise = wrapper.searchWithPromises('Toxic', 'Britney')
promise.then(wrapper.play);

// Search with async/await;

// Search with FIBERS
var sync = require('synchronize');

sync.fiber(() => {
  var track = wrapper.searchWithFibers('Toxic', 'Britney');
  wrapper.play(track);
});
```
