import Component, { tracked } from "@glimmer/component";
import { createStore } from 'redux';
import Reducer from './-utils/reducers/articles';

export default class Website extends Component {
  constructor(options) {
    super(options);

    // REVIEW async belong here or with redux?
    // this.loadArticles();
  }

  async loadArticles() {
    // let request = await fetch('https://api.example.com/person.json');
    // let json = await request.json();
    // this.person = json.person;
  }

  /**
    Create a redux store using the reducer

    @property store
  */
  private store: Object = createStore(Reducer);

  /**
    Get the current state of the articles model from the store

    @property articles
  */
  @tracked articles: Array = this.store.getState(), ['read'];

  /**
    Proxy the store.dispatch function

    @method dispatch
  */
  private dispatch() {
    return this.store.dispatch(...arguments);
  }

  /**
    Tell the store that the item has been read

    @method markAsRead
  */
  public markAsRead(index: Number, e) {
    e.preventDefault();

    // dispatch an action created on the fly to update the store
    this.dispatch({
      type: 'MARK_AS_READ',
      index
    });

    // update glimmer tracked prop
    this.articles = this.store.getState();
  }
}
