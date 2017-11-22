var express = require('express');
var app = express();
var http = require('http').Server(app);
var port = process.env.PORT || 8080
var server = app.listen(port)
var io = require('socket.io')(server);

app.use(express.static('public'));

app.set('view engine', 'ejs');



io.on('connection', function(socket){
  socket.on('testMessage', function(msg){
    socket.broadcast.volatile.emit("testMessage", msg);
  });
});


app.get('/', function (req, res) {
	res.render('main.ejs', {})
})
app.get('/phone', function (req, res) {
	res.render('phone.ejs', {})
})
