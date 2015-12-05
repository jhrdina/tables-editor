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

  activeIndex: number = -1;

  connectorActiveChanged(e) {
    this.activeIndex = e.detail.value === true ?
      this.$.entitiesRepeat.indexForElement(e.target) :
      -1;
  }

  computeConnectorHidden(index, activeIndex) {
    return activeIndex !== -1 && index !== activeIndex;
  }
}

EntitiesArea.register();
