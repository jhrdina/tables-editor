/// <reference path="../../../bower_components/polymer-ts/polymer-ts.d.ts"/>
/// <reference path="../../../typings/draggabilly/draggabilly.d.ts"/>

@component('entity-box')
class EntityBox extends polymer.Base {

  draggie: Draggabilly;

  ready() {
    this.draggie = new Draggabilly(this, {
      containment: 'entities-area',
      handle: '.handle',
    });
  }
}

EntityBox.register();
