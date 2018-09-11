const SpotifyWebApi = require('spotify-web-api-node');
const secrets = require('./secrets');

const api = new SpotifyWebApi();
api.setAccessToken(secrets.ACCESS_TOKEN);

function findTracksForArtist(trackName, artistName) {
  return api.search(trackName, ['track']).then((data) => {
    return data.body.tracks.items.find(item =>
      item.artists.some(artist => artist.name === artistName)
    );
  });
}

module.exports = {
  api,
  findTracksForArtist
};
