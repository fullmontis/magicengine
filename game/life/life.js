"use strict";

var game = new Magic( 400, 300, 'game' );
var mouse = new Mouse( game.canvas );
var keys = new Keyboard();
var fps = new FPS();

game.context.fillColor = '#888';

// Resources

game.preload = function() {
    this.load.image('player', 'img/player.png');
    this.load.image('font', 'font/bitmap_font.png');
};

game.state['game'].create = function() {
    this.font = new Font( this.image['font'], 
			  'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 
			  'abcdefghijklmnopqrstuvwxyz' + 
			  '1234567890!?\'"#%', 5, 11, 1, 3 );
    this.player = new Player( 100, 100, 16, 16, this.image['player'] );
    this.item = new Item( 200, 200, 'rock' );
    this.bound = new Boundary( 50, 50, 300, 200 );
};

game.state['game'].update = function() {
    mouse.update();
    fps.update();
    this.player.update( this.bound, keys );
    this.item.update( this.player );
    keys.clear();
};

game.state['game'].render = function( context ) {
    fps.render( context );
    this.player.render( context );
    this.item.render( context );
};

game.start();
