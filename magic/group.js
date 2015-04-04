// Groups automate behaviour for large numbers of sprite

// TODO: 
// - add global translation and rotation of group
// - add common resources for whole group for improved performance
//   (example: common image)

function Group() {
    this.group = {};
};

Group.prototype.add = function( spriteName, x, y, width, height, image, anchorX, anchorY ) {
    this.group[spriteName] = new Sprite( x, y, width, height, image, anchorX, anchorY );
};

Group.prototype.remove = function( spriteName ) {
    if( !this.group.hasOwnProperty( spriteName ) ) {
	console.warn("Group.remove Warning! Trying to remove sprite " 
		     + spriteName + " that doesn't exist!");
    }

    delete this.group[spriteName];
};

Group.prototype.update = function( dt ) {
    for( var spriteName in this.group ) {
	this.group[spriteName].update( dt );
    }
};

Group.prototype.render = function( context ) {
    for( var spriteName in this.group ) {
	this.group[spriteName].render( context );
    }
};

Group.prototype.collidesWith = 
    function( otherSprite, thisOffsetX, thisOffsetY, otherOffsetX, otherOffsetY ) {
	for( var spriteName in this.group ) {
	    var collide = this.group[spriteName].collidesWith(
		otherSprite, thisOffsetX, thisOffsetY, otherOffsetX, otherOffsetY );
	    if( collide ) {
		return true;
	    }
	}
	return false;
    };
