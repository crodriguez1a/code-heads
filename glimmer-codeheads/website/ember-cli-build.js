'use strict';

const GlimmerApp = require('@glimmer/application-pipeline').GlimmerApp;
const replace = require('rollup-plugin-replace');

module.exports = function(defaults) {
  let app = new GlimmerApp(defaults, {
    rollup: { // Example of rollup plugins compatibility https://github.com/glimmerjs/glimmer-application-pipeline#importing-commonjs-modules
      plugins: [
        /*
          REVIEW Does the actual build environment matter? Do we need to reconcile the ember cli ENV?
          redux/process issue https://github.com/angular-redux/store/issues/336
        */
        replace({
          'process.env.NODE_ENV': JSON.stringify( 'production' )
        })
      ]
    }
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  return app.toTree();
};
