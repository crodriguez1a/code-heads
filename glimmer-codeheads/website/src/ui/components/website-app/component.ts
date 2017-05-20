import Component, { tracked } from "@glimmer/component";
import { createStore } from 'redux';
import Articles from './-utils/reducers/articles';


export default class Website extends Component {
  // Create a redux store using the content reducer
  articles: Store = createStore(Articles, {
    articles: [
      {
        title: 'Hello redux',
        teaser: 'read more',
        read: false,
        markdown: './-utils/md/articles/foo.md'
      }
    ]
  });

  // Proxy the store.dispatch function
  dispatch() {
    return this.articles.dispatch(...arguments);
  }
}
