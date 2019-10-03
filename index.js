'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path$2 = _interopDefault(require('path'));
var typescript = _interopDefault(require('typescript'));
var fs = _interopDefault(require('fs'));
var util = _interopDefault(require('util'));
var events = _interopDefault(require('events'));
var assert = _interopDefault(require('assert'));

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

function getCjsExportFromNamespace (n) {
	return n && n['default'] || n;
}

var O = 'object';
var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global_1 =
  // eslint-disable-next-line no-undef
  check(typeof globalThis == O && globalThis) ||
  check(typeof window == O && window) ||
  check(typeof self == O && self) ||
  check(typeof commonjsGlobal == O && commonjsGlobal) ||
  // eslint-disable-next-line no-new-func
  Function('return this')();

var fails = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};

// Thank's IE8 for his funny defineProperty
var descriptors = !fails(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable
var f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : nativePropertyIsEnumerable;

var objectPropertyIsEnumerable = {
	f: f
};

var createPropertyDescriptor = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var toString = {}.toString;

var classofRaw = function (it) {
  return toString.call(it).slice(8, -1);
};

var split = ''.split;

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var indexedObject = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins
  return !Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
} : Object;

// `RequireObjectCoercible` abstract operation
// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
var requireObjectCoercible = function (it) {
  if (it == undefined) throw TypeError("Can't call method on " + it);
  return it;
};

// toObject with fallback for non-array-like ES3 strings



var toIndexedObject = function (it) {
  return indexedObject(requireObjectCoercible(it));
};

var isObject = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

// `ToPrimitive` abstract operation
// https://tc39.github.io/ecma262/#sec-toprimitive
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
var toPrimitive = function (input, PREFERRED_STRING) {
  if (!isObject(input)) return input;
  var fn, val;
  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  throw TypeError("Can't convert object to primitive value");
};

var hasOwnProperty = {}.hasOwnProperty;

var has = function (it, key) {
  return hasOwnProperty.call(it, key);
};

var document = global_1.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

var documentCreateElement = function (it) {
  return EXISTS ? document.createElement(it) : {};
};

// Thank's IE8 for his funny defineProperty
var ie8DomDefine = !descriptors && !fails(function () {
  return Object.defineProperty(documentCreateElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});

var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
var f$1 = descriptors ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPrimitive(P, true);
  if (ie8DomDefine) try {
    return nativeGetOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
};

var objectGetOwnPropertyDescriptor = {
	f: f$1
};

var anObject = function (it) {
  if (!isObject(it)) {
    throw TypeError(String(it) + ' is not an object');
  } return it;
};

var nativeDefineProperty = Object.defineProperty;

// `Object.defineProperty` method
// https://tc39.github.io/ecma262/#sec-object.defineproperty
var f$2 = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (ie8DomDefine) try {
    return nativeDefineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var objectDefineProperty = {
	f: f$2
};

var hide = descriptors ? function (object, key, value) {
  return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

var setGlobal = function (key, value) {
  try {
    hide(global_1, key, value);
  } catch (error) {
    global_1[key] = value;
  } return value;
};

var shared = createCommonjsModule(function (module) {
var SHARED = '__core-js_shared__';
var store = global_1[SHARED] || setGlobal(SHARED, {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.2.1',
  mode:  'global',
  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
});
});

var functionToString = shared('native-function-to-string', Function.toString);

var WeakMap$1 = global_1.WeakMap;

var nativeWeakMap = typeof WeakMap$1 === 'function' && /native code/.test(functionToString.call(WeakMap$1));

var id = 0;
var postfix = Math.random();

var uid = function (key) {
  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
};

var keys = shared('keys');

var sharedKey = function (key) {
  return keys[key] || (keys[key] = uid(key));
};

var hiddenKeys = {};

var WeakMap$2 = global_1.WeakMap;
var set, get, has$1;

var enforce = function (it) {
  return has$1(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (nativeWeakMap) {
  var store = new WeakMap$2();
  var wmget = store.get;
  var wmhas = store.has;
  var wmset = store.set;
  set = function (it, metadata) {
    wmset.call(store, it, metadata);
    return metadata;
  };
  get = function (it) {
    return wmget.call(store, it) || {};
  };
  has$1 = function (it) {
    return wmhas.call(store, it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    hide(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return has(it, STATE) ? it[STATE] : {};
  };
  has$1 = function (it) {
    return has(it, STATE);
  };
}

var internalState = {
  set: set,
  get: get,
  has: has$1,
  enforce: enforce,
  getterFor: getterFor
};

var redefine = createCommonjsModule(function (module) {
var getInternalState = internalState.get;
var enforceInternalState = internalState.enforce;
var TEMPLATE = String(functionToString).split('toString');

shared('inspectSource', function (it) {
  return functionToString.call(it);
});

(module.exports = function (O, key, value, options) {
  var unsafe = options ? !!options.unsafe : false;
  var simple = options ? !!options.enumerable : false;
  var noTargetGet = options ? !!options.noTargetGet : false;
  if (typeof value == 'function') {
    if (typeof key == 'string' && !has(value, 'name')) hide(value, 'name', key);
    enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');
  }
  if (O === global_1) {
    if (simple) O[key] = value;
    else setGlobal(key, value);
    return;
  } else if (!unsafe) {
    delete O[key];
  } else if (!noTargetGet && O[key]) {
    simple = true;
  }
  if (simple) O[key] = value;
  else hide(O, key, value);
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, 'toString', function toString() {
  return typeof this == 'function' && getInternalState(this).source || functionToString.call(this);
});
});

var path = global_1;

var aFunction = function (variable) {
  return typeof variable == 'function' ? variable : undefined;
};

var getBuiltIn = function (namespace, method) {
  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global_1[namespace])
    : path[namespace] && path[namespace][method] || global_1[namespace] && global_1[namespace][method];
};

var ceil = Math.ceil;
var floor = Math.floor;

// `ToInteger` abstract operation
// https://tc39.github.io/ecma262/#sec-tointeger
var toInteger = function (argument) {
  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
};

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.github.io/ecma262/#sec-tolength
var toLength = function (argument) {
  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};

var max = Math.max;
var min$1 = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(length, length).
var toAbsoluteIndex = function (index, length) {
  var integer = toInteger(index);
  return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
};

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

var arrayIncludes = {
  // `Array.prototype.includes` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};

var indexOf = arrayIncludes.indexOf;


var objectKeysInternal = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~indexOf(result, key) || result.push(key);
  }
  return result;
};

// IE8- don't enum bug keys
var enumBugKeys = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];

var hiddenKeys$1 = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertynames
var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return objectKeysInternal(O, hiddenKeys$1);
};

var objectGetOwnPropertyNames = {
	f: f$3
};

var f$4 = Object.getOwnPropertySymbols;

var objectGetOwnPropertySymbols = {
	f: f$4
};

// all object keys, includes non-enumerable and symbols
var ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = objectGetOwnPropertyNames.f(anObject(it));
  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
};

var copyConstructorProperties = function (target, source) {
  var keys = ownKeys(source);
  var defineProperty = objectDefineProperty.f;
  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
  }
};

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : typeof detection == 'function' ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

var isForced_1 = isForced;

var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;






/*
  options.target      - name of the target object
  options.global      - target is the global object
  options.stat        - export as static methods of target
  options.proto       - export as prototype methods of target
  options.real        - real prototype method for the `pure` version
  options.forced      - export even if the native feature is available
  options.bind        - bind methods to the target, required for the `pure` version
  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
  options.sham        - add a flag to not completely full polyfills
  options.enumerable  - export as enumerable property
  options.noTargetGet - prevent calling a getter on target
*/
var _export = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global_1;
  } else if (STATIC) {
    target = global_1[TARGET] || setGlobal(TARGET, {});
  } else {
    target = (global_1[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.noTargetGet) {
      descriptor = getOwnPropertyDescriptor$1(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty === typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      hide(sourceProperty, 'sham', true);
    }
    // extend global
    redefine(target, key, sourceProperty, options);
  }
};

// `IsArray` abstract operation
// https://tc39.github.io/ecma262/#sec-isarray
var isArray = Array.isArray || function isArray(arg) {
  return classofRaw(arg) == 'Array';
};

// `ToObject` abstract operation
// https://tc39.github.io/ecma262/#sec-toobject
var toObject = function (argument) {
  return Object(requireObjectCoercible(argument));
};

var createProperty = function (object, key, value) {
  var propertyKey = toPrimitive(key);
  if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
  else object[propertyKey] = value;
};

var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
  // Chrome 38 Symbol has incorrect toString conversion
  // eslint-disable-next-line no-undef
  return !String(Symbol());
});

var Symbol$1 = global_1.Symbol;
var store$1 = shared('wks');

var wellKnownSymbol = function (name) {
  return store$1[name] || (store$1[name] = nativeSymbol && Symbol$1[name]
    || (nativeSymbol ? Symbol$1 : uid)('Symbol.' + name));
};

var SPECIES = wellKnownSymbol('species');

// `ArraySpeciesCreate` abstract operation
// https://tc39.github.io/ecma262/#sec-arrayspeciescreate
var arraySpeciesCreate = function (originalArray, length) {
  var C;
  if (isArray(originalArray)) {
    C = originalArray.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    else if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
};

var SPECIES$1 = wellKnownSymbol('species');

var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
  return !fails(function () {
    var array = [];
    var constructor = array.constructor = {};
    constructor[SPECIES$1] = function () {
      return { foo: 1 };
    };
    return array[METHOD_NAME](Boolean).foo !== 1;
  });
};

var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';

var IS_CONCAT_SPREADABLE_SUPPORT = !fails(function () {
  var array = [];
  array[IS_CONCAT_SPREADABLE] = false;
  return array.concat()[0] !== array;
});

var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

var isConcatSpreadable = function (O) {
  if (!isObject(O)) return false;
  var spreadable = O[IS_CONCAT_SPREADABLE];
  return spreadable !== undefined ? !!spreadable : isArray(O);
};

var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

// `Array.prototype.concat` method
// https://tc39.github.io/ecma262/#sec-array.prototype.concat
// with adding support of @@isConcatSpreadable and @@species
_export({ target: 'Array', proto: true, forced: FORCED }, {
  concat: function concat(arg) { // eslint-disable-line no-unused-vars
    var O = toObject(this);
    var A = arraySpeciesCreate(O, 0);
    var n = 0;
    var i, k, length, len, E;
    for (i = -1, length = arguments.length; i < length; i++) {
      E = i === -1 ? O : arguments[i];
      if (isConcatSpreadable(E)) {
        len = toLength(E.length);
        if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
      } else {
        if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
        createProperty(A, n++, E);
      }
    }
    A.length = n;
    return A;
  }
});

// `Object.keys` method
// https://tc39.github.io/ecma262/#sec-object.keys
var objectKeys = Object.keys || function keys(O) {
  return objectKeysInternal(O, enumBugKeys);
};

// `Object.defineProperties` method
// https://tc39.github.io/ecma262/#sec-object.defineproperties
var objectDefineProperties = descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) objectDefineProperty.f(O, key = keys[index++], Properties[key]);
  return O;
};

var html = getBuiltIn('document', 'documentElement');

var IE_PROTO = sharedKey('IE_PROTO');

var PROTOTYPE = 'prototype';
var Empty = function () { /* empty */ };

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var length = enumBugKeys.length;
  var lt = '<';
  var script = 'script';
  var gt = '>';
  var js = 'java' + script + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  iframe.src = String(js);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + script + gt + 'document.F=Object' + lt + '/' + script + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (length--) delete createDict[PROTOTYPE][enumBugKeys[length]];
  return createDict();
};

// `Object.create` method
// https://tc39.github.io/ecma262/#sec-object.create
var objectCreate = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : objectDefineProperties(result, Properties);
};

hiddenKeys[IE_PROTO] = true;

var UNSCOPABLES = wellKnownSymbol('unscopables');
var ArrayPrototype = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype[UNSCOPABLES] == undefined) {
  hide(ArrayPrototype, UNSCOPABLES, objectCreate(null));
}

// add a key to Array.prototype[@@unscopables]
var addToUnscopables = function (key) {
  ArrayPrototype[UNSCOPABLES][key] = true;
};

var $includes = arrayIncludes.includes;


// `Array.prototype.includes` method
// https://tc39.github.io/ecma262/#sec-array.prototype.includes
_export({ target: 'Array', proto: true }, {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('includes');

var nativeAssign = Object.assign;

// `Object.assign` method
// https://tc39.github.io/ecma262/#sec-object.assign
// should work with symbols and should have deterministic property order (V8 bug)
var objectAssign = !nativeAssign || fails(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var symbol = Symbol();
  var alphabet = 'abcdefghijklmnopqrst';
  A[symbol] = 7;
  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
  return nativeAssign({}, A)[symbol] != 7 || objectKeys(nativeAssign({}, B)).join('') != alphabet;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var argumentsLength = arguments.length;
  var index = 1;
  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
  var propertyIsEnumerable = objectPropertyIsEnumerable.f;
  while (argumentsLength > index) {
    var S = indexedObject(arguments[index++]);
    var keys = getOwnPropertySymbols ? objectKeys(S).concat(getOwnPropertySymbols(S)) : objectKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!descriptors || propertyIsEnumerable.call(S, key)) T[key] = S[key];
    }
  } return T;
} : nativeAssign;

// `Object.assign` method
// https://tc39.github.io/ecma262/#sec-object.assign
_export({ target: 'Object', stat: true, forced: Object.assign !== objectAssign }, {
  assign: objectAssign
});

var MATCH = wellKnownSymbol('match');

// `IsRegExp` abstract operation
// https://tc39.github.io/ecma262/#sec-isregexp
var isRegexp = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classofRaw(it) == 'RegExp');
};

var notARegexp = function (it) {
  if (isRegexp(it)) {
    throw TypeError("The method doesn't accept regular expressions");
  } return it;
};

var MATCH$1 = wellKnownSymbol('match');

var correctIsRegexpLogic = function (METHOD_NAME) {
  var regexp = /./;
  try {
    '/./'[METHOD_NAME](regexp);
  } catch (e) {
    try {
      regexp[MATCH$1] = false;
      return '/./'[METHOD_NAME](regexp);
    } catch (f) { /* empty */ }
  } return false;
};

// `String.prototype.includes` method
// https://tc39.github.io/ecma262/#sec-string.prototype.includes
_export({ target: 'String', proto: true, forced: !correctIsRegexpLogic('includes') }, {
  includes: function includes(searchString /* , position = 0 */) {
    return !!~String(requireObjectCoercible(this))
      .indexOf(notARegexp(searchString), arguments.length > 1 ? arguments[1] : undefined);
  }
});

var aFunction$1 = function (it) {
  if (typeof it != 'function') {
    throw TypeError(String(it) + ' is not a function');
  } return it;
};

// optional / simple context binding
var bindContext = function (fn, that, length) {
  aFunction$1(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 0: return function () {
      return fn.call(that);
    };
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

var push = [].push;

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex }` methods implementation
var createMethod$1 = function (TYPE) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  return function ($this, callbackfn, that, specificCreate) {
    var O = toObject($this);
    var self = indexedObject(O);
    var boundFunction = bindContext(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var create = specificCreate || arraySpeciesCreate;
    var target = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var value, result;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (TYPE) {
        if (IS_MAP) target[index] = result; // map
        else if (result) switch (TYPE) {
          case 3: return true;              // some
          case 5: return value;             // find
          case 6: return index;             // findIndex
          case 2: push.call(target, value); // filter
        } else if (IS_EVERY) return false;  // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
  };
};

var arrayIteration = {
  // `Array.prototype.forEach` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
  forEach: createMethod$1(0),
  // `Array.prototype.map` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.map
  map: createMethod$1(1),
  // `Array.prototype.filter` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.filter
  filter: createMethod$1(2),
  // `Array.prototype.some` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.some
  some: createMethod$1(3),
  // `Array.prototype.every` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.every
  every: createMethod$1(4),
  // `Array.prototype.find` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.find
  find: createMethod$1(5),
  // `Array.prototype.findIndex` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
  findIndex: createMethod$1(6)
};

var $filter = arrayIteration.filter;


// `Array.prototype.filter` method
// https://tc39.github.io/ecma262/#sec-array.prototype.filter
// with adding support of @@species
_export({ target: 'Array', proto: true, forced: !arrayMethodHasSpeciesSupport('filter') }, {
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

var $map = arrayIteration.map;


// `Array.prototype.map` method
// https://tc39.github.io/ecma262/#sec-array.prototype.map
// with adding support of @@species
_export({ target: 'Array', proto: true, forced: !arrayMethodHasSpeciesSupport('map') }, {
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

var SPECIES$2 = wellKnownSymbol('species');
var nativeSlice = [].slice;
var max$1 = Math.max;

// `Array.prototype.slice` method
// https://tc39.github.io/ecma262/#sec-array.prototype.slice
// fallback for not array-like ES3 strings and DOM objects
_export({ target: 'Array', proto: true, forced: !arrayMethodHasSpeciesSupport('slice') }, {
  slice: function slice(start, end) {
    var O = toIndexedObject(this);
    var length = toLength(O.length);
    var k = toAbsoluteIndex(start, length);
    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
    var Constructor, result, n;
    if (isArray(O)) {
      Constructor = O.constructor;
      // cross-realm fallback
      if (typeof Constructor == 'function' && (Constructor === Array || isArray(Constructor.prototype))) {
        Constructor = undefined;
      } else if (isObject(Constructor)) {
        Constructor = Constructor[SPECIES$2];
        if (Constructor === null) Constructor = undefined;
      }
      if (Constructor === Array || Constructor === undefined) {
        return nativeSlice.call(O, k, fin);
      }
    }
    result = new (Constructor === undefined ? Array : Constructor)(max$1(fin - k, 0));
    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
    result.length = n;
    return result;
  }
});

var sloppyArrayMethod = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !method || !fails(function () {
    // eslint-disable-next-line no-useless-call,no-throw-literal
    method.call(null, argument || function () { throw 1; }, 1);
  });
};

var nativeSort = [].sort;
var test = [1, 2, 3];

// IE8-
var FAILS_ON_UNDEFINED = fails(function () {
  test.sort(undefined);
});
// V8 bug
var FAILS_ON_NULL = fails(function () {
  test.sort(null);
});
// Old WebKit
var SLOPPY_METHOD = sloppyArrayMethod('sort');

var FORCED$1 = FAILS_ON_UNDEFINED || !FAILS_ON_NULL || SLOPPY_METHOD;

// `Array.prototype.sort` method
// https://tc39.github.io/ecma262/#sec-array.prototype.sort
_export({ target: 'Array', proto: true, forced: FORCED$1 }, {
  sort: function sort(comparefn) {
    return comparefn === undefined
      ? nativeSort.call(toObject(this))
      : nativeSort.call(toObject(this), aFunction$1(comparefn));
  }
});

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
var classof = function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
};

var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');
var test$1 = {};

test$1[TO_STRING_TAG$1] = 'z';

// `Object.prototype.toString` method implementation
// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
var objectToString = String(test$1) !== '[object z]' ? function toString() {
  return '[object ' + classof(this) + ']';
} : test$1.toString;

var ObjectPrototype = Object.prototype;

// `Object.prototype.toString` method
// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
if (objectToString !== ObjectPrototype.toString) {
  redefine(ObjectPrototype, 'toString', objectToString, { unsafe: true });
}

var aPossiblePrototype = function (it) {
  if (!isObject(it) && it !== null) {
    throw TypeError("Can't set " + String(it) + ' as a prototype');
  } return it;
};

// `Object.setPrototypeOf` method
// https://tc39.github.io/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
    setter.call(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    anObject(O);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER) setter.call(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);

// makes subclassing work correct for wrapped built-ins
var inheritIfRequired = function ($this, dummy, Wrapper) {
  var NewTarget, NewTargetPrototype;
  if (
    // it can work only with native `setPrototypeOf`
    objectSetPrototypeOf &&
    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
    typeof (NewTarget = dummy.constructor) == 'function' &&
    NewTarget !== Wrapper &&
    isObject(NewTargetPrototype = NewTarget.prototype) &&
    NewTargetPrototype !== Wrapper.prototype
  ) objectSetPrototypeOf($this, NewTargetPrototype);
  return $this;
};

// `RegExp.prototype.flags` getter implementation
// https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags
var regexpFlags = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.dotAll) result += 's';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};

var SPECIES$3 = wellKnownSymbol('species');

var setSpecies = function (CONSTRUCTOR_NAME) {
  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
  var defineProperty = objectDefineProperty.f;

  if (descriptors && Constructor && !Constructor[SPECIES$3]) {
    defineProperty(Constructor, SPECIES$3, {
      configurable: true,
      get: function () { return this; }
    });
  }
};

var defineProperty = objectDefineProperty.f;
var getOwnPropertyNames = objectGetOwnPropertyNames.f;







var MATCH$2 = wellKnownSymbol('match');
var NativeRegExp = global_1.RegExp;
var RegExpPrototype = NativeRegExp.prototype;
var re1 = /a/g;
var re2 = /a/g;

// "new" should create a new object, old webkit bug
var CORRECT_NEW = new NativeRegExp(re1) !== re1;

var FORCED$2 = descriptors && isForced_1('RegExp', (!CORRECT_NEW || fails(function () {
  re2[MATCH$2] = false;
  // RegExp constructor can alter flags and IsRegExp works correct with @@match
  return NativeRegExp(re1) != re1 || NativeRegExp(re2) == re2 || NativeRegExp(re1, 'i') != '/a/i';
})));

// `RegExp` constructor
// https://tc39.github.io/ecma262/#sec-regexp-constructor
if (FORCED$2) {
  var RegExpWrapper = function RegExp(pattern, flags) {
    var thisIsRegExp = this instanceof RegExpWrapper;
    var patternIsRegExp = isRegexp(pattern);
    var flagsAreUndefined = flags === undefined;
    return !thisIsRegExp && patternIsRegExp && pattern.constructor === RegExpWrapper && flagsAreUndefined ? pattern
      : inheritIfRequired(CORRECT_NEW
        ? new NativeRegExp(patternIsRegExp && !flagsAreUndefined ? pattern.source : pattern, flags)
        : NativeRegExp((patternIsRegExp = pattern instanceof RegExpWrapper)
          ? pattern.source
          : pattern, patternIsRegExp && flagsAreUndefined ? regexpFlags.call(pattern) : flags)
      , thisIsRegExp ? this : RegExpPrototype, RegExpWrapper);
  };
  var proxy = function (key) {
    key in RegExpWrapper || defineProperty(RegExpWrapper, key, {
      configurable: true,
      get: function () { return NativeRegExp[key]; },
      set: function (it) { NativeRegExp[key] = it; }
    });
  };
  var keys$1 = getOwnPropertyNames(NativeRegExp);
  var index = 0;
  while (keys$1.length > index) proxy(keys$1[index++]);
  RegExpPrototype.constructor = RegExpWrapper;
  RegExpWrapper.prototype = RegExpPrototype;
  redefine(global_1, 'RegExp', RegExpWrapper);
}

// https://tc39.github.io/ecma262/#sec-get-regexp-@@species
setSpecies('RegExp');

var TO_STRING = 'toString';
var RegExpPrototype$1 = RegExp.prototype;
var nativeToString = RegExpPrototype$1[TO_STRING];

var NOT_GENERIC = fails(function () { return nativeToString.call({ source: 'a', flags: 'b' }) != '/a/b'; });
// FF44- RegExp#toString has a wrong name
var INCORRECT_NAME = nativeToString.name != TO_STRING;

// `RegExp.prototype.toString` method
// https://tc39.github.io/ecma262/#sec-regexp.prototype.tostring
if (NOT_GENERIC || INCORRECT_NAME) {
  redefine(RegExp.prototype, TO_STRING, function toString() {
    var R = anObject(this);
    var p = String(R.source);
    var rf = R.flags;
    var f = String(rf === undefined && R instanceof RegExp && !('flags' in RegExpPrototype$1) ? regexpFlags.call(R) : rf);
    return '/' + p + '/' + f;
  }, { unsafe: true });
}

var nativeExec = RegExp.prototype.exec;
// This always refers to the native implementation, because the
// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
// which loads this file before patching the method.
var nativeReplace = String.prototype.replace;

var patchedExec = nativeExec;

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/;
  var re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
})();

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;

if (PATCH) {
  patchedExec = function exec(str) {
    var re = this;
    var lastIndex, reCopy, match, i;

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + re.source + '$(?!\\s)', regexpFlags.call(re));
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

    match = nativeExec.call(re, str);

    if (UPDATES_LAST_INDEX_WRONG && match) {
      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    return match;
  };
}

var regexpExec = patchedExec;

var SPECIES$4 = wellKnownSymbol('species');

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  // #replace needs built-in support for named groups.
  // #match works fine because it just return the exec results, even if it has
  // a "grops" property.
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  return ''.replace(re, '$<a>') !== '7';
});

// Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
// Weex JS has frozen built-in prototypes, so use try / catch wrapper
var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
});

var fixRegexpWellKnownSymbolLogic = function (KEY, length, exec, sham) {
  var SYMBOL = wellKnownSymbol(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;
    re.exec = function () { execCalled = true; return null; };

    if (KEY === 'split') {
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES$4] = function () { return re; };
    }

    re[SYMBOL]('');
    return !execCalled;
  });

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    (KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS) ||
    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
      if (regexp.exec === regexpExec) {
        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
          // The native String method already delegates to @@method (this
          // polyfilled function), leasing to infinite recursion.
          // We avoid it by directly calling the native @@method method.
          return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
        }
        return { done: true, value: nativeMethod.call(str, regexp, arg2) };
      }
      return { done: false };
    });
    var stringMethod = methods[0];
    var regexMethod = methods[1];

    redefine(String.prototype, KEY, stringMethod);
    redefine(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return regexMethod.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return regexMethod.call(string, this); }
    );
    if (sham) hide(RegExp.prototype[SYMBOL], 'sham', true);
  }
};

// `String.prototype.{ codePointAt, at }` methods implementation
var createMethod$2 = function (CONVERT_TO_STRING) {
  return function ($this, pos) {
    var S = String(requireObjectCoercible($this));
    var position = toInteger(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
    first = S.charCodeAt(position);
    return first < 0xD800 || first > 0xDBFF || position + 1 === size
      || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
        ? CONVERT_TO_STRING ? S.charAt(position) : first
        : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  };
};

var stringMultibyte = {
  // `String.prototype.codePointAt` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
  codeAt: createMethod$2(false),
  // `String.prototype.at` method
  // https://github.com/mathiasbynens/String.prototype.at
  charAt: createMethod$2(true)
};

var charAt = stringMultibyte.charAt;

// `AdvanceStringIndex` abstract operation
// https://tc39.github.io/ecma262/#sec-advancestringindex
var advanceStringIndex = function (S, index, unicode) {
  return index + (unicode ? charAt(S, index).length : 1);
};

// `RegExpExec` abstract operation
// https://tc39.github.io/ecma262/#sec-regexpexec
var regexpExecAbstract = function (R, S) {
  var exec = R.exec;
  if (typeof exec === 'function') {
    var result = exec.call(R, S);
    if (typeof result !== 'object') {
      throw TypeError('RegExp exec method returned something other than an Object or null');
    }
    return result;
  }

  if (classofRaw(R) !== 'RegExp') {
    throw TypeError('RegExp#exec called on incompatible receiver');
  }

  return regexpExec.call(R, S);
};

// @@match logic
fixRegexpWellKnownSymbolLogic('match', 1, function (MATCH, nativeMatch, maybeCallNative) {
  return [
    // `String.prototype.match` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.match
    function match(regexp) {
      var O = requireObjectCoercible(this);
      var matcher = regexp == undefined ? undefined : regexp[MATCH];
      return matcher !== undefined ? matcher.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
    },
    // `RegExp.prototype[@@match]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
    function (regexp) {
      var res = maybeCallNative(nativeMatch, regexp, this);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);

      if (!rx.global) return regexpExecAbstract(rx, S);

      var fullUnicode = rx.unicode;
      rx.lastIndex = 0;
      var A = [];
      var n = 0;
      var result;
      while ((result = regexpExecAbstract(rx, S)) !== null) {
        var matchStr = String(result[0]);
        A[n] = matchStr;
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
        n++;
      }
      return n === 0 ? null : A;
    }
  ];
});

var max$2 = Math.max;
var min$2 = Math.min;
var floor$1 = Math.floor;
var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d\d?|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d\d?)/g;

var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};

// @@replace logic
fixRegexpWellKnownSymbolLogic('replace', 2, function (REPLACE, nativeReplace, maybeCallNative) {
  return [
    // `String.prototype.replace` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.replace
    function replace(searchValue, replaceValue) {
      var O = requireObjectCoercible(this);
      var replacer = searchValue == undefined ? undefined : searchValue[REPLACE];
      return replacer !== undefined
        ? replacer.call(searchValue, O, replaceValue)
        : nativeReplace.call(String(O), searchValue, replaceValue);
    },
    // `RegExp.prototype[@@replace]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
    function (regexp, replaceValue) {
      var res = maybeCallNative(nativeReplace, regexp, this, replaceValue);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);

      var functionalReplace = typeof replaceValue === 'function';
      if (!functionalReplace) replaceValue = String(replaceValue);

      var global = rx.global;
      if (global) {
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
      }
      var results = [];
      while (true) {
        var result = regexpExecAbstract(rx, S);
        if (result === null) break;

        results.push(result);
        if (!global) break;

        var matchStr = String(result[0]);
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
      }

      var accumulatedResult = '';
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];

        var matched = String(result[0]);
        var position = max$2(min$2(toInteger(result.index), S.length), 0);
        var captures = [];
        // NOTE: This is equivalent to
        //   captures = result.slice(1).map(maybeToString)
        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
        var namedCaptures = result.groups;
        if (functionalReplace) {
          var replacerArgs = [matched].concat(captures, position, S);
          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
          var replacement = String(replaceValue.apply(undefined, replacerArgs));
        } else {
          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
        }
        if (position >= nextSourcePosition) {
          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }
      return accumulatedResult + S.slice(nextSourcePosition);
    }
  ];

  // https://tc39.github.io/ecma262/#sec-getsubstitution
  function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
    var tailPos = position + matched.length;
    var m = captures.length;
    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
    if (namedCaptures !== undefined) {
      namedCaptures = toObject(namedCaptures);
      symbols = SUBSTITUTION_SYMBOLS;
    }
    return nativeReplace.call(replacement, symbols, function (match, ch) {
      var capture;
      switch (ch.charAt(0)) {
        case '$': return '$';
        case '&': return matched;
        case '`': return str.slice(0, position);
        case "'": return str.slice(tailPos);
        case '<':
          capture = namedCaptures[ch.slice(1, -1)];
          break;
        default: // \d\d?
          var n = +ch;
          if (n === 0) return match;
          if (n > m) {
            var f = floor$1(n / 10);
            if (f === 0) return match;
            if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
            return match;
          }
          capture = captures[n - 1];
      }
      return capture === undefined ? '' : capture;
    });
  }
});

var SPECIES$5 = wellKnownSymbol('species');

// `SpeciesConstructor` abstract operation
// https://tc39.github.io/ecma262/#sec-speciesconstructor
var speciesConstructor = function (O, defaultConstructor) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES$5]) == undefined ? defaultConstructor : aFunction$1(S);
};

var arrayPush = [].push;
var min$3 = Math.min;
var MAX_UINT32 = 0xFFFFFFFF;

// babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError
var SUPPORTS_Y = !fails(function () { return !RegExp(MAX_UINT32, 'y'); });

// @@split logic
fixRegexpWellKnownSymbolLogic('split', 2, function (SPLIT, nativeSplit, maybeCallNative) {
  var internalSplit;
  if (
    'abbc'.split(/(b)*/)[1] == 'c' ||
    'test'.split(/(?:)/, -1).length != 4 ||
    'ab'.split(/(?:ab)*/).length != 2 ||
    '.'.split(/(.?)(.?)/).length != 4 ||
    '.'.split(/()()/).length > 1 ||
    ''.split(/.?/).length
  ) {
    // based on es5-shim implementation, need to rework it
    internalSplit = function (separator, limit) {
      var string = String(requireObjectCoercible(this));
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (separator === undefined) return [string];
      // If `separator` is not a regex, use native split
      if (!isRegexp(separator)) {
        return nativeSplit.call(string, separator, lim);
      }
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var match, lastIndex, lastLength;
      while (match = regexpExec.call(separatorCopy, string)) {
        lastIndex = separatorCopy.lastIndex;
        if (lastIndex > lastLastIndex) {
          output.push(string.slice(lastLastIndex, match.index));
          if (match.length > 1 && match.index < string.length) arrayPush.apply(output, match.slice(1));
          lastLength = match[0].length;
          lastLastIndex = lastIndex;
          if (output.length >= lim) break;
        }
        if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
      }
      if (lastLastIndex === string.length) {
        if (lastLength || !separatorCopy.test('')) output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output.length > lim ? output.slice(0, lim) : output;
    };
  // Chakra, V8
  } else if ('0'.split(undefined, 0).length) {
    internalSplit = function (separator, limit) {
      return separator === undefined && limit === 0 ? [] : nativeSplit.call(this, separator, limit);
    };
  } else internalSplit = nativeSplit;

  return [
    // `String.prototype.split` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.split
    function split(separator, limit) {
      var O = requireObjectCoercible(this);
      var splitter = separator == undefined ? undefined : separator[SPLIT];
      return splitter !== undefined
        ? splitter.call(separator, O, limit)
        : internalSplit.call(String(O), separator, limit);
    },
    // `RegExp.prototype[@@split]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
    //
    // NOTE: This cannot be properly polyfilled in engines that don't support
    // the 'y' flag.
    function (regexp, limit) {
      var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== nativeSplit);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);
      var C = speciesConstructor(rx, RegExp);

      var unicodeMatching = rx.unicode;
      var flags = (rx.ignoreCase ? 'i' : '') +
                  (rx.multiline ? 'm' : '') +
                  (rx.unicode ? 'u' : '') +
                  (SUPPORTS_Y ? 'y' : 'g');

      // ^(? + rx + ) is needed, in combination with some S slicing, to
      // simulate the 'y' flag.
      var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (S.length === 0) return regexpExecAbstract(splitter, S) === null ? [S] : [];
      var p = 0;
      var q = 0;
      var A = [];
      while (q < S.length) {
        splitter.lastIndex = SUPPORTS_Y ? q : 0;
        var z = regexpExecAbstract(splitter, SUPPORTS_Y ? S : S.slice(q));
        var e;
        if (
          z === null ||
          (e = min$3(toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p
        ) {
          q = advanceStringIndex(S, q, unicodeMatching);
        } else {
          A.push(S.slice(p, q));
          if (A.length === lim) return A;
          for (var i = 1; i <= z.length - 1; i++) {
            A.push(z[i]);
            if (A.length === lim) return A;
          }
          q = p = e;
        }
      }
      A.push(S.slice(p));
      return A;
    }
  ];
}, !SUPPORTS_Y);

// a string of all valid unicode whitespaces
// eslint-disable-next-line max-len
var whitespaces = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

var whitespace = '[' + whitespaces + ']';
var ltrim = RegExp('^' + whitespace + whitespace + '*');
var rtrim = RegExp(whitespace + whitespace + '*$');

// `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
var createMethod$3 = function (TYPE) {
  return function ($this) {
    var string = String(requireObjectCoercible($this));
    if (TYPE & 1) string = string.replace(ltrim, '');
    if (TYPE & 2) string = string.replace(rtrim, '');
    return string;
  };
};

var stringTrim = {
  // `String.prototype.{ trimLeft, trimStart }` methods
  // https://tc39.github.io/ecma262/#sec-string.prototype.trimstart
  start: createMethod$3(1),
  // `String.prototype.{ trimRight, trimEnd }` methods
  // https://tc39.github.io/ecma262/#sec-string.prototype.trimend
  end: createMethod$3(2),
  // `String.prototype.trim` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.trim
  trim: createMethod$3(3)
};

var non = '\u200B\u0085\u180E';

// check that a method works with the correct list
// of whitespaces and has a correct name
var forcedStringTrimMethod = function (METHOD_NAME) {
  return fails(function () {
    return !!whitespaces[METHOD_NAME]() || non[METHOD_NAME]() != non || whitespaces[METHOD_NAME].name !== METHOD_NAME;
  });
};

var $trim = stringTrim.trim;


// `String.prototype.trim` method
// https://tc39.github.io/ecma262/#sec-string.prototype.trim
_export({ target: 'String', proto: true, forced: forcedStringTrimMethod('trim') }, {
  trim: function trim() {
    return $trim(this);
  }
});

var semver = createCommonjsModule(function (module, exports) {
  exports = module.exports = SemVer;
  var debug;
  /* istanbul ignore next */

  if (typeof process === 'object' && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG)) {
    debug = function debug() {
      var args = Array.prototype.slice.call(arguments, 0);
      args.unshift('SEMVER');
      console.log.apply(console, args);
    };
  } else {
    debug = function debug() {};
  } // Note: this is the semver.org version of the spec that it implements
  // Not necessarily the package version of this code.


  exports.SEMVER_SPEC_VERSION = '2.0.0';
  var MAX_LENGTH = 256;
  var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER ||
  /* istanbul ignore next */
  9007199254740991; // Max safe segment length for coercion.

  var MAX_SAFE_COMPONENT_LENGTH = 16; // The actual regexps go on exports.re

  var re = exports.re = [];
  var src = exports.src = [];
  var t = exports.tokens = {};
  var R = 0;

  function tok(n) {
    t[n] = R++;
  } // The following Regular Expressions can be used for tokenizing,
  // validating, and parsing SemVer version strings.
  // ## Numeric Identifier
  // A single `0`, or a non-zero digit followed by zero or more digits.


  tok('NUMERICIDENTIFIER');
  src[t.NUMERICIDENTIFIER] = '0|[1-9]\\d*';
  tok('NUMERICIDENTIFIERLOOSE');
  src[t.NUMERICIDENTIFIERLOOSE] = '[0-9]+'; // ## Non-numeric Identifier
  // Zero or more digits, followed by a letter or hyphen, and then zero or
  // more letters, digits, or hyphens.

  tok('NONNUMERICIDENTIFIER');
  src[t.NONNUMERICIDENTIFIER] = '\\d*[a-zA-Z-][a-zA-Z0-9-]*'; // ## Main Version
  // Three dot-separated numeric identifiers.

  tok('MAINVERSION');
  src[t.MAINVERSION] = '(' + src[t.NUMERICIDENTIFIER] + ')\\.' + '(' + src[t.NUMERICIDENTIFIER] + ')\\.' + '(' + src[t.NUMERICIDENTIFIER] + ')';
  tok('MAINVERSIONLOOSE');
  src[t.MAINVERSIONLOOSE] = '(' + src[t.NUMERICIDENTIFIERLOOSE] + ')\\.' + '(' + src[t.NUMERICIDENTIFIERLOOSE] + ')\\.' + '(' + src[t.NUMERICIDENTIFIERLOOSE] + ')'; // ## Pre-release Version Identifier
  // A numeric identifier, or a non-numeric identifier.

  tok('PRERELEASEIDENTIFIER');
  src[t.PRERELEASEIDENTIFIER] = '(?:' + src[t.NUMERICIDENTIFIER] + '|' + src[t.NONNUMERICIDENTIFIER] + ')';
  tok('PRERELEASEIDENTIFIERLOOSE');
  src[t.PRERELEASEIDENTIFIERLOOSE] = '(?:' + src[t.NUMERICIDENTIFIERLOOSE] + '|' + src[t.NONNUMERICIDENTIFIER] + ')'; // ## Pre-release Version
  // Hyphen, followed by one or more dot-separated pre-release version
  // identifiers.

  tok('PRERELEASE');
  src[t.PRERELEASE] = '(?:-(' + src[t.PRERELEASEIDENTIFIER] + '(?:\\.' + src[t.PRERELEASEIDENTIFIER] + ')*))';
  tok('PRERELEASELOOSE');
  src[t.PRERELEASELOOSE] = '(?:-?(' + src[t.PRERELEASEIDENTIFIERLOOSE] + '(?:\\.' + src[t.PRERELEASEIDENTIFIERLOOSE] + ')*))'; // ## Build Metadata Identifier
  // Any combination of digits, letters, or hyphens.

  tok('BUILDIDENTIFIER');
  src[t.BUILDIDENTIFIER] = '[0-9A-Za-z-]+'; // ## Build Metadata
  // Plus sign, followed by one or more period-separated build metadata
  // identifiers.

  tok('BUILD');
  src[t.BUILD] = '(?:\\+(' + src[t.BUILDIDENTIFIER] + '(?:\\.' + src[t.BUILDIDENTIFIER] + ')*))'; // ## Full Version String
  // A main version, followed optionally by a pre-release version and
  // build metadata.
  // Note that the only major, minor, patch, and pre-release sections of
  // the version string are capturing groups.  The build metadata is not a
  // capturing group, because it should not ever be used in version
  // comparison.

  tok('FULL');
  tok('FULLPLAIN');
  src[t.FULLPLAIN] = 'v?' + src[t.MAINVERSION] + src[t.PRERELEASE] + '?' + src[t.BUILD] + '?';
  src[t.FULL] = '^' + src[t.FULLPLAIN] + '$'; // like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
  // also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
  // common in the npm registry.

  tok('LOOSEPLAIN');
  src[t.LOOSEPLAIN] = '[v=\\s]*' + src[t.MAINVERSIONLOOSE] + src[t.PRERELEASELOOSE] + '?' + src[t.BUILD] + '?';
  tok('LOOSE');
  src[t.LOOSE] = '^' + src[t.LOOSEPLAIN] + '$';
  tok('GTLT');
  src[t.GTLT] = '((?:<|>)?=?)'; // Something like "2.*" or "1.2.x".
  // Note that "x.x" is a valid xRange identifer, meaning "any version"
  // Only the first item is strictly required.

  tok('XRANGEIDENTIFIERLOOSE');
  src[t.XRANGEIDENTIFIERLOOSE] = src[t.NUMERICIDENTIFIERLOOSE] + '|x|X|\\*';
  tok('XRANGEIDENTIFIER');
  src[t.XRANGEIDENTIFIER] = src[t.NUMERICIDENTIFIER] + '|x|X|\\*';
  tok('XRANGEPLAIN');
  src[t.XRANGEPLAIN] = '[v=\\s]*(' + src[t.XRANGEIDENTIFIER] + ')' + '(?:\\.(' + src[t.XRANGEIDENTIFIER] + ')' + '(?:\\.(' + src[t.XRANGEIDENTIFIER] + ')' + '(?:' + src[t.PRERELEASE] + ')?' + src[t.BUILD] + '?' + ')?)?';
  tok('XRANGEPLAINLOOSE');
  src[t.XRANGEPLAINLOOSE] = '[v=\\s]*(' + src[t.XRANGEIDENTIFIERLOOSE] + ')' + '(?:\\.(' + src[t.XRANGEIDENTIFIERLOOSE] + ')' + '(?:\\.(' + src[t.XRANGEIDENTIFIERLOOSE] + ')' + '(?:' + src[t.PRERELEASELOOSE] + ')?' + src[t.BUILD] + '?' + ')?)?';
  tok('XRANGE');
  src[t.XRANGE] = '^' + src[t.GTLT] + '\\s*' + src[t.XRANGEPLAIN] + '$';
  tok('XRANGELOOSE');
  src[t.XRANGELOOSE] = '^' + src[t.GTLT] + '\\s*' + src[t.XRANGEPLAINLOOSE] + '$'; // Coercion.
  // Extract anything that could conceivably be a part of a valid semver

  tok('COERCE');
  src[t.COERCE] = '(^|[^\\d])' + '(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '})' + '(?:\\.(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '}))?' + '(?:\\.(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '}))?' + '(?:$|[^\\d])';
  tok('COERCERTL');
  re[t.COERCERTL] = new RegExp(src[t.COERCE], 'g'); // Tilde ranges.
  // Meaning is "reasonably at or greater than"

  tok('LONETILDE');
  src[t.LONETILDE] = '(?:~>?)';
  tok('TILDETRIM');
  src[t.TILDETRIM] = '(\\s*)' + src[t.LONETILDE] + '\\s+';
  re[t.TILDETRIM] = new RegExp(src[t.TILDETRIM], 'g');
  var tildeTrimReplace = '$1~';
  tok('TILDE');
  src[t.TILDE] = '^' + src[t.LONETILDE] + src[t.XRANGEPLAIN] + '$';
  tok('TILDELOOSE');
  src[t.TILDELOOSE] = '^' + src[t.LONETILDE] + src[t.XRANGEPLAINLOOSE] + '$'; // Caret ranges.
  // Meaning is "at least and backwards compatible with"

  tok('LONECARET');
  src[t.LONECARET] = '(?:\\^)';
  tok('CARETTRIM');
  src[t.CARETTRIM] = '(\\s*)' + src[t.LONECARET] + '\\s+';
  re[t.CARETTRIM] = new RegExp(src[t.CARETTRIM], 'g');
  var caretTrimReplace = '$1^';
  tok('CARET');
  src[t.CARET] = '^' + src[t.LONECARET] + src[t.XRANGEPLAIN] + '$';
  tok('CARETLOOSE');
  src[t.CARETLOOSE] = '^' + src[t.LONECARET] + src[t.XRANGEPLAINLOOSE] + '$'; // A simple gt/lt/eq thing, or just "" to indicate "any version"

  tok('COMPARATORLOOSE');
  src[t.COMPARATORLOOSE] = '^' + src[t.GTLT] + '\\s*(' + src[t.LOOSEPLAIN] + ')$|^$';
  tok('COMPARATOR');
  src[t.COMPARATOR] = '^' + src[t.GTLT] + '\\s*(' + src[t.FULLPLAIN] + ')$|^$'; // An expression to strip any whitespace between the gtlt and the thing
  // it modifies, so that `> 1.2.3` ==> `>1.2.3`

  tok('COMPARATORTRIM');
  src[t.COMPARATORTRIM] = '(\\s*)' + src[t.GTLT] + '\\s*(' + src[t.LOOSEPLAIN] + '|' + src[t.XRANGEPLAIN] + ')'; // this one has to use the /g flag

  re[t.COMPARATORTRIM] = new RegExp(src[t.COMPARATORTRIM], 'g');
  var comparatorTrimReplace = '$1$2$3'; // Something like `1.2.3 - 1.2.4`
  // Note that these all use the loose form, because they'll be
  // checked against either the strict or loose comparator form
  // later.

  tok('HYPHENRANGE');
  src[t.HYPHENRANGE] = '^\\s*(' + src[t.XRANGEPLAIN] + ')' + '\\s+-\\s+' + '(' + src[t.XRANGEPLAIN] + ')' + '\\s*$';
  tok('HYPHENRANGELOOSE');
  src[t.HYPHENRANGELOOSE] = '^\\s*(' + src[t.XRANGEPLAINLOOSE] + ')' + '\\s+-\\s+' + '(' + src[t.XRANGEPLAINLOOSE] + ')' + '\\s*$'; // Star ranges basically just allow anything at all.

  tok('STAR');
  src[t.STAR] = '(<|>)?=?\\s*\\*'; // Compile to actual regexp objects.
  // All are flag-free, unless they were created above with a flag.

  for (var i = 0; i < R; i++) {
    debug(i, src[i]);

    if (!re[i]) {
      re[i] = new RegExp(src[i]);
    }
  }

  exports.parse = parse;

  function parse(version, options) {
    if (!options || typeof options !== 'object') {
      options = {
        loose: !!options,
        includePrerelease: false
      };
    }

    if (version instanceof SemVer) {
      return version;
    }

    if (typeof version !== 'string') {
      return null;
    }

    if (version.length > MAX_LENGTH) {
      return null;
    }

    var r = options.loose ? re[t.LOOSE] : re[t.FULL];

    if (!r.test(version)) {
      return null;
    }

    try {
      return new SemVer(version, options);
    } catch (er) {
      return null;
    }
  }

  exports.valid = valid;

  function valid(version, options) {
    var v = parse(version, options);
    return v ? v.version : null;
  }

  exports.clean = clean;

  function clean(version, options) {
    var s = parse(version.trim().replace(/^[=v]+/, ''), options);
    return s ? s.version : null;
  }

  exports.SemVer = SemVer;

  function SemVer(version, options) {
    if (!options || typeof options !== 'object') {
      options = {
        loose: !!options,
        includePrerelease: false
      };
    }

    if (version instanceof SemVer) {
      if (version.loose === options.loose) {
        return version;
      } else {
        version = version.version;
      }
    } else if (typeof version !== 'string') {
      throw new TypeError('Invalid Version: ' + version);
    }

    if (version.length > MAX_LENGTH) {
      throw new TypeError('version is longer than ' + MAX_LENGTH + ' characters');
    }

    if (!(this instanceof SemVer)) {
      return new SemVer(version, options);
    }

    debug('SemVer', version, options);
    this.options = options;
    this.loose = !!options.loose;
    var m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL]);

    if (!m) {
      throw new TypeError('Invalid Version: ' + version);
    }

    this.raw = version; // these are actually numbers

    this.major = +m[1];
    this.minor = +m[2];
    this.patch = +m[3];

    if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
      throw new TypeError('Invalid major version');
    }

    if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
      throw new TypeError('Invalid minor version');
    }

    if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
      throw new TypeError('Invalid patch version');
    } // numberify any prerelease numeric ids


    if (!m[4]) {
      this.prerelease = [];
    } else {
      this.prerelease = m[4].split('.').map(function (id) {
        if (/^[0-9]+$/.test(id)) {
          var num = +id;

          if (num >= 0 && num < MAX_SAFE_INTEGER) {
            return num;
          }
        }

        return id;
      });
    }

    this.build = m[5] ? m[5].split('.') : [];
    this.format();
  }

  SemVer.prototype.format = function () {
    this.version = this.major + '.' + this.minor + '.' + this.patch;

    if (this.prerelease.length) {
      this.version += '-' + this.prerelease.join('.');
    }

    return this.version;
  };

  SemVer.prototype.toString = function () {
    return this.version;
  };

  SemVer.prototype.compare = function (other) {
    debug('SemVer.compare', this.version, this.options, other);

    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options);
    }

    return this.compareMain(other) || this.comparePre(other);
  };

  SemVer.prototype.compareMain = function (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options);
    }

    return compareIdentifiers(this.major, other.major) || compareIdentifiers(this.minor, other.minor) || compareIdentifiers(this.patch, other.patch);
  };

  SemVer.prototype.comparePre = function (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options);
    } // NOT having a prerelease is > having one


    if (this.prerelease.length && !other.prerelease.length) {
      return -1;
    } else if (!this.prerelease.length && other.prerelease.length) {
      return 1;
    } else if (!this.prerelease.length && !other.prerelease.length) {
      return 0;
    }

    var i = 0;

    do {
      var a = this.prerelease[i];
      var b = other.prerelease[i];
      debug('prerelease compare', i, a, b);

      if (a === undefined && b === undefined) {
        return 0;
      } else if (b === undefined) {
        return 1;
      } else if (a === undefined) {
        return -1;
      } else if (a === b) {
        continue;
      } else {
        return compareIdentifiers(a, b);
      }
    } while (++i);
  };

  SemVer.prototype.compareBuild = function (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options);
    }

    var i = 0;

    do {
      var a = this.build[i];
      var b = other.build[i];
      debug('prerelease compare', i, a, b);

      if (a === undefined && b === undefined) {
        return 0;
      } else if (b === undefined) {
        return 1;
      } else if (a === undefined) {
        return -1;
      } else if (a === b) {
        continue;
      } else {
        return compareIdentifiers(a, b);
      }
    } while (++i);
  }; // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.


  SemVer.prototype.inc = function (release, identifier) {
    switch (release) {
      case 'premajor':
        this.prerelease.length = 0;
        this.patch = 0;
        this.minor = 0;
        this.major++;
        this.inc('pre', identifier);
        break;

      case 'preminor':
        this.prerelease.length = 0;
        this.patch = 0;
        this.minor++;
        this.inc('pre', identifier);
        break;

      case 'prepatch':
        // If this is already a prerelease, it will bump to the next version
        // drop any prereleases that might already exist, since they are not
        // relevant at this point.
        this.prerelease.length = 0;
        this.inc('patch', identifier);
        this.inc('pre', identifier);
        break;
      // If the input is a non-prerelease version, this acts the same as
      // prepatch.

      case 'prerelease':
        if (this.prerelease.length === 0) {
          this.inc('patch', identifier);
        }

        this.inc('pre', identifier);
        break;

      case 'major':
        // If this is a pre-major version, bump up to the same major version.
        // Otherwise increment major.
        // 1.0.0-5 bumps to 1.0.0
        // 1.1.0 bumps to 2.0.0
        if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
          this.major++;
        }

        this.minor = 0;
        this.patch = 0;
        this.prerelease = [];
        break;

      case 'minor':
        // If this is a pre-minor version, bump up to the same minor version.
        // Otherwise increment minor.
        // 1.2.0-5 bumps to 1.2.0
        // 1.2.1 bumps to 1.3.0
        if (this.patch !== 0 || this.prerelease.length === 0) {
          this.minor++;
        }

        this.patch = 0;
        this.prerelease = [];
        break;

      case 'patch':
        // If this is not a pre-release version, it will increment the patch.
        // If it is a pre-release it will bump up to the same patch version.
        // 1.2.0-5 patches to 1.2.0
        // 1.2.0 patches to 1.2.1
        if (this.prerelease.length === 0) {
          this.patch++;
        }

        this.prerelease = [];
        break;
      // This probably shouldn't be used publicly.
      // 1.0.0 "pre" would become 1.0.0-0 which is the wrong direction.

      case 'pre':
        if (this.prerelease.length === 0) {
          this.prerelease = [0];
        } else {
          var i = this.prerelease.length;

          while (--i >= 0) {
            if (typeof this.prerelease[i] === 'number') {
              this.prerelease[i]++;
              i = -2;
            }
          }

          if (i === -1) {
            // didn't increment anything
            this.prerelease.push(0);
          }
        }

        if (identifier) {
          // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
          // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
          if (this.prerelease[0] === identifier) {
            if (isNaN(this.prerelease[1])) {
              this.prerelease = [identifier, 0];
            }
          } else {
            this.prerelease = [identifier, 0];
          }
        }

        break;

      default:
        throw new Error('invalid increment argument: ' + release);
    }

    this.format();
    this.raw = this.version;
    return this;
  };

  exports.inc = inc;

  function inc(version, release, loose, identifier) {
    if (typeof loose === 'string') {
      identifier = loose;
      loose = undefined;
    }

    try {
      return new SemVer(version, loose).inc(release, identifier).version;
    } catch (er) {
      return null;
    }
  }

  exports.diff = diff;

  function diff(version1, version2) {
    if (eq(version1, version2)) {
      return null;
    } else {
      var v1 = parse(version1);
      var v2 = parse(version2);
      var prefix = '';

      if (v1.prerelease.length || v2.prerelease.length) {
        prefix = 'pre';
        var defaultResult = 'prerelease';
      }

      for (var key in v1) {
        if (key === 'major' || key === 'minor' || key === 'patch') {
          if (v1[key] !== v2[key]) {
            return prefix + key;
          }
        }
      }

      return defaultResult; // may be undefined
    }
  }

  exports.compareIdentifiers = compareIdentifiers;
  var numeric = /^[0-9]+$/;

  function compareIdentifiers(a, b) {
    var anum = numeric.test(a);
    var bnum = numeric.test(b);

    if (anum && bnum) {
      a = +a;
      b = +b;
    }

    return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
  }

  exports.rcompareIdentifiers = rcompareIdentifiers;

  function rcompareIdentifiers(a, b) {
    return compareIdentifiers(b, a);
  }

  exports.major = major;

  function major(a, loose) {
    return new SemVer(a, loose).major;
  }

  exports.minor = minor;

  function minor(a, loose) {
    return new SemVer(a, loose).minor;
  }

  exports.patch = patch;

  function patch(a, loose) {
    return new SemVer(a, loose).patch;
  }

  exports.compare = compare;

  function compare(a, b, loose) {
    return new SemVer(a, loose).compare(new SemVer(b, loose));
  }

  exports.compareLoose = compareLoose;

  function compareLoose(a, b) {
    return compare(a, b, true);
  }

  exports.compareBuild = compareBuild;

  function compareBuild(a, b, loose) {
    var versionA = new SemVer(a, loose);
    var versionB = new SemVer(b, loose);
    return versionA.compare(versionB) || versionA.compareBuild(versionB);
  }

  exports.rcompare = rcompare;

  function rcompare(a, b, loose) {
    return compare(b, a, loose);
  }

  exports.sort = sort;

  function sort(list, loose) {
    return list.sort(function (a, b) {
      return exports.compareBuild(a, b, loose);
    });
  }

  exports.rsort = rsort;

  function rsort(list, loose) {
    return list.sort(function (a, b) {
      return exports.compareBuild(b, a, loose);
    });
  }

  exports.gt = gt;

  function gt(a, b, loose) {
    return compare(a, b, loose) > 0;
  }

  exports.lt = lt;

  function lt(a, b, loose) {
    return compare(a, b, loose) < 0;
  }

  exports.eq = eq;

  function eq(a, b, loose) {
    return compare(a, b, loose) === 0;
  }

  exports.neq = neq;

  function neq(a, b, loose) {
    return compare(a, b, loose) !== 0;
  }

  exports.gte = gte;

  function gte(a, b, loose) {
    return compare(a, b, loose) >= 0;
  }

  exports.lte = lte;

  function lte(a, b, loose) {
    return compare(a, b, loose) <= 0;
  }

  exports.cmp = cmp;

  function cmp(a, op, b, loose) {
    switch (op) {
      case '===':
        if (typeof a === 'object') a = a.version;
        if (typeof b === 'object') b = b.version;
        return a === b;

      case '!==':
        if (typeof a === 'object') a = a.version;
        if (typeof b === 'object') b = b.version;
        return a !== b;

      case '':
      case '=':
      case '==':
        return eq(a, b, loose);

      case '!=':
        return neq(a, b, loose);

      case '>':
        return gt(a, b, loose);

      case '>=':
        return gte(a, b, loose);

      case '<':
        return lt(a, b, loose);

      case '<=':
        return lte(a, b, loose);

      default:
        throw new TypeError('Invalid operator: ' + op);
    }
  }

  exports.Comparator = Comparator;

  function Comparator(comp, options) {
    if (!options || typeof options !== 'object') {
      options = {
        loose: !!options,
        includePrerelease: false
      };
    }

    if (comp instanceof Comparator) {
      if (comp.loose === !!options.loose) {
        return comp;
      } else {
        comp = comp.value;
      }
    }

    if (!(this instanceof Comparator)) {
      return new Comparator(comp, options);
    }

    debug('comparator', comp, options);
    this.options = options;
    this.loose = !!options.loose;
    this.parse(comp);

    if (this.semver === ANY) {
      this.value = '';
    } else {
      this.value = this.operator + this.semver.version;
    }

    debug('comp', this);
  }

  var ANY = {};

  Comparator.prototype.parse = function (comp) {
    var r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
    var m = comp.match(r);

    if (!m) {
      throw new TypeError('Invalid comparator: ' + comp);
    }

    this.operator = m[1] !== undefined ? m[1] : '';

    if (this.operator === '=') {
      this.operator = '';
    } // if it literally is just '>' or '' then allow anything.


    if (!m[2]) {
      this.semver = ANY;
    } else {
      this.semver = new SemVer(m[2], this.options.loose);
    }
  };

  Comparator.prototype.toString = function () {
    return this.value;
  };

  Comparator.prototype.test = function (version) {
    debug('Comparator.test', version, this.options.loose);

    if (this.semver === ANY || version === ANY) {
      return true;
    }

    if (typeof version === 'string') {
      try {
        version = new SemVer(version, this.options);
      } catch (er) {
        return false;
      }
    }

    return cmp(version, this.operator, this.semver, this.options);
  };

  Comparator.prototype.intersects = function (comp, options) {
    if (!(comp instanceof Comparator)) {
      throw new TypeError('a Comparator is required');
    }

    if (!options || typeof options !== 'object') {
      options = {
        loose: !!options,
        includePrerelease: false
      };
    }

    var rangeTmp;

    if (this.operator === '') {
      if (this.value === '') {
        return true;
      }

      rangeTmp = new Range(comp.value, options);
      return satisfies(this.value, rangeTmp, options);
    } else if (comp.operator === '') {
      if (comp.value === '') {
        return true;
      }

      rangeTmp = new Range(this.value, options);
      return satisfies(comp.semver, rangeTmp, options);
    }

    var sameDirectionIncreasing = (this.operator === '>=' || this.operator === '>') && (comp.operator === '>=' || comp.operator === '>');
    var sameDirectionDecreasing = (this.operator === '<=' || this.operator === '<') && (comp.operator === '<=' || comp.operator === '<');
    var sameSemVer = this.semver.version === comp.semver.version;
    var differentDirectionsInclusive = (this.operator === '>=' || this.operator === '<=') && (comp.operator === '>=' || comp.operator === '<=');
    var oppositeDirectionsLessThan = cmp(this.semver, '<', comp.semver, options) && (this.operator === '>=' || this.operator === '>') && (comp.operator === '<=' || comp.operator === '<');
    var oppositeDirectionsGreaterThan = cmp(this.semver, '>', comp.semver, options) && (this.operator === '<=' || this.operator === '<') && (comp.operator === '>=' || comp.operator === '>');
    return sameDirectionIncreasing || sameDirectionDecreasing || sameSemVer && differentDirectionsInclusive || oppositeDirectionsLessThan || oppositeDirectionsGreaterThan;
  };

  exports.Range = Range;

  function Range(range, options) {
    if (!options || typeof options !== 'object') {
      options = {
        loose: !!options,
        includePrerelease: false
      };
    }

    if (range instanceof Range) {
      if (range.loose === !!options.loose && range.includePrerelease === !!options.includePrerelease) {
        return range;
      } else {
        return new Range(range.raw, options);
      }
    }

    if (range instanceof Comparator) {
      return new Range(range.value, options);
    }

    if (!(this instanceof Range)) {
      return new Range(range, options);
    }

    this.options = options;
    this.loose = !!options.loose;
    this.includePrerelease = !!options.includePrerelease; // First, split based on boolean or ||

    this.raw = range;
    this.set = range.split(/\s*\|\|\s*/).map(function (range) {
      return this.parseRange(range.trim());
    }, this).filter(function (c) {
      // throw out any that are not relevant for whatever reason
      return c.length;
    });

    if (!this.set.length) {
      throw new TypeError('Invalid SemVer Range: ' + range);
    }

    this.format();
  }

  Range.prototype.format = function () {
    this.range = this.set.map(function (comps) {
      return comps.join(' ').trim();
    }).join('||').trim();
    return this.range;
  };

  Range.prototype.toString = function () {
    return this.range;
  };

  Range.prototype.parseRange = function (range) {
    var loose = this.options.loose;
    range = range.trim(); // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`

    var hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE];
    range = range.replace(hr, hyphenReplace);
    debug('hyphen replace', range); // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`

    range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace);
    debug('comparator trim', range, re[t.COMPARATORTRIM]); // `~ 1.2.3` => `~1.2.3`

    range = range.replace(re[t.TILDETRIM], tildeTrimReplace); // `^ 1.2.3` => `^1.2.3`

    range = range.replace(re[t.CARETTRIM], caretTrimReplace); // normalize spaces

    range = range.split(/\s+/).join(' '); // At this point, the range is completely trimmed and
    // ready to be split into comparators.

    var compRe = loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
    var set = range.split(' ').map(function (comp) {
      return parseComparator(comp, this.options);
    }, this).join(' ').split(/\s+/);

    if (this.options.loose) {
      // in loose mode, throw out any that are not valid comparators
      set = set.filter(function (comp) {
        return !!comp.match(compRe);
      });
    }

    set = set.map(function (comp) {
      return new Comparator(comp, this.options);
    }, this);
    return set;
  };

  Range.prototype.intersects = function (range, options) {
    if (!(range instanceof Range)) {
      throw new TypeError('a Range is required');
    }

    return this.set.some(function (thisComparators) {
      return isSatisfiable(thisComparators, options) && range.set.some(function (rangeComparators) {
        return isSatisfiable(rangeComparators, options) && thisComparators.every(function (thisComparator) {
          return rangeComparators.every(function (rangeComparator) {
            return thisComparator.intersects(rangeComparator, options);
          });
        });
      });
    });
  }; // take a set of comparators and determine whether there
  // exists a version which can satisfy it


  function isSatisfiable(comparators, options) {
    var result = true;
    var remainingComparators = comparators.slice();
    var testComparator = remainingComparators.pop();

    while (result && remainingComparators.length) {
      result = remainingComparators.every(function (otherComparator) {
        return testComparator.intersects(otherComparator, options);
      });
      testComparator = remainingComparators.pop();
    }

    return result;
  } // Mostly just for testing and legacy API reasons


  exports.toComparators = toComparators;

  function toComparators(range, options) {
    return new Range(range, options).set.map(function (comp) {
      return comp.map(function (c) {
        return c.value;
      }).join(' ').trim().split(' ');
    });
  } // comprised of xranges, tildes, stars, and gtlt's at this point.
  // already replaced the hyphen ranges
  // turn into a set of JUST comparators.


  function parseComparator(comp, options) {
    debug('comp', comp, options);
    comp = replaceCarets(comp, options);
    debug('caret', comp);
    comp = replaceTildes(comp, options);
    debug('tildes', comp);
    comp = replaceXRanges(comp, options);
    debug('xrange', comp);
    comp = replaceStars(comp, options);
    debug('stars', comp);
    return comp;
  }

  function isX(id) {
    return !id || id.toLowerCase() === 'x' || id === '*';
  } // ~, ~> --> * (any, kinda silly)
  // ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0
  // ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0
  // ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0
  // ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0
  // ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0


  function replaceTildes(comp, options) {
    return comp.trim().split(/\s+/).map(function (comp) {
      return replaceTilde(comp, options);
    }).join(' ');
  }

  function replaceTilde(comp, options) {
    var r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE];
    return comp.replace(r, function (_, M, m, p, pr) {
      debug('tilde', comp, _, M, m, p, pr);
      var ret;

      if (isX(M)) {
        ret = '';
      } else if (isX(m)) {
        ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0';
      } else if (isX(p)) {
        // ~1.2 == >=1.2.0 <1.3.0
        ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0';
      } else if (pr) {
        debug('replaceTilde pr', pr);
        ret = '>=' + M + '.' + m + '.' + p + '-' + pr + ' <' + M + '.' + (+m + 1) + '.0';
      } else {
        // ~1.2.3 == >=1.2.3 <1.3.0
        ret = '>=' + M + '.' + m + '.' + p + ' <' + M + '.' + (+m + 1) + '.0';
      }

      debug('tilde return', ret);
      return ret;
    });
  } // ^ --> * (any, kinda silly)
  // ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0
  // ^2.0, ^2.0.x --> >=2.0.0 <3.0.0
  // ^1.2, ^1.2.x --> >=1.2.0 <2.0.0
  // ^1.2.3 --> >=1.2.3 <2.0.0
  // ^1.2.0 --> >=1.2.0 <2.0.0


  function replaceCarets(comp, options) {
    return comp.trim().split(/\s+/).map(function (comp) {
      return replaceCaret(comp, options);
    }).join(' ');
  }

  function replaceCaret(comp, options) {
    debug('caret', comp, options);
    var r = options.loose ? re[t.CARETLOOSE] : re[t.CARET];
    return comp.replace(r, function (_, M, m, p, pr) {
      debug('caret', comp, _, M, m, p, pr);
      var ret;

      if (isX(M)) {
        ret = '';
      } else if (isX(m)) {
        ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0';
      } else if (isX(p)) {
        if (M === '0') {
          ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0';
        } else {
          ret = '>=' + M + '.' + m + '.0 <' + (+M + 1) + '.0.0';
        }
      } else if (pr) {
        debug('replaceCaret pr', pr);

        if (M === '0') {
          if (m === '0') {
            ret = '>=' + M + '.' + m + '.' + p + '-' + pr + ' <' + M + '.' + m + '.' + (+p + 1);
          } else {
            ret = '>=' + M + '.' + m + '.' + p + '-' + pr + ' <' + M + '.' + (+m + 1) + '.0';
          }
        } else {
          ret = '>=' + M + '.' + m + '.' + p + '-' + pr + ' <' + (+M + 1) + '.0.0';
        }
      } else {
        debug('no pr');

        if (M === '0') {
          if (m === '0') {
            ret = '>=' + M + '.' + m + '.' + p + ' <' + M + '.' + m + '.' + (+p + 1);
          } else {
            ret = '>=' + M + '.' + m + '.' + p + ' <' + M + '.' + (+m + 1) + '.0';
          }
        } else {
          ret = '>=' + M + '.' + m + '.' + p + ' <' + (+M + 1) + '.0.0';
        }
      }

      debug('caret return', ret);
      return ret;
    });
  }

  function replaceXRanges(comp, options) {
    debug('replaceXRanges', comp, options);
    return comp.split(/\s+/).map(function (comp) {
      return replaceXRange(comp, options);
    }).join(' ');
  }

  function replaceXRange(comp, options) {
    comp = comp.trim();
    var r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE];
    return comp.replace(r, function (ret, gtlt, M, m, p, pr) {
      debug('xRange', comp, ret, gtlt, M, m, p, pr);
      var xM = isX(M);
      var xm = xM || isX(m);
      var xp = xm || isX(p);
      var anyX = xp;

      if (gtlt === '=' && anyX) {
        gtlt = '';
      } // if we're including prereleases in the match, then we need
      // to fix this to -0, the lowest possible prerelease value


      pr = options.includePrerelease ? '-0' : '';

      if (xM) {
        if (gtlt === '>' || gtlt === '<') {
          // nothing is allowed
          ret = '<0.0.0-0';
        } else {
          // nothing is forbidden
          ret = '*';
        }
      } else if (gtlt && anyX) {
        // we know patch is an x, because we have any x at all.
        // replace X with 0
        if (xm) {
          m = 0;
        }

        p = 0;

        if (gtlt === '>') {
          // >1 => >=2.0.0
          // >1.2 => >=1.3.0
          // >1.2.3 => >= 1.2.4
          gtlt = '>=';

          if (xm) {
            M = +M + 1;
            m = 0;
            p = 0;
          } else {
            m = +m + 1;
            p = 0;
          }
        } else if (gtlt === '<=') {
          // <=0.7.x is actually <0.8.0, since any 0.7.x should
          // pass.  Similarly, <=7.x is actually <8.0.0, etc.
          gtlt = '<';

          if (xm) {
            M = +M + 1;
          } else {
            m = +m + 1;
          }
        }

        ret = gtlt + M + '.' + m + '.' + p + pr;
      } else if (xm) {
        ret = '>=' + M + '.0.0' + pr + ' <' + (+M + 1) + '.0.0' + pr;
      } else if (xp) {
        ret = '>=' + M + '.' + m + '.0' + pr + ' <' + M + '.' + (+m + 1) + '.0' + pr;
      }

      debug('xRange return', ret);
      return ret;
    });
  } // Because * is AND-ed with everything else in the comparator,
  // and '' means "any version", just remove the *s entirely.


  function replaceStars(comp, options) {
    debug('replaceStars', comp, options); // Looseness is ignored here.  star is always as loose as it gets!

    return comp.trim().replace(re[t.STAR], '');
  } // This function is passed to string.replace(re[t.HYPHENRANGE])
  // M, m, patch, prerelease, build
  // 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
  // 1.2.3 - 3.4 => >=1.2.0 <3.5.0 Any 3.4.x will do
  // 1.2 - 3.4 => >=1.2.0 <3.5.0


  function hyphenReplace($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr, tb) {
    if (isX(fM)) {
      from = '';
    } else if (isX(fm)) {
      from = '>=' + fM + '.0.0';
    } else if (isX(fp)) {
      from = '>=' + fM + '.' + fm + '.0';
    } else {
      from = '>=' + from;
    }

    if (isX(tM)) {
      to = '';
    } else if (isX(tm)) {
      to = '<' + (+tM + 1) + '.0.0';
    } else if (isX(tp)) {
      to = '<' + tM + '.' + (+tm + 1) + '.0';
    } else if (tpr) {
      to = '<=' + tM + '.' + tm + '.' + tp + '-' + tpr;
    } else {
      to = '<=' + to;
    }

    return (from + ' ' + to).trim();
  } // if ANY of the sets match ALL of its comparators, then pass


  Range.prototype.test = function (version) {
    if (!version) {
      return false;
    }

    if (typeof version === 'string') {
      try {
        version = new SemVer(version, this.options);
      } catch (er) {
        return false;
      }
    }

    for (var i = 0; i < this.set.length; i++) {
      if (testSet(this.set[i], version, this.options)) {
        return true;
      }
    }

    return false;
  };

  function testSet(set, version, options) {
    for (var i = 0; i < set.length; i++) {
      if (!set[i].test(version)) {
        return false;
      }
    }

    if (version.prerelease.length && !options.includePrerelease) {
      // Find the set of versions that are allowed to have prereleases
      // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
      // That should allow `1.2.3-pr.2` to pass.
      // However, `1.2.4-alpha.notready` should NOT be allowed,
      // even though it's within the range set by the comparators.
      for (i = 0; i < set.length; i++) {
        debug(set[i].semver);

        if (set[i].semver === ANY) {
          continue;
        }

        if (set[i].semver.prerelease.length > 0) {
          var allowed = set[i].semver;

          if (allowed.major === version.major && allowed.minor === version.minor && allowed.patch === version.patch) {
            return true;
          }
        }
      } // Version has a -pre, but it's not one of the ones we like.


      return false;
    }

    return true;
  }

  exports.satisfies = satisfies;

  function satisfies(version, range, options) {
    try {
      range = new Range(range, options);
    } catch (er) {
      return false;
    }

    return range.test(version);
  }

  exports.maxSatisfying = maxSatisfying;

  function maxSatisfying(versions, range, options) {
    var max = null;
    var maxSV = null;

    try {
      var rangeObj = new Range(range, options);
    } catch (er) {
      return null;
    }

    versions.forEach(function (v) {
      if (rangeObj.test(v)) {
        // satisfies(v, range, options)
        if (!max || maxSV.compare(v) === -1) {
          // compare(max, v, true)
          max = v;
          maxSV = new SemVer(max, options);
        }
      }
    });
    return max;
  }

  exports.minSatisfying = minSatisfying;

  function minSatisfying(versions, range, options) {
    var min = null;
    var minSV = null;

    try {
      var rangeObj = new Range(range, options);
    } catch (er) {
      return null;
    }

    versions.forEach(function (v) {
      if (rangeObj.test(v)) {
        // satisfies(v, range, options)
        if (!min || minSV.compare(v) === 1) {
          // compare(min, v, true)
          min = v;
          minSV = new SemVer(min, options);
        }
      }
    });
    return min;
  }

  exports.minVersion = minVersion;

  function minVersion(range, loose) {
    range = new Range(range, loose);
    var minver = new SemVer('0.0.0');

    if (range.test(minver)) {
      return minver;
    }

    minver = new SemVer('0.0.0-0');

    if (range.test(minver)) {
      return minver;
    }

    minver = null;

    for (var i = 0; i < range.set.length; ++i) {
      var comparators = range.set[i];
      comparators.forEach(function (comparator) {
        // Clone to avoid manipulating the comparator's semver object.
        var compver = new SemVer(comparator.semver.version);

        switch (comparator.operator) {
          case '>':
            if (compver.prerelease.length === 0) {
              compver.patch++;
            } else {
              compver.prerelease.push(0);
            }

            compver.raw = compver.format();

          /* fallthrough */

          case '':
          case '>=':
            if (!minver || gt(minver, compver)) {
              minver = compver;
            }

            break;

          case '<':
          case '<=':
            /* Ignore maximum versions */
            break;

          /* istanbul ignore next */

          default:
            throw new Error('Unexpected operation: ' + comparator.operator);
        }
      });
    }

    if (minver && range.test(minver)) {
      return minver;
    }

    return null;
  }

  exports.validRange = validRange;

  function validRange(range, options) {
    try {
      // Return '*' instead of '' so that truthiness works.
      // This will throw if it's invalid anyway
      return new Range(range, options).range || '*';
    } catch (er) {
      return null;
    }
  } // Determine if version is less than all the versions possible in the range


  exports.ltr = ltr;

  function ltr(version, range, options) {
    return outside(version, range, '<', options);
  } // Determine if version is greater than all the versions possible in the range.


  exports.gtr = gtr;

  function gtr(version, range, options) {
    return outside(version, range, '>', options);
  }

  exports.outside = outside;

  function outside(version, range, hilo, options) {
    version = new SemVer(version, options);
    range = new Range(range, options);
    var gtfn, ltefn, ltfn, comp, ecomp;

    switch (hilo) {
      case '>':
        gtfn = gt;
        ltefn = lte;
        ltfn = lt;
        comp = '>';
        ecomp = '>=';
        break;

      case '<':
        gtfn = lt;
        ltefn = gte;
        ltfn = gt;
        comp = '<';
        ecomp = '<=';
        break;

      default:
        throw new TypeError('Must provide a hilo val of "<" or ">"');
    } // If it satisifes the range it is not outside


    if (satisfies(version, range, options)) {
      return false;
    } // From now on, variable terms are as if we're in "gtr" mode.
    // but note that everything is flipped for the "ltr" function.


    for (var i = 0; i < range.set.length; ++i) {
      var comparators = range.set[i];
      var high = null;
      var low = null;
      comparators.forEach(function (comparator) {
        if (comparator.semver === ANY) {
          comparator = new Comparator('>=0.0.0');
        }

        high = high || comparator;
        low = low || comparator;

        if (gtfn(comparator.semver, high.semver, options)) {
          high = comparator;
        } else if (ltfn(comparator.semver, low.semver, options)) {
          low = comparator;
        }
      }); // If the edge version comparator has a operator then our version
      // isn't outside it

      if (high.operator === comp || high.operator === ecomp) {
        return false;
      } // If the lowest version comparator has an operator and our version
      // is less than it then it isn't higher than the range


      if ((!low.operator || low.operator === comp) && ltefn(version, low.semver)) {
        return false;
      } else if (low.operator === ecomp && ltfn(version, low.semver)) {
        return false;
      }
    }

    return true;
  }

  exports.prerelease = prerelease;

  function prerelease(version, options) {
    var parsed = parse(version, options);
    return parsed && parsed.prerelease.length ? parsed.prerelease : null;
  }

  exports.intersects = intersects;

  function intersects(r1, r2, options) {
    r1 = new Range(r1, options);
    r2 = new Range(r2, options);
    return r1.intersects(r2);
  }

  exports.coerce = coerce;

  function coerce(version, options) {
    if (version instanceof SemVer) {
      return version;
    }

    if (typeof version === 'number') {
      version = String(version);
    }

    if (typeof version !== 'string') {
      return null;
    }

    options = options || {};
    var match = null;

    if (!options.rtl) {
      match = version.match(re[t.COERCE]);
    } else {
      // Find the right-most coercible string that does not share
      // a terminus with a more left-ward coercible string.
      // Eg, '1.2.3.4' wants to coerce '2.3.4', not '3.4' or '4'
      //
      // Walk through the string checking with a /g regexp
      // Manually set the index so as to pick up overlapping matches.
      // Stop when we get a match that ends at the string end, since no
      // coercible string can be more right-ward without the same terminus.
      var next;

      while ((next = re[t.COERCERTL].exec(version)) && (!match || match.index + match[0].length !== version.length)) {
        if (!match || next.index + next[0].length !== match.index + match[0].length) {
          match = next;
        }

        re[t.COERCERTL].lastIndex = next.index + next[1].length + next[2].length;
      } // leave it in a clean state


      re[t.COERCERTL].lastIndex = -1;
    }

    if (match === null) {
      return null;
    }

    return parse(match[2] + '.' + (match[3] || '0') + '.' + (match[4] || '0'), options);
  }
});
var semver_1 = semver.SEMVER_SPEC_VERSION;
var semver_2 = semver.re;
var semver_3 = semver.src;
var semver_4 = semver.tokens;
var semver_5 = semver.parse;
var semver_6 = semver.valid;
var semver_7 = semver.clean;
var semver_8 = semver.SemVer;
var semver_9 = semver.inc;
var semver_10 = semver.diff;
var semver_11 = semver.compareIdentifiers;
var semver_12 = semver.rcompareIdentifiers;
var semver_13 = semver.major;
var semver_14 = semver.minor;
var semver_15 = semver.patch;
var semver_16 = semver.compare;
var semver_17 = semver.compareLoose;
var semver_18 = semver.compareBuild;
var semver_19 = semver.rcompare;
var semver_20 = semver.sort;
var semver_21 = semver.rsort;
var semver_22 = semver.gt;
var semver_23 = semver.lt;
var semver_24 = semver.eq;
var semver_25 = semver.neq;
var semver_26 = semver.gte;
var semver_27 = semver.lte;
var semver_28 = semver.cmp;
var semver_29 = semver.Comparator;
var semver_30 = semver.Range;
var semver_31 = semver.toComparators;
var semver_32 = semver.satisfies;
var semver_33 = semver.maxSatisfying;
var semver_34 = semver.minSatisfying;
var semver_35 = semver.minVersion;
var semver_36 = semver.validRange;
var semver_37 = semver.ltr;
var semver_38 = semver.gtr;
var semver_39 = semver.outside;
var semver_40 = semver.prerelease;
var semver_41 = semver.intersects;
var semver_42 = semver.coerce;

//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var isWindows = process.platform === 'win32'; // JavaScript implementation of realpath, ported from node pre-v6

var DEBUG = process.env.NODE_DEBUG && /fs/.test(process.env.NODE_DEBUG);

function rethrow() {
  // Only enable in debug mode. A backtrace uses ~1000 bytes of heap space and
  // is fairly slow to generate.
  var callback;

  if (DEBUG) {
    var backtrace = new Error();
    callback = debugCallback;
  } else callback = missingCallback;

  return callback;

  function debugCallback(err) {
    if (err) {
      backtrace.message = err.message;
      err = backtrace;
      missingCallback(err);
    }
  }

  function missingCallback(err) {
    if (err) {
      if (process.throwDeprecation) throw err; // Forgot a callback but don't know where? Use NODE_DEBUG=fs
      else if (!process.noDeprecation) {
          var msg = 'fs: missing callback ' + (err.stack || err.message);
          if (process.traceDeprecation) console.trace(msg);else console.error(msg);
        }
    }
  }
}

function maybeCallback(cb) {
  return typeof cb === 'function' ? cb : rethrow();
}

var normalize$1 = path$2.normalize; // Regexp that finds the next partion of a (partial) path
// result is [base_with_slash, base], e.g. ['somedir/', 'somedir']

if (isWindows) {
  var nextPartRe = /(.*?)(?:[\/\\]+|$)/g;
} else {
  var nextPartRe = /(.*?)(?:[\/]+|$)/g;
} // Regex to find the device root, including trailing slash. E.g. 'c:\\'.


if (isWindows) {
  var splitRootRe = /^(?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?[\\\/]*/;
} else {
  var splitRootRe = /^[\/]*/;
}

var realpathSync = function realpathSync(p, cache) {
  // make p is absolute
  p = path$2.resolve(p);

  if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
    return cache[p];
  }

  var original = p,
      seenLinks = {},
      knownHard = {}; // current character position in p

  var pos; // the partial path so far, including a trailing slash if any

  var current; // the partial path without a trailing slash (except when pointing at a root)

  var base; // the partial path scanned in the previous round, with slash

  var previous;
  start();

  function start() {
    // Skip over roots
    var m = splitRootRe.exec(p);
    pos = m[0].length;
    current = m[0];
    base = m[0];
    previous = ''; // On windows, check that the root exists. On unix there is no need.

    if (isWindows && !knownHard[base]) {
      fs.lstatSync(base);
      knownHard[base] = true;
    }
  } // walk down the path, swapping out linked pathparts for their real
  // values
  // NB: p.length changes.


  while (pos < p.length) {
    // find the next part
    nextPartRe.lastIndex = pos;
    var result = nextPartRe.exec(p);
    previous = current;
    current += result[0];
    base = previous + result[1];
    pos = nextPartRe.lastIndex; // continue if not a symlink

    if (knownHard[base] || cache && cache[base] === base) {
      continue;
    }

    var resolvedLink;

    if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
      // some known symbolic link.  no need to stat again.
      resolvedLink = cache[base];
    } else {
      var stat = fs.lstatSync(base);

      if (!stat.isSymbolicLink()) {
        knownHard[base] = true;
        if (cache) cache[base] = base;
        continue;
      } // read the link if it wasn't read before
      // dev/ino always return 0 on windows, so skip the check.


      var linkTarget = null;

      if (!isWindows) {
        var id = stat.dev.toString(32) + ':' + stat.ino.toString(32);

        if (seenLinks.hasOwnProperty(id)) {
          linkTarget = seenLinks[id];
        }
      }

      if (linkTarget === null) {
        fs.statSync(base);
        linkTarget = fs.readlinkSync(base);
      }

      resolvedLink = path$2.resolve(previous, linkTarget); // track this, if given a cache.

      if (cache) cache[base] = resolvedLink;
      if (!isWindows) seenLinks[id] = linkTarget;
    } // resolve the link, then start over


    p = path$2.resolve(resolvedLink, p.slice(pos));
    start();
  }

  if (cache) cache[original] = p;
  return p;
};

var realpath = function realpath(p, cache, cb) {
  if (typeof cb !== 'function') {
    cb = maybeCallback(cache);
    cache = null;
  } // make p is absolute


  p = path$2.resolve(p);

  if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
    return process.nextTick(cb.bind(null, null, cache[p]));
  }

  var original = p,
      seenLinks = {},
      knownHard = {}; // current character position in p

  var pos; // the partial path so far, including a trailing slash if any

  var current; // the partial path without a trailing slash (except when pointing at a root)

  var base; // the partial path scanned in the previous round, with slash

  var previous;
  start();

  function start() {
    // Skip over roots
    var m = splitRootRe.exec(p);
    pos = m[0].length;
    current = m[0];
    base = m[0];
    previous = ''; // On windows, check that the root exists. On unix there is no need.

    if (isWindows && !knownHard[base]) {
      fs.lstat(base, function (err) {
        if (err) return cb(err);
        knownHard[base] = true;
        LOOP();
      });
    } else {
      process.nextTick(LOOP);
    }
  } // walk down the path, swapping out linked pathparts for their real
  // values


  function LOOP() {
    // stop if scanned past end of path
    if (pos >= p.length) {
      if (cache) cache[original] = p;
      return cb(null, p);
    } // find the next part


    nextPartRe.lastIndex = pos;
    var result = nextPartRe.exec(p);
    previous = current;
    current += result[0];
    base = previous + result[1];
    pos = nextPartRe.lastIndex; // continue if not a symlink

    if (knownHard[base] || cache && cache[base] === base) {
      return process.nextTick(LOOP);
    }

    if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
      // known symbolic link.  no need to stat again.
      return gotResolvedLink(cache[base]);
    }

    return fs.lstat(base, gotStat);
  }

  function gotStat(err, stat) {
    if (err) return cb(err); // if not a symlink, skip to the next path part

    if (!stat.isSymbolicLink()) {
      knownHard[base] = true;
      if (cache) cache[base] = base;
      return process.nextTick(LOOP);
    } // stat & read the link if not read before
    // call gotTarget as soon as the link target is known
    // dev/ino always return 0 on windows, so skip the check.


    if (!isWindows) {
      var id = stat.dev.toString(32) + ':' + stat.ino.toString(32);

      if (seenLinks.hasOwnProperty(id)) {
        return gotTarget(null, seenLinks[id], base);
      }
    }

    fs.stat(base, function (err) {
      if (err) return cb(err);
      fs.readlink(base, function (err, target) {
        if (!isWindows) seenLinks[id] = target;
        gotTarget(err, target);
      });
    });
  }

  function gotTarget(err, target, base) {
    if (err) return cb(err);
    var resolvedLink = path$2.resolve(previous, target);
    if (cache) cache[base] = resolvedLink;
    gotResolvedLink(resolvedLink);
  }

  function gotResolvedLink(resolvedLink) {
    // resolve the link, then start over
    p = path$2.resolve(resolvedLink, p.slice(pos));
    start();
  }
};

var old = {
  realpathSync: realpathSync,
  realpath: realpath
};

var fs_realpath = realpath$1;
realpath$1.realpath = realpath$1;
realpath$1.sync = realpathSync$1;
realpath$1.realpathSync = realpathSync$1;
realpath$1.monkeypatch = monkeypatch;
realpath$1.unmonkeypatch = unmonkeypatch;
var origRealpath = fs.realpath;
var origRealpathSync = fs.realpathSync;
var version = process.version;
var ok = /^v[0-5]\./.test(version);

function newError(er) {
  return er && er.syscall === 'realpath' && (er.code === 'ELOOP' || er.code === 'ENOMEM' || er.code === 'ENAMETOOLONG');
}

function realpath$1(p, cache, cb) {
  if (ok) {
    return origRealpath(p, cache, cb);
  }

  if (typeof cache === 'function') {
    cb = cache;
    cache = null;
  }

  origRealpath(p, cache, function (er, result) {
    if (newError(er)) {
      old.realpath(p, cache, cb);
    } else {
      cb(er, result);
    }
  });
}

function realpathSync$1(p, cache) {
  if (ok) {
    return origRealpathSync(p, cache);
  }

  try {
    return origRealpathSync(p, cache);
  } catch (er) {
    if (newError(er)) {
      return old.realpathSync(p, cache);
    } else {
      throw er;
    }
  }
}

function monkeypatch() {
  fs.realpath = realpath$1;
  fs.realpathSync = realpathSync$1;
}

function unmonkeypatch() {
  fs.realpath = origRealpath;
  fs.realpathSync = origRealpathSync;
}

var $indexOf = arrayIncludes.indexOf;


var nativeIndexOf = [].indexOf;

var NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
var SLOPPY_METHOD$1 = sloppyArrayMethod('indexOf');

// `Array.prototype.indexOf` method
// https://tc39.github.io/ecma262/#sec-array.prototype.indexof
_export({ target: 'Array', proto: true, forced: NEGATIVE_ZERO || SLOPPY_METHOD$1 }, {
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? nativeIndexOf.apply(this, arguments) || 0
      : $indexOf(this, searchElement, arguments.length > 1 ? arguments[1] : undefined);
  }
});

var concatMap = function concatMap(xs, fn) {
  var res = [];

  for (var i = 0; i < xs.length; i++) {
    var x = fn(xs[i], i);
    if (isArray$1(x)) res.push.apply(res, x);else res.push(x);
  }

  return res;
};

var isArray$1 = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

var balancedMatch = balanced;

function balanced(a, b, str) {
  if (a instanceof RegExp) a = maybeMatch(a, str);
  if (b instanceof RegExp) b = maybeMatch(b, str);
  var r = range(a, b, str);
  return r && {
    start: r[0],
    end: r[1],
    pre: str.slice(0, r[0]),
    body: str.slice(r[0] + a.length, r[1]),
    post: str.slice(r[1] + b.length)
  };
}

function maybeMatch(reg, str) {
  var m = str.match(reg);
  return m ? m[0] : null;
}

balanced.range = range;

function range(a, b, str) {
  var begs, beg, left, right, result;
  var ai = str.indexOf(a);
  var bi = str.indexOf(b, ai + 1);
  var i = ai;

  if (ai >= 0 && bi > 0) {
    begs = [];
    left = str.length;

    while (i >= 0 && !result) {
      if (i == ai) {
        begs.push(i);
        ai = str.indexOf(a, i + 1);
      } else if (begs.length == 1) {
        result = [begs.pop(), bi];
      } else {
        beg = begs.pop();

        if (beg < left) {
          left = beg;
          right = bi;
        }

        bi = str.indexOf(b, i + 1);
      }

      i = ai < bi && ai >= 0 ? ai : bi;
    }

    if (begs.length) {
      result = [left, right];
    }
  }

  return result;
}

var braceExpansion = expandTop;
var escSlash = '\0SLASH' + Math.random() + '\0';
var escOpen = '\0OPEN' + Math.random() + '\0';
var escClose = '\0CLOSE' + Math.random() + '\0';
var escComma = '\0COMMA' + Math.random() + '\0';
var escPeriod = '\0PERIOD' + Math.random() + '\0';

function numeric(str) {
  return parseInt(str, 10) == str ? parseInt(str, 10) : str.charCodeAt(0);
}

function escapeBraces(str) {
  return str.split('\\\\').join(escSlash).split('\\{').join(escOpen).split('\\}').join(escClose).split('\\,').join(escComma).split('\\.').join(escPeriod);
}

function unescapeBraces(str) {
  return str.split(escSlash).join('\\').split(escOpen).join('{').split(escClose).join('}').split(escComma).join(',').split(escPeriod).join('.');
} // Basically just str.split(","), but handling cases
// where we have nested braced sections, which should be
// treated as individual members, like {a,{b,c},d}


function parseCommaParts(str) {
  if (!str) return [''];
  var parts = [];
  var m = balancedMatch('{', '}', str);
  if (!m) return str.split(',');
  var pre = m.pre;
  var body = m.body;
  var post = m.post;
  var p = pre.split(',');
  p[p.length - 1] += '{' + body + '}';
  var postParts = parseCommaParts(post);

  if (post.length) {
    p[p.length - 1] += postParts.shift();
    p.push.apply(p, postParts);
  }

  parts.push.apply(parts, p);
  return parts;
}

function expandTop(str) {
  if (!str) return []; // I don't know why Bash 4.3 does this, but it does.
  // Anything starting with {} will have the first two bytes preserved
  // but *only* at the top level, so {},a}b will not expand to anything,
  // but a{},b}c will be expanded to [a}c,abc].
  // One could argue that this is a bug in Bash, but since the goal of
  // this module is to match Bash's rules, we escape a leading {}

  if (str.substr(0, 2) === '{}') {
    str = '\\{\\}' + str.substr(2);
  }

  return expand(escapeBraces(str), true).map(unescapeBraces);
}

function embrace(str) {
  return '{' + str + '}';
}

function isPadded(el) {
  return /^-?0\d/.test(el);
}

function lte(i, y) {
  return i <= y;
}

function gte(i, y) {
  return i >= y;
}

function expand(str, isTop) {
  var expansions = [];
  var m = balancedMatch('{', '}', str);
  if (!m || /\$$/.test(m.pre)) return [str];
  var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
  var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
  var isSequence = isNumericSequence || isAlphaSequence;
  var isOptions = m.body.indexOf(',') >= 0;

  if (!isSequence && !isOptions) {
    // {a},b}
    if (m.post.match(/,.*\}/)) {
      str = m.pre + '{' + m.body + escClose + m.post;
      return expand(str);
    }

    return [str];
  }

  var n;

  if (isSequence) {
    n = m.body.split(/\.\./);
  } else {
    n = parseCommaParts(m.body);

    if (n.length === 1) {
      // x{{a,b}}y ==> x{a}y x{b}y
      n = expand(n[0], false).map(embrace);

      if (n.length === 1) {
        var post = m.post.length ? expand(m.post, false) : [''];
        return post.map(function (p) {
          return m.pre + n[0] + p;
        });
      }
    }
  } // at this point, n is the parts, and we know it's not a comma set
  // with a single entry.
  // no need to expand pre, since it is guaranteed to be free of brace-sets


  var pre = m.pre;
  var post = m.post.length ? expand(m.post, false) : [''];
  var N;

  if (isSequence) {
    var x = numeric(n[0]);
    var y = numeric(n[1]);
    var width = Math.max(n[0].length, n[1].length);
    var incr = n.length == 3 ? Math.abs(numeric(n[2])) : 1;
    var test = lte;
    var reverse = y < x;

    if (reverse) {
      incr *= -1;
      test = gte;
    }

    var pad = n.some(isPadded);
    N = [];

    for (var i = x; test(i, y); i += incr) {
      var c;

      if (isAlphaSequence) {
        c = String.fromCharCode(i);
        if (c === '\\') c = '';
      } else {
        c = String(i);

        if (pad) {
          var need = width - c.length;

          if (need > 0) {
            var z = new Array(need + 1).join('0');
            if (i < 0) c = '-' + z + c.slice(1);else c = z + c;
          }
        }
      }

      N.push(c);
    }
  } else {
    N = concatMap(n, function (el) {
      return expand(el, false);
    });
  }

  for (var j = 0; j < N.length; j++) {
    for (var k = 0; k < post.length; k++) {
      var expansion = pre + N[j] + post[k];
      if (!isTop || isSequence || expansion) expansions.push(expansion);
    }
  }

  return expansions;
}

var minimatch_1 = minimatch;
minimatch.Minimatch = Minimatch;
var path$1 = {
  sep: '/'
};

try {
  path$1 = path$2;
} catch (er) {}

var GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {};
var plTypes = {
  '!': {
    open: '(?:(?!(?:',
    close: '))[^/]*?)'
  },
  '?': {
    open: '(?:',
    close: ')?'
  },
  '+': {
    open: '(?:',
    close: ')+'
  },
  '*': {
    open: '(?:',
    close: ')*'
  },
  '@': {
    open: '(?:',
    close: ')'
  }
}; // any single thing other than /
// don't need to escape / when using new RegExp()

var qmark = '[^/]'; // * => any number of characters

var star = qmark + '*?'; // ** when dots are allowed.  Anything goes, except .. and .
// not (^ or / followed by one or two dots followed by $ or /),
// followed by anything, any number of times.

var twoStarDot = '(?:(?!(?:\\\/|^)(?:\\.{1,2})($|\\\/)).)*?'; // not a ^ or / followed by a dot,
// followed by anything, any number of times.

var twoStarNoDot = '(?:(?!(?:\\\/|^)\\.).)*?'; // characters that need to be escaped in RegExp.

var reSpecials = charSet('().*{}+?[]^$\\!'); // "abc" -> { a:true, b:true, c:true }

function charSet(s) {
  return s.split('').reduce(function (set, c) {
    set[c] = true;
    return set;
  }, {});
} // normalizes slashes.


var slashSplit = /\/+/;
minimatch.filter = filter;

function filter(pattern, options) {
  options = options || {};
  return function (p, i, list) {
    return minimatch(p, pattern, options);
  };
}

function ext(a, b) {
  a = a || {};
  b = b || {};
  var t = {};
  Object.keys(b).forEach(function (k) {
    t[k] = b[k];
  });
  Object.keys(a).forEach(function (k) {
    t[k] = a[k];
  });
  return t;
}

minimatch.defaults = function (def) {
  if (!def || !Object.keys(def).length) return minimatch;
  var orig = minimatch;

  var m = function minimatch(p, pattern, options) {
    return orig.minimatch(p, pattern, ext(def, options));
  };

  m.Minimatch = function Minimatch(pattern, options) {
    return new orig.Minimatch(pattern, ext(def, options));
  };

  return m;
};

Minimatch.defaults = function (def) {
  if (!def || !Object.keys(def).length) return Minimatch;
  return minimatch.defaults(def).Minimatch;
};

function minimatch(p, pattern, options) {
  if (typeof pattern !== 'string') {
    throw new TypeError('glob pattern string required');
  }

  if (!options) options = {}; // shortcut: comments match nothing.

  if (!options.nocomment && pattern.charAt(0) === '#') {
    return false;
  } // "" only matches ""


  if (pattern.trim() === '') return p === '';
  return new Minimatch(pattern, options).match(p);
}

function Minimatch(pattern, options) {
  if (!(this instanceof Minimatch)) {
    return new Minimatch(pattern, options);
  }

  if (typeof pattern !== 'string') {
    throw new TypeError('glob pattern string required');
  }

  if (!options) options = {};
  pattern = pattern.trim(); // windows support: need to use /, not \

  if (path$1.sep !== '/') {
    pattern = pattern.split(path$1.sep).join('/');
  }

  this.options = options;
  this.set = [];
  this.pattern = pattern;
  this.regexp = null;
  this.negate = false;
  this.comment = false;
  this.empty = false; // make the set of regexps etc.

  this.make();
}

Minimatch.prototype.debug = function () {};

Minimatch.prototype.make = make;

function make() {
  // don't do it more than once.
  if (this._made) return;
  var pattern = this.pattern;
  var options = this.options; // empty patterns and comments match nothing.

  if (!options.nocomment && pattern.charAt(0) === '#') {
    this.comment = true;
    return;
  }

  if (!pattern) {
    this.empty = true;
    return;
  } // step 1: figure out negation, etc.


  this.parseNegate(); // step 2: expand braces

  var set = this.globSet = this.braceExpand();
  if (options.debug) this.debug = console.error;
  this.debug(this.pattern, set); // step 3: now we have a set, so turn each one into a series of path-portion
  // matching patterns.
  // These will be regexps, except in the case of "**", which is
  // set to the GLOBSTAR object for globstar behavior,
  // and will not contain any / characters

  set = this.globParts = set.map(function (s) {
    return s.split(slashSplit);
  });
  this.debug(this.pattern, set); // glob --> regexps

  set = set.map(function (s, si, set) {
    return s.map(this.parse, this);
  }, this);
  this.debug(this.pattern, set); // filter out everything that didn't compile properly.

  set = set.filter(function (s) {
    return s.indexOf(false) === -1;
  });
  this.debug(this.pattern, set);
  this.set = set;
}

Minimatch.prototype.parseNegate = parseNegate;

function parseNegate() {
  var pattern = this.pattern;
  var negate = false;
  var options = this.options;
  var negateOffset = 0;
  if (options.nonegate) return;

  for (var i = 0, l = pattern.length; i < l && pattern.charAt(i) === '!'; i++) {
    negate = !negate;
    negateOffset++;
  }

  if (negateOffset) this.pattern = pattern.substr(negateOffset);
  this.negate = negate;
} // Brace expansion:
// a{b,c}d -> abd acd
// a{b,}c -> abc ac
// a{0..3}d -> a0d a1d a2d a3d
// a{b,c{d,e}f}g -> abg acdfg acefg
// a{b,c}d{e,f}g -> abdeg acdeg abdeg abdfg
//
// Invalid sets are not expanded.
// a{2..}b -> a{2..}b
// a{b}c -> a{b}c


minimatch.braceExpand = function (pattern, options) {
  return braceExpand(pattern, options);
};

Minimatch.prototype.braceExpand = braceExpand;

function braceExpand(pattern, options) {
  if (!options) {
    if (this instanceof Minimatch) {
      options = this.options;
    } else {
      options = {};
    }
  }

  pattern = typeof pattern === 'undefined' ? this.pattern : pattern;

  if (typeof pattern === 'undefined') {
    throw new TypeError('undefined pattern');
  }

  if (options.nobrace || !pattern.match(/\{.*\}/)) {
    // shortcut. no need to expand.
    return [pattern];
  }

  return braceExpansion(pattern);
} // parse a component of the expanded set.
// At this point, no pattern may contain "/" in it
// so we're going to return a 2d array, where each entry is the full
// pattern, split on '/', and then turned into a regular expression.
// A regexp is made at the end which joins each array with an
// escaped /, and another full one which joins each regexp with |.
//
// Following the lead of Bash 4.1, note that "**" only has special meaning
// when it is the *only* thing in a path portion.  Otherwise, any series
// of * is equivalent to a single *.  Globstar behavior is enabled by
// default, and can be disabled by setting options.noglobstar.


Minimatch.prototype.parse = parse;
var SUBPARSE = {};

function parse(pattern, isSub) {
  if (pattern.length > 1024 * 64) {
    throw new TypeError('pattern is too long');
  }

  var options = this.options; // shortcuts

  if (!options.noglobstar && pattern === '**') return GLOBSTAR;
  if (pattern === '') return '';
  var re = '';
  var hasMagic = !!options.nocase;
  var escaping = false; // ? => one single character

  var patternListStack = [];
  var negativeLists = [];
  var stateChar;
  var inClass = false;
  var reClassStart = -1;
  var classStart = -1; // . and .. never match anything that doesn't start with .,
  // even when options.dot is set.

  var patternStart = pattern.charAt(0) === '.' ? '' // anything
  // not (start or / followed by . or .. followed by / or end)
  : options.dot ? '(?!(?:^|\\\/)\\.{1,2}(?:$|\\\/))' : '(?!\\.)';
  var self = this;

  function clearStateChar() {
    if (stateChar) {
      // we had some state-tracking character
      // that wasn't consumed by this pass.
      switch (stateChar) {
        case '*':
          re += star;
          hasMagic = true;
          break;

        case '?':
          re += qmark;
          hasMagic = true;
          break;

        default:
          re += '\\' + stateChar;
          break;
      }

      self.debug('clearStateChar %j %j', stateChar, re);
      stateChar = false;
    }
  }

  for (var i = 0, len = pattern.length, c; i < len && (c = pattern.charAt(i)); i++) {
    this.debug('%s\t%s %s %j', pattern, i, re, c); // skip over any that are escaped.

    if (escaping && reSpecials[c]) {
      re += '\\' + c;
      escaping = false;
      continue;
    }

    switch (c) {
      case '/':
        // completely not allowed, even escaped.
        // Should already be path-split by now.
        return false;

      case '\\':
        clearStateChar();
        escaping = true;
        continue;
      // the various stateChar values
      // for the "extglob" stuff.

      case '?':
      case '*':
      case '+':
      case '@':
      case '!':
        this.debug('%s\t%s %s %j <-- stateChar', pattern, i, re, c); // all of those are literals inside a class, except that
        // the glob [!a] means [^a] in regexp

        if (inClass) {
          this.debug('  in class');
          if (c === '!' && i === classStart + 1) c = '^';
          re += c;
          continue;
        } // if we already have a stateChar, then it means
        // that there was something like ** or +? in there.
        // Handle the stateChar, then proceed with this one.


        self.debug('call clearStateChar %j', stateChar);
        clearStateChar();
        stateChar = c; // if extglob is disabled, then +(asdf|foo) isn't a thing.
        // just clear the statechar *now*, rather than even diving into
        // the patternList stuff.

        if (options.noext) clearStateChar();
        continue;

      case '(':
        if (inClass) {
          re += '(';
          continue;
        }

        if (!stateChar) {
          re += '\\(';
          continue;
        }

        patternListStack.push({
          type: stateChar,
          start: i - 1,
          reStart: re.length,
          open: plTypes[stateChar].open,
          close: plTypes[stateChar].close
        }); // negation is (?:(?!js)[^/]*)

        re += stateChar === '!' ? '(?:(?!(?:' : '(?:';
        this.debug('plType %j %j', stateChar, re);
        stateChar = false;
        continue;

      case ')':
        if (inClass || !patternListStack.length) {
          re += '\\)';
          continue;
        }

        clearStateChar();
        hasMagic = true;
        var pl = patternListStack.pop(); // negation is (?:(?!js)[^/]*)
        // The others are (?:<pattern>)<type>

        re += pl.close;

        if (pl.type === '!') {
          negativeLists.push(pl);
        }

        pl.reEnd = re.length;
        continue;

      case '|':
        if (inClass || !patternListStack.length || escaping) {
          re += '\\|';
          escaping = false;
          continue;
        }

        clearStateChar();
        re += '|';
        continue;
      // these are mostly the same in regexp and glob

      case '[':
        // swallow any state-tracking char before the [
        clearStateChar();

        if (inClass) {
          re += '\\' + c;
          continue;
        }

        inClass = true;
        classStart = i;
        reClassStart = re.length;
        re += c;
        continue;

      case ']':
        //  a right bracket shall lose its special
        //  meaning and represent itself in
        //  a bracket expression if it occurs
        //  first in the list.  -- POSIX.2 2.8.3.2
        if (i === classStart + 1 || !inClass) {
          re += '\\' + c;
          escaping = false;
          continue;
        } // handle the case where we left a class open.
        // "[z-a]" is valid, equivalent to "\[z-a\]"


        if (inClass) {
          // split where the last [ was, make sure we don't have
          // an invalid re. if so, re-walk the contents of the
          // would-be class to re-translate any characters that
          // were passed through as-is
          // TODO: It would probably be faster to determine this
          // without a try/catch and a new RegExp, but it's tricky
          // to do safely.  For now, this is safe and works.
          var cs = pattern.substring(classStart + 1, i);

          try {
            RegExp('[' + cs + ']');
          } catch (er) {
            // not a valid class!
            var sp = this.parse(cs, SUBPARSE);
            re = re.substr(0, reClassStart) + '\\[' + sp[0] + '\\]';
            hasMagic = hasMagic || sp[1];
            inClass = false;
            continue;
          }
        } // finish up the class.


        hasMagic = true;
        inClass = false;
        re += c;
        continue;

      default:
        // swallow any state char that wasn't consumed
        clearStateChar();

        if (escaping) {
          // no need
          escaping = false;
        } else if (reSpecials[c] && !(c === '^' && inClass)) {
          re += '\\';
        }

        re += c;
    } // switch

  } // for
  // handle the case where we left a class open.
  // "[abc" is valid, equivalent to "\[abc"


  if (inClass) {
    // split where the last [ was, and escape it
    // this is a huge pita.  We now have to re-walk
    // the contents of the would-be class to re-translate
    // any characters that were passed through as-is
    cs = pattern.substr(classStart + 1);
    sp = this.parse(cs, SUBPARSE);
    re = re.substr(0, reClassStart) + '\\[' + sp[0];
    hasMagic = hasMagic || sp[1];
  } // handle the case where we had a +( thing at the *end*
  // of the pattern.
  // each pattern list stack adds 3 chars, and we need to go through
  // and escape any | chars that were passed through as-is for the regexp.
  // Go through and escape them, taking care not to double-escape any
  // | chars that were already escaped.


  for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
    var tail = re.slice(pl.reStart + pl.open.length);
    this.debug('setting tail', re, pl); // maybe some even number of \, then maybe 1 \, followed by a |

    tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, function (_, $1, $2) {
      if (!$2) {
        // the | isn't already escaped, so escape it.
        $2 = '\\';
      } // need to escape all those slashes *again*, without escaping the
      // one that we need for escaping the | character.  As it works out,
      // escaping an even number of slashes can be done by simply repeating
      // it exactly after itself.  That's why this trick works.
      //
      // I am sorry that you have to see this.


      return $1 + $1 + $2 + '|';
    });
    this.debug('tail=%j\n   %s', tail, tail, pl, re);
    var t = pl.type === '*' ? star : pl.type === '?' ? qmark : '\\' + pl.type;
    hasMagic = true;
    re = re.slice(0, pl.reStart) + t + '\\(' + tail;
  } // handle trailing things that only matter at the very end.


  clearStateChar();

  if (escaping) {
    // trailing \\
    re += '\\\\';
  } // only need to apply the nodot start if the re starts with
  // something that could conceivably capture a dot


  var addPatternStart = false;

  switch (re.charAt(0)) {
    case '.':
    case '[':
    case '(':
      addPatternStart = true;
  } // Hack to work around lack of negative lookbehind in JS
  // A pattern like: *.!(x).!(y|z) needs to ensure that a name
  // like 'a.xyz.yz' doesn't match.  So, the first negative
  // lookahead, has to look ALL the way ahead, to the end of
  // the pattern.


  for (var n = negativeLists.length - 1; n > -1; n--) {
    var nl = negativeLists[n];
    var nlBefore = re.slice(0, nl.reStart);
    var nlFirst = re.slice(nl.reStart, nl.reEnd - 8);
    var nlLast = re.slice(nl.reEnd - 8, nl.reEnd);
    var nlAfter = re.slice(nl.reEnd);
    nlLast += nlAfter; // Handle nested stuff like *(*.js|!(*.json)), where open parens
    // mean that we should *not* include the ) in the bit that is considered
    // "after" the negated section.

    var openParensBefore = nlBefore.split('(').length - 1;
    var cleanAfter = nlAfter;

    for (i = 0; i < openParensBefore; i++) {
      cleanAfter = cleanAfter.replace(/\)[+*?]?/, '');
    }

    nlAfter = cleanAfter;
    var dollar = '';

    if (nlAfter === '' && isSub !== SUBPARSE) {
      dollar = '$';
    }

    var newRe = nlBefore + nlFirst + nlAfter + dollar + nlLast;
    re = newRe;
  } // if the re is not "" at this point, then we need to make sure
  // it doesn't match against an empty path part.
  // Otherwise a/* will match a/, which it should not.


  if (re !== '' && hasMagic) {
    re = '(?=.)' + re;
  }

  if (addPatternStart) {
    re = patternStart + re;
  } // parsing just a piece of a larger pattern.


  if (isSub === SUBPARSE) {
    return [re, hasMagic];
  } // skip the regexp for non-magical patterns
  // unescape anything in it, though, so that it'll be
  // an exact match against a file etc.


  if (!hasMagic) {
    return globUnescape(pattern);
  }

  var flags = options.nocase ? 'i' : '';

  try {
    var regExp = new RegExp('^' + re + '$', flags);
  } catch (er) {
    // If it was an invalid regular expression, then it can't match
    // anything.  This trick looks for a character after the end of
    // the string, which is of course impossible, except in multi-line
    // mode, but it's not a /m regex.
    return new RegExp('$.');
  }

  regExp._glob = pattern;
  regExp._src = re;
  return regExp;
}

minimatch.makeRe = function (pattern, options) {
  return new Minimatch(pattern, options || {}).makeRe();
};

Minimatch.prototype.makeRe = makeRe;

function makeRe() {
  if (this.regexp || this.regexp === false) return this.regexp; // at this point, this.set is a 2d array of partial
  // pattern strings, or "**".
  //
  // It's better to use .match().  This function shouldn't
  // be used, really, but it's pretty convenient sometimes,
  // when you just want to work with a regex.

  var set = this.set;

  if (!set.length) {
    this.regexp = false;
    return this.regexp;
  }

  var options = this.options;
  var twoStar = options.noglobstar ? star : options.dot ? twoStarDot : twoStarNoDot;
  var flags = options.nocase ? 'i' : '';
  var re = set.map(function (pattern) {
    return pattern.map(function (p) {
      return p === GLOBSTAR ? twoStar : typeof p === 'string' ? regExpEscape(p) : p._src;
    }).join('\\\/');
  }).join('|'); // must match entire pattern
  // ending in a * or ** will make it less strict.

  re = '^(?:' + re + ')$'; // can match anything, as long as it's not this.

  if (this.negate) re = '^(?!' + re + ').*$';

  try {
    this.regexp = new RegExp(re, flags);
  } catch (ex) {
    this.regexp = false;
  }

  return this.regexp;
}

minimatch.match = function (list, pattern, options) {
  options = options || {};
  var mm = new Minimatch(pattern, options);
  list = list.filter(function (f) {
    return mm.match(f);
  });

  if (mm.options.nonull && !list.length) {
    list.push(pattern);
  }

  return list;
};

Minimatch.prototype.match = match;

function match(f, partial) {
  this.debug('match', f, this.pattern); // short-circuit in the case of busted things.
  // comments, etc.

  if (this.comment) return false;
  if (this.empty) return f === '';
  if (f === '/' && partial) return true;
  var options = this.options; // windows: need to use /, not \

  if (path$1.sep !== '/') {
    f = f.split(path$1.sep).join('/');
  } // treat the test path as a set of pathparts.


  f = f.split(slashSplit);
  this.debug(this.pattern, 'split', f); // just ONE of the pattern sets in this.set needs to match
  // in order for it to be valid.  If negating, then just one
  // match means that we have failed.
  // Either way, return on the first hit.

  var set = this.set;
  this.debug(this.pattern, 'set', set); // Find the basename of the path by looking for the last non-empty segment

  var filename;
  var i;

  for (i = f.length - 1; i >= 0; i--) {
    filename = f[i];
    if (filename) break;
  }

  for (i = 0; i < set.length; i++) {
    var pattern = set[i];
    var file = f;

    if (options.matchBase && pattern.length === 1) {
      file = [filename];
    }

    var hit = this.matchOne(file, pattern, partial);

    if (hit) {
      if (options.flipNegate) return true;
      return !this.negate;
    }
  } // didn't get any hits.  this is success if it's a negative
  // pattern, failure otherwise.


  if (options.flipNegate) return false;
  return this.negate;
} // set partial to true to test if, for example,
// "/a/b" matches the start of "/*/b/*/d"
// Partial means, if you run out of file before you run
// out of pattern, then that's fine, as long as all
// the parts match.


Minimatch.prototype.matchOne = function (file, pattern, partial) {
  var options = this.options;
  this.debug('matchOne', {
    'this': this,
    file: file,
    pattern: pattern
  });
  this.debug('matchOne', file.length, pattern.length);

  for (var fi = 0, pi = 0, fl = file.length, pl = pattern.length; fi < fl && pi < pl; fi++, pi++) {
    this.debug('matchOne loop');
    var p = pattern[pi];
    var f = file[fi];
    this.debug(pattern, p, f); // should be impossible.
    // some invalid regexp stuff in the set.

    if (p === false) return false;

    if (p === GLOBSTAR) {
      this.debug('GLOBSTAR', [pattern, p, f]); // "**"
      // a/**/b/**/c would match the following:
      // a/b/x/y/z/c
      // a/x/y/z/b/c
      // a/b/x/b/x/c
      // a/b/c
      // To do this, take the rest of the pattern after
      // the **, and see if it would match the file remainder.
      // If so, return success.
      // If not, the ** "swallows" a segment, and try again.
      // This is recursively awful.
      //
      // a/**/b/**/c matching a/b/x/y/z/c
      // - a matches a
      // - doublestar
      //   - matchOne(b/x/y/z/c, b/**/c)
      //     - b matches b
      //     - doublestar
      //       - matchOne(x/y/z/c, c) -> no
      //       - matchOne(y/z/c, c) -> no
      //       - matchOne(z/c, c) -> no
      //       - matchOne(c, c) yes, hit

      var fr = fi;
      var pr = pi + 1;

      if (pr === pl) {
        this.debug('** at the end'); // a ** at the end will just swallow the rest.
        // We have found a match.
        // however, it will not swallow /.x, unless
        // options.dot is set.
        // . and .. are *never* matched by **, for explosively
        // exponential reasons.

        for (; fi < fl; fi++) {
          if (file[fi] === '.' || file[fi] === '..' || !options.dot && file[fi].charAt(0) === '.') return false;
        }

        return true;
      } // ok, let's see if we can swallow whatever we can.


      while (fr < fl) {
        var swallowee = file[fr];
        this.debug('\nglobstar while', file, fr, pattern, pr, swallowee); // XXX remove this slice.  Just pass the start index.

        if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
          this.debug('globstar found match!', fr, fl, swallowee); // found a match.

          return true;
        } else {
          // can't swallow "." or ".." ever.
          // can only swallow ".foo" when explicitly asked.
          if (swallowee === '.' || swallowee === '..' || !options.dot && swallowee.charAt(0) === '.') {
            this.debug('dot detected!', file, fr, pattern, pr);
            break;
          } // ** swallows a segment, and continue.


          this.debug('globstar swallow a segment, and continue');
          fr++;
        }
      } // no match was found.
      // However, in partial mode, we can't say this is necessarily over.
      // If there's more *pattern* left, then


      if (partial) {
        // ran out of file
        this.debug('\n>>> no match, partial?', file, fr, pattern, pr);
        if (fr === fl) return true;
      }

      return false;
    } // something other than **
    // non-magic patterns just have to match exactly
    // patterns with magic have been turned into regexps.


    var hit;

    if (typeof p === 'string') {
      if (options.nocase) {
        hit = f.toLowerCase() === p.toLowerCase();
      } else {
        hit = f === p;
      }

      this.debug('string match', p, f, hit);
    } else {
      hit = f.match(p);
      this.debug('pattern match', p, f, hit);
    }

    if (!hit) return false;
  } // Note: ending in / means that we'll get a final ""
  // at the end of the pattern.  This can only match a
  // corresponding "" at the end of the file.
  // If the file ends in /, then it can only match a
  // a pattern that ends in /, unless the pattern just
  // doesn't have any more for it. But, a/b/ should *not*
  // match "a/b/*", even though "" matches against the
  // [^/]*? pattern, except in partial mode, where it might
  // simply not be reached yet.
  // However, a/b/ should still satisfy a/*
  // now either we fell off the end of the pattern, or we're done.


  if (fi === fl && pi === pl) {
    // ran out of pattern and filename at the same time.
    // an exact hit!
    return true;
  } else if (fi === fl) {
    // ran out of file, but still had pattern left.
    // this is ok if we're doing the match as part of
    // a glob fs traversal.
    return partial;
  } else if (pi === pl) {
    // ran out of pattern, still have file left.
    // this is only acceptable if we're on the very last
    // empty segment of a file with a trailing slash.
    // a/* should match a/b/
    var emptyFileEnd = fi === fl - 1 && file[fi] === '';
    return emptyFileEnd;
  } // should be unreachable.


  throw new Error('wtf?');
}; // replace stuff like \* with *


function globUnescape(s) {
  return s.replace(/\\(.)/g, '$1');
}

function regExpEscape(s) {
  return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

var inherits_browser = createCommonjsModule(function (module) {
  if (typeof Object.create === 'function') {
    // implementation from standard node.js 'util' module
    module.exports = function inherits(ctor, superCtor) {
      if (superCtor) {
        ctor.super_ = superCtor;
        ctor.prototype = Object.create(superCtor.prototype, {
          constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
          }
        });
      }
    };
  } else {
    // old school shim for old browsers
    module.exports = function inherits(ctor, superCtor) {
      if (superCtor) {
        ctor.super_ = superCtor;

        var TempCtor = function TempCtor() {};

        TempCtor.prototype = superCtor.prototype;
        ctor.prototype = new TempCtor();
        ctor.prototype.constructor = ctor;
      }
    };
  }
});

var inherits = createCommonjsModule(function (module) {
  try {
    var util$1 = util;
    /* istanbul ignore next */

    if (typeof util$1.inherits !== 'function') throw '';
    module.exports = util$1.inherits;
  } catch (e) {
    /* istanbul ignore next */
    module.exports = inherits_browser;
  }
});

function posix(path) {
  return path.charAt(0) === '/';
}

function win32(path) {
  // https://github.com/nodejs/node/blob/b3fcc245fb25539909ef1d5eaa01dbf92e168633/lib/path.js#L56
  var splitDeviceRe = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;
  var result = splitDeviceRe.exec(path);
  var device = result[1] || '';
  var isUnc = Boolean(device && device.charAt(1) !== ':'); // UNC paths are always absolute

  return Boolean(result[2] || isUnc);
}

var pathIsAbsolute = process.platform === 'win32' ? win32 : posix;
var posix_1 = posix;
var win32_1 = win32;
pathIsAbsolute.posix = posix_1;
pathIsAbsolute.win32 = win32_1;

var alphasort_1 = alphasort;
var alphasorti_1 = alphasorti;
var setopts_1 = setopts;
var ownProp_1 = ownProp;
var makeAbs_1 = makeAbs;
var finish_1 = finish;
var mark_1 = mark;
var isIgnored_1 = isIgnored;
var childrenIgnored_1 = childrenIgnored;

function ownProp(obj, field) {
  return Object.prototype.hasOwnProperty.call(obj, field);
}

var Minimatch$1 = minimatch_1.Minimatch;

function alphasorti(a, b) {
  return a.toLowerCase().localeCompare(b.toLowerCase());
}

function alphasort(a, b) {
  return a.localeCompare(b);
}

function setupIgnores(self, options) {
  self.ignore = options.ignore || [];
  if (!Array.isArray(self.ignore)) self.ignore = [self.ignore];

  if (self.ignore.length) {
    self.ignore = self.ignore.map(ignoreMap);
  }
} // ignore patterns are always in dot:true mode.


function ignoreMap(pattern) {
  var gmatcher = null;

  if (pattern.slice(-3) === '/**') {
    var gpattern = pattern.replace(/(\/\*\*)+$/, '');
    gmatcher = new Minimatch$1(gpattern, {
      dot: true
    });
  }

  return {
    matcher: new Minimatch$1(pattern, {
      dot: true
    }),
    gmatcher: gmatcher
  };
}

function setopts(self, pattern, options) {
  if (!options) options = {}; // base-matching: just use globstar for that.

  if (options.matchBase && -1 === pattern.indexOf("/")) {
    if (options.noglobstar) {
      throw new Error("base matching requires globstar");
    }

    pattern = "**/" + pattern;
  }

  self.silent = !!options.silent;
  self.pattern = pattern;
  self.strict = options.strict !== false;
  self.realpath = !!options.realpath;
  self.realpathCache = options.realpathCache || Object.create(null);
  self.follow = !!options.follow;
  self.dot = !!options.dot;
  self.mark = !!options.mark;
  self.nodir = !!options.nodir;
  if (self.nodir) self.mark = true;
  self.sync = !!options.sync;
  self.nounique = !!options.nounique;
  self.nonull = !!options.nonull;
  self.nosort = !!options.nosort;
  self.nocase = !!options.nocase;
  self.stat = !!options.stat;
  self.noprocess = !!options.noprocess;
  self.absolute = !!options.absolute;
  self.maxLength = options.maxLength || Infinity;
  self.cache = options.cache || Object.create(null);
  self.statCache = options.statCache || Object.create(null);
  self.symlinks = options.symlinks || Object.create(null);
  setupIgnores(self, options);
  self.changedCwd = false;
  var cwd = process.cwd();
  if (!ownProp(options, "cwd")) self.cwd = cwd;else {
    self.cwd = path$2.resolve(options.cwd);
    self.changedCwd = self.cwd !== cwd;
  }
  self.root = options.root || path$2.resolve(self.cwd, "/");
  self.root = path$2.resolve(self.root);
  if (process.platform === "win32") self.root = self.root.replace(/\\/g, "/"); // TODO: is an absolute `cwd` supposed to be resolved against `root`?
  // e.g. { cwd: '/test', root: __dirname } === path.join(__dirname, '/test')

  self.cwdAbs = pathIsAbsolute(self.cwd) ? self.cwd : makeAbs(self, self.cwd);
  if (process.platform === "win32") self.cwdAbs = self.cwdAbs.replace(/\\/g, "/");
  self.nomount = !!options.nomount; // disable comments and negation in Minimatch.
  // Note that they are not supported in Glob itself anyway.

  options.nonegate = true;
  options.nocomment = true;
  self.minimatch = new Minimatch$1(pattern, options);
  self.options = self.minimatch.options;
}

function finish(self) {
  var nou = self.nounique;
  var all = nou ? [] : Object.create(null);

  for (var i = 0, l = self.matches.length; i < l; i++) {
    var matches = self.matches[i];

    if (!matches || Object.keys(matches).length === 0) {
      if (self.nonull) {
        // do like the shell, and spit out the literal glob
        var literal = self.minimatch.globSet[i];
        if (nou) all.push(literal);else all[literal] = true;
      }
    } else {
      // had matches
      var m = Object.keys(matches);
      if (nou) all.push.apply(all, m);else m.forEach(function (m) {
        all[m] = true;
      });
    }
  }

  if (!nou) all = Object.keys(all);
  if (!self.nosort) all = all.sort(self.nocase ? alphasorti : alphasort); // at *some* point we statted all of these

  if (self.mark) {
    for (var i = 0; i < all.length; i++) {
      all[i] = self._mark(all[i]);
    }

    if (self.nodir) {
      all = all.filter(function (e) {
        var notDir = !/\/$/.test(e);
        var c = self.cache[e] || self.cache[makeAbs(self, e)];
        if (notDir && c) notDir = c !== 'DIR' && !Array.isArray(c);
        return notDir;
      });
    }
  }

  if (self.ignore.length) all = all.filter(function (m) {
    return !isIgnored(self, m);
  });
  self.found = all;
}

function mark(self, p) {
  var abs = makeAbs(self, p);
  var c = self.cache[abs];
  var m = p;

  if (c) {
    var isDir = c === 'DIR' || Array.isArray(c);
    var slash = p.slice(-1) === '/';
    if (isDir && !slash) m += '/';else if (!isDir && slash) m = m.slice(0, -1);

    if (m !== p) {
      var mabs = makeAbs(self, m);
      self.statCache[mabs] = self.statCache[abs];
      self.cache[mabs] = self.cache[abs];
    }
  }

  return m;
} // lotta situps...


function makeAbs(self, f) {
  var abs = f;

  if (f.charAt(0) === '/') {
    abs = path$2.join(self.root, f);
  } else if (pathIsAbsolute(f) || f === '') {
    abs = f;
  } else if (self.changedCwd) {
    abs = path$2.resolve(self.cwd, f);
  } else {
    abs = path$2.resolve(f);
  }

  if (process.platform === 'win32') abs = abs.replace(/\\/g, '/');
  return abs;
} // Return true, if pattern ends with globstar '**', for the accompanying parent directory.
// Ex:- If node_modules/** is the pattern, add 'node_modules' to ignore list along with it's contents


function isIgnored(self, path) {
  if (!self.ignore.length) return false;
  return self.ignore.some(function (item) {
    return item.matcher.match(path) || !!(item.gmatcher && item.gmatcher.match(path));
  });
}

function childrenIgnored(self, path) {
  if (!self.ignore.length) return false;
  return self.ignore.some(function (item) {
    return !!(item.gmatcher && item.gmatcher.match(path));
  });
}

var common = {
  alphasort: alphasort_1,
  alphasorti: alphasorti_1,
  setopts: setopts_1,
  ownProp: ownProp_1,
  makeAbs: makeAbs_1,
  finish: finish_1,
  mark: mark_1,
  isIgnored: isIgnored_1,
  childrenIgnored: childrenIgnored_1
};

var sync = globSync;
globSync.GlobSync = GlobSync;
var setopts$1 = common.setopts;
var ownProp$1 = common.ownProp;
var childrenIgnored$1 = common.childrenIgnored;
var isIgnored$1 = common.isIgnored;

function globSync(pattern, options) {
  if (typeof options === 'function' || arguments.length === 3) throw new TypeError('callback provided to sync glob\n' + 'See: https://github.com/isaacs/node-glob/issues/167');
  return new GlobSync(pattern, options).found;
}

function GlobSync(pattern, options) {
  if (!pattern) throw new Error('must provide pattern');
  if (typeof options === 'function' || arguments.length === 3) throw new TypeError('callback provided to sync glob\n' + 'See: https://github.com/isaacs/node-glob/issues/167');
  if (!(this instanceof GlobSync)) return new GlobSync(pattern, options);
  setopts$1(this, pattern, options);
  if (this.noprocess) return this;
  var n = this.minimatch.set.length;
  this.matches = new Array(n);

  for (var i = 0; i < n; i++) {
    this._process(this.minimatch.set[i], i, false);
  }

  this._finish();
}

GlobSync.prototype._finish = function () {
  assert(this instanceof GlobSync);

  if (this.realpath) {
    var self = this;
    this.matches.forEach(function (matchset, index) {
      var set = self.matches[index] = Object.create(null);

      for (var p in matchset) {
        try {
          p = self._makeAbs(p);
          var real = fs_realpath.realpathSync(p, self.realpathCache);
          set[real] = true;
        } catch (er) {
          if (er.syscall === 'stat') set[self._makeAbs(p)] = true;else throw er;
        }
      }
    });
  }

  common.finish(this);
};

GlobSync.prototype._process = function (pattern, index, inGlobStar) {
  assert(this instanceof GlobSync); // Get the first [n] parts of pattern that are all strings.

  var n = 0;

  while (typeof pattern[n] === 'string') {
    n++;
  } // now n is the index of the first one that is *not* a string.
  // See if there's anything else


  var prefix;

  switch (n) {
    // if not, then this is rather simple
    case pattern.length:
      this._processSimple(pattern.join('/'), index);

      return;

    case 0:
      // pattern *starts* with some non-trivial item.
      // going to readdir(cwd), but not include the prefix in matches.
      prefix = null;
      break;

    default:
      // pattern has some string bits in the front.
      // whatever it starts with, whether that's 'absolute' like /foo/bar,
      // or 'relative' like '../baz'
      prefix = pattern.slice(0, n).join('/');
      break;
  }

  var remain = pattern.slice(n); // get the list of entries.

  var read;
  if (prefix === null) read = '.';else if (pathIsAbsolute(prefix) || pathIsAbsolute(pattern.join('/'))) {
    if (!prefix || !pathIsAbsolute(prefix)) prefix = '/' + prefix;
    read = prefix;
  } else read = prefix;

  var abs = this._makeAbs(read); //if ignored, skip processing


  if (childrenIgnored$1(this, read)) return;
  var isGlobStar = remain[0] === minimatch_1.GLOBSTAR;
  if (isGlobStar) this._processGlobStar(prefix, read, abs, remain, index, inGlobStar);else this._processReaddir(prefix, read, abs, remain, index, inGlobStar);
};

GlobSync.prototype._processReaddir = function (prefix, read, abs, remain, index, inGlobStar) {
  var entries = this._readdir(abs, inGlobStar); // if the abs isn't a dir, then nothing can match!


  if (!entries) return; // It will only match dot entries if it starts with a dot, or if
  // dot is set.  Stuff like @(.foo|.bar) isn't allowed.

  var pn = remain[0];
  var negate = !!this.minimatch.negate;
  var rawGlob = pn._glob;
  var dotOk = this.dot || rawGlob.charAt(0) === '.';
  var matchedEntries = [];

  for (var i = 0; i < entries.length; i++) {
    var e = entries[i];

    if (e.charAt(0) !== '.' || dotOk) {
      var m;

      if (negate && !prefix) {
        m = !e.match(pn);
      } else {
        m = e.match(pn);
      }

      if (m) matchedEntries.push(e);
    }
  }

  var len = matchedEntries.length; // If there are no matched entries, then nothing matches.

  if (len === 0) return; // if this is the last remaining pattern bit, then no need for
  // an additional stat *unless* the user has specified mark or
  // stat explicitly.  We know they exist, since readdir returned
  // them.

  if (remain.length === 1 && !this.mark && !this.stat) {
    if (!this.matches[index]) this.matches[index] = Object.create(null);

    for (var i = 0; i < len; i++) {
      var e = matchedEntries[i];

      if (prefix) {
        if (prefix.slice(-1) !== '/') e = prefix + '/' + e;else e = prefix + e;
      }

      if (e.charAt(0) === '/' && !this.nomount) {
        e = path$2.join(this.root, e);
      }

      this._emitMatch(index, e);
    } // This was the last one, and no stats were needed


    return;
  } // now test all matched entries as stand-ins for that part
  // of the pattern.


  remain.shift();

  for (var i = 0; i < len; i++) {
    var e = matchedEntries[i];
    var newPattern;
    if (prefix) newPattern = [prefix, e];else newPattern = [e];

    this._process(newPattern.concat(remain), index, inGlobStar);
  }
};

GlobSync.prototype._emitMatch = function (index, e) {
  if (isIgnored$1(this, e)) return;

  var abs = this._makeAbs(e);

  if (this.mark) e = this._mark(e);

  if (this.absolute) {
    e = abs;
  }

  if (this.matches[index][e]) return;

  if (this.nodir) {
    var c = this.cache[abs];
    if (c === 'DIR' || Array.isArray(c)) return;
  }

  this.matches[index][e] = true;
  if (this.stat) this._stat(e);
};

GlobSync.prototype._readdirInGlobStar = function (abs) {
  // follow all symlinked directories forever
  // just proceed as if this is a non-globstar situation
  if (this.follow) return this._readdir(abs, false);
  var entries;
  var lstat;

  try {
    lstat = fs.lstatSync(abs);
  } catch (er) {
    if (er.code === 'ENOENT') {
      // lstat failed, doesn't exist
      return null;
    }
  }

  var isSym = lstat && lstat.isSymbolicLink();
  this.symlinks[abs] = isSym; // If it's not a symlink or a dir, then it's definitely a regular file.
  // don't bother doing a readdir in that case.

  if (!isSym && lstat && !lstat.isDirectory()) this.cache[abs] = 'FILE';else entries = this._readdir(abs, false);
  return entries;
};

GlobSync.prototype._readdir = function (abs, inGlobStar) {
  if (inGlobStar && !ownProp$1(this.symlinks, abs)) return this._readdirInGlobStar(abs);

  if (ownProp$1(this.cache, abs)) {
    var c = this.cache[abs];
    if (!c || c === 'FILE') return null;
    if (Array.isArray(c)) return c;
  }

  try {
    return this._readdirEntries(abs, fs.readdirSync(abs));
  } catch (er) {
    this._readdirError(abs, er);

    return null;
  }
};

GlobSync.prototype._readdirEntries = function (abs, entries) {
  // if we haven't asked to stat everything, then just
  // assume that everything in there exists, so we can avoid
  // having to stat it a second time.
  if (!this.mark && !this.stat) {
    for (var i = 0; i < entries.length; i++) {
      var e = entries[i];
      if (abs === '/') e = abs + e;else e = abs + '/' + e;
      this.cache[e] = true;
    }
  }

  this.cache[abs] = entries; // mark and cache dir-ness

  return entries;
};

GlobSync.prototype._readdirError = function (f, er) {
  // handle errors, and cache the information
  switch (er.code) {
    case 'ENOTSUP': // https://github.com/isaacs/node-glob/issues/205

    case 'ENOTDIR':
      // totally normal. means it *does* exist.
      var abs = this._makeAbs(f);

      this.cache[abs] = 'FILE';

      if (abs === this.cwdAbs) {
        var error = new Error(er.code + ' invalid cwd ' + this.cwd);
        error.path = this.cwd;
        error.code = er.code;
        throw error;
      }

      break;

    case 'ENOENT': // not terribly unusual

    case 'ELOOP':
    case 'ENAMETOOLONG':
    case 'UNKNOWN':
      this.cache[this._makeAbs(f)] = false;
      break;

    default:
      // some unusual error.  Treat as failure.
      this.cache[this._makeAbs(f)] = false;
      if (this.strict) throw er;
      if (!this.silent) console.error('glob error', er);
      break;
  }
};

GlobSync.prototype._processGlobStar = function (prefix, read, abs, remain, index, inGlobStar) {
  var entries = this._readdir(abs, inGlobStar); // no entries means not a dir, so it can never have matches
  // foo.txt/** doesn't match foo.txt


  if (!entries) return; // test without the globstar, and with every child both below
  // and replacing the globstar.

  var remainWithoutGlobStar = remain.slice(1);
  var gspref = prefix ? [prefix] : [];
  var noGlobStar = gspref.concat(remainWithoutGlobStar); // the noGlobStar pattern exits the inGlobStar state

  this._process(noGlobStar, index, false);

  var len = entries.length;
  var isSym = this.symlinks[abs]; // If it's a symlink, and we're in a globstar, then stop

  if (isSym && inGlobStar) return;

  for (var i = 0; i < len; i++) {
    var e = entries[i];
    if (e.charAt(0) === '.' && !this.dot) continue; // these two cases enter the inGlobStar state

    var instead = gspref.concat(entries[i], remainWithoutGlobStar);

    this._process(instead, index, true);

    var below = gspref.concat(entries[i], remain);

    this._process(below, index, true);
  }
};

GlobSync.prototype._processSimple = function (prefix, index) {
  // XXX review this.  Shouldn't it be doing the mounting etc
  // before doing stat?  kinda weird?
  var exists = this._stat(prefix);

  if (!this.matches[index]) this.matches[index] = Object.create(null); // If it doesn't exist, then just mark the lack of results

  if (!exists) return;

  if (prefix && pathIsAbsolute(prefix) && !this.nomount) {
    var trail = /[\/\\]$/.test(prefix);

    if (prefix.charAt(0) === '/') {
      prefix = path$2.join(this.root, prefix);
    } else {
      prefix = path$2.resolve(this.root, prefix);
      if (trail) prefix += '/';
    }
  }

  if (process.platform === 'win32') prefix = prefix.replace(/\\/g, '/'); // Mark this as a match

  this._emitMatch(index, prefix);
}; // Returns either 'DIR', 'FILE', or false


GlobSync.prototype._stat = function (f) {
  var abs = this._makeAbs(f);

  var needDir = f.slice(-1) === '/';
  if (f.length > this.maxLength) return false;

  if (!this.stat && ownProp$1(this.cache, abs)) {
    var c = this.cache[abs];
    if (Array.isArray(c)) c = 'DIR'; // It exists, but maybe not how we need it

    if (!needDir || c === 'DIR') return c;
    if (needDir && c === 'FILE') return false; // otherwise we have to stat, because maybe c=true
    // if we know it exists, but not what it is.
  }
  var stat = this.statCache[abs];

  if (!stat) {
    var lstat;

    try {
      lstat = fs.lstatSync(abs);
    } catch (er) {
      if (er && (er.code === 'ENOENT' || er.code === 'ENOTDIR')) {
        this.statCache[abs] = false;
        return false;
      }
    }

    if (lstat && lstat.isSymbolicLink()) {
      try {
        stat = fs.statSync(abs);
      } catch (er) {
        stat = lstat;
      }
    } else {
      stat = lstat;
    }
  }

  this.statCache[abs] = stat;
  var c = true;
  if (stat) c = stat.isDirectory() ? 'DIR' : 'FILE';
  this.cache[abs] = this.cache[abs] || c;
  if (needDir && c === 'FILE') return false;
  return c;
};

GlobSync.prototype._mark = function (p) {
  return common.mark(this, p);
};

GlobSync.prototype._makeAbs = function (f) {
  return common.makeAbs(this, f);
};

var max$3 = Math.max;
var min$4 = Math.min;
var MAX_SAFE_INTEGER$1 = 0x1FFFFFFFFFFFFF;
var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded';

// `Array.prototype.splice` method
// https://tc39.github.io/ecma262/#sec-array.prototype.splice
// with adding support of @@species
_export({ target: 'Array', proto: true, forced: !arrayMethodHasSpeciesSupport('splice') }, {
  splice: function splice(start, deleteCount /* , ...items */) {
    var O = toObject(this);
    var len = toLength(O.length);
    var actualStart = toAbsoluteIndex(start, len);
    var argumentsLength = arguments.length;
    var insertCount, actualDeleteCount, A, k, from, to;
    if (argumentsLength === 0) {
      insertCount = actualDeleteCount = 0;
    } else if (argumentsLength === 1) {
      insertCount = 0;
      actualDeleteCount = len - actualStart;
    } else {
      insertCount = argumentsLength - 2;
      actualDeleteCount = min$4(max$3(toInteger(deleteCount), 0), len - actualStart);
    }
    if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER$1) {
      throw TypeError(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
    }
    A = arraySpeciesCreate(O, actualDeleteCount);
    for (k = 0; k < actualDeleteCount; k++) {
      from = actualStart + k;
      if (from in O) createProperty(A, k, O[from]);
    }
    A.length = actualDeleteCount;
    if (insertCount < actualDeleteCount) {
      for (k = actualStart; k < len - actualDeleteCount; k++) {
        from = k + actualDeleteCount;
        to = k + insertCount;
        if (from in O) O[to] = O[from];
        else delete O[to];
      }
      for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
    } else if (insertCount > actualDeleteCount) {
      for (k = len - actualDeleteCount; k > actualStart; k--) {
        from = k + actualDeleteCount - 1;
        to = k + insertCount - 1;
        if (from in O) O[to] = O[from];
        else delete O[to];
      }
    }
    for (k = 0; k < insertCount; k++) {
      O[k + actualStart] = arguments[k + 2];
    }
    O.length = len - actualDeleteCount + insertCount;
    return A;
  }
});

// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
var wrappy_1 = wrappy;

function wrappy(fn, cb) {
  if (fn && cb) return wrappy(fn)(cb);
  if (typeof fn !== 'function') throw new TypeError('need wrapper function');
  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k];
  });
  return wrapper;

  function wrapper() {
    var args = new Array(arguments.length);

    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    var ret = fn.apply(this, args);
    var cb = args[args.length - 1];

    if (typeof ret === 'function' && ret !== cb) {
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k];
      });
    }

    return ret;
  }
}

var once_1 = wrappy_1(once);
var strict = wrappy_1(onceStrict);
once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function value() {
      return once(this);
    },
    configurable: true
  });
  Object.defineProperty(Function.prototype, 'onceStrict', {
    value: function value() {
      return onceStrict(this);
    },
    configurable: true
  });
});

function once(fn) {
  var f = function f() {
    if (f.called) return f.value;
    f.called = true;
    return f.value = fn.apply(this, arguments);
  };

  f.called = false;
  return f;
}

function onceStrict(fn) {
  var f = function f() {
    if (f.called) throw new Error(f.onceError);
    f.called = true;
    return f.value = fn.apply(this, arguments);
  };

  var name = fn.name || 'Function wrapped with `once`';
  f.onceError = name + " shouldn't be called more than once";
  f.called = false;
  return f;
}
once_1.strict = strict;

var reqs = Object.create(null);
var inflight_1 = wrappy_1(inflight);

function inflight(key, cb) {
  if (reqs[key]) {
    reqs[key].push(cb);
    return null;
  } else {
    reqs[key] = [cb];
    return makeres(key);
  }
}

function makeres(key) {
  return once_1(function RES() {
    var cbs = reqs[key];
    var len = cbs.length;
    var args = slice(arguments); // XXX It's somewhat ambiguous whether a new callback added in this
    // pass should be queued for later execution if something in the
    // list of callbacks throws, or if it should just be discarded.
    // However, it's such an edge case that it hardly matters, and either
    // choice is likely as surprising as the other.
    // As it happens, we do go ahead and schedule it for later execution.

    try {
      for (var i = 0; i < len; i++) {
        cbs[i].apply(null, args);
      }
    } finally {
      if (cbs.length > len) {
        // added more in the interim.
        // de-zalgo, just in case, but don't call again.
        cbs.splice(0, len);
        process.nextTick(function () {
          RES.apply(null, args);
        });
      } else {
        delete reqs[key];
      }
    }
  });
}

function slice(args) {
  var length = args.length;
  var array = [];

  for (var i = 0; i < length; i++) {
    array[i] = args[i];
  }

  return array;
}

//
// 1. Get the minimatch set
// 2. For each pattern in the set, PROCESS(pattern, false)
// 3. Store matches per-set, then uniq them
//
// PROCESS(pattern, inGlobStar)
// Get the first [n] items from pattern that are all strings
// Join these together.  This is PREFIX.
//   If there is no more remaining, then stat(PREFIX) and
//   add to matches if it succeeds.  END.
//
// If inGlobStar and PREFIX is symlink and points to dir
//   set ENTRIES = []
// else readdir(PREFIX) as ENTRIES
//   If fail, END
//
// with ENTRIES
//   If pattern[n] is GLOBSTAR
//     // handle the case where the globstar match is empty
//     // by pruning it out, and testing the resulting pattern
//     PROCESS(pattern[0..n] + pattern[n+1 .. $], false)
//     // handle other cases.
//     for ENTRY in ENTRIES (not dotfiles)
//       // attach globstar + tail onto the entry
//       // Mark that this entry is a globstar match
//       PROCESS(pattern[0..n] + ENTRY + pattern[n .. $], true)
//
//   else // not globstar
//     for ENTRY in ENTRIES (not dotfiles, unless pattern[n] is dot)
//       Test ENTRY against pattern[n]
//       If fails, continue
//       If passes, PROCESS(pattern[0..n] + item + pattern[n+1 .. $])
//
// Caveat:
//   Cache all stats and readdirs results to minimize syscall.  Since all
//   we ever care about is existence and directory-ness, we can just keep
//   `true` for files, and [children,...] for directories, or `false` for
//   things that don't exist.

var glob_1 = glob;
var EE = events.EventEmitter;
var setopts$2 = common.setopts;
var ownProp$2 = common.ownProp;
var childrenIgnored$2 = common.childrenIgnored;
var isIgnored$2 = common.isIgnored;

function glob(pattern, options, cb) {
  if (typeof options === 'function') cb = options, options = {};
  if (!options) options = {};

  if (options.sync) {
    if (cb) throw new TypeError('callback provided to sync glob');
    return sync(pattern, options);
  }

  return new Glob(pattern, options, cb);
}

glob.sync = sync;
var GlobSync$1 = glob.GlobSync = sync.GlobSync; // old api surface

glob.glob = glob;

function extend(origin, add) {
  if (add === null || typeof add !== 'object') {
    return origin;
  }

  var keys = Object.keys(add);
  var i = keys.length;

  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }

  return origin;
}

glob.hasMagic = function (pattern, options_) {
  var options = extend({}, options_);
  options.noprocess = true;
  var g = new Glob(pattern, options);
  var set = g.minimatch.set;
  if (!pattern) return false;
  if (set.length > 1) return true;

  for (var j = 0; j < set[0].length; j++) {
    if (typeof set[0][j] !== 'string') return true;
  }

  return false;
};

glob.Glob = Glob;
inherits(Glob, EE);

function Glob(pattern, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = null;
  }

  if (options && options.sync) {
    if (cb) throw new TypeError('callback provided to sync glob');
    return new GlobSync$1(pattern, options);
  }

  if (!(this instanceof Glob)) return new Glob(pattern, options, cb);
  setopts$2(this, pattern, options);
  this._didRealPath = false; // process each pattern in the minimatch set

  var n = this.minimatch.set.length; // The matches are stored as {<filename>: true,...} so that
  // duplicates are automagically pruned.
  // Later, we do an Object.keys() on these.
  // Keep them as a list so we can fill in when nonull is set.

  this.matches = new Array(n);

  if (typeof cb === 'function') {
    cb = once_1(cb);
    this.on('error', cb);
    this.on('end', function (matches) {
      cb(null, matches);
    });
  }

  var self = this;
  this._processing = 0;
  this._emitQueue = [];
  this._processQueue = [];
  this.paused = false;
  if (this.noprocess) return this;
  if (n === 0) return done();
  var sync = true;

  for (var i = 0; i < n; i++) {
    this._process(this.minimatch.set[i], i, false, done);
  }

  sync = false;

  function done() {
    --self._processing;

    if (self._processing <= 0) {
      if (sync) {
        process.nextTick(function () {
          self._finish();
        });
      } else {
        self._finish();
      }
    }
  }
}

Glob.prototype._finish = function () {
  assert(this instanceof Glob);
  if (this.aborted) return;
  if (this.realpath && !this._didRealpath) return this._realpath();
  common.finish(this);
  this.emit('end', this.found);
};

Glob.prototype._realpath = function () {
  if (this._didRealpath) return;
  this._didRealpath = true;
  var n = this.matches.length;
  if (n === 0) return this._finish();
  var self = this;

  for (var i = 0; i < this.matches.length; i++) {
    this._realpathSet(i, next);
  }

  function next() {
    if (--n === 0) self._finish();
  }
};

Glob.prototype._realpathSet = function (index, cb) {
  var matchset = this.matches[index];
  if (!matchset) return cb();
  var found = Object.keys(matchset);
  var self = this;
  var n = found.length;
  if (n === 0) return cb();
  var set = this.matches[index] = Object.create(null);
  found.forEach(function (p, i) {
    // If there's a problem with the stat, then it means that
    // one or more of the links in the realpath couldn't be
    // resolved.  just return the abs value in that case.
    p = self._makeAbs(p);
    fs_realpath.realpath(p, self.realpathCache, function (er, real) {
      if (!er) set[real] = true;else if (er.syscall === 'stat') set[p] = true;else self.emit('error', er); // srsly wtf right here

      if (--n === 0) {
        self.matches[index] = set;
        cb();
      }
    });
  });
};

Glob.prototype._mark = function (p) {
  return common.mark(this, p);
};

Glob.prototype._makeAbs = function (f) {
  return common.makeAbs(this, f);
};

Glob.prototype.abort = function () {
  this.aborted = true;
  this.emit('abort');
};

Glob.prototype.pause = function () {
  if (!this.paused) {
    this.paused = true;
    this.emit('pause');
  }
};

Glob.prototype.resume = function () {
  if (this.paused) {
    this.emit('resume');
    this.paused = false;

    if (this._emitQueue.length) {
      var eq = this._emitQueue.slice(0);

      this._emitQueue.length = 0;

      for (var i = 0; i < eq.length; i++) {
        var e = eq[i];

        this._emitMatch(e[0], e[1]);
      }
    }

    if (this._processQueue.length) {
      var pq = this._processQueue.slice(0);

      this._processQueue.length = 0;

      for (var i = 0; i < pq.length; i++) {
        var p = pq[i];
        this._processing--;

        this._process(p[0], p[1], p[2], p[3]);
      }
    }
  }
};

Glob.prototype._process = function (pattern, index, inGlobStar, cb) {
  assert(this instanceof Glob);
  assert(typeof cb === 'function');
  if (this.aborted) return;
  this._processing++;

  if (this.paused) {
    this._processQueue.push([pattern, index, inGlobStar, cb]);

    return;
  } //console.error('PROCESS %d', this._processing, pattern)
  // Get the first [n] parts of pattern that are all strings.


  var n = 0;

  while (typeof pattern[n] === 'string') {
    n++;
  } // now n is the index of the first one that is *not* a string.
  // see if there's anything else


  var prefix;

  switch (n) {
    // if not, then this is rather simple
    case pattern.length:
      this._processSimple(pattern.join('/'), index, cb);

      return;

    case 0:
      // pattern *starts* with some non-trivial item.
      // going to readdir(cwd), but not include the prefix in matches.
      prefix = null;
      break;

    default:
      // pattern has some string bits in the front.
      // whatever it starts with, whether that's 'absolute' like /foo/bar,
      // or 'relative' like '../baz'
      prefix = pattern.slice(0, n).join('/');
      break;
  }

  var remain = pattern.slice(n); // get the list of entries.

  var read;
  if (prefix === null) read = '.';else if (pathIsAbsolute(prefix) || pathIsAbsolute(pattern.join('/'))) {
    if (!prefix || !pathIsAbsolute(prefix)) prefix = '/' + prefix;
    read = prefix;
  } else read = prefix;

  var abs = this._makeAbs(read); //if ignored, skip _processing


  if (childrenIgnored$2(this, read)) return cb();
  var isGlobStar = remain[0] === minimatch_1.GLOBSTAR;
  if (isGlobStar) this._processGlobStar(prefix, read, abs, remain, index, inGlobStar, cb);else this._processReaddir(prefix, read, abs, remain, index, inGlobStar, cb);
};

Glob.prototype._processReaddir = function (prefix, read, abs, remain, index, inGlobStar, cb) {
  var self = this;

  this._readdir(abs, inGlobStar, function (er, entries) {
    return self._processReaddir2(prefix, read, abs, remain, index, inGlobStar, entries, cb);
  });
};

Glob.prototype._processReaddir2 = function (prefix, read, abs, remain, index, inGlobStar, entries, cb) {
  // if the abs isn't a dir, then nothing can match!
  if (!entries) return cb(); // It will only match dot entries if it starts with a dot, or if
  // dot is set.  Stuff like @(.foo|.bar) isn't allowed.

  var pn = remain[0];
  var negate = !!this.minimatch.negate;
  var rawGlob = pn._glob;
  var dotOk = this.dot || rawGlob.charAt(0) === '.';
  var matchedEntries = [];

  for (var i = 0; i < entries.length; i++) {
    var e = entries[i];

    if (e.charAt(0) !== '.' || dotOk) {
      var m;

      if (negate && !prefix) {
        m = !e.match(pn);
      } else {
        m = e.match(pn);
      }

      if (m) matchedEntries.push(e);
    }
  } //console.error('prd2', prefix, entries, remain[0]._glob, matchedEntries)


  var len = matchedEntries.length; // If there are no matched entries, then nothing matches.

  if (len === 0) return cb(); // if this is the last remaining pattern bit, then no need for
  // an additional stat *unless* the user has specified mark or
  // stat explicitly.  We know they exist, since readdir returned
  // them.

  if (remain.length === 1 && !this.mark && !this.stat) {
    if (!this.matches[index]) this.matches[index] = Object.create(null);

    for (var i = 0; i < len; i++) {
      var e = matchedEntries[i];

      if (prefix) {
        if (prefix !== '/') e = prefix + '/' + e;else e = prefix + e;
      }

      if (e.charAt(0) === '/' && !this.nomount) {
        e = path$2.join(this.root, e);
      }

      this._emitMatch(index, e);
    } // This was the last one, and no stats were needed


    return cb();
  } // now test all matched entries as stand-ins for that part
  // of the pattern.


  remain.shift();

  for (var i = 0; i < len; i++) {
    var e = matchedEntries[i];

    if (prefix) {
      if (prefix !== '/') e = prefix + '/' + e;else e = prefix + e;
    }

    this._process([e].concat(remain), index, inGlobStar, cb);
  }

  cb();
};

Glob.prototype._emitMatch = function (index, e) {
  if (this.aborted) return;
  if (isIgnored$2(this, e)) return;

  if (this.paused) {
    this._emitQueue.push([index, e]);

    return;
  }

  var abs = pathIsAbsolute(e) ? e : this._makeAbs(e);
  if (this.mark) e = this._mark(e);
  if (this.absolute) e = abs;
  if (this.matches[index][e]) return;

  if (this.nodir) {
    var c = this.cache[abs];
    if (c === 'DIR' || Array.isArray(c)) return;
  }

  this.matches[index][e] = true;
  var st = this.statCache[abs];
  if (st) this.emit('stat', e, st);
  this.emit('match', e);
};

Glob.prototype._readdirInGlobStar = function (abs, cb) {
  if (this.aborted) return; // follow all symlinked directories forever
  // just proceed as if this is a non-globstar situation

  if (this.follow) return this._readdir(abs, false, cb);
  var lstatkey = 'lstat\0' + abs;
  var self = this;
  var lstatcb = inflight_1(lstatkey, lstatcb_);
  if (lstatcb) fs.lstat(abs, lstatcb);

  function lstatcb_(er, lstat) {
    if (er && er.code === 'ENOENT') return cb();
    var isSym = lstat && lstat.isSymbolicLink();
    self.symlinks[abs] = isSym; // If it's not a symlink or a dir, then it's definitely a regular file.
    // don't bother doing a readdir in that case.

    if (!isSym && lstat && !lstat.isDirectory()) {
      self.cache[abs] = 'FILE';
      cb();
    } else self._readdir(abs, false, cb);
  }
};

Glob.prototype._readdir = function (abs, inGlobStar, cb) {
  if (this.aborted) return;
  cb = inflight_1('readdir\0' + abs + '\0' + inGlobStar, cb);
  if (!cb) return; //console.error('RD %j %j', +inGlobStar, abs)

  if (inGlobStar && !ownProp$2(this.symlinks, abs)) return this._readdirInGlobStar(abs, cb);

  if (ownProp$2(this.cache, abs)) {
    var c = this.cache[abs];
    if (!c || c === 'FILE') return cb();
    if (Array.isArray(c)) return cb(null, c);
  }
  fs.readdir(abs, readdirCb(this, abs, cb));
};

function readdirCb(self, abs, cb) {
  return function (er, entries) {
    if (er) self._readdirError(abs, er, cb);else self._readdirEntries(abs, entries, cb);
  };
}

Glob.prototype._readdirEntries = function (abs, entries, cb) {
  if (this.aborted) return; // if we haven't asked to stat everything, then just
  // assume that everything in there exists, so we can avoid
  // having to stat it a second time.

  if (!this.mark && !this.stat) {
    for (var i = 0; i < entries.length; i++) {
      var e = entries[i];
      if (abs === '/') e = abs + e;else e = abs + '/' + e;
      this.cache[e] = true;
    }
  }

  this.cache[abs] = entries;
  return cb(null, entries);
};

Glob.prototype._readdirError = function (f, er, cb) {
  if (this.aborted) return; // handle errors, and cache the information

  switch (er.code) {
    case 'ENOTSUP': // https://github.com/isaacs/node-glob/issues/205

    case 'ENOTDIR':
      // totally normal. means it *does* exist.
      var abs = this._makeAbs(f);

      this.cache[abs] = 'FILE';

      if (abs === this.cwdAbs) {
        var error = new Error(er.code + ' invalid cwd ' + this.cwd);
        error.path = this.cwd;
        error.code = er.code;
        this.emit('error', error);
        this.abort();
      }

      break;

    case 'ENOENT': // not terribly unusual

    case 'ELOOP':
    case 'ENAMETOOLONG':
    case 'UNKNOWN':
      this.cache[this._makeAbs(f)] = false;
      break;

    default:
      // some unusual error.  Treat as failure.
      this.cache[this._makeAbs(f)] = false;

      if (this.strict) {
        this.emit('error', er); // If the error is handled, then we abort
        // if not, we threw out of here

        this.abort();
      }

      if (!this.silent) console.error('glob error', er);
      break;
  }

  return cb();
};

Glob.prototype._processGlobStar = function (prefix, read, abs, remain, index, inGlobStar, cb) {
  var self = this;

  this._readdir(abs, inGlobStar, function (er, entries) {
    self._processGlobStar2(prefix, read, abs, remain, index, inGlobStar, entries, cb);
  });
};

Glob.prototype._processGlobStar2 = function (prefix, read, abs, remain, index, inGlobStar, entries, cb) {
  //console.error('pgs2', prefix, remain[0], entries)
  // no entries means not a dir, so it can never have matches
  // foo.txt/** doesn't match foo.txt
  if (!entries) return cb(); // test without the globstar, and with every child both below
  // and replacing the globstar.

  var remainWithoutGlobStar = remain.slice(1);
  var gspref = prefix ? [prefix] : [];
  var noGlobStar = gspref.concat(remainWithoutGlobStar); // the noGlobStar pattern exits the inGlobStar state

  this._process(noGlobStar, index, false, cb);

  var isSym = this.symlinks[abs];
  var len = entries.length; // If it's a symlink, and we're in a globstar, then stop

  if (isSym && inGlobStar) return cb();

  for (var i = 0; i < len; i++) {
    var e = entries[i];
    if (e.charAt(0) === '.' && !this.dot) continue; // these two cases enter the inGlobStar state

    var instead = gspref.concat(entries[i], remainWithoutGlobStar);

    this._process(instead, index, true, cb);

    var below = gspref.concat(entries[i], remain);

    this._process(below, index, true, cb);
  }

  cb();
};

Glob.prototype._processSimple = function (prefix, index, cb) {
  // XXX review this.  Shouldn't it be doing the mounting etc
  // before doing stat?  kinda weird?
  var self = this;

  this._stat(prefix, function (er, exists) {
    self._processSimple2(prefix, index, er, exists, cb);
  });
};

Glob.prototype._processSimple2 = function (prefix, index, er, exists, cb) {
  //console.error('ps2', prefix, exists)
  if (!this.matches[index]) this.matches[index] = Object.create(null); // If it doesn't exist, then just mark the lack of results

  if (!exists) return cb();

  if (prefix && pathIsAbsolute(prefix) && !this.nomount) {
    var trail = /[\/\\]$/.test(prefix);

    if (prefix.charAt(0) === '/') {
      prefix = path$2.join(this.root, prefix);
    } else {
      prefix = path$2.resolve(this.root, prefix);
      if (trail) prefix += '/';
    }
  }

  if (process.platform === 'win32') prefix = prefix.replace(/\\/g, '/'); // Mark this as a match

  this._emitMatch(index, prefix);

  cb();
}; // Returns either 'DIR', 'FILE', or false


Glob.prototype._stat = function (f, cb) {
  var abs = this._makeAbs(f);

  var needDir = f.slice(-1) === '/';
  if (f.length > this.maxLength) return cb();

  if (!this.stat && ownProp$2(this.cache, abs)) {
    var c = this.cache[abs];
    if (Array.isArray(c)) c = 'DIR'; // It exists, but maybe not how we need it

    if (!needDir || c === 'DIR') return cb(null, c);
    if (needDir && c === 'FILE') return cb(); // otherwise we have to stat, because maybe c=true
    // if we know it exists, but not what it is.
  }
  var stat = this.statCache[abs];

  if (stat !== undefined) {
    if (stat === false) return cb(null, stat);else {
      var type = stat.isDirectory() ? 'DIR' : 'FILE';
      if (needDir && type === 'FILE') return cb();else return cb(null, type, stat);
    }
  }

  var self = this;
  var statcb = inflight_1('stat\0' + abs, lstatcb_);
  if (statcb) fs.lstat(abs, statcb);

  function lstatcb_(er, lstat) {
    if (lstat && lstat.isSymbolicLink()) {
      // If it's a symlink, then treat it as the target, unless
      // the target does not exist, then treat it as a file.
      return fs.stat(abs, function (er, stat) {
        if (er) self._stat2(f, abs, null, lstat, cb);else self._stat2(f, abs, er, stat, cb);
      });
    } else {
      self._stat2(f, abs, er, lstat, cb);
    }
  }
};

Glob.prototype._stat2 = function (f, abs, er, stat, cb) {
  if (er && (er.code === 'ENOENT' || er.code === 'ENOTDIR')) {
    this.statCache[abs] = false;
    return cb();
  }

  var needDir = f.slice(-1) === '/';
  this.statCache[abs] = stat;
  if (abs.slice(-1) === '/' && stat && !stat.isDirectory()) return cb(null, false, stat);
  var c = true;
  if (stat) c = stat.isDirectory() ? 'DIR' : 'FILE';
  this.cache[abs] = this.cache[abs] || c;
  if (needDir && c === 'FILE') return cb();
  return cb(null, c, stat);
};

/*!
 * is-extglob <https://github.com/jonschlinkert/is-extglob>
 *
 * Copyright (c) 2014-2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */
var isExtglob = function isExtglob(str) {
  if (typeof str !== 'string' || str === '') {
    return false;
  }

  var match;

  while (match = /(\\).|([@?!+*]\(.*\))/g.exec(str)) {
    if (match[2]) return true;
    str = str.slice(match.index + match[0].length);
  }

  return false;
};

/*!
 * is-glob <https://github.com/jonschlinkert/is-glob>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

var chars = {
  '{': '}',
  '(': ')',
  '[': ']'
};
var strictRegex = /\\(.)|(^!|\*|[\].+)]\?|\[[^\\\]]+\]|\{[^\\}]+\}|\(\?[:!=][^\\)]+\)|\([^|]+\|[^\\)]+\))/;
var relaxedRegex = /\\(.)|(^!|[*?{}()[\]]|\(\?)/;

var isGlob = function isGlob(str, options) {
  if (typeof str !== 'string' || str === '') {
    return false;
  }

  if (isExtglob(str)) {
    return true;
  }

  var regex = strictRegex;
  var match; // optionally relax regex

  if (options && options.strict === false) {
    regex = relaxedRegex;
  }

  while (match = regex.exec(str)) {
    if (match[2]) return true;
    var idx = match.index + match[0].length; // if an open bracket/brace/paren is escaped,
    // set the index to the next closing character

    var open = match[1];
    var close = open ? chars[open] : null;

    if (open && close) {
      var n = str.indexOf(close, idx);

      if (n !== -1) {
        idx = n + 1;
      }
    }

    str = str.slice(idx);
  }

  return false;
};

var nativeGetOwnPropertyNames = objectGetOwnPropertyNames.f;

var toString$1 = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return nativeGetOwnPropertyNames(it);
  } catch (error) {
    return windowNames.slice();
  }
};

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var f$5 = function getOwnPropertyNames(it) {
  return windowNames && toString$1.call(it) == '[object Window]'
    ? getWindowNames(it)
    : nativeGetOwnPropertyNames(toIndexedObject(it));
};

var objectGetOwnPropertyNamesExternal = {
	f: f$5
};

var f$6 = wellKnownSymbol;

var wrappedWellKnownSymbol = {
	f: f$6
};

var defineProperty$1 = objectDefineProperty.f;

var defineWellKnownSymbol = function (NAME) {
  var Symbol = path.Symbol || (path.Symbol = {});
  if (!has(Symbol, NAME)) defineProperty$1(Symbol, NAME, {
    value: wrappedWellKnownSymbol.f(NAME)
  });
};

var defineProperty$2 = objectDefineProperty.f;



var TO_STRING_TAG$2 = wellKnownSymbol('toStringTag');

var setToStringTag = function (it, TAG, STATIC) {
  if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG$2)) {
    defineProperty$2(it, TO_STRING_TAG$2, { configurable: true, value: TAG });
  }
};

var $forEach = arrayIteration.forEach;

var HIDDEN = sharedKey('hidden');
var SYMBOL = 'Symbol';
var PROTOTYPE$1 = 'prototype';
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');
var setInternalState = internalState.set;
var getInternalState = internalState.getterFor(SYMBOL);
var ObjectPrototype$1 = Object[PROTOTYPE$1];
var $Symbol = global_1.Symbol;
var JSON = global_1.JSON;
var nativeJSONStringify = JSON && JSON.stringify;
var nativeGetOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;
var nativeDefineProperty$1 = objectDefineProperty.f;
var nativeGetOwnPropertyNames$1 = objectGetOwnPropertyNamesExternal.f;
var nativePropertyIsEnumerable$1 = objectPropertyIsEnumerable.f;
var AllSymbols = shared('symbols');
var ObjectPrototypeSymbols = shared('op-symbols');
var StringToSymbolRegistry = shared('string-to-symbol-registry');
var SymbolToStringRegistry = shared('symbol-to-string-registry');
var WellKnownSymbolsStore = shared('wks');
var QObject = global_1.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var USE_SETTER = !QObject || !QObject[PROTOTYPE$1] || !QObject[PROTOTYPE$1].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDescriptor = descriptors && fails(function () {
  return objectCreate(nativeDefineProperty$1({}, 'a', {
    get: function () { return nativeDefineProperty$1(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (O, P, Attributes) {
  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor$1(ObjectPrototype$1, P);
  if (ObjectPrototypeDescriptor) delete ObjectPrototype$1[P];
  nativeDefineProperty$1(O, P, Attributes);
  if (ObjectPrototypeDescriptor && O !== ObjectPrototype$1) {
    nativeDefineProperty$1(ObjectPrototype$1, P, ObjectPrototypeDescriptor);
  }
} : nativeDefineProperty$1;

var wrap = function (tag, description) {
  var symbol = AllSymbols[tag] = objectCreate($Symbol[PROTOTYPE$1]);
  setInternalState(symbol, {
    type: SYMBOL,
    tag: tag,
    description: description
  });
  if (!descriptors) symbol.description = description;
  return symbol;
};

var isSymbol = nativeSymbol && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return Object(it) instanceof $Symbol;
};

var $defineProperty = function defineProperty(O, P, Attributes) {
  if (O === ObjectPrototype$1) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
  anObject(O);
  var key = toPrimitive(P, true);
  anObject(Attributes);
  if (has(AllSymbols, key)) {
    if (!Attributes.enumerable) {
      if (!has(O, HIDDEN)) nativeDefineProperty$1(O, HIDDEN, createPropertyDescriptor(1, {}));
      O[HIDDEN][key] = true;
    } else {
      if (has(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
      Attributes = objectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
    } return setSymbolDescriptor(O, key, Attributes);
  } return nativeDefineProperty$1(O, key, Attributes);
};

var $defineProperties = function defineProperties(O, Properties) {
  anObject(O);
  var properties = toIndexedObject(Properties);
  var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
  $forEach(keys, function (key) {
    if (!descriptors || $propertyIsEnumerable.call(properties, key)) $defineProperty(O, key, properties[key]);
  });
  return O;
};

var $create = function create(O, Properties) {
  return Properties === undefined ? objectCreate(O) : $defineProperties(objectCreate(O), Properties);
};

var $propertyIsEnumerable = function propertyIsEnumerable(V) {
  var P = toPrimitive(V, true);
  var enumerable = nativePropertyIsEnumerable$1.call(this, P);
  if (this === ObjectPrototype$1 && has(AllSymbols, P) && !has(ObjectPrototypeSymbols, P)) return false;
  return enumerable || !has(this, P) || !has(AllSymbols, P) || has(this, HIDDEN) && this[HIDDEN][P] ? enumerable : true;
};

var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
  var it = toIndexedObject(O);
  var key = toPrimitive(P, true);
  if (it === ObjectPrototype$1 && has(AllSymbols, key) && !has(ObjectPrototypeSymbols, key)) return;
  var descriptor = nativeGetOwnPropertyDescriptor$1(it, key);
  if (descriptor && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) {
    descriptor.enumerable = true;
  }
  return descriptor;
};

var $getOwnPropertyNames = function getOwnPropertyNames(O) {
  var names = nativeGetOwnPropertyNames$1(toIndexedObject(O));
  var result = [];
  $forEach(names, function (key) {
    if (!has(AllSymbols, key) && !has(hiddenKeys, key)) result.push(key);
  });
  return result;
};

var $getOwnPropertySymbols = function getOwnPropertySymbols(O) {
  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype$1;
  var names = nativeGetOwnPropertyNames$1(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
  var result = [];
  $forEach(names, function (key) {
    if (has(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || has(ObjectPrototype$1, key))) {
      result.push(AllSymbols[key]);
    }
  });
  return result;
};

// `Symbol` constructor
// https://tc39.github.io/ecma262/#sec-symbol-constructor
if (!nativeSymbol) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor');
    var description = !arguments.length || arguments[0] === undefined ? undefined : String(arguments[0]);
    var tag = uid(description);
    var setter = function (value) {
      if (this === ObjectPrototype$1) setter.call(ObjectPrototypeSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
    };
    if (descriptors && USE_SETTER) setSymbolDescriptor(ObjectPrototype$1, tag, { configurable: true, set: setter });
    return wrap(tag, description);
  };

  redefine($Symbol[PROTOTYPE$1], 'toString', function toString() {
    return getInternalState(this).tag;
  });

  objectPropertyIsEnumerable.f = $propertyIsEnumerable;
  objectDefineProperty.f = $defineProperty;
  objectGetOwnPropertyDescriptor.f = $getOwnPropertyDescriptor;
  objectGetOwnPropertyNames.f = objectGetOwnPropertyNamesExternal.f = $getOwnPropertyNames;
  objectGetOwnPropertySymbols.f = $getOwnPropertySymbols;

  if (descriptors) {
    // https://github.com/tc39/proposal-Symbol-description
    nativeDefineProperty$1($Symbol[PROTOTYPE$1], 'description', {
      configurable: true,
      get: function description() {
        return getInternalState(this).description;
      }
    });
    {
      redefine(ObjectPrototype$1, 'propertyIsEnumerable', $propertyIsEnumerable, { unsafe: true });
    }
  }

  wrappedWellKnownSymbol.f = function (name) {
    return wrap(wellKnownSymbol(name), name);
  };
}

_export({ global: true, wrap: true, forced: !nativeSymbol, sham: !nativeSymbol }, {
  Symbol: $Symbol
});

$forEach(objectKeys(WellKnownSymbolsStore), function (name) {
  defineWellKnownSymbol(name);
});

_export({ target: SYMBOL, stat: true, forced: !nativeSymbol }, {
  // `Symbol.for` method
  // https://tc39.github.io/ecma262/#sec-symbol.for
  'for': function (key) {
    var string = String(key);
    if (has(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
    var symbol = $Symbol(string);
    StringToSymbolRegistry[string] = symbol;
    SymbolToStringRegistry[symbol] = string;
    return symbol;
  },
  // `Symbol.keyFor` method
  // https://tc39.github.io/ecma262/#sec-symbol.keyfor
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol');
    if (has(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
  },
  useSetter: function () { USE_SETTER = true; },
  useSimple: function () { USE_SETTER = false; }
});

_export({ target: 'Object', stat: true, forced: !nativeSymbol, sham: !descriptors }, {
  // `Object.create` method
  // https://tc39.github.io/ecma262/#sec-object.create
  create: $create,
  // `Object.defineProperty` method
  // https://tc39.github.io/ecma262/#sec-object.defineproperty
  defineProperty: $defineProperty,
  // `Object.defineProperties` method
  // https://tc39.github.io/ecma262/#sec-object.defineproperties
  defineProperties: $defineProperties,
  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptors
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor
});

_export({ target: 'Object', stat: true, forced: !nativeSymbol }, {
  // `Object.getOwnPropertyNames` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertynames
  getOwnPropertyNames: $getOwnPropertyNames,
  // `Object.getOwnPropertySymbols` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertysymbols
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
// https://bugs.chromium.org/p/v8/issues/detail?id=3443
_export({ target: 'Object', stat: true, forced: fails(function () { objectGetOwnPropertySymbols.f(1); }) }, {
  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
    return objectGetOwnPropertySymbols.f(toObject(it));
  }
});

// `JSON.stringify` method behavior with symbols
// https://tc39.github.io/ecma262/#sec-json.stringify
JSON && _export({ target: 'JSON', stat: true, forced: !nativeSymbol || fails(function () {
  var symbol = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  return nativeJSONStringify([symbol]) != '[null]'
    // WebKit converts symbol values to JSON as null
    || nativeJSONStringify({ a: symbol }) != '{}'
    // V8 throws on boxed symbols
    || nativeJSONStringify(Object(symbol)) != '{}';
}) }, {
  stringify: function stringify(it) {
    var args = [it];
    var index = 1;
    var replacer, $replacer;
    while (arguments.length > index) args.push(arguments[index++]);
    $replacer = replacer = args[1];
    if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    if (!isArray(replacer)) replacer = function (key, value) {
      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return nativeJSONStringify.apply(JSON, args);
  }
});

// `Symbol.prototype[@@toPrimitive]` method
// https://tc39.github.io/ecma262/#sec-symbol.prototype-@@toprimitive
if (!$Symbol[PROTOTYPE$1][TO_PRIMITIVE]) hide($Symbol[PROTOTYPE$1], TO_PRIMITIVE, $Symbol[PROTOTYPE$1].valueOf);
// `Symbol.prototype[@@toStringTag]` property
// https://tc39.github.io/ecma262/#sec-symbol.prototype-@@tostringtag
setToStringTag($Symbol, SYMBOL);

hiddenKeys[HIDDEN] = true;

var defineProperty$3 = objectDefineProperty.f;


var NativeSymbol = global_1.Symbol;

if (descriptors && typeof NativeSymbol == 'function' && (!('description' in NativeSymbol.prototype) ||
  // Safari 12 bug
  NativeSymbol().description !== undefined
)) {
  var EmptyStringDescriptionStore = {};
  // wrap Symbol constructor for correct work with undefined description
  var SymbolWrapper = function Symbol() {
    var description = arguments.length < 1 || arguments[0] === undefined ? undefined : String(arguments[0]);
    var result = this instanceof SymbolWrapper
      ? new NativeSymbol(description)
      // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
      : description === undefined ? NativeSymbol() : NativeSymbol(description);
    if (description === '') EmptyStringDescriptionStore[result] = true;
    return result;
  };
  copyConstructorProperties(SymbolWrapper, NativeSymbol);
  var symbolPrototype = SymbolWrapper.prototype = NativeSymbol.prototype;
  symbolPrototype.constructor = SymbolWrapper;

  var symbolToString = symbolPrototype.toString;
  var native = String(NativeSymbol('test')) == 'Symbol(test)';
  var regexp = /^Symbol\((.*)\)[^)]+$/;
  defineProperty$3(symbolPrototype, 'description', {
    configurable: true,
    get: function description() {
      var symbol = isObject(this) ? this.valueOf() : this;
      var string = symbolToString.call(symbol);
      if (has(EmptyStringDescriptionStore, symbol)) return '';
      var desc = native ? string.slice(7, -1) : string.replace(regexp, '$1');
      return desc === '' ? undefined : desc;
    }
  });

  _export({ global: true, forced: true }, {
    Symbol: SymbolWrapper
  });
}

var iterators = {};

var correctPrototypeGetter = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  return Object.getPrototypeOf(new F()) !== F.prototype;
});

var IE_PROTO$1 = sharedKey('IE_PROTO');
var ObjectPrototype$2 = Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.github.io/ecma262/#sec-object.getprototypeof
var objectGetPrototypeOf = correctPrototypeGetter ? Object.getPrototypeOf : function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO$1)) return O[IE_PROTO$1];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectPrototype$2 : null;
};

var ITERATOR = wellKnownSymbol('iterator');
var BUGGY_SAFARI_ITERATORS = false;

var returnThis = function () { return this; };

// `%IteratorPrototype%` object
// https://tc39.github.io/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

if ([].keys) {
  arrayIterator = [].keys();
  // Safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
  else {
    PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(objectGetPrototypeOf(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
  }
}

if (IteratorPrototype == undefined) IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
if ( !has(IteratorPrototype, ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);

var iteratorsCore = {
  IteratorPrototype: IteratorPrototype,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
};

var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;





var returnThis$1 = function () { return this; };

var createIteratorConstructor = function (IteratorConstructor, NAME, next) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = objectCreate(IteratorPrototype$1, { next: createPropertyDescriptor(1, next) });
  setToStringTag(IteratorConstructor, TO_STRING_TAG, false);
  iterators[TO_STRING_TAG] = returnThis$1;
  return IteratorConstructor;
};

var IteratorPrototype$2 = iteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS$1 = iteratorsCore.BUGGY_SAFARI_ITERATORS;
var ITERATOR$1 = wellKnownSymbol('iterator');
var KEYS = 'keys';
var VALUES = 'values';
var ENTRIES = 'entries';

var returnThis$2 = function () { return this; };

var defineIterator = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
  createIteratorConstructor(IteratorConstructor, NAME, next);

  var getIterationMethod = function (KIND) {
    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
    if (!BUGGY_SAFARI_ITERATORS$1 && KIND in IterablePrototype) return IterablePrototype[KIND];
    switch (KIND) {
      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
    } return function () { return new IteratorConstructor(this); };
  };

  var TO_STRING_TAG = NAME + ' Iterator';
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator = IterablePrototype[ITERATOR$1]
    || IterablePrototype['@@iterator']
    || DEFAULT && IterablePrototype[DEFAULT];
  var defaultIterator = !BUGGY_SAFARI_ITERATORS$1 && nativeIterator || getIterationMethod(DEFAULT);
  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
  var CurrentIteratorPrototype, methods, KEY;

  // fix native
  if (anyNativeIterator) {
    CurrentIteratorPrototype = objectGetPrototypeOf(anyNativeIterator.call(new Iterable()));
    if (IteratorPrototype$2 !== Object.prototype && CurrentIteratorPrototype.next) {
      if ( objectGetPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype$2) {
        if (objectSetPrototypeOf) {
          objectSetPrototypeOf(CurrentIteratorPrototype, IteratorPrototype$2);
        } else if (typeof CurrentIteratorPrototype[ITERATOR$1] != 'function') {
          hide(CurrentIteratorPrototype, ITERATOR$1, returnThis$2);
        }
      }
      // Set @@toStringTag to native iterators
      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true);
    }
  }

  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
    INCORRECT_VALUES_NAME = true;
    defaultIterator = function values() { return nativeIterator.call(this); };
  }

  // define iterator
  if ( IterablePrototype[ITERATOR$1] !== defaultIterator) {
    hide(IterablePrototype, ITERATOR$1, defaultIterator);
  }
  iterators[NAME] = defaultIterator;

  // export additional methods
  if (DEFAULT) {
    methods = {
      values: getIterationMethod(VALUES),
      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
      entries: getIterationMethod(ENTRIES)
    };
    if (FORCED) for (KEY in methods) {
      if (BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
        redefine(IterablePrototype, KEY, methods[KEY]);
      }
    } else _export({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME }, methods);
  }

  return methods;
};

var ARRAY_ITERATOR = 'Array Iterator';
var setInternalState$1 = internalState.set;
var getInternalState$1 = internalState.getterFor(ARRAY_ITERATOR);

// `Array.prototype.entries` method
// https://tc39.github.io/ecma262/#sec-array.prototype.entries
// `Array.prototype.keys` method
// https://tc39.github.io/ecma262/#sec-array.prototype.keys
// `Array.prototype.values` method
// https://tc39.github.io/ecma262/#sec-array.prototype.values
// `Array.prototype[@@iterator]` method
// https://tc39.github.io/ecma262/#sec-array.prototype-@@iterator
// `CreateArrayIterator` internal method
// https://tc39.github.io/ecma262/#sec-createarrayiterator
var es_array_iterator = defineIterator(Array, 'Array', function (iterated, kind) {
  setInternalState$1(this, {
    type: ARRAY_ITERATOR,
    target: toIndexedObject(iterated), // target
    index: 0,                          // next index
    kind: kind                         // kind
  });
// `%ArrayIteratorPrototype%.next` method
// https://tc39.github.io/ecma262/#sec-%arrayiteratorprototype%.next
}, function () {
  var state = getInternalState$1(this);
  var target = state.target;
  var kind = state.kind;
  var index = state.index++;
  if (!target || index >= target.length) {
    state.target = undefined;
    return { value: undefined, done: true };
  }
  if (kind == 'keys') return { value: index, done: false };
  if (kind == 'values') return { value: target[index], done: false };
  return { value: [index, target[index]], done: false };
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values%
// https://tc39.github.io/ecma262/#sec-createunmappedargumentsobject
// https://tc39.github.io/ecma262/#sec-createmappedargumentsobject
iterators.Arguments = iterators.Array;

// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

var min$5 = Math.min;
var nativeLastIndexOf = [].lastIndexOf;
var NEGATIVE_ZERO$1 = !!nativeLastIndexOf && 1 / [1].lastIndexOf(1, -0) < 0;
var SLOPPY_METHOD$2 = sloppyArrayMethod('lastIndexOf');

// `Array.prototype.lastIndexOf` method implementation
// https://tc39.github.io/ecma262/#sec-array.prototype.lastindexof
var arrayLastIndexOf = (NEGATIVE_ZERO$1 || SLOPPY_METHOD$2) ? function lastIndexOf(searchElement /* , fromIndex = @[*-1] */) {
  // convert -0 to +0
  if (NEGATIVE_ZERO$1) return nativeLastIndexOf.apply(this, arguments) || 0;
  var O = toIndexedObject(this);
  var length = toLength(O.length);
  var index = length - 1;
  if (arguments.length > 1) index = min$5(index, toInteger(arguments[1]));
  if (index < 0) index = length + index;
  for (;index >= 0; index--) if (index in O && O[index] === searchElement) return index || 0;
  return -1;
} : nativeLastIndexOf;

// `Array.prototype.lastIndexOf` method
// https://tc39.github.io/ecma262/#sec-array.prototype.lastindexof
_export({ target: 'Array', proto: true, forced: arrayLastIndexOf !== [].lastIndexOf }, {
  lastIndexOf: arrayLastIndexOf
});

// `RegExp.prototype.flags` getter
// https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags
if (descriptors && /./g.flags != 'g') {
  objectDefineProperty.f(RegExp.prototype, 'flags', {
    configurable: true,
    get: regexpFlags
  });
}

var redefineAll = function (target, src, options) {
  for (var key in src) redefine(target, key, src[key], options);
  return target;
};

var freezing = !fails(function () {
  return Object.isExtensible(Object.preventExtensions({}));
});

var internalMetadata = createCommonjsModule(function (module) {
var defineProperty = objectDefineProperty.f;



var METADATA = uid('meta');
var id = 0;

var isExtensible = Object.isExtensible || function () {
  return true;
};

var setMetadata = function (it) {
  defineProperty(it, METADATA, { value: {
    objectID: 'O' + ++id, // object ID
    weakData: {}          // weak collections IDs
  } });
};

var fastKey = function (it, create) {
  // return a primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, METADATA)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMetadata(it);
  // return object ID
  } return it[METADATA].objectID;
};

var getWeakData = function (it, create) {
  if (!has(it, METADATA)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMetadata(it);
  // return the store of weak collections IDs
  } return it[METADATA].weakData;
};

// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (freezing && meta.REQUIRED && isExtensible(it) && !has(it, METADATA)) setMetadata(it);
  return it;
};

var meta = module.exports = {
  REQUIRED: false,
  fastKey: fastKey,
  getWeakData: getWeakData,
  onFreeze: onFreeze
};

hiddenKeys[METADATA] = true;
});
var internalMetadata_1 = internalMetadata.REQUIRED;
var internalMetadata_2 = internalMetadata.fastKey;
var internalMetadata_3 = internalMetadata.getWeakData;
var internalMetadata_4 = internalMetadata.onFreeze;

var ITERATOR$2 = wellKnownSymbol('iterator');
var ArrayPrototype$1 = Array.prototype;

// check on default Array iterator
var isArrayIteratorMethod = function (it) {
  return it !== undefined && (iterators.Array === it || ArrayPrototype$1[ITERATOR$2] === it);
};

var ITERATOR$3 = wellKnownSymbol('iterator');

var getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR$3]
    || it['@@iterator']
    || iterators[classof(it)];
};

// call something on iterator step with safe closing on error
var callWithSafeIterationClosing = function (iterator, fn, value, ENTRIES) {
  try {
    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (error) {
    var returnMethod = iterator['return'];
    if (returnMethod !== undefined) anObject(returnMethod.call(iterator));
    throw error;
  }
};

var iterate_1 = createCommonjsModule(function (module) {
var Result = function (stopped, result) {
  this.stopped = stopped;
  this.result = result;
};

var iterate = module.exports = function (iterable, fn, that, AS_ENTRIES, IS_ITERATOR) {
  var boundFunction = bindContext(fn, that, AS_ENTRIES ? 2 : 1);
  var iterator, iterFn, index, length, result, step;

  if (IS_ITERATOR) {
    iterator = iterable;
  } else {
    iterFn = getIteratorMethod(iterable);
    if (typeof iterFn != 'function') throw TypeError('Target is not iterable');
    // optimisation for array iterators
    if (isArrayIteratorMethod(iterFn)) {
      for (index = 0, length = toLength(iterable.length); length > index; index++) {
        result = AS_ENTRIES
          ? boundFunction(anObject(step = iterable[index])[0], step[1])
          : boundFunction(iterable[index]);
        if (result && result instanceof Result) return result;
      } return new Result(false);
    }
    iterator = iterFn.call(iterable);
  }

  while (!(step = iterator.next()).done) {
    result = callWithSafeIterationClosing(iterator, boundFunction, step.value, AS_ENTRIES);
    if (result && result instanceof Result) return result;
  } return new Result(false);
};

iterate.stop = function (result) {
  return new Result(true, result);
};
});

var anInstance = function (it, Constructor, name) {
  if (!(it instanceof Constructor)) {
    throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
  } return it;
};

var ITERATOR$4 = wellKnownSymbol('iterator');
var SAFE_CLOSING = false;

try {
  var called = 0;
  var iteratorWithReturn = {
    next: function () {
      return { done: !!called++ };
    },
    'return': function () {
      SAFE_CLOSING = true;
    }
  };
  iteratorWithReturn[ITERATOR$4] = function () {
    return this;
  };
  // eslint-disable-next-line no-throw-literal
  Array.from(iteratorWithReturn, function () { throw 2; });
} catch (error) { /* empty */ }

var checkCorrectnessOfIteration = function (exec, SKIP_CLOSING) {
  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
  var ITERATION_SUPPORT = false;
  try {
    var object = {};
    object[ITERATOR$4] = function () {
      return {
        next: function () {
          return { done: ITERATION_SUPPORT = true };
        }
      };
    };
    exec(object);
  } catch (error) { /* empty */ }
  return ITERATION_SUPPORT;
};

var collection = function (CONSTRUCTOR_NAME, wrapper, common, IS_MAP, IS_WEAK) {
  var NativeConstructor = global_1[CONSTRUCTOR_NAME];
  var NativePrototype = NativeConstructor && NativeConstructor.prototype;
  var Constructor = NativeConstructor;
  var ADDER = IS_MAP ? 'set' : 'add';
  var exported = {};

  var fixMethod = function (KEY) {
    var nativeMethod = NativePrototype[KEY];
    redefine(NativePrototype, KEY,
      KEY == 'add' ? function add(value) {
        nativeMethod.call(this, value === 0 ? 0 : value);
        return this;
      } : KEY == 'delete' ? function (key) {
        return IS_WEAK && !isObject(key) ? false : nativeMethod.call(this, key === 0 ? 0 : key);
      } : KEY == 'get' ? function get(key) {
        return IS_WEAK && !isObject(key) ? undefined : nativeMethod.call(this, key === 0 ? 0 : key);
      } : KEY == 'has' ? function has(key) {
        return IS_WEAK && !isObject(key) ? false : nativeMethod.call(this, key === 0 ? 0 : key);
      } : function set(key, value) {
        nativeMethod.call(this, key === 0 ? 0 : key, value);
        return this;
      }
    );
  };

  // eslint-disable-next-line max-len
  if (isForced_1(CONSTRUCTOR_NAME, typeof NativeConstructor != 'function' || !(IS_WEAK || NativePrototype.forEach && !fails(function () {
    new NativeConstructor().entries().next();
  })))) {
    // create collection constructor
    Constructor = common.getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER);
    internalMetadata.REQUIRED = true;
  } else if (isForced_1(CONSTRUCTOR_NAME, true)) {
    var instance = new Constructor();
    // early implementations not supports chaining
    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
    // V8 ~ Chromium 40- weak-collections throws on primitives, but should return false
    var THROWS_ON_PRIMITIVES = fails(function () { instance.has(1); });
    // most early implementations doesn't supports iterables, most modern - not close it correctly
    // eslint-disable-next-line no-new
    var ACCEPT_ITERABLES = checkCorrectnessOfIteration(function (iterable) { new NativeConstructor(iterable); });
    // for early implementations -0 and +0 not the same
    var BUGGY_ZERO = !IS_WEAK && fails(function () {
      // V8 ~ Chromium 42- fails only with 5+ elements
      var $instance = new NativeConstructor();
      var index = 5;
      while (index--) $instance[ADDER](index, index);
      return !$instance.has(-0);
    });

    if (!ACCEPT_ITERABLES) {
      Constructor = wrapper(function (dummy, iterable) {
        anInstance(dummy, Constructor, CONSTRUCTOR_NAME);
        var that = inheritIfRequired(new NativeConstructor(), dummy, Constructor);
        if (iterable != undefined) iterate_1(iterable, that[ADDER], that, IS_MAP);
        return that;
      });
      Constructor.prototype = NativePrototype;
      NativePrototype.constructor = Constructor;
    }

    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }

    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);

    // weak collections should not contains .clear method
    if (IS_WEAK && NativePrototype.clear) delete NativePrototype.clear;
  }

  exported[CONSTRUCTOR_NAME] = Constructor;
  _export({ global: true, forced: Constructor != NativeConstructor }, exported);

  setToStringTag(Constructor, CONSTRUCTOR_NAME);

  if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);

  return Constructor;
};

var getWeakData = internalMetadata.getWeakData;








var setInternalState$2 = internalState.set;
var internalStateGetterFor = internalState.getterFor;
var find = arrayIteration.find;
var findIndex = arrayIteration.findIndex;
var id$1 = 0;

// fallback for uncaught frozen keys
var uncaughtFrozenStore = function (store) {
  return store.frozen || (store.frozen = new UncaughtFrozenStore());
};

var UncaughtFrozenStore = function () {
  this.entries = [];
};

var findUncaughtFrozen = function (store, key) {
  return find(store.entries, function (it) {
    return it[0] === key;
  });
};

UncaughtFrozenStore.prototype = {
  get: function (key) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) return entry[1];
  },
  has: function (key) {
    return !!findUncaughtFrozen(this, key);
  },
  set: function (key, value) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) entry[1] = value;
    else this.entries.push([key, value]);
  },
  'delete': function (key) {
    var index = findIndex(this.entries, function (it) {
      return it[0] === key;
    });
    if (~index) this.entries.splice(index, 1);
    return !!~index;
  }
};

var collectionWeak = {
  getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, CONSTRUCTOR_NAME);
      setInternalState$2(that, {
        type: CONSTRUCTOR_NAME,
        id: id$1++,
        frozen: undefined
      });
      if (iterable != undefined) iterate_1(iterable, that[ADDER], that, IS_MAP);
    });

    var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

    var define = function (that, key, value) {
      var state = getInternalState(that);
      var data = getWeakData(anObject(key), true);
      if (data === true) uncaughtFrozenStore(state).set(key, value);
      else data[state.id] = value;
      return that;
    };

    redefineAll(C.prototype, {
      // 23.3.3.2 WeakMap.prototype.delete(key)
      // 23.4.3.3 WeakSet.prototype.delete(value)
      'delete': function (key) {
        var state = getInternalState(this);
        if (!isObject(key)) return false;
        var data = getWeakData(key);
        if (data === true) return uncaughtFrozenStore(state)['delete'](key);
        return data && has(data, state.id) && delete data[state.id];
      },
      // 23.3.3.4 WeakMap.prototype.has(key)
      // 23.4.3.4 WeakSet.prototype.has(value)
      has: function has$1(key) {
        var state = getInternalState(this);
        if (!isObject(key)) return false;
        var data = getWeakData(key);
        if (data === true) return uncaughtFrozenStore(state).has(key);
        return data && has(data, state.id);
      }
    });

    redefineAll(C.prototype, IS_MAP ? {
      // 23.3.3.3 WeakMap.prototype.get(key)
      get: function get(key) {
        var state = getInternalState(this);
        if (isObject(key)) {
          var data = getWeakData(key);
          if (data === true) return uncaughtFrozenStore(state).get(key);
          return data ? data[state.id] : undefined;
        }
      },
      // 23.3.3.5 WeakMap.prototype.set(key, value)
      set: function set(key, value) {
        return define(this, key, value);
      }
    } : {
      // 23.4.3.1 WeakSet.prototype.add(value)
      add: function add(value) {
        return define(this, value, true);
      }
    });

    return C;
  }
};

var es_weakMap = createCommonjsModule(function (module) {






var enforceIternalState = internalState.enforce;


var IS_IE11 = !global_1.ActiveXObject && 'ActiveXObject' in global_1;
var isExtensible = Object.isExtensible;
var InternalWeakMap;

var wrapper = function (get) {
  return function WeakMap() {
    return get(this, arguments.length ? arguments[0] : undefined);
  };
};

// `WeakMap` constructor
// https://tc39.github.io/ecma262/#sec-weakmap-constructor
var $WeakMap = module.exports = collection('WeakMap', wrapper, collectionWeak, true, true);

// IE11 WeakMap frozen keys fix
// We can't use feature detection because it crash some old IE builds
// https://github.com/zloirock/core-js/issues/485
if (nativeWeakMap && IS_IE11) {
  InternalWeakMap = collectionWeak.getConstructor(wrapper, 'WeakMap', true);
  internalMetadata.REQUIRED = true;
  var WeakMapPrototype = $WeakMap.prototype;
  var nativeDelete = WeakMapPrototype['delete'];
  var nativeHas = WeakMapPrototype.has;
  var nativeGet = WeakMapPrototype.get;
  var nativeSet = WeakMapPrototype.set;
  redefineAll(WeakMapPrototype, {
    'delete': function (key) {
      if (isObject(key) && !isExtensible(key)) {
        var state = enforceIternalState(this);
        if (!state.frozen) state.frozen = new InternalWeakMap();
        return nativeDelete.call(this, key) || state.frozen['delete'](key);
      } return nativeDelete.call(this, key);
    },
    has: function has(key) {
      if (isObject(key) && !isExtensible(key)) {
        var state = enforceIternalState(this);
        if (!state.frozen) state.frozen = new InternalWeakMap();
        return nativeHas.call(this, key) || state.frozen.has(key);
      } return nativeHas.call(this, key);
    },
    get: function get(key) {
      if (isObject(key) && !isExtensible(key)) {
        var state = enforceIternalState(this);
        if (!state.frozen) state.frozen = new InternalWeakMap();
        return nativeHas.call(this, key) ? nativeGet.call(this, key) : state.frozen.get(key);
      } return nativeGet.call(this, key);
    },
    set: function set(key, value) {
      if (isObject(key) && !isExtensible(key)) {
        var state = enforceIternalState(this);
        if (!state.frozen) state.frozen = new InternalWeakMap();
        nativeHas.call(this, key) ? nativeSet.call(this, key, value) : state.frozen.set(key, value);
      } else nativeSet.call(this, key, value);
      return this;
    }
  });
}
});

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */

var INFINITY = 1 / 0;
/** `Object#toString` result references. */

var symbolTag = '[object Symbol]';
/** Used to match HTML entities and HTML characters. */

var reEscapedHtml = /&(?:amp|lt|gt|quot|#39|#96);/g,
    reHasEscapedHtml = RegExp(reEscapedHtml.source);
/** Used to map HTML entities to characters. */

var htmlUnescapes = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&#96;': '`'
};
/** Detect free variable `global` from Node.js. */

var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
/** Detect free variable `self`. */

var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
/** Used as a reference to the global object. */

var root = freeGlobal || freeSelf || Function('return this')();
/**
 * The base implementation of `_.propertyOf` without support for deep paths.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Function} Returns the new accessor function.
 */

function basePropertyOf(object) {
  return function (key) {
    return object == null ? undefined : object[key];
  };
}
/**
 * Used by `_.unescape` to convert HTML entities to characters.
 *
 * @private
 * @param {string} chr The matched character to unescape.
 * @returns {string} Returns the unescaped character.
 */


var unescapeHtmlChar = basePropertyOf(htmlUnescapes);
/** Used for built-in method references. */

var objectProto = Object.prototype;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */

var objectToString$1 = objectProto.toString;
/** Built-in value references. */

var Symbol$2 = root.Symbol;
/** Used to convert symbols to primitives and strings. */

var symbolProto = Symbol$2 ? Symbol$2.prototype : undefined,
    symbolToString$1 = symbolProto ? symbolProto.toString : undefined;
/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */

function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }

  if (isSymbol$1(value)) {
    return symbolToString$1 ? symbolToString$1.call(value) : '';
  }

  var result = value + '';
  return result == '0' && 1 / value == -INFINITY ? '-0' : result;
}
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
  return !!value && typeof value == 'object';
}
/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */


function isSymbol$1(value) {
  return typeof value == 'symbol' || isObjectLike(value) && objectToString$1.call(value) == symbolTag;
}
/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */


function toString$2(value) {
  return value == null ? '' : baseToString(value);
}
/**
 * The inverse of `_.escape`; this method converts the HTML entities
 * `&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#39;`, and `&#96;` in `string` to
 * their corresponding characters.
 *
 * **Note:** No other HTML entities are unescaped. To unescape additional
 * HTML entities use a third-party library like [_he_](https://mths.be/he).
 *
 * @static
 * @memberOf _
 * @since 0.6.0
 * @category String
 * @param {string} [string=''] The string to unescape.
 * @returns {string} Returns the unescaped string.
 * @example
 *
 * _.unescape('fred, barney, &amp; pebbles');
 * // => 'fred, barney, & pebbles'
 */


function unescape(string) {
  string = toString$2(string);
  return string && reHasEscapedHtml.test(string) ? string.replace(reEscapedHtml, unescapeHtmlChar) : string;
}

var lodash_unescape = unescape;

var tsEstree = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
unwrapExports(tsEstree);

var astNodeTypes = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var AST_NODE_TYPES;

  (function (AST_NODE_TYPES) {
    AST_NODE_TYPES["ArrayExpression"] = "ArrayExpression";
    AST_NODE_TYPES["ArrayPattern"] = "ArrayPattern";
    AST_NODE_TYPES["ArrowFunctionExpression"] = "ArrowFunctionExpression";
    AST_NODE_TYPES["AssignmentExpression"] = "AssignmentExpression";
    AST_NODE_TYPES["AssignmentPattern"] = "AssignmentPattern";
    AST_NODE_TYPES["AwaitExpression"] = "AwaitExpression";
    AST_NODE_TYPES["BigIntLiteral"] = "BigIntLiteral";
    AST_NODE_TYPES["BinaryExpression"] = "BinaryExpression";
    AST_NODE_TYPES["BlockStatement"] = "BlockStatement";
    AST_NODE_TYPES["BreakStatement"] = "BreakStatement";
    AST_NODE_TYPES["CallExpression"] = "CallExpression";
    AST_NODE_TYPES["CatchClause"] = "CatchClause";
    AST_NODE_TYPES["ClassBody"] = "ClassBody";
    AST_NODE_TYPES["ClassDeclaration"] = "ClassDeclaration";
    AST_NODE_TYPES["ClassExpression"] = "ClassExpression";
    AST_NODE_TYPES["ClassProperty"] = "ClassProperty";
    AST_NODE_TYPES["ConditionalExpression"] = "ConditionalExpression";
    AST_NODE_TYPES["ContinueStatement"] = "ContinueStatement";
    AST_NODE_TYPES["DebuggerStatement"] = "DebuggerStatement";
    AST_NODE_TYPES["Decorator"] = "Decorator";
    AST_NODE_TYPES["DoWhileStatement"] = "DoWhileStatement";
    AST_NODE_TYPES["EmptyStatement"] = "EmptyStatement";
    AST_NODE_TYPES["ExportAllDeclaration"] = "ExportAllDeclaration";
    AST_NODE_TYPES["ExportDefaultDeclaration"] = "ExportDefaultDeclaration";
    AST_NODE_TYPES["ExportNamedDeclaration"] = "ExportNamedDeclaration";
    AST_NODE_TYPES["ExportSpecifier"] = "ExportSpecifier";
    AST_NODE_TYPES["ExpressionStatement"] = "ExpressionStatement";
    AST_NODE_TYPES["ForInStatement"] = "ForInStatement";
    AST_NODE_TYPES["ForOfStatement"] = "ForOfStatement";
    AST_NODE_TYPES["ForStatement"] = "ForStatement";
    AST_NODE_TYPES["FunctionDeclaration"] = "FunctionDeclaration";
    AST_NODE_TYPES["FunctionExpression"] = "FunctionExpression";
    AST_NODE_TYPES["Identifier"] = "Identifier";
    AST_NODE_TYPES["IfStatement"] = "IfStatement";
    AST_NODE_TYPES["Import"] = "Import";
    AST_NODE_TYPES["ImportDeclaration"] = "ImportDeclaration";
    AST_NODE_TYPES["ImportDefaultSpecifier"] = "ImportDefaultSpecifier";
    AST_NODE_TYPES["ImportNamespaceSpecifier"] = "ImportNamespaceSpecifier";
    AST_NODE_TYPES["ImportSpecifier"] = "ImportSpecifier";
    AST_NODE_TYPES["JSXAttribute"] = "JSXAttribute";
    AST_NODE_TYPES["JSXClosingElement"] = "JSXClosingElement";
    AST_NODE_TYPES["JSXClosingFragment"] = "JSXClosingFragment";
    AST_NODE_TYPES["JSXElement"] = "JSXElement";
    AST_NODE_TYPES["JSXEmptyExpression"] = "JSXEmptyExpression";
    AST_NODE_TYPES["JSXExpressionContainer"] = "JSXExpressionContainer";
    AST_NODE_TYPES["JSXFragment"] = "JSXFragment";
    AST_NODE_TYPES["JSXIdentifier"] = "JSXIdentifier";
    AST_NODE_TYPES["JSXMemberExpression"] = "JSXMemberExpression";
    AST_NODE_TYPES["JSXNamespacedName"] = "JSXNamespacedName";
    AST_NODE_TYPES["JSXOpeningElement"] = "JSXOpeningElement";
    AST_NODE_TYPES["JSXOpeningFragment"] = "JSXOpeningFragment";
    AST_NODE_TYPES["JSXSpreadAttribute"] = "JSXSpreadAttribute";
    AST_NODE_TYPES["JSXSpreadChild"] = "JSXSpreadChild";
    AST_NODE_TYPES["JSXText"] = "JSXText";
    AST_NODE_TYPES["LabeledStatement"] = "LabeledStatement";
    AST_NODE_TYPES["Literal"] = "Literal";
    AST_NODE_TYPES["LogicalExpression"] = "LogicalExpression";
    AST_NODE_TYPES["MemberExpression"] = "MemberExpression";
    AST_NODE_TYPES["MetaProperty"] = "MetaProperty";
    AST_NODE_TYPES["MethodDefinition"] = "MethodDefinition";
    AST_NODE_TYPES["NewExpression"] = "NewExpression";
    AST_NODE_TYPES["ObjectExpression"] = "ObjectExpression";
    AST_NODE_TYPES["ObjectPattern"] = "ObjectPattern";
    AST_NODE_TYPES["Program"] = "Program";
    AST_NODE_TYPES["Property"] = "Property";
    AST_NODE_TYPES["RestElement"] = "RestElement";
    AST_NODE_TYPES["ReturnStatement"] = "ReturnStatement";
    AST_NODE_TYPES["SequenceExpression"] = "SequenceExpression";
    AST_NODE_TYPES["SpreadElement"] = "SpreadElement";
    AST_NODE_TYPES["Super"] = "Super";
    AST_NODE_TYPES["SwitchCase"] = "SwitchCase";
    AST_NODE_TYPES["SwitchStatement"] = "SwitchStatement";
    AST_NODE_TYPES["TaggedTemplateExpression"] = "TaggedTemplateExpression";
    AST_NODE_TYPES["TemplateElement"] = "TemplateElement";
    AST_NODE_TYPES["TemplateLiteral"] = "TemplateLiteral";
    AST_NODE_TYPES["ThisExpression"] = "ThisExpression";
    AST_NODE_TYPES["ThrowStatement"] = "ThrowStatement";
    AST_NODE_TYPES["TryStatement"] = "TryStatement";
    AST_NODE_TYPES["UnaryExpression"] = "UnaryExpression";
    AST_NODE_TYPES["UpdateExpression"] = "UpdateExpression";
    AST_NODE_TYPES["VariableDeclaration"] = "VariableDeclaration";
    AST_NODE_TYPES["VariableDeclarator"] = "VariableDeclarator";
    AST_NODE_TYPES["WhileStatement"] = "WhileStatement";
    AST_NODE_TYPES["WithStatement"] = "WithStatement";
    AST_NODE_TYPES["YieldExpression"] = "YieldExpression";
    /**
     * TS-prefixed nodes
     */

    AST_NODE_TYPES["TSAbstractClassProperty"] = "TSAbstractClassProperty";
    AST_NODE_TYPES["TSAbstractKeyword"] = "TSAbstractKeyword";
    AST_NODE_TYPES["TSAbstractMethodDefinition"] = "TSAbstractMethodDefinition";
    AST_NODE_TYPES["TSAnyKeyword"] = "TSAnyKeyword";
    AST_NODE_TYPES["TSArrayType"] = "TSArrayType";
    AST_NODE_TYPES["TSAsExpression"] = "TSAsExpression";
    AST_NODE_TYPES["TSAsyncKeyword"] = "TSAsyncKeyword";
    AST_NODE_TYPES["TSBooleanKeyword"] = "TSBooleanKeyword";
    AST_NODE_TYPES["TSBigIntKeyword"] = "TSBigIntKeyword";
    AST_NODE_TYPES["TSConditionalType"] = "TSConditionalType";
    AST_NODE_TYPES["TSConstructorType"] = "TSConstructorType";
    AST_NODE_TYPES["TSCallSignatureDeclaration"] = "TSCallSignatureDeclaration";
    AST_NODE_TYPES["TSClassImplements"] = "TSClassImplements";
    AST_NODE_TYPES["TSConstructSignatureDeclaration"] = "TSConstructSignatureDeclaration";
    AST_NODE_TYPES["TSDeclareKeyword"] = "TSDeclareKeyword";
    AST_NODE_TYPES["TSDeclareFunction"] = "TSDeclareFunction";
    AST_NODE_TYPES["TSEmptyBodyFunctionExpression"] = "TSEmptyBodyFunctionExpression";
    AST_NODE_TYPES["TSEnumDeclaration"] = "TSEnumDeclaration";
    AST_NODE_TYPES["TSEnumMember"] = "TSEnumMember";
    AST_NODE_TYPES["TSExportAssignment"] = "TSExportAssignment";
    AST_NODE_TYPES["TSExportKeyword"] = "TSExportKeyword";
    AST_NODE_TYPES["TSExternalModuleReference"] = "TSExternalModuleReference";
    AST_NODE_TYPES["TSImportType"] = "TSImportType";
    AST_NODE_TYPES["TSInferType"] = "TSInferType";
    AST_NODE_TYPES["TSLiteralType"] = "TSLiteralType";
    AST_NODE_TYPES["TSIndexedAccessType"] = "TSIndexedAccessType";
    AST_NODE_TYPES["TSIndexSignature"] = "TSIndexSignature";
    AST_NODE_TYPES["TSInterfaceBody"] = "TSInterfaceBody";
    AST_NODE_TYPES["TSInterfaceDeclaration"] = "TSInterfaceDeclaration";
    AST_NODE_TYPES["TSInterfaceHeritage"] = "TSInterfaceHeritage";
    AST_NODE_TYPES["TSImportEqualsDeclaration"] = "TSImportEqualsDeclaration";
    AST_NODE_TYPES["TSFunctionType"] = "TSFunctionType";
    AST_NODE_TYPES["TSMethodSignature"] = "TSMethodSignature";
    AST_NODE_TYPES["TSModuleBlock"] = "TSModuleBlock";
    AST_NODE_TYPES["TSModuleDeclaration"] = "TSModuleDeclaration";
    AST_NODE_TYPES["TSNamespaceExportDeclaration"] = "TSNamespaceExportDeclaration";
    AST_NODE_TYPES["TSNonNullExpression"] = "TSNonNullExpression";
    AST_NODE_TYPES["TSNeverKeyword"] = "TSNeverKeyword";
    AST_NODE_TYPES["TSNullKeyword"] = "TSNullKeyword";
    AST_NODE_TYPES["TSNumberKeyword"] = "TSNumberKeyword";
    AST_NODE_TYPES["TSMappedType"] = "TSMappedType";
    AST_NODE_TYPES["TSObjectKeyword"] = "TSObjectKeyword";
    AST_NODE_TYPES["TSParameterProperty"] = "TSParameterProperty";
    AST_NODE_TYPES["TSPrivateKeyword"] = "TSPrivateKeyword";
    AST_NODE_TYPES["TSPropertySignature"] = "TSPropertySignature";
    AST_NODE_TYPES["TSProtectedKeyword"] = "TSProtectedKeyword";
    AST_NODE_TYPES["TSPublicKeyword"] = "TSPublicKeyword";
    AST_NODE_TYPES["TSQualifiedName"] = "TSQualifiedName";
    AST_NODE_TYPES["TSQuestionToken"] = "TSQuestionToken";
    AST_NODE_TYPES["TSReadonlyKeyword"] = "TSReadonlyKeyword";
    AST_NODE_TYPES["TSRestType"] = "TSRestType";
    AST_NODE_TYPES["TSStaticKeyword"] = "TSStaticKeyword";
    AST_NODE_TYPES["TSStringKeyword"] = "TSStringKeyword";
    AST_NODE_TYPES["TSSymbolKeyword"] = "TSSymbolKeyword";
    AST_NODE_TYPES["TSThisType"] = "TSThisType";
    AST_NODE_TYPES["TSTypeAnnotation"] = "TSTypeAnnotation";
    AST_NODE_TYPES["TSTypeAliasDeclaration"] = "TSTypeAliasDeclaration";
    AST_NODE_TYPES["TSTypeAssertion"] = "TSTypeAssertion";
    AST_NODE_TYPES["TSTypeLiteral"] = "TSTypeLiteral";
    AST_NODE_TYPES["TSTypeOperator"] = "TSTypeOperator";
    AST_NODE_TYPES["TSTypeParameter"] = "TSTypeParameter";
    AST_NODE_TYPES["TSTypeParameterDeclaration"] = "TSTypeParameterDeclaration";
    AST_NODE_TYPES["TSTypeParameterInstantiation"] = "TSTypeParameterInstantiation";
    AST_NODE_TYPES["TSTypePredicate"] = "TSTypePredicate";
    AST_NODE_TYPES["TSTypeReference"] = "TSTypeReference";
    AST_NODE_TYPES["TSTypeQuery"] = "TSTypeQuery";
    AST_NODE_TYPES["TSIntersectionType"] = "TSIntersectionType";
    AST_NODE_TYPES["TSTupleType"] = "TSTupleType";
    AST_NODE_TYPES["TSOptionalType"] = "TSOptionalType";
    AST_NODE_TYPES["TSParenthesizedType"] = "TSParenthesizedType";
    AST_NODE_TYPES["TSUnionType"] = "TSUnionType";
    AST_NODE_TYPES["TSUndefinedKeyword"] = "TSUndefinedKeyword";
    AST_NODE_TYPES["TSUnknownKeyword"] = "TSUnknownKeyword";
    AST_NODE_TYPES["TSVoidKeyword"] = "TSVoidKeyword";
  })(AST_NODE_TYPES = exports.AST_NODE_TYPES || (exports.AST_NODE_TYPES = {}));

  var AST_TOKEN_TYPES;

  (function (AST_TOKEN_TYPES) {
    AST_TOKEN_TYPES["Boolean"] = "Boolean";
    AST_TOKEN_TYPES["Identifier"] = "Identifier";
    AST_TOKEN_TYPES["JSXIdentifier"] = "JSXIdentifier";
    AST_TOKEN_TYPES["JSXText"] = "JSXText";
    AST_TOKEN_TYPES["Keyword"] = "Keyword";
    AST_TOKEN_TYPES["Null"] = "Null";
    AST_TOKEN_TYPES["Numeric"] = "Numeric";
    AST_TOKEN_TYPES["Punctuator"] = "Punctuator";
    AST_TOKEN_TYPES["RegularExpression"] = "RegularExpression";
    AST_TOKEN_TYPES["String"] = "String";
    AST_TOKEN_TYPES["Template"] = "Template"; // comment types

    AST_TOKEN_TYPES["Block"] = "Block";
    AST_TOKEN_TYPES["Line"] = "Line";
  })(AST_TOKEN_TYPES = exports.AST_TOKEN_TYPES || (exports.AST_TOKEN_TYPES = {}));
});
unwrapExports(astNodeTypes);
var astNodeTypes_1 = astNodeTypes.AST_NODE_TYPES;
var astNodeTypes_2 = astNodeTypes.AST_TOKEN_TYPES;

var tsEstree$1 = createCommonjsModule(function (module, exports) {

  function __export(m) {
    for (var p in m) {
      if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
  }

  var __importStar = commonjsGlobal && commonjsGlobal.__importStar || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) {
      if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    }
    result["default"] = mod;
    return result;
  };

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var TSESTree = __importStar(tsEstree);

  exports.TSESTree = TSESTree;

  __export(astNodeTypes);
});
unwrapExports(tsEstree$1);
var tsEstree_1 = tsEstree$1.TSESTree;

var nodeUtils = createCommonjsModule(function (module, exports) {

  var __importDefault = commonjsGlobal && commonjsGlobal.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : {
      "default": mod
    };
  };

  var __importStar = commonjsGlobal && commonjsGlobal.__importStar || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) {
      if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    }
    result["default"] = mod;
    return result;
  };

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var lodash_unescape_1 = __importDefault(lodash_unescape);

  var ts = __importStar(typescript); // leave this as * as ts so people using util package don't need syntheticDefaultImports


  var SyntaxKind = ts.SyntaxKind;
  var ASSIGNMENT_OPERATORS = [SyntaxKind.EqualsToken, SyntaxKind.PlusEqualsToken, SyntaxKind.MinusEqualsToken, SyntaxKind.AsteriskEqualsToken, SyntaxKind.AsteriskAsteriskEqualsToken, SyntaxKind.SlashEqualsToken, SyntaxKind.PercentEqualsToken, SyntaxKind.LessThanLessThanEqualsToken, SyntaxKind.GreaterThanGreaterThanEqualsToken, SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken, SyntaxKind.AmpersandEqualsToken, SyntaxKind.BarEqualsToken, SyntaxKind.CaretEqualsToken];
  var LOGICAL_OPERATORS = [SyntaxKind.BarBarToken, SyntaxKind.AmpersandAmpersandToken];
  var TOKEN_TO_TEXT = {
    [SyntaxKind.OpenBraceToken]: '{',
    [SyntaxKind.CloseBraceToken]: '}',
    [SyntaxKind.OpenParenToken]: '(',
    [SyntaxKind.CloseParenToken]: ')',
    [SyntaxKind.OpenBracketToken]: '[',
    [SyntaxKind.CloseBracketToken]: ']',
    [SyntaxKind.DotToken]: '.',
    [SyntaxKind.DotDotDotToken]: '...',
    [SyntaxKind.SemicolonToken]: ',',
    [SyntaxKind.CommaToken]: ',',
    [SyntaxKind.LessThanToken]: '<',
    [SyntaxKind.GreaterThanToken]: '>',
    [SyntaxKind.LessThanEqualsToken]: '<=',
    [SyntaxKind.GreaterThanEqualsToken]: '>=',
    [SyntaxKind.EqualsEqualsToken]: '==',
    [SyntaxKind.ExclamationEqualsToken]: '!=',
    [SyntaxKind.EqualsEqualsEqualsToken]: '===',
    [SyntaxKind.InstanceOfKeyword]: 'instanceof',
    [SyntaxKind.ExclamationEqualsEqualsToken]: '!==',
    [SyntaxKind.EqualsGreaterThanToken]: '=>',
    [SyntaxKind.PlusToken]: '+',
    [SyntaxKind.MinusToken]: '-',
    [SyntaxKind.AsteriskToken]: '*',
    [SyntaxKind.AsteriskAsteriskToken]: '**',
    [SyntaxKind.SlashToken]: '/',
    [SyntaxKind.PercentToken]: '%',
    [SyntaxKind.PlusPlusToken]: '++',
    [SyntaxKind.MinusMinusToken]: '--',
    [SyntaxKind.LessThanLessThanToken]: '<<',
    [SyntaxKind.LessThanSlashToken]: '</',
    [SyntaxKind.GreaterThanGreaterThanToken]: '>>',
    [SyntaxKind.GreaterThanGreaterThanGreaterThanToken]: '>>>',
    [SyntaxKind.AmpersandToken]: '&',
    [SyntaxKind.BarToken]: '|',
    [SyntaxKind.CaretToken]: '^',
    [SyntaxKind.ExclamationToken]: '!',
    [SyntaxKind.TildeToken]: '~',
    [SyntaxKind.AmpersandAmpersandToken]: '&&',
    [SyntaxKind.BarBarToken]: '||',
    [SyntaxKind.QuestionToken]: '?',
    [SyntaxKind.ColonToken]: ':',
    [SyntaxKind.EqualsToken]: '=',
    [SyntaxKind.PlusEqualsToken]: '+=',
    [SyntaxKind.MinusEqualsToken]: '-=',
    [SyntaxKind.AsteriskEqualsToken]: '*=',
    [SyntaxKind.AsteriskAsteriskEqualsToken]: '**=',
    [SyntaxKind.SlashEqualsToken]: '/=',
    [SyntaxKind.PercentEqualsToken]: '%=',
    [SyntaxKind.LessThanLessThanEqualsToken]: '<<=',
    [SyntaxKind.GreaterThanGreaterThanEqualsToken]: '>>=',
    [SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken]: '>>>=',
    [SyntaxKind.AmpersandEqualsToken]: '&=',
    [SyntaxKind.BarEqualsToken]: '|=',
    [SyntaxKind.CaretEqualsToken]: '^=',
    [SyntaxKind.AtToken]: '@',
    [SyntaxKind.InKeyword]: 'in',
    [SyntaxKind.UniqueKeyword]: 'unique',
    [SyntaxKind.KeyOfKeyword]: 'keyof',
    [SyntaxKind.NewKeyword]: 'new',
    [SyntaxKind.ImportKeyword]: 'import',
    [SyntaxKind.ReadonlyKeyword]: 'readonly'
  };
  /**
   * Returns true if the given ts.Token is the assignment operator
   * @param operator the operator token
   * @returns is assignment
   */

  function isAssignmentOperator(operator) {
    return ASSIGNMENT_OPERATORS.includes(operator.kind);
  }

  exports.isAssignmentOperator = isAssignmentOperator;
  /**
   * Returns true if the given ts.Token is a logical operator
   * @param operator the operator token
   * @returns is a logical operator
   */

  function isLogicalOperator(operator) {
    return LOGICAL_OPERATORS.includes(operator.kind);
  }

  exports.isLogicalOperator = isLogicalOperator;
  /**
   * Returns the string form of the given TSToken SyntaxKind
   * @param kind the token's SyntaxKind
   * @returns the token applicable token as a string
   */

  function getTextForTokenKind(kind) {
    return TOKEN_TO_TEXT[kind];
  }

  exports.getTextForTokenKind = getTextForTokenKind;
  /**
   * Returns true if the given ts.Node is a valid ESTree class member
   * @param node TypeScript AST node
   * @returns is valid ESTree class member
   */

  function isESTreeClassMember(node) {
    return node.kind !== SyntaxKind.SemicolonClassElement;
  }

  exports.isESTreeClassMember = isESTreeClassMember;
  /**
   * Checks if a ts.Node has a modifier
   * @param modifierKind TypeScript SyntaxKind modifier
   * @param node TypeScript AST node
   * @returns has the modifier specified
   */

  function hasModifier(modifierKind, node) {
    return !!node.modifiers && !!node.modifiers.length && node.modifiers.some(function (modifier) {
      return modifier.kind === modifierKind;
    });
  }

  exports.hasModifier = hasModifier;
  /**
   * Get last last modifier in ast
   * @param node TypeScript AST node
   * @returns returns last modifier if present or null
   */

  function getLastModifier(node) {
    return !!node.modifiers && !!node.modifiers.length && node.modifiers[node.modifiers.length - 1] || null;
  }

  exports.getLastModifier = getLastModifier;
  /**
   * Returns true if the given ts.Token is a comma
   * @param token the TypeScript token
   * @returns is comma
   */

  function isComma(token) {
    return token.kind === SyntaxKind.CommaToken;
  }

  exports.isComma = isComma;
  /**
   * Returns true if the given ts.Node is a comment
   * @param node the TypeScript node
   * @returns is comment
   */

  function isComment(node) {
    return node.kind === SyntaxKind.SingleLineCommentTrivia || node.kind === SyntaxKind.MultiLineCommentTrivia;
  }

  exports.isComment = isComment;
  /**
   * Returns true if the given ts.Node is a JSDoc comment
   * @param node the TypeScript node
   * @returns is JSDoc comment
   */

  function isJSDocComment(node) {
    return node.kind === SyntaxKind.JSDocComment;
  }

  exports.isJSDocComment = isJSDocComment;
  /**
   * Returns the binary expression type of the given ts.Token
   * @param operator the operator token
   * @returns the binary expression type
   */

  function getBinaryExpressionType( // can be any operator
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  operator) {
    if (isAssignmentOperator(operator)) {
      return tsEstree$1.AST_NODE_TYPES.AssignmentExpression;
    } else if (isLogicalOperator(operator)) {
      return tsEstree$1.AST_NODE_TYPES.LogicalExpression;
    }

    return tsEstree$1.AST_NODE_TYPES.BinaryExpression;
  }

  exports.getBinaryExpressionType = getBinaryExpressionType;
  /**
   * Returns line and column data for the given positions,
   * @param pos position to check
   * @param ast the AST object
   * @returns line and column
   */

  function getLineAndCharacterFor(pos, ast) {
    var loc = ast.getLineAndCharacterOfPosition(pos);
    return {
      line: loc.line + 1,
      column: loc.character
    };
  }

  exports.getLineAndCharacterFor = getLineAndCharacterFor;
  /**
   * Returns line and column data for the given start and end positions,
   * for the given AST
   * @param start start data
   * @param end   end data
   * @param ast   the AST object
   * @returns the loc data
   */

  function getLocFor(start, end, ast) {
    return {
      start: getLineAndCharacterFor(start, ast),
      end: getLineAndCharacterFor(end, ast)
    };
  }

  exports.getLocFor = getLocFor;
  /**
   * Check whatever node can contain directive
   * @param node
   * @returns returns true if node can contain directive
   */

  function canContainDirective(node) {
    if (node.kind === ts.SyntaxKind.Block) {
      switch (node.parent.kind) {
        case ts.SyntaxKind.Constructor:
        case ts.SyntaxKind.GetAccessor:
        case ts.SyntaxKind.SetAccessor:
        case ts.SyntaxKind.ArrowFunction:
        case ts.SyntaxKind.FunctionExpression:
        case ts.SyntaxKind.FunctionDeclaration:
        case ts.SyntaxKind.MethodDeclaration:
          return true;

        default:
          return false;
      }
    }

    return true;
  }

  exports.canContainDirective = canContainDirective;
  /**
   * Returns range for the given ts.Node
   * @param node the ts.Node or ts.Token
   * @param ast the AST object
   * @returns the range data
   */

  function getRange(node, ast) {
    return [node.getStart(ast), node.getEnd()];
  }

  exports.getRange = getRange;
  /**
   * Returns true if a given ts.Node is a token
   * @param node the ts.Node
   * @returns is a token
   */

  function isToken(node) {
    return node.kind >= SyntaxKind.FirstToken && node.kind <= SyntaxKind.LastToken;
  }

  exports.isToken = isToken;
  /**
   * Returns true if a given ts.Node is a JSX token
   * @param node ts.Node to be checked
   * @returns is a JSX token
   */

  function isJSXToken(node) {
    return node.kind >= SyntaxKind.JsxElement && node.kind <= SyntaxKind.JsxAttribute;
  }

  exports.isJSXToken = isJSXToken;
  /**
   * Returns the declaration kind of the given ts.Node
   * @param node TypeScript AST node
   * @returns declaration kind
   */

  function getDeclarationKind(node) {
    if (node.flags & ts.NodeFlags.Let) {
      return 'let';
    }

    if (node.flags & ts.NodeFlags.Const) {
      return 'const';
    }

    return 'var';
  }

  exports.getDeclarationKind = getDeclarationKind;
  /**
   * Gets a ts.Node's accessibility level
   * @param node The ts.Node
   * @returns accessibility "public", "protected", "private", or null
   */

  function getTSNodeAccessibility(node) {
    var modifiers = node.modifiers;

    if (!modifiers) {
      return null;
    }

    for (var i = 0; i < modifiers.length; i++) {
      var modifier = modifiers[i];

      switch (modifier.kind) {
        case SyntaxKind.PublicKeyword:
          return 'public';

        case SyntaxKind.ProtectedKeyword:
          return 'protected';

        case SyntaxKind.PrivateKeyword:
          return 'private';

        default:
          break;
      }
    }

    return null;
  }

  exports.getTSNodeAccessibility = getTSNodeAccessibility;
  /**
   * Finds the next token based on the previous one and its parent
   * Had to copy this from TS instead of using TS's version because theirs doesn't pass the ast to getChildren
   * @param previousToken The previous TSToken
   * @param parent The parent TSNode
   * @param ast The TS AST
   * @returns the next TSToken
   */

  function findNextToken(previousToken, parent, ast) {
    return find(parent);

    function find(n) {
      if (ts.isToken(n) && n.pos === previousToken.end) {
        // this is token that starts at the end of previous token - return it
        return n;
      }

      return firstDefined(n.getChildren(ast), function (child) {
        var shouldDiveInChildNode = // previous token is enclosed somewhere in the child
        child.pos <= previousToken.pos && child.end > previousToken.end || // previous token ends exactly at the beginning of child
        child.pos === previousToken.end;
        return shouldDiveInChildNode && nodeHasTokens(child, ast) ? find(child) : undefined;
      });
    }
  }

  exports.findNextToken = findNextToken;
  /**
   * Find the first matching ancestor based on the given predicate function.
   * @param node The current ts.Node
   * @param predicate The predicate function to apply to each checked ancestor
   * @returns a matching parent ts.Node
   */

  function findFirstMatchingAncestor(node, predicate) {
    while (node) {
      if (predicate(node)) {
        return node;
      }

      node = node.parent;
    }

    return undefined;
  }

  exports.findFirstMatchingAncestor = findFirstMatchingAncestor;
  /**
   * Returns true if a given ts.Node has a JSX token within its hierarchy
   * @param node ts.Node to be checked
   * @returns has JSX ancestor
   */

  function hasJSXAncestor(node) {
    return !!findFirstMatchingAncestor(node, isJSXToken);
  }

  exports.hasJSXAncestor = hasJSXAncestor;
  /**
   * Unescape the text content of string literals, e.g. &amp; -> &
   * @param text The escaped string literal text.
   * @returns The unescaped string literal text.
   */

  function unescapeStringLiteralText(text) {
    return lodash_unescape_1.default(text);
  }

  exports.unescapeStringLiteralText = unescapeStringLiteralText;
  /**
   * Returns true if a given ts.Node is a computed property
   * @param node ts.Node to be checked
   * @returns is Computed Property
   */

  function isComputedProperty(node) {
    return node.kind === SyntaxKind.ComputedPropertyName;
  }

  exports.isComputedProperty = isComputedProperty;
  /**
   * Returns true if a given ts.Node is optional (has QuestionToken)
   * @param node ts.Node to be checked
   * @returns is Optional
   */

  function isOptional(node) {
    return node.questionToken ? node.questionToken.kind === SyntaxKind.QuestionToken : false;
  }

  exports.isOptional = isOptional;
  /**
   * Returns the type of a given ts.Token
   * @param token the ts.Token
   * @returns the token type
   */
  // ts.Node types are ugly
  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  function getTokenType(token) {
    // Need two checks for keywords since some are also identifiers
    if (token.originalKeywordKind) {
      switch (token.originalKeywordKind) {
        case SyntaxKind.NullKeyword:
          return tsEstree$1.AST_TOKEN_TYPES.Null;

        case SyntaxKind.GetKeyword:
        case SyntaxKind.SetKeyword:
        case SyntaxKind.TypeKeyword:
        case SyntaxKind.ModuleKeyword:
        case SyntaxKind.AsyncKeyword:
        case SyntaxKind.IsKeyword:
          return tsEstree$1.AST_TOKEN_TYPES.Identifier;

        default:
          return tsEstree$1.AST_TOKEN_TYPES.Keyword;
      }
    }

    if (token.kind >= SyntaxKind.FirstKeyword && token.kind <= SyntaxKind.LastFutureReservedWord) {
      if (token.kind === SyntaxKind.FalseKeyword || token.kind === SyntaxKind.TrueKeyword) {
        return tsEstree$1.AST_TOKEN_TYPES.Boolean;
      }

      return tsEstree$1.AST_TOKEN_TYPES.Keyword;
    }

    if (token.kind >= SyntaxKind.FirstPunctuation && token.kind <= SyntaxKind.LastBinaryOperator) {
      return tsEstree$1.AST_TOKEN_TYPES.Punctuator;
    }

    if (token.kind >= SyntaxKind.NoSubstitutionTemplateLiteral && token.kind <= SyntaxKind.TemplateTail) {
      return tsEstree$1.AST_TOKEN_TYPES.Template;
    }

    switch (token.kind) {
      case SyntaxKind.NumericLiteral:
        return tsEstree$1.AST_TOKEN_TYPES.Numeric;

      case SyntaxKind.JsxText:
        return tsEstree$1.AST_TOKEN_TYPES.JSXText;

      case SyntaxKind.StringLiteral:
        // A TypeScript-StringLiteral token with a TypeScript-JsxAttribute or TypeScript-JsxElement parent,
        // must actually be an ESTree-JSXText token
        if (token.parent && (token.parent.kind === SyntaxKind.JsxAttribute || token.parent.kind === SyntaxKind.JsxElement)) {
          return tsEstree$1.AST_TOKEN_TYPES.JSXText;
        }

        return tsEstree$1.AST_TOKEN_TYPES.String;

      case SyntaxKind.RegularExpressionLiteral:
        return tsEstree$1.AST_TOKEN_TYPES.RegularExpression;

      case SyntaxKind.Identifier:
      case SyntaxKind.ConstructorKeyword:
      case SyntaxKind.GetKeyword:
      case SyntaxKind.SetKeyword: // falls through

      default:
    } // Some JSX tokens have to be determined based on their parent


    if (token.parent && token.kind === SyntaxKind.Identifier) {
      if (isJSXToken(token.parent)) {
        return tsEstree$1.AST_TOKEN_TYPES.JSXIdentifier;
      }

      if (token.parent.kind === SyntaxKind.PropertyAccessExpression && hasJSXAncestor(token)) {
        return tsEstree$1.AST_TOKEN_TYPES.JSXIdentifier;
      }
    }

    return tsEstree$1.AST_TOKEN_TYPES.Identifier;
  }

  exports.getTokenType = getTokenType;
  /**
   * Extends and formats a given ts.Token, for a given AST
   * @param token the ts.Token
   * @param ast   the AST object
   * @returns the converted Token
   */

  function convertToken(token, ast) {
    var start = token.kind === SyntaxKind.JsxText ? token.getFullStart() : token.getStart(ast);
    var end = token.getEnd();
    var value = ast.text.slice(start, end);
    var newToken = {
      type: getTokenType(token),
      value,
      range: [start, end],
      loc: getLocFor(start, end, ast)
    };

    if (newToken.type === 'RegularExpression') {
      newToken.regex = {
        pattern: value.slice(1, value.lastIndexOf('/')),
        flags: value.slice(value.lastIndexOf('/') + 1)
      };
    }

    return newToken;
  }

  exports.convertToken = convertToken;
  /**
   * Converts all tokens for the given AST
   * @param ast the AST object
   * @returns the converted Tokens
   */

  function convertTokens(ast) {
    var result = [];
    /**
     * @param node the ts.Node
     */

    function walk(node) {
      // TypeScript generates tokens for types in JSDoc blocks. Comment tokens
      // and their children should not be walked or added to the resulting tokens list.
      if (isComment(node) || isJSDocComment(node)) {
        return;
      }

      if (isToken(node) && node.kind !== SyntaxKind.EndOfFileToken) {
        var converted = convertToken(node, ast);

        if (converted) {
          result.push(converted);
        }
      } else {
        node.getChildren(ast).forEach(walk);
      }
    }

    walk(ast);
    return result;
  }

  exports.convertTokens = convertTokens;
  /**
   * Get container token node between range
   * @param ast the AST object
   * @param start The index at which the comment starts.
   * @param end The index at which the comment ends.
   * @returns typescript container token
   * @private
   */

  function getNodeContainer(ast, start, end) {
    var container = null;
    /**
     * @param node the ts.Node
     */

    function walk(node) {
      var nodeStart = node.pos;
      var nodeEnd = node.end;

      if (start >= nodeStart && end <= nodeEnd) {
        if (isToken(node)) {
          container = node;
        } else {
          node.getChildren().forEach(walk);
        }
      }
    }

    walk(ast);
    return container;
  }

  exports.getNodeContainer = getNodeContainer;
  /**
   * @param ast     the AST object
   * @param start      the index at which the error starts
   * @param message the error message
   * @returns converted error object
   */

  function createError(ast, start, message) {
    var loc = ast.getLineAndCharacterOfPosition(start);
    return {
      index: start,
      lineNumber: loc.line + 1,
      column: loc.character,
      message
    };
  }

  exports.createError = createError;
  /**
   * @param n the TSNode
   * @param ast the TS AST
   */

  function nodeHasTokens(n, ast) {
    // If we have a token or node that has a non-zero width, it must have tokens.
    // Note: getWidth() does not take trivia into account.
    return n.kind === SyntaxKind.EndOfFileToken ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
    !!n.jsDoc : n.getWidth(ast) !== 0;
  }

  exports.nodeHasTokens = nodeHasTokens;
  /**
   * Like `forEach`, but suitable for use with numbers and strings (which may be falsy).
   * @template T
   * @template U
   * @param array
   * @param callback
   */

  function firstDefined(array, callback) {
    if (array === undefined) {
      return undefined;
    }

    for (var i = 0; i < array.length; i++) {
      var result = callback(array[i], i);

      if (result !== undefined) {
        return result;
      }
    }

    return undefined;
  }

  exports.firstDefined = firstDefined;
});
unwrapExports(nodeUtils);
var nodeUtils_1 = nodeUtils.isAssignmentOperator;
var nodeUtils_2 = nodeUtils.isLogicalOperator;
var nodeUtils_3 = nodeUtils.getTextForTokenKind;
var nodeUtils_4 = nodeUtils.isESTreeClassMember;
var nodeUtils_5 = nodeUtils.hasModifier;
var nodeUtils_6 = nodeUtils.getLastModifier;
var nodeUtils_7 = nodeUtils.isComma;
var nodeUtils_8 = nodeUtils.isComment;
var nodeUtils_9 = nodeUtils.isJSDocComment;
var nodeUtils_10 = nodeUtils.getBinaryExpressionType;
var nodeUtils_11 = nodeUtils.getLineAndCharacterFor;
var nodeUtils_12 = nodeUtils.getLocFor;
var nodeUtils_13 = nodeUtils.canContainDirective;
var nodeUtils_14 = nodeUtils.getRange;
var nodeUtils_15 = nodeUtils.isToken;
var nodeUtils_16 = nodeUtils.isJSXToken;
var nodeUtils_17 = nodeUtils.getDeclarationKind;
var nodeUtils_18 = nodeUtils.getTSNodeAccessibility;
var nodeUtils_19 = nodeUtils.findNextToken;
var nodeUtils_20 = nodeUtils.findFirstMatchingAncestor;
var nodeUtils_21 = nodeUtils.hasJSXAncestor;
var nodeUtils_22 = nodeUtils.unescapeStringLiteralText;
var nodeUtils_23 = nodeUtils.isComputedProperty;
var nodeUtils_24 = nodeUtils.isOptional;
var nodeUtils_25 = nodeUtils.getTokenType;
var nodeUtils_26 = nodeUtils.convertToken;
var nodeUtils_27 = nodeUtils.convertTokens;
var nodeUtils_28 = nodeUtils.getNodeContainer;
var nodeUtils_29 = nodeUtils.createError;
var nodeUtils_30 = nodeUtils.nodeHasTokens;
var nodeUtils_31 = nodeUtils.firstDefined;

var convert = createCommonjsModule(function (module, exports) {

  var __importStar = commonjsGlobal && commonjsGlobal.__importStar || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) {
      if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    }
    result["default"] = mod;
    return result;
  };

  Object.defineProperty(exports, "__esModule", {
    value: true
  }); // There's lots of funny stuff due to the typing of ts.Node

  /* eslint-disable @typescript-eslint/no-explicit-any */

  var ts = __importStar(typescript); // leave this as * as ts so people using util package don't need syntheticDefaultImports


  var SyntaxKind = ts.SyntaxKind;
  /**
   * Extends and formats a given error object
   * @param error the error object
   * @returns converted error object
   */

  function convertError(error) {
    return nodeUtils.createError(error.file, error.start, error.message || error.messageText);
  }

  exports.convertError = convertError;

  var Converter =
  /*#__PURE__*/
  function () {
    /**
     * Converts a TypeScript node into an ESTree node
     * @param ast the full TypeScript AST
     * @param options additional options for the conversion
     * @returns the converted ESTreeNode
     */
    function Converter(ast, options) {
      _classCallCheck(this, Converter);

      this.esTreeNodeToTSNodeMap = new WeakMap();
      this.tsNodeToESTreeNodeMap = new WeakMap();
      this.allowPattern = false;
      this.inTypeMode = false;
      this.ast = ast;
      this.options = Object.assign({}, options);
    }

    _createClass(Converter, [{
      key: "getASTMaps",
      value: function getASTMaps() {
        return {
          esTreeNodeToTSNodeMap: this.esTreeNodeToTSNodeMap,
          tsNodeToESTreeNodeMap: this.tsNodeToESTreeNodeMap
        };
      }
    }, {
      key: "convertProgram",
      value: function convertProgram() {
        return this.converter(this.ast);
      }
      /**
       * Converts a TypeScript node into an ESTree node.
       * @param node the child ts.Node
       * @param parent parentNode
       * @param inTypeMode flag to determine if we are in typeMode
       * @param allowPattern flag to determine if patterns are allowed
       * @returns the converted ESTree node
       */

    }, {
      key: "converter",
      value: function converter(node, parent, inTypeMode, allowPattern) {
        /**
         * Exit early for null and undefined
         */
        if (!node) {
          return null;
        }

        var typeMode = this.inTypeMode;
        var pattern = this.allowPattern;

        if (inTypeMode !== undefined) {
          this.inTypeMode = inTypeMode;
        }

        if (allowPattern !== undefined) {
          this.allowPattern = allowPattern;
        }

        var result = this.convertNode(node, parent || node.parent);
        this.registerTSNodeInNodeMap(node, result);
        this.inTypeMode = typeMode;
        this.allowPattern = pattern;
        return result;
      }
      /**
       * Fixes the exports of the given ts.Node
       * @param node   the ts.Node
       * @param result result
       * @returns the ESTreeNode with fixed exports
       */

    }, {
      key: "fixExports",
      value: function fixExports(node, result) {
        // check for exports
        if (node.modifiers && node.modifiers[0].kind === SyntaxKind.ExportKeyword) {
          /**
           * Make sure that original node is registered instead of export
           */
          this.registerTSNodeInNodeMap(node, result);
          var exportKeyword = node.modifiers[0];
          var nextModifier = node.modifiers[1];
          var declarationIsDefault = nextModifier && nextModifier.kind === SyntaxKind.DefaultKeyword;
          var varToken = declarationIsDefault ? nodeUtils.findNextToken(nextModifier, this.ast, this.ast) : nodeUtils.findNextToken(exportKeyword, this.ast, this.ast);
          result.range[0] = varToken.getStart(this.ast);
          result.loc = nodeUtils.getLocFor(result.range[0], result.range[1], this.ast);

          if (declarationIsDefault) {
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.ExportDefaultDeclaration,
              declaration: result,
              range: [exportKeyword.getStart(this.ast), result.range[1]]
            });
          } else {
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.ExportNamedDeclaration,
              declaration: result,
              specifiers: [],
              source: null,
              range: [exportKeyword.getStart(this.ast), result.range[1]]
            });
          }
        }

        return result;
      }
      /**
       * Register specific TypeScript node into map with first ESTree node provided
       */

    }, {
      key: "registerTSNodeInNodeMap",
      value: function registerTSNodeInNodeMap(node, result) {
        if (result && this.options.shouldPreserveNodeMaps) {
          if (!this.tsNodeToESTreeNodeMap.has(node)) {
            this.tsNodeToESTreeNodeMap.set(node, result);
          }
        }
      }
      /**
       * Converts a TypeScript node into an ESTree node.
       * @param child the child ts.Node
       * @param parent parentNode
       * @returns the converted ESTree node
       */

    }, {
      key: "convertPattern",
      value: function convertPattern(child, parent) {
        return this.converter(child, parent, this.inTypeMode, true);
      }
      /**
       * Converts a TypeScript node into an ESTree node.
       * @param child the child ts.Node
       * @param parent parentNode
       * @returns the converted ESTree node
       */

    }, {
      key: "convertChild",
      value: function convertChild(child, parent) {
        return this.converter(child, parent, this.inTypeMode, false);
      }
      /**
       * Converts a TypeScript node into an ESTree node.
       * @param child the child ts.Node
       * @param parent parentNode
       * @returns the converted ESTree node
       */

    }, {
      key: "convertType",
      value: function convertType(child, parent) {
        return this.converter(child, parent, true, false);
      }
    }, {
      key: "createNode",
      value: function createNode(node, data) {
        var result = data;

        if (!result.range) {
          result.range = nodeUtils.getRange(node, this.ast);
        }

        if (!result.loc) {
          result.loc = nodeUtils.getLocFor(result.range[0], result.range[1], this.ast);
        }

        if (result && this.options.shouldPreserveNodeMaps) {
          this.esTreeNodeToTSNodeMap.set(result, node);
        }

        return result;
      }
      /**
       * Converts a child into a type annotation. This creates an intermediary
       * TypeAnnotation node to match what Flow does.
       * @param child The TypeScript AST node to convert.
       * @param parent parentNode
       * @returns The type annotation node.
       */

    }, {
      key: "convertTypeAnnotation",
      value: function convertTypeAnnotation(child, parent) {
        // in FunctionType and ConstructorType typeAnnotation has 2 characters `=>` and in other places is just colon
        var offset = parent.kind === SyntaxKind.FunctionType || parent.kind === SyntaxKind.ConstructorType ? 2 : 1;
        var annotationStartCol = child.getFullStart() - offset;
        var loc = nodeUtils.getLocFor(annotationStartCol, child.end, this.ast);
        return {
          type: tsEstree$1.AST_NODE_TYPES.TSTypeAnnotation,
          loc,
          range: [annotationStartCol, child.end],
          typeAnnotation: this.convertType(child)
        };
      }
      /**
       * Coverts body Nodes and add directive field to StringLiterals
       * @param nodes of ts.Node
       * @param parent parentNode
       * @returns Array of body statements
       */

    }, {
      key: "convertBodyExpressions",
      value: function convertBodyExpressions(nodes, parent) {
        var _this = this;

        var allowDirectives = nodeUtils.canContainDirective(parent);
        return nodes.map(function (statement) {
          var child = _this.convertChild(statement);

          if (allowDirectives) {
            if (child && child.expression && ts.isExpressionStatement(statement) && ts.isStringLiteral(statement.expression)) {
              var raw = child.expression.raw;
              child.directive = raw.slice(1, -1);
              return child; // child can be null but it's filtered below
            } else {
              allowDirectives = false;
            }
          }

          return child; // child can be null but it's filtered below
        }) // filter out unknown nodes for now
        .filter(function (statement) {
          return statement;
        });
      }
      /**
       * Converts a ts.Node's typeArguments to TSTypeParameterInstantiation node
       * @param typeArguments ts.Node typeArguments
       * @returns TypeParameterInstantiation node
       */

    }, {
      key: "convertTypeArgumentsToTypeParameters",
      value: function convertTypeArgumentsToTypeParameters(typeArguments) {
        var _this2 = this;

        var greaterThanToken = nodeUtils.findNextToken(typeArguments, this.ast, this.ast);
        return {
          type: tsEstree$1.AST_NODE_TYPES.TSTypeParameterInstantiation,
          range: [typeArguments.pos - 1, greaterThanToken.end],
          loc: nodeUtils.getLocFor(typeArguments.pos - 1, greaterThanToken.end, this.ast),
          params: typeArguments.map(function (typeArgument) {
            return _this2.convertType(typeArgument);
          })
        };
      }
      /**
       * Converts a ts.Node's typeParameters to TSTypeParameterDeclaration node
       * @param typeParameters ts.Node typeParameters
       * @returns TypeParameterDeclaration node
       */

    }, {
      key: "convertTSTypeParametersToTypeParametersDeclaration",
      value: function convertTSTypeParametersToTypeParametersDeclaration(typeParameters) {
        var _this3 = this;

        var greaterThanToken = nodeUtils.findNextToken(typeParameters, this.ast, this.ast);
        return {
          type: tsEstree$1.AST_NODE_TYPES.TSTypeParameterDeclaration,
          range: [typeParameters.pos - 1, greaterThanToken.end],
          loc: nodeUtils.getLocFor(typeParameters.pos - 1, greaterThanToken.end, this.ast),
          params: typeParameters.map(function (typeParameter) {
            return _this3.convertType(typeParameter);
          })
        };
      }
      /**
       * Converts an array of ts.Node parameters into an array of ESTreeNode params
       * @param parameters An array of ts.Node params to be converted
       * @returns an array of converted ESTreeNode params
       */

    }, {
      key: "convertParameters",
      value: function convertParameters(parameters) {
        var _this4 = this;

        if (!parameters || !parameters.length) {
          return [];
        }

        return parameters.map(function (param) {
          var convertedParam = _this4.convertChild(param);

          if (param.decorators && param.decorators.length) {
            convertedParam.decorators = param.decorators.map(function (el) {
              return _this4.convertChild(el);
            });
          }

          return convertedParam;
        });
      }
      /**
       * For nodes that are copied directly from the TypeScript AST into
       * ESTree mostly as-is. The only difference is the addition of a type
       * property instead of a kind property. Recursively copies all children.
       */

    }, {
      key: "deeplyCopy",
      value: function deeplyCopy(node) {
        var _this5 = this;

        var customType = `TS${SyntaxKind[node.kind]}`;
        /**
         * If the "errorOnUnknownASTType" option is set to true, throw an error,
         * otherwise fallback to just including the unknown type as-is.
         */

        if (this.options.errorOnUnknownASTType && !tsEstree$1.AST_NODE_TYPES[customType]) {
          throw new Error(`Unknown AST_NODE_TYPE: "${customType}"`);
        }

        var result = this.createNode(node, {
          type: customType
        });
        Object.keys(node).filter(function (key) {
          return !/^(?:_children|kind|parent|pos|end|flags|modifierFlagsCache|jsDoc)$/.test(key);
        }).forEach(function (key) {
          if (key === 'type') {
            result.typeAnnotation = node.type ? _this5.convertTypeAnnotation(node.type, node) : null;
          } else if (key === 'typeArguments') {
            result.typeParameters = node.typeArguments ? _this5.convertTypeArgumentsToTypeParameters(node.typeArguments) : null;
          } else if (key === 'typeParameters') {
            result.typeParameters = node.typeParameters ? _this5.convertTSTypeParametersToTypeParametersDeclaration(node.typeParameters) : null;
          } else if (key === 'decorators') {
            if (node.decorators && node.decorators.length) {
              result.decorators = node.decorators.map(function (el) {
                return _this5.convertChild(el);
              });
            }
          } else {
            if (Array.isArray(node[key])) {
              result[key] = node[key].map(function (el) {
                return _this5.convertChild(el);
              });
            } else if (node[key] && typeof node[key] === 'object' && node[key].kind) {
              // need to check node[key].kind to ensure we don't try to convert a symbol
              result[key] = _this5.convertChild(node[key]);
            } else {
              result[key] = node[key];
            }
          }
        });
        return result;
      }
      /**
       * Converts a TypeScript JSX node.tagName into an ESTree node.name
       * @param node the tagName object from a JSX ts.Node
       * @param parent
       * @returns the converted ESTree name object
       */

    }, {
      key: "convertJSXTagName",
      value: function convertJSXTagName(node, parent) {
        var result;

        switch (node.kind) {
          case SyntaxKind.PropertyAccessExpression:
            result = this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.JSXMemberExpression,
              object: this.convertJSXTagName(node.expression, parent),
              property: this.convertJSXTagName(node.name, parent)
            });
            break;

          case SyntaxKind.ThisKeyword:
            result = this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.JSXIdentifier,
              name: 'this'
            });
            break;

          case SyntaxKind.Identifier:
          default:
            result = this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.JSXIdentifier,
              name: node.text
            });
            break;
        }

        this.registerTSNodeInNodeMap(node, result);
        return result;
      }
      /**
       * Applies the given TS modifiers to the given result object.
       * @param result
       * @param modifiers original ts.Nodes from the node.modifiers array
       * @returns the current result object will be mutated
       * @deprecated This method adds not standardized `modifiers` property in nodes
       */

    }, {
      key: "applyModifiersToResult",
      value: function applyModifiersToResult(result, modifiers) {
        var _this6 = this;

        if (!modifiers || !modifiers.length) {
          return;
        }
        /**
         * Some modifiers are explicitly handled by applying them as
         * boolean values on the result node. As well as adding them
         * to the result, we remove them from the array, so that they
         * are not handled twice.
         */


        var handledModifierIndices = {};

        for (var i = 0; i < modifiers.length; i++) {
          var modifier = modifiers[i];

          switch (modifier.kind) {
            /**
             * Ignore ExportKeyword and DefaultKeyword, they are handled
             * via the fixExports utility function
             */
            case SyntaxKind.ExportKeyword:
            case SyntaxKind.DefaultKeyword:
              handledModifierIndices[i] = true;
              break;

            case SyntaxKind.ConstKeyword:
              result.const = true;
              handledModifierIndices[i] = true;
              break;

            case SyntaxKind.DeclareKeyword:
              result.declare = true;
              handledModifierIndices[i] = true;
              break;

            default:
          }
        }
        /**
         * If there are still valid modifiers available which have
         * not been explicitly handled above, we just convert and
         * add the modifiers array to the result node.
         */


        var remainingModifiers = modifiers.filter(function (_, i) {
          return !handledModifierIndices[i];
        });

        if (!remainingModifiers || !remainingModifiers.length) {
          return;
        }

        result.modifiers = remainingModifiers.map(function (el) {
          return _this6.convertChild(el);
        });
      }
      /**
       * Uses the provided range location to adjust the location data of the given Node
       * @param result The node that will have its location data mutated
       * @param childRange The child node range used to expand location
       */

    }, {
      key: "fixParentLocation",
      value: function fixParentLocation(result, childRange) {
        if (childRange[0] < result.range[0]) {
          result.range[0] = childRange[0];
          result.loc.start = nodeUtils.getLineAndCharacterFor(result.range[0], this.ast);
        }

        if (childRange[1] > result.range[1]) {
          result.range[1] = childRange[1];
          result.loc.end = nodeUtils.getLineAndCharacterFor(result.range[1], this.ast);
        }
      }
      /**
       * Converts a TypeScript node into an ESTree node.
       * The core of the conversion logic:
       * Identify and convert each relevant TypeScript SyntaxKind
       * @param node the child ts.Node
       * @param parent parentNode
       * @returns the converted ESTree node
       */

    }, {
      key: "convertNode",
      value: function convertNode(node, parent) {
        var _this7 = this;

        switch (node.kind) {
          case SyntaxKind.SourceFile:
            {
              return this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.Program,
                body: this.convertBodyExpressions(node.statements, node),
                // externalModuleIndicator is internal field in TSC
                sourceType: node.externalModuleIndicator ? 'module' : 'script',
                range: [node.getStart(this.ast), node.endOfFileToken.end]
              });
            }

          case SyntaxKind.Block:
            {
              return this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.BlockStatement,
                body: this.convertBodyExpressions(node.statements, node)
              });
            }

          case SyntaxKind.Identifier:
            {
              return this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.Identifier,
                name: node.text
              });
            }

          case SyntaxKind.WithStatement:
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.WithStatement,
              object: this.convertChild(node.expression),
              body: this.convertChild(node.statement)
            });
          // Control Flow

          case SyntaxKind.ReturnStatement:
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.ReturnStatement,
              argument: this.convertChild(node.expression)
            });

          case SyntaxKind.LabeledStatement:
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.LabeledStatement,
              label: this.convertChild(node.label),
              body: this.convertChild(node.statement)
            });

          case SyntaxKind.ContinueStatement:
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.ContinueStatement,
              label: this.convertChild(node.label)
            });

          case SyntaxKind.BreakStatement:
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.BreakStatement,
              label: this.convertChild(node.label)
            });
          // Choice

          case SyntaxKind.IfStatement:
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.IfStatement,
              test: this.convertChild(node.expression),
              consequent: this.convertChild(node.thenStatement),
              alternate: this.convertChild(node.elseStatement)
            });

          case SyntaxKind.SwitchStatement:
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.SwitchStatement,
              discriminant: this.convertChild(node.expression),
              cases: node.caseBlock.clauses.map(function (el) {
                return _this7.convertChild(el);
              })
            });

          case SyntaxKind.CaseClause:
          case SyntaxKind.DefaultClause:
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.SwitchCase,
              // expression is present in case only
              test: node.kind === SyntaxKind.CaseClause ? this.convertChild(node.expression) : null,
              consequent: node.statements.map(function (el) {
                return _this7.convertChild(el);
              })
            });
          // Exceptions

          case SyntaxKind.ThrowStatement:
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.ThrowStatement,
              argument: this.convertChild(node.expression)
            });

          case SyntaxKind.TryStatement:
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.TryStatement,
              block: this.convertChild(node.tryBlock),
              handler: this.convertChild(node.catchClause),
              finalizer: this.convertChild(node.finallyBlock)
            });

          case SyntaxKind.CatchClause:
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.CatchClause,
              param: node.variableDeclaration ? this.convertChild(node.variableDeclaration.name) : null,
              body: this.convertChild(node.block)
            });
          // Loops

          case SyntaxKind.WhileStatement:
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.WhileStatement,
              test: this.convertChild(node.expression),
              body: this.convertChild(node.statement)
            });

          /**
           * Unlike other parsers, TypeScript calls a "DoWhileStatement"
           * a "DoStatement"
           */

          case SyntaxKind.DoStatement:
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.DoWhileStatement,
              test: this.convertChild(node.expression),
              body: this.convertChild(node.statement)
            });

          case SyntaxKind.ForStatement:
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.ForStatement,
              init: this.convertChild(node.initializer),
              test: this.convertChild(node.condition),
              update: this.convertChild(node.incrementor),
              body: this.convertChild(node.statement)
            });

          case SyntaxKind.ForInStatement:
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.ForInStatement,
              left: this.convertPattern(node.initializer),
              right: this.convertChild(node.expression),
              body: this.convertChild(node.statement)
            });

          case SyntaxKind.ForOfStatement:
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.ForOfStatement,
              left: this.convertPattern(node.initializer),
              right: this.convertChild(node.expression),
              body: this.convertChild(node.statement),
              await: Boolean(node.awaitModifier && node.awaitModifier.kind === SyntaxKind.AwaitKeyword)
            });
          // Declarations

          case SyntaxKind.FunctionDeclaration:
            {
              var isDeclare = nodeUtils.hasModifier(SyntaxKind.DeclareKeyword, node);
              var result = this.createNode(node, {
                type: isDeclare || !node.body ? tsEstree$1.AST_NODE_TYPES.TSDeclareFunction : tsEstree$1.AST_NODE_TYPES.FunctionDeclaration,
                id: this.convertChild(node.name),
                generator: !!node.asteriskToken,
                expression: false,
                async: nodeUtils.hasModifier(SyntaxKind.AsyncKeyword, node),
                params: this.convertParameters(node.parameters),
                body: this.convertChild(node.body) || undefined
              }); // Process returnType

              if (node.type) {
                result.returnType = this.convertTypeAnnotation(node.type, node);
              }

              if (isDeclare) {
                result.declare = true;
              } // Process typeParameters


              if (node.typeParameters) {
                result.typeParameters = this.convertTSTypeParametersToTypeParametersDeclaration(node.typeParameters);
              }
              /**
               * Semantically, decorators are not allowed on function declarations,
               * but the TypeScript compiler will parse them and produce a valid AST,
               * so we handle them here too.
               */


              if (node.decorators) {
                result.decorators = node.decorators.map(function (el) {
                  return _this7.convertChild(el);
                });
              } // check for exports


              return this.fixExports(node, result);
            }

          case SyntaxKind.VariableDeclaration:
            {
              var _result = this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.VariableDeclarator,
                id: this.convertPattern(node.name),
                init: this.convertChild(node.initializer)
              });

              if (node.exclamationToken) {
                _result.definite = true;
              }

              if (node.type) {
                _result.id.typeAnnotation = this.convertTypeAnnotation(node.type, node);
                this.fixParentLocation(_result.id, _result.id.typeAnnotation.range);
              }

              return _result;
            }

          case SyntaxKind.VariableStatement:
            {
              var _result2 = this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.VariableDeclaration,
                declarations: node.declarationList.declarations.map(function (el) {
                  return _this7.convertChild(el);
                }),
                kind: nodeUtils.getDeclarationKind(node.declarationList)
              });
              /**
               * Semantically, decorators are not allowed on variable declarations,
               * but the TypeScript compiler will parse them and produce a valid AST,
               * so we handle them here too.
               */


              if (node.decorators) {
                _result2.decorators = node.decorators.map(function (el) {
                  return _this7.convertChild(el);
                });
              }

              if (nodeUtils.hasModifier(SyntaxKind.DeclareKeyword, node)) {
                _result2.declare = true;
              } // check for exports


              return this.fixExports(node, _result2);
            }
          // mostly for for-of, for-in

          case SyntaxKind.VariableDeclarationList:
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.VariableDeclaration,
              declarations: node.declarations.map(function (el) {
                return _this7.convertChild(el);
              }),
              kind: nodeUtils.getDeclarationKind(node)
            });
          // Expressions

          case SyntaxKind.ExpressionStatement:
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.ExpressionStatement,
              expression: this.convertChild(node.expression)
            });

          case SyntaxKind.ThisKeyword:
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.ThisExpression
            });

          case SyntaxKind.ArrayLiteralExpression:
            {
              // TypeScript uses ArrayLiteralExpression in destructuring assignment, too
              if (this.allowPattern) {
                return this.createNode(node, {
                  type: tsEstree$1.AST_NODE_TYPES.ArrayPattern,
                  elements: node.elements.map(function (el) {
                    return _this7.convertPattern(el);
                  })
                });
              } else {
                return this.createNode(node, {
                  type: tsEstree$1.AST_NODE_TYPES.ArrayExpression,
                  elements: node.elements.map(function (el) {
                    return _this7.convertChild(el);
                  })
                });
              }
            }

          case SyntaxKind.ObjectLiteralExpression:
            {
              // TypeScript uses ObjectLiteralExpression in destructuring assignment, too
              if (this.allowPattern) {
                return this.createNode(node, {
                  type: tsEstree$1.AST_NODE_TYPES.ObjectPattern,
                  properties: node.properties.map(function (el) {
                    return _this7.convertPattern(el);
                  })
                });
              } else {
                return this.createNode(node, {
                  type: tsEstree$1.AST_NODE_TYPES.ObjectExpression,
                  properties: node.properties.map(function (el) {
                    return _this7.convertChild(el);
                  })
                });
              }
            }

          case SyntaxKind.PropertyAssignment:
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.Property,
              key: this.convertChild(node.name),
              value: this.converter(node.initializer, node, this.inTypeMode, this.allowPattern),
              computed: nodeUtils.isComputedProperty(node.name),
              method: false,
              shorthand: false,
              kind: 'init'
            });

          case SyntaxKind.ShorthandPropertyAssignment:
            {
              if (node.objectAssignmentInitializer) {
                return this.createNode(node, {
                  type: tsEstree$1.AST_NODE_TYPES.Property,
                  key: this.convertChild(node.name),
                  value: this.createNode(node, {
                    type: tsEstree$1.AST_NODE_TYPES.AssignmentPattern,
                    left: this.convertPattern(node.name),
                    right: this.convertChild(node.objectAssignmentInitializer)
                  }),
                  computed: false,
                  method: false,
                  shorthand: true,
                  kind: 'init'
                });
              } else {
                return this.createNode(node, {
                  type: tsEstree$1.AST_NODE_TYPES.Property,
                  key: this.convertChild(node.name),
                  value: this.convertChild(node.name),
                  computed: false,
                  method: false,
                  shorthand: true,
                  kind: 'init'
                });
              }
            }

          case SyntaxKind.ComputedPropertyName:
            return this.convertChild(node.expression);

          case SyntaxKind.PropertyDeclaration:
            {
              var isAbstract = nodeUtils.hasModifier(SyntaxKind.AbstractKeyword, node);

              var _result3 = this.createNode(node, {
                type: isAbstract ? tsEstree$1.AST_NODE_TYPES.TSAbstractClassProperty : tsEstree$1.AST_NODE_TYPES.ClassProperty,
                key: this.convertChild(node.name),
                value: this.convertChild(node.initializer),
                computed: nodeUtils.isComputedProperty(node.name),
                static: nodeUtils.hasModifier(SyntaxKind.StaticKeyword, node),
                readonly: nodeUtils.hasModifier(SyntaxKind.ReadonlyKeyword, node) || undefined
              });

              if (node.type) {
                _result3.typeAnnotation = this.convertTypeAnnotation(node.type, node);
              }

              if (node.decorators) {
                _result3.decorators = node.decorators.map(function (el) {
                  return _this7.convertChild(el);
                });
              }

              var accessibility = nodeUtils.getTSNodeAccessibility(node);

              if (accessibility) {
                _result3.accessibility = accessibility;
              }

              if ((node.name.kind === SyntaxKind.Identifier || node.name.kind === SyntaxKind.ComputedPropertyName) && node.questionToken) {
                _result3.optional = true;
              }

              if (node.exclamationToken) {
                _result3.definite = true;
              }

              if (_result3.key.type === tsEstree$1.AST_NODE_TYPES.Literal && node.questionToken) {
                _result3.optional = true;
              }

              return _result3;
            }

          case SyntaxKind.GetAccessor:
          case SyntaxKind.SetAccessor:
          case SyntaxKind.MethodDeclaration:
            {
              var method = this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.FunctionExpression,
                id: null,
                generator: !!node.asteriskToken,
                expression: false,
                async: nodeUtils.hasModifier(SyntaxKind.AsyncKeyword, node),
                body: this.convertChild(node.body),
                range: [node.parameters.pos - 1, node.end],
                params: []
              });

              if (node.type) {
                method.returnType = this.convertTypeAnnotation(node.type, node);
              } // Process typeParameters


              if (node.typeParameters) {
                method.typeParameters = this.convertTSTypeParametersToTypeParametersDeclaration(node.typeParameters);
                this.fixParentLocation(method, method.typeParameters.range);
              }

              var _result4;

              if (parent.kind === SyntaxKind.ObjectLiteralExpression) {
                method.params = node.parameters.map(function (el) {
                  return _this7.convertChild(el);
                });
                _result4 = this.createNode(node, {
                  type: tsEstree$1.AST_NODE_TYPES.Property,
                  key: this.convertChild(node.name),
                  value: method,
                  computed: nodeUtils.isComputedProperty(node.name),
                  method: node.kind === SyntaxKind.MethodDeclaration,
                  shorthand: false,
                  kind: 'init'
                });
              } else {
                // class

                /**
                 * Unlike in object literal methods, class method params can have decorators
                 */
                method.params = this.convertParameters(node.parameters);
                /**
                 * TypeScript class methods can be defined as "abstract"
                 */

                var methodDefinitionType = nodeUtils.hasModifier(SyntaxKind.AbstractKeyword, node) ? tsEstree$1.AST_NODE_TYPES.TSAbstractMethodDefinition : tsEstree$1.AST_NODE_TYPES.MethodDefinition;
                _result4 = this.createNode(node, {
                  type: methodDefinitionType,
                  key: this.convertChild(node.name),
                  value: method,
                  computed: nodeUtils.isComputedProperty(node.name),
                  static: nodeUtils.hasModifier(SyntaxKind.StaticKeyword, node),
                  kind: 'method'
                });

                if (node.decorators) {
                  _result4.decorators = node.decorators.map(function (el) {
                    return _this7.convertChild(el);
                  });
                }

                var _accessibility = nodeUtils.getTSNodeAccessibility(node);

                if (_accessibility) {
                  _result4.accessibility = _accessibility;
                }
              }

              if (_result4.key.type === tsEstree$1.AST_NODE_TYPES.Identifier && node.questionToken) {
                _result4.key.optional = true;
              }

              if (node.kind === SyntaxKind.GetAccessor) {
                _result4.kind = 'get';
              } else if (node.kind === SyntaxKind.SetAccessor) {
                _result4.kind = 'set';
              } else if (!_result4.static && node.name.kind === SyntaxKind.StringLiteral && node.name.text === 'constructor' && _result4.type !== tsEstree$1.AST_NODE_TYPES.Property) {
                _result4.kind = 'constructor';
              }

              return _result4;
            }
          // TypeScript uses this even for static methods named "constructor"

          case SyntaxKind.Constructor:
            {
              var lastModifier = nodeUtils.getLastModifier(node);
              var constructorToken = lastModifier && nodeUtils.findNextToken(lastModifier, node, this.ast) || node.getFirstToken();

              var _constructor = this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.FunctionExpression,
                id: null,
                params: this.convertParameters(node.parameters),
                generator: false,
                expression: false,
                async: false,
                body: this.convertChild(node.body),
                range: [node.parameters.pos - 1, node.end]
              }); // Process typeParameters


              if (node.typeParameters) {
                _constructor.typeParameters = this.convertTSTypeParametersToTypeParametersDeclaration(node.typeParameters);
                this.fixParentLocation(_constructor, _constructor.typeParameters.range);
              } // Process returnType


              if (node.type) {
                _constructor.returnType = this.convertTypeAnnotation(node.type, node);
              }

              var constructorKey = this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.Identifier,
                name: 'constructor',
                range: [constructorToken.getStart(this.ast), constructorToken.end]
              });
              var isStatic = nodeUtils.hasModifier(SyntaxKind.StaticKeyword, node);

              var _result5 = this.createNode(node, {
                type: nodeUtils.hasModifier(SyntaxKind.AbstractKeyword, node) ? tsEstree$1.AST_NODE_TYPES.TSAbstractMethodDefinition : tsEstree$1.AST_NODE_TYPES.MethodDefinition,
                key: constructorKey,
                value: _constructor,
                computed: false,
                static: isStatic,
                kind: isStatic ? 'method' : 'constructor'
              });

              var _accessibility2 = nodeUtils.getTSNodeAccessibility(node);

              if (_accessibility2) {
                _result5.accessibility = _accessibility2;
              }

              return _result5;
            }

          case SyntaxKind.FunctionExpression:
            {
              var _result6 = this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.FunctionExpression,
                id: this.convertChild(node.name),
                generator: !!node.asteriskToken,
                params: this.convertParameters(node.parameters),
                body: this.convertChild(node.body),
                async: nodeUtils.hasModifier(SyntaxKind.AsyncKeyword, node),
                expression: false
              }); // Process returnType


              if (node.type) {
                _result6.returnType = this.convertTypeAnnotation(node.type, node);
              } // Process typeParameters


              if (node.typeParameters) {
                _result6.typeParameters = this.convertTSTypeParametersToTypeParametersDeclaration(node.typeParameters);
              }

              return _result6;
            }

          case SyntaxKind.SuperKeyword:
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.Super
            });

          case SyntaxKind.ArrayBindingPattern:
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.ArrayPattern,
              elements: node.elements.map(function (el) {
                return _this7.convertPattern(el);
              })
            });
          // occurs with missing array elements like [,]

          case SyntaxKind.OmittedExpression:
            return null;

          case SyntaxKind.ObjectBindingPattern:
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.ObjectPattern,
              properties: node.elements.map(function (el) {
                return _this7.convertPattern(el);
              })
            });

          case SyntaxKind.BindingElement:
            {
              if (parent.kind === SyntaxKind.ArrayBindingPattern) {
                var arrayItem = this.convertChild(node.name, parent);

                if (node.initializer) {
                  return this.createNode(node, {
                    type: tsEstree$1.AST_NODE_TYPES.AssignmentPattern,
                    left: arrayItem,
                    right: this.convertChild(node.initializer)
                  });
                } else if (node.dotDotDotToken) {
                  return this.createNode(node, {
                    type: tsEstree$1.AST_NODE_TYPES.RestElement,
                    argument: arrayItem
                  });
                } else {
                  return arrayItem;
                }
              } else {
                var _result7;

                if (node.dotDotDotToken) {
                  _result7 = this.createNode(node, {
                    type: tsEstree$1.AST_NODE_TYPES.RestElement,
                    argument: this.convertChild(node.propertyName || node.name)
                  });
                } else {
                  _result7 = this.createNode(node, {
                    type: tsEstree$1.AST_NODE_TYPES.Property,
                    key: this.convertChild(node.propertyName || node.name),
                    value: this.convertChild(node.name),
                    computed: Boolean(node.propertyName && node.propertyName.kind === SyntaxKind.ComputedPropertyName),
                    method: false,
                    shorthand: !node.propertyName,
                    kind: 'init'
                  });
                }

                if (node.initializer) {
                  _result7.value = this.createNode(node, {
                    type: tsEstree$1.AST_NODE_TYPES.AssignmentPattern,
                    left: this.convertChild(node.name),
                    right: this.convertChild(node.initializer),
                    range: [node.name.getStart(this.ast), node.initializer.end]
                  });
                }

                return _result7;
              }
            }

          case SyntaxKind.ArrowFunction:
            {
              var _result8 = this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.ArrowFunctionExpression,
                generator: false,
                id: null,
                params: this.convertParameters(node.parameters),
                body: this.convertChild(node.body),
                async: nodeUtils.hasModifier(SyntaxKind.AsyncKeyword, node),
                expression: node.body.kind !== SyntaxKind.Block
              }); // Process returnType


              if (node.type) {
                _result8.returnType = this.convertTypeAnnotation(node.type, node);
              } // Process typeParameters


              if (node.typeParameters) {
                _result8.typeParameters = this.convertTSTypeParametersToTypeParametersDeclaration(node.typeParameters);
              }

              return _result8;
            }

          case SyntaxKind.YieldExpression:
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.YieldExpression,
              delegate: !!node.asteriskToken,
              argument: this.convertChild(node.expression)
            });

          case SyntaxKind.AwaitExpression:
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.AwaitExpression,
              argument: this.convertChild(node.expression)
            });
          // Template Literals

          case SyntaxKind.NoSubstitutionTemplateLiteral:
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.TemplateLiteral,
              quasis: [this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.TemplateElement,
                value: {
                  raw: this.ast.text.slice(node.getStart(this.ast) + 1, node.end - 1),
                  cooked: node.text
                },
                tail: true
              })],
              expressions: []
            });

          case SyntaxKind.TemplateExpression:
            {
              var _result9 = this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.TemplateLiteral,
                quasis: [this.convertChild(node.head)],
                expressions: []
              });

              node.templateSpans.forEach(function (templateSpan) {
                _result9.expressions.push(_this7.convertChild(templateSpan.expression));

                _result9.quasis.push(_this7.convertChild(templateSpan.literal));
              });
              return _result9;
            }

          case SyntaxKind.TaggedTemplateExpression:
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.TaggedTemplateExpression,
              typeParameters: node.typeArguments ? this.convertTypeArgumentsToTypeParameters(node.typeArguments) : undefined,
              tag: this.convertChild(node.tag),
              quasi: this.convertChild(node.template)
            });

          case SyntaxKind.TemplateHead:
          case SyntaxKind.TemplateMiddle:
          case SyntaxKind.TemplateTail:
            {
              var tail = node.kind === SyntaxKind.TemplateTail;
              return this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.TemplateElement,
                value: {
                  raw: this.ast.text.slice(node.getStart(this.ast) + 1, node.end - (tail ? 1 : 2)),
                  cooked: node.text
                },
                tail
              });
            }
          // Patterns

          case SyntaxKind.SpreadAssignment:
          case SyntaxKind.SpreadElement:
            {
              if (this.allowPattern) {
                return this.createNode(node, {
                  type: tsEstree$1.AST_NODE_TYPES.RestElement,
                  argument: this.convertPattern(node.expression)
                });
              } else {
                return this.createNode(node, {
                  type: tsEstree$1.AST_NODE_TYPES.SpreadElement,
                  argument: this.convertChild(node.expression)
                });
              }
            }

          case SyntaxKind.Parameter:
            {
              var parameter;

              var _result10;

              if (node.dotDotDotToken) {
                parameter = _result10 = this.createNode(node, {
                  type: tsEstree$1.AST_NODE_TYPES.RestElement,
                  argument: this.convertChild(node.name)
                });
              } else if (node.initializer) {
                parameter = this.convertChild(node.name);
                _result10 = this.createNode(node, {
                  type: tsEstree$1.AST_NODE_TYPES.AssignmentPattern,
                  left: parameter,
                  right: this.convertChild(node.initializer)
                });

                if (node.modifiers) {
                  // AssignmentPattern should not contain modifiers in range
                  _result10.range[0] = parameter.range[0];
                  _result10.loc = nodeUtils.getLocFor(_result10.range[0], _result10.range[1], this.ast);
                }
              } else {
                parameter = _result10 = this.convertChild(node.name, parent);
              }

              if (node.type) {
                parameter.typeAnnotation = this.convertTypeAnnotation(node.type, node);
                this.fixParentLocation(parameter, parameter.typeAnnotation.range);
              }

              if (node.questionToken) {
                if (node.questionToken.end > parameter.range[1]) {
                  parameter.range[1] = node.questionToken.end;
                  parameter.loc.end = nodeUtils.getLineAndCharacterFor(parameter.range[1], this.ast);
                }

                parameter.optional = true;
              }

              if (node.modifiers) {
                return this.createNode(node, {
                  type: tsEstree$1.AST_NODE_TYPES.TSParameterProperty,
                  accessibility: nodeUtils.getTSNodeAccessibility(node) || undefined,
                  readonly: nodeUtils.hasModifier(SyntaxKind.ReadonlyKeyword, node) || undefined,
                  static: nodeUtils.hasModifier(SyntaxKind.StaticKeyword, node) || undefined,
                  export: nodeUtils.hasModifier(SyntaxKind.ExportKeyword, node) || undefined,
                  parameter: _result10
                });
              }

              return _result10;
            }
          // Classes

          case SyntaxKind.ClassDeclaration:
          case SyntaxKind.ClassExpression:
            {
              var heritageClauses = node.heritageClauses || [];
              var classNodeType = node.kind === SyntaxKind.ClassDeclaration ? tsEstree$1.AST_NODE_TYPES.ClassDeclaration : tsEstree$1.AST_NODE_TYPES.ClassExpression;
              var superClass = heritageClauses.find(function (clause) {
                return clause.token === SyntaxKind.ExtendsKeyword;
              });
              var implementsClause = heritageClauses.find(function (clause) {
                return clause.token === SyntaxKind.ImplementsKeyword;
              });

              var _result11 = this.createNode(node, {
                type: classNodeType,
                id: this.convertChild(node.name),
                body: this.createNode(node, {
                  type: tsEstree$1.AST_NODE_TYPES.ClassBody,
                  body: [],
                  range: [node.members.pos - 1, node.end]
                }),
                superClass: superClass && superClass.types[0] ? this.convertChild(superClass.types[0].expression) : null
              });

              if (superClass) {
                if (superClass.types.length > 1) {
                  throw nodeUtils.createError(this.ast, superClass.types[1].pos, 'Classes can only extend a single class.');
                }

                if (superClass.types[0] && superClass.types[0].typeArguments) {
                  _result11.superTypeParameters = this.convertTypeArgumentsToTypeParameters(superClass.types[0].typeArguments);
                }
              }

              if (node.typeParameters) {
                _result11.typeParameters = this.convertTSTypeParametersToTypeParametersDeclaration(node.typeParameters);
              }

              if (implementsClause) {
                _result11.implements = implementsClause.types.map(function (el) {
                  return _this7.convertChild(el);
                });
              }
              /**
               * TypeScript class declarations can be defined as "abstract"
               */


              if (nodeUtils.hasModifier(SyntaxKind.AbstractKeyword, node)) {
                _result11.abstract = true;
              }

              if (nodeUtils.hasModifier(SyntaxKind.DeclareKeyword, node)) {
                _result11.declare = true;
              }

              if (node.decorators) {
                _result11.decorators = node.decorators.map(function (el) {
                  return _this7.convertChild(el);
                });
              }

              var filteredMembers = node.members.filter(nodeUtils.isESTreeClassMember);

              if (filteredMembers.length) {
                _result11.body.body = filteredMembers.map(function (el) {
                  return _this7.convertChild(el);
                });
              } // check for exports


              return this.fixExports(node, _result11);
            }
          // Modules

          case SyntaxKind.ModuleBlock:
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.TSModuleBlock,
              body: this.convertBodyExpressions(node.statements, node)
            });

          case SyntaxKind.ImportDeclaration:
            {
              var _result12 = this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.ImportDeclaration,
                source: this.convertChild(node.moduleSpecifier),
                specifiers: []
              });

              if (node.importClause) {
                if (node.importClause.name) {
                  _result12.specifiers.push(this.convertChild(node.importClause));
                }

                if (node.importClause.namedBindings) {
                  switch (node.importClause.namedBindings.kind) {
                    case SyntaxKind.NamespaceImport:
                      _result12.specifiers.push(this.convertChild(node.importClause.namedBindings));

                      break;

                    case SyntaxKind.NamedImports:
                      _result12.specifiers = _result12.specifiers.concat(node.importClause.namedBindings.elements.map(function (el) {
                        return _this7.convertChild(el);
                      }));
                      break;
                  }
                }
              }

              return _result12;
            }

          case SyntaxKind.NamespaceImport:
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.ImportNamespaceSpecifier,
              local: this.convertChild(node.name)
            });

          case SyntaxKind.ImportSpecifier:
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.ImportSpecifier,
              local: this.convertChild(node.name),
              imported: this.convertChild(node.propertyName || node.name)
            });

          case SyntaxKind.ImportClause:
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.ImportDefaultSpecifier,
              local: this.convertChild(node.name),
              range: [node.getStart(this.ast), node.name.end]
            });

          case SyntaxKind.ExportDeclaration:
            if (node.exportClause) {
              return this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.ExportNamedDeclaration,
                source: this.convertChild(node.moduleSpecifier),
                specifiers: node.exportClause.elements.map(function (el) {
                  return _this7.convertChild(el);
                }),
                declaration: null
              });
            } else {
              return this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.ExportAllDeclaration,
                source: this.convertChild(node.moduleSpecifier)
              });
            }

          case SyntaxKind.ExportSpecifier:
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.ExportSpecifier,
              local: this.convertChild(node.propertyName || node.name),
              exported: this.convertChild(node.name)
            });

          case SyntaxKind.ExportAssignment:
            if (node.isExportEquals) {
              return this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.TSExportAssignment,
                expression: this.convertChild(node.expression)
              });
            } else {
              return this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.ExportDefaultDeclaration,
                declaration: this.convertChild(node.expression)
              });
            }

          // Unary Operations

          case SyntaxKind.PrefixUnaryExpression:
          case SyntaxKind.PostfixUnaryExpression:
            {
              var operator = nodeUtils.getTextForTokenKind(node.operator) || '';
              /**
               * ESTree uses UpdateExpression for ++/--
               */

              if (/^(?:\+\+|--)$/.test(operator)) {
                return this.createNode(node, {
                  type: tsEstree$1.AST_NODE_TYPES.UpdateExpression,
                  operator,
                  prefix: node.kind === SyntaxKind.PrefixUnaryExpression,
                  argument: this.convertChild(node.operand)
                });
              } else {
                return this.createNode(node, {
                  type: tsEstree$1.AST_NODE_TYPES.UnaryExpression,
                  operator,
                  prefix: node.kind === SyntaxKind.PrefixUnaryExpression,
                  argument: this.convertChild(node.operand)
                });
              }
            }

          case SyntaxKind.DeleteExpression:
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.UnaryExpression,
              operator: 'delete',
              prefix: true,
              argument: this.convertChild(node.expression)
            });

          case SyntaxKind.VoidExpression:
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.UnaryExpression,
              operator: 'void',
              prefix: true,
              argument: this.convertChild(node.expression)
            });

          case SyntaxKind.TypeOfExpression:
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.UnaryExpression,
              operator: 'typeof',
              prefix: true,
              argument: this.convertChild(node.expression)
            });

          case SyntaxKind.TypeOperator:
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.TSTypeOperator,
              operator: nodeUtils.getTextForTokenKind(node.operator),
              typeAnnotation: this.convertChild(node.type)
            });
          // Binary Operations

          case SyntaxKind.BinaryExpression:
            {
              // TypeScript uses BinaryExpression for sequences as well
              if (nodeUtils.isComma(node.operatorToken)) {
                var _result13 = this.createNode(node, {
                  type: tsEstree$1.AST_NODE_TYPES.SequenceExpression,
                  expressions: []
                });

                var left = this.convertChild(node.left);

                if (left.type === tsEstree$1.AST_NODE_TYPES.SequenceExpression && node.left.kind !== SyntaxKind.ParenthesizedExpression) {
                  _result13.expressions = _result13.expressions.concat(left.expressions);
                } else {
                  _result13.expressions.push(left);
                }

                _result13.expressions.push(this.convertChild(node.right));

                return _result13;
              } else {
                var type = nodeUtils.getBinaryExpressionType(node.operatorToken);

                if (this.allowPattern && type === tsEstree$1.AST_NODE_TYPES.AssignmentExpression) {
                  return this.createNode(node, {
                    type: tsEstree$1.AST_NODE_TYPES.AssignmentPattern,
                    left: this.convertPattern(node.left, node),
                    right: this.convertChild(node.right)
                  });
                }

                return this.createNode(node, {
                  type: type,
                  operator: nodeUtils.getTextForTokenKind(node.operatorToken.kind),
                  left: this.converter(node.left, node, this.inTypeMode, type === tsEstree$1.AST_NODE_TYPES.AssignmentExpression),
                  right: this.convertChild(node.right)
                });
              }
            }

          case SyntaxKind.PropertyAccessExpression:
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.MemberExpression,
              object: this.convertChild(node.expression),
              property: this.convertChild(node.name),
              computed: false
            });

          case SyntaxKind.ElementAccessExpression:
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.MemberExpression,
              object: this.convertChild(node.expression),
              property: this.convertChild(node.argumentExpression),
              computed: true
            });

          case SyntaxKind.ConditionalExpression:
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.ConditionalExpression,
              test: this.convertChild(node.condition),
              consequent: this.convertChild(node.whenTrue),
              alternate: this.convertChild(node.whenFalse)
            });

          case SyntaxKind.CallExpression:
            {
              var _result14 = this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.CallExpression,
                callee: this.convertChild(node.expression),
                arguments: node.arguments.map(function (el) {
                  return _this7.convertChild(el);
                })
              });

              if (node.typeArguments) {
                _result14.typeParameters = this.convertTypeArgumentsToTypeParameters(node.typeArguments);
              }

              return _result14;
            }

          case SyntaxKind.NewExpression:
            {
              var _result15 = this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.NewExpression,
                callee: this.convertChild(node.expression),
                arguments: node.arguments ? node.arguments.map(function (el) {
                  return _this7.convertChild(el);
                }) : []
              });

              if (node.typeArguments) {
                _result15.typeParameters = this.convertTypeArgumentsToTypeParameters(node.typeArguments);
              }

              return _result15;
            }

          case SyntaxKind.MetaProperty:
            {
              return this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.MetaProperty,
                meta: this.createNode(node.getFirstToken(), {
                  type: tsEstree$1.AST_NODE_TYPES.Identifier,
                  name: nodeUtils.getTextForTokenKind(node.keywordToken)
                }),
                property: this.convertChild(node.name)
              });
            }

          case SyntaxKind.Decorator:
            {
              return this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.Decorator,
                expression: this.convertChild(node.expression)
              });
            }
          // Literals

          case SyntaxKind.StringLiteral:
            {
              var _result16 = this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.Literal,
                raw: '',
                value: ''
              });

              _result16.raw = this.ast.text.slice(_result16.range[0], _result16.range[1]);

              if (parent.name && parent.name === node) {
                _result16.value = node.text;
              } else {
                _result16.value = nodeUtils.unescapeStringLiteralText(node.text);
              }

              return _result16;
            }

          case SyntaxKind.NumericLiteral:
            {
              return this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.Literal,
                value: Number(node.text),
                raw: node.getText()
              });
            }

          case SyntaxKind.BigIntLiteral:
            {
              var _result17 = this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.BigIntLiteral,
                raw: '',
                value: ''
              });

              _result17.raw = this.ast.text.slice(_result17.range[0], _result17.range[1]);
              _result17.value = _result17.raw.slice(0, -1); // remove suffix `n`

              return _result17;
            }

          case SyntaxKind.RegularExpressionLiteral:
            {
              var pattern = node.text.slice(1, node.text.lastIndexOf('/'));
              var flags = node.text.slice(node.text.lastIndexOf('/') + 1);
              var regex = null;

              try {
                regex = new RegExp(pattern, flags);
              } catch (exception) {
                regex = null;
              }

              return this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.Literal,
                value: regex,
                raw: node.text,
                regex: {
                  pattern,
                  flags
                }
              });
            }

          case SyntaxKind.TrueKeyword:
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.Literal,
              value: true,
              raw: 'true'
            });

          case SyntaxKind.FalseKeyword:
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.Literal,
              value: false,
              raw: 'false'
            });

          case SyntaxKind.NullKeyword:
            {
              if (this.inTypeMode) {
                return this.createNode(node, {
                  type: tsEstree$1.AST_NODE_TYPES.TSNullKeyword
                });
              } else {
                return this.createNode(node, {
                  type: tsEstree$1.AST_NODE_TYPES.Literal,
                  value: null,
                  raw: 'null'
                });
              }
            }

          case SyntaxKind.ImportKeyword:
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.Import
            });

          case SyntaxKind.EmptyStatement:
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.EmptyStatement
            });

          case SyntaxKind.DebuggerStatement:
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.DebuggerStatement
            });
          // JSX

          case SyntaxKind.JsxElement:
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.JSXElement,
              openingElement: this.convertChild(node.openingElement),
              closingElement: this.convertChild(node.closingElement),
              children: node.children.map(function (el) {
                return _this7.convertChild(el);
              })
            });

          case SyntaxKind.JsxFragment:
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.JSXFragment,
              openingFragment: this.convertChild(node.openingFragment),
              closingFragment: this.convertChild(node.closingFragment),
              children: node.children.map(function (el) {
                return _this7.convertChild(el);
              })
            });

          case SyntaxKind.JsxSelfClosingElement:
            {
              return this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.JSXElement,

                /**
                 * Convert SyntaxKind.JsxSelfClosingElement to SyntaxKind.JsxOpeningElement,
                 * TypeScript does not seem to have the idea of openingElement when tag is self-closing
                 */
                openingElement: this.createNode(node, {
                  type: tsEstree$1.AST_NODE_TYPES.JSXOpeningElement,
                  typeParameters: node.typeArguments ? this.convertTypeArgumentsToTypeParameters(node.typeArguments) : undefined,
                  selfClosing: true,
                  name: this.convertJSXTagName(node.tagName, node),
                  attributes: node.attributes.properties.map(function (el) {
                    return _this7.convertChild(el);
                  }),
                  range: nodeUtils.getRange(node, this.ast)
                }),
                closingElement: null,
                children: []
              });
            }

          case SyntaxKind.JsxOpeningElement:
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.JSXOpeningElement,
              typeParameters: node.typeArguments ? this.convertTypeArgumentsToTypeParameters(node.typeArguments) : undefined,
              selfClosing: false,
              name: this.convertJSXTagName(node.tagName, node),
              attributes: node.attributes.properties.map(function (el) {
                return _this7.convertChild(el);
              })
            });

          case SyntaxKind.JsxClosingElement:
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.JSXClosingElement,
              name: this.convertJSXTagName(node.tagName, node)
            });

          case SyntaxKind.JsxOpeningFragment:
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.JSXOpeningFragment
            });

          case SyntaxKind.JsxClosingFragment:
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.JSXClosingFragment
            });

          case SyntaxKind.JsxExpression:
            {
              var expression = node.expression ? this.convertChild(node.expression) : this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.JSXEmptyExpression,
                range: [node.getStart(this.ast) + 1, node.getEnd() - 1]
              });

              if (node.dotDotDotToken) {
                return this.createNode(node, {
                  type: tsEstree$1.AST_NODE_TYPES.JSXSpreadChild,
                  expression
                });
              } else {
                return this.createNode(node, {
                  type: tsEstree$1.AST_NODE_TYPES.JSXExpressionContainer,
                  expression
                });
              }
            }

          case SyntaxKind.JsxAttribute:
            {
              var attributeName = this.convertChild(node.name);
              attributeName.type = tsEstree$1.AST_NODE_TYPES.JSXIdentifier;
              return this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.JSXAttribute,
                name: attributeName,
                value: this.convertChild(node.initializer)
              });
            }

          /**
           * The JSX AST changed the node type for string literals
           * inside a JSX Element from `Literal` to `JSXText`. We
           * provide a flag to support both types until `Literal`
           * node type is deprecated in ESLint v5.
           */

          case SyntaxKind.JsxText:
            {
              var start = node.getFullStart();
              var end = node.getEnd();

              if (this.options.useJSXTextNode) {
                return this.createNode(node, {
                  type: tsEstree$1.AST_NODE_TYPES.JSXText,
                  value: this.ast.text.slice(start, end),
                  raw: this.ast.text.slice(start, end),
                  range: [start, end]
                });
              } else {
                return this.createNode(node, {
                  type: tsEstree$1.AST_NODE_TYPES.Literal,
                  value: this.ast.text.slice(start, end),
                  raw: this.ast.text.slice(start, end),
                  range: [start, end]
                });
              }
            }

          case SyntaxKind.JsxSpreadAttribute:
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.JSXSpreadAttribute,
              argument: this.convertChild(node.expression)
            });

          case SyntaxKind.QualifiedName:
            {
              return this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.TSQualifiedName,
                left: this.convertChild(node.left),
                right: this.convertChild(node.right)
              });
            }
          // TypeScript specific

          case SyntaxKind.TypeReference:
            {
              return this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.TSTypeReference,
                typeName: this.convertType(node.typeName),
                typeParameters: node.typeArguments ? this.convertTypeArgumentsToTypeParameters(node.typeArguments) : undefined
              });
            }

          case SyntaxKind.TypeParameter:
            {
              return this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.TSTypeParameter,
                name: this.convertType(node.name),
                constraint: node.constraint ? this.convertType(node.constraint) : undefined,
                default: node.default ? this.convertType(node.default) : undefined
              });
            }

          case SyntaxKind.ThisType:
          case SyntaxKind.AnyKeyword:
          case SyntaxKind.BigIntKeyword:
          case SyntaxKind.BooleanKeyword:
          case SyntaxKind.NeverKeyword:
          case SyntaxKind.NumberKeyword:
          case SyntaxKind.ObjectKeyword:
          case SyntaxKind.StringKeyword:
          case SyntaxKind.SymbolKeyword:
          case SyntaxKind.UnknownKeyword:
          case SyntaxKind.VoidKeyword:
          case SyntaxKind.UndefinedKeyword:
            {
              return this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES[`TS${SyntaxKind[node.kind]}`]
              });
            }

          case SyntaxKind.NonNullExpression:
            {
              return this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.TSNonNullExpression,
                expression: this.convertChild(node.expression)
              });
            }

          case SyntaxKind.TypeLiteral:
            {
              return this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.TSTypeLiteral,
                members: node.members.map(function (el) {
                  return _this7.convertChild(el);
                })
              });
            }

          case SyntaxKind.ArrayType:
            {
              return this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.TSArrayType,
                elementType: this.convertType(node.elementType)
              });
            }

          case SyntaxKind.IndexedAccessType:
            {
              return this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.TSIndexedAccessType,
                objectType: this.convertType(node.objectType),
                indexType: this.convertType(node.indexType)
              });
            }

          case SyntaxKind.ConditionalType:
            {
              return this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.TSConditionalType,
                checkType: this.convertType(node.checkType),
                extendsType: this.convertType(node.extendsType),
                trueType: this.convertType(node.trueType),
                falseType: this.convertType(node.falseType)
              });
            }

          case SyntaxKind.TypeQuery:
            {
              return this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.TSTypeQuery,
                exprName: this.convertType(node.exprName)
              });
            }

          case SyntaxKind.MappedType:
            {
              var _result18 = this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.TSMappedType,
                typeParameter: this.convertType(node.typeParameter)
              });

              if (node.readonlyToken) {
                if (node.readonlyToken.kind === SyntaxKind.ReadonlyKeyword) {
                  _result18.readonly = true;
                } else {
                  _result18.readonly = nodeUtils.getTextForTokenKind(node.readonlyToken.kind);
                }
              }

              if (node.questionToken) {
                if (node.questionToken.kind === SyntaxKind.QuestionToken) {
                  _result18.optional = true;
                } else {
                  _result18.optional = nodeUtils.getTextForTokenKind(node.questionToken.kind);
                }
              }

              if (node.type) {
                _result18.typeAnnotation = this.convertType(node.type);
              }

              return _result18;
            }

          case SyntaxKind.ParenthesizedExpression:
            return this.convertChild(node.expression, parent);

          case SyntaxKind.TypeAliasDeclaration:
            {
              var _result19 = this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.TSTypeAliasDeclaration,
                id: this.convertChild(node.name),
                typeAnnotation: this.convertType(node.type)
              });

              if (nodeUtils.hasModifier(SyntaxKind.DeclareKeyword, node)) {
                _result19.declare = true;
              } // Process typeParameters


              if (node.typeParameters) {
                _result19.typeParameters = this.convertTSTypeParametersToTypeParametersDeclaration(node.typeParameters);
              } // check for exports


              return this.fixExports(node, _result19);
            }

          case SyntaxKind.MethodSignature:
            {
              var _result20 = this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.TSMethodSignature,
                computed: nodeUtils.isComputedProperty(node.name),
                key: this.convertChild(node.name),
                params: this.convertParameters(node.parameters)
              });

              if (nodeUtils.isOptional(node)) {
                _result20.optional = true;
              }

              if (node.type) {
                _result20.returnType = this.convertTypeAnnotation(node.type, node);
              }

              if (nodeUtils.hasModifier(SyntaxKind.ReadonlyKeyword, node)) {
                _result20.readonly = true;
              }

              if (node.typeParameters) {
                _result20.typeParameters = this.convertTSTypeParametersToTypeParametersDeclaration(node.typeParameters);
              }

              var _accessibility3 = nodeUtils.getTSNodeAccessibility(node);

              if (_accessibility3) {
                _result20.accessibility = _accessibility3;
              }

              if (nodeUtils.hasModifier(SyntaxKind.ExportKeyword, node)) {
                _result20.export = true;
              }

              if (nodeUtils.hasModifier(SyntaxKind.StaticKeyword, node)) {
                _result20.static = true;
              }

              return _result20;
            }

          case SyntaxKind.PropertySignature:
            {
              var _result21 = this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.TSPropertySignature,
                optional: nodeUtils.isOptional(node) || undefined,
                computed: nodeUtils.isComputedProperty(node.name),
                key: this.convertChild(node.name),
                typeAnnotation: node.type ? this.convertTypeAnnotation(node.type, node) : undefined,
                initializer: this.convertChild(node.initializer) || undefined,
                readonly: nodeUtils.hasModifier(SyntaxKind.ReadonlyKeyword, node) || undefined,
                static: nodeUtils.hasModifier(SyntaxKind.StaticKeyword, node) || undefined,
                export: nodeUtils.hasModifier(SyntaxKind.ExportKeyword, node) || undefined
              });

              var _accessibility4 = nodeUtils.getTSNodeAccessibility(node);

              if (_accessibility4) {
                _result21.accessibility = _accessibility4;
              }

              return _result21;
            }

          case SyntaxKind.IndexSignature:
            {
              var _result22 = this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.TSIndexSignature,
                parameters: node.parameters.map(function (el) {
                  return _this7.convertChild(el);
                })
              });

              if (node.type) {
                _result22.typeAnnotation = this.convertTypeAnnotation(node.type, node);
              }

              if (nodeUtils.hasModifier(SyntaxKind.ReadonlyKeyword, node)) {
                _result22.readonly = true;
              }

              var _accessibility5 = nodeUtils.getTSNodeAccessibility(node);

              if (_accessibility5) {
                _result22.accessibility = _accessibility5;
              }

              if (nodeUtils.hasModifier(SyntaxKind.ExportKeyword, node)) {
                _result22.export = true;
              }

              if (nodeUtils.hasModifier(SyntaxKind.StaticKeyword, node)) {
                _result22.static = true;
              }

              return _result22;
            }

          case SyntaxKind.ConstructorType:
          case SyntaxKind.FunctionType:
          case SyntaxKind.ConstructSignature:
          case SyntaxKind.CallSignature:
            {
              var _type;

              switch (node.kind) {
                case SyntaxKind.ConstructSignature:
                  _type = tsEstree$1.AST_NODE_TYPES.TSConstructSignatureDeclaration;
                  break;

                case SyntaxKind.CallSignature:
                  _type = tsEstree$1.AST_NODE_TYPES.TSCallSignatureDeclaration;
                  break;

                case SyntaxKind.FunctionType:
                  _type = tsEstree$1.AST_NODE_TYPES.TSFunctionType;
                  break;

                case SyntaxKind.ConstructorType:
                default:
                  _type = tsEstree$1.AST_NODE_TYPES.TSConstructorType;
                  break;
              }

              var _result23 = this.createNode(node, {
                type: _type,
                params: this.convertParameters(node.parameters)
              });

              if (node.type) {
                _result23.returnType = this.convertTypeAnnotation(node.type, node);
              }

              if (node.typeParameters) {
                _result23.typeParameters = this.convertTSTypeParametersToTypeParametersDeclaration(node.typeParameters);
              }

              return _result23;
            }

          case SyntaxKind.ExpressionWithTypeArguments:
            {
              var _result24 = this.createNode(node, {
                type: parent && parent.kind === SyntaxKind.InterfaceDeclaration ? tsEstree$1.AST_NODE_TYPES.TSInterfaceHeritage : tsEstree$1.AST_NODE_TYPES.TSClassImplements,
                expression: this.convertChild(node.expression)
              });

              if (node.typeArguments) {
                _result24.typeParameters = this.convertTypeArgumentsToTypeParameters(node.typeArguments);
              }

              return _result24;
            }

          case SyntaxKind.InterfaceDeclaration:
            {
              var interfaceHeritageClauses = node.heritageClauses || [];

              var _result25 = this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.TSInterfaceDeclaration,
                body: this.createNode(node, {
                  type: tsEstree$1.AST_NODE_TYPES.TSInterfaceBody,
                  body: node.members.map(function (member) {
                    return _this7.convertChild(member);
                  }),
                  range: [node.members.pos - 1, node.end]
                }),
                id: this.convertChild(node.name)
              });

              if (node.typeParameters) {
                _result25.typeParameters = this.convertTSTypeParametersToTypeParametersDeclaration(node.typeParameters);
              }

              if (interfaceHeritageClauses.length > 0) {
                var interfaceExtends = [];
                var interfaceImplements = [];
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                  for (var _iterator = interfaceHeritageClauses[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var heritageClause = _step.value;

                    if (heritageClause.token === SyntaxKind.ExtendsKeyword) {
                      var _iteratorNormalCompletion2 = true;
                      var _didIteratorError2 = false;
                      var _iteratorError2 = undefined;

                      try {
                        for (var _iterator2 = heritageClause.types[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                          var n = _step2.value;
                          interfaceExtends.push(this.convertChild(n, node));
                        }
                      } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                      } finally {
                        try {
                          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                            _iterator2.return();
                          }
                        } finally {
                          if (_didIteratorError2) {
                            throw _iteratorError2;
                          }
                        }
                      }
                    } else if (heritageClause.token === SyntaxKind.ImplementsKeyword) {
                      var _iteratorNormalCompletion3 = true;
                      var _didIteratorError3 = false;
                      var _iteratorError3 = undefined;

                      try {
                        for (var _iterator3 = heritageClause.types[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                          var _n = _step3.value;
                          interfaceImplements.push(this.convertChild(_n, node));
                        }
                      } catch (err) {
                        _didIteratorError3 = true;
                        _iteratorError3 = err;
                      } finally {
                        try {
                          if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
                            _iterator3.return();
                          }
                        } finally {
                          if (_didIteratorError3) {
                            throw _iteratorError3;
                          }
                        }
                      }
                    }
                  }
                } catch (err) {
                  _didIteratorError = true;
                  _iteratorError = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                      _iterator.return();
                    }
                  } finally {
                    if (_didIteratorError) {
                      throw _iteratorError;
                    }
                  }
                }

                if (interfaceExtends.length) {
                  _result25.extends = interfaceExtends;
                }

                if (interfaceImplements.length) {
                  _result25.implements = interfaceImplements;
                }
              }
              /**
               * Semantically, decorators are not allowed on interface declarations,
               * but the TypeScript compiler will parse them and produce a valid AST,
               * so we handle them here too.
               */


              if (node.decorators) {
                _result25.decorators = node.decorators.map(function (el) {
                  return _this7.convertChild(el);
                });
              }

              if (nodeUtils.hasModifier(SyntaxKind.AbstractKeyword, node)) {
                _result25.abstract = true;
              }

              if (nodeUtils.hasModifier(SyntaxKind.DeclareKeyword, node)) {
                _result25.declare = true;
              } // check for exports


              return this.fixExports(node, _result25);
            }

          case SyntaxKind.TypePredicate:
            {
              var _result26 = this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.TSTypePredicate,
                parameterName: this.convertChild(node.parameterName),
                typeAnnotation: this.convertTypeAnnotation(node.type, node)
              });
              /**
               * Specific fix for type-guard location data
               */


              _result26.typeAnnotation.loc = _result26.typeAnnotation.typeAnnotation.loc;
              _result26.typeAnnotation.range = _result26.typeAnnotation.typeAnnotation.range;
              return _result26;
            }

          case SyntaxKind.ImportType:
            return this.createNode(node, {
              type: tsEstree$1.AST_NODE_TYPES.TSImportType,
              isTypeOf: !!node.isTypeOf,
              parameter: this.convertChild(node.argument),
              qualifier: this.convertChild(node.qualifier),
              typeParameters: node.typeArguments ? this.convertTypeArgumentsToTypeParameters(node.typeArguments) : null
            });

          case SyntaxKind.EnumDeclaration:
            {
              var _result27 = this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.TSEnumDeclaration,
                id: this.convertChild(node.name),
                members: node.members.map(function (el) {
                  return _this7.convertChild(el);
                })
              }); // apply modifiers first...


              this.applyModifiersToResult(_result27, node.modifiers);
              /**
               * Semantically, decorators are not allowed on enum declarations,
               * but the TypeScript compiler will parse them and produce a valid AST,
               * so we handle them here too.
               */

              if (node.decorators) {
                _result27.decorators = node.decorators.map(function (el) {
                  return _this7.convertChild(el);
                });
              } // ...then check for exports


              return this.fixExports(node, _result27);
            }

          case SyntaxKind.EnumMember:
            {
              var _result28 = this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.TSEnumMember,
                id: this.convertChild(node.name)
              });

              if (node.initializer) {
                _result28.initializer = this.convertChild(node.initializer);
              }

              return _result28;
            }

          case SyntaxKind.ModuleDeclaration:
            {
              var _result29 = this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.TSModuleDeclaration,
                id: this.convertChild(node.name)
              });

              if (node.body) {
                _result29.body = this.convertChild(node.body);
              } // apply modifiers first...


              this.applyModifiersToResult(_result29, node.modifiers);

              if (node.flags & ts.NodeFlags.GlobalAugmentation) {
                _result29.global = true;
              } // ...then check for exports


              return this.fixExports(node, _result29);
            }
          // TypeScript specific types

          case SyntaxKind.OptionalType:
            {
              return this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.TSOptionalType,
                typeAnnotation: this.convertType(node.type)
              });
            }

          case SyntaxKind.ParenthesizedType:
            {
              return this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.TSParenthesizedType,
                typeAnnotation: this.convertType(node.type)
              });
            }

          case SyntaxKind.TupleType:
            {
              return this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.TSTupleType,
                elementTypes: node.elementTypes.map(function (el) {
                  return _this7.convertType(el);
                })
              });
            }

          case SyntaxKind.UnionType:
            {
              return this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.TSUnionType,
                types: node.types.map(function (el) {
                  return _this7.convertType(el);
                })
              });
            }

          case SyntaxKind.IntersectionType:
            {
              return this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.TSIntersectionType,
                types: node.types.map(function (el) {
                  return _this7.convertType(el);
                })
              });
            }

          case SyntaxKind.RestType:
            {
              return this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.TSRestType,
                typeAnnotation: this.convertType(node.type)
              });
            }

          case SyntaxKind.AsExpression:
            {
              return this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.TSAsExpression,
                expression: this.convertChild(node.expression),
                typeAnnotation: this.convertType(node.type)
              });
            }

          case SyntaxKind.InferType:
            {
              return this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.TSInferType,
                typeParameter: this.convertType(node.typeParameter)
              });
            }

          case SyntaxKind.LiteralType:
            {
              return this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.TSLiteralType,
                literal: this.convertType(node.literal)
              });
            }

          case SyntaxKind.TypeAssertionExpression:
            {
              return this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.TSTypeAssertion,
                typeAnnotation: this.convertType(node.type),
                expression: this.convertChild(node.expression)
              });
            }

          case SyntaxKind.ImportEqualsDeclaration:
            {
              return this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.TSImportEqualsDeclaration,
                id: this.convertChild(node.name),
                moduleReference: this.convertChild(node.moduleReference),
                isExport: nodeUtils.hasModifier(SyntaxKind.ExportKeyword, node)
              });
            }

          case SyntaxKind.ExternalModuleReference:
            {
              return this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.TSExternalModuleReference,
                expression: this.convertChild(node.expression)
              });
            }

          case SyntaxKind.NamespaceExportDeclaration:
            {
              return this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.TSNamespaceExportDeclaration,
                id: this.convertChild(node.name)
              });
            }

          case SyntaxKind.AbstractKeyword:
            {
              return this.createNode(node, {
                type: tsEstree$1.AST_NODE_TYPES.TSAbstractKeyword
              });
            }

          default:
            return this.deeplyCopy(node);
        }
      }
    }]);

    return Converter;
  }();

  exports.Converter = Converter;
});
unwrapExports(convert);
var convert_1 = convert.convertError;
var convert_2 = convert.Converter;

var convertComments_1 = createCommonjsModule(function (module, exports) {

  var __importStar = commonjsGlobal && commonjsGlobal.__importStar || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) {
      if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    }
    result["default"] = mod;
    return result;
  };

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var ts = __importStar(typescript); // leave this as * as ts so people using util package don't need syntheticDefaultImports

  /**
   * Converts a TypeScript comment to an Esprima comment.
   * @param block True if it's a block comment, false if not.
   * @param text The text of the comment.
   * @param start The index at which the comment starts.
   * @param end The index at which the comment ends.
   * @param startLoc The location at which the comment starts.
   * @param endLoc The location at which the comment ends.
   * @returns The comment object.
   * @internal
   */


  function convertTypeScriptCommentToEsprimaComment(block, text, start, end, startLoc, endLoc) {
    var comment = {
      type: block ? 'Block' : 'Line',
      value: text
    };

    if (typeof start === 'number') {
      comment.range = [start, end];
    }

    if (typeof startLoc === 'object') {
      comment.loc = {
        start: startLoc,
        end: endLoc
      };
    }

    return comment;
  }
  /**
   * Convert comment from TypeScript Triva Scanner.
   * @param triviaScanner TS Scanner
   * @param ast the AST object
   * @param code TypeScript code
   * @returns the converted Comment
   * @private
   */


  function getCommentFromTriviaScanner(triviaScanner, ast, code) {
    var kind = triviaScanner.getToken();
    var isBlock = kind === ts.SyntaxKind.MultiLineCommentTrivia;
    var range = {
      pos: triviaScanner.getTokenPos(),
      end: triviaScanner.getTextPos(),
      kind: triviaScanner.getToken()
    };
    var comment = code.substring(range.pos, range.end);
    var text = isBlock ? comment.replace(/^\/\*/, '').replace(/\*\/$/, '') : comment.replace(/^\/\//, '');
    var loc = nodeUtils.getLocFor(range.pos, range.end, ast);
    return convertTypeScriptCommentToEsprimaComment(isBlock, text, range.pos, range.end, loc.start, loc.end);
  }
  /**
   * Convert all comments for the given AST.
   * @param ast the AST object
   * @param code the TypeScript code
   * @returns the converted ESTreeComment
   * @private
   */


  function convertComments(ast, code) {
    var comments = [];
    /**
     * Create a TypeScript Scanner, with skipTrivia set to false so that
     * we can parse the comments
     */

    var triviaScanner = ts.createScanner(ast.languageVersion, false, ast.languageVariant, code);
    var kind = triviaScanner.scan();

    while (kind !== ts.SyntaxKind.EndOfFileToken) {
      var start = triviaScanner.getTokenPos();
      var end = triviaScanner.getTextPos();
      var container = null;

      switch (kind) {
        case ts.SyntaxKind.SingleLineCommentTrivia:
        case ts.SyntaxKind.MultiLineCommentTrivia:
          {
            var comment = getCommentFromTriviaScanner(triviaScanner, ast, code);
            comments.push(comment);
            break;
          }

        case ts.SyntaxKind.GreaterThanToken:
          container = nodeUtils.getNodeContainer(ast, start, end);

          if (container.parent && container.parent.parent && // Rescan after an opening element or fragment
          container.parent.kind === ts.SyntaxKind.JsxOpeningElement && // Make sure this is the end of a tag like `<Component<number>>`
          container.parent.end === end || container.parent.kind === ts.SyntaxKind.JsxOpeningFragment || // Rescan after a self-closing element if it's inside another JSX element
          container.parent.kind === ts.SyntaxKind.JsxSelfClosingElement && (container.parent.parent.kind === ts.SyntaxKind.JsxElement || container.parent.parent.kind === ts.SyntaxKind.JsxFragment) || // Rescan after a closing element if it's inside another JSX element
          (container.parent.kind === ts.SyntaxKind.JsxClosingElement || container.parent.kind === ts.SyntaxKind.JsxClosingFragment) && container.parent.parent.parent && (container.parent.parent.parent.kind === ts.SyntaxKind.JsxElement || container.parent.parent.parent.kind === ts.SyntaxKind.JsxFragment)) {
            kind = triviaScanner.reScanJsxToken();
            continue;
          }

          break;

        case ts.SyntaxKind.CloseBraceToken:
          container = nodeUtils.getNodeContainer(ast, start, end); // Rescan after a JSX expression

          if (container.parent && container.parent.kind === ts.SyntaxKind.JsxExpression && container.parent.parent && container.parent.parent.kind === ts.SyntaxKind.JsxElement) {
            kind = triviaScanner.reScanJsxToken();
            continue;
          }

          if (container.kind === ts.SyntaxKind.TemplateMiddle || container.kind === ts.SyntaxKind.TemplateTail) {
            kind = triviaScanner.reScanTemplateToken();
            continue;
          }

          break;

        case ts.SyntaxKind.SlashToken:
        case ts.SyntaxKind.SlashEqualsToken:
          container = nodeUtils.getNodeContainer(ast, start, end);

          if (container.kind === ts.SyntaxKind.RegularExpressionLiteral) {
            kind = triviaScanner.reScanSlashToken();
            continue;
          }

          break;

        default:
          break;
      }

      kind = triviaScanner.scan();
    }

    return comments;
  }

  exports.convertComments = convertComments;
});
unwrapExports(convertComments_1);
var convertComments_2 = convertComments_1.convertComments;

var astConverter_1 = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function astConverter(ast, extra, shouldPreserveNodeMaps) {
    /**
     * The TypeScript compiler produced fundamental parse errors when parsing the
     * source.
     */
    // internal typescript api...
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var parseDiagnostics = ast.parseDiagnostics;

    if (parseDiagnostics.length) {
      throw convert.convertError(parseDiagnostics[0]);
    }
    /**
     * Recursively convert the TypeScript AST into an ESTree-compatible AST
     */


    var instance = new convert.Converter(ast, {
      errorOnUnknownASTType: extra.errorOnUnknownASTType || false,
      useJSXTextNode: extra.useJSXTextNode || false,
      shouldPreserveNodeMaps
    });
    var estree = instance.convertProgram();
    /**
     * Optionally convert and include all tokens in the AST
     */

    if (extra.tokens) {
      estree.tokens = nodeUtils.convertTokens(ast);
    }
    /**
     * Optionally convert and include all comments in the AST
     */


    if (extra.comment) {
      estree.comments = convertComments_1.convertComments(ast, extra.code);
    }

    var astMaps = shouldPreserveNodeMaps ? instance.getASTMaps() : undefined;
    return {
      estree,
      astMaps
    };
  }

  exports.astConverter = astConverter;
});
unwrapExports(astConverter_1);
var astConverter_2 = astConverter_1.astConverter;

var semanticOrSyntacticErrors = createCommonjsModule(function (module, exports) {

  var __importStar = commonjsGlobal && commonjsGlobal.__importStar || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) {
      if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    }
    result["default"] = mod;
    return result;
  };

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var ts = __importStar(typescript); // leave this as * as ts so people using util package don't need syntheticDefaultImports

  /**
   * By default, diagnostics from the TypeScript compiler contain all errors - regardless of whether
   * they are related to generic ECMAScript standards, or TypeScript-specific constructs.
   *
   * Therefore, we filter out all diagnostics, except for the ones we explicitly want to consider when
   * the user opts in to throwing errors on semantic issues.
   */


  function getFirstSemanticOrSyntacticError(program, ast) {
    try {
      var supportedSyntacticDiagnostics = whitelistSupportedDiagnostics(program.getSyntacticDiagnostics(ast));

      if (supportedSyntacticDiagnostics.length) {
        return convertDiagnosticToSemanticOrSyntacticError(supportedSyntacticDiagnostics[0]);
      }

      var supportedSemanticDiagnostics = whitelistSupportedDiagnostics(program.getSemanticDiagnostics(ast));

      if (supportedSemanticDiagnostics.length) {
        return convertDiagnosticToSemanticOrSyntacticError(supportedSemanticDiagnostics[0]);
      }

      return undefined;
    } catch (e) {
      /**
       * TypeScript compiler has certain Debug.fail() statements in, which will cause the diagnostics
       * retrieval above to throw.
       *
       * E.g. from ast-alignment-tests
       * "Debug Failure. Shouldn't ever directly check a JsxOpeningElement"
       *
       * For our current use-cases this is undesired behavior, so we just suppress it
       * and log a a warning.
       */

      /* istanbul ignore next */
      console.warn(`Warning From TSC: "${e.message}`); // eslint-disable-line no-console

      /* istanbul ignore next */

      return undefined;
    }
  }

  exports.getFirstSemanticOrSyntacticError = getFirstSemanticOrSyntacticError;

  function whitelistSupportedDiagnostics(diagnostics) {
    return diagnostics.filter(function (diagnostic) {
      switch (diagnostic.code) {
        case 1013: // ts 3.2 "A rest parameter or binding pattern may not have a trailing comma."

        case 1014: // ts 3.2 "A rest parameter must be last in a parameter list."

        case 1044: // ts 3.2 "'{0}' modifier cannot appear on a module or namespace element."

        case 1045: // ts 3.2 "A '{0}' modifier cannot be used with an interface declaration."

        case 1048: // ts 3.2 "A rest parameter cannot have an initializer."

        case 1049: // ts 3.2 "A 'set' accessor must have exactly one parameter."

        case 1070: // ts 3.2 "'{0}' modifier cannot appear on a type member."

        case 1071: // ts 3.2 "'{0}' modifier cannot appear on an index signature."

        case 1085: // ts 3.2 "Octal literals are not available when targeting ECMAScript 5 and higher. Use the syntax '{0}'."

        case 1090: // ts 3.2 "'{0}' modifier cannot appear on a parameter."

        case 1096: // ts 3.2 "An index signature must have exactly one parameter."

        case 1097: // ts 3.2 "'{0}' list cannot be empty."

        case 1098: // ts 3.3 "Type parameter list cannot be empty."

        case 1099: // ts 3.3 "Type argument list cannot be empty."

        case 1117: // ts 3.2 "An object literal cannot have multiple properties with the same name in strict mode."

        case 1121: // ts 3.2 "Octal literals are not allowed in strict mode."

        case 1123: // ts 3.2: "Variable declaration list cannot be empty."

        case 1141: // ts 3.2 "String literal expected."

        case 1162: // ts 3.2 "An object member cannot be declared optional."

        case 1172: // ts 3.2 "'extends' clause already seen."

        case 1173: // ts 3.2 "'extends' clause must precede 'implements' clause."

        case 1175: // ts 3.2 "'implements' clause already seen."

        case 1176: // ts 3.2 "Interface declaration cannot have 'implements' clause."

        case 1190: // ts 3.2 "The variable declaration of a 'for...of' statement cannot have an initializer."

        case 1200: // ts 3.2 "Line terminator not permitted before arrow."

        case 1206: // ts 3.2 "Decorators are not valid here."

        case 1211: // ts 3.2 "A class declaration without the 'default' modifier must have a name."

        case 1242: // ts 3.2 "'abstract' modifier can only appear on a class, method, or property declaration."

        case 1246: // ts 3.2 "An interface property cannot have an initializer."

        case 1255: // ts 3.2 "A definite assignment assertion '!' is not permitted in this context."

        case 1308: // ts 3.2 "'await' expression is only allowed within an async function."

        case 2364: // ts 3.2 "The left-hand side of an assignment expression must be a variable or a property access."

        case 2369: // ts 3.2 "A parameter property is only allowed in a constructor implementation."

        case 2462: // ts 3.2 "A rest element must be last in a destructuring pattern."

        case 8017: // ts 3.2 "Octal literal types must use ES2015 syntax. Use the syntax '{0}'."

        case 17012: // ts 3.2 "'{0}' is not a valid meta-property for keyword '{1}'. Did you mean '{2}'?"

        case 17013:
          // ts 3.2 "Meta-property '{0}' is only allowed in the body of a function declaration, function expression, or constructor."
          return true;
      }

      return false;
    });
  }

  function convertDiagnosticToSemanticOrSyntacticError(diagnostic) {
    return Object.assign(Object.assign({}, diagnostic), {
      message: ts.flattenDiagnosticMessageText(diagnostic.messageText, ts.sys.newLine)
    });
  }
});
unwrapExports(semanticOrSyntacticErrors);
var semanticOrSyntacticErrors_1 = semanticOrSyntacticErrors.getFirstSemanticOrSyntacticError;

var defineProperty$4 = objectDefineProperty.f;








var fastKey = internalMetadata.fastKey;


var setInternalState$3 = internalState.set;
var internalStateGetterFor$1 = internalState.getterFor;

var collectionStrong = {
  getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, CONSTRUCTOR_NAME);
      setInternalState$3(that, {
        type: CONSTRUCTOR_NAME,
        index: objectCreate(null),
        first: undefined,
        last: undefined,
        size: 0
      });
      if (!descriptors) that.size = 0;
      if (iterable != undefined) iterate_1(iterable, that[ADDER], that, IS_MAP);
    });

    var getInternalState = internalStateGetterFor$1(CONSTRUCTOR_NAME);

    var define = function (that, key, value) {
      var state = getInternalState(that);
      var entry = getEntry(that, key);
      var previous, index;
      // change existing entry
      if (entry) {
        entry.value = value;
      // create new entry
      } else {
        state.last = entry = {
          index: index = fastKey(key, true),
          key: key,
          value: value,
          previous: previous = state.last,
          next: undefined,
          removed: false
        };
        if (!state.first) state.first = entry;
        if (previous) previous.next = entry;
        if (descriptors) state.size++;
        else that.size++;
        // add to index
        if (index !== 'F') state.index[index] = entry;
      } return that;
    };

    var getEntry = function (that, key) {
      var state = getInternalState(that);
      // fast case
      var index = fastKey(key);
      var entry;
      if (index !== 'F') return state.index[index];
      // frozen object case
      for (entry = state.first; entry; entry = entry.next) {
        if (entry.key == key) return entry;
      }
    };

    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        var that = this;
        var state = getInternalState(that);
        var data = state.index;
        var entry = state.first;
        while (entry) {
          entry.removed = true;
          if (entry.previous) entry.previous = entry.previous.next = undefined;
          delete data[entry.index];
          entry = entry.next;
        }
        state.first = state.last = undefined;
        if (descriptors) state.size = 0;
        else that.size = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function (key) {
        var that = this;
        var state = getInternalState(that);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.next;
          var prev = entry.previous;
          delete state.index[entry.index];
          entry.removed = true;
          if (prev) prev.next = next;
          if (next) next.previous = prev;
          if (state.first == entry) state.first = next;
          if (state.last == entry) state.last = prev;
          if (descriptors) state.size--;
          else that.size--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /* , that = undefined */) {
        var state = getInternalState(this);
        var boundFunction = bindContext(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
        var entry;
        while (entry = entry ? entry.next : state.first) {
          boundFunction(entry.value, entry.key, this);
          // revert to the last existing entry
          while (entry && entry.removed) entry = entry.previous;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(this, key);
      }
    });

    redefineAll(C.prototype, IS_MAP ? {
      // 23.1.3.6 Map.prototype.get(key)
      get: function get(key) {
        var entry = getEntry(this, key);
        return entry && entry.value;
      },
      // 23.1.3.9 Map.prototype.set(key, value)
      set: function set(key, value) {
        return define(this, key === 0 ? 0 : key, value);
      }
    } : {
      // 23.2.3.1 Set.prototype.add(value)
      add: function add(value) {
        return define(this, value = value === 0 ? 0 : value, value);
      }
    });
    if (descriptors) defineProperty$4(C.prototype, 'size', {
      get: function () {
        return getInternalState(this).size;
      }
    });
    return C;
  },
  setStrong: function (C, CONSTRUCTOR_NAME, IS_MAP) {
    var ITERATOR_NAME = CONSTRUCTOR_NAME + ' Iterator';
    var getInternalCollectionState = internalStateGetterFor$1(CONSTRUCTOR_NAME);
    var getInternalIteratorState = internalStateGetterFor$1(ITERATOR_NAME);
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    defineIterator(C, CONSTRUCTOR_NAME, function (iterated, kind) {
      setInternalState$3(this, {
        type: ITERATOR_NAME,
        target: iterated,
        state: getInternalCollectionState(iterated),
        kind: kind,
        last: undefined
      });
    }, function () {
      var state = getInternalIteratorState(this);
      var kind = state.kind;
      var entry = state.last;
      // revert to the last existing entry
      while (entry && entry.removed) entry = entry.previous;
      // get next entry
      if (!state.target || !(state.last = entry = entry ? entry.next : state.state.first)) {
        // or finish the iteration
        state.target = undefined;
        return { value: undefined, done: true };
      }
      // return step by kind
      if (kind == 'keys') return { value: entry.key, done: false };
      if (kind == 'values') return { value: entry.value, done: false };
      return { value: [entry.key, entry.value], done: false };
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(CONSTRUCTOR_NAME);
  }
};

// `Map` constructor
// https://tc39.github.io/ecma262/#sec-map-objects
var es_map = collection('Map', function (get) {
  return function Map() { return get(this, arguments.length ? arguments[0] : undefined); };
}, collectionStrong, true);

// `Set` constructor
// https://tc39.github.io/ecma262/#sec-set-objects
var es_set = collection('Set', function (get) {
  return function Set() { return get(this, arguments.length ? arguments[0] : undefined); };
}, collectionStrong);

var tsconfigParser = createCommonjsModule(function (module, exports) {

  var __importDefault = commonjsGlobal && commonjsGlobal.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : {
      "default": mod
    };
  };

  var __importStar = commonjsGlobal && commonjsGlobal.__importStar || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) {
      if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    }
    result["default"] = mod;
    return result;
  };

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var path_1 = __importDefault(path$2);

  var ts = __importStar(typescript); // leave this as * as ts so people using util package don't need syntheticDefaultImports
  //------------------------------------------------------------------------------
  // Environment calculation
  //------------------------------------------------------------------------------

  /**
   * Default compiler options for program generation from single root file
   */


  exports.defaultCompilerOptions = {
    allowNonTsExtensions: true,
    allowJs: true,
    checkJs: true,
    noEmit: true
  };
  /**
   * Maps tsconfig paths to their corresponding file contents and resulting watches
   */

  var knownWatchProgramMap = new Map();
  /**
   * Maps file paths to their set of corresponding watch callbacks
   * There may be more than one per file if a file is shared between projects
   */

  var watchCallbackTrackingMap = new Map();
  var parsedFilesSeen = new Set();
  /**
   * Clear tsconfig caches.
   * Primarily used for testing.
   */

  function clearCaches() {
    knownWatchProgramMap.clear();
    watchCallbackTrackingMap.clear();
    parsedFilesSeen.clear();
  }

  exports.clearCaches = clearCaches;
  /**
   * Holds information about the file currently being linted
   */

  var currentLintOperationState = {
    code: '',
    filePath: ''
  };
  /**
   * Appropriately report issues found when reading a config file
   * @param diagnostic The diagnostic raised when creating a program
   */

  function diagnosticReporter(diagnostic) {
    throw new Error(ts.flattenDiagnosticMessageText(diagnostic.messageText, ts.sys.newLine));
  }

  var noopFileWatcher = {
    close: function close() {}
  };

  function getTsconfigPath(tsconfigPath, extra) {
    return path_1.default.isAbsolute(tsconfigPath) ? tsconfigPath : path_1.default.join(extra.tsconfigRootDir || process.cwd(), tsconfigPath);
  }
  /**
   * Calculate project environments using options provided by consumer and paths from config
   * @param code The code being linted
   * @param filePath The path of the file being parsed
   * @param extra.tsconfigRootDir The root directory for relative tsconfig paths
   * @param extra.projects Provided tsconfig paths
   * @returns The programs corresponding to the supplied tsconfig paths
   */


  function calculateProjectParserOptions(code, filePath, extra) {
    var results = []; // preserve reference to code and file being linted

    currentLintOperationState.code = code;
    currentLintOperationState.filePath = filePath; // Update file version if necessary
    // TODO: only update when necessary, currently marks as changed on every lint

    var watchCallback = watchCallbackTrackingMap.get(filePath);

    if (parsedFilesSeen.has(filePath) && typeof watchCallback !== 'undefined') {
      watchCallback(filePath, ts.FileWatcherEventKind.Changed);
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      var _loop = function _loop() {
        var rawTsconfigPath = _step.value;
        var tsconfigPath = getTsconfigPath(rawTsconfigPath, extra);
        var existingWatch = knownWatchProgramMap.get(tsconfigPath);

        if (typeof existingWatch !== 'undefined') {
          // get new program (updated if necessary)
          var updatedProgram = existingWatch.getProgram().getProgram();
          updatedProgram.getTypeChecker(); // sets parent pointers in source files

          results.push(updatedProgram);
          return "continue";
        } // create compiler host


        var watchCompilerHost = ts.createWatchCompilerHost(tsconfigPath, exports.defaultCompilerOptions, ts.sys, ts.createSemanticDiagnosticsBuilderProgram, diagnosticReporter,
        /*reportWatchStatus*/
        function () {}); // ensure readFile reads the code being linted instead of the copy on disk

        var oldReadFile = watchCompilerHost.readFile;

        watchCompilerHost.readFile = function (filePath, encoding) {
          return path_1.default.normalize(filePath) === path_1.default.normalize(currentLintOperationState.filePath) ? currentLintOperationState.code : oldReadFile(filePath, encoding);
        }; // ensure process reports error on failure instead of exiting process immediately


        watchCompilerHost.onUnRecoverableConfigFileDiagnostic = diagnosticReporter; // ensure process doesn't emit programs

        watchCompilerHost.afterProgramCreate = function (program) {
          // report error if there are any errors in the config file
          var configFileDiagnostics = program.getConfigFileParsingDiagnostics().filter(function (diag) {
            return diag.category === ts.DiagnosticCategory.Error && diag.code !== 18003;
          });

          if (configFileDiagnostics.length > 0) {
            diagnosticReporter(configFileDiagnostics[0]);
          }
        }; // register callbacks to trigger program updates without using fileWatchers


        watchCompilerHost.watchFile = function (fileName, callback) {
          var normalizedFileName = path_1.default.normalize(fileName);
          watchCallbackTrackingMap.set(normalizedFileName, callback);
          return {
            close: function close() {
              watchCallbackTrackingMap.delete(normalizedFileName);
            }
          };
        }; // ensure fileWatchers aren't created for directories


        watchCompilerHost.watchDirectory = function () {
          return noopFileWatcher;
        }; // allow files with custom extensions to be included in program (uses internal ts api)


        var oldOnDirectoryStructureHostCreate = watchCompilerHost.onCachedDirectoryStructureHostCreate;

        watchCompilerHost.onCachedDirectoryStructureHostCreate = function (host) {
          var oldReadDirectory = host.readDirectory;

          host.readDirectory = function (path, extensions, exclude, include, depth) {
            return oldReadDirectory(path, !extensions ? undefined : extensions.concat(extra.extraFileExtensions), exclude, include, depth);
          };

          oldOnDirectoryStructureHostCreate(host);
        }; // create program


        var programWatch = ts.createWatchProgram(watchCompilerHost);
        var program = programWatch.getProgram().getProgram(); // cache watch program and return current program

        knownWatchProgramMap.set(tsconfigPath, programWatch);
        results.push(program);
      };

      for (var _iterator = extra.projects[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _ret = _loop();

        if (_ret === "continue") continue;
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    parsedFilesSeen.add(filePath);
    return results;
  }

  exports.calculateProjectParserOptions = calculateProjectParserOptions;
  /**
   * Create program from single root file. Requires a single tsconfig to be specified.
   * @param code The code being linted
   * @param filePath The file being linted
   * @param extra.tsconfigRootDir The root directory for relative tsconfig paths
   * @param extra.projects Provided tsconfig paths
   * @returns The program containing just the file being linted and associated library files
   */

  function createProgram(code, filePath, extra) {
    if (!extra.projects || extra.projects.length !== 1) {
      return undefined;
    }

    var tsconfigPath = getTsconfigPath(extra.projects[0], extra);
    var commandLine = ts.getParsedCommandLineOfConfigFile(tsconfigPath, exports.defaultCompilerOptions, Object.assign(Object.assign({}, ts.sys), {
      onUnRecoverableConfigFileDiagnostic: function onUnRecoverableConfigFileDiagnostic() {}
    }));

    if (!commandLine) {
      return undefined;
    }

    var compilerHost = ts.createCompilerHost(commandLine.options, true);
    var oldReadFile = compilerHost.readFile;

    compilerHost.readFile = function (fileName) {
      return path_1.default.normalize(fileName) === path_1.default.normalize(filePath) ? code : oldReadFile(fileName);
    };

    return ts.createProgram([filePath], commandLine.options, compilerHost);
  }

  exports.createProgram = createProgram;
});
unwrapExports(tsconfigParser);
var tsconfigParser_1 = tsconfigParser.defaultCompilerOptions;
var tsconfigParser_2 = tsconfigParser.clearCaches;
var tsconfigParser_3 = tsconfigParser.calculateProjectParserOptions;
var tsconfigParser_4 = tsconfigParser.createProgram;

var name = "@typescript-eslint/typescript-estree";
var version$1 = "2.3.2";
var description = "A parser that converts TypeScript source code into an ESTree compatible form";
var main = "dist/parser.js";
var types = "dist/parser.d.ts";
var files = [
	"dist",
	"README.md",
	"LICENSE"
];
var engines = {
	node: "^8.10.0 || ^10.13.0 || >=11.10.1"
};
var repository = {
	type: "git",
	url: "https://github.com/typescript-eslint/typescript-eslint.git",
	directory: "packages/typescript-estree"
};
var bugs = {
	url: "https://github.com/typescript-eslint/typescript-eslint/issues"
};
var license = "BSD-2-Clause";
var keywords = [
	"ast",
	"estree",
	"ecmascript",
	"javascript",
	"typescript",
	"parser",
	"syntax"
];
var scripts = {
	"ast-alignment-tests": "jest spec.ts",
	build: "tsc -p tsconfig.build.json",
	clean: "rimraf dist/",
	format: "prettier --write \"./**/*.{ts,js,json,md}\" --ignore-path ../../.prettierignore",
	prebuild: "npm run clean",
	test: "jest --coverage",
	typecheck: "tsc --noEmit",
	"unit-tests": "jest \"./tests/lib/.*\""
};
var dependencies = {
	glob: "^7.1.4",
	"is-glob": "^4.0.1",
	"lodash.unescape": "4.0.1",
	semver: "^6.3.0"
};
var devDependencies = {
	"@babel/code-frame": "7.5.5",
	"@babel/parser": "7.5.5",
	"@babel/types": "^7.3.2",
	"@types/babel-code-frame": "^6.20.1",
	"@types/glob": "^7.1.1",
	"@types/is-glob": "^4.0.1",
	"@types/lodash.isplainobject": "^4.0.4",
	"@types/lodash.unescape": "^4.0.4",
	"@types/semver": "^6.0.1",
	"@typescript-eslint/shared-fixtures": "2.3.2",
	"babel-code-frame": "^6.26.0",
	glob: "^7.1.4",
	"lodash.isplainobject": "4.0.6",
	typescript: "*"
};
var gitHead = "926cf646a441a0cca3a9bf83a767f00bc4a4d854";
var _package = {
	name: name,
	version: version$1,
	description: description,
	main: main,
	types: types,
	files: files,
	engines: engines,
	repository: repository,
	bugs: bugs,
	license: license,
	keywords: keywords,
	scripts: scripts,
	dependencies: dependencies,
	devDependencies: devDependencies,
	gitHead: gitHead
};

var _package$1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	name: name,
	version: version$1,
	description: description,
	main: main,
	types: types,
	files: files,
	engines: engines,
	repository: repository,
	bugs: bugs,
	license: license,
	keywords: keywords,
	scripts: scripts,
	dependencies: dependencies,
	devDependencies: devDependencies,
	gitHead: gitHead,
	'default': _package
});

var require$$4 = getCjsExportFromNamespace(_package$1);

var parser = createCommonjsModule(function (module, exports) {

  function __export(m) {
    for (var p in m) {
      if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
  }

  var __importDefault = commonjsGlobal && commonjsGlobal.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : {
      "default": mod
    };
  };

  var __importStar = commonjsGlobal && commonjsGlobal.__importStar || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) {
      if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    }
    result["default"] = mod;
    return result;
  };

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var path_1 = __importDefault(path$2);

  var semver_1 = __importDefault(semver);

  var ts = __importStar(typescript); // leave this as * as ts so people using util package don't need syntheticDefaultImports


  var is_glob_1 = __importDefault(isGlob);
  /**
   * This needs to be kept in sync with the top-level README.md in the
   * typescript-eslint monorepo
   */


  var SUPPORTED_TYPESCRIPT_VERSIONS = '>=3.2.1 <3.7.0';
  var ACTIVE_TYPESCRIPT_VERSION = ts.version;
  var isRunningSupportedTypeScriptVersion = semver_1.default.satisfies(ACTIVE_TYPESCRIPT_VERSION, SUPPORTED_TYPESCRIPT_VERSIONS);
  var extra;
  var warnedAboutTSVersion = false;
  /**
   * Compute the filename based on the parser options.
   *
   * Even if jsx option is set in typescript compiler, filename still has to
   * contain .tsx file extension.
   *
   * @param options Parser options
   */

  function getFileName(_ref) {
    var jsx = _ref.jsx;
    return jsx ? 'estree.tsx' : 'estree.ts';
  }
  /**
   * Resets the extra config object
   */


  function resetExtra() {
    extra = {
      tokens: null,
      range: false,
      loc: false,
      comment: false,
      comments: [],
      strict: false,
      jsx: false,
      useJSXTextNode: false,
      log: console.log,
      projects: [],
      errorOnUnknownASTType: false,
      errorOnTypeScriptSyntacticAndSemanticIssues: false,
      code: '',
      tsconfigRootDir: process.cwd(),
      extraFileExtensions: [],
      preserveNodeMaps: undefined,
      createDefaultProgram: false
    };
  }
  /**
   * @param code The code of the file being linted
   * @param options The config object
   * @returns If found, returns the source file corresponding to the code and the containing program
   */


  function getASTFromProject(code, options, createDefaultProgram) {
    var filePath = options.filePath || getFileName(options);
    var astAndProgram = nodeUtils.firstDefined(tsconfigParser.calculateProjectParserOptions(code, filePath, extra), function (currentProgram) {
      var ast = currentProgram.getSourceFile(filePath);
      return ast && {
        ast,
        program: currentProgram
      };
    });

    if (!astAndProgram && !createDefaultProgram) {
      // the file was either not matched within the tsconfig, or the extension wasn't expected
      var errorLines = ['"parserOptions.project" has been set for @typescript-eslint/parser.', `The file does not match your project config: ${filePath}.`];
      var hasMatchedAnError = false;
      var fileExtension = path_1.default.extname(filePath);

      if (!['.ts', '.tsx', '.js', '.jsx'].includes(fileExtension)) {
        var nonStandardExt = `The extension for the file (${fileExtension}) is non-standard`;

        if (extra.extraFileExtensions && extra.extraFileExtensions.length > 0) {
          if (!extra.extraFileExtensions.includes(fileExtension)) {
            errorLines.push(`${nonStandardExt}. It should be added to your existing "parserOptions.extraFileExtensions".`);
            hasMatchedAnError = true;
          }
        } else {
          errorLines.push(`${nonStandardExt}. You should add "parserOptions.extraFileExtensions" to your config.`);
          hasMatchedAnError = true;
        }
      }

      if (!hasMatchedAnError) {
        errorLines.push('The file must be included in at least one of the projects provided.');
        hasMatchedAnError = true;
      }

      throw new Error(errorLines.join('\n'));
    }

    return astAndProgram;
  }
  /**
   * @param code The code of the file being linted
   * @param options The config object
   * @returns If found, returns the source file corresponding to the code and the containing program
   */


  function getASTAndDefaultProject(code, options) {
    var fileName = options.filePath || getFileName(options);
    var program = tsconfigParser.createProgram(code, fileName, extra);
    var ast = program && program.getSourceFile(fileName);
    return ast && {
      ast,
      program
    };
  }
  /**
   * @param code The code of the file being linted
   * @returns Returns a new source file and program corresponding to the linted code
   */


  function createNewProgram(code) {
    var FILENAME = getFileName(extra);
    var compilerHost = {
      fileExists() {
        return true;
      },

      getCanonicalFileName() {
        return FILENAME;
      },

      getCurrentDirectory() {
        return '';
      },

      getDirectories() {
        return [];
      },

      getDefaultLibFileName() {
        return 'lib.d.ts';
      },

      // TODO: Support Windows CRLF
      getNewLine() {
        return '\n';
      },

      getSourceFile(filename) {
        return ts.createSourceFile(filename, code, ts.ScriptTarget.Latest, true);
      },

      readFile() {
        return undefined;
      },

      useCaseSensitiveFileNames() {
        return true;
      },

      writeFile() {
        return null;
      }

    };
    var program = ts.createProgram([FILENAME], Object.assign({
      noResolve: true,
      target: ts.ScriptTarget.Latest,
      jsx: extra.jsx ? ts.JsxEmit.Preserve : undefined
    }, tsconfigParser.defaultCompilerOptions), compilerHost);
    var ast = program.getSourceFile(FILENAME);
    return {
      ast,
      program
    };
  }
  /**
   * @param code The code of the file being linted
   * @param options The config object
   * @param shouldProvideParserServices True iff the program should be attempted to be calculated from provided tsconfig files
   * @returns Returns a source file and program corresponding to the linted code
   */


  function getProgramAndAST(code, options, shouldProvideParserServices, createDefaultProgram) {
    return shouldProvideParserServices && getASTFromProject(code, options, createDefaultProgram) || shouldProvideParserServices && createDefaultProgram && getASTAndDefaultProject(code, options) || createNewProgram(code);
  }

  function applyParserOptionsToExtra(options) {
    /**
     * Track range information in the AST
     */
    extra.range = typeof options.range === 'boolean' && options.range;
    extra.loc = typeof options.loc === 'boolean' && options.loc;
    /**
     * Track tokens in the AST
     */

    if (typeof options.tokens === 'boolean' && options.tokens) {
      extra.tokens = [];
    }
    /**
     * Track comments in the AST
     */


    if (typeof options.comment === 'boolean' && options.comment) {
      extra.comment = true;
      extra.comments = [];
    }
    /**
     * Enable JSX - note the applicable file extension is still required
     */


    if (typeof options.jsx === 'boolean' && options.jsx) {
      extra.jsx = true;
    }
    /**
     * The JSX AST changed the node type for string literals
     * inside a JSX Element from `Literal` to `JSXText`.
     *
     * When value is `true`, these nodes will be parsed as type `JSXText`.
     * When value is `false`, these nodes will be parsed as type `Literal`.
     */


    if (typeof options.useJSXTextNode === 'boolean' && options.useJSXTextNode) {
      extra.useJSXTextNode = true;
    }
    /**
     * Allow the user to cause the parser to error if it encounters an unknown AST Node Type
     * (used in testing)
     */


    if (typeof options.errorOnUnknownASTType === 'boolean' && options.errorOnUnknownASTType) {
      extra.errorOnUnknownASTType = true;
    }
    /**
     * Allow the user to override the function used for logging
     */


    if (typeof options.loggerFn === 'function') {
      extra.log = options.loggerFn;
    } else if (options.loggerFn === false) {
      extra.log = Function.prototype;
    }

    if (typeof options.project === 'string') {
      extra.projects = [options.project];
    } else if (Array.isArray(options.project) && options.project.every(function (projectPath) {
      return typeof projectPath === 'string';
    })) {
      extra.projects = options.project;
    } // Transform glob patterns into paths


    if (extra.projects) {
      extra.projects = extra.projects.reduce(function (projects, project) {
        return projects.concat(is_glob_1.default(project) ? glob_1.sync(project) : project);
      }, []);
    }

    if (typeof options.tsconfigRootDir === 'string') {
      extra.tsconfigRootDir = options.tsconfigRootDir;
    }

    if (Array.isArray(options.extraFileExtensions) && options.extraFileExtensions.every(function (ext) {
      return typeof ext === 'string';
    })) {
      extra.extraFileExtensions = options.extraFileExtensions;
    }
    /**
     * Allow the user to enable or disable the preservation of the AST node maps
     * during the conversion process.
     *
     * NOTE: For backwards compatibility we also preserve node maps in the case where `project` is set,
     * and `preserveNodeMaps` is not explicitly set to anything.
     */


    extra.preserveNodeMaps = typeof options.preserveNodeMaps === 'boolean' && options.preserveNodeMaps;

    if (options.preserveNodeMaps === undefined && extra.projects.length > 0) {
      extra.preserveNodeMaps = true;
    }

    extra.createDefaultProgram = typeof options.createDefaultProgram === 'boolean' && options.createDefaultProgram;
  }

  function warnAboutTSVersion() {
    if (!isRunningSupportedTypeScriptVersion && !warnedAboutTSVersion) {
      var border = '=============';
      var versionWarning = [border, 'WARNING: You are currently running a version of TypeScript which is not officially supported by typescript-estree.', 'You may find that it works just fine, or you may not.', `SUPPORTED TYPESCRIPT VERSIONS: ${SUPPORTED_TYPESCRIPT_VERSIONS}`, `YOUR TYPESCRIPT VERSION: ${ACTIVE_TYPESCRIPT_VERSION}`, 'Please only submit bug reports when using the officially supported version.', border];
      extra.log(versionWarning.join('\n\n'));
      warnedAboutTSVersion = true;
    }
  } //------------------------------------------------------------------------------
  // Public
  //------------------------------------------------------------------------------


  exports.version = require$$4.version;

  function parse(code, options) {
    /**
     * Reset the parse configuration
     */
    resetExtra();
    /**
     * Ensure users do not attempt to use parse() when they need parseAndGenerateServices()
     */

    if (options && options.errorOnTypeScriptSyntacticAndSemanticIssues) {
      throw new Error(`"errorOnTypeScriptSyntacticAndSemanticIssues" is only supported for parseAndGenerateServices()`);
    }
    /**
     * Ensure the source code is a string, and store a reference to it
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any


    if (typeof code !== 'string' && !(code instanceof String)) {
      code = String(code);
    }

    extra.code = code;
    /**
     * Apply the given parser options
     */

    if (typeof options !== 'undefined') {
      applyParserOptionsToExtra(options);
    }
    /**
     * Warn if the user is using an unsupported version of TypeScript
     */


    warnAboutTSVersion();
    /**
     * Create a ts.SourceFile directly, no ts.Program is needed for a simple
     * parse
     */

    var ast = ts.createSourceFile(getFileName(extra), code, ts.ScriptTarget.Latest,
    /* setParentNodes */
    true);
    /**
     * Convert the TypeScript AST to an ESTree-compatible one
     */

    var _ast_converter_1$astC = astConverter_1.astConverter(ast, extra, false),
        estree = _ast_converter_1$astC.estree;

    return estree;
  }

  exports.parse = parse;

  function parseAndGenerateServices(code, options) {
    /**
     * Reset the parse configuration
     */
    resetExtra();
    /**
     * Ensure the source code is a string, and store a reference to it
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any

    if (typeof code !== 'string' && !(code instanceof String)) {
      code = String(code);
    }

    extra.code = code;
    /**
     * Apply the given parser options
     */

    if (typeof options !== 'undefined') {
      applyParserOptionsToExtra(options);

      if (typeof options.errorOnTypeScriptSyntacticAndSemanticIssues === 'boolean' && options.errorOnTypeScriptSyntacticAndSemanticIssues) {
        extra.errorOnTypeScriptSyntacticAndSemanticIssues = true;
      }
    }
    /**
     * Warn if the user is using an unsupported version of TypeScript
     */


    warnAboutTSVersion();
    /**
     * Generate a full ts.Program in order to be able to provide parser
     * services, such as type-checking
     */

    var shouldProvideParserServices = extra.projects && extra.projects.length > 0;

    var _getProgramAndAST = getProgramAndAST(code, options, shouldProvideParserServices, extra.createDefaultProgram),
        ast = _getProgramAndAST.ast,
        program = _getProgramAndAST.program;
    /**
     * Determine whether or not two-way maps of converted AST nodes should be preserved
     * during the conversion process
     */


    var shouldPreserveNodeMaps = extra.preserveNodeMaps !== undefined ? extra.preserveNodeMaps : shouldProvideParserServices;
    /**
     * Convert the TypeScript AST to an ESTree-compatible one, and optionally preserve
     * mappings between converted and original AST nodes
     */

    var _ast_converter_1$astC2 = astConverter_1.astConverter(ast, extra, shouldPreserveNodeMaps),
        estree = _ast_converter_1$astC2.estree,
        astMaps = _ast_converter_1$astC2.astMaps;
    /**
     * Even if TypeScript parsed the source code ok, and we had no problems converting the AST,
     * there may be other syntactic or semantic issues in the code that we can optionally report on.
     */


    if (program && extra.errorOnTypeScriptSyntacticAndSemanticIssues) {
      var error = semanticOrSyntacticErrors.getFirstSemanticOrSyntacticError(program, ast);

      if (error) {
        throw convert.convertError(error);
      }
    }
    /**
     * Return the converted AST and additional parser services
     */


    return {
      ast: estree,
      services: {
        program: shouldProvideParserServices ? program : undefined,
        esTreeNodeToTSNodeMap: shouldPreserveNodeMaps && astMaps ? astMaps.esTreeNodeToTSNodeMap : undefined,
        tsNodeToESTreeNodeMap: shouldPreserveNodeMaps && astMaps ? astMaps.tsNodeToESTreeNodeMap : undefined
      }
    };
  }

  exports.parseAndGenerateServices = parseAndGenerateServices;

  __export(tsEstree$1);
});
var parser$1 = unwrapExports(parser);
var parser_1 = parser.version;
var parser_2 = parser.parse;
var parser_3 = parser.parseAndGenerateServices;

exports.default = parser$1;
exports.parse = parser_2;
exports.parseAndGenerateServices = parser_3;
exports.version = parser_1;
