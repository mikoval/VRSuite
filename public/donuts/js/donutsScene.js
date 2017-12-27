
effect = undefined;
WIDTH = $(document).width()/2;
HEIGHT = $(document).height()/2;

// Set some camera attributes.
const VIEW_ANGLE = 45;
const ASPECT = WIDTH / HEIGHT;
const NEAR = 0.1;
const FAR = 100000;
controls = undefined;

canJump = true;

renderer = new THREE.WebGLRenderer( { antialias: false } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( WIDTH, HEIGHT );
//renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;
renderer.shadowMap.renderSingleSided = false; // must be set to false to honor double-sided materials

clothHolder = undefined;
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
time = 0;
liftPositionY = 0;
liftPositionZ = 0;
liftRotation = 0;
liftGuardPosition = 0;
liftstate = 'raise'
function initScene(){
	



	objs = [];
	objs2 = [];

	
	scene = new THREE.Scene();
	


	scene.add(camera);
	prevTime = performance.now();





	// Start the renderer.
	renderer.setSize(WIDTH, HEIGHT);


	document.body.appendChild( renderer.domElement );
	var element = renderer.domElement;
	element.className += "canvas";
	element.style.width = "100%";
	element.style.height = "100%";




	//var geometry = new THREE.SphereGeometry(3, 16, 16);
	//var material = new THREE.MeshPhongMaterial({color: 0xFF0000});
	
	//var world = new PoolWorld();

	

	//renderer.shadowMapEnabled = true;








	var light = new THREE.PointLight(0xffffff, 1.0, 0, 2);
	light.position.x = 3;
	light.position.y = 30;
	light.position.z = 30;
	light.castShadow = true;
   	light.shadow.bias = - 0.0001;
    light.shadowCameraNear = 1;
    light.shadowCameraFar = 100;
    light.shadowMapWidth = 1024;
    light.shadowMapHeight = 1024;

	scene.add( light );



	var light = new THREE.AmbientLight(0x404040);

	scene.add( light );

	model = undefined;
	

 	//objloader.load( "/pool/Meshes/cup.json", addCupModelToScene );
 	//objloader.load( "/pool/Meshes/cupCollider.json", addCupColliderToScene );




	
	effect = undefined;
	if(mobile){

	     effect= new THREE.StereoEffect(renderer);
	    
	  }


}



function animationLoop(){
		console.time("test");
		world.step(timeStep);
		//console.log(b1.position);
		player.update();
		clothRamp.update();
		setCamera();

		updateLift();
		for(var i =0 ; i < objs2.length; i++){
			if(objs[i] != undefined){
				//objs2[i].linearVelocity.multiplyScalar(0.999);

			}
		}
		for(var i =0 ; i < objs2.length; i++){
			if(objs[i] != undefined){
		 			objs[i].position.copy( objs2[i].position );
					objs[i].quaternion.copy( objs2[i].quaternion );


		 	}
		}

		if( clothHolder){
	      	console.log("here")
	      	clothHolder.update();
	      	//cloth.render();
	      }

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
	    	//renderer.render(scene, camera);

	      
	    }



		setTimeout(animationLoop, 30);
			//console.timeEnd('someFunction');
			//console.timeEnd("test");
	}


$(document).ready(function(){
	ground_material = Physijs.createMaterial(
		new THREE.MeshPhongMaterial({ displacementScale: 0.0}),
		1.0, // high friction
		1.0 // low restitution

	);


	 
	setTimeout(function(){
		initScene();
		createScene()
	},100)
	

	
})


	
	

function checkTextures(){

	if(tileColorTexture == undefined){
		return false
	};
	if(tileSpecTexture == undefined){
		return false
	};
	if(tileNormTexture == undefined){
		return false
	};
	if(tileDispTexture == undefined){
		return false
	};

	return true;
}

var loader = new THREE.TextureLoader();

tileColorTexture = undefined;
tileSpecTexture = undefined;
tileNormTexture = undefined;
tileDIspTexture = undefined;

loader.load('/donuts/textures/tiles/TilesSquarePoolMixed001_COL_3K.jpg',function ( texture ) {tileColorTexture = adjustTexture(texture)});
loader.load('/donuts/textures/tiles/TilesSquarePoolMixed001_GLOSS_3K.jpg',function ( texture ) {tileSpecTexture = adjustTexture(texture)});
loader.load('/donuts/textures/tiles/TilesSquarePoolMixed001_NRM_3K.jpg',function ( texture ) {tileNormTexture = adjustTexture(texture)});
loader.load('/donuts/textures/tiles/TilesSquarePoolMixed001_DISP_3K.jpg',function ( texture ) {tileDispTexture = adjustTexture(texture)});
function adjustTexture(texture){
	texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;



    texture.repeat.set(0.5, 0.5);

    texture.needsUpdate = true;

    return texture;
}





 // After loading JSON from our file, we add it to the scene
 function addCupModelToScene( geometry, materials ) {

 	var material = new THREE.MeshFaceMaterial(materials);
	model = new THREE.Mesh( geometry, material );



	cupModel = model;
 }

   function addCupColliderToScene(geometry, materials){
 		cupMaterial = Physijs.createMaterial(
			new THREE.MeshPhongMaterial({ color:0x33FF66 }),
			2.0, // high friction
			.0 // low restitution
		);

		cupCollider = new Physijs.ConvexMesh(geometry, cupMaterial)
 }


 donutCollider = undefined;
 donutModelPink = undefined;
 donutModelChocolate= undefined;
 donutModelCosmic =  undefined;
 cupModel = undefined;




function createScene(){
	//this is where the objects are created
	

	world = new CANNON.World();
	world.gravity.set(0,-9.82 * 3, 0);
	world.broadphase = new CANNON.NaiveBroadphase();

	// create materials

	playerMaterialCannon = new CANNON.Material("playerMaterial")
	groundMaterialCannon = new CANNON.Material("groundMaterial")
	smoothMaterialCannon = new CANNON.Material("smoothMaterial")
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
                    smoothMaterialCannon,         // Material #2
                    {friction: 1.0,
            		restitution: 0.3} );     // restitution

	world.addContactMaterial(ContactMaterial); 
	var ContactMaterial = new CANNON.ContactMaterial(
                    ballMaterialCannon,      // Material #1
                    smoothMaterialCannon,         // Material #2
                    {
                    friction: 0.3,
            		restitution: 0.3,

            		} );     // restitution

	world.addContactMaterial(ContactMaterial); 
	var ContactMaterial = new CANNON.ContactMaterial(
                    ballMaterialCannon,      // Material #1
                    ballMaterialCannon,         // Material #2
                    {friction: 0.3,
            		restitution: 0.5} );     // restitution

	world.addContactMaterial(ContactMaterial); 

	var groundShape = new CANNON.Plane();
	var groundBody = new CANNON.Body({ mass: 0, shape: groundShape, material: groundMaterialCannon });

	groundBody.position.set(0,-10,0 )
	groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0), -3.14/2 );

	world.add(groundBody);


	timeStep = 1.0 / 30.0; // seconds


	player = new Player2();

	ground = new THREE.Mesh(
		new THREE.BoxGeometry(100.0,.1, 100,  1, 1),
		new THREE.MeshPhongMaterial()
	)

	loader.load('/donuts/textures/lego/CityStreetSidewalk002_COL_3K.jpg', function ( texture){
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.offset.set( 0, 0 );
		texture.repeat.set( 8, 8 );

		ground.material.map = texture;

		ground.material.needsUpdate = true;
	})
	loader.load('/donuts/textures/lego/CityStreetSidewalk002_NRM_3K.jpg', function ( texture){
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.offset.set( 0, 0 );
		texture.repeat.set( 8, 8 );

		ground.material.normalMap = texture;

		ground.material.needsUpdate = true;
	})

	loader.load('/donuts/textures/lego/CityStreetSidewalk002_DISP_3K.jpg', function ( texture){
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.offset.set( 0, 0 );
		texture.repeat.set( 8, 8 );

		ground.material.displacementMap = texture;
		ground.material.displacementScale = 0.1;

		ground.material.needsUpdate = true;
	})





	// create ground 


	ground.receiveShadow = true;
	//ground.rotation.x = -3.14/2;
	ground.position.y = -10;
	scene.add(ground);

	///////
	var settings = {
		width: 18,
		height: 10,
		resolutionX: 15,
		resolutionY: 15,
	}
	clothHolder = new ClothStand(settings);
	clothHolder.setMap('/donuts/textures/persianRug/RugPersian004_COL_1K.jpg');
	clothHolder.setNormal('/donuts/textures/persianRug/RugPersian004_NRM_1K.jpg');



	clothHolder.cloth.settings.balls = objs;
	//clothHolder.cloth.settings.balls.push(player.obj);
	clothHolder.obj.position.y = 2;
	clothHolder.obj.position.z = -2;
	

	////////////

	var piece = new THREE.Mesh(
			new THREE.BoxGeometry(20, 10, 1),
			new THREE.MeshPhongMaterial()
			)

	piece.position.z = -15;
	piece.position.y = 0



	var boxShape = new CANNON.Box(new CANNON.Vec3(20/2,10/2,1/2));
	b1 = new CANNON.Body({ mass: 0 , material: smoothMaterialCannon});
	b1.addShape(boxShape);
	b1.position.set(piece.position.x, piece.position.y, piece.position.z);
	b1.velocity.set(0,0,0);
	b1.linearDamping = 0;
	world.addBody(b1);
	scene.add(piece);
 
   ///////
   	var piece = new THREE.Mesh(
			new THREE.BoxGeometry(20, 1, 48),
			new THREE.MeshPhongMaterial()
			)



	//piece.position.z = -15;
	piece.position.y = -5
	piece.position.z = 5


	var boxShape = new CANNON.Box(new CANNON.Vec3(20/2, 1/2, 48/2));
	b1 = new CANNON.Body({ mass: 0 , material: smoothMaterialCannon});
	b1.addShape(boxShape);
	b1.position.set(piece.position.x, piece.position.y, piece.position.z);
	b1.velocity.set(0,0,0);
	b1.linearDamping = 0;
	world.addBody(b1);

	b1.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0), 8 * 3.14/180 );
	piece.rotation.x = 8 * 3.14/180 ;
	scene.add(piece);

	///////////

	var piece = new THREE.Mesh(
			new THREE.BoxGeometry(1, 5, 48),
			new THREE.MeshPhongMaterial()
			)
	piece.position.y = -3
	piece.position.z = 5
	piece.position.x = -10



	var boxShape = new CANNON.Box(new CANNON.Vec3(1/2, 5/2, 48/2));
	b1 = new CANNON.Body({ mass: 0 , material: smoothMaterialCannon});
	b1.addShape(boxShape);
	b1.position.set(piece.position.x, piece.position.y, piece.position.z);
	b1.velocity.set(0,0,0);
	b1.linearDamping = 0;
	world.addBody(b1);


		b1.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0), 8 * 3.14/180 );
	piece.rotation.x = 8 * 3.14/180 ;
	scene.add(piece);

	//piece.position.z = -15;
	
	var piece = new THREE.Mesh(
			new THREE.BoxGeometry(1, 5, 48),
			new THREE.MeshPhongMaterial()
			)



	//piece.position.z = -15;
	piece.position.y = -3
	piece.position.z = 5
	piece.position.x = 10


	var boxShape = new CANNON.Box(new CANNON.Vec3(1/2, 5/2, 48/2));
	b1 = new CANNON.Body({ mass: 0 , material: smoothMaterialCannon});
	b1.addShape(boxShape);
	b1.position.set(piece.position.x, piece.position.y, piece.position.z);
	b1.velocity.set(0,0,0);
	b1.linearDamping = 0;
	world.addBody(b1);


		b1.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0), 8 * 3.14/180 );
	piece.rotation.x = 8 * 3.14/180 ;
	scene.add(piece);


	

	//ramp
	 clothRamp = new ClothRamp();

	clothRamp.setMap('/donuts/textures/towel/FabricTowel001_COL_1K.jpg');
	clothRamp.setNormal('/donuts/textures/towel/FabricTowel001_NRM_1K.jpg');
	clothRamp.cloth.settings.balls = objs;

	// lift code 
	/////////////
	// lift

	liftBottomObj = new THREE.Mesh(
			new THREE.BoxGeometry(20, 2, 10),
			new THREE.MeshPhongMaterial({color:0xFF4488 })
			)


	liftBottomStart = {x: 0, y: 0, z:0}
	//piece.position.z = -15;
	liftBottomObj.position.y = 0
	liftBottomObj.position.z = 0
	liftBottomObj.position.x = 0


	
	var boxShape = new CANNON.Box(new CANNON.Vec3(20/2, 2/2, 10/2));
	liftBottom = new CANNON.Body({ mass: 0 , material: groundMaterialCannon});
	liftBottom.addShape(boxShape);
	liftBottom.position.set(liftBottomObj.position.x, liftBottomObj.position.y, liftBottomObj.position.z);
	liftBottom.velocity.set(0,0,0);
	liftBottom.linearDamping = 0;
	liftBottom.identifier = 'liftBottom';
	liftBottom.addEventListener("collide", function(e){ 
			//e.body.applyImpulse( new THREE.Vector3(0.0, 10, 0.0), e.body.position);

		} );

	world.addBody(liftBottom);



	//liftBottom.quaternion.copy( lift.getQuaternion() );

	//scene.add(liftBottom);


	liftGuardBackObj = new THREE.Mesh(
			new THREE.BoxGeometry(20, 3, 1),
			new THREE.MeshPhongMaterial({color:0xFF4488 })
			)



	//piece.position.z = -15;
	liftGuardBackStart = {x: 0, y: 1, z:0}
	liftGuardBackObj.position.y = 1
	liftGuardBackObj.position.z = 5
	liftGuardBackObj.position.x = 0


	var boxShape = new CANNON.Box(new CANNON.Vec3(20/2, 3/2, 1/2));
	liftGuardBack = new CANNON.Body({ mass: 0 , material: smoothMaterialCannon});
	liftGuardBack.addShape(boxShape);
	liftGuardBack.position.set(liftGuardBackObj.position.x, liftGuardBackObj.position.y, liftGuardBackObj.position.z);
	liftGuardBack.velocity.set(0,0,0);
	liftGuardBack.linearDamping = 0;
	world.addBody(liftGuardBack);

	//liftBottom.quaternion.copy( lift.getQuaternion() );

	//scene.add(liftGuardBackObj);


	liftGuardRightObj = new THREE.Mesh(
			new THREE.BoxGeometry(1, 3, 10),
			new THREE.MeshPhongMaterial({color:0xFF4488 })
			)



	//piece.position.z = -15;
	liftGuardRightObj.position.y = 1
	liftGuardRightObj.position.z = 0
	liftGuardRightObj.position.x = 10



	var boxShape = new CANNON.Box(new CANNON.Vec3(1/2, 3/2, 10/2));
	liftGuardRight = new CANNON.Body({ mass: 0 , material: smoothMaterialCannon});
	liftGuardRight.addShape(boxShape);
	liftGuardRight.position.set(liftGuardRightObj.position.x, liftGuardRightObj.position.y, liftGuardRightObj.position.z);
	liftGuardRight.velocity.set(0,0,0);
	liftGuardRight.linearDamping = 0;
	world.addBody(liftGuardRight);



	//liftBottom.quaternion.copy( lift.getQuaternion() );

	//scene.add(liftGuardRightObj);


	liftGuardLeftObj = new THREE.Mesh(
			new THREE.BoxGeometry(1, 3, 10),
			new THREE.MeshPhongMaterial({color:0xFF4488 })
			)



	//piece.position.z = -15;
	liftGuardLeftObj.position.y = 1
	liftGuardLeftObj.position.z = 0
	liftGuardLeftObj.position.x = -11



	var boxShape = new CANNON.Box(new CANNON.Vec3(1/2, 3/2, 10/2));
	liftGuardLeft = new CANNON.Body({ mass: 0 , material: smoothMaterialCannon});
	liftGuardLeft.addShape(boxShape);
	liftGuardLeft.position.set(liftGuardLeftObj.position.x, liftGuardLeftObj.position.y, liftGuardLeftObj.position.z);
	liftGuardLeft.velocity.set(0,0,0);
	liftGuardLeft.linearDamping = 0;
	world.addBody(liftGuardLeft);



	//liftBottom.quaternion.copy( lift.getQuaternion() );

	//scene.add(liftGuardLeftObj);


	console.log
	lift = new THREE.Object3D();
	lift.add(liftBottomObj);
	lift.add(liftGuardRightObj);
	lift.add(liftGuardLeftObj);
	lift.add(liftGuardBackObj);

	liftStart = {x: 0, y:0, z: 35};
	lift.position.z = 35;

	scene.add(lift);

	// lift blocker

	liftBlockerObj = new THREE.Mesh(
			new THREE.BoxGeometry(20, 10, 1),
			new THREE.MeshPhongMaterial({color:0x4080AA })
			)



	//piece.position.z = -15;
	liftBlockerObj.position.y = -5
	liftBlockerObj.position.z = 29
	liftBlockerObj.position.x = 0



	var boxShape = new CANNON.Box(new CANNON.Vec3(20/2, 10/2, 1/2));
	liftBlocker = new CANNON.Body({ mass: 0 , material: smoothMaterialCannon});
	liftBlocker.addShape(boxShape);
	liftBlocker.position.set(liftBlockerObj.position.x, liftBlockerObj.position.y, liftBlockerObj.position.z);
	liftBlocker.velocity.set(0,0,0);
	liftBlocker.linearDamping = 0;
	world.addBody(liftBlocker);

	scene.add(liftBlockerObj)


	//stand

	standObj = new THREE.Mesh(
			new THREE.BoxGeometry(10, 1, 10),
			new THREE.MeshPhongMaterial({color:0x0A4488 })
			)



	//piece.position.z = -15;
	standObj.position.y = 5
	standObj.position.z = -20
	standObj.position.x = 30



	var boxShape = new CANNON.Box(new CANNON.Vec3(10/2, 1/2, 10/2));
	stand = new CANNON.Body({ mass: 0 , material: smoothMaterialCannon});
	stand.addShape(boxShape);
	stand.position.set(standObj.position.x, standObj.position.y, standObj.position.z);
	stand.velocity.set(0,0,0);
	stand.linearDamping = 0;
	world.addBody(stand);
	scene.add(standObj)

	animationLoop();


	
}
updateLift = function(){
	if(liftstate == "raise"){
		liftPositionY += 0.01
	}
	if(liftstate == "lower"){
		liftPositionY -= 0.01

	}

	if(liftstate == "rotateForward"){
		liftRotation += 0.03
		liftPositionZ -= 0.1;
	}
	if(liftstate == "rotateBackward"){
		liftRotation -= 0.03
		liftPositionZ += 0.1;
	}
	if(liftstate == "pauseUp"){
		liftGuardPosition += 0.01
	}
	if(liftstate == "pauseDown"){

		liftGuardPosition -= 0.01
	}

	
	if(liftPositionY > 3.14/2){
		liftPositionY = 3.14/2;
		liftstate = "rotateForward";
	}
	if(liftRotation > 1){
		liftstate = "rotateBackward";
		liftRotation = 1;
	}

	if(liftRotation < 0){
		liftstate = "lower";
		liftRotation = 0;
	}
	
	if(liftPositionY < -3.14/2){
		liftPositionY = -3.14/2;
		liftstate = "pauseUp";
	}
	if(liftGuardPosition > 1){
		liftGuardPosition = 1;
		liftstate = "pauseDown";

	}
	if(liftGuardPosition < 0){
		liftGuardPosition = 0;
		liftstate = "raise";

	}

	//console.log(35 + liftPositionZ)
	
	lift.position.copy( new THREE.Vector3(liftStart.x, 15 * Math.sin(liftPositionY) + 4, liftStart.z + liftPositionZ) );
	console.log(liftStart.z + liftPositionZ)
	lift.rotation.x = -  3.14/2 * liftRotation;


	liftBlockerObj.position.copy( new THREE.Vector3(liftBlockerObj.position.x, -5 + liftGuardPosition * 15, liftBlockerObj.position.z ) );
	liftBlocker.position.set( liftBlockerObj.position.x, -5 + liftGuardPosition * 15, liftBlockerObj.position.z );

	//liftGuardBackObj.position.copy( new THREE.Vector3(liftGuardBackStart.x, 15 * Math.sin(liftPositionY) + 4, liftGuardBackStart.z + liftPositionZ) );

	//liftGuardBackObj.rotation.x = -  3.14/2 * liftRotation;




	

	
	var position = new THREE.Vector3();
	var quaternion = new THREE.Quaternion();
	var scale = new THREE.Vector3();

	liftBottomObj.matrixWorldNeedsUpdate = true
	liftBottomObj.matrixWorld.decompose( position, quaternion, scale );

	console.log(position.clone().sub(lift.position));

	liftBottom.position.set( position.x, position.y, position.z);




	liftBottom.quaternion.set(quaternion._x, quaternion._y, quaternion._z, quaternion._w );



	var position = new THREE.Vector3();
	var quaternion = new THREE.Quaternion();
	var scale = new THREE.Vector3();

	liftGuardBackObj.matrixWorldNeedsUpdate = true
	liftGuardBackObj.matrixWorld.decompose( position, quaternion, scale );

	liftGuardBack.position.set( position.x, position.y, position.z );

	liftGuardBack.quaternion.set(quaternion._x, quaternion._y, quaternion._z, quaternion._w );


	var position = new THREE.Vector3();
	var quaternion = new THREE.Quaternion();
	var scale = new THREE.Vector3();

	liftGuardRightObj.matrixWorldNeedsUpdate = true
	liftGuardRightObj.matrixWorld.decompose( position, quaternion, scale );


	liftGuardRight.position.set( position.x, position.y, position.z );

	liftGuardRight.quaternion.set(quaternion._x, quaternion._y, quaternion._z, quaternion._w );




	var position = new THREE.Vector3();
	var quaternion = new THREE.Quaternion();
	var scale = new THREE.Vector3();

	liftGuardLeftObj.matrixWorldNeedsUpdate = true
	liftGuardLeftObj.matrixWorld.decompose( position, quaternion, scale );

	liftGuardLeft.position.set( position.x, position.y, position.z );

	liftGuardLeft.quaternion.set(quaternion._x, quaternion._y, quaternion._z, quaternion._w );


				



}
setCamera = function(){
		
			

		var position = new THREE.Vector3(0, 3, 10);
		var axis = new THREE.Vector3( 0, 1, 0 );
		var angle = player.rotation;
		position.applyAxisAngle( axis, -angle );
		position.add(player.position);
	
		camera.position.x = position.x;
		camera.position.y = position.y;
		camera.position.z = position.z;

			
		
		var look = player.position.clone();
		look.y += 3;
		camera.lookAt(look); 
	}

