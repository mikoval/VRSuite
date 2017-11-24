var input = {up:false, down:false, left:false, right:false, home: false};
$(document).keydown(function(e) {
    if(e.key == "w"|| e.key =="up"|| e.key == "ArrowUp"){
    	input.up = true;
    }
    if(e.key == "d"|| e.key =="right"|| e.key == "ArrowRight"){
    	input.right = true;
    }
    if(e.key == "a"|| e.key =="left"|| e.key == "ArrowLeft"){
    	input.left = true;
    }
    if(e.key == "s"|| e.key =="down"|| e.key == "ArrowDown"){
    	input.down = true;
    }

    if(e.key == " "){
    	input.jump = true;
    }
    if(e.key == "q"){
    	input.home = true;
    }
});
$(document).keyup(function(e) {
    if(e.key == "w"|| e.key =="up" || e.key == "ArrowUp"){
    	input.up = false;
    }
    if(e.key == "d"|| e.key =="right" || e.key == "ArrowRight"){
    	input.right = false;
    }
    if(e.key == "a"|| e.key =="left"|| e.key == "ArrowLeft"){
    	input.left = false;
    }
    if(e.key == "s"|| e.key =="down"|| e.key == "ArrowDown"){
    	input.down = false;
    }
    if(e.key == " "){
    	input.jump = false;
    }
    if(e.key == "q"){
    	input.home = false;
    }
});