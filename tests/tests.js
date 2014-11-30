var vinylEarth = vinylEarth || require('../vinyl-earth');

QUnit.test( "Segment", function( assert ) {
  var cambg = new vinylEarth.LatLonE(52.205, 0.119);
  var paris = new vinylEarth.LatLonE(48.857, 2.351, 0, 2);
  var seg = new vinylEarth.Segment(cambg, paris);
  
  assert.equal(seg.getDuration(), undefined, "Time mismatch, undefined");
  assert.equal(seg.getSpeed(), undefined, "Time mismatch, undefined");

  seg.start.date = 1;

  assert.equal(seg.pointByDistance(seg.getDistance()/2).date, 1.5, "propogating time by distance");
  assert.equal(seg.pointByTime(0.5).distanceTo(cambg), seg.getDistance()/2, "propogating distance by time");
  console.log(seg.getDistance()*2);
});

QUnit.test( "Track", function( assert ) {
  var datum = new vinylEarth.LatLonE().datum;
  var track = new vinylEarth.Track();
  track.addPoint(1,1);
  assert.propEqual(track.getPoint(0),{datum:datum,lat:1,lon:1,height:0,date:undefined});
  
  var track = new vinylEarth.Track();
  track.addPoint(2,2,2);
  assert.propEqual(track.getPoint(0),{datum:datum,lat:2,lon:2,height:2,date:undefined});
  
  var track = new vinylEarth.Track();
  track.addPoint(3,3,null,3);
  assert.propEqual(track.getPoint(0),{datum:datum,lat:3,lon:3,height:0,date:3});

  var track = new vinylEarth.Track();
  track.addPoint(4,4,4,4);
  assert.propEqual(track.getPoint(0),{datum:datum,lat:4,lon:4,height:4,date:4});
  track.addPoint(5,5)

  var track = new vinylEarth.Track();
  track.addTrack([[52.205, 0.119], [48.857, 2.351], [52.205, 0.119], [48.857, 2.351]]);
  assert.equal(track.getDistance(), 1213823.418, "track distance summation");
  
  var number_of_points = 3001
  var points = track.generatePointsOnTrack(number_of_points)

  assert.equal(points.length, number_of_points, "track generation");
  var expected_step = Number((1213823.418 / (number_of_points - 1)).toFixed(3));
  var err_count = 0;
  for(var i = 1; i < points.length; i++){
    var seg = new vinylEarth.Segment(points[i-1],points[i]);
    if(seg.getDistance() !== expected_step){
      assert.equal(seg.getDistance(), expected_step, "Checking step values at index: " + i);
      if(++err_count > 10){
        break;
      }
    }
  }
});
