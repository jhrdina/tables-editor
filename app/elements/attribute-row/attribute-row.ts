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
      this.fire('delete', {direction: 'left'});

    } else if (keyEvent.which === 46 && !this.attribute.name) {
      // Delete and is empty
      this.fire('delete', {direction: 'right'});
    }
  }

  focus() {
    this.$$('input').focus();
  }
}

AttributeRow.register();
