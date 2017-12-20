
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
	light.position.y = 3;
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

	world.step();

	// and copy position and rotation to three mesh





	//this is the update part
	//update the player and set the camera based on changes
	//the effect line is for vr.

	player.update();
	setCamera();

	//this for loop I can explain. just ask me
	for(var i =0 ; i < objs2.length; i++){
		if(objs[i] != undefined){
			objs2[i].linearVelocity.multiplyScalar(0.98);

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
	    gravity: [0,-9.8,0] 
	});
	 

	
	plane = world.add({ 
	    type:'plane', // type of shape : sphere, box, cylinder 
	    size:[100,100], // size of shape
	    pos:[0,-10,0], // start position in degree
	    rot:[0,0,90], // start rotation in degree
	    move:false, // dynamic or statique
	    density: 1,
	    friction: 0.2,
	    restitution: 1.0,
	    belongsTo: 1, // The bits of the collision groups to which the shape belongs.
	    collidesWith: 0xffffffff // The bits of the collision groups with which the shape collides.
	}); 
	ground = new THREE.Mesh(
		new THREE.PlaneGeometry(100.0, 100,  1, 1),
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
	ground.rotation.x = -3.14/2;
	ground.position.y = -10;
	scene.add(ground);

	// create balls 

	for(var i = 0; i < 10; i++){

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
	clothHolder = new ClothStand(settings);
	clothHolder.setMap('/donuts/textures/persianRug/RugPersian004_COL_1K.jpg');
	clothHolder.setNormal('/donuts/textures/persianRug/RugPersian004_NRM_1K.jpg');

	clothHolder.cloth.settings.balls = objs;
	clothHolder.cloth.settings.balls.push(player.obj);
	clothHolder.obj.position.y = -6;
	clothHolder.obj.position.z = -6;



	// create cloth ramp

	var clothRamp = new ClothRamp();

	




	animationLoop();


	
}

setCamera = function(){
		
			

		var position = new THREE.Vector3(0, 1.1, 0.2);
		var axis = new THREE.Vector3( 0, 1, 0 );
		var angle = player.rotation;
		position.applyAxisAngle( axis, -angle );
		position.add(player.position);
	
		camera.position.x = position.x;
		camera.position.y = position.y;
		camera.position.z = position.z;

			
		
		var look = player.position.clone();
		look.y += 1.08;
		camera.lookAt(look); 
	}

