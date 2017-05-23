/**
@module ember
@submodule ember-glimmer
https://github.com/emberjs/ember.js/blob/v2.12.0/packages/ember-glimmer/lib/utils/string.js#L100
*/


class SafeString {
  constructor(string) {
    this.string = string;
  }

  public string:string = '';

  toString() {
    return `${this.string}`;
  }

  toHTML() {
    return this.toString();
  }
}


const escape = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  // jscs:disable
  "'": '&#x27;',
  // jscs:enable
  '`': '&#x60;',
  '=': '&#x3D;'
};

const possible = /[&<>"'`=]/;
const badChars = /[&<>"'`=]/g;

function escapeChar(chr) {
  return escape[chr];
}

function escapeExpression(string) {
  if (typeof string !== 'string') {
    // don't escape SafeStrings, since they're already safe
    if (string && string.toHTML) {
      return string.toHTML();
    } else if (string == null) {
      return '';
    } else if (!string) {
      return string + '';
    }

    // Force a string conversion as this will be done by the append regardless and
    // the regex test will do this transparently behind the scenes, causing issues if
    // an object's to string has escaped characters in it.
    string = '' + string;
  }

  if (!possible.test(string)) { return string; }
  return string.replace(badChars, escapeChar);
}

/**
  Mark a string as safe for unescaped output with Ember templates. If you
  return HTML from a helper, use this function to
  ensure Ember's rendering layer does not escape the HTML.

  ```javascript
  Ember.String.htmlSafe('<div>someString</div>')
  ```

  @method htmlSafe
  @for Ember.String
  @static
  @return {Handlebars.SafeString} A string that will not be HTML escaped by Handlebars.
  @public
*/

export default function htmlSafe(params) {
  let str = params[0];
  if (str === null || str === undefined) {
    str = '';
  } else if (typeof str !== 'string') {
    str = '' + str;
  }
  return new SafeString(str);
};
