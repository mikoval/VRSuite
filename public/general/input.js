input = {up:false, down:false, left:false, right:false, home: false};
$(document).keydown(function(e) {
    if(input == undefined){
        input = {up:false, down:false, left:false, right:false, home: false};
    }
    if(e.keyCode == 87|| e.key =="up"|| e.key == "ArrowUp"){
    	input.up = true;
    }
    if(e.keyCode == 68|| e.key =="right"|| e.key == "ArrowRight"){
    	input.right = true;
    }
    if(e.keyCode == 65|| e.key =="left"|| e.key == "ArrowLeft"){
    	input.left = true;
    }
    if(e.keyCode == 83|| e.key =="down"|| e.key == "ArrowDown"){
    	input.down = true;
    }

    if(e.keyCode == 32 ||e.key == " "){
    	input.jump = true;
    }
    if(e.keyCode == 81 || e.key == "q"){
    	input.home = true;
    }
});
$(document).keyup(function(e) {
    if(e.keyCode == 87|| e.key =="up"|| e.key == "ArrowUp"){
    	input.up = false;
    }
    if(e.keyCode == 68|| e.key =="right"|| e.key == "ArrowRight"){
    	input.right = false;
    }
    if(e.keyCode == 65|| e.key =="left"|| e.key == "ArrowLeft"){
    	input.left = false;
    }
    if(e.keyCode == 83|| e.key =="down"|| e.key == "ArrowDown"){
    	input.down = false;
    }
    if(e.keyCode == 32 ||e.key == " "){
    	input.jump = false;
    }
    if(e.keyCode == 81 || e.key == "q"){
    	input.home = false;
    }
});