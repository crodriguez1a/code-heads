import showdown from 'showdown';
import Component, { tracked } from '@glimmer/component';

const converter = new showdown.Converter();
converter.setFlavor('github');

export default class MarkDown extends Component {
  @tracked
  path: string;

  @tracked
  text: any;

  constructor(options) {
    super(options);
    this.path = options.args.path;
    this._loadFile();
  }

  @tracked isLoading:boolean = true;

  private async _loadFile():Promise<any> {
    if (this.path) {
      let request  = await fetch(this.path);
      let text = await request.text();

      setTimeout((() => {
        this.isLoading = false;
        this.text = converter.makeHtml(text);
      }), 500);
    }
  }
};
