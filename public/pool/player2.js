function Player2(z, color){
	this.direction = new THREE.Vector3( 0, 0, -1 );
	this.position = new THREE.Vector3(0, -5, 5);
	this.velocity = new THREE.Vector3(0, 0, 0);
	this.rotation = 0;
	this.speed = 1.0;
	this.changed = true;
	this.orientation =  new THREE.Quaternion();
	this.pathColor = 1;
	this.radius = 0.5;

	this.time = Date.now();

	var geometry = new THREE.SphereGeometry(this.radius, 256,256);
	
	 

	collMat = Physijs.createMaterial(
		new THREE.MeshPhongMaterial({ color:0x33AAFF }),
		.8, // high friction
		0 // low restitution
	);




	coll = new Physijs.ConvexMesh(geometry, collMat, 100)
	coll.visible = false;
	scene.add(coll);


	var material = new THREE.MeshPhongMaterial({ displacementScale: 0.1});
	var mesh = new THREE.Mesh(geometry, material);
	mesh.position.y = this.position.x;
	mesh.position.y = this.position.y;
	mesh.position.z = this.position.z;
	mesh.castShadow = true;
	mesh.receiveShadow = true;

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
		mesh.rotation.setFromQuaternion(this.orientation);

	}
	this.inputs= function(dt){
		if(input == undefined){
			return;
		}
		if(input.up){
			this.changed = true;
		
			this.velocity = this.velocity.add(this.direction.clone().multiplyScalar ( this.speed ))


			var axis = new THREE.Vector3( 0, 1, 0 ).cross(this.direction);
			
			var quaternion = new THREE.Quaternion();
			quaternion.setFromAxisAngle(axis, dt*2);

			this.orientation = quaternion.multiply (this.orientation);

		}
		if(input.down){
			this.changed = true;
			this.velocity = this.velocity.add(this.direction.clone().multiplyScalar ( -this.speed ))

			var axis = new THREE.Vector3( 0, 1, 0 ).cross(this.direction);
			
			var quaternion = new THREE.Quaternion();

			quaternion.setFromAxisAngle(axis, -0.2);

			this.orientation = quaternion.multiply (this.orientation);


		}
		if(input.right){
			this.changed = true;
			var axis = new THREE.Vector3( 0, 1, 0 );
			var angle = -0.05;
			this.rotation -= angle;
			this.direction.applyAxisAngle( axis, angle );

		}
		if(input.left){
			this.changed = true;
			var axis = new THREE.Vector3( 0, 1, 0 );
			var angle = 0.05;
			this.rotation -= angle;
			this.direction.applyAxisAngle( axis, angle );
		}
		if(input.jump){
			if(this.position.y < 3.1 && this.velocity.y < 1.0) {
				console.log('jumping')
				this.velocity.y = 8;
			}
		}
		this.coll.setLinearVelocity(this.velocity);
	}
	
}