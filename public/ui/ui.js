function button(x, y, z, width, height, depth,  text){
	
	var x = x;
	var y = y;
	var z = z;
	this.val = text;

	this.addBox = function(){
		var uniforms = {
		    time: { type: "f", value: 0},
		    width: { type: "f", value: width },
		    height: { type: "f", value: height},
		    depth: { type: "f", value: depth },
		    hover: { type: "f", value: 0 },
		    resolution: { type: "v2", value: new THREE.Vector2 },
		};

		var material = new THREE.ShaderMaterial({
		    uniforms: uniforms,
		    vertexShader: document.getElementById('cubeVertexShader').innerHTML,
		    fragmentShader: document.getElementById('cubeFragmentShader').innerHTML,
		    transparent: true,
		});
		

		

		var geometry = new THREE.BoxGeometry(width, height,depth, 10, 10, 10);
		var obj = new THREE.Mesh(geometry, material);
		obj.target = this;

		obj.material.side = THREE.DoubleSide;
		obj.position.x = x,
		obj.position.y = y,
		obj.position.z = z;
		this.object = obj;
		scene.add(obj);
	}
	this.addText = function(){
		var geometry = new THREE.TextGeometry( text, {
			font: font,
			size: 5,
			height: 1,
			curveSegments: 12,
			bevelEnabled: true,
			bevelThickness: .1,
			bevelSize: .1,
			bevelSegments: 1
		} );

		var material  = new THREE.MeshPhongMaterial({color: 0x8866DD});
		var mesh = new THREE.Mesh(geometry, material);
		mesh.position.x = x;
		mesh.position.y = y;
		mesh.position.z = z;

		this.text = mesh;
		this.centerText();
		scene.add(mesh);
	
	}
	this.centerText = function(){
		var cx = 0;
		var cy = 0;
		var cz = 0;
		var verts = this.text.geometry.vertices;
		for(var i = 0; i < verts.length; i++){
			cx += verts[i].x;
			cy += verts[i].y;
			cz += verts[i].z;
		}
		cx /= verts.length; 
		cy /= verts.length; 
		cz /= verts.length; 
		for(var i = 0; i < verts.length; i++){
			verts[i].x -= cx;
			verts[i].y -= cy;
			verts[i].z -= cz;
		}
	}

	this.addBox();
	this.addText();

}
var raycaster = new THREE.Raycaster();
function cursor(){

	var material = new THREE.MeshPhongMaterial();
	var geometry = new THREE.SphereGeometry(0.1, 16, 16);
	var sphere = new THREE.Mesh(geometry, material);

	sphere.position.z = -100;
	this.obj  = sphere;
	scene.add(sphere)

	var ctx = this;
	$(document).on("mousemove", function(event){
		 event.preventDefault();
		 var mouse = {}
	    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
		var vector = new THREE.Vector3(mouse.x, mouse.y, 1.0);

		vector.unproject( camera );
		var dir = vector.sub( camera.position ).normalize();
		var distance = - camera.position.z / dir.z;
		var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );

		//console.log(pos);
		ctx.obj.position.x = pos.x;
		ctx.obj.position.y = pos.y;
		ctx.obj.position.z = pos.z;


		
		checkHover();


	})

	$(document).on("click", function(event){
		checkClick();
	})

}
function checkHover(){
		var origin = camera.position.clone();
		var dir = curs.obj.position.clone().sub(origin);
		dir = dir.normalize();
		computeHover(origin, dir);
}
function checkClick(){
		var origin = camera.position.clone();
		var dir = curs.obj.position.clone().sub(origin);
		dir = dir.normalize();
		// update the picking ray with the camera and mouse position



		raycaster.set( origin, dir );

		// calculate objects intersecting the picking ray
		var btns = [];
		for(var i = 0; i < buttons.length; i++){
			buttons[i].object.material.uniforms.hover.value = 0;
			btns.push(buttons[i].object)
		}
		var intersects = raycaster.intersectObjects( btns );
		//console.log(intersects.length)

		if(intersects.length > 0){
			var txt = intersects[0].object.target.val;
			if(txt == "Movie Theater"){
				window.location  = "/movie";
			}
			else if(txt == "Ball Collisions"){
				window.location  = "/collisions";
			}
		}

		
}
function computeHover(o, d){
	// update the picking ray with the camera and mouse position
	raycaster.set( o, d );

	// calculate objects intersecting the picking ray
	var btns = [];
	for(var i = 0; i < buttons.length; i++){
		buttons[i].object.material.uniforms.hover.value = 0;
		btns.push(buttons[i].object)
	}
	var intersects = raycaster.intersectObjects( btns );
	//console.log(intersects.length)



	for ( var i = 0; i < intersects.length; i++ ) {

		intersects[ i ].object.material.uniforms.hover.value = 1;

	}
}