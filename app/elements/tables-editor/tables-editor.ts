/// <reference path="../../../bower_components/polymer-ts/polymer-ts.d.ts"/>

@component('tables-editor')
class TablesEditor extends polymer.Base
{
   model: any = {
     entities: [
       { // entity 0
         name: "Osoba",
         geometry: {
           x: 30,
           y: 30,
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
           x: 100,
           y: 30,
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
           x: 170,
           y: 30,
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
       }
     ]
   }
}

TablesEditor.register();
