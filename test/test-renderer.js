TEST_SUITE.runAllTestsComplete = false;

GameEnvironement.graphics = {
    resolutionX: 200,
    resolutionY: 100,
    maps: {},
    spriteSheets: {}
}

GameEnvironement.graphics.maps['main'] = {
    spriteSheetName: 'sprite-sheet'
}

GameEnvironement.graphics.spriteSheets['sprite-sheet'] = {
    data: {
        tileSize: 1
    }
}

{
testTitle('test renderer - setup and functions')

assert('test renderer not yet initialized', Renderer.rendererSingleton == undefined, true);

let canvasHandler = {
    countDraw: 0,
    getSpriteData() { return {tileSize: 0.0001}; },
    drawSprite() { this.countDraw++; },
    drawMap() { this.countDraw++; }
};

let renderer = new Renderer(canvasHandler);

assert('test renderer singleton has canvasHandler', renderer.canvasHandler == canvasHandler, true);

assert('test isOnScreen(x,y) in bounds1', renderer.positionIsOnScreen(0,0) == true, true);
assert('test isOnScreen(x,y) in bounds2', renderer.positionIsOnScreen(GameEnvironement.graphics.resolutionX-0.0001,0) == true, true);
assert('test isOnScreen(x,y) in bounds3', renderer.positionIsOnScreen(0,GameEnvironement.graphics.resolutionY-0.0001) == true, true);
assert('test isOnScreen(x,y) in bounds4', renderer.positionIsOnScreen(GameEnvironement.graphics.resolutionX-0.0001,GameEnvironement.graphics.resolutionY-0.0001) == true, true);
assert('test isOnScreen(x,y) not on screen1', renderer.positionIsOnScreen(0-0.0001,0) == false, true);
assert('test isOnScreen(x,y) not on screen2', renderer.positionIsOnScreen(0,0-0.0001) == false, true);
assert('test isOnScreen(x,y) not on screen3', renderer.positionIsOnScreen(GameEnvironement.graphics.resolutionX,0) == false, true);
assert('test isOnScreen(x,y) not on screen4', renderer.positionIsOnScreen(0,GameEnvironement.graphics.resolutionY) == false, true);

assert('test isOnArea(x,y) in bounds1', renderer.areaIsOnScreen(-0.0001,-0.0001, 0.0001, 0.0001) == true, true);
assert('test isOnArea(x,y) in bounds2', renderer.areaIsOnScreen(GameEnvironement.graphics.resolutionX-0.0001,GameEnvironement.graphics.resolutionY-0.0001, 0.0001, 0.0001) == true, true);
assert('test isOnArea(x,y) out of bounds1', renderer.areaIsOnScreen(-0.0002,-0.0002, 0.0001, 0.0001) == false, true);
assert('test isOnArea(x,y) out of bounds2', renderer.areaIsOnScreen(GameEnvironement.graphics.resolutionX,GameEnvironement.graphics.resolutionY, 0.0001, 0.0001) == false, true);

testTitle('test renderer - draw Sprite')

renderer.drawSprite(0, 'main', -0.0001, -0.0001);
assert('test drawSprite if on screen draws', canvasHandler.countDraw == 1, true);
renderer.drawSprite(0, 'main', -0.0002, -0.0002);
assert('test drawSprite if not on screen (should ot draw)', canvasHandler.countDraw == 1, true);

testTitle('test renderer - draw Map')

renderer.drawMap('main', 0, 0, 0.0001, 0.0001);
assert('test drawMap if on screen draws', canvasHandler.countDraw == 2, true);
renderer.drawMap('main', -0.0002, -0.0002, 0.0001, 0.0001);
assert('test drawMap if not on screen (should ot draw)', canvasHandler.countDraw == 2, true);
}