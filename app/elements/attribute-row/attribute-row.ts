/// <reference path="../../../bower_components/polymer-ts/polymer-ts.d.ts"/>

@component('attribute-row')
class AttributeRow extends polymer.Base {
  @property({ type: Object, notify: true })
  attribute: any;

  @property({ type: Boolean, value: false })
  disabled: boolean;

  // ================================================================
  // Attributes
  // ================================================================

  attrKeyDown(e) {
    if (e.which === 13) {
      // Enter
      this.fire('attr-insert-below', {target: this});

    } else if (e.which === 8 && !this.attribute.name) {
      // Backspace and is empty
      this.fire('attr-delete', {direction: 'left'});

    } else if (e.which === 46 && !this.attribute.name) {
      // Delete and is empty
      this.fire('attr-delete', {direction: 'right'});

    } else if (e.which === 38) {
      // Arrow up
      this.fire('attr-cursor-move', {direction: 'up'});

    } else if (e.which === 40) {
      // Arrow down
      this.fire('attr-cursor-move', {direction: 'down'});

    } else {
      return;
    }

    e.preventDefault();
  }

  focus() {
    this.$.attrNameField.focus();
  }
}

AttributeRow.register();
