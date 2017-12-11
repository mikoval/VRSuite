var donutModel = undefined;
var donutCollider = undefined;

var donuts = [];
var objloader = new THREE.JSONLoader();
objloader.load( "/donuts/Meshes/sprinkleDonut.json", addDonutModelToScene );
objloader.load( "/donuts/Meshes/donutCollider.json", addDonutColliderToScene );


 // After loading JSON from our file, we add it to the scene
 function addDonutModelToScene( geometry, materials ) {
 	
 	var material = new THREE.MeshFaceMaterial(materials);
	var model = new THREE.Mesh( geometry, material );

	donutModel = model;
	checkDonutReady();

 }

 function addDonutColliderToScene(geometry, materials){
 		var donutMaterial = Physijs.createMaterial(
			new THREE.MeshPhongMaterial({ color:0x33FF66 }),
			.8, // high friction
			0.4 // low restitution
		);

		donutCollider = new Physijs.ConvexMesh(geometry, donutMaterial)
		checkDonutReady();
 }



function checkDonutReady(){
	if(donutModel != undefined && donutCollider != undefined){
		for(var i = 0 ; i < donuts.length; i++){
			donuts[i].init();
		}
	}
}
function Donut(x, y, z, settings = {} ){
	this.x = x;
	this.y = y;
	this.z = z;
	this.collider = undefined;
	this.obj = undefined;
	this.settings = settings;

	donuts.push(this);
	this.update = function(){

	}
	this.init  = function(){
		var collider = donutCollider.clone();
		
		var model = donutModel.clone();

		model.material = [];
		for(var i = 0 ; i < donutModel.material.length; i++){

			model.material.push(donutModel.material[i].clone());

		}
		model.material[0].color = new THREE.Color(this.settings.baseColor);
		model.material[1].color = new THREE.Color(this.settings.frostingColor);
		model.material[2].color = new THREE.Color(this.settings.sprinkleColor);
		

		
		
		collider.position.set(this.x,this.y,this.z);

		collider.rotation.set(
				Math.random() * Math.PI * 2,
				Math.random() * Math.PI * 2,
				Math.random() * Math.PI * 2
			);
		var r = Math.random();

		objs.push(model);
		objs2.push(collider);
		collider.visible = false;
		model.castShadow = true;
		model.receiveShadow = true;
		
		this.collider = collider;
		this.obj = model;

		scene.add(collider);
		scene.add( model );

	}
}