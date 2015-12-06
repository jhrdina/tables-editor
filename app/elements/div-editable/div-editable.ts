/// <reference path="../../../bower_components/polymer-ts/polymer-ts.d.ts"/>

@component('div-editable')
class DivEditable extends polymer.Base {
  @property({ type: Boolean, value: false })
  editable: boolean;

  @property({ type: String, value: "", notify: true})
  value: string;

  @property({ type: String, value: "^[a-zA-Z0-9_]+$" })
  regExp: string;

  @property({ type: Boolean, value: true, notify: true})
  valid: boolean;

  valuePrev = "";

  lastEvent = null;

  ready() {
    var than = this;
    this.$.edit.addEventListener('keyup', function(e) {
        than.value = this.innerHTML;
    });
    this.$.edit.addEventListener('keypress', function(e) {
      var regExp = new RegExp(than.regExp);
      var c = String.fromCharCode(e.which)
      if(c.match(regExp)) {
        than.valid = true;
      } else {
        e.preventDefault();
        return false;
      }
    });
    this.$.edit.addEventListener('keydown', function(e) {
      switch(e.which) {
        case 13:   //enter
          e.preventDefault();
          return false;
      }
      return true;
    });
    this.$.edit.addEventListener('paste', function(e) {
      e.preventDefault(e);
      return false;
    });
    this.$.edit.onclick = function() {
      if (than.editable != true) {
        than.editable = true;
        this.focus();
        var range = document.createRange();
        range.selectNodeContents(this);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }

    $(this.$.edit).focusout(function() {
      than.editable = false
      window.getSelection().removeAllRanges();
    });
  }
}

DivEditable.register();
