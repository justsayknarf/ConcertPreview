
// find template and compile it
var templateSource = document.getElementById('results-template').innerHTML,
    template = Handlebars.compile(templateSource),
    resultsPlaceholder = $("#results"),
    playingCssClass = 'playing',
    audioObject = null;

var fetchTracks = function (albumId, callback) {
    $.ajax({
        url: 'https://api.spotify.com/v1/albums/' + albumId,
        success: function (response) {
            callback(response);
        }
    });
};

var searchAlbums = function (query) {
    $.ajax({
        url: 'https://api.spotify.com/v1/search',
        data: {
            q: query,
            type: 'album',
            limit: 6
        },
        success: function (response) {
            resultsPlaceholder.html(template(response));
            resultsPlaceholder.addClass("resultsLayer");
            
            $("#closelink").on('click', function(e){
              resultsPlaceholder.html("");
              resultsPlaceholder.removeClass("resultsLayer");
            });
        }
    });
};


var findGenre = function (query) {
    $.ajax({
        url: 'https://api.spotify.com/v1/search',
        data: {
            q: query,
            type: 'artist',
            limit: 1
        },
        success: function (response) {
            var artistName = query.trim();
            // console.log(artistName);
            console.log(response);
            // var genres = response.genres.join(", ");
            // return genres;
            // $('#' + artistName).find(".genre").text("Genre: " + genres);
            
        }
    });
};


results.addEventListener('click', function (e) {
    var target = e.target;
    if (target !== null && target.classList.contains('cover')) {
        if (target.classList.contains(playingCssClass)) {
            audioObject.pause();
        } else {
            if (audioObject) {
                audioObject.pause();
            }
            fetchTracks(target.getAttribute('data-album-id'), function (data) {
                audioObject = new Audio(data.tracks.items[0].preview_url);
                audioObject.play();
                target.classList.add(playingCssClass);
                audioObject.addEventListener('ended', function () {
                    target.classList.remove(playingCssClass);
                });
                audioObject.addEventListener('pause', function () {
                    target.classList.remove(playingCssClass);
                });
            });
        }
    }
});

// document.getElementsByClassName('search-form').addEventListener('submit', function (e) {
//     e.preventDefault();
//     console.log(document.getElementById('name').innerHTML)
//     searchAlbums(document.getElementById('name').innerHTML);
// }, false);


$("#artist-list").on('click', ".artist > .nameContainer", function(e) {
	// console.log($(this).children('span#artistName').text());
	searchAlbums($(this).find('span#artistName').text());
});


$( ".artist" ).each(function( index ) {
    var name = $(this).find('span#artistName');
    var genresString = findGenre(name);
    console.log(genresString);
    
    $( this ).find("div.genre").text("Genre: " + genresString);
});
