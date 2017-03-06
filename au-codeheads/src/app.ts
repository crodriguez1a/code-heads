export class App {
  constructor(
    public router: Object,
    private title: string,
    public model: string[]
  ) {
    this.title = 'The Array Project';
    this.model = [
      'Alice',
      'Bob',
      'Carol',
      'Dana'
    ];
  }

  configureRouter(config, router) {
    this.router = router;
    config.title = 'Aurelia';
    config.map([
      { route: 'arrays*path', name: 'arrays', moduleId: 'arrays/index', href:'#arrays', nav: true }
      // { route: ['', 'home'],       name: 'home',       moduleId: 'home/index' },
      // { route: 'users',            name: 'users',      moduleId: 'users/index',   nav: true },
      // { route: 'users/:id/detail', name: 'userDetail', moduleId: 'users/detail' },
    ]);
  }
}
