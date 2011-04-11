// Loading required modules
var http = require('http');

var SERVER_PORT = 8124;

// Creating HTTP Server
var server = http.createServer(function(req, res){
    // Called each time a request is made.
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
});

// Starting the server
server.listen(SERVER_PORT);

console.log('Server running on port : ' + SERVER_PORT);
