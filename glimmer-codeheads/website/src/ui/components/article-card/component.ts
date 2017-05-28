import Component, { tracked } from '@glimmer/component';

export default class ArticleCard extends Component {
  @tracked preview = true;

  private togglePreview(e) {
    e.preventDefault();
    this.preview = !this.preview;
  }
};
