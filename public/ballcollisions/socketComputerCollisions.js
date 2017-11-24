socket =  io(window.location.host);
function socketLoop(){
	var obj = {};
	if(input != undefined){
		obj.i =  input;

		var d = new Date();
		obj.t = d.getTime();


		socket.emit('testMessage',obj);
	}
	
	setTimeout(socketLoop, 30);
}
socketLoop();