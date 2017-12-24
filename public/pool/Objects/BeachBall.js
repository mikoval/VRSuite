var BeachBallMaterial = undefined; 

$(document).ready(function(){

	BeachBallMaterial = new THREE.MeshPhongMaterial({  })

	var loader = new THREE.TextureLoader();
	loader.load('/pool/textures/beachball.jpg', function ( texture){
		  BeachBallMaterial.map = texture;
		  BeachBallMaterial.needsUpdate = true;
	})

})


function BeachBall(x, y, z){

	this.x = x;
	this.y = y;
	this.z = z;
	this.obj = undefined;
	this.radius = 1.0;


	this.update = function(){

		this.mesh.position.copy(this.collider.position);
		this.mesh.quaternion.copy(this.collider.quaternion);
		this.collider.applyImpulse(new THREE.Vector3(0,1,0).multiplyScalar ( 0.02 ), this.collider.position);

		this.collider.angularVelocity = this.collider.angularVelocity.scale(0.9)
		if(this.collider.position.y < water.y -0.2){
			this.collider.velocity = this.collider.velocity.scale(0.7)

			var dist = ((water.y -0.2) - this.collider.position.y)  ;
			this.collider.applyImpulse(new THREE.Vector3(0,1,0).multiplyScalar ( dist), this.collider.position);
		}
		

	}
	this.init  = function(){
		var geometry = new THREE.SphereGeometry(this.radius, 16,16);
		
		var mesh = new THREE.Mesh(geometry, BeachBallMaterial);
		 
		var mass = 1, radius = 1;
		var sphereShape = new CANNON.Sphere(radius); // Step 1
		var collider = new CANNON.Body({mass: mass, shape: sphereShape, material: ballMaterialCannon}); // Step 2
		collider.position.set(20,0,0);
		world.add(collider); // Step 3



		
		
		/*collider.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
			var velocity = this._physijs.linearVelocity.clone();
			var d = velocity.dot(contact_normal);
			this.setLinearVelocity(velocity.add(contact_normal.multiplyScalar(d * -1.6)))
			
		});
		*/
		collider.position.set(this.x,this.y,this.z);

		/*collider.rotation.set(
				Math.random() * Math.PI * 2,
				Math.random() * Math.PI * 2,
				Math.random() * Math.PI * 2
			);
			*/

		collider.castShadow = true;
		//collider.receiveShadow = true;
		//collider.setCcdMotionThreshold(1);
		//collider.setCcdSweptSphereRadius(0.2);
		
		this.collider = collider;
		this.mesh = mesh;
		scene.add(mesh);

	}
	this.init();
}