/// <reference path="../../../bower_components/polymer-ts/polymer-ts.d.ts"/>

@component('div-editable')
class DivEditable extends polymer.Base {
  @property({ type: Boolean, value: false, notify: true })
  editable: boolean;

  @property({ type: String, value: "", notify: true})
  value: string;

  @property({ type: String, value: "^[a-zA-Z0-9_]+$" })
  regExp: string;

  editableString = "false";

  @observe("editable")
  editableOn(change) {
    if(this.editable == true) {
      var element = this.$.edit;
      element.contentEditable = true;
      console.log(element);
      this.editable = true;
      setTimeout(function(){element.focus()}, 1);
      var range = document.createRange();
      range.selectNodeContents(element);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } else {
      window.getSelection().removeAllRanges();
      var element = this.$.edit;
      element.contentEditable = false;
    }
  }

  ready() {
    var than = this;
    this.$.edit.addEventListener('keyup', function(e) {
        than.value = this.innerHTML;
    });
    this.$.edit.addEventListener('keypress', function(e) {
      var regExp = new RegExp(than.regExp);
      var c = String.fromCharCode(e.which)
      if(c.match(regExp)) {
        return true;
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
      than.editable = true;
    }

    $(this.$.edit).focusout(function() {
      than.editable = false
    });
  }
}

DivEditable.register();
