require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
require("dotenv").config();

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");
const app = express();
    
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});
console.log(spotifyApi)


// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );
// Our routes go here:
app.get('/', (req, res) => {
    res.render('index');
});


app.get('/artist-search', (req, res) => {
    const { artist } = req.query;
    console.log()
    spotifyApi
        .searchArtists(artist)
        .then(data => {
            console.log('The received data from the API: ', data.body);
            res.render('artist-search-results', { artist: data.body.artists.items });
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res) => {
    const { artistId } = req.params;
    spotifyApi
        .getArtistAlbums(artistId)
        .then(data => {
            res.render('albums', { albums: data.body.items });
        })
        .catch(err => console.log("The error while searching artists occurred:", err))
})

app.get('/tracks/:albumsId', (req, res) => {
    const { albumId } = req.params
    spotifyApi
        .getAlbumTracks(albumId, { limit: 5, offset: 1 })
        .then((data) => {
            console.log('Album tracks', data.body.items);
            res.render('tracks', { tracks: data.body.items })
        })
        .catch(err => console.log('Something is off!', err))
});



app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
