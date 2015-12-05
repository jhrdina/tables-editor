/// <reference path="../../../bower_components/polymer-ts/polymer-ts.d.ts"/>

class Relation{
  position1: Coords;
  position2: Coords;
  direction1: String;
  direction2: String;
  connection: any;
  constructor() {
    this.position1 = new Coords();
    this.position2 = new Coords();
  }
}

@component('connections-view')
class ConnectionsView extends polymer.Base
{
  @property({type: Object, notify: true})
  model: any;

  //@property({ computed: 'computeRelations(model.*)'})
  relations: any;
  relationsLocked: boolean = false;

  ready() {
    this.relations = [];
  }

  @observe('model.*')
  computeRelations(change) {
    //TODO: handle only model.entities.#X.geometry changes by checking
    //      change.path.split('.') etc.

    var model = change.base;

    var rels = [];
    for(var connection in model.connections) {
      var rel = new Relation();
      rel.connection = model.connections[connection];

      // Get entities and its geometries
      var geometry1 = model.entities[rel.connection.entity1].geometry;
      var geometry2 = model.entities[rel.connection.entity2].geometry;

      console.log(geometry2.width);

      var entity1Corner = new Coords(geometry1.x, geometry1.y);
      var entity2Corner = new Coords(geometry2.x, geometry2.y);

      rel.position1 = entity1Corner.moveToDir("right", geometry2.width);
      rel.position2 = entity2Corner;

      rels.push(rel);
    }

    // Lock relations changes to prevent relationsChanged observer
    // from firing.
    this.relationsLocked = true;
    // Sets value and informs everyone who is interested that relations has changed.
    this.set('relations', rels);
    this.relationsLocked = false;
  }

  /**
   * Handles cardinality and name changes (can be deleted)
   */
  @observe("relations.*")
  relationsChanged(change) {
    if (this.relationsLocked || !this.model) return;

    // Transform path from format
    //     relations.#0.connection.cardinality1
    // to
    //     model.connection.#0.cardinality1
    // and notify.
    var pathParts = change.path.split('.');

    if (pathParts < 4 || pathParts[2] != 'connection') return;

    this.notifyPath('model.connections.' + pathParts[1]
                      + '.' + pathParts.slice(3).join('.'),
                    change.value);
  }

}

ConnectionsView.register();
