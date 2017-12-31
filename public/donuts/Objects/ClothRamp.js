function ClothRamp(settings){
	
	settings = settings || {};
	settings.Point1 = settings.Point1 || new THREE.Vector3(0.0, 6.0, 0.0);
	settings.Point2 = settings.Point2 || new THREE.Vector3(0.0, 15.0, 30.0);

	this.settings = settings;

	var avgPosition = new THREE.Vector3().addVectors(settings.Point1, settings.Point2).multiplyScalar(0.5);

	var dir = new THREE.Vector3().subVectors(settings.Point1, settings.Point2);
	dir.normalize();


	var pieceWidth = 3;

	
	this.pieces = [];

	var length = settings.Point1.distanceTo( settings.Point2 );

	settings.height = length;
	settings.width = 20;
	settings.resolutionX = 64;
	settings.resolutionY =128;
	settings.iterations = settings.iterations || 5;
	//console.log(length);


	var right = new THREE.Vector3(1, 0, 0);

	var res = 10;
	var obj = new THREE.Object3D();
	//
	//obj.add(this.RightLeg);
	//obj.add(this.Top);


	for(var i = 0; i < res; i++){
		var piece = new THREE.Mesh(
			new THREE.BoxGeometry(pieceWidth, 0.2, length),
			new THREE.MeshPhongMaterial()
			)


		piece.position.copy(avgPosition);
		piece.lookAt(settings.Point1);




		var dx = 3 * Math.cos( (3.14/2  -3.14 * i/(res-1)) - 3.14/2 );

		var dy = 3 * Math.sin( (3.14/2  -3.14 * i/(res-1)) - 3.14/2 );


		dy *= 1.3;
		dx *= 4;


		piece.position.add(right.clone().multiplyScalar(dx));
		piece.position.add(piece.up.clone().multiplyScalar(dy));




		piece.rotation.z = -3.14/2  + 3.14 * i/(res-1);


		console.log(piece);



		var boxShape = new CANNON.Box(new CANNON.Vec3(pieceWidth/2,0.2/2,length/2));
		b1 = new CANNON.Body({ mass: 0 , material: smoothMaterialCannon});
		b1.addShape(boxShape);
		b1.position.set(piece.position.x, piece.position.y, piece.position.z);
		b1.velocity.set(0,0,0);
		b1.linearDamping = 0;
		world.addBody(b1);
		b1.quaternion.setFromEuler ( piece.rotation.x ,piece.rotation.y,piece.rotation.z, 'XYZ');


		//scene.add(piece);

		

		//piece.visible= false;




	}
	



		obj.position.copy(avgPosition)
		obj.lookAt(settings.Point1)




	//TMP CODE


	var tmp = new THREE.Mesh(
		new THREE.SphereGeometry(1.0),
		new THREE.MeshPhongMaterial({color: 0xffff00})
		)

	tmp.position.copy( settings.Point1);

	//scene.add(tmp);
	var tmp = new THREE.Mesh(
		new THREE.SphereGeometry(1.0),
		new THREE.MeshPhongMaterial({color: 0xffff00})
		)

	tmp.position.copy( settings.Point2);

	//scene.add(tmp);

	// END TMP CODE






	 


	this.cloth = new Cloth(settings);
	this.cloth.leftConstrain();
	this.cloth.rightConstrain();


	this.cloth.mesh.rotation.x = -3.14/2
	this.cloth.mesh.position.y += 1;
	//scene.add(this.cloth.mesh)
	obj.add(this.cloth.mesh);
	var context = this;
	this.setMap = function(url){
		loader.load(url, function ( texture){

			  context.cloth.ClothMaterial.uniforms.map.value = texture;
			  context.cloth.ClothMaterial.uniforms.shininess.value = 10.0;
			  context.cloth.ClothMaterial.needsUpdate = true;
			 

		})
	}

	this.setNormal = function(url){
			loader.load(url, function ( texture){
			  context.cloth.ClothMaterial.uniforms.normalMap.value = texture;
			  context.cloth.ClothMaterial.needsUpdate = true;
		})
	}

	var context = this;
	var loader = new THREE.TextureLoader();

	this.setMap = function(url){
		loader.load(url, function ( texture){

			  context.cloth.ClothMaterial.uniforms.map.value = texture;
			  context.cloth.ClothMaterial.uniforms.shininess.value = 10.0;
			  context.cloth.ClothMaterial.needsUpdate = true;
			 

		})
	}

	this.setNormal = function(url){
		loader.load(url, function ( texture){
		  context.cloth.ClothMaterial.uniforms.normalMap.value = texture;
		  context.cloth.ClothMaterial.needsUpdate = true;
	})
	}

	






	//obj.add(this.cloth.mesh);
	

	this.obj = obj;
	scene.add(obj);

	




	this.counter = 0;
	this.update = function(){
		this.cloth.updateMatrices();
		this.cloth.update();
		this.counter++;
		if(this.counter % 40 != 0 || objs.length > 10){
			return;
		}
		//console.time('someFunction');
		
		var radius = 1.3 + Math.random() * 1;

		var startPos = new THREE.Vector3().addVectors(this.settings.Point1.clone().multiplyScalar(0.1),this.settings.Point2.clone().multiplyScalar(0.9) );
		startPos.y += 2;
		var x = startPos.x + (Math.random() - 0.5) * 5;
		var y = startPos.y ;
		var z = startPos.z ;

		var sphere = new THREE.Mesh(
			new THREE.SphereGeometry(radius, 16, 16),
			new THREE.MeshPhongMaterial({ color : 0xffffffff * Math.random()})
		)
		sphere.radius = radius;
		//sphere.castShadow = true;

		sphere.position.y = -1000;
		objs.push(sphere);
		scene.add(sphere);


		var sphereShape = new CANNON.Sphere(radius);
		b1 = new CANNON.Body({ mass: 1 , material: ballMaterialCannon});
		b1.addShape(sphereShape);
		b1.position.set(x, y, z);
		b1.velocity.set(0,0,0);
		b1.linearDamping = 0;
		b1.identifier = 'ball'
		
		world.addBody(b1);
		console.log("adding piece");
		objs2.push(b1);
		//console.timeEnd('someFunction');
	}

}
