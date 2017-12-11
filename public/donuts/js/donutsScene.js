
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

	
	scene = new Physijs.Scene;
	scene.setGravity(new THREE.Vector3( 0, -30, 0 ));
	scene.addEventListener(
		'update',
		function() {

			scene.simulate( undefined, 1 );
		}
	);
	


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

	//var player = new Player();

	//renderer.shadowMapEnabled = true;
renderer.shadowMapSoft = true;
	renderer.shadowMapType = THREE.PCFSoftShadowMap;







	var light = new THREE.PointLight(0xffffff, 1.0, 0, 2);
	light.position.x = 10;
	light.position.y = 10;
	light.position.z = 10;
	light.castShadow = true;
   	light.shadow.bias = - 0.005;
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




	Physijs.scripts.worker = '/general/physijs_worker.js';
	Physijs.scripts.ammo = '/general/js/ammo.js';

	// Materials
	
	
	// Ground
	ground = new Physijs.PlaneMesh(
		new THREE.PlaneGeometry(400, 400),
		ground_material
	);

	ground.position.y = -10
	ground.position.z = -30
	ground.receiveShadow = true;

	ground.rotation.x = (Math.PI / 2) * 3;

	scene.add( ground );
	
	player = new Player2();
	effect = undefined;
	if(mobile){

	     effect= new THREE.StereoEffect(renderer);
	    
	  }

	  loader.load('/donuts/textures/lego/CityStreetSidewalk002_COL_3K.jpg', function ( texture){
	 	  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	      texture.offset.set( 0, 0 );
	      texture.repeat.set( 8, 8 );
	      ground_material.map = texture;
	      ground_material.needsUpdate= true;
	  })
	 loader.load('/donuts/textures/lego/CityStreetSidewalk002_NRM_3K.jpg', function ( texture){
	 	  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	      texture.offset.set( 0, 0 );
	      texture.repeat.set( 8, 8 );
	      ground_material.normalMap = texture;
	      ground_material.needsUpdate= true;
	  })
		loader.load('/donuts/textures/lego/CityStreetSidewalk002_DISP_3K.jpg', function ( texture){
			texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
			texture.offset.set( 0, 0 );
			texture.repeat.set( 8, 8 );
			ground_material.displacementMap = texture;
			ground_material.needsUpdate= true;

			

	  })
		loader.load('/donuts/textures/lego/CityStreetSidewalk002_GLOSS_3K.jpg', function ( texture){
			  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		      texture.offset.set( 0, 0 );
		      texture.repeat.set( 8, 8 );
	      ground_material.SpecularMap = texture;
	    

	  })

		//
		loader.load('/donuts/textures/rocks/PaintingModernArtAbstract004_COL_VAR1_2K.jpg', function ( texture){
	 	  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	
	      player.obj.material.map = texture;
	      player.obj.material.map.needsUpdate = true
	      player.obj.material.needsUpdate = true;
	      console.log("set");
	  })
	 loader.load('/donuts/textures/rocks/PaintingModernArtAbstract004_NRM_2K.jpg', function ( texture){
	 	  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	      
	      player.obj.material.normalMap = texture;
	      player.obj.material.normalMap.needsUpdate = true;
	      player.obj.material.needsUpdate = true;
	      console.log("set");
	  })
		loader.load('/donuts/textures/rocks/PaintingModernArtAbstract004_DISP_2K.jpg', function ( texture){
			texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
			
			player.obj.material.displacementMap = texture;
			player.obj.material.displacementMap.needsUpdate = true;
			player.obj.material.needsUpdate = true;
			console.log("set");
			

	  })
		loader.load('/donuts/textures/rocks/PaintingModernArtAbstract004_GLOSS_2K.jpg', function ( texture){
			  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		      
	      player.obj.material.specularMap = texture;
	      player.obj.material.specularMap.needsUpdate = true;
	      player.obj.material.needsUpdate = true;
	      console.log("set");

	  })


	scene.simulate();
	animationLoop();

}



function animationLoop(){

	//this is the update part
	//update the player and set the camera based on changes
	//the effect line is for vr.

	player.update();
	setCamera();

	//this for loop I can explain. just ask me
	for(var i =0 ; i < objs2.length; i++){
		if(objs[i] != undefined){
	 		objs[i].position.x = objs2[i].position.x;
	 		objs[i].position.y = objs2[i].position.y;
	 		objs[i].position.z = objs2[i].position.z;
	 		objs[i].quaternion._x = objs2[i].quaternion._x;
	 		objs[i].quaternion._y = objs2[i].quaternion._y;
	 		objs[i].quaternion._z = objs2[i].quaternion._z;
	 		objs[i].quaternion._w = objs2[i].quaternion._w;


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
	crate(0,10,-20);
	/*
	for(var i = 0; i < 10; i++){
		var settings = {
			baseColor :0xf5b602,
			frostingColor :Math.random() * 0xFFFFFF,
			sprinkleColor :Math.random() * 0xFFFFFF,
		}
		var x = new Donut(10 * Math.random(), 10 * Math.random(), -10 + 10 * Math.random(), settings);
	}
	for(var i = 0; i < 10; i++){
		BeachBall(10 * Math.random(), 10 * Math.random(), -10 + 10 * Math.random());
	}
	*/
	
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

