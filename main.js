function init() {
    //put your initial code here
    console.log('initialize');
}

function UpdateGame(deltaTime) {
    //put your update calls here (gets called 60 times per second)
}

function DrawGame(canvasHandler) {
    //put your draw calls (draw objects on screen) here (gets called 60 times per second after update)
    
}

/* Settings */
GameEnvironement.gameName = 'Your Game Name';

//--graphics--
//GameEnvironement.graphics.fps = 60;
//GameEnvironement.graphics.pixelPerfect = false;
//GameEnvironement.graphics.autoFitScreen = false;
//GameEnvironement.windowHeight = 512;
//GameEnvironement.windowWidth = 640;
//GameEnvironement.resolutionX = 160;
//GameEnvironement.resolutionY = 128;

// connect above functions with engine

GameEnvironement.properties.debug = true;

GameEnvironement.functions.update = UpdateGame;
GameEnvironement.functions.draw = DrawGame;
GameEnvironement.functions.init = init;

//add spritesheets here:
//addSpriteSheet('main', './assets/...');

//create Game
const engine = new Engine();
