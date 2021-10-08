let code = `

//Settings
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

//add resources:
addSpriteSheet('main', 'https://raw.githubusercontent.com/Saturn91/Saturn91JSEngine/ExampleProjectCoinCollector/assets/spriteSheet.png');

function init() {
    console.log('initialize');
}

function updateGame(deltaTime) {
    console.log('update');
}

function drawGame(canvasHandler) {   
    canvasHandler.drawText('hello', 10, 10, 'white', 300);
    canvasHandler.drawSprite(7, 'main', 20, 20);
}
`;
code = simplifyCode(code);
let initInCode = code.includes('function init');
let updateGameInCode = code.includes('function updateGame');
let drawGameInCode = code.includes('function drawGame');
eval(code);

if(initInCode) GameEnvironement.functions.init = init; 
if(updateGameInCode) GameEnvironement.functions.update = updateGame;
if(drawGameInCode) GameEnvironement.functions.draw = drawGame;

//create Game
let engine = new Engine();
