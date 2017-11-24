
function socketLoop(){
	var obj = {};
	if(curs != undefined){
		obj.p =  curs.obj.position;

		var d = new Date();
		obj.t = d.getTime();

		obj.i = input;
		console.log(obj);
		socket.emit('testMessage',obj);
	}

	setTimeout(socketLoop, 30);
}
$(document).ready(function(){
	socket.on('newpage', function(page){

		window.location = page;
	});
})