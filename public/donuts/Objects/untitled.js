var ClothMaterial = undefined; 

$(document).ready(function(){

	ClothMaterial = new THREE.MeshPhongMaterial({});
})
var loader = new THREE.TextureLoader();
loader.load('/pool/textures/beachball.jpg', function ( texture){
	  ClothMaterial.map = texture;
	  ClothMaterial.needsUpdate = true;
})


function Cloth(settings){
	if (!settings){
		settings = {};
	}

	settings.width = settings.width || 10;
	settings.height = settings.height || 10;
	settings.resolution = settings.resolution || 10;





	this.init  = function(){
		var geometry = new THREE.PlaneGeometry(settings.width, settings.height, settings.resolution, settings.resolution);
		var mesh = new THREE.Mesh(geometry, ClothMaterial);
		mesh.position.z = -10;
		scene.add(mesh);

	}
	this.init();
}