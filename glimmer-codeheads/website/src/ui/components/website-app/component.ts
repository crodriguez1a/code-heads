import Component, { tracked } from "@glimmer/component";
import { createStore } from 'redux';
import Reducers from './-utils/reducers';
import Router from './-utils/router/router';

// router instance
const router = new Router({ debug:true });

import Showdown from 'showdown';
const converter = new Showdown.Converter();

console.log('Showdown', Showdown);

export default class Website extends Component {
  constructor(options) {
    super(options);

    // go and get markdown content
    this.loadMarkdown();

    // subscribe to router listener
    router.listen((name) => this.onRouteUpdate(name));
  }

  /**
    Name of current route

    @property routeName
  */
  @tracked routeName;

  /**
    Call back for route listener

    @method routeUpdate
  */
  public onRouteUpdate(name) {
    this.routeName = name;
  }

  /*
    NOTE async await Throws regenaratorRuntime error https://github.com/glimmerjs/glimmer-website/issues/62
    Instructions for fix here:  https://github.com/glimmerjs/glimmer-application-pipeline#enabling-use-of-async-await-in-components.
  */
  async loadMarkdown(file='foo') {
    let req = await fetch(`./md/articles/${file}.md`);
    console.log('req', req);
    let text = await req.text();

    // console.log(markdown);
    console.log('async response', text);
    let html = converter.makeHtml(text);
    console.log('html', html);
    return html;
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

  // TODO Abstract this similar behavior
  public togglePreview(index: Number, e) {
    e.preventDefault();

    this.dispatch({
      type: 'TOGGLE_PREVIEW',
      index
    });

    // update glimmer tracked prop
    this.state = this.store.getState();
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
    this.state = this.store.getState();
  }
}
