var game = new Magic(400, 300, 'game');

game.preload = function() {
    this.load.image('player','img/player.png');
    this.load.image('wall','img/wall.png');
    this.load.sound('step', 'snd/step.wav');
    this.load.map('map', 'map/map.json');
};

game.create = function() {
    this.sprite.add('player', 100, 100, 16, 16, 'player');
    this.sprite.add('wall1', 200, 200, 16, 16, 'wall');
    this.sprite.add('wall2', 250, 200, 16, 16, 'wall');
    this.sprite.add('wall3', 267, 200, 16, 16, 'wall');
    this.sprite.add('wall4', 20, 150, 16, 16, 'wall');
    this.sprite.add('wall5', 200, 180, 16, 16, 'wall');

    this.sprite.group.add('wall');
    this.sprite.group.push('wall1','wall');
    this.sprite.group.push('wall2','wall');
    this.sprite.group.push('wall3','wall');
    this.sprite.group.push('wall4','wall');
    this.sprite.group.push('wall5','wall');
};

game.update = function(dt) {
    var posx = 0;
    var posy = 0;

    if(this.keyboard.isDown['left']) { posx -= 4; }
    if(this.keyboard.isDown['right']) { posx += 4; }
    if(this.keyboard.isDown['up']) { posy -= 4; }
    if(this.keyboard.isDown['down']) { posy += 4; }

    if(!this.sprite.group.collide('player', 'wall', posx, 0)) {
	this.sprite['player'].x += posx;
    }

    if(!this.sprite.group.collide('player', 'wall', 0, posy)) {
	this.sprite['player'].y += posy;
    }

};

game.render = function() {
    this.sprite.group.render('wall');
    this.sprite.render('player');
};

game.preload();
