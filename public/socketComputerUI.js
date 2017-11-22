
function socketLoop(){
	var obj = {};
	if(curs != undefined){
		obj.p =  curs.obj.position;

		var d = new Date();
		obj.t = d.getTime();


		socket.emit('testMessage',obj);
	}

	setTimeout(socketLoop, 30);
}