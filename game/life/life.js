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
    this.player = new Sprite( 100, 100, 16, 16, this.image['player'] );
    this.font = new Font( this.image['font'], 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!?\'"#%', 5, 11, 1, 3 );
};

game.state['game'].update = function() {
    mouse.update();
    fps.update();

    keys.clear();
};

game.state['game'].render = function( context ) {
    fps.render( context );
    this.font.render( context, 'ciao tonto 111', 100, 100 );
};

game.start();
