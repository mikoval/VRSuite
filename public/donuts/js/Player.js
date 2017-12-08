function Player(camera){
	this.camera = camera;
	
	var geo = new THREE.SphereGeometry(1, 16, 16);
	var mat = new THREE.MeshBasicMaterial();
	this.obj = new THREE.Mesh(geo, mat);
	this.obj.position.z = -10;


	scene.add(this.obj);
}