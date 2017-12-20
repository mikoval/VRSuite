/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.PointerLockControls = function ( camera ) {

	var scope = this;

	camera.rotation.set( 0, 0, 0 );

	var pitchObject = new THREE.Object3D();
	pitchObject.add( camera );

	var yawObject = new THREE.Object3D();
	yawObject.position.y = 10;
	yawObject.add( pitchObject );

	var PI_2 = Math.PI / 2;

	var onMouseMove = function ( event ) {

		if ( scope.enabled === false ) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		yawObject.rotation.y -= movementX * 0.002;
		//pitchObject.rotation.x -= movementY * 0.002;

		//pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );

	};

	this.dispose = function() {

		document.removeEventListener( 'mousemove', onMouseMove, false );

	};

	document.addEventListener( 'mousemove', onMouseMove, false );

	this.enabled = false;

	this.getObject = function () {

		return yawObject;

	};

	this.getDirection = function() {

		// assumes the camera itself is not rotated

		var direction = new THREE.Vector3( 0, 0, - 1 );
		var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );

		return function( v ) {

			rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );

			v.copy( direction ).applyEuler( rotation );

			return v;

		};

	}();

};

var onKeyDown = function ( event ) {
switch ( event.keyCode ) {
	case 38: // up
	case 87: // w
		moveForward = true;
		break;
	case 37: // left
	case 65: // a
		moveLeft = true; break;
	case 40: // down
	case 83: // s
		moveBackward = true;
		break;
	case 39: // right
	case 68: // d
		moveRight = true;
		break;
	case 32: // space
		
		break;
}
};
var onKeyUp = function ( event ) {
switch( event.keyCode ) {
	case 38: // up
	case 87: // w
		moveForward = false;
		break;
	case 37: // left
	case 65: // a
		moveLeft = false;
		break;
	case 40: // down
	case 83: // s
		moveBackward = false;
		break;
	case 39: // right
	case 68: // d
		moveRight = false;
		break;
}
};
document.addEventListener( 'keydown', onKeyDown, false );
document.addEventListener( 'keyup', onKeyUp, false );
window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize() {
	var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
	if(!iOS){
		WIDTH = window.innerWidth;
		HEIGTH = window.innerHeight;
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	}
	
}


