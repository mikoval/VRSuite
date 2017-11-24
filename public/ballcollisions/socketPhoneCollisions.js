socket =  io(window.location.host);
function socketLoop(){
	 socket.emit('testMessage', "hi");
	 //setTimeout(socketLoop, 30);
}
quaternion = new THREE.Quaternion();
$(document).ready(function(){
	lastTime = 0;
	socket.on('testMessage', function(data){
		console.log("got data");
		var time = data.t;
	
		if(time > lastTime){
			console.log("updating input")
			input  = data.i;
			

			prevTime = time;
		
			

		}
	});
	controls = new DeviceOrientationController( cameraVR, renderer.domElement );
	controls.connect();
})



$(document).on("click", function(){
	console.log("going full screen")
	document.documentElement.webkitRequestFullScreen()
})
$(document).on("tap", function(){
	console.log("going full screen")
	document.documentElement.webkitRequestFullScreen()
})

