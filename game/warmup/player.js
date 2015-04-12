function Player( x, y, w, h, image ) {
    this.image = image;
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    
    this.speed = 6;

    this.update = function( bound, keys ) {
	var posx = 0;
	var posy = 0;

	if(keys.isDown['left']) { posx -= this.speed; }
	if(keys.isDown['right']) { posx += this.speed; }
	if(keys.isDown['up']) { posy -= this.speed; }
	if(keys.isDown['down']) { posy += this.speed; }

	if( !bound.contains(this, posx, 0) ) {
	    posx = 0;
	}

	if( !bound.contains(this, 0, posy) ) {
	    posy = 0;
	}
	
	this.x += posx;
	this.y += posy;
    };
}

Player.prototype = new Sprite();
