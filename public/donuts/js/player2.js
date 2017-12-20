var playerMaterial = new THREE.MeshPhongMaterial({ displacementScale: 0});
function Player2(z, color){
	this.direction = new THREE.Vector3( 0, 0, -1 );
	this.position = new THREE.Vector3(0, -5, 5);
	this.velocity = new THREE.Vector3(0, 0, 0);
	this.rotation = 0;
	this.speed = 2;
	this.changed = true;
	this.orientation =  new THREE.Quaternion();
	this.pathColor = 1;
	this.radius = 1.0;

	this.time = Date.now();


	
	 
	var coll = world.add({ 
	    type:'sphere', // type of shape : sphere, box, cylinder 
	    size:[this.radius,this.radius,this.radius], // size of shape
	    pos:[0,0,0], // start position in degree
	    rot:[0,0,90], // start rotation in degree
	    move:true, // dynamic or statique
	    density: 5,
	    friction: 0.4,
	    restitution: 0.2,
	    belongsTo: 1, // The bits of the collision groups to which the shape belongs.
	    collidesWith: 0xffffffff // The bits of the collision groups with which the shape collides.
	});
	




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

		this.coll.linearVelocity.multiplyScalar(0.95);
		this.coll.angularVelocity.multiplyScalar(0.95);

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
		this.obj.position.copy( this.coll.getPosition() );
		this.obj.quaternion.copy( this.coll.getQuaternion() );


		//mesh.rotation.setFromQuaternion(this.orientation);

	}
	this.inputs= function(dt){

		if(input == undefined){
			return;
		}
		if(input.up){
			this.changed = true;
		
			

			this.coll.applyImpulse(this.coll.position, this.direction.clone().multiplyScalar ( this.speed * 10 ));

			


		}
		if(input.down){
			this.changed = true;
			//this.velocity = this.velocity.add(this.direction.clone().multiplyScalar ( -this.speed ))

			this.coll.applyImpulse(this.coll.position, this.direction.clone().multiplyScalar ( -this.speed * 10 ));


		


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
		
			this.coll.applyImpulse(this.coll.position, new THREE.Vector3(0.0, 20, 0.0));
			
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

