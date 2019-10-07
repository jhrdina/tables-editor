/// <reference path="../../bower_components/polymer-ts/polymer-ts.d.ts"/>

@component('connection-label')
class ConnectionLabel extends polymer.Base {
  @property({ type: String, notify: true })
  name: String;

  @property({ type: Number })
  xTarget: number;

  @property({ type: Number })
  yTarget: number;

  mouseover: boolean = false;

  editing: boolean = false;

  circleClasses: string;
  editableClasses: string;
  trashButtClasses: string;
  editButtClasses: string;

  @observe("xTarget, yTarget")
  position(xTarget, yTarget) {
    var label = this.$.label;
    label.style.left = xTarget + "px";
    label.style.top = yTarget + "px";
  }

  @listen('mouseover')
  handleMouseover(e) {
    this.mouseover = true;
  }

  @listen('mouseout')
  handleMouseout(e) {
    this.mouseover = false;
  }

  handleEdit(e) {
    this.editing = true;
    this.$.editable.focus();
  }

  handleDelete(e) {
    this.fire("delete-clicked");
  }

  @observe('editableFocused')
  editableFocusChanged(focused) {
    this.editing = focused;
  }

  @observe("mouseover, name, editing")
  state(mouseover, name, editing) {
    if (!this.mouseover && this.name == "" && !this.editing) {
      this.circleClasses = "block";
      this.editableClasses = "none";
      this.trashButtClasses = "none";
      this.editButtClasses = "none";
    } else if (this.mouseover && this.name == "" && !this.editing) {
      this.circleClasses = "none";
      this.editableClasses = "none";
      this.trashButtClasses = "block";
      this.editButtClasses = "block";
    } else if (this.mouseover && this.name != "" && !this.editing) {
      this.circleClasses = "none";
      this.editableClasses = "block half";
      this.editButtClasses = "none";
      this.trashButtClasses = "block trashRight";
    } else if (!this.mouseover && this.name != "") {
      this.circleClasses = "none";
      this.editableClasses = "block";
      this.editButtClasses = "none";
      this.trashButtClasses = "none";
    } else if (this.editing) {
      this.circleClasses = "none";
      this.editableClasses = "block";
      this.editButtClasses = "none";
      this.trashButtClasses = "none";
    }
  }
}

ConnectionLabel.register();
