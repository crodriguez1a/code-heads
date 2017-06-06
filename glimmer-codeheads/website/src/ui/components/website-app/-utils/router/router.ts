import Navigo from 'navigo';
import urlWatcher from './watcher';

const router = new Navigo(null, true, '#!');
const watcher = new urlWatcher(window.location);

export default class Router {
  constructor(public opts = {debug:false}) {
    this.opts = opts;
    watcher.watch();
  }

  public listen(fnNameUpdate) {
    watcher.listen((url) => {
      if (this.opts.debug) {
        console.log('Route:', url);
      }
      return this.onUpdate(fnNameUpdate);
    });

    // send the intial update before listening begins
    return this.onUpdate(fnNameUpdate);
  }

  private onUpdate(fnNameUpdate) {
    return router
    .on({
      '/about': () => {
        fnNameUpdate('about');
       },
      '/about/resume': () => {
        fnNameUpdate('resume');
      },
      '/about/resume/:employer/bubbles/:id': (params) => {
        fnNameUpdate(`resume|${params.employer}|bubbles|${params.id}`);
      },
      '': () => {
        fnNameUpdate('');
       }
    })
    .resolve();
  }
}
