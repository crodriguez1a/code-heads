import Component, { tracked } from "@glimmer/component";
import { createStore } from 'redux';
import Reducers from './-utils/reducers';
import Router from './-utils/router/router';

const router = new Router({debug:true});

export default class Website extends Component {
  constructor(options) {
    super(options);
    // this.loadMarkdown();

    // subscribe to router listener
    router.listen(this.routeNameUpdate.bind(this));
  }

  /**
    Name of current route

    @property routeName
  */
  @tracked routeName;

  /*
    NOTE async await Throws regenaratorRuntime error https://github.com/glimmerjs/glimmer-website/issues/62
  async loadMarkdown(file='foo') {
    let req = await fetch(`./-utils/md/articles/${file}.md`);
    let json = await request.json();
    console.log('async response', json);
  }
  */

  /**
    Create a redux store using the reducer

    @property store
  */
  private store: any = createStore(Reducers);

  /**
    Get the current state of the articles model from the store

    @property articles
  */
  @tracked articles: Array<any> = this.store.getState();

  /**
    Proxy the store.dispatch function

    @method dispatch
  */
  private dispatch(action: Object = {}) {
    return this.store.dispatch(action);
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
