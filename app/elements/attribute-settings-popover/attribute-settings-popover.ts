/// <reference path="../../../bower_components/polymer-ts/polymer-ts.d.ts"/>

@component('attribute-settings-popover')
class AttributeSettingsPopover extends polymer.Base
{
   @property({ type: Object })
   attribute: any;
}

AttributeSettingsPopover.register();
