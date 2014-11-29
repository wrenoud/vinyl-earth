var vinylEarth = vinylEarth || require('../vinyl-earth');
if (typeof QUnit == 'undefined'){
  QUnit = require('qunitjs');
  QUnit.config.autorun
}

QUnit.test( "Point2D", function( assert ) {
  console.log(assert);
  assert.propEqual(new vinylEarth.Point2D(1,2),{x:1,y:2,t:undefined});
  assert.propEqual(new vinylEarth.Point2D(1,2,3),{x:1,y:2,t:3});
  assert.equal(new vinylEarth.Point2D(1,2,3).dim, 2);
});
QUnit.test( "Point3D", function( assert ) {
  assert.propEqual(new vinylEarth.Point3D(1,2),{x:1,y:2,t:undefined});
  assert.propEqual(new vinylEarth.Point3D(1,2,3),{x:1,y:2,t:3});
  assert.equal(new vinylEarth.Point3D(1,2,3).dim, 3);
});
