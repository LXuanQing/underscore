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
	// Is a given variable an object?
	_.isObject = function(obj) {
		var type = typeof obj;
		return type === 'function' || type === 'object' && !!obj;
	};
	// Is a given value a boolean?
	_.isBoolean = function(obj) {
		return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
	};
	// Is a given variable undefined?
	_.isUndefined = function(obj) {
		return obj === void 0;
	};
	// Is a given value equal to null?
	_.isNull = function(obj) {
		return obj === null;
	};
	// on itself (in other words, not on a prototype).
	_.has = function(obj, key) {
		return obj != null && hasOwnProperty.call(obj, key);
	};
	// Internal recursive comparison function for `isEqual`.
	var eq = function(a, b, aStack, bStack) {
    	// Identical objects are equal. `0 === -0`, but they aren't identical.
		// See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
		if (a === b) return a !== 0 || 1 / a === 1 / b;
		// A strict comparison is necessary because `null == undefined`.
		if (a == null || b == null) return a === b;
		// Unwrap any wrapped objects.
		if (a instanceof _) a = a._wrapped;
		if (b instanceof _) b = b._wrapped;
		// Compare `[[Class]]` names.
		var className = toString.call(a);
		if (className !== toString.call(b)) return false;
    	switch (className) {
		// Strings, numbers, regular expressions, dates, and booleans are compared by value.
		case '[object RegExp]':
		// RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
		case '[object String]':
			// Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
			// equivalent to `new String("5")`.
			return '' + a === '' + b;
		case '[object Number]':
			// `NaN`s are equivalent, but non-reflexive.
			// Object(NaN) is equivalent to NaN
			if (+a !== +a) return +b !== +b;
			// An `egal` comparison is performed for other numeric values.
			return +a === 0 ? 1 / +a === 1 / b : +a === +b;
		case '[object Date]':
		case '[object Boolean]':
			// Coerce dates and booleans to numeric primitive values. Dates are compared by their
			// millisecond representations. Note that invalid dates with millisecond representations
			// of `NaN` are not equivalent.
			return +a === +b;
    	}

   		var areArrays = className === '[object Array]';
		if (!areArrays) {
			if (typeof a != 'object' || typeof b != 'object') return false;

			// Objects with different constructors are not equivalent, but `Object`s or `Array`s
			// from different frames are.
			var aCtor = a.constructor, bCtor = b.constructor;
			if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
									_.isFunction(bCtor) && bCtor instanceof bCtor)
								&& ('constructor' in a && 'constructor' in b)) {
				return false;
			}
		}
		// Assume equality for cyclic structures. The algorithm for detecting cyclic
		// structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

		// Initializing stack of traversed objects.
		// It's done here since we only need them for objects and arrays comparison.
		aStack = aStack || [];
		bStack = bStack || [];
		var length = aStack.length;
		while (length--) {
			// Linear search. Performance is inversely proportional to the number of
			// unique nested structures.
			if (aStack[length] === a) return bStack[length] === b;
		}

		// Add the first object to the stack of traversed objects.
		aStack.push(a);
		bStack.push(b);

		// Recursively compare objects and arrays.
		if (areArrays) {
			// Compare array lengths to determine if a deep comparison is necessary.
			length = a.length;
			if (length !== b.length) return false;
			// Deep compare the contents, ignoring non-numeric properties.
			while (length--) {
				if (!eq(a[length], b[length], aStack, bStack)) return false;
			}
		} else {
			// Deep compare objects.
			var keys = _.keys(a), key;
			length = keys.length;
			// Ensure that both objects contain the same number of properties before comparing deep equality.
			if (_.keys(b).length !== length) return false;
			while (length--) {
				// Deep compare each member
				key = keys[length];
				if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
			}
    	}
		// Remove the first object from the stack of traversed objects.
		aStack.pop();
		bStack.pop();
		return true;
	}
	// Perform a deep comparison to check if two objects are equal.
	_.isEqual = function(a, b) {
		return eq(a, b);
	};
	// Utility Functions
	_.noop = function(){};
	// Return a random integer between min and max (inclusive).
	_.random = function(min, max) {
		if (max == null) {
			max = min;
			min = 0;
		}
		return min + Math.floor(Math.random() * (max - min + 1));
	};
	_.now = Date.now || function() {
		return new Date().getTime();
	};
	// Keep the identity function around for default iteratees.
	_.identity = function(value) {
		return value;
	};
}.call(this))

/**
 * https://www.imooc.com/article/1566
 * Object.prototype.toString.call
 * null === null
 * undefined === undefined
 * NaN == NaN // false
 * typeof null // object
 * typeof undefined // undefined
 * undefined == null
 * undefined === null // false
 * 函数没有参数，undefined
 * Date.now()
 * /6/i + '3'=> '/6/i3'
 * Object.prototype.toString.call(NaN)  [object Number]
 * Object.prototype.toString.call(4)  [object Number]
*/