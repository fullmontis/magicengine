"use strict";

var game = new Magic( 25*16, 20*16, 'game' );
var mouse = new Mouse( game.canvas );
var keys = new Keyboard();
var fps = new FPS();

game.context.fillColor = '#adc';

game.preload = function() {
    this.load.image('player','img/player.png');
    this.load.image('wall','img/wall.png');
    this.load.sound('step', 'snd/step.wav');
    this.load.image('tile','tileset/tile.png');
    this.load.map('map', 'map/map.json');
};

game.state['game'].create = function() {
    this.player = new Sprite( 100, 100, 16, 16, SPRITE_NO_IMG );
    this.walls = new Group();
    this.bound = new Boundary( 50, 50, 300, 200, '#dca');
    this.level = new Map(
	this.map.map,
	new Tileset( this.image['tile'], 16, 16 )
    );
    this.i = 0;
};

game.state['game'].update = function( dt ) {
    mouse.update();
    fps.update();

    if( mouse.left.isClicked ) {
	this.walls.add('wall' + this.i,
		       ((mouse.x/16)|0)*16,  
		       ((mouse.y/16)|0)*16,  
		       16, 16, this.image['wall']);
	this.i++;
	this.sound['step'].playFromStart();
    }

    var posx = 0;
    var posy = 0;

    if(keys.isDown['left']) { posx -= 4; }
    if(keys.isDown['right']) { posx += 4; }
    if(keys.isDown['up']) { posy -= 4; }
    if(keys.isDown['down']) { posy += 4; }

    if( this.walls.collidesWith(this.player, 0, 0, posx, 0) ||
        !this.bound.contains(this.player, posx, 0) ) {
	posx = 0;
    }

    if( this.walls.collidesWith( this.player, 0, 0, 0, posy ) ||
        !this.bound.contains(this.player, 0, posy) ) {
	posy = 0;
    }
    
    this.player.x += posx;
    this.player.y += posy;

    keys.clear();
};

game.state['game'].render = function( context ) {
    this.bound.render( context );
    this.walls.render( context );
    this.player.render( context );
    this.level.render( context );
    fps.render( context );
};

game.start();
