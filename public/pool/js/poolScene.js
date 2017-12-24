
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



	timeStep = 1/30;

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
	
	scene = new THREE.Scene({});


	


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
	



	
	effect = undefined;
	if(mobile){

	    effect= new THREE.StereoEffect(renderer);
	    
	}
}



function animationLoop(){


	
	
	water.update();
	terrain.update();
	world.step(timeStep);
	player.update();

	for(var i = 0; i < balls.length; i++){
		balls[i].update();
	}

	//scene.simulate();

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
	ground_material = new THREE.MeshPhongMaterial({ displacementScale: 0.0}),
	
	 
	
	initScene();
	createScene()


	


		requestAnimationFrame( animationLoop );

})


	


var loader = new THREE.TextureLoader();






function createScene(){
	// Ground
	world = new CANNON.World();
	world.gravity.set(0,-9.82 , 0);
	world.broadphase = new CANNON.NaiveBroadphase();
	world.solver.iterations = 1;

	playerMaterialCannon = new CANNON.Material("playerMaterial")
	groundMaterialCannon = new CANNON.Material("groundMaterial")
	poolMaterialCannon = new CANNON.Material("smoothMaterial")
	ballMaterialCannon = new CANNON.Material("ballMaterial")
	var ContactMaterial = new CANNON.ContactMaterial(
                    playerMaterialCannon,      // Material #1
                    groundMaterialCannon,         // Material #2
                    {friction: 0.8,
            		restitution: 0.2}       // friction coefficient
                    );     // restitution
	world.addContactMaterial(ContactMaterial); 
	var ContactMaterial = new CANNON.ContactMaterial(
                    playerMaterialCannon,      // Material #1
                    poolMaterialCannon,         // Material #2
                    {friction: 1.0,
            		restitution: 0.3} );     // restitution

	world.addContactMaterial(ContactMaterial); 
	var ContactMaterial = new CANNON.ContactMaterial(
                    ballMaterialCannon,      // Material #1
                    poolMaterialCannon,         // Material #2
                    {
                    friction: 0.3,
            		restitution: 0.5,

            		} );     // restitution

	world.addContactMaterial(ContactMaterial); 
	var ContactMaterial = new CANNON.ContactMaterial(
                    ballMaterialCannon,      // Material #1
                    ballMaterialCannon,         // Material #2
                    {friction: 0.3,
            		restitution: 1.0} );     // restitution
	var ContactMaterial = new CANNON.ContactMaterial(
                    ballMaterialCannon,      // Material #1
                    playerMaterialCannon,         // Material #2
                    {friction: 0.3,
            		restitution: 1.0} );     // restitution

	world.addContactMaterial(ContactMaterial); 




	terrain = new PoolWorld();

	
	
	player = new Player2();

	water = new Water(0, -4.5, 0, 10, 10);
	

	for(var i = 0; i < 3; i++){
		var x = (Math.random() - 0.5) * 15;
		var y = 5 + Math.random() * 10;
		var z = (Math.random() - 0.5) * 15;
		var ball = new BeachBall( x, y, z);
		balls.push(ball); 
	}
	
}

setCamera = function(){
		
			

		var position = new THREE.Vector3(0, 1.6, 1.3);
		var axis = new THREE.Vector3( 0, 1, 0 );
		var angle = player.rotation;
		position.applyAxisAngle( axis, -angle );
		position.add(player.position);
	
		camera.position.x = position.x;
		camera.position.y = position.y;
		camera.position.z = position.z;

		
		
		var look = player.position.clone();
		look.y += 1.4;
		camera.lookAt(look); 
	}

