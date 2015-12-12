/// <reference path="../../../bower_components/polymer-ts/polymer-ts.d.ts"/>

@component('attribute-settings-popover')
class AttributeSettingsPopover extends polymer.Base {
  @property({ type: Object, notify: true })
  attribute: any;

  @property({ type: Number, notify: true })
  capacity: number;

  @property({ type: Object, value: [
    { name: "NUMBER", capacitySet: false},
    { name: "VARCHAR", capacitySet: true},
    { name: "DATE", capacitySet: false}
  ]})
  dataTypes;

  @property({ type: Object, value: [
    { name: "NOT_NULL", active: "" },
    { name: "UNIQUE", active: "" }
  ]})
  constraints;

  @property({ type: String, value: ""})
  capacityClass;

  @observe("attribute.dataType.name")
  cardinalityObserver(name) {
    console.log(name);
    for (var i in this.dataTypes) {
      if (this.dataTypes[i].name == name) {
        this.typeIndex = i;
        if(this.dataTypes[i].capacitySet) {
          this.capacityClass = "";
        } else {
          this.capacityClass = "invisible"
        }
      }
    }
  }

  @observe("typeIndex")
  dropdownObserver(typeIndex) {
    this.set('attribute.dataType.name', this.dataTypes[typeIndex].name);
    if(this.dataTypes[typeIndex].capacitySet) {
      this.capacityClass = "";
    } else {
      this.capacityClass = "invisible"
    }
  }

  @observe('attribute.flags.*')
  flagsChanged() {
    for(var i in this.constraints) {
      if(!this.attribute.flags) return;
      var constr = this.constraints[i].name;
      if(constr in this.attribute.flags) {
        this.constraints[i].active = "true";
      } else {
        this.constraints[i].active = "";
      }
    }
  }

  @listen("iron-select")
  dropdownClosed(e) {
    e.stopPropagation();
  }

  typeIndex: number;
}

AttributeSettingsPopover.register();
