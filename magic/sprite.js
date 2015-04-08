// Sprite 

var SPRITE_NO_IMG = -1;

function Sprite( x, y, width, height, image, anchorX, anchorY ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = image;
    this.anchor.x = anchorX || 0; 
    this.anchor.y = anchorY || anchorX || 0;
}

Sprite.prototype.x = 0;
Sprite.prototype.y = 0;
Sprite.prototype.width = 16;
Sprite.prototype.height = 16;

// angle is in radians, because it allows easier computations

Sprite.prototype.angle = 0;

// image must be a proper image link
// If image == -1, it renders a rectangle filled with the color 
// defined by Sprite.prototype.fill

// This makes using debug graphics much easier and quick when prototyping
// or for placeholder graphics

Sprite.prototype.image = -1;
Sprite.prototype.fill = '#f00';

// anchor point represents the point on the sprite where the x and y are positioned
// value goes from 0 to 1

Sprite.prototype.anchor = {};
Sprite.prototype.anchor.x = 0; // 0: left, 1: right
Sprite.prototype.anchor.y = 0; // 0: top, 1: bottom

// getRenderX and getRenderY calcucate the x and y considering the anchor point. 
// This is to avoid annoying computations when writing rendering code

Sprite.prototype.getRenderX = function() {
    return this.x - Math.floor(this.anchor.x * this.width);
};

Sprite.prototype.getRenderY = function() {
    return this.y - Math.floor(this.anchor.y * this.height);
};

// The Sprite.prototype.update function is not called anywhere by default. 
// Any update process is left to the developer

Sprite.prototype.update = function( dt ) {};

// Context is passed as variable to avoid any "magic" happening with global 
// variables and keep code more readable

// Image is rendered to the size determined by Sprite.prototype.width and height.
// For any alternative behaviour, it is possible to overload the render function
// in the instance of the object.

// TODO: add sprite rotation

Sprite.prototype.render = function( context ) {
    if( this.image != -1 ) {
	context.drawImage( this.image, 
			   this.getRenderX(), this.getRenderY(), 
			   this.width, this.height );
    } else {
	context.rect( this.getRenderX(), this.getRenderY(), 
		      this.width, this.height, this.fill );
    } 
};

// checks collision with another sprite

Sprite.prototype.collidesWith = 
    function( otherSprite, thisOffsetX, thisOffsetY, otherOffsetX, otherOffsetY ) {
	thisOffsetX = thisOffsetX || 0;
	thisOffsetY = thisOffsetY || 0;
	otherOffsetX = otherOffsetX || 0;
	otherOffsetY = otherOffsetY || 0;

	var x1 = this.getRenderX() + thisOffsetX;
	var y1 = this.getRenderY() + thisOffsetY;
	var w1 = this.width;
	var h1 = this.height;

	var x2 = otherSprite.getRenderX() + otherOffsetX;
	var y2 = otherSprite.getRenderY() + otherOffsetY;
	var w2 = otherSprite.width;
	var h2 = otherSprite.height;

	if( x1 < x2 + w2 &&
	    x1 + w1 > x2 &&
	    y1 < y2 + h2 &&
	    y1 + h1 > y2 ){
		return true;
	    } else {
		return false; 
	    }
    };
