
var balls = [];
function initScene(){
	

	effect = undefined;
	WIDTH = $(document).width();
	HEIGHT = $(document).height();

	// Set some camera attributes.
	const VIEW_ANGLE = 45;
	const ASPECT = WIDTH / HEIGHT;
	const NEAR = 0.1;
	const FAR = 100000;
	controls = undefined;





	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize(WIDTH, HEIGHT);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.BasicShadowMap;
	//renderer.shadowMap.renderSingleSided = false; // must be set to false to honor double-sided materials


	camera =
	    new THREE.PerspectiveCamera(
	        VIEW_ANGLE,
	        ASPECT,
	        NEAR,
	        FAR
	    );

	camera.position.z = 5;
	cameraVR = new THREE.PerspectiveCamera(
	    VIEW_ANGLE,
	    ASPECT,
	    NEAR,
	    FAR
	);




	objs = [];
	objs2 = [];
	
	scene = new Physijs.Scene({reportsize: 50, fixedTimeStep: 1 / 60});
	scene.setGravity(new THREE.Vector3( 0, -10, 0 ));


	


	scene.add(camera);

	//renderer.setSize(WIDTH, HEIGHT);


	document.body.appendChild( renderer.domElement );
	var element = renderer.domElement;
	element.className += "canvas";
	element.style.width = "100%";
	element.style.height = "100%";


	//renderer.shadowMapSoft = true;
	//renderer.shadowMapType = THREE.PCFSoftShadowMap;




	model = undefined;
	

	Physijs.scripts.worker = '/general/physijs_worker.js';
	Physijs.scripts.ammo = '/general/js/ammo.js';

	
	effect = undefined;
	if(mobile){

	    effect= new THREE.StereoEffect(renderer);
	    
	}
}



function animationLoop(){
	//console.time('someFunction');


	player.update();
	water.update();
	world.update();
	for(var i = 0; i < balls.length; i++){
		balls[i].update();
	}
	scene.simulate();

	setCamera();

	
	if(effect){
          //console.log(controls);
        
      	if(controls != undefined){
	        controls.update();

	        if(quaternion != undefined){
	          var quat = new  THREE.Quaternion()
	          
	          quaternion = new THREE.Quaternion();
	          quaternion._x = camera.quaternion._x;
	          quaternion._y = camera.quaternion._y;
	          quaternion._z = camera.quaternion._z;
	          quaternion._w = camera.quaternion._w;
	          quat.multiplyQuaternions (quaternion, cameraVR.quaternion )
	          

	          
	        
	          camera.quaternion._x = quat._x;
	          camera.quaternion._y = quat._y;
	          camera.quaternion._z = quat._z;
	          camera.quaternion._w = quat._w;
	          
	        }
	        
	      }
	    
	      effect.render(scene, camera);
	    }
	    else{
	      renderer.render(scene, camera);
	    }

		//console.timeEnd('someFunction');

		setTimeout(animationLoop, 30);
	}

$(document).ready(function(){
	ground_material = Physijs.createMaterial(
		new THREE.MeshPhongMaterial({ displacementScale: 0.0}),
		1.0, // high friction
		0.0 // low restitution

	);

	 
	
	initScene();
	createScene()
	scene.simulate();
	animationLoop();
})


	


var loader = new THREE.TextureLoader();






function createScene(){
	// Ground
	
	world = new PoolWorld();

	
	
	player = new Player2();

	water = new Water(0, -4.5, 0, 10, 10);
	

	for(var i = 0; i < 6; i++){
		var x = (Math.random() - 0.5) * 20;
		var y = 10 * Math.random() * 20;
		var z = (Math.random() - 0.5) * 20;
		var ball = new BeachBall( x, y, z);
		balls.push(ball); 
	}
	
}

setCamera = function(){
		
			

		var position = new THREE.Vector3(0, 0.64, 0.2);
		var axis = new THREE.Vector3( 0, 1, 0 );
		var angle = player.rotation;
		position.applyAxisAngle( axis, -angle );
		position.add(player.position);
	
		camera.position.x = position.x;
		camera.position.y = position.y;
		camera.position.z = position.z;

			
		
		var look = player.position.clone();
		look.y += 0.63;
		camera.lookAt(look); 
	}

