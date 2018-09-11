const SpotifyWebApi = require('spotify-web-api-node');
const secrets = require('./secrets');
const muzak = require('./muzak');

const SEARCH_TIME = 45000;

const api = new SpotifyWebApi();
api.setAccessToken(secrets.ACCESS_TOKEN);

function findTracksForArtist(trackName, artistName) {
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

function searchSynchronously(trackName, artistName, out) {
  play(muzak.ipanema);

  setTimeout(() => {
    findTracksForArtist(trackName, artistName).then(results => {
      out.tracks = results
      pause();
    })
  }, SEARCH_TIME)
}

function searchWithCallback(trackName, artistName, callback) {
  play(muzak.callMeMaybe);

  setTimeout(() => {
    findTracksForArtist(trackName, artistName).then(results => {
      pause();
      callback(results);
    })
  }, SEARCH_TIME)
}

function searchWithPromises(trackName, artistName) {
  play(muzak.thereForYou);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      findTracksForArtist(trackName, artistName).then(results => {
        pause();
        resolve(results);
      })
    }, SEARCH_TIME)
  });
}

module.exports = {
  api,
  findTracksForArtist,
  play,
  pause,
  unpause,
  searchSynchronously,
  searchWithCallback,
  searchWithPromises
};
