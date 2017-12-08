function PoolWorld(){
	
	this.init = function(){
		this.generateGeometry();
	};
	this.generateGeometry = function(){

		var tileMat = new THREE.MeshPhongMaterial(
			{
				map: tileColorTexture, 
				normalMap:tileNormTexture, 
				specularMap: tileSpecTexture, 
				displacementMap: tileDispTexture,
				shininess: 50,
			}
		);
		//generate floors first
		var geo = new THREE.PlaneGeometry(10,10, 1,1);
		var floor = new THREE.Mesh(geo, tileMat);
		floor.position.z = -10;
	
		this.floor = floor;
		scene.add(floor);

		//add lights
		var light = new THREE.PointLight(0xAAAAAA, 1.0, 0);
		light.position.set( 3,3, 0 );

		this.light = light;

		scene.add( light );

		console.log("build scene");
	}


	this.init();

}