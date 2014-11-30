var vinylEarth = vinylEarth || require('../vinyl-earth');

QUnit.test( "Point", function( assert ) {
  assert.propEqual(new vinylEarth.Point([1,2]),{dim:2,x:1,y:2,t:undefined});
  assert.propEqual(new vinylEarth.Point([1,2],3),{dim:2,x:1,y:2,t:3});
  assert.propEqual(new vinylEarth.Point([1,2,3]),{dim:3,x:1,y:2,z:3,t:undefined});
  assert.propEqual(new vinylEarth.Point([1,2,3],4),{dim:3,x:1,y:2,z:3,t:4});
  assert.throws(function(){new vinylEarth.Point3D()});
});

QUnit.test( "Segment", function( assert ) {
  var p2D_1 = new vinylEarth.Point([1,1],0.0);
  var p2D_2 = new vinylEarth.Point([2,2],0.5);
  var p3D_1 = new vinylEarth.Point([1,1,1],0.0);
  var p3D_2 = new vinylEarth.Point([2,2,2],0.5);
  var p3D_3 = new vinylEarth.Point([2,2,2]);
  var s2D = new vinylEarth.Segment(p2D_1,p2D_2);
  var s3D = new vinylEarth.Segment(p3D_1,p3D_2);
  var s3D_2 = new vinylEarth.Segment(p3D_1,p3D_3);
  
  assert.throws(function(){new vinylEarth.Segment(p2D_1,p3D_1)},"Dimension missmatch on endpoints");
  assert.equal(s2D.distance(), Math.sqrt(2),"2D Distance Calc");
  assert.equal(s3D.distance(), Math.sqrt(3),"3D Distance Calc");
  assert.equal(s2D.speed(), Math.sqrt(2)/.5,"2D Speed Calc");
  assert.equal(s3D.speed(), Math.sqrt(3)/.5,"3D Speed Calc");
  assert.equal(s3D_2.speed(), undefined, "Time mismatch, undefined");
});

QUnit.test( "Track", function( assert ) {
  var track = new vinylEarth.Track();
  track.addPoint(1,1);
  assert.propEqual(track._track[0],{dim:3,x:1,y:1,z:0,t:undefined});
  assert.equal(track._track[0].dim,2);
  
  var track = new vinylEarth.Track();
  track.addPoint(2,2,2);
  assert.propEqual(track._track[0],{dim:3,x:2,y:2,z:2,t:undefined});
  assert.equal(track._track[0].dim,3);
  
  var track = new vinylEarth.Track();
  track.addPoint(3,3,null,3);
  assert.propEqual(track._track[0],{dim:3,x:3,y:3,z:0,t:3});
  assert.equal(track._track[0].dim,2);

  var track = new vinylEarth.Track();
  track.addPoint(4,4,4,4);
  assert.propEqual(track._track[0],{dim:3,x:4,y:4,z:4,t:4});
  assert.equal(track._track[0].dim,3);
  assert.throws(function(){track.addPoint(5,5)},"Dimension missmatch");
});
