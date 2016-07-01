var express     = require("express"),
    app         = express(),
    request     = require('request'),
    cheerio     = require('cheerio');

var request = require('request'); // "Request" library

// var cookieParser = require('cookie-parser');

// var Artist = require("./models/artist");
// var Track = require("./models/track");

// mongoose.connect("mongodb://localhost/playground");

// SPOTIFY APP CREDENTIALS
// var client_id = '34a85c702fff409c88475a24dc7c85f8'; // Your client id
// var client_secret = '570a334f3534452db3cfeffcba5979df'; // Your secret
// var redirect_uri = 'http://spotifyplayground-justsayknarf.c9users.io/callback'; // Your redirect uri

// // credentials are optional
// var spotifyApi = new SpotifyWebApi({
//   clientId : client_id,
//   clientSecret : client_secret,
//   redirectUri : redirect_uri
// });


// configure Express
app.set('views', __dirname + '/views');
app.set("view engine", "ejs");


var stateKey = 'spotify_auth_state';

app.use(express.static(__dirname + '/public'));


//////////////////////////////////
////// ROUTES
//////////////////////////////////

// INDEX ROUTE
app.get("/", function(req, res){
    pullAndScrape(function(arts){
      console.log(arts);
      res.render("index", {artists: arts, username: ""});  
    });
});

// test
app.get("/test", function(req, res){
  console.log("begin testRequest");
    
    testRequest(function(bod){
      res.send(bod);
    })
    
  console.log("exit testReq");
});

app.get("/scraper", function(req, res){
  res.send("hello world!");
  
})

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Test Server Has Started!");
});


//////////////////////////////////
/// OTHER FUNCTIONS 
//////////////////////////////////


// scrape independentSF
var pullAndScrape = function(callback){
  var url = 'http://www.independentsf.com/';
  var links;
  var artistData = [];

  request({ uri: url, headers: { Host: 'www.independentsf.com' }}, function(err, resp, body){
    if(err) console.log(err);
    
    var $ = cheerio.load(body);

    var everything = $('div.tfly-venue-id-21');
    var count = $(everything).length;
    var numAdded = 0;
    console.log("FOUND " + count + " ARTISTS");
    
    // iterate through scraped artists
    $(everything).each(function(i, element){
      var dates = $(element).children('div.list-view-details').children('h2.dates').text();
      var imageLink = "http:" + $(element).children('a').children('img').attr('src');
      
      var name = $(element).children('a').children('img').attr('title');
      var artistName = $(element).children('a').children('img').attr('title');
      var newArtist = {name: artistName, image: imageLink, date: dates};
      
      if (artistData.indexOf(artistName) < 0)
        artistData.push(artistName);

      artistData[artistName] = newArtist;
    });
    
    callback(artistData);
    
  });
}

var testRequest = function(callback){
  var url = 'https://spotifyplayground-justsayknarf.c9users.io/scraper';
  var links;
  var artistData = [];
  console.log("scraping site...");
  request.get(url, function(err, resp, body){
    if(err) {
      console.log(err);
      callback(err);
    }
    else {
      console.log("successful scrape");
      var $ = cheerio.load(body);
    
      callback(body);
    }
  });
}

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

