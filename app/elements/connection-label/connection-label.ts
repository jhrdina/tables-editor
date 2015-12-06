/// <reference path="../../../bower_components/polymer-ts/polymer-ts.d.ts"/>
/// <reference path="../../../typings/jquery/jquery.d.ts"/>

@component('connection-label')
class ConnectionLabel extends polymer.Base {
  @property({ type: String, notify: true })
  name: String;

  @property({ type: Number })
  xTarget: number;

  @property({ type: Number })
  yTarget: number;

  @observe("xTarget, yTarget")
  position(xTarget, yTarget) {
    var label = this.$.label;
    label.style.left = xTarget + "px";
    label.style.top = yTarget + "px";
  }
}

ConnectionLabel.register();
