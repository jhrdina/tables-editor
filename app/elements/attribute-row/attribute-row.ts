/// <reference path="../../../bower_components/polymer-ts/polymer-ts.d.ts"/>

@component('attribute-row')
class AttributeRow extends polymer.Base {
  @property({ type: Object, notify: true })
  attribute: any;

  // ================================================================
  // Attributes
  // ================================================================

  attrKeyDown(keyEvent) {
    if (keyEvent.which === 13) {
      // Enter
      this.fire('insert-below', {target: this});

    } else if (keyEvent.which === 8 && !this.attribute.name) {
      // Backspace and is empty
      this.fire('delete', {target: this});
    }
  }

  focus() {
    this.$$('input').focus();
  }
}

AttributeRow.register();
