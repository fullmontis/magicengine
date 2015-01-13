var game = new Magic(400, 300, 'game');

game.preload = function() {
    this.load.image('player','img/player.png');
    this.load.sound('step', 'snd/step.wav');
    this.load.map('map', 'map/map.json');
};

game.create = function() {
    this.posx = 0;
    this.posy = 0;
};

game.update = function(dt) {
    if(this.keyboard.isDown['left']) { this.posx -= 10; }
    if(this.keyboard.isDown['right']) { this.posx += 10; }
    if(this.keyboard.isDown['up']) { this.posy -= 10; }
    if(this.keyboard.isDown['down']) { this.posy += 10; }
};

game.render = function() {
    this.context.fill();
    this.context.drawImage(this.image['player'], this.posx, this.posy);
};

game.preload();
