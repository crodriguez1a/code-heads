import Component, { tracked } from "@glimmer/component";
import { createStore } from 'redux';
import Reducer from './-utils/reducers/articles';
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

  /**
    Signal route is home

    @property atHome
  */
  @tracked('routeName')
  get atHome() {
    return this.routeName === '';
  }

  /**
    Signal route is home

    @property atAbout
  */
  @tracked('routeName')
  get atAbout() {
    return this.routeName === 'about';
  }


  /**
    Call back for route listener

    @method routeUpdate
  */
  public routeNameUpdate(name) {
    this.routeName = name;
  }

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
