
function initScene(){
	effect = undefined;
	WIDTH = $(document).width();
	HEIGHT = $(document).height();

	// Set some camera attributes.
	const VIEW_ANGLE = 45;
	const ASPECT = WIDTH / HEIGHT;
	const NEAR = 0.01;
	const FAR = 100000;
	controls = undefined;

	canJump = true;

	renderer = new THREE.WebGLRenderer({antialias :true});
	
	//renderer.shadowMapEnabled = true;   
	renderer.shadowMapSoft = true;
	renderer.shadowMapType = THREE.PCFShadowMap;


	camera =
	    new THREE.PerspectiveCamera(
	        VIEW_ANGLE,
	        ASPECT,
	        NEAR,
	        FAR
	    );

	camera.position.z = 5;


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

	renderer.shadowMapEnabled = true;
renderer.shadowMapSoft = true;
	renderer.shadowMapType = THREE.PCFSoftShadowMap;







	var light = new THREE.PointLight(0xffffff, 1.0, 0, 2);
	light.position.set( 100, 200, -100 );
	light.castShadow = true;

	light.shadowBias = 0.01;
	light.shadowDarkness = 0.2;
	light.shadowMapWidth = 1024;
	light.shadowMapHeight = 1024;

	scene.add( light );



	var light = new THREE.AmbientLight(0x404040);

	scene.add( light );

	model = undefined;
	 var objloader = new THREE.JSONLoader();
 	objloader.load( "/pool/donut4.json", addDonutModelPinkToScene );
 	objloader.load( "/pool/Chocolatedonut.json", addDonutModelChocolateToScene );
 	objloader.load( "/pool/donutCollider.json", addDonutColliderToScene );

 	objloader.load( "/pool/cup.json", addCupModelToScene );
 	objloader.load( "/pool/cup.json", addCupColliderToScene );




	Physijs.scripts.worker = '/general/physijs_worker.js';
	Physijs.scripts.ammo = '/general/js/ammo.js';

	// Materials
	
	
	// Ground
	ground = new Physijs.BoxMesh(
		new THREE.BoxGeometry(100, 1, 100),
		ground_material,
		0 // mass
	);
	ground.position.y = -10
	ground.receiveShadow = true;

	ground.position.z = -10;

	scene.add( ground );
	
	player = new Player2();
	
	scene.simulate();
	animationLoop();

}



function animationLoop(){
	player.update();
	setCamera();
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
	
	renderer.render(scene, camera);

	setTimeout(animationLoop, 30);
}

$(document).ready(function(){
	ground_material = Physijs.createMaterial(
		new THREE.MeshPhongMaterial({ displacementScale: 0.0}),
		.8, // high friction
		.4 // low restitution

	);

	 loader.load('/pool/textures/lego/CityStreetSidewalk002_COL_3K.jpg', function ( texture){
	 	  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	      texture.offset.set( 0, 0 );
	      texture.repeat.set( 8, 8 );
	      ground_material.map = texture;
	  })
	 loader.load('/pool/textures/lego/CityStreetSidewalk002_NRM_3K.jpg', function ( texture){
	 	  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	      texture.offset.set( 0, 0 );
	      texture.repeat.set( 8, 8 );
	      ground_material.normalMap = texture;
	  })
		loader.load('/pool/textures/lego/CityStreetSidewalk002_DISP_3K.jpg', function ( texture){
			texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
			texture.offset.set( 0, 0 );
			texture.repeat.set( 8, 8 );
			ground_material.displacementMap = texture;

			

	  })
		loader.load('/pool/textures/lego/CityStreetSidewalk002_GLOSS_3K.jpg', function ( texture){
			  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		      texture.offset.set( 0, 0 );
		      texture.repeat.set( 8, 8 );
	      ground_material.SpecularMap = texture;

	  })


	textureLoadLoop();
})
function textureLoadLoop(){
	if(checkTextures()){
		initScene();
	}
	else{
		setTimeout(textureLoadLoop, 100);
	}
}
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

loader.load('/pool/textures/tiles/TilesSquarePoolMixed001_COL_3K.jpg',function ( texture ) {tileColorTexture = adjustTexture(texture)});
loader.load('/pool/textures/tiles/TilesSquarePoolMixed001_GLOSS_3K.jpg',function ( texture ) {tileSpecTexture = adjustTexture(texture)});
loader.load('/pool/textures/tiles/TilesSquarePoolMixed001_NRM_3K.jpg',function ( texture ) {tileNormTexture = adjustTexture(texture)});
loader.load('/pool/textures/tiles/TilesSquarePoolMixed001_DISP_3K.jpg',function ( texture ) {tileDispTexture = adjustTexture(texture)});
function adjustTexture(texture){
	texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;



    texture.repeat.set(0.5, 0.5);

    texture.needsUpdate = true;

    return texture;
}




 // After loading JSON from our file, we add it to the scene
 function addDonutModelPinkToScene( geometry, materials ) {

 	var material = new THREE.MeshFaceMaterial(materials);
	model = new THREE.Mesh( geometry, material );



	donutModelPink = model;
 }

  function addDonutModelChocolateToScene( geometry, materials ) {

 	var material = new THREE.MeshFaceMaterial(materials);
	model = new THREE.Mesh( geometry, material );

	donutModelChocolate = model;
 }
 function addDonutColliderToScene(geometry, materials){
 		donutMaterial = Physijs.createMaterial(
			new THREE.MeshPhongMaterial({ color:0x33FF66 }),
			.8, // high friction
			.4 // low restitution
		);

		donutCollider = new Physijs.ConvexMesh(geometry, donutMaterial)
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
function checkLoaded(){

	if(donutCollider != undefined && donutModelPink != undefined && donutModelChocolate != undefined && cupModel != undefined && cupCollider != undefined){
		createScene();
	}
	else{
		setTimeout(checkLoaded, 100);
	}
	
}
checkLoaded();
function createScene(){
	for(var i = 0; i < 20; i++){
		
		var r = Math.floor(Math.random() * 2);
		if(r == 0){
			addDonut();
		}
		if(r == 1){
			addCup();
		}
		
	}
}

addDonut = function(){
	m2 = donutCollider.clone();
	var r = Math.floor(Math.random()*2);
	if(r == 0)
		model2 = donutModelPink.clone();
	else
		model2 = donutModelChocolate.clone();
	
	m2.position.set(
				Math.random() * 10 - 5,
				10 + Math.random() * 5,
				Math.random() * 20 - 30
			);

	m2.rotation.set(
			Math.random() * Math.PI * 2,
			Math.random() * Math.PI * 2,
			Math.random() * Math.PI * 2
		);
	var r = Math.random();

	objs.push(model2);
	objs2.push(m2);
	m2.visible = false;
	model2.castShadow = true;
	
	scene.add(m2);
	scene.add( model2 );
}
addCup = function(){
	console.log("adding cup")
	m2 = cupCollider.clone();
	model2 = cupModel.clone();
	m2.position.set(
				Math.random() * 10 - 5,
				10 + Math.random() * 5,
				Math.random() * 20 - 30
			);

	m2.rotation.set(
			Math.random() * Math.PI * 2,
			Math.random() * Math.PI * 2,
			Math.random() * Math.PI * 2
		);
	var r = Math.random();

	objs.push(model2);
	objs2 .push(m2);
	m2.visible = false;
	model2.castShadow = true;
	scene.add(m2);
	scene.add( model2 );
}
setCamera = function(){
		
			

		var position = new THREE.Vector3(0, 0.55, 0.05);
		var axis = new THREE.Vector3( 0, 1, 0 );
		var angle = player.rotation;
		position.applyAxisAngle( axis, -angle );
		position.add(player.position);
	
		camera.position.x = position.x;
		camera.position.y = position.y;
		camera.position.z = position.z;

			
		
		var look = player.position.clone();
		look.y += 0.55;
		camera.lookAt(look); 
	}


