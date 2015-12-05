/// <reference path="../../../bower_components/polymer-ts/polymer-ts.d.ts"/>

@component('entities-area')
class EntitiesArea extends polymer.Base
{
  host: EntitiesArea = this;

  @property({ type: Object })
  model: any;

  addEntity() {
    this.push('model.entities', {
      name: "",
      geometry: {
        x: 30,
        y: 30
      },
      attributes: [
        {
          name: 'id',
          dataType: {
            name: 'NUMBER',
            capacity: 10
          },
          flags: [
            'PRIMARY_KEY'
          ]
        }
      ]
    });
  }
}

EntitiesArea.register();
