// Todo: wrap text (maybe in textbox class?)

function Font( bitmap, fontChars, fontWidth, fontHeight, fontSpace, fontBottom ) {
    this.bitmap = bitmap;
    this.fontChars = fontChars;
    this.fontWidth = fontWidth;
    this.fontHeight = fontHeight;
    this.fontSpace = fontSpace;
    this.fontBottom = fontBottom; // number of pixels from the bottom of the front 
                                  // on which we have the baseline
    
    // Some check to see that the input data is right
    
    if( this.bitmap.width % (this.fontWidth + this.fontSpace) != 0 ) { // length is not right!
	throw("Font: Error: font width and bitmap size don't match!");
    }

    // Here we hash the font so that rendering is faster

    this.hash = {};
    var nCharsInLine = this.bitmap.width / (this.fontWidth + this.fontSpace);
    var x = 0;
    var y = 0;
    for( var i=0; i < this.fontChars.length; i++ ) {
	x = i % nCharsInLine;
	y = (i / nCharsInLine) | 0;
	this.hash[this.fontChars.charCodeAt(i)] = [ 
	    x * (this.fontWidth  + this.fontSpace) + this.fontSpace,
	    y * (this.fontHeight + this.fontSpace) + this.fontSpace
	];
    }
    
    this.render = function( context, string, x, y, scale ) {
	scale = scale || 1;
	for( var i=0; i < string.length; i++ ) {
	    if( string[i] != ' ' ) { // no need to waste time rendering spaces :D
		context.drawImage( this.bitmap, 
				   this.hash[string.charCodeAt(i)][0], 
				   this.hash[string.charCodeAt(i)][1],
				   this.fontWidth, this.fontHeight,
				   x + i * (this.fontWidth + this.fontSpace) * scale, 
				   y - this.fontBottom * scale,
				   this.fontWidth * scale, this.fontHeight * scale );
	    }
	}
    };
}


