// Loading required librairies
var http = require('http'),
    io = require('/path/to/socket.io');

var SERVER_PORT = 8124,
    TWITTER_LOGIN = "login",
    TWITTER_PASSWORD = "password",
    TWITTER_TOPICS = "WsN_Paris,zenika";

// Creating HTTP Server
var server = http.createServer(function(req, res){
    // Called each time a request is made.
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
});

// Starting the server
server.listen(SERVER_PORT);

// Attaching Socket.IO to the HTTP Server
var socket = io.listen(server);
