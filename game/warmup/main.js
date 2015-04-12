"use strict";

var game = new Magic( 640, 480, 'game' );
var mouse = new Mouse( game.canvas );
var keys = new Keyboard();
var fps = new FPS();

game.context.fillColor = '#888';

// Resources

game.preload = function() {
    this.load.image('player', 'img/player.png');
    this.load.image('font', 'font/bitmap_font.png');
    this.load.image('tile', 'tileset/tile32.png');
    this.load.map('ghost', 'map/ghost.json');
};

game.state['game'].create = function() {
    this.font = new Font( this.image['font'], 
			  'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 
			  'abcdefghijklmnopqrstuvwxyz' + 
			  '1234567890!?\'"#%', 5, 11, 1, 3 );
    this.bound = new Boundary( 32, 32, 576, 416 );
    this.player = new Player( 100, 100, 32, 32, SPRITE_NO_IMG );
    this.tileset = new Tileset( this.image['tile'], 32, 32 );

    this.level = new Map(
	this.map['ghost'],
	this.tileset
    );
};

game.state['game'].update = function() {
    mouse.update();
    fps.update();
    this.player.update( this.bound, keys );
    keys.clear();
};

game.state['game'].render = function( context ) {
    fps.render( context );
    this.level.render( context, 0, 0, 0, 1 );
    this.player.render( context );
};

game.start();
