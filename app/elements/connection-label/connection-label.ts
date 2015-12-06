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

  ready() {
    this.$.label.onclick = function() {
      if (this.getAttribute("contenteditable") != "true") {
        this.setAttribute("contenteditable", "true");
        this.focus();
        var range = document.createRange();
        range.selectNodeContents(this);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }

    $(this.$.label).focusout(function() {
      this.setAttribute("contenteditable", "false");
      window.getSelection().removeAllRanges();
    });

    this.onkeydown = function(in_event) {
      //TODO: filter keys
      return true;
    }
  }
}

ConnectionLabel.register();
