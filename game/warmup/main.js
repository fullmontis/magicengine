"use strict";

var game = new Magic( 640, 480, 'game' );
var mouse = new Mouse( game.canvas );
var keys = new Keyboard();
var fps = new FPS();

game.context.fillColor = '#888';

// Resources

game.preload = function() {
    this.load.image('player', 'img/player.png');
    this.load.image('fog', 'img/fog.png');
    this.load.image('font', 'font/bitmap_font.png');
    this.load.image('tile', 'tileset/tile32.png');
    this.load.map('ghost', 'map/ghost.json');
};

game.state['game'].create = function() {
    this.font = new Font( this.image['font'], 
			  'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 
			  'abcdefghijklmnopqrstuvwxyz' + 
			  '1234567890!?\'"#%', 5, 11, 1, 3 );
    this.bound = new Sprite( 32, 32, 576, 416 );
    this.group = new Group();
    this.group.createFromLayer( this.map.ghost, 1 );
    this.fog = new Sprite( 32, 32, 150, 150, this.image['fog'], 0.5, 0.5 );

    this.fog.update = function( player ) {
	this.x = player.x;
	this.y = player.y;
    };

    this.player = new Player( 32, 32, 16, 16, SPRITE_NO_IMG );
    this.tileset = new Tileset( this.image['tile'], 32, 32 );

    this.level = new Map(
	this.map['ghost'],
	this.tileset
    );
};

game.state['game'].update = function() {
    mouse.update();
    fps.update();
    this.player.update( this.group, keys );
    this.fog.update( this.player );
    keys.clear();
};

game.state['game'].render = function( context ) {
    // fps.render( context );

    context.save();

    context.fillColor = '#666';
    context.fill();
    this.level.render( context, 0, 0, 0, 1 );
    context.globalCompositeOperation = 'destination-in';
    this.fog.render( context );
    context.globalCompositeOperation = 'source-over';
    this.player.render( context );
    context.globalCompositeOperation = 'destination-atop';
    context.fillColor = '#000';
    context.fill();

    context.restore();

};

game.start();
