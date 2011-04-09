// Loading required modules
var http = require('http'),
	io = require('/path/to/socket.io'),
	twitter = require('./twitter');

var SERVER_PORT = 8124,
    TWITTER_LOGIN = 'login',
    TWITTER_PASSWORD = 'password',
    TWITTER_TOPICS = 'WsN_Paris,zenika';

// Creating HTTP Server
server = http.createServer();

// Starting the server
server.listen(SERVER_PORT);

console.log('Server running on port : ' + SERVER_PORT);

// Attaching Socket.IO to the HTTP Server
var socket = io.listen(server);

// Instantiating our tracker
var tracker = new twitter.TwitterTracker(TWITTER_LOGIN, TWITTER_PASSWORD, TWITTER_TOPICS);

// Start tracking and waiting for 'tweet' events from our tracker.
tracker.track().on('tweet', function(tweet){
	// Using the socket provided by Socket.IO to broadcast the new tweet to all the clients.
	socket.broadcast(
		// To save bandwich we send only the tweet parts we are interested in.
		JSON.stringify( 
			{ 	id : tweet.id, 
				user : tweet.user.screen_name, 
				text : tweet.text, 
				picture : tweet.user.profile_image_url
			}
		)
	);
});
