var mongoose = require("mongoose");

var artistSchema = new mongoose.Schema({ 
    name: String,
    image: String,
    link: String,
    venue: String,
    dates: String
    // spotifyId: {type: String, unique: true, dropDups: true }
});

module.exports = mongoose.model("artist", artistSchema);

