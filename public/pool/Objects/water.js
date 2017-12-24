
function Water (x,y,z, width, height){

	simplex = new SimplexNoise();
	this.x = x;
	this.y = y;
	this.z = z;
	this.width = width;
	this.height = height;

	var BOUNDS = 10;
	var WIDTH = 64;
	var materialColor = 0x0040A0;
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
	waterMesh.position.y  = this.y;
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
		amplitudesArr.push(0.01);
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

	

	var error = gpuCompute.init();
	if ( error !== null ) {
	    console.error( error );
	}


	time = 0;
	
	//waterMesh.visible = false;
	var reflector = new THREE.Reflector( 10, 10, {
		clipBias: 0.003,
		textureWidth: $(document).width()/2,
		textureHeight: $(document).height()/2,
		color: 0x777777,
		recursion: 1
	} );
	reflector.visible = true;
	reflector.rotateX( - Math.PI / 2 );
	reflector.position.y = -4.5;
	var refractor = new THREE.Refractor( 10, 10, {
		clipBias: 0.003,
		textureWidth: $(document).width()/2,
		textureHeight: $(document).height()/2,
		color: 0x777777,
		recursion: 1
	} );
	refractor.visible = true;
	refractor.rotateX( - Math.PI / 2 );
	refractor.position.y = -4.5;

	waterMesh.material.uniforms.refractTexture = {value: refractor.material.uniforms.tDiffuse.value};
	waterMesh.material.uniforms.reflectTexture = {value: reflector.material.uniforms.tDiffuse.value};
	waterMesh.material.uniforms.textureMatrixReflect = {value: reflector.material.uniforms.textureMatrix.value};
	waterMesh.material.uniforms.textureMatrixRefract = {value: refractor.material.uniforms.textureMatrix.value};

	scene.add( refractor );
	scene.add( reflector );


	this.update = function(){
		
		
		
		this.updateReflection();
		this.updateRefraction();

		reflector.visible = true;
		refractor.visible = false;
		reflector.test(renderer, scene, camera);
		reflector.visible = false;

		reflector.visible = false;
		refractor.visible = true;
		refractor.test(renderer, scene, camera);
		refractor.visible = false;

		

		//// code for the water simulation
		
		time += 0.1;
		// Set uniforms: mouse interaction
		var uniforms = heightmapVariable.material.uniforms;
		
		uniforms.time= { value: time };

		var campos = camera.position;

		console.log(campos)

		waterMesh.material.uniforms.camPos = {value: new THREE.Vector3(campos.x, campos.y, campos.z)};
		//waterMesh.material.uniforms.reflectTexture = {value: reflector.material.uniforms.tDiffuse.value};
		//waterMesh.material.uniforms.textureMatrix = {value: reflector.material.uniforms.textureMatrix.value};

		waterMesh.material.needsUpdate = true;

		
			
		// Do the gpu computation
		gpuCompute.compute();
		// Get compute output in custom uniform
		waterUniforms.heightmap.value = gpuCompute.getCurrentRenderTarget( heightmapVariable ).texture;
	}
	this.updateReflection = function(){

	}
	this.updateRefraction = function(){

	}

}
