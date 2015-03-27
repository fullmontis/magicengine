/*
 MagicEngine: an HTML5 framework for rapid prototyping

 TODO:
 - Tiled map display and management
 - Sound extension
 - State Manager
 - Randomizers
 - remove bindings to functions since they are ugly as hell and make the source unreadable
 - remove _this variable
 - put input on separate class
 - create class for State
*/

// canvas API extension

(function () {
    Audio.prototype.playFromStart = function() {
	this.currentTime = 0;
	this.play();
    };

    CanvasRenderingContext2D.prototype.fillColor = "#ccc"; 

    CanvasRenderingContext2D.prototype.rect = 
	function( x, y, w, h, color, alpha, stroke ) {
	    if( x === undefined ||
		y === undefined ||
		w === undefined ||
		h === undefined ) {
		throw "ERROR: RECT: missing variable";
	    }
	    this.save();
	    this.fillStyle = color || "#000";
	    this.strokeStyle = color || "#000";
	    if( alpha == 0 ) { 
		this.globalAlpha = 0; 
	    } else {
		this.globalAlpha = alpha || 1; 	
	    };
	    if( stroke ) {
		this.strokeRect( x, y, w, h );
	    } else {
		this.fillRect( x, y, w, h );
	    }

	    this.restore();
	};

    CanvasRenderingContext2D.prototype.circle = 
	function( x, y, radius, color, alpha ) {
	    if( x === undefined ||
		y === undefined ||
		radius === undefined ) {
		throw "ERROR: CIRCLE: missing variable";
	    }
	    this.save();
	    this.fillStyle = color || "#000";
	    if( alpha == 0 ) { 
		this.globalAlpha = 0; 
	    } else {
		this.globalAlpha = alpha || 1; 	
	    };
	    this.beginPath();
	    this.arc( x, y, radius, 0, 2*Math.PI );
	    this.fill();
	    this.restore();
	};

    CanvasRenderingContext2D.prototype.line = 
	function( x1, y1, x2, y2, color, alpha ) {
	    if( x1 === undefined ||
		y1 === undefined ||
	        x2 === undefined ||
		y2 === undefined ) {
		throw "ERROR: LINE: missing variable";
	    }

	    this.save();
	    this.strokeStyle = color || "#000";
	    if( alpha == 0 ) { 
		this.globalAlpha = 0; 
	    } else {
		this.globalAlpha = alpha || 1; 	
	    };
	    this.beginPath();
	    this.moveTo( x1, y1 );
	    this.lineTo( x2, y2 );
	    this.stroke();
	    this.restore();
	};

    CanvasRenderingContext2D.prototype.text = 
	function( text, x, y, color, alpha, font ) {
	    if( x === undefined ||
		y === undefined ||
		text === undefined ) {
		throw "ERROR: TEXT: missing variable";
	    }

	    this.save();
	    this.font = font || this.font;
	    this.fillStyle = color || "#000";

	    if( alpha == 0 ) { 
		this.globalAlpha = 0; 
	    } else {
		this.globalAlpha = alpha || 1; 	
	    };

	    this.fillText( text, x, y );
	    this.restore();
	};

    CanvasRenderingContext2D.prototype.fill = 
	function() {
	    this.rect( 0, 0, 
		       this.canvas.width, this.canvas.height, 
		       this.fillColor );
	};
})();

// Main class

function Magic( width, height, parentId, lockMouse ) {

    var _this = this; // used for reference in objects, ugly as death, must remove

    this.preload = function() {};

    // Find useable audio extensions for the browser
    this.audioCodec = (function() {
	var audio = document.createElement("audio");
	var canplayogg = (typeof audio.canPlayType === "function" && 
			  audio.canPlayType("audio/ogg") !== "");

	if (canplayogg) {
            return "ogg";
	} else {
            return "aac";
	}
    })();

    // game logic update frequency
    this.FPS = 60;

    // The main canvas element on which we are going to operate
    this.canvas = document.createElement('canvas');

    // inject canvas into DOM
    document.getElementById(parentId).appendChild(this.canvas);
    this.canvas.width = width;
    this.canvas.height = height;

    this.canvas.oncontextmenu = function() { return false; };
 
    // mouse pointer locking
 
    if( lockMouse ) {
	this.canvas.requestPointerLock = this.canvas.requestPointerLock ||
            this.canvas.mozRequestPointerLock ||
            this.canvas.webkitRequestPointerLock;

	document.exitPointerLock = document.exitPointerLock ||
            document.mozExitPointerLock ||
            document.webkitExitPointerLock;
	
	this.canvas.onclick = function() {
	    this.canvas.requestPointerLock();
	}.bind(this);
    }

    this.context = this.canvas.getContext('2d');
    this.context.font = "30px Arial";

    // background color
    this.context.fillColor = '#fff';

    // State management

    // Each State has 4 main functions:
    // - create, where the resources are loaded
    // - update, where the game logic happens
    // - render, where the stuff is printed on the screen

    // TODO: add destroy(), destroyUpdate(), destroyRender(), 
    // createUpdate(), createRender() to the functions of each state
    
    // Boot is a special state used for the loading screen
    // Game is the main game state,a nd the default the game is in 
    // after boot

    this.state = {
	boot: {},
	game: {},
	current: 'boot',
	changeTo: function( newState ) {
	    this.current = newState;
	    this[this.current].create();
	},
	getCurrent: function() {
	    return this[this.current];
	},

	// this acts as a wrapper for the current state
	// it is required for state change transitions
	update: function() {
	    this.getCurrent().update();
	},
	render: function( context ) {
	    this.getCurrent().render( context );
	}
    };

    this.state['boot'].update = function() {
	this.loaded = _this.load.complete.length/_this.load.pending.length;
    };

    this.state['boot'].render = function( context ) {
	context.drawImage(this.img, 50, 50);
	context.text('A GAME BY', 200, 150, '#000', 1, '20px arial ');
	context.text('FULLMONTIS', 200, 180);

	var barWidth = _this.canvas.width - 20;
	var barHeight = 10;
	var barX = 10;
	var barY = _this.canvas.height - 20;
	context.rect( barX-1.5, barY-1.5, barWidth+3, barHeight+3, '#666', 1, true );
	context.rect( barX, barY, barWidth*this.loaded, barHeight, '#333' );
    };

    this.state['game'].update = function() {
    };

    this.state['game'].render = function() {
    };

    // Game starts here
    this.start = function() {
	this.state['boot'].img = new Image();
	this.state['boot'].img.onload = this.preloadWrapper.bind(this);
	this.state['boot'].img.src = 'img/boot.png';
    };


    // Assets loading and management

    this.load = {};
    this.image = {};
    this.sound = {};
    this.map   = {};

    // the list to which complete files will go
    this.load.complete = []; 
    this.load.pending  = [];

    // Callback function used for data loading success
    this.loaded = function( itemId, type, file ) {
	return function() {
	    this.load.complete.push(itemId);
	    
	    if( type == 'map' && file != undefined ) {
		this.map[itemId] = file;
	    };
	    
	    if( this.load.complete.length == this.load.pending.length ){
		// remove all callbacks from loaded sounds
		// this is to avoid the sound triggering it when reloading it
		for( var soundId in this.sound ){ 
		    this.sound[soundId].oncanplaythrough = undefined;
		}
		
		// start the actual game
		this.state.changeTo('game');
	    }
	}.bind(this);
    };
 
    this.load.image = function( imageId, url ) {
	this.image[imageId] = new Image();
	this.image[imageId].onload = this.loaded(imageId);
	this.image[imageId].src = url;
	this.load.pending.push(imageId);
    }.bind(this);

    this.load.sound = function( soundId, oggUrl, aacUrl ) {
	var url;
	if( this.audioCodec == 'ogg' ) url = oggUrl; else url = aacUrl;
	this.sound[soundId] = new Audio();
	this.sound[soundId].oncanplaythrough = this.loaded(soundId);
	this.sound[soundId].src = url;
	this.load.pending.push(soundId);
    }.bind(this);

    this.load.map = function( mapId, url ) {
	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function() {
	    if( xhr.readyState == 4 ) {
		this.loaded( mapId, 'map', JSON.parse(xhr.responseText) )();
	    }
	}.bind(this);

	xhr.open('GET', url, true);
	xhr.send();

	this.load.pending.push(mapId);
    }.bind(this);
    
    // The main game loop

    this.mainLoop = function () {
	// set timeout for game logic
	setTimeout( this.updateWrapper.bind(this), 1000 / this.FPS );

	// call next frame
	requestAnimationFrame( this.renderWrapper.bind(this) );
    };

    this.preloadWrapper = function() {
	this.preload();
	this.mainLoop();
    };

    this.updateWrapper = function() {
	this.mouse.update();
	this.state.update();
	this.keyboard.clear();
	setTimeout( this.updateWrapper.bind(this), 1000 / this.FPS );
    };

    this.renderWrapper = function() {
	this.context.fill();
	this.state.render( this.context );
	requestAnimationFrame( this.renderWrapper.bind(this) );
    };

    // Input

    // Mouse input
    this.mouse = (function( magic ){
	var mouse = { 
	    x: 0, 
	    y: 0,
	    left: {
		isDown: false,
		isClicked: false,
		isReleased: false
	    },
	    middle: {
		isDown: false,
		isClicked: false,
		isReleased: false
	    },
	    right: {
		isDown: false,
		isClicked: false,
		isReleased: false
	    }
	};

	var xold = 0;
	var yold = 0;
	var lold = 0;
	var mold = 0;
	var rold = 0;

	mouse.update = function () {
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

	magic.canvas.addEventListener( 'mousemove', function(e){
	    this.mouse.x = e.pageX - this.canvas.offsetLeft;
	    this.mouse.y = e.pageY - this.canvas.offsetTop;
	}.bind(magic), false);

	magic.canvas.addEventListener( 'mousedown', function(e){
	    e.preventDefault();
	    if (e.which == 1) { this.mouse.left.isDown = true; }
	    if (e.which == 2) { this.mouse.middle.isDown = true; }
	    if (e.which == 3) { this.mouse.right.isDown = true; }
	}.bind(magic), false);

	magic.canvas.addEventListener( 'mouseup', function(e){
	    e.preventDefault();
	    if (e.which == 1) { this.mouse.left.isDown = false; }
	    if (e.which == 2) { this.mouse.middle.isDown = false; }
	    if (e.which == 3) { this.mouse.right.isDown = false; }
	}.bind(magic), false);

	return mouse;
    })(this);

    // Keyboard input
    // Globals: document
    this.keyboard = (function () {
	var keys = {
	    isDown: {},
	    isPressed: {},
	    isReleased: {},
	    clear: function() {
		this.isPressed = {};
		this.isReleased = {};
	    }
	};

	var keymap = ['', '', '', 'cancel', '', '', 'help', '', 'back_space', 'tab', '', '', 'clear', 'enter', 'enter_special', '', 'shift', 'control', 'alt', 'pause', 'caps_lock', 'kana', 'eisu', 'junja', 'final', 'hanja', '', 'escape', 'convert', 'nonconvert', 'accept', 'modechange', 'space', 'page_up', 'page_down', 'end', 'home', 'left', 'up', 'right', 'down', 'select', 'print', 'execute', 'printscreen', 'insert', 'delete', '', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'colon', 'semicolon', 'less_than', 'equals', 'greater_than', 'question_mark', 'at', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'win', '', 'context_menu', '', 'sleep', 'numpad0', 'numpad1', 'numpad2', 'numpad3', 'numpad4', 'numpad5', 'numpad6', 'numpad7', 'numpad8', 'numpad9', 'multiply', 'add', 'separator', 'subtract', 'decimal', 'divide', 'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11', 'f12', 'f13', 'f14', 'f15', 'f16', 'f17', 'f18', 'f19', 'f20', 'f21', 'f22', 'f23', 'f24', '', '', '', '', '', '', '', '', 'num_lock', 'scroll_lock', 'win_oem_fj_jisho', 'win_oem_fj_masshou', 'win_oem_fj_touroku', 'win_oem_fj_loya', 'win_oem_fj_roya', '', '', '', '', '', '', '', '', '', 'circumflex', 'exclamation', 'double_quote', 'hash', 'dollar', 'percent', 'ampersand', 'underscore', 'open_paren', 'close_paren', 'asterisk', 'plus', 'pipe', 'hyphen_minus', 'open_curly_bracket', 'close_curly_bracket', 'tilde', '', '', '', '', 'volume_mute', 'volume_down', 'volume_up', '', '', 'semicolon', 'equals', 'comma', 'minus', 'period', 'slash', 'back_quote', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'open_bracket', 'back_slash', 'close_bracket', 'quote', '', 'meta', 'altgr', '', 'win_ico_help', 'win_ico_00', '', 'win_ico_clear', '', '', 'win_oem_reset', 'win_oem_jump', 'win_oem_pa1', 'win_oem_pa2', 'win_oem_pa3', 'win_oem_wsctrl', 'win_oem_cusel', 'win_oem_attn', 'win_oem_finish', 'win_oem_copy', 'win_oem_auto', 'win_oem_enlw', 'win_oem_backtab', 'attn', 'crsel', 'exsel', 'ereof', 'play', 'zoom', '', 'pa1', 'win_oem_clear', ''];

	document.addEventListener( 'keydown', (function(e) {
	    var key = keymap[e.keyCode];
	    if (this.isDown[key]) {
		this.isPressed[key] = false;
	    } else {
		this.isPressed[key] = true;
	    }
	    this.isDown[key] = true;
	}).bind(keys), false); // bind necessary so that this refers to keys object

	document.addEventListener( 'keyup', (function(e) {
	    var key = keymap[e.keyCode];
	    if (!this.isDown[key]) {
		this.isReleased[key] = false;
	    } else {
		this.isReleased[key] = true;
	    }
	    this.isDown[key] = false;
	}).bind(keys), false);

	return keys;
    })();
}

// Sprite 

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

// Randomizers

// These are just a simple set of tools useful for fast game prototyping

// Roll dices

function roll( faceNumber, diceNumber, startFrom ) {
	startFrom = startFrom || 0;
	diceNumber = diceNumber || 1;

	var total = 0;
	
	for( var i=0; i < diceNumber; i++ ) {
	    total += Math.floor(Math.random() * faceNumber) + startFrom; 
	}

	return total;
};

// Create a deck of cards
// cards is an array. cards[0] is the top of the deck, 
// cards[cards.length-1] is the bottom

function Deck( cards ) {
    this.cardsOriginal = cards;
    this.reset();
}

Deck.prototype.cards = [];
Deck.prototype.cardsOriginal = [];

// generates an array 0..cardNumber-1 to be substituted for the deck
// overwrites the deck defined in the constructot
// not very elegant, could be improved

Deck.prototype.generate = function( cardNumber ) {
    var deck = [];
    
    for( var i = 0; i<cardNumber; i++ ) {
	deck[i] = i;
    }
    
    this.cardsOriginal = deck;
    this.cards = deck;
};

// Pick card from deck, without changing anything

Deck.prototype.pick = function( pos ) {
    pos = pos || 0;
    if( pos > this.cards.length ) pos = this.cards.length;
    return this.cards[pos];
};

// Pick card and remove it from deck

Deck.prototype.take = function( pos ) {
    pos = pos || 0;
    if( pos > this.cards.length ) pos = this.cards.length;
    return this.cards.splice( pos, 1 )[0];
};

// Shuffle the deck

Deck.prototype.shuffle = function() {
    for( var i=0; i<this.cards.length; i++ ) { // TODO: how many iterations are necessary?
	var pos = roll( this.cards.length-1, 1, 1 );
	var temp = this.cards[pos];
	this.cards[pos] = this.cards[0];
	this.cards[0] = temp;
    }
};

// restore the original card configuration

Deck.prototype.reset = function() {
    this.cards = this.cardsOriginal.slice();
};
