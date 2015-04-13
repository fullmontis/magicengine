// Groups automate behaviour for large numbers of sprite

// TODO: 
// - add global translation and rotation of group
// - add common resources for whole group for improved performance
//   (example: common image)

function Group() {
    this.group = {};
};

Group.prototype.add = function( spriteName, sprite ) {
    this.group[spriteName] = sprite;
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
    function( otherSprite, otherOffsetX, otherOffsetY ) {
	for( var spriteName in this.group ) {
	    if( this.group[spriteName].collidesWith(
		otherSprite, otherOffsetX, otherOffsetY ) ) {
		return true;
	    }
	}
	return false;
    };

Group.prototype.contains = 
    function( otherSprite, otherOffsetX, otherOffsetY ) {
	for( var spriteName in this.group ) {
	    if( this.group[spriteName].contains(
		otherSprite, otherOffsetX, otherOffsetY) ) {
		return true;
	    }
	}
	return false;
    };

// Add objects on Tiled map layer as sprites (usually used for collision detections

// TODO: use layer names instead of IDs

Group.prototype.createFromLayer = function( map, layerNumber ) {
    var objects = map.layers[layerNumber].objects;
    
    for( var i = 0; i < objects.length; i++ ) {
	this.add( i.toString(), new Sprite(objects[i].x, 
					   objects[i].y, 
					   objects[i].width, 
					   objects[i].height) );
    }
};
