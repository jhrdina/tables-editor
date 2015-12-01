/// <reference path="../../../bower_components/polymer-ts/polymer-ts.d.ts"/>
/// <reference path="../../../typings/draggabilly/draggabilly.d.ts"/>

interface Point {
  x: number;
  y: number;
}

interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

@component('entity-box')
class EntityBox extends polymer.Base {

  @property({ type: Object, value: null })
  containment: Node | string | boolean;

  @property({type: Boolean, value: false })
  draggable: boolean;

  @property({ type: String, value: null })
  name: string;

  @property({ type: Object })
  attributes: any;

  @property({ type: Object, notify: true })
  geometry: Rectangle;

  // Draggabilly object
  draggie: Draggabilly;

  // TODO: Separate into Behavior
  @observe('draggable,containment')
  draggableChanged(draggable, containment) {
    if (!this.draggie) {
      // Initialize Draggabilly
      this.draggie = new Draggabilly(this, {
        containment: containment,
        handle: '.handle'
      });

      var that = this;

      this.draggie.on('pointerMove', function(
        event: Event, pointer: MouseEvent | TouchEvent, moveVector: Point) {

        // Notify position changes
        if (that.geometry) {
          var g = {
            x: moveVector.x,
            y: moveVector.y,
            width: that.geometry.width,
            height: that.geometry.height
          };

          that.set('geometry', g);
        }
      });

    } else {
      // Draggabilly already exists, change options
      this.draggie.options.containment = containment;
    }

    if (draggable) {
      this.draggie.enable();
    } else {
      this.draggie.disable();
    }
  }

  @computed()
  showedName(name) {
    return name || 'Bez názvu';
  }

  @computed()
  nameClass(name) {
    return name ? '' : 'empty';
  }
}

EntityBox.register();
