/// <reference path="../../../bower_components/polymer-ts/polymer-ts.d.ts"/>

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

  circle: string;
  editable: string;
  trashButt: string;
  editButt: string;



  @observe("xTarget, yTarget")
  position(xTarget, yTarget) {
    var label = this.$.label;
    label.style.left = xTarget + "px";
    label.style.top = yTarget + "px";
  }

  handleMouseover(e) {
    this.mouseover = true;
  }

  handleMouseout(e) {
    this.mouseover = false;
  }

  handleEdit(e) {
    this.editing = true;
  }

  invalidInput() {
    console.log("invalid");
  }

  @observe("mouseover, name, editing")
  state(mouseover, name, editing) {
    if (!this.mouseover && this.name == "" && !this.editing) {
      this.circle = "block";
      this.editable = "none";
      this.trashButt = "none";
      this.editButt = "none";
    } else if (this.mouseover && this.name == "" && !this.editing) {
      this.circle = "none";
      this.editable = "none";
      this.trashButt = "block";
      this.editButt = "block";
    } else if (this.mouseover && this.name != "" && !this.editing) {
      this.circle = "none";
      this.editButt = "none";
      this.editable = "block half";
      this.trashButt = "block trashRight";
    } else if (!this.mouseover && this.name != "") {
      this.circle = "none";
      this.editButt = "none";
      this.editable = "block";
      this.trashButt = "none";
    } else if (this.editing) {
      this.circle = "none";
      this.editButt = "none";
      this.editable = "block";
      this.trashButt = "none";
    }
  }
}

ConnectionLabel.register();
