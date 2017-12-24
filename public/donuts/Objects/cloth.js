
$(document).ready(function(){

	
})



function Cloth(settings){
	if (!settings){
		settings = {};
	}
	this.settings = settings;
	settings.width = settings.width || 10;
	
	settings.height = settings.height || 10;

	settings.iterations = settings.iterations || 5;

	if(settings.modifyHeight){
		settings.height = settings.height * 0.8
	}
	settings.resolutionX = settings.resolutionX || 10;
	settings.resolutionY = settings.resolutionY || 10;
	var tmp = settings.resolutionX 
	settings.resolutionX  = settings.resolutionY 
	settings.resolutionY = tmp;

	var tmp = settings.width 

	settings.width  = settings.height 
	settings.height = tmp;

	



	var ClothShaderObj = new ClothShader();
	var ClothMaterial = new THREE.ShaderMaterial(
	{
		uniforms: ClothShaderObj.uniforms,
		fragmentShader: ClothShaderObj.fragmentShader,
		vertexShader: ClothShaderObj.vertexShader
	})
	ClothMaterial.side = THREE.DoubleSide;


	this.ClothMaterial = ClothMaterial;

	settings.balls = settings.balls || new Array(0);






	this.init  = function(){
		var geometry = new THREE.PlaneGeometry(settings.width, settings.height, settings.resolutionX, settings.resolutionY);

		var mesh = new THREE.Mesh(geometry, ClothMaterial);

		mesh.material.lights = true;
		//mesh.material.color = new THREE.Color( 0xFF0000 );
		
		//mesh.material.uniforms.diffuse.value = new THREE.Vector3(0.2, 0.6 , 0.8)

		mesh.rotation.set(0,0,3.14/2) ;
		//mesh.castShadow = true;
		//mesh.receivesShadow = true;
		this.mesh = mesh;
		
		if(settings.modifyHeight){
			this.mesh.position.y += (this.settings.width * .125)
		}
		//	this.mesh.updateMatrixWorld();
		this.createVertexLookup();



		mesh.material.uniforms.res.value.x = this.settings.resolutionX;
        mesh.material.uniforms.res.value.y = this.settings.resolutionY;
        

        var inverse = new THREE.Matrix4().getInverse(mesh.matrixWorld);
        mesh.material.uniforms.inverse.value = inverse;




		//mesh.rotation.set(0,0,0.0) ;

		//scene.add(mesh);


		var SIZEX = settings.resolutionX;
		var SIZEY = settings.resolutionY;
		var camera2 = new THREE.OrthographicCamera(-SIZEX/2, SIZEX/2, SIZEY/2, -SIZEY/2, 1, 10000 );
     	camera2.position.z = 100;

     	this.camera2 = camera2;
      
     	var plane = new THREE.PlaneGeometry( settings.resolutionX, settings.resolutionY);

        var updateScene = new THREE.Scene();

        var clothUpdateShaderObj = new  ClothUpdateShader();
        var updateMaterial = new THREE.ShaderMaterial({
        	uniforms: clothUpdateShaderObj.uniforms,
        	vertexShader:clothUpdateShaderObj.vertexShader,
        	fragmentShader:clothUpdateShaderObj.fragmentShader,
        });
        var updateObject = new THREE.Mesh( plane, updateMaterial );

        updateMaterial.uniforms.res.value.x = this.settings.resolutionX;
        updateMaterial.uniforms.res.value.y = this.settings.resolutionY;

        updateScene.add(updateObject);
        this.updateMaterial = updateMaterial;
        this.updateScene = updateScene;

        // contrain scene
        var constrainScene = new THREE.Scene();

        var clothConstrainShaderObj = new  ClothConstrainShader();
        var constrainMaterial = new THREE.ShaderMaterial({
        	uniforms: clothConstrainShaderObj.uniforms,
        	vertexShader:clothConstrainShaderObj.vertexShader,
        	fragmentShader:clothConstrainShaderObj.fragmentShader,
        });
        var constrainObject = new THREE.Mesh( plane, constrainMaterial );

        constrainMaterial.uniforms.res.value.x = this.settings.resolutionX;
        constrainMaterial.uniforms.res.value.y = this.settings.resolutionY;
        constrainMaterial.uniforms.targetDistance.value = this.settings.width / this.settings.resolutionX;

        constrainScene.add(constrainObject);
        this.constrainMaterial = constrainMaterial;
        this.constrainScene = constrainScene;


        // contrain scene
        var copyScene = new THREE.Scene();

        var clothCopyShaderObj = new  ClothCopyShader();
        var copyMaterial = new THREE.ShaderMaterial({
        	uniforms: clothCopyShaderObj.uniforms,
        	vertexShader:clothCopyShaderObj.vertexShader,
        	fragmentShader:clothCopyShaderObj.fragmentShader,
        });
        var copyObject = new THREE.Mesh( plane, copyMaterial );

     

        copyScene.add(copyObject);
        this.copyMaterial = copyMaterial;
        this.copyScene = copyScene;

        this.copyMaterial.uniforms.inputTexture.value = this.positions1;

        // collision scene
        var collisionScene = new THREE.Scene();

        var clothCollisionShaderObj = new  ClothCollisionShader();
        var collisionMaterial = new THREE.ShaderMaterial({
                uniforms: clothCollisionShaderObj.uniforms,
                vertexShader:clothCollisionShaderObj.vertexShader,
                fragmentShader:clothCollisionShaderObj.fragmentShader,
        });
        var collisionObject = new THREE.Mesh( plane, collisionMaterial );

     

        collisionScene.add(collisionObject);
        this.collisionMaterial = collisionMaterial;
        this.collisionScene = collisionScene;


		renderer.render(copyScene, camera2, this.positions2);
		renderer.render(copyScene, camera2, this.positions3);
		renderer.render(copyScene, camera2, this.startPositions);
		this.constrainMaterial.uniforms.vertexPositionsStart.value = this.startPositions;


	}
	this.render = function(){
		renderer.render(this.updateScene, this.camera2);
	}
	this.topConstrain = function(){
		console.log("here")
		this.constrainMaterial.uniforms.topConstrain.value = 1;
	}
	this.bottomConstrain = function(){
		this.constrainMaterial.uniforms.bottomConstrain.value = 1;
	}
	this.leftConstrain = function(){
		this.constrainMaterial.uniforms.leftConstrain.value = 1;
	}
	this.rightConstrain = function(){
		this.constrainMaterial.uniforms.rightConstrain.value = 1;
	}
	this.createVertexLookup = function(){
		var lkpWidth = this.settings.resolutionX + 1;
		var lkpHeight = this.settings.resolutionY + 1;
		var parameters = {
		
			type: THREE.FloatType
		};
		var vertexPositions1 = new THREE.WebGLRenderTarget( lkpWidth, lkpHeight, parameters );
		var vertexPositions2 = new THREE.WebGLRenderTarget( lkpWidth, lkpHeight, parameters );
		var vertexPositions3 = new THREE.WebGLRenderTarget( lkpWidth, lkpHeight, parameters );
		var vertexPositionsStart = new THREE.WebGLRenderTarget( lkpWidth, lkpHeight, parameters );

		this.positions1 = vertexPositions1;
		this.positions2 = vertexPositions2;
		this.positions3 = vertexPositions3;
		this.startPositions = vertexPositionsStart;

		var arr =  new Float32Array(lkpWidth * lkpHeight *4 );
		var arr2 =  new Float32Array(lkpWidth * lkpHeight *4 );
		var arr3 =  new Float32Array(lkpWidth * lkpHeight *4 );

		var initialValues = new THREE.DataTexture( arr,lkpWidth, lkpHeight, THREE.RGBAFormat, THREE.FloatType);

		var pixels = initialValues.image.data;

		var p = 0;

		for ( var i = 0; i < lkpHeight; i++ ) {
			for ( var j = 0; j < lkpWidth; j++ ) {
				
				var vec = this.mesh.geometry.vertices[i * lkpWidth + j ].clone();

				var vec = new THREE.Vector4(vec.x, vec.y , vec.z, vec.w);

				
				//vec.applyMatrix4(this.mesh.matrixWorld);
	

				
			    pixels[ p + 0 ] = vec.x;
				pixels[ p + 1 ] = vec.y;
				pixels[ p + 2 ] = vec.z;
				pixels[ p + 3 ] = 0;

				p += 4;
			}
		}

		initialValues.needsUpdate = true;




		vertexPositions1.texture = initialValues;

		
		this.mesh.material.uniforms.vertexPositions.value = this.positions1;



	}
	this.updateMatrices = function(){
		var inverse = new THREE.Matrix4().getInverse(this.mesh.matrixWorld);
        this.mesh.material.uniforms.inverse.value = inverse;

       	this.collisionMaterial.uniforms.inverse.value = inverse;
       	this.collisionMaterial.uniforms.transformation.value = this.mesh.matrixWorld;
       	this.constrainMaterial.uniforms.inverse.value = inverse;
       	this.constrainMaterial.uniforms.transformation.value = this.mesh.matrixWorld;
       	this.updateMaterial.uniforms.inverse.value = inverse;
       	this.updateMaterial.uniforms.transformation.value = this.mesh.matrixWorld;
	}
	this.update = function(){
	//	console.time('someFunction');
			
		if(this.constrainMaterial.uniforms.inverse.value == null	 ){
			this.updateMatrices();
		}

     



		

		for(var j = 0; j < 1; j++){
			this.updateVertices();

			for(var i = 0; i < this.settings.iterations; i++){
				this.constrainVertices();
				this.collisions();
			}
		}
		
		//console.timeEnd('someFunction');
		//this.updateMaterial.uniforms.vertexPositions.value = this.positions1;
		this.mesh.material.uniforms.vertexPositions.value = this.positions1;
	}
	this.updateVertices = function(){

		this.updateMaterial.uniforms.vertexPositions.value = this.positions1;
		this.updateMaterial.uniforms.vertexPositionsOld.value = this.positions2;

		renderer.render(this.updateScene, this.camera2, this.positions3);
		
		var tmp1 = this.positions1;
		var tmp2 = this.positions2;
		var tmp3 = this.positions3;
		this.positions1 = tmp3;
		this.positions2 = tmp1;
		this.positions3 = tmp2;
	}
	
	
	
	
	this.collisions = function(){
		this.collisionMaterial.uniforms.vertexPositions.value = this.positions1;
		


		this.collisionMaterial.uniforms.targets.value = new Array(20);
		this.collisionMaterial.uniforms.radii.value = new Array(20);

		for(var i = 0; i < this.settings.balls.length; i++){
		
			this.collisionMaterial.uniforms.targets.value[i] = new THREE.Vector3(this.settings.balls[i].position.x, this.settings.balls[i].position.y, this.settings.balls[i].position.z );
			this.collisionMaterial.uniforms.radii.value[i] = this.settings.balls[i].radius;
		}
		for(var i = this.settings.balls.length; i < 20; i++){
		
			this.collisionMaterial.uniforms.targets.value[i] = new THREE.Vector3(0,0,0 );
			this.collisionMaterial.uniforms.radii.value[i] = 0;
		}
		
		//this.collisionMaterial.uniforms.radius.value = 1.0;
		renderer.render(this.collisionScene, this.camera2, this.positions3);
		//renderer.render(this.constrainScene, this.camera2);
		var tmp1 = this.positions1;
		var tmp2 = this.positions2;
		var tmp3 = this.positions3;
		this.positions1 = tmp3;
		this.positions3 = tmp1;
	}
	this.constrainVertices = function(){
		this.constrainMaterial.uniforms.rigid.value = 0.4;
		this.constrainMaterial.uniforms.type.value = 0;
		this.constrainLeft();
		this.constrainRight();
		this.constrainTop();
		this.constrainBottom();

		this.constrainMaterial.uniforms.rigid.value = 0.2;
		this.constrainMaterial.uniforms.type.value = 1;
		this.constrainTopLeft();
		this.constrainTopRight();
		this.constrainBottomLeft();
		this.constrainBottomRight();
	}
	this.constrainLeft = function(){
		this.constrainMaterial.uniforms.vertexPositions.value = this.positions1;
		this.constrainMaterial.uniforms.direction.value= new THREE.Vector2(-1.0, 0.0);
		renderer.render(this.constrainScene, this.camera2, this.positions3);
		//renderer.render(this.constrainScene, this.camera2);
		var tmp1 = this.positions1;
		var tmp2 = this.positions2;
		var tmp3 = this.positions3;
		this.positions1 = tmp3;
		this.positions3 = tmp1;

	}
	this.constrainRight = function(){
		this.constrainMaterial.uniforms.vertexPositions.value = this.positions1;
		this.constrainMaterial.uniforms.direction.value=new THREE.Vector2(1.0, 0.0);
		renderer.render(this.constrainScene, this.camera2, this.positions3);
		var tmp1 = this.positions1;
		var tmp2 = this.positions2;
		var tmp3 = this.positions3;
		this.positions1 = tmp3;
		this.positions3 = tmp1;
	}
	this.constrainTop = function(){
		this.constrainMaterial.uniforms.vertexPositions.value = this.positions1;
		this.constrainMaterial.uniforms.direction.value=new THREE.Vector2(0.0, 1.0);
		renderer.render(this.constrainScene, this.camera2, this.positions3);
		var tmp1 = this.positions1;
		var tmp2 = this.positions2;
		var tmp3 = this.positions3;
		this.positions1 = tmp3;
		this.positions3 = tmp1;
	}
	this.constrainBottom = function(){
		this.constrainMaterial.uniforms.vertexPositions.value = this.positions1;
		this.constrainMaterial.uniforms.direction.value=new THREE.Vector2(0.0, -1.0);
		renderer.render(this.constrainScene, this.camera2, this.positions3);
		var tmp1 = this.positions1;
		var tmp2 = this.positions2;
		var tmp3 = this.positions3;
		this.positions1 = tmp3;
		this.positions3 = tmp1;
	}
	this.constrainTopLeft = function(){
		this.constrainMaterial.uniforms.vertexPositions.value = this.positions1;
		this.constrainMaterial.uniforms.direction.value= new THREE.Vector2(-1.0, 1.0);
		renderer.render(this.constrainScene, this.camera2, this.positions3);
		//renderer.render(this.constrainScene, this.camera2);
		var tmp1 = this.positions1;
		var tmp2 = this.positions2;
		var tmp3 = this.positions3;
		this.positions1 = tmp3;
		this.positions3 = tmp1;

	}
	this.constrainTopRight = function(){
		this.constrainMaterial.uniforms.vertexPositions.value = this.positions1;
		this.constrainMaterial.uniforms.direction.value=new THREE.Vector2(1.0, 1.0);
		renderer.render(this.constrainScene, this.camera2, this.positions3);
		var tmp1 = this.positions1;
		var tmp2 = this.positions2;
		var tmp3 = this.positions3;
		this.positions1 = tmp3;
		this.positions3 = tmp1;
	}
	this.constrainBottomLeft = function(){
		this.constrainMaterial.uniforms.vertexPositions.value = this.positions1;
		this.constrainMaterial.uniforms.direction.value=new THREE.Vector2(-1.0, -1.0);
		renderer.render(this.constrainScene, this.camera2, this.positions3);
		var tmp1 = this.positions1;
		var tmp2 = this.positions2;
		var tmp3 = this.positions3;
		this.positions1 = tmp3;
		this.positions3 = tmp1;
	}
	this.constrainBottomRight = function(){
		this.constrainMaterial.uniforms.vertexPositions.value = this.positions1;
		this.constrainMaterial.uniforms.direction.value=new THREE.Vector2(1.0, -1.0);
		renderer.render(this.constrainScene, this.camera2, this.positions3);
		var tmp1 = this.positions1;
		var tmp2 = this.positions2;
		var tmp3 = this.positions3;
		this.positions1 = tmp3;
		this.positions3 = tmp1;
	}
	this.init();
}


function ClothShader(){

	this.uniforms =   THREE.UniformsUtils.merge( [
			THREE.ShaderLib[ 'phong' ].uniforms,
			{
		'color': {
			type: 'c',
			value: null
		},
		'vertexPositions':{
			type: 't',
			value: null,
		}, 
		'res':{
			type:"v2", value: new THREE.Vector2(100, 100)
		},
		'inverse':{
			type:'m4', value: null
		}
		
	}
		] ),
	this.vertexShader  = [
		"#extension GL_OES_standard_derivatives : enable",
		'#define PHONG',
		'#define USE_MAP',
		'#define USE_NORMALMAP',
		
		

		'',
		'varying vec3 vViewPosition;',
		'',
		'uniform sampler2D vertexPositions;',
		'uniform vec2 res;',
		'uniform mat4 inverse;',


		'#ifndef FLAT_SHADED',
		'',
			'varying vec3 vNormal;',
		'',
		'#endif',
		'',
		'#include <common>',
		'#include <uv_pars_vertex>',
		'#include <uv2_pars_vertex>',
		'#include <displacementmap_pars_vertex>',
		'#include <envmap_pars_vertex>',
		'#include <color_pars_vertex>',
		'#include <fog_pars_vertex>',
		'#include <morphtarget_pars_vertex>',
		'#include <skinning_pars_vertex>',
		'#include <shadowmap_pars_vertex>',
		'#include <logdepthbuf_pars_vertex>',
		'#include <clipping_planes_pars_vertex>',
		'',
		'void main() {',

		'	vec2 cellSize  = 1.0 / res;',

		'	vec4 pos = texture2D(vertexPositions, uv.xy);',

		//'	pos = inverse * pos;',
		'	vec4 posUp = texture2D(vertexPositions, uv.xy + vec2(0.0, cellSize.y));',
		'	vec4 posRight = texture2D(vertexPositions, uv.xy + vec2(cellSize.x, 0.0));',
		//'	posUp = inverse * posUp;',
		//'	posRight = inverse * posRight;',
		'	vec4 posBottom = texture2D(vertexPositions, uv.xy - vec2(0.0, cellSize.y));',
		'	vec4 posLeft= texture2D(vertexPositions, uv.xy - vec2(cellSize.x, 0.0));',
		//'	posBottom = inverse * posBottom;',
		//'	posLeft = inverse * posLeft;',


		'	vec4 vecUp  = normalize(posUp - posBottom);',
		'	vec4 vecRight  =-1.0 *  normalize(posRight - posLeft);',
		'	vNormal  = normalize(cross(vecUp.xyz, vecRight.xyz));',


		'',
			'#include <uv_vertex>',
			'#include <uv2_vertex>',
			'#include <color_vertex>',
		'',

			'#include <beginnormal_vertex>',
			'objectNormal =  vNormal;',
			'#include <morphnormal_vertex>',
			'#include <skinbase_vertex>',
			'#include <skinnormal_vertex>',
			'#include <defaultnormal_vertex>',
		'',
		'#ifndef FLAT_SHADED // Normal computed with derivatives when FLAT_SHADED',
		'',
			'vNormal = normalize( transformedNormal );',
		'',
		'#endif',
		'',
			'#include <begin_vertex>',
			'transformed = pos.xyz;',

			'#include <morphtarget_vertex>',
			'#include <skinning_vertex>',
			'#include <displacementmap_vertex>',
			'#include <project_vertex>',
			'#include <logdepthbuf_vertex>',
			'#include <clipping_planes_vertex>',
		'',
			'vViewPosition = - mvPosition.xyz;',
		'',
			'#include <worldpos_vertex>',
			'#include <envmap_vertex>',
			'#include <shadowmap_vertex>',
			'#include <fog_vertex>',
		'',
		'}',




	].join( '\n' )
	this.fragmentShader = [
		"#extension GL_OES_standard_derivatives : enable",
		'#define PHONG',
		'#define USE_MAP',
		'#define USE_NORMALMAP',



		'',
		'uniform vec3 diffuse;',
		'uniform vec3 emissive;',
		'uniform vec3 specular;',
		'uniform float shininess;',
		'uniform float opacity;',
		'',
		'#include <common>',
		'#include <packing>',
		'#include <dithering_pars_fragment>',
		'#include <color_pars_fragment>',
		'#include <uv_pars_fragment>',
		'#include <uv2_pars_fragment>',
		'#include <map_pars_fragment>',
		'#include <alphamap_pars_fragment>',
		'#include <aomap_pars_fragment>',
		'#include <lightmap_pars_fragment>',
		'#include <emissivemap_pars_fragment>',
		'#include <envmap_pars_fragment>',
		'#include <gradientmap_pars_fragment>',
		'#include <fog_pars_fragment>',
		'#include <bsdfs>',
		'#include <lights_pars>',
		'#include <lights_phong_pars_fragment>',
		'#include <shadowmap_pars_fragment>',
		'#include <bumpmap_pars_fragment>',
		'#include <normalmap_pars_fragment>',
		'#include <specularmap_pars_fragment>',
		'#include <logdepthbuf_pars_fragment>',
		'#include <clipping_planes_pars_fragment>',
		'',
		'void main() {',
		'',
			'#include <clipping_planes_fragment>',
		'',
			'vec4 diffuseColor = vec4( diffuse, opacity );',
			'ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );',
			'vec3 totalEmissiveRadiance = emissive;',
		'',
			'#include <logdepthbuf_fragment>',
			'#include <map_fragment>',
			'#include <color_fragment>',
			'#include <alphamap_fragment>',
			'#include <alphatest_fragment>',
			'#include <specularmap_fragment>',
			'#include <normal_fragment>',
			'#include <emissivemap_fragment>',
		'',
			'// accumulation',
			'#include <lights_phong_fragment>',
			'#include <lights_template>',
		'',
			'// modulation',
			'#include <aomap_fragment>',
		'',
			'vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;',
		'',
			'#include <envmap_fragment>',
		'',
			'//outgoingLight = texture2D(map, vUv.xy).xyz;',
			'gl_FragColor = vec4( outgoingLight, diffuseColor.a );',
		'',
			'#include <tonemapping_fragment>',
			'#include <encodings_fragment>',
			'#include <fog_fragment>',
			'#include <premultiplied_alpha_fragment>',
			'#include <dithering_fragment>',
		'',
		'}',
	].join( '\n' )
}

function ClothUpdateShader(){
	this.uniforms =  {
		'color': {
			type: 'c',
			value: null
		},
		'vertexPositions':{
			type: 't',
			value: null,
		},
		'vertexPositionsOld':{
			type: 't',
			value: null,
		},
		'res':{
			type:"v2", value: new THREE.Vector2(100, 100)
		},
		inverse:{
			type:'m4', value: null
		},
		transformation: {
			type:'m4', value: null
		}
	}
	this.vertexShader  = [

		'varying vec2 vuv;',
		'uniform sampler2D vertexPositions;',
		'void main() {',
		'	vuv = uv;',
		'	gl_Position = projectionMatrix *modelViewMatrix* vec4( position.xyz, 1.0 );',

		'}'
	].join( '\n' )
	this.fragmentShader = [
		'uniform vec3 color;',
		'varying vec2 vuv;',
		'uniform sampler2D vertexPositions;',
		'uniform sampler2D vertexPositionsOld;',
		'uniform vec2 res;',
		'uniform mat4 transformation;',
		'uniform mat4 inverse;',
		'',
		'void main() {',
		'	vec2 cellSize  = 1.0 / res;',
		'	vec4 pos = texture2D(vertexPositions, vuv.xy );',
		'	pos = transformation * pos;',
		'	vec4 posOld = texture2D(vertexPositionsOld, vuv.xy );',
		'	posOld = transformation * posOld;',
		'	vec4 velocity = (pos - posOld) * 0.95 - vec4(0.0, 0.01, 0.0, 0.0);',


			'	if(pos.w == 0.0){gl_FragColor =  vec4( (inverse *pos).xyz, 1.0 );}',
					'	else{',
		'		if( vuv.x  > 1.0 - (cellSize.x )) ',
		'			{gl_FragColor =  vec4( (inverse *pos).xyz, 1.0 );}',
		'		else{gl_FragColor =  vec4( (inverse * (pos + velocity)).xyz, 1.0 );}',
		'	}',
		'}'
	].join( '\n' )
}
function ClothCopyShader(){
	this.uniforms =  {
		
		'inputTexture':{
			type:"t", value: null
		},
	}
	this.vertexShader  = [

		'varying vec2 vuv;',
		'void main() {',
		'	vuv = uv;',
		'	gl_Position = projectionMatrix *modelViewMatrix* vec4( position.xyz, 1.0 );',

		'}'
	].join( '\n' )
	this.fragmentShader = [

		'varying vec2 vuv;',
		'uniform sampler2D inputTexture;',
		'void main() {',
		'	vec4 pos = texture2D(inputTexture, vuv.xy );',
		'	gl_FragColor = vec4( pos.xyz, 1.0 );',
		'}'
	].join( '\n' )
}
function ClothConstrainShader(){
	this.uniforms =  {
		'color': {
			type: 'c',
			value: null
		},
		'vertexPositions':{
			type: 't',
			value: null,
		},
		'vertexPositionsStart':{
			type: 't',
			value: null,
		},

		'res':{
			type:"v2", value: new THREE.Vector2(100, 100)
		},
		'targetDistance':{
			type:"float", 
			value:  1
		},
		'direction':{
			type:"v2", value: new THREE.Vector2(0,0),
		},
		'type':{
			type:"f", value: 0,
		}, 
		'rigid':{
			type:"f", value: 0,
		},
		inverse:{
			type:'m4', value: null
		},
		transformation: {
			type:'m4', value: null
		},
		leftConstrain:{
			type:'i', value:0
		},
		rightConstrain:{
			type:'i', value:0
		},
		topConstrain:{
			type:'i', value:0
		},
		bottomConstrain:{
			type:'i', value:0
		},


	}
	this.vertexShader  = [

		'varying vec2 vuv;',
		'uniform sampler2D vertexPositions;',
		'void main() {',
		'	vuv = uv;',
		'	gl_Position = projectionMatrix *modelViewMatrix* vec4( position.xyz, 1.0 );',

		'}'
	].join( '\n' )
	this.fragmentShader = [
		'uniform vec3 color;',
		'varying vec2 vuv;',
		'uniform sampler2D vertexPositions;',
		'uniform sampler2D vertexPositionsStart;',
		'uniform vec2 res;',
		'uniform float targetDistance;',
		'uniform vec2 direction;',
		'uniform float type;',
		'uniform float rigid;',
		'uniform mat4 transformation;',
		'uniform mat4 inverse;',
		'uniform int leftConstrain;',
		'uniform int rightConstrain;',
		'uniform int topConstrain;',
		'uniform int bottomConstrain;',
		'void main() {',
		'	vec2 cellSize  = 1.0 / res;',
		'	vec4 pos = texture2D(vertexPositions, vuv.xy );',
		'	pos = transformation *  pos; ',
		


		'	if(type == 0.0){',
			'	float px = floor(vuv.x * res.x );',
			'	float spacingx = px- (2.0 * floor(px/2.0));',
			'	float py = floor(vuv.y * res.y );',
			'	float spacingy = py- (2.0 * floor(py/2.0));',
			'	float total = spacingx + spacingy;',
			'	total = total- (2.0 * floor(total/2.0));',

			'	if(total == 0.0){',
			'		vec2 newUV = vuv + (direction * cellSize);',
			'	}',
			'	else{',
			'		vec2 newUV = vuv - (direction * cellSize);',
			'	}',
		'	}',
		'	if(type == 1.0){',
			'	float px = floor(vuv.x * res.x );',
			'	float spacingx = px- (2.0 * floor(px/2.0));',
			
			'	float total = spacingx;',
		
		
			'	if(total == 0.0){',
			'		vec2 newUV = vuv + (direction * cellSize);',
			'	}',
			'	else{',
			'		vec2 newUV = vuv - (direction * cellSize);',
			'	}',
		'	}',
		



		
		
		'	vec4 totalDisplacement = vec4(0.0);',
		'	for(float i = -1.0; i < 2.0; i++){',
		'		for(float j = -1.0; j < 2.0; j++){',
		'			vec2 newUV = vuv + vec2(i * cellSize.x, j * cellSize.y);',
		'			if(newUV.x > 0.0 && newUV.x < 1.0 && newUV.y > 0.0 && newUV.y < 1.0 && !(i == 0.0 && j == 0.0)){ ',
		'				vec4 posOld = texture2D(vertexPositionsStart, vuv);' ,
		'				vec4 posOld2 = texture2D(vertexPositionsStart, newUV);' ,

		'				float targetDistance = length(posOld - posOld2);',
		'				vec4 newPos =  texture2D(vertexPositions, newUV);',
		'				newPos = transformation *  newPos; ',
		'				float dx = pos.x - newPos.x;',
		'				float dy = pos.y - newPos.y;',
		'				float dz = pos.z - newPos.z;',
		'				float distance = sqrt(dx * dx + dy * dy + dz * dz);',
		'				float difference = targetDistance- distance;',
		'				float percent = difference / distance / 2.0;',
		'				float offsetX = dx * percent * rigid;',
		'				float offsetY = dy * percent * rigid;',
		'				float offsetZ = dz * percent * rigid;',
		'				totalDisplacement.x += offsetX;',
		'				totalDisplacement.y += offsetY;',
		'				totalDisplacement.z += offsetZ;',
		'			}',
		'		}',
		'	}',
		
		'	pos += totalDisplacement;',
		'	if(  vuv.x  > 1.0 - cellSize.x  && topConstrain == 1 ){',
		'		pos =transformation *  texture2D(vertexPositionsStart, vuv.xy );',
		'	}',

		'	if(  vuv.x  < cellSize.x  && bottomConstrain == 1 ){',
		'		pos =transformation *  texture2D(vertexPositionsStart, vuv.xy );',
		'	}',

		'	if(  vuv.y  < cellSize.y  && leftConstrain == 1 ){',
		'		pos =transformation *  texture2D(vertexPositionsStart, vuv.xy );',
		'	}',


		'	if(  vuv.y  > 1.0 - cellSize.y && rightConstrain == 1 ){',
		'		pos =transformation *  texture2D(vertexPositionsStart, vuv.xy );',
		'	}',



			'pos = inverse *  pos; ',
		
		'	gl_FragColor = vec4( pos.xyz , 1.0 );',
	



		'}'
	].join( '\n' )
}
function ClothCollisionShader(){
	this.uniforms =  {
		'color': {
			type: 'c',
			value: null
		},
		'vertexPositions':{
			type: 't',
			value: null,
		},

		'res':{
			type:"v2", value: new THREE.Vector2(100, 100)
		},
		targets:{
			type:"v3v", value:null,
		},

		radii:{
			type:"fv", value:null,
		},
		inverse:{
			type:'m4', value: null
		},
		transformation: {
			type:'m4', value: null
		}
	}
	this.vertexShader  = [

		'varying vec2 vuv;',
		'uniform sampler2D vertexPositions;',
		'void main() {',
		'	vuv = uv;',
		'	gl_Position = projectionMatrix *modelViewMatrix* vec4( position.xyz, 1.0 );',

		'}'
	].join( '\n' )
	this.fragmentShader = [
		'uniform vec3 color;',
		'varying vec2 vuv;',
		'uniform sampler2D vertexPositions;',
		'uniform sampler2D vertexPositionsOld;',
		'uniform vec2 res;',
		'uniform vec3 targets[20];',
		'uniform float radii[20];',
		'uniform mat4 transformation;',
		'uniform mat4 inverse;',
		'void main() {',
		'	vec2 cellSize  = 1.0 / res;',
		'	vec4 pos = texture2D(vertexPositions, vuv.xy );',
		'	pos = transformation * pos;',

		'	for(int i = 0; i < 20; i++){',
		'		vec3 target = targets[i];',
			'	vec3 dist = pos.xyz - target;',

			'	float l = length(dist);',
			'	if(l < radii[i]*1.3 ){',
			'		pos.xyz = target + normalize(dist) * radii[i] * 1.3;',
			'	}',

		'	}',
		
		'	pos = inverse * pos;',
		'	gl_FragColor = vec4(pos.xyz, 1.0);',

		'}'
	].join( '\n' )
}