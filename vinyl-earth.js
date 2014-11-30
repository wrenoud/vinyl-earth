
// new namespace object defined by this file
var vinylEarth = {};
// import used by this file
// var dependency = dependency || require('./dependency');  
(function(){

  vinylEarth.Point = function(coord,t){
    if(coord.length < 2) throw "Point requires minimum of x and y coordinates";
    this.x = coord[0];
    this.y = coord[1];
    if(coord.length === 3){
      this.z = coord[2];
      this.dim = 3;
    }else{
      this.dim = 2;
    }
    this.t = t;
  }

  /**
   * [Segment description]
   * @param {Point2D|Point2D} start   the starting point of the segment
   * @param {Point2D|Point2D} end     the end point of the segment
   * @param {Object}          options options include 'distanceMode' = ['strait'|'geographic']
   */
  vinylEarth.Segment = function(start, end, options){
    this.options = options || {};
    this.start = start;
    this.end = end;

    if(start.dim !== end.dim) throw "Dimension mismatch in segment endpoints";
    
    var _distance = null;
    this.distance = function(){
      if(_distance === null){
        switch(this.options.distanceMode){
          case("geographic"):
            throw "Geographic distances not yet supported.";
            break;
          case("strait"):
          default:
            _distance = 0;
            for(var i = 0; i < this.end.dim; i++){
              var dim = ['x','y','z'][i];
              _distance += Math.pow(this.end[dim]-this.start[dim],2);
            }
            _distance = Math.sqrt(_distance);
        }
      }
      return _distance;
    };
    var _speed = null;
    this.speed = function(){
      if((this.end.t || this.end.t === 0) && (this.start.t || this.start.t === 0)){
        return this.distance() / (this.end.t-this.start.t);
      }else{
        return undefined;
      }
    }
  }

  vinylEarth.Track = function(options){
    this.options = options || {};
    this._track = [];
    this._segments = [];
    var _distance = 0.0;

    this.addTrack = function(points){

    }
    
    /**
     * adds a point to the track
     *
     * Syntax:
     *   addPoint([lon,lat,height,time]);
     *   addPoint(lon,lat,height,time);
     *   addPoint(lon,lat,height);
     *   addPoint(lon,lat,null,time);
     *   addPoint(lon,lat);
     * 
     * @param {[type]} point [description]
     */
    this.addPoint = function(point){
      if(arguments.length > 1){
        return this.addPoint(arguments);
      }

      var new_point = null;

      if(point.length === 2 || (point.length > 2 && !point[2]){
        // set to "sea level"
        point[2] = 0;
      }

      if(point.length === 3){
        new_point = new vinylEarth.Point([point[0],point[1],point[2]]);
      }else{
        new_point = new vinylEarth.Point([point[0],point[1],point[2]], point[3]);
      }

      var track_length = this._track.push(new_point);
      if(track_length > 1){
        try{
          var length = this._segments.push(new vinylEarth.Segment(this._track[track_length-2], new_point))
        }catch(e){
          throw "All track points must be of the same dimensions";
        }
        _distance += this._segments[length-1].distance()
      }
    }

    /**
     * Generates a list of numbers using the provided reducer to convert from geographic coordinates to a single value
     * @param  {integer}  count   the number of points to extract from the track
     * @param  {function} reducer a reducer function to convert from geographic to 
     * @return {[type]}         [description]
     */
    this.generate = function(count, reducer){

    }
  }

  

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = vinylEarth;
  }
})();
