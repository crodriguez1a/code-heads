import Component, { tracked } from '@glimmer/component';

export default class ArticleCard extends Component {
  /**
    Signal if preview content should be displayed

    @property preview
  */
  @tracked preview: Boolean = true;
};
