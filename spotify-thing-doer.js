const SpotifyWebApi = require('spotify-web-api-node');
const sync = require('synchronize');
const secrets = require('./secrets');
const muzak = require('./muzak');

const SEARCH_TIME = 15000;

const api = new SpotifyWebApi();
api.setAccessToken(secrets.ACCESS_TOKEN);

function findTrack(trackName, artistName) {
  return api.search(trackName, ['track']).then((data) => {
    return data.body.tracks.items.find(item => (
      item.artists.some(artist => (
        artist.name.toLowerCase().includes(artistName.toLowerCase())
      ))
    ));
  });
}

function play(track) {
  return api.play({
    device_id: secrets.DEVICE_ID,
    uris: [track.uri]
  })
}

function unpause() {
  return api.play({
    device_id: secrets.DEVICE_ID,
  })
}

function pause() {
  return api.pause({
    device_id: secrets.DEVICE_ID
  })
}

function wait(ms) {
  var start = Date.now();
  var now = start;
  while (now - start < ms) {
    now = Date.now();
  }
}

function searchSync(trackName, artistName, out) {
  var done = false;
  play(muzak.ipanema);

  setTimeout(() => {
    findTrack(trackName, artistName).then(results => {
      out.tracks = results
      done = true
      pause();
    })
  }, SEARCH_TIME)

  wait(1000)
  wait(1000)
  wait(1000)

  return out
}

var doSearch = (trackName, artistName, cb) => {
  setTimeout(() => {
    findTrack(trackName, artistName).then(results => {
      pause();
      cb(null, results)
    })
  }, SEARCH_TIME)
}

function searchVerySync(trackName, artistName) {
  play(muzak.ipanema);
  var track = sync.await(doSearch(trackName, artistName, sync.defer()));
  pause();

  return track;
}

function searchWithCallback(trackName, artistName, callback) {
  play(muzak.callMeMaybe);

  setTimeout(() => {
    findTrack(trackName, artistName).then(results => {
      pause();
      callback(results);
    })
  }, SEARCH_TIME)
}

function searchWithPromises(trackName, artistName) {
  play(muzak.thereForYou);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      findTrack(trackName, artistName).then(results => {
        pause();
        resolve(results);
      })
    }, SEARCH_TIME)
  });
}

module.exports = {
  api,
  findTrack,
  play,
  pause,
  unpause,
  searchSync,
  searchVerySync,
  searchWithCallback,
  searchWithPromises
};
