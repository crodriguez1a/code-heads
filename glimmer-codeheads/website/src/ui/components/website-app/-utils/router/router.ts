import Navigo from 'navigo';
import urlWatcher from './watcher';

const router = new Navigo(null, true, '#!');
const watcher = new urlWatcher(window.location);

export default class Router {
  constructor(public opts = {debug:false}) {
    this.opts = opts;
    watcher.watch();
  }

  public listen(sendNameUpdate) {
    watcher.listen((url) => {
      if (this.opts.debug) {
        console.log('Route:', url);
      }
      return this.handle(sendNameUpdate);
    });

    // send the intial update before listening begins
    return this.handle(sendNameUpdate);
  }

  private handle(sendNameUpdate) {
    return router
    .on({
      '/about': () => {
        sendNameUpdate('about');
       },
      '/about/resume': () => {
        sendNameUpdate('about|resume');
      },
      '/about/resume/:employer/bubbles/:id': (params) => {
        sendNameUpdate(`resume|${params.employer}|bubbles|${params.id}`);
      },
      '': () => {
        sendNameUpdate('');
       }
    })
    .resolve();
  }
}
