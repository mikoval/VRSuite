
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
renderer.shadowMap.enabled = true;
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

	//console.time('someFunction');

	world.step();

	

	time++;
	// and copy position and rotation to three mesh

	//console.log(lift);
	//lift.allowSleep = false;

	//lift.position.copy( lift.position);



	if(liftstate == "raise"){
		liftPositionY += 0.0
	}
	if(liftstate == "lower"){
		liftPositionY -= 0.0

	}

	if(liftstate == "rotateForward"){
		liftRotation += 0.03
		liftPositionZ -= 0;
	}
	if(liftstate == "rotateBackward"){
		liftRotation -= 0.03
		liftPositionZ += 0;
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
		liftstate = "raise";
	}

	//console.log(35 + liftPositionZ)
	
	lift.position.copy( new THREE.Vector3(liftStart.x, 5 * Math.sin(liftPositionY) + 4, liftStart.z + liftPositionZ) );

	//lift.rotation.x = -  3.14/2 * liftRotation;


	//liftGuardBackObj.position.copy( new THREE.Vector3(liftGuardBackStart.x, 15 * Math.sin(liftPositionY) + 4, liftGuardBackStart.z + liftPositionZ) );

	//liftGuardBackObj.rotation.x = -  3.14/2 * liftRotation;



	

	var position = new THREE.Vector3();
	var quaternion = new THREE.Quaternion();
	var scale = new THREE.Vector3();

	liftBottomObj.updateMatrixWorld( true );
	liftBottomObj.matrixWorld.decompose( position, quaternion, scale );

	liftBottom.setPosition( new OIMO.Vec3( position.x, position.y, position.z ));

	liftBottom.setQuaternion(new OIMO.Quat(quaternion._x, quaternion._y, quaternion._z, quaternion._w ))

	var position = new THREE.Vector3();
	var quaternion = new THREE.Quaternion();
	var scale = new THREE.Vector3();

	liftGuardBackObj.updateMatrixWorld( true );
	liftGuardBackObj.matrixWorld.decompose( position, quaternion, scale );

	liftGuardBack.setPosition( new OIMO.Vec3( position.x, position.y, position.z ));

	liftGuardBack.setQuaternion(new OIMO.Quat(quaternion._x, quaternion._y, quaternion._z, quaternion._w ))

	var position = new THREE.Vector3();
	var quaternion = new THREE.Quaternion();
	var scale = new THREE.Vector3();

	liftGuardRightObj.updateMatrixWorld( true );
	liftGuardRightObj.matrixWorld.decompose( position, quaternion, scale );

	liftGuardRight.setPosition( new OIMO.Vec3( position.x, position.y, position.z ));

	liftGuardRight.setQuaternion(new OIMO.Quat(quaternion._x, quaternion._y, quaternion._z, quaternion._w ))

	var position = new THREE.Vector3();
	var quaternion = new THREE.Quaternion();
	var scale = new THREE.Vector3();

	liftGuardLeftObj.updateMatrixWorld( true );
	liftGuardLeftObj.matrixWorld.decompose( position, quaternion, scale );

	liftGuardLeft.setPosition( new OIMO.Vec3( position.x, position.y, position.z ));

	liftGuardLeft.setQuaternion(new OIMO.Quat(quaternion._x, quaternion._y, quaternion._z, quaternion._w ))








	//liftBottomObj.position.copy( liftBottom.getPosition() );
	//liftBottomObj.quaternion.copy(liftBottom.getQuaternion() );




	//this is the update part
	//update the player and set the camera based on changes
	//the effect line is for vr.

	player.update();
	//clothRamp.update();
	setCamera();

	//this for loop I can explain. just ask me
	for(var i =0 ; i < objs2.length; i++){
		if(objs[i] != undefined){
			objs2[i].linearVelocity.multiplyScalar(0.999);

		}
	}
	for(var i =0 ; i < objs2.length; i++){
		if(objs[i] != undefined){
	 			objs[i].position.copy( objs2[i].getPosition() );
				objs[i].quaternion.copy( objs2[i].getQuaternion() );


	 	}
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
	      renderer.render(scene, camera);

	      if( clothHolder){
	      	clothHolder.update();
	      	//cloth.render();
	      }
	    }

		setTimeout(animationLoop, 30);
			//console.timeEnd('someFunction');
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
	
	
	 world = new OIMO.World({ 
	    timestep: 1/30, 
	    iterations: 8, 
	    broadphase: 2, // 1 brute force, 2 sweep and prune, 3 volume tree
	    worldscale: 1, // scale full world 
	    random: true,  // randomize sample
	    info: false,   // calculate statistic or not
	    gravity: [0,-30,0] 
	});
	 

	
	plane = world.add({ 
	    type:'box', // type of shape : sphere, box, cylinder 
	    size:[100, .1,100], // size of shape
	    pos:[0,-10,0], // start position in degree
	    rot:[0,0,0], // start rotation in degree
	    move:false, // dynamic or statique
	    density: 1,
	    friction: 0.2,
	    restitution: 1.0,
	    belongsTo: 1, // The bits of the collision groups to which the shape belongs.
	    collidesWith: 0xffffffff // The bits of the collision groups with which the shape collides.
	}); 
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

	// create balls 

	for(var i = 0; i < 10; i++){
		continue;
		var radius = Math.random() * 3;

		var x = (Math.random() - 0.5 ) * 20;
		var y = (Math.random() - 0.5 ) * 20;
		var z = (Math.random()  ) * 20;

		var sphere = new THREE.Mesh(
			new THREE.SphereGeometry(radius, 64, 64),
			new THREE.MeshPhongMaterial({ color : 0xffffffff * Math.random()})
		)
		sphere.radius = radius;
		sphere.castShadow = true;
		objs.push(sphere);
		scene.add(sphere);

		var body = world.add({ 
		    type:'sphere', // type of shape : sphere, box, cylinder 
		    size:[radius,radius, radius], // size of shape
		    pos:[x,y,z], // start position in degree
		    rot:[0,0,90], // start rotation in degree
		    move:true, // dynamic or statique
		    density: 1,
		    friction: 0.2,
		    restitution: 0.2,
		    belongsTo: 1, // The bits of the collision groups to which the shape belongs.
		    collidesWith: 0xffffffff, // The bits of the collision groups with which the shape collides.
		});

		objs2.push(body);


	}
	
	// create player 

	player = new Player2();



	// create cloth holder

	
	var settings = {
		width: 20,
		height: 10,
		resolutionX: 20,
		resolutionY: 20,
	}
	/*
	clothHolder = new ClothStand(settings);
	clothHolder.setMap('/donuts/textures/persianRug/RugPersian004_COL_1K.jpg');
	clothHolder.setNormal('/donuts/textures/persianRug/RugPersian004_NRM_1K.jpg');



	clothHolder.cloth.settings.balls = objs;
	//clothHolder.cloth.settings.balls.push(player.obj);
	clothHolder.obj.position.y = 0;
	clothHolder.obj.position.z = -2;
	*/

	var piece = new THREE.Mesh(
			new THREE.BoxGeometry(20, 10, 1),
			new THREE.MeshPhongMaterial()
			)

	piece.position.z = -15;
	piece.position.y = -5

	world.add({ 
	    type:'box', // type of shape : sphere, box, cylinder 
	    size:[20, 10, 1], // size of shape
	    pos:[piece.position.x, piece.position.y, piece.position.z], // start position in degree
	    rot:[0,0,0], // start rotation in degree
	    move:false, // dynamic or statique
	    density: 100,
	    friction: 0.3,
	    restitution: 1.0,
	    belongsTo: 1, // The bits of the collision groups to which the shape belongs.
	    collidesWith: 0xffffffff, // The bits of the collision groups with which the shape collides.
	});

	scene.add(piece);


		var piece = new THREE.Mesh(
			new THREE.BoxGeometry(20, 1, 48),
			new THREE.MeshPhongMaterial()
			)



	//piece.position.z = -15;
	piece.position.y = -5
	piece.position.z = 5


	var x = world.add({ 
	    type:'box', // type of shape : sphere, box, cylinder 
	    size:[20, 1, 45], // size of shape
	    pos:[piece.position.x, piece.position.y, piece.position.z], // start position in degree
	    rot:[4,0,0], // start rotation in degree
	    move:false, // dynamic or statique
	    density: 100,
	    friction: 0.3,
	    restitution: 1.0,
	    belongsTo: 1, // The bits of the collision groups to which the shape belongs.
	    collidesWith: 0xffffffff, // The bits of the collision groups with which the shape collides.
	});
	piece.quaternion.copy( x.getQuaternion() );
	scene.add(piece);


	var piece = new THREE.Mesh(
			new THREE.BoxGeometry(1, 5, 45),
			new THREE.MeshPhongMaterial()
			)



	//piece.position.z = -15;
	piece.position.y = -3
	piece.position.z = 5
	piece.position.x = -10


	var x = world.add({ 
	    type:'box', // type of shape : sphere, box, cylinder 
	    size:[1, 5, 45], // size of shape
	    pos:[piece.position.x, piece.position.y, piece.position.z], // start position in degree
	    rot:[6,0,0], // start rotation in degree
	    move:false, // dynamic or statique
	    density: 100,
	    friction: 0.3,
	    restitution: 1.0,
	    belongsTo: 1, // The bits of the collision groups to which the shape belongs.
	    collidesWith: 0xffffffff, // The bits of the collision groups with which the shape collides.
	});
	piece.quaternion.copy( x.getQuaternion() );

	scene.add(piece);


	var piece = new THREE.Mesh(
			new THREE.BoxGeometry(1, 5, 45),
			new THREE.MeshPhongMaterial()
			)



	//piece.position.z = -15;
	piece.position.y = -3
	piece.position.z = 5
	piece.position.x = 10


	var x = world.add({ 
	    type:'box', // type of shape : sphere, box, cylinder 
	    size:[1, 5, 45], // size of shape
	    pos:[piece.position.x, piece.position.y, piece.position.z], // start position in degree
	    rot:[6,0,0], // start rotation in degree
	    move:false, // dynamic or statique
	    density: 100,
	    friction: 0.3,
	    restitution: 1.0,
	    belongsTo: 1, // The bits of the collision groups to which the shape belongs.
	    collidesWith: 0xffffffff, // The bits of the collision groups with which the shape collides.
	});
	piece.quaternion.copy( x.getQuaternion() );

	scene.add(piece);



	// lift

	liftBottomObj = new THREE.Mesh(
			new THREE.BoxGeometry(20, 1, 10),
			new THREE.MeshPhongMaterial({color:0xFF4488 })
			)


	liftBottomStart = {x: 0, y: 0, z:0}
	//piece.position.z = -15;
	liftBottomObj.position.y = 0
	liftBottomObj.position.z = 0
	liftBottomObj.position.x = 0


	liftBottom = world.add({ 
	    type:'box', // type of shape : sphere, box, cylinder 
	    size:[20, 1, 10], // size of shape
	    pos:[liftBottomObj.position.x, liftBottomObj.position.y, liftBottomObj.position.z], // start position in degree
	    rot:[0,0,0], // start rotation in degree
	    move:true, // dynamic or statique
	    density: 10000000000,
	    friction: 1.0,
	    restitution: 1.0,
	    belongsTo: 1, // The bits of the collision groups to which the shape belongs.
	    collidesWith: 0xffffffff, // The bits of the collision groups with which the shape collides.
	});
	//liftBottom.quaternion.copy( lift.getQuaternion() );

	//scene.add(liftBottom);


	liftGuardBackObj = new THREE.Mesh(
			new THREE.BoxGeometry(20, 3, 1),
			new THREE.MeshPhongMaterial({color:0xFF4488 })
			)



	//piece.position.z = -15;
	liftGuardBackStart = {x: 0, y: 1, z:0}
	liftGuardBackObj.position.y = 1
	liftGuardBackObj.position.z = 6
	liftGuardBackObj.position.x = 0


	liftGuardBack = world.add({ 
	    type:'box', // type of shape : sphere, box, cylinder 
	    size:[20, 3, 1], // size of shape
	    pos:[liftGuardBackObj.position.x, liftGuardBackObj.position.y, liftGuardBackObj.position.z], // start position in degree
	    rot:[0,0,0], // start rotation in degree
	    move:true, // dynamic or statique
	    density: 1000,
	    friction: 0.0,
	    restitution: 0.0,
	    belongsTo: 1, // The bits of the collision groups to which the shape belongs.
	    collidesWith: 0xffffffff, // The bits of the collision groups with which the shape collides.
	});
	//liftBottom.quaternion.copy( lift.getQuaternion() );

	//scene.add(liftGuardBackObj);


	liftGuardRightObj = new THREE.Mesh(
			new THREE.BoxGeometry(1, 3, 10),
			new THREE.MeshPhongMaterial({color:0xFF4488 })
			)



	//piece.position.z = -15;
	liftGuardRightObj.position.y = 1
	liftGuardRightObj.position.z = 0
	liftGuardRightObj.position.x = 11


	liftGuardRight = world.add({ 
	    type:'box', // type of shape : sphere, box, cylinder 
	    size:[1, 3, 10], // size of shape
	    pos:[liftGuardRightObj.position.x, liftGuardRightObj.position.y, liftGuardRightObj.position.z], // start position in degree
	    rot:[0,0,0], // start rotation in degree
	    move:true, // dynamic or statique
	    density: 1000,
	    friction: 0.0,
	    restitution: 0.0,
	    belongsTo: 1, // The bits of the collision groups to which the shape belongs.
	    collidesWith: 0xffffffff, // The bits of the collision groups with which the shape collides.
	});
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


	liftGuardLeft = world.add({ 
	    type:'box', // type of shape : sphere, box, cylinder 
	    size:[1, 3, 10], // size of shape
	    pos:[liftGuardLeftObj.position.x, liftGuardLeftObj.position.y, liftGuardLeftObj.position.z], // start position in degree
	    rot:[0,0,0], // start rotation in degree
	    move:true, // dynamic or statique
	    density: 1000,
	    friction: 0.0,
	    restitution: 0.0,
	    belongsTo: 1, // The bits of the collision groups to which the shape belongs.
	    collidesWith: 0xffffffff, // The bits of the collision groups with which the shape collides.
	});
	//liftBottom.quaternion.copy( lift.getQuaternion() );

	//scene.add(liftGuardLeftObj);


	lift = new THREE.Object3D();
	lift.add(liftBottomObj);
	lift.add(liftGuardRightObj);
	lift.add(liftGuardLeftObj);
	lift.add(liftGuardBackObj);

	liftStart = {x: 0, y:0, z: 35};
	lift.position.z = 35;

	scene.add(lift);






	// create cloth ramp

/*
	 clothRamp = new ClothRamp();

	clothRamp.setMap('/donuts/textures/towel/FabricTowel001_COL_1K.jpg');
	clothRamp.setNormal('/donuts/textures/towel/FabricTowel001_NRM_1K.jpg');
	clothRamp.cloth.settings.balls = objs;

	*/

	animationLoop();


	
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

