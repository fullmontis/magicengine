function Tileset( image, tileWidth, tileHeight ) {
    this.image = image;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.tileNumberX = (this.image.width / tileWidth) | 0;
    this.tileNumberY = (this.image.height / tileHeight) | 0;

    if( this.tileNumberX * this.tileWidth != this.image.width ||
	this.tileNumberY * this.tileHeight != this.image.height ) {
	    throw("Tileset: error: wrong tile size!");
	}

    this.render = function( context, tileId, x, y ) {
	var tileX = (tileId % this.tileNumberX) * this.tileWidth;
	var tileY = ((tileId / this.tileNumberX) | 0) * this.tileHeight;
	context.drawImage( this.image, 
			   tileX, tileY, 
			   this.tileWidth, this.tileHeight,
			   x, y, 
			   this.tileWidth, this.tileHeight );
    };
}

function Map( mapObject, tileset ) {
    this.map = mapObject;
    this.tileset = tileset;

    this.render = function( context, levelId, x, y ) {
	levelId = levelId | 0;
	x = x | 0;
	y = y | 0;

	var level = this.map.layers[levelId].data;
	var lWidth = this.map.layers[levelId].width;
	var lHeight = this.map.layers[levelId].height;

	var tw = this.tileset.tileWidth;
	var th = this.tileset.tileHeight;

	for( var yy=0; yy < lHeight ; yy++ ) {
	    for( var xx=0; xx < lWidth ; xx++ ) {
		tileset.render( context, level[xx + yy * lWidth], 
				x + xx * tw, y + yy * th );
	    }
	}
    };
}
