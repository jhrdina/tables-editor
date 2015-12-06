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
    } else if (dir == "up") {
      box.style.transform = "translate(-50%, -100%)";
    } else if (dir == "down") {
      box.style.transform = "translate(-50%, 0%)";
    } else {
      box.style.transform = "translate(0%, -50%)";
    }
  }

  @observe("cardinality, x, y")
  place(cardinality, x, y) {
    var container = this.$.container;
    container.style.left = x + "px";
    container.style.top = y + "px";
  }

  ready() {
    var _this = this;
    var dropmenu = this.$.dropmenu;
    this.$.box.onclick = function() {
      dropmenu.open();
    };
  }

  dropdownValues = ["1", "0..1", "0..n", "1..n"];

  @observe("cardinality")
  cardinalityObserver(cardinality){
    for(var i in this.dropdownValues) {
      if(this.dropdownValues[i] == cardinality) {
        this.dropdownIndex = i;
      }
    }
  }

  @observe("dropdownIndex")
  dropdownObserver(dropdownIndex){
    this.cardinality = this.dropdownValues[dropdownIndex];
  }

  dropdownIndex: number;
}

ConnectionCardinality.register();
