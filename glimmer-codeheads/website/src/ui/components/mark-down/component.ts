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
    this.loadFile();
  }

  loadFile() {
    fetch(this.path)
      .then(request => request.text())
      .then((text) => this.text = converter.makeHtml(text));
  }
};
