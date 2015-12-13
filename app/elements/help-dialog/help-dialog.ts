/// <reference path="../../../bower_components/polymer-ts/polymer-ts.d.ts"/>

@component('help-dialog')
class HelpDialog extends polymer.Base {

  selected: number = 0;

  @property({
    type: Array, value: [
      {
        path: "../../videos/create_table.mp4",
        name: "Přidávání tabulek"
      },
      {
        path: "../../videos/add_attribute.mp4",
        name: "Přidávání atributů"
      },
      {
        path: "../../videos/create_relation.mp4",
        name: "Vytváření vztahů"
      },

      {
        path: "../../videos/sql_code.mp4",
        name: "Zobrazení SQL kódu"
      }
    ]
  })
  videos: any[];

  @property({ type: Object })
  current: any;

  @computed({ type: Object })
  next(videos, selected) {
    var index = selected === videos.length - 1 ? 0 : (selected + 1);
    return videos[index];
  }

  @computed({ type: Object })
  previous(videos, selected) {
    var index = selected === 0 ? videos.length - 1 : (selected - 1);
    return videos[index];
  }

  onNextClick() {
    this.selected = this.selected === this.videos.length - 1 ? 0 : (this.selected + 1);
    this.set('current', this.videos[this.selected]);
  }

  onPrevClick() {
    this.selected = this.selected === 0 ? this.videos.length - 1 : (this.selected - 1);
    this.set('current', this.videos[this.selected]);
  }

  // lifecycle methods
  ready() {
    this.current = this.videos[0];
  }


}

HelpDialog.register();
