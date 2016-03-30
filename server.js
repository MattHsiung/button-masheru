var path = require('path');
var socketio = require('socket.io')
var http = require('http');
var server = http.createServer();
var express = require('express');
var app = express();


server.on('request', app);
var io = socketio(server);

var host;
var p1;
var p2;

function getPlayer(socketId){
	return (socketId===p1)? 1 : 2
}

io.on('connection', function (socket) {
    
    if(!host){
    	console.log(socket.id +' is host');
    	host = socket.id;
    }
    else if(!p1){
	    console.log(socket.id +' is p1');
    	p1=socket.id;
    	socket.emit('you',1)
    }
    else if(!p2){
    	console.log(socket.id +' is p2');
    	p2=socket.id;
    	socket.emit('you',2)
    	socket.broadcast.emit('playerReady')

    }

	socket.on('disconnect', function () {

		if(socket.id ===host){
			host=null
	    	console.log('host has disconnected!');
	    }
	    if(socket.id ===p1){
			p1=null
	    	console.log('p1 has disconnected!');
	    }
		if(socket.id ===p2){
			p2=null
	    	console.log('p2 has disconnected!');

		}
	});

    socket.on('gameOver', function(winner){
    	socket.broadcast.emit('over', winner)
    })
    socket.on('reset', function(){
    	socket.broadcast.emit('reset')
    })


	socket.on('punch', function(){
		socket.broadcast.emit('punchIn', getPlayer(socket.id))
	})
	socket.on('end', function(){
		socket.broadcast.emit('up')
	})

	socket.on('drawing', function(args){
		console.log(args)
		socket.broadcast.emit('display', args)
	})

});


server.listen(1337, function () {
    console.log('The server is listening on port 1337!');
});

app.use('/browser', express.static(path.join(__dirname, 'browser')));
app.use('/sound', express.static(path.join(__dirname, 'sound')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/', express.static(path.join(__dirname, 'node_modules')));

app.get('/player', function (req, res) {
    res.sendFile(path.join(__dirname, 'button.html'));
});
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'start.html'));
});

app.get('/stage', function (req, res) {
    res.sendFile(path.join(__dirname, 'stage.html'));
});
app.get('/chinatown', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/japan', function (req, res) {
    res.sendFile(path.join(__dirname, 'japan.html'));
});
app.get('/fullstack', function (req, res) {
    res.sendFile(path.join(__dirname, 'fullstack.html'));
});
app.get('/forest', function (req, res) {
    res.sendFile(path.join(__dirname, 'forest.html'));
});



