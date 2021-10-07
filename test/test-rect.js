TEST_SUITE.runAllTestsComplete = false;
{
testTitle('test rect')

let rect = new Rect(10, 11, 5, 8);

assert('test new rect has correct x', rect.x == 10, true);
assert('test new rect has correct y', rect.y == 11, true);
assert('test new rect has correct width', rect.width == 5, true);
assert('test new rect has correct height', rect.height == 8, true);

rect.scale(0,0);
assert('test new rect has still correct x after scaling 0', rect.x == 10, true);
assert('test new rect has still correct y after scaling 0', rect.y == 11, true);
assert('test new rect has still correct width after scaling 0', rect.width == 5, true);
assert('test new rect has still correct height after scaling 0', rect.height == 8, true);

rect.scale(2, 1);
assert('test rect gets scaled in x', rect.width == 5*2, true);
assert('test rect y still 8 after scale in x', rect.height == 8, true);

rect.scale(1, 2);
assert('test rect x stil 5*2 after scaling in y', rect.width == 5*2, true);
assert('test rect gets scaled in y', rect.height == 8*2, true);

let expectedOutput = 'rect: 10, 11, 10, 16';

assert('toString() working', rect.toString() == expectedOutput, true);

let rect2 = rect.clone();
assert('test rect.clone', rect.toString() == rect2.toString(), true);

rect = new Rect(10, 11, 5, 8)

assert('test rect isInBound function1', rect.isInBounds(10-0.0001,11) == false, true);
assert('test rect isInBound function2', rect.isInBounds(10,11-0.0001) == false, true);
assert('test rect isInBound function3', rect.isInBounds(10-0.0001,11-0.0001) == false, true);
assert('test rect isInBound function4', rect.isInBounds(10,11) == true, true);
assert('test rect isInBound function5', rect.isInBounds(15-0.0001, 19-0.00001) == true, true);
assert('test rect isInBound function7', rect.isInBounds(15, 19 - 0.0001) == false, true);
assert('test rect isInBound function8', rect.isInBounds(15 - 0.0001, 19) == false, true);

}