// Audio API extension

Audio.prototype.playFromStart = function() {
    this.currentTime = 0;
    this.play();
};

