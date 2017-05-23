import Component, { tracked } from '@glimmer/component';

export default class BubbleChart extends Component {
  @tracked highlighted: Object = null;

  private toggleDetails(bubble, e) {
    e.preventDefault();

    this.highlighted = bubble;
  }

  private closeDetails(e) {
    e.preventDefault();

    this.highlighted = null;
  }
};
