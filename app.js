(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var Container = function () {
    function Container(registry) {
        var resolver = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        classCallCheck(this, Container);

        this._registry = registry;
        this._resolver = resolver;
        this._lookups = {};
        this._factoryDefinitionLookups = {};
    }

    Container.prototype.factoryFor = function factoryFor(specifier) {
        var factoryDefinition = this._factoryDefinitionLookups[specifier];
        if (!factoryDefinition) {
            if (this._resolver) {
                factoryDefinition = this._resolver.retrieve(specifier);
            }
            if (!factoryDefinition) {
                factoryDefinition = this._registry.registration(specifier);
            }
            if (factoryDefinition) {
                this._factoryDefinitionLookups[specifier] = factoryDefinition;
            }
        }
        if (!factoryDefinition) {
            return;
        }
        return this.buildFactory(specifier, factoryDefinition);
    };

    Container.prototype.lookup = function lookup(specifier) {
        var singleton = this._registry.registeredOption(specifier, 'singleton') !== false;
        if (singleton && this._lookups[specifier]) {
            return this._lookups[specifier];
        }
        var factory = this.factoryFor(specifier);
        if (!factory) {
            return;
        }
        if (this._registry.registeredOption(specifier, 'instantiate') === false) {
            return factory.class;
        }
        var object = factory.create();
        if (singleton && object) {
            this._lookups[specifier] = object;
        }
        return object;
    };

    Container.prototype.defaultInjections = function defaultInjections(specifier) {
        return {};
    };

    Container.prototype.buildInjections = function buildInjections(specifier) {
        var hash = this.defaultInjections(specifier);
        var injections = this._registry.registeredInjections(specifier);
        var injection = void 0;
        for (var i = 0; i < injections.length; i++) {
            injection = injections[i];
            hash[injection.property] = this.lookup(injection.source);
        }
        return hash;
    };

    Container.prototype.buildFactory = function buildFactory(specifier, factoryDefinition) {
        var injections = this.buildInjections(specifier);
        return {
            class: factoryDefinition,
            create: function create(options) {
                var mergedOptions = Object.assign({}, injections, options);
                return factoryDefinition.create(mergedOptions);
            }
        };
    };

    return Container;
}();

var Registry = function () {
    function Registry(options) {
        classCallCheck(this, Registry);

        this._registrations = {};
        this._registeredOptions = {};
        this._registeredInjections = {};
        if (options && options.fallback) {
            this._fallback = options.fallback;
        }
    }

    Registry.prototype.register = function register(specifier, factoryDefinition, options) {
        this._registrations[specifier] = factoryDefinition;
        if (options) {
            this._registeredOptions[specifier] = options;
        }
    };

    Registry.prototype.registration = function registration(specifier) {
        var registration = this._registrations[specifier];
        if (registration === undefined && this._fallback) {
            registration = this._fallback.registration(specifier);
        }
        return registration;
    };

    Registry.prototype.unregister = function unregister(specifier) {
        delete this._registrations[specifier];
        delete this._registeredOptions[specifier];
        delete this._registeredInjections[specifier];
    };

    Registry.prototype.registerOption = function registerOption(specifier, option, value) {
        var options = this._registeredOptions[specifier];
        if (!options) {
            options = {};
            this._registeredOptions[specifier] = options;
        }
        options[option] = value;
    };

    Registry.prototype.registeredOption = function registeredOption(specifier, option) {
        var result = void 0;
        var options = this.registeredOptions(specifier);
        if (options) {
            result = options[option];
        }
        if (result === undefined && this._fallback !== undefined) {
            result = this._fallback.registeredOption(specifier, option);
        }
        return result;
    };

    Registry.prototype.registeredOptions = function registeredOptions(specifier) {
        var options = this._registeredOptions[specifier];
        if (options === undefined) {
            var _specifier$split = specifier.split(':'),
                type = _specifier$split[0];

            options = this._registeredOptions[type];
        }
        return options;
    };

    Registry.prototype.unregisterOption = function unregisterOption(specifier, option) {
        var options = this._registeredOptions[specifier];
        if (options) {
            delete options[option];
        }
    };

    Registry.prototype.registerInjection = function registerInjection(specifier, property, source) {
        var injections = this._registeredInjections[specifier];
        if (injections === undefined) {
            this._registeredInjections[specifier] = injections = [];
        }
        injections.push({
            property: property,
            source: source
        });
    };

    Registry.prototype.registeredInjections = function registeredInjections(specifier) {
        var _specifier$split2 = specifier.split(':'),
            type = _specifier$split2[0];

        var injections = this._fallback ? this._fallback.registeredInjections(specifier) : [];
        Array.prototype.push.apply(injections, this._registeredInjections[type]);
        Array.prototype.push.apply(injections, this._registeredInjections[specifier]);
        return injections;
    };

    return Registry;
}();

// TODO - use symbol
var OWNER = '__owner__';
function getOwner(object) {
    return object[OWNER];
}
function setOwner(object, owner) {
    object[OWNER] = owner;
}

// There is a small whitelist of namespaced attributes specially
// enumerated in
// https://www.w3.org/TR/html/syntax.html#attributes-0
//
// > When a foreign element has one of the namespaced attributes given by
// > the local name and namespace of the first and second cells of a row
// > from the following table, it must be written using the name given by
// > the third cell from the same row.
//
// In all other cases, colons are interpreted as a regular character
// with no special meaning:
//
// > No other namespaced attribute can be expressed in the HTML syntax.

function unwrap(val) {
    if (val === null || val === undefined) throw new Error('Expected value to be present');
    return val;
}
function expect(val, message) {
    if (val === null || val === undefined) throw new Error(message);
    return val;
}
function unreachable() {
    return new Error('unreachable');
}

// import Logger from './logger';
// let alreadyWarned = false;
// import Logger from './logger';
function debugAssert(test, msg) {
    // if (!alreadyWarned) {
    //   alreadyWarned = true;
    //   Logger.warn("Don't leave debug assertions on in public builds");
    // }
    if (!test) {
        throw new Error(msg || "assertion failure");
    }
}

var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Trace"] = 0] = "Trace";
    LogLevel[LogLevel["Debug"] = 1] = "Debug";
    LogLevel[LogLevel["Warn"] = 2] = "Warn";
    LogLevel[LogLevel["Error"] = 3] = "Error";
})(LogLevel || (LogLevel = {}));

var NullConsole = function () {
    function NullConsole() {
        classCallCheck(this, NullConsole);
    }

    NullConsole.prototype.log = function log(_message) {};

    NullConsole.prototype.warn = function warn(_message) {};

    NullConsole.prototype.error = function error(_message) {};

    NullConsole.prototype.trace = function trace() {};

    return NullConsole;
}();

var ALWAYS = void 0;
var Logger = function () {
    function Logger(_ref) {
        var console = _ref.console,
            level = _ref.level;
        classCallCheck(this, Logger);

        this.f = ALWAYS;
        this.force = ALWAYS;
        this.console = console;
        this.level = level;
    }

    Logger.prototype.skipped = function skipped(level) {
        return level < this.level;
    };

    Logger.prototype.trace = function trace(message) {
        var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            _ref2$stackTrace = _ref2.stackTrace,
            stackTrace = _ref2$stackTrace === undefined ? false : _ref2$stackTrace;

        if (this.skipped(LogLevel.Trace)) return;
        this.console.log(message);
        if (stackTrace) this.console.trace();
    };

    Logger.prototype.debug = function debug(message) {
        var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            _ref3$stackTrace = _ref3.stackTrace,
            stackTrace = _ref3$stackTrace === undefined ? false : _ref3$stackTrace;

        if (this.skipped(LogLevel.Debug)) return;
        this.console.log(message);
        if (stackTrace) this.console.trace();
    };

    Logger.prototype.warn = function warn(message) {
        var _ref4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            _ref4$stackTrace = _ref4.stackTrace,
            stackTrace = _ref4$stackTrace === undefined ? false : _ref4$stackTrace;

        if (this.skipped(LogLevel.Warn)) return;
        this.console.warn(message);
        if (stackTrace) this.console.trace();
    };

    Logger.prototype.error = function error(message) {
        if (this.skipped(LogLevel.Error)) return;
        this.console.error(message);
    };

    return Logger;
}();
var _console = typeof console === 'undefined' ? new NullConsole() : console;
ALWAYS = new Logger({ console: _console, level: LogLevel.Trace });
var LOG_LEVEL = LogLevel.Debug;
var LOGGER = new Logger({ console: _console, level: LOG_LEVEL });

var objKeys = Object.keys;

function assign(obj) {
    for (var i = 1; i < arguments.length; i++) {
        var assignment = arguments[i];
        if (assignment === null || (typeof assignment === 'undefined' ? 'undefined' : _typeof(assignment)) !== 'object') continue;
        var keys = objKeys(assignment);
        for (var j = 0; j < keys.length; j++) {
            var key = keys[j];
            obj[key] = assignment[key];
        }
    }
    return obj;
}
function fillNulls(count) {
    var arr = new Array(count);
    for (var i = 0; i < count; i++) {
        arr[i] = null;
    }
    return arr;
}

var GUID = 0;
function initializeGuid(object) {
    return object._guid = ++GUID;
}
function ensureGuid(object) {
    return object._guid || initializeGuid(object);
}

var proto = Object.create(null, {
    // without this, we will always still end up with (new
    // EmptyObject()).constructor === Object
    constructor: {
        value: undefined,
        enumerable: false,
        writable: true
    }
});
function EmptyObject() {}
EmptyObject.prototype = proto;
function dict() {
    // let d = Object.create(null);
    // d.x = 1;
    // delete d.x;
    // return d;
    return new EmptyObject();
}
var DictSet = function () {
    function DictSet() {
        classCallCheck(this, DictSet);

        this.dict = dict();
    }

    DictSet.prototype.add = function add(obj) {
        if (typeof obj === 'string') this.dict[obj] = obj;else this.dict[ensureGuid(obj)] = obj;
        return this;
    };

    DictSet.prototype.delete = function _delete(obj) {
        if (typeof obj === 'string') delete this.dict[obj];else if (obj._guid) delete this.dict[obj._guid];
    };

    DictSet.prototype.forEach = function forEach(callback) {
        var dict = this.dict;

        Object.keys(dict).forEach(function (key) {
            return callback(dict[key]);
        });
    };

    DictSet.prototype.toArray = function toArray$$1() {
        return Object.keys(this.dict);
    };

    return DictSet;
}();
var Stack = function () {
    function Stack() {
        classCallCheck(this, Stack);

        this.stack = [];
        this.current = null;
    }

    Stack.prototype.toArray = function toArray$$1() {
        return this.stack;
    };

    Stack.prototype.push = function push(item) {
        this.current = item;
        this.stack.push(item);
    };

    Stack.prototype.pop = function pop() {
        var item = this.stack.pop();
        var len = this.stack.length;
        this.current = len === 0 ? null : this.stack[len - 1];
        return item === undefined ? null : item;
    };

    Stack.prototype.isEmpty = function isEmpty() {
        return this.stack.length === 0;
    };

    return Stack;
}();

var ListNode = function ListNode(value) {
    classCallCheck(this, ListNode);

    this.next = null;
    this.prev = null;
    this.value = value;
};
var LinkedList = function () {
    function LinkedList() {
        classCallCheck(this, LinkedList);

        this.clear();
    }

    LinkedList.fromSlice = function fromSlice(slice) {
        var list = new LinkedList();
        slice.forEachNode(function (n) {
            return list.append(n.clone());
        });
        return list;
    };

    LinkedList.prototype.head = function head() {
        return this._head;
    };

    LinkedList.prototype.tail = function tail() {
        return this._tail;
    };

    LinkedList.prototype.clear = function clear() {
        this._head = this._tail = null;
    };

    LinkedList.prototype.isEmpty = function isEmpty() {
        return this._head === null;
    };

    LinkedList.prototype.toArray = function toArray$$1() {
        var out = [];
        this.forEachNode(function (n) {
            return out.push(n);
        });
        return out;
    };

    LinkedList.prototype.splice = function splice(start, end, reference) {
        var before = void 0;
        if (reference === null) {
            before = this._tail;
            this._tail = end;
        } else {
            before = reference.prev;
            end.next = reference;
            reference.prev = end;
        }
        if (before) {
            before.next = start;
            start.prev = before;
        }
    };

    LinkedList.prototype.nextNode = function nextNode(node) {
        return node.next;
    };

    LinkedList.prototype.prevNode = function prevNode(node) {
        return node.prev;
    };

    LinkedList.prototype.forEachNode = function forEachNode(callback) {
        var node = this._head;
        while (node !== null) {
            callback(node);
            node = node.next;
        }
    };

    LinkedList.prototype.contains = function contains(needle) {
        var node = this._head;
        while (node !== null) {
            if (node === needle) return true;
            node = node.next;
        }
        return false;
    };

    LinkedList.prototype.insertBefore = function insertBefore(node) {
        var reference = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        if (reference === null) return this.append(node);
        if (reference.prev) reference.prev.next = node;else this._head = node;
        node.prev = reference.prev;
        node.next = reference;
        reference.prev = node;
        return node;
    };

    LinkedList.prototype.append = function append(node) {
        var tail = this._tail;
        if (tail) {
            tail.next = node;
            node.prev = tail;
            node.next = null;
        } else {
            this._head = node;
        }
        return this._tail = node;
    };

    LinkedList.prototype.pop = function pop() {
        if (this._tail) return this.remove(this._tail);
        return null;
    };

    LinkedList.prototype.prepend = function prepend(node) {
        if (this._head) return this.insertBefore(node, this._head);
        return this._head = this._tail = node;
    };

    LinkedList.prototype.remove = function remove(node) {
        if (node.prev) node.prev.next = node.next;else this._head = node.next;
        if (node.next) node.next.prev = node.prev;else this._tail = node.prev;
        return node;
    };

    return LinkedList;
}();
var ListSlice = function () {
    function ListSlice(head, tail) {
        classCallCheck(this, ListSlice);

        this._head = head;
        this._tail = tail;
    }

    ListSlice.toList = function toList(slice) {
        var list = new LinkedList();
        slice.forEachNode(function (n) {
            return list.append(n.clone());
        });
        return list;
    };

    ListSlice.prototype.forEachNode = function forEachNode(callback) {
        var node = this._head;
        while (node !== null) {
            callback(node);
            node = this.nextNode(node);
        }
    };

    ListSlice.prototype.contains = function contains(needle) {
        var node = this._head;
        while (node !== null) {
            if (node === needle) return true;
            node = node.next;
        }
        return false;
    };

    ListSlice.prototype.head = function head() {
        return this._head;
    };

    ListSlice.prototype.tail = function tail() {
        return this._tail;
    };

    ListSlice.prototype.toArray = function toArray$$1() {
        var out = [];
        this.forEachNode(function (n) {
            return out.push(n);
        });
        return out;
    };

    ListSlice.prototype.nextNode = function nextNode(node) {
        if (node === this._tail) return null;
        return node.next;
    };

    ListSlice.prototype.prevNode = function prevNode(node) {
        if (node === this._head) return null;
        return node.prev;
    };

    ListSlice.prototype.isEmpty = function isEmpty() {
        return false;
    };

    return ListSlice;
}();
var EMPTY_SLICE = new ListSlice(null, null);

var HAS_NATIVE_WEAKMAP = function () {
    // detect if `WeakMap` is even present
    var hasWeakMap = typeof WeakMap === 'function';
    if (!hasWeakMap) {
        return false;
    }
    var instance = new WeakMap();
    // use `Object`'s `.toString` directly to prevent us from detecting
    // polyfills as native weakmaps
    return Object.prototype.toString.call(instance) === '[object WeakMap]';
}();

var HAS_TYPED_ARRAYS = typeof Uint32Array !== 'undefined';
var A = void 0;
if (HAS_TYPED_ARRAYS) {
    A = Uint32Array;
} else {
    A = Array;
}
var EMPTY_ARRAY = HAS_NATIVE_WEAKMAP ? Object.freeze([]) : [];

var Register;
(function (Register) {
    // $0 or $pc (program counter): pointer into `program` for the next insturction; -1 means exit
    Register[Register["pc"] = 0] = "pc";
    // $1 or $ra (return address): pointer into `program` for the return
    Register[Register["ra"] = 1] = "ra";
    // $2 or $fp (frame pointer): pointer into the `evalStack` for the base of the stack
    Register[Register["fp"] = 2] = "fp";
    // $3 or $sp (stack pointer): pointer into the `evalStack` for the top of the stack
    Register[Register["sp"] = 3] = "sp";
    // $4-$5 or $s0-$s1 (saved): callee saved general-purpose registers
    Register[Register["s0"] = 4] = "s0";
    Register[Register["s1"] = 5] = "s1";
    // $6-$7 or $t0-$t1 (temporaries): caller saved general-purpose registers
    Register[Register["t0"] = 6] = "t0";
    Register[Register["t1"] = 7] = "t1";
})(Register || (Register = {}));
function debugSlice(env, start, end) {
    
}
var AppendOpcodes = function () {
    function AppendOpcodes() {
        classCallCheck(this, AppendOpcodes);

        this.evaluateOpcode = fillNulls(72 /* Size */).slice();
    }

    AppendOpcodes.prototype.add = function add(name, evaluate) {
        this.evaluateOpcode[name] = evaluate;
    };

    AppendOpcodes.prototype.evaluate = function evaluate(vm, opcode, type) {
        var func = this.evaluateOpcode[type];
        func(vm, opcode);
        
    };

    return AppendOpcodes;
}();
var APPEND_OPCODES = new AppendOpcodes();
var AbstractOpcode = function () {
    function AbstractOpcode() {
        classCallCheck(this, AbstractOpcode);

        initializeGuid(this);
    }

    AbstractOpcode.prototype.toJSON = function toJSON() {
        return { guid: this._guid, type: this.type };
    };

    return AbstractOpcode;
}();
var UpdatingOpcode = function (_AbstractOpcode) {
    inherits(UpdatingOpcode, _AbstractOpcode);

    function UpdatingOpcode() {
        classCallCheck(this, UpdatingOpcode);

        var _this = possibleConstructorReturn(this, _AbstractOpcode.apply(this, arguments));

        _this.next = null;
        _this.prev = null;
        return _this;
    }

    return UpdatingOpcode;
}(AbstractOpcode);

var CONSTANT = 0;
var INITIAL = 1;
var VOLATILE = NaN;
var RevisionTag = function () {
    function RevisionTag() {
        classCallCheck(this, RevisionTag);
    }

    RevisionTag.prototype.validate = function validate(snapshot) {
        return this.value() === snapshot;
    };

    return RevisionTag;
}();
RevisionTag.id = 0;
var VALUE = [];
var VALIDATE = [];
var TagWrapper = function () {
    function TagWrapper(type, inner) {
        classCallCheck(this, TagWrapper);

        this.type = type;
        this.inner = inner;
    }

    TagWrapper.prototype.value = function value() {
        var func = VALUE[this.type];
        return func(this.inner);
    };

    TagWrapper.prototype.validate = function validate(snapshot) {
        var func = VALIDATE[this.type];
        return func(this.inner, snapshot);
    };

    return TagWrapper;
}();
function register(Type) {
    var type = VALUE.length;
    VALUE.push(function (tag) {
        return tag.value();
    });
    VALIDATE.push(function (tag, snapshot) {
        return tag.validate(snapshot);
    });
    Type.id = type;
}
///
// CONSTANT: 0
VALUE.push(function () {
    return CONSTANT;
});
VALIDATE.push(function (_tag, snapshot) {
    return snapshot === CONSTANT;
});
var CONSTANT_TAG = new TagWrapper(0, null);
// VOLATILE: 1
VALUE.push(function () {
    return VOLATILE;
});
VALIDATE.push(function (_tag, snapshot) {
    return snapshot === VOLATILE;
});
var VOLATILE_TAG = new TagWrapper(1, null);
// CURRENT: 2
VALUE.push(function () {
    return $REVISION;
});
VALIDATE.push(function (_tag, snapshot) {
    return snapshot === $REVISION;
});
var CURRENT_TAG = new TagWrapper(2, null);
///
var $REVISION = INITIAL;
var DirtyableTag = function (_RevisionTag) {
    inherits(DirtyableTag, _RevisionTag);

    DirtyableTag.create = function create() {
        var revision = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : $REVISION;

        return new TagWrapper(this.id, new DirtyableTag(revision));
    };

    function DirtyableTag() {
        var revision = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : $REVISION;
        classCallCheck(this, DirtyableTag);

        var _this = possibleConstructorReturn(this, _RevisionTag.call(this));

        _this.revision = revision;
        return _this;
    }

    DirtyableTag.prototype.value = function value() {
        return this.revision;
    };

    DirtyableTag.prototype.dirty = function dirty() {
        this.revision = ++$REVISION;
    };

    return DirtyableTag;
}(RevisionTag);
register(DirtyableTag);
function combineTagged(tagged) {
    var optimized = [];
    for (var i = 0, l = tagged.length; i < l; i++) {
        var tag = tagged[i].tag;
        if (tag === VOLATILE_TAG) return VOLATILE_TAG;
        if (tag === CONSTANT_TAG) continue;
        optimized.push(tag);
    }
    return _combine(optimized);
}
function combineSlice(slice) {
    var optimized = [];
    var node = slice.head();
    while (node !== null) {
        var tag = node.tag;
        if (tag === VOLATILE_TAG) return VOLATILE_TAG;
        if (tag !== CONSTANT_TAG) optimized.push(tag);
        node = slice.nextNode(node);
    }
    return _combine(optimized);
}
function combine(tags) {
    var optimized = [];
    for (var i = 0, l = tags.length; i < l; i++) {
        var tag = tags[i];
        if (tag === VOLATILE_TAG) return VOLATILE_TAG;
        if (tag === CONSTANT_TAG) continue;
        optimized.push(tag);
    }
    return _combine(optimized);
}
function _combine(tags) {
    switch (tags.length) {
        case 0:
            return CONSTANT_TAG;
        case 1:
            return tags[0];
        case 2:
            return TagsPair.create(tags[0], tags[1]);
        default:
            return TagsCombinator.create(tags);
    }
    
}
var CachedTag = function (_RevisionTag2) {
    inherits(CachedTag, _RevisionTag2);

    function CachedTag() {
        classCallCheck(this, CachedTag);

        var _this2 = possibleConstructorReturn(this, _RevisionTag2.apply(this, arguments));

        _this2.lastChecked = null;
        _this2.lastValue = null;
        return _this2;
    }

    CachedTag.prototype.value = function value() {
        var lastChecked = this.lastChecked,
            lastValue = this.lastValue;

        if (lastChecked !== $REVISION) {
            this.lastChecked = $REVISION;
            this.lastValue = lastValue = this.compute();
        }
        return this.lastValue;
    };

    CachedTag.prototype.invalidate = function invalidate() {
        this.lastChecked = null;
    };

    return CachedTag;
}(RevisionTag);

var TagsPair = function (_CachedTag) {
    inherits(TagsPair, _CachedTag);

    TagsPair.create = function create(first, second) {
        return new TagWrapper(this.id, new TagsPair(first, second));
    };

    function TagsPair(first, second) {
        classCallCheck(this, TagsPair);

        var _this3 = possibleConstructorReturn(this, _CachedTag.call(this));

        _this3.first = first;
        _this3.second = second;
        return _this3;
    }

    TagsPair.prototype.compute = function compute() {
        return Math.max(this.first.value(), this.second.value());
    };

    return TagsPair;
}(CachedTag);

register(TagsPair);

var TagsCombinator = function (_CachedTag2) {
    inherits(TagsCombinator, _CachedTag2);

    TagsCombinator.create = function create(tags) {
        return new TagWrapper(this.id, new TagsCombinator(tags));
    };

    function TagsCombinator(tags) {
        classCallCheck(this, TagsCombinator);

        var _this4 = possibleConstructorReturn(this, _CachedTag2.call(this));

        _this4.tags = tags;
        return _this4;
    }

    TagsCombinator.prototype.compute = function compute() {
        var tags = this.tags;

        var max = -1;
        for (var i = 0; i < tags.length; i++) {
            var value = tags[i].value();
            max = Math.max(value, max);
        }
        return max;
    };

    return TagsCombinator;
}(CachedTag);

register(TagsCombinator);
var UpdatableTag = function (_CachedTag3) {
    inherits(UpdatableTag, _CachedTag3);

    UpdatableTag.create = function create(tag) {
        return new TagWrapper(this.id, new UpdatableTag(tag));
    };

    function UpdatableTag(tag) {
        classCallCheck(this, UpdatableTag);

        var _this5 = possibleConstructorReturn(this, _CachedTag3.call(this));

        _this5.tag = tag;
        _this5.lastUpdated = INITIAL;
        return _this5;
    }

    UpdatableTag.prototype.compute = function compute() {
        return Math.max(this.lastUpdated, this.tag.value());
    };

    UpdatableTag.prototype.update = function update(tag) {
        if (tag !== this.tag) {
            this.tag = tag;
            this.lastUpdated = $REVISION;
            this.invalidate();
        }
    };

    return UpdatableTag;
}(CachedTag);
register(UpdatableTag);
var CachedReference = function () {
    function CachedReference() {
        classCallCheck(this, CachedReference);

        this.lastRevision = null;
        this.lastValue = null;
    }

    CachedReference.prototype.value = function value() {
        var tag = this.tag,
            lastRevision = this.lastRevision,
            lastValue = this.lastValue;

        if (!lastRevision || !tag.validate(lastRevision)) {
            lastValue = this.lastValue = this.compute();
            this.lastRevision = tag.value();
        }
        return lastValue;
    };

    CachedReference.prototype.invalidate = function invalidate() {
        this.lastRevision = null;
    };

    return CachedReference;
}();

var MapperReference = function (_CachedReference) {
    inherits(MapperReference, _CachedReference);

    function MapperReference(reference, mapper) {
        classCallCheck(this, MapperReference);

        var _this6 = possibleConstructorReturn(this, _CachedReference.call(this));

        _this6.tag = reference.tag;
        _this6.reference = reference;
        _this6.mapper = mapper;
        return _this6;
    }

    MapperReference.prototype.compute = function compute() {
        var reference = this.reference,
            mapper = this.mapper;

        return mapper(reference.value());
    };

    return MapperReference;
}(CachedReference);

function map(reference, mapper) {
    return new MapperReference(reference, mapper);
}
//////////
var ReferenceCache = function () {
    function ReferenceCache(reference) {
        classCallCheck(this, ReferenceCache);

        this.lastValue = null;
        this.lastRevision = null;
        this.initialized = false;
        this.tag = reference.tag;
        this.reference = reference;
    }

    ReferenceCache.prototype.peek = function peek() {
        if (!this.initialized) {
            return this.initialize();
        }
        return this.lastValue;
    };

    ReferenceCache.prototype.revalidate = function revalidate() {
        if (!this.initialized) {
            return this.initialize();
        }
        var reference = this.reference,
            lastRevision = this.lastRevision;

        var tag = reference.tag;
        if (tag.validate(lastRevision)) return NOT_MODIFIED;
        this.lastRevision = tag.value();
        var lastValue = this.lastValue;

        var value = reference.value();
        if (value === lastValue) return NOT_MODIFIED;
        this.lastValue = value;
        return value;
    };

    ReferenceCache.prototype.initialize = function initialize() {
        var reference = this.reference;

        var value = this.lastValue = reference.value();
        this.lastRevision = reference.tag.value();
        this.initialized = true;
        return value;
    };

    return ReferenceCache;
}();
var NOT_MODIFIED = "adb3b78e-3d22-4e4b-877a-6317c2c5c145";
function isModified(value) {
    return value !== NOT_MODIFIED;
}

var ConstReference = function () {
    function ConstReference(inner) {
        classCallCheck(this, ConstReference);

        this.inner = inner;
        this.tag = CONSTANT_TAG;
    }

    ConstReference.prototype.value = function value() {
        return this.inner;
    };

    return ConstReference;
}();
function isConst(reference) {
    return reference.tag === CONSTANT_TAG;
}

var ListItem = function (_ListNode) {
    inherits(ListItem, _ListNode);

    function ListItem(iterable, result) {
        classCallCheck(this, ListItem);

        var _this = possibleConstructorReturn(this, _ListNode.call(this, iterable.valueReferenceFor(result)));

        _this.retained = false;
        _this.seen = false;
        _this.key = result.key;
        _this.iterable = iterable;
        _this.memo = iterable.memoReferenceFor(result);
        return _this;
    }

    ListItem.prototype.update = function update(item) {
        this.retained = true;
        this.iterable.updateValueReference(this.value, item);
        this.iterable.updateMemoReference(this.memo, item);
    };

    ListItem.prototype.shouldRemove = function shouldRemove() {
        return !this.retained;
    };

    ListItem.prototype.reset = function reset() {
        this.retained = false;
        this.seen = false;
    };

    return ListItem;
}(ListNode);
var IterationArtifacts = function () {
    function IterationArtifacts(iterable) {
        classCallCheck(this, IterationArtifacts);

        this.map = dict();
        this.list = new LinkedList();
        this.tag = iterable.tag;
        this.iterable = iterable;
    }

    IterationArtifacts.prototype.isEmpty = function isEmpty() {
        var iterator = this.iterator = this.iterable.iterate();
        return iterator.isEmpty();
    };

    IterationArtifacts.prototype.iterate = function iterate() {
        var iterator = this.iterator || this.iterable.iterate();
        this.iterator = null;
        return iterator;
    };

    IterationArtifacts.prototype.has = function has(key) {
        return !!this.map[key];
    };

    IterationArtifacts.prototype.get = function get$$1(key) {
        return this.map[key];
    };

    IterationArtifacts.prototype.wasSeen = function wasSeen(key) {
        var node = this.map[key];
        return node && node.seen;
    };

    IterationArtifacts.prototype.append = function append(item) {
        var map = this.map,
            list = this.list,
            iterable = this.iterable;

        var node = map[item.key] = new ListItem(iterable, item);
        list.append(node);
        return node;
    };

    IterationArtifacts.prototype.insertBefore = function insertBefore(item, reference) {
        var map = this.map,
            list = this.list,
            iterable = this.iterable;

        var node = map[item.key] = new ListItem(iterable, item);
        node.retained = true;
        list.insertBefore(node, reference);
        return node;
    };

    IterationArtifacts.prototype.move = function move(item, reference) {
        var list = this.list;

        item.retained = true;
        list.remove(item);
        list.insertBefore(item, reference);
    };

    IterationArtifacts.prototype.remove = function remove(item) {
        var list = this.list;

        list.remove(item);
        delete this.map[item.key];
    };

    IterationArtifacts.prototype.nextNode = function nextNode(item) {
        return this.list.nextNode(item);
    };

    IterationArtifacts.prototype.head = function head() {
        return this.list.head();
    };

    return IterationArtifacts;
}();
var ReferenceIterator = function () {
    // if anyone needs to construct this object with something other than
    // an iterable, let @wycats know.
    function ReferenceIterator(iterable) {
        classCallCheck(this, ReferenceIterator);

        this.iterator = null;
        var artifacts = new IterationArtifacts(iterable);
        this.artifacts = artifacts;
    }

    ReferenceIterator.prototype.next = function next() {
        var artifacts = this.artifacts;

        var iterator = this.iterator = this.iterator || artifacts.iterate();
        var item = iterator.next();
        if (!item) return null;
        return artifacts.append(item);
    };

    return ReferenceIterator;
}();
var Phase;
(function (Phase) {
    Phase[Phase["Append"] = 0] = "Append";
    Phase[Phase["Prune"] = 1] = "Prune";
    Phase[Phase["Done"] = 2] = "Done";
})(Phase || (Phase = {}));
var IteratorSynchronizer = function () {
    function IteratorSynchronizer(_ref) {
        var target = _ref.target,
            artifacts = _ref.artifacts;
        classCallCheck(this, IteratorSynchronizer);

        this.target = target;
        this.artifacts = artifacts;
        this.iterator = artifacts.iterate();
        this.current = artifacts.head();
    }

    IteratorSynchronizer.prototype.sync = function sync() {
        var phase = Phase.Append;
        while (true) {
            switch (phase) {
                case Phase.Append:
                    phase = this.nextAppend();
                    break;
                case Phase.Prune:
                    phase = this.nextPrune();
                    break;
                case Phase.Done:
                    this.nextDone();
                    return;
            }
        }
    };

    IteratorSynchronizer.prototype.advanceToKey = function advanceToKey(key) {
        var current = this.current,
            artifacts = this.artifacts;

        var seek = current;
        while (seek && seek.key !== key) {
            seek.seen = true;
            seek = artifacts.nextNode(seek);
        }
        this.current = seek && artifacts.nextNode(seek);
    };

    IteratorSynchronizer.prototype.nextAppend = function nextAppend() {
        var iterator = this.iterator,
            current = this.current,
            artifacts = this.artifacts;

        var item = iterator.next();
        if (item === null) {
            return this.startPrune();
        }
        var key = item.key;

        if (current && current.key === key) {
            this.nextRetain(item);
        } else if (artifacts.has(key)) {
            this.nextMove(item);
        } else {
            this.nextInsert(item);
        }
        return Phase.Append;
    };

    IteratorSynchronizer.prototype.nextRetain = function nextRetain(item) {
        var artifacts = this.artifacts,
            current = this.current;

        current = expect(current, 'BUG: current is empty');
        current.update(item);
        this.current = artifacts.nextNode(current);
        this.target.retain(item.key, current.value, current.memo);
    };

    IteratorSynchronizer.prototype.nextMove = function nextMove(item) {
        var current = this.current,
            artifacts = this.artifacts,
            target = this.target;
        var key = item.key;

        var found = artifacts.get(item.key);
        found.update(item);
        if (artifacts.wasSeen(item.key)) {
            artifacts.move(found, current);
            target.move(found.key, found.value, found.memo, current ? current.key : null);
        } else {
            this.advanceToKey(key);
        }
    };

    IteratorSynchronizer.prototype.nextInsert = function nextInsert(item) {
        var artifacts = this.artifacts,
            target = this.target,
            current = this.current;

        var node = artifacts.insertBefore(item, current);
        target.insert(node.key, node.value, node.memo, current ? current.key : null);
    };

    IteratorSynchronizer.prototype.startPrune = function startPrune() {
        this.current = this.artifacts.head();
        return Phase.Prune;
    };

    IteratorSynchronizer.prototype.nextPrune = function nextPrune() {
        var artifacts = this.artifacts,
            target = this.target,
            current = this.current;

        if (current === null) {
            return Phase.Done;
        }
        var node = current;
        this.current = artifacts.nextNode(node);
        if (node.shouldRemove()) {
            artifacts.remove(node);
            target.delete(node.key);
        } else {
            node.reset();
        }
        return Phase.Prune;
    };

    IteratorSynchronizer.prototype.nextDone = function nextDone() {
        this.target.done();
    };

    return IteratorSynchronizer;
}();

var ConcatReference = function (_CachedReference) {
    inherits(ConcatReference, _CachedReference);

    function ConcatReference(parts) {
        classCallCheck(this, ConcatReference);

        var _this = possibleConstructorReturn(this, _CachedReference.call(this));

        _this.parts = parts;
        _this.tag = combineTagged(parts);
        return _this;
    }

    ConcatReference.prototype.compute = function compute() {
        var parts = new Array();
        for (var i = 0; i < this.parts.length; i++) {
            var value = this.parts[i].value();
            if (value !== null && value !== undefined) {
                parts[i] = castToString(value);
            }
        }
        if (parts.length > 0) {
            return parts.join('');
        }
        return null;
    };

    return ConcatReference;
}(CachedReference);
function castToString(value) {
    if (typeof value['toString'] !== 'function') {
        return '';
    }
    return String(value);
}

var PrimitiveReference = function (_ConstReference) {
    inherits(PrimitiveReference, _ConstReference);

    function PrimitiveReference(value) {
        classCallCheck(this, PrimitiveReference);
        return possibleConstructorReturn(this, _ConstReference.call(this, value));
    }

    PrimitiveReference.create = function create(value) {
        if (value === undefined) {
            return UNDEFINED_REFERENCE;
        } else if (value === null) {
            return NULL_REFERENCE;
        } else if (value === true) {
            return TRUE_REFERENCE;
        } else if (value === false) {
            return FALSE_REFERENCE;
        } else if (typeof value === 'number') {
            return new ValueReference(value);
        } else {
            return new StringReference(value);
        }
    };

    PrimitiveReference.prototype.get = function get$$1(_key) {
        return UNDEFINED_REFERENCE;
    };

    return PrimitiveReference;
}(ConstReference);

var StringReference = function (_PrimitiveReference) {
    inherits(StringReference, _PrimitiveReference);

    function StringReference() {
        classCallCheck(this, StringReference);

        var _this2 = possibleConstructorReturn(this, _PrimitiveReference.apply(this, arguments));

        _this2.lengthReference = null;
        return _this2;
    }

    StringReference.prototype.get = function get$$1(key) {
        if (key === 'length') {
            var lengthReference = this.lengthReference;

            if (lengthReference === null) {
                lengthReference = this.lengthReference = new ValueReference(this.inner.length);
            }
            return lengthReference;
        } else {
            return _PrimitiveReference.prototype.get.call(this, key);
        }
    };

    return StringReference;
}(PrimitiveReference);

var ValueReference = function (_PrimitiveReference2) {
    inherits(ValueReference, _PrimitiveReference2);

    function ValueReference(value) {
        classCallCheck(this, ValueReference);
        return possibleConstructorReturn(this, _PrimitiveReference2.call(this, value));
    }

    return ValueReference;
}(PrimitiveReference);

var UNDEFINED_REFERENCE = new ValueReference(undefined);
var NULL_REFERENCE = new ValueReference(null);
var TRUE_REFERENCE = new ValueReference(true);
var FALSE_REFERENCE = new ValueReference(false);
var ConditionalReference = function () {
    function ConditionalReference(inner) {
        classCallCheck(this, ConditionalReference);

        this.inner = inner;
        this.tag = inner.tag;
    }

    ConditionalReference.prototype.value = function value() {
        return this.toBool(this.inner.value());
    };

    ConditionalReference.prototype.toBool = function toBool(value) {
        return !!value;
    };

    return ConditionalReference;
}();

APPEND_OPCODES.add(1 /* Helper */, function (vm, _ref) {
    var _helper = _ref.op1;

    var stack = vm.stack;
    var helper = vm.constants.getFunction(_helper);
    var args = stack.pop();
    var value = helper(vm, args);
    args.clear();
    vm.stack.push(value);
});
APPEND_OPCODES.add(2 /* Function */, function (vm, _ref2) {
    var _function = _ref2.op1;

    var func = vm.constants.getFunction(_function);
    vm.stack.push(func(vm));
});
APPEND_OPCODES.add(5 /* GetVariable */, function (vm, _ref3) {
    var symbol = _ref3.op1;

    var expr = vm.referenceForSymbol(symbol);
    vm.stack.push(expr);
});
APPEND_OPCODES.add(4 /* SetVariable */, function (vm, _ref4) {
    var symbol = _ref4.op1;

    var expr = vm.stack.pop();
    vm.scope().bindSymbol(symbol, expr);
});
APPEND_OPCODES.add(70 /* ResolveMaybeLocal */, function (vm, _ref5) {
    var _name = _ref5.op1;

    var name = vm.constants.getString(_name);
    var locals = vm.scope().getPartialMap();
    var ref = locals[name];
    if (ref === undefined) {
        ref = vm.getSelf().get(name);
    }
    vm.stack.push(ref);
});
APPEND_OPCODES.add(19 /* RootScope */, function (vm, _ref6) {
    var symbols = _ref6.op1,
        bindCallerScope = _ref6.op2;

    vm.pushRootScope(symbols, !!bindCallerScope);
});
APPEND_OPCODES.add(6 /* GetProperty */, function (vm, _ref7) {
    var _key = _ref7.op1;

    var key = vm.constants.getString(_key);
    var expr = vm.stack.pop();
    vm.stack.push(expr.get(key));
});
APPEND_OPCODES.add(7 /* PushBlock */, function (vm, _ref8) {
    var _block = _ref8.op1;

    var block = _block ? vm.constants.getBlock(_block) : null;
    vm.stack.push(block);
});
APPEND_OPCODES.add(8 /* GetBlock */, function (vm, _ref9) {
    var _block = _ref9.op1;

    vm.stack.push(vm.scope().getBlock(_block));
});
APPEND_OPCODES.add(9 /* HasBlock */, function (vm, _ref10) {
    var _block = _ref10.op1;

    var hasBlock = !!vm.scope().getBlock(_block);
    vm.stack.push(hasBlock ? TRUE_REFERENCE : FALSE_REFERENCE);
});
APPEND_OPCODES.add(10 /* HasBlockParams */, function (vm, _ref11) {
    var _block = _ref11.op1;

    var block = vm.scope().getBlock(_block);
    var hasBlockParams = block && block.symbolTable.parameters.length;
    vm.stack.push(hasBlockParams ? TRUE_REFERENCE : FALSE_REFERENCE);
});
APPEND_OPCODES.add(11 /* Concat */, function (vm, _ref12) {
    var count = _ref12.op1;

    var out = [];
    for (var i = count; i > 0; i--) {
        out.push(vm.stack.pop());
    }
    vm.stack.push(new ConcatReference(out.reverse()));
});

APPEND_OPCODES.add(20 /* ChildScope */, function (vm) {
    return vm.pushChildScope();
});
APPEND_OPCODES.add(21 /* PopScope */, function (vm) {
    return vm.popScope();
});
APPEND_OPCODES.add(38 /* PushDynamicScope */, function (vm) {
    return vm.pushDynamicScope();
});
APPEND_OPCODES.add(39 /* PopDynamicScope */, function (vm) {
    return vm.popDynamicScope();
});
APPEND_OPCODES.add(12 /* Immediate */, function (vm, _ref) {
    var number = _ref.op1;

    vm.stack.push(number);
});
APPEND_OPCODES.add(13 /* Constant */, function (vm, _ref2) {
    var other = _ref2.op1;

    vm.stack.push(vm.constants.getOther(other));
});
APPEND_OPCODES.add(14 /* PrimitiveReference */, function (vm, _ref3) {
    var primitive = _ref3.op1;

    var stack = vm.stack;
    var flag = (primitive & 3 << 30) >>> 30;
    var value = primitive & ~(3 << 30);
    switch (flag) {
        case 0:
            stack.push(PrimitiveReference.create(value));
            break;
        case 1:
            stack.push(PrimitiveReference.create(vm.constants.getString(value)));
            break;
        case 2:
            switch (value) {
                case 0:
                    stack.push(FALSE_REFERENCE);
                    break;
                case 1:
                    stack.push(TRUE_REFERENCE);
                    break;
                case 2:
                    stack.push(NULL_REFERENCE);
                    break;
                case 3:
                    stack.push(UNDEFINED_REFERENCE);
                    break;
            }
            break;
    }
});
APPEND_OPCODES.add(15 /* Dup */, function (vm, _ref4) {
    var register = _ref4.op1,
        offset = _ref4.op2;

    var position = vm.fetchValue(register) - offset;
    vm.stack.dup(position);
});
APPEND_OPCODES.add(16 /* Pop */, function (vm, _ref5) {
    var count = _ref5.op1;
    return vm.stack.pop(count);
});
APPEND_OPCODES.add(17 /* Load */, function (vm, _ref6) {
    var register = _ref6.op1;
    return vm.load(register);
});
APPEND_OPCODES.add(18 /* Fetch */, function (vm, _ref7) {
    var register = _ref7.op1;
    return vm.fetch(register);
});
APPEND_OPCODES.add(37 /* BindDynamicScope */, function (vm, _ref8) {
    var _names = _ref8.op1;

    var names = vm.constants.getArray(_names);
    vm.bindDynamicScope(names);
});
APPEND_OPCODES.add(46 /* PushFrame */, function (vm) {
    return vm.pushFrame();
});
APPEND_OPCODES.add(47 /* PopFrame */, function (vm) {
    return vm.popFrame();
});
APPEND_OPCODES.add(48 /* Enter */, function (vm, _ref9) {
    var args = _ref9.op1;
    return vm.enter(args);
});
APPEND_OPCODES.add(49 /* Exit */, function (vm) {
    return vm.exit();
});
APPEND_OPCODES.add(40 /* CompileDynamicBlock */, function (vm) {
    var stack = vm.stack;
    var block = stack.pop();
    stack.push(block ? block.compileDynamic(vm.env) : null);
});
APPEND_OPCODES.add(41 /* InvokeStatic */, function (vm, _ref10) {
    var _block = _ref10.op1;

    var block = vm.constants.getBlock(_block);
    var compiled = block.compileStatic(vm.env);
    vm.call(compiled.start);
});
APPEND_OPCODES.add(42 /* InvokeDynamic */, function (vm, _ref11) {
    var _invoker = _ref11.op1;

    var invoker = vm.constants.getOther(_invoker);
    var block = vm.stack.pop();
    invoker.invoke(vm, block);
});
APPEND_OPCODES.add(43 /* Jump */, function (vm, _ref12) {
    var target = _ref12.op1;
    return vm.goto(target);
});
APPEND_OPCODES.add(44 /* JumpIf */, function (vm, _ref13) {
    var target = _ref13.op1;

    var reference = vm.stack.pop();
    if (isConst(reference)) {
        if (reference.value()) {
            vm.goto(target);
        }
    } else {
        var cache = new ReferenceCache(reference);
        if (cache.peek()) {
            vm.goto(target);
        }
        vm.updateWith(new Assert(cache));
    }
});
APPEND_OPCODES.add(45 /* JumpUnless */, function (vm, _ref14) {
    var target = _ref14.op1;

    var reference = vm.stack.pop();
    if (isConst(reference)) {
        if (!reference.value()) {
            vm.goto(target);
        }
    } else {
        var cache = new ReferenceCache(reference);
        if (!cache.peek()) {
            vm.goto(target);
        }
        vm.updateWith(new Assert(cache));
    }
});
APPEND_OPCODES.add(22 /* Return */, function (vm) {
    return vm.return();
});
var ConstTest = function ConstTest(ref, _env) {
    return new ConstReference(!!ref.value());
};
var SimpleTest = function SimpleTest(ref, _env) {
    return ref;
};
var EnvironmentTest = function EnvironmentTest(ref, env) {
    return env.toConditionalReference(ref);
};
APPEND_OPCODES.add(50 /* Test */, function (vm, _ref15) {
    var _func = _ref15.op1;

    var stack = vm.stack;
    var operand = stack.pop();
    var func = vm.constants.getFunction(_func);
    stack.push(func(operand, vm.env));
});
var Assert = function (_UpdatingOpcode) {
    inherits(Assert, _UpdatingOpcode);

    function Assert(cache) {
        classCallCheck(this, Assert);

        var _this = possibleConstructorReturn(this, _UpdatingOpcode.call(this));

        _this.type = "assert";
        _this.tag = cache.tag;
        _this.cache = cache;
        return _this;
    }

    Assert.prototype.evaluate = function evaluate(vm) {
        var cache = this.cache;

        if (isModified(cache.revalidate())) {
            vm.throw();
        }
    };

    Assert.prototype.toJSON = function toJSON() {
        var type = this.type,
            _guid = this._guid,
            cache = this.cache;

        var expected = void 0;
        try {
            expected = JSON.stringify(cache.peek());
        } catch (e) {
            expected = String(cache.peek());
        }
        return {
            guid: _guid,
            type: type,
            args: [],
            details: { expected: expected }
        };
    };

    return Assert;
}(UpdatingOpcode);
var JumpIfNotModifiedOpcode = function (_UpdatingOpcode2) {
    inherits(JumpIfNotModifiedOpcode, _UpdatingOpcode2);

    function JumpIfNotModifiedOpcode(tag, target) {
        classCallCheck(this, JumpIfNotModifiedOpcode);

        var _this2 = possibleConstructorReturn(this, _UpdatingOpcode2.call(this));

        _this2.target = target;
        _this2.type = "jump-if-not-modified";
        _this2.tag = tag;
        _this2.lastRevision = tag.value();
        return _this2;
    }

    JumpIfNotModifiedOpcode.prototype.evaluate = function evaluate(vm) {
        var tag = this.tag,
            target = this.target,
            lastRevision = this.lastRevision;

        if (!vm.alwaysRevalidate && tag.validate(lastRevision)) {
            vm.goto(target);
        }
    };

    JumpIfNotModifiedOpcode.prototype.didModify = function didModify() {
        this.lastRevision = this.tag.value();
    };

    JumpIfNotModifiedOpcode.prototype.toJSON = function toJSON() {
        return {
            guid: this._guid,
            type: this.type,
            args: [JSON.stringify(this.target.inspect())]
        };
    };

    return JumpIfNotModifiedOpcode;
}(UpdatingOpcode);
var DidModifyOpcode = function (_UpdatingOpcode3) {
    inherits(DidModifyOpcode, _UpdatingOpcode3);

    function DidModifyOpcode(target) {
        classCallCheck(this, DidModifyOpcode);

        var _this3 = possibleConstructorReturn(this, _UpdatingOpcode3.call(this));

        _this3.target = target;
        _this3.type = "did-modify";
        _this3.tag = CONSTANT_TAG;
        return _this3;
    }

    DidModifyOpcode.prototype.evaluate = function evaluate() {
        this.target.didModify();
    };

    return DidModifyOpcode;
}(UpdatingOpcode);
var LabelOpcode = function () {
    function LabelOpcode(label) {
        classCallCheck(this, LabelOpcode);

        this.tag = CONSTANT_TAG;
        this.type = "label";
        this.label = null;
        this.prev = null;
        this.next = null;
        initializeGuid(this);
        if (label) this.label = label;
    }

    LabelOpcode.prototype.evaluate = function evaluate() {};

    LabelOpcode.prototype.inspect = function inspect$$1() {
        return this.label + ' [' + this._guid + ']';
    };

    LabelOpcode.prototype.toJSON = function toJSON() {
        return {
            guid: this._guid,
            type: this.type,
            args: [JSON.stringify(this.inspect())]
        };
    };

    return LabelOpcode;
}();

var Arguments = function () {
    function Arguments() {
        classCallCheck(this, Arguments);

        this.stack = null;
        this.positional = new PositionalArguments();
        this.named = new NamedArguments();
    }

    Arguments.prototype.empty = function empty() {
        this.setup(null, 0, true);
        return this;
    };

    Arguments.prototype.setup = function setup(stack, positionalCount, synthetic) {
        this.stack = stack;
        var names = stack.fromTop(0);
        var namedCount = names.length;
        var start = positionalCount + namedCount + 1;
        var positional = this.positional;
        positional.setup(stack, start, positionalCount);
        var named = this.named;
        named.setup(stack, namedCount, names, synthetic);
    };

    Arguments.prototype.at = function at(pos) {
        return this.positional.at(pos);
    };

    Arguments.prototype.get = function get$$1(name) {
        return this.named.get(name);
    };

    Arguments.prototype.capture = function capture() {
        return {
            tag: this.tag,
            length: this.length,
            positional: this.positional.capture(),
            named: this.named.capture()
        };
    };

    Arguments.prototype.clear = function clear() {
        var stack = this.stack,
            length = this.length;

        var pops = length + 1;
        while (--pops >= 0) {
            stack.pop();
        }
    };

    createClass(Arguments, [{
        key: 'tag',
        get: function get$$1() {
            return combineTagged([this.positional, this.named]);
        }
    }, {
        key: 'length',
        get: function get$$1() {
            return this.positional.length + this.named.length;
        }
    }]);
    return Arguments;
}();

var PositionalArguments = function () {
    function PositionalArguments() {
        classCallCheck(this, PositionalArguments);

        this.length = 0;
        this.stack = null;
        this.start = 0;
        this._tag = null;
        this._references = null;
    }

    PositionalArguments.prototype.setup = function setup(stack, start, length) {
        this.stack = stack;
        this.start = start;
        this.length = length;
        this._tag = null;
        this._references = null;
    };

    PositionalArguments.prototype.at = function at(position) {
        var start = this.start,
            length = this.length;

        if (position < 0 || position >= length) {
            return UNDEFINED_REFERENCE;
        }
        // stack: pos1, pos2, pos3, named1, named2
        // start: 4 (top - 4)
        //
        // at(0) === pos1 === top - start
        // at(1) === pos2 === top - (start - 1)
        // at(2) === pos3 === top - (start - 2)
        var fromTop = start - position - 1;
        return this.stack.fromTop(fromTop);
    };

    PositionalArguments.prototype.capture = function capture() {
        return new CapturedPositionalArguments(this.tag, this.references);
    };

    createClass(PositionalArguments, [{
        key: 'tag',
        get: function get$$1() {
            var tag = this._tag;
            if (!tag) {
                tag = this._tag = combineTagged(this.references);
            }
            return tag;
        }
    }, {
        key: 'references',
        get: function get$$1() {
            var references = this._references;
            if (!references) {
                var length = this.length;

                references = this._references = new Array(length);
                for (var i = 0; i < length; i++) {
                    references[i] = this.at(i);
                }
            }
            return references;
        }
    }]);
    return PositionalArguments;
}();

var CapturedPositionalArguments = function () {
    function CapturedPositionalArguments(tag, references) {
        var length = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : references.length;
        classCallCheck(this, CapturedPositionalArguments);

        this.tag = tag;
        this.references = references;
        this.length = length;
    }

    CapturedPositionalArguments.prototype.at = function at(position) {
        return this.references[position];
    };

    CapturedPositionalArguments.prototype.value = function value() {
        return this.references.map(this.valueOf);
    };

    CapturedPositionalArguments.prototype.get = function get$$1(name) {
        var references = this.references,
            length = this.length;

        if (name === 'length') {
            return PrimitiveReference.create(length);
        } else {
            var idx = parseInt(name, 10);
            if (idx < 0 || idx >= length) {
                return UNDEFINED_REFERENCE;
            } else {
                return references[idx];
            }
        }
    };

    CapturedPositionalArguments.prototype.valueOf = function valueOf(reference) {
        return reference.value();
    };

    return CapturedPositionalArguments;
}();

var NamedArguments = function () {
    function NamedArguments() {
        classCallCheck(this, NamedArguments);

        this.length = 0;
        this._tag = null;
        this._references = null;
        this._names = null;
        this._realNames = EMPTY_ARRAY;
    }

    NamedArguments.prototype.setup = function setup(stack, length, names, synthetic) {
        this.stack = stack;
        this.length = length;
        this._tag = null;
        this._references = null;
        if (synthetic) {
            this._names = names;
            this._realNames = EMPTY_ARRAY;
        } else {
            this._names = null;
            this._realNames = names;
        }
    };

    NamedArguments.prototype.has = function has(name) {
        return this.names.indexOf(name) !== -1;
    };

    NamedArguments.prototype.get = function get$$1(name) {
        var names = this.names,
            length = this.length;

        var idx = names.indexOf(name);
        if (idx === -1) {
            return UNDEFINED_REFERENCE;
        }
        // stack: pos1, pos2, pos3, named1, named2
        // start: 4 (top - 4)
        // namedDict: { named1: 1, named2: 0 };
        //
        // get('named1') === named1 === top - (start - 1)
        // get('named2') === named2 === top - start
        var fromTop = length - idx;
        return this.stack.fromTop(fromTop);
    };

    NamedArguments.prototype.capture = function capture() {
        return new CapturedNamedArguments(this.tag, this.names, this.references);
    };

    NamedArguments.prototype.sliceName = function sliceName(name) {
        return name.slice(1);
    };

    createClass(NamedArguments, [{
        key: 'tag',
        get: function get$$1() {
            return combineTagged(this.references);
        }
    }, {
        key: 'names',
        get: function get$$1() {
            var names = this._names;
            if (!names) {
                names = this._names = this._realNames.map(this.sliceName);
            }
            return names;
        }
    }, {
        key: 'references',
        get: function get$$1() {
            var references = this._references;
            if (!references) {
                var names = this.names,
                    length = this.length;

                references = this._references = [];
                for (var i = 0; i < length; i++) {
                    references[i] = this.get(names[i]);
                }
            }
            return references;
        }
    }]);
    return NamedArguments;
}();

var CapturedNamedArguments = function () {
    function CapturedNamedArguments(tag, names, references) {
        classCallCheck(this, CapturedNamedArguments);

        this.tag = tag;
        this.names = names;
        this.references = references;
        this.length = names.length;
        this._map = null;
    }

    CapturedNamedArguments.prototype.has = function has(name) {
        return this.names.indexOf(name) !== -1;
    };

    CapturedNamedArguments.prototype.get = function get$$1(name) {
        var names = this.names,
            references = this.references;

        var idx = names.indexOf(name);
        if (idx === -1) {
            return UNDEFINED_REFERENCE;
        } else {
            return references[idx];
        }
    };

    CapturedNamedArguments.prototype.value = function value() {
        var names = this.names,
            references = this.references;

        var out = dict();
        names.forEach(function (name, i) {
            return out[name] = references[i].value();
        });
        return out;
    };

    createClass(CapturedNamedArguments, [{
        key: 'map',
        get: function get$$1() {
            var map$$1 = this._map;
            if (!map$$1) {
                var names = this.names,
                    references = this.references;

                map$$1 = this._map = dict();
                names.forEach(function (name, i) {
                    return map$$1[name] = references[i];
                });
            }
            return map$$1;
        }
    }]);
    return CapturedNamedArguments;
}();

var ARGS = new Arguments();

APPEND_OPCODES.add(23 /* Text */, function (vm, _ref) {
    var text = _ref.op1;

    vm.elements().appendText(vm.constants.getString(text));
});
APPEND_OPCODES.add(24 /* Comment */, function (vm, _ref2) {
    var text = _ref2.op1;

    vm.elements().appendComment(vm.constants.getString(text));
});
APPEND_OPCODES.add(26 /* OpenElement */, function (vm, _ref3) {
    var tag = _ref3.op1;

    vm.elements().openElement(vm.constants.getString(tag));
});
APPEND_OPCODES.add(27 /* OpenElementWithOperations */, function (vm, _ref4) {
    var tag = _ref4.op1;

    var tagName = vm.constants.getString(tag);
    var operations = vm.stack.pop();
    vm.elements().openElement(tagName, operations);
});
APPEND_OPCODES.add(28 /* OpenDynamicElement */, function (vm) {
    var operations = vm.stack.pop();
    var tagName = vm.stack.pop().value();
    vm.elements().openElement(tagName, operations);
});
APPEND_OPCODES.add(35 /* PushRemoteElement */, function (vm) {
    var elementRef = vm.stack.pop();
    var nextSiblingRef = vm.stack.pop();
    var element = void 0;
    var nextSibling = void 0;
    if (isConst(elementRef)) {
        element = elementRef.value();
    } else {
        var cache = new ReferenceCache(elementRef);
        element = cache.peek();
        vm.updateWith(new Assert(cache));
    }
    if (isConst(nextSiblingRef)) {
        nextSibling = nextSiblingRef.value();
    } else {
        var _cache = new ReferenceCache(nextSiblingRef);
        nextSibling = _cache.peek();
        vm.updateWith(new Assert(_cache));
    }
    vm.elements().pushRemoteElement(element, nextSibling);
});
APPEND_OPCODES.add(36 /* PopRemoteElement */, function (vm) {
    return vm.elements().popRemoteElement();
});

var ClassList = function () {
    function ClassList() {
        classCallCheck(this, ClassList);

        this.list = null;
        this.isConst = true;
    }

    ClassList.prototype.append = function append(reference) {
        var list = this.list,
            isConst$$1 = this.isConst;

        if (list === null) list = this.list = [];
        list.push(reference);
        this.isConst = isConst$$1 && isConst(reference);
    };

    ClassList.prototype.toReference = function toReference() {
        var list = this.list,
            isConst$$1 = this.isConst;

        if (!list) return NULL_REFERENCE;
        if (isConst$$1) return PrimitiveReference.create(toClassName(list));
        return new ClassListReference(list);
    };

    return ClassList;
}();

var ClassListReference = function (_CachedReference) {
    inherits(ClassListReference, _CachedReference);

    function ClassListReference(list) {
        classCallCheck(this, ClassListReference);

        var _this = possibleConstructorReturn(this, _CachedReference.call(this));

        _this.list = [];
        _this.tag = combineTagged(list);
        _this.list = list;
        return _this;
    }

    ClassListReference.prototype.compute = function compute() {
        return toClassName(this.list);
    };

    return ClassListReference;
}(CachedReference);

function toClassName(list) {
    var ret = [];
    for (var i = 0; i < list.length; i++) {
        var value = list[i].value();
        if (value !== false && value !== null && value !== undefined) ret.push(value);
    }
    return ret.length === 0 ? null : ret.join(' ');
}
var SimpleElementOperations = function () {
    function SimpleElementOperations(env) {
        classCallCheck(this, SimpleElementOperations);

        this.env = env;
        this.opcodes = null;
        this.classList = null;
    }

    SimpleElementOperations.prototype.addStaticAttribute = function addStaticAttribute(element, name, value) {
        if (name === 'class') {
            this.addClass(PrimitiveReference.create(value));
        } else {
            this.env.getAppendOperations().setAttribute(element, name, value);
        }
    };

    SimpleElementOperations.prototype.addStaticAttributeNS = function addStaticAttributeNS(element, namespace, name, value) {
        this.env.getAppendOperations().setAttribute(element, name, value, namespace);
    };

    SimpleElementOperations.prototype.addDynamicAttribute = function addDynamicAttribute(element, name, reference, isTrusting) {
        if (name === 'class') {
            this.addClass(reference);
        } else {
            var attributeManager = this.env.attributeFor(element, name, isTrusting);
            var attribute = new DynamicAttribute(element, attributeManager, name, reference);
            this.addAttribute(attribute);
        }
    };

    SimpleElementOperations.prototype.addDynamicAttributeNS = function addDynamicAttributeNS(element, namespace, name, reference, isTrusting) {
        var attributeManager = this.env.attributeFor(element, name, isTrusting, namespace);
        var nsAttribute = new DynamicAttribute(element, attributeManager, name, reference, namespace);
        this.addAttribute(nsAttribute);
    };

    SimpleElementOperations.prototype.flush = function flush(element, vm) {
        var env = vm.env;
        var opcodes = this.opcodes,
            classList = this.classList;

        for (var i = 0; opcodes && i < opcodes.length; i++) {
            vm.updateWith(opcodes[i]);
        }
        if (classList) {
            var attributeManager = env.attributeFor(element, 'class', false);
            var attribute = new DynamicAttribute(element, attributeManager, 'class', classList.toReference());
            var opcode = attribute.flush(env);
            if (opcode) {
                vm.updateWith(opcode);
            }
        }
        this.opcodes = null;
        this.classList = null;
    };

    SimpleElementOperations.prototype.addClass = function addClass(reference) {
        var classList = this.classList;

        if (!classList) {
            classList = this.classList = new ClassList();
        }
        classList.append(reference);
    };

    SimpleElementOperations.prototype.addAttribute = function addAttribute(attribute) {
        var opcode = attribute.flush(this.env);
        if (opcode) {
            var opcodes = this.opcodes;

            if (!opcodes) {
                opcodes = this.opcodes = [];
            }
            opcodes.push(opcode);
        }
    };

    return SimpleElementOperations;
}();
var ComponentElementOperations = function () {
    function ComponentElementOperations(env) {
        classCallCheck(this, ComponentElementOperations);

        this.env = env;
        this.attributeNames = null;
        this.attributes = null;
        this.classList = null;
    }

    ComponentElementOperations.prototype.addStaticAttribute = function addStaticAttribute(element, name, value) {
        if (name === 'class') {
            this.addClass(PrimitiveReference.create(value));
        } else if (this.shouldAddAttribute(name)) {
            this.addAttribute(name, new StaticAttribute(element, name, value));
        }
    };

    ComponentElementOperations.prototype.addStaticAttributeNS = function addStaticAttributeNS(element, namespace, name, value) {
        if (this.shouldAddAttribute(name)) {
            this.addAttribute(name, new StaticAttribute(element, name, value, namespace));
        }
    };

    ComponentElementOperations.prototype.addDynamicAttribute = function addDynamicAttribute(element, name, reference, isTrusting) {
        if (name === 'class') {
            this.addClass(reference);
        } else if (this.shouldAddAttribute(name)) {
            var attributeManager = this.env.attributeFor(element, name, isTrusting);
            var attribute = new DynamicAttribute(element, attributeManager, name, reference);
            this.addAttribute(name, attribute);
        }
    };

    ComponentElementOperations.prototype.addDynamicAttributeNS = function addDynamicAttributeNS(element, namespace, name, reference, isTrusting) {
        if (this.shouldAddAttribute(name)) {
            var attributeManager = this.env.attributeFor(element, name, isTrusting, namespace);
            var nsAttribute = new DynamicAttribute(element, attributeManager, name, reference, namespace);
            this.addAttribute(name, nsAttribute);
        }
    };

    ComponentElementOperations.prototype.flush = function flush(element, vm) {
        var env = this.env;
        var attributes = this.attributes,
            classList = this.classList;

        for (var i = 0; attributes && i < attributes.length; i++) {
            var opcode = attributes[i].flush(env);
            if (opcode) {
                vm.updateWith(opcode);
            }
        }
        if (classList) {
            var attributeManager = env.attributeFor(element, 'class', false);
            var attribute = new DynamicAttribute(element, attributeManager, 'class', classList.toReference());
            var _opcode = attribute.flush(env);
            if (_opcode) {
                vm.updateWith(_opcode);
            }
        }
    };

    ComponentElementOperations.prototype.shouldAddAttribute = function shouldAddAttribute(name) {
        return !this.attributeNames || this.attributeNames.indexOf(name) === -1;
    };

    ComponentElementOperations.prototype.addClass = function addClass(reference) {
        var classList = this.classList;

        if (!classList) {
            classList = this.classList = new ClassList();
        }
        classList.append(reference);
    };

    ComponentElementOperations.prototype.addAttribute = function addAttribute(name, attribute) {
        var attributeNames = this.attributeNames,
            attributes = this.attributes;

        if (!attributeNames) {
            attributeNames = this.attributeNames = [];
            attributes = this.attributes = [];
        }
        attributeNames.push(name);
        unwrap(attributes).push(attribute);
    };

    return ComponentElementOperations;
}();
APPEND_OPCODES.add(32 /* FlushElement */, function (vm) {
    var stack = vm.elements();
    var action = 'FlushElementOpcode#evaluate';
    stack.expectOperations(action).flush(stack.expectConstructing(action), vm);
    stack.flushElement();
});
APPEND_OPCODES.add(33 /* CloseElement */, function (vm) {
    return vm.elements().closeElement();
});
APPEND_OPCODES.add(29 /* StaticAttr */, function (vm, _ref5) {
    var _name = _ref5.op1,
        _value = _ref5.op2,
        _namespace = _ref5.op3;

    var name = vm.constants.getString(_name);
    var value = vm.constants.getString(_value);
    if (_namespace) {
        var namespace = vm.constants.getString(_namespace);
        vm.elements().setStaticAttributeNS(namespace, name, value);
    } else {
        vm.elements().setStaticAttribute(name, value);
    }
});
APPEND_OPCODES.add(34 /* Modifier */, function (vm, _ref6) {
    var _manager = _ref6.op1;

    var manager = vm.constants.getOther(_manager);
    var stack = vm.stack;
    var args = stack.pop();
    var tag = args.tag;

    var _vm$elements = vm.elements(),
        element = _vm$elements.constructing,
        updateOperations = _vm$elements.updateOperations;

    var dynamicScope = vm.dynamicScope();
    var modifier = manager.create(element, args, dynamicScope, updateOperations);
    args.clear();
    vm.env.scheduleInstallModifier(modifier, manager);
    var destructor = manager.getDestructor(modifier);
    if (destructor) {
        vm.newDestroyable(destructor);
    }
    vm.updateWith(new UpdateModifierOpcode(tag, manager, modifier));
});
var UpdateModifierOpcode = function (_UpdatingOpcode) {
    inherits(UpdateModifierOpcode, _UpdatingOpcode);

    function UpdateModifierOpcode(tag, manager, modifier) {
        classCallCheck(this, UpdateModifierOpcode);

        var _this2 = possibleConstructorReturn(this, _UpdatingOpcode.call(this));

        _this2.tag = tag;
        _this2.manager = manager;
        _this2.modifier = modifier;
        _this2.type = "update-modifier";
        _this2.lastUpdated = tag.value();
        return _this2;
    }

    UpdateModifierOpcode.prototype.evaluate = function evaluate(vm) {
        var manager = this.manager,
            modifier = this.modifier,
            tag = this.tag,
            lastUpdated = this.lastUpdated;

        if (!tag.validate(lastUpdated)) {
            vm.env.scheduleUpdateModifier(modifier, manager);
            this.lastUpdated = tag.value();
        }
    };

    UpdateModifierOpcode.prototype.toJSON = function toJSON() {
        return {
            guid: this._guid,
            type: this.type
        };
    };

    return UpdateModifierOpcode;
}(UpdatingOpcode);
var StaticAttribute = function () {
    function StaticAttribute(element, name, value, namespace) {
        classCallCheck(this, StaticAttribute);

        this.element = element;
        this.name = name;
        this.value = value;
        this.namespace = namespace;
    }

    StaticAttribute.prototype.flush = function flush(env) {
        env.getAppendOperations().setAttribute(this.element, this.name, this.value, this.namespace);
        return null;
    };

    return StaticAttribute;
}();
var DynamicAttribute = function () {
    function DynamicAttribute(element, attributeManager, name, reference, namespace) {
        classCallCheck(this, DynamicAttribute);

        this.element = element;
        this.attributeManager = attributeManager;
        this.name = name;
        this.reference = reference;
        this.namespace = namespace;
        this.cache = null;
        this.tag = reference.tag;
    }

    DynamicAttribute.prototype.patch = function patch(env) {
        var element = this.element,
            cache = this.cache;

        var value = expect(cache, 'must patch after flush').revalidate();
        if (isModified(value)) {
            this.attributeManager.updateAttribute(env, element, value, this.namespace);
        }
    };

    DynamicAttribute.prototype.flush = function flush(env) {
        var reference = this.reference,
            element = this.element;

        if (isConst(reference)) {
            var value = reference.value();
            this.attributeManager.setAttribute(env, element, value, this.namespace);
            return null;
        } else {
            var cache = this.cache = new ReferenceCache(reference);
            var _value2 = cache.peek();
            this.attributeManager.setAttribute(env, element, _value2, this.namespace);
            return new PatchElementOpcode(this);
        }
    };

    DynamicAttribute.prototype.toJSON = function toJSON() {
        var element = this.element,
            namespace = this.namespace,
            name = this.name,
            cache = this.cache;

        var formattedElement = formatElement(element);
        var lastValue = expect(cache, 'must serialize after flush').peek();
        if (namespace) {
            return {
                element: formattedElement,
                type: 'attribute',
                namespace: namespace,
                name: name,
                lastValue: lastValue
            };
        }
        return {
            element: formattedElement,
            type: 'attribute',
            namespace: namespace === undefined ? null : namespace,
            name: name,
            lastValue: lastValue
        };
    };

    return DynamicAttribute;
}();
function formatElement(element) {
    return JSON.stringify('<' + element.tagName.toLowerCase() + ' />');
}
APPEND_OPCODES.add(31 /* DynamicAttrNS */, function (vm, _ref7) {
    var _name = _ref7.op1,
        _namespace = _ref7.op2,
        trusting = _ref7.op3;

    var name = vm.constants.getString(_name);
    var namespace = vm.constants.getString(_namespace);
    var reference = vm.stack.pop();
    vm.elements().setDynamicAttributeNS(namespace, name, reference, !!trusting);
});
APPEND_OPCODES.add(30 /* DynamicAttr */, function (vm, _ref8) {
    var _name = _ref8.op1,
        trusting = _ref8.op2;

    var name = vm.constants.getString(_name);
    var reference = vm.stack.pop();
    vm.elements().setDynamicAttribute(name, reference, !!trusting);
});
var PatchElementOpcode = function (_UpdatingOpcode2) {
    inherits(PatchElementOpcode, _UpdatingOpcode2);

    function PatchElementOpcode(operation) {
        classCallCheck(this, PatchElementOpcode);

        var _this3 = possibleConstructorReturn(this, _UpdatingOpcode2.call(this));

        _this3.type = "patch-element";
        _this3.tag = operation.tag;
        _this3.operation = operation;
        return _this3;
    }

    PatchElementOpcode.prototype.evaluate = function evaluate(vm) {
        this.operation.patch(vm.env);
    };

    PatchElementOpcode.prototype.toJSON = function toJSON() {
        var _guid = this._guid,
            type = this.type,
            operation = this.operation;

        return {
            guid: _guid,
            type: type,
            details: operation.toJSON()
        };
    };

    return PatchElementOpcode;
}(UpdatingOpcode);

APPEND_OPCODES.add(55 /* PushComponentManager */, function (vm, _ref) {
    var _definition = _ref.op1;

    var definition = vm.constants.getOther(_definition);
    var stack = vm.stack;
    stack.push(definition);
    stack.push(definition.manager);
});
APPEND_OPCODES.add(56 /* PushDynamicComponentManager */, function (vm) {
    var stack = vm.stack;
    var reference = stack.pop();
    var cache = isConst(reference) ? undefined : new ReferenceCache(reference);
    var definition = cache ? cache.peek() : reference.value();
    stack.push(definition);
    stack.push(definition.manager);
    if (cache) {
        vm.updateWith(new Assert(cache));
    }
});
APPEND_OPCODES.add(57 /* InitializeComponentState */, function (vm) {
    var stack = vm.stack;
    var manager = stack.pop();
    var definition = stack.pop();
    stack.push({ definition: definition, manager: manager, component: null });
});
APPEND_OPCODES.add(58 /* PushArgs */, function (vm, _ref2) {
    var positional = _ref2.op1,
        synthetic = _ref2.op2;

    var stack = vm.stack;
    ARGS.setup(stack, positional, !!synthetic);
    stack.push(ARGS);
});
APPEND_OPCODES.add(59 /* PrepareArgs */, function (vm, _ref3) {
    var _state = _ref3.op1;

    var stack = vm.stack;

    var _vm$fetchValue = vm.fetchValue(_state),
        definition = _vm$fetchValue.definition,
        manager = _vm$fetchValue.manager;

    var args = stack.pop();
    var preparedArgs = manager.prepareArgs(definition, args);
    if (preparedArgs) {
        args.clear();
        var positional = preparedArgs.positional,
            named = preparedArgs.named;

        var positionalCount = positional.length;
        for (var i = 0; i < positionalCount; i++) {
            stack.push(positional[i]);
        }
        var names = Object.keys(named);
        var namedCount = names.length;
        for (var _i = 0; _i < namedCount; _i++) {
            stack.push(named[names[_i]]);
        }
        stack.push(names);
        args.setup(stack, positionalCount, true);
    }
    stack.push(args);
});
APPEND_OPCODES.add(60 /* CreateComponent */, function (vm, _ref4) {
    var _vm$fetchValue2;

    var flags = _ref4.op1,
        _state = _ref4.op2;

    var definition = void 0,
        manager = void 0;
    var args = vm.stack.pop();
    var dynamicScope = vm.dynamicScope();
    var state = (_vm$fetchValue2 = vm.fetchValue(_state), definition = _vm$fetchValue2.definition, manager = _vm$fetchValue2.manager, _vm$fetchValue2);
    var hasDefaultBlock = flags & 1;
    var component = manager.create(vm.env, definition, args, dynamicScope, vm.getSelf(), !!hasDefaultBlock);
    state.component = component;
    vm.updateWith(new UpdateComponentOpcode(args.tag, definition.name, component, manager, dynamicScope));
});
APPEND_OPCODES.add(61 /* RegisterComponentDestructor */, function (vm, _ref5) {
    var _state = _ref5.op1;

    var _vm$fetchValue3 = vm.fetchValue(_state),
        manager = _vm$fetchValue3.manager,
        component = _vm$fetchValue3.component;

    var destructor = manager.getDestructor(component);
    if (destructor) vm.newDestroyable(destructor);
});
APPEND_OPCODES.add(65 /* BeginComponentTransaction */, function (vm) {
    vm.beginCacheGroup();
    vm.elements().pushSimpleBlock();
});
APPEND_OPCODES.add(62 /* PushComponentOperations */, function (vm) {
    vm.stack.push(new ComponentElementOperations(vm.env));
});
APPEND_OPCODES.add(67 /* DidCreateElement */, function (vm, _ref6) {
    var _state = _ref6.op1;

    var _vm$fetchValue4 = vm.fetchValue(_state),
        manager = _vm$fetchValue4.manager,
        component = _vm$fetchValue4.component;

    var action = 'DidCreateElementOpcode#evaluate';
    manager.didCreateElement(component, vm.elements().expectConstructing(action), vm.elements().expectOperations(action));
});
APPEND_OPCODES.add(63 /* GetComponentSelf */, function (vm, _ref7) {
    var _state = _ref7.op1;

    var state = vm.fetchValue(_state);
    vm.stack.push(state.manager.getSelf(state.component));
});
APPEND_OPCODES.add(64 /* GetComponentLayout */, function (vm, _ref8) {
    var _state = _ref8.op1;

    var _vm$fetchValue5 = vm.fetchValue(_state),
        manager = _vm$fetchValue5.manager,
        definition = _vm$fetchValue5.definition,
        component = _vm$fetchValue5.component;

    vm.stack.push(manager.layoutFor(definition, component, vm.env));
});
APPEND_OPCODES.add(68 /* DidRenderLayout */, function (vm, _ref9) {
    var _state = _ref9.op1;

    var _vm$fetchValue6 = vm.fetchValue(_state),
        manager = _vm$fetchValue6.manager,
        component = _vm$fetchValue6.component;

    var bounds = vm.elements().popBlock();
    manager.didRenderLayout(component, bounds);
    vm.env.didCreate(component, manager);
    vm.updateWith(new DidUpdateLayoutOpcode(manager, component, bounds));
});
APPEND_OPCODES.add(66 /* CommitComponentTransaction */, function (vm) {
    return vm.commitCacheGroup();
});
var UpdateComponentOpcode = function (_UpdatingOpcode) {
    inherits(UpdateComponentOpcode, _UpdatingOpcode);

    function UpdateComponentOpcode(tag, name, component, manager, dynamicScope) {
        classCallCheck(this, UpdateComponentOpcode);

        var _this = possibleConstructorReturn(this, _UpdatingOpcode.call(this));

        _this.name = name;
        _this.component = component;
        _this.manager = manager;
        _this.dynamicScope = dynamicScope;
        _this.type = "update-component";
        var componentTag = manager.getTag(component);
        if (componentTag) {
            _this.tag = combine([tag, componentTag]);
        } else {
            _this.tag = tag;
        }
        return _this;
    }

    UpdateComponentOpcode.prototype.evaluate = function evaluate(_vm) {
        var component = this.component,
            manager = this.manager,
            dynamicScope = this.dynamicScope;

        manager.update(component, dynamicScope);
    };

    UpdateComponentOpcode.prototype.toJSON = function toJSON() {
        return {
            guid: this._guid,
            type: this.type,
            args: [JSON.stringify(this.name)]
        };
    };

    return UpdateComponentOpcode;
}(UpdatingOpcode);
var DidUpdateLayoutOpcode = function (_UpdatingOpcode2) {
    inherits(DidUpdateLayoutOpcode, _UpdatingOpcode2);

    function DidUpdateLayoutOpcode(manager, component, bounds) {
        classCallCheck(this, DidUpdateLayoutOpcode);

        var _this2 = possibleConstructorReturn(this, _UpdatingOpcode2.call(this));

        _this2.manager = manager;
        _this2.component = component;
        _this2.bounds = bounds;
        _this2.type = "did-update-layout";
        _this2.tag = CONSTANT_TAG;
        return _this2;
    }

    DidUpdateLayoutOpcode.prototype.evaluate = function evaluate(vm) {
        var manager = this.manager,
            component = this.component,
            bounds = this.bounds;

        manager.didUpdateLayout(component, bounds);
        vm.env.didUpdate(component, manager);
    };

    return DidUpdateLayoutOpcode;
}(UpdatingOpcode);

var Cursor = function Cursor(element, nextSibling) {
    classCallCheck(this, Cursor);

    this.element = element;
    this.nextSibling = nextSibling;
};

var ConcreteBounds = function () {
    function ConcreteBounds(parentNode, first, last) {
        classCallCheck(this, ConcreteBounds);

        this.parentNode = parentNode;
        this.first = first;
        this.last = last;
    }

    ConcreteBounds.prototype.parentElement = function parentElement() {
        return this.parentNode;
    };

    ConcreteBounds.prototype.firstNode = function firstNode() {
        return this.first;
    };

    ConcreteBounds.prototype.lastNode = function lastNode() {
        return this.last;
    };

    return ConcreteBounds;
}();
var SingleNodeBounds = function () {
    function SingleNodeBounds(parentNode, node) {
        classCallCheck(this, SingleNodeBounds);

        this.parentNode = parentNode;
        this.node = node;
    }

    SingleNodeBounds.prototype.parentElement = function parentElement() {
        return this.parentNode;
    };

    SingleNodeBounds.prototype.firstNode = function firstNode() {
        return this.node;
    };

    SingleNodeBounds.prototype.lastNode = function lastNode() {
        return this.node;
    };

    return SingleNodeBounds;
}();

function single(parent, node) {
    return new SingleNodeBounds(parent, node);
}
function move(bounds, reference) {
    var parent = bounds.parentElement();
    var first = bounds.firstNode();
    var last = bounds.lastNode();
    var node = first;
    while (node) {
        var next = node.nextSibling;
        parent.insertBefore(node, reference);
        if (node === last) return next;
        node = next;
    }
    return null;
}
function clear(bounds) {
    var parent = bounds.parentElement();
    var first = bounds.firstNode();
    var last = bounds.lastNode();
    var node = first;
    while (node) {
        var next = node.nextSibling;
        parent.removeChild(node);
        if (node === last) return next;
        node = next;
    }
    return null;
}

function isSafeString(value) {
    return !!value && typeof value['toHTML'] === 'function';
}
function isNode(value) {
    return value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && typeof value['nodeType'] === 'number';
}
function isString(value) {
    return typeof value === 'string';
}

var Upsert = function Upsert(bounds$$1) {
    classCallCheck(this, Upsert);

    this.bounds = bounds$$1;
};

function cautiousInsert(dom, cursor, value) {
    if (isString(value)) {
        return TextUpsert.insert(dom, cursor, value);
    }
    if (isSafeString(value)) {
        return SafeStringUpsert.insert(dom, cursor, value);
    }
    if (isNode(value)) {
        return NodeUpsert.insert(dom, cursor, value);
    }
    throw unreachable();
}
function trustingInsert(dom, cursor, value) {
    if (isString(value)) {
        return HTMLUpsert.insert(dom, cursor, value);
    }
    if (isNode(value)) {
        return NodeUpsert.insert(dom, cursor, value);
    }
    throw unreachable();
}

var TextUpsert = function (_Upsert) {
    inherits(TextUpsert, _Upsert);

    TextUpsert.insert = function insert(dom, cursor, value) {
        var textNode = dom.createTextNode(value);
        dom.insertBefore(cursor.element, textNode, cursor.nextSibling);
        var bounds$$1 = new SingleNodeBounds(cursor.element, textNode);
        return new TextUpsert(bounds$$1, textNode);
    };

    function TextUpsert(bounds$$1, textNode) {
        classCallCheck(this, TextUpsert);

        var _this = possibleConstructorReturn(this, _Upsert.call(this, bounds$$1));

        _this.textNode = textNode;
        return _this;
    }

    TextUpsert.prototype.update = function update(_dom, value) {
        if (isString(value)) {
            var textNode = this.textNode;

            textNode.nodeValue = value;
            return true;
        } else {
            return false;
        }
    };

    return TextUpsert;
}(Upsert);

var HTMLUpsert = function (_Upsert2) {
    inherits(HTMLUpsert, _Upsert2);

    function HTMLUpsert() {
        classCallCheck(this, HTMLUpsert);
        return possibleConstructorReturn(this, _Upsert2.apply(this, arguments));
    }

    HTMLUpsert.insert = function insert(dom, cursor, value) {
        var bounds$$1 = dom.insertHTMLBefore(cursor.element, value, cursor.nextSibling);
        return new HTMLUpsert(bounds$$1);
    };

    HTMLUpsert.prototype.update = function update(dom, value) {
        if (isString(value)) {
            var bounds$$1 = this.bounds;

            var parentElement = bounds$$1.parentElement();
            var nextSibling = clear(bounds$$1);
            this.bounds = dom.insertHTMLBefore(parentElement, nextSibling, value);
            return true;
        } else {
            return false;
        }
    };

    return HTMLUpsert;
}(Upsert);

var SafeStringUpsert = function (_Upsert3) {
    inherits(SafeStringUpsert, _Upsert3);

    function SafeStringUpsert(bounds$$1, lastStringValue) {
        classCallCheck(this, SafeStringUpsert);

        var _this3 = possibleConstructorReturn(this, _Upsert3.call(this, bounds$$1));

        _this3.lastStringValue = lastStringValue;
        return _this3;
    }

    SafeStringUpsert.insert = function insert(dom, cursor, value) {
        var stringValue = value.toHTML();
        var bounds$$1 = dom.insertHTMLBefore(cursor.element, stringValue, cursor.nextSibling);
        return new SafeStringUpsert(bounds$$1, stringValue);
    };

    SafeStringUpsert.prototype.update = function update(dom, value) {
        if (isSafeString(value)) {
            var stringValue = value.toHTML();
            if (stringValue !== this.lastStringValue) {
                var bounds$$1 = this.bounds;

                var parentElement = bounds$$1.parentElement();
                var nextSibling = clear(bounds$$1);
                this.bounds = dom.insertHTMLBefore(parentElement, nextSibling, stringValue);
                this.lastStringValue = stringValue;
            }
            return true;
        } else {
            return false;
        }
    };

    return SafeStringUpsert;
}(Upsert);

var NodeUpsert = function (_Upsert4) {
    inherits(NodeUpsert, _Upsert4);

    function NodeUpsert() {
        classCallCheck(this, NodeUpsert);
        return possibleConstructorReturn(this, _Upsert4.apply(this, arguments));
    }

    NodeUpsert.insert = function insert(dom, cursor, node) {
        dom.insertBefore(cursor.element, node, cursor.nextSibling);
        return new NodeUpsert(single(cursor.element, node));
    };

    NodeUpsert.prototype.update = function update(dom, value) {
        if (isNode(value)) {
            var bounds$$1 = this.bounds;

            var parentElement = bounds$$1.parentElement();
            var nextSibling = clear(bounds$$1);
            this.bounds = dom.insertNodeBefore(parentElement, value, nextSibling);
            return true;
        } else {
            return false;
        }
    };

    return NodeUpsert;
}(Upsert);

var COMPONENT_DEFINITION_BRAND = 'COMPONENT DEFINITION [id=e59c754e-61eb-4392-8c4a-2c0ac72bfcd4]';
function isComponentDefinition(obj) {
    return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj !== null && obj[COMPONENT_DEFINITION_BRAND];
}
var ComponentDefinition = function ComponentDefinition(name, manager, ComponentClass) {
    classCallCheck(this, ComponentDefinition);

    this[COMPONENT_DEFINITION_BRAND] = true;
    this.name = name;
    this.manager = manager;
    this.ComponentClass = ComponentClass;
};

var First = function () {
    function First(node) {
        classCallCheck(this, First);

        this.node = node;
    }

    First.prototype.firstNode = function firstNode() {
        return this.node;
    };

    return First;
}();

var Last = function () {
    function Last(node) {
        classCallCheck(this, Last);

        this.node = node;
    }

    Last.prototype.lastNode = function lastNode() {
        return this.node;
    };

    return Last;
}();

var Fragment = function () {
    function Fragment(bounds$$1) {
        classCallCheck(this, Fragment);

        this.bounds = bounds$$1;
    }

    Fragment.prototype.parentElement = function parentElement() {
        return this.bounds.parentElement();
    };

    Fragment.prototype.firstNode = function firstNode() {
        return this.bounds.firstNode();
    };

    Fragment.prototype.lastNode = function lastNode() {
        return this.bounds.lastNode();
    };

    Fragment.prototype.update = function update(bounds$$1) {
        this.bounds = bounds$$1;
    };

    return Fragment;
}();
var ElementStack = function () {
    function ElementStack(env, parentNode, nextSibling) {
        classCallCheck(this, ElementStack);

        this.constructing = null;
        this.operations = null;
        this.elementStack = new Stack();
        this.nextSiblingStack = new Stack();
        this.blockStack = new Stack();
        this.env = env;
        this.dom = env.getAppendOperations();
        this.updateOperations = env.getDOM();
        this.element = parentNode;
        this.nextSibling = nextSibling;
        this.defaultOperations = new SimpleElementOperations(env);
        this.pushSimpleBlock();
        this.elementStack.push(this.element);
        this.nextSiblingStack.push(this.nextSibling);
    }

    ElementStack.forInitialRender = function forInitialRender(env, parentNode, nextSibling) {
        return new ElementStack(env, parentNode, nextSibling);
    };

    ElementStack.resume = function resume(env, tracker, nextSibling) {
        var parentNode = tracker.parentElement();
        var stack = new ElementStack(env, parentNode, nextSibling);
        stack.pushBlockTracker(tracker);
        return stack;
    };

    ElementStack.prototype.expectConstructing = function expectConstructing(method) {
        return expect(this.constructing, method + ' should only be called while constructing an element');
    };

    ElementStack.prototype.expectOperations = function expectOperations(method) {
        return expect(this.operations, method + ' should only be called while constructing an element');
    };

    ElementStack.prototype.block = function block() {
        return expect(this.blockStack.current, "Expected a current block tracker");
    };

    ElementStack.prototype.popElement = function popElement() {
        var elementStack = this.elementStack,
            nextSiblingStack = this.nextSiblingStack;

        var topElement = elementStack.pop();
        nextSiblingStack.pop();
        // LOGGER.debug(`-> element stack ${this.elementStack.toArray().map(e => e.tagName).join(', ')}`);
        this.element = expect(elementStack.current, "can't pop past the last element");
        this.nextSibling = nextSiblingStack.current;
        return topElement;
    };

    ElementStack.prototype.pushSimpleBlock = function pushSimpleBlock() {
        var tracker = new SimpleBlockTracker(this.element);
        this.pushBlockTracker(tracker);
        return tracker;
    };

    ElementStack.prototype.pushUpdatableBlock = function pushUpdatableBlock() {
        var tracker = new UpdatableBlockTracker(this.element);
        this.pushBlockTracker(tracker);
        return tracker;
    };

    ElementStack.prototype.pushBlockTracker = function pushBlockTracker(tracker) {
        var isRemote = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        var current = this.blockStack.current;
        if (current !== null) {
            current.newDestroyable(tracker);
            if (!isRemote) {
                current.newBounds(tracker);
            }
        }
        this.blockStack.push(tracker);
        return tracker;
    };

    ElementStack.prototype.pushBlockList = function pushBlockList(list) {
        var tracker = new BlockListTracker(this.element, list);
        var current = this.blockStack.current;
        if (current !== null) {
            current.newDestroyable(tracker);
            current.newBounds(tracker);
        }
        this.blockStack.push(tracker);
        return tracker;
    };

    ElementStack.prototype.popBlock = function popBlock() {
        this.block().finalize(this);
        return expect(this.blockStack.pop(), "Expected popBlock to return a block");
    };

    ElementStack.prototype.openElement = function openElement(tag, _operations) {
        // workaround argument.length transpile of arg initializer
        var operations = _operations === undefined ? this.defaultOperations : _operations;
        var element = this.dom.createElement(tag, this.element);
        this.constructing = element;
        this.operations = operations;
        return element;
    };

    ElementStack.prototype.flushElement = function flushElement() {
        var parent = this.element;
        var element = expect(this.constructing, 'flushElement should only be called when constructing an element');
        this.dom.insertBefore(parent, element, this.nextSibling);
        this.constructing = null;
        this.operations = null;
        this.pushElement(element, null);
        this.block().openElement(element);
    };

    ElementStack.prototype.pushRemoteElement = function pushRemoteElement(element) {
        var nextSibling = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        this.pushElement(element, nextSibling);
        var tracker = new RemoteBlockTracker(element);
        this.pushBlockTracker(tracker, true);
    };

    ElementStack.prototype.popRemoteElement = function popRemoteElement() {
        this.popBlock();
        this.popElement();
    };

    ElementStack.prototype.pushElement = function pushElement(element, nextSibling) {
        this.element = element;
        this.elementStack.push(element);
        // LOGGER.debug(`-> element stack ${this.elementStack.toArray().map(e => e.tagName).join(', ')}`);
        this.nextSibling = nextSibling;
        this.nextSiblingStack.push(nextSibling);
    };

    ElementStack.prototype.newDestroyable = function newDestroyable(d) {
        this.block().newDestroyable(d);
    };

    ElementStack.prototype.newBounds = function newBounds(bounds$$1) {
        this.block().newBounds(bounds$$1);
    };

    ElementStack.prototype.appendText = function appendText(string) {
        var dom = this.dom;

        var text = dom.createTextNode(string);
        dom.insertBefore(this.element, text, this.nextSibling);
        this.block().newNode(text);
        return text;
    };

    ElementStack.prototype.appendComment = function appendComment(string) {
        var dom = this.dom;

        var comment = dom.createComment(string);
        dom.insertBefore(this.element, comment, this.nextSibling);
        this.block().newNode(comment);
        return comment;
    };

    ElementStack.prototype.setStaticAttribute = function setStaticAttribute(name, value) {
        this.expectOperations('setStaticAttribute').addStaticAttribute(this.expectConstructing('setStaticAttribute'), name, value);
    };

    ElementStack.prototype.setStaticAttributeNS = function setStaticAttributeNS(namespace, name, value) {
        this.expectOperations('setStaticAttributeNS').addStaticAttributeNS(this.expectConstructing('setStaticAttributeNS'), namespace, name, value);
    };

    ElementStack.prototype.setDynamicAttribute = function setDynamicAttribute(name, reference, isTrusting) {
        this.expectOperations('setDynamicAttribute').addDynamicAttribute(this.expectConstructing('setDynamicAttribute'), name, reference, isTrusting);
    };

    ElementStack.prototype.setDynamicAttributeNS = function setDynamicAttributeNS(namespace, name, reference, isTrusting) {
        this.expectOperations('setDynamicAttributeNS').addDynamicAttributeNS(this.expectConstructing('setDynamicAttributeNS'), namespace, name, reference, isTrusting);
    };

    ElementStack.prototype.closeElement = function closeElement() {
        this.block().closeElement();
        this.popElement();
    };

    return ElementStack;
}();
var SimpleBlockTracker = function () {
    function SimpleBlockTracker(parent) {
        classCallCheck(this, SimpleBlockTracker);

        this.parent = parent;
        this.first = null;
        this.last = null;
        this.destroyables = null;
        this.nesting = 0;
    }

    SimpleBlockTracker.prototype.destroy = function destroy() {
        var destroyables = this.destroyables;

        if (destroyables && destroyables.length) {
            for (var i = 0; i < destroyables.length; i++) {
                destroyables[i].destroy();
            }
        }
    };

    SimpleBlockTracker.prototype.parentElement = function parentElement() {
        return this.parent;
    };

    SimpleBlockTracker.prototype.firstNode = function firstNode() {
        return this.first && this.first.firstNode();
    };

    SimpleBlockTracker.prototype.lastNode = function lastNode() {
        return this.last && this.last.lastNode();
    };

    SimpleBlockTracker.prototype.openElement = function openElement(element) {
        this.newNode(element);
        this.nesting++;
    };

    SimpleBlockTracker.prototype.closeElement = function closeElement() {
        this.nesting--;
    };

    SimpleBlockTracker.prototype.newNode = function newNode(node) {
        if (this.nesting !== 0) return;
        if (!this.first) {
            this.first = new First(node);
        }
        this.last = new Last(node);
    };

    SimpleBlockTracker.prototype.newBounds = function newBounds(bounds$$1) {
        if (this.nesting !== 0) return;
        if (!this.first) {
            this.first = bounds$$1;
        }
        this.last = bounds$$1;
    };

    SimpleBlockTracker.prototype.newDestroyable = function newDestroyable(d) {
        this.destroyables = this.destroyables || [];
        this.destroyables.push(d);
    };

    SimpleBlockTracker.prototype.finalize = function finalize(stack) {
        if (!this.first) {
            stack.appendComment('');
        }
    };

    return SimpleBlockTracker;
}();

var RemoteBlockTracker = function (_SimpleBlockTracker) {
    inherits(RemoteBlockTracker, _SimpleBlockTracker);

    function RemoteBlockTracker() {
        classCallCheck(this, RemoteBlockTracker);
        return possibleConstructorReturn(this, _SimpleBlockTracker.apply(this, arguments));
    }

    RemoteBlockTracker.prototype.destroy = function destroy() {
        _SimpleBlockTracker.prototype.destroy.call(this);
        clear(this);
    };

    return RemoteBlockTracker;
}(SimpleBlockTracker);

var UpdatableBlockTracker = function (_SimpleBlockTracker2) {
    inherits(UpdatableBlockTracker, _SimpleBlockTracker2);

    function UpdatableBlockTracker() {
        classCallCheck(this, UpdatableBlockTracker);
        return possibleConstructorReturn(this, _SimpleBlockTracker2.apply(this, arguments));
    }

    UpdatableBlockTracker.prototype.reset = function reset(env) {
        var destroyables = this.destroyables;

        if (destroyables && destroyables.length) {
            for (var i = 0; i < destroyables.length; i++) {
                env.didDestroy(destroyables[i]);
            }
        }
        var nextSibling = clear(this);
        this.first = null;
        this.last = null;
        this.destroyables = null;
        this.nesting = 0;
        return nextSibling;
    };

    return UpdatableBlockTracker;
}(SimpleBlockTracker);

var BlockListTracker = function () {
    function BlockListTracker(parent, boundList) {
        classCallCheck(this, BlockListTracker);

        this.parent = parent;
        this.boundList = boundList;
        this.parent = parent;
        this.boundList = boundList;
    }

    BlockListTracker.prototype.destroy = function destroy() {
        this.boundList.forEachNode(function (node) {
            return node.destroy();
        });
    };

    BlockListTracker.prototype.parentElement = function parentElement() {
        return this.parent;
    };

    BlockListTracker.prototype.firstNode = function firstNode() {
        var head = this.boundList.head();
        return head && head.firstNode();
    };

    BlockListTracker.prototype.lastNode = function lastNode() {
        var tail = this.boundList.tail();
        return tail && tail.lastNode();
    };

    BlockListTracker.prototype.openElement = function openElement(_element) {
        debugAssert(false, 'Cannot openElement directly inside a block list');
    };

    BlockListTracker.prototype.closeElement = function closeElement() {
        debugAssert(false, 'Cannot closeElement directly inside a block list');
    };

    BlockListTracker.prototype.newNode = function newNode(_node) {
        debugAssert(false, 'Cannot create a new node directly inside a block list');
    };

    BlockListTracker.prototype.newBounds = function newBounds(_bounds) {};

    BlockListTracker.prototype.newDestroyable = function newDestroyable(_d) {};

    BlockListTracker.prototype.finalize = function finalize(_stack) {};

    return BlockListTracker;
}();

APPEND_OPCODES.add(25 /* DynamicContent */, function (vm, _ref) {
    var append = _ref.op1;

    var opcode = vm.constants.getOther(append);
    opcode.evaluate(vm);
});
function isEmpty(value) {
    return value === null || value === undefined || typeof value['toString'] !== 'function';
}
function normalizeTextValue(value) {
    if (isEmpty(value)) {
        return '';
    }
    return String(value);
}
function normalizeTrustedValue(value) {
    if (isEmpty(value)) {
        return '';
    }
    if (isString(value)) {
        return value;
    }
    if (isSafeString(value)) {
        return value.toHTML();
    }
    if (isNode(value)) {
        return value;
    }
    return String(value);
}
function normalizeValue(value) {
    if (isEmpty(value)) {
        return '';
    }
    if (isString(value)) {
        return value;
    }
    if (isSafeString(value) || isNode(value)) {
        return value;
    }
    return String(value);
}
var AppendDynamicOpcode = function () {
    function AppendDynamicOpcode() {
        classCallCheck(this, AppendDynamicOpcode);
    }

    AppendDynamicOpcode.prototype.evaluate = function evaluate(vm) {
        var reference = vm.stack.pop();
        var normalized = this.normalize(reference);
        var value = void 0,
            cache = void 0;
        if (isConst(reference)) {
            value = normalized.value();
        } else {
            cache = new ReferenceCache(normalized);
            value = cache.peek();
        }
        var stack = vm.elements();
        var upsert = this.insert(vm.env.getAppendOperations(), stack, value);
        var bounds$$1 = new Fragment(upsert.bounds);
        stack.newBounds(bounds$$1);
        if (cache /* i.e. !isConst(reference) */) {
                vm.updateWith(this.updateWith(vm, reference, cache, bounds$$1, upsert));
            }
    };

    return AppendDynamicOpcode;
}();
var IsComponentDefinitionReference = function (_ConditionalReference) {
    inherits(IsComponentDefinitionReference, _ConditionalReference);

    function IsComponentDefinitionReference() {
        classCallCheck(this, IsComponentDefinitionReference);
        return possibleConstructorReturn(this, _ConditionalReference.apply(this, arguments));
    }

    IsComponentDefinitionReference.create = function create(inner) {
        return new IsComponentDefinitionReference(inner);
    };

    IsComponentDefinitionReference.prototype.toBool = function toBool(value) {
        return isComponentDefinition(value);
    };

    return IsComponentDefinitionReference;
}(ConditionalReference);

var UpdateOpcode = function (_UpdatingOpcode) {
    inherits(UpdateOpcode, _UpdatingOpcode);

    function UpdateOpcode(cache, bounds$$1, upsert) {
        classCallCheck(this, UpdateOpcode);

        var _this2 = possibleConstructorReturn(this, _UpdatingOpcode.call(this));

        _this2.cache = cache;
        _this2.bounds = bounds$$1;
        _this2.upsert = upsert;
        _this2.tag = cache.tag;
        return _this2;
    }

    UpdateOpcode.prototype.evaluate = function evaluate(vm) {
        var value = this.cache.revalidate();
        if (isModified(value)) {
            var bounds$$1 = this.bounds,
                upsert = this.upsert;
            var dom = vm.dom;

            if (!this.upsert.update(dom, value)) {
                var cursor = new Cursor(bounds$$1.parentElement(), clear(bounds$$1));
                upsert = this.upsert = this.insert(vm.env.getAppendOperations(), cursor, value);
            }
            bounds$$1.update(upsert.bounds);
        }
    };

    UpdateOpcode.prototype.toJSON = function toJSON() {
        var guid = this._guid,
            type = this.type,
            cache = this.cache;

        return {
            guid: guid,
            type: type,
            details: { lastValue: JSON.stringify(cache.peek()) }
        };
    };

    return UpdateOpcode;
}(UpdatingOpcode);

var OptimizedCautiousAppendOpcode = function (_AppendDynamicOpcode) {
    inherits(OptimizedCautiousAppendOpcode, _AppendDynamicOpcode);

    function OptimizedCautiousAppendOpcode() {
        classCallCheck(this, OptimizedCautiousAppendOpcode);

        var _this3 = possibleConstructorReturn(this, _AppendDynamicOpcode.apply(this, arguments));

        _this3.type = 'optimized-cautious-append';
        return _this3;
    }

    OptimizedCautiousAppendOpcode.prototype.normalize = function normalize(reference) {
        return map(reference, normalizeValue);
    };

    OptimizedCautiousAppendOpcode.prototype.insert = function insert(dom, cursor, value) {
        return cautiousInsert(dom, cursor, value);
    };

    OptimizedCautiousAppendOpcode.prototype.updateWith = function updateWith(_vm, _reference, cache, bounds$$1, upsert) {
        return new OptimizedCautiousUpdateOpcode(cache, bounds$$1, upsert);
    };

    return OptimizedCautiousAppendOpcode;
}(AppendDynamicOpcode);

var OptimizedCautiousUpdateOpcode = function (_UpdateOpcode) {
    inherits(OptimizedCautiousUpdateOpcode, _UpdateOpcode);

    function OptimizedCautiousUpdateOpcode() {
        classCallCheck(this, OptimizedCautiousUpdateOpcode);

        var _this4 = possibleConstructorReturn(this, _UpdateOpcode.apply(this, arguments));

        _this4.type = 'optimized-cautious-update';
        return _this4;
    }

    OptimizedCautiousUpdateOpcode.prototype.insert = function insert(dom, cursor, value) {
        return cautiousInsert(dom, cursor, value);
    };

    return OptimizedCautiousUpdateOpcode;
}(UpdateOpcode);

var OptimizedTrustingAppendOpcode = function (_AppendDynamicOpcode2) {
    inherits(OptimizedTrustingAppendOpcode, _AppendDynamicOpcode2);

    function OptimizedTrustingAppendOpcode() {
        classCallCheck(this, OptimizedTrustingAppendOpcode);

        var _this5 = possibleConstructorReturn(this, _AppendDynamicOpcode2.apply(this, arguments));

        _this5.type = 'optimized-trusting-append';
        return _this5;
    }

    OptimizedTrustingAppendOpcode.prototype.normalize = function normalize(reference) {
        return map(reference, normalizeTrustedValue);
    };

    OptimizedTrustingAppendOpcode.prototype.insert = function insert(dom, cursor, value) {
        return trustingInsert(dom, cursor, value);
    };

    OptimizedTrustingAppendOpcode.prototype.updateWith = function updateWith(_vm, _reference, cache, bounds$$1, upsert) {
        return new OptimizedTrustingUpdateOpcode(cache, bounds$$1, upsert);
    };

    return OptimizedTrustingAppendOpcode;
}(AppendDynamicOpcode);

var OptimizedTrustingUpdateOpcode = function (_UpdateOpcode2) {
    inherits(OptimizedTrustingUpdateOpcode, _UpdateOpcode2);

    function OptimizedTrustingUpdateOpcode() {
        classCallCheck(this, OptimizedTrustingUpdateOpcode);

        var _this6 = possibleConstructorReturn(this, _UpdateOpcode2.apply(this, arguments));

        _this6.type = 'optimized-trusting-update';
        return _this6;
    }

    OptimizedTrustingUpdateOpcode.prototype.insert = function insert(dom, cursor, value) {
        return trustingInsert(dom, cursor, value);
    };

    return OptimizedTrustingUpdateOpcode;
}(UpdateOpcode);

function debugCallback(context, get$$1) {
    console.info('Use `context`, and `get(<path>)` to debug this template.');
    // for example...
    context === get$$1('this');
    debugger;
}
/* tslint:enable */
var callback = debugCallback;
// For testing purposes



var ScopeInspector = function () {
    function ScopeInspector(scope, symbols, evalInfo) {
        var _this = this;

        classCallCheck(this, ScopeInspector);

        this.scope = scope;
        this.locals = dict();
        evalInfo.forEach(function (slot) {
            var name = symbols[slot - 1];
            var ref = scope.getSymbol(slot);
            _this.locals[name] = ref;
        });
    }

    ScopeInspector.prototype.get = function get$$1(path) {
        var scope = this.scope,
            locals = this.locals;

        var parts = path.split('.');

        var _path$split = path.split('.'),
            head = _path$split[0],
            tail = _path$split.slice(1);

        var evalScope = scope.getEvalScope();
        var ref = void 0;
        if (head === 'this') {
            ref = scope.getSelf();
        } else if (locals[head]) {
            ref = locals[head];
        } else if (head.indexOf('@') === 0 && evalScope[head]) {
            ref = evalScope[head];
        } else {
            ref = this.scope.getSelf();
            tail = parts;
        }
        return tail.reduce(function (ref, part) {
            return ref.get(part);
        }, ref);
    };

    return ScopeInspector;
}();

APPEND_OPCODES.add(71 /* Debugger */, function (vm, _ref) {
    var _symbols = _ref.op1,
        _evalInfo = _ref.op2;

    var symbols = vm.constants.getOther(_symbols);
    var evalInfo = vm.constants.getArray(_evalInfo);
    var inspector = new ScopeInspector(vm.scope(), symbols, evalInfo);
    callback(vm.getSelf().value(), function (path) {
        return inspector.get(path).value();
    });
});

APPEND_OPCODES.add(69 /* GetPartialTemplate */, function (vm) {
    var stack = vm.stack;
    var definition = stack.pop();
    stack.push(definition.value().template.asPartial());
});

var IterablePresenceReference = function () {
    function IterablePresenceReference(artifacts) {
        classCallCheck(this, IterablePresenceReference);

        this.tag = artifacts.tag;
        this.artifacts = artifacts;
    }

    IterablePresenceReference.prototype.value = function value() {
        return !this.artifacts.isEmpty();
    };

    return IterablePresenceReference;
}();

APPEND_OPCODES.add(53 /* PutIterator */, function (vm) {
    var stack = vm.stack;
    var listRef = stack.pop();
    var key = stack.pop();
    var iterable = vm.env.iterableFor(listRef, key.value());
    var iterator = new ReferenceIterator(iterable);
    stack.push(iterator);
    stack.push(new IterablePresenceReference(iterator.artifacts));
});
APPEND_OPCODES.add(51 /* EnterList */, function (vm, _ref) {
    var start = _ref.op1;

    vm.enterList(start);
});
APPEND_OPCODES.add(52 /* ExitList */, function (vm) {
    return vm.exitList();
});
APPEND_OPCODES.add(54 /* Iterate */, function (vm, _ref2) {
    var breaks = _ref2.op1;

    var stack = vm.stack;
    var item = stack.peek().next();
    if (item) {
        var tryOpcode = vm.iterate(item.memo, item.value);
        vm.enterItem(item.key, tryOpcode);
    } else {
        vm.goto(breaks);
    }
});

var Opcodes;
(function (Opcodes) {
    // Statements
    Opcodes[Opcodes["Text"] = 0] = "Text";
    Opcodes[Opcodes["Append"] = 1] = "Append";
    Opcodes[Opcodes["Comment"] = 2] = "Comment";
    Opcodes[Opcodes["Modifier"] = 3] = "Modifier";
    Opcodes[Opcodes["Block"] = 4] = "Block";
    Opcodes[Opcodes["Component"] = 5] = "Component";
    Opcodes[Opcodes["OpenElement"] = 6] = "OpenElement";
    Opcodes[Opcodes["FlushElement"] = 7] = "FlushElement";
    Opcodes[Opcodes["CloseElement"] = 8] = "CloseElement";
    Opcodes[Opcodes["StaticAttr"] = 9] = "StaticAttr";
    Opcodes[Opcodes["DynamicAttr"] = 10] = "DynamicAttr";
    Opcodes[Opcodes["Yield"] = 11] = "Yield";
    Opcodes[Opcodes["Partial"] = 12] = "Partial";
    Opcodes[Opcodes["DynamicArg"] = 13] = "DynamicArg";
    Opcodes[Opcodes["StaticArg"] = 14] = "StaticArg";
    Opcodes[Opcodes["TrustingAttr"] = 15] = "TrustingAttr";
    Opcodes[Opcodes["Debugger"] = 16] = "Debugger";
    Opcodes[Opcodes["ClientSideStatement"] = 17] = "ClientSideStatement";
    // Expressions
    Opcodes[Opcodes["Unknown"] = 18] = "Unknown";
    Opcodes[Opcodes["Get"] = 19] = "Get";
    Opcodes[Opcodes["MaybeLocal"] = 20] = "MaybeLocal";
    Opcodes[Opcodes["FixThisBeforeWeMerge"] = 21] = "FixThisBeforeWeMerge";
    Opcodes[Opcodes["HasBlock"] = 22] = "HasBlock";
    Opcodes[Opcodes["HasBlockParams"] = 23] = "HasBlockParams";
    Opcodes[Opcodes["Undefined"] = 24] = "Undefined";
    Opcodes[Opcodes["Helper"] = 25] = "Helper";
    Opcodes[Opcodes["Concat"] = 26] = "Concat";
    Opcodes[Opcodes["ClientSideExpression"] = 27] = "ClientSideExpression";
})(Opcodes || (Opcodes = {}));

function is(variant) {
    return function (value) {
        return Array.isArray(value) && value[0] === variant;
    };
}
var Expressions;
(function (Expressions) {
    Expressions.isUnknown = is(Opcodes.Unknown);
    Expressions.isGet = is(Opcodes.Get);
    Expressions.isConcat = is(Opcodes.Concat);
    Expressions.isHelper = is(Opcodes.Helper);
    Expressions.isHasBlock = is(Opcodes.HasBlock);
    Expressions.isHasBlockParams = is(Opcodes.HasBlockParams);
    Expressions.isUndefined = is(Opcodes.Undefined);
    Expressions.isClientSide = is(Opcodes.ClientSideExpression);
    Expressions.isMaybeLocal = is(Opcodes.MaybeLocal);
    function isPrimitiveValue(value) {
        if (value === null) {
            return true;
        }
        return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object';
    }
    Expressions.isPrimitiveValue = isPrimitiveValue;
})(Expressions || (Expressions = {}));
var Statements;
(function (Statements) {
    Statements.isText = is(Opcodes.Text);
    Statements.isAppend = is(Opcodes.Append);
    Statements.isComment = is(Opcodes.Comment);
    Statements.isModifier = is(Opcodes.Modifier);
    Statements.isBlock = is(Opcodes.Block);
    Statements.isComponent = is(Opcodes.Component);
    Statements.isOpenElement = is(Opcodes.OpenElement);
    Statements.isFlushElement = is(Opcodes.FlushElement);
    Statements.isCloseElement = is(Opcodes.CloseElement);
    Statements.isStaticAttr = is(Opcodes.StaticAttr);
    Statements.isDynamicAttr = is(Opcodes.DynamicAttr);
    Statements.isYield = is(Opcodes.Yield);
    Statements.isPartial = is(Opcodes.Partial);
    Statements.isDynamicArg = is(Opcodes.DynamicArg);
    Statements.isStaticArg = is(Opcodes.StaticArg);
    Statements.isTrustingAttr = is(Opcodes.TrustingAttr);
    Statements.isDebugger = is(Opcodes.Debugger);
    Statements.isClientSide = is(Opcodes.ClientSideStatement);
    function isAttribute(val) {
        return val[0] === Opcodes.StaticAttr || val[0] === Opcodes.DynamicAttr || val[0] === Opcodes.TrustingAttr;
    }
    Statements.isAttribute = isAttribute;
    function isArgument(val) {
        return val[0] === Opcodes.StaticArg || val[0] === Opcodes.DynamicArg;
    }
    Statements.isArgument = isArgument;
    function isParameter(val) {
        return isAttribute(val) || isArgument(val);
    }
    Statements.isParameter = isParameter;
    function getParameterName(s) {
        return s[1];
    }
    Statements.getParameterName = getParameterName;
    function isInElementHead(val) {
        return isParameter(val) || Statements.isModifier(val) || Statements.isFlushElement(val);
    }
    Statements.isInElementHead = isInElementHead;
})(Statements || (Statements = {}));

var CompiledStaticTemplate = function CompiledStaticTemplate(start, end) {
    classCallCheck(this, CompiledStaticTemplate);

    this.start = start;
    this.end = end;
};
var CompiledDynamicTemplate = function CompiledDynamicTemplate(start, end, symbolTable) {
    classCallCheck(this, CompiledDynamicTemplate);

    this.start = start;
    this.end = end;
    this.symbolTable = symbolTable;
};

var Labels = function () {
    function Labels() {
        classCallCheck(this, Labels);

        this.labels = dict();
        this.targets = [];
    }

    Labels.prototype.label = function label(name, index) {
        this.labels[name] = index;
    };

    Labels.prototype.target = function target(at, Target, _target) {
        this.targets.push({ at: at, Target: Target, target: _target });
    };

    Labels.prototype.patch = function patch(opcodes) {
        for (var _iterator = this.targets, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
            var _ref;

            if (_isArray) {
                if (_i >= _iterator.length) break;
                _ref = _iterator[_i++];
            } else {
                _i = _iterator.next();
                if (_i.done) break;
                _ref = _i.value;
            }

            var _ref2 = _ref,
                at = _ref2.at,
                Target = _ref2.Target,
                target = _ref2.target;

            opcodes.set(at, Target, this.labels[target]);
        }
    };

    return Labels;
}();

var BasicOpcodeBuilder = function () {
    function BasicOpcodeBuilder(env, meta, program) {
        classCallCheck(this, BasicOpcodeBuilder);

        this.env = env;
        this.meta = meta;
        this.program = program;
        this.labelsStack = new Stack();
        this.constants = env.constants;
        this.start = program.next;
    }

    BasicOpcodeBuilder.prototype.upvars = function upvars(count) {
        return fillNulls(count);
    };

    BasicOpcodeBuilder.prototype.reserve = function reserve(name) {
        this.push(name, 0, 0, 0);
    };

    BasicOpcodeBuilder.prototype.push = function push(name) {
        var op1 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var op2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var op3 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

        return this.program.push(name, op1, op2, op3);
    };

    BasicOpcodeBuilder.prototype.finalize = function finalize() {
        return this.push(22 /* Return */);
    };
    // args


    BasicOpcodeBuilder.prototype.pushArgs = function pushArgs(positional, synthetic) {
        this.push(58 /* PushArgs */, positional, synthetic | 0);
    };
    // helpers


    BasicOpcodeBuilder.prototype.startLabels = function startLabels() {
        this.labelsStack.push(new Labels());
    };

    BasicOpcodeBuilder.prototype.stopLabels = function stopLabels() {
        var label = expect(this.labelsStack.pop(), 'unbalanced push and pop labels');
        label.patch(this.program);
    };
    // components


    BasicOpcodeBuilder.prototype.pushComponentManager = function pushComponentManager(definition) {
        this.push(55 /* PushComponentManager */, this.other(definition));
    };

    BasicOpcodeBuilder.prototype.pushDynamicComponentManager = function pushDynamicComponentManager() {
        this.push(56 /* PushDynamicComponentManager */);
    };

    BasicOpcodeBuilder.prototype.initializeComponentState = function initializeComponentState() {
        this.push(57 /* InitializeComponentState */);
    };

    BasicOpcodeBuilder.prototype.prepareArgs = function prepareArgs(state) {
        this.push(59 /* PrepareArgs */, state);
    };

    BasicOpcodeBuilder.prototype.createComponent = function createComponent(state, hasDefault, hasInverse) {
        var flag = hasDefault | 0 | (hasInverse | 0) << 1;
        this.push(60 /* CreateComponent */, flag, state);
    };

    BasicOpcodeBuilder.prototype.registerComponentDestructor = function registerComponentDestructor(state) {
        this.push(61 /* RegisterComponentDestructor */, state);
    };

    BasicOpcodeBuilder.prototype.beginComponentTransaction = function beginComponentTransaction() {
        this.push(65 /* BeginComponentTransaction */);
    };

    BasicOpcodeBuilder.prototype.commitComponentTransaction = function commitComponentTransaction() {
        this.push(66 /* CommitComponentTransaction */);
    };

    BasicOpcodeBuilder.prototype.pushComponentOperations = function pushComponentOperations() {
        this.push(62 /* PushComponentOperations */);
    };

    BasicOpcodeBuilder.prototype.getComponentSelf = function getComponentSelf(state) {
        this.push(63 /* GetComponentSelf */, state);
    };

    BasicOpcodeBuilder.prototype.getComponentLayout = function getComponentLayout(state) {
        this.push(64 /* GetComponentLayout */, state);
    };

    BasicOpcodeBuilder.prototype.didCreateElement = function didCreateElement(state) {
        this.push(67 /* DidCreateElement */, state);
    };

    BasicOpcodeBuilder.prototype.didRenderLayout = function didRenderLayout(state) {
        this.push(68 /* DidRenderLayout */, state);
    };
    // partial


    BasicOpcodeBuilder.prototype.getPartialTemplate = function getPartialTemplate() {
        this.push(69 /* GetPartialTemplate */);
    };

    BasicOpcodeBuilder.prototype.resolveMaybeLocal = function resolveMaybeLocal(name) {
        this.push(70 /* ResolveMaybeLocal */, this.string(name));
    };
    // debugger


    BasicOpcodeBuilder.prototype.debugger = function _debugger(symbols, evalInfo) {
        this.push(71 /* Debugger */, this.constants.other(symbols), this.constants.array(evalInfo));
    };
    // content


    BasicOpcodeBuilder.prototype.dynamicContent = function dynamicContent(Opcode) {
        this.push(25 /* DynamicContent */, this.other(Opcode));
    };

    BasicOpcodeBuilder.prototype.cautiousAppend = function cautiousAppend() {
        this.dynamicContent(new OptimizedCautiousAppendOpcode());
    };

    BasicOpcodeBuilder.prototype.trustingAppend = function trustingAppend() {
        this.dynamicContent(new OptimizedTrustingAppendOpcode());
    };
    // dom


    BasicOpcodeBuilder.prototype.text = function text(_text) {
        this.push(23 /* Text */, this.constants.string(_text));
    };

    BasicOpcodeBuilder.prototype.openPrimitiveElement = function openPrimitiveElement(tag) {
        this.push(26 /* OpenElement */, this.constants.string(tag));
    };

    BasicOpcodeBuilder.prototype.openElementWithOperations = function openElementWithOperations(tag) {
        this.push(27 /* OpenElementWithOperations */, this.constants.string(tag));
    };

    BasicOpcodeBuilder.prototype.openDynamicElement = function openDynamicElement() {
        this.push(28 /* OpenDynamicElement */);
    };

    BasicOpcodeBuilder.prototype.flushElement = function flushElement() {
        this.push(32 /* FlushElement */);
    };

    BasicOpcodeBuilder.prototype.closeElement = function closeElement() {
        this.push(33 /* CloseElement */);
    };

    BasicOpcodeBuilder.prototype.staticAttr = function staticAttr(_name, _namespace, _value) {
        var name = this.constants.string(_name);
        var namespace = _namespace ? this.constants.string(_namespace) : 0;
        var value = this.constants.string(_value);
        this.push(29 /* StaticAttr */, name, value, namespace);
    };

    BasicOpcodeBuilder.prototype.dynamicAttrNS = function dynamicAttrNS(_name, _namespace, trusting) {
        var name = this.constants.string(_name);
        var namespace = this.constants.string(_namespace);
        this.push(31 /* DynamicAttrNS */, name, namespace, trusting | 0);
    };

    BasicOpcodeBuilder.prototype.dynamicAttr = function dynamicAttr(_name, trusting) {
        var name = this.constants.string(_name);
        this.push(30 /* DynamicAttr */, name, trusting | 0);
    };

    BasicOpcodeBuilder.prototype.comment = function comment(_comment) {
        var comment = this.constants.string(_comment);
        this.push(24 /* Comment */, comment);
    };

    BasicOpcodeBuilder.prototype.modifier = function modifier(_definition) {
        this.push(34 /* Modifier */, this.other(_definition));
    };
    // lists


    BasicOpcodeBuilder.prototype.putIterator = function putIterator() {
        this.push(53 /* PutIterator */);
    };

    BasicOpcodeBuilder.prototype.enterList = function enterList(start) {
        this.reserve(51 /* EnterList */);
        this.labels.target(this.pos, 51 /* EnterList */, start);
    };

    BasicOpcodeBuilder.prototype.exitList = function exitList() {
        this.push(52 /* ExitList */);
    };

    BasicOpcodeBuilder.prototype.iterate = function iterate(breaks) {
        this.reserve(54 /* Iterate */);
        this.labels.target(this.pos, 54 /* Iterate */, breaks);
    };
    // expressions


    BasicOpcodeBuilder.prototype.setVariable = function setVariable(symbol) {
        this.push(4 /* SetVariable */, symbol);
    };

    BasicOpcodeBuilder.prototype.getVariable = function getVariable(symbol) {
        this.push(5 /* GetVariable */, symbol);
    };

    BasicOpcodeBuilder.prototype.getProperty = function getProperty(key) {
        this.push(6 /* GetProperty */, this.string(key));
    };

    BasicOpcodeBuilder.prototype.getBlock = function getBlock(symbol) {
        this.push(8 /* GetBlock */, symbol);
    };

    BasicOpcodeBuilder.prototype.hasBlock = function hasBlock(symbol) {
        this.push(9 /* HasBlock */, symbol);
    };

    BasicOpcodeBuilder.prototype.hasBlockParams = function hasBlockParams(symbol) {
        this.push(10 /* HasBlockParams */, symbol);
    };

    BasicOpcodeBuilder.prototype.concat = function concat(size) {
        this.push(11 /* Concat */, size);
    };

    BasicOpcodeBuilder.prototype.function = function _function(f) {
        this.push(2 /* Function */, this.func(f));
    };

    BasicOpcodeBuilder.prototype.load = function load(register) {
        this.push(17 /* Load */, register);
    };

    BasicOpcodeBuilder.prototype.fetch = function fetch(register) {
        this.push(18 /* Fetch */, register);
    };

    BasicOpcodeBuilder.prototype.dup = function dup() {
        var register = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Register.sp;
        var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        return this.push(15 /* Dup */, register, offset);
    };

    BasicOpcodeBuilder.prototype.pop = function pop() {
        var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

        return this.push(16 /* Pop */, count);
    };
    // vm


    BasicOpcodeBuilder.prototype.pushRemoteElement = function pushRemoteElement() {
        this.push(35 /* PushRemoteElement */);
    };

    BasicOpcodeBuilder.prototype.popRemoteElement = function popRemoteElement() {
        this.push(36 /* PopRemoteElement */);
    };

    BasicOpcodeBuilder.prototype.label = function label(name) {
        this.labels.label(name, this.nextPos);
    };

    BasicOpcodeBuilder.prototype.pushRootScope = function pushRootScope(symbols, bindCallerScope) {
        this.push(19 /* RootScope */, symbols, bindCallerScope | 0);
    };

    BasicOpcodeBuilder.prototype.pushChildScope = function pushChildScope() {
        this.push(20 /* ChildScope */);
    };

    BasicOpcodeBuilder.prototype.popScope = function popScope() {
        this.push(21 /* PopScope */);
    };

    BasicOpcodeBuilder.prototype.returnTo = function returnTo(label) {
        this.reserve(12 /* Immediate */);
        this.labels.target(this.pos, 12 /* Immediate */, label);
        this.load(Register.ra);
    };

    BasicOpcodeBuilder.prototype.pushDynamicScope = function pushDynamicScope() {
        this.push(38 /* PushDynamicScope */);
    };

    BasicOpcodeBuilder.prototype.popDynamicScope = function popDynamicScope() {
        this.push(39 /* PopDynamicScope */);
    };

    BasicOpcodeBuilder.prototype.pushImmediate = function pushImmediate(value) {
        this.push(13 /* Constant */, this.other(value));
    };

    BasicOpcodeBuilder.prototype.primitive = function primitive(_primitive) {
        var flag = 0;
        var primitive = void 0;
        switch (typeof _primitive === 'undefined' ? 'undefined' : _typeof(_primitive)) {
            case 'number':
                primitive = _primitive;
                break;
            case 'string':
                primitive = this.string(_primitive);
                flag = 1;
                break;
            case 'boolean':
                primitive = _primitive | 0;
                flag = 2;
                break;
            case 'object':
                // assume null
                primitive = 2;
                flag = 2;
                break;
            case 'undefined':
                primitive = 3;
                flag = 2;
                break;
            default:
                throw new Error('Invalid primitive passed to pushPrimitive');
        }
        this.push(14 /* PrimitiveReference */, flag << 30 | primitive);
    };

    BasicOpcodeBuilder.prototype.helper = function helper(func) {
        this.push(1 /* Helper */, this.func(func));
    };

    BasicOpcodeBuilder.prototype.pushBlock = function pushBlock(block) {
        this.push(7 /* PushBlock */, this.block(block));
    };

    BasicOpcodeBuilder.prototype.bindDynamicScope = function bindDynamicScope(_names) {
        this.push(37 /* BindDynamicScope */, this.names(_names));
    };

    BasicOpcodeBuilder.prototype.enter = function enter(args) {
        this.push(48 /* Enter */, args);
    };

    BasicOpcodeBuilder.prototype.exit = function exit() {
        this.push(49 /* Exit */);
    };

    BasicOpcodeBuilder.prototype.return = function _return() {
        this.push(22 /* Return */);
    };

    BasicOpcodeBuilder.prototype.pushFrame = function pushFrame() {
        this.push(46 /* PushFrame */);
    };

    BasicOpcodeBuilder.prototype.popFrame = function popFrame() {
        this.push(47 /* PopFrame */);
    };

    BasicOpcodeBuilder.prototype.compileDynamicBlock = function compileDynamicBlock() {
        this.push(40 /* CompileDynamicBlock */);
    };

    BasicOpcodeBuilder.prototype.invokeDynamic = function invokeDynamic(invoker) {
        this.push(42 /* InvokeDynamic */, this.other(invoker));
    };

    BasicOpcodeBuilder.prototype.invokeStatic = function invokeStatic(block) {
        var callerCount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var parameters = block.symbolTable.parameters;

        var calleeCount = parameters.length;
        var count = Math.min(callerCount, calleeCount);
        this.pushFrame();
        if (count) {
            this.pushChildScope();
            for (var i = 0; i < count; i++) {
                this.dup(Register.fp, callerCount - i);
                this.setVariable(parameters[i]);
            }
        }
        var _block = this.constants.block(block);
        this.push(41 /* InvokeStatic */, _block);
        if (count) {
            this.popScope();
        }
        this.popFrame();
    };

    BasicOpcodeBuilder.prototype.test = function test(testFunc) {
        var _func = void 0;
        if (testFunc === 'const') {
            _func = ConstTest;
        } else if (testFunc === 'simple') {
            _func = SimpleTest;
        } else if (testFunc === 'environment') {
            _func = EnvironmentTest;
        } else if (typeof testFunc === 'function') {
            _func = testFunc;
        } else {
            throw new Error('unreachable');
        }
        var func = this.constants.function(_func);
        this.push(50 /* Test */, func);
    };

    BasicOpcodeBuilder.prototype.jump = function jump(target) {
        this.reserve(43 /* Jump */);
        this.labels.target(this.pos, 43 /* Jump */, target);
    };

    BasicOpcodeBuilder.prototype.jumpIf = function jumpIf(target) {
        this.reserve(44 /* JumpIf */);
        this.labels.target(this.pos, 44 /* JumpIf */, target);
    };

    BasicOpcodeBuilder.prototype.jumpUnless = function jumpUnless(target) {
        this.reserve(45 /* JumpUnless */);
        this.labels.target(this.pos, 45 /* JumpUnless */, target);
    };

    BasicOpcodeBuilder.prototype.string = function string(_string) {
        return this.constants.string(_string);
    };

    BasicOpcodeBuilder.prototype.names = function names(_names) {
        var _this = this;

        var names = _names.map(function (n) {
            return _this.constants.string(n);
        });
        return this.constants.array(names);
    };

    BasicOpcodeBuilder.prototype.symbols = function symbols(_symbols) {
        return this.constants.array(_symbols);
    };

    BasicOpcodeBuilder.prototype.other = function other(value) {
        return this.constants.other(value);
    };

    BasicOpcodeBuilder.prototype.block = function block(_block2) {
        return _block2 ? this.constants.block(_block2) : 0;
    };

    BasicOpcodeBuilder.prototype.func = function func(_func2) {
        return this.constants.function(_func2);
    };

    createClass(BasicOpcodeBuilder, [{
        key: 'pos',
        get: function get$$1() {
            return this.program.current;
        }
    }, {
        key: 'nextPos',
        get: function get$$1() {
            return this.program.next;
        }
    }, {
        key: 'labels',
        get: function get$$1() {
            return expect(this.labelsStack.current, 'bug: not in a label stack');
        }
    }]);
    return BasicOpcodeBuilder;
}();

function isCompilableExpression(expr$$1) {
    return expr$$1 && typeof expr$$1['compile'] === 'function';
}

var OpcodeBuilder = function (_BasicOpcodeBuilder) {
    inherits(OpcodeBuilder, _BasicOpcodeBuilder);

    function OpcodeBuilder(env, meta) {
        var program = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : env.program;
        classCallCheck(this, OpcodeBuilder);

        var _this2 = possibleConstructorReturn(this, _BasicOpcodeBuilder.call(this, env, meta, program));

        _this2.component = new ComponentBuilder(_this2);
        return _this2;
    }

    OpcodeBuilder.prototype.compileArgs = function compileArgs(params, hash, synthetic) {
        var _this3 = this;

        var positional = 0;
        if (params) {
            params.forEach(function (p) {
                return expr(p, _this3);
            });
            positional = params.length;
        }
        var names = EMPTY_ARRAY;
        if (hash) {
            names = hash[0];
            hash[1].forEach(function (v) {
                return expr(v, _this3);
            });
        }
        this.pushImmediate(names);
        this.pushArgs(positional, synthetic);
    };

    OpcodeBuilder.prototype.compile = function compile(expr$$1) {
        if (isCompilableExpression(expr$$1)) {
            return expr$$1.compile(this);
        } else {
            return expr$$1;
        }
    };

    OpcodeBuilder.prototype.guardedAppend = function guardedAppend(expression, trusting) {
        this.startLabels();
        this.pushFrame();
        this.returnTo('END');
        expr(expression, this);
        this.dup();
        this.test(function (reference) {
            return IsComponentDefinitionReference.create(reference);
        });
        this.enter(2);
        this.jumpUnless('ELSE');
        this.pushDynamicComponentManager();
        this.invokeComponent(null, null, null, null, null);
        this.exit();
        this.return();
        this.label('ELSE');
        if (trusting) {
            this.trustingAppend();
        } else {
            this.cautiousAppend();
        }
        this.exit();
        this.return();
        this.label('END');
        this.popFrame();
        this.stopLabels();
    };

    OpcodeBuilder.prototype.guardedCautiousAppend = function guardedCautiousAppend(expression) {
        expr(expression, this);
        this.dynamicContent(new undefined());
    };

    OpcodeBuilder.prototype.guardedTrustingAppend = function guardedTrustingAppend(expression) {
        expr(expression, this);
        this.dynamicContent(new undefined());
    };

    OpcodeBuilder.prototype.invokeComponent = function invokeComponent(attrs, params, hash, block) {
        var inverse = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

        this.initializeComponentState();
        this.fetch(Register.s0);
        this.dup(Register.sp, 1);
        this.load(Register.s0);
        this.pushBlock(block);
        this.pushBlock(inverse);
        this.compileArgs(params, hash, false);
        this.prepareArgs(Register.s0);
        this.beginComponentTransaction();
        this.pushDynamicScope();
        this.createComponent(Register.s0, true, inverse === null);
        this.registerComponentDestructor(Register.s0);
        this.getComponentSelf(Register.s0);
        this.getComponentLayout(Register.s0);
        this.invokeDynamic(new InvokeDynamicLayout(attrs && attrs.scan()));
        this.popFrame();
        this.popScope();
        this.popDynamicScope();
        this.commitComponentTransaction();
        this.load(Register.s0);
    };

    OpcodeBuilder.prototype.template = function template(block) {
        if (!block) return null;
        return new RawInlineBlock(this.env, this.meta, block.statements, block.parameters);
    };

    return OpcodeBuilder;
}(BasicOpcodeBuilder);

var ComponentLayoutBuilder = function () {
    function ComponentLayoutBuilder(env) {
        classCallCheck(this, ComponentLayoutBuilder);

        this.env = env;
    }

    ComponentLayoutBuilder.prototype.wrapLayout = function wrapLayout(layout$$1) {
        this.inner = new WrappedBuilder(this.env, layout$$1);
    };

    ComponentLayoutBuilder.prototype.fromLayout = function fromLayout(layout$$1) {
        this.inner = new UnwrappedBuilder(this.env, layout$$1);
    };

    ComponentLayoutBuilder.prototype.compile = function compile() {
        return this.inner.compile();
    };

    createClass(ComponentLayoutBuilder, [{
        key: 'tag',
        get: function get$$1() {
            return this.inner.tag;
        }
    }, {
        key: 'attrs',
        get: function get$$1() {
            return this.inner.attrs;
        }
    }]);
    return ComponentLayoutBuilder;
}();

var WrappedBuilder = function () {
    function WrappedBuilder(env, layout$$1) {
        classCallCheck(this, WrappedBuilder);

        this.env = env;
        this.layout = layout$$1;
        this.tag = new ComponentTagBuilder();
        this.attrs = new ComponentAttrsBuilder();
    }

    WrappedBuilder.prototype.compile = function compile() {
        //========DYNAMIC
        //        PutValue(TagExpr)
        //        Test
        //        JumpUnless(BODY)
        //        OpenDynamicPrimitiveElement
        //        DidCreateElement
        //        ...attr statements...
        //        FlushElement
        // BODY:  Noop
        //        ...body statements...
        //        PutValue(TagExpr)
        //        Test
        //        JumpUnless(END)
        //        CloseElement
        // END:   Noop
        //        DidRenderLayout
        //        Exit
        //
        //========STATIC
        //        OpenPrimitiveElementOpcode
        //        DidCreateElement
        //        ...attr statements...
        //        FlushElement
        //        ...body statements...
        //        CloseElement
        //        DidRenderLayout
        //        Exit
        var env = this.env,
            layout$$1 = this.layout;

        var meta = { templateMeta: layout$$1.meta, symbols: layout$$1.symbols, asPartial: false };
        var dynamicTag = this.tag.getDynamic();
        var staticTag = this.tag.getStatic();
        var b = builder(env, meta);
        b.startLabels();
        if (dynamicTag) {
            b.fetch(Register.s1);
            expr(dynamicTag, b);
            b.dup();
            b.load(Register.s1);
            b.test('simple');
            b.jumpUnless('BODY');
            b.fetch(Register.s1);
            b.pushComponentOperations();
            b.openDynamicElement();
        } else if (staticTag) {
            b.pushComponentOperations();
            b.openElementWithOperations(staticTag);
        }
        if (dynamicTag || staticTag) {
            b.didCreateElement(Register.s0);
            var attrs = this.attrs['buffer'];
            for (var i = 0; i < attrs.length; i++) {
                compileStatement(attrs[i], b);
            }
            b.flushElement();
        }
        b.label('BODY');
        b.invokeStatic(layout$$1.asBlock());
        if (dynamicTag) {
            b.fetch(Register.s1);
            b.test('simple');
            b.jumpUnless('END');
            b.closeElement();
        } else if (staticTag) {
            b.closeElement();
        }
        b.label('END');
        b.didRenderLayout(Register.s0);
        if (dynamicTag) {
            b.load(Register.s1);
        }
        b.stopLabels();
        var start = b.start;
        var end = b.finalize();
        debugSlice(env, start, end);
        return new CompiledDynamicTemplate(start, end, {
            meta: meta,
            hasEval: layout$$1.hasEval,
            symbols: layout$$1.symbols.concat([ATTRS_BLOCK])
        });
    };

    return WrappedBuilder;
}();

var UnwrappedBuilder = function () {
    function UnwrappedBuilder(env, layout$$1) {
        classCallCheck(this, UnwrappedBuilder);

        this.env = env;
        this.layout = layout$$1;
        this.attrs = new ComponentAttrsBuilder();
    }

    UnwrappedBuilder.prototype.compile = function compile() {
        var env = this.env,
            layout$$1 = this.layout;

        return layout$$1.asLayout(this.attrs['buffer']).compileDynamic(env);
    };

    createClass(UnwrappedBuilder, [{
        key: 'tag',
        get: function get$$1() {
            throw new Error('BUG: Cannot call `tag` on an UnwrappedBuilder');
        }
    }]);
    return UnwrappedBuilder;
}();

var ComponentTagBuilder = function () {
    function ComponentTagBuilder() {
        classCallCheck(this, ComponentTagBuilder);

        this.isDynamic = null;
        this.isStatic = null;
        this.staticTagName = null;
        this.dynamicTagName = null;
    }

    ComponentTagBuilder.prototype.getDynamic = function getDynamic() {
        if (this.isDynamic) {
            return this.dynamicTagName;
        }
    };

    ComponentTagBuilder.prototype.getStatic = function getStatic() {
        if (this.isStatic) {
            return this.staticTagName;
        }
    };

    ComponentTagBuilder.prototype.static = function _static(tagName) {
        this.isStatic = true;
        this.staticTagName = tagName;
    };

    ComponentTagBuilder.prototype.dynamic = function dynamic(tagName) {
        this.isDynamic = true;
        this.dynamicTagName = [Opcodes.ClientSideExpression, ClientSide.Ops.FunctionExpression, tagName];
    };

    return ComponentTagBuilder;
}();

var ComponentAttrsBuilder = function () {
    function ComponentAttrsBuilder() {
        classCallCheck(this, ComponentAttrsBuilder);

        this.buffer = [];
    }

    ComponentAttrsBuilder.prototype.static = function _static(name, value) {
        this.buffer.push([Opcodes.StaticAttr, name, value, null]);
    };

    ComponentAttrsBuilder.prototype.dynamic = function dynamic(name, value) {
        this.buffer.push([Opcodes.DynamicAttr, name, [Opcodes.ClientSideExpression, ClientSide.Ops.FunctionExpression, value], null]);
    };

    return ComponentAttrsBuilder;
}();

var ComponentBuilder = function () {
    function ComponentBuilder(builder) {
        classCallCheck(this, ComponentBuilder);

        this.builder = builder;
        this.env = builder.env;
    }

    ComponentBuilder.prototype.static = function _static(definition, args) {
        var params = args[0],
            hash = args[1],
            _default = args[2],
            inverse = args[3];
        var builder = this.builder;

        builder.pushComponentManager(definition);
        builder.invokeComponent(null, params, hash, _default, inverse);
    };

    ComponentBuilder.prototype.dynamic = function dynamic(definitionArgs, getDefinition, args) {
        var params = args[0],
            hash = args[1],
            block = args[2],
            inverse = args[3];
        var builder = this.builder;

        if (!definitionArgs || definitionArgs.length === 0) {
            throw new Error("Dynamic syntax without an argument");
        }
        var meta = this.builder.meta.templateMeta;
        function helper(vm, args) {
            return getDefinition(vm, args, meta);
        }
        builder.startLabels();
        builder.pushFrame();
        builder.returnTo('END');
        builder.compileArgs(definitionArgs[0], definitionArgs[1], true);
        builder.helper(helper);
        builder.dup();
        builder.test('simple');
        builder.enter(2);
        builder.jumpUnless('ELSE');
        builder.pushDynamicComponentManager();
        builder.invokeComponent(null, params, hash, block, inverse);
        builder.label('ELSE');
        builder.exit();
        builder.return();
        builder.label('END');
        builder.popFrame();
        builder.stopLabels();
    };

    return ComponentBuilder;
}();
function builder(env, meta) {
    return new OpcodeBuilder(env, meta);
}

function compileStatement(statement, builder$$1) {
    STATEMENTS.compile(statement, builder$$1);
}
var CompilableTemplate = function () {
    function CompilableTemplate(statements, symbolTable) {
        classCallCheck(this, CompilableTemplate);

        this.statements = statements;
        this.symbolTable = symbolTable;
        this.compiledStatic = null;
        this.compiledDynamic = null;
    }

    CompilableTemplate.prototype.compileStatic = function compileStatic(env) {
        var compiledStatic = this.compiledStatic;

        if (!compiledStatic) {
            var _builder = compileStatements(this.statements, this.symbolTable.meta, env);
            var start = _builder.start;
            var end = _builder.finalize();
            debugSlice(env, start, end);
            compiledStatic = this.compiledStatic = new CompiledStaticTemplate(start, end);
        }
        return compiledStatic;
    };

    CompilableTemplate.prototype.compileDynamic = function compileDynamic(env) {
        var compiledDynamic = this.compiledDynamic;

        if (!compiledDynamic) {
            var staticBlock = this.compileStatic(env);
            compiledDynamic = new CompiledDynamicTemplate(staticBlock.start, staticBlock.end, this.symbolTable);
        }
        return compiledDynamic;
    };

    CompilableTemplate.prototype.toJSON = function toJSON() {
        return { GlimmerDebug: '<template>' };
    };

    return CompilableTemplate;
}();
function compileStatements(statements, meta, env) {
    var b = builder(env, meta);
    for (var _iterator = statements, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
            if (_i >= _iterator.length) break;
            _ref = _iterator[_i++];
        } else {
            _i = _iterator.next();
            if (_i.done) break;
            _ref = _i.value;
        }

        var statement = _ref;

        compileStatement(statement, b);
    }
    return b;
}
var ATTRS_BLOCK = '&attrs';
function layout(prelude, head, body, symbolTable) {
    var _prelude$pop = prelude.pop(),
        tag = _prelude$pop[1];

    prelude.push([Ops$1.ClientSideStatement, ClientSide.Ops.OpenComponentElement, tag]);
    prelude.push([Ops$1.ClientSideStatement, ClientSide.Ops.DidCreateElement]);
    var attrsSymbol = symbolTable.symbols.length + 1;
    symbolTable.symbols.push(ATTRS_BLOCK);
    var statements = prelude.concat([[Ops$1.Yield, attrsSymbol, EMPTY_ARRAY]]).concat(head).concat(body).concat([[Ops$1.ClientSideStatement, ClientSide.Ops.DidRenderLayout]]);
    return new CompilableTemplate(statements, symbolTable);
}

var Scanner = function () {
    function Scanner(block, env) {
        classCallCheck(this, Scanner);

        this.block = block;
        this.env = env;
    }

    Scanner.prototype.scanEntryPoint = function scanEntryPoint(meta) {
        var block = this.block,
            env = this.env;

        var statements = void 0;
        if (block.prelude && block.head) {
            statements = block.prelude.concat(block.head).concat(block.statements);
        } else {
            statements = block.statements;
        }
        return new RawProgram(env, meta, statements, block.symbols, block.hasEval).scan();
    };

    Scanner.prototype.scanBlock = function scanBlock(meta) {
        var block = this.block,
            env = this.env;

        var statements = void 0;
        if (block.prelude && block.head) {
            statements = block.prelude.concat(block.head).concat(block.statements);
        } else {
            statements = block.statements;
        }
        return new RawInlineBlock(env, meta, statements, EMPTY_ARRAY).scan();
    };

    Scanner.prototype.scanLayout = function scanLayout(meta, attrs) {
        var block = this.block;
        var symbols = block.symbols,
            hasEval = block.hasEval;

        if (!block.prelude || !block.head) {
            throw new Error('A layout must have a top-level element');
        }
        var symbolTable = { meta: meta, hasEval: hasEval, symbols: symbols };

        var _scanBlock = scanBlock({ statements: block.prelude, parameters: EMPTY_ARRAY }, meta, this.env),
            prelude = _scanBlock.statements;

        var _scanBlock2 = scanBlock({ statements: [].concat(attrs, block.head), parameters: EMPTY_ARRAY }, meta, this.env),
            head = _scanBlock2.statements;

        var _scanBlock3 = scanBlock({ statements: block.statements, parameters: EMPTY_ARRAY }, meta, this.env),
            body = _scanBlock3.statements;

        return layout(prelude, head, body, symbolTable);
    };

    return Scanner;
}();

function scanBlock(block, meta, env) {
    return new RawInlineBlock(env, meta, block.statements, EMPTY_ARRAY).scan();
}
var ClientSide;
(function (ClientSide) {
    var Ops$$1;
    (function (Ops$$1) {
        Ops$$1[Ops$$1["OpenComponentElement"] = 0] = "OpenComponentElement";
        Ops$$1[Ops$$1["DidCreateElement"] = 1] = "DidCreateElement";
        Ops$$1[Ops$$1["DidRenderLayout"] = 2] = "DidRenderLayout";
        Ops$$1[Ops$$1["OptimizedAppend"] = 3] = "OptimizedAppend";
        Ops$$1[Ops$$1["UnoptimizedAppend"] = 4] = "UnoptimizedAppend";
        Ops$$1[Ops$$1["StaticPartial"] = 5] = "StaticPartial";
        Ops$$1[Ops$$1["DynamicPartial"] = 6] = "DynamicPartial";
        Ops$$1[Ops$$1["NestedBlock"] = 7] = "NestedBlock";
        Ops$$1[Ops$$1["ScannedBlock"] = 8] = "ScannedBlock";
        Ops$$1[Ops$$1["FunctionExpression"] = 9] = "FunctionExpression";
    })(Ops$$1 = ClientSide.Ops || (ClientSide.Ops = {}));
    function is$$1(variant) {
        return function (value) {
            return value[0] === Opcodes.ClientSideExpression || value[0] === Opcodes.ClientSideStatement && value[1] === variant;
        };
    }
    ClientSide.is = is$$1;
})(ClientSide || (ClientSide = {}));
var Ops$1 = Opcodes;

var RawBlock = function () {
    function RawBlock(env, meta, statements) {
        classCallCheck(this, RawBlock);

        this.env = env;
        this.meta = meta;
        this.statements = statements;
    }

    RawBlock.prototype.scanStatements = function scanStatements() {
        var buffer = [];
        var statements = this.statements;
        for (var _iterator2 = statements, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
            var _ref2;

            if (_isArray2) {
                if (_i2 >= _iterator2.length) break;
                _ref2 = _iterator2[_i2++];
            } else {
                _i2 = _iterator2.next();
                if (_i2.done) break;
                _ref2 = _i2.value;
            }

            var statement = _ref2;

            buffer.push(statement);
        }
        return buffer;
    };

    RawBlock.prototype.child = function child(block) {
        if (!block) return null;
        return new RawInlineBlock(this.env, this.meta, block.statements, block.parameters);
    };

    return RawBlock;
}();
var RawInlineBlock = function (_RawBlock) {
    inherits(RawInlineBlock, _RawBlock);

    function RawInlineBlock(env, meta, statements, parameters) {
        classCallCheck(this, RawInlineBlock);

        var _this = possibleConstructorReturn(this, _RawBlock.call(this, env, meta, statements));

        _this.parameters = parameters;
        return _this;
    }

    RawInlineBlock.prototype.scan = function scan() {
        var statements = this.scanStatements();
        return new CompilableTemplate(statements, { parameters: this.parameters, meta: this.meta });
    };

    return RawInlineBlock;
}(RawBlock);
var RawProgram = function (_RawBlock2) {
    inherits(RawProgram, _RawBlock2);

    function RawProgram(env, meta, statements, symbols, hasEval) {
        classCallCheck(this, RawProgram);

        var _this2 = possibleConstructorReturn(this, _RawBlock2.call(this, env, meta, statements));

        _this2.symbols = symbols;
        _this2.hasEval = hasEval;
        return _this2;
    }

    RawProgram.prototype.scan = function scan() {
        var statements = this.scanStatements();
        return new CompilableTemplate(statements, { symbols: this.symbols, hasEval: this.hasEval, meta: this.meta });
    };

    return RawProgram;
}(RawBlock);

var Ops$$1 = Opcodes;
var Compilers = function () {
    function Compilers() {
        var offset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        classCallCheck(this, Compilers);

        this.offset = offset;
        this.names = dict();
        this.funcs = [];
    }

    Compilers.prototype.add = function add(name, func) {
        this.funcs.push(func);
        this.names[name] = this.funcs.length - 1;
    };

    Compilers.prototype.compile = function compile(sexp, builder) {
        var name = sexp[this.offset];
        var index = this.names[name];
        var func = this.funcs[index];
        debugAssert(!!func, 'expected an implementation for ' + (this.offset === 0 ? Ops$$1[sexp[0]] : ClientSide.Ops[sexp[1]]));
        func(sexp, builder);
    };

    return Compilers;
}();
var STATEMENTS = new Compilers();
var CLIENT_SIDE = new Compilers(1);
STATEMENTS.add(Ops$$1.Text, function (sexp, builder) {
    builder.text(sexp[1]);
});
STATEMENTS.add(Ops$$1.Comment, function (sexp, builder) {
    builder.comment(sexp[1]);
});
STATEMENTS.add(Ops$$1.CloseElement, function (_sexp, builder) {
    LOGGER.trace('close-element statement');
    builder.closeElement();
});
STATEMENTS.add(Ops$$1.FlushElement, function (_sexp, builder) {
    builder.flushElement();
});
STATEMENTS.add(Ops$$1.Modifier, function (sexp, builder) {
    var env = builder.env,
        meta = builder.meta;
    var name = sexp[1],
        params = sexp[2],
        hash = sexp[3];

    if (env.hasModifier(name, meta.templateMeta)) {
        builder.compileArgs(params, hash, true);
        builder.modifier(env.lookupModifier(name, meta.templateMeta));
    } else {
        throw new Error('Compile Error ' + name + ' is not a modifier: Helpers may not be used in the element form.');
    }
});
STATEMENTS.add(Ops$$1.StaticAttr, function (sexp, builder) {
    var name = sexp[1],
        value = sexp[2],
        namespace = sexp[3];

    builder.staticAttr(name, namespace, value);
});
STATEMENTS.add(Ops$$1.DynamicAttr, function (sexp, builder) {
    dynamicAttr(sexp, false, builder);
});
STATEMENTS.add(Ops$$1.TrustingAttr, function (sexp, builder) {
    dynamicAttr(sexp, true, builder);
});
function dynamicAttr(sexp, trusting, builder) {
    var name = sexp[1],
        value = sexp[2],
        namespace = sexp[3];

    expr(value, builder);
    if (namespace) {
        builder.dynamicAttrNS(name, namespace, trusting);
    } else {
        builder.dynamicAttr(name, trusting);
    }
}
STATEMENTS.add(Ops$$1.OpenElement, function (sexp, builder) {
    builder.openPrimitiveElement(sexp[1]);
});
CLIENT_SIDE.add(ClientSide.Ops.OpenComponentElement, function (sexp, builder) {
    builder.pushComponentOperations();
    builder.openElementWithOperations(sexp[2]);
});
CLIENT_SIDE.add(ClientSide.Ops.DidCreateElement, function (_sexp, builder) {
    builder.didCreateElement(Register.s0);
});
CLIENT_SIDE.add(ClientSide.Ops.DidRenderLayout, function (_sexp, builder) {
    builder.didRenderLayout(Register.s0);
});
STATEMENTS.add(Ops$$1.Append, function (sexp, builder) {
    var value = sexp[1],
        trusting = sexp[2];

    var _builder$env$macros = builder.env.macros(),
        inlines = _builder$env$macros.inlines;

    var returned = inlines.compile(sexp, builder) || value;
    if (returned === true) return;
    var isGet = E.isGet(value);
    var isMaybeLocal = E.isMaybeLocal(value);
    if (trusting) {
        builder.guardedAppend(value, true);
    } else {
        if (isGet || isMaybeLocal) {
            builder.guardedAppend(value, false);
        } else {
            expr(value, builder);
            builder.cautiousAppend();
        }
    }
});
// CLIENT_SIDE.add(ClientSide.Ops.UnoptimizedAppend, (sexp: ClientSide.UnoptimizedAppend, builder) => {
//   let [,, value, trustingMorph] = sexp;
//   let { inlines } = builder.env.macros();
//   let returned = inlines.compile(sexp, builder) || value;
//   if (returned === true) return;
//   if (trustingMorph) {
//     builder.guardedTrustingAppend(returned[1]);
//   } else {
//     builder.guardedCautiousAppend(returned[1]);
//   }
// });
STATEMENTS.add(Ops$$1.Block, function (sexp, builder) {
    var name = sexp[1],
        params = sexp[2],
        hash = sexp[3],
        _template = sexp[4],
        _inverse = sexp[5];

    var template = builder.template(_template);
    var inverse = builder.template(_inverse);
    var templateBlock = template && template.scan();
    var inverseBlock = inverse && inverse.scan();

    var _builder$env$macros2 = builder.env.macros(),
        blocks = _builder$env$macros2.blocks;

    blocks.compile(name, params, hash, templateBlock, inverseBlock, builder);
});
var InvokeDynamicLayout = function () {
    function InvokeDynamicLayout(attrs) {
        classCallCheck(this, InvokeDynamicLayout);

        this.attrs = attrs;
    }

    InvokeDynamicLayout.prototype.invoke = function invoke(vm, layout$$1) {
        var _layout$symbolTable = layout$$1.symbolTable,
            symbols = _layout$symbolTable.symbols,
            hasEval = _layout$symbolTable.hasEval;

        var stack = vm.stack;
        var scope = vm.pushRootScope(symbols.length + 1, true);
        scope.bindSelf(stack.pop());
        scope.bindBlock(symbols.indexOf(ATTRS_BLOCK) + 1, this.attrs);
        var lookup = null;
        var $eval = -1;
        if (hasEval) {
            $eval = symbols.indexOf('$eval') + 1;
            lookup = dict();
        }
        var callerNames = stack.pop();
        for (var i = callerNames.length - 1; i >= 0; i--) {
            var symbol = symbols.indexOf(callerNames[i]);
            var value = stack.pop();
            if (symbol !== -1) scope.bindSymbol(symbol + 1, value);
            if (hasEval) lookup[callerNames[i]] = value;
        }
        var inverseSymbol = symbols.indexOf('&inverse');
        var inverse = stack.pop();
        if (inverseSymbol !== -1) {
            scope.bindBlock(inverseSymbol + 1, inverse);
        }
        if (lookup) lookup['&inverse'] = inverse;
        var defaultSymbol = symbols.indexOf('&default');
        var defaultBlock = stack.pop();
        if (defaultSymbol !== -1) {
            scope.bindBlock(defaultSymbol + 1, defaultBlock);
        }
        if (lookup) lookup['&default'] = defaultBlock;
        if (lookup) scope.bindEvalScope(lookup);
        vm.pushFrame();
        vm.call(layout$$1.start);
    };

    InvokeDynamicLayout.prototype.toJSON = function toJSON() {
        return { GlimmerDebug: '<invoke-dynamic-layout>' };
    };

    return InvokeDynamicLayout;
}();
STATEMENTS.add(Ops$$1.Component, function (sexp, builder) {
    var tag = sexp[1],
        attrs = sexp[2],
        args = sexp[3],
        block = sexp[4];

    if (builder.env.hasComponentDefinition(tag, builder.meta.templateMeta)) {
        var child = builder.template(block);
        var attrsBlock = new RawInlineBlock(builder.env, builder.meta, attrs, EMPTY_ARRAY);
        var definition = builder.env.getComponentDefinition(tag, builder.meta.templateMeta);
        builder.pushComponentManager(definition);
        builder.invokeComponent(attrsBlock, null, args, child && child.scan());
    } else if (block && block.parameters.length) {
        throw new Error('Compile Error: Cannot find component ' + tag);
    } else {
        builder.openPrimitiveElement(tag);
        attrs.forEach(function (attr) {
            return STATEMENTS.compile(attr, builder);
        });
        builder.flushElement();
        if (block) block.statements.forEach(function (s) {
            return STATEMENTS.compile(s, builder);
        });
        builder.closeElement();
    }
});
var PartialInvoker = function () {
    function PartialInvoker(outerSymbols, evalInfo) {
        classCallCheck(this, PartialInvoker);

        this.outerSymbols = outerSymbols;
        this.evalInfo = evalInfo;
    }

    PartialInvoker.prototype.invoke = function invoke(vm, _partial) {
        var partial = unwrap(_partial);
        var partialSymbols = partial.symbolTable.symbols;
        var outerScope = vm.scope();
        var partialScope = vm.pushRootScope(partialSymbols.length, false);
        partialScope.bindCallerScope(outerScope.getCallerScope());
        partialScope.bindEvalScope(outerScope.getEvalScope());
        partialScope.bindSelf(outerScope.getSelf());
        var evalInfo = this.evalInfo,
            outerSymbols = this.outerSymbols;

        var locals = dict();
        evalInfo.forEach(function (slot) {
            var name = outerSymbols[slot - 1];
            var ref = outerScope.getSymbol(slot);
            locals[name] = ref;
        });
        var evalScope = outerScope.getEvalScope();
        partialSymbols.forEach(function (name, i) {
            var symbol = i + 1;
            var value = evalScope[name];
            if (value !== undefined) partialScope.bind(symbol, value);
        });
        partialScope.bindPartialMap(locals);
        vm.pushFrame();
        vm.call(partial.start);
    };

    return PartialInvoker;
}();
STATEMENTS.add(Ops$$1.Partial, function (sexp, builder) {
    var name = sexp[1],
        evalInfo = sexp[2];
    var _builder$meta = builder.meta,
        templateMeta = _builder$meta.templateMeta,
        symbols = _builder$meta.symbols;

    function helper(vm, args) {
        var env = vm.env;

        var nameRef = args.positional.at(0);
        return map(nameRef, function (name) {
            if (typeof name === 'string' && name) {
                if (!env.hasPartial(name, templateMeta)) {
                    throw new Error('Could not find a partial named "' + name + '"');
                }
                return env.lookupPartial(name, templateMeta);
            } else if (name) {
                throw new Error('Could not find a partial named "' + String(name) + '"');
            } else {
                return null;
            }
        });
    }
    builder.startLabels();
    builder.pushFrame();
    builder.returnTo('END');
    expr(name, builder);
    builder.pushImmediate(EMPTY_ARRAY);
    builder.pushArgs(1, true);
    builder.helper(helper);
    builder.dup();
    builder.test('simple');
    builder.enter(2);
    builder.jumpUnless('ELSE');
    builder.getPartialTemplate();
    builder.compileDynamicBlock();
    builder.invokeDynamic(new PartialInvoker(symbols, evalInfo));
    builder.popScope();
    builder.popFrame();
    builder.label('ELSE');
    builder.exit();
    builder.return();
    builder.label('END');
    builder.popFrame();
    builder.stopLabels();
});

var InvokeDynamicYield = function () {
    function InvokeDynamicYield(callerCount) {
        classCallCheck(this, InvokeDynamicYield);

        this.callerCount = callerCount;
    }

    InvokeDynamicYield.prototype.invoke = function invoke(vm, block) {
        var callerCount = this.callerCount;

        var stack = vm.stack;
        if (!block) {
            // To balance the pop{Frame,Scope}
            vm.pushFrame();
            vm.pushCallerScope();
            return;
        }
        var table = block.symbolTable;
        var locals = table.parameters; // always present in inline blocks
        var calleeCount = locals ? locals.length : 0;
        var count = Math.min(callerCount, calleeCount);
        vm.pushFrame();
        vm.pushCallerScope(calleeCount > 0);
        var scope = vm.scope();
        for (var i = 0; i < count; i++) {
            scope.bindSymbol(locals[i], stack.fromBase(callerCount - i));
        }
        vm.call(block.start);
    };

    InvokeDynamicYield.prototype.toJSON = function toJSON() {
        return { GlimmerDebug: '<invoke-dynamic-yield caller-count=' + this.callerCount + '>' };
    };

    return InvokeDynamicYield;
}();

STATEMENTS.add(Ops$$1.Yield, function (sexp, builder) {
    var to = sexp[1],
        params = sexp[2];

    var count = compileList(params, builder);
    builder.getBlock(to);
    builder.compileDynamicBlock();
    builder.invokeDynamic(new InvokeDynamicYield(count));
    builder.popScope();
    builder.popFrame();
    if (count) {
        builder.pop(count);
    }
});
STATEMENTS.add(Ops$$1.Debugger, function (sexp, builder) {
    var evalInfo = sexp[1];

    builder.debugger(builder.meta.symbols, evalInfo);
});
STATEMENTS.add(Ops$$1.ClientSideStatement, function (sexp, builder) {
    CLIENT_SIDE.compile(sexp, builder);
});
var EXPRESSIONS = new Compilers();
var CLIENT_SIDE_EXPRS = new Compilers(1);
var E = Expressions;
function expr(expression, builder) {
    if (Array.isArray(expression)) {
        EXPRESSIONS.compile(expression, builder);
    } else {
        builder.primitive(expression);
    }
}
EXPRESSIONS.add(Ops$$1.Unknown, function (sexp, builder) {
    var name = sexp[1];
    if (builder.env.hasHelper(name, builder.meta.templateMeta)) {
        EXPRESSIONS.compile([Ops$$1.Helper, name, EMPTY_ARRAY, null], builder);
    } else if (builder.meta.asPartial) {
        builder.resolveMaybeLocal(name);
    } else {
        builder.getVariable(0);
        builder.getProperty(name);
    }
});
EXPRESSIONS.add(Ops$$1.Concat, function (sexp, builder) {
    var parts = sexp[1];
    parts.forEach(function (p) {
        return expr(p, builder);
    });
    builder.concat(parts.length);
});
CLIENT_SIDE_EXPRS.add(ClientSide.Ops.FunctionExpression, function (sexp, builder) {
    builder.function(sexp[2]);
});
EXPRESSIONS.add(Ops$$1.Helper, function (sexp, builder) {
    var env = builder.env,
        meta = builder.meta;
    var name = sexp[1],
        params = sexp[2],
        hash = sexp[3];

    if (env.hasHelper(name, meta.templateMeta)) {
        builder.compileArgs(params, hash, true);
        builder.helper(env.lookupHelper(name, meta.templateMeta));
    } else {
        throw new Error('Compile Error: ' + name + ' is not a helper');
    }
});
EXPRESSIONS.add(Ops$$1.Get, function (sexp, builder) {
    var head = sexp[1],
        path = sexp[2];

    builder.getVariable(head);
    path.forEach(function (p) {
        return builder.getProperty(p);
    });
});
EXPRESSIONS.add(Ops$$1.MaybeLocal, function (sexp, builder) {
    var path = sexp[1];

    if (builder.meta.asPartial) {
        var head = path[0];
        path = path.slice(1);
        builder.resolveMaybeLocal(head);
    } else {
        builder.getVariable(0);
    }
    path.forEach(function (p) {
        return builder.getProperty(p);
    });
});
EXPRESSIONS.add(Ops$$1.Undefined, function (_sexp, builder) {
    return builder.primitive(undefined);
});
EXPRESSIONS.add(Ops$$1.HasBlock, function (sexp, builder) {
    builder.hasBlock(sexp[1]);
});
EXPRESSIONS.add(Ops$$1.HasBlockParams, function (sexp, builder) {
    builder.hasBlockParams(sexp[1]);
});
EXPRESSIONS.add(Ops$$1.ClientSideExpression, function (sexp, builder) {
    CLIENT_SIDE_EXPRS.compile(sexp, builder);
});
function compileList(params, builder) {
    if (!params) return 0;
    params.forEach(function (p) {
        return expr(p, builder);
    });
    return params.length;
}
var Blocks = function () {
    function Blocks() {
        classCallCheck(this, Blocks);

        this.names = dict();
        this.funcs = [];
    }

    Blocks.prototype.add = function add(name, func) {
        this.funcs.push(func);
        this.names[name] = this.funcs.length - 1;
    };

    Blocks.prototype.addMissing = function addMissing(func) {
        this.missing = func;
    };

    Blocks.prototype.compile = function compile(name, params, hash, template, inverse, builder) {
        var index = this.names[name];
        if (index === undefined) {
            debugAssert(!!this.missing, name + ' not found, and no catch-all block handler was registered');
            var func = this.missing;
            var handled = func(name, params, hash, template, inverse, builder);
            debugAssert(!!handled, name + ' not found, and the catch-all block handler didn\'t handle it');
        } else {
            var _func = this.funcs[index];
            _func(params, hash, template, inverse, builder);
        }
    };

    return Blocks;
}();
var BLOCKS = new Blocks();
var Inlines = function () {
    function Inlines() {
        classCallCheck(this, Inlines);

        this.names = dict();
        this.funcs = [];
    }

    Inlines.prototype.add = function add(name, func) {
        this.funcs.push(func);
        this.names[name] = this.funcs.length - 1;
    };

    Inlines.prototype.addMissing = function addMissing(func) {
        this.missing = func;
    };

    Inlines.prototype.compile = function compile(sexp, builder) {
        var value = sexp[1];
        // TODO: Fix this so that expression macros can return
        // things like components, so that {{component foo}}
        // is the same as {{(component foo)}}
        if (!Array.isArray(value)) return ['expr', value];
        var name = void 0;
        var params = void 0;
        var hash = void 0;
        if (value[0] === Ops$$1.Helper) {
            name = value[1];
            params = value[2];
            hash = value[3];
        } else if (value[0] === Ops$$1.Unknown) {
            name = value[1];
            params = hash = null;
        } else {
            return ['expr', value];
        }
        var index = this.names[name];
        if (index === undefined && this.missing) {
            var func = this.missing;
            var returned = func(name, params, hash, builder);
            return returned === false ? ['expr', value] : returned;
        } else if (index !== undefined) {
            var _func2 = this.funcs[index];
            var _returned = _func2(name, params, hash, builder);
            return _returned === false ? ['expr', value] : _returned;
        } else {
            return ['expr', value];
        }
    };

    return Inlines;
}();
var INLINES = new Inlines();
populateBuiltins(BLOCKS, INLINES);
function populateBuiltins() {
    var blocks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Blocks();
    var inlines = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Inlines();

    blocks.add('if', function (params, _hash, template, inverse, builder) {
        //        PutArgs
        //        Test(Environment)
        //        Enter(BEGIN, END)
        // BEGIN: Noop
        //        JumpUnless(ELSE)
        //        Evaluate(default)
        //        Jump(END)
        // ELSE:  Noop
        //        Evalulate(inverse)
        // END:   Noop
        //        Exit
        if (!params || params.length !== 1) {
            throw new Error('SYNTAX ERROR: #if requires a single argument');
        }
        builder.startLabels();
        builder.pushFrame();
        builder.returnTo('END');
        expr(params[0], builder);
        builder.test('environment');
        builder.enter(1);
        builder.jumpUnless('ELSE');
        builder.invokeStatic(unwrap(template));
        if (inverse) {
            builder.jump('EXIT');
            builder.label('ELSE');
            builder.invokeStatic(inverse);
            builder.label('EXIT');
            builder.exit();
            builder.return();
        } else {
            builder.label('ELSE');
            builder.exit();
            builder.return();
        }
        builder.label('END');
        builder.popFrame();
        builder.stopLabels();
    });
    blocks.add('unless', function (params, _hash, template, inverse, builder) {
        //        PutArgs
        //        Test(Environment)
        //        Enter(BEGIN, END)
        // BEGIN: Noop
        //        JumpUnless(ELSE)
        //        Evaluate(default)
        //        Jump(END)
        // ELSE:  Noop
        //        Evalulate(inverse)
        // END:   Noop
        //        Exit
        if (!params || params.length !== 1) {
            throw new Error('SYNTAX ERROR: #unless requires a single argument');
        }
        builder.startLabels();
        builder.pushFrame();
        builder.returnTo('END');
        expr(params[0], builder);
        builder.test('environment');
        builder.enter(1);
        builder.jumpIf('ELSE');
        builder.invokeStatic(unwrap(template));
        if (inverse) {
            builder.jump('EXIT');
            builder.label('ELSE');
            builder.invokeStatic(inverse);
            builder.label('EXIT');
            builder.exit();
            builder.return();
        } else {
            builder.label('ELSE');
            builder.exit();
            builder.return();
        }
        builder.label('END');
        builder.popFrame();
        builder.stopLabels();
    });
    blocks.add('with', function (params, _hash, template, inverse, builder) {
        //        PutArgs
        //        Test(Environment)
        //        Enter(BEGIN, END)
        // BEGIN: Noop
        //        JumpUnless(ELSE)
        //        Evaluate(default)
        //        Jump(END)
        // ELSE:  Noop
        //        Evalulate(inverse)
        // END:   Noop
        //        Exit
        if (!params || params.length !== 1) {
            throw new Error('SYNTAX ERROR: #with requires a single argument');
        }
        builder.startLabels();
        builder.pushFrame();
        builder.returnTo('END');
        expr(params[0], builder);
        builder.dup();
        builder.test('environment');
        builder.enter(2);
        builder.jumpUnless('ELSE');
        builder.invokeStatic(unwrap(template), 1);
        if (inverse) {
            builder.jump('EXIT');
            builder.label('ELSE');
            builder.invokeStatic(inverse);
            builder.label('EXIT');
            builder.exit();
            builder.return();
        } else {
            builder.label('ELSE');
            builder.exit();
            builder.return();
        }
        builder.label('END');
        builder.popFrame();
        builder.stopLabels();
    });
    blocks.add('each', function (params, hash, template, inverse, builder) {
        //         Enter(BEGIN, END)
        // BEGIN:  Noop
        //         PutArgs
        //         PutIterable
        //         JumpUnless(ELSE)
        //         EnterList(BEGIN2, END2)
        // ITER:   Noop
        //         NextIter(BREAK)
        // BEGIN2: Noop
        //         PushChildScope
        //         Evaluate(default)
        //         PopScope
        // END2:   Noop
        //         Exit
        //         Jump(ITER)
        // BREAK:  Noop
        //         ExitList
        //         Jump(END)
        // ELSE:   Noop
        //         Evalulate(inverse)
        // END:    Noop
        //         Exit
        builder.startLabels();
        builder.pushFrame();
        builder.returnTo('END');
        if (hash && hash[0][0] === 'key') {
            expr(hash[1][0], builder);
        } else {
            throw new Error('Compile error: #each without key');
        }
        expr(params[0], builder);
        builder.enter(2);
        builder.putIterator();
        builder.jumpUnless('ELSE');
        builder.pushFrame();
        builder.returnTo('ITER');
        builder.dup(Register.fp, 1);
        builder.enterList('BODY');
        builder.label('ITER');
        builder.iterate('BREAK');
        builder.label('BODY');
        builder.invokeStatic(unwrap(template), 2);
        builder.pop(2);
        builder.exit();
        builder.return();
        builder.label('BREAK');
        builder.exitList();
        builder.popFrame();
        if (inverse) {
            builder.jump('EXIT');
            builder.label('ELSE');
            builder.invokeStatic(inverse);
            builder.label('EXIT');
            builder.exit();
            builder.return();
        } else {
            builder.label('ELSE');
            builder.exit();
            builder.return();
        }
        builder.label('END');
        builder.popFrame();
        builder.stopLabels();
    });
    blocks.add('-in-element', function (params, hash, template, _inverse, builder) {
        if (!params || params.length !== 1) {
            throw new Error('SYNTAX ERROR: #-in-element requires a single argument');
        }
        builder.startLabels();
        builder.pushFrame();
        builder.returnTo('END');
        if (hash && hash[0].length) {
            var keys = hash[0],
                values = hash[1];

            if (keys.length === 1 && keys[0] === 'nextSibling') {
                expr(values[0], builder);
            } else {
                throw new Error('SYNTAX ERROR: #-in-element does not take a `' + keys[0] + '` option');
            }
        } else {
            expr(null, builder);
        }
        expr(params[0], builder);
        builder.dup();
        builder.test('simple');
        builder.enter(3);
        builder.jumpUnless('ELSE');
        builder.pushRemoteElement();
        builder.invokeStatic(unwrap(template));
        builder.popRemoteElement();
        builder.label('ELSE');
        builder.exit();
        builder.return();
        builder.label('END');
        builder.popFrame();
        builder.stopLabels();
    });
    blocks.add('-with-dynamic-vars', function (_params, hash, template, _inverse, builder) {
        if (hash) {
            var names = hash[0],
                expressions = hash[1];

            compileList(expressions, builder);
            builder.pushDynamicScope();
            builder.bindDynamicScope(names);
            builder.invokeStatic(unwrap(template));
            builder.popDynamicScope();
        } else {
            builder.invokeStatic(unwrap(template));
        }
    });
    return { blocks: blocks, inlines: inlines };
}

var Constants = function () {
    function Constants() {
        classCallCheck(this, Constants);

        // `0` means NULL
        this.references = [];
        this.strings = [];
        this.expressions = [];
        this.arrays = [];
        this.blocks = [];
        this.functions = [];
        this.others = [];
        this.NULL_REFERENCE = this.reference(NULL_REFERENCE);
        this.UNDEFINED_REFERENCE = this.reference(UNDEFINED_REFERENCE);
    }

    Constants.prototype.getReference = function getReference(value) {
        return this.references[value - 1];
    };

    Constants.prototype.reference = function reference(value) {
        var index = this.references.length;
        this.references.push(value);
        return index + 1;
    };

    Constants.prototype.getString = function getString(value) {
        return this.strings[value - 1];
    };

    Constants.prototype.string = function string(value) {
        var index = this.strings.length;
        this.strings.push(value);
        return index + 1;
    };

    Constants.prototype.getExpression = function getExpression(value) {
        return this.expressions[value - 1];
    };

    Constants.prototype.getArray = function getArray(value) {
        return this.arrays[value - 1];
    };

    Constants.prototype.getNames = function getNames(value) {
        var _this = this;

        return this.getArray(value).map(function (n) {
            return _this.getString(n);
        });
    };

    Constants.prototype.array = function array(values) {
        var index = this.arrays.length;
        this.arrays.push(values);
        return index + 1;
    };

    Constants.prototype.getBlock = function getBlock(value) {
        return this.blocks[value - 1];
    };

    Constants.prototype.block = function block(_block) {
        var index = this.blocks.length;
        this.blocks.push(_block);
        return index + 1;
    };

    Constants.prototype.getFunction = function getFunction(value) {
        return this.functions[value - 1];
    };

    Constants.prototype.function = function _function(f) {
        var index = this.functions.length;
        this.functions.push(f);
        return index + 1;
    };

    Constants.prototype.getOther = function getOther(value) {
        return this.others[value - 1];
    };

    Constants.prototype.other = function other(_other) {
        var index = this.others.length;
        this.others.push(_other);
        return index + 1;
    };

    return Constants;
}();

var badProtocols = ['javascript:', 'vbscript:'];
var badTags = ['A', 'BODY', 'LINK', 'IMG', 'IFRAME', 'BASE', 'FORM'];
var badTagsForDataURI = ['EMBED'];
var badAttributes = ['href', 'src', 'background', 'action'];
var badAttributesForDataURI = ['src'];
function has(array, item) {
    return array.indexOf(item) !== -1;
}
function checkURI(tagName, attribute) {
    return (tagName === null || has(badTags, tagName)) && has(badAttributes, attribute);
}
function checkDataURI(tagName, attribute) {
    if (tagName === null) return false;
    return has(badTagsForDataURI, tagName) && has(badAttributesForDataURI, attribute);
}
function requiresSanitization(tagName, attribute) {
    return checkURI(tagName, attribute) || checkDataURI(tagName, attribute);
}
function sanitizeAttributeValue(env, element, attribute, value) {
    var tagName = null;
    if (value === null || value === undefined) {
        return value;
    }
    if (isSafeString(value)) {
        return value.toHTML();
    }
    if (!element) {
        tagName = null;
    } else {
        tagName = element.tagName.toUpperCase();
    }
    var str = normalizeTextValue(value);
    if (checkURI(tagName, attribute)) {
        var protocol = env.protocolForURL(str);
        if (has(badProtocols, protocol)) {
            return 'unsafe:' + str;
        }
    }
    if (checkDataURI(tagName, attribute)) {
        return 'unsafe:' + str;
    }
    return str;
}

/*
 * @method normalizeProperty
 * @param element {HTMLElement}
 * @param slotName {String}
 * @returns {Object} { name, type }
 */
function normalizeProperty(element, slotName) {
    var type = void 0,
        normalized = void 0;
    if (slotName in element) {
        normalized = slotName;
        type = 'prop';
    } else {
        var lower = slotName.toLowerCase();
        if (lower in element) {
            type = 'prop';
            normalized = lower;
        } else {
            type = 'attr';
            normalized = slotName;
        }
    }
    if (type === 'prop' && (normalized.toLowerCase() === 'style' || preferAttr(element.tagName, normalized))) {
        type = 'attr';
    }
    return { normalized: normalized, type: type };
}

// properties that MUST be set as attributes, due to:
// * browser bug
// * strange spec outlier
var ATTR_OVERRIDES = {
    // phantomjs < 2.0 lets you set it as a prop but won't reflect it
    // back to the attribute. button.getAttribute('type') === null
    BUTTON: { type: true, form: true },
    INPUT: {
        // Some version of IE (like IE9) actually throw an exception
        // if you set input.type = 'something-unknown'
        type: true,
        form: true,
        // Chrome 46.0.2464.0: 'autocorrect' in document.createElement('input') === false
        // Safari 8.0.7: 'autocorrect' in document.createElement('input') === false
        // Mobile Safari (iOS 8.4 simulator): 'autocorrect' in document.createElement('input') === true
        autocorrect: true,
        // Chrome 54.0.2840.98: 'list' in document.createElement('input') === true
        // Safari 9.1.3: 'list' in document.createElement('input') === false
        list: true
    },
    // element.form is actually a legitimate readOnly property, that is to be
    // mutated, but must be mutated by setAttribute...
    SELECT: { form: true },
    OPTION: { form: true },
    TEXTAREA: { form: true },
    LABEL: { form: true },
    FIELDSET: { form: true },
    LEGEND: { form: true },
    OBJECT: { form: true }
};
function preferAttr(tagName, propName) {
    var tag = ATTR_OVERRIDES[tagName.toUpperCase()];
    return tag && tag[propName.toLowerCase()] || false;
}

var innerHTMLWrapper = {
    colgroup: { depth: 2, before: '<table><colgroup>', after: '</colgroup></table>' },
    table: { depth: 1, before: '<table>', after: '</table>' },
    tbody: { depth: 2, before: '<table><tbody>', after: '</tbody></table>' },
    tfoot: { depth: 2, before: '<table><tfoot>', after: '</tfoot></table>' },
    thead: { depth: 2, before: '<table><thead>', after: '</thead></table>' },
    tr: { depth: 3, before: '<table><tbody><tr>', after: '</tr></tbody></table>' }
};
// Patch:    innerHTML Fix
// Browsers: IE9
// Reason:   IE9 don't allow us to set innerHTML on col, colgroup, frameset,
//           html, style, table, tbody, tfoot, thead, title, tr.
// Fix:      Wrap the innerHTML we are about to set in its parents, apply the
//           wrapped innerHTML on a div, then move the unwrapped nodes into the
//           target position.
function domChanges(document, DOMChangesClass) {
    if (!document) return DOMChangesClass;
    if (!shouldApplyFix(document)) {
        return DOMChangesClass;
    }
    var div = document.createElement('div');
    return function (_DOMChangesClass) {
        inherits(DOMChangesWithInnerHTMLFix, _DOMChangesClass);

        function DOMChangesWithInnerHTMLFix() {
            classCallCheck(this, DOMChangesWithInnerHTMLFix);
            return possibleConstructorReturn(this, _DOMChangesClass.apply(this, arguments));
        }

        DOMChangesWithInnerHTMLFix.prototype.insertHTMLBefore = function insertHTMLBefore$$1(parent, nextSibling, html) {
            if (html === null || html === '') {
                return _DOMChangesClass.prototype.insertHTMLBefore.call(this, parent, nextSibling, html);
            }
            var parentTag = parent.tagName.toLowerCase();
            var wrapper = innerHTMLWrapper[parentTag];
            if (wrapper === undefined) {
                return _DOMChangesClass.prototype.insertHTMLBefore.call(this, parent, nextSibling, html);
            }
            return fixInnerHTML(parent, wrapper, div, html, nextSibling);
        };

        return DOMChangesWithInnerHTMLFix;
    }(DOMChangesClass);
}
function treeConstruction(document, DOMTreeConstructionClass) {
    if (!document) return DOMTreeConstructionClass;
    if (!shouldApplyFix(document)) {
        return DOMTreeConstructionClass;
    }
    var div = document.createElement('div');
    return function (_DOMTreeConstructionC) {
        inherits(DOMTreeConstructionWithInnerHTMLFix, _DOMTreeConstructionC);

        function DOMTreeConstructionWithInnerHTMLFix() {
            classCallCheck(this, DOMTreeConstructionWithInnerHTMLFix);
            return possibleConstructorReturn(this, _DOMTreeConstructionC.apply(this, arguments));
        }

        DOMTreeConstructionWithInnerHTMLFix.prototype.insertHTMLBefore = function insertHTMLBefore$$1(parent, html, reference) {
            if (html === null || html === '') {
                return _DOMTreeConstructionC.prototype.insertHTMLBefore.call(this, parent, html, reference);
            }
            var parentTag = parent.tagName.toLowerCase();
            var wrapper = innerHTMLWrapper[parentTag];
            if (wrapper === undefined) {
                return _DOMTreeConstructionC.prototype.insertHTMLBefore.call(this, parent, html, reference);
            }
            return fixInnerHTML(parent, wrapper, div, html, reference);
        };

        return DOMTreeConstructionWithInnerHTMLFix;
    }(DOMTreeConstructionClass);
}
function fixInnerHTML(parent, wrapper, div, html, reference) {
    var wrappedHtml = wrapper.before + html + wrapper.after;
    div.innerHTML = wrappedHtml;
    var parentNode = div;
    for (var i = 0; i < wrapper.depth; i++) {
        parentNode = parentNode.childNodes[0];
    }

    var _moveNodesBefore = moveNodesBefore(parentNode, parent, reference),
        first = _moveNodesBefore[0],
        last = _moveNodesBefore[1];

    return new ConcreteBounds(parent, first, last);
}
function shouldApplyFix(document) {
    var table = document.createElement('table');
    try {
        table.innerHTML = '<tbody></tbody>';
    } catch (e) {} finally {
        if (table.childNodes.length !== 0) {
            // It worked as expected, no fix required
            return false;
        }
    }
    return true;
}

var SVG_NAMESPACE$1 = 'http://www.w3.org/2000/svg';
// Patch:    insertAdjacentHTML on SVG Fix
// Browsers: Safari, IE, Edge, Firefox ~33-34
// Reason:   insertAdjacentHTML does not exist on SVG elements in Safari. It is
//           present but throws an exception on IE and Edge. Old versions of
//           Firefox create nodes in the incorrect namespace.
// Fix:      Since IE and Edge silently fail to create SVG nodes using
//           innerHTML, and because Firefox may create nodes in the incorrect
//           namespace using innerHTML on SVG elements, an HTML-string wrapping
//           approach is used. A pre/post SVG tag is added to the string, then
//           that whole string is added to a div. The created nodes are plucked
//           out and applied to the target location on DOM.
function domChanges$1(document, DOMChangesClass, svgNamespace) {
    if (!document) return DOMChangesClass;
    if (!shouldApplyFix$1(document, svgNamespace)) {
        return DOMChangesClass;
    }
    var div = document.createElement('div');
    return function (_DOMChangesClass) {
        inherits(DOMChangesWithSVGInnerHTMLFix, _DOMChangesClass);

        function DOMChangesWithSVGInnerHTMLFix() {
            classCallCheck(this, DOMChangesWithSVGInnerHTMLFix);
            return possibleConstructorReturn(this, _DOMChangesClass.apply(this, arguments));
        }

        DOMChangesWithSVGInnerHTMLFix.prototype.insertHTMLBefore = function insertHTMLBefore$$1(parent, nextSibling, html) {
            if (html === null || html === '') {
                return _DOMChangesClass.prototype.insertHTMLBefore.call(this, parent, nextSibling, html);
            }
            if (parent.namespaceURI !== svgNamespace) {
                return _DOMChangesClass.prototype.insertHTMLBefore.call(this, parent, nextSibling, html);
            }
            return fixSVG(parent, div, html, nextSibling);
        };

        return DOMChangesWithSVGInnerHTMLFix;
    }(DOMChangesClass);
}
function treeConstruction$1(document, TreeConstructionClass, svgNamespace) {
    if (!document) return TreeConstructionClass;
    if (!shouldApplyFix$1(document, svgNamespace)) {
        return TreeConstructionClass;
    }
    var div = document.createElement('div');
    return function (_TreeConstructionClas) {
        inherits(TreeConstructionWithSVGInnerHTMLFix, _TreeConstructionClas);

        function TreeConstructionWithSVGInnerHTMLFix() {
            classCallCheck(this, TreeConstructionWithSVGInnerHTMLFix);
            return possibleConstructorReturn(this, _TreeConstructionClas.apply(this, arguments));
        }

        TreeConstructionWithSVGInnerHTMLFix.prototype.insertHTMLBefore = function insertHTMLBefore$$1(parent, html, reference) {
            if (html === null || html === '') {
                return _TreeConstructionClas.prototype.insertHTMLBefore.call(this, parent, html, reference);
            }
            if (parent.namespaceURI !== svgNamespace) {
                return _TreeConstructionClas.prototype.insertHTMLBefore.call(this, parent, html, reference);
            }
            return fixSVG(parent, div, html, reference);
        };

        return TreeConstructionWithSVGInnerHTMLFix;
    }(TreeConstructionClass);
}
function fixSVG(parent, div, html, reference) {
    // IE, Edge: also do not correctly support using `innerHTML` on SVG
    // namespaced elements. So here a wrapper is used.
    var wrappedHtml = '<svg>' + html + '</svg>';
    div.innerHTML = wrappedHtml;

    var _moveNodesBefore = moveNodesBefore(div.firstChild, parent, reference),
        first = _moveNodesBefore[0],
        last = _moveNodesBefore[1];

    return new ConcreteBounds(parent, first, last);
}
function shouldApplyFix$1(document, svgNamespace) {
    var svg = document.createElementNS(svgNamespace, 'svg');
    try {
        svg['insertAdjacentHTML']('beforeEnd', '<circle></circle>');
    } catch (e) {
        // IE, Edge: Will throw, insertAdjacentHTML is unsupported on SVG
        // Safari: Will throw, insertAdjacentHTML is not present on SVG
    } finally {
        // FF: Old versions will create a node in the wrong namespace
        if (svg.childNodes.length === 1 && unwrap(svg.firstChild).namespaceURI === SVG_NAMESPACE$1) {
            // The test worked as expected, no fix required
            return false;
        }
        return true;
    }
}

// Patch:    Adjacent text node merging fix
// Browsers: IE, Edge, Firefox w/o inspector open
// Reason:   These browsers will merge adjacent text nodes. For exmaple given
//           <div>Hello</div> with div.insertAdjacentHTML(' world') browsers
//           with proper behavior will populate div.childNodes with two items.
//           These browsers will populate it with one merged node instead.
// Fix:      Add these nodes to a wrapper element, then iterate the childNodes
//           of that wrapper and move the nodes to their target location. Note
//           that potential SVG bugs will have been handled before this fix.
//           Note that this fix must only apply to the previous text node, as
//           the base implementation of `insertHTMLBefore` already handles
//           following text nodes correctly.
function domChanges$2(document, DOMChangesClass) {
    if (!document) return DOMChangesClass;
    if (!shouldApplyFix$2(document)) {
        return DOMChangesClass;
    }
    return function (_DOMChangesClass) {
        inherits(DOMChangesWithTextNodeMergingFix, _DOMChangesClass);

        function DOMChangesWithTextNodeMergingFix(document) {
            classCallCheck(this, DOMChangesWithTextNodeMergingFix);

            var _this = possibleConstructorReturn(this, _DOMChangesClass.call(this, document));

            _this.uselessComment = document.createComment('');
            return _this;
        }

        DOMChangesWithTextNodeMergingFix.prototype.insertHTMLBefore = function insertHTMLBefore(parent, nextSibling, html) {
            if (html === null) {
                return _DOMChangesClass.prototype.insertHTMLBefore.call(this, parent, nextSibling, html);
            }
            var didSetUselessComment = false;
            var nextPrevious = nextSibling ? nextSibling.previousSibling : parent.lastChild;
            if (nextPrevious && nextPrevious instanceof Text) {
                didSetUselessComment = true;
                parent.insertBefore(this.uselessComment, nextSibling);
            }
            var bounds = _DOMChangesClass.prototype.insertHTMLBefore.call(this, parent, nextSibling, html);
            if (didSetUselessComment) {
                parent.removeChild(this.uselessComment);
            }
            return bounds;
        };

        return DOMChangesWithTextNodeMergingFix;
    }(DOMChangesClass);
}
function treeConstruction$2(document, TreeConstructionClass) {
    if (!document) return TreeConstructionClass;
    if (!shouldApplyFix$2(document)) {
        return TreeConstructionClass;
    }
    return function (_TreeConstructionClas) {
        inherits(TreeConstructionWithTextNodeMergingFix, _TreeConstructionClas);

        function TreeConstructionWithTextNodeMergingFix(document) {
            classCallCheck(this, TreeConstructionWithTextNodeMergingFix);

            var _this2 = possibleConstructorReturn(this, _TreeConstructionClas.call(this, document));

            _this2.uselessComment = _this2.createComment('');
            return _this2;
        }

        TreeConstructionWithTextNodeMergingFix.prototype.insertHTMLBefore = function insertHTMLBefore(parent, html, reference) {
            if (html === null) {
                return _TreeConstructionClas.prototype.insertHTMLBefore.call(this, parent, html, reference);
            }
            var didSetUselessComment = false;
            var nextPrevious = reference ? reference.previousSibling : parent.lastChild;
            if (nextPrevious && nextPrevious instanceof Text) {
                didSetUselessComment = true;
                parent.insertBefore(this.uselessComment, reference);
            }
            var bounds = _TreeConstructionClas.prototype.insertHTMLBefore.call(this, parent, html, reference);
            if (didSetUselessComment) {
                parent.removeChild(this.uselessComment);
            }
            return bounds;
        };

        return TreeConstructionWithTextNodeMergingFix;
    }(TreeConstructionClass);
}
function shouldApplyFix$2(document) {
    var mergingTextDiv = document.createElement('div');
    mergingTextDiv.innerHTML = 'first';
    mergingTextDiv.insertAdjacentHTML('beforeEnd', 'second');
    if (mergingTextDiv.childNodes.length === 2) {
        // It worked as expected, no fix required
        return false;
    }
    return true;
}

var SVG_NAMESPACE$$1 = 'http://www.w3.org/2000/svg';
// http://www.w3.org/TR/html/syntax.html#html-integration-point
var SVG_INTEGRATION_POINTS = { foreignObject: 1, desc: 1, title: 1 };
// http://www.w3.org/TR/html/syntax.html#adjust-svg-attributes
// TODO: Adjust SVG attributes
// http://www.w3.org/TR/html/syntax.html#parsing-main-inforeign
// TODO: Adjust SVG elements
// http://www.w3.org/TR/html/syntax.html#parsing-main-inforeign
var BLACKLIST_TABLE = Object.create(null);
["b", "big", "blockquote", "body", "br", "center", "code", "dd", "div", "dl", "dt", "em", "embed", "h1", "h2", "h3", "h4", "h5", "h6", "head", "hr", "i", "img", "li", "listing", "main", "meta", "nobr", "ol", "p", "pre", "ruby", "s", "small", "span", "strong", "strike", "sub", "sup", "table", "tt", "u", "ul", "var"].forEach(function (tag) {
    return BLACKLIST_TABLE[tag] = 1;
});
var doc = typeof document === 'undefined' ? null : document;

function moveNodesBefore(source, target, nextSibling) {
    var first = source.firstChild;
    var last = null;
    var current = first;
    while (current) {
        last = current;
        current = current.nextSibling;
        target.insertBefore(last, nextSibling);
    }
    return [first, last];
}
var DOM;
(function (DOM) {
    var TreeConstruction = function () {
        function TreeConstruction(document) {
            classCallCheck(this, TreeConstruction);

            this.document = document;
            this.setupUselessElement();
        }

        TreeConstruction.prototype.setupUselessElement = function setupUselessElement() {
            this.uselessElement = this.document.createElement('div');
        };

        TreeConstruction.prototype.createElement = function createElement(tag, context) {
            var isElementInSVGNamespace = void 0,
                isHTMLIntegrationPoint = void 0;
            if (context) {
                isElementInSVGNamespace = context.namespaceURI === SVG_NAMESPACE$$1 || tag === 'svg';
                isHTMLIntegrationPoint = SVG_INTEGRATION_POINTS[context.tagName];
            } else {
                isElementInSVGNamespace = tag === 'svg';
                isHTMLIntegrationPoint = false;
            }
            if (isElementInSVGNamespace && !isHTMLIntegrationPoint) {
                // FIXME: This does not properly handle <font> with color, face, or
                // size attributes, which is also disallowed by the spec. We should fix
                // this.
                if (BLACKLIST_TABLE[tag]) {
                    throw new Error('Cannot create a ' + tag + ' inside an SVG context');
                }
                return this.document.createElementNS(SVG_NAMESPACE$$1, tag);
            } else {
                return this.document.createElement(tag);
            }
        };

        TreeConstruction.prototype.createElementNS = function createElementNS(namespace, tag) {
            return this.document.createElementNS(namespace, tag);
        };

        TreeConstruction.prototype.setAttribute = function setAttribute(element, name, value, namespace) {
            if (namespace) {
                element.setAttributeNS(namespace, name, value);
            } else {
                element.setAttribute(name, value);
            }
        };

        TreeConstruction.prototype.createTextNode = function createTextNode(text) {
            return this.document.createTextNode(text);
        };

        TreeConstruction.prototype.createComment = function createComment(data) {
            return this.document.createComment(data);
        };

        TreeConstruction.prototype.insertBefore = function insertBefore(parent, node, reference) {
            parent.insertBefore(node, reference);
        };

        TreeConstruction.prototype.insertHTMLBefore = function insertHTMLBefore(parent, html, reference) {
            return _insertHTMLBefore(this.uselessElement, parent, reference, html);
        };

        return TreeConstruction;
    }();

    DOM.TreeConstruction = TreeConstruction;
    var appliedTreeContruction = TreeConstruction;
    appliedTreeContruction = treeConstruction$2(doc, appliedTreeContruction);
    appliedTreeContruction = treeConstruction(doc, appliedTreeContruction);
    appliedTreeContruction = treeConstruction$1(doc, appliedTreeContruction, SVG_NAMESPACE$$1);
    DOM.DOMTreeConstruction = appliedTreeContruction;
})(DOM || (DOM = {}));
var DOMChanges = function () {
    function DOMChanges(document) {
        classCallCheck(this, DOMChanges);

        this.document = document;
        this.namespace = null;
        this.uselessElement = this.document.createElement('div');
    }

    DOMChanges.prototype.setAttribute = function setAttribute(element, name, value) {
        element.setAttribute(name, value);
    };

    DOMChanges.prototype.setAttributeNS = function setAttributeNS(element, namespace, name, value) {
        element.setAttributeNS(namespace, name, value);
    };

    DOMChanges.prototype.removeAttribute = function removeAttribute(element, name) {
        element.removeAttribute(name);
    };

    DOMChanges.prototype.removeAttributeNS = function removeAttributeNS(element, namespace, name) {
        element.removeAttributeNS(namespace, name);
    };

    DOMChanges.prototype.createTextNode = function createTextNode(text) {
        return this.document.createTextNode(text);
    };

    DOMChanges.prototype.createComment = function createComment(data) {
        return this.document.createComment(data);
    };

    DOMChanges.prototype.createElement = function createElement(tag, context) {
        var isElementInSVGNamespace = void 0,
            isHTMLIntegrationPoint = void 0;
        if (context) {
            isElementInSVGNamespace = context.namespaceURI === SVG_NAMESPACE$$1 || tag === 'svg';
            isHTMLIntegrationPoint = SVG_INTEGRATION_POINTS[context.tagName];
        } else {
            isElementInSVGNamespace = tag === 'svg';
            isHTMLIntegrationPoint = false;
        }
        if (isElementInSVGNamespace && !isHTMLIntegrationPoint) {
            // FIXME: This does not properly handle <font> with color, face, or
            // size attributes, which is also disallowed by the spec. We should fix
            // this.
            if (BLACKLIST_TABLE[tag]) {
                throw new Error('Cannot create a ' + tag + ' inside an SVG context');
            }
            return this.document.createElementNS(SVG_NAMESPACE$$1, tag);
        } else {
            return this.document.createElement(tag);
        }
    };

    DOMChanges.prototype.insertHTMLBefore = function insertHTMLBefore(_parent, nextSibling, html) {
        return _insertHTMLBefore(this.uselessElement, _parent, nextSibling, html);
    };

    DOMChanges.prototype.insertNodeBefore = function insertNodeBefore(parent, node, reference) {
        if (isDocumentFragment(node)) {
            var firstChild = node.firstChild,
                lastChild = node.lastChild;

            this.insertBefore(parent, node, reference);
            return new ConcreteBounds(parent, firstChild, lastChild);
        } else {
            this.insertBefore(parent, node, reference);
            return new SingleNodeBounds(parent, node);
        }
    };

    DOMChanges.prototype.insertTextBefore = function insertTextBefore(parent, nextSibling, text) {
        var textNode = this.createTextNode(text);
        this.insertBefore(parent, textNode, nextSibling);
        return textNode;
    };

    DOMChanges.prototype.insertBefore = function insertBefore(element, node, reference) {
        element.insertBefore(node, reference);
    };

    DOMChanges.prototype.insertAfter = function insertAfter(element, node, reference) {
        this.insertBefore(element, node, reference.nextSibling);
    };

    return DOMChanges;
}();
function _insertHTMLBefore(_useless, _parent, _nextSibling, html) {
    // TypeScript vendored an old version of the DOM spec where `insertAdjacentHTML`
    // only exists on `HTMLElement` but not on `Element`. We actually work with the
    // newer version of the DOM API here (and monkey-patch this method in `./compat`
    // when we detect older browsers). This is a hack to work around this limitation.
    var parent = _parent;
    var useless = _useless;
    var nextSibling = _nextSibling;
    var prev = nextSibling ? nextSibling.previousSibling : parent.lastChild;
    var last = void 0;
    if (html === null || html === '') {
        return new ConcreteBounds(parent, null, null);
    }
    if (nextSibling === null) {
        parent.insertAdjacentHTML('beforeEnd', html);
        last = parent.lastChild;
    } else if (nextSibling instanceof HTMLElement) {
        nextSibling.insertAdjacentHTML('beforeBegin', html);
        last = nextSibling.previousSibling;
    } else {
        // Non-element nodes do not support insertAdjacentHTML, so add an
        // element and call it on that element. Then remove the element.
        //
        // This also protects Edge, IE and Firefox w/o the inspector open
        // from merging adjacent text nodes. See ./compat/text-node-merging-fix.ts
        parent.insertBefore(useless, nextSibling);
        useless.insertAdjacentHTML('beforeBegin', html);
        last = useless.previousSibling;
        parent.removeChild(useless);
    }
    var first = prev ? prev.nextSibling : parent.firstChild;
    return new ConcreteBounds(parent, first, last);
}
function isDocumentFragment(node) {
    return node.nodeType === Node.DOCUMENT_FRAGMENT_NODE;
}
var helper = DOMChanges;
helper = domChanges$2(doc, helper);
helper = domChanges(doc, helper);
helper = domChanges$1(doc, helper, SVG_NAMESPACE$$1);
var DOMChanges$1 = helper;
var DOMTreeConstruction = DOM.DOMTreeConstruction;

function defaultManagers(element, attr, _isTrusting, _namespace) {
    var tagName = element.tagName;
    var isSVG = element.namespaceURI === SVG_NAMESPACE$$1;
    if (isSVG) {
        return defaultAttributeManagers(tagName, attr);
    }

    var _normalizeProperty = normalizeProperty(element, attr),
        type = _normalizeProperty.type,
        normalized = _normalizeProperty.normalized;

    if (type === 'attr') {
        return defaultAttributeManagers(tagName, normalized);
    } else {
        return defaultPropertyManagers(tagName, normalized);
    }
}
function defaultPropertyManagers(tagName, attr) {
    if (requiresSanitization(tagName, attr)) {
        return new SafePropertyManager(attr);
    }
    if (isUserInputValue(tagName, attr)) {
        return INPUT_VALUE_PROPERTY_MANAGER;
    }
    if (isOptionSelected(tagName, attr)) {
        return OPTION_SELECTED_MANAGER;
    }
    return new PropertyManager(attr);
}
function defaultAttributeManagers(tagName, attr) {
    if (requiresSanitization(tagName, attr)) {
        return new SafeAttributeManager(attr);
    }
    return new AttributeManager(attr);
}


var AttributeManager = function () {
    function AttributeManager(attr) {
        classCallCheck(this, AttributeManager);

        this.attr = attr;
    }

    AttributeManager.prototype.setAttribute = function setAttribute(env, element, value, namespace) {
        var dom = env.getAppendOperations();
        var normalizedValue = normalizeAttributeValue(value);
        if (!isAttrRemovalValue(normalizedValue)) {
            dom.setAttribute(element, this.attr, normalizedValue, namespace);
        }
    };

    AttributeManager.prototype.updateAttribute = function updateAttribute(env, element, value, namespace) {
        if (value === null || value === undefined || value === false) {
            if (namespace) {
                env.getDOM().removeAttributeNS(element, namespace, this.attr);
            } else {
                env.getDOM().removeAttribute(element, this.attr);
            }
        } else {
            this.setAttribute(env, element, value);
        }
    };

    return AttributeManager;
}();

var PropertyManager = function (_AttributeManager) {
    inherits(PropertyManager, _AttributeManager);

    function PropertyManager() {
        classCallCheck(this, PropertyManager);
        return possibleConstructorReturn(this, _AttributeManager.apply(this, arguments));
    }

    PropertyManager.prototype.setAttribute = function setAttribute(_env, element, value, _namespace) {
        if (!isAttrRemovalValue(value)) {
            element[this.attr] = value;
        }
    };

    PropertyManager.prototype.removeAttribute = function removeAttribute(env, element, namespace) {
        // TODO this sucks but to preserve properties first and to meet current
        // semantics we must do this.
        var attr = this.attr;

        if (namespace) {
            env.getDOM().removeAttributeNS(element, namespace, attr);
        } else {
            env.getDOM().removeAttribute(element, attr);
        }
    };

    PropertyManager.prototype.updateAttribute = function updateAttribute(env, element, value, namespace) {
        // ensure the property is always updated
        element[this.attr] = value;
        if (isAttrRemovalValue(value)) {
            this.removeAttribute(env, element, namespace);
        }
    };

    return PropertyManager;
}(AttributeManager);

function normalizeAttributeValue(value) {
    if (value === false || value === undefined || value === null) {
        return null;
    }
    if (value === true) {
        return '';
    }
    // onclick function etc in SSR
    if (typeof value === 'function') {
        return null;
    }
    return String(value);
}
function isAttrRemovalValue(value) {
    return value === null || value === undefined;
}

var SafePropertyManager = function (_PropertyManager) {
    inherits(SafePropertyManager, _PropertyManager);

    function SafePropertyManager() {
        classCallCheck(this, SafePropertyManager);
        return possibleConstructorReturn(this, _PropertyManager.apply(this, arguments));
    }

    SafePropertyManager.prototype.setAttribute = function setAttribute(env, element, value) {
        _PropertyManager.prototype.setAttribute.call(this, env, element, sanitizeAttributeValue(env, element, this.attr, value));
    };

    SafePropertyManager.prototype.updateAttribute = function updateAttribute(env, element, value) {
        _PropertyManager.prototype.updateAttribute.call(this, env, element, sanitizeAttributeValue(env, element, this.attr, value));
    };

    return SafePropertyManager;
}(PropertyManager);

function isUserInputValue(tagName, attribute) {
    return (tagName === 'INPUT' || tagName === 'TEXTAREA') && attribute === 'value';
}

var InputValuePropertyManager = function (_AttributeManager2) {
    inherits(InputValuePropertyManager, _AttributeManager2);

    function InputValuePropertyManager() {
        classCallCheck(this, InputValuePropertyManager);
        return possibleConstructorReturn(this, _AttributeManager2.apply(this, arguments));
    }

    InputValuePropertyManager.prototype.setAttribute = function setAttribute(_env, element, value) {
        var input = element;
        input.value = normalizeTextValue(value);
    };

    InputValuePropertyManager.prototype.updateAttribute = function updateAttribute(_env, element, value) {
        var input = element;
        var currentValue = input.value;
        var normalizedValue = normalizeTextValue(value);
        if (currentValue !== normalizedValue) {
            input.value = normalizedValue;
        }
    };

    return InputValuePropertyManager;
}(AttributeManager);

var INPUT_VALUE_PROPERTY_MANAGER = new InputValuePropertyManager('value');
function isOptionSelected(tagName, attribute) {
    return tagName === 'OPTION' && attribute === 'selected';
}

var OptionSelectedManager = function (_PropertyManager2) {
    inherits(OptionSelectedManager, _PropertyManager2);

    function OptionSelectedManager() {
        classCallCheck(this, OptionSelectedManager);
        return possibleConstructorReturn(this, _PropertyManager2.apply(this, arguments));
    }

    OptionSelectedManager.prototype.setAttribute = function setAttribute(_env, element, value) {
        if (value !== null && value !== undefined && value !== false) {
            var option = element;
            option.selected = true;
        }
    };

    OptionSelectedManager.prototype.updateAttribute = function updateAttribute(_env, element, value) {
        var option = element;
        if (value) {
            option.selected = true;
        } else {
            option.selected = false;
        }
    };

    return OptionSelectedManager;
}(PropertyManager);

var OPTION_SELECTED_MANAGER = new OptionSelectedManager('selected');

var SafeAttributeManager = function (_AttributeManager3) {
    inherits(SafeAttributeManager, _AttributeManager3);

    function SafeAttributeManager() {
        classCallCheck(this, SafeAttributeManager);
        return possibleConstructorReturn(this, _AttributeManager3.apply(this, arguments));
    }

    SafeAttributeManager.prototype.setAttribute = function setAttribute(env, element, value) {
        _AttributeManager3.prototype.setAttribute.call(this, env, element, sanitizeAttributeValue(env, element, this.attr, value));
    };

    SafeAttributeManager.prototype.updateAttribute = function updateAttribute(env, element, value, _namespace) {
        _AttributeManager3.prototype.updateAttribute.call(this, env, element, sanitizeAttributeValue(env, element, this.attr, value));
    };

    return SafeAttributeManager;
}(AttributeManager);

var Scope = function () {
    function Scope(
    // the 0th slot is `self`
    slots, callerScope,
    // named arguments and blocks passed to a layout that uses eval
    evalScope,
    // locals in scope when the partial was invoked
    partialMap) {
        classCallCheck(this, Scope);

        this.slots = slots;
        this.callerScope = callerScope;
        this.evalScope = evalScope;
        this.partialMap = partialMap;
    }

    Scope.root = function root(self) {
        var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        var refs = new Array(size + 1);
        for (var i = 0; i <= size; i++) {
            refs[i] = UNDEFINED_REFERENCE;
        }
        return new Scope(refs, null, null, null).init({ self: self });
    };

    Scope.sized = function sized() {
        var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

        var refs = new Array(size + 1);
        for (var i = 0; i <= size; i++) {
            refs[i] = UNDEFINED_REFERENCE;
        }
        return new Scope(refs, null, null, null);
    };

    Scope.prototype.init = function init(_ref) {
        var self = _ref.self;

        this.slots[0] = self;
        return this;
    };

    Scope.prototype.getSelf = function getSelf() {
        return this.get(0);
    };

    Scope.prototype.getSymbol = function getSymbol(symbol) {
        return this.get(symbol);
    };

    Scope.prototype.getBlock = function getBlock(symbol) {
        return this.get(symbol);
    };

    Scope.prototype.getEvalScope = function getEvalScope() {
        return this.evalScope;
    };

    Scope.prototype.getPartialMap = function getPartialMap() {
        return this.partialMap;
    };

    Scope.prototype.bind = function bind(symbol, value) {
        this.set(symbol, value);
    };

    Scope.prototype.bindSelf = function bindSelf(self) {
        this.set(0, self);
    };

    Scope.prototype.bindSymbol = function bindSymbol(symbol, value) {
        this.set(symbol, value);
    };

    Scope.prototype.bindBlock = function bindBlock(symbol, value) {
        this.set(symbol, value);
    };

    Scope.prototype.bindEvalScope = function bindEvalScope(map) {
        this.evalScope = map;
    };

    Scope.prototype.bindPartialMap = function bindPartialMap(map) {
        this.partialMap = map;
    };

    Scope.prototype.bindCallerScope = function bindCallerScope(scope) {
        this.callerScope = scope;
    };

    Scope.prototype.getCallerScope = function getCallerScope() {
        return this.callerScope;
    };

    Scope.prototype.child = function child() {
        return new Scope(this.slots.slice(), this.callerScope, this.evalScope, this.partialMap);
    };

    Scope.prototype.get = function get$$1(index) {
        if (index >= this.slots.length) {
            throw new RangeError('BUG: cannot get $' + index + ' from scope; length=' + this.slots.length);
        }
        return this.slots[index];
    };

    Scope.prototype.set = function set$$1(index, value) {
        if (index >= this.slots.length) {
            throw new RangeError('BUG: cannot get $' + index + ' from scope; length=' + this.slots.length);
        }
        this.slots[index] = value;
    };

    return Scope;
}();

var Transaction = function () {
    function Transaction() {
        classCallCheck(this, Transaction);

        this.scheduledInstallManagers = [];
        this.scheduledInstallModifiers = [];
        this.scheduledUpdateModifierManagers = [];
        this.scheduledUpdateModifiers = [];
        this.createdComponents = [];
        this.createdManagers = [];
        this.updatedComponents = [];
        this.updatedManagers = [];
        this.destructors = [];
    }

    Transaction.prototype.didCreate = function didCreate(component, manager) {
        this.createdComponents.push(component);
        this.createdManagers.push(manager);
    };

    Transaction.prototype.didUpdate = function didUpdate(component, manager) {
        this.updatedComponents.push(component);
        this.updatedManagers.push(manager);
    };

    Transaction.prototype.scheduleInstallModifier = function scheduleInstallModifier(modifier, manager) {
        this.scheduledInstallManagers.push(manager);
        this.scheduledInstallModifiers.push(modifier);
    };

    Transaction.prototype.scheduleUpdateModifier = function scheduleUpdateModifier(modifier, manager) {
        this.scheduledUpdateModifierManagers.push(manager);
        this.scheduledUpdateModifiers.push(modifier);
    };

    Transaction.prototype.didDestroy = function didDestroy(d) {
        this.destructors.push(d);
    };

    Transaction.prototype.commit = function commit() {
        var createdComponents = this.createdComponents,
            createdManagers = this.createdManagers;

        for (var i = 0; i < createdComponents.length; i++) {
            var component = createdComponents[i];
            var manager = createdManagers[i];
            manager.didCreate(component);
        }
        var updatedComponents = this.updatedComponents,
            updatedManagers = this.updatedManagers;

        for (var _i = 0; _i < updatedComponents.length; _i++) {
            var _component = updatedComponents[_i];
            var _manager = updatedManagers[_i];
            _manager.didUpdate(_component);
        }
        var destructors = this.destructors;

        for (var _i2 = 0; _i2 < destructors.length; _i2++) {
            destructors[_i2].destroy();
        }
        var scheduledInstallManagers = this.scheduledInstallManagers,
            scheduledInstallModifiers = this.scheduledInstallModifiers;

        for (var _i3 = 0; _i3 < scheduledInstallManagers.length; _i3++) {
            var _manager2 = scheduledInstallManagers[_i3];
            var modifier = scheduledInstallModifiers[_i3];
            _manager2.install(modifier);
        }
        var scheduledUpdateModifierManagers = this.scheduledUpdateModifierManagers,
            scheduledUpdateModifiers = this.scheduledUpdateModifiers;

        for (var _i4 = 0; _i4 < scheduledUpdateModifierManagers.length; _i4++) {
            var _manager3 = scheduledUpdateModifierManagers[_i4];
            var _modifier = scheduledUpdateModifiers[_i4];
            _manager3.update(_modifier);
        }
    };

    return Transaction;
}();

var Opcode = function () {
    function Opcode(array) {
        classCallCheck(this, Opcode);

        this.array = array;
        this.offset = 0;
    }

    createClass(Opcode, [{
        key: 'type',
        get: function get$$1() {
            return this.array[this.offset];
        }
    }, {
        key: 'op1',
        get: function get$$1() {
            return this.array[this.offset + 1];
        }
    }, {
        key: 'op2',
        get: function get$$1() {
            return this.array[this.offset + 2];
        }
    }, {
        key: 'op3',
        get: function get$$1() {
            return this.array[this.offset + 3];
        }
    }]);
    return Opcode;
}();
var Program = function () {
    function Program() {
        classCallCheck(this, Program);

        this.opcodes = [];
        this._offset = 0;
        this._opcode = new Opcode(this.opcodes);
    }

    Program.prototype.opcode = function opcode(offset) {
        this._opcode.offset = offset;
        return this._opcode;
    };

    Program.prototype.set = function set$$1(pos, type) {
        var op1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var op2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        var op3 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

        this.opcodes[pos] = type;
        this.opcodes[pos + 1] = op1;
        this.opcodes[pos + 2] = op2;
        this.opcodes[pos + 3] = op3;
    };

    Program.prototype.push = function push(type) {
        var op1 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var op2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var op3 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

        var offset = this._offset;
        this.opcodes[this._offset++] = type;
        this.opcodes[this._offset++] = op1;
        this.opcodes[this._offset++] = op2;
        this.opcodes[this._offset++] = op3;
        return offset;
    };

    createClass(Program, [{
        key: 'next',
        get: function get$$1() {
            return this._offset;
        }
    }, {
        key: 'current',
        get: function get$$1() {
            return this._offset - 4;
        }
    }]);
    return Program;
}();
var Environment = function () {
    function Environment(_ref2) {
        var appendOperations = _ref2.appendOperations,
            updateOperations = _ref2.updateOperations;
        classCallCheck(this, Environment);

        this._macros = null;
        this._transaction = null;
        this.constants = new Constants();
        this.program = new Program();
        this.appendOperations = appendOperations;
        this.updateOperations = updateOperations;
    }

    Environment.prototype.toConditionalReference = function toConditionalReference(reference) {
        return new ConditionalReference(reference);
    };

    Environment.prototype.getAppendOperations = function getAppendOperations() {
        return this.appendOperations;
    };

    Environment.prototype.getDOM = function getDOM() {
        return this.updateOperations;
    };

    Environment.prototype.getIdentity = function getIdentity(object) {
        return ensureGuid(object) + '';
    };

    Environment.prototype.begin = function begin() {
        debugAssert(!this._transaction, 'Cannot start a nested transaction');
        this._transaction = new Transaction();
    };

    Environment.prototype.didCreate = function didCreate(component, manager) {
        this.transaction.didCreate(component, manager);
    };

    Environment.prototype.didUpdate = function didUpdate(component, manager) {
        this.transaction.didUpdate(component, manager);
    };

    Environment.prototype.scheduleInstallModifier = function scheduleInstallModifier(modifier, manager) {
        this.transaction.scheduleInstallModifier(modifier, manager);
    };

    Environment.prototype.scheduleUpdateModifier = function scheduleUpdateModifier(modifier, manager) {
        this.transaction.scheduleUpdateModifier(modifier, manager);
    };

    Environment.prototype.didDestroy = function didDestroy(d) {
        this.transaction.didDestroy(d);
    };

    Environment.prototype.commit = function commit() {
        this.transaction.commit();
        this._transaction = null;
    };

    Environment.prototype.attributeFor = function attributeFor(element, attr, isTrusting, namespace) {
        return defaultManagers(element, attr, isTrusting, namespace === undefined ? null : namespace);
    };

    Environment.prototype.macros = function macros() {
        var macros = this._macros;
        if (!macros) {
            this._macros = macros = this.populateBuiltins();
        }
        return macros;
    };

    Environment.prototype.populateBuiltins = function populateBuiltins$$1() {
        return populateBuiltins();
    };

    createClass(Environment, [{
        key: 'transaction',
        get: function get$$1() {
            return expect(this._transaction, 'must be in a transaction');
        }
    }]);
    return Environment;
}();

var UpdatingVM = function () {
    function UpdatingVM(env, _ref) {
        var _ref$alwaysRevalidate = _ref.alwaysRevalidate,
            alwaysRevalidate = _ref$alwaysRevalidate === undefined ? false : _ref$alwaysRevalidate;
        classCallCheck(this, UpdatingVM);

        this.frameStack = new Stack();
        this.env = env;
        this.constants = env.constants;
        this.dom = env.getDOM();
        this.alwaysRevalidate = alwaysRevalidate;
    }

    UpdatingVM.prototype.execute = function execute(opcodes, handler) {
        var frameStack = this.frameStack;

        this.try(opcodes, handler);
        while (true) {
            if (frameStack.isEmpty()) break;
            var opcode = this.frame.nextStatement();
            if (opcode === null) {
                this.frameStack.pop();
                continue;
            }
            opcode.evaluate(this);
        }
    };

    UpdatingVM.prototype.goto = function goto(op) {
        this.frame.goto(op);
    };

    UpdatingVM.prototype.try = function _try(ops, handler) {
        this.frameStack.push(new UpdatingVMFrame(this, ops, handler));
    };

    UpdatingVM.prototype.throw = function _throw() {
        this.frame.handleException();
        this.frameStack.pop();
    };

    UpdatingVM.prototype.evaluateOpcode = function evaluateOpcode(opcode) {
        opcode.evaluate(this);
    };

    createClass(UpdatingVM, [{
        key: 'frame',
        get: function get$$1() {
            return expect(this.frameStack.current, 'bug: expected a frame');
        }
    }]);
    return UpdatingVM;
}();

var BlockOpcode = function (_UpdatingOpcode) {
    inherits(BlockOpcode, _UpdatingOpcode);

    function BlockOpcode(start, state, bounds$$1, children) {
        classCallCheck(this, BlockOpcode);

        var _this = possibleConstructorReturn(this, _UpdatingOpcode.call(this));

        _this.start = start;
        _this.type = "block";
        _this.next = null;
        _this.prev = null;
        var env = state.env,
            scope = state.scope,
            dynamicScope = state.dynamicScope,
            stack = state.stack;

        _this.children = children;
        _this.env = env;
        _this.scope = scope;
        _this.dynamicScope = dynamicScope;
        _this.stack = stack;
        _this.bounds = bounds$$1;
        return _this;
    }

    BlockOpcode.prototype.parentElement = function parentElement() {
        return this.bounds.parentElement();
    };

    BlockOpcode.prototype.firstNode = function firstNode() {
        return this.bounds.firstNode();
    };

    BlockOpcode.prototype.lastNode = function lastNode() {
        return this.bounds.lastNode();
    };

    BlockOpcode.prototype.evaluate = function evaluate(vm) {
        vm.try(this.children, null);
    };

    BlockOpcode.prototype.destroy = function destroy() {
        this.bounds.destroy();
    };

    BlockOpcode.prototype.didDestroy = function didDestroy() {
        this.env.didDestroy(this.bounds);
    };

    BlockOpcode.prototype.toJSON = function toJSON() {
        var details = dict();
        details["guid"] = '' + this._guid;
        return {
            guid: this._guid,
            type: this.type,
            details: details,
            children: this.children.toArray().map(function (op) {
                return op.toJSON();
            })
        };
    };

    return BlockOpcode;
}(UpdatingOpcode);
var TryOpcode = function (_BlockOpcode) {
    inherits(TryOpcode, _BlockOpcode);

    function TryOpcode(start, state, bounds$$1, children) {
        classCallCheck(this, TryOpcode);

        var _this2 = possibleConstructorReturn(this, _BlockOpcode.call(this, start, state, bounds$$1, children));

        _this2.type = "try";
        _this2.tag = _this2._tag = UpdatableTag.create(CONSTANT_TAG);
        return _this2;
    }

    TryOpcode.prototype.didInitializeChildren = function didInitializeChildren() {
        this._tag.inner.update(combineSlice(this.children));
    };

    TryOpcode.prototype.evaluate = function evaluate(vm) {
        vm.try(this.children, this);
    };

    TryOpcode.prototype.handleException = function handleException() {
        var _this3 = this;

        var env = this.env,
            bounds$$1 = this.bounds,
            children = this.children,
            scope = this.scope,
            dynamicScope = this.dynamicScope,
            start = this.start,
            stack = this.stack,
            prev = this.prev,
            next = this.next;

        children.clear();
        var elementStack = ElementStack.resume(env, bounds$$1, bounds$$1.reset(env));
        var vm = new VM(env, scope, dynamicScope, elementStack);
        var updating = new LinkedList();
        vm.execute(start, function (vm) {
            vm.stack = EvaluationStack.restore(stack);
            vm.updatingOpcodeStack.push(updating);
            vm.updateWith(_this3);
            vm.updatingOpcodeStack.push(children);
        });
        this.prev = prev;
        this.next = next;
    };

    TryOpcode.prototype.toJSON = function toJSON() {
        var json = _BlockOpcode.prototype.toJSON.call(this);
        var details = json["details"];
        if (!details) {
            details = json["details"] = {};
        }
        return _BlockOpcode.prototype.toJSON.call(this);
    };

    return TryOpcode;
}(BlockOpcode);

var ListRevalidationDelegate = function () {
    function ListRevalidationDelegate(opcode, marker) {
        classCallCheck(this, ListRevalidationDelegate);

        this.opcode = opcode;
        this.marker = marker;
        this.didInsert = false;
        this.didDelete = false;
        this.map = opcode.map;
        this.updating = opcode['children'];
    }

    ListRevalidationDelegate.prototype.insert = function insert(key, item, memo, before) {
        var map$$1 = this.map,
            opcode = this.opcode,
            updating = this.updating;

        var nextSibling = null;
        var reference = null;
        if (before) {
            reference = map$$1[before];
            nextSibling = reference['bounds'].firstNode();
        } else {
            nextSibling = this.marker;
        }
        var vm = opcode.vmForInsertion(nextSibling);
        var tryOpcode = null;
        var start = opcode.start;

        vm.execute(start, function (vm) {
            map$$1[key] = tryOpcode = vm.iterate(memo, item);
            vm.updatingOpcodeStack.push(new LinkedList());
            vm.updateWith(tryOpcode);
            vm.updatingOpcodeStack.push(tryOpcode.children);
        });
        updating.insertBefore(tryOpcode, reference);
        this.didInsert = true;
    };

    ListRevalidationDelegate.prototype.retain = function retain(_key, _item, _memo) {};

    ListRevalidationDelegate.prototype.move = function move$$1(key, _item, _memo, before) {
        var map$$1 = this.map,
            updating = this.updating;

        var entry = map$$1[key];
        var reference = map$$1[before] || null;
        if (before) {
            move(entry, reference.firstNode());
        } else {
            move(entry, this.marker);
        }
        updating.remove(entry);
        updating.insertBefore(entry, reference);
    };

    ListRevalidationDelegate.prototype.delete = function _delete(key) {
        var map$$1 = this.map;

        var opcode = map$$1[key];
        opcode.didDestroy();
        clear(opcode);
        this.updating.remove(opcode);
        delete map$$1[key];
        this.didDelete = true;
    };

    ListRevalidationDelegate.prototype.done = function done() {
        this.opcode.didInitializeChildren(this.didInsert || this.didDelete);
    };

    return ListRevalidationDelegate;
}();

var ListBlockOpcode = function (_BlockOpcode2) {
    inherits(ListBlockOpcode, _BlockOpcode2);

    function ListBlockOpcode(start, state, bounds$$1, children, artifacts) {
        classCallCheck(this, ListBlockOpcode);

        var _this4 = possibleConstructorReturn(this, _BlockOpcode2.call(this, start, state, bounds$$1, children));

        _this4.type = "list-block";
        _this4.map = dict();
        _this4.lastIterated = INITIAL;
        _this4.artifacts = artifacts;
        var _tag = _this4._tag = UpdatableTag.create(CONSTANT_TAG);
        _this4.tag = combine([artifacts.tag, _tag]);
        return _this4;
    }

    ListBlockOpcode.prototype.didInitializeChildren = function didInitializeChildren() {
        var listDidChange = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

        this.lastIterated = this.artifacts.tag.value();
        if (listDidChange) {
            this._tag.inner.update(combineSlice(this.children));
        }
    };

    ListBlockOpcode.prototype.evaluate = function evaluate(vm) {
        var artifacts = this.artifacts,
            lastIterated = this.lastIterated;

        if (!artifacts.tag.validate(lastIterated)) {
            var bounds$$1 = this.bounds;
            var dom = vm.dom;

            var marker = dom.createComment('');
            dom.insertAfter(bounds$$1.parentElement(), marker, expect(bounds$$1.lastNode(), "can't insert after an empty bounds"));
            var target = new ListRevalidationDelegate(this, marker);
            var synchronizer = new IteratorSynchronizer({ target: target, artifacts: artifacts });
            synchronizer.sync();
            this.parentElement().removeChild(marker);
        }
        // Run now-updated updating opcodes
        _BlockOpcode2.prototype.evaluate.call(this, vm);
    };

    ListBlockOpcode.prototype.vmForInsertion = function vmForInsertion(nextSibling) {
        var env = this.env,
            scope = this.scope,
            dynamicScope = this.dynamicScope;

        var elementStack = ElementStack.forInitialRender(this.env, this.bounds.parentElement(), nextSibling);
        return new VM(env, scope, dynamicScope, elementStack);
    };

    ListBlockOpcode.prototype.toJSON = function toJSON() {
        var json = _BlockOpcode2.prototype.toJSON.call(this);
        var map$$1 = this.map;
        var inner = Object.keys(map$$1).map(function (key) {
            return JSON.stringify(key) + ': ' + map$$1[key]._guid;
        }).join(", ");
        var details = json["details"];
        if (!details) {
            details = json["details"] = {};
        }
        details["map"] = '{' + inner + '}';
        return json;
    };

    return ListBlockOpcode;
}(BlockOpcode);

var UpdatingVMFrame = function () {
    function UpdatingVMFrame(vm, ops, exceptionHandler) {
        classCallCheck(this, UpdatingVMFrame);

        this.vm = vm;
        this.ops = ops;
        this.exceptionHandler = exceptionHandler;
        this.vm = vm;
        this.ops = ops;
        this.current = ops.head();
    }

    UpdatingVMFrame.prototype.goto = function goto(op) {
        this.current = op;
    };

    UpdatingVMFrame.prototype.nextStatement = function nextStatement() {
        var current = this.current,
            ops = this.ops;

        if (current) this.current = ops.nextNode(current);
        return current;
    };

    UpdatingVMFrame.prototype.handleException = function handleException() {
        if (this.exceptionHandler) {
            this.exceptionHandler.handleException();
        }
    };

    return UpdatingVMFrame;
}();

var RenderResult = function () {
    function RenderResult(env, updating, bounds$$1) {
        classCallCheck(this, RenderResult);

        this.env = env;
        this.updating = updating;
        this.bounds = bounds$$1;
    }

    RenderResult.prototype.rerender = function rerender() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { alwaysRevalidate: false },
            _ref$alwaysRevalidate = _ref.alwaysRevalidate,
            alwaysRevalidate = _ref$alwaysRevalidate === undefined ? false : _ref$alwaysRevalidate;

        var env = this.env,
            updating = this.updating;

        var vm = new UpdatingVM(env, { alwaysRevalidate: alwaysRevalidate });
        vm.execute(updating, this);
    };

    RenderResult.prototype.parentElement = function parentElement() {
        return this.bounds.parentElement();
    };

    RenderResult.prototype.firstNode = function firstNode() {
        return this.bounds.firstNode();
    };

    RenderResult.prototype.lastNode = function lastNode() {
        return this.bounds.lastNode();
    };

    RenderResult.prototype.opcodes = function opcodes() {
        return this.updating;
    };

    RenderResult.prototype.handleException = function handleException() {
        throw "this should never happen";
    };

    RenderResult.prototype.destroy = function destroy() {
        this.bounds.destroy();
        clear(this.bounds);
    };

    return RenderResult;
}();

var EvaluationStack = function () {
    function EvaluationStack(stack, fp, sp) {
        classCallCheck(this, EvaluationStack);

        this.stack = stack;
        this.fp = fp;
        this.sp = sp;
        Object.seal(this);
    }

    EvaluationStack.empty = function empty() {
        return new this([], 0, -1);
    };

    EvaluationStack.restore = function restore(snapshot) {
        return new this(snapshot.slice(), 0, snapshot.length - 1);
    };

    EvaluationStack.prototype.isEmpty = function isEmpty() {
        return this.sp === -1;
    };

    EvaluationStack.prototype.push = function push(value) {
        this.stack[++this.sp] = value;
    };

    EvaluationStack.prototype.dup = function dup() {
        var position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.sp;

        this.push(this.stack[position]);
    };

    EvaluationStack.prototype.pop = function pop() {
        var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

        var top = this.stack[this.sp];
        this.sp -= n;
        return top;
    };

    EvaluationStack.prototype.peek = function peek() {
        return this.stack[this.sp];
    };

    EvaluationStack.prototype.fromBase = function fromBase(offset) {
        return this.stack[this.fp - offset];
    };

    EvaluationStack.prototype.fromTop = function fromTop(offset) {
        return this.stack[this.sp - offset];
    };

    EvaluationStack.prototype.capture = function capture(items) {
        var end = this.sp + 1;
        var start = end - items;
        return this.stack.slice(start, end);
    };

    EvaluationStack.prototype.toArray = function toArray$$1() {
        return this.stack.slice(this.fp, this.sp + 1);
    };

    return EvaluationStack;
}();

var VM = function () {
    function VM(env, scope, dynamicScope, elementStack) {
        classCallCheck(this, VM);

        this.env = env;
        this.elementStack = elementStack;
        this.dynamicScopeStack = new Stack();
        this.scopeStack = new Stack();
        this.updatingOpcodeStack = new Stack();
        this.cacheGroups = new Stack();
        this.listBlockStack = new Stack();
        this.stack = EvaluationStack.empty();
        /** Registers **/
        this.pc = -1;
        this.ra = -1;
        this.s0 = null;
        this.s1 = null;
        this.t0 = null;
        this.t1 = null;
        this.env = env;
        this.constants = env.constants;
        this.elementStack = elementStack;
        this.scopeStack.push(scope);
        this.dynamicScopeStack.push(dynamicScope);
    }

    // Fetch a value from a register onto the stack
    VM.prototype.fetch = function fetch(register) {
        this.stack.push(this[Register[register]]);
    };
    // Load a value from the stack into a register


    VM.prototype.load = function load(register) {
        this[Register[register]] = this.stack.pop();
    };
    // Fetch a value from a register


    VM.prototype.fetchValue = function fetchValue(register) {
        return this[Register[register]];
    };
    // Load a value into a register


    VM.prototype.loadValue = function loadValue(register, value) {
        this[Register[register]] = value;
    };
    // Start a new frame and save $ra and $fp on the stack


    VM.prototype.pushFrame = function pushFrame() {
        this.stack.push(this.ra);
        this.stack.push(this.fp);
        this.fp = this.sp - 1;
        // this.fp = this.sp + 1;
    };
    // Restore $ra, $sp and $fp


    VM.prototype.popFrame = function popFrame() {
        this.sp = this.fp - 1;
        this.ra = this.stack.fromBase(0);
        this.fp = this.stack.fromBase(-1);
    };
    // Jump to an address in `program`


    VM.prototype.goto = function goto(pc) {
        this.pc = pc;
    };
    // Save $pc into $ra, then jump to a new address in `program` (jal in MIPS)


    VM.prototype.call = function call(pc) {
        this.ra = this.pc;
        this.pc = pc;
    };
    // Put a specific `program` address in $ra


    VM.prototype.returnTo = function returnTo(ra) {
        this.ra = ra;
    };
    // Return to the `program` address stored in $ra


    VM.prototype.return = function _return() {
        this.pc = this.ra;
    };

    VM.initial = function initial(env, self, dynamicScope, elementStack, program) {
        var scope = Scope.root(self, program.symbolTable.symbols.length);
        var vm = new VM(env, scope, dynamicScope, elementStack);
        vm.pc = program.start;
        vm.updatingOpcodeStack.push(new LinkedList());
        return vm;
    };

    VM.prototype.capture = function capture(args) {
        return {
            env: this.env,
            scope: this.scope(),
            dynamicScope: this.dynamicScope(),
            stack: this.stack.capture(args)
        };
    };

    VM.prototype.beginCacheGroup = function beginCacheGroup() {
        this.cacheGroups.push(this.updating().tail());
    };

    VM.prototype.commitCacheGroup = function commitCacheGroup() {
        //        JumpIfNotModified(END)
        //        (head)
        //        (....)
        //        (tail)
        //        DidModify
        // END:   Noop
        var END = new LabelOpcode("END");
        var opcodes = this.updating();
        var marker = this.cacheGroups.pop();
        var head = marker ? opcodes.nextNode(marker) : opcodes.head();
        var tail = opcodes.tail();
        var tag = combineSlice(new ListSlice(head, tail));
        var guard = new JumpIfNotModifiedOpcode(tag, END);
        opcodes.insertBefore(guard, head);
        opcodes.append(new DidModifyOpcode(guard));
        opcodes.append(END);
    };

    VM.prototype.enter = function enter(args) {
        var updating = new LinkedList();
        var state = this.capture(args);
        var tracker = this.elements().pushUpdatableBlock();
        var tryOpcode = new TryOpcode(this.pc, state, tracker, updating);
        this.didEnter(tryOpcode);
    };

    VM.prototype.iterate = function iterate(memo, value) {
        var stack = this.stack;
        stack.push(value);
        stack.push(memo);
        var state = this.capture(2);
        var tracker = this.elements().pushUpdatableBlock();
        // let ip = this.ip;
        // this.ip = end + 4;
        // this.frames.push(ip);
        return new TryOpcode(this.pc, state, tracker, new LinkedList());
    };

    VM.prototype.enterItem = function enterItem(key, opcode) {
        this.listBlock().map[key] = opcode;
        this.didEnter(opcode);
    };

    VM.prototype.enterList = function enterList(start) {
        var updating = new LinkedList();
        var state = this.capture(0);
        var tracker = this.elements().pushBlockList(updating);
        var artifacts = this.stack.peek().artifacts;
        var opcode = new ListBlockOpcode(start, state, tracker, updating, artifacts);
        this.listBlockStack.push(opcode);
        this.didEnter(opcode);
    };

    VM.prototype.didEnter = function didEnter(opcode) {
        this.updateWith(opcode);
        this.updatingOpcodeStack.push(opcode.children);
    };

    VM.prototype.exit = function exit() {
        this.elements().popBlock();
        this.updatingOpcodeStack.pop();
        var parent = this.updating().tail();
        parent.didInitializeChildren();
    };

    VM.prototype.exitList = function exitList() {
        this.exit();
        this.listBlockStack.pop();
    };

    VM.prototype.updateWith = function updateWith(opcode) {
        this.updating().append(opcode);
    };

    VM.prototype.listBlock = function listBlock() {
        return expect(this.listBlockStack.current, 'expected a list block');
    };

    VM.prototype.updating = function updating() {
        return expect(this.updatingOpcodeStack.current, 'expected updating opcode on the updating opcode stack');
    };

    VM.prototype.elements = function elements() {
        return this.elementStack;
    };

    VM.prototype.scope = function scope() {
        return expect(this.scopeStack.current, 'expected scope on the scope stack');
    };

    VM.prototype.dynamicScope = function dynamicScope() {
        return expect(this.dynamicScopeStack.current, 'expected dynamic scope on the dynamic scope stack');
    };

    VM.prototype.pushChildScope = function pushChildScope() {
        this.scopeStack.push(this.scope().child());
    };

    VM.prototype.pushCallerScope = function pushCallerScope() {
        var childScope = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        var callerScope = expect(this.scope().getCallerScope(), 'pushCallerScope is called when a caller scope is present');
        this.scopeStack.push(childScope ? callerScope.child() : callerScope);
    };

    VM.prototype.pushDynamicScope = function pushDynamicScope() {
        var child = this.dynamicScope().child();
        this.dynamicScopeStack.push(child);
        return child;
    };

    VM.prototype.pushRootScope = function pushRootScope(size, bindCaller) {
        var scope = Scope.sized(size);
        if (bindCaller) scope.bindCallerScope(this.scope());
        this.scopeStack.push(scope);
        return scope;
    };

    VM.prototype.popScope = function popScope() {
        this.scopeStack.pop();
    };

    VM.prototype.popDynamicScope = function popDynamicScope() {
        this.dynamicScopeStack.pop();
    };

    VM.prototype.newDestroyable = function newDestroyable(d) {
        this.elements().newDestroyable(d);
    };
    /// SCOPE HELPERS


    VM.prototype.getSelf = function getSelf() {
        return this.scope().getSelf();
    };

    VM.prototype.referenceForSymbol = function referenceForSymbol(symbol) {
        return this.scope().getSymbol(symbol);
    };
    /// EXECUTION


    VM.prototype.execute = function execute(start, initialize) {
        this.pc = start;
        if (initialize) initialize(this);
        var result = void 0;
        while (true) {
            result = this.next();
            if (result.done) break;
        }
        return result.value;
    };

    VM.prototype.next = function next() {
        var env = this.env,
            updatingOpcodeStack = this.updatingOpcodeStack,
            elementStack = this.elementStack;

        var opcode = void 0;
        if (opcode = this.nextStatement(env)) {
            APPEND_OPCODES.evaluate(this, opcode, opcode.type);
            return { done: false, value: null };
        }
        return {
            done: true,
            value: new RenderResult(env, expect(updatingOpcodeStack.pop(), 'there should be a final updating opcode stack'), elementStack.popBlock())
        };
    };

    VM.prototype.nextStatement = function nextStatement(env) {
        var pc = this.pc;

        if (pc === -1) {
            return null;
        }
        var program = env.program;
        this.pc += 4;
        return program.opcode(pc);
    };

    VM.prototype.evaluateOpcode = function evaluateOpcode(opcode) {
        APPEND_OPCODES.evaluate(this, opcode, opcode.type);
    };

    VM.prototype.bindDynamicScope = function bindDynamicScope(names) {
        var scope = this.dynamicScope();
        for (var i = names.length - 1; i >= 0; i--) {
            var name = this.constants.getString(names[i]);
            scope.set(name, this.stack.pop());
        }
    };

    createClass(VM, [{
        key: 'fp',
        get: function get$$1() {
            return this.stack.fp;
        },
        set: function set$$1(fp) {
            this.stack.fp = fp;
        }
    }, {
        key: 'sp',
        get: function get$$1() {
            return this.stack.sp;
        },
        set: function set$$1(sp) {
            this.stack.sp = sp;
        }
    }]);
    return VM;
}();

var TemplateIterator = function () {
    function TemplateIterator(vm) {
        classCallCheck(this, TemplateIterator);

        this.vm = vm;
    }

    TemplateIterator.prototype.next = function next() {
        return this.vm.next();
    };

    return TemplateIterator;
}();
var clientId = 0;
function templateFactory(_ref) {
    var templateId = _ref.id,
        meta = _ref.meta,
        block = _ref.block;

    var parsedBlock = void 0;
    var id = templateId || 'client-' + clientId++;
    var create = function create(env, envMeta) {
        var newMeta = envMeta ? assign({}, envMeta, meta) : meta;
        if (!parsedBlock) {
            parsedBlock = JSON.parse(block);
        }
        return new ScannableTemplate(id, newMeta, env, parsedBlock);
    };
    return { id: id, meta: meta, create: create };
}

var ScannableTemplate = function () {
    function ScannableTemplate(id, meta, env, rawBlock) {
        classCallCheck(this, ScannableTemplate);

        this.id = id;
        this.meta = meta;
        this.env = env;
        this.entryPoint = null;
        this.layout = null;
        this.partial = null;
        this.block = null;
        this.scanner = new Scanner(rawBlock, env);
        this.symbols = rawBlock.symbols;
        this.hasEval = rawBlock.hasEval;
    }

    ScannableTemplate.prototype.render = function render(self, appendTo, dynamicScope) {
        var env = this.env;

        var elementStack = ElementStack.forInitialRender(env, appendTo, null);
        var compiled = this.asEntryPoint().compileDynamic(env);
        var vm = VM.initial(env, self, dynamicScope, elementStack, compiled);
        return new TemplateIterator(vm);
    };

    ScannableTemplate.prototype.asEntryPoint = function asEntryPoint() {
        if (!this.entryPoint) this.entryPoint = this.scanner.scanEntryPoint(this.compilationMeta());
        return this.entryPoint;
    };

    ScannableTemplate.prototype.asLayout = function asLayout(attrs) {
        if (!this.layout) this.layout = this.scanner.scanLayout(this.compilationMeta(), attrs || EMPTY_ARRAY);
        return this.layout;
    };

    ScannableTemplate.prototype.asPartial = function asPartial() {
        if (!this.partial) this.partial = this.scanner.scanEntryPoint(this.compilationMeta(true));
        return this.partial;
    };

    ScannableTemplate.prototype.asBlock = function asBlock() {
        if (!this.block) this.block = this.scanner.scanBlock(this.compilationMeta());
        return this.block;
    };

    ScannableTemplate.prototype.compilationMeta = function compilationMeta() {
        var asPartial = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        return { templateMeta: this.meta, symbols: this.symbols, asPartial: asPartial };
    };

    return ScannableTemplate;
}();

var NodeType;
(function (NodeType) {
    NodeType[NodeType["Element"] = 0] = "Element";
    NodeType[NodeType["Attribute"] = 1] = "Attribute";
    NodeType[NodeType["Text"] = 2] = "Text";
    NodeType[NodeType["CdataSection"] = 3] = "CdataSection";
    NodeType[NodeType["EntityReference"] = 4] = "EntityReference";
    NodeType[NodeType["Entity"] = 5] = "Entity";
    NodeType[NodeType["ProcessingInstruction"] = 6] = "ProcessingInstruction";
    NodeType[NodeType["Comment"] = 7] = "Comment";
    NodeType[NodeType["Document"] = 8] = "Document";
    NodeType[NodeType["DocumentType"] = 9] = "DocumentType";
    NodeType[NodeType["DocumentFragment"] = 10] = "DocumentFragment";
    NodeType[NodeType["Notation"] = 11] = "Notation";
})(NodeType || (NodeType = {}));

function EMPTY_CACHE() {}

var PathReference = function () {
    function PathReference(parent, property) {
        classCallCheck(this, PathReference);

        this.cache = EMPTY_CACHE;
        this.inner = null;
        this.chains = null;
        this.lastParentValue = EMPTY_CACHE;
        this._guid = 0;
        this.tag = VOLATILE_TAG;
        this.parent = parent;
        this.property = property;
    }

    PathReference.prototype.value = function value() {
        var lastParentValue = this.lastParentValue,
            property = this.property,
            inner = this.inner;

        var parentValue = this._parentValue();
        if (parentValue === null || parentValue === undefined) {
            return this.cache = undefined;
        }
        if (lastParentValue === parentValue) {
            inner = this.inner;
        } else {
            var ReferenceType = (typeof parentValue === 'undefined' ? 'undefined' : _typeof(parentValue)) === 'object' ? Meta.for(parentValue).referenceTypeFor(property) : PropertyReference;
            inner = this.inner = new ReferenceType(parentValue, property, this);
        }
        // if (typeof parentValue === 'object') {
        //   Meta.for(parentValue).addReference(property, this);
        // }
        return this.cache = inner.value();
    };

    PathReference.prototype.get = function get$$1(prop) {
        var chains = this._getChains();
        if (prop in chains) return chains[prop];
        return chains[prop] = new PathReference(this, prop);
    };

    PathReference.prototype.label = function label() {
        return '[reference Direct]';
    };

    PathReference.prototype._getChains = function _getChains() {
        if (this.chains) return this.chains;
        return this.chains = dict();
    };

    PathReference.prototype._parentValue = function _parentValue() {
        var parent = this.parent.value();
        this.lastParentValue = parent;
        return parent;
    };

    return PathReference;
}();

var RootReference = function () {
    function RootReference(object) {
        classCallCheck(this, RootReference);

        this.chains = dict();
        this.tag = VOLATILE_TAG;
        this.object = object;
    }

    RootReference.prototype.value = function value() {
        return this.object;
    };

    RootReference.prototype.update = function update(object) {
        this.object = object;
        // this.notify();
    };

    RootReference.prototype.get = function get$$1(prop) {
        var chains = this.chains;
        if (prop in chains) return chains[prop];
        return chains[prop] = new PathReference(this, prop);
    };

    RootReference.prototype.chainFor = function chainFor(prop) {
        var chains = this.chains;
        if (prop in chains) return chains[prop];
        return null;
    };

    RootReference.prototype.path = function path(string) {
        return string.split('.').reduce(function (ref, part) {
            return ref.get(part);
        }, this);
    };

    RootReference.prototype.referenceFromParts = function referenceFromParts$$1(parts) {
        return parts.reduce(function (ref, part) {
            return ref.get(part);
        }, this);
    };

    RootReference.prototype.label = function label() {
        return '[reference Root]';
    };

    return RootReference;
}();

var NOOP_DESTROY = {
    destroy: function destroy() {}
};

var ConstPath = function () {
    function ConstPath(parent, _property) {
        classCallCheck(this, ConstPath);

        this.tag = VOLATILE_TAG;
        this.parent = parent;
    }

    ConstPath.prototype.chain = function chain() {
        return NOOP_DESTROY;
    };

    ConstPath.prototype.notify = function notify() {};

    ConstPath.prototype.value = function value() {
        return this.parent[this.property];
    };

    ConstPath.prototype.get = function get$$1(prop) {
        return new ConstPath(this.parent[this.property], prop);
    };

    return ConstPath;
}();

var ConstRoot = function () {
    function ConstRoot(value) {
        classCallCheck(this, ConstRoot);

        this.tag = VOLATILE_TAG;
        this.inner = value;
    }

    ConstRoot.prototype.update = function update(inner) {
        this.inner = inner;
    };

    ConstRoot.prototype.chain = function chain() {
        return NOOP_DESTROY;
    };

    ConstRoot.prototype.notify = function notify() {};

    ConstRoot.prototype.value = function value() {
        return this.inner;
    };

    ConstRoot.prototype.referenceFromParts = function referenceFromParts$$1(_parts) {
        throw new Error("Not implemented");
    };

    ConstRoot.prototype.chainFor = function chainFor(_prop) {
        throw new Error("Not implemented");
    };

    ConstRoot.prototype.get = function get$$1(prop) {
        return new ConstPath(this.inner, prop);
    };

    return ConstRoot;
}();

var ConstMeta /*implements IMeta*/ = function () {
    function ConstMeta(object) {
        classCallCheck(this, ConstMeta);

        this.object = object;
    }

    ConstMeta.prototype.root = function root() {
        return new ConstRoot(this.object);
    };

    return ConstMeta;
}();

var CLASS_META = "df8be4c8-4e89-44e2-a8f9-550c8dacdca7";
var hasOwnProperty = Object.hasOwnProperty;

var Meta = function () {
    function Meta(object, _ref) {
        var RootReferenceFactory = _ref.RootReferenceFactory,
            DefaultPathReferenceFactory = _ref.DefaultPathReferenceFactory;
        classCallCheck(this, Meta);

        this.references = null;
        this.slots = null;
        this.referenceTypes = null;
        this.propertyMetadata = null;
        this.object = object;
        this.RootReferenceFactory = RootReferenceFactory || RootReference;
        this.DefaultPathReferenceFactory = DefaultPathReferenceFactory || PropertyReference;
    }

    Meta.for = function _for(obj) {
        if (obj === null || obj === undefined) return new Meta(obj, {});
        if (hasOwnProperty.call(obj, '_meta') && obj._meta) return obj._meta;
        if (!Object.isExtensible(obj)) return new ConstMeta(obj);
        var MetaToUse = Meta;
        if (obj.constructor && obj.constructor[CLASS_META]) {
            var classMeta = obj.constructor[CLASS_META];
            MetaToUse = classMeta.InstanceMetaConstructor;
        } else if (obj[CLASS_META]) {
            MetaToUse = obj[CLASS_META].InstanceMetaConstructor;
        }
        return obj._meta = new MetaToUse(obj, {});
    };

    Meta.exists = function exists(obj) {
        return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj._meta;
    };

    Meta.metadataForProperty = function metadataForProperty(_key) {
        return null;
    };

    Meta.prototype.addReference = function addReference(property, reference) {
        var refs = this.references = this.references || dict();
        var set$$1 = refs[property] = refs[property] || new DictSet();
        set$$1.add(reference);
    };

    Meta.prototype.addReferenceTypeFor = function addReferenceTypeFor(property, type) {
        this.referenceTypes = this.referenceTypes || dict();
        this.referenceTypes[property] = type;
    };

    Meta.prototype.referenceTypeFor = function referenceTypeFor(property) {
        if (!this.referenceTypes) return PropertyReference;
        return this.referenceTypes[property] || PropertyReference;
    };

    Meta.prototype.removeReference = function removeReference(property, reference) {
        if (!this.references) return;
        var set$$1 = this.references[property];
        set$$1.delete(reference);
    };

    Meta.prototype.getReferenceTypes = function getReferenceTypes() {
        this.referenceTypes = this.referenceTypes || dict();
        return this.referenceTypes;
    };

    Meta.prototype.referencesFor = function referencesFor(property) {
        if (!this.references) return null;
        return this.references[property];
    };

    Meta.prototype.getSlots = function getSlots() {
        return this.slots = this.slots || dict();
    };

    Meta.prototype.root = function root() {
        return this.rootCache = this.rootCache || new this.RootReferenceFactory(this.object);
    };

    return Meta;
}();

var PropertyReference = function () {
    function PropertyReference(object, property, _outer) {
        classCallCheck(this, PropertyReference);

        this.tag = VOLATILE_TAG;
        this.object = object;
        this.property = property;
    }

    PropertyReference.prototype.value = function value() {
        return this.object[this.property];
    };

    PropertyReference.prototype.label = function label() {
        return '[reference Property]';
    };

    return PropertyReference;
}();

// import { metaFor } from './meta';
// import { intern } from '@glimmer/util';
// import { metaFor } from './meta';

function isTypeSpecifier(specifier) {
    return specifier.indexOf(':') === -1;
}

var ApplicationRegistry = function () {
    function ApplicationRegistry(registry, resolver) {
        classCallCheck(this, ApplicationRegistry);

        this._registry = registry;
        this._resolver = resolver;
    }

    ApplicationRegistry.prototype.register = function register(specifier, factory, options) {
        var normalizedSpecifier = this._toAbsoluteSpecifier(specifier);
        this._registry.register(normalizedSpecifier, factory, options);
    };

    ApplicationRegistry.prototype.registration = function registration(specifier) {
        var normalizedSpecifier = this._toAbsoluteSpecifier(specifier);
        return this._registry.registration(normalizedSpecifier);
    };

    ApplicationRegistry.prototype.unregister = function unregister(specifier) {
        var normalizedSpecifier = this._toAbsoluteSpecifier(specifier);
        this._registry.unregister(normalizedSpecifier);
    };

    ApplicationRegistry.prototype.registerOption = function registerOption(specifier, option, value) {
        var normalizedSpecifier = this._toAbsoluteOrTypeSpecifier(specifier);
        this._registry.registerOption(normalizedSpecifier, option, value);
    };

    ApplicationRegistry.prototype.registeredOption = function registeredOption(specifier, option) {
        var normalizedSpecifier = this._toAbsoluteOrTypeSpecifier(specifier);
        return this._registry.registeredOption(normalizedSpecifier, option);
    };

    ApplicationRegistry.prototype.registeredOptions = function registeredOptions(specifier) {
        var normalizedSpecifier = this._toAbsoluteOrTypeSpecifier(specifier);
        return this._registry.registeredOptions(normalizedSpecifier);
    };

    ApplicationRegistry.prototype.unregisterOption = function unregisterOption(specifier, option) {
        var normalizedSpecifier = this._toAbsoluteOrTypeSpecifier(specifier);
        this._registry.unregisterOption(normalizedSpecifier, option);
    };

    ApplicationRegistry.prototype.registerInjection = function registerInjection(specifier, property, injection) {
        var normalizedSpecifier = this._toAbsoluteOrTypeSpecifier(specifier);
        var normalizedInjection = this._toAbsoluteSpecifier(injection);
        this._registry.registerInjection(normalizedSpecifier, property, normalizedInjection);
    };

    ApplicationRegistry.prototype.registeredInjections = function registeredInjections(specifier) {
        var normalizedSpecifier = this._toAbsoluteOrTypeSpecifier(specifier);
        return this._registry.registeredInjections(normalizedSpecifier);
    };

    ApplicationRegistry.prototype._toAbsoluteSpecifier = function _toAbsoluteSpecifier(specifier, referrer) {
        return this._resolver.identify(specifier, referrer);
    };

    ApplicationRegistry.prototype._toAbsoluteOrTypeSpecifier = function _toAbsoluteOrTypeSpecifier(specifier) {
        if (isTypeSpecifier(specifier)) {
            return specifier;
        } else {
            return this._toAbsoluteSpecifier(specifier);
        }
    };

    return ApplicationRegistry;
}();

var DynamicScope = function () {
    function DynamicScope() {
        var bucket = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        classCallCheck(this, DynamicScope);

        if (bucket) {
            this.bucket = assign({}, bucket);
        } else {
            this.bucket = {};
        }
    }

    DynamicScope.prototype.get = function get$$1(key) {
        return this.bucket[key];
    };

    DynamicScope.prototype.set = function set$$1(key, reference) {
        return this.bucket[key] = reference;
    };

    DynamicScope.prototype.child = function child() {
        return new DynamicScope(this.bucket);
    };

    return DynamicScope;
}();

var ArrayIterator = function () {
    function ArrayIterator(array, keyFor) {
        classCallCheck(this, ArrayIterator);

        this.position = 0;
        this.array = array;
        this.keyFor = keyFor;
    }

    ArrayIterator.prototype.isEmpty = function isEmpty() {
        return this.array.length === 0;
    };

    ArrayIterator.prototype.next = function next() {
        var position = this.position,
            array = this.array,
            keyFor = this.keyFor;

        if (position >= array.length) return null;
        var value = array[position];
        var key = keyFor(value, position);
        var memo = position;
        this.position++;
        return { key: key, value: value, memo: memo };
    };

    return ArrayIterator;
}();

var ObjectKeysIterator = function () {
    function ObjectKeysIterator(keys, values, keyFor) {
        classCallCheck(this, ObjectKeysIterator);

        this.position = 0;
        this.keys = keys;
        this.values = values;
        this.keyFor = keyFor;
    }

    ObjectKeysIterator.prototype.isEmpty = function isEmpty() {
        return this.keys.length === 0;
    };

    ObjectKeysIterator.prototype.next = function next() {
        var position = this.position,
            keys = this.keys,
            values = this.values,
            keyFor = this.keyFor;

        if (position >= keys.length) return null;
        var value = values[position];
        var memo = keys[position];
        var key = keyFor(value, memo);
        this.position++;
        return { key: key, value: value, memo: memo };
    };

    return ObjectKeysIterator;
}();

var EmptyIterator = function () {
    function EmptyIterator() {
        classCallCheck(this, EmptyIterator);
    }

    EmptyIterator.prototype.isEmpty = function isEmpty() {
        return true;
    };

    EmptyIterator.prototype.next = function next() {
        throw new Error("Cannot call next() on an empty iterator");
    };

    return EmptyIterator;
}();

var EMPTY_ITERATOR = new EmptyIterator();

var Iterable = function () {
    function Iterable(ref, keyFor) {
        classCallCheck(this, Iterable);

        this.tag = ref.tag;
        this.ref = ref;
        this.keyFor = keyFor;
    }

    Iterable.prototype.iterate = function iterate() {
        var ref = this.ref,
            keyFor = this.keyFor;

        var iterable = ref.value();
        if (Array.isArray(iterable)) {
            return iterable.length > 0 ? new ArrayIterator(iterable, keyFor) : EMPTY_ITERATOR;
        } else if (iterable === undefined || iterable === null) {
            return EMPTY_ITERATOR;
        } else if (iterable.forEach !== undefined) {
            var array = [];
            iterable.forEach(function (item) {
                array.push(item);
            });
            return array.length > 0 ? new ArrayIterator(array, keyFor) : EMPTY_ITERATOR;
        } else if ((typeof iterable === "undefined" ? "undefined" : _typeof(iterable)) === 'object') {
            var keys = Object.keys(iterable);
            return keys.length > 0 ? new ObjectKeysIterator(keys, keys.map(function (key) {
                return iterable[key];
            }), keyFor) : EMPTY_ITERATOR;
        } else {
            throw new Error("Don't know how to {{#each " + iterable + "}}");
        }
    };

    Iterable.prototype.valueReferenceFor = function valueReferenceFor(item) {
        return new RootReference(item.value);
    };

    Iterable.prototype.updateValueReference = function updateValueReference(reference, item) {
        reference.update(item.value);
    };

    Iterable.prototype.memoReferenceFor = function memoReferenceFor(item) {
        return new RootReference(item.memo);
    };

    Iterable.prototype.updateMemoReference = function updateMemoReference(reference, item) {
        reference.update(item.memo);
    };

    return Iterable;
}();

function blockComponentMacro(params, hash, template, inverse, builder) {
    var definitionArgs = [params.slice(0, 1), null, null, null];
    var args = [params.slice(1), hashToArgs(hash), template, inverse];
    builder.component.dynamic(definitionArgs, dynamicComponentFor, args);
    return true;
}
function inlineComponentMacro(_name, params, hash, builder) {
    var definitionArgs = [params.slice(0, 1), null, null, null];
    var args = [params.slice(1), hashToArgs(hash), null, null];
    builder.component.dynamic(definitionArgs, dynamicComponentFor, args);
    return true;
}
function dynamicComponentFor(vm, args, meta) {
    var nameRef = args.positional.at(0);
    var env = vm.env;
    return new DynamicComponentReference(nameRef, env, meta);
}

var DynamicComponentReference = function () {
    function DynamicComponentReference(nameRef, env, meta) {
        classCallCheck(this, DynamicComponentReference);

        this.nameRef = nameRef;
        this.env = env;
        this.meta = meta;
        this.tag = nameRef.tag;
    }

    DynamicComponentReference.prototype.value = function value() {
        var env = this.env,
            nameRef = this.nameRef;

        var nameOrDef = nameRef.value();
        if (typeof nameOrDef === 'string') {
            return env.getComponentDefinition(nameOrDef, this.meta);
        }
        return null;
    };

    DynamicComponentReference.prototype.get = function get$$1() {
        return UNDEFINED_REFERENCE;
    };

    return DynamicComponentReference;
}();

function hashToArgs(hash) {
    if (hash === null) return null;
    var names = hash[0].map(function (key) {
        return '@' + key;
    });
    return [names, hash[1]];
}

function buildAction(vm, _args) {
    var componentRef = vm.getSelf();
    var args = _args.capture();
    var actionFunc = args.positional.at(0).value();
    if (typeof actionFunc !== 'function') {
        throwNoActionError(actionFunc, args.positional.at(0));
    }
    return new ConstReference(function action() {
        var curriedArgs = args.positional.value();
        // Consume the action function that was already captured above.
        curriedArgs.shift();
        curriedArgs.push.apply(curriedArgs, arguments);
        // Invoke the function with the component as the context, the curried
        // arguments passed to `{{action}}`, and the arguments the bound function
        // was invoked with.
        actionFunc.apply(componentRef && componentRef.value(), curriedArgs);
    });
}
function throwNoActionError(actionFunc, actionFuncReference) {
    var referenceInfo = debugInfoForReference(actionFuncReference);
    throw new Error('You tried to create an action with the {{action}} helper, but the first argument ' + referenceInfo + 'was ' + (typeof actionFunc === 'undefined' ? 'undefined' : _typeof(actionFunc)) + ' instead of a function.');
}
function debugInfoForReference(reference) {
    var message = '';
    var parent = void 0;
    var property = void 0;
    if (reference == null) {
        return message;
    }
    if ('parent' in reference && 'property' in reference) {
        parent = reference['parent'].value();
        property = reference['property'];
    } else if ('_parentValue' in reference && '_propertyKey' in reference) {
        parent = reference['_parentValue'];
        property = reference['_propertyKey'];
    }
    if (property !== undefined) {
        message += '(\'' + property + '\' on ' + debugName(parent) + ') ';
    }
    return message;
}
function debugName(obj) {
    var objType = typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
    if (obj == null) {
        return objType;
    } else if (objType === 'number' || objType === 'boolean') {
        return obj.toString();
    } else {
        if (obj['debugName']) {
            return obj['debugName'];
        }
        try {
            return JSON.stringify(obj);
        } catch (e) {}
        return obj.toString();
    }
}

function buildUserHelper(helperFunc) {
    return function (_vm, args) {
        return new HelperReference(helperFunc, args);
    };
}
var SimplePathReference = function () {
    function SimplePathReference(parent, property) {
        classCallCheck(this, SimplePathReference);

        this.tag = VOLATILE_TAG;
        this.parent = parent;
        this.property = property;
    }

    SimplePathReference.prototype.value = function value() {
        return this.parent.value()[this.property];
    };

    SimplePathReference.prototype.get = function get$$1(prop) {
        return new SimplePathReference(this, prop);
    };

    return SimplePathReference;
}();
var HelperReference = function () {
    function HelperReference(helper, args) {
        classCallCheck(this, HelperReference);

        this.tag = VOLATILE_TAG;
        this.helper = helper;
        this.args = args.capture();
    }

    HelperReference.prototype.value = function value() {
        var helper = this.helper,
            args = this.args;

        return helper(args.positional.value(), args.named.value());
    };

    HelperReference.prototype.get = function get$$1(prop) {
        return new SimplePathReference(this, prop);
    };

    return HelperReference;
}();

var DefaultComponentDefinition = function (_ComponentDefinition) {
    inherits(DefaultComponentDefinition, _ComponentDefinition);

    function DefaultComponentDefinition() {
        classCallCheck(this, DefaultComponentDefinition);
        return possibleConstructorReturn(this, _ComponentDefinition.apply(this, arguments));
    }

    DefaultComponentDefinition.prototype.toJSON = function toJSON() {
        return '<default-component-definition name=' + this.name + '>';
    };

    return DefaultComponentDefinition;
}(ComponentDefinition);

var DEFAULT_MANAGER = 'main';
var DEFAULT_HELPERS = {
    action: buildAction
};

var Environment$1 = function (_GlimmerEnvironment) {
    inherits(Environment$$1, _GlimmerEnvironment);

    function Environment$$1(options) {
        classCallCheck(this, Environment$$1);

        var _this2 = possibleConstructorReturn(this, _GlimmerEnvironment.call(this, { appendOperations: options.appendOperations, updateOperations: new DOMChanges$1(options.document || document) }));

        _this2.helpers = dict();
        _this2.modifiers = dict();
        _this2.components = dict();
        _this2.managers = dict();
        setOwner(_this2, getOwner(options));
        // TODO - required for `protocolForURL` - seek alternative approach
        // e.g. see `installPlatformSpecificProtocolForURL` in Ember
        _this2.uselessAnchor = options.document.createElement('a');
        return _this2;
    }

    Environment$$1.create = function create() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        options.document = options.document || self.document;
        options.appendOperations = options.appendOperations || new DOMTreeConstruction(options.document);
        return new Environment$$1(options);
    };

    Environment$$1.prototype.protocolForURL = function protocolForURL(url) {
        // TODO - investigate alternative approaches
        // e.g. see `installPlatformSpecificProtocolForURL` in Ember
        this.uselessAnchor.href = url;
        return this.uselessAnchor.protocol;
    };

    Environment$$1.prototype.hasPartial = function hasPartial() {
        return false;
    };

    Environment$$1.prototype.lookupPartial = function lookupPartial() {};

    Environment$$1.prototype.managerFor = function managerFor() {
        var managerId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_MANAGER;

        var manager = void 0;
        manager = this.managers[managerId];
        if (!manager) {
            var app = getOwner(this);
            manager = this.managers[managerId] = getOwner(this).lookup('component-manager:/' + app.rootName + '/component-managers/' + managerId);
            if (!manager) {
                throw new Error('No component manager found for ID ' + managerId + '.');
            }
        }
        return manager;
    };

    Environment$$1.prototype.hasComponentDefinition = function hasComponentDefinition(name, meta) {
        return !!this.getComponentDefinition(name, meta);
    };

    Environment$$1.prototype.getComponentDefinition = function getComponentDefinition(name, meta) {
        var owner = getOwner(this);
        var relSpecifier = 'template:' + name;
        var referrer = meta.specifier;
        var specifier = owner.identify(relSpecifier, referrer);
        if (specifier === undefined) {
            if (owner.identify('component:' + name, referrer)) {
                throw new Error('The component \'' + name + '\' is missing a template. All components must have a template. Make sure there is a template.hbs in the component directory.');
            } else {
                throw new Error("Could not find template for " + name);
            }
        }
        if (!this.components[specifier]) {
            return this.registerComponent(name, specifier, meta, owner);
        }
        return this.components[specifier];
    };

    Environment$$1.prototype.registerComponent = function registerComponent(name, templateSpecifier, meta, owner) {
        var serializedTemplate = owner.lookup('template', templateSpecifier);
        var componentSpecifier = owner.identify('component', templateSpecifier);
        var componentFactory = null;
        if (componentSpecifier) {
            componentFactory = owner.factoryFor(componentSpecifier);
        }
        var template = templateFactory(serializedTemplate).create(this);
        var manager = this.managerFor(meta.managerId);
        var definition = void 0;
        if (canCreateComponentDefinition(manager)) {
            definition = manager.createComponentDefinition(name, template, componentFactory);
        } else {
            definition = new DefaultComponentDefinition(name, manager, componentFactory);
        }
        this.components[templateSpecifier] = definition;
        return definition;
    };

    Environment$$1.prototype.hasHelper = function hasHelper(name, meta) {
        return !!this.lookupHelper(name, meta);
    };

    Environment$$1.prototype.lookupHelper = function lookupHelper(name, meta) {
        if (DEFAULT_HELPERS[name]) {
            return DEFAULT_HELPERS[name];
        }
        var owner = getOwner(this);
        var relSpecifier = 'helper:' + name;
        var referrer = meta.specifier;
        var specifier = owner.identify(relSpecifier, referrer);
        if (specifier === undefined) {
            return;
        }
        if (!this.helpers[specifier]) {
            return this.registerHelper(specifier, owner);
        }
        return this.helpers[specifier];
    };

    Environment$$1.prototype.registerHelper = function registerHelper(specifier, owner) {
        var helperFunc = owner.lookup(specifier);
        var userHelper = buildUserHelper(helperFunc);
        this.helpers[specifier] = userHelper;
        return userHelper;
    };

    Environment$$1.prototype.hasModifier = function hasModifier(modifierName, blockMeta) {
        return modifierName.length === 1 && modifierName in this.modifiers;
    };

    Environment$$1.prototype.lookupModifier = function lookupModifier(modifierName, blockMeta) {
        var modifier = this.modifiers[modifierName];
        if (!modifier) throw new Error('Modifier for ' + modifierName + ' not found.');
        return modifier;
    };

    Environment$$1.prototype.iterableFor = function iterableFor(ref, keyPath) {
        var keyFor = void 0;
        if (!keyPath) {
            throw new Error('Must specify a key for #each');
        }
        switch (keyPath) {
            case '@index':
                keyFor = function keyFor(_, index) {
                    return String(index);
                };
                break;
            case '@primitive':
                keyFor = function keyFor(item) {
                    return String(item);
                };
                break;
            default:
                keyFor = function keyFor(item) {
                    return item[keyPath];
                };
                break;
        }
        return new Iterable(ref, keyFor);
    };

    Environment$$1.prototype.macros = function macros() {
        var macros = _GlimmerEnvironment.prototype.macros.call(this);
        populateMacros(macros.blocks, macros.inlines);
        return macros;
    };

    return Environment$$1;
}(Environment);

function populateMacros(blocks, inlines) {
    blocks.add('component', blockComponentMacro);
    inlines.add('component', inlineComponentMacro);
}
function canCreateComponentDefinition(manager) {
    return manager.createComponentDefinition !== undefined;
}

var mainTemplate = { "id": "sn4E/A3E", "block": "{\"symbols\":[\"root\"],\"prelude\":null,\"head\":null,\"statements\":[[4,\"each\",[[19,0,[\"roots\"]]],[[\"key\"],[\"id\"]],{\"statements\":[[4,\"-in-element\",[[19,1,[\"parent\"]]],[[\"nextSibling\"],[[19,1,[\"nextSibling\"]]]],{\"statements\":[[1,[25,\"component\",[[19,1,[\"component\"]]],null],false]],\"parameters\":[]},null]],\"parameters\":[1]},null]],\"hasEval\":false}", "meta": { "specifier": "template:/-application/templates/main.hbs" } };

var Application = function () {
    function Application(options) {
        classCallCheck(this, Application);

        this._roots = [];
        this._rootsIndex = 0;
        this._initializers = [];
        this._initialized = false;
        this.rootName = options.rootName;
        this.resolver = options.resolver;
    }

    Application.prototype.registerInitializer = function registerInitializer(initializer) {
        this._initializers.push(initializer);
    };

    Application.prototype.initRegistry = function initRegistry() {
        var registry = this._registry = new Registry();
        // Create ApplicationRegistry as a proxy to the underlying registry
        // that will only be available during `initialize`.
        var appRegistry = new ApplicationRegistry(this._registry, this.resolver);
        registry.register('environment:/' + this.rootName + '/main/main', Environment$1);
        registry.registerOption('helper', 'instantiate', false);
        registry.registerOption('template', 'instantiate', false);
        registry.register('document:/' + this.rootName + '/main/main', window.document);
        registry.registerOption('document', 'instantiate', false);
        registry.registerInjection('environment', 'document', 'document:/' + this.rootName + '/main/main');
        registry.registerInjection('component-manager', 'env', 'environment:/' + this.rootName + '/main/main');
        var initializers = this._initializers;
        for (var i = 0; i < initializers.length; i++) {
            initializers[i].initialize(appRegistry);
        }
        this._initialized = true;
    };

    Application.prototype.initContainer = function initContainer() {
        var _this = this;

        this._container = new Container(this._registry, this.resolver);
        // Inject `this` (the app) as the "owner" of every object instantiated
        // by its container.
        this._container.defaultInjections = function (specifier) {
            var hash = {};
            setOwner(hash, _this);
            return hash;
        };
    };

    Application.prototype.initialize = function initialize() {
        this.initRegistry();
        this.initContainer();
    };

    Application.prototype.boot = function boot() {
        this.initialize();
        this.env = this.lookup('environment:/' + this.rootName + '/main/main');
        this.render();
    };

    Application.prototype.render = function render() {
        this.env.begin();
        var mainLayout = templateFactory(mainTemplate).create(this.env);
        var self = new RootReference({ roots: this._roots });
        var appendTo = document.body;
        var dynamicScope = new DynamicScope();
        var templateIterator = mainLayout.render(self, appendTo, dynamicScope);
        var result = void 0;
        do {
            result = templateIterator.next();
        } while (!result.done);
        this.env.commit();
        this._rendered = true;
        this._renderResult = result.value;
    };

    Application.prototype.renderComponent = function renderComponent(component, parent, nextSibling) {
        this._roots.push({ id: this._rootsIndex++, component: component, parent: parent, nextSibling: nextSibling });
        this.scheduleRerender();
    };

    Application.prototype.rerender = function rerender() {
        this.env.begin();
        this._renderResult.rerender();
        this.env.commit();
    };

    Application.prototype.scheduleRerender = function scheduleRerender() {
        var _this2 = this;

        if (this._scheduled || !this._rendered) {
            return;
        }
        this._scheduled = true;
        requestAnimationFrame(function () {
            _this2._scheduled = false;
            _this2.rerender();
        });
    };
    /**
     * Owner interface implementation
     */


    Application.prototype.identify = function identify(specifier, referrer) {
        return this.resolver.identify(specifier, referrer);
    };

    Application.prototype.factoryFor = function factoryFor(specifier, referrer) {
        return this._container.factoryFor(this.identify(specifier, referrer));
    };

    Application.prototype.lookup = function lookup(specifier, referrer) {
        return this._container.lookup(this.identify(specifier, referrer));
    };

    return Application;
}();

// TODO - use symbol

function isSpecifierStringAbsolute$1(specifier) {
    var _specifier$split = specifier.split(':'),
        type = _specifier$split[0],
        path = _specifier$split[1];

    return !!(type && path && path.indexOf('/') === 0 && path.split('/').length > 3);
}
function isSpecifierObjectAbsolute$1(specifier) {
    return specifier.rootName !== undefined && specifier.collection !== undefined && specifier.name !== undefined && specifier.type !== undefined;
}
function serializeSpecifier$1(specifier) {
    var type = specifier.type;
    var path = serializeSpecifierPath$1(specifier);
    if (path) {
        return type + ':' + path;
    } else {
        return type;
    }
}
function serializeSpecifierPath$1(specifier) {
    var path = [];
    if (specifier.rootName) {
        path.push(specifier.rootName);
    }
    if (specifier.collection) {
        path.push(specifier.collection);
    }
    if (specifier.namespace) {
        path.push(specifier.namespace);
    }
    if (specifier.name) {
        path.push(specifier.name);
    }
    if (path.length > 0) {
        var fullPath = path.join('/');
        if (isSpecifierObjectAbsolute$1(specifier)) {
            fullPath = '/' + fullPath;
        }
        return fullPath;
    }
}
function deserializeSpecifier$1(specifier) {
    var obj = {};
    if (specifier.indexOf(':') > -1) {
        var _specifier$split2 = specifier.split(':'),
            type = _specifier$split2[0],
            path = _specifier$split2[1];

        obj.type = type;
        var pathSegments = void 0;
        if (path.indexOf('/') === 0) {
            pathSegments = path.substr(1).split('/');
            obj.rootName = pathSegments.shift();
            obj.collection = pathSegments.shift();
        } else {
            pathSegments = path.split('/');
        }
        if (pathSegments.length > 0) {
            obj.name = pathSegments.pop();
            if (pathSegments.length > 0) {
                obj.namespace = pathSegments.join('/');
            }
        }
    } else {
        obj.type = specifier;
    }
    return obj;
}

function assert$1(description, test) {
    if (!test) {
        throw new Error('Assertion Failed: ' + description);
    }
}

var Resolver = function () {
    function Resolver(config, registry) {
        classCallCheck(this, Resolver);

        this.config = config;
        this.registry = registry;
    }

    Resolver.prototype.identify = function identify(specifier, referrer) {
        if (isSpecifierStringAbsolute$1(specifier)) {
            return specifier;
        }
        var s = deserializeSpecifier$1(specifier);
        var result = void 0;
        if (referrer) {
            var r = deserializeSpecifier$1(referrer);
            if (isSpecifierObjectAbsolute$1(r)) {
                assert$1('Specifier must not include a rootName, collection, or namespace when combined with an absolute referrer', s.rootName === undefined && s.collection === undefined && s.namespace === undefined);
                // Look locally in the referrer's namespace
                s.rootName = r.rootName;
                s.collection = r.collection;
                if (s.name) {
                    s.namespace = r.namespace ? r.namespace + '/' + r.name : r.name;
                } else {
                    s.namespace = r.namespace;
                    s.name = r.name;
                }
                if (result = this._serializeAndVerify(s)) {
                    return result;
                }
                // Look for a private collection in the referrer's namespace
                var privateCollection = this._definitiveCollection(s.type);
                if (privateCollection) {
                    s.namespace += '/-' + privateCollection;
                    if (result = this._serializeAndVerify(s)) {
                        return result;
                    }
                }
                // Because local and private resolution has failed, clear all but `name` and `type`
                // to proceed with top-level resolution
                s.rootName = s.collection = s.namespace = undefined;
            } else {
                assert$1('Referrer must either be "absolute" or include a `type` to determine the associated type', r.type);
                // Look in the definitive collection for the associated type
                s.collection = this._definitiveCollection(r.type);
                assert$1('\'' + r.type + '\' does not have a definitive collection', s.collection);
            }
        }
        // If the collection is unspecified, use the definitive collection for the `type`
        if (!s.collection) {
            s.collection = this._definitiveCollection(s.type);
            assert$1('\'' + s.type + '\' does not have a definitive collection', s.collection);
        }
        if (!s.rootName) {
            // If the root name is unspecified, try the app's `rootName` first
            s.rootName = this.config.app.rootName || 'app';
            if (result = this._serializeAndVerify(s)) {
                return result;
            }
            // Then look for an addon with a matching `rootName`
            var addonDef = void 0;
            if (s.namespace) {
                addonDef = this.config.addons && this.config.addons[s.namespace];
                s.rootName = s.namespace;
                s.namespace = undefined;
            } else {
                addonDef = this.config.addons && this.config.addons[s.name];
                s.rootName = s.name;
                s.name = 'main';
            }
        }
        if (result = this._serializeAndVerify(s)) {
            return result;
        }
    };

    Resolver.prototype.retrieve = function retrieve(specifier) {
        return this.registry.get(specifier);
    };

    Resolver.prototype.resolve = function resolve(specifier, referrer) {
        var id = this.identify(specifier, referrer);
        if (id) {
            return this.retrieve(id);
        }
    };

    Resolver.prototype._definitiveCollection = function _definitiveCollection(type) {
        var typeDef = this.config.types[type];
        assert$1('\'' + type + '\' is not a recognized type', typeDef);
        return typeDef.definitiveCollection;
    };

    Resolver.prototype._serializeAndVerify = function _serializeAndVerify(specifier) {
        var serialized = serializeSpecifier$1(specifier);
        if (this.registry.has(serialized)) {
            return serialized;
        }
    };

    return Resolver;
}();

var BasicRegistry = function () {
    function BasicRegistry() {
        var entries = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        classCallCheck(this, BasicRegistry);

        this._entries = entries;
    }

    BasicRegistry.prototype.has = function has(specifier) {
        return specifier in this._entries;
    };

    BasicRegistry.prototype.get = function get$$1(specifier) {
        return this._entries[specifier];
    };

    return BasicRegistry;
}();

function tracked() {
    for (var _len = arguments.length, dependencies = Array(_len), _key = 0; _key < _len; _key++) {
        dependencies[_key] = arguments[_key];
    }

    var target = dependencies[0],
        key = dependencies[1],
        descriptor = dependencies[2];

    if (typeof target === "string") {
        return function (target, key, descriptor) {
            return descriptorForTrackedComputedProperty(target, key, descriptor, dependencies);
        };
    } else {
        if (descriptor) {
            return descriptorForTrackedComputedProperty(target, key, descriptor, []);
        } else {
            installTrackedProperty(target, key);
        }
    }
}
function descriptorForTrackedComputedProperty(target, key, descriptor, dependencies) {
    var meta = metaFor$1(target);
    meta.trackedProperties[key] = true;
    meta.trackedPropertyDependencies[key] = dependencies || [];
    return {
        enumerable: true,
        configurable: false,
        get: descriptor.get,
        set: function set$$1() {
            metaFor$1(this).dirtyableTagFor(key).inner.dirty();
            descriptor.set.apply(this, arguments);
            propertyDidChange();
        }
    };
}
/**
  Installs a getter/setter for change tracking. The accessor
  acts just like a normal property, but it triggers the `propertyDidChange`
  hook when written to.

  Values are saved on the object using a "shadow key," or a symbol based on the
  tracked property name. Sets write the value to the shadow key, and gets read
  from it.
 */
function installTrackedProperty(target, key) {
    var value = void 0;
    var shadowKey = Symbol(key);
    var meta = metaFor$1(target);
    meta.trackedProperties[key] = true;
    if (target[key] !== undefined) {
        value = target[key];
    }
    Object.defineProperty(target, key, {
        configurable: true,
        get: function get$$1() {
            return this[shadowKey];
        },
        set: function set$$1(newValue) {
            metaFor$1(this).dirtyableTagFor(key).inner.dirty();
            this[shadowKey] = newValue;
            propertyDidChange();
        }
    });
}
/**
 * Stores bookkeeping information about tracked properties on the target object
 * and includes helper methods for manipulating and retrieving that data.
 *
 * Computed properties (i.e., tracked getters/setters) deserve some explanation.
 * A computed property is invalidated when either it is set, or one of its
 * dependencies is invalidated. Therefore, we store two tags for each computed
 * property:
 *
 * 1. The dirtyable tag that we invalidate when the setter is invoked.
 * 2. A union tag (tag combinator) of the dirtyable tag and all of the computed
 *    property's dependencies' tags, used by Glimmer to determine "does this
 *    computed property need to be recomputed?"
 */

var Meta$2 = function () {
    function Meta(parent) {
        classCallCheck(this, Meta);

        this.tags = dict();
        this.computedPropertyTags = dict();
        this.trackedProperties = parent ? Object.create(parent.trackedProperties) : dict();
        this.trackedPropertyDependencies = parent ? Object.create(parent.trackedPropertyDependencies) : dict();
    }
    /**
     * The tag representing whether the given property should be recomputed. Used
     * by e.g. Glimmer VM to detect when a property should be re-rendered. Think
     * of this as the "public-facing" tag.
     *
     * For static tracked properties, this is a single DirtyableTag. For computed
     * properties, it is a combinator of the property's DirtyableTag as well as
     * all of its dependencies' tags.
     */


    Meta.prototype.tagFor = function tagFor(key) {
        var tag = this.tags[key];
        if (tag) {
            return tag;
        }
        var dependencies = void 0;
        if (dependencies = this.trackedPropertyDependencies[key]) {
            return this.tags[key] = combinatorForComputedProperties(this, key, dependencies);
        }
        return this.tags[key] = DirtyableTag.create();
    };
    /**
     * The tag used internally to invalidate when a tracked property is set. For
     * static properties, this is the same DirtyableTag returned from `tagFor`.
     * For computed properties, it is the DirtyableTag used as one of the tags in
     * the tag combinator of the CP and its dependencies.
    */


    Meta.prototype.dirtyableTagFor = function dirtyableTagFor(key) {
        var dependencies = this.trackedPropertyDependencies[key];
        var tag = void 0;
        if (dependencies) {
            // The key is for a computed property.
            tag = this.computedPropertyTags[key];
            if (tag) {
                return tag;
            }
            return this.computedPropertyTags[key] = DirtyableTag.create();
        } else {
            // The key is for a static property.
            tag = this.tags[key];
            if (tag) {
                return tag;
            }
            return this.tags[key] = DirtyableTag.create();
        }
    };

    return Meta;
}();

function combinatorForComputedProperties(meta, key, dependencies) {
    // Start off with the tag for the CP's own dirty state.
    var tags = [meta.dirtyableTagFor(key)];
    // Next, add in all of the tags for its dependencies.
    if (dependencies && dependencies.length) {
        for (var i = 0; i < dependencies.length; i++) {
            tags.push(meta.tagFor(dependencies[i]));
        }
    }
    // Return a combinator across the CP's tags and its dependencies' tags.
    return combine(tags);
}
var META = Symbol("ember-object");
function metaFor$1(obj) {
    var meta = obj[META];
    if (meta && hasOwnProperty$1(obj, META)) {
        return meta;
    }
    return obj[META] = new Meta$2(meta);
}
var hOP = Object.prototype.hasOwnProperty;
function hasOwnProperty$1(obj, key) {
    return hOP.call(obj, key);
}
var propertyDidChange = function propertyDidChange() {};
function setPropertyDidChange(cb) {
    propertyDidChange = cb;
}
function hasTag(obj, key) {
    var meta = obj[META];
    if (!obj[META]) {
        return false;
    }
    if (!meta.trackedProperties[key]) {
        return false;
    }
    return true;
}
var UntrackedPropertyError = function (_Error) {
    inherits(UntrackedPropertyError, _Error);

    function UntrackedPropertyError(target, key, message) {
        classCallCheck(this, UntrackedPropertyError);

        var _this = possibleConstructorReturn(this, _Error.call(this, message));

        _this.target = target;
        _this.key = key;
        return _this;
    }

    UntrackedPropertyError.for = function _for(obj, key) {
        return new UntrackedPropertyError(obj, key, 'The property \'' + key + '\' on ' + obj + ' was changed after being rendered. If you want to change a property used in a template after the component has rendered, mark the property as a tracked property with the @tracked decorator.');
    };

    return UntrackedPropertyError;
}(Error);
function defaultErrorThrower(obj, key) {
    throw UntrackedPropertyError.for(obj, key);
}
function tagForProperty(obj, key) {
    var throwError = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultErrorThrower;

    if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj) {
        if (true && !hasTag(obj, key)) {
            installDevModeErrorInterceptor(obj, key, throwError);
        }
        var meta = metaFor$1(obj);
        return meta.tagFor(key);
    } else {
        return CONSTANT_TAG;
    }
}
/**
 * In development mode only, we install an ad hoc setter on properties where a
 * tag is requested (i.e., it was used in a template) without being tracked. In
 * cases where the property is set, we raise an error.
 */
function installDevModeErrorInterceptor(obj, key, throwError) {
    var target = obj;
    var descriptor = void 0;
    // Find the descriptor for the current property. We may need to walk the
    // prototype chain to do so. If the property is undefined, we may never get a
    // descriptor here.
    var hasOwnDescriptor = true;
    while (target) {
        descriptor = Object.getOwnPropertyDescriptor(target, key);
        if (descriptor) {
            break;
        }
        hasOwnDescriptor = false;
        target = Object.getPrototypeOf(target);
    }
    // If possible, define a property descriptor that passes through the current
    // value on reads but throws an exception on writes.
    if (descriptor) {
        if (descriptor.configurable || !hasOwnDescriptor) {
            Object.defineProperty(obj, key, {
                configurable: descriptor.configurable,
                enumerable: descriptor.enumerable,
                get: function get$$1() {
                    if (descriptor.get) {
                        return descriptor.get.call(this);
                    } else {
                        return descriptor.value;
                    }
                },
                set: function set$$1() {
                    throwError(this, key);
                }
            });
        }
    } else {
        Object.defineProperty(obj, key, {
            set: function set$$1() {
                throwError(this, key);
            }
        });
    }
}

var Component = function () {
  /**
   * Constructs a new component and assigns itself the passed properties. You
   * should not construct new components yourself. Instead, Glimmer will
   * instantiate new components automatically as it renders.
   *
   * @param options
   */
  function Component(options) {
    classCallCheck(this, Component);

    /**
     * The element corresponding to the top-level element of the component's template.
     * You should not try to access this property until after the component's `didInsertElement()`
     * lifecycle hook is called.
     */
    this.element = null;
    /**
     * Development-mode only name of the component, useful for debugging.
     */
    this.debugName = null;
    /** @private
     * Slot on the component to save Arguments object passed to the `args` setter.
     */
    this.__args__ = null;
    Object.assign(this, options);
  }
  /**
   * Named arguments passed to the component from its parent component.
   * They can be accessed in JavaScript via `this.args.argumentName` and in the template via `@argumentName`.
   *
   * Say you have the following component, which will have two `args`, `firstName` and `lastName`:
   *
   * ```hbs
   * <my-component @firstName="Arthur" @lastName="Dent" />
   * ```
   *
   * If you needed to calculate `fullName` by combining both of them, you would do:
   *
   * ```ts
   * didInsertElement() {
   *   console.log(`Hi, my full name is ${this.args.firstName} ${this.args.lastName}`);
   * }
   * ```
   *
   * While in the template you could do:
   *
   * ```hbs
   * <p>Welcome, {{@firstName}} {{@lastName}}!</p>
   * ```
   *
   */


  Component.create = function create(injections) {
    return new this(injections);
  };
  /**
   * Called when the component has been inserted into the DOM.
   * Override this function to do any set up that requires an element in the document body.
   */


  Component.prototype.didInsertElement = function didInsertElement() {};
  /**
   * Called when the component has updated and rerendered itself.
   * Called only during a rerender, not during an initial render.
   */


  Component.prototype.didUpdate = function didUpdate() {};
  /**
   * Called before the component has been removed from the DOM.
   */


  Component.prototype.willDestroy = function willDestroy() {};

  Component.prototype.destroy = function destroy() {
    this.willDestroy();
  };

  Component.prototype.toString = function toString() {
    return this.debugName + ' component';
  };

  createClass(Component, [{
    key: 'args',
    get: function get$$1() {
      return this.__args__;
    },
    set: function set$$1(args) {
      this.__args__ = args;
      metaFor$1(this).dirtyableTagFor('args').inner.dirty();
    }
  }]);
  return Component;
}();

var ComponentDefinition$1 = function (_GlimmerComponentDefi) {
    inherits(ComponentDefinition$$1, _GlimmerComponentDefi);

    function ComponentDefinition$$1(name, manager, template, componentFactory) {
        classCallCheck(this, ComponentDefinition$$1);

        var _this = possibleConstructorReturn(this, _GlimmerComponentDefi.call(this, name, manager, null));

        _this.template = template;
        _this.componentFactory = componentFactory;
        return _this;
    }

    ComponentDefinition$$1.prototype.toJSON = function toJSON() {
        return { GlimmerDebug: '<component-definition>' };
    };

    return ComponentDefinition$$1;
}(ComponentDefinition);

var ComponentPathReference = function () {
    function ComponentPathReference() {
        classCallCheck(this, ComponentPathReference);
    }

    ComponentPathReference.prototype.get = function get$$1(key) {
        return PropertyReference$1.create(this, key);
    };

    return ComponentPathReference;
}();
var CachedReference$1 = function (_ComponentPathReferen) {
    inherits(CachedReference$$1, _ComponentPathReferen);

    function CachedReference$$1() {
        classCallCheck(this, CachedReference$$1);

        var _this = possibleConstructorReturn(this, _ComponentPathReferen.apply(this, arguments));

        _this._lastRevision = null;
        _this._lastValue = null;
        return _this;
    }

    CachedReference$$1.prototype.value = function value() {
        var tag = this.tag,
            _lastRevision = this._lastRevision,
            _lastValue = this._lastValue;

        if (!_lastRevision || !tag.validate(_lastRevision)) {
            _lastValue = this._lastValue = this.compute();
            this._lastRevision = tag.value();
        }
        return _lastValue;
    };

    return CachedReference$$1;
}(ComponentPathReference);
var RootReference$1 = function (_ConstReference) {
    inherits(RootReference, _ConstReference);

    function RootReference() {
        classCallCheck(this, RootReference);

        var _this2 = possibleConstructorReturn(this, _ConstReference.apply(this, arguments));

        _this2.children = dict();
        return _this2;
    }

    RootReference.prototype.get = function get$$1(propertyKey) {
        var ref = this.children[propertyKey];
        if (!ref) {
            ref = this.children[propertyKey] = new RootPropertyReference(this.inner, propertyKey);
        }
        return ref;
    };

    return RootReference;
}(ConstReference);
var PropertyReference$1 = function (_CachedReference) {
    inherits(PropertyReference, _CachedReference);

    function PropertyReference() {
        classCallCheck(this, PropertyReference);
        return possibleConstructorReturn(this, _CachedReference.apply(this, arguments));
    }

    PropertyReference.create = function create(parentReference, propertyKey) {
        if (isConst(parentReference)) {
            return new RootPropertyReference(parentReference.value(), propertyKey);
        } else {
            return new NestedPropertyReference(parentReference, propertyKey);
        }
    };

    PropertyReference.prototype.get = function get$$1(key) {
        return new NestedPropertyReference(this, key);
    };

    return PropertyReference;
}(CachedReference$1);
function buildError(obj, key) {
    var message = 'The \'' + key + '\' property on the ' + obj + ' was changed after it had been rendered. Properties that change after being rendered must be tracked. Use the @tracked decorator to mark this as a tracked property.';
    throw new UntrackedPropertyError(obj, key, message);
}
var RootPropertyReference = function (_PropertyReference) {
    inherits(RootPropertyReference, _PropertyReference);

    function RootPropertyReference(parentValue, propertyKey) {
        classCallCheck(this, RootPropertyReference);

        var _this4 = possibleConstructorReturn(this, _PropertyReference.call(this));

        _this4._parentValue = parentValue;
        _this4._propertyKey = propertyKey;
        _this4.tag = tagForProperty(parentValue, propertyKey, buildError);
        return _this4;
    }

    RootPropertyReference.prototype.compute = function compute() {
        return this._parentValue[this._propertyKey];
    };

    return RootPropertyReference;
}(PropertyReference$1);
var NestedPropertyReference = function (_PropertyReference2) {
    inherits(NestedPropertyReference, _PropertyReference2);

    function NestedPropertyReference(parentReference, propertyKey) {
        classCallCheck(this, NestedPropertyReference);

        var _this5 = possibleConstructorReturn(this, _PropertyReference2.call(this));

        var parentReferenceTag = parentReference.tag;
        var parentObjectTag = UpdatableTag.create(CONSTANT_TAG);
        _this5._parentReference = parentReference;
        _this5._parentObjectTag = parentObjectTag;
        _this5._propertyKey = propertyKey;
        _this5.tag = combine([parentReferenceTag, parentObjectTag]);
        return _this5;
    }

    NestedPropertyReference.prototype.compute = function compute() {
        var _parentReference = this._parentReference,
            _parentObjectTag = this._parentObjectTag,
            _propertyKey = this._propertyKey;

        var parentValue = _parentReference.value();
        _parentObjectTag.inner.update(tagForProperty(parentValue, _propertyKey));
        if (typeof parentValue === 'string' && _propertyKey === 'length') {
            return parentValue.length;
        }
        if ((typeof parentValue === 'undefined' ? 'undefined' : _typeof(parentValue)) === 'object' && parentValue) {
            return parentValue[_propertyKey];
        } else {
            return undefined;
        }
    };

    return NestedPropertyReference;
}(PropertyReference$1);
var UpdatableReference$1 = function (_ComponentPathReferen2) {
    inherits(UpdatableReference, _ComponentPathReferen2);

    function UpdatableReference(value) {
        classCallCheck(this, UpdatableReference);

        var _this6 = possibleConstructorReturn(this, _ComponentPathReferen2.call(this));

        _this6.tag = DirtyableTag.create();
        _this6._value = value;
        return _this6;
    }

    UpdatableReference.prototype.value = function value() {
        return this._value;
    };

    UpdatableReference.prototype.update = function update(value) {
        var _value = this._value;

        if (value !== _value) {
            this.tag.inner.dirty();
            this._value = value;
        }
    };

    return UpdatableReference;
}(ComponentPathReference);
var ConditionalReference$1 = function (_GlimmerConditionalRe) {
    inherits(ConditionalReference$$1, _GlimmerConditionalRe);

    function ConditionalReference$$1() {
        classCallCheck(this, ConditionalReference$$1);
        return possibleConstructorReturn(this, _GlimmerConditionalRe.apply(this, arguments));
    }

    ConditionalReference$$1.create = function create(reference) {
        if (isConst(reference)) {
            var value = reference.value();
            return PrimitiveReference.create(value);
        }
        return new ConditionalReference$$1(reference);
    };

    return ConditionalReference$$1;
}(ConditionalReference);

var ComponentStateBucket = function () {
    function ComponentStateBucket(definition, args, owner) {
        classCallCheck(this, ComponentStateBucket);

        var componentFactory = definition.componentFactory;
        var name = definition.name;
        this.args = args;
        var injections = {
            debugName: name,
            args: this.namedArgsSnapshot()
        };
        setOwner(injections, owner);
        this.component = componentFactory.create(injections);
    }

    ComponentStateBucket.prototype.namedArgsSnapshot = function namedArgsSnapshot() {
        return Object.freeze(this.args.named.value());
    };

    return ComponentStateBucket;
}();

var ComponentManager = function () {
    ComponentManager.create = function create(options) {
        return new ComponentManager(options);
    };

    function ComponentManager(options) {
        classCallCheck(this, ComponentManager);

        this.env = options.env;
    }

    ComponentManager.prototype.prepareArgs = function prepareArgs(definition, args) {
        return null;
    };

    ComponentManager.prototype.create = function create(environment, definition, volatileArgs) {
        var componentFactory = definition.componentFactory;
        if (!componentFactory) {
            return null;
        }
        var owner = getOwner(this.env);
        return new ComponentStateBucket(definition, volatileArgs.capture(), owner);
    };

    ComponentManager.prototype.createComponentDefinition = function createComponentDefinition(name, template, componentFactory) {
        return new ComponentDefinition$1(name, this, template, componentFactory);
    };

    ComponentManager.prototype.layoutFor = function layoutFor(definition, bucket, env) {
        var template = definition.template;
        var compiledLayout = template.asLayout().compileDynamic(this.env);
        return compiledLayout;
    };

    ComponentManager.prototype.getSelf = function getSelf(bucket) {
        if (!bucket) {
            return null;
        }
        return new RootReference$1(bucket.component);
    };

    ComponentManager.prototype.didCreateElement = function didCreateElement(bucket, element) {
        if (!bucket) {
            return;
        }
        bucket.component.element = element;
    };

    ComponentManager.prototype.didRenderLayout = function didRenderLayout(bucket, bounds) {};

    ComponentManager.prototype.didCreate = function didCreate(bucket) {
        bucket && bucket.component.didInsertElement();
    };

    ComponentManager.prototype.getTag = function getTag() {
        return null;
    };

    ComponentManager.prototype.update = function update(bucket, scope) {
        if (!bucket) {
            return;
        }
        // TODO: This should be moved to `didUpdate`, but there's currently a
        // Glimmer bug that causes it not to be called if the layout doesn't update.
        var component = bucket.component;

        component.args = bucket.namedArgsSnapshot();
        component.didUpdate();
    };

    ComponentManager.prototype.didUpdateLayout = function didUpdateLayout() {};

    ComponentManager.prototype.didUpdate = function didUpdate(bucket) {};

    ComponentManager.prototype.getDestructor = function getDestructor(bucket) {
        if (!bucket) {
            return;
        }
        return bucket.component;
    };

    return ComponentManager;
}();

var ArticleCard = function (_Component) {
  inherits(ArticleCard, _Component);

  function ArticleCard() {
    classCallCheck(this, ArticleCard);
    return possibleConstructorReturn(this, _Component.apply(this, arguments));
  }

  return ArticleCard;
}(Component);

var __ui_components_article_card_template__ = { "id": "RP6vkiAY", "block": "{\"symbols\":[\"@article\",\"@didRead\"],\"prelude\":[[6,\"div\"]],\"head\":[[10,\"class\",[26,[\"was-read-\",[19,1,[\"read\"]]]]],[7]],\"statements\":[[0,\"\\n\"],[0,\"  \"],[6,\"h1\"],[9,\"class\",\"title is-5\"],[7],[1,[19,1,[\"title\"]],false],[8],[0,\"\\n  \"],[6,\"p\"],[7],[0,\"\\n    \"],[1,[19,1,[\"description\"]],false],[0,\" \"],[6,\"a\"],[9,\"href\",\"#\"],[10,\"onclick\",[19,2,[]],null],[7],[1,[19,1,[\"teaser\"]],false],[8],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "specifier": "template:/website/components/article-card", "<template-meta>": true } };

/** Detect free variable `global` from Node.js. */
var freeGlobal = (typeof global === 'undefined' ? 'undefined' : _typeof(global)) == 'object' && global && global.Object === Object && global;

var freeSelf = (typeof self === 'undefined' ? 'undefined' : _typeof(self)) == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

var _Symbol = root.Symbol;

var objectProto$1 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$3 = objectProto$1.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto$1.toString;

/** Built-in value references. */
var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty$3.call(value, symToStringTag$1),
      tag = value[symToStringTag$1];

  try {
    value[symToStringTag$1] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}

/** Used for built-in method references. */
var objectProto$2 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$2.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

var nullTag = '[object Null]';
var undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function (arg) {
    return func(transform(arg));
  };
}

var getPrototype = overArg(Object.getPrototypeOf, Object);

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object';
}

var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto = Function.prototype;
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty$2.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
}

function symbolObservablePonyfill(root) {
	var result;
	var _Symbol = root.Symbol;

	if (typeof _Symbol === 'function') {
		if (_Symbol.observable) {
			result = _Symbol.observable;
		} else {
			result = _Symbol('observable');
			_Symbol.observable = result;
		}
	} else {
		result = '@@observable';
	}

	return result;
}

/* global window */
var root$2;

if (typeof self !== 'undefined') {
  root$2 = self;
} else if (typeof window !== 'undefined') {
  root$2 = window;
} else if (typeof global !== 'undefined') {
  root$2 = global;
} else if (typeof module !== 'undefined') {
  root$2 = module;
} else {
  root$2 = Function('return this')();
}

var result = symbolObservablePonyfill(root$2);

var ActionTypes = {
  INIT: '@@redux/INIT'
};

/**
 * Creates a Redux store that holds the state tree.
 * The only way to change the data in the store is to call `dispatch()` on it.
 *
 * There should only be a single store in your app. To specify how different
 * parts of the state tree respond to actions, you may combine several reducers
 * into a single reducer function by using `combineReducers`.
 *
 * @param {Function} reducer A function that returns the next state tree, given
 * the current state tree and the action to handle.
 *
 * @param {any} [preloadedState] The initial state. You may optionally specify it
 * to hydrate the state from the server in universal apps, or to restore a
 * previously serialized user session.
 * If you use `combineReducers` to produce the root reducer function, this must be
 * an object with the same shape as `combineReducers` keys.
 *
 * @param {Function} enhancer The store enhancer. You may optionally specify it
 * to enhance the store with third-party capabilities such as middleware,
 * time travel, persistence, etc. The only store enhancer that ships with Redux
 * is `applyMiddleware()`.
 *
 * @returns {Store} A Redux store that lets you read the state, dispatch actions
 * and subscribe to changes.
 */
function createStore(reducer, preloadedState, enhancer) {
  var _ref2;

  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.');
    }

    return enhancer(createStore)(reducer, preloadedState);
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }

  var currentReducer = reducer;
  var currentState = preloadedState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }

  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */
  function getState() {
    return currentState;
  }

  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked, this
   * will not have any effect on the `dispatch()` that is currently in progress.
   * However, the next `dispatch()` call, whether nested or not, will use a more
   * recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all state changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */
  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected listener to be a function.');
    }

    var isSubscribed = true;

    ensureCanMutateNextListeners();
    nextListeners.push(listener);

    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      isSubscribed = false;

      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
    };
  }

  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */
  function dispatch(action) {
    if (!isPlainObject(action)) {
      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
    }

    if (typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    var listeners = currentListeners = nextListeners;
    for (var i = 0; i < listeners.length; i++) {
      listeners[i]();
    }

    return action;
  }

  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.');
    }

    currentReducer = nextReducer;
    dispatch({ type: ActionTypes.INIT });
  }

  /**
   * Interoperability point for observable/reactive libraries.
   * @returns {observable} A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/zenparsing/es-observable
   */
  function observable() {
    var _ref;

    var outerSubscribe = subscribe;
    return _ref = {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe: function subscribe(observer) {
        if ((typeof observer === 'undefined' ? 'undefined' : _typeof(observer)) !== 'object') {
          throw new TypeError('Expected the observer to be an object.');
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }

        observeState();
        var unsubscribe = outerSubscribe(observeState);
        return { unsubscribe: unsubscribe };
      }
    }, _ref[result] = function () {
      return this;
    }, _ref;
  }

  // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.
  dispatch({ type: ActionTypes.INIT });

  return _ref2 = {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState,
    replaceReducer: replaceReducer
  }, _ref2[result] = observable, _ref2;
}

/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */
function warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
  /* eslint-enable no-console */
  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message);
    /* eslint-disable no-empty */
  } catch (e) {}
  /* eslint-enable no-empty */
}

/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */

function isCrushed() {}

if ("production" !== 'production' && typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
  warning('You are currently using minified code outside of NODE_ENV === \'production\'. ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' + 'to ensure you have the correct code for your production build.');
}

var articles = [{
    title: 'A Practical Approach',
    description: 'Hello glimmer-redux',
    teaser: 'read more',
    read: false,
    markdown: './-utils/md/articles/foo.md'
}, {
    title: 'Keep Learning Free',
    description: 'Hello glimmer-redux',
    teaser: 'read more',
    read: false,
    markdown: './-utils/md/articles/foo.md'
}, {
    title: 'Contributors & Curators',
    description: 'Hello glimmer-redux',
    teaser: 'read more',
    read: false,
    markdown: './-utils/md/articles/foo.md'
}, {
    title: 'Start Learning on Your Own',
    description: 'Hello glimmer-redux',
    teaser: 'read more',
    read: false,
    markdown: './-utils/md/articles/foo.md'
}];
function ArticlesReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : articles;
    var action = arguments[1];

    // TODO where would an async fetch belong? 
    switch (action.type) {
        case 'MARK_AS_READ':
            return state.map(function (article, index) {
                if (index === action.index) {
                    return Object.assign({}, article, { read: true });
                }
                return article;
            });
        default:
            return state;
    }
}

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var Website = function (_Component) {
    inherits(Website, _Component);

    function Website(options) {
        classCallCheck(this, Website);

        /**
          Create a redux store using the reducer
                 @property store
        */
        var _this = possibleConstructorReturn(this, _Component.call(this, options));

        _this.store = createStore(ArticlesReducer);
        /**
          Get the current state of the articles model from the store
                 @property articles
        */
        _this.articles = _this.store.getState();
        // REVIEW async belong here or with redux?
        // this.loadArticles();
        return _this;
    }

    Website.prototype.loadArticles = function loadArticles() {
        return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));
    };
    /**
      Proxy the store.dispatch function
         @method dispatch
    */


    Website.prototype.dispatch = function dispatch() {
        var _store;

        return (_store = this.store).dispatch.apply(_store, arguments);
    };
    /**
      Tell the store that the item has been read
         @method markAsRead
    */


    Website.prototype.markAsRead = function markAsRead(index, e) {
        e.preventDefault();
        // dispatch an action created on the fly to update the store
        this.dispatch({
            type: 'MARK_AS_READ',
            index: index
        });
        // update glimmer tracked prop
        this.articles = this.store.getState();
    };

    return Website;
}(Component);

__decorate([tracked], Website.prototype, "articles", void 0);

var __ui_components_website_app_template__ = { "id": "jiAVUZdq", "block": "{\"symbols\":[\"article\",\"index\"],\"prelude\":[[6,\"header\"]],\"head\":[[7]],\"statements\":[[0,\"\\n  \"],[6,\"nav\"],[9,\"class\",\"nav no-backgound\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"nav-left\"],[7],[0,\"\\n      \"],[6,\"div\"],[9,\"class\",\"nav--logo nav-item\"],[7],[0,\"\\n        \"],[6,\"span\"],[9,\"class\",\"icon\"],[7],[0,\"{ \"],[6,\"span\"],[9,\"class\",\"upsidedown\"],[7],[0,\";\"],[8],[0,\" }\"],[8],[0,\" Code-Heads Club\\n      \"],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"nav-right\"],[7],[0,\"\\n      \"],[6,\"a\"],[9,\"class\",\"nav-item\"],[7],[0,\"\\n        About\\n      \"],[8],[0,\"\\n      \"],[6,\"a\"],[9,\"class\",\"nav-item\"],[7],[0,\"\\n        \"],[6,\"a\"],[9,\"href\",\"#\"],[9,\"class\",\"button is-info is-outlined\"],[7],[0,\"\\n          \"],[6,\"i\"],[9,\"class\",\"icon fa fa-github\"],[7],[8],[0,\" GitHub\\n        \"],[8],[0,\"\\n      \"],[8],[0,\"\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n\\n  \"],[6,\"section\"],[9,\"class\",\"hero is-info no-backgound has-text-centered\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"hero-body\"],[7],[0,\"\\n      \"],[6,\"h1\"],[9,\"class\",\"title\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"hero--logo\"],[7],[0,\"\\n          \"],[6,\"img\"],[9,\"src\",\"img/logo_single_color.svg\"],[9,\"alt\",\"Code-heads Club Logo\"],[7],[8],[0,\"\\n        \"],[8],[0,\"\\n      \"],[8],[0,\"\\n      \"],[6,\"div\"],[9,\"class\",\"content subtitle\"],[7],[0,\"\\n        \"],[6,\"p\"],[7],[0,\"\\n          The Code-Heads Club is partnership between Engineers and Students.\\n          \"],[6,\"br\"],[7],[8],[0,\"\\n          Our mission is to maintain a \"],[6,\"strong\"],[7],[0,\"free\"],[8],[0,\" curriculum for young adults learning to code.\\n        \"],[8],[0,\"\\n      \"],[8],[0,\"\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\\n\"],[6,\"main\"],[7],[0,\"\\n  \"],[6,\"section\"],[9,\"class\",\"section\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"columns\"],[7],[0,\"\\n\"],[4,\"each\",[[19,0,[\"articles\"]]],[[\"key\"],[\"@index\"]],{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"column\"],[7],[0,\"\\n          \"],[6,\"div\"],[9,\"class\",\"box\"],[7],[0,\"\\n            \"],[5,\"article-card\",[],[[\"@article\",\"@didRead\"],[[19,1,[]],[25,\"action\",[[19,0,[\"markAsRead\"]],[19,2,[]]],null]]],{\"statements\":[],\"parameters\":[]}],[0,\"\\n          \"],[8],[0,\"\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[1,2]},null],[0,\"    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "specifier": "template:/website/components/website-app", "<template-meta>": true } };

var moduleMap = { 'component:/website-app/components/article-card': ArticleCard, 'template:/website-app/components/article-card': __ui_components_article_card_template__, 'component:/website-app/components/website-app': Website, 'template:/website-app/components/website-app': __ui_components_website_app_template__ };

var resolverConfiguration = { "app": { "name": "website-app", "rootName": "website-app" }, "types": { "application": { "definitiveCollection": "main" }, "component": { "definitiveCollection": "components" }, "helper": { "definitiveCollection": "components" }, "renderer": { "definitiveCollection": "main" }, "template": { "definitiveCollection": "components" } }, "collections": { "main": { "types": ["application", "renderer"] }, "components": { "group": "ui", "types": ["component", "template", "helper"], "defaultType": "component", "privateCollections": ["utils"] }, "styles": { "group": "ui", "unresolvable": true }, "utils": { "unresolvable": true } } };

var App = function (_Application) {
    inherits(App, _Application);

    function App() {
        classCallCheck(this, App);

        var moduleRegistry = new BasicRegistry(moduleMap);
        var resolver = new Resolver(resolverConfiguration, moduleRegistry);
        return possibleConstructorReturn(this, _Application.call(this, {
            rootName: resolverConfiguration.app.rootName,
            resolver: resolver
        }));
    }

    return App;
}(Application);

var app = new App();
var containerElement = document.getElementById('app');
setPropertyDidChange(function () {
    app.scheduleRerender();
});
app.registerInitializer({
    initialize: function initialize(registry) {
        registry.register('component-manager:/' + app.rootName + '/component-managers/main', ComponentManager);
    }
});
app.renderComponent('website-app', containerElement, null);
app.boot();

})));

//# sourceMappingURL=app.js.map
