/// <reference path="../../../bower_components/polymer-ts/polymer-ts.d.ts"/>

@component('connection-view')
class ConnectionView extends polymer.Base
{

   @property({ type: Number, value: 1 })
   x1: number;

   @property({ type: Number, value: 1 })
   y1: number;

   @property({ type: Number, value: 10 })
   x2: number;

   @property({ type: Number, value: 10 })
   y2: number;

}

ConnectionView.register();
