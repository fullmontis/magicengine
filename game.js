"use strict";

var game = new Magic( 400, 300, 'game' );
var mouse = new Mouse( game.canvas );
var keys = new Keyboard();
var fps = new FPS();

game.preload = function() {
    this.load.image('player','img/player.png');
    this.load.image('wall','img/wall.png');
    this.load.sound('step', 'snd/step.wav');
    this.load.map('map', 'map/map.json');
};

game.state['game'].create = function() {
    this.player = new Sprite( 100, 100, 16, 16, 
			      this.image['player'] );

    this.walls = new Group();
    this.walls.add('wall1', 200, 200, 16, 16, this.image['wall']);
    this.walls.add('wall2', 250, 200, 16, 16, this.image['wall']);
    this.walls.add('wall3', 267, 200, 16, 16, this.image['wall']);
    this.walls.add('wall4', 20, 150, 16, 16,  this.image['wall']);
    this.walls.add('wall5', 200, 180, 16, 16, this.image['wall']);
}.bind(game);

game.state['game'].update = function( dt ) {

    fps.update();

    var posx = 0;
    var posy = 0;

    if(keys.isDown['left']) { posx -= 4; }
    if(keys.isDown['right']) { posx += 4; }
    if(keys.isDown['up']) { posy -= 4; }
    if(keys.isDown['down']) { posy += 4; }

    if(!this.walls.collidesWith( this.player, 0, 0, posx, 0 )) {
	this.player.x += posx;
    }

    if(!this.walls.collidesWith( this.player, 0, 0, 0, posy )) {
	this.player.y += posy;
    }
}.bind(game);

game.state['game'].render = function( context ) {
    this.walls.render( context );
    this.player.render( context );
    fps.render( context );
}.bind(game);

game.start();
