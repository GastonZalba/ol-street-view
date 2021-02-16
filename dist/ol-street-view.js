(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('ol'), require('ol/proj'), require('ol/style'), require('ol/source'), require('ol/layer'), require('ol/interaction'), require('ol/geom'), require('ol/Observable'), require('interactjs')) :
	typeof define === 'function' && define.amd ? define(['ol', 'ol/proj', 'ol/style', 'ol/source', 'ol/layer', 'ol/interaction', 'ol/geom', 'ol/Observable', 'interactjs'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.StreetView = factory(global.ol, global.ol.proj, global.ol.style, global.ol.source, global.ol.layer, global.ol.interaction, global.ol.geom, global.ol.Observable, global.interact));
}(this, (function (ol, proj, style, source, layer, interaction, geom, Observable, interact) { 'use strict';

	function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

	var interact__default = /*#__PURE__*/_interopDefaultLegacy(interact);

	function createCommonjsModule(fn) {
	  var module = { exports: {} };
		return fn(module, module.exports), module.exports;
	}

	/**
	 * Copyright (c) 2014-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	var runtime_1 = createCommonjsModule(function (module) {
	var runtime = (function (exports) {

	  var Op = Object.prototype;
	  var hasOwn = Op.hasOwnProperty;
	  var undefined$1; // More compressible than void 0.
	  var $Symbol = typeof Symbol === "function" ? Symbol : {};
	  var iteratorSymbol = $Symbol.iterator || "@@iterator";
	  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
	  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

	  function define(obj, key, value) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	    return obj[key];
	  }
	  try {
	    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
	    define({}, "");
	  } catch (err) {
	    define = function(obj, key, value) {
	      return obj[key] = value;
	    };
	  }

	  function wrap(innerFn, outerFn, self, tryLocsList) {
	    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
	    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
	    var generator = Object.create(protoGenerator.prototype);
	    var context = new Context(tryLocsList || []);

	    // The ._invoke method unifies the implementations of the .next,
	    // .throw, and .return methods.
	    generator._invoke = makeInvokeMethod(innerFn, self, context);

	    return generator;
	  }
	  exports.wrap = wrap;

	  // Try/catch helper to minimize deoptimizations. Returns a completion
	  // record like context.tryEntries[i].completion. This interface could
	  // have been (and was previously) designed to take a closure to be
	  // invoked without arguments, but in all the cases we care about we
	  // already have an existing method we want to call, so there's no need
	  // to create a new function object. We can even get away with assuming
	  // the method takes exactly one argument, since that happens to be true
	  // in every case, so we don't have to touch the arguments object. The
	  // only additional allocation required is the completion record, which
	  // has a stable shape and so hopefully should be cheap to allocate.
	  function tryCatch(fn, obj, arg) {
	    try {
	      return { type: "normal", arg: fn.call(obj, arg) };
	    } catch (err) {
	      return { type: "throw", arg: err };
	    }
	  }

	  var GenStateSuspendedStart = "suspendedStart";
	  var GenStateSuspendedYield = "suspendedYield";
	  var GenStateExecuting = "executing";
	  var GenStateCompleted = "completed";

	  // Returning this object from the innerFn has the same effect as
	  // breaking out of the dispatch switch statement.
	  var ContinueSentinel = {};

	  // Dummy constructor functions that we use as the .constructor and
	  // .constructor.prototype properties for functions that return Generator
	  // objects. For full spec compliance, you may wish to configure your
	  // minifier not to mangle the names of these two functions.
	  function Generator() {}
	  function GeneratorFunction() {}
	  function GeneratorFunctionPrototype() {}

	  // This is a polyfill for %IteratorPrototype% for environments that
	  // don't natively support it.
	  var IteratorPrototype = {};
	  IteratorPrototype[iteratorSymbol] = function () {
	    return this;
	  };

	  var getProto = Object.getPrototypeOf;
	  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
	  if (NativeIteratorPrototype &&
	      NativeIteratorPrototype !== Op &&
	      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
	    // This environment has a native %IteratorPrototype%; use it instead
	    // of the polyfill.
	    IteratorPrototype = NativeIteratorPrototype;
	  }

	  var Gp = GeneratorFunctionPrototype.prototype =
	    Generator.prototype = Object.create(IteratorPrototype);
	  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
	  GeneratorFunctionPrototype.constructor = GeneratorFunction;
	  GeneratorFunction.displayName = define(
	    GeneratorFunctionPrototype,
	    toStringTagSymbol,
	    "GeneratorFunction"
	  );

	  // Helper for defining the .next, .throw, and .return methods of the
	  // Iterator interface in terms of a single ._invoke method.
	  function defineIteratorMethods(prototype) {
	    ["next", "throw", "return"].forEach(function(method) {
	      define(prototype, method, function(arg) {
	        return this._invoke(method, arg);
	      });
	    });
	  }

	  exports.isGeneratorFunction = function(genFun) {
	    var ctor = typeof genFun === "function" && genFun.constructor;
	    return ctor
	      ? ctor === GeneratorFunction ||
	        // For the native GeneratorFunction constructor, the best we can
	        // do is to check its .name property.
	        (ctor.displayName || ctor.name) === "GeneratorFunction"
	      : false;
	  };

	  exports.mark = function(genFun) {
	    if (Object.setPrototypeOf) {
	      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
	    } else {
	      genFun.__proto__ = GeneratorFunctionPrototype;
	      define(genFun, toStringTagSymbol, "GeneratorFunction");
	    }
	    genFun.prototype = Object.create(Gp);
	    return genFun;
	  };

	  // Within the body of any async function, `await x` is transformed to
	  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
	  // `hasOwn.call(value, "__await")` to determine if the yielded value is
	  // meant to be awaited.
	  exports.awrap = function(arg) {
	    return { __await: arg };
	  };

	  function AsyncIterator(generator, PromiseImpl) {
	    function invoke(method, arg, resolve, reject) {
	      var record = tryCatch(generator[method], generator, arg);
	      if (record.type === "throw") {
	        reject(record.arg);
	      } else {
	        var result = record.arg;
	        var value = result.value;
	        if (value &&
	            typeof value === "object" &&
	            hasOwn.call(value, "__await")) {
	          return PromiseImpl.resolve(value.__await).then(function(value) {
	            invoke("next", value, resolve, reject);
	          }, function(err) {
	            invoke("throw", err, resolve, reject);
	          });
	        }

	        return PromiseImpl.resolve(value).then(function(unwrapped) {
	          // When a yielded Promise is resolved, its final value becomes
	          // the .value of the Promise<{value,done}> result for the
	          // current iteration.
	          result.value = unwrapped;
	          resolve(result);
	        }, function(error) {
	          // If a rejected Promise was yielded, throw the rejection back
	          // into the async generator function so it can be handled there.
	          return invoke("throw", error, resolve, reject);
	        });
	      }
	    }

	    var previousPromise;

	    function enqueue(method, arg) {
	      function callInvokeWithMethodAndArg() {
	        return new PromiseImpl(function(resolve, reject) {
	          invoke(method, arg, resolve, reject);
	        });
	      }

	      return previousPromise =
	        // If enqueue has been called before, then we want to wait until
	        // all previous Promises have been resolved before calling invoke,
	        // so that results are always delivered in the correct order. If
	        // enqueue has not been called before, then it is important to
	        // call invoke immediately, without waiting on a callback to fire,
	        // so that the async generator function has the opportunity to do
	        // any necessary setup in a predictable way. This predictability
	        // is why the Promise constructor synchronously invokes its
	        // executor callback, and why async functions synchronously
	        // execute code before the first await. Since we implement simple
	        // async functions in terms of async generators, it is especially
	        // important to get this right, even though it requires care.
	        previousPromise ? previousPromise.then(
	          callInvokeWithMethodAndArg,
	          // Avoid propagating failures to Promises returned by later
	          // invocations of the iterator.
	          callInvokeWithMethodAndArg
	        ) : callInvokeWithMethodAndArg();
	    }

	    // Define the unified helper method that is used to implement .next,
	    // .throw, and .return (see defineIteratorMethods).
	    this._invoke = enqueue;
	  }

	  defineIteratorMethods(AsyncIterator.prototype);
	  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
	    return this;
	  };
	  exports.AsyncIterator = AsyncIterator;

	  // Note that simple async functions are implemented on top of
	  // AsyncIterator objects; they just return a Promise for the value of
	  // the final result produced by the iterator.
	  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
	    if (PromiseImpl === void 0) PromiseImpl = Promise;

	    var iter = new AsyncIterator(
	      wrap(innerFn, outerFn, self, tryLocsList),
	      PromiseImpl
	    );

	    return exports.isGeneratorFunction(outerFn)
	      ? iter // If outerFn is a generator, return the full iterator.
	      : iter.next().then(function(result) {
	          return result.done ? result.value : iter.next();
	        });
	  };

	  function makeInvokeMethod(innerFn, self, context) {
	    var state = GenStateSuspendedStart;

	    return function invoke(method, arg) {
	      if (state === GenStateExecuting) {
	        throw new Error("Generator is already running");
	      }

	      if (state === GenStateCompleted) {
	        if (method === "throw") {
	          throw arg;
	        }

	        // Be forgiving, per 25.3.3.3.3 of the spec:
	        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
	        return doneResult();
	      }

	      context.method = method;
	      context.arg = arg;

	      while (true) {
	        var delegate = context.delegate;
	        if (delegate) {
	          var delegateResult = maybeInvokeDelegate(delegate, context);
	          if (delegateResult) {
	            if (delegateResult === ContinueSentinel) continue;
	            return delegateResult;
	          }
	        }

	        if (context.method === "next") {
	          // Setting context._sent for legacy support of Babel's
	          // function.sent implementation.
	          context.sent = context._sent = context.arg;

	        } else if (context.method === "throw") {
	          if (state === GenStateSuspendedStart) {
	            state = GenStateCompleted;
	            throw context.arg;
	          }

	          context.dispatchException(context.arg);

	        } else if (context.method === "return") {
	          context.abrupt("return", context.arg);
	        }

	        state = GenStateExecuting;

	        var record = tryCatch(innerFn, self, context);
	        if (record.type === "normal") {
	          // If an exception is thrown from innerFn, we leave state ===
	          // GenStateExecuting and loop back for another invocation.
	          state = context.done
	            ? GenStateCompleted
	            : GenStateSuspendedYield;

	          if (record.arg === ContinueSentinel) {
	            continue;
	          }

	          return {
	            value: record.arg,
	            done: context.done
	          };

	        } else if (record.type === "throw") {
	          state = GenStateCompleted;
	          // Dispatch the exception by looping back around to the
	          // context.dispatchException(context.arg) call above.
	          context.method = "throw";
	          context.arg = record.arg;
	        }
	      }
	    };
	  }

	  // Call delegate.iterator[context.method](context.arg) and handle the
	  // result, either by returning a { value, done } result from the
	  // delegate iterator, or by modifying context.method and context.arg,
	  // setting context.delegate to null, and returning the ContinueSentinel.
	  function maybeInvokeDelegate(delegate, context) {
	    var method = delegate.iterator[context.method];
	    if (method === undefined$1) {
	      // A .throw or .return when the delegate iterator has no .throw
	      // method always terminates the yield* loop.
	      context.delegate = null;

	      if (context.method === "throw") {
	        // Note: ["return"] must be used for ES3 parsing compatibility.
	        if (delegate.iterator["return"]) {
	          // If the delegate iterator has a return method, give it a
	          // chance to clean up.
	          context.method = "return";
	          context.arg = undefined$1;
	          maybeInvokeDelegate(delegate, context);

	          if (context.method === "throw") {
	            // If maybeInvokeDelegate(context) changed context.method from
	            // "return" to "throw", let that override the TypeError below.
	            return ContinueSentinel;
	          }
	        }

	        context.method = "throw";
	        context.arg = new TypeError(
	          "The iterator does not provide a 'throw' method");
	      }

	      return ContinueSentinel;
	    }

	    var record = tryCatch(method, delegate.iterator, context.arg);

	    if (record.type === "throw") {
	      context.method = "throw";
	      context.arg = record.arg;
	      context.delegate = null;
	      return ContinueSentinel;
	    }

	    var info = record.arg;

	    if (! info) {
	      context.method = "throw";
	      context.arg = new TypeError("iterator result is not an object");
	      context.delegate = null;
	      return ContinueSentinel;
	    }

	    if (info.done) {
	      // Assign the result of the finished delegate to the temporary
	      // variable specified by delegate.resultName (see delegateYield).
	      context[delegate.resultName] = info.value;

	      // Resume execution at the desired location (see delegateYield).
	      context.next = delegate.nextLoc;

	      // If context.method was "throw" but the delegate handled the
	      // exception, let the outer generator proceed normally. If
	      // context.method was "next", forget context.arg since it has been
	      // "consumed" by the delegate iterator. If context.method was
	      // "return", allow the original .return call to continue in the
	      // outer generator.
	      if (context.method !== "return") {
	        context.method = "next";
	        context.arg = undefined$1;
	      }

	    } else {
	      // Re-yield the result returned by the delegate method.
	      return info;
	    }

	    // The delegate iterator is finished, so forget it and continue with
	    // the outer generator.
	    context.delegate = null;
	    return ContinueSentinel;
	  }

	  // Define Generator.prototype.{next,throw,return} in terms of the
	  // unified ._invoke helper method.
	  defineIteratorMethods(Gp);

	  define(Gp, toStringTagSymbol, "Generator");

	  // A Generator should always return itself as the iterator object when the
	  // @@iterator function is called on it. Some browsers' implementations of the
	  // iterator prototype chain incorrectly implement this, causing the Generator
	  // object to not be returned from this call. This ensures that doesn't happen.
	  // See https://github.com/facebook/regenerator/issues/274 for more details.
	  Gp[iteratorSymbol] = function() {
	    return this;
	  };

	  Gp.toString = function() {
	    return "[object Generator]";
	  };

	  function pushTryEntry(locs) {
	    var entry = { tryLoc: locs[0] };

	    if (1 in locs) {
	      entry.catchLoc = locs[1];
	    }

	    if (2 in locs) {
	      entry.finallyLoc = locs[2];
	      entry.afterLoc = locs[3];
	    }

	    this.tryEntries.push(entry);
	  }

	  function resetTryEntry(entry) {
	    var record = entry.completion || {};
	    record.type = "normal";
	    delete record.arg;
	    entry.completion = record;
	  }

	  function Context(tryLocsList) {
	    // The root entry object (effectively a try statement without a catch
	    // or a finally block) gives us a place to store values thrown from
	    // locations where there is no enclosing try statement.
	    this.tryEntries = [{ tryLoc: "root" }];
	    tryLocsList.forEach(pushTryEntry, this);
	    this.reset(true);
	  }

	  exports.keys = function(object) {
	    var keys = [];
	    for (var key in object) {
	      keys.push(key);
	    }
	    keys.reverse();

	    // Rather than returning an object with a next method, we keep
	    // things simple and return the next function itself.
	    return function next() {
	      while (keys.length) {
	        var key = keys.pop();
	        if (key in object) {
	          next.value = key;
	          next.done = false;
	          return next;
	        }
	      }

	      // To avoid creating an additional object, we just hang the .value
	      // and .done properties off the next function object itself. This
	      // also ensures that the minifier will not anonymize the function.
	      next.done = true;
	      return next;
	    };
	  };

	  function values(iterable) {
	    if (iterable) {
	      var iteratorMethod = iterable[iteratorSymbol];
	      if (iteratorMethod) {
	        return iteratorMethod.call(iterable);
	      }

	      if (typeof iterable.next === "function") {
	        return iterable;
	      }

	      if (!isNaN(iterable.length)) {
	        var i = -1, next = function next() {
	          while (++i < iterable.length) {
	            if (hasOwn.call(iterable, i)) {
	              next.value = iterable[i];
	              next.done = false;
	              return next;
	            }
	          }

	          next.value = undefined$1;
	          next.done = true;

	          return next;
	        };

	        return next.next = next;
	      }
	    }

	    // Return an iterator with no values.
	    return { next: doneResult };
	  }
	  exports.values = values;

	  function doneResult() {
	    return { value: undefined$1, done: true };
	  }

	  Context.prototype = {
	    constructor: Context,

	    reset: function(skipTempReset) {
	      this.prev = 0;
	      this.next = 0;
	      // Resetting context._sent for legacy support of Babel's
	      // function.sent implementation.
	      this.sent = this._sent = undefined$1;
	      this.done = false;
	      this.delegate = null;

	      this.method = "next";
	      this.arg = undefined$1;

	      this.tryEntries.forEach(resetTryEntry);

	      if (!skipTempReset) {
	        for (var name in this) {
	          // Not sure about the optimal order of these conditions:
	          if (name.charAt(0) === "t" &&
	              hasOwn.call(this, name) &&
	              !isNaN(+name.slice(1))) {
	            this[name] = undefined$1;
	          }
	        }
	      }
	    },

	    stop: function() {
	      this.done = true;

	      var rootEntry = this.tryEntries[0];
	      var rootRecord = rootEntry.completion;
	      if (rootRecord.type === "throw") {
	        throw rootRecord.arg;
	      }

	      return this.rval;
	    },

	    dispatchException: function(exception) {
	      if (this.done) {
	        throw exception;
	      }

	      var context = this;
	      function handle(loc, caught) {
	        record.type = "throw";
	        record.arg = exception;
	        context.next = loc;

	        if (caught) {
	          // If the dispatched exception was caught by a catch block,
	          // then let that catch block handle the exception normally.
	          context.method = "next";
	          context.arg = undefined$1;
	        }

	        return !! caught;
	      }

	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        var record = entry.completion;

	        if (entry.tryLoc === "root") {
	          // Exception thrown outside of any try block that could handle
	          // it, so set the completion value of the entire function to
	          // throw the exception.
	          return handle("end");
	        }

	        if (entry.tryLoc <= this.prev) {
	          var hasCatch = hasOwn.call(entry, "catchLoc");
	          var hasFinally = hasOwn.call(entry, "finallyLoc");

	          if (hasCatch && hasFinally) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            } else if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }

	          } else if (hasCatch) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            }

	          } else if (hasFinally) {
	            if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }

	          } else {
	            throw new Error("try statement without catch or finally");
	          }
	        }
	      }
	    },

	    abrupt: function(type, arg) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc <= this.prev &&
	            hasOwn.call(entry, "finallyLoc") &&
	            this.prev < entry.finallyLoc) {
	          var finallyEntry = entry;
	          break;
	        }
	      }

	      if (finallyEntry &&
	          (type === "break" ||
	           type === "continue") &&
	          finallyEntry.tryLoc <= arg &&
	          arg <= finallyEntry.finallyLoc) {
	        // Ignore the finally entry if control is not jumping to a
	        // location outside the try/catch block.
	        finallyEntry = null;
	      }

	      var record = finallyEntry ? finallyEntry.completion : {};
	      record.type = type;
	      record.arg = arg;

	      if (finallyEntry) {
	        this.method = "next";
	        this.next = finallyEntry.finallyLoc;
	        return ContinueSentinel;
	      }

	      return this.complete(record);
	    },

	    complete: function(record, afterLoc) {
	      if (record.type === "throw") {
	        throw record.arg;
	      }

	      if (record.type === "break" ||
	          record.type === "continue") {
	        this.next = record.arg;
	      } else if (record.type === "return") {
	        this.rval = this.arg = record.arg;
	        this.method = "return";
	        this.next = "end";
	      } else if (record.type === "normal" && afterLoc) {
	        this.next = afterLoc;
	      }

	      return ContinueSentinel;
	    },

	    finish: function(finallyLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.finallyLoc === finallyLoc) {
	          this.complete(entry.completion, entry.afterLoc);
	          resetTryEntry(entry);
	          return ContinueSentinel;
	        }
	      }
	    },

	    "catch": function(tryLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc === tryLoc) {
	          var record = entry.completion;
	          if (record.type === "throw") {
	            var thrown = record.arg;
	            resetTryEntry(entry);
	          }
	          return thrown;
	        }
	      }

	      // The context.catch method must only be called with a location
	      // argument that corresponds to a known catch block.
	      throw new Error("illegal catch attempt");
	    },

	    delegateYield: function(iterable, resultName, nextLoc) {
	      this.delegate = {
	        iterator: values(iterable),
	        resultName: resultName,
	        nextLoc: nextLoc
	      };

	      if (this.method === "next") {
	        // Deliberately forget the last sent value so that we don't
	        // accidentally pass it on to the delegate.
	        this.arg = undefined$1;
	      }

	      return ContinueSentinel;
	    }
	  };

	  // Regardless of whether this script is executing as a CommonJS module
	  // or not, return the runtime object so that we can declare the variable
	  // regeneratorRuntime in the outer scope, which allows this module to be
	  // injected easily by `bin/regenerator --include-runtime script.js`.
	  return exports;

	}(
	  // If this script is executing as a CommonJS module, use module.exports
	  // as the regeneratorRuntime namespace. Otherwise create a new empty
	  // object. Either way, the resulting object will be used to initialize
	  // the regeneratorRuntime variable at the top of this file.
	  module.exports 
	));

	try {
	  regeneratorRuntime = runtime;
	} catch (accidentalStrictMode) {
	  // This module should not be running in strict mode, so the above
	  // assignment should always work unless something is misconfigured. Just
	  // in case runtime.js accidentally runs in strict mode, we can escape
	  // strict mode using a global Function call. This could conceivably fail
	  // if a Content Security Policy forbids using Function, but in that case
	  // the proper solution is to fix the accidental strict mode problem. If
	  // you've misconfigured your bundler to force strict mode and applied a
	  // CSP to forbid Function, and you're not willing to fix either of those
	  // problems, please detail your unique predicament in a GitHub issue.
	  Function("r", "regeneratorRuntime = r")(runtime);
	}
	});

	var regenerator = runtime_1;

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

	var classCallCheck = _classCallCheck;

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

	var createClass = _createClass;

	/**
	 * @module ol/style/IconAnchorUnits
	 */
	/**
	 * Icon anchor units. One of 'fraction', 'pixels'.
	 * @enum {string}
	 */
	var IconAnchorUnits = {
	    /**
	     * Anchor is a fraction
	     * @api
	     */
	    FRACTION: 'fraction',
	    /**
	     * Anchor is in pixels
	     * @api
	     */
	    PIXELS: 'pixels',
	};

	class Loader {
	    constructor(apiKey = null, options = {}) {
	        this.apiKey = apiKey;
	        this.options = options;
	        if (typeof window === 'undefined') {
	            throw new Error('google-maps is supported only in browser environment');
	        }
	    }
	    load() {
	        if (typeof this.api !== 'undefined') {
	            return Promise.resolve(this.api);
	        }
	        if (typeof this.loader !== 'undefined') {
	            return this.loader;
	        }
	        window[Loader.CALLBACK_NAME] = () => {
	            this.api = window['google'];
	            if (typeof this.resolve === 'undefined') {
	                throw new Error('Should not happen');
	            }
	            this.resolve(this.api);
	        };
	        window['gm_authFailure'] = () => {
	            if (typeof this.reject === 'undefined') {
	                throw new Error('Should not happen');
	            }
	            this.reject(new Error('google-maps: authentication error'));
	        };
	        return this.loader = new Promise((resolve, reject) => {
	            this.resolve = resolve;
	            this.reject = reject;
	            const script = document.createElement('script');
	            script.src = this.createUrl();
	            script.async = true;
	            script.onerror = (e) => reject(e);
	            document.head.appendChild(script);
	        });
	    }
	    createUrl() {
	        const parameters = [
	            `callback=${Loader.CALLBACK_NAME}`,
	        ];
	        if (this.apiKey) {
	            parameters.push(`key=${this.apiKey}`);
	        }
	        for (let name in this.options) {
	            if (this.options.hasOwnProperty(name)) {
	                let value = this.options[name];
	                if (name === 'version') {
	                    name = 'v';
	                }
	                if (name === 'libraries') {
	                    value = value.join(',');
	                }
	                parameters.push(`${name}=${value}`);
	            }
	        }
	        return `https://maps.googleapis.com/maps/api/js?${parameters.join('&')}`;
	    }
	}
	Loader.CALLBACK_NAME = '_dk_google_maps_loader_cb';

	var img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANcAAANDCAYAAAA+Yop9AADAlElEQVR4AeyaA3Bd6xbHU7u9qo0k52TvffTFVa5tO9lJ+Vzbthle1nHdmLVtX7sI9v+tNTn3TXl18E5n9pr5zZqFy9X//nS8ANyEbq403bS93aphX9RDOK5644SqsOeY8173iAH4Q+ji0s2dwqqB/VHeOKM+n5gwOHbh7GHrVycMjuOY81zXxfWnTTddWFGVSUCtSnb3DI+e/e/rX258FCj2x1fkKS65trtnBNVbg/p0cf2OGSTxiEEW77OnUDd91aqN02rYkjn9D6IwEOVZZq00QwF7FAZgyez+h3A6Ioz7vBw05NStTNQgGhANiZZEW/Ycc57r3HdPiUsxi6k+fgLhr1gxJMrCHhxz3r3j1M1PEYPa+IglLdqLBPKLKR7s9X8yOlc9gPORz62NjQByrCjdIhMSe4otSOc81bnPCeKqQtQjmhOGM0ntXymMC15G/lWO7fn6RFXC6wY8V1xGWeyNet0KZEtAvqQh1+4p5jzV97h+jLoJYVM6GAVGdLdgZ6yCS4kydpEf2cOCDgYBqlvcL65u9+OC+iyLiMVUmsHCIshzvDY23Jniqk40JKSi+OA1OTFdcTY9BOyL4oMSKa8QjYka94S4aGUaxasUtklaWYZ005eJY85znftcOkVdWA0NssDxZQr4w6ZlSijPkMCe45PLFRipTn2N3bwtrIeTkc8unNFnFwqsKM+U+c8J2HO8YEaf3VR/jvucIK7aRBsiLGNxWLm2TQDbBdhzTPlHifZEXaKyx4urvUHg+iYJFcK6Hc5znft0CbjO6Iy7I3mKCciRNPsH7gZkcD59ugm+knt3EeV7uj2EM+EvL4sesGhQv144lRSKsmwFp5JDMah/T3y8aGA0nbleK9/brbETzlsNCIl4pTg+6OCXm4PAwmJfnBB4mPJvERbiAaLK7auXB4mLBqW89IQNKLx9oDcNluovPWkD9+sycL491NK/msUqgK2/PQeu22wCrb1FLTedt6rgqColJgyKPrL6WZSkSzg+tLl2bERLHB/WXLuW7IcLaY/j48VDVuG4asbeqKoOnrcaEoFEN9oGXsyN7ozLq03II58V3RXXtjwwkGpdiGZEdY8WF30tH+3GZ608Ht7d4Tr3uewGUV+1On34shW8/fvNOVBdfZXnILq67abwpPpY9Nw+e5Flg5ZrwpezWuHciKa4PLUltDwTkGHDx/P/eQKn1Sepv64D4qpGNCfCvlnXbEpBfBd8t8yAU+Nagf0xWjEPLZc3Uv0Zoi1Ri8TmwSuXn+jw9CM2oOi3v5hcpz5eubx1KTjf6P9ryAcvsbh+ew5U5/Mvi6uLm8TVEBfVFxKXRKB0rRllmRX/bqcHNELJBj9wXLLOjNToD4Az3V6lla6JA+KqQbQmntz9qbWQLzKupfvhh7h2YH8lPwA50Z2+o/rLhA9Rm8TmueJia+cr8FWqDD483z5YymdK+CpFBvfpMnCdmcwCKP7tlYu3hWaLQK2G/lW83GA4HNl+Z3qfUXtWPY8rySatLFMCC+pamhHsOf4lxaQdSnwa+Yn9JuNIpI8D4qpJtCWezlra5ZeSIn++zLgJvjX8YUPjcPu1fF2ikkeLi4alPv+YDTw4FlJZhkxUeI554M9RnfoidAm4dGuYu2ycCci9y4UG5VdOMIH6Ctx0BV8Nx9XAxbMHpyI/EGvnPAnkGOyXXDLYc7xh3hNAoT8Wzhq8jvqD+a9zRFzfrmv2Zm5sV5QW3ywujncv64SjK42j7StXHRYXie2m1cvj3rkkk/ihS5gNRz9TAP4ibZahEUcSFIR1toHqP7l2lLp1CbVV9TEKbI9RgAIJ5Vn8cSOyZfCZd9dSBfyo3znU5p5Va29UXZxWn/5s4T/OYYcJf+/dHcg3VAjfvsvhuO8/I4HtJny+8G8XuJ9+LlXPgTeuFkRn2hZu3LI47CZxcbznU+sWqj9CtLGLsRKJzTPF5e9v6yqbBHrRIXlrL1nb9K4RW7r5IL+fAew3vWfENsr/43ULr1z8xvKhLgPXGM1hvLckSiP9LUhVJZyd6YsvY4w4M9UXaaofulHeRxKapIhFbjpvNcCliCeTYnri602P4MMeA84gj4UlA9lGu7j8oPbse/mrTY8iMboXcCn8SVq5GvxFcVUlGhNW4t1fxXWjp/wHhD/RjKhGYvMi75ni6mAUV06ukIEMSeOvI/LkCnLZ2+H8FkkryZDhbXTFuUs3xSyW93rbgqOxMk7OlbW9wxXsHiJj52AZ7PeOUHBipqKdiJMxsqcFJLCDrl+5utXEEdWWt7rP1KVzh6TPn9bvM+RagRw/LJv2HHsSlxnzpvZJjp43JLEo6T8TcFi1kbhqOXAVfz/hTTxxF3E9SfgSD3r0OxdtMR4KCbIB2yXtSor8m4/IV1MrbgxffZp/CiUCdTk41/iBHoUSStZK0LIlnB4p48wo5X+cGlYxn+vpErBT0oQQaOsr6rj4zFWJHpDrk8A64JT62oKZg1aXZgcCuUZMGfom2KPQihlTBqdznfraU389/uscuNSoSzQlrHcRl41oZu+r5LHi8lNET/6BLq9MvyRKvymuK8kSQEOf3c/M4hqny8F5Rv8/Q9941gr+eF1JrriB+/FzmQTFwiJPq9h38TKdwWgOKRJ4Xv/5wAI/WbznpouNKjim+sfOH7zienYwkGdEn3+EkzcAhQLzZw5Jx3E1iPqqejloN/wivmVeTOgyFlRBXMga9hxznuvcRzkvT165Nm6abYKWReJa83viIr9Zwq44hbeGe708z+4j2hISYSX8iUAigBCEifAlmhLVPUxc0xYOMgM5v85BhpYr4fxEmVYwBWdHU0w1zvMcNJrHmkkmfnNc7iZxVSZxWeMWDF55NSsUKDBq73zYm7xBQ34A3RIOSSNxBXDff9k7D/Aoqq6PDyodCyUkQUp6Nntn28yGGkIvCSAQujQBRYo0RXoVkaIUaVZEei/SO6ErSFFBXtuLvnaqSCcw5ztn9kZHXfgysJmEeP/P839mZ3aIe537m3P7DQBcD6HzowvzCBZucCi/Tt8/hLBl34G7WKwAQLDStjC4qkcu+TZwyXBtNYPrG5ledEEoQcp6PYiOQldHt0AnoStzkBg6hpJIzpUrlw2PLnR5dA10CroRB7CYlMXC0e4nv5jvoH5GXoLg/89pqNGLDri0XObX8DkhXGmbGZxfp/c73rCo1TAXwuVY8M6ghWn7qgEc9kDLTgNvwAGqUiTAu9OHrEa4PAGC6wEDYA9zmLjxnIPF78t2cBVAewoXCXqhYfqYQoTm+3l6n5ZfuOihf78AwVvPqIlYa9NIgWJBoSN5Rg2TrNUj6AR0cw5TLDoYXRwdwh1K1z7++OOGx44d64ifg+ga/y6Yn5dGK+hkdGMOY5bI4fSNKby+SYarq/58yVFT/IUFeNzJZyjg9etrGFxbL+v3Vyqv0IsuyIJWw1zYOVzm6Noew+e8OXDHzGkDtq6f22f5e9P6b5395sDtB1f3HI/fRxjrWgEA7EEOUW6DH+LXOVjZB66C6Gr8re2MtjknT3rBVxSBDQzG9nQD7PQPF0W3Nwe64OpqWb//Lfwca3fP4GARYE3RMRZEqsT0388hIYdyl0j3Aw88QMfcu3bt+n7x4sVAL5S/32OALYinowpPRxnJQmG9qWm3VvrYTg0wIm2gUfGphlKD4YWn4ecNE/B7KkHsZjCwkxuw3vyMlLPF4bmzs3ImssIzjpNnpvxRNuWLo+87dFg+GOOEV3rcAa6dPrjmDvfBeGKeAyJtyrf0d3jEKMXBbcTrPoFWGR6pFP77Q/zAYnTwmTNn6nXr1g3q1q0Lmqa9SP/uDveHclBL80hWE53LolEZC2jUBf0//mmRDMO6/P8vueMzHfo962n6iV1dLQllCVx50A35Gz/YkCmLYiVab51CAw1tGvOcG8G5PVwzh7igVhWFhkKRNXxjAq+vhHITZNEcYiYFTl70E+iS/PeXuJOxfkXH/J999tmnbrcb4uPjYdOmTTf4/4sS/49DOYQqT0emT+vAem/ab+tkPRKN6uaCl7vf+Tm8M8gF/Tr4WnivbpEhPIeP98QWwWj0RDpmJ7gKoZvxjF7c8KYvHhYZ175LC49e3/pppayVjlJhfC+3xh8qL9/7jvyhUlFQK4X3/bhC1ghK+vdhkbZ29Pf8FLWS0BWke1cFdB3j78+AQxCsioMGDYJKlSppCQkJWqNGjQDVw3/08utgXsxtkZmAhYR5CyZW0l9YGj2LWKbCuJ5u7U5wzRrqgkgEioZH0XOokajA4xHqozkUrCnGaf50jpa4swyu3BysGJ5RShgcFB1r79qsngLfLZVhgF5uV34eQcWR3Ybyfar8l4dKTcUYra5TOf/4XAek1FUgJtbe2QCXEbDiHArvvVRH0MlmwOJRq9A333yzy+VyQWJiom6v1wupqanX8LuHqD6WUUh5Y0mTTOw4Thza2a134mOXiEatsC91NcIl8yKibCyeazRKZtNkp0adyfTv6e/kULjSjNP86RwhkxA2iY54niVwNUDL6WD58SN25hiF9a7vmcNzKDJG7j2c4OIPlYqK8V4Fj3/CNaWvC7ARZLRd9uzFf3cizi4PpL9zh+JVcUNxzpx41DUUYzMMxKJFi+xjx46FihUragRW5cqVgaJXixYt4NatW13SXwYmIlg8uqqUCfJ61XwOlwo9WnugOg2OdqizRxifAx7njHD6zvlzmNHfRYOot1dLUPTVuWhcaLmySr4cCtdK4zR/OsfPEsIm4TFL4LKjq2UgExXjrWj5I6JZj4GdPH9ELqpXURGQjulvz4nP63C9TPfzzB+UgfpLaQ6JWdVBs/Q6lgk/8ssvv6yluhYHSzd9puFCH3744WVqdTQRvchBvN5aLBM7kZsiZKqNqU31ETO7/3zJMcdfn8NkbOG1yWofhCoO/13tHF7f2v73af547WECC2HLEriaox838cYPioiyd+/fyfdQqS+FHupjj3sBUunc98Z8rbcbomIdL9H9Jt/8CWjZRPof5Zk5yCRYob169So9ffp0qFChgmaEKz16tWvXDm7evPm0yegVipZ59MpUITRP9u/I4fKtlwFBpVWAvX8+hwnP68PP+klZqJiqw4KTm/ceWA8dV31oSGY1ZPib5o/Xn0fYJIRNQtjoPsvgCueZINhE5ikeHmXv3PcpDhcNDt3KoFhprz4K4NZ2X/HkFWxNxOLjYBOZ3hi9UszM3UR77yJqPXbhwoWlsizrdSyKVB6PRzd9plZD+m7fvn3UhZAP62dm0kAwNregWb6F8TlQi2CRkl64slmGm/w5jO+lw/W8lEVKebJHty1v1gRItSPsdqDPeO25TIBror9p/nj9K4RNQtgkhM1SuBJ4sTDUJFwde7f1Ne8STL9+IENImAonlzhw1MY9wUUO4nXAjPb01UJHmkxDaFhYWPCKFStg3bp12uHDh/ecOnVqHgBMJtNnvLZ3/fr1F9577z1YsGCB0yS8wbzvKyiT4WpkfA4XN8pQvIxKC4ManwPB1UPKAsk1h4TqYO2K0xB23bAzTtuK15y1BpcIMFynbjfNH78rhrBJCJulcNVDlzILFzbNP9Wrje+h0igAGueGyyjTiq90rr9Jhz2rw/XCXcAVjE7kRdWMqFE6MGYhPnDgQDUO8cPowuhi3IX5tUcOHTpUja7xyGWm5bAiOiyz4eLPQYfp+2UylAhX4XNsndU4XNQPhnB1l7JAWAwcDKlxQFAZBnUTYFC/ee+hAQQr+E7T/PH7JDyXyLzV0BK4UtChZuEqE2F7smtLWnnIV64/8I6D1sWDHVMd+jk9bGrFQrj63gVcIby/KkLKmMynAc1h4cOh7jwSg+4NfBoCAldtvf+Rv+Q+m+3QG5b2vuk0vuQIrk5ZBNdALA7+E65UHa7BAY5co/1N86fr6WAhbBLCZhlc5t/6VCyMjGvToYkHflkl49vSAfNfctG0En1UxvfLfeuV92ztQbhYTw5XZr31TURfS22MvpkJV1L3Vvqy4non8YdvOzTchAE2U5/WPr0Vl/rBwCZnzXjC8Mojim2aUeuvxUL8vPmNWhCRODzgral+J0tysMh4blmx8K7rK/nz5yvlcCn/iYhV/hcZq3xnY8r3LpdjdJysfEfndF12Kv8tXjzIbqquYr6+YqLeaKmN9cbMXFrNUzVB0SdCUvGwZQMP4DVoluzRz/tgfax2VX0VriekLFBRdXSepGa9d66engyXt7l1r5mRDHhtl6vm4IetgouAwqPlTfF329IWyjNOQYOL0dFo8xnedEubiRZPq2xo8bRAeYt5cTZvfEFynqJeHeZ8QV79nFwoxJtlOziOG9zyKmxn8NNrpWg5a90/jiupwQ4GU0c2hZwMl4k+Iotsvo/IRF+dBTbRV5fTFVVleMjumdUhbaNdu74xDv43KET3tTU2SNvAtKPzK0PF+v0cAYZrBhqMx6yCy8ToBstsdnSDiVEmFtjEKJOcrtpNnn/u6lYHzulj+jqKZ2aEwanXy8CtXb5r1OfVoEWvIZk8YsNo6+EyPy7PnK0Zl+dnfKT1NjE+MudrWN82O2hBmksrfTOiaWkIWiuePl9cRVNmbDBmYKuDOX8+l8kR5SZs3YhyPyP7LbKfkf1CC15tALAnBtZNqQ3aDh9UZPq8BVsLYWcsLJlYD3I+XObnQpm3JXOh/M9Jyyz7n5MmVLVR3/KfL6qIS0knwKIJ9TVItf/RzwUI15qpdbVDcyrDF4srQLVGL1TK+XCZn8Vr0hbM4vU/mzqz0nGb2dRCWJcaRcW+iUObf74YoxPChRHLBxZ59dQ68OrgFidppAbe+3LOh8v8+hPmbP36E8Z1QAKVjlDyndcBEVoxOenBhi17jsSxhY8vnlAPCKIvl+BmJgsq6aB9MKUueOsOjExq1ueF5ZOSA7pJxLRpUx9FV6Bj9oPLxMpJJpxVKycZV7DyoktyMEIymJZQg4P5v43N+ApWQvPGN9Dh+nhOIux7ryp9zrS6FgJV8d133+l89OiRznSkc7TEnW3gMrvmnz9npzX/ChiKn0nocjwtBFsQT0+wwXQexD9HoF38hdAMXSvjQ7OE5hNcu+Jwh8fqNN2E4NKWZh5cT+Ps8c4A0JmOdI6QSQibREc8z1ZwmVmtNorXP7L1arWoImjGYUnh6XkCXRddmzfqJPPvWvK0luVR1uTa5kJzxj2hw7V+em1Y9XqS/nnha/UzBa4ZM6Y3wvVQdLDoSOf4Wc/reLQUrpy7zrp55eJN+XnIAqLAaT41yX8YDSsRLIxYN+jzsknJmRW5qm/cuLGzpmmdt2zZQpGrLkKmg0VHhC27wmVeQkJPdegytFnb7iPadujav91TXZ+nz+07dH0lE8B6CN35+PHjnXFZ8s4nT57sPH36NAIsN8ImIWx0j4BLSOgu4PLu2bOb6lt/eO/evQSXF2GTEDYJYaP7BFwmJSTganflypW/wEXndD09vyNsAi6TEhJg5X/vvZmdr127ZoRLP6fr9D3ld4RNwCV0FxKAxaP/Ahed0/X0/I6wSQgb3SvgMiMhIX9wGfM7novIlTkSEnCJ1kIhIQGXYe3y6ui2dJSyk8Su/+3QI9F97LIaK2WRRowYUQqtcpfIRLgSCCiDE+5buBwudTxtY9M+xaNvCUpHOqfrUtZIiD8XhAleaO+G6f1d+qq7tMtJrF39okI5pZDFYFVAe9F50fnQFdEeiyKZ0fcPXPg2PNyxqce3EcNuWkWV6Uc6p+v0vWS5hJhD3dSmoQfwedC+XZq+rHWqb3dP2u41Jk4FBKygRWA9hq7s53pNdIF/1batJtbLG9y2kUd/YLQJw7UtMlzfwo94Ttfpe7xvkGSVhOi5NEqqrvh5Lr7PBNuS0U6IZeoxi+CKQ4f6uR6GjhRw+d/hEH7fwMD3APFoMJ3Tdfqe7pMskxAWyU98PNOhT6fnYBmtXyPwKldUqGRRxgK4Isi3ga6kgOtvwnJ7TL2aCi2frPEH6P8h4vd0H90vWSEhejYA+3xRy/9z8RURX+pm3eYMCNETfzvPZbgm4Prb+uSVO6TQrpL0wG5v+p7uo/slSyTkdtPWubd/6ZGpDjb1RRfBNcgCsB7l9asU3phRCN0UXZ2+C8C6hHnR/dHf8mPebDnN30TRo3TNRAVg/50jF31P99H9kiUSomI4Ra3bRi5e7+rRWo9czSyAqxGHqgB3QX7MT98FAK7+X66sCFf3xQMd177ZeEY2m+ZvXhGx6o0fVshww0/Zns7p+vfLZYjE+yQrJfq1Fr07xEVFP83fc0Ho6DsCCywAqxC64h2+r0Sw3SNc3xJYtC48Hbe8VfNMNpvmb14ut9oyuboveiFI+NBktO9I53Sdvne68e1omYQURSmAxXD4YbmsA5b+TOh4Yztdk6FpPQXCmXrZ7lQvxXsVdybCFcs7j0vfprWwDDoqsJGr6eLPj2x98X6f5i/ZnCpUr6LAiTkOuLFF1q5tlumo72pYubIC9L2qKKpktQRgXgJs7kgnXNyAzwThurbJAb++aYOtzSLgaAdZ+64bg3eecUGMrL6biXDV4Mea/r5DP4Cuco9wxaPfQ1/djhsvnFxTAbbO6bDWOM0fYbt/pvnj285mc6gwqqELdjSUr+1vYLt1oFk0HOkQAx82joZ9tW3weQrTJjVzabGyCnh/TclSCWFU+qyyQ4FltR2wp264tr1KGdhRORIONpbhi14MLmKR/re3mVapvAJuj9owk+Cqhy6Kru3nuyT0o/faakhg/bSpPNw6oMLlPfF6BNv+dlU4eGB/l/tymn8sU7/dM8WhN/mi4dZeGW7tkTW0/lkjfyhD2iqm/bxKhihL+7qEouxqpedbuQHw//+PE9itk8Nl+O8wGa7TOu37ZfhuFIO0XTJcWcO0k6/JEMkC/3w4VAxd+TZw1UaXRSvogvcA16az28v9ZavW40srwaebhy4zTvNH2O6Haf68L2UX8xUD9frWP31jB4PfFvpaDJNqKGBjlg0aFXDFqbVHdXXDra1Mo+fw7UimfTOYwZUNVO9icOotGc7Mws+pDK4uZtqYDm6Ic6jzAgxXGLoKh6vWbeCqwZvpg+4BrgnfravwF7hwx37YOSv5tHGaP8KW/af5Y9SSG9bxAGxHuDax28KVhg/1/FxGEMLQzm6wy2oXyRIJ4Z7Ijt7Y1A7bfc/iynoGX/VDkGhEDT6viysZ/KenjLDJQPBdmck0LLrTYOtSgY5e/FjfX5GRHwvdY7GwDUUqgspovA733TR/hKTz4GfwrbgFH9bGO8N19n0Gt1IZLHrZSZFrlli30BoVLa0+1ri2AkDPhpuexeV1vFSRKsO3IxjWvWQsHjK4to5pS/s4qXHjYGbVvfxcqx/I3SQPzqv8B1j0+eDKbqnGaf54T/af5h8T51lCI6uvb0C41t8BLnyAp9/xQXYcWw8jbcrXkmUSK+4yh6qPIbyiA4Xezgfv8s9n3mVworsMP70uwy0ELG0e02hKiuxSHZkAV/1MhushasS4ecCrw/X1B7h10abBK9LhQtgkhM3yaf5m11mvGxHrOfX1Ihmu4kO7psMl3wYuBj9OlamMT0VDhMsLtJuJcZ317L5W/AMPPEDX8t2Pa8WHx9IYQ1+9lw+uNh711sL/jUbAnpHhmyW+XR+XP69Hrz0WwVUvwNuz7jyfWlaHixo49i1sdTwdLoRNQtisnyxpcoeQx2zM99CurWXwDUaktO3+I9etnQw29HMC4BH2UZOvCoUeLUaZNMb8DiHW73LCrxf+5ZdfzvXo0SOagLufdjnBetfPVOf6dTo1Lv1tFA1vcPr+FYxcoxhM7uqihie4hY0b5eIVatwoHmC4GqIZ2snN0I0DDNe4b9f6GjYogu3ASJZ2/XI3ggthkxA26+EysbdV8ZKlI2s3SVIA9jJNw8g1+jkaZuMfLhq0O6Ipfr/H95km75UOi2lIf8fc3lbW78/10EMP0TH/2bNn3+zZsyd8//33jeg330/7cyFch86vQXhewyi1npcujFOC9FZDBr+Mx+fUygVrxjqpjqZN7uQC7CObFGC4CqAL/c0FAgxXWPoO/lvfqnZ9zZvNNqdP80fYJIRNQtishcvEroxB0bGOISO7uvVi3o7JTujTjj7fHq5hTVzw+TyHfs/wZ90QFSP3p79jYldGy3eWzJUrFx0fA4BhHTp0gCFDhsDWrVvj/f8NE2mwvli46gSWLM5PZbAKwUnbzqHaZphvt4zBD2MYHHzJAeE2Vbu2msE7z7kocm2SLJBVu/gjbBLCZv00fxP7CT8WZXOv+GC8Uy9CdG7ugW4t+bQTPn6NWgbpmA7X6JYumDXcpRcN3x/mgmibayY1JpjaT9j6PZGDd+3aJU+bNg0URdGmTp0KCBlFqND7aU/kGKa+vgwbnmCxXXsy2UMlCO36NhnOztKLhHysIdPrXZcQwLA4FSLj9PGGJ8qXVYpJQvcOl4md8IvEMddb3Vp54MO3HfoiNO0aeTTYo7cYUocl7B3vgJv04DhcY590Ad0Ph5i29w0nRNk8u2gzPRM74Vu9m39onTp1Ht+2bRu4XC6oUKECLFiwAPB6XvruftrNH/utSjpcKiQmKFAqStWLfBS1zs1hcGExh0uvkyFwWHRshQBKRb2ZtKaFgKsBWv5/MuWjdgQsOk45YGeO/k/UovoXh2szg9kv6FHqz8jVyqVFxLBbrRsqoKoqMMZ6UbHwzpmTb3ZuXv7TYM4FfvrppwtutxsSExO18uXLw6pVq24RXP7vN5+GrFAsUyfPG+bSJ0leXs3g+7EypPFSBoH24xgGa/th0TBOPSkFXAIuO7qaodJ+JxdBF8KWP1vVSjTV3weXtonB8DZugD1/wjWyGdOmTn8DHshdqDp2D5Wkf5uBzFmaRx+zMpMGvw0Yly5dmlGzZk0c0V9ZQ7igbNmygIM9fyTojPebT0PWKtquOtvWp6IhDYfCJviXGJxeLPMOZmqS16OXNrajC3Bc4idSQCXgao5+3ET9RL9PUVSA/RyujQza13YTbPRG9LUWNmMw/Y2306jj1cTfDkYn8AhkRmbTYGzAKAwAA7p27QoVK1YksAgwiI+Ph48++ugQfv+wKWBNpMEqlYpW07TNvvrW6SkMJrTnpQyE68IiGb57GY+TmDaolRuYUx11V1uNPu5VCgZ7owVc3Hzr1aroYJNv53xRcV59FAB1JMMGBrXK/lFM5JFLhhEvjf4Pb2Qw++ZPMZF+02kwOGT16tW2d955h2D6Ayyy1+uFL7/8cj0Vh+newKXBetlkdersoS690en8+9QH6dBqVFb056ThIOwLixj88AqDAyNkiLSrqyUTKlba25K6WuaNdMLbg11QrbJypVgpNcxPk3wu8r8JrgS0/S5a1fLQeg2Q6qsYwzoG1eIV+HW1DGkcrpeaO6BLtx53kzmD0A04lBnQXaeB7i+6fv16iIyMpNZBHSiqa1HRkM5/++239wzF2cClwfppKHZqNaTFay4uZ/DrJEZ1rOteTOPSUU4Agm6lDKM6uMHuUJdLGVTxMt7yo7u76O/Cze36AqQalWaaJHngb/1cDfm0/gR0A3TefwNc9dCl7iJj5kO4rlzcKOsthLCGQVWE68gsB/1P1uteg1OcUL9hk2mUge+iWJXIi3kZ0F2nIbRw4cIlvv7669UAMAnrXG8fPXp0z5w5cwBbDXXYUGPp5Uz3BzwN1k9FubniZd+omdRBDrA51Iu8wWM29ouloT/DpvgJdasoD5pYNns/7NNHgGiG9VO0Lxc6IDRcHcLhamyIWHSeG93o3wBXinEYkAkXtDHlO5pKfnatDLDVrpVXFNg4yUlLKOvFwyFNXKCWq0Tl9yCzRTXeXxQhZUym0uDHhTlARXn9qtivv/46sV+/foBTFHqa+P0m0mC9KpZTiiJI7+PiQhDrUH9IKK9guu9Nzet5zsPufw6vomvBZdR5s2fPDva3TgZes6Mfz+lwNTI2UphwSGREWEKs3bMVH9Yl2ekFp1v5vV1jD6wY64TvlsrQqoYHom2s913CVdHE4NgMpMF0cfHhc+fOdQ8JCTEREU2kIYdIdvqNXPDNYgcUK6X0njRpUsTw4cP/tctZ10JH3kMGehSdj7/1c9vsjpdi7J4t0djb73IrxzlYpkdJoGvyf5sBZTANJowj4kuY+O0m0pCzFBymln+5u9u3Nv12GaipH3bJ0CBJgTI2NbXbs51Kjxw5soIfuKqhC+V0uFxoL4ESgLc9HYsZgCt0l3+nOG9az6hMpcECG9KQ8/V4hPp882QPDhK2wYn+kdr+xtFw8hmmfTdRhnwlPC/TGhYYvWINYDnRFXN8nYuD0BAdlI0ypsyb1jOibJ6GnC+nW91+ayGDE33ZrW9HOnAZAX0MI43a0cY/5YS6jdu2HTVqVEUELERfx5C3GpJzOlykOmiWTd78QRwUE4NHs3Macr4qlle2QapvAua3o5h2czeDX6bS2h2ypq1kkFje88ttpqIk5Xy4+Ehy43ynLHIwOt7kGz+bpyHnCzuRZ8E23+iPc/N8/Z6XVjH4so9vp5v1g51QJMzb/m9gPYx2oENyOlwkOzrZOE3DYoegY9FNJHPK5mnI+SpSyvvS9dV8uhGfL0agnRyKkWyCDIDnDaoq1/4Gl4J+jI45Hi6uCug6WZA5g9ExfKGY/JI5ZfM05Hw9/Lj3mVOLZLi0QgeMz3SW4fTbDI4iYL+slrXVGL2CI7wN/SytVu/ftD+X1zBlIsSCin+QYeGYAGTK7JaGnK98wd7kY2874Oe39SIhRS8+01mGCxOZ1iTZo8EHDEpEq8sMcNVBR6Br/ts2vyvDm5EVM2tPmMyQwXxwazLvDwrAgM5smYacr8LeMm/2c0HPxh69jnVhMUUvPhlzLIOezTzwWGnvtCoVlRIGuGpxwOLQxf9tO0s+iE7kQ4uc6GCy2WFGfqbCB/FRC1XQTTkEAVC2TkPO56uUt0qRMt7RR95x0JJ7Gi2XTRMyz7zBtIW9nCAVja/ytzpXMo9cVdC5/63btj6CTuBRoDI61rDEWAh36G0cwu8N4m94hb/lG1uxJJn1aRAa/rRLH1d6cgwNg6JWQxnOjmXaiHZuCIlUVSNcYk/kv0aBKHR1XmlP4hlVRTN0DP8+Gm1Du9Dl0TV45GiE9lrZ92N9GoSYrG6A/QjV20zrQMXED/HzYqbdnGaH0Bh1qQGuBgKu2+sxdDjPlB6e6cqi43lmdfIIEcqXOrNc1qdB6JHHvY0/muEAWMmgS2P3zYSyyp5JfRwwrpsLcErLcyJy3YOEhIqV8Y7v2NDzS3Cktzmdd+7+YnM/ozOeEHDdo4SEXnrppbLUcIFjCxPxSK6CLivg+pdLSEjAJSQk4BISEnAJCQkJuISEBFxCQgIus4qT1erotnSUhLKNZFluxxgbicc+6Fjp/pGAy+FSx9N2Qu1TPDCwk1s/0jldl4SyTE6nczzCBJ06dYKhQ4dCnz599CW67Xb7F+XKlcvuqy4JuDBKHe7Y1AM3t+sbL2iwk+lHOqfr9L1kuYQcDsemlJQUOHz4sHbkyBHt448/hkOHDsGJEye0iRMnQlxcHC3ZXVDKnhJwOV3qoLaNPL716ramr7jKj3hO1+l7vG+wZJmEXC5XI9oGiUDCHVrgww8//ItxuW5twoQJFMGOSdlTAi7ahOH3DQx8YOHRYL7nrv493SdZJiGMSidoN8wDBw4QTH5N4FWqVAkYY9ltHpqAK9auxtSrqeizTnnE+ofpOn1P99H9klUScMGxY8f8Ri1uKi5Cr169CK7uUvaSgMvG1ModUvhm41tub/qe7ovF+yVLJERbzn7++ecaB8mvqQ42ZMgQgmuQlL0k4MLWwNI1ExWA/XeOXPQ93Uf3S5ZIKCYmBihq3SlyUb2rffv2BFczKRtK1Lli1RvfL/dN5TYCZtzp4ocVMkTgfZKVEv1ai3CKh95S6A8srIvRdwQWSNlTAi6XW22eXN0XvRAkWq8O7TvSOV1Pwu/pPskyCSmKUoDA2bRpkw4YwcRN55Camgr16jcAmy3usuxwXvJ6vW4pe0nApapqPG4FeqtqZQV+WoBAIVQUsdLw+PlcB1TB4mCcU/3No6iKJGQ1YF5saofx48cDbUm7du1aWLRoEUyaNBnat20FY14aoE2d/BoMH9wb4uzyu1L2kYDL6VYj4hUFjk52aCd6ylpqzVhIrVkGPmoRAbuTw2BfUgzsaObQJtZ3Au5mCLJbDZGErO5I/gwhgy5dukDnzp21tm3bQps2baB///4wddp02LJuIbw+prdWNcELbrfSUMoeEnDZneqIMa1cADuYdnMng1t7Zbi6gZYvluG70TKceE6GU2/g9bkMynkVWvUnnyRkmbDIV6njU21h79692tSpUzWcXg8DBgyALVu2wKeffgqLFy/CERuHYcOGTdrIwT1Blh0gZRsJuEa/2toFNzYaOpHxSMsYpyFsZ97zXbu6kEGreh7Aja7FgFFr4ard67lnsMn9kEbDnrDZXaP9nTdu3AgHDx7EouIGWLl0Nhw5chRmvT9Xe/apBiA73POkbCEB13MDUtxwYy2HaovBCNh5hOoKfnd1AYOW9T0Qw1SnJGSZoqJtjqfbN4WPMTpRk/zOnTuhd+/eeiMHNWzs3r0bxo0bA3t2bdEBe23cKK1yBTc4nJ5SUtZKwMVc3sadkz1wY6V/uH5DuC6vweiFx+ZJHohzlrNJ2V+50LnRebgfku5TBZcIf6xhchU4xOGiaEVDojZs2PDHOe6yD8OH9MMWxCMY0TZpfbq1AjtzHpSyVAKux0JLhj3ZvIYC15cQTH4i14I/4WpcR4FHCwfRarWlslGGLYJmfK33FHQLvitKXXRtvgVRMv+uJTqJLxZa5n6Bzulg+kgNilIcKKqD0WeKXnoUGz5iJMydOQk+/ewYTJkyRatTPZ6il0MSshSuAoYtcurmzVegavl4FW4uZtr1bfI/4ZrH4Mo6H1yNaitQuGhwPb5sdDO+836YZL2MaSBYyqFj+TZDQXzd+GCD6TyIf45AuwhGE2nIUkXHxMCxzz6FhQsX/jGIl4/a+KOouGTJEujXfwBsXLcM9uzdB726YPSSXXskIUvgKoiuxt/gXp4Ri6MfirSrcH42gxt+Itc5vH6VGjsQLupILlyshMuQgWP52utNA7qRgfk0hGRwt5NQg4NNpCFr4YqO+fnoof0wDvu6qFHDOEojPXotXboU5s5bAIP7tITjn/8HZr77jlalEhbjmTuTt/QRcCk88zj97G9VKNquHNv3mgPStv8TrjMzEa5NvsjVECNX8dAy5Y1b9/AMWopn+kZ8zfYAyEQa7tIm0pDFcMUe2r9rAzz3XA848NF+Auofw6DWrVsHK1auhG7PdoDpr4/B6LVfe6p1I3A4XZOkTJGAKw/fiT6RA+FvZ8aiMXGud97q64JbO9Kb4vHI4Tr7Hq9zLWDQPFmB0JIR1fjfMu4dXASd/9FHH43lADDp7mQiDYGzAbCH0dEm02BBsdC2auOahdD3xf4w883xcODgQYLKWESkoVAYvZbB3LfHgC02RtuxaSm82L0ZMIdrkyQUWLgMO+Kz/2dP4eKlwm3N+rZzA+z0gXV1Ax05XLMYXFyO1+YzaNfQAyXLRCUbilQFR48eHZWWljad+l0uX768kL/1k9AVJPMykYaAOJj/3vwXL15s9eWXX67DOVSP8+s8DVmvOLv99amvvwbTp03VWjRrCJ988olGQNH/cwKMFw2xQ3kJbNmwDBBGsNnsON7QfaJcWW+At0gScOXmmTLGEGVu55C8hYrbWz2h+OZ0badoRUde55pDjRoyaCuY9nRTD+QvVKQ+7Y2FmfHJb7755iCOGgBVVeF///vf1wRbrly50qNAHV4vMiMTaTBv/G3pQBVG5zl16lTDn376aeXixYuhadOmcPz48au8scREGjJfqtdb0uVyQu3q5SE8IpLqXRrBtHnzZti+ffsfcK1ZvRpWrV4LzRpUgjyPhGE6MkMCrgZoGR2csSJRrhI1qyj6LoI3djD4aSLTbqTq0Uv7bRGDX15jsGa0EyJj2A0AeB2H3mi0EhFN5nM6nXDy5MkzvEgVaixmGTYKNyFzaTABVBECFl8Itc6ePbto5cqVNE5PT4Msy4BRi8AqZj4N1goH8U4eM2aMPkmSmuapIePgx4cIMB20ZcuWw5RXB2L0sp+UhAIOl51XzIubqG/kZw5Vn1pCcH0/ToZr22ixGhl3cWfw6zgGLzR0aF26dteX9CpbtiwkJCRoLpeLxrdd5w0MoX7+bmkefczJkIYAgJUHp2dUunTp0mys9NOUeAKKVkzS00CfsZiVpigK39bVfBosnvrvbNy4Mf1/16PXIiwKpm5eDh/xqShLliyGD1av0/r1aAmxcfInklBA4WqOftxk/SRPeKwOF1DE+v4Vpp36QKZioXZxJYNT4xk894Rbiy9XnuDSEhMTNYpY9Obs3r17mTs0MgSjE3gEMiHzafDj0AoVKpTEDldsZXtOj7C4xh/gYi70+wFNLwfqjKWZvKVMpCHLFRkZmUbpIq9esxZe6N0VcNk1Ha5t27YBFXPXrluvde3UDGSHa5QkFBC4wtFV76IolS88Rr0Ke2jXdhl+fJnBh2/6muYvr2ZwGuFqXxff9hUq/ZEp16xZAytWrGB3+G8Z3/wpJtJ/+zSYdzEc2VD7s88+2zdu3DjAyYT67+dpoAYBWmSzjLk0ZL0YY1NfeeUVKhrq9a5pE4ZhmqpSNNPrYwQYtRzOwZbDGBtbLQkFBK4EtP0u3vgFwqLVnyFVRrgQpjEM3hroa5qn0RlnEK4m1T0IV0UNi0/a+++/D1988UUlKg7yotedHMTrTxlaGfb2aTDvBx54ID3yFMQIxRCmixS9PB6PPuFwxowZ4fx7E2nIetmwKbBhw4bUAKOlpu6EDSvexjpW3HVqWKJ1DCmKpe7YDr2ee5qmoCyXhAICVz10qbvImA9HxylHUqc5aMd27dpEBoO7uAFSEa6NDM69yqBWRZdWo2YtjR7ehQsXqJJfFMHKaHN3Ii/mZUAm0mCu7lUcF3Nx9u3bl8bepWEDgIvX6cynIXsAdpNW3P3k08/gnSnDwM4cF3mDx2xc2CYNh0x9JjscE6pXq/KgJBQQuFKMw4BMOLR4UJFYLBr+0r+jG5ISFOj+pFuD3QjaZhl+e5VpTnu0tnffPurL6kR9QzwqZMQhvL8oQsqQzKfBRMNNHmx6B2wtbMdfDubTkE2EDTJFEaT3ESQC64eKFcoVljJVAq5Ghox0N5kvX2Q0610mMrax6lUpisHN7Uw7PY5pdpcK2GT/MGXKBx98kO43kzErmhgcayIN5pw3b1465kUH8ZeD+TT8ayXgqoWOvMeMGYR+lDG5b5yswrrXnNAwUQHmcL5Ona93OQqiJv+7GZDJNJh3qAVpEMqBcLnQ3gCNv8MIlbtkVKx7IYI1mfrC7mHMnokl2cykwbwtSoNQDoTrUT7INSiAGaswgXYP/17mTesZkYk0mLeFaRDKoZ3IddAsm7z5gzgoJgaP5pg0COVAuPhIcvPznTJhxHm8yTd+tk+DkBi4a0cnG6dpWGyCIhbdRDKt7J8GITGfqwK6ThZkzmB0DLoFbwQxqeyfBiEBF8lrmDIRYkHFP8iwcEwAMmX2TYOQgItUhjcjKybWnjCbIYP54NZk3h+USwqAsnsahARcpAfRiXxokRMdzB16D6M5QnhGD+PLlDXlEGSCsn8ahMS6hY+gE3gUqIyONayHEcIdehuH8HuD+Bte4W/5xhYvSWZ9GoQEXCajQBS6Oq+0J/GMqqIZOoZ/H422oV3o8ugaPHI0Qnut7/vJ+jQICbjM6jF0OM+UHp7pyvI+HpUXw2LTR5ajs17Wp0FIwCUkJCTgEhIScAkJCbiEhIQEXEJCAi6hnJ/hHpAyRwIuISFA8YmxIVJgJeASEnDdvHnzCi72OhBPIzJpjUYBV5ysVke3paOUbSRkl9U2+ExGoF9A26QAStM0SNeVK1f+17p16/oB3DdawOVwqeNj7Cq0T/HAwE5u/UjndF3KKgnRcxmNMEGvtm6Y3t8F43q6oEaiQs/mq/LllEcCFbkIMM1AGW4LtZqvHxIi4Lq3aHW4Y1MP3NwuAy0GCjuZfqRzuk7fS0KWS3aq61s18ACkMg12MY2WGNdSGcBHTFs1zgnRcSpUKKc8HDi40FzAtXXr1hG8qPiogMuknC51UNtGHv2B+bZspV39+RHP6Tp9j/cNloSsEj2XJ+pWUwA+/Ptz8X0m2JaNcUIsUz8PMFz/iGLXr1//pWfPnk14UTG3gCuDirSp8PsGw17IBvM9kvXv6T5JyDJhse/EwZkOSNv2J1hG0zV68SVWUqhkER5YuPxD9vPPP2/hA6NDBVz/j2Ltaky9mgrAPqbxB+j/IeL3dB/dLwlZIoxIAPv1qOX/uaAhlcGILm6Cq2vmwOW/qLhnz56xvKhYVMB1G9mYWrlDise3H/KW25u+p/vofknIEimKQnD5f+lxazsYTHzeRXD1zzy4/EexGzdunB85cuSTvKiYR8D1z6JH6ZqJd36IdJ2+p/vofknIElExnIqEt49cvsYn3JGG4GpqAVx+ITt9+vRuPneuhIDrb4qMVW98v1yGG37K9nRO139YIUME3icJWSYsJbw1Z4QLIFV/Dui/PheC7tZ2plHxMZMaNEwVFXEHz3co4Aq4DHK51SeTqvui1w39TSmjfUc6p+v0Pd0nCVkij6IeiWDqudI2L/x3vgw3d8rG56JHNGpFbFFfb8UdkVVwGVoTT8+cObMbrU0i4Ppnf8p3CRUV+GKeA9K2OvDtKOvHE3MdUA2Lg7JL/a8kZImwiBdcsYICl99mcLC1rK1qZIP/DIqEK2spejngBsJ1dJZDS65BWzupSwPciWwKKvx4C4dMDbhd44bo53Kr7VJqeODMJKbtrxUDO6qXgg+bl4HUOqVhf91YWNvcoTWt5gGXR31RErKirnVrzQQnXF/L4PclDI51kmEvPodtCWGwq24ZbW8DG3Qr54ZoWYV4r+K1DC4u4MKtbyfyRYCCJf8ScNkc6uJ5zzoB9jK4uVeG8xi9vhnsgC96yXDqTRkuvc9gYBM32J1qFylTJWR3qHOG037Um5n24wQZLq5gcHElg98WyvCfPjIc7yLDp8/IN397k8EHA5wQK6sbLYBLF3B99dVX8w270Pw/EnDNe/9pJ2g7eafxNp9/eJXBpQ/QCxCu1m56kI2kTJMQ1mlLuz0KwE6m/TyZwU+vM7iyRobTMxmcnc3gP70ZfPIUQjeRwbn3mbZ3nAOi7erOTIbL2IG8NX/+/BV4vSojG5kLuDAijZ/Q2kVw8QqzD7JfpjK4sITB5fkMXmjlhii7WkHKNAnRQNz1k51w/j2m/TKNwbcjZbi6icHpd31wnejF4JtBvs/nsTSxrJ8TYmR1USbBpQHXhQsXPk1JSUni/Vl5xdhCE2Jub6/BWOzTdnC4yNsQrilYHFnM4MpCBk838kCkI6GUdH8oFx//lof7oftg5HvtutRiu41pP2HU+vE1GX5+XaaXmy9yIUxfDfSBdeY9jFx47fWnXVRUfzWzRsVfu3btlzFjxrTlUBUQo+LNqQjaVrJMxIju9TwA2/+E6wZ+/nmKL3JdW8SgaV0F8uQv1JIW2cxm83woDYyv9Z6CbsF3RamLrs23IErm37VEJ6HLZrM0SFE29dTHsxxwagaDX6fL8E1/B1zdSGDJaKb7zCzfkXwBYRvZVq8H9wz0fK5bt25dX758+Qt8kdXHpAxLwFXAsEVOEsESXKJUvaRKvrem3pdihGspfsboVa2yArnzPUyZ2MkzcjO+836YZLH8pKEcOpZvMxTE140PNpjOg/jnCLQrq9NglMOpVtfHd65n2nmEa1VPLBrOkeHqBioSUqTicBmOVA9+vpkbsL7cWAqAOFRpe/fuHU8Nlvz/WQYl4CqIrsbf4F50ScPmBQWwYgywmde3CK4dDKhS/ftyBjcxennjVfjbZgbFeYaugW4a8I0MzKchI7udhKbbRBqsqGsd2TbNCecQrMnPuOA/bzmw0xiL5IvSo5bRMvy+lMFVhOup+h6qc8WLNTSyFi6FZx7nbfa3KhQeqxz9dj6NyPANr7mRyuCH8QwurUK4MHKVK4dw5cpTyvDvQrmLo0vxTN8oEMUI82kwb+vT4F9Rceoj8fEqwEamnZ7GINzmpZEXcH27f7DOYdT6dqEMaUsY1K+mQKRdLSlWf8oauPLwnegT0cF32JmxaESM6+3lY5xwk9e7CK7vXmZweQ2DNISrSoICBQoVifH3NwwZNJoDwKQAyGQazDvwaTAt5lDL00iLtHUMOj7hgTaNPBrNQLiyzlAkfBeNR/r889sybHjdCbCMaV41S+bXCbgMO+KzDOwpXCza5pz4xgAX0DTyq+t9cH0/xhe5bixiUAffkoWLhjopc2dgQ7kkdACa7U2kwaRNpCHT5fGoU2gEPHYg/07PQEtlvJWQ7Cua0/H8LAbv93FqayYiXIvsEBGXFXAJuHLzTBmDDs5AhgqKinGMmPqi78FeXMGLha/i5+Uy3FzKtMZ1FQgtGc6jR4YiQB1eLzIt82kwb4vSYEo46+DYkVlY30r9s/GCota1zXh8R4Yrc5nWoaFHk50qKF4FVFUZLQlZDlcDtGwiUwaFR7Hek1/wdSSfX+CDixo0fp3K4MQsmUbEQwYaDYwNHkX47zBfJ/CfBqsilqF1Ec03O7egn6tj9cq+GeFXN8o6TGcoWi1mcHm17Gt+n80gMkujlYDLzivmxU1krOKlw+M6vtbLRYue6A81DSGjUQI/j2MwupULouMc46k1ybDtaTF+/gi6AK8bPbpkyRLnF198Uf+nn37qNX78+Eq8/mJCJtJgfpf+Yhz6R9EP89+dD507PDw8eP78+fKxY8eq4+S/Fr///nuvdu3aRfCGjmaZXCxs5nLTOiayPuXnAgJFMJ1CwE4udeiDd8/NYrDgRSfYZHWJlGUScDVHP26yflK8ROnYJi93cwPspjFtPrh+fQONRcP+Td34UN3P79692/Xjjz82xundPQHgVQRo8ZEjR/bh0ls/rFy5Et59910YMGAATJkyBT7//HM4dOhQPV5vkSVTMqQhAGC1bNkyWtO0IQAw8dSpU3NPnDixCUd0H96yZcuPq1evvr548WJ466234JVXXoFevXpBs2bN9LR8+eWXOzmElXgaAq5SUd7cLrcClzbKWto2jFqbZB2qGwsYdGns1lsOz87xFQnbN/BQvayWlCUScIWjq95FUSo4qERkrYEdPfrI+P+9jHBhBDv1FoPTCFfnJFnr+2J/GDVqFHTp0gUaNGgAXq8XVFXVjx6PB2RZhtGjRwNm3E8xAzfndabgXLlyleb9UhmV+TTc2UW//fbbEW3atAGXy/XHb46Pj4eyZctiF0M5qFChAl3T3G43vPHGG4C//4OXX345kiJc7ty56W+YSIPpBYLK4bJ1BJFGLYRn32NwayHTXuvsgjrVFQ32UX0rOxQJBVwJaPtdvPFDHitWplz3Vr6H/O1wgosq0zKcfY1Bs2oOrWWrJykTapUqVYLKlStDQkKCRpkzMTER5s6dS4M7V27YsIH6ovJzqP6oz6EbmFh73Hwa7uAHH3yQjgVwnNz0tm3b6r+bfjOa0qGVL19eh4vScOnSpSV4T0mCite/zKfBpJhTjaPVc7ePdcCpd2XYPsoBKbUUGu1+a0RXN9zajGDNYrCwX1YXCQVc9dC8o9d0naQwFjng9FoZvhuBb9FtvEI9gUGN8jJ8/8NPK+ltj3BptCpRixYtYNOmTYB6rWTJksHpGZJDZTR9l8iLeRmQyTRkwDz65Pntt982EkwEFUUsAmzevHlw9erVaTExMcG88zgUbSIN9y63R22FMK3HWQfXY2X1kAMXA0V3bt3Qow+J2jnaAbUQQKdbrLyVlXClGFv0TDo4LCyskqKoEBzhpSFQ2tlZDC5MZFq84oILv/8+vGLFitC/f384fPjwjwDQlTcGFP1//nshvN4VIWVAJtJg1sUvX77cunnz5lCjRg1YunQppKWljeO/v4j5NFgyv2syFQVjmHoQAWwiZakEXI3QJe4hYwaj80TEevYfn4etVFiJvjGFadF2N2DGbH/y5MkD33zzTW26x0Snbgi6oonBsSbSYMohY8eOZTt27PgRoRrOWzmLmk7Dv1YCrlroyHvMmMHh4RFVvV4VPhjqhHqJtOqTZyePUo/w+pRZYGvyektGZD4N5oq/BdHF+GfzafjXSsDlQnsDMP6uWFhYRNUYu2ddVIytDTUIIFD3MtKhuYn0m0iDaVuVBqEcCNejfJBrUAAyVXoFv/g9ZkyZN61nRCbSYM4Wp0Eoh3Yi10GzbPLmD+KgFJNMKIekQSjnwcVHkgdgvlMAIl+8yTd+tk+DkBi4a0cnG1v0LDZBEYs223yc7dMgJOAiVUDXyYLMGYyOQbfgozVMKvunQUjARfIapkyEWFDxDzIsHBOATJl90yAk4CKV4c3Iiom1J8xmyGA+uDWZ9wflkgKg7J4GIQEX6UF0Ih9a5EQHc4eS72FiYRAftVAF3ZRDkAnK/mkQEusWPoJO4FGgMjrWMPM2hDv0Ng4xTJQsjVb4W76xxUuSWZ8GIQGXySgQha7OK+1JPKOqaIaO4d9Ho21oF7o8ugaPHI3QXuv7fu6/NAiJze8eQ4fzTOnhma4sOp5nViePEKGWbiyd/dMgJOASEhIScAkJCbiEhARcQkJCAi4hIQGXkJCAS0jIAuVHl/zkk08WAcBkAZeQUGC2dyqTlJRUB5et+wR8Gi7guoPiZLUGuq1NVqtJ2UZCsiy3YYyNQL+An21S1ukBPkuhHC5pvgkM0jRNwHWbnTZejbGr8FSKBwZ2ckN7PNI5Xh8vZZmEXC7XaAQKOnToAEOHDoW+ffvqC5rGxcV9hYubPiJZqxB0HG62MRe4NC4B1+2j1ZFOzTz65newm2mwE497GG4OIEPHJh6wy+ohSchyORyO9Q0bNqSFWLWjR49qH3/8MW1wQWvya6+//jrYbDZAwB6WMl/F0ZH79+9/1QgVF5AFXH7kdKlD29FmAB8xTd9wfIsM17fwI57T9TYNPYD3DZKErIxYT1SvXp12jNFwVxb48MMP/2KCbdKkSWC32z+XMk9F0BGrVq16kXb7By4jVAKuO4i2DL24kYEPLDwaTOd0/cJ6BnSfJGSZsNh3YsGCBXDgwAGCya8pgtHmGIyxcCmwKoAOmzhx4lPXr18/5RcqAdedFctUW/2aCm0dpPGI9Q/TddrxMLm6ArF2NVoSskQYkeD48eN+oxY3FRehR48eBFdXKTDKiy7TunXrerhzzXF/UAm4MigbU6t0bOoB2EUg3d6wm+kNHAhjJUnIEqmqqsPlFyxurIPRhoMEV/8AzI8rXbhw4Yq//vrrDn9QCbjMb74WVquKArD/zpGLvsd9pKj1sJQkZIliY2P1IuGdIhfVu3BPMYKrqXQPCg4OroybbCz231gh4LqXOtfNH1fIQPvx/h0wOqfr3y+XAe+7LglZWSx8i7aSxa1x/YJF0B08eFDD+0C6R/Xp06c17lP2QwYiloDL5D5QbZKqK/qukte3+VoI003nVB+j7/G+VpKQJVIU5Qg2s59Dw5w5cwgwAkmPZNx6K+ITTzxB29GOCFADRgTubd03g9FLwGWiA3lxNSz2/Tof4dosw7VNPl9dweDVti6wOdTDkpBVIzGCaSvZDz74AIYMGaJ17doVMLLou2BikzisX78ecJN0rVatWoD9YEulwCoYHfvVV18tMEIm4LoHxTnVX5d1dcKXPePg8xei4JsRMXCsVxQce8YGO4c5ALcUXSMJWVXXujV9+nTYs2cPbNmyRd/IvVu3btCqVSvo1KmT1qtXL6hTpw6N0KCN072ZNLypNDbx17h48eIJf5AJuEwoyqZ++c1SGW6mYsTCyPX7chkur5Hh1k4ZFvZwQoyszpOErIhac6hpnepSixYtgu3bt+uArV27FoYPHw7Dhg2jIVAaRi6gERoI2MZMHu0ejpux90BobhqLigIuE4qOU7fsnOGEK6uonuXbzf/rAQxu7mDw5tN6sXCqlKkScrvdpT0eD9WvtCVLlsCyZct0sGj/ZqwL6XD169dPe++992DFihXaG2+8QXDttGjoUzR2C8wUIzTurjN55pJXnHBpiQ+uG6kMvuqHcG1lML61C+xOdZSUqRKigbgEDEYpjWCilkIcywcEGp1T1JowYYL+efXq1dCzZ09qgl8kWaB8+fLlwkPJiIiIyji95AhwibGFGZDd4R00pZ8LLi/9K1xpmxm8gnAxd3xP6f5RLnRudB7uh+6DcYS1a9So8UfUoug0efJk2LRpE0UuilQwZswYAkuPaFhUg5YtW4LT6XxVslb50GEzZsx4BscaXhWj4u88KJOhEx4vFTFlyLMeuLoM4dqeDhceNzAY1cYNJUqFv8E3Ay+LLmNBhjWbhiroFHQLvitKXXRtvgVRMv+uJTopG6aBGjFOUT2KIKIWQWq02L17N4FF1oEyfn7rrbfS4cqql14QOhI7safDHxJwFTBskZOELoeOKh0e2/Lp5h64jnDdMMB1fS2DwS3dEBZl78jXV3fxjNyMwxYmWS9/aYhFl+QPvTg62GA6D+KfIyxJgwkhINWxWZ06hTUq7vXv3x8WLlyotxbyupcRMB1AjBzw5JNPgizLjaWs1eO5c+cuf/bs2Y948PpXwlUQXY2/wb3okobNC4KDS4RVbFBbgbSlCNYOH1xf9sXjagZ9mrihVERsU35/qCHDxvK115sGeiMD82nIwG4n/B4TabCqrnXk3Xff/aPRYubMmTSsifqzCKZ/ePPmzUB1s6ZNm9J0k3gp65UXXeLfuoaGwjOP8zb7W4U8lKdgWNmyKsAHTLu2mUEawfUiwrWSQYd6HggtHVmLMqSfjFocXYpn+kZ8zfYAyEwazNv6NPgXjsB4xOv16k3v1NyO5zSNhM79gkXeunWrXidLTk4GLE6WlISyBK48fCf6RA5GyB0yWZ7IOC8AgkX9WwTX14MQruUMmtbyQLHQ0mXv+O95cy0HgEkBkKk0mLCJNFgx07g8FQmpCEh1qMaNG2sYAfT6Fi8SGouGen3s7bffhlmzZmk0ikMSshwu4474LIN7CufDgbnXziNYF5dh5NrJ4L9DEa4lDOokKlDgkaI2ytgZ3FAuie9nbF7m02DaptJggbBvawpGIKo//U7FQprGv3HjxvRI9Udf1/Lly+Gll17S3nzzTR0wPmBXyGK4cvNMGZNelMuAC0balK+/XOSA3xf74PrhNYRrIYMKZRVIL0KZiAB1eL3IvMynwZRNp8EixcTEHKMWQ4IrPVLROY2ApyNGLa1jx44aRjugqKUoymhJyHK4GqBlk5nykSibZ+fO6U64tp7BpVUMLlCH8hym2Rxe4ENhQk1mTr5RuHmZT4MZm0+DBf1cHWlFp2PHjml79+4lmP5ovEhNTaWioR7NqE4mCWUZXHZeMS9uMjMVjra5Fy562Qm3dvCOZDxeeY9BpF0FXvcxmzlL8+hjRubTYMIWpsFMsbAZDn2iepdGU0k2bNiQPuSJPhNUVCSkTmQqCi6RhLIMrubox++iflIsxuZ89fW+Lh9cW6i/S4bzb+tw3eA98yVMOhidwCOQCZlMgwlYLEiDKeFwotwEFkYrjVoM9+3bp0ct6u965plnKJLpkFGRsH379gRXLUkoS+AKR1e9y6JUUGQ06zPoaTfATh9caQjZD1NlhEs5I/lU1NAZy5vCM/TmTzGRftNpMAFWEI/ABfjG5UX+1ukcaiINgZptXC4lJUWf+EgthFTXorGF2HABVatW1Qgugk0UCbMergS0/S7f0MXLhMc272RYrIaa44+PZeD0Jvz4888/bwCAqWlpaX2+++67J7Cfxc7rYfnQD/O+oWKGjBqSDi2vPxWSMiCzaTAB1iP4u2lMHrW+/YRj+PacP39+NgAMO3fuXGsskpXnvz8P76x+lL9MQnLlymU2DWaa4uOqVatGTeuwbt06eOedd/TOYZrTRQNzqTGDioRjx44VRcIshqseutTdFn+CS5Sp2KCWArDHB9dNhGv/MBlKRcn7cGbqF9RcXK9ePejevTuMGzcOaE09zBAXMQMc/f7775cDwKtXrlzpgksd13rhhRcieItf/oceeqgKL+ZlQCbSYDJ9p0+frklFLeq0JSuKApUrV4Z27drRjF8ar0cZmeD7L46Q2ILwzUIYFQITAUukNGRSnasV/r9dj76OozUOIXBP4JCozhTRcFS8RiM2ateuDXitsiSUZXClGJvMTRpHaRQoUzZe5StB0URJBtsGOKBkpH0LADyNu1lAQkIC0CKUFStW1MqXL69nUswc9OABM4U+aoAy8JQpU/QFVK5du/YTjfBBR0gZkNk0mHBhAJhCMNFvp6ZsXAaaZvLqkGFrnf7bn332WepL0iPI/Pnzr2PmPoTzmJ7Efx9PabB4ftdkKgoicAfxcxNJKEvhanTXFXc+SoM2Xji3TtaXsIaPmTa2rQuibPJMfJtfJYDSM2PZsmWhRYsWNHkPaEo61RW2bdv2A44u2InzfWbeuHFj0Ndff90SIwIV8SqYGBxrIg0Zdgj+RhuN3+vSpQtFXVqPguo2l7AB4ZOTJ0+uAoCJuLJsj//+97/J2Ekbx4u75Ed50bYST4PQvxSuWujIe8iYxZwO1hun/Gs22YtQeSEiOu47Tbu1cvbs2TSQ9AJGo8O4bcwSABhz6dKlpxGm/2PvLKDcOJo8/kxfmHajlda0jDO7glkzbmKMIztmh5mZmZnz8WcMk8Mc2+eY7eO74Asz+bzG88Zwa9VVS5Xbvnq9Ho2kWJ+eqt77vx6NZmWVX/9U3TU91cNxjtCThoCmRIFqR1DrbtyHzKkQh64zvv7663E4/KvT5ov7a/PFjpI1fu5D/pnAFUQ1pbn+zkernPfTWh+Bsw8lLw5hyYtilxux0zz4z33IiHDOpNoiD5lOsw9ieQvXQbTI1ZeJDBuJHXv+DJtS68kZ9yH74j6I5fFN5NEoi/3yZ0s+AuVQD/7npg9ieQAXrSTnQ58syI/q4/0X/+/bBzFZuFtPdSOKstQ5A/SEr/f0cQ74ICbPcw1Ajc5C5/TTYyLTKQHi3XLABzF5ErlJe2QisAcm/j6tcEyKnTIHfBATuMhKKI0c4bUnMiGt2EtvGsaNoLqBaVgO+CAmcJF1oRoUk6jAi5+UToo9QB29lMqUTSEI0rdc8EFM4GJ2IGowRYEhqBqtxFiAVNyBAnStj37hI/QrPzHzJclyzAcxgYtFgUrUYTRpH0sd1aH7S9X0fhWqllZN9Kf6fpNo/V9Tlu/95IQPYlIr/mBUGXXKMHW6vnSPx6FhWM2vi3tR2bXs+yAmcImJiQlcYmICl5iYwCUmJiZwiYkJXGJi3VENgUBgb4FLTCyz9xat1tbWb7CtELjExDJnJVjAZz6gYYGf81KoKSJw1dnOYajja22nmU6Jie07Eg3I2traWj2UmhO4GoLOfaq02kmTwnD1qSE4cWIYqvA1nr9L+lbeWzlW+/oM0GjnfrX7yq20XlPgcolW754+NQSxJRbACisGy7BdacXaFttx2Opt519+O5fFzl013nju3JVRlGoTx+esNF/3G5sftzC6iMBSBkBGazg7CVwdR6wbFUCqEOiOf7BAVdvdsYhafK3OHzM+DI1B50rBIDk7a/k41SAMUdX5UdS2A0PH//+9c1D6darlIsjw2ig7r7fqffYa/07/bklaZwWQ4orgSogIe//992dRBtFkAhdu1wpbF1iQAAtbTeq1Or/xDRvUdYKNd7CoJVi0zk6ia1Dt1zI42N9EE9exvzGJf4cUAOv58ccfP6ZHLZIevSKorgIXsxrLsSaMigCssmIUsYBLnYfVVmxMcwRq6h1vKVgBi8BQLUFBgKA0QHjEMkWmKIHVDp0Opx7pCDodPBNgbsO5vYPB4HAOFo9euHvMK4aHTAWuWssZrm0b1KFghQXHHxUGhLG/IJQ0XGyopomAo1aDSQHEh4ckHSo+9KNjFvkY4ChvcJVu3rz5AyNcDDAFoYJR4NIMI1HZaIxIsNolcq2xYs2DI1BV5xQLQslHLQJI6/h8CEcRDKWDcA5BZAYrStI+X/8MupYde41ePtyD7WwjWAa4Wlpa1pijl8y5dv34kg07FydA4mCp8988F59zbROEdm8cLBry8bkXT2QQIAyEduAYJCQCDFsWxTQACT6ClgPW2eRDYWGhAq5y165dOwkuJjNgF1544WS2QaDAFQw5J4wbEQH4RyuGIGECw0YlWvUaaL6F1+1m422xs1ccyYZlBIUWkQzRiw0howwQHrm0iKRFKgKMfy5LhkT5+53wO5siV4/33ntvJotarnDhsqgv1FBS4GJmNzr/PmJoBD56rAH+R8G1yMa2AT5/sgEGDYwAvv+z4OMp9c6GZ1rSgQBjQz0tUnWcgmeJEn5MLQOcQ8ciFxsa7lVQUDAwabAYYLgH2llUl4RM7nNFRgyLwPyTGmP/PKkelo0qgX+cXgJLRvaClSMr4Meb7NjUcRHA5VCOYJTMkJCBRdKSFizBoN8kJjATMJH+D0AGGLunxQHjxyQti9jZMDQsxT2i/yUFuEAZ7pm9iZZFCVyUMex37IQwwEILNjxhw9q/2vDZFQ3w1Y0N8O7JNrQ+ZcHVJ4Sge6XjWn5MhoQEiQ4Uv+mriUCjazh07HqWKST42LxKj350rKfx6Txd11UNDc9aRpELI85DDz10slewePRauHDh9VTCTuCqs50/zLs+CJsft2DtXyzYvsCC/37Rgp/+ZMEHp1uwFeG6ckYISmudoGDkBpceuaJGsM4xRisSvylsOGYQ6rBRy6NmO1gscnXBVh8SVuKC3K0EV0oCMqq0JXDhYt2XFzzYCJses2DdbAs2PWPB5mctaJlnwSeXIGhPWnDFxBBU2c4wwahDY5GLsoV6BNGzdhogFHkM98LYMVtKZf47dv+MzfnYZ3TVhoV7v/zyy1fwqJVq9MLPwuilTOB64e0HEnCpyLV5fgKwlkcs+PYuhOsJjFxHhqAu1OeIHOnnnWiP5t+RumYhamnRg0cgFnFY1NJWc2gwUgRigHGw6H2eqYxLh4/OdVPzLup0fyKwMiJl+Q5XAaqivLpxOcEFP/0hMSTc9DRGsbmJ6LUF4bpuTAh6lJbfQwU2S7K9loz5YFGt90lUfXc8agxqFG1BdAS9N4Mq8/blPmQ2BW+Cq4P0OB3zJVB65NOyjBQVGaj6Z+iw7iahQu91w8/ues+7l3b+jTpy53yDa18CZAp1tMaKmuCiBQ8l4PrhQYTrJQs2PqXgQim4nkS4moNQVW/fS5vSDaOdH0dm6b4G96EfjfF7onzaxuJx0WsfHZejghnzgUcuAoJa/R6WfvOYr/1j+hUs40Jcw3BQj5oofeU8zzbqERbhUkNDfC/NR0bkea79UM30C95EHbEIdWBlbfjV1ylyfX+fBVtfVlnD9si1CY/njm+ESiv0lCobrXXYGqq9PiWjGxl49yGQ5G4nxZoy5AODizo2S0RorXY/ywgUXctlBo2f5xGKPXbCj6N7IYBd8HUaEUbgilDnaTTsb1VYVRv827wbEtnCH+5PJDM2PN4O14ZHLVhynA0VdmSNgpF11CJUL+r0RxF8aZl3H7wrgz4wuNg8R0+3k3g2j0cgbBmQWtTTj41rCPnQM8ojlg7+785RGUPvkUvgosn8BNrXyt/Bzoy+ymr78hvOCsEvzybmXOsfQaAeswguG1qw/exkCyoanPW026KpkxahqggAKw3/vfuQvtL2gT83xaUtrtUgi7qszCAwtGvNS6c0uPTX+r9lhnAv/Le7UlIjCRO4+I74lsuewv5epVVjpx0ZgbZXrNjaP1vw818QsEcTSQ0F1pd/tmNnHB4CqzG8CK8/KIkN5cbSfsbezbsP6St9HzQw+FpA7V6XFsX06wzQ8GVRKA5H1AChaehHN7TZDWf6bl3wdWdsPUQugasbdcpqlD+JznRwne3Ea2esm2PDd/eo6KWyhtgiXEvuaICy2sh/UiIh2QgwmuZF3sy7D5kX8yE1uNiQz23upEUvDpL57znAHXw2S9vrcOnRNnkTuKIo20On3K/Winz53N1BWPtgAiw119r6igUbsH32Kkxm1MWTGYd47Jy0Ubh34z5kQcwHz3CZh3rtr9n8Ssm4Kp4vBDb8W1H+ACWbA5II3NThErjqaWJe5KEj+UvKaiaqUmqwxoKdSy34r9kWtL5uwSYEbdaFQaiqC85UyQ+PnbM3RR+vxn3Iltx94HDx+1j6ORaBSAwETfrczAAEf+bLvIDXADWfn6GSM4FrGqqHx/mJv7hn2bCJYyIAKxGudxCumRb88qYVT8/ff2YQqusb76ZHCbx0Tj9qMEUgL8Z9yKa4D14SGiwVblwGxf6WZxPZdQwQ+hyW0ODrGOlYh5EB524CVxlqeApDqcCBBxfVDxsUL1QDOxCutTNtXMCbWJ1x7xlBKCmv/iOthvB16tTJ6y//JA/+Mx8yp86dO3fXbihnzAe+/InPpQgAHR6WZODzJILJGLE0KExPMyuxZAmKrXVkQ02Uuwlcg2lIVZzC8McXDDnxWhk7FtuwbpYFLa/ZakV87J4zQ3DIoYGZ999//wMrV648lZYNHZrkv+NDRT08/s18yKiKVqxYcRI+c3QRpfgL0/eBw8WHYYbSaqabyDqI/O/MYo/4u5RZ44kQFlndTeAah+qVYsfsVl7TlIhciy3YOMeCf3u4Ibb9OSs2bHATqD6Ez+n8fOaZZ8KSJUu2A8ANFMkORgVYNOPDqqE0zHM35kOGdfB333334tixY+GVV16BHTt23Dd69OhiujHuT9UHvvyJIhYDiyc6SHyoZ76JbDjWX7NIaJjPtR+bH+h0N4FrElsG5EV7YwGanVvfTtTPaMOIVVTaBOFIH+jRs9dMNanHnS2gX79+saamJhg1ahQ8/fTTgKW3Xli9erW6H7RXB/eiAqgBHp5O5T5kckh4wLp16x4Ph8PKDxgwYADMnDkTvv7667e/+OKLZkr/+7z5wOAisdUTrIYFH/bpUERNRUQNQPFzPHK5S7/e3QSuo6gzpNIx962sdX7+4UUbYIkV+wmHhZX1DlBnH7Z27dqPVWccMmRIbOjQofG2f//+oDrqLbfcAu++++5XAHAOreAoQAW0jjnQw+JY5kN6omgUUP7hRgLT/vrXvwJ+7199UIDFgsEgXHzxxYA/ElsA4GJaw3hIcj4wuHghTnPUMdUZZCCxTCNbaWG6p0Zzq6TKYvNEirsJXCNRFSl2zELbbrhtyEAHnrutEcYOd+CQgsLbH3300cEffvjhRgXWoEGDYijgUh00FArBlClT4NVXX4Xt27fPvOaaa6pUpNh777392I7wsJcT8yFtBe6+++6qr776aqH6EcDvafRBAad+KHCYCE8++SRs3LjxiVNOOaWMwErKBxZxqMPzm7hs6MfT6TzZYDwmsTWDrCCNG8gewRK4gqimNNbfHdi7pLy5ui70Qq+SstNx4j8VEwBwxhlnwOWXXw7nn38+XHDBBVxwzjnnxK85/fTT4aSTToITTzwR3nrrLdiyZcs7tKpjmgf/0/WBJ2oKMSLBCSecoL6jqq0Hl1xyCVx22WWAPwBxKehuvvlmQAjhrrvuird33HEH4EZvQBHM5+YDm3dpN3d3Uw2KRyi95WKgsChkqOJruFaDUgdafXd3E7gOokWuvrTu61CHqqys7L1q1arDsYZdMw77mnFecsTnn38+luvbb78d/+OPP07U9dlnn0164YUX1DNTdZRaT9KYD+mrCBMwQzCRMQG/Z/TTTz8d89FHH43A3TmaEbpBa9asGfTGG2+EFyxYEMGyYPWzZ8+uu/XWWysuuuii0rq6uh70/2G7+UBwsfV8bM7FahryDGESmT72ubwuhlt1Xza09AyX3EQejbIy+MvvT1JFBhUSKF7r2KXtA5tz+V0UMIpuUTAfvJdWMwBjXBbF52rme1M8re5SZJSJIPQ23xK4+Epy6hxZXdnQx2PUylkfeFFQDgFFM15Dwxx5GGjme1vs7/hq/I6r7OI5r/t1CVx8bd4RLDW+JxWgJ3wne/Q9R33gQ0OekXONJIZjl+Ehj3KmhbksslEkTGdIKHCRDUCNzkLn9NNjItMpLe/Fct0HvhEDi2QkDlbHmTxWVJQnRYyLdlmEIqW9Gl7g4takPTIR2AMryH1a4Zg0wMo5H1x2lKREAl+9oUPC52uGdYcapHw4yD+DAavatHeYFLgMVkJp5Ij32hOekh69aRg3Io0NqHPeBzNgbs916YVreGaP18Mw1jvkf892WqHPyCxYAhdZF1obN4kKvPhJxaRUH4X30aqFYagpBEE6lus+cLj4Eic2NGMbLejzJwMoxnMMHJ7qJ+Akau2BuoUHogZTFBiCqtHS6Hr62aQAXeujX/gI/cpPzGRZtdz3wQxYx4BoawrZtSiX2oXU6tGMXb9nwBK4eBSoRB1Gk/ax1FEdur9UTe9XoWpp1UR/qu83idb/NWVhH6ac8cGUmufLl4yrLlikMWzRygBkUcx0A1nAyurmdwejyqhThqnT9UX1oc7aSBGimJ6Dyr5l3wcxgUtMTEzgEhMTuMTEBC4xMTGBSyz3TfbnEhPj9hvuLClwiYnt8+abb16bqT2R58+ff5XAJSbWvo90NZClE7Ha2tq20g18gYtbne0cjjoe1Sx9Lq/Mj7Upr085ehFdDz300Mls5YvA1RB07q+pd+CkSWG4+rQQqI0ZqvE1nr9T+l3eWDkWJtoEaKmAtWHDhn9hJegELoxS750+LQSxJVZ8ny5Yhu1KK9a22I7DVm87/yz9Li/sUCzUc5bn6EVwFRQUDKQCsQIXRaybFEDwT1ZMVdvdvsiGHYuoxdfq/DHjw9AYdK6QvpcXVtra2voFB8wNLKwSNpOV/Ba4sIw1/LLAggRY2GpSr9X5jW/YUFHjSNYkP2x/rO84OVm4lO3atWunSmIUFhZ2ErjIaizHnjA6vnVQjCIWcKnzsNqKjWmOAM7JyqXv5YWVtLS0rHEFjOiaN2/e2awiscBVaznNp04JAyxnUDHBCguOmxAGhLGf9Lu8sL2DweBwBpcRLNyM4wNTEkMiV71TMRojEqx2iVxrrNjwwRGoqnOKpd/ljZV88803r3DAOFwKQgWjwGUwnEvt+uklG3YuToDEwVLnv5pvA87NfpH+llfWFRUBMhNYH3/88WO72ZBd4GoMOccdOSISj04IEiYwbFSiVa9VVFPRLRhyjpL+lnfWHevq/297/wEdVbX+/+NDlSYgMpmEEkLaTGafqWcChBRaICQIhJAERLkWFAV7v4BixYJesfeGKDaK2EB6sWL9WFDsCkjvLQQ4z/99ZnaW8+dn7sye5ObmfvO813qtkznniPOstV9n77PnzOwnTuy9ZAwcTweNWa5qEtD9aRkufU//PD99N8tFRyFVxWKItVQzNr3oor7Ynyr04z0C/lwLhx+L+uv5wctxzAaqC8vl13WaUeahpaNdxoen2em9IUm09vRkWoPte0Xpx34YJ+iDKS5TMLI0xHDiV65ceSshVWJhIcEfI60WyhMamt7G6/ETrRTGnhcE/T5Nox+vDfHVOZrx5ZkabbpXGAefE8Y/8n2ULHS7hdMQk4wHcg+SzEAE+1qxXP/+saer77vMQxVvCNr+lKDKFYJ2PCNo472CvjhD0P+dLWg3pNv1mKBLCr2U5tKzLJyGGCvWxL6YECwK+Gp0P57Kn3Pd98xUDx2aD6meFXTozZBku2YJ+vx0Qb/ciP3PgQcFXV3kJbtbH2zhNNSk4LGo37EVoAmIEO65bn10Ukiu7U8KOijl2jlT0LcT8PfTIem2/kvQ5CIPZXgDpf8jN+HNQHNJU8CpYeLj41tg4wKdQISwXG1T0sR9D17jocOvQ6DHINfbIbnMoeHWx02xQmy6Q9DUQg8lpdlvlw9n1pcG2wEI0AeUgFFgGBgMBoECUCSPjQaFoAfoVts1cFiuVmFL5Azs1t1+z72XeqhigaAtDws6JOUK9ljP/NVzbbgZcg30UIoj4378d9mgDAys9cde1GsoBD2BHXQBVhD3N0vKWuXfycAD+tRWDRyWqzXoB0pAQDbEDkmpzvNvHeelI28K2vxAsOeSckmkXL9OEXTXYA+la56H5ILkccAOBoDSWlvIQL2GOBAf5WonCWHYaqMGDsvll43HfcL6VrbO3dKGXjzSR8cg1ZaHBO2bI6UKw5zQ+Pk6QU+VuClVeJ+XQ7EESRzoKht9MWgPYo96DZ1iJ/YaOCxXczAc5AHb36zMGN+2fZyzT7afaLEwtj6mYSLjhCHhM+A5jX65StDc0S5KEd75svGd2EjjQJoUQIDYol5D7MRYA4flqloRX1S3prDcd5L5ZUlaFpot3PLIX2LteiG03QPhnj/fbZT29VOGcE0xvwoeYUG5QpAF1KNeQ8yo1VD38Wo+i+7TLULTLJz6I1cz2SjTgS1CY2qV6vBv+GG2i/ZApj/ulHI9JejQO3J6fpagM07zUbJdu1Y2+Gh6gAIQAMpRr0EdtRrqPm6H11I4Ps9ywTtFFm+G38KpP3INBVqUjfJUe4b7/jsu89LGW0XVNLxhSlWxTBjbsD0M6Ybn+6h9x05enB+v0DjlQuFqUa9BHeUa6ji6V7dc8uFQy/glgy3nvVZo8Th8bEY9kMsJ+oG4KBtRXFJyxukTRvuIPhK0b645FNRo6xPCOLpKI1OyIy8K6putU7OWbZNNuRQaZyIoA0pRr0Ed5RrqMFqqxzL2sUFBsc5/t9Ayfulgy7iXCi2uVK/lvxuWqxx0Vrg/sXXtlnbamcWQ6z1Be+eg53paGN8/qNHx1cIwe7Kjs4Xh9eskp+BV7ntsIAdoQCWKNagTSw11MRQU3T2W/iOyLRPWFEGswSGkYOfMGmzJHdQreI55bt2G5eoO+ioOpWzxnZNy5I/U0N5XBe18RtDSW9xEa0zRNKqcLSjFGSB5HxTLlb9EoX7FGtSpgxqU4tF8Flea13LapX0sFy8barlwVUis8ZAqXDD0ZDhWaLn0g2GW0mn9LT16ZlrcGXUlGcuVA5yKV/z49h3itf65kOsDyPWKoN3PCpox3hN8vRN/73velCvYc50Uw1S4FQwFbUCkxFiD+r1U48aNY6uhluN1+Sw9szItFy4eYhm/HDItHhwuVjjh+9GTFVou+fg0y+Bzcy0ue10IxnINAV1Bglpja9YlM6ATfShoz8sQ7DlBV5Z7gz1X5cvCWHiTm+yaf7M5s3j33Xc7sLUqNE4byFP4sUj1GhSn2fGTYeOxPblp06a1X4NiNNxHXfD2EHl/JYWKQLhkEz8osvQf2TvY8/1nw3KVgARVuUAbh9CJ1gpjz0saHUBPNWGk1xjY109XjfFSSoZ+wOxNDh8+/BC+00P42kGZQuOMB1kK31qNogZ15MWgDd77q1dffTUZhnGP7IkTar0GhfTu29My4T15f6XI+MWFwR6s7K7+Fvd/vPdiuYpBpxgaZvPUDJ0OLBZ04BVhHH5RGLlZOiWnZoxNSXdei+NNH3744URTLJfLZdxwww2E3BflPVg86K3wcGzkGtR7KytoAbHOQs9LgUDAGDNmDO3cufM5+bRJfK3WoJDMHrrlgpWFpigxCXaBKde/+kIun+U/G5ZrIEiJoWF2dArt2kHoqV6b6iaXV6d0u+MOCzJx4sRORHTXvHnzyOfzUV5entGrVy+jtLTU/DHItWYPFqFx2kC+wq+xRqhBiYR27drFE9FN69evX3PNNdcExUINlJ2dbfTt25c2bNiwPz8/v7P5Phs1ahR7DTHGK3TLkNt1y8TVpykLdsGSQst57xZYeg1zW3xu3fKfDcvlAYEYn79r7RSuqekZwWcHkzdu3Fi2dOnS37DWEvXu3ZsyMzODYgEyycnJMbKysujbb7898MADD6TJ+7DqPogtB9EkQg1KJNjt9k5r1qwhv99PHo+H8H7l+w+Rm5treL1eWr16Nc2cOdMU+tQmTZrEXkMM8Xn8luwi3ZJzucNy9uv5lgkrzfuvUE8WLpt8HTyG3ioo46hncy3ZFzqCs4b/+bBc7cBwYI2xQXYEpwArfu1nKK72byxcuHD3I488QmPHjjV7rqBkplTmld9snG63m+bPn0/79u0z/79tT7gPSwAa6KtQf+QaFIaD+NHKhe++++6Oxx9/nMaNG2f2XMEa0PtSeA2zZs0i5CLzItOsWbPYa4ghXs1v6V0QsPQ+P92Se4XTUvxgL8vYV/tDppBEE1edZpkAzl802HLGi30tQ+/pYek5Ps2Sc66w9MrOtHjdPCSsqw+RC4CoyZVfDo9soD1oMWLEiC6Q5x+Y0HgGPcEvzz//PF100UXUo0ePYEPFfRjddNNN5iTBnTi/edjwyipF6QgUEqkGhUkMWYPNZovbunVrKd7jjLVr134yd+7c4HsePHhwsGfTNI3MiY7Kysp7zfObN28eew0xxOf2W3RPwJI7HJztsuSgR/KdkWTxjUmy+M/sbvGdHtrmXeS09B7lsuQN6WnxOv0Wt7MuxWK5qp4kj6/lSYE40AG0Au3/+OOP4UQ049NPP/18zpw5wYZpThLgt8U/lOeaZKpe8eugho7gZNAMPVqAiC7ftGnTnCVLlmx59NFHCZM1Zg3L5Dm2WGuIvRfTgd/iw7ZHZqYlZ2BPS25hT0vOgJ6WgD8zeI/mc+l4FKrOpWK5ZJygCMT9Bz8vsoU11BafffZZHhHd+OOPP366YMGCHPm9qJFAPXVQgyQeWMEpoCU4dfPmzaPxk3xJ8pj9xBo4LJeZLFAQU+OMXTYraA1SwSjZYNVTqzWo926S9Opq4LBcZgJhX5mIr4OGaQU6KK15o6zHNXBYLpluoBz4lX57Qr3XSgRFIB80AjVPfa6Bw3LJNAF5oAS4gU2SIIn1q/BWkAT6gFIpQe2nHtfAYbmq0hbkgHKQC+xhPzEWL0mohviw+6pE4AdFYEQd/yRZndfAYblUe4FU0B+MAoWyoepAgHR5PA04gAf0AgNACSgGgf/0Zz/1tgYOy6WQ9qA7EMAHAqAHyAQ6cAM7SADNQd2n3tbAYbk4HA7LxeGwXBwOy8XhcFguDofl4oTFA9KYeo2rTZuTW/2PycX55ptvZhOnXuf779fPMh8g+B+Ti/P5558/TYhhGEw9xMzXX3/9hPmEzn9drgxNHwDGOjS9n4Xz/4ZcLNfj5jOl/zW5XB797nSnTmeX+GjSOC+dNcJH5mvsv8vCYbn+9+XqXOdyyd7qy/PKfHR8hSBaIwxahe17wji6TKNzR/rIqemfWTgs1/+2XF3qXC70TFPNXoo+FsaRpYIqlmh0ZInc4rW5/4zhPnJ79H+ySgpyMSyXuWzr/oWCQmJhGwZeB/fveUcj8zwLJzq5GJbLLvSMoQODywcZVT3WiZj76QNhFPb3E85Ps3Aiy8WwXA6h9x1X6iNaLWWqBlojghMckKu3hROFXAz3XE49yVzNhD6M0HPhONbwMmcPFdYHZrkYvuc69ud8jSqXhUQ6USxz/x9zNcJ5FaySglwMy+X26qOHDPATfSQMiIQJDA0IEBKr6n7L49VVFiNguRiWS/f7Aw6XTrl5flr3vIsq0VtVLNbMrfEtXvfr4yeHm2cKleRiWK7MgH+wXdPp3lKPsa5EGB+d5qBPRqXRVxek06dnpNEnIx3H14zUjtxa7CFTQJxvt3Aiy8WwXOaKklsXaHR0gTCOrtBow50afTtBo3UTgxjfnK/R3hcE0XJhrHnAZc4W/mLhsFwsV8Rp+IzT8kMzhXte1ujQW4IOvino6/MErZsg6Fvw0z8FVSzC/jeEOV1vpDt5eBhRLoblcmr6xKkXeIlWCdr9ggjKdfhtQRunQ6wLIdk4QfvnYf+bplwa0QphmB84o/dyWjjVy8WwXJBk5qvT3HR8paBdz0Kit8Gb5jbUe/1xJ2R7J7TvwAJBx5cImnyelyDleZb6nUagGWguaVqncjEsV6rD//N3L7jo6ApBO540pdLQQ4V6sD/vk6JJDrwuqHKRoFcgY5rD+5ql/qQDEKAPKAGjwDAwGAwCBaBIHhsNCkEP0A00ZblqE5arFdDBwBRHgGgNpFkuaOODmjkkhFwh8LccDppbjQ69HurFfnzJRSl232bZeAeCJFDXqaqhVMrSE9hBF2AFccAWRpzcbwPJwCNlLKuNGlgulqs16AdKgN6m7akZOVl68ANiWi3onWvddOQdKdcJmJL9/KwrKBzOJzmp0RLYwQBQWkcLGYTXEJAyxYH4KFc7SQhDSlezGlgulssvG48bWE0Su6eP+EexL9hz0XuCbizz0NFFfy/XUUg3bYKHCFvz6fmSwX7q3DUlXzZOk66y0ReD9iDmKNRQG2t0JUiUa2C5WK7mYDjIA7awlRmtaXbX5Jsu9JLZa30zy0U3llYv1/GFgq4400ur73cHz78R/12qXZssG3n4cqdpUgABYolCDbWMQg0sF8tVtSK++Js1hTukOTzPPH+jJzgN//QNHpp2erhcmhwiakCQgf0XjfbRhaN8RB8Kmn9n1aSG5ZRqFpQrBFlANQo11CIKNbBcLFcz2SjTge1vGlDbVIdvzYePu4k+E8aFEOfOM/6Sq+JtQe/d7qIjcqaQ3hV0drEv+AHy2iddZJ6fITyPmZL+mx6gAASAShRqqEUUamC5WK6hQPs3jdKqCXGFrut0xjA/Od063XWmx6iS6+hCQbOucFOlnMygxYKKB/kpw6ldl+bwf+oMidUucuOUC4UrRKGG2kGhBpaL5XKCfiAuQuPp0LjJSV07J6YW2p3uO2/FsPCYlMvsqW79h5cqF0i5lggyvyjZonWHNDlU6xBl40wEZUApCjXUHIUaWC6Wqxx0BglRNp5T0p3u2/6SSyNaKuicAi8de13KtUwYZi8XwwydDeQADShEoYaYUa+hYcvFcnUHfRWHUh3D5aq6xxrY0yfl0oJPxKdlBAjnngQSYrjyl4BoolxD7KjX0LDlYrlygBMkKMs1OiTXYcj15ysaDezlp2Pyod2jC+XPqkGuGBqnFQwFbUAUUa8hdtRraLhysVxDQNcY5Jp2y6iQXBVvCfr0MVdIrjmhmcM984NyHcC5LWMcVuWBziCKqNcQO+o1NFy5WK4SkKDYMK2pDu2GG8q8ZCwWdGyhoHfuchtZup/obaexfY5GL9zgJofm/00+6BrXqFEjlYYZD7JAMogU9RoUaNKkibntCOIaN24cUw0NVy6Wqxh0UpUrPUO78ox8H/36gkZzbnXTmcN85Pb697k8AUp26PvsTt8SnOfasWPH7WhIJYr3Q/Ggt8LDseo1RIGUqe3vv/9+9SeffHKGKVgsNTRcuViugSAlhkmHOI/Xvy7NqR9ISXe9nZyafr38TlQ70ARYiOi6iRMn0hdffLERL5srXPltIB9YQaREqEGpJpskTnJKRUXF2VOnTqVFixZVmr0wemDlGhquXCyXBwRifP6uDWiGVRLzDhw4ULZz584zjxw5MpGIrt+yZcvKiy66iDIzM42rr76aNmzYUCgbXFTignIQbWKvAUhhOi5btqzX999/P3Dz5s0l+/btO5eIzp85c2aFz+ejMWPG0PHjxy+Q702phoYrF8vVDgwH1hiv9i337Nlz/KqrrqKysjIqLi6m3Nxc8vv9lJ2dbeTl5ZHH46Hffvvtc5zbKoorfwLQQF8QZWKvQdJh9+7dcx555BG68MIL6fzzz6fRo0fT0KFDqUePHoQaDLOetWvXrse5LVRqYLn4Q+QCIGK58rds2dLcNsdVffLcuXPNnoqysrJMqUzIpHfv3sadd95JS5cu1aP4f1ilKB2BQmKvoVmzZua2BYaAlyxcuPBov379glLl5ORU1RC8UEyaNIn+7//+L0ulBpaL5ap6kjweJMQ4rDoVicPw8K1p06aR2+0Ob5yGObTCsHGROUEQ4T4lU7HXqpUa5KygFbQ9evToXc899xwFAoHghaFKMK/XS7/++utSnHOySg0sFz+46wRFNfyaRgJos27dulzcu2wtLS0N9mQYJhpmb/b444/Ttdde272aK388sIORQD21W0OHgQMHdtq7d+8b06dPN4e1wZ7LFO3BBx+kyy67LNE8T6UGlou/z5UFCmrSOGUvZgPNiei6BQsWUM+ePYM9gDnUwtDr+b/5TpcNpINRoCVQiXINCpKdjPcv0Ft9bk7OmL2vrut06NChl5VqYLlYLplA2Fcm4mv4GVFHk4MHDy64/fbbKSMjg1566SUyh5AgQWIFOiiNXSz1GhQuFPHgJFwU/oHPug4OGTKEnnzySbOG9ko1sFwsl0w3UA78Nf7tCTlUxERA9vr167eYs3C48t8nG2ciKAL5oBGIPeo1qF4o4kATszeeP38+Yap+muy9lGpguVguM01AHigBbmCTJEhiGSo2xRu/5qefflokb/pLpQQ1Sx3UICVLkL1uO/lIVx/VGlgulis8bUEOKAe5wB72FEO8JKEa4uW5VpCIxuiXT1MUNG3aNN1Sd6m1GoAfFIIRQL0GlovlqqYXSAX9wSjZwHKBDgRIl8fTgAN4QC8wAJSAYhAAHUEdpJ7VwHKxXAppD7oDAXwgAHqATKADN7CDBNAc1EHqXQ0sF8vF4VVOGJaL5WJYLg7LxXJxWC6G5WK5GJaLw3KxXJyGKRfDcrFcDMvlEHp/h6aPNbcWDstVc1gul0e/21wm6OwSn7lqf3Brvjb3WzgsV2ywXBma/n/nlfmIVoWWZqU1covX5n4c/8rCYblYLuUe6yazl6JPhHFsuaCjyzQQ2uJ1cP85I31knscqsVwKsFzmIgsVSwSFxDqR0P4jOG6eZ+GwXNHBctmFrpmrRtKHwpA91t+gBY8XF/gJ57ssHJYrKliu/ueb91rvSZGqwTx+frmPHEIfYOGwXFHAcjn11ML+fqKPIvRcOG6eBxnTLByWi+WKLsl2nba/odHxsMmMv8D+FSJ43DyPVWK5FGC5PF793NPy/URrhQGRMIGhAQFCYtHHwhg60E847xwLh+ViudQi3PrevL5++uElF9EKyLVUIwOsf95FffP8hOP7WSOWSwGWKxDw99HcOl040kefXqgZK8Zm0Mrx6fTxNXZaeUE6ma8/m6AZl5R5zZ6LdN1/toUTWS6G5UrN0A/98opGtEIYle8I+n2KizbcDG4KbX+/wUWH54VW9D+6XKO0jIj3XSwXw3KlZ+inZvX0E30qjEPmhMZqQVsf0Oi3qZDqJmxvdNGf0zUy1pir/IdmDEsLg49C9bBwWK7qYbmcLv1CPKAb/Azr4HxzAiM0U/jrlJBcv0x20ZFFof2HFojgc4f3X+0x5brNwmG5/g3cczn1d5fc7yZjJeSaZ0oE8PeuZzX69XoXbX8MvRleYz/kwnapoC+edWFoWO8f4m0EmoHmkqYsV53CcuFzq6BYR5dAHtlzHVsWHB5iSFgllhak4g0R7MXoQ0GQkiz1Jx2AAH1ACRgFhoHBYBAoAEXy2GhQCHqAbqApy1WbsFytgO+UDtarhlc9UwhpNrwQ/Ezrr6fhpVjm6+PLcXy2RuaEB30gjLHFfupoTbhZ/jR0EqjrtApb5qcQ9AR20AVYQRywhREn99tAMvBIGcvAwJrWwHKxXK1BP1AC3GkO930zrvQQoZeihYLuvNRLtCr8Sfi//iaI9ugkDx1+Qwue/zj+tju9j8pGOUA28nRQ06jUEJAyxYH4KFc7SagiTDp7TWpguVguv2w8bmAFLVMd/vVfPucKyvLGnW6adnGYXCdg7n8MQs26MSTjdy+4KMXh/00uDhcHuspGXwzag1ijUIPCGl0RZVOvgeViuZqD4SAP2MIa5KmY8QtOrQMyH3264xIvxKlerqev91B+Hz/Rx8LEwEwjyRVCwhtomhRAgNgTuYZOtY1KDSwXy1W1Ir44YU3huO4pGWddMMoXvN/aPF8zElN1uutSryHlkt9ADm2r5HpissfoivM2zdNMIY0LR/soKcVxlvy3wxtoPCgEWUA90dVQ+0RZA8vFcjWTjTId2E5oPHFpdueFZUP89PtrGv1znJecLv/mmy70Eq2RcgFjpUbhPdej//TgPP2Ief63s1xUMthP6XbnBeFyndADFIAAUEmEGuqACDWwXCzXUKD9m0bZ1ilct+C+a4Nw+T5LSdcuD8oley70TJQZ8GP7l1wPXO0hTIJMc2q+9/HffZ/h1CaZ/06ExikXCldN5Bpqn8g1sFwslxP0C+9RqqEjaA1aJqeJi/85zlfVcwXvqzBUxDY0HW/Kde+VQbluM88HbYA1isaZCMqAQpRqqDEqNbBcLFc56Kxwf2JNTnVehOEe5JIyocdq3zlAJJ/OMOW654qgXLdUSRUlNpADNKAQhRpiRr2Ghi0Xy9Ud9FUcSsV1T3WOv+qsKrkEVS4V1DExQLvfDn072Rwu3o6pegwfp0i5VK/8JSCaKNcQO+o1NGy5WK4c4AQJinKde/nY0AO85lMaWxdoFJ+k0y+vuvD6L7lSFeWSWMFQ0AZEEfUaYke9hoYrF8s1BHRVlSsJU/OXnhGSy4BM6190UZcUnT57xmW+DvZoUy8I9lxXxSCXDeSBziCKqNcQO+o1NFy5WK4SkKAqV7dkx5gJo31E74fur9Y+6aJuaTotf9Btvg5KZ84mQq6rY5ArHmSBZBBF1GuIHfUaGq5cLFcx6KQqV+euKWPOKfHSltc12jDHRS/e4gl+4/ip6z20Ya6L8EEzXYKerUu31ItilKu3wsOxajUooCCtQg0NRS6WayBIUZVr7tw5g3rn9PmhvbX753Gd079OSnH+kJ6WelNKmvaTrYv9W3N//sDCLQsXvjMhxmFhPrCCKKJeQ6NGjaoEaAnagVOBVRIHOoDWoD3o2Lhx406x1tBw5WK5PCCg+Pzdydu3b//y+uuvpzfffPPoZ5999tHhw4cfJ6IbwdRff/110TvvvHPkoosuoi1btiyVjVf1g9hyEE1ircH29ttv916wYMGeH3744Z3jx48/RET/rKiouOjQoUPn7du377lVq1b9+Oijj9Lu3btflrLFVEPDlYvlageGK/Yu8bNnz9YeeOABCgQC1KNHD9J1Pbg1X1ftu/rqq+mnn34apDhFngA00BdEk1hrSABtX375ZdI0jXw+Hw0YMICKi4uprKzMfB2sybyALFmyxC/FVa6B5eIPkQuAAPEKQ6q2uMrPzsrKotzcXCMvL8/cBsHfQcHee++9PTivmTw/WqxSlI5AIWo1SDoS0aQhQ4YEawCUk5MTBDUEBfvyyy//zxw6xloDy8VytQFlit93SgCnYlgV7KXC5QJGfn4+ITfJBqZyn5Kp2GvFXIOk5bJlyyrNi0F4DRDMOOecc+jAgQOl8n3FXAPLxQ/uOkGR4tc0TiWiqcOGDQsKVdVrmb3ZzJkzqWPHjir/Vjywg5FAPbHXYCWiieXl5UGhqmrIzMyk5cuXH8bxprLXiq0GlovlkskCBdE2TtnoTvr0008PYAgVbJQmXq/XnMh41xw6Klzt08Eo0BIoJvYa5CxgE0zKHKyqoarnNQxjkilfjWtguVgumUDVVyaivH+Jw9Cp7JJLLqHs7GzD5IorrqANGzacFsVwKgFYgQ5KYxer5jUcOXLk7PHjxwd7r169etGLL75IcqIkoVZqYLlYLpluoBz4I/32hLzyn7Rx48ZvPB5PcDiFKeyDESYyEqR4iaAI5INGoPaiXkOzdevWrUcNwcmYgwcPzsa+U0Dt1cBysVwyTUAeKAFuYDOp5omF+Lfeestz3333BWfakGnY17Gar8JbQRLoA0qlBLWY2GvA512511xzDd1///102WWXJcpzYq+B5WK5IqQtyAHlIBfYw35iLN4EPVQCtifv2bPn1WeeeYYwrAo2QokNWEEi8IMiMKJOflZNvYaWX3311aeYfl8jZx8TYq+B5WK51HqBVNAfjAKFsqHqQID0pKQkx88//3yXvKp7QC8wAJSAYhAAHUEdRL2GJk2amNJ1BUkYKjpqtQaWi+VSSHvQHQjgAwHQA3jRC+hyGGYHCaA5qPvEXkMmqFkNLBfLxeFVThiWi+WKDMNycb755pvZxKnXWb9+/az/Tbk4HpAMutdLmGSgNW9+Usf/Obk4jTqAriAN2OsVTBroCk4BLf735GK5moKTQMt6CXMSaAoa/4fk4nA4/6/KxeGwXBma3h+MNbeWmofDYblcHn26uZj4WSU+mjTOG9yar839Fg6H5Yq5t/r83FJfaCGGNcKgVSK4NV+b+83jFg6H5VKL26NPGVvsCy7HemSpoIolGh1ZIrd4be43j+O8yZbow+GwXCkOnfYtFBQSC9swKgD2B4+b51miC4fDctmdevqQfD/RB8Ko6rFOBPuDx83zzPMtHA7LFTkOoeeeUxJcVRIiVY953DzPPN/C4bBckYPZwMT8PD/RhxF6Lhw3zzPPt3A4LFd0SbbrlRvnaVS5LCTSiWKZ+zfM1SgF51k4HJYr+ni8+uii/qHeCyJhAkMDoS1eB/ebx91evczC4bBcanG4derfx0/fzXJR5RLNqFismVtah9e5uX4yj+t+v27hcFiu6JIZ8DscLp1uHe6hVSO0I2tLHMc/GZNG/zc+ndaWpdFHRQ5aN0IYM8o8hl3TCefnWzicKMJT8UL/7b0HXMGh3+E3BP06VaPfb9EMQL/drNH2pzSitRodfV0Ym1/XKJU/6+JEHf6ci2i1CA4Dj60StPEeCHajoN/Az9cLOrJM0NEVgva8pAUFLBzgN6fj7RYOh+X6t72WNrzAR7Qccr0rQrOFiyDVZLMHE7T9SexbEZJr9yxhSkg3jPeSU9MvtHA4LFf1gSTjp5zvpeNLBB2GVJWyl9r2GASbEhKrat/O5wQdXyno5dvcZs/1rKV+pxFoBppLmoK6C4flSs/wvfra7W46shByvWOKFOIIMGWqXB56rvDoSg29WEiybzF7mOLw/2SpP+kABOgDSsAoMAwMBoNAASiSx0aDQtADdGPpajssVyugg8HJdt+2n17W6PDbgiqCcmmmTNhWiVUll6BND2rBfbRaQK4AyZVABoIkUNepqqFUytIT2EGXsBX8bWHEyf02kAw8Usay2qiBw3K1Bv1ACQiA9g6hE30Asd7CMBA90lEp1IkcXyVo4bVuImxxvpHdS6c27TqajTQdDACl8u+aRrWGLmELMCREtf6WJEw6e01q4LBcftl43FVX9i6JKYNGFvqJ3heGgZ5r2sUeopV/LxetEXRTKY6/F/r7zOE+SkxKHy4bp0lX2eiLQXsQaxRqUFgvOaJs6jVwWK7mYDjIA7awlRmtaXbX9TdP8AaHeSvuc9MV/zD/rl6uqSM9tO4FV/CcGy/wUmq6dl3VMqhhDTRNCiBALFGpodZQrYHDclWtiC/+Zk3h9qkO77wF091EHwoaX+6jiaN9pkRSKA0zg6FtlVzTRnvo2Rs9waHhc1M9lObwPG1OJlSzoFwhyAKqUamh1lCpgcNyNZONMr2atYw7ZAjP4xNP99FHT7iCP0Lzj2KfQe+FJjOOQ6j3p7vo2Iq/eq47x3jIPJ8+E8b7j7op1eFbLReiq64HKAABoBKVGmoNlRo4LNdQoEVolO2cECwtw7/WKVzXDRto3n9JuRYLmnlVsJf6q+c63WMIt05nDPeTruskhLjMHBZGaJxyoXCFqNVQi0SugcNyOUE/EBdFA+oA2mDmz9E3G3J9EJLLeFfQjWd6id77S65bR3vQw7nv7JKYWtS4SfOu8r+N1DgTQRlQiHINNUKlBg7LVQ46K9yfBM/z+3WiD6VciwSdNcgL2Uy5tHC5bsO5pyj82zaQAzSgEOUaYkK5hgYdlqs76AtsilfnFqkZgeBPqJkfJNNCQQN7VA0TZc81qkouS8cYrvwlCvWr1xAb6jU06LBcOcAZwxW/eYpDJ1oZejKD3hbUL9NPW9/Q6Oj/v1y3qsglsYKhoA2IJuo1xI56DQ02LNcQ0DWGhtkCch3av0gLzhDSm4L6Qq4vnsWMoSnbe4KuL/VSqkObIhua6rAqD3QG0US9hthRr6HBhuUqAQkqDbN58+bmtpFD+H+bdbObdr6lES11Gr38flo0w23QahEcHt4Qkuv6GOSKB1kgGUQR9RqaNm3aSeleEMRcQ4MNy1UcPkkRiUaNGpnblpWVlUv69evTN9XuWZxs1w9o7gC5vf59/xjho3l3uun31zQ6fYCP7BnaFTHK1Vvh4dhYami9Z8+e1y+//PJUxSc41GtosGG5BoIUldk8NMqycePGmQsy75FPmzcC7cxtcor9xuQ016JUh/+Ax+v/VoqVEMOQKh9YQRRRr+HAgQOlZWVl9O2331aEPRUfD2xVrxs3bqwklEINDSQslwcEQHyUV/wW6xGv1xv8YPjdd98lZMbx48ev3L9//7jDhw+XoeEOveWWW2zyZj7WD2LLFepXraH1V1999anP56PMzEzasGHDlj///HPQww8/7Pj9999Pq6iouPyXX345E+edCjrVqIYGHZarHRge5dDN9vXXX+dNnTqVsrOzjby8PKNHjx7k9/upsLCQzJ5gxIgRtGzZMvrjjz8myn8zloapgb4K9avUEP/444+n33XXXdS7d+9gDR6Phy6++GKaPn06nXfeeTRmzBh6//33KScnp4t8P7HX0ODDHyIXAAHiI1zx22zevHm12RjRKCk3N7dqa5i9wIUXXkibNm366r777nOYV/0Yh1VWKUpHoJDINUhOQQ8727wgyPcfJCsrKyjZ008/TceOHbsF550kz69ZDQ0+LFcbUBbh+07xzzzzTMb9999fdcUnYPTq1csYMGAArVmzxsAkxxmyUcZLGVWxgUzFK75KDQng5NmzZxPed/iFga6++mravn378rPOOiv4mJZ8/zWrgcNyyThB0b/5mkY7XPHn6LoelArDwuCV/qmnniLcbz1s3sfUcBIgHtjBSKASlRqsRHR1QUFBUKqePXsa5t8ff/xx5datWwfJyZkEUHs1cFgumSxQ8DeNM6FPnz6dZs6cSWZPhSFV8B5ly5YtX2IImI7j7WvYKG0gHYwCLYFiItcge6Jm6GEPmO/fnJB5/vnnzSHgNCmVTeHCoFYDh+WSCVR9ZSLs/qUDeqdHzJk1DAHNm/1jhw4dGl01BKzhM3hWoIPS2BtlVDXYMMkyyPwIYeLEiYTZwffPP//8qif1E+qiBg7LZaYbKAd+YAUdzF7rscceI8MwHpRX+poMAROADSSCIpAPGoHYE7mGdj///PM7b7zxhnHkyJGz8LpFjFLFXgOH5ZJpAvJA8e233z5y3759H99zzz3JYUPAWL8KbwVJoA8olRLULJFrKAHuQCDQSV4YrPLCUPc1cFiuqqARtpWP8RSBHGAP+4mxeElCNYQ/8ZAI/KAIjKjjnyRrC3JAGcitixo4LJdqL5AK+oNRoFA2VB0IkC6PpwEH8IBeYAAoAcUgUAef/fzP18Dhxe/ag+5AAB8IgB4gE+jADewgATQHdZB6VwOH5eJwOCwXh8NycTgsF4fDYbk4HJaLw2G5GmY4HJaLw2G5MjS9Pxhrbi01D4fDcrk8+nRzOaGzSnw0aZw3uDVfm/stHA7LFXNv9fm5pT46tjy48IJBq0Rwa74295vHLRwOy6UWt0efMrbYF1yIwVwyqGKJRkeWyC1em/vN4zhvsoXDYbmij7kIw76FgkJiYRtGBcD+4HHzPAuHw3JFF7tTTx+SH1z4zqjqsU4E+4PHzfPM8y0cDssVOQ6h555TIhcbX1I95nHzPPN8C4fDckUOZgMT8/P8RB9G6Llw3DzPPN/C4bBc0SXZrldunKcFV5E8UTC8Du7fMFejFJxn4XAUwrOFXr2sqH+o9zqyLLgOMhAgJJa53zzu8eqjLBwOyxV9egT8fVKFTv3z/LTlJRdVLtWCQ8SjkGvdLBf1xf4Mt747oPtTLBwOyxV90pw6fTzdRT9MFLRqYPqx1YOTaO3oZFpT1I0+OM1Oi0s1Y/ppHvLpfrJwOFGGJzSELkoH+YjeF8bBN4Tx600a/XqjZvxxu0a/3aLRdxdrtOUBQfSOMByaTppbb2nhcFiuyLFret55xV6i5YKOrhIQStDPUwRBNDr2nqANdwo69LYgWi3o5gkecmr6ZRYOh+WKHPRGp11a5iVjiSBzMmPnc5DrhpBolSsEbbxL0IHXBR3H309d7yGH0O+2cDgsV+RkuAJn/PNMLx1796/HnzbNgFjLQ3JtulvQ/vkhuR68Fj2XS59qqf9pBJqB5pKmoE7DYbnadk/NuOXmc7x09B1TrhCHF4W2plx//gtyzRNkrBR09+Vewvn3yd9ary8NtgMQoA8oAaPAMDAYDAIFoEgeGw0KQQ/QrbZr4LBcrcKWyBkIWR675wIPHXmrqueq2kq5ZkCuuYJolXnP5aWkZIe5BlY2KAMDQRKo64TXUAh6AjvoEraavy2MOLnfBpKBB/SprRo4LFdr0A+UgIBsiO3SMzyPPX65hw6/IXuuJVWEhoabHwgNC80JjcvO9KHncp4rV8aPA3YwAJTW2kIG6jXEhS++EGllkzBstVEDh+Xyy8bjBtawxnhKWob3pdmT3HRo/t/LteVBQQcWCKL3BI0e6qMuiamDZcNMkMSBrrLRF4P2IPao19ApdmKvgcNyNQfDQR6w/c3Kke1TM3xvvnWzmyqCcmlhw0JsTbkeFnTozdCDu7176dSqzSlpJ/47YQ00TQogQGxRryFmYq2Bw3JVrYgv/s2i3R0zhOumEQP99NINboNWhqbj978uezHIte1RQYcXhoaFeMCXZGOPtKBcIcgC6lGvISZirYHDcjWTjTId2CI0ptYpdtdkc8hHa0KTGJvvx3Z5SLRtjws6in3fveCiVIf/V/P8KHuAAhAA6lGvQZlYa+CwXEOBFmWjjO9o6xo4Ld8fvK+qXBl6KgOSBeXa8Yyg3U8Imnq2l+xO97/MyQyFxikXCleMeg3KxFIDh+Vygn4gLspGFN+qTYf0vGzI9X5Iqt9u0qgi2HNptGumoO13Czp7sI+6pdjLFP7dBJAIyoBa1GtQJpYaOCxXOegMElSu0F6fHvo+11L0XLcI+n1O6Ltcu2YJ2nmPoLIBPuraPW2wYk9iAzlAAwpRrkGZmGpo0GG5uoO+igIkgOapGQGijwRVLNZo8zRBKx5201H0XntehGD/ElSY56f4zt16xfBvJ4IShfrVa4gN9RoadFiuHOCM4YrfLMWhE60MzQxuvUPQo1M8wecJ97wEIFduLz+dfEpHRwxT4VYwFLQBkRJzDarvK+YaGmxYriGgq+KQsM1XX32Vkubwbltyv5tohTA23q7RpPHe4CNPe18BkMvv10meD5SHVXmgM4iUWGto8eSTT2oqgsVcQ4MNy1WiIEA8aLt169bPV6xYQXiMXEPvdfDyMV7qn+WnCaO9hjl7uG+ORgdmCCPdFSCzEcfYo2SBZBA5UdbQuHFjc2udMGFC4nfffVfxyiuvEF53UBRMvYYGG5aruOpqHqFRdsSV3v7NN98c6tmzJ2VnZxPymgXplpx+bUp6xtnZvfTgb8UfWSCMH27RKN0V7LlOirFh9lZ4ODZiDU2bNjW3Jx84cGD0vHnzjnk8HsrKyqJNmzZtwf5TFCRTr6HBhuUaCFJAwr9rlAcPHhwxZ84ccrvdlJuba0AuY+zYsbR58+bPDx06NMyCdE3sNk24A/TaVDf16+UnpxBXmlLGOKTKB1YQKRFrkPubE9Htd9xxB/l8PsrLyzPMOswLxRtvvEGVlZVPXX755d1MyZo0aaIsk0INDSgslwcEqrtqy0Z5z4033kh+v98wGyUgE1MwTdPo/PPPp1dffZU2btw4D+enpmd4X3cKbbK8mY/1g9hyhfqrr0EOZffv37/szDPPJMhU9f4Jcpk1BOvKyMigf/3rX7Rhw4abFC4ICjU0xLBc7cBwYP2bRtlm3759H5aXl1OvXr2CV/revXsHr/a6rlPfvn1p8uTJQbHef//9z7ds2fKwfBqjfQ0aaALQQF8QZU6o4YT7q59//vlQTk4Ome/dBLVQIBAgc3vppZfS888/T7iH/Hnbtm0vX3LJJQ6Fe0SFGhpq+EPkAiBAfFWjxPApZd26dftMkTIzM4NDqaFDh9Kdd95Jb731Fv3www/LiOjGTz/9NE/eV50MOsr/viZYpSiQUyFhNTRq1Mj8dzrs2LFj1GuvvXbM4XCQ1+ulESNGBN+/OQzEbOcqIpoG8QabPRtoBTooiKVQQ0MOy1X1JHk8iPv++++LZ82aFZTpkUceoSVLluxGrzTv+PHjl7300ksu+YBsu7Bv6ibU4vR1ZkxX/BNqwMTLaEgUfP/Lly//befOnS/ivuqCp59+Wsj33xZ0VH//6jVw+MFdJygCbf74449X/vzzz+dxn3JWWVlZF9kztQfW/+DnQvHADkaC2CJrwIREHLbtP/vss0HYtgvrleJifP+x18BhuWSyMKwbLId4Herw+1A2kA5GgZagJskCBRgaxin0SnVSA4e/iRwI+8pEfB08g2cFOiitQaOs/zVwWC6ZbqAc+BV+e0K1QdpAIigC+aARqEnqfw0clkumCcgDJcANbJIESaxfhbeCJNAHlEoJajH1vwYOy1WVtiAHlINcYA/7ibF4SUI1xMtzrSAR+EERGFG3P0lW9zVwWC7VXiAV9AejQKFsqDoQIF0eTwMO4AG9wABQAopBoA4++6mfNXBYLoW0B92BAD4QAD1AJtCBG9irnusDdZB6VwOH5eJwOCwXh8NycTgsF4fDYbk4HJaLw2G5GmY4HJaLw2G5MjS9Pxhrbi01D4fDcrk8+vR0p05nlfho0jhvcGu+NvdbOByWK+be6vNzS310bLkW/L1CWiWCW/O1ud88buFwWC61uD36lLHFPqKPhRFaslWjI0vkFq/N/eZxnDfZwuGwXNHHXIRh38KwtZDDkGskB4+b51k4HJYrutidevqQfD/RB8Ko6rFOBPuDx83zzPMtHA7LFTkOoeeeUxJcDxkiVY953DzPPN/C4bBckYPZwMT8PD/RhxF6Lhw3zzPPt3A4LFd0SbbrlRvnhZZpPVEwvA7u3zBXoxScZ+FwWK7o4/HqYwr7h3oviIQJDA2Etngd3G8eN8+zcDgsl1o0t749J8dPv8x2UeVSF3otjY5iu+55Fw3I85sfJH9m4XBYLrVkuPQeZYU+2nC9Zqzpm0Ir8rvSR+XdaFVBIq0tFvTCSLfRrzcE8+ouC4fDckWfxDRdXHOGl2itoJ+v12jTvS5af6WLfrxGo80zNKK3BY0c4CNIGLBwOArhCQ2Hrl9xOuT6QNAvUwUdeju00Pjvtwo68IYgY6WgJyZ7zEeg7rVwOCxX9EkX+oArRkOu9wVtvFtQ5QpBe14W9NvNkGuBwPOGgt75l9uchn/NwuGohO+5ModfPcYb/KB414shufa+ip4Lcu2bG5Jr0YygXHMt/xtpBJqB5pKmoE7DYbk6AHvXbql3TBkLuVaZ0+8h9s0x5QpJdgyyvQu5uqe53sf5btCtHjXYDkCAPqAEjALDwGAwCBSAInlsNCgEPf4TNXBYrlZhS+QUAn9Kurj/7vFeOr78L7n2zwvJtftlKdd9bkqxexfj/DTZkMvAQJAEajfqNfQEdtAFWEEcsIURF7ZyZjLw1GYNHJarNegHSkBANsQ40C4tw/vKy5PcdHTxX3IdeF3KNTsk1xt3uynV4Z1vnh/WYO1gACit1YUM1GuIj3K1k4QqaqsGDsvll43H/TfrW52cmuFf+8HdLqpY9JdcB98ITWjseUnQcTlbmObwPCRX+A9vqHGgq2z0xaA9iDWx1hAjsdfAYbmag+EgD9iqWZmxZUqGvnfrTI0q3pGPPi2DXG8J+vVGyPWKIFotaPJ5XsLw8UqzYVfTSONAmhRAgNijXoMyMdfAYbnCVsQXEdZDbqe5fSvOHe6jTa9qxtHlocmMwwsh1w2hCQ16XxglhX7qkpgySDbwSAvKFYIsoJpYa1Am1ho4LFcz2SjTI8hQRavudv9XHzziouOrBO18VlDFYkG/TIFo8zSitcKwC53kwnMJUfYABSAA1KNegzKx1sBhuYYCTaFRtsdkxSvz73IH76+2PxG67/rtJoiGv1+c6iGH8P8gJxRUGqdcKFw96jWool4Dh+Vygn4gTqEhdcBkxVMzb/TQsWWCtj4S+iD5j2mQ6x5Bo/N91C0lfZhiQ08AiaAMqEa9BmXUa+CwXOWgs+L9Scc0h/veh6/z0NElgjY/IOjoash1m6Dd9woakuen+C7dsmPoRWwgB2hAJeo1qKNeQ4MOy9Ud9I2hh2mXku66acaVkGuRoD8h1LE1WlCuPTME5fTUqXW7DnacFx/jlb9Eof5Ya7A1btxYSRzlGhp0WK4c4Ix0xW/UqFHVFbmt3+9PIKLbktPEVXdfimHhQmGsv02j4+8J2nCHRvvvE4bm1QnnnhJjT2IFQ0EbECmqNcTL99Vu48aNQ816mjRpoiyQUg0NNizXENC1uoYp91tB8++//37A9u3bFz3zzDN06aWX0ptvvXNN755eqnxdGIuudBn0gaCNdwna9S9BqVqA5OxdrMOqPNAZRErEGiRxoNW8efNce/bseXnWrFk0ceJEqqysvFzW10kBtRoabFiuEpBgUs0Vvi0RXf3xxx9vnTRpEnk8HsrKyjJ0XSfkkZPbthvn8elkSw4QfSqMTXcL+mmaRmmafhj/bYsYG2Y8yALJIHJOrEEiX58KmhuGMeGTTz756rbbbiOfz2fWQF6vlzZs2DDX7MVilUihhgYYlqu4qiGGXeFbzpkzx3348OFZc+fOpaFDh5IpU3Z2tpGXl0cgKNiMGTMIGWRBUjN02r9Yox0YEn55I+QS/k1mT1GDhtk72odjw2sIG76efPbZZ3etqKiYsWDBAiorKzuxBurVq5dh9sKPPvqo2et1VLj/UquhwYblGogGmSIb5En79+8/a926dd/cddddhHsr6tGjB/Xu3dtAo6RwcnJyDPQAxk033UTIQ40aNzm7oK9OMy91U3ZPnTSX62azwdZgSJUPrCCaDAQpzZo1M//b1r/++usQ1LD8/vvvp0AgYBK8GKAOOhHUQM8+++zhLVu2jDMvKvLfUEChhgYXlssD/EuXLu3/+++/kzlsGjNmDI0bN47Gjx8fBPdXf8sVV1wR5Prrr6fjx4/tMr/7lC68cxKTuvcxh5M1/CC2XKF+DwiA9ps2bXrz5ZdfpquuuoruuOMOMi8SVUC2IPfdd19w+/jjj9Njjz1GZg+8YsUKOnjw4PNVDxkroFBDQwvL1Q4Md7vdnb7++utyCDZi8+bNI/78888g+Lvkp59+Kvw7MMEx8Msvv+z7xRdf9MPQKlM2zFOArYYNUwN9QXSRNQBrt27dumAYqC9evFjHe3I88cQTGVVcfPHFSbgYBMHf3RITE23p6ek2h8NhkzK0a9q0acxSKdTQgMIfIhcAZ9iXBk/EFgXx8n6nplilKB2BSgqAAPEKJJxAJ1AHNTSksFzySXLZ4P67TzZkKl7x630NHH5w1wmKwr+mUcfEAzsYCVRSv2vgsFwyWaDgv9A4bSAdjAItgUrqfw0clksmEPaVifg6eILcCnRQWoNGWf9r4LBcMt1AOfAr//aEwkOzIBEUgXzQCNQk9b8GDssl0wTkgRLgBjZJgiTWr8JbQRLoA0qlBLWY+l8Dh+WqSluQA8pBLrADG4gLn9Kuhnh5rhUkAj8oAiPq9ifJ6r4GDsul2gukgv5gFCiUDVUHAqTL42nAATygFxgASkAxCNTBZz//8zVwePG79qA7EMAHAqAHyAQ6cAM7SADNQR2k3tXAYbk4HA7LxeGwXBwOy8XhcFguDofl4nBYroYZDofl4nBYrgxN7w/GOjS9n6Xm4XBYLpdHn57u1OmsEh9NGucNbs3X5n4Lh8NyxdxbfX5uqY+OLdeI1giDVong1nxt7jePWzgclkstbo8+ZWyxj+hjYZjrclUs0ejIErnFa3O/eRznTbZwOCxX9Elx6LRvoaCQWNiGUQGwP3jcPM/C4bBc0cXu1NOH5PuJPhBGVY91ItgfPG6eZ55v4XCiCMsl9NxzSnxEa6RM1WAeN88zz7dwOCxX5GA2sGt+np/owwg9F46b55nnWzgcliu6JNv1yo3zNKpcFhLpRLHM/RvmapSC8ywcDssVfTxe/Yyi/qH7riPLgjOEf7Es1GsV4jjOG2PhcBTDn3O59C/vHOWhQ3PQWy3WgNmDabR1tkb98/zmB8kvWzgclks9qU797ffvcdHn5Q764pxUWnd5On1+dip9/Y8MenGMm5wefYuFw2G5YprYePGtGW7acq9GG+/UaOdMjfa9ptGf0zX6+AYXpWn6eguHw3LFNCX/8Iu3uWnrDEF/3iuociVYLmjP84Jev9RNdpe+2MLhxBR+tvC2x6Z4aNsDkOs+U6zQhMaB1wQ9Mc5NDrf+pIXDYbnUIzw9Lr/vGg/teBhyzYBYy8EyyPWKoNvHeEnzZU6y/O+kEWgGmkuagjoNh+XqAATIaXdK3ENTz0un3U9oIbmWhTj8ikYXDkqndqd0fATnDQI9QLc6aLCqNfQBJWAUGAYGy/dbAIrksdGg8D9VA4flahW2RE4h6AlSu3RLu2DSuS7a97TsuZZKuWYLOn2Am7ompVYtUuCRDbkMDARJoPajXoMddAHWE5enla+t8u/k2q6Bw3K1Bv1ACQiALmGLF8QldEkpmzDKRQdmSrmWhOSqeEFQfi8XWeO79JaNMyGswdrBAFBa6wsZqNcQebUTeU5t1sBhufyy8birWd/KFt8pqaC8yEUV6Kk23Rv6qknlcmyfE4bX7SZL0+aJJ/w3CZI40FU2+mLQHsSe2GuIgdhr4LBczcFwkAds/2ZlRtup1s69Cvq56Oir6Ln+JeVaodGBxwR1S3eT/Leqa8xVDTRNCiBA7FGvQZXYa+CwXGEr4oso1hSOb9321Izsnm46Pg891z2Qa7Ggo6sE/XibBrlch3BOC4UF5QpBFlBP7DUoEHsNHJarmWyU6cAWXYNq1MntcRO9Ablkz3V0qaA112iUlO76Ud7vqPQABSAA1KNegyKx18BhuYYCDdgUGlOr7umQa6Ew/rhd0J6XBe16StD8S025tJU43la9ccqFwtWjXoMy6jVwWC4n6AfiFBtT864pkOsdQRtuB3cI2nyX+XSGi7qnixdw/JQYGmciKAOqUa9BGfUaOCxXOegcw/1JC8h17ODrplwabbhT0Ja7Bd16OuRKy5gulzftpIgN5AANqES9BnXUa2jQYbm6g77R32eFf8CKPzqnbd/8qhbquSDXtnsEXTrMRd1S7JfJc2K98peAaBKphgQQf8L7PhW0ByeDViCucePGyhIp1NBAw3LlAGf46vVhjbADaAtag2Zutzv+448/ztm7d+9ZRHTLtm3bZj7+9OyKzx9LoY1Srp3/Mp/OcFHnbimlNRiiWcFQ0AZESngN8fI9t5P/bQvQ/Nprr+3++eef5+3atetMIvrn0aNHH/npp5/e/Oijj7588803t+LvcervVb0GTsOT67SwBbXbLVq0SIc0o4ho0uHDh5/65ptvVixfvvyPefPm0WOPPUaTJ0+mM844g3r27EmXXHIJTb1l+qY1D9tp0x0huXbfKyg/y0Ud4ztn1WBiwQbyQGcQTYaALgMGDOj6559/vvTZZ58tXbZs2XcLFiw4MHv2bJoxYwZdd911NHbsWMI55PV6Sdd18vl89MADD5AQQn3KXr0GTgOUa/h333139qZNm2j+/PnBRjh69Gjq3bs3OZ1OqmqIPXr0oKysLCM7O5tycnKCcq1atWqfpVHrV5c/rEm5NNp/nzA8HjdZmjTvWoMGGw+yQDKIJiWgw/fff/8+hPr5xRdfpEceeSR4ITCFys3NJfS6VFVHr169zPoM1EPjxo2jrVu3Xq5+f6heA6fhyVUM4levXl2AYdOE48eP3/PLL7/M/+CDD7566623Ds2aNYumTZtGF1xwAQ0aNCh4tQ8EApSZmUlFRUU0c9bs7TdfkE6H7xfGIfDDbRp1d8inM2omV2+Fh2OLmzRp0kneR7UBJ4F2ixcvDuzYscPshSfv37//6a+++mrlkiVLNsydO5cefvjh4IVk2LBh9Prrr1OUH3jHXgOnQco1ECSDOEnHsEbaArR+7bXXPJs3by4xDOPaysrKx9etW7d0xYoVv7766qv0+++/k8fX43c8kUGpGW7zw+PjGQ77ZTXsCWwgH1hBNBkIUk6Qubr7x1agGS4Mnb/44os+Bw8ePH/9+vWj1Cdf1GvgNDy5PCAA4iM82hM+09YOtAbN5euWsrdoLbfWWvggtlyh/gg1RJz5VJ8tVK+B0wDlageG10CIhLAtqJWGqYG+CvXHXoM66jVwGvSHyAVARLjy1xVWKUpHoJL6XwOnQcrVBpSpf9+p1rGBTMUrfr2vgcMP7jpBUfjXNOqYeGAHI4FK6ncNHJZLJgsU/Bcapw2kg1GgJVBJ/a+Bw3LJBMK+MhFfBzf+VqCD0ho0yvpfA4flkukGyoFf/bcnlKbBE0ERyAeNQE1S/2vgsFwyTUAeKAFuYJMkSGL9KrwVJIE+oFRKUIup/zVwWK6qtAU5oBzkAnvYh6/xkoRqiJfnWkEi8IMiMKKOf5Ks7mvgsFyKvUAq6A9GgULZUHUgQLo8ngYcwAN6gQGgBBSDQB189lM/a+CwXAppD7oDAXwgAHqATKADN7CHfZ2lTlL/a+CwXBwOh+XicFguDofl4nA4LBeHw3JxOCwXh8NhuTicBiCXQ9P7ZWj6WHNrqXk4HJbL5dGnpzt1OqvER5PGeYNb87W53xJbOByWCz3V5+eW+ujYco1ojTBolQhuzdfmfvO4hcNhudTi9uhTxhb7iD4WhrmKf8USjY4skVu8Nvebx83zLNGHw2G5Uhw67VsoKCQWtmFUAOwPHjfPs0QXDoflsjv19CH5fqIPhFHVY50I9gePm+eZ51sih8NhuRxCzz2nxEe0RspUDeZx8zzzfEvkcDgsF2YDE/Pz/EQfRui5cNw8zzzfEmU4HL7nsuuVG+ZqVLksJNKJYpn7N87TKBnnWaIPh8Nyebz6mKL+od4LImECQwOhLV4H9xfiuHmehcNhudQi3PqffXL89P0LLjq61IVeS8NWo+9muSg3229+kPyRhcNhudQCcV67aISXVp/lMj4YmEYrBnalj8q70YoBifTFqAz6405h9PD6ye3jmUIOy6U6Hf/UvDvdRB8L2jxDoz/vcdFP17po66Ma7Zql0cGXBF2T6yHh06+xcDgsl9KjT7c9co2HaLWggwsEbXlI0I7nwDMh9s4UdGWO15TrcguHw3IpfdZ18QNXheSqWCToj9tDUm1/Wsr1pKBzsoJyjbZEHw6H5UoXmSUzLg/JdeRdcyV/2WtJdqMnG9nDR+7MnlmW/400As1Ac0lTwOHUqVwdgCMuIem6ey71UlXPtenuUK9lsuNZQTvvFsbATJ1Obn/KOTg/ALrVowbbAQjQB5SAUWAYGAwGgQJQJI+NBoWgx3+iBg7L1SpsiZxCEIjrlDz29one4CNOh98W9Oe94XJptONWYWR4dJK/te6RDbkMDARJoPajVkNPYAddgBXEAVsYcXK/DSTXdg0clqs16AdKQAB0qWp0cZ1TB18/LiTXobfC5AK70HN9eI2L0t3+rXK9qvCV8+1gACit/YUMlGqIj3K1kwRJrdXAYbn8svG4/2Z9K1t8l7TTJp8Lud4TdPB1QRun/yXX7ucEPTrRQ3bheV4OwU5sqHGgq2z0xaA9iDWx1hAjsdfAYbmag+EgD9iqWZkxrnM3e9nU80Ny7ZoFqR79S649kOuu8R7qniYukY26ukYaB9KkAALEHtUa1Im9Bg7LFbYivoiwpnBcYveMsbdNgFwfoNe6R9DelwRtexJiYbsXct14jpe6pWScZZ4b5YJyhSALxB6FGtSJvQYOy9VMNsp0YIvQmKxJqeKi6RdDrpXCWH+lRkcWQ64nBB2YL2gf5LrmTB91SbKPMBu4Qg9QAAJAPUo1qBNzDRyWq1GjRsOwcYCOwBbh/sTWtVv3vnm9dfrzcc346Z+CquQ6/Jag/TMFXVjqI1uXlP7muWqNUy4UHlvCa4gDttrvudRq4LBcTpC9YcOGCb///vsZH3/8ce6ECRO6yXuXlqANaAdODZu2bpGc7l2y+AE30QfBGUPIFfrM6+DzgkYV+qlDXNeAlFSlcSaCMqAaJ8j98ssv/7Fjx47zd+3addann36aO2TIkM6yR2sF2oJTwuVTn+RQq4HDcpWDttu2bVv67rvv0jXXXEP33HMPvfzyy/T222/vf//9979dv379osOHDz9BRDfs3bv3rK1bt2b7AjmvvDoNcq2CXG+EJjPMpzUOzxLUP1enk1q1T41hMsEGcoAGVFIO4j755JOJc+bMoQsvvJAuu+wyevDBB8l8vXjx4i2fffbZB6jxRSKaduDAgXFff/11/3/+85/dwy4iJ4O4xo0bq0ulXgOnAcjVHfRt0aKFzRSsf//+XSoqKh56/fXXCVd9crlcpOs6BQIB8vl81KdPHxozZgxdd911NHrMWHrsny4DcmE6XqOdzwmqNL+V/IIw9IBOVRMKMV75S0B0kTVAiqqFwVsdPXr08uXLlx8eO3YsaZoWfP+ZmZnk9/upV69eVF5eTldddRXNmDGDXnnlFXrjjTd2Llmy5JsPP/zwgupnOGOvgdMw5coBzioJ5LYDaEVEV2KIuPPyyy8nj8dDvXv3NnJzc42cnBzKzs42/IGedOclHoPWhCYyNj+j0bFlgoyXhJEuAuY/flKMQy4rGAragEiprgYraIoeqvSLL75YN3nyZPJ6vVU1kKwh+NoU7oEHHiD0esvXrl1bonCfqF4Dp0HJNQR0PVGCsAbabMuWLcN+++23j3GVD/ZiuPIHG+bo0888fsWZWuiDZMi1apqLaK0w3r3ZTQ7Nv9UUtAbDqjzQGURKtTVgkqbq32oBwbJwP7nYlMiUKSsriyCZ0bNnT5o9e/Yh7O8ih4U2+d+po1YDpwHIVVLdY0AnNNDWM2fOFIcOHXoJ92Lm8BD3ZtcdHjtMBCc0DkOu+VPcRopDJ6dLp7ZtWibWYKIgHmSBZBA50dUQD06eNGlS0v79+19FLZSXl0dOp5OOHDnyhJzo6KSOeg2chiNXMegUSYSwBtoedCCi299dvOSXAdkZRF8I49gbwnhgoofSMzyPmz0FSKhhw+yt8HBsVDWA8BpOraysnPbmm2/Spk2bLlW/z1KvgdPw5BoIUhRlSAAdgUVz63vPK/fRnJs9lObUqV3bk5Nr4XEjG8gHVhA5NavhJHPbpEmTSOfHXgOnwcrlAYEaCNEmza5dme70vt3x1A522ahq44PYcoX6Y69BTUj1GjgNWq52YDiw1qAhWUF7EF9LDVMDfRXqj70GddRr4DToD5ELgIggR11hlaJ0BCqp/zVwGqRcbUBZrT8KpI4NZCpe8et9DRx+Kt4JisKfqqhj4oEdjAQqqd81cFgumSxQ8F9onDaQDkaBlkAl9b8GDsslEwj7ykR8Hdz4W4EOSmvQKOt/DRyWS6YbKAd+YP0PfS3DBhJBEcgHjUBNUv9r4LBcMk1AHigBbmCTJEhi/Sq8FSSBPqBUSlCLqf81cFiuqrQFOaAc5AJ72E+MxUsSqiFenmsFicAPisCIOv5JsrqvgcNyKfYCqaA/GAUKZUPVgQDp8ngacAAP6AUGgBJQDAJ1/9nP/14NHF78rj3oDgTwgQDoATKBDtzADhJAc1Anqf81cFguDofDcnE4LBeHw3JxOByWi8NhuTgclovD4bBcHE4DkMuh6f0zNH0s6G+peTgclsvl0aenO3U6q8RHk8Z5g1vztbnfEls4HJYLvdTn55b66NhyjWiNMGiVCG6PLxdk7jePWzgclkstbo8+eWyxj+hjYRxZKqjCXIBhidzitbnfPI7zrrdEHw6H5Upx6LRvoaCQWNiGUQGwP3jcPM8SXTgclssu9PQhA/xEHwijqsc6EewPHh+S7yecb7dEFQ6H5co9e6SPaI2UqRrM4+fgPIfQ8yyRw+GwXJgNTByQ5yf6MELPheP5OA/nd7NEGQ6H77nseuWGuRpVLguJdKJY5v6N8zTznuuoJfpwOCyXx6uPKuwf6r0gEiYwNCC3eG3uL8Jxt1dXWXibw2G5egT8iRlufVffXD+te95FRyFVsMfCdstLLsrv46dUoZPXpxdbOByF8OdcPp3uLfPQ4lGa8dFwO60pSqKPRyfTqkFJtGJAGn12jmZ8coNm9O/tJ49PP80SXTgclispXSf6QtCemYJ+u1mjH6/RaMN0jbY/qdHuF8DzgvbOEvTiBDc5XPorlujC4bBcuVl68CmMfXM02vG0oB3PSp4RtP3p0HYXXr9ykZvsLn2+JYpwOCxXy8BJVZMZB+YL2vJwlVQSKddu8PA5bsK92UMWDoflii79ciDXR4IOLhC09ZHq5bpttIeEJzDZUv/TCDQDzSVNAYdTp3J1ABkYFkq5qu+59jwl6KoRXuqWnH4L/pvO9ajBdgAC9AElYBQYBgaDQaAAFMljo0Eh6AG61XYNHJarVdgSOYXA3SMzeM9FwWHhQ38v137IVTbATwlduo2VPxtdBgaCJFD7UauhJ7CDLsAK4oAtjDi53waSgQf0qa0aOCxXa9APlIBAWENs7fEGiNZCoHmCNt8Pof4/cmlU8ZQwMA1PcjGDOIkdDACltb2QgUINcSA+ytVOEsKw1UYNHJbLD0YCd/j6VpJTe/UI9Vz75wraePf/t+faide/ztAoVQQff2p+QkONA11loy8G7cF/In4pgAAda2eNrthr4LBczcFwkBMXF2eTw6k4ENa4mnYZmOcPyrX3Fcg1PSTXidPwb/zTTenCt9JcwqeaRhoH0sIEqK1U1ZAHOn7++ednXnHFFd3louS2Ro0axShW7DVwWK6qFfGdoMMff/xBnyGHDh36B16fBE4FtiYtTkkbURCSa9uTEOqJv3qs3S+EtvtmCpoy1ktpDtck2fNFWlCuEGQB1VRXg6i6b1q3bt34V155hb7++us1O3bsOE1OSlhj78XUauCwXM1ko0wH8cC6bdu24TfeeCOdfvrptGjRIjIM48EpU6Yk4Vji0Hwf0afC+OUmjQ7Ol3I9JejIopBwB54XNH6Ej7p2Tx9uChllD1AAAiC2hNcg/5+NGzfuZAq3d+/eBwcNGkTjx4+nVatWHSKia7H/ZHCK+rrJajVwWK6hQDuhUbY/duzY+ZMmTSKv10u9e/emRx55hHbu3Lk0K3fA0WeudAen2w+/FRLLlOrostD20CxBY4p8mClM7mP+mwqNUy4Urp4Ta6iiWbNm5vYkvO+nCgoKSNd1MkWbPXs27d+/f/bdd9+dojRkVKiBw3I5Qb/weyuTJk2amNuTiWjqhAkTKCsry4Bghina6NFj6IxhboM+Qi81z+y5tKBUxmotKNrhFwQN6e+n9h0TPAo9QwJIBGVAIdXXUIWU5mQI9kFOTg4Bo1evXkHR7rnnHvruu+8+wJBxqNqQMXINHJarHHT+uwbVtGlTc9sSQ8LHzOFhdna2kZeXB9GyqWSwj+jD0HS8+XzhTw9qRO+FJjSOvCgoJ0unRk1bJioOu2wgB2gWhYTXEKHht926deueQCBAubm5BiB5wQgOGVesWHGYiK4zzwMd5QVGEnsNnIYpV3fQ998N3eSwqnllZeWC0047LXjVz87OoYF9INdHoel4c+p9+a0uog/MB3g1OjpbGJpHJ3lfkxDDlb8ERBdZg8Lws+Mvv/xyyOfzES4UBiATXDiCkqG+4PD3559/nmSeG3vvhRo4DVquHOCMJIDswZrjHuXDfv36UTYE65npC33WNSc09f7EJR6i1fh7pqDK2YJSnAGSkwydFLGCoaANiJwoawgjHmIlfPnll8fcbndQMAgVlOzpp5+mr776atWRI0cexzA4SeHfVK2B0wDkGgK6RtOI5H1Li+3bt//Yq1cWOYTfoLXC2PeaoD3PCZpyhpcOL9Oo8lVhrLnDRXZNP2gOKWMcVuWBziByFGoII/6iiy5KXLlyJUGw4AQHhourcRE5Vfa2p6qLpVQDpwHIVQISTBSGPCfjM7AdCYkamXLtfUWj/eitrj7da/TP89Okf3gpOUOvTOme1DvGae54kAWSQeSo11CF7bbbbktauHAh/fnnn2vwulXsQinXwGkAchWDTjHcFzVOg0Db39To0GvCwDDQyM/1U0qac3yqXZskr/62GjTM3goPx8ZSQ3gt7UBb9ckL9Ro4DUuugSAlhoZpzchwXtgnR6fXb3GT16+T5vI8Ih+UtdbCkCofWEHkxF4DUJdSvQZOQ5XLAwIxDt9OznBqV6VneN+0xsVrZg+A+7LaetKhXKH+2GtQR70GToOVqx0YDqwxNqSOoD2Ir8WGqYG+CvXHXoM66jVwGvSHyAVA1JMrv1WK0hGopP7XwGmQcrUBZerfd6p1bCBT8Ypf72vg8IO7TlAE4v5LjTMe2MFIoJL6XQOH5ZLJAgX/hcZpA+lgFGgJVFL/a+CwXDKBsK9MxNfBjb8V6KC0Bo2y/tfAYblkuoFy4A///YxabpA2kAiKQD5oBGqS+l8Dh+WSaQLyQAlwA5skQRLrV+GtIAn0AaVSglpM/a+Bw3JVpS3IAeUgF9jDfmIsXpJQDfHyXCtIBH5QBEbU8U+S1X0NHJZLsRdIBf3BKFAoG6oOBEiXx9OAA3hALzAAlIBiEKiDz37qZw0clksh7UF3IIAPBEAPkAl04AZ2kACagzpJ/a+Bw3JxOByWi8NhuTgclovD4bBcHA7LxeGwXBwOh+XicBqAXBma3h+MdWBrqXk4HJbL5dGnpzt1OqvER5PGeYNb87W538LhsFwx91afn1vqo2PLNaI1wqBVIrg1X5v7zeMWDoflUovbo08ZWxz8rXjjyFJBFUs0OrJEbvHa3G8eN8+zRB8Oh+VKcei0b6GgkFjYhlEBsD943DzPEl04HJbL7tTTh+T7iT4QRlWPdSLYHzxunmeeb4kcDoflcgg995wSH9EaKVM1mMfN88zzLZHD4bBcmA1MzM/zE30YoefCcfM883wLh8NyRZdku165cZ5GlctCIp0olrl/w1yNUnCehcNRCM8WevWyogGh3gsiYQJDA6EtXgf3F/X3k8erj7ZEHw6H5QrofrvDpVNunp/WzXJRJXqrisWauTXWPe+i/n38ZB73e/XmlujC4bBcmQF/tl3T6cFzPcZ3pcL4+DQHrR2VRt9MSKfPz0qjT0c5jq8u1SoeH+UmzacTRPRbIofDYblSHfrxn17WiN4Xxq7nNdr9Qohds7CdpRmA9r0o6MBsYay/VaMUoe+2cDgsV8SZwk59sv1EH5lPZmi0/SlBO5/5G54VtONZjfZMF0avnvxBMofliuZ5wjOuPMtLtErg/iqCXE8L2jJN0JWjvJTq1LMsHA7LVX0cmv7As1M9dHwFeq53g3IZ1cm1/UlBmyDXHf/wkNOtX2Wp32kEmoHmkqaAw6k7uVId/i8+ecpFR5cLOvC2dszsnaqTa9vjgjbcJmj59S5KzvC9a6k/6QAE6ANKwCgwDAwGg0ABKJLHRoNC0AN0q1XpOCxXixYtWmPjBVkpjkDVh8TG3gUaQa5qei6Ntj4i6Pdb8feDgpIc/v2y4Q4ESaCu0ypsmZ8i+Xdq48aNu2JrBXHAFkac3G8DycAjZSyrjRo4LFdr0A8U/vHHHx9/v379crvDGfyA2Fgp6KNH3bTrmep7rj8e1uj3WwTtm4FJjV7BSY1TQToYAErraCGDqhpKQAB0AaesWbNm4rZt287C322bNm0aaWWTIGHS2WtSA4fl8svG4wYd9u/ff+bZ55xLIwa5DXpPmNPwdO/VXtrz7N/LtXemoOkXeGjnnYK23S2Ma073Upck+0izcUq6ykZfDNqD2BNdDeFrdJ26d+/eGbfeeishk0wBTxQssmzqNXBYruZgOMgDtrAG2eLZ52bRlWMF0WpBv72m0W2XeGlvNXLte17QpLFeWnKtC3JBtLM8lJbhvkOuENIprIGmSQEEiD2RawgXJP6xxx6z33LLLXTllVcSMt2sr1mzZvJ4ZFRr4LBcVSvii79ZU/iUgqLhLz18nTs4Df/KNDdNuxRyPReSacczGu1+LrQ1h4T7Ide1Y7x0ZbmXdt0j6P0bXZTsCE5qtKtmQblCkAWUo1BDkEaNGpnbFqtXr/7N4/HQeeedR5WVlQ9h30m4B1MULHINHJarmWyU6cD2Nw2ofXK6561374Ncnwrj6rO9dMdlf8m1C0J9eJ+L9r9oCibo4CxBF5d5jRSnTl/dodGk0V5yCO9sU9J/0wMUgABQikIN4XQkoptzc3MpKyvLKC8vp927dz8u5UyIKJRCDRyWayjQ/k2jtDqdznGay0VnDvcaTpef7r7iL7n2YDv3Zg8dejkk16EXBP1jqI8cTm1KcoZ/rUN4npZiRWiccqFwhSjUEE78lClTus+YMYN69+5tZGdnG0VFRbRjx46PcKytmmDV18BhuZygH4iL0Hja7j9w4Pbe2bkUyOxlhMtlDgPvvcxDFa+FhoYV6MGK8310qq1rQM7YdYiiwSaARFAGlKJQQzit3n///e8DgQDl5eVRTk6OKRlt3rx5b9iSrsqChdfAYbnKQecoGn/8tddem/TII4+Qz59pTL88JJfZUx1GT3Ux7rEq54ZeH5ktqF+OTi3bdEhXbKQ2kAM0i0IUagjHSkTX9+vXjzA8DAqGrWHKtn79+oqRI0d2URVMoQZOA5CrO+gbzVBK0nrdunVfZjhddAcmNPY9F3pA9yhkKhjgp+PztaBcR18Shl/XSU6BJ8Rw5S9RqF+1hioSSkpKujz00EPBoWG4YOZEx4cffnj8pptuSgoXTL0GTkOWKwc4FQSII6KJpw0tplsmuo19M+VDuqBPnk7GgpBcx14SlOoMkJwWV71/sYKhoA2IHPUawmm9du3a/6saGpr3Xubffr+fkpOT6cUXXyRMdnSpeQ2chijXENBVofEkgLZPPvUsTb1AEOQKzhSue0DD1d9P9KYWlO3gC4JSMoI910kxDqvyQGcQOeo1nDg0vG7gwIHk9Xpp0qRJhJ55izk1T0R3Hzx48IGPPvrofPOiEnsNnIYqVwlIUGyY7SdNnrrghgs0OjAz9IHxqttdhlfXiZYLY+vTguZf7yaH5t8pn+nrpEg8yALJIHLUawgnwWq1xj333HO0cOFCwiNRxbK3PRV0lMThs7HYa+A0WLmKQSfFhhnXPcV+3unD/PTbExq9NtlN5w7zkdvr3+f2Big5Qz+Y5vQtT0tN7o9zbTHK1Vvh4dhYagjHigmM4a1bt7api6ReA6fhyDUQpMQw6dDB4/F9kebUD6U7fUscTtc0OQQ8VW7bxSKWxAbygRVEE/UawpBPZcTFLqd6DZyGIZcHBGKccj4ZtJAidYzceyh9EFuuUH/sNaijXgOnwcrVDgwH1nrUMDXQV6H++l8Dp8F+iFwARD258lulKB2BSup/DZwGKVfVk+Tx6sO6WsUGMhWv+PW+Bg4/uOsEReE39nVMPLCDkUAl9bsGDsslkwUK/guN0wbSwSjQEqik/tfAYblkAmFfmYivgxt/K9BBaQ0aZf2vgcNyyXQD5cAf/tsTtdwgbSARFIF80AjUJPW/Bg7LJdME5IES4AY2SYIk1q/CW0ES6ANKpQS1mPpfA4flqkpbkAPKQS6wh/3EWLwkoRri5blWkAj8oAiMqOOfJKv7Gjgsl2IvkAr6g1GgUDZUHQiQLo+nAQfwgF5gACgBxSBQB5/91M8aOCyXQtqD7kAAHwiAHiAT6MAN7CABNAf1J3VQA4flUodhGJaLYVguhmG5GIZhuRiG5ap7GIblYhiWi2GY/x/m3HPmLPFInQAAAABJRU5ErkJggg==";

	var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
	  function adopt(value) {
	    return value instanceof P ? value : new P(function (resolve) {
	      resolve(value);
	    });
	  }

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
	      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
	    }

	    step((generator = generator.apply(thisArg, _arguments || [])).next());
	  });
	};
	var google;
	var SV_MAX_DISTANCE_METERS = 100;

	var StreetView = /*#__PURE__*/function () {
	  function StreetView(map, opt_options) {
	    classCallCheck(this, StreetView);

	    // Default options
	    this.options = Object.assign({
	      apiKey: null,
	      language: 'en'
	    }, opt_options);
	    this.map = map;
	    this.view = map.getView();
	    this.viewport = map.getTargetElement();
	    this._pegmanSelectedCoords = [];
	    this._pegmanHeading = 180;
	    this._streetViewInitEvt = new Event('streetViewInit');
	    this._streetViewExitEvt = new Event('streetViewExit');

	    this._prepareLayers();

	    this._addMapInteractions();

	    this._createControl();

	    this._loadStreetView();
	  }
	  /**
	   * @protected
	   */


	  createClass(StreetView, [{
	    key: "_prepareLayers",
	    value: function _prepareLayers() {
	      var _this = this;

	      var calculatePegmanIconOffset = function calculatePegmanIconOffset() {
	        var heading = _this._pegmanHeading;
	        var offset;

	        if (heading >= 0 && heading < 22.5) {
	          offset = [0, 0];
	        } else if (heading >= 22.5 && heading < 45) {
	          offset = [0, 52];
	        } else if (heading >= 45 && heading < 67.5) {
	          offset = [0, 104];
	        } else if (heading >= 67.5 && heading < 90) {
	          offset = [0, 156];
	        } else if (heading >= 90 && heading < 112.5) {
	          offset = [0, 208];
	        } else if (heading >= 112.5 && heading < 135) {
	          offset = [0, 260];
	        } else if (heading >= 135 && heading < 157.5) {
	          offset = [0, 312];
	        } else if (heading >= 157.5 && heading < 180) {
	          offset = [0, 364];
	        } else if (heading >= 180 && heading < 205.5) {
	          offset = [0, 416];
	        } else if (heading >= 205.5 && heading < 225) {
	          offset = [0, 468];
	        } else if (heading >= 225 && heading < 247.5) {
	          offset = [0, 520];
	        } else if (heading >= 247.5 && heading < 270) {
	          offset = [0, 572];
	        } else if (heading >= 270 && heading < 292.5) {
	          offset = [0, 624];
	        } else if (heading >= 292.5 && heading < 315) {
	          offset = [0, 676];
	        } else if (heading >= 315 && heading < 337.5) {
	          offset = [0, 728];
	        } else if (heading >= 337.5) {
	          offset = [0, 780];
	        }

	        return offset;
	      }; // Street View XYZ Layer
	      // It's activated once pegman is dragged


	      this._streetViewXyzLayer = new layer.Tile({
	        zIndex: 10,
	        source: new source.XYZ({
	          url: 'https://mt1.google.com/vt/?lyrs=svv|cb_client:apiv3&style=40,18&x={x}&y={y}&z={z}' // Google

	        })
	      }); // Current Pegman Layer Position

	      this._pegmanLayer = new layer.Vector({
	        zIndex: 99,
	        source: new source.Vector(),
	        style: function style$1() {
	          return new style.Style({
	            image: new style.Icon({
	              anchor: [0.5, 46],
	              anchorXUnits: IconAnchorUnits.FRACTION,
	              anchorYUnits: IconAnchorUnits.PIXELS,
	              rotateWithView: true,
	              opacity: 1.0,
	              src: img,
	              size: [52, 52],
	              offset: calculatePegmanIconOffset()
	            })
	          });
	        }
	      });
	      this.map.addLayer(this._pegmanLayer);
	    }
	    /**
	     * @protected
	     */

	  }, {
	    key: "_addMapInteractions",
	    value: function _addMapInteractions() {
	      var _this2 = this;

	      var translatePegmanHandler = function translatePegmanHandler(evt) {
	        _this2._pegmanSelectedCoords = evt.coordinate;

	        _this2._updateStreetViewPosition(_this2._pegmanSelectedCoords);
	      };

	      this._selectPegman = new interaction.Select();
	      this._translatePegman = new interaction.Translate({
	        features: this._selectPegman.getFeatures()
	      });

	      this._translatePegman.on('translateend', translatePegmanHandler);

	      this.map.addInteraction(this._translatePegman);
	    }
	    /**
	     * @protected
	     */

	  }, {
	    key: "_createControl",
	    value: function _createControl() {
	      var _this3 = this;

	      /**
	      * Create the streView container
	      * and move the map inside another parent container
	      *
	      * @protected
	      */
	      var addStreetViewHtml = function addStreetViewHtml() {
	        _this3.streetViewContainer = document.createElement('div');
	        _this3.streetViewContainer.id = 'ol-street-view';
	        var streetViewNoResultsDiv = document.createElement('div');
	        streetViewNoResultsDiv.className = 'ol-street-view--no-results';
	        streetViewNoResultsDiv.innerHTML = "\n            <div class=\"ol-street-view--no-results-icon icon-visibility_off\"></div>\n            <div class=\"ol-street-view--no-results-text\">Sin im\xE1genes en la zona. Click en el mapa para trasladarse.</div>\n        ";

	        _this3.streetViewContainer.appendChild(streetViewNoResultsDiv); // Create exit control div


	        _this3.exitControlUI = document.createElement('button');
	        _this3.exitControlUI.innerHTML = 'SALIR';
	        _this3.exitControlUI.type = 'button';
	        _this3.exitControlUI.className = 'gm-control-active gm-control-exit';
	        _this3.exitControlUI.title = 'Salir de la vista Street View'; //this.exitControlUI.index = 1;

	        _this3.exitControlUI.onclick = _this3.hideStreetView.bind(_this3);
	        streetViewNoResultsDiv.appendChild(_this3.exitControlUI);
	        var parentMap = _this3.viewport.parentElement;
	        _this3.mapContainer = document.createElement('div');
	        _this3.mapContainer.id = 'ol-street-view--map-container'; // Move the map element (viewport) inside a new container

	        parentMap.replaceChild(_this3.mapContainer, _this3.viewport);

	        _this3.mapContainer.appendChild(_this3.streetViewContainer);

	        _this3.mapContainer.appendChild(_this3.viewport);

	        _this3.viewport.classList.add('ol-street-view--map');
	      };
	      /**
	       * @protected
	       */


	      var addPegmanInteraction = function addPegmanInteraction() {
	        var oldx = 0; // Grab Left/Right Direction of Mouse for Pegman Image

	        var mousemovemethod = function mousemovemethod(e) {
	          // Left
	          if (e.pageX < oldx) {
	            _this3.pegmanDraggable.classList.add('left');

	            _this3.pegmanDraggable.classList.remove('right'); // Right

	          } else if (e.pageX > oldx) {
	            _this3.pegmanDraggable.classList.add('right');

	            _this3.pegmanDraggable.classList.remove('left');
	          }

	          oldx = e.pageX;
	          return oldx;
	        };

	        interact__default['default']('.ol-street-view--draggable').draggable({
	          inertia: false,
	          onmove: function onmove(e) {
	            document.addEventListener('mousemove', mousemovemethod.bind(_this3)); // Remove Class 'dropped' if Exists

	            _this3.pegmanDraggable.classList.remove('dropped');

	            var pTarget = e.target,
	                // Keep the Dragged Position in the data-x/data-y Attributes
	            x = (parseFloat(pTarget.getAttribute('data-x')) || 0) + e.dx,
	                y = (parseFloat(pTarget.getAttribute('data-y')) || 0) + e.dy; // Translate the Element

	            pTarget.style.webkitTransform = pTarget.style.transform = 'translate(' + x + 'px, ' + y + 'px)'; // Update the Posiion Attributes

	            pTarget.setAttribute('data-x', x);
	            pTarget.setAttribute('data-y', y);
	          },
	          onend: function onend(e) {
	            var location = _this3.map.getCoordinateFromPixel([e.client.x - 60, e.client.y + _this3.pegmanDraggable.clientHeight]);

	            _this3._pegmanSelectedCoords = location;

	            _this3._initPegmanOnMap(); // Reset Pegman Dragging Cursor


	            _this3.pegmanDraggable.classList.remove('can-drop', 'dragged', 'left', 'right', 'active', 'dropped');

	            _this3.pegmanDraggable.removeAttribute('style');

	            _this3.pegmanDraggable.removeAttribute('data-x');

	            _this3.pegmanDraggable.removeAttribute('data-y');
	          }
	        }).styleCursor(false); // Enable Draggables to be Dropped into this Container

	        interact__default['default'](_this3.viewport).dropzone({
	          // Only Accept Elements Matching this CSS Selector
	          accept: '.ol-street-view--draggable',
	          // Require a 75% Element Overlap for a Drop to be Possible
	          overlap: 0.75,
	          // Listen for Drop Related Events:
	          ondropactivate: function ondropactivate(e) {
	            // Add Active Dropzone Feedback
	            e.target.classList.add('drop-active');
	          },
	          ondragenter: function ondragenter(e) {
	            var draggableElement = e.relatedTarget,
	                dropzoneElement = e.target; // Add SV Layer

	            _this3.map.addLayer(_this3._streetViewXyzLayer);

	            document.body.classList.add('ol-street-view--activated-on-dragging'); // Add Class 'active' While Dragging

	            _this3.pegmanDraggable.classList.add('active'); // Feedback the Possibility of a Drop


	            dropzoneElement.classList.add('drop-target');
	            draggableElement.classList.add('can-drop');
	          },
	          ondragleave: function ondragleave(e) {
	            // Remove the Drop Feedback Style
	            e.target.classList.remove('drop-target');
	            e.relatedTarget.classList.remove('can-drop');
	          },
	          ondrop: function ondrop() {
	            _this3.pegmanDraggable.classList.add('dropped'); // Reset Pegman Dragging Cursor


	            _this3.pegmanDraggable.classList.remove('can-drop', 'dragged', 'left', 'right', 'active', 'dropped');

	            _this3.pegmanDraggable.removeAttribute('style');

	            _this3.pegmanDraggable.removeAttribute('data-x');

	            _this3.pegmanDraggable.removeAttribute('data-y');
	          },
	          ondropdeactivate: function ondropdeactivate(e) {
	            _this3.pegmanDraggable.classList.remove('active', 'left', 'right');

	            document.body.classList.remove('ol-street-view--activated-on-dragging'); // Remove Active Dropzone Feedback

	            e.target.classList.remove('drop-active', 'drop-target');
	          }
	        });
	      };

	      this.pegmanDivControl = document.createElement('div');
	      this.pegmanDivControl.id = 'ol-street-view--pegman-button-div';
	      this.pegmanDivControl.className = 'tooltip-cnt';
	      this.pegmanDivControl.title = 'Arrastrar para iniciar Google Street View';
	      this.pegmanDraggable = document.createElement('div');
	      this.pegmanDraggable.id = 'ol-street-view--pegman-marker';
	      this.pegmanDraggable.className = 'ol-street-view--draggable drag-drop';
	      var pegmanBtn = document.createElement('div');
	      pegmanBtn.id = 'pegmanButton';
	      this.pegmanDivControl.append(this.pegmanDraggable);
	      this.pegmanDivControl.append(pegmanBtn);
	      this.viewport.appendChild(this.pegmanDivControl);
	      addPegmanInteraction();
	      addStreetViewHtml();
	    }
	    /**
	     * @protected
	     */

	  }, {
	    key: "_loadStreetView",
	    value: function _loadStreetView() {
	      return __awaiter(this, void 0, void 0, /*#__PURE__*/regenerator.mark(function _callee() {
	        var loader;
	        return regenerator.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                loader = new Loader(this.options.apiKey);
	                _context.prev = 1;
	                _context.next = 4;
	                return loader.load();

	              case 4:
	                google = _context.sent;
	                _context.next = 10;
	                break;

	              case 7:
	                _context.prev = 7;
	                _context.t0 = _context["catch"](1);
	                console.error(_context.t0);

	              case 10:
	              case "end":
	                return _context.stop();
	            }
	          }
	        }, _callee, this, [[1, 7]]);
	      }));
	    }
	    /**
	     * @protected
	     */

	  }, {
	    key: "_updateStreetViewPosition",
	    value: function _updateStreetViewPosition(coords) {
	      var _this4 = this;

	      var latLon = proj.transform(coords, this.view.getProjection(), 'EPSG:4326').reverse();
	      var latLonGoogle = {
	        lat: latLon[0],
	        lng: latLon[1]
	      };
	      var streetViewService = new google.maps.StreetViewService();
	      streetViewService.getPanoramaByLocation(latLonGoogle, SV_MAX_DISTANCE_METERS, function (_, status) {
	        if (status === google.maps.StreetViewStatus.OK) {
	          _this4._panorama.setPosition(latLonGoogle);

	          _this4._panorama.setVisible(true);
	        } else {
	          _this4._showNoDataMode();

	          _this4._updatePegmanPosition(coords,
	          /** transform = */
	          false);
	        }
	      });
	    }
	    /**
	     * @protected
	     */

	  }, {
	    key: "_updatePegmanPosition",
	    value: function _updatePegmanPosition(coords) {
	      var isGoogleFormat = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

	      // If the coordinates are in Google format, extract the values,
	      // and convert the projection
	      if (isGoogleFormat) {
	        coords = proj.transform([coords.lng(), coords.lat()], 'EPSG:4326', this.view.getProjection());
	      }

	      this._pegmanSelectedCoords = coords;

	      this._pegmanFeature.getGeometry().setCoordinates(this._pegmanSelectedCoords);

	      this.view.animate({
	        center: this._pegmanSelectedCoords,
	        duration: 100
	      });
	    }
	    /**
	     * @protected
	     */

	  }, {
	    key: "_initStreetView",
	    value: function _initStreetView() {
	      var _this5 = this;

	      this._panorama = new google.maps.StreetViewPanorama(this.streetViewContainer, {
	        pov: {
	          heading: 165,
	          pitch: 0
	        },
	        zoom: 1,
	        visible: false,
	        motionTracking: false,
	        motionTrackingControl: false,
	        radius: SV_MAX_DISTANCE_METERS
	      });

	      this._panorama.addListener('position_changed', function () {
	        var position = _this5._panorama.getPosition();

	        _this5._updatePegmanPosition(position);
	      });

	      this._panorama.addListener('pov_changed', function () {
	        var heading = _this5._panorama.getPov().heading;

	        _this5._pegmanHeading = heading;

	        _this5._pegmanLayer.getSource().refresh();
	      });

	      var exitControlST = this.exitControlUI.cloneNode(true);
	      exitControlST.onclick = this.hideStreetView.bind(this);

	      this._panorama.controls[google.maps.ControlPosition.TOP_RIGHT].push(exitControlST);

	      this._isInitialized = true;
	    }
	    /**
	     * @protected
	     */

	  }, {
	    key: "_initPegmanOnMap",
	    value: function _initPegmanOnMap() {
	      if (this._pegmanLayer.getSource().getFeatures().length) {
	        return;
	      } // Add Class to Body


	      if (!document.body.classList.contains('ol-street-view--activated')) {
	        document.body.classList.add('ol-street-view--activated'); // Update Map Size

	        this.map.updateSize();
	      }

	      this._selectPegman.getFeatures().clear();

	      if (!Object.keys(this._pegmanSelectedCoords)) this._pegmanSelectedCoords = this.view.getCenter();
	      this._pegmanFeature = new ol.Feature({
	        name: 'Pegman',
	        geometry: new geom.Point(this._pegmanSelectedCoords)
	      });

	      this._pegmanLayer.getSource().addFeature(this._pegmanFeature);

	      this._selectPegman.getFeatures().push(this._pegmanFeature);

	      this.view.setCenter(this._pegmanSelectedCoords);
	      this.view.setZoom(18);
	      this.showStreetView();
	    }
	    /**
	     * @protected
	     */

	  }, {
	    key: "_showNoDataMode",
	    value: function _showNoDataMode() {
	      this._panorama.setVisible(false);
	    }
	    /**
	     * @protected
	     */

	  }, {
	    key: "_addClickListener",
	    value: function _addClickListener() {
	      var _this6 = this;

	      var clickListener = function clickListener(evt) {
	        var position = _this6.map.getCoordinateFromPixel(evt.pixel);

	        _this6._updateStreetViewPosition(position);

	        evt.preventDefault();
	        evt.stopPropagation();
	      };

	      this._keyClickOnMap = this.map.on('click', clickListener);
	    }
	    /**
	     * @public
	     */

	  }, {
	    key: "showStreetView",
	    value: function showStreetView() {
	      // Only init one time
	      if (!this._isInitialized) {
	        this._initStreetView();
	      }

	      this._updateStreetViewPosition(this._pegmanSelectedCoords);

	      this._panorama.setVisible(true);

	      this._addClickListener();

	      this.viewport.dispatchEvent(this._streetViewInitEvt);
	    }
	    /**
	     * @public
	     */

	  }, {
	    key: "hideStreetView",
	    value: function hideStreetView() {
	      this._selectPegman.getFeatures().clear();

	      var pegmanLayerSource = this._pegmanLayer.getSource();

	      pegmanLayerSource.clear();
	      this._pegmanSelectedCoords = []; // Remove SV Layer

	      this.map.removeLayer(this._streetViewXyzLayer);
	      document.body.classList.remove('ol-street-view--activated'); // Force refresh the layers

	      this.map.updateSize();
	      window.dispatchEvent(new Event('resize'));

	      this._panorama.setVisible(false);

	      Observable.unByKey(this._keyClickOnMap); // Maybe, exit fullscreen

	      if (document.fullscreenElement) document.exitFullscreen();
	      this.viewport.dispatchEvent(this._streetViewExitEvt);
	    }
	  }]);

	  return StreetView;
	}();

	return StreetView;

})));
