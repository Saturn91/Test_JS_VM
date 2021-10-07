TEST_SUITE.runAllTestsComplete = false;
{
testTitle('test vector2f')

let vector = new Vector2f();

assert('new vector withou parameter is (0.0)', vector.x == 0 && vector.y == 0, true);

vector = new Vector2f(1, 0);

assert('test new vector has right values', vector.x == 1 && vector.y == 0, true);

vector = new Vector2f(0, 1);

assert('test new vector has right values', vector.x == 0 && vector.y == 1, true);

vector = new Vector2f();
vector.setValue(2, 3);
assert('new vector withou parameter is (2.3) after set Value', vector.x == 2 && vector.y == 3, true);

let x = 2;
let y = 3;
let scale = 2;
vector = new Vector2f(x, y);
vector.setScale(scale);

assert('test vector scale(2)', vector.x == x*scale && vector.y == y*scale, true);

x = 2;
y = 3;
vector = new Vector2f(x, y);

assert('test clone() works', vector.clone().x == x, vector.clone().y == y, true);

x = 2;
y = 3;
scale = 4;
vector = new Vector2f(x, y);

assert('test clone(scale) works', vector.clone(scale).x == x * scale, vector.clone(scale).y == y * scale, true);

x = 2;
y = 3;
scale = 3;
vector = new Vector2f(x, y);

assert('test getValueScaled(scale) works', vector.getValuesScaled(scale).x == x * scale, vector.getValuesScaled(scale).y == y * scale, true);
assert('test getValueScaled() returns undefined', vector.getValuesScaled() == undefined, true);

}