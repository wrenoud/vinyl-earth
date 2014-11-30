
'use strict';
if (typeof module!='undefined' && module.exports) var LatLonE = require('node_modules/geodesy-libraries/latlon-vincenty.js'); // CommonJS (Node.js)

// new namespace object defined by this file
var vinylEarth = {};
// import used by this file
// var dependency = dependency || require('./dependency');  
(function(){

  // extend LatLonE to contain a date
  vinylEarth.LatLonE = function(lat, lon, height, date) {
    LatLonE.call(this, lat, lon, undefined, height);
    this.date = date;
  }
  vinylEarth.LatLonE.prototype = Object.create(LatLonE.prototype);

  /**
   * [Segment description]
   * @param {LatLonE} start   the starting point of the segment
   * @param {LatLonE} end     the end point of the segment
   * @param {Object}          options options include 'distanceMode' = ['strait'|'geographic']
   */
  vinylEarth.Segment = function(start, end, options){
    this.options = options || {};
    this.start = start;
    this.end = end;

    var _inverse = start.inverse(end);

    this.getDistance = function(){
      return _inverse.distance;
    };

    this.getDuration = function(){
      if(this.end.date && this.start.date){
        return this.end.date - this.start.date;
      }else{
        return null;
      }
    };

    this.getSpeed = function(){
      if(this.getDuration()){
        return _inverse.distance / this.getDuration();
      }else{
        return null;
      }
    }

    this.pointByTime = function(time){
      return this.pointByDistance( time * this.getSpeed());
    }
    this.pointByDistance = function(distance){
      if(distance > _inverse.distance){
        throw "Distance no on the line";
      }
      var point = start.destinationPoint(_inverse.initialBearing, distance);
      if(this.getDuration()){
        point.date = this.start.date + this.getDuration() * (distance / _inverse.distance);
      }
      return point;
    }
  }

  vinylEarth.Track = function(options){
    this.options = options || {};
    var _track = [];
    var _segments = [];
    var _segments_distances = [];
    var _distance = 0.0;

    this.getDistance = function(){
      return _distance;
    }
    this.getPoint = function(index){
      return _track[index];
    }

    this.addTrack = function(points){
      var track = this;
      points.forEach(function(point){
        track.addPoint(point);
      });
    }
    
    /**
     * adds a point to the track
     *
     * Syntax:
     *   addPoint([lat,lon,height,time]);
     *   addPoint(lat,lon,height,time);
     *   addPoint(lat,lon,height);
     *   addPoint(lat,lon,null,time);
     *   addPoint(lat,lon);
     * 
     * @param {[type]} point [description]
     */
    this.addPoint = function(point){
      if(arguments.length > 1){
        return this.addPoint(arguments);
      }

      var new_point = null;

      if(point.length === 2 || (point.length > 2 && !point[2])){
        // set to "sea level"
        point[2] = 0;
      }

      if(point.length === 3){
        new_point = new vinylEarth.LatLonE(point[0],point[1],point[2]);
      }else{
        new_point = new vinylEarth.LatLonE(point[0],point[1],point[2], point[3]);
      }

      var track_length = _track.push(new_point);
      if(track_length > 1){
        var length = _segments.push(new vinylEarth.Segment(_track[track_length-2], new_point));
        _segments_distances.push(_distance);
        _distance += _segments[length-1].getDistance();
      }
    }

    /**
     * Generates a list of numbers using the provided reducer to convert from geographic coordinates to a single value
     * @param  {integer}  count   the number of points to extract from the track
     * @param  {function} reducer a reducer function to convert from geographic to 
     * @return {[type]}         [description]
     */
    this.generatePointsOnTrack = function(num_points){
      var track_traveled = 0;
      var step = _distance / (num_points - 1);
      var points = [_track[0]]; // initiallize with the beginning of the line
      track_traveled += step;
      
      // found I had to bias the distance a little short
      // due to rounding issue when points land near track points
      var bumper = 0.0001;

      for(var i = 0; i < _segments.length; i++){
        while(track_traveled - bumper <= _segments_distances[i] + _segments[i].getDistance()){
          var distance_on_segment = track_traveled - _segments_distances[i];
          points.push(_segments[i].pointByDistance(track_traveled - bumper - _segments_distances[i]))
          track_traveled += step;
        }
      }
      return points;
    }

    this.generateNumbers = function(count, reducer){
      var points = this.generatePointsOnTrack(count);
      var numbers = [];
      points.forEach(function(point){
        numbers.push(reducer(point));
      })
      return numbers;
    }
  }

if (typeof module != 'undefined' && module.exports) module.exports = vinylEarth; // CommonJS
if (typeof define == 'function' && define.amd) define([], function() { return vinylEarth; }); // AMD
})();
