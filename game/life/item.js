// Item that appears on screen

function Item( x, y, name ) {
    this.x = x;
    this.y = y;
    this.width = 16;
    this.height = 16;
    this.name = name;
    this.showName = false;
    this.anchor = {
	x: 0.5,
	y: 0.5
    };

    this.update = function( player ) {
	if( player.collidesWith(this) ) {
	    this.showName = true;
	} else {
	    this.showName = false;
	}
    };

    this.render = function( context ) {
	if( this.showName ) {
	    context.text( this.name, this.x, this.y );
	}
    };
}

Item.prototype = new Sprite();
