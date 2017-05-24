import Component, { tracked } from '@glimmer/component';

export default class BubbleChart extends Component {
  // TODO make these routable

  @tracked highlighted: Object = null;

  private shade(e) {
    e.preventDefault();

    this.highlighted = null;
  }

  private highlight(path, bubble, e) {
    e.preventDefault();

    this.highlighted = bubble;
  }
};
