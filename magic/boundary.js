function Boundary ( x, y, w, h ) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
} 

Boundary.prototype.x = 0;
Boundary.prototype.y = 0;
Boundary.prototype.width = 0;
Boundary.prototype.height = 0;

// Returns true if sprite is inside boundary, false otherwise

Boundary.prototype.contains = function( sprite, dx, dy ) {
    var sx = sprite.getRenderX() + dx;
    var sy = sprite.getRenderY() + dy;

    if( sx >= this.x &&
        sy >= this.y &&
        sx + sprite.width <= this.x + this.width &&
        sy + sprite.height <= this.y + this.height ) {
	return true;
    } else {
	return false;
    }
};

Boundary.prototype.render = function( context ) {
    context.rect(this.x, this.y, this.width, this.height);
}
