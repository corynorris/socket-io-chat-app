var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.use(express.static(__dirname + '/public'));


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

var users = [];
io.on('connection', function (socket) {

    var userSet = false;

    socket.on('join chat', function (username) {
        if (userSet) return;
        userSet = true;
        socket.username = username;
        users.push(username);
        socket.broadcast.emit('user joined', socket.username);
        console.log("user joined: " + username);
    })

    socket.on('disconnect', function () {
        var index = users.indexOf(socket.username);
        if (index >= 0) {
            users.splice(index, 1);
            socket.broadcast.emit('user left', socket.username);
            console.log("user left: " + socket.username);
        }
    });

    socket.on('send message', function (message) {
        socket.broadcast.emit('chat message', {
            author: socket.username,
            text: message,
        });
    });

    socket.emit('users', users);
});

var port = process.env.PORT || 3000;

http.listen(port, function () {
    console.log('listening on *:' + port);
});
