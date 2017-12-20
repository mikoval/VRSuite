function ClothRamp(settings){
	
	settings = settings || {};
	settings.Point1 = settings.Point1 || new THREE.Vector3(5.0, -4.0, 0.0);
	settings.Point2 = settings.Point2 || new THREE.Vector3(10.0, 0.0, 10.0);


	var avgPosition = new THREE.Vector3().addVectors(settings.Point1, settings.Point2).multiplyScalar(0.5);


	
	this.pieces = [];

	var length = settings.Point1.distanceTo( settings.Point2 );

	console.log(length);

	var piece = new THREE.Mesh(
		new THREE.BoxGeometry(2.0, 0.2, length),
		new THREE.MeshPhongMaterial()
		)

	piece.position.copy(avgPosition)

	piece.material.side = THREE.DoubleSide;

	scene.add(piece);






	//TMP CODE


	var tmp = new THREE.Mesh(
		new THREE.SphereGeometry(1.0),
		new THREE.MeshPhongMaterial({color: 0xffff00})
		)

	tmp.position.copy( settings.Point1);

	scene.add(tmp);
	var tmp = new THREE.Mesh(
		new THREE.SphereGeometry(1.0),
		new THREE.MeshPhongMaterial({color: 0xffff00})
		)

	tmp.position.copy( settings.Point2);

	scene.add(tmp);

	// END TMP CODE






	var obj = new THREE.Object3D();
	//obj.add(this.LeftLeg);
	//obj.add(this.RightLeg);
	//obj.add(this.Top);


	//this.cloth = new Cloth(settings);

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

	





	this.update = function(){
		//console.time('someFunction');
		
		this.rightCollider.setPosition( this.RightLeg.position.clone().applyMatrix4 ( this.obj.matrixWorld));
		this.leftCollider.setPosition( this.LeftLeg.position.clone().applyMatrix4 ( this.obj.matrixWorld));
		this.rightCollider.setQuaternion( this.RightLeg.quaternion.clone() );
		this.leftCollider.setQuaternion( this.LeftLeg.quaternion.clone() );

		this.rightCollider.updatePosition();
		this.leftCollider.updatePosition();

		//console.log(this.rightCollider);
		
		this.cloth.updateMatrices();


		this.cloth.update();
		//console.timeEnd('someFunction');
	}

}
