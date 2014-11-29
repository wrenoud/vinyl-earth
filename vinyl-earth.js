var Point2D = function(x,y,t){
  this.x = x;
  this.y = y;
  this.t = t || null;
}
var Point3D = function(x,y,z,t){
  this = new Point2D(x,y,t);
  this.z = z;
}

var Segment = function(start, end, options){
  this.options = options || {};
  this.start = start;
  this.end = end;
  
  var _distance = null;
  this.distance = function(){
    if(_distance === null){
      _distance = Math.sqrt(Math.pow(this.end[0]-this.start[0],2) + Math.pow(this.end[1]-this.start[1],2));
    }
    return _distance;
  };
  var _speed = null;
  this.speed = function(){
    if(!this._distance){
      Math.sqrt(Math.pow(this.end[0]-this.start[0],2) + Math.pow(this.end[1]-this.start[1],2));
    }
    return this._distance;
  }
}

var vinylEarth = function(options){
  this.options = options;
  this._track = [];
  this._segments = [];
  this.addTrack = function(points){

  }
  /**
   * adds a point to the track
   *
   * Syntax:
   *   addPoint([lat,lon,height,time]);
   *   addPoint(lat,lon,height,time);
   * 
   * @param {[type]} point [description]
   */
  this.addPoint = function(point){
    if(arguments.length > 1){
      this.addPoint(arguments);
    }

    this._track.push(point);
    if(this._track.length > 0){
      //this._segments.
    }
  }
}

var p1 = new Point2D(1,1);
console.log(p1);