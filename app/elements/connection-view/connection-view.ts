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

function getPByDirection(p1: Coords, dir: String, angulation: number): Coords {
  var point: Coords;
  if (dir == "left") {
    point = new Coords(p1.x - angulation, p1.y);
  } else if (dir == "top") {
    point = new Coords(p1.x, p1.y - angulation);
  } else if (dir == "bottom") {
    point = new Coords(p1.x, p1.y + angulation);
  } else {
    point = new Coords(p1.x + angulation, p1.y);
  }
  return point;
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
  toString() {
    var str: String;

    var p1 = this.p1.getCenteredBy(this.start);
    var middle = this.middle.getCenteredBy(this.start);

    str = "M " + this.start.x + " " + this.start.y + " q ";
    str += p1.x + " " + p1.y + " ";
    str += middle.x + " " + middle.y + " ";

    var p2 = this.p2.getCenteredBy(this.middle);
    var end = this.end.getCenteredBy(this.middle);

    str += "M " + this.middle.x + " " + this.middle.y + " q ";
    str += p2.x + " " + p2.y + " ";
    str += end.x + " " + end.y + " ";

    return str;
  }
}

@component('connection-view')
class ConnectionView extends polymer.Base {
  static space = 40;
  static angulation = 30;

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

  @property({ type: Number, notify: true, value: NaN })
  xMiddle: number = NaN;

  @property({ type: Number, notify: true, value: NaN })
  yMiddle: number = NaN;



  @observe("x1, y1, x2, y2, dir1, dir2")
  frame(x1, y1, x2, y2, dir1, dir2) {
    var frame = this.$.frame;

    if (x1 < x2) {
      frame.style.left = (x1 - ConnectionView.space) + "px";
    } else {
      frame.style.left = (x2 - ConnectionView.space) + "px";
    }

    if (y1 < y2) {
      frame.style.top = (y1 - ConnectionView.space) + "px";
    } else {
      frame.style.top = (y2 - ConnectionView.space) + "px";
    }

    frame.setAttribute("width", (Math.abs(x1 - x2) + 2 * ConnectionView.space) + "px");
    frame.setAttribute("height", (Math.abs(y1 - y2) + 2 * ConnectionView.space) + "px");
  }

  @computed({ type: Curve })
  curve(x1, y1, x2, y2, dir1, dir2, yMiddle, xMiddle): Curve {
    var curve = new Curve();
    var diagonal = lineTrim(new Coords(x1, y1), new Coords(x2, y2), ConnectionView.space);
    curve.start = diagonal.p1;
    curve.end = diagonal.p2;

    curve.p1 = getPByDirection(curve.start, dir1, ConnectionView.angulation);
    curve.p2 = getPByDirection(curve.end, dir2, ConnectionView.angulation);

    curve.middle.x = (curve.p1.x + curve.p2.x) / 2.0;
    curve.middle.y = (curve.p1.y + curve.p2.y) / 2.0;


    return curve;
  }

  @computed({ type: String })
  curveString(curve): String {
    return curve.toString();
  }
}

ConnectionView.register();
