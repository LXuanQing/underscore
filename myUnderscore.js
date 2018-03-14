(function() {
	var root = this;
  	// Save the previous value of the `_` variable.
	var previousUnderscore = root._;
  	// Save bytes in the minified (but not gzipped) version:
	var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;
	var push = ArrayProto.push,
	  	slice  = ArrayProto.slice,
        toString = ObjProto.toString,
        hasOwnProperty = ObjProto.hasOwnProperty; // 自身属性
	var nativeIsArray = Array.isArray,
		nativeKeys = Object.keys,
		nativeBind = FuncProto.bind,
		nativeCreate = Object.create;
	var Ctor = function(){};
	var _ = function(obj) {
		if (obj instanceof _) return obj;
		if (!(this instanceof _)) return new _(obj);
		this._wrapped = obj;
	};
	// Export the Underscore object for **Node.js**, with
  	// backwards-compatibility for the old `require()` API. If we're in
  	// the browser, add `_` as a global object.
	if (typeof exports !== 'undefined') {
		if (typeof module !== 'undefined' && module.exports) {
		  	exports = module.exports = _;
		}
		exports._ = _;
	} else {
		root._ = _;
	}
	// Current version.
	_.VERSION = '1.8.3';
	var optimizeCb = function(func, context, argCount) {
		if (context === void 0) return func; // undefined === void 0
	}
	var property = function(key) {
		return function(obj) {
		  	return obj == null ? void 0 : obj[key];
		};
	};
	var getLength = property('length');
	var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;	
	var isArrayLike = function(collection) {
		var length = getLength(collection);
		return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
	}
	var cb = function(value, context, argCount) {
		if (value == null) return _.identity;
	}
	// Collection Functions
	_.each = _.forEach = function(obj, iteratee, context) {
		iteratee = optimizeCb(iteratee, context);
		var i, length;
		if (isArrayLike(obj)) {
			for (i = 0, length = obj.length; i < length; i++) {
				iteratee(obj[i], i, obj);
			}
		} else {
			// var keys = _.keys(obj);
			var keys = Object.keys(obj);
			for (i = 0, length = keys.length; i < length; i++) {
				iteratee(obj[keys[i]], keys[i], obj);
			}
		}
		return obj;
	}
	_.map = _.collect = function(obj, iteratee, context) {
		iteratee = cb(iteratee, context);
	}
	// Object Functions
	// 是否值DOM元素 dom的nodeType = 1
	_.isElement = function(obj) {
		return !!(obj && obj.nodeType === 1);
	};
	// Is a given value an array?
	// Delegates to ECMA5's native Array.isArray
	_.isArray = nativeIsArray || function(obj) {
		return toString.call(obj) === '[object Array]';
	};
}.call(this))
var arr = [1,2,3]
var str = '123'
var fn = function(){}
var bo = true
console.log(Object.prototype.toString.call(null))
