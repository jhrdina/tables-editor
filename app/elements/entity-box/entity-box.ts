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
  entityAttrs: Array<any>;

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
  positionChanged(geometry) {
    if (this.geometryLocked) return;
    // console.log('geometryChanged');

    this.style.left = geometry.base.x + 'px';
    this.style.top = geometry.base.y + 'px';
  }

  ready() {
    this.async(this.sizeChanged.bind(this), 500);
  }

  @observe('entityAttrs.*,name,connectorHidden,geometry')
  sizeChanged() {
    if (this.geometryLocked || !this.geometry) return;
    // console.log('sizeChanged');

    var rectObject: ClientRect = this.getBoundingClientRect();

    var newGeometry = {
      x: this.geometry.x,
      y: this.geometry.y,
      width: rectObject.width,
      height: rectObject.height
    };

    if (newGeometry.width !== this.geometry.width ||
        newGeometry.height !== this.geometry.height) {
      this.geometryLocked = true;
      this.set('geometry', newGeometry);
      this.geometryLocked = false;
    }
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

  @property({ type: String, value: null, notify: true })
  name: string;

  @computed()
  nameClass(name) {
    return name ? '' : 'empty';
  }

  // ================================================================
  // Attributes
  // ================================================================

  handleInsertBelow(e) {
    // Get insert index
    var attribute = e.detail.target.attribute;
    if (!attribute)
      return;

    var index = this.entityAttrs.indexOf(attribute) + 1;

    // splice definition in PolymerTS is broken, so we cast to general object...
    var thisAny: any = this;
    // Insert new attribute
    thisAny.splice('entityAttrs', index, 0, {
      name: '',
      dataType: {
        name: 'NUMBER',
        capacity: 5
      },
      flags: []
    });

    this.$.attributesRepeat.render();

    var newAttrRow: any = Polymer.dom(e.detail.target).nextElementSibling;
    newAttrRow.focus();
  }

  handleDeleteAttr(e) {
    var attribute = e.target.attribute;

    // Keep at least one attribute
    if (this.entityAttrs.length <= 1) return;

    var index = this.entityAttrs.indexOf(attribute);

    if ((index === 0 && e.detail.direction === 'left') ||
        (index === this.entityAttrs.length - 1 && e.detail.direction === 'right')) {
      return;
    }

    var elementToFocus = e.detail.direction === 'left' ?
      e.target.previousElementSibling :
      e.target.nextElementSibling;

    this.splice('entityAttrs', index, 1);
    this.$.attributesRepeat.render();

    this.sizeChanged();

    elementToFocus.focus();
  }
}

EntityBox.register();
