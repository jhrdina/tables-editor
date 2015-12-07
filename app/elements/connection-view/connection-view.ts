/// <reference path="../../../bower_components/polymer-ts/polymer-ts.d.ts"/>

class Coords {
  constructor(public x: number = 0, public y: number = 0) {
  }
  getCenteredBy(p1: Coords, space: number = 0) {
    var p2 = new Coords(this.x, this.y);
    p2.x = p2.x - p1.x + space;
    p2.y = p2.y - p1.y + space;
    return p2;
  }
  moveToDir(dir: String, angulation: number) {
    var point: Coords;
    if (dir == "left") {
      point = new Coords(this.x - angulation, this.y);
    } else if (dir == "up") {
      point = new Coords(this.x, this.y - angulation);
    } else if (dir == "down") {
      point = new Coords(this.x, this.y + angulation);
    } else {
      point = new Coords(this.x + angulation, this.y);
    }
    return point;
  }

  between(point: Coords):Coords {
    var b = new Coords();
    b.x = (this.x + point.x) / 2.0;
    b.y = (this.y + point.y) / 2.0;
    return b;
  }
}

function lineTrim(p1: Coords, p2: Coords, space: number = 0) {
  var line = { p1: new Coords(), p2: new Coords() };
  if (p1.x < p2.x) {
    line.p1.x = space;
    line.p2.x = (p2.x - p1.x) + space;
  } else {
    line.p2.x = space;
    line.p1.x = (p1.x - p2.x) + space;
  }

  if (p1.y < p2.y) {
    line.p1.y = space;
    line.p2.y = (p2.y - p1.y) + space;
  } else {
    line.p2.y = space;
    line.p1.y = (p1.y - p2.y) + space;
  }
  return line;
}

class Curve {
  start: Coords;
  p1: Coords;
  middle: Coords;
  p2: Coords;
  end: Coords;
  label1: Coords;
  label2: Coords;

  constructor() {
    this.start = new Coords();
    this.p1 = new Coords();
    this.middle = new Coords();
    this.p2 = new Coords();
    this.end = new Coords();
    this.label1 = new Coords();
    this.label2 = new Coords();
  }


  toString() {
    var str: String;

    str = "M" + this.start.x + "," + this.start.y + " C";
    str += this.p1.x + "," + this.p1.y + " ";
    str += this.p1.x + "," + this.p1.y + " ";
    str += this.middle.x + "," + this.middle.y + " S";
    str += this.p2.x + "," + this.p2.y + " ";
    str += this.end.x + "," + this.end.y + " ";
    return str;
  }
}

@component('connection-view')
class ConnectionView extends polymer.Base {
  static space = 65;
  static angulation = 60;

  @property({ type: Number })
  x1: number;

  @property({ type: Number })
  y1: number;

  @property({ type: String })
  dir1: string;

  @property({ type: Number })
  x2: number;

  @property({ type: Number })
  y2: number;

  @property({ type: String })
  dir2: string;

  @property({ type: String, notify: true })
  name: String;

  @property({ type: String, notify: true})
  car1: String;

  @property({ type: String, notify: true})
  car2: String;





  @computed()
  frame(x1, y1, x2, y2, dir1, dir2) {
    var frameCors = new Coords();
    var frame = this.$.frame;
    var svg = this.$.svg;

    if (x1 < x2) {
      frameCors.x = (x1 - ConnectionView.space);
    } else {
      frameCors.x = (x2 - ConnectionView.space);
    }
    frame.style.left = frameCors.x + "px";

    if (y1 < y2) {
      frameCors.y = (y1 - ConnectionView.space);
    } else {
      frameCors.y = (y2 - ConnectionView.space);
    }

    frame.style.top = frameCors.y + "px";

    svg.setAttribute("width", (Math.abs(x1 - x2) + 2 * ConnectionView.space) + "px");
    svg.setAttribute("height", (Math.abs(y1 - y2) + 2 * ConnectionView.space) + "px");

    return frameCors;
  }

  @computed({ type: Curve })
  curve(x1, y1, x2, y2, dir1, dir2): Curve {
    var curve = new Curve();
    var diagonal = lineTrim(new Coords(x1, y1), new Coords(x2, y2), ConnectionView.space);
    curve.start = diagonal.p1;
    curve.end = diagonal.p2;

    curve.p1 = curve.start.moveToDir(dir1, ConnectionView.angulation);
    curve.p2 = curve.end.moveToDir(dir2, ConnectionView.angulation);

    curve.middle.x = (curve.p1.x + curve.p2.x) / 2.0;
    curve.middle.y = (curve.p1.y + curve.p2.y) / 2.0;

    curve.label1 = curve.start.moveToDir(dir1, 5);
    curve.label2 = curve.end.moveToDir(dir2, 5);

    return curve;
  }

  @computed({ type: Number })
  middle(curve, frame): Coords {
    var middle = new Coords();
    middle.x = frame.x + curve.middle.x;
    middle.y = frame.y + curve.middle.y;
    return middle;
  }

  @computed({ type: String })
  curveString(curve): String {
    return curve.toString();
  }

  handleDelete(e) {
    this.fire("delete");
  }
}

ConnectionView.register();
