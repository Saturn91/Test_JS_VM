var headers = {}

let memory = {}

function init() {
    eval(`
        console.log('initialize');
        memory.test = 'yop';
        memory.add = (a, b) => { return a+b; }
    `);
}

function UpdateGame(deltaTime) {
    eval(`
        console.log('update! ' + memory.test);
        console.log(memory.add(1,2));
    `);  
}

function DrawGame(canvasHandler) {
    eval(`
        canvasHandler.drawText('hello', 10, 10, 'white', 300);
        canvasHandler.drawSprite(7, 'main', 20, 20);
    `);    
}

/* Settings */
GameEnvironement.gameName = 'Your Game Name';

//--graphics--
//GameEnvironement.graphics.fps = 60;
//GameEnvironement.graphics.pixelPerfect = false;
GameEnvironement.graphics.autoFitScreen = true;
//GameEnvironement.windowHeight = 512;
//GameEnvironement.windowWidth = 640;
//GameEnvironement.resolutionX = 160;
//GameEnvironement.resolutionY = 128;

// connect above functions with engine

GameEnvironement.properties.debug = false;

GameEnvironement.functions.update = UpdateGame;
GameEnvironement.functions.draw = DrawGame;
GameEnvironement.functions.init = init;

//add spritesheets here:
addSpriteSheet('main', 'https://raw.githubusercontent.com/Saturn91/Saturn91JSEngine/ExampleProjectCoinCollector/assets/spriteSheet.png');

//create Game
let engine = new Engine();
