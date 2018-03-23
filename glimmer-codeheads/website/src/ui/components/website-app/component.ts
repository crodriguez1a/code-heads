import Component, { tracked } from "@glimmer/component";
import { createStore } from 'redux';
import Reducers from './-utils/reducers';
import router from './-utils/router/router';
import { get_articles, get_resources, resume } from './-utils/content';

export default class Website extends Component {
  constructor(options) {
    super(options);
    // subscribe to router listener
    router.listen((name) => this.onRouteUpdate(name));
    this._populateStore();
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

    @property _store
  */
  private _store: any;

  /**
    Fetch content files and populate store

    @property _populateStore
  */
  private async _populateStore():Promise<any> {
    let articles = await get_articles;
    let resources = await get_resources;
    let articles_json = await articles.json();
    let resources_json = await resources.json();
    let content = [].concat(articles_json, resume, resources_json);

    this._store = createStore(Reducers, content);
    this.state = this._store.getState();
  };

  /**
    Get the current state of the model from the _store

    @property articles
  */
  @tracked state: Array<any>;

  /**
    An array of articles

    @property articles
  */
  @tracked('state')
  get articles():Array<any> {
    return this.state && this.state.filter((item) => item && item.type === 'article') || [];
  }

  /**
    An array of resources

    @property resources
  */
  @tracked('state')
  get resources():Array<any> {
    return this.state && this.state.filter((item) => item && item.type === 'resource') || [];
  }

  /**
    Single out highlighted article

    @property highlighted_article
  */
  @tracked('state')
  get highlighted_article():any {
    if (this.state) {
      const articles = this.state.filter(item => item && item.type === 'article');
      const list = articles.filter(article => article.highlighted)
      return list && list[0];
    } else {
      return [];
    }
  }

  /**
    An array of resume parts

    @property resume
  */
  @tracked('state')
  get resume():Array<any> {
    return this.state && this.state.filter((item) => item.type === 'resume') || [];
  }

  /**
    Proxy the _store._dispatch function

    @method _dispatch
  */
  private _dispatch(action: Object = {}):any {
    return this._store.dispatch(action);
  }

  /**
    Populates an article in a modal view

    @method visitArticle
  */
  public visitArticle(index: Number, e):any {
    e.preventDefault();

    this._dispatch({
      type: 'HIGHLIGHT_ARTICLE',
      index
    });

    // update glimmer tracked prop
    this.state = this._store.getState();
  }

  /**
    Populates an article in a modal view

    @method visitArticle
  */
  public unvisitArticle(index: Number, e):any {
    e.preventDefault();

    this._dispatch({
      type: 'UNHIGHLIGHT_ARTICLE',
      index
    });

    // update glimmer tracked prop
    this.state = this._store.getState();
  }
}
