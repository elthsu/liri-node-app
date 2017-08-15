

var fs = require("fs");
var keys = require("./keys.js");
var request = require("request");
var inquirer = require('inquirer');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');

var selection;

function menu(){

inquirer.prompt([

	{
    type: "list",
    name: "doingWhat",
    message: "What would you like to do?",
    choices: ["Show my tweets!", "Spotify a song!", "Look up a movie", 
    		"Feeling Lucky (something random will happen!)", "Quit"]
  }

]).then(function (answer) {

	selection = answer.doingWhat;

    switch (selection) {

 		case 'Show my tweets!':
 		showTweet();
 		break;

 		case 'Spotify a song!':
 		spotifySong();
 		break;

 		case 'Look up a movie':
 		movieInfo();
 		break;

 		case 'Feeling Lucky (something random will happen!)':
 		randomThing();
 		break;

 		case 'Quit':
 		console.log("\n");
 		console.log("See you next time!\n");
 		fs.appendFile("log.txt", "\nquit\n", function(err) {
    		if (err) {
      			return console.log(err);
    		}
    	})
 		process.exit;
 		break;

	}
});

}



function showTweet (){

	console.log("You chose: " + selection);
	fs.appendFile("log.txt", "You chose: " + selection + "\n", function(err) {
    	if (err) {
      		return console.log(err);
    	}
    })

	var client = new Twitter({
	  	consumer_key: keys.twitterKeys.consumer_key,
	  	consumer_secret: keys.twitterKeys.consumer_secret,
	  	access_token_key: keys.twitterKeys.access_token_key,
	 	access_token_secret: keys.twitterKeys.access_token_secret
	});

	var params = {screen_name: 'ClarksPotato'};
		client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  	
	  		if (!error) {

	  				console.log("\nLatest Tweets for " + tweets[0].user.screen_name);
	  				console.log("\n");

	  				fs.appendFile("log.txt", "\nLatest Tweets for " 
	  						+ tweets[0].user.screen_name + "\n", function(err) {
				    	if (err) {
				      		return console.log(err);
				    	}
    				})

	  			for (var i = 0; i < tweets.length && i < 20; i++) {
	  				
	  				console.log("Tweet # " + (i+1));
	  				console.log((tweets[i].created_at).slice(0, 19) + (tweets[i].created_at).slice(25, 30));
	  				console.log(tweets[i].text);

	  				fs.appendFile("log.txt", "\nTweet # " + (i+1) 
	  						+ "\n" + (tweets[i].created_at).slice(0, 19) + (tweets[i].created_at).slice(25, 30)
	  						+ "\n" + tweets[i].text, function(err) {
				    			if (err) {
				      				return console.log(err);
				    			}
    				})
	  				

	  			}
	    		
	    	console.log("\n");
	    	fs.appendFile("log.txt", "\n", function(err) {
				    			if (err) {
				      				return console.log(err);
				    			}
    		})
	  	
	  	}

	  	menu();
	});

}

function spotifySong (){

	console.log("You chose: " + selection);

	var spotify = new Spotify({
	  	id: keys.spotifyKeys.id,
	  	secret: keys.spotifyKeys.secret
	});

	inquirer.prompt([

	{

		type: "input",
	    name: "songName",
	    message: "What song would you like to spotify?"
	}

		]).then(function(answer){

			selection = answer.songName;

			if (selection === ""){


				selection = "The Sign";
				spotify.search({ type: 'track', query: selection}, function(err, data) {
	  				if (err) {
	    				return console.log('Error occurred: ' + err);
	  				}


	  			
	  			console.log("\nNo data entered. So you need to see the sign.")
	  			console.log("\nArtist: " + data.tracks.items[5].artists[0].name);
	  			console.log("Song Name: " + data.tracks.items[5].name);
	  			console.log("Preview Link: " + data.tracks.items[5].preview_url);
	  			console.log("Album Name: " + data.tracks.items[5].album.name);
	  			console.log("\n");


	  			fs.appendFile("log.txt", "\nNo data entered. So you need to see the sign." 
	  						+ "\nArtist: " + data.tracks.items[5].artists[0].name
	  						+ "\nSong Name: " + data.tracks.items[5].name
	  						+ "\nPreview Link: " + data.tracks.items[5].preview_url
	  						+ "\nAlbum Name: " + data.tracks.items[5].album.name, function(err) {
				    			if (err) {
				      				return console.log(err);
				    			}
    			})



	  			menu();


				})

			}

			else {


				spotify.search({ type: 'track', query: selection }, function(err, data) {
	  				if (err) {
	    				return console.log('Error occurred: ' + err);
	  				}


	  			console.log("\nYou've searched for: " + selection);
	  			console.log("\nArtist: " + data.tracks.items[0].artists[0].name);
	  			console.log("Song Name: " + data.tracks.items[0].name);
	  			console.log("Preview Link: " + data.tracks.items[0].preview_url);
	  			console.log("Album Name: " + data.tracks.items[0].album.name);
	  			console.log("\n");


	  			fs.appendFile("log.txt", "\nYou've searched for: " + selection 
	  						+ "\nArtist: " + data.tracks.items[5].artists[0].name
	  						+ "\nSong Name: " + data.tracks.items[5].name
	  						+ "\nPreview Link: " + data.tracks.items[5].preview_url
	  						+ "\nAlbum Name: " + data.tracks.items[5].album.name, function(err) {
				    			if (err) {
				      				return console.log(err);
				    			}
    			})
	  			menu();


				})
			}
	
	 
	
	});

}

function movieInfo (){

	console.log("You chose: " + selection);

	inquirer.prompt([

	{

		type: "input",
	    name: "movieName",
	    message: "What movie would you like to research?"
	}

		]).then( function (answer){

			selection = answer.movieName;

			if (selection === ""){

				selection = "Mr. Nobody";

				var queryUrl = "http://www.omdbapi.com/?t=" + selection + "&y=&plot=short&apikey=40e9cece";


				request(queryUrl, function(error, response, body) {

				  // If the request is successful
					if (!error && response.statusCode === 200) {
	
						console.log("\nTitle: " + JSON.parse(body).Title);
						console.log("\nRelease Year: " + JSON.parse(body).Year);
						console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
						console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
						console.log("Country Produced: " + JSON.parse(body).Country);
						console.log("Language: " + JSON.parse(body).Language);
						console.log("\nPlot: " + JSON.parse(body).Plot);
						console.log("Actors: " + JSON.parse(body).Actors);
						console.log("\n");


	  					fs.appendFile("log.txt", "\nTitle: " + JSON.parse(body).Title 
	  						+ "\nRelease Year: " + JSON.parse(body).Year 
	  						+ "\nIMDB Rating: " + JSON.parse(body).Ratings[0].Value 
	  						+ "\nRotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value
	  						+ "\nCountry Produced: " + JSON.parse(body).Country
	  						+ "\nLanguage: " + JSON.parse(body).Language
	  						+ "\nPlot: " + JSON.parse(body).Plot 
	  						+ "\nActors: " + JSON.parse(body).Actors, function(err) {
				    			if (err) {
				      				return console.log(err);
				    			}
    					})


			    		menu();
			    
	  				}

				});
			}

			else {

				var queryUrl = "http://www.omdbapi.com/?t=" + selection + "&y=&plot=short&apikey=40e9cece";


				request(queryUrl, function(error, response, body) {

				  // If the request is successful
					if (!error && response.statusCode === 200) {
	
						console.log("\nTitle: " + JSON.parse(body).Title);
						console.log("\nRelease Year: " + JSON.parse(body).Year);
						console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
						console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
						console.log("Country Produced: " + JSON.parse(body).Country);
						console.log("Language: " + JSON.parse(body).Language);
						console.log("\nPlot: " + JSON.parse(body).Plot);
						console.log("Actors: " + JSON.parse(body).Actors);
						console.log("\n");

						fs.appendFile("log.txt", "\nTitle: " + JSON.parse(body).Title 
	  						+ "\nRelease Year: " + JSON.parse(body).Year 
	  						+ "\nIMDB Rating: " + JSON.parse(body).Ratings[0].Value 
	  						+ "\nRotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value
	  						+ "\nCountry Produced: " + JSON.parse(body).Country
	  						+ "\nLanguage: " + JSON.parse(body).Language
	  						+ "\nPlot: " + JSON.parse(body).Plot 
	  						+ "\nActors: " + JSON.parse(body).Actors, function(err) {
				    			if (err) {
				      				return console.log(err);
				    			}
    					})

			    		menu();
			    
	  				}

				});


			}

		
	})

}


function randomThing (){

	console.log("You chose: " + selection);

	fs.readFile("random.txt", "utf8", function(err, file) {
    	if (err) {
      		return console.log(err);
    	}

    	var spotify = new Spotify({
	  	id: keys.spotifyKeys.id,
	  	secret: keys.spotifyKeys.secret
		});

		spotify.search({ type: 'track', query: file}, function(err, data) {
	  		if (err) {
	    		return console.log('Error occurred: ' + err);
	  		}
	
	  		console.log("\nYou've searched for: " + file);
	  		console.log("\nArtist: " + data.tracks.items[5].artists[0].name);
	  		console.log("Song Name: " + data.tracks.items[5].name);
	  		console.log("Preview Link: " + data.tracks.items[5].preview_url);
	  		console.log("Album Name: " + data.tracks.items[5].album.name);
	  		console.log("\n");


	  		fs.appendFile("log.txt", "\nYou've searched for: " + file 
	  				+ "\nArtist: " + data.tracks.items[5].artists[0].name 
	  				+ "\nSong Name: " + data.tracks.items[5].name
	  				+ "\nPreview Link: " + data.tracks.items[5].preview_url
	  				+ "\nAlbum Name: " + data.tracks.items[5].album.name, function(err) {
				    	if (err) {
				      		return console.log(err);
				    	}
    		})


	  		menu();


				})



	})

}


menu();

