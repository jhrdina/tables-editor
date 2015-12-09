/// <reference path="../../../bower_components/polymer-ts/polymer-ts.d.ts"/>

@component('constraint-badge')
class ConstraintBadge extends polymer.Base {

  static transformations: any = {
    'PRIMARY_KEY': 'PK',
    'FOREIGN_KEY': 'FK',
    'NUMBER': 'NUM',
    'NOT_NULL': 'NOT NULL',
    'VARCHAR': 'VCHAR'
  }

  @property({ type: Boolean, value: false })
  noTransform: boolean;

  @property({ type: String })
  label: string;

  @observe('label')
  labelChanged(label) {
    this.setAttribute('aria-label', label);
  }

  @property({computed: 'label'})
  transformedLabel(label): string {
    if (this.noTransform) return label;

    return ConstraintBadge.transformations[label] || label;
  }
}

ConstraintBadge.register();
