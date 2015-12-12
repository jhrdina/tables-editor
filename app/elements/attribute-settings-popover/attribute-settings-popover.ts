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
    { name: "NOT_NULL", active: false },
    { name: "UNIQUE", active: false }
  ]})
  constraints;

  @property({ type: String, value: ""})
  capacityClass;

  @observe("attribute.dataType.name")
  cardinalityObserver(name) {
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
  flagsChanged(change) {
    if(!change.value) return;
    var cons = [];
    for(var i in this.constraints) {
      var constr = this.constraints[i].name;
      if(this.attribute.flags.indexOf(constr) != -1) {
        cons.push({name: constr, active: true});
      } else {
        cons.push({name: constr, active: false});
      }
    }
    this.set('constraints', cons);
  }

  @listen("iron-select")
  dropdownClosed(e) {
    e.stopPropagation();
  }

  @listen("change")
  checkboxChanged(e) {
    if(e.srcElement.checked) {
      this.push('attribute.flags', e.srcElement.value);
    } else {
      this.splice('attribute.flags', this.attribute.flags.indexOf(e.srcElement.value), 1);
    }
  }

  typeIndex: number;
}

AttributeSettingsPopover.register();
