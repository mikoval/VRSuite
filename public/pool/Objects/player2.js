var playerMaterial = new THREE.MeshPhongMaterial({ displacementScale: 0});
function Player2(z, color){
	this.direction = new THREE.Vector3( 0, 0, -1 );
	this.position = new THREE.Vector3();
	this.velocity = new THREE.Vector3(0, 0, 0);
	this.rotation = 0;
	this.speed = 2;
	this.changed = true;
	this.orientation =  new THREE.Quaternion();
	this.pathColor = 1;
	this.radius = 1.0;

	this.time = Date.now();


		
		var mass = 10, radius = this.radius;
		var sphereShape = new CANNON.Sphere(radius); // Step 1
		var coll = new CANNON.Body({mass: mass, shape: sphereShape, material: playerMaterialCannon}); // Step 2

	
		//coll.position.set(20,0,0);
		world.add(coll); // Step 3



	




	var mesh = new THREE.Mesh(new THREE.SphereGeometry(this.radius, 64,64), playerMaterial);

	mesh.position.y = this.position.x;
	mesh.position.y = this.position.y;
	mesh.position.z = this.position.z;
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	

	console.log(coll);
	this.coll = coll;
	this.obj = mesh;
	scene.add( this.obj );

	this.update= function(){



		this.coll.velocity.x = this.coll.velocity.x  * .95;
		this.coll.velocity.z = this.coll.velocity.z  * .95;
		this.coll.angularVelocity = this.coll.angularVelocity.scale(0.8)
		//this.coll.angularVelocity.multiplyScalar(0.95);

		var dt = (Date.now() - this.time) / 200;
		this.time = Date.now();
		if(dt > 2.0)
			dt = 2.0;

		var x = Math.random();
		
		this.inputs(dt);
		this.velocity.y -= 3 * dt;
		this.velocity.multiplyScalar(0.95)
		if(this.velocity.length() >8.0)
			this.velocity.normalize().multiplyScalar(8.0);

		
		this.position = this.coll.position;
		this.changed = true;
		



		var mesh = this.obj;
		this.obj.position.copy( this.coll.position);
		this.obj.quaternion.copy( this.coll.quaternion);


		//mesh.rotation.setFromQuaternion(this.orientation);

	}
	this.inputs= function(dt){

		if(input == undefined){
			return;
		}
		if(input.up){
			this.changed = true;
		
			

			this.coll.applyImpulse( this.direction.clone().multiplyScalar ( this.speed * 5 ), this.coll.position);

			


		}
		if(input.down){
			this.changed = true;
			//this.velocity = this.velocity.add(this.direction.clone().multiplyScalar ( -this.speed ))

			this.coll.applyImpulse(this.direction.clone().multiplyScalar ( -this.speed * 5 ), this.coll.position);


		


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
		
			this.coll.applyImpulse( new THREE.Vector3(0.0, 10, 0.0), this.coll.position);
			
		}
		
	}
	
}

var loader = new THREE.TextureLoader();
loader.load('/pool/textures/rocks/PaintingModernArtAbstract004_COL_VAR1_2K.jpg', function ( texture){
	  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  playerMaterial.map = texture;
  playerMaterial.map.needsUpdate = true
  playerMaterial.needsUpdate = true;
})
loader.load('/pool/textures/rocks/PaintingModernArtAbstract004_NRM_2K.jpg', function ( texture){
	  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  
  playerMaterial.normalMap = texture;
  playerMaterial.normalMap.needsUpdate = true;
  playerMaterial.needsUpdate = true;
loader.load('/pool/textures/rocks/PaintingModernArtAbstract004_DISP_2K.jpg', function ( texture){
})
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	
	playerMaterial.displacementMap = texture;
	playerMaterial.displacementMap.needsUpdate = true;
	playerMaterial.needsUpdate = true;

	

})
loader.load('/pool/textures/rocks/PaintingModernArtAbstract004_GLOSS_2K.jpg', function ( texture){
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      
  playerMaterial.specularMap = texture;
  playerMaterial.specularMap.needsUpdate = true;
  playerMaterial.needsUpdate = true;


})

