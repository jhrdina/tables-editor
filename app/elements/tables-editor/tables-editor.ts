/// <reference path="../../../bower_components/polymer-ts/polymer-ts.d.ts"/>

@component('tables-editor')
class TablesEditor extends polymer.Base
{
   model: any = {
     entities: [
       { // entity 0
         name: "Osoba",
         geometry: {
           x: 2130,
           y: 1819,
           width: 50,
           height: 200
         },
         attributes: [
           {
             name: 'id_osoby',
             dataType: {
               name: 'NUMBER',
               capacity: 10
             },
             flags: [
               'PRIMARY_KEY'
             ]
           },
           {
             name: 'jmeno',
             dataType: {
               name: 'VARCHAR',
               capacity: 255
             },
             flags: [
               'NOT_NULL'
             ]
           }
         ]
       },
       { // entity 1
         name: "",
         geometry: {
           x: 2135,
           y: 1993,
           width: 50,
           height: 200
         },
         attributes: [
           {
             name: 'id',
             dataType: {
               name: 'NUMBER',
               capacity: 10
             },
             flags: [
               'PRIMARY_KEY'
             ]
           },
           {
             name: 'vydrz',
             dataType: {
               name: 'VARCHAR',
               capacity: 255
             },
             flags: [
               'NOT_NULL'
             ]
           },
           {
             name: 'datum',
             dataType: {
               name: 'DATE',
               capacity: 255
             }
           }
         ]
       },
       { // entity 2
         name: "Dlouhý název této tabulky",
         geometry: {
           x: 2592,
           y: 1899,
           width: 50,
           height: 200
         },
         attributes: [
           {
             name: 'id_zvirete',
             dataType: {
               name: 'NUMBER',
               capacity: 10
             },
             flags: [
               'PRIMARY_KEY'
             ]
           },
           {
             name: 'hmotnost',
             dataType: {
               name: 'NUMBER',
               capacity: 5
             },
             flags: [
               'NOT_NULL'
             ]
           },
           {
             name: 'cena',
             dataType: {
               name: 'NUMBER',
               capacity: 10
             }
           }
         ]
       }
     ],
     connections: [
       {
         entity1: 0,
         entity2: 1,
         name: "Connection_1",
         cardinality1: "1..n",
         cardinality2: "1"
       },
       {
         entity1: 1,
         entity2: 2,
         name: "Connection_2",
         cardinality1: "0..n",
         cardinality2: "1"
       },
       {
         entity1: 0,
         entity2: 2,
         name: "Connection_3",
         cardinality1: "1..n",
         cardinality2: "0..1"
       },
       {
         entity1: 2,
         entity2: 2,
         name: "Connection_self",
         cardinality1: "1",
         cardinality2: "0..n"
       }
     ]
   }

   drawerPinned: boolean;

   pinClass = "";

   ready() {
     this.$.panel.forceNarrow = true;
     this.drawerPinned = false;
   }

   togglePanel() {
     if(this.drawerPinned) {
       this.$.panel.forceNarrow = true;
       this.drawerPinned = false;
     } else {
       this.$.panel.togglePanel();
     }
   }

   pinDrawer() {
     this.$.panel.forceNarrow = false;
     this.drawerPinned = true;
   }

   @observe("drawerPinned")
   drawerPinnedChange(drawerPinned) {
     if(drawerPinned) {
       this.pinClass = "invisible";
     } else {
       this.pinClass = "";
     }
   }

}

TablesEditor.register();
