console.log('This liri bot is working');

require("dotenv").config();

// calling API keys from keys.js file
var keys = require("./keys.js");

var request = require('request');
//installed moment package 
var moment = require('moment');
//installed node-spotify-api
var Spotify = require('node-spotify-api');
var fs = require('fs');

var input = process.argv;
var action = input[2];
var inputs = input[3];

switch (action) {
	case "concert-this":
        concert(inputs);
        break;

	case "spotify-this-song":
        spotify(inputs);
        break;

	case "movie-this":
        movie(inputs);
        break;

	case "do-what-it-says":
        doitanyway();
        break;
    
    default:
        console.log("I don't understand, ask Foogle-Bot");
};
/* Marks review */
// function concertThis(){
//     console.log("Concert this");
// }

// node liri.js concert-this '<Concert name here>'
function concert (inputs){
    var queryUrl = "https://rest.bandsintown.com/artists/" + inputs + "/events?app_id=codingbootcamp";
    // console.log("print something");
    request (queryUrl, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			let concertThis = JSON.parse(body)[0];
		  console.log("----------------------------------");
		  console.log(`Artist: ${inputs}\n Venue: ${concertThis.venue.name}\n Location: ${concertThis.venue.city} ${concertThis.venue.country}`);
		  console.log("Time"+ ": " + moment(body.datetime, 'YYYY-MM-DDh-m-s').format('MM/DD/YYYY'));
		  console.log("----------------------------------");
		} else {
		  console.log(error);
		}
	  });
};

// node liri.js spotify-this-song '<song name here>'
function spotify(inputs) {

	var spotify = new Spotify(keys.spotify);
		if (!inputs){
        	inputs = 'Stronger';
    	}
		spotify.search({ type: 'track', query: inputs }, function(err, data) {
			if (err){
	            console.log('STOP: Error occurred: ' + err);
	            return;
	        }
			var songInfo = data.tracks.items;
			console.log("----------------------------------")
	        console.log(` Artist(s): ${songInfo[0].artists[0].name}\n Song Name: ${songInfo[0].name}\n Preview Link: ${songInfo[0].preview_url}\n Album: ${songInfo[0].album.name}`);
			console.log("----------------------------------")
	});
}

// node liri.js movie-this '<movie name here>'
function movie(inputs) {

	var queryUrl = "http://www.omdbapi.com/?t=" + inputs + "&y=&plot=short&apikey=40e9cece";

	request(queryUrl, function(error, response, body) {
		if (!inputs){
        	inputs = 'Pretty Woman';
    	}
		if (!error && response.statusCode === 200) {
			let movieInfo = JSON.parse(body);
			console.log('----------------------------------');
			console.log(` Title: ${movieInfo.Title}\n Release Year: ${movieInfo.Year}\n IMDB Rating:${movieInfo.imdbRating}\n Rotten Tomatoes Rating: ${movieInfo.Ratings[1].Value}\n Country: ${movieInfo.Country}\n Language: ${movieInfo.Language}\n Plot: ${movieInfo.Plot}\n Actors: ${movieInfo.Actors}`);
			console.log('-----------------------------------');
		}
	});
};
// node liri.js do-what-it-says
function doitanyway() {
	fs.readFile('random.txt', "utf8", function(error, data){
		if (error) {
    		return console.log(error);
  		}
		// Then split it by commas 
		var dataArr = data.split(",");

		if (dataArr[0] === "spotify-this-song") {
			var songcheck = dataArr[1].slice(1, -1);
			spotify(songcheck);
		} else if (dataArr[0] === "concert-this") {
			var concertName = dataArr[1].slice(1, -1);
			concert(concertName);
		} else if(dataArr[0] === "movie-this") {
			var movie_name = dataArr[1].slice(1, -1);
			movie(movie_name);
		} 
  	});
};