/// <reference path="../../../bower_components/polymer-ts/polymer-ts.d.ts"/>

@component('connection-cardinality')
class ConnectionCardinality extends polymer.Base {
  @property({ type: String, value: "1", notify: true })
  cardinality: String;

  @property({ type: String, value: "right" })
  dir: string;

  @property({ type: Number })
  x: number;

  @property({ type: Number })
  y: number;

  @observe("dir")
  direction(dir) {
    var box = this.$.box;
    if (dir == "left") {
      box.style.transform = "translate(-100%, -50%)";
    } else if (dir == "top") {
      box.style.transform = "translate(-50%, -100%)";
    } else if (dir == "bottom") {
      box.style.transform = "translate(-50%, 0%)";
    } else {
      box.style.transform = "translate(0%, -50%)";
    }
  }

  @observe("cardinality, x, y")
  place(cardinality, x, y) {
    var box = this.$.box;
    box.style.left = x + "px";
    box.style.top = y + "px";
  }
}

ConnectionCardinality.register();
