// MagicEngine: an HTML5 framework for rapid prototyping

// TODO:
// - Sprite and collision system, groups
// - Loading screen
// - Tiled map display and management
// - Sound extension
// - State Manager
// - Tweening

// canvas API extension
(function () {
    Audio.prototype.playFromStart = function() {
	this.currentTime = 0;
	this.play();
    };

    CanvasRenderingContext2D.prototype.fillColor = "#ccc"; 

    CanvasRenderingContext2D.prototype.rect = 
	function( x, y, w, h, color, alpha ) {
	    if( x === undefined ||
		y === undefined ||
		w === undefined ||
		h === undefined ) {
		throw "ERROR: RECT: missing variable";
	    }
	    this.save();
	    this.fillStyle = color || "#000";
	    if( alpha == 0 ) { 
		this.globalAlpha = 0; 
	    } else {
		this.globalAlpha = alpha || 1; 	
	    };
	    this.fillRect( x, y, w, h );
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

function Magic( width, height, parentId ) {

    var _this = this;

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

    // disable context menu
    this.canvas.oncontextmenu = function() { return false; };

    this.context = this.canvas.getContext('2d');
    this.context.font = "30px Arial";

    // background color
    this.context.fillColor = '#fff';

    // State management
    //
    // Each State has 4 main functions:
    // - create, where the resources are loaded
    // - update, where the game logic happens
    // - render, where the stuff is printed on the screen

    // TODO: add destroy(), destroyUpdate(), destroyRender(), 
    // createUpdate(), createRender() to the functions of each state
    
    // Boot is a special state used for the loading screen
    // Game is the main game state
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
	}
    };

    this.state['boot'].update = function() {
	this.loaded = 100*_this.load.complete.length/_this.load.pending.length;
	this.loaded = this.loaded.toFixed(0);
    };

    this.state['boot'].render = function() {
	_this.context.drawImage(this.img, 50, 50);
	_this.context.text('A GAME BY', 200, 150, '#000', 1, '20px arial ');
	_this.context.text('FULLMONTIS', 200, 180);
	_this.context.text('LOADING ' + this.loaded + '%', 240, 240, '#777', 1, '17px arial');
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
	var _this = this;

	xhr.onreadystatechange = function() {
	    if( xhr.readyState == 4 ) {
		_this.loaded( mapId, 'map', JSON.parse(xhr.responseText) )();
	    }
	};
	xhr.open('GET', url, true);
	xhr.send();

	this.load.pending.push(mapId);
    }.bind(this);
    
    // Sprite manager
    this.sprite = {
	add: function( spriteId,  x, y, width, height, imageId, anchorX, anchorY ) {
	    this[spriteId] = {};

	    this[spriteId].image = imageId;
	    this[spriteId].x = x;
	    this[spriteId].y = y;
	    this[spriteId].width = width;
	    this[spriteId].height = height;
	    this[spriteId].anchor = {};
	    this[spriteId].anchor.x = anchorX || 0;
	    this[spriteId].anchor.y = anchorY || anchorX || 0;
	},

	// Checks collision between two sprites ids
	// The offset variables set the amount to add to each sprite position
	// (default to 0)
	collide: function( spriteId1, spriteId2, offsetX1, offsetY1, offsetX2, offsetY2 ) {
	    offsetX1 = offsetX1 || 0;
	    offsetY1 = offsetY1 || 0;
	    offsetX2 = offsetX2 || 0;
	    offsetY2 = offsetY2 || 0;

	    var x1 = this[spriteId1].x - this[spriteId1].anchor.x + offsetX1;
	    var y1 = this[spriteId1].y - this[spriteId1].anchor.y + offsetY1;
	    var w1 = this[spriteId1].width;
	    var h1 = this[spriteId1].height;
	    var x2 = this[spriteId2].x - this[spriteId2].anchor.x + offsetX2;
	    var y2 = this[spriteId2].y - this[spriteId2].anchor.y + offsetY2;
	    var w2 = this[spriteId2].width;
	    var h2 = this[spriteId2].height;

	    if( x1 < x2 + w2 &&
		x1 + w1 > x2 &&
		y1 < y2 + h2 &&
		y1 + h1 > y2 ){
		    return true;
		} else {
		    return false; 
		}
	},
	render: function( spriteId ){
	    var sprite = this[spriteId];
	    _this.context.drawImage( 
		_this.image[sprite.image],
		sprite.x - sprite.anchor.x,
		sprite.y - sprite.anchor.y );
	},
	remove: function( spriteId ){
	    this[spriteId] = {};
	},
	group: {
	    // add a group
	    add: function( groupId ) {
		this[groupId] = [];
	    },

	    // Push a sprite to a group
	    push: function( spriteId, groupId ) {
		this[groupId].push(spriteId);
	    },

	    // Check if there is collision between a single sprite and a group 
	    collide: function( spriteId, groupId, offsetX, offsetY ) {
		for( var i=0; i < this[groupId].length; i++ ){
		    if(_this.sprite.collide(spriteId, this[groupId][i], offsetX, offsetY))
			return this[groupId][i];
		}
		return false;
	    },

	    render: function( groupId ) {
		for( var i=0; i < this[groupId].length; i++ ){
		    var sprite = _this.sprite[this[groupId][i]];
		    _this.context.drawImage( 
			_this.image[sprite.image],
			sprite.x - sprite.anchor.x,
			sprite.y - sprite.anchor.y );
		}
	    }
	}
    };
    
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
	this.state.getCurrent().update();
	this.keyboard.clear();
	setTimeout( this.updateWrapper.bind(this), 1000 / this.FPS );
    };

    this.renderWrapper = function() {
	this.context.fill();
	this.state.getCurrent().render();
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

    // Randomizers

    this.dice = {
	roll: function( numberOfFaces, numberOfDices, startFrom ) {

	startFrom = startFrom || 0;
	numberOfDices = numberOfDices || 1;

	var total = 0;
	
	for( var i=0; i < numberOfDices; i++ ) {
	    total += Math.floor(Math.random()*numberOfFaces) + startFrom; 
	}

	return total;
	}
    };

    this.deck = {
	add: function( deckId, cards ) {
	    
	    // cards is the array of cards we are going to manipulate
	    this[deckId] = cards;

	    return this[deckId];
	},
	addList: function( deckId, numberOfCards ) {
	    this[deckId] = [];

	    for( var i=0; i<numberOfCards; i++ ) {
		this[deckId].push(i);
	    }

	    return this[deckId];
	}
	
    };
}
