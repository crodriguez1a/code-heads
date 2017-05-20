define('app',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var App = (function () {
        function App(router, title, model) {
            this.router = router;
            this.title = title;
            this.model = model;
            this.title = 'The Array Project';
            this.model = [
                'Alice',
                'Bob',
                'Carol',
                'Dana'
            ];
        }
        App.prototype.configureRouter = function (config, router) {
            this.router = router;
            config.title = 'Aurelia';
            config.map([
                { route: 'arrays*path', name: 'arrays', moduleId: 'arrays/index', href: '#arrays', nav: true }
            ]);
        };
        return App;
    }());
    exports.App = App;
});

define('environment',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true
    };
});

define('main',["require", "exports", "./environment"], function (require, exports, environment_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Promise.config({
        warnings: {
            wForgottenReturn: false
        }
    });
    function configure(aurelia) {
        aurelia.use
            .standardConfiguration()
            .feature('resources');
        if (environment_1.default.debug) {
            aurelia.use.developmentLogging();
        }
        if (environment_1.default.testing) {
            aurelia.use.plugin('aurelia-testing');
        }
        aurelia.start().then(function () { return aurelia.setRoot(); });
    }
    exports.configure = configure;
});

define('resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(config) {
    }
    exports.configure = configure;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('resources/elements/array-learning',["require", "exports", "aurelia-framework"], function (require, exports, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ArrayLearning = (function () {
        function ArrayLearning(arrayMaze) {
            this.arrayMaze = arrayMaze;
            this.model = [];
            this.arrayMaze = [
                ['ʕ', '•', 'ᴥ', '•', 'ʔ']
            ];
        }
        ArrayLearning.prototype.valueChanged = function (newValue, oldValue) {
        };
        return ArrayLearning;
    }());
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], ArrayLearning.prototype, "model", void 0);
    exports.ArrayLearning = ArrayLearning;
});

define('text!app.html', ['module'], function(module) { module.exports = "<template><require from=\"./app.css\"></require><h1>${title}</h1><require from=\"resources/elements/array-learning\"></require><array-learning model.bind=\"model\"></array-learning></template>"; });
define('text!resources/elements/array-learning.html', ['module'], function(module) { module.exports = "<template><require from=\"./array-learning.css\"></require><h3>The Emoticon Challenge</h3><p>todo: instructions</p><div class=\"ascii-face-challenge\"><template repeat.for=\"column of arrayMaze\"><ul class=\"maze-column\"><template repeat.for=\"item of column\"><li class=\"is-${item}\">${item}</li></template></ul></template></div><div class=\"array-guide\"><h3>Tools</h3><ul><li><code>push</code> - Add to the end of an Array</li><li><code>pop</code> - Remove from the end of and Array</li><li><code>shift</code> - Remove from the front of an Array</li><li><code>unshift</code> - Add to the front of an Array</li><li>--</li><li><code>indexOf</code> - Find the index of an item in the Array</li><li>--</li><li><code>splice</code> - Remove an item by index position (position, number of items)</li><li><code>slice</code> - Copy an array</li></ul></div><note class=\"instructor-notes\"><h4>Instructor Notes</h4><p>Students will access a starting array from the global codeheads library <code>window.Codeheads.findChallenge('ascii-face-challenge')</code>. This access requires the codehead library to be included as part of their dependencies in their html files.<pre>\n          show link and script tags\n        </pre></p></note></template>"; });
define('text!app.css', ['module'], function(module) { module.exports = "* {\n  box-sizing: border-box; }\n\nbody {\n  font: 16px Helvetica, sans-serif;\n  color: #555;\n  padding: 1rem; }\n\nh1, h2, h3, h4 {\n  font-weight: 300; }\n\nh3 {\n  color: #777; }\n\nnote.instructor-notes {\n  display: block;\n  background: #E1F2FE;\n  padding: 1rem;\n  font-size: 90%; }\n  note.instructor-notes h4 {\n    margin-top: 0.25rem;\n    font-weight: 600;\n    font-size: 80%;\n    text-transform: uppercase; }\n"; });
define('text!resources/elements/array-learning.css', ['module'], function(module) { module.exports = ".ascii-face-challenge {\n  font: 1rem courier;\n  color: #777;\n  width: auto;\n  display: inline-block; }\n  .ascii-face-challenge ul.maze-column {\n    padding: 0;\n    margin: 0 0 3rem 0;\n    display: inline-block;\n    height: 3rem; }\n    .ascii-face-challenge ul.maze-column li {\n      width: 2rem;\n      display: inline-block;\n      list-style: none;\n      text-align: center;\n      margin: 0;\n      position: relative;\n      text-align: center; }\n"; });
//# sourceMappingURL=app-bundle.js.map