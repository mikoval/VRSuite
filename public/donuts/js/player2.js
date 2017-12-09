function Player2(z, color){
	this.direction = new THREE.Vector3( 0, 0, -1 );
	this.position = new THREE.Vector3(0, -5, 5);
	this.velocity = new THREE.Vector3(0, 0, 0);
	this.rotation = 0;
	this.speed = 0.2;
	this.changed = true;
	this.orientation =  new THREE.Quaternion();
	this.pathColor = 1;
	this.radius = 0.5;

	this.time = Date.now();

	var geometry = new THREE.SphereGeometry(this.radius, 4,4);
	
	 

	collMat = Physijs.createMaterial(
		new THREE.MeshPhongMaterial({ color:0x33AAFF }),
		1.0, // high friction
		0 // low restitution
	);




	coll = new Physijs.SphereMesh(geometry, collMat, 5)
	coll.visible = false;
	scene.add(coll);


	var material = new THREE.MeshPhongMaterial({ displacementScale: 0.1});
	var mesh = new THREE.Mesh(new THREE.SphereGeometry(this.radius, 16,16), material);

	mesh.position.y = this.position.x;
	mesh.position.y = this.position.y;
	mesh.position.z = this.position.z;
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	coll.setDamping(0.1,0.7);


	this.coll = coll;
	this.obj = mesh;
	scene.add( this.obj );

	this.update= function(){
		var dt = (Date.now() - this.time) / 200;
		this.time = Date.now();
		if(dt > 2.0)
			dt = 2.0;

		var x = Math.random();
		if(x<.03){
			this.pathColor = Math.floor(Math.random()*3 ) + 1.0;
		}
		this.inputs(dt);
		this.velocity.y -= 3 * dt;
		this.velocity.multiplyScalar(0.95)
		if(this.velocity.length() >8.0)
			this.velocity.normalize().multiplyScalar(8.0);

		
		this.position = this.coll.position;
		this.changed = true;
		



		var mesh = this.obj;
		mesh.position.x = this.position.x;
		mesh.position.y = this.position.y;
		mesh.position.z = this.position.z;

		mesh.quaternion._x = this.coll.quaternion._x;
		mesh.quaternion._y = this.coll.quaternion._y;
		mesh.quaternion._z = this.coll.quaternion._z;
		mesh.quaternion._w = this.coll.quaternion._w;


		//mesh.rotation.setFromQuaternion(this.orientation);

	}
	this.inputs= function(dt){

		if(input == undefined){
			return;
		}
		if(input.up){
			this.changed = true;
		
			

			this.coll.applyCentralImpulse(this.direction.clone().multiplyScalar ( this.speed * 10 ));

			


		}
		if(input.down){
			this.changed = true;
			//this.velocity = this.velocity.add(this.direction.clone().multiplyScalar ( -this.speed ))

			this.coll.applyCentralImpulse(this.direction.clone().multiplyScalar ( -this.speed  * 10) );


		


		}
		if(input.right){
			this.changed = true;
			var axis = new THREE.Vector3( 0, 1, 0 );
			var angle = -0.03;
			this.rotation -= angle;
			this.direction.applyAxisAngle( axis, angle );

		}
		if(input.left){
			this.changed = true;
			var axis = new THREE.Vector3( 0, 1, 0 );
			var angle = 0.03;
			this.rotation -= angle;
			this.direction.applyAxisAngle( axis, angle );
		}
		if(input.jump){
			if(this.position.y < 3.1 && this.velocity.y < 1.0) {
				console.log('jumping')
				this.coll.applyCentralImpulse(new THREE.Vector3(0,1,0).multiplyScalar ( 10 ));
			}
		}
		
	}
	
}