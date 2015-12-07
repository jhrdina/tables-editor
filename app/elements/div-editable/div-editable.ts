/// <reference path="../../../bower_components/polymer-ts/polymer-ts.d.ts"/>

@component('div-editable')
class DivEditable extends polymer.Base {
  @property({ type: Boolean, value: false, notify: true })
  editable: boolean;

  @property({ type: String, value: "", notify: true })
  value: string;

  @property({ type: String, value: "^[a-zA-Z0-9_]+$" })
  regExp: string;

  @property({ type: Boolean, value: true })
  allowSpaces: boolean;

  valueLocked: boolean;

  valueString: string;

  @observe("value")
  valueChanged(change) {
    if (!this.valueLocked) {
      this.$.edit.innerHTML = this.value;
    }
  }


  @observe("editable")
  editableOn(change) {
    if (this.editable == true) {
      //set element editable, focus and selection
      var element = this.$.edit;
      element.contentEditable = true;

      //it take some time to change element to editable
      //and before that its not focusable
      setTimeout(function() {
        element.focus()
        var range = document.createRange();
        range.selectNodeContents(element);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }, 1);
    } else {
      //set element not editable and remove selection
      window.getSelection().removeAllRanges();
      var element = this.$.edit;
      element.contentEditable = false;
    }
  }

  ready() {
    var than = this;

    //on keyup change value
    this.$.edit.addEventListener('keyup', function(e) {
      //lock value to not binding back
      than.valueLocked = true;
      than.value = this.textContent || this.innerText || "";
      than.valueLocked = false;
    });

    //filter by regular expression
    this.$.edit.addEventListener('keypress', function(e) {
      var regExp = new RegExp(than.regExp);
      e = e || window.event;
      var code = (typeof e.which != "undefined") ? e.which : e.button;
      var c = String.fromCharCode(code)

      if (e.charCode == 0) {
        return true;
      }

      if (c.match(regExp)) {
        return true;
      } else if (code == 32 && than.allowSpaces) { //space
        return true;
      }

      than.fire('invalid-input');
      e.preventDefault();
      return false;
    });

    //filter enter
    this.$.edit.addEventListener('keydown', function(e) {
      e = e || window.event;
      var code = (typeof e.which != "undefined") ? e.which : e.button;
      switch (code) {
        case 13:   //enter
          e.preventDefault();
          return false;
      }
      return true;
    });

    //paste is not allowed
    this.$.edit.addEventListener('paste', function(e) {
      e = e || window.event;

      // cancel paste
      e.preventDefault();

      // get text representation of clipboard
      var text = e.clipboardData.getData("text/plain");

      var regExp = new RegExp(than.regExp);
      if (!text.match(regExp)) {
        than.fire('invalid-input');
        return false;
      }

      // insert text manually
      document.execCommand("insertHTML", false, text);
    });

    //on click set this editable
    this.$.edit.onclick = function() {
      than.editable = true;
    }

    //on focusout set not editable
    this.$.edit.addEventListener("blur", function() {
      than.editable = false
    });
  }
}

DivEditable.register();
