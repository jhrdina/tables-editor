/// <reference path="../../../bower_components/polymer-ts/polymer-ts.d.ts"/>

class Orientation {
  position: Coords;
  direction: string;
}

class Relation {
  entity1: Orientation;
  entity2: Orientation;
  connection: any;
  constructor() {
    this.entity1 = new Orientation();
    this.entity2 = new Orientation();
  }
  getSide(side: string) {
    this[side]
  }
}

class TablePort {
  constructor(
    public connectionId: number,
    public side: string,
    public position: Coords,
    public remoteTableY: number,
    public selfConnection: boolean = false) {
  }
}

class Sides {
  constructor(
    public left: TablePort[] = [],
    public right: TablePort[] = [],
    public down: TablePort[] = []) {
  }
  indexOf(connectionId: number, direction: string) {
    var side = this[direction];
    for (var index in side) {
      if (side[index].connectionId == connectionId) {
        return index;
      }
    }
  }
  pop(connectionId: number, direction: string) {
    var index;
    index = this.indexOf(connectionId, direction)
    var port = this[direction][index];
    this[direction].splice(index, 1);
    return port;
  }
}

// Store ports on sides of table
class TableSides {
  geometry: any = {};
  sides: Sides;
  sideAlign(direction: string) {
    var sideConnections = this.sides[direction];
    var start = new Coords(this.geometry.x, this.geometry.y);
    if (direction == "right") {
      start = start.moveToDir("right", this.geometry.width)
    }
    if (direction == "down") {
      start = start.moveToDir("down", this.geometry.height);
    }

    var conNum = Object.keys(sideConnections).length;
    var moveDir;
    var interval;
    var index = 1;
    if (direction == "left" || direction == "right") {
      sideConnections = sideConnections.sort(function(a, b) {
        var difz = a.remoteTableY - b.remoteTableY;
        if (difz != 0) {
          return difz;
        }
        return a.connectionId - b.connectionId;
      })
      moveDir = "down";
      interval = this.geometry.height / (conNum + 1);
    } else {
      moveDir = "right";
      interval = this.geometry.width / (conNum + 1);
    }
    //regular connections entity1
    for (var connectionId in sideConnections) {
      var conSide: TablePort = sideConnections[connectionId];
      if (conSide.selfConnection) {
        continue;
      }
      conSide.position = start.moveToDir(moveDir, (index) * interval);
      index += 1;
    }
    //self connections after
    for (var connectionId in sideConnections) {
      var conSide: TablePort = sideConnections[connectionId];
      if (!conSide.selfConnection) {
        continue;
      }
      conSide.position = start.moveToDir(moveDir, (index) * interval);
      index += 1;
    }
  }

  //change geometry of table - compute all sides
  updateGeometry(geometry: any) {
    this.geometry = geometry;
    for (var side in this.sides) {
      this.sideAlign(side);
    }
  }
}

function computeDirections(geometry1, geometry2) {
  var directions = { entity1: "right", entity2: "right" };
  var leftX1 = geometry1.x;
  var rightX1 = leftX1 + geometry1.width;
  var leftX2 = geometry2.x;
  var rightX2 = leftX2 + geometry2.width;
  if (rightX1 + 70 < leftX2) {
    directions.entity2 = "left";
  } else if (leftX1 > rightX2 + 70) {
    directions.entity1 = "left";
  }
  return directions;
}

@component('connections-view')
class ConnectionsView extends polymer.Base {
  @property({ type: Object, notify: true })
  model: any;

  relations: any;

  relationsLocked: boolean = false;

  tableSides: TableSides[];

  ready() {
    this.relations = [];
  }

  @observe("model.*")
  modelChanged(change) {
    console.log(change);
    var pathParts = change.path.split(".");

    if (pathParts.length == 1 ||
      (pathParts[1] == "connections" && pathParts[2] == "splices") ||
      (pathParts[1] == "entities" && pathParts[2] == "splices")) {
      var connections = this.model.connections;
      this.relations = [];
      this.tableSides = [];
      for (var connId in connections) {
        if (!this.relations[connId]) {
          var connection = connections[connId];
          this.relationUpdate(connId);
          this.entityUpdate(connection.entity1);
          this.entityUpdate(connection.entity2);
        }
      }
    } else if (pathParts[1] == "entities" && pathParts[3] == "geometry") {
      var connectionId = this.model.entities.indexOf(this.get([pathParts[0], pathParts[1], pathParts[2]]));
      this.entityUpdate(connectionId);
    }
  }


  relationUpdate(relationId) {
    var rel = new Relation();
    rel.connection = this.model.connections[relationId];

    rel.entity1 = new Orientation()
    rel.entity1.position = new Coords();
    rel.entity1.direction = "right";

    rel.entity2 = new Orientation()
    rel.entity2.position = new Coords();
    rel.entity2.direction = "right";

    this.relationsLocked = true;
    this.push('relations', rel);
    this.relationsLocked = false;
  }


  entityUpdate(entityId) {
    var model = this.model;

    if (!this.tableSides) {
      this.tableSides = [];
    }

    if (!this.tableSides[entityId]) {
      this.tableSides[entityId] = new TableSides();
    }

    this.tableSides[entityId].sides = new Sides();

    var notifies = [];

    var entity = this.model.entities[entityId];

    //go through all relations and find, those are relative to this entity
    for (var connectionId in this.relations) {
      var connection = this.relations[connectionId].connection;

      //skip if is not relative to this entity
      if (connection.entity1 != entityId && connection.entity2 != entityId) {
        continue;
      }


      //findout on whitch side of connection this entity is
      var connectionSide;
      var otherSide;
      var selfConnection = false;
      if (connection.entity1 == connection.entity2) {
        //self connection
        connectionSide = "entity1";
        otherSide = "entity2";
        selfConnection = true;

      } else {
        //connection to other table
        if (connection.entity1 == entityId) {
          otherSide = "entity2";
          connectionSide = "entity1";
        } else {
          otherSide = "entity1";
          connectionSide = "entity2";
        }
      }

      //decide directions
      //other side original direction
      var otherOriginalDir = this.relations[connectionId][otherSide].direction

      //get both tables geometry
      var thisGeometry = model.entities[connection[connectionSide]].geometry;
      var otherGeometry = model.entities[connection[otherSide]].geometry;

      if (!this.tableSides[entityId]) {
        this.tableSides[entityId] = new TableSides();
      }

      var directions;
      if (selfConnection) {
        //self connection

        directions = { entity1: "left", entity2: "down" };
        //set botom relation direction
        this.relations[connectionId][otherSide].direction = directions.entity2;
        notifies["relations.#" + connectionId + "." + otherSide + ".direction"]
        = directions.entity2;

        //add table port to tablesides
        var tablePort = new TablePort(connectionId, otherSide, new Coords(), 0);
        this.tableSides[entityId].sides[directions.entity2].push(tablePort);

      } else {
        //not self connection
        directions = computeDirections(thisGeometry, otherGeometry);
        if (
          this.tableSides[connection[otherSide]]
          && this.tableSides[connection[otherSide]].sides
            .indexOf(connectionId, otherOriginalDir)
          ) {
          //change other table side
          var otherSides = this.tableSides[connection[otherSide]]
          var otherPort: TablePort = otherSides.sides.pop(connectionId, otherOriginalDir);
          var newPort = new TablePort(connectionId, otherPort.side, otherPort.position, thisGeometry.y);

          //console.log(otherOriginalDir, directions.entity2);

          otherSides.sides[directions.entity2].push(newPort);
          this.relations[connectionId][otherSide].direction = directions.entity2;
          notifies["relations.#" + connectionId + "." + otherSide + ".direction"] = directions.entity2;
          notifies["tableSides.#" + connection[otherSide]] = newPort;
        }
      }

      //set my side relation direction
      this.relations[connectionId][connectionSide].direction = directions.entity1;
      notifies["relations.#" + connectionId + "." + connectionSide + ".direction"]
      = directions.entity1;

      //add table port to tablesides
      var tablePort = new TablePort(connectionId, connectionSide, new Coords(), otherGeometry.y, selfConnection);
      this.tableSides[entityId].sides[directions.entity1].push(tablePort);

      //add notification to queue
      notifies["tableSides.#" + entityId] = tablePort;
    }

    // notify about table sides changes
    for (var notifyId in notifies) {
      var notify = notifies[notifyId];
      this.notifyPath(notifyId, notify);
    }
  }

  /**
   *  On table change - recompute table sides
   */
  @observe("tableSides.*")
  tableSideChanged(change) {
    var pathParts = change.path.split(".");
    if (!pathParts[1]) {
      return;
    }
    var entityId = pathParts[1].substring(1);
    var tableSides = this.tableSides[entityId];
    if (!tableSides) {
      return;
    }

    tableSides.updateGeometry(this.model.entities[entityId].geometry);
    //browse sides
    for (var tableSideId in tableSides.sides) {
      var tableSide = tableSides.sides[tableSideId];
      //browse side ports
      for (var connSideId in tableSide) {
        var connSide: TablePort = tableSide[connSideId];
        //set position to this.relations[]
        this.relations[connSide.connectionId][connSide.side].position = connSide.position;
        //notify about relations change
        this.relationsLocked = true;
        this.notifyPath("relations.#" + connSide.connectionId + "." + connSide.side + ".position",
          connSide.position);
        this.relationsLocked = false;
      }
    }
  }

  /**
   * Handles cardinality and name changes (can be deleted)
   */
  @observe("relations.*")
  relationsChanged(change) {
    if (this.relationsLocked || !this.model) return;
    //console.log(change);

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

  handleDelete(e) {

    var connectionIndex = this.$.connectionRepeat.indexForElement(e.target);
    this.splice('model.connections', connectionIndex, 1);

  }
}

ConnectionsView.register();
