// Claculate and display frames per second

function FPS() {
    var lastTime = 0;
    var nowTime = 0;
    var timer = 0;
    var drawFPSTimer = 0;
    var frames = 0;
    var fps = 0;

    this.update = function() {
	nowTime = Date.now();
	timer += (nowTime - lastTime) / 1000;
	lastTime = nowTime;

	frames++;
	drawFPSTimer++;

	if( drawFPSTimer > 60 ) { // update every sixty frames
	    fps = frames / timer;
	    drawFPSTimer = 0;
	    timer = 0;
	    frames = 0;
	}
    };

    this.render = function( context ) {
	context.text( (((fps*10)|0)/10), 20, 30 );
    };
}
