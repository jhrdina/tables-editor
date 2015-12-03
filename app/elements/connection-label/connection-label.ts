/// <reference path="../../../bower_components/polymer-ts/polymer-ts.d.ts"/>

@component('connection-label')
class ConnectionLabel extends polymer.Base
{
  @property({type: String, notify: true})
  name: String;

  @property({type: Number})
  xTarget: number;

  @property({type: Number})
  yTarget: number;

  @observe("xTarget, yTarget")
  position(xTarget, yTarget) {
    this.style.left = xTarget + "px";
    this.style.top = yTarget + "px";
  }
}

ConnectionLabel.register();
