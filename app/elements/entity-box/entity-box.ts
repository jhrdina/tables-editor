/// <reference path="../../../bower_components/polymer-ts/polymer-ts.d.ts"/>
/// <reference path="../../../typings/draggabilly/draggabilly.d.ts"/>

@component('entity-box')
class EntityBox extends polymer.Base {

  is = "entity-box";

  private static idNum = 0;

  @property({ type: String, notify: true })
  name: string;

  constructor() {
    super();
    EntityBox.idNum += 1;
    if (!this.name) {
      this.name = "Table " + EntityBox.idNum;
    }
  }


  draggie: Draggabilly;

  ready() {
    this.draggie = new Draggabilly(this, {
      containment: 'entities-area',
      handle: '.title-text',
    })
  };
}

EntityBox.register();
