var express     = require("express"),
    app         = express(),
    request     = require('request'),
    mongoose    = require('mongoose'),
    moment      = require('moment'),
    cheerio     = require('cheerio');

var seedDB      = require("./seeds.js");

var request = require('request'); // "Request" library

// var cookieParser = require('cookie-parser');

var Artist = require("./models/artist");
var Track = require("./models/track");

mongoose.connect("mongodb://localhost/playground");

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


// Seed the Database
// seedDB();    


//////////////////////////////////
////// ROUTES
//////////////////////////////////

// INDEX ROUTE
app.get("/", function(req, res){
    // Artist.find().sort('dates').exec(function(err, allArtists){
    //     if(err){
    //         console.log(err);
    //     } else {
    //         console.log(allArtists);
    //         res.render("index", {artists: allArtists, username: ""});
    //     }
    // });

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
  var url = 'http://www.apeconcerts.com/';
  var links;
  var artistData = [];

  request(url, function(err, resp, body){
    if(err) console.log(err);
    
    var $ = cheerio.load(body);

    var everything = $('div.content-information');
    var count = $(everything).length;
    var numAdded = 0;
    console.log("FOUND " + count + " ARTISTS");
    
    // iterate through scraped artists
    $(everything).each(function(i, element){
      var dates = $(element).find('div.date-show').attr("content");
      // dates = moment(dates, "MMMMDDYYYY").format("MMDDYYYY");
      
      var imageLink = "http:" + $(element).find("div > a > img.img-responsive").attr('src');
      
      var name = $(element).find("div.entry").find("h2.show-title").text();
      var openers = $(element).find("div.entry").find("h3.support").text();
      var artistName = $(element).find("div.entry").find("h2.show-title").text();
      var venue = $(element).find("div.entry > div > span").text();
      var newArtist = {name: artistName, image: imageLink, dates: dates, venue: venue};
      
      var newArtistDbEntry = new Artist({name: artistName, image: imageLink, dates: dates, venue: venue});
      
      
      
      if (artistData.indexOf(artistName) < 0) {
        
        Artist.create(newArtistDbEntry, function(err, createdArtist){
           if (err){
                console.log("SOMETHING WENT WRONG: " + err);
              } else {
                console.log("saved artist to db: " + createdArtist.name + createdArtist.dates );
              }
        })
      }
      
      artistData.push(newArtistDbEntry); 

    });
    
    callback(artistData);
    
  });
}

var testRequest = function(callback){
  var url2 = 'https://www.textise.net/showText.aspx?strURL=independentsf.com';
  var url3 = 'http://www.apeconcerts.com/'; 
  var url = 'http://theindependentsf.com/'
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
      console.log(body);
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

