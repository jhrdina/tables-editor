/// <reference path="../../../bower_components/polymer-ts/polymer-ts.d.ts"/>

class Orientation {
  position: Coords;
  direction: string;
}

class Relation{
  first: Orientation;
  second: Orientation;
  connection: any;
  constructor() {
    this.first = new Orientation();
    this.second = new Orientation();
  }
  getSide(side: string) {
    this[side]
  }
}

class TablePort{
  constructor(public side: string, public position: Coords, public selfConnection: boolean = false) {
  }
}

class Sides {
  constructor(public left = [], public right = [], public down = []) {
  }
}

class TableSides{
  geometry: any = {};
  sides: Sides;
  sideAlign(direction: string){
    var sideConnections = this.sides[direction];
    var start = new Coords(this.geometry.x, this.geometry.y);
    if(direction == "right") {
      start = start.moveToDir("right", this.geometry.width)
    }
    if(direction == "down") {
      start = start.moveToDir("down", this.geometry.height);
    }

    var conNum = Object.keys(sideConnections).length;
    var moveDir;
    var interval;
    if(direction == "left" || direction == "right") {
      moveDir = "down";
      interval = this.geometry.height / (conNum + 1);
    } else {
      moveDir = "right";
      interval = this.geometry.width / (conNum + 1);
    }
    var index = 1;
    //regular connections first
    for (var connectionId in sideConnections) {
      if(sideConnections[connectionId].selfConnection)
        continue;
      sideConnections[connectionId].position = start.moveToDir(moveDir, (index) * interval);
      index += 1;
    }
    //self connections after
    for (var connectionId in sideConnections) {
      if(!sideConnections[connectionId].selfConnection)
        continue;
      sideConnections[connectionId].position = start.moveToDir(moveDir, (index) * interval);
      index += 1;
    }
  }

  //change geometry of table - compute all sides
  updateGeometry(geometry: any) {
    this.geometry = geometry;
    for(var side in this.sides) {
      this.sideAlign(side);
    }
  }
}

function computeDirections(geometry1, geometry2) {
  var directions = {first: "right", second: "right"};
  var leftX1 = geometry1.x;
  var rightX1 = leftX1 + geometry1.width;
  var leftX2 = geometry2.x;
  var rightX2 = leftX2 + geometry2.width;
  if(rightX1 + 70 < leftX2) {
    directions.second = "left";
  } else if(leftX1 > rightX2 + 70) {
    directions.first = "left";
  }
  return directions;
}

@component('connections-view')
class ConnectionsView extends polymer.Base
{
  @property({type: Object, notify: true})
  model: any;

  //@property({ computed: 'computeRelations(model.*)'})
  relations: any;
  relationsLocked: boolean = false;

  tableSides: TableSides[];

  ready() {
    this.relations = [];
  }

  @observe('model')
  newModel(change)
  {
    var rels = [];
    for(var connectionId in this.model.connections) {
      var rel =  new Relation();
      rel.connection = this.model.connections[connectionId];

      rel.first = new Orientation()
      rel.first.position = new Coords();
      rel.first.direction = "right";

      rel.second = new Orientation()
      rel.second.position = new Coords();
      rel.second.direction = "right";

      rels[connectionId] = rel;
    }
    this.relationsLocked = true;
    this.set('relations', rels);
    this.relationsLocked = false;
  }


  @observe('model.entities.*')
  entityChange(change) {
    var model = this.model;

    var pathParts = change.path.split(".");
    var entityId;

    if(!pathParts[2]) {
      return;
    }

    if(!this.relations) {
      this.relations = [];
    }

    if(!this.tableSides) {
      this.tableSides = [];
    }

    entityId = pathParts[2].substring(1);
    if(!this.tableSides[entityId]) {
      this.tableSides[entityId] = new TableSides();
    }

    this.tableSides[entityId].sides = new Sides();

    var notifies = [];

    var entity = this.model.entities[entityId];

    //go through all relations and find, those are relative to this entity
    for(var connectionId in model.connections) {
      var connection = model.connections[connectionId];

      //skip if is not relative to this entity
      if(connection.first != entityId && connection.second != entityId) {
        continue;
      }


      //findout on whitch side of connection this entity is
      var connectionSide;
      var otherSide;
      var selfConnection = false;
      if(connection.first == connection.second) {
        //self connection
        connectionSide = "first";
        otherSide = "second";
        selfConnection = true;

      } else {
        //connection to other table
        if (connection.first == entityId){
          otherSide = "second";
          connectionSide = "first";
        } else {
          otherSide = "first";
          connectionSide = "second";
        }
      }

      //decide on whitch sides of tables connection ends

      //other side original direction
      var otherOriginalDir = this.relations[connectionId][otherSide].direction

      //get both tables geometry
      var thisGeometry = model.entities[connection[connectionSide]].geometry;
      var otherGeometry = model.entities[connection[otherSide]].geometry;

      if(!this.tableSides[entityId]) {
        this.tableSides[entityId] = new TableSides();
      }

      var directions;
      if(selfConnection) {
        //self connection

        directions = {first: "left", second: "down"};
        //set bootom relation direction
        this.relations[connectionId][otherSide].direction = directions.second;
        notifies["relations.#" + connectionId + "." + otherSide + ".direction"]
            = directions.second;

        //add table port to tablesides
        var tablePort = new TablePort(otherSide, new Coords());
        this.tableSides[entityId].sides[directions.second][connectionId] = tablePort;

      } else {
        //not self connection
        directions = computeDirections(thisGeometry, otherGeometry);
        if(otherOriginalDir != directions.second && this.tableSides[connection[otherSide]]) {
          //change other table side
          var otherSides = this.tableSides[connection[otherSide]]
          var otherPort: TablePort = otherSides.sides[otherOriginalDir][connectionId];
          var newPort = new TablePort(otherPort.side, otherPort.position);
          delete otherSides.sides[otherOriginalDir][connectionId];

          otherSides.sides[directions.second][connectionId] = newPort;
          this.relations[connectionId][otherSide].direction = directions.second;
          notifies["relations.#" + connectionId + "." + otherSide + ".direction"] = directions.second;
          notifies["tableSides.#" + connection[otherSide]] =  newPort;
        }
      }

      //set relation direction
      this.relations[connectionId][connectionSide].direction = directions.first;
      notifies["relations.#" + connectionId + "." + connectionSide + ".direction"]
          = directions.first;

      //add table port to tablesides
      var tablePort = new TablePort(connectionSide, new Coords(), selfConnection);
      this.tableSides[entityId].sides[directions.first][connectionId] = tablePort;

      //add notification to queue
      notifies["tableSides.#" + entityId] = tablePort;
    }

    // notify about table sides changes
    for(var notifyId in notifies) {
      var notify = notifies[notifyId];
      this.notifyPath(notifyId, notify);
    }
  }

  /**
   *  On table change compute
   */
  @observe("tableSides.*")
  tableSideChanged(change) {
    //console.log(change)
    var pathParts = change.path.split(".");
    if(!pathParts[1]) {
      return;
    }
    var entityId = pathParts[1].substring(1);
    var tableSides = this.tableSides[entityId];
    if(!tableSides) {
      return;
    }

    tableSides.updateGeometry(this.model.entities[entityId].geometry);
    //browse sides
    for(var tableSideId in tableSides.sides) {
      var tableSide = tableSides.sides[tableSideId];
      //browse side ports
      for(var connSideId in tableSide) {
        var connSide: TablePort = tableSide[connSideId];
        this.relations[connSideId][connSide.side].position = connSide.position;
        this.notifyPath("relations.#" + connSideId + "." + connSide.side + ".position",
          connSide.position);
      }
    }
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
