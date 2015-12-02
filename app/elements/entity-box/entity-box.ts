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

  @property({ type: Object })
  attributes: any;

  // ================================================================
  // Geometry, Dragging
  // ================================================================

  @property({ type: Object, value: null })
  containment: Node | string | boolean;

  @property({type: Boolean, value: false })
  draggable: boolean;

  @property({ type: Object, notify: true })
  geometry: Rectangle;

  // Draggabilly object
  draggie: Draggabilly;

  geometryLocked: boolean = false;

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

      this.draggie.on('dragMove', function() {

        // Notify position changes
        if (that.geometry) {
          var g = {
            x: this.position.x,
            y: this.position.y,
            width: that.geometry.width,
            height: that.geometry.height
          };

          that.geometryLocked = true;
          that.set('geometry', g);
          that.geometryLocked = false;
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

  @observe('geometry.*')
  geometryChanged(geometry) {
    if (this.geometryLocked) return;

    this.style.left = geometry.base.x + 'px';
    this.style.top = geometry.base.y + 'px';
  }

  // ================================================================
  // Connector
  // ================================================================

  @property({ type: Boolean, value: false })
  connectorHidden: boolean;

  @property({ type: Boolean, value: false, notify: true })
  connectorActive: boolean;

  @computed()
  connectorClass(connectorActive) {
    return connectorActive ? 'connector active' : 'connector';
  }

  // ================================================================
  // Entity name
  // ================================================================

  @property({ type: String, value: null })
  name: string;

  @computed()
  showedName(name) {
    return name || 'Bez názvu';
  }

  @computed()
  nameClass(name) {
    return name ? '' : 'empty';
  }

  // ================================================================
}

EntityBox.register();
