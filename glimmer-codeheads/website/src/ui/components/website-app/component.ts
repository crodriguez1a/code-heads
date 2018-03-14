import Component, { tracked } from "@glimmer/component";
import { createStore } from 'redux';
import Reducers from './-utils/reducers';
import Router from './-utils/router/router';

const router = new Router({ debug:true });

export default class Website extends Component {
  constructor(options) {
    super(options);
    // subscribe to router listener
    router.listen((name) => this.onRouteUpdate(name));
  }

  /**
    Name of current route

    @property routeName
  */
  @tracked routeName: string;

  /**
    Call back for route listener

    @method routeUpdate
  */
  public onRouteUpdate(name) {
    this.routeName = name;
  }

  /**
    Create a redux store using the reducer

    @property store
  */
  private store: any = createStore(Reducers);

  /**
    Get the current state of the model from the store

    @property articles
  */
  @tracked state: Array<any> = this.store.getState();

  /**
    An array of articles

    @property articles
  */
  @tracked('state')
  get articles() {
    return this.state.filter((item) => item && item.type === 'article');
  }

  /**
    An array of resources

    @property resources
  */
  @tracked('state')
  get resources() {
    return this.state.filter((item) => item && item.type === 'resource');
  }

  /**
    Single out highlighted article

    @property highlighted_article
  */
  @tracked('state')
  get highlighted_article() {
    const articles = this.state.filter(item => item && item.type === 'article');
    const list = articles.filter(article => article.highlighted)
    return list && list[0];
  }

  /**
    An array of resume parts

    @property resume
  */
  @tracked('state')
  get resume() {
    return this.state.filter((item) => item.type === 'resume');
  }

  /**
    Proxy the store.dispatch function

    @method dispatch
  */
  private dispatch(action: Object = {}) {
    return this.store.dispatch(action);
  }

  /**
    Populates an article in a modal view

    @method visitArticle
  */
  public visitArticle(index: Number, e) {
    e.preventDefault();

    this.dispatch({
      type: 'HIGHLIGHT_ARTICLE',
      index
    });

    // update glimmer tracked prop
    this.state = this.store.getState();
  }

  /**
    Populates an article in a modal view

    @method visitArticle
  */
  public unvisitArticle(index: Number, e) {
    e.preventDefault();

    this.dispatch({
      type: 'UNHIGHLIGHT_ARTICLE',
      index
    });

    // update glimmer tracked prop
    this.state = this.store.getState();
  }
}
