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

  @property({ type: Boolean, value: false })
  disabled: boolean;

  @property({ type: Object })
  current: any;


  @property({ computed: 'videos,selected' })
  next(videos, selected) {
    var index = selected === videos.length - 1 ? 0 : (selected + 1);
    return videos[index];
  }

  @property({ computed: 'videos,selected' })
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

  @observe('disabled,current.*')
  videoUpdate() {
    if (!this.disabled && this.current) {
      this.$.videoElement.src = this.current.path;
      this.$.videoElement.play();
    } else {
      this.$.videoElement.pause();
      this.$.videoElement.src = '';
    }
  }
}

HelpDialog.register();
