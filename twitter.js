// Loading required modules for the module
var http = require('http'), // Provide the createClient() method used to create the request.
    buffer = require('buffer').Buffer, // Used for credentials encoding.
    EventEmitter = require('events').EventEmitter; // Used for event emission.

// The tracker constructor.
// username & password are your twitter credentials.
// Topics are the subject(s) you want to track (separated by comma).
var TwitterTracker = exports.TwitterTracker = function(username, password, topics) {
    // Encoding credentials to base64.
	this.auth = new Buffer(username + ':' + password).toString('base64');
    // Adding basic authentication to the header with our credentials.
	this.header =  {'Authorization' : 'Basic ' + this.auth, 'Host' : 'stream.twitter.com' };
	this.topics = topics;
}

// Implementing the observer pattern thanks to Node's EventEmitter object.
// This will allow our TwitterTracker object to emit some events.
TwitterTracker.prototype = new EventEmitter;

// Track method definition.
// Calling the track method will send the request to the twitter api and emit event when a new tweet arrives.
TwitterTracker.prototype.track = function track() {

    // Creation of the http client used to make the request.
	var twitter = http.createClient(80, 'stream.twitter.com'),
    
    // Creation of the twitter request, we pass the http method, the api link with our topics and the header.
	request = twitter.request('GET', '/1/statuses/filter.json?track=' + this.topics, this.header),

    // We get a reference to our current instance to send event in the callback.
	tracker = this;

    // Waiting for a response from our request to the api.
    // This event is fired only once.
	request.on('response', function (response) {

        response.setEncoding('utf8');
		var body = '';

        // Listening to the data event.
        // This event will be fired every time the twitter 
        // api send back a new chunk of json data.
        //
        // Since the twitter api is streaming us the data, we might receive 
        // incomplete json that we will not be able to parse wihout error.
        //
        // The logic implemented in this listener is to concat chunks of data 
        // in the body variable and detect if we have a full tweet (ending by '\r\n')
        // befor trying to parse.
    	response.on('data', function (chunk) {
		    body = body + chunk;
			var tweet, index;
			if ( (index = body.indexOf('\r\n')) > -1 ) {
			    tweet = body.slice(0, index);
				body = body.slice(index + 2);
				if (tweet.length > 0) {
					try {
                        // Parsing the new tweet.
						tweet = JSON.parse(tweet);
                        // Sending the 'tweet' event that our server.js will listen to.
						tracker.emit('tweet', tweet);
					} catch (error) { 
                        console.error('-!- Error while parsing tweet.'); 
                    }
				}
			}
		});
	});

    // The request to the twitter api is not made until the end() method is call.
	request.end();

	return this; 
};
