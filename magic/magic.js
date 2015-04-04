// MagicEngine: an HTML5 framework for rapid prototyping

"use strict";

function Magic( width, height, parentId, lockMouse ) {

    var _this = this; // used for reference in objects, ugly as death, must remove

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

    // The main canvas element on which we are going to operate
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;

    document.getElementById(parentId).appendChild(this.canvas);

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

	if( this.audioCodec == 'ogg' ) {
	    url = oggUrl;  
	} else {
	    url = aacUrl;
	} 

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

    // Resource preload function, will be overwritten by game

    this.preload = function() {};

    this.preloadWrapper = function() {
	this.preload();
	this.mainLoop();
    };
    
    // Main loop logic

    var lastTime = Date.now();
    var nowTime = lastTime;
    var timer = 0;
    var drawFPSTimer = 0;
    var frames = 0;
    var fps = 0;

    this.mainLoop = function () {

	// calculate FPS
	nowTime = Date.now();
	timer += (nowTime - lastTime) / 1000;
	lastTime = nowTime;

	frames++;
	drawFPSTimer++;

	if( drawFPSTimer > 60 ) { // update every sixty frames
	    fps = frames / timer;
	    drawFPSTimer = 0;
	    timer = 0;
	    frames = 0;
	}

	// update game logic
	this.state.update();

	// paint next frame
	this.context.fill();
	this.state.render( this.context );
	this.context.text( fps.toFixed(1), 20, 30 );
	
	// call next frame
	requestAnimationFrame( this.mainLoop );

    }.bind(this);
}
