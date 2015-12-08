/// <reference path="../../../bower_components/polymer-ts/polymer-ts.d.ts"/>

var pol: any = Polymer;

@component('div-editable')
@behavior(pol.IronControlState)
@hostAttributes({
  spellcheck: "false",
  tabindex: "0",
  contentEditable: 'true'
})
class DivEditable extends polymer.Base {

  @property({ type: String, value: "", notify: true })
  value: string;

  @property({ type: String, value: "^[a-zA-Z0-9_]+$" })
  regExp: string;

  @property({ type: Boolean, value: true })
  allowSpaces: boolean;

  @property({ type: String, value: null })
  placeholder: string;

  @property({ type: Boolean, value: false})
  selectOnFocus: boolean;

  valueLocked: boolean;

  valueString: string;

  focused;

  @observe("value, placeholder")
  valueChanged(change) {
    if (!this.valueLocked) {
      this.innerHTML = this.value || this.placeholder;
    }
  }

  @listen('tap')
  onTap() {
    if (!this.focused) {
      this.focus();
    }
  }

  @listen('focus')
  onFocus() {
    if (this.selectOnFocus) {
      this.async(function() {
        var range = document.createRange();
        range.selectNodeContents(this);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }, 1);
    }

    if (!this.value) {
      this.innerText = '';
    }
  }

  @listen('blur')
  handleBlur() {
    window.getSelection().removeAllRanges();

    if (!this.value) {
      this.innerText = this.placeholder;
    }
  }

  @listen('keyup')
  handleKeyUp() {
    //on keyup change value
    //lock value to not binding back
    this.valueLocked = true;
    this.value = this.textContent || this.innerText || "";
    this.valueLocked = false;
  }

  @listen('keypress')
  handleKeyPress(e) {
    //filter by regular expression
    var regExp = new RegExp(this.regExp);
    e = e || window.event;
    var code = (typeof e.which != "undefined") ? e.which : e.button;
    var c = String.fromCharCode(code)

    if (e.charCode == 0) {
      return true;
    }

    if (c.match(regExp)) {
      return true;
    } else if (code == 32 && this.allowSpaces) { //space
      return true;
    }

    this.fire('invalid-input');
    e.preventDefault();
    return false;
  }

  @listen('keydown')
  handleKeyDown(e) {
    //filter enter

    e = e || window.event;
    var code = (typeof e.which != "undefined") ? e.which : e.button;
    switch (code) {
      case 13:   //enter
        e.preventDefault();
        return false;
    }
    return true;
  }

  @listen('paste')
  handlePaste(e) {
    //paste is not allowed

    e = e || window.event;

    // cancel paste
    e.preventDefault();

    // get text representation of clipboard
    var text = e.clipboardData.getData("text/plain");

    var regExp = new RegExp(this.regExp);
    if (!text.match(regExp)) {
      this.fire('invalid-input');
      return false;
    }

    // insert text manually
    document.execCommand("insertHTML", false, text);
  }
}

DivEditable.register();
