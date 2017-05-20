const Codeheads = (function (window) {
  'use strict';

  let version = '0.01';

  /**
    @function insertDom
    @private
  */
  function _insertDom(content) {
    let container = document.getElementById('code-heads');
    if (!container) {
      container = document.createElement('div');
      container.setAttribute('id', 'code-heads');
      container.setAttribute('class', 'code-heads');
      document.body.appendChild(container);
    }

  }

  /**
    @function emoticons
    @public
  */
  function emoticons() {
    _insertDom(`=)`);
    return `=)`;
  }

  return {
    description: 'Welcome to the Codeheads collection of libraries',
    quickMenu: {
      emoticons
    }
  };
})(window);
