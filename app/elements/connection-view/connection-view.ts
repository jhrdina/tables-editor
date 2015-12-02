/// <reference path="../../../bower_components/polymer-ts/polymer-ts.d.ts"/>

class Coords {
  constructor(public x: number = 0, public y: number = 0) {
  }
}

function lineTrim(p1: Coords, p2: Coords) {
  var line = {p1: new Coords(), p2: new Coords()};
  if (p1.x < p2.x) {
    line.p1.x = 0;
    line.p2.x = p2.x - p1.x;
  } else {
    line.p2.x = 0;
    line.p1.x = p1.x - p2.x;
  }

  if (p1.y < p2.y) {
    line.p1.y = 0;
    line.p2.y = p2.y - p1.y;
  } else {
    line.p2.y = 0;
    line.p1.y = p1.y - p2.y;
  }
  return line;
}

class Curve {
  start: Coords;
  p1: Coords;
  middle: Coords;
  p2: Coords;
  end: Coords;
  constructor(start: Coords = new Coords(),
                 p1: Coords = new Coords(),
                 middle: Coords = new Coords(),
                 p2: Coords = new Coords(),
                 end: Coords = new Coords()) {
    this.start = start;
    this.p1 = p1;
    this.middle = middle;
    this.p2 = p2;
    this.end = end;
  }
}

@component('connection-view')
class ConnectionView extends polymer.Base {
  static space = 30;

  @property({ type: Number, notify: true })
  x1: number;

  @property({ type: Number, notify: true })
  y1: number;

  @property({ type: String, notify: true })
  dir1: string;

  @property({ type: Number, notify: true })
  x2: number;

  @property({ type: Number, notify: true })
  y2: number;

  @property({ type: String, notify: true })
  dir2: string;

  @observe("x1, y1, x2, y2, dir1, dir2")
  frame(x1, y1, x2, y2, dir1, dir2) {
    var frame = this.$.frame;

    if (x1 < x2) {
      frame.style.left = x1;
    } else {
      frame.style.left = x2;
    }

    if (y1 < y2) {
      frame.style.top = y1;
    } else {
      frame.style.top = y2;
    }

    frame.setAttribute("width", Math.abs(x1 - x2));
    frame.setAttribute("height", Math.abs(x1 - x2));
  }

  getPath() {
    var curve = new Curve();
    var diagonal = lineTrim({ x: this.x1, y: this.y1 }, { x: this.x2, y: this.y2 });
    curve.start = diagonal.p1;
    curve.end = diagonal.p2;

    curve.p1 = { x: curve.start.x + ConnectionView.space, y: curve.start.y };
    curve.p2 = { x: curve.end.x - ConnectionView.space, y: curve.end.y };

    curve.middle.x = (curve.p1.x + curve.p2.x) / 2.0;
    curve.middle.y = (curve.p1.y + curve.p2.y) / 2.0;

    var str: String;
    str = "M " + curve.start.x + " " + curve.start.y + " q ";
    str += curve.p1.x + " " + curve.p1.y + " ";
    str += curve.middle.x + " " + curve.middle.y + " ";

    str += "M " + curve.middle.x + " " + curve.middle.y + " q ";
    str += (curve.p2.x - curve.middle.x) + " " + (curve.p2.y - curve.middle.y) + " ";
    str += (curve.end.x - curve.middle.x) + " " + (curve.end.y - curve.middle.y) + " ";

    return str;
  }

  @computed({type: String})
  curvePath(x1, y1, x2, y2, dir1, dir2): String {
    var curve = new Curve();
    var diagonal = lineTrim({ x: x1, y: y1 }, { x: x2, y: y2 });
    curve.start = diagonal.p1;
    curve.end = diagonal.p2;

    curve.p1 = { x: curve.start.x + ConnectionView.space, y: curve.start.y };
    curve.p2 = { x: curve.end.x - ConnectionView.space, y: curve.end.y };

    curve.middle.x = (curve.p1.x + curve.p2.x) / 2.0;
    curve.middle.y = (curve.p1.y + curve.p2.y) / 2.0;

    var str: String;
    str = "M " + curve.start.x + " " + curve.start.y + " q ";
    str += curve.p1.x + " " + curve.p1.y + " ";
    str += curve.middle.x + " " + curve.middle.y + " ";

    str += "M " + curve.middle.x + " " + curve.middle.y + " q ";
    str += (curve.p2.x - curve.middle.x) + " " + (curve.p2.y - curve.middle.y) + " ";
    str += (curve.end.x - curve.middle.x) + " " + (curve.end.y - curve.middle.y) + " ";

    return str;
  }
}

ConnectionView.register();
