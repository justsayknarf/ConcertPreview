var mongoose = require("mongoose");

var trackSchema = new mongoose.Schema({ 
    name: String, 
    link: String, 
    image: String,
    artistId: String,
    spotifyId: { type: String, unique: true, dropDups: true }
});

module.exports = mongoose.model("track", trackSchema);
