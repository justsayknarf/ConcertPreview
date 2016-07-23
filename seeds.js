var monggose = require("mongoose");
var Artist = require("./models/artist");
var Track = require("./models/track");



var data = [
    {
        name: "Aqua",
        image: "https://i.imgur.com/IlH6IXB.jpg",
        venue: "Some random party.",
        dates: "Aug 1"
    },
    {
        name: "Smash Mouth",
        image: "https://i.imgur.com/r71shIE.jpg",
        venue: "Some free concert",
        dates: "Aug 2"
    },
    {
        name: "Backstreet Boys",
        image: "https://i.imgur.com/IpXOOkR.jpg",
        venue: "Reunion tour opening for Offspring",
        dates: "Aug 3"
    }
    
]



function seedDB(){
    // Remove all artists
    Artist.remove({}, function(err) {
        if (err){
            console.log(err);
        }
        
        console.log("removed artists!");
        
        // add campgrounds.
        data.forEach(function(seed){
            Artist.create(seed, function(err, artist){
                if(err){ 
                    console.log(err);
                } else {
                    console.log("added a artist");
                }
            });
        });
    
    })
};

module.exports = seedDB;

