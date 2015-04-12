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

    // caching tile data

    this.hash = {};
    var tileId = 0;
    for( var ty = 0; ty < this.tileNumberY; ty++ ) {
	for( var tx = 0; tx < this.tileNumberX; tx++ ) {
	    tileId = ty * this.tileNumberY + tx;
	    this.hash[tileId] = [
		tx * this.tileWidth,
		ty * this.tileHeight
	    ];
	}	
    }

    this.render = function( context, tileId, x, y, firstgid ) {
	if( tileId >= 0 ) { // only draw acceptable tiles, ignore the others
	    context.drawImage( this.image, 
			       this.hash[tileId][0], 
			       this.hash[tileId][1], 
			       this.tileWidth, this.tileHeight,
			       x, y, 
			       this.tileWidth, this.tileHeight );
	}
    };
}

function Map( mapObject, tileset ) {
    this.map = mapObject;
    this.tileset = tileset;

    this.render = function( context, levelId, x, y, firstgid ) {
	levelId = levelId || 0;
	x = x || 0;
	y = y || 0;

	// firstgid works as an offset used by Tiled to correspond the
	// tile ID on the map and the tile ID on the tileset

	// If there are no empty tiles in the map, it defaults to
	// 0. In case of at least one empty tile present, it defaults
	// to 1

	// TODO: get a better positioning for firstgid. It is
	// technically a property of the map, but it influences the
	// single tileset, so maybe it belongs there

	firstgid = firstgid || 0;

	var level = this.map.layers[levelId].data;
	var lWidth = this.map.layers[levelId].width;
	var lHeight = this.map.layers[levelId].height;

	var tw = this.tileset.tileWidth;
	var th = this.tileset.tileHeight;

	// we subtract firstgid from the tileId to get the real id on the tileset
	

	for( var yy=0; yy < lHeight ; yy++ ) {
	    for( var xx=0; xx < lWidth ; xx++ ) {
		tileset.render( context, level[xx + yy * lWidth] - firstgid,
				x + xx * tw, y + yy * th );
	    }
	}
    };
}
