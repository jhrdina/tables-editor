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

  @computed()
  relations(model) {
    var rels = [];
    for(var connection in model.connections) {
      var rel = new Relation();
      rel.connection = model.connections[connection];

      var geometry1 = model.entities[rel.connection.entity1].geometry;
      var geometry2 = model.entities[rel.connection.entity2].geometry;

      var entity1Corner = new Coords(geometry1.x, geometry1.y);
      var entity2Corner = new Coords(geometry2.x, geometry2.y);

      rel.position1 = entity1Corner;
      rel.position2 = entity2Corner;

      rels.push(rel);
    }
    return rels;
  }

  @observe("model.connections")
  observator(connections) {
    console.log(connections[0]);
  }
}

ConnectionsView.register();
