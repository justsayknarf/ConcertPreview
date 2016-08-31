(function() {
    var app = angular.module('concertbite', [ ]);

    app.controller('ConcertsController', function($scope, $http) {
        
        $scope.artists = data;
        $scope.artistExtra = [];
        $scope.albums = [];
        $scope.playingAlbum = "";
        $scope.playing = false;
        $scope.loading = false;
        var audioObject = null;
    
        // GET from Concerts API
        // $http({
        //     method : "GET",
        //     url : "https://spotifyplayground-justsayknarf.c9users.io/api/artists"
        // }).then(function mySuccess(response) {
        //     $scope.contacts = response.data;
        // }, function myError(response) {
        //     $scope.contacts = response.statusText;
        // }).finally(function() {
        //     $scope.loading = false;            
        // });


        $scope.refreshArtists = function() {
            $http.post('/api/artists', $scope.formData)
                .success(function(data) {         
                    console.log(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        };

        $scope.loadExtra = function(index, name) {
            if ($scope.artistExtra[index] === 1) {
                $scope.artistExtra[index] = 0;
            } else {
                console.log("asdofjasdf");
                $http.get('https://api.spotify.com/v1/search', 
                    {
                        params: {
                            q: name,
                            type: 'album',
                            limit: 6
                        }
                    })
                    .success( function(response) {
                        console.log("success");
                        console.log(response);
                        // console.log(response.albums.items);
                        $scope.albums[index] = response.albums.items;
                    })
                    .error(function(data) {
                        console.log("Error: " + data);
                    });

                $http.get('https://api.spotify.com/v1/search', 
                    {
                        params: {
                            q: name,
                            type: 'artist',
                            limit: 1
                        }
                    })
                    .success( function(response) {
                        console.log("success");
                        console.log(response);
                        if (response.artists.items.length === 1) {
                            $scope.artists[index].spotifyArtist = response.artists.items[0]; 

                            fetchSimilar($scope.artists[index].spotifyArtist.id, function(resp) {
                                $scope.artists[index].relatedArtists = resp.artists;
                            })   
                        }
                    })
                    .error(function(data) {
                        console.log("Error: " + data);
                    });    
                    
                

                $scope.artistExtra[index] = 1;
            }
        }

        $scope.playSong = function(album) {
            if ($scope.playing === true) {
                audioObject.pause();
                $scope.playing = false;
            } else {
                if (audioObject) {
                    audioObject.pause();
                    $scope.playing = false;
                }
                fetchTracks(album.id, function (data) {
                    audioObject = new Audio(data.tracks.items[0].preview_url);
                    audioObject.play();
                    $scope.playing = true;
                    $scope.playingAlbum = album;

                    audioObject.addEventListener('ended', function () {
                        console.log("ended");
                        $scope.playing = false;
                        $scope.playingAlbum = [];
                    });
                    audioObject.addEventListener('pause', function () {
                        console.log("pause");
                        $scope.playing = false;
                    });
                });
            }
        }

        $scope.loadSimilar = function(similarArtist) {

        }

        var fetchTracks = function (albumId, callback) {
            $http.get('https://api.spotify.com/v1/albums/' + albumId)
            .success(function(response) {
                callback(response);
            });
        };

        var fetchSimilar = function (artistId, callback) {
            $http.get('https://api.spotify.com/v1/artists/' + artistId + "/related-artists" )
            .success(function(response) {
                callback(response);
            });
        };
    });

    // Directive to handle showing and hiding loading text div
    app.directive('loading', function () {
      return {
        restrict: 'E',
        replace: true,
        template: '<div class="loading">Pulling out the rolodex...</div>',
        link: function (scope, element, attr) {
              scope.$watch('loading', function (val) {
                  if (val)
                      $(element).show();
                  else
                      $(element).hide();
              });
        }
      }
    });




    var data = [
    {"_id":"57b37922ffcd4a85f93af806", 
 "artistUrl":"http://www.apeconcerts.com/events/twenty-one-pilots/", 
 "venue":"SAP Center", 
 "dates":"02102017", 
 "image":"http://www.apeconcerts.com/wp-content/uploads/2016/02/twentyonepilots1024-353x192.jpg", 
 "name":"twenty one pilots", 
 "__v":0}, 
  
  
 {"_id":"57b37922ffcd4a85f93af807", 
 "artistUrl":"http://www.apeconcerts.com/events/twenty-one-pilots-2/", 
 "venue":"Golden 1 Center", 
 "dates":"02112017", 
 "image":"http://www.apeconcerts.com/wp-content/uploads/2016/02/twentyonepilots1024-353x192.jpg", 
 "name":"twenty one pilots", 
 "__v":0}, 
  
 {"_id":"57b37922ffcd4a85f93af808", 
 "artistUrl":"http://www.apeconcerts.com/events/passenger/", 
 "venue":"Fox Theater", 
 "dates":"03302017", 
 "image":"http://www.apeconcerts.com/wp-content/uploads/2016/07/Passenger_1024-353x192.jpg", 
 "name":"Passenger", 
 "__v":0}, 
  
 {"_id":"57b37921ffcd4a85f93af74f", 
 "artistUrl":"http://www.apeconcerts.com/events/rebelution/", 
 "venue":"Greek Theatre", 
 "dates":"08162016", 
 "image":"http://www.apeconcerts.com/wp-content/uploads/2016/04/Rebelution_1024-353x192.jpg", 
 "name":"Rebelution", 
 "__v":0}, 
  
 {"_id":"57b37921ffcd4a85f93af751", 
 "artistUrl":"http://www.apeconcerts.com/events/the-fixx/", 
 "venue":"The Independent", 
 "dates":"08172016", 
 "image":"http://www.apeconcerts.com/wp-content/uploads/2016/05/TheFixx_1024-353x192.jpg", 
 "name":"The Fixx", 
 "__v":0}, 
  
 {"_id":"57b37921ffcd4a85f93af750", 
 "artistUrl":"http://www.apeconcerts.com/events/ben-harper-the-innocent-criminals/", 
 "venue":"Fox Theater", 
 "dates":"08172016", 
 "image":"http://www.apeconcerts.com/wp-content/uploads/tm_event/ben-harper-the-innocent-criminals-353x192.jpg", 
 "name":"Ben Harper & The Innocent Criminals", 
 "__v":0}
    ];

        // spotifyId: {type: String, unique: true, dropDups: true }
})();


