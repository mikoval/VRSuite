
function Water (x,y,z, width, height){

	simplex = new SimplexNoise();
	this.x = x;
	this.y = y;
	this.z = z;
	this.width = width;
	this.height = height;

	var BOUNDS = 10;
	var WIDTH = 64;
	var materialColor = 0x0040C0;
	var geometry = new THREE.PlaneBufferGeometry( BOUNDS, BOUNDS, WIDTH - 1, WIDTH -1 );
	// material: make a ShaderMaterial clone of MeshPhongMaterial, with customized vertex shader
	var material = new THREE.ShaderMaterial( {
		uniforms: THREE.UniformsUtils.merge( [
			THREE.ShaderLib[ 'phong' ].uniforms,
			{
				heightmap: { value: null },
				envMap: undefined
			}
		] ),
		vertexShader: document.getElementById( 'waterVertexShader' ).textContent,
		fragmentShader: document.getElementById( 'waterFragmentShader' ).textContent
	} );
	material.lights = true;
	material.transparent = true
	// Material attributes from MeshPhongMaterial
	material.color = new THREE.Color( materialColor );
	material.specular = new THREE.Color( 0x111111 );
	material.shininess = 50;
	// Sets the uniforms with the material values
	material.uniforms.diffuse.value = material.color;
	material.uniforms.specular.value = material.specular;
	material.uniforms.shininess.value = Math.max( material.shininess, 1e-4 );
	material.uniforms.opacity.value = material.opacity;
	// Defines
	material.defines.WIDTH = WIDTH.toFixed( 1 );
	material.defines.BOUNDS = BOUNDS.toFixed( 1 );
	waterUniforms = material.uniforms;
	waterMesh = new THREE.Mesh( geometry, material );
	waterMesh.rotation.x = - Math.PI / 2;
	waterMesh.position.y  = -4.5;
	waterMesh.matrixAutoUpdate = false;
	waterMesh.updateMatrix();

	scene.add(waterMesh);

	gpuCompute = new GPUComputationRenderer( WIDTH, WIDTH, renderer );
	var heightmap0 = gpuCompute.createTexture();
	amplitudesArr = [];
	wavelengthArr = [];
	speedArr = [];
	directionArr = [];
	for(var i = 0; i < 8; i++){
		amplitudesArr.push(0.003);
		wavelengthArr.push(  5 + Math.random() *  10);
		speedArr.push( (Math.random() - 0.5) * 5);
		directionArr.push( new THREE.Vector2((Math.random() - 0.5), (Math.random() - 0.5)).normalize() );
	}
	for(var i = 0; i < 8; i++){
		amplitudesArr.push(0);
		wavelengthArr.push(0);
		speedArr.push(0);
		directionArr.push( new THREE.Vector2(0,0) );
	}
	heightmapVariable = gpuCompute.addVariable( "heightmap", document.getElementById( 'heightmapFragmentShader' ).textContent, heightmap0 )

	gpuCompute.setVariableDependencies( heightmapVariable, [ heightmapVariable ] );
	heightmapVariable.material.uniforms.waterHeight = { value: 1 };
	heightmapVariable.material.uniforms.amplitude = { value: amplitudesArr };
	heightmapVariable.material.uniforms.wavelength= { value: wavelengthArr };
	heightmapVariable.material.uniforms.speed= { value: speedArr };
	heightmapVariable.material.uniforms.direction= { value: directionArr };

	this.cubeCamera = new THREE.CubeCamera(1, 100, 1024); 
	this.cubeCamera.position.x = this.x;
	this.cubeCamera.position.y = this.y;
	this.cubeCamera.position.z = this.z;

	scene.add(this.cubeCamera);

	var error = gpuCompute.init();
	if ( error !== null ) {
	    console.error( error );
	}


	time = 0;
	this.update = function(){
		waterMesh.visible = false;
		this.cubeCamera.update( renderer, scene );
		waterMesh.visible = true;
		waterMesh.material.uniforms.envMap = {value: this.cubeCamera.renderTarget.texture};
		waterMesh.material.uniforms.cameraPosition = {value: new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z)};
		//waterMesh.material.envMap.needsUpdate =true;
		waterMesh.material.needsUpdate = true;
		time += 0.1;
		// Set uniforms: mouse interaction
		var uniforms = heightmapVariable.material.uniforms;
		
		uniforms.time= { value: time };
		var campos = camera.position;
		waterMesh.material.uniforms.camPos = {value: new THREE.Vector3(campos.x, campos.y, campos.z)};
			
		
			
		// Do the gpu computation
		gpuCompute.compute();
		// Get compute output in custom uniform
		waterUniforms.heightmap.value = gpuCompute.getCurrentRenderTarget( heightmapVariable ).texture;
	}

}
