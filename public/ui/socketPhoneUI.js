
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
			if(curs != undefined){
				curs.obj.position.x  = data.p.x;
				curs.obj.position.y  = data.p.y;
				curs.obj.position.z  = data.p.z;




				checkHover();

				prevTime = time;
			}
			

		}
	});
	socket.on('newpage', function(page){
		console.log("going to new page");
		window.location = page+"phone";
		
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

