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

  // ================================================================
  // Connection mode
  // ================================================================

  sourceEntityIndex: number = -1;
  sourceEntityElement: any;
  preventEntityTargetSelection: boolean = false;

  connectorActiveChanged(e) {
    if (e.detail.value === true) {
      this.sourceEntityElement = e.target;
      this.sourceEntityIndex = this.$.entitiesRepeat.indexForElement(e.target);

      this.preventEntityTargetSelection = true;

    } else {
      this.sourceEntityElement = null;
      this.sourceEntityIndex = -1;
    }
  }

  @computed()
  connectionModeActive(sourceEntityIndex) {
    return sourceEntityIndex !== -1;
  }

  computeConnectorHidden(index, sourceEntityIndex) {
    return sourceEntityIndex !== -1 && index !== sourceEntityIndex;
  }

  handleEntityTap(e) {
    // Prevent immediate selecting the same entity as a Target
    // when tapping the connector button.
    if (this.preventEntityTargetSelection) {
      this.preventEntityTargetSelection = false;
      return;
    }

    var targetEntityIndex = this.$.entitiesRepeat.indexForElement(e.target);

    if (this.sourceEntityIndex === -1) return;

    this.push('model.connections', {
      entity1: this.sourceEntityIndex,
      entity2: targetEntityIndex,
      name: '',
      cardinality1: '1',
      cardinality2: '1'
    });

    this.sourceEntityElement.connectorActive = false;
    this.sourceEntityIndex = -1;
  }
}

EntitiesArea.register();
