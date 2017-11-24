
function socketLoop(){
	return;
	var obj = {};
	obj.p =  controls.getObject().position;
	obj.q =  controls.getObject().quaternion;
	var d = new Date();
	obj.t = d.getTime();


	socket.emit('testMessage',obj);
	setTimeout(socketLoop, 30);
}