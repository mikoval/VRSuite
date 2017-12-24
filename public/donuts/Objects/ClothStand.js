function ClothStand(settings){
	
	settings = settings || {};
	settings.width = settings.width || 16;
	settings.height = settings.height || 16;

	settings.iterations = settings.iterations || 5;

	var width = settings.width;
	var height = settings.height;

	////////
	var clothHolder = new THREE.Mesh(
		new THREE.BoxGeometry(0.3, height, 0.3),
		new THREE.MeshPhongMaterial({color: 0x404040})
		);
	clothHolder.position.z = 0;
	clothHolder.position.y = 0;
	clothHolder.position.x = (-width/2) * 1.2;
	clothHolder.castShadow = true;

	this.LeftLeg = clothHolder;

	/*this.leftCollider = world.add({ 
		    type:'box', // type of shape : sphere, box, cylinder 
		    size:[0.3,height,0.3], // size of shape
		    pos:[0, 0, (-width/2) * 1.2], // start position in degree
		    //rot:[0,0,90], // start rotation in degree
		    move:false, // dynamic or statique
		    density: 100,
		    //friction: 0.2,
		    //restitution: 0.2,
		    belongsTo: 1, // The bits of the collision groups to which the shape belongs.
		    collidesWith: 0xffffffff, // The bits of the collision groups with which the shape collides.
		});

	*/

	///

	var clothHolder = new THREE.Mesh(
		new THREE.BoxGeometry(0.3, height, 0.3),
		new THREE.MeshPhongMaterial({color: 0x404040})
		);
	clothHolder.position.z = 0;
	clothHolder.position.y = 0;
	clothHolder.position.x = (width/2) * 1.2;
	clothHolder.castShadow = true;

	this.RightLeg = clothHolder;
	/*this.rightCollider = world.add({ 
		    type:'box', // type of shape : sphere, box, cylinder 
		    size:[0.3,height,0.3], // size of shape
		    pos:[0, 0, (width/2) * 1.2], // start position in degree
		    //rot:[0,0,90], // start rotation in degree
		    move:false, // dynamic or statique
		    density: 100,
		    friction: 0.2,
		    restitution: 0.2,
		    belongsTo: 1, // The bits of the collision groups to which the shape belongs.
		    collidesWith: 0xffffffff, // The bits of the collision groups with which the shape collides.
		});

	*/


	////
	var clothHolder = new THREE.Mesh(
		new THREE.BoxGeometry(width * 1.2 + 0.3, 0.3, 0.3),
		new THREE.MeshPhongMaterial({color: 0x404040})
		);
	clothHolder.position.z = 0;
	clothHolder.position.y = height/2;
	clothHolder.position.x = 0;
	clothHolder.castShadow = true;

	this.Top = clothHolder;



	var obj = new THREE.Object3D();
	obj.add(this.LeftLeg);
	obj.add(this.RightLeg);
	obj.add(this.Top);


	this.cloth = new Cloth(settings);
	this.cloth.topConstrain();
    

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

	






	obj.add(this.cloth.mesh);
	

	this.obj = obj;
	scene.add(obj);

	





	this.update = function(){
		//console.time('someFunction');
		
		//this.rightCollider.setPosition( this.RightLeg.position.clone().applyMatrix4 ( this.obj.matrixWorld));
		//this.leftCollider.setPosition( this.LeftLeg.position.clone().applyMatrix4 ( this.obj.matrixWorld));
		//this.rightCollider.setQuaternion( this.RightLeg.quaternion.clone() );
		//this.leftCollider.setQuaternion( this.LeftLeg.quaternion.clone() );

		//this.rightCollider.updatePosition();
		//this.leftCollider.updatePosition();

		//console.log(this.rightCollider);
		
		this.cloth.updateMatrices();


		this.cloth.update();
		//console.timeEnd('someFunction');
	}

}
