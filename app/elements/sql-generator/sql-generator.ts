/// <reference path="../../bower_components/polymer-ts/polymer-ts.d.ts"/>

class Table {
  attributes: Attribute[];
  constructor(
    public name: string
  ){
    this.attributes = [];
  }
  toString() {
    var str = "CREATE TABLE " + this.name.replace(/ /g, "_") + "\n(\n"
    for(let attrId in this.attributes) {
      var attr = this.attributes[attrId];
      str += attr.toString();
    }
    str += ")\n\n";

    return str;
  }
}

class Attribute {
  constructor(
    public name: string,
    public type: string,
    public flags: string[]
  ) {}
  toString() {
    var str = "";
    str += this.name + " ";
    str += this.type;
    for(let i in this.flags) {
      str += " " + this.flags[i];
    }
    str += ",\n";
    return str;
  }

}

@component('sql-generator')
class SqlGenerator extends polymer.Base
{
  value: string;

  @property({type: Object})
  model: any;

  @property({type: Boolean, value: false})
  active: boolean;

  @observe("model.*")
  modelChanged(change) {
    if(this.model && this.active) {
      this.update();
    }
  }

  @observe("active")
  activeChanged(change){
    if(this.active) {
      this.update();
    }
  }

  update() {
    var entities = this.model.entities;
    var connections = this.model.connections;
    var tables: Table[] = [];
    for(var entityId in entities) {
      var entity = entities[entityId];
      var table = new Table(entity.name);

      for(var attrId in entity.attributes) {
        var attr = entity.attributes[attrId];
        var attribute = new Attribute(
                    attr.name.replace(/ /g, "_"),
                    attr.dataType.name,
                    attr.flags
                  )
        table.attributes.push(attribute);
      }
      tables.push(table);
    }

    for(var relId in connections) {
      var connection = connections[relId];
      var entity = entities[connection.entity1];
      var attribute = new Attribute(
                  entity.name.replace(/ /g, "_").substring(0, 20) + relId,
                  "INT",
                  ["FOREGIN_KEY"]
                )
      tables[connection.entity1].attributes.push(attribute);
    }

    var str = "";

    for(let tableId in tables) {
      var table = tables[tableId];
      str+= table.toString();
    }

    this.value = str;
  }

  @observe("value")
  valueChanged (neo) {
    this.$.textarea.innerHTML = this.value.replace(/\n/g, "<br>");
  }

  getValue() {
    return this.value;
  }
}

SqlGenerator.register();
