const SpotifyWebApi = require('spotify-web-api-node');
const sync = require('synchronize_f2');
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

function searchWithObjectPolling(trackName, artistName, out) {
  play(muzak.ipanema);

  setTimeout(() => {
    findTrack(trackName, artistName).then(results => {
      out.tracks = results
      done = true
      pause();
    })
  }, SEARCH_TIME)
}

var doSearch = (trackName, artistName, cb) => {
  setTimeout(() => {
    findTrack(trackName, artistName).then(results => {
      pause();
      cb(null, results)
    })
  }, SEARCH_TIME)
};

function searchWithFibers(trackName, artistName) {
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

async function createOneTrackSpotifyPlayer({ trackName, artistName, config = secrets }) {
  const internalApi = new SpotifyWebApi();
  internalApi.setAccessToken(config.ACCESS_TOKEN);

  const player = {
    api: internalApi,
    config,
    track: await internalApi.search(trackName, ['track']).then((data) => {
      return data.body.tracks.items.find(item => (
          item.artists.some(artist => (
              artist.name.toLowerCase().includes(artistName.toLowerCase())
          ))
      ));
    })
  };

  function start() {
    return this.api.play({
      device_id: this.config.DEVICE_ID,
      uris: [this.track.uri]
    })
  }
  player.start = start.bind(player);

  function stop() {
    return this.api.pause({
      device_id: this.config.DEVICE_ID
    })
  }
  player.stop = stop.bind(player);

  return player;
}

module.exports = {
  findTrack,
  play,
  pause,
  unpause,
  searchWithObjectPolling,
  searchWithFibers,
  searchWithCallback,
  searchWithPromises,
  createOneTrackSpotifyPlayer
};
