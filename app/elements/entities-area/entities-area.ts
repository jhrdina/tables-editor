/// <reference path="../../../bower_components/polymer-ts/polymer-ts.d.ts"/>

@component('entities-area')
class EntitiesArea extends polymer.Base
{
  host: EntitiesArea = this;

  @property({ type: Object })
  model: any;
}

EntitiesArea.register();
