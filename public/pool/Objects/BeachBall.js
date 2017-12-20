var BeachBallMaterial = undefined; 

$(document).ready(function(){

	BeachBallMaterial = Physijs.createMaterial(
		new THREE.MeshPhongMaterial({  }),
		0.4, // high friction
		1.0 // low restitution
	);
})
var loader = new THREE.TextureLoader();
loader.load('/pool/textures/beachball.jpg', function ( texture){
	  BeachBallMaterial.map = texture;
	  BeachBallMaterial.needsUpdate = true;
})


function BeachBall(x, y, z){

	this.x = x;
	this.y = y;
	this.z = z;
	this.obj = undefined;
	this.radius = 1.0;


	this.update = function(){
		this.collider.applyCentralImpulse(new THREE.Vector3(0,1,0).multiplyScalar ( 0.2 ));

		/*
		if(this.collider.position.y < water.y){
			var velocity = this.collider._physijs.linearVelocity.clone();
			this.collider.setLinearVelocity(velocity.multiplyScalar(0.7));
			this.collider.applyCentralImpulse(new THREE.Vector3(0,1,0).multiplyScalar ( 0.4));
		}
		*/

	}
	this.init  = function(){
		var geometry = new THREE.SphereGeometry(this.radius, 16,16);
	
		 

		
		var collider = new Physijs.SphereMesh(geometry, BeachBallMaterial, 1)
		
		/*collider.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
			var velocity = this._physijs.linearVelocity.clone();
			var d = velocity.dot(contact_normal);
			this.setLinearVelocity(velocity.add(contact_normal.multiplyScalar(d * -1.6)))
			
		});
		*/
		collider.position.set(this.x,this.y,this.z);

		collider.rotation.set(
				Math.random() * Math.PI * 2,
				Math.random() * Math.PI * 2,
				Math.random() * Math.PI * 2
			);

		collider.castShadow = true;
		//collider.receiveShadow = true;
		collider.setCcdMotionThreshold(1);
		collider.setCcdSweptSphereRadius(0.2);
		
		this.collider = collider;

		scene.add(collider);

	}
	this.init();
}