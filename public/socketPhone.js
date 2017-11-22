
function socketLoop(){
	 socket.emit('testMessage', "hi");
	// setTimeout(socketLoop, 30);
}
quaternion = new THREE.Quaternion();
$(document).ready(function(){
	lastTime = 0;
	
	socket.on('testMessage', function(data){
		var time = data.t;
	
		if(time > lastTime){
			
			camera.position.x  = data.p.x;
			camera.position.y  = data.p.y;
			camera.position.z  = data.p.z;


			quaternion = new THREE.Quaternion(data.q._x, data.q._y,data.q._z, data.q._w);

			console.log(quaternion);
			
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
	renderer.width
})

