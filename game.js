var game = new Magic(400, 300, 'game');

game.preload = function() {
    this.load.image('player','img/player.png');
    this.load.sound('step', 'snd/step.wav');
    this.load.map('map', 'map/map.json');
};

game.create = function() {
    this.sprite.add('player', 100, 100, 16, 16, 'player');
    this.sprite.add('enemy', 200, 200, 16, 16, 'player');
};

game.update = function(dt) {
    var posx = 0;
    var posy = 0;

    if(this.keyboard.isDown['left']) { posx -= 4; }
    if(this.keyboard.isDown['right']) { posx += 4; }
    if(this.keyboard.isDown['up']) { posy -= 4; }
    if(this.keyboard.isDown['down']) { posy += 4; }

    if(!this.sprite.collide('player', 'enemy', posx, 0)) {
	this.sprite['player'].x += posx;
    }
    if(!this.sprite.collide('player', 'enemy', 0, posy)) {
	this.sprite['player'].y += posy;
    }
};

game.render = function() {
    this.sprite.render('enemy');
    this.sprite.render('player');
};

game.preload();
