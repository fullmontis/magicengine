// Mouse input

function Mouse( canvas ) {
    
    this.canvas = canvas;

    this.x = 0; 
    this.y = 0;
    this.dx = 0; 
    this.dy = 0;
    
    var buttonObject = {
	isDown: false,
	isClicked: false,
	isReleased: false
    };

    this.left = buttonObject;
    this.middle = buttonObject;
    this.right = buttonObject;

    var xold = 0;
    var yold = 0;
    var lold = 0;
    var mold = 0;
    var rold = 0;

    this.update = function () {
	if (this.left.isDown && !lold) { 
	    this.left.isClicked = true; 
	} else { 
	    this.left.isClicked = false; 
	}

	if (this.middle.isDown && !mold) { 
	    this.middle.isClicked = true; 
	} else { 
	    this.middle.isClicked = false; 
	}

	if (this.right.isDown && !rold) { 
	    this.right.isClicked = true; 
	} else { 
	    this.right.isClicked = false; 
	}

	if (!this.left.isDown && lold) { 
	    this.left.isReleased = true; 
	} else { 
	    this.left.isReleased = false; 
	}

	if (!this.middle.isDown && mold) { 
	    this.middle.isReleased = true; 
	} else { 
	    this.middle.isReleased = false; 
	}

	if (!this.right.isDown && rold) { 
	    this.right.isReleased = true; 
	} else { 
	    this.right.isReleased = false; 
	}
	
	lold = this.left.isDown;
	mold = this.middle.isDown;
	rold = this.right.isDown;
	
	this.dx = this.x - xold;
	this.dy = this.y - yold;
	
	xold = this.x;
	yold = this.y;
    };

    this.canvas.addEventListener( 'mousemove', function(e){
	this.x = e.pageX - this.canvas.offsetLeft;
	this.y = e.pageY - this.canvas.offsetTop;
    }.bind(this), false);

    this.canvas.addEventListener( 'mousedown', function(e){
	e.preventDefault();
	if (e.which == 1) { this.left.isDown = true; }
	if (e.which == 2) { this.middle.isDown = true; }
	if (e.which == 3) { this.right.isDown = true; }
    }.bind(this), false);

    this.canvas.addEventListener( 'mouseup', function(e){
	e.preventDefault();
	if (e.which == 1) { this.left.isDown = false; }
	if (e.which == 2) { this.middle.isDown = false; }
	if (e.which == 3) { this.right.isDown = false; }
    }.bind(this), false);

}
