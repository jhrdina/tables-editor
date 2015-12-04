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
      console.log(keyEvent);
      // TODO: handle ENTER
    }
  }


}

AttributeRow.register();
