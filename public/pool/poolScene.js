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
	
	renderer.shadowMapEnabled = true;   
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


	donuts = [];
	donuts2 = [];

	
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

	var light = new THREE.PointLight(0xAAAAAA, 1.0, 0);
	light.position.set( 3,3, 0 );

	scene.add( light );

	var light = new THREE.AmbientLight(0x404040);

	scene.add( light );

	model = undefined;
	 var objloader = new THREE.JSONLoader();
 	objloader.load( "/pool/donut4.json", addModelToScene );
 	objloader.load( "/pool/donutCollider.json", addColliderToScene );



	Physijs.scripts.worker = '/general/physijs_worker.js';
	Physijs.scripts.ammo = '/general/js/ammo.js';

	// Materials
	ground_material = Physijs.createMaterial(
		new THREE.MeshPhongMaterial({ color:0x33FF66 }),
		.8, // high friction
		.4 // low restitution
	);

	
	// Ground
	ground = new Physijs.BoxMesh(
		new THREE.BoxGeometry(100, 1, 100),
		ground_material,
		0 // mass
	);
	ground.position.y = -10
	//ground.receiveShadow = true;

	ground.position.z = -10;
	console.log(ground);

	scene.add( ground );
	
	player = new Player2();
	
	scene.simulate();
	animationLoop();

}



function animationLoop(){
	player.update();
	setCamera();
	for(var i =0 ; i < donuts.length; i++){
		if(donuts[i] != undefined){
	 		donuts[i].position.x = donuts2[i].position.x;
	 		donuts[i].position.y = donuts2[i].position.y;
	 		donuts[i].position.z = donuts2[i].position.z;
	 		donuts[i].quaternion._x = donuts2[i].quaternion._x;
	 		donuts[i].quaternion._y = donuts2[i].quaternion._y;
	 		donuts[i].quaternion._z = donuts2[i].quaternion._z;
	 		donuts[i].quaternion._w = donuts2[i].quaternion._w;


	 	}
	}
	if(donuts[i] != undefined){
		console.log(donuts[0].position);
	}
	renderer.render(scene, camera);

	setTimeout(animationLoop, 30);
}

$(document).ready(function(){
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
 function addModelToScene( geometry, materials ) {

 	var material = new THREE.MeshFaceMaterial(materials);
	model = new THREE.Mesh( geometry, material );



	donutModel = model;
 }
 function addColliderToScene(geometry, materials){
 		donutMaterial = Physijs.createMaterial(
			new THREE.MeshPhongMaterial({ color:0x33FF66 }),
			.8, // high friction
			.4 // low restitution
		);

		donutCollider = new Physijs.ConvexMesh(geometry, donutMaterial)
 }

 donutCollider = undefined;
 donutModel = undefined;
function checkLoaded(){
	console.log(donutCollider)
	if(donutCollider != undefined && donutModel != undefined){
		createScene();
	}
	else{
		setTimeout(checkLoaded, 100);
	}
	
}
checkLoaded();
function createScene(){
	for(var i = 0; i < 50; i++){
		console.log("adding donut: " + i)
		m2 = donutCollider.clone();
		model2 = donutModel.clone();
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


		donuts.push(model2);
		donuts2.push(m2);
		m2.visible = false;
		scene.add(m2);


		scene.add( model2 );
	}
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



