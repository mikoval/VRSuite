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

	

	renderer = new THREE.WebGLRenderer();
	
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




	
	scene = new THREE.Scene();
	prevTime = performance.now();
	velocity = new THREE.Vector3();
	direction = new THREE.Vector3();



	// Start the renderer.
	renderer.setSize(WIDTH, HEIGHT);


	document.body.appendChild( renderer.domElement );
	var element = renderer.domElement;
	element.className += "canvas";
	element.style.width = "100%";
	element.style.height = "100%";




	var geometry = new THREE.SphereGeometry(3, 16, 16);
	var material = new THREE.MeshPhongMaterial({color: 0xFF0000});
	var sphere = new THREE.Mesh(geometry, material)
	sphere.position.z = -10;
	scene.add(sphere);


	
	// mess around with this point light, play with spheres and play with plane 
	var light = new THREE.PointLight(0xAAAAAA, 1.0, 0);
	light.position.set( 0,10, 0 );
	light.castShadow = true;

	light.shadowBias = 0.0001;
	light.shadowDarkness = 0.2;
	light.shadowMapWidth = 2048;
	light.shadowMapHeight = 2048;

	scene.add( light );


	var light = new THREE.AmbientLight(0x404040);
	scene.add( light );


	animationLoop();

}

function render(){

	renderer.render(scene, camera);
}

function animationLoop(){

	renderer.render(scene, camera);

	setTimeout(animationLoop, 30);
}


initScene();



