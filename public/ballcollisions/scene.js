WIDTH = document.body.clientWidth;
HEIGHT = document.body.clientHeight;

VIEW_ANGLE = 45;
ASPECT = WIDTH / HEIGHT;
const NEAR = 0.001;
const FAR = 10000;

const div = document.querySelector('#container');

renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
camera =
    new THREE.PerspectiveCamera(
        VIEW_ANGLE,
        ASPECT,
        NEAR,
        FAR
    );
cameraVR = new THREE.PerspectiveCamera(
          VIEW_ANGLE,
          ASPECT,
          NEAR,
          FAR
      );

camera.position.y = 1.0;

effect = undefined;


const scene = new THREE.Scene();
var DirectionalLight  = new THREE.PointLight( 0xFFFFFF , 1.0, 100);
DirectionalLight.castShadow = true
DirectionalLight.position.y = 20;
DirectionalLight.position.x = 3;
DirectionalLight.position.z = 7;

var AmbientLight  = new THREE.AmbientLight( 0x808080 );


scene.add(camera);
scene.add(DirectionalLight)
scene.add(AmbientLight)

renderer.setSize(WIDTH, HEIGHT);

div.appendChild(renderer.domElement);


var loader = new THREE.TextureLoader();
  var  playerTextureColor;
  var  playerTextureNormal;
  var  playerTextureSpecular;
  var  playerTextureReflection;
  var greenTextureColor, greenTextureNormal,greenTextureSpecular, greenTextureDisplacement,
    redTextureColor, redTextureNormal, redTextureSpecular, redTextureDisplacement, 
    blueTextureColor, blueTextureNormal, blueTextureSpecular, blueTextureDisplacement;


  loader.load('/ballcollisions/marble/marble_color.jpg', function ( texture){
      playerTextureColor = texture;
  })
  loader.load('/ballcollisions/marble/marble_norm.jpg', function ( texture){
      playerTextureNormal = texture;
  })
  loader.load('/ballcollisions/marble/marble_gloss.jpg', function ( texture){
      playerTextureSpecular = texture;
  })
  loader.load('/ballcollisions/marble/marble_reflection.jpg', function ( texture){
      playerTextureReflection= texture;
  })
  loader.load('/ballcollisions/red/red_color.jpg', function ( texture){
      redTextureColor = texture;
  })
  loader.load('/ballcollisions/red/red_norm.jpg', function ( texture){
      redTextureNormal = texture;
  })
  loader.load('/ballcollisions/red/red_gloss.jpg', function ( texture){
      redTextureSpecular = texture;
  })
  loader.load('/ballcollisions/red/red_displacement.jpg', function ( texture){
      redTextureDisplacement= texture;
  })

  loader.load('/ballcollisions/blue/blue_color.jpg', function ( texture){
      blueTextureColor = texture;
  })
  loader.load('/ballcollisions/blue/blue_norm.jpg', function ( texture){
      blueTextureNormal = texture;
  })
  loader.load('/ballcollisions/blue/blue_gloss.jpg', function ( texture){
      blueTextureSpecular = texture;
  })
  loader.load('/ballcollisions/blue/blue_displacement.jpg', function ( texture){
      blueTextureDisplacement= texture;
  })

  loader.load('/ballcollisions/green/green_color.jpg', function ( texture){
      greenTextureColor = texture;
  })
  loader.load('/ballcollisions/green/green_norm.jpg', function ( texture){
      greenTextureNormal = texture;
  })
  loader.load('/ballcollisions/green/green_gloss.jpg', function ( texture){
      greenTextureSpecular = texture;
  })
  loader.load('/ballcollisions/green/green_displacement.jpg', function ( texture){
      greenTextureDisplacement= texture;
  })


function load(res, size, type){

  if(mobile){

     effect= new THREE.StereoEffect(renderer);
    
  }
  if(!greenTextureColor || !greenTextureNormal  || !greenTextureSpecular  || !greenTextureDisplacement 
    ||!redTextureColor  || !redTextureNormal  || !redTextureSpecular  || !redTextureDisplacement 
    ||!blueTextureColor  || !blueTextureNormal  || !blueTextureSpecular  || !blueTextureDisplacement){
    setTimeout(function(){ load(res, size)}, 300);
   
  }
  else{
    console.log("starting");
    if(game == undefined)
      game  = new Game(scene, camera,res, size, type);
    var starting = true;
  }

}
function callLoad(res, size, type){
  setTimeout(function(){ load(res, size, type)}, 500);
}
var game = undefined;

callLoad(1024, 32, 'rigid')

  



function update () {
  if(game){
     game.update();

       if(effect){
          //console.log(controls);
        
          if(controls != undefined){
            controls.update();

            if(quaternion != undefined){
              var quat = new  THREE.Quaternion()
              
              quaternion = new THREE.Quaternion();
              quaternion._x = camera.quaternion._x;
              quaternion._y = camera.quaternion._y;
              quaternion._z = camera.quaternion._z;
              quaternion._w = camera.quaternion._w;
              quat.multiplyQuaternions (quaternion, cameraVR.quaternion )
              

              
            
              camera.quaternion._x = quat._x;
              camera.quaternion._y = quat._y;
              camera.quaternion._z = quat._z;
              camera.quaternion._w = quat._w;
              
            }
            
          }
        
          effect.render(scene, camera);
        }
        else{
          renderer.render(scene, camera);
        }
  }
 

  requestAnimationFrame(update);
}

requestAnimationFrame(update);