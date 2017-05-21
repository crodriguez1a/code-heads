import Navigo from 'navigo';
import urlWatcher from './watcher';

const router = new Navigo(null, true, '#!');
const watcher = new urlWatcher(window.location);

export default class Router {
  constructor(public opts:Object = false) {
    watcher.watch();
  }

  public listen(sendNameUpdate) {

    watcher.listen((url) => {
      if (this.opts.debug) {
        console.log('Route:', url);
      }
      return this.handle(url, sendNameUpdate);
    });

    // send the intial update before listening begins
    return sendNameUpdate(window.location.hash.replace(/[^\w\s]/gi, ''));
  }

  private handle(url='', sendNameUpdate) {
    return router
    .on({
      '/about': () => {
        sendNameUpdate('about');
       },
      '': () => {
        sendNameUpdate('');
       }
    })
    .resolve();
  }
}
