TEST_SUITE.runAllTestsComplete = false;
{
testTitle('test grid')

debug = function() { };

let grid = new Grid(new Rect(0, 0, 1, 1), 1);
let checkField = [[undefined]];

assert('test new grid is empty: ', grid.field[0][0] == checkField[0][0], true);

rect = new Rect(10, 11, 5, 8);
grid = new Grid(rect.clone(), 2);


assert('test new grid has correct sprite-width', grid.tileSize == 2, true);
assert('test new grid has scaled rect', grid.rect.toString() === rect.toString(), true);

rect.scale(2, 2);
assert('test new grid has scaled rect', grid.scaledRect.toString() === rect.toString(), true);

let data = 1;
grid.setFieldData(0, 1, data);
assert('test grid internal data has set data at 1, 2', grid.field[1][0] == data, true);
assert('test grid getData(1,2) equals data (1)', grid.getDataInFieldByGridCoordinates(0,1) == data, true);

assert('test grid inBoundsFunction(0,0)', grid.gridCoordinateInBounds(0,0) == true, true);
assert('test grid inBoundsFunction(4,7)', grid.gridCoordinateInBounds(4,7) == true, true);
assert('test grid inBoundsFunction(-1,0)', grid.gridCoordinateInBounds(-1,0) == false, true);
assert('test grid inBoundsFunction(0,-1)', grid.gridCoordinateInBounds(0, -1) == false, true);
assert('test grid inBoundsFunction(-1,-1)', grid.gridCoordinateInBounds(-1,-1) == false, true);
assert('test grid inBoundsFunction(0,9)', grid.gridCoordinateInBounds(0, 9) == false, true);

assert('test getDataInFieldByGridCoordinates returns undefined if out of bounds', grid.getDataInFieldByGridCoordinates(-1,2) == undefined, true);
assert('test getDataInFieldByGridCoordinates returns undefined if out of bounds', grid.getDataInFieldByGridCoordinates(0,-1) == undefined, true);

let scale = 1;

grid = new Grid(new Rect(2, 3, 1, 2), scale);

assert('test positionCoordinateInBounds(1.99999, 3) out of bounds', grid.positionCoordinateInBounds(1.9999, 3) == false, true);
assert('test positionCoordinateInBounds(2, 2.9999) out of bounds', grid.positionCoordinateInBounds(2, 2.9999) == false, true);
assert('test positionCoordinateInBounds(2, 3) in bounds', grid.positionCoordinateInBounds(2, 3) == true, true);
assert('test positionCoordinateInBounds(2+1*scale-0.0001, 3+2*scale-0.0001) in bounds', grid.positionCoordinateInBounds(2+1*scale-0.0001, 3+2*scale-0.0001) == true, true);
assert('test positionCoordinateInBounds(2+1*scale-0.0001, 3+2*scale) out of bounds', grid.positionCoordinateInBounds(2+1*scale-0.0001, 3+2*scale) == false, true);
assert('test positionCoordinateInBounds(2+1*scale, 3+2*scale-0.0001) out of bounds', grid.positionCoordinateInBounds(2+1*scale, 3+2*scale-0.0001) == false, true);

assert('test calcPositionInGridFromOffsetedAndUnscaledPos(0, 0, 2*scale) == 0', grid.calcPositionInGridFromOffsetedAndUnscaledPos(0, 0, 2*scale) == 0, true);
assert('test calcPositionInGridFromOffsetedAndUnscaledPos(0, 1*scale + 0.9999, 2*scale) == 0', grid.calcPositionInGridFromOffsetedAndUnscaledPos(0, 1*scale + 0.9999, 2*scale) == 0, true);
assert('test calcPositionInGridFromOffsetedAndUnscaledPos(0, 2*scale, 2*scale) == 1', grid.calcPositionInGridFromOffsetedAndUnscaledPos(0, 2*scale, 2*scale) == 1, true);
assert('test calcPositionInGridFromOffsetedAndUnscaledPos(1*scale, 1*scale, 2*scale) == 0', grid.calcPositionInGridFromOffsetedAndUnscaledPos(1*scale, 1*scale, 2*scale) == 0, true);
assert('test calcPositionInGridFromOffsetedAndUnscaledPos(1*scale, 2*scale +0.9999, 2*scale) == 0', grid.calcPositionInGridFromOffsetedAndUnscaledPos(1*scale, 2*scale +0.9999, 2*scale) == 0, true);
assert('test calcPositionInGridFromOffsetedAndUnscaledPos(1*scale, 3*scale, 2*scale) == 1', grid.calcPositionInGridFromOffsetedAndUnscaledPos(1*scale, 3*scale, 2*scale) == 1, true);

grid = new Grid(new Rect(2, 3, 1, 2), 2);
assert('test getGridCoordinateFromPosition(1.9999, 3) should return undefined', grid.getGridCoordinateFromPosition(1.9999, 3) == undefined, true);
let pos = grid.getGridCoordinateFromPosition(2, 3);
assert('test getGridCoordinateFromPosition(2, 3) should return 0:0', pos.x === 0 && pos.y === 0, true);
pos = grid.getGridCoordinateFromPosition(2+1*2-0.0001, 3+2*2-0.0001);
assert('test getGridCoordinateFromPosition(2+1*2-0.0001, 3+2*2-0.0001) should return 0:1', pos.x === 0 && pos.y === 1, true);

grid.setFieldData(0, 0, 1);
grid.setFieldData(0, 1, 2);

assert('test getDataInFieldByPosCoordinates(2, 3) == 1', grid.getDataInFieldByPosCoordinates(2, 3) == 1, true);
assert('test getDataInFieldByPosCoordinates(2 + 2*1-0.0001, 3) == 1', grid.getDataInFieldByPosCoordinates(2 + 2*1-0.0001, 3) == 1, true);
assert('test getDataInFieldByPosCoordinates(2, 3 + 1*2-0.0001) == 1', grid.getDataInFieldByPosCoordinates(2, 3 + 1*2-0.0001) == 1, true);
assert('test getDataInFieldByPosCoordinates(2, 3 + 1*2+0.0001) == 2', grid.getDataInFieldByPosCoordinates(2, 3 + 1*2+0.0001) == 2, true);
assert('test getDataInFieldByPosCoordinates(2, 3 + 2*2-0.0001) == 2', grid.getDataInFieldByPosCoordinates(2, 3 + 2*2-0.0001) == 2, true);
assert('test getDataInFieldByPosCoordinates(1.9999, 3) == undefined', grid.getDataInFieldByPosCoordinates(1.9999, 3) == undefined, true);
assert('test getDataInFieldByPosCoordinates(2, 2.9999) == undefined', grid.getDataInFieldByPosCoordinates(2, 2.9999) == undefined, true);
assert('test getDataInFieldByPosCoordinates(3.0001, 5) == undefined', grid.getDataInFieldByPosCoordinates(2, 3+2*2) == undefined, true);
assert('test getDataInFieldByPosCoordinates(3, 5.0001) == undefined', grid.getDataInFieldByPosCoordinates(2 + 1*2, 3) == undefined, true);

grid = new Grid(new Rect(2, 3, 1, 2), 2);
assert('test setField works', grid.getDataInFieldByPosCoordinates(2 + 1*2, 3) == undefined, true);

grid = new Grid(new Rect(2, 3, 1, 2), 2);
grid.setFieldData(0, 0, 1);
grid.setFieldData(0, 1, 2);

let zoom = 2
grid.setZoom(zoom);

assert('test getDataInFieldByPosCoordinates(2*zoom, 3*zoom) == 1', grid.getDataInFieldByPosCoordinates(2*zoom, 3*zoom) == 1, true);
assert('test getDataInFieldByPosCoordinates((2 + 2*1)*zoom-0.0001, 3*zoom) == 1', grid.getDataInFieldByPosCoordinates((2 + 2*1)*zoom-0.0001, 3*zoom) == 1, true);
assert('test getDataInFieldByPosCoordinates(2*zoom, (3 + 1*2)*zoom-0.0001) == 1', grid.getDataInFieldByPosCoordinates(2*zoom, (3 + 1*2)*zoom-0.0001) == 1, true);
assert('test getDataInFieldByPosCoordinates(2*zoom, (3 + 1*2+0.0001)*zoom) == 2', grid.getDataInFieldByPosCoordinates(2*zoom, (3 + 1*2)*zoom+0.0001) == 2, true);
assert('test getDataInFieldByPosCoordinates(2*zoom, (3 + 2*2)*zoom-0.0001) == 2', grid.getDataInFieldByPosCoordinates(2*zoom, (3 + 2*2)*zoom-0.0001) == 2, true);
assert('test getDataInFieldByPosCoordinates(1.9999*zoom, 3*zoom) == undefined', grid.getDataInFieldByPosCoordinates(1.9999*zoom, 3*zoom) == undefined, true);
assert('test getDataInFieldByPosCoordinates(2*zoom, 2.9999*zoom) == undefined', grid.getDataInFieldByPosCoordinates(2*zoom, 2.9999*zoom) == undefined, true);
assert('test getDataInFieldByPosCoordinates(2*zoom, (3+2*2)*zoom) == undefined', grid.getDataInFieldByPosCoordinates(2*zoom, (3+2*2)*zoom) == undefined, true);
assert('test getDataInFieldByPosCoordinates((2 + 1*2)*zoom, 3*zoom) == undefined', grid.getDataInFieldByPosCoordinates((2 + 1*2)*zoom, 3*zoom) == undefined, true);

for(let i = 0; i < 3; i++) {
    zoom = Math.round(Math.random() * 100) + 1
    grid.setZoom(zoom);
    testTitle('test grid with zoom ' + zoom);
    assert('test getDataInFieldByPosCoordinates(2*zoom, 3*zoom) == 1', grid.getDataInFieldByPosCoordinates(2*zoom, 3*zoom) == 1, true);
    assert('test getDataInFieldByPosCoordinates((2 + 2*1)*zoom-0.0001, 3*zoom) == 1', grid.getDataInFieldByPosCoordinates((2 + 2*1)*zoom-0.0001, 3*zoom) == 1, true);
    assert('test getDataInFieldByPosCoordinates(2*zoom, (3 + 1*2)*zoom-0.0001) == 1', grid.getDataInFieldByPosCoordinates(2*zoom, (3 + 1*2)*zoom-0.0001) == 1, true);
    assert('test getDataInFieldByPosCoordinates(2*zoom, (3 + 1*2+0.0001)*zoom) == 2', grid.getDataInFieldByPosCoordinates(2*zoom, (3 + 1*2+0.0001)*zoom) == 2, true);
    assert('test getDataInFieldByPosCoordinates(2*zoom, (3 + 2*2)*zoom-0.0001) == 2', grid.getDataInFieldByPosCoordinates(2*zoom, (3 + 2*2)*zoom-0.0001) == 2, true);
    assert('test getDataInFieldByPosCoordinates(1.9999*zoom, 3*zoom) == undefined', grid.getDataInFieldByPosCoordinates(1.9999*zoom, 3*zoom) == undefined, true);
    assert('test getDataInFieldByPosCoordinates(2*zoom, 2.9999*zoom) == undefined', grid.getDataInFieldByPosCoordinates(2*zoom, 2.9999*zoom) == undefined, true);
    assert('test getDataInFieldByPosCoordinates(2*zoom, (3+2*2)*zoom) == undefined', grid.getDataInFieldByPosCoordinates(2*zoom, (3+2*2)*zoom) == undefined, true);
    assert('test getDataInFieldByPosCoordinates((2 + 1*2)*zoom, 3*zoom) == undefined', grid.getDataInFieldByPosCoordinates((2 + 1*2)*zoom, 3*zoom) == undefined, true);
}

grid = new Grid(new Rect(0, 0, 2, 2), 4);

let countCallBackCalls = 0;

let test = [
    [0,0],
    [0,0]
];

let testTileSize = 0;

function callBack(x, y, field, tileSize) {
    countCallBackCalls ++;
    test[x][y] = field;
    testTileSize = tileSize;
}

grid.loopGrid(callBack);

assert('test loopTroughMap gets called 4 times', countCallBackCalls == 4, true);
for(let x = 0; x < 2; x++) {
    for(let y = 0; y < 2; y++) {
        assert('test loopTroughMap has right parameters', test[y][x] == grid.field[y][x], true);
        assert('test loopTroughMap has right parameters (tileSize) shoud be ' + 4 + ' was: ' + testTileSize, testTileSize == 4, true);
    }
}

scale = 2;
testTitle('check out grid.positionCoordinateInBounds with scale '+ scale)

grid = new Grid(new Rect(2, 3, 1, 2), scale);

assert('test positionCoordinateInBounds(1.99999, 3) out of bounds', grid.positionCoordinateInBounds(1.9999, 3) == false, true);
assert('test positionCoordinateInBounds(2, 2.9999) out of bounds', grid.positionCoordinateInBounds(2, 2.9999) == false, true);
assert('test positionCoordinateInBounds(2, 3) in bounds', grid.positionCoordinateInBounds(2, 3) == true, true);
assert('test positionCoordinateInBounds(2+1*scale-0.0001, 3+2*scale-0.0001) in bounds', grid.positionCoordinateInBounds(2+1*scale-0.0001, 3+2*scale-0.0001) == true, true);
assert('test positionCoordinateInBounds(2+1*scale-0.0001, 3+2*scale) out of bounds', grid.positionCoordinateInBounds(2+1*scale-0.0001, 3+2*scale) == false, true);
assert('test positionCoordinateInBounds(2+1*scale, 3+2*scale-0.0001) out of bounds', grid.positionCoordinateInBounds(2+1*scale, 3+2*scale-0.0001) == false, true);

assert('test calcPositionInGridFromOffsetedAndUnscaledPos(0, 0, 2*scale) == 0', grid.calcPositionInGridFromOffsetedAndUnscaledPos(0, 0, 2*scale) == 0, true);
assert('test calcPositionInGridFromOffsetedAndUnscaledPos(0, 1*scale + 0.9999, 2*scale) == 0', grid.calcPositionInGridFromOffsetedAndUnscaledPos(0, 1*scale + 0.9999, 2*scale) == 0, true);
assert('test calcPositionInGridFromOffsetedAndUnscaledPos(0, 2*scale, 2*scale) == 1', grid.calcPositionInGridFromOffsetedAndUnscaledPos(0, 2*scale, 2*scale) == 1, true);
assert('test calcPositionInGridFromOffsetedAndUnscaledPos(1*scale, 1*scale, 2*scale) == 0', grid.calcPositionInGridFromOffsetedAndUnscaledPos(1*scale, 1*scale, 2*scale) == 0, true);
assert('test calcPositionInGridFromOffsetedAndUnscaledPos(1*scale, 2*scale +0.9999, 2*scale) == 0', grid.calcPositionInGridFromOffsetedAndUnscaledPos(1*scale, 2*scale +0.9999, 2*scale) == 0, true);
assert('test calcPositionInGridFromOffsetedAndUnscaledPos(1*scale, 3*scale, 2*scale) == 1', grid.calcPositionInGridFromOffsetedAndUnscaledPos(1*scale, 3*scale, 2*scale) == 1, true);

scale = 3;
testTitle('check out grid.positionCoordinateInBounds with scale '+ scale)

grid = new Grid(new Rect(2, 3, 1, 2), scale);

assert('test positionCoordinateInBounds(1.99999, 3) out of bounds', grid.positionCoordinateInBounds(1.9999, 3) == false, true);
assert('test positionCoordinateInBounds(2, 2.9999) out of bounds', grid.positionCoordinateInBounds(2, 2.9999) == false, true);
assert('test positionCoordinateInBounds(2, 3) in bounds', grid.positionCoordinateInBounds(2, 3) == true, true);
assert('test positionCoordinateInBounds(2+1*scale-0.0001, 3+2*scale-0.0001) in bounds', grid.positionCoordinateInBounds(2+1*scale-0.0001, 3+2*scale-0.0001) == true, true);
assert('test positionCoordinateInBounds(2+1*scale-0.0001, 3+2*scale) out of bounds', grid.positionCoordinateInBounds(2+1*scale-0.0001, 3+2*scale) == false, true);
assert('test positionCoordinateInBounds(2+1*scale, 3+2*scale-0.0001) out of bounds', grid.positionCoordinateInBounds(2+1*scale, 3+2*scale-0.0001) == false, true);

assert('test calcPositionInGridFromOffsetedAndUnscaledPos(0, 0, 2*scale) == 0', grid.calcPositionInGridFromOffsetedAndUnscaledPos(0, 0, 2*scale) == 0, true);
assert('test calcPositionInGridFromOffsetedAndUnscaledPos(0, 1*scale + 0.9999, 2*scale) == 0', grid.calcPositionInGridFromOffsetedAndUnscaledPos(0, 1*scale + 0.9999, 2*scale) == 0, true);
assert('test calcPositionInGridFromOffsetedAndUnscaledPos(0, 2*scale, 2*scale) == 1', grid.calcPositionInGridFromOffsetedAndUnscaledPos(0, 2*scale, 2*scale) == 1, true);
assert('test calcPositionInGridFromOffsetedAndUnscaledPos(1*scale, 1*scale, 2*scale) == 0', grid.calcPositionInGridFromOffsetedAndUnscaledPos(1*scale, 1*scale, 2*scale) == 0, true);
assert('test calcPositionInGridFromOffsetedAndUnscaledPos(1*scale, 2*scale +0.9999, 2*scale) == 0', grid.calcPositionInGridFromOffsetedAndUnscaledPos(1*scale, 2*scale +0.9999, 2*scale) == 0, true);
assert('test calcPositionInGridFromOffsetedAndUnscaledPos(1*scale, 3*scale, 2*scale) == 1', grid.calcPositionInGridFromOffsetedAndUnscaledPos(1*scale, 3*scale, 2*scale) == 1, true);

scale = 4;
testTitle('check out grid.positionCoordinateInBounds with scale '+ scale)

grid = new Grid(new Rect(2, 3, 1, 2), scale);

assert('test positionCoordinateInBounds(1.99999, 3) out of bounds', grid.positionCoordinateInBounds(1.9999, 3) == false, true);
assert('test positionCoordinateInBounds(2, 2.9999) out of bounds', grid.positionCoordinateInBounds(2, 2.9999) == false, true);
assert('test positionCoordinateInBounds(2, 3) in bounds', grid.positionCoordinateInBounds(2, 3) == true, true);
assert('test positionCoordinateInBounds(2+1*scale-0.0001, 3+2*scale-0.0001) in bounds', grid.positionCoordinateInBounds(2+1*scale-0.0001, 3+2*scale-0.0001) == true, true);
assert('test positionCoordinateInBounds(2+1*scale-0.0001, 3+2*scale) out of bounds', grid.positionCoordinateInBounds(2+1*scale-0.0001, 3+2*scale) == false, true);
assert('test positionCoordinateInBounds(2+1*scale, 3+2*scale-0.0001) out of bounds', grid.positionCoordinateInBounds(2+1*scale, 3+2*scale-0.0001) == false, true);

assert('test calcPositionInGridFromOffsetedAndUnscaledPos(0, 0, 2*scale) == 0', grid.calcPositionInGridFromOffsetedAndUnscaledPos(0, 0, 2*scale) == 0, true);
assert('test calcPositionInGridFromOffsetedAndUnscaledPos(0, 1*scale + 0.9999, 2*scale) == 0', grid.calcPositionInGridFromOffsetedAndUnscaledPos(0, 1*scale + 0.9999, 2*scale) == 0, true);
assert('test calcPositionInGridFromOffsetedAndUnscaledPos(0, 2*scale, 2*scale) == 1', grid.calcPositionInGridFromOffsetedAndUnscaledPos(0, 2*scale, 2*scale) == 1, true);
assert('test calcPositionInGridFromOffsetedAndUnscaledPos(1*scale, 1*scale, 2*scale) == 0', grid.calcPositionInGridFromOffsetedAndUnscaledPos(1*scale, 1*scale, 2*scale) == 0, true);
assert('test calcPositionInGridFromOffsetedAndUnscaledPos(1*scale, 2*scale +0.9999, 2*scale) == 0', grid.calcPositionInGridFromOffsetedAndUnscaledPos(1*scale, 2*scale +0.9999, 2*scale) == 0, true);
assert('test calcPositionInGridFromOffsetedAndUnscaledPos(1*scale, 3*scale, 2*scale) == 1', grid.calcPositionInGridFromOffsetedAndUnscaledPos(1*scale, 3*scale, 2*scale) == 1, true);
}
