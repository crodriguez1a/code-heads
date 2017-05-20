# website

This README outlines the details of collaborating on this Glimmer/Redux application.
A short introduction of this app could easily go here.

## A few notes about pairing Glimmer with Redux

**Using Redux without React may require some additional work at build time**

  - A check for a missing Global called `process` throws an error in the  browser : <https://github.com/angular-redux/store/issues/336>. To solve this with ember-cli, you'll have to configure `rollup` to hard-code this value in `ember-cli-build.js`.


```es6
const GlimmerApp = require('@glimmer/application-pipeline').GlimmerApp;
const replace = require('rollup-plugin-replace');

module.exports = function(defaults) {
  let app = new GlimmerApp(defaults, {
    rollup: {
      plugins: [
        replace({
          'process.env.NODE_ENV': JSON.stringify( 'production' )
        })
      ]
    }
  });
}
```

**Imported modules (e.g., reducers) are not automatically resolved.**

  - Custom modules should be placed in either `src/utils`, or inside of a collection (e.g `my-component/-utils`). Note that when referencing from inside a collection, `-utils` is pre-fixed with a hyphen. This convention is further explained in the following Glimmer issue:
  <https://github.com/glimmerjs/resolution-map-builder/issues/8>

Here's an example of file system with some custom modules added:

      my-app
    ├── config
    │   ├── environment.js
    │   ├── module-map.ts
    │   └── resolver-configuration.ts
    ├── dist/
    ├── src
    │   ├── utils
    │   │   ├── my-modules
    |   │   │   └── module.ts
    │   ├── ui
    │   │   ├── components
    │   │   │   └── my-app
    │   │   │       ├── component.ts
    │   │   │       └── template.hbs
    │   │   │       └── -utils
    |   │   │           └── my-reducer.ts
    │   │   ├── styles
    │   │   │   └── app.css
    │   │   └── index.html
    │   ├── index.ts
    │   └── main.ts
    ├── ember-cli-build.js
    │


## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with NPM)
* [Yarn](https://yarnpkg.com/en/)
* [Ember CLI](https://ember-cli.com/)

## Installation

* `git clone <repository-url>` this repository
* `cd website`
* `yarn`

## Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Building

* `ember build` (development)
* `ember build --environment production` (production)

## Further Reading / Useful Links

* [glimmerjs](http://github.com/tildeio/glimmer/)
* [ember-cli](https://ember-cli.com/)
