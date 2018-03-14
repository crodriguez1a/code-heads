'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'website-app',
    environment: environment,
    contentSecurityPolicy: {
      'img-src': "'self' data: assets-cdn.github.com",
      'style-src': "'self'",
      'font-src': "'self'"
    },
  };

  return ENV;
};
