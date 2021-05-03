(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('ol'), require('ol/proj'), require('ol/style'), require('ol/source'), require('ol/layer'), require('ol/interaction'), require('ol/geom'), require('ol/Observable'), require('ol/control'), require('interactjs')) :
	typeof define === 'function' && define.amd ? define(['ol', 'ol/proj', 'ol/style', 'ol/source', 'ol/layer', 'ol/interaction', 'ol/geom', 'ol/Observable', 'ol/control', 'interactjs'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.StreetView = factory(global.ol, global.ol.proj, global.ol.style, global.ol.source, global.ol.layer, global.ol.interaction, global.ol.geom, global.ol.Observable, global.ol.control, global.interact));
}(this, (function (ol, proj, style, source, layer, interaction, geom, Observable, control, interact) { 'use strict';

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

	var img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAANDCAYAAADrXJx1AAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIxLTAyLTE1VDIwOjA2OjIyLTAzOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMS0wMi0yMFQxMjo1Nzo0My0wMzowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMS0wMi0yMFQxMjo1Nzo0My0wMzowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo0ZDc1NDk5OC04ZjllLTU5NGQtYmVmYi02MDIxYmQxNWQ0YTQiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDoxMzE4ODM2ZC0zMDRhLTgwNDItYjdhMi1lYWE3YWYyMjc3ZWUiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoyMjY0NzJjOC02NTI0LWVmNGMtOGNkNC00N2VkMmVlMjkzNjkiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjIyNjQ3MmM4LTY1MjQtZWY0Yy04Y2Q0LTQ3ZWQyZWUyOTM2OSIgc3RFdnQ6d2hlbj0iMjAyMS0wMi0xNVQyMDowNjoyMi0wMzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo0ZDc1NDk5OC04ZjllLTU5NGQtYmVmYi02MDIxYmQxNWQ0YTQiIHN0RXZ0OndoZW49IjIwMjEtMDItMjBUMTI6NTc6NDMtMDM6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7Ap7LjAABMGUlEQVR42u2dB3wUxfv/F0UERTqhk3Z9dvfudkMPvRfpgdBBpKqIVOk1dAFBmiJKl957F0FAAeWraJTeO6GkkLLPf57ZPRKQkoTksvz+m9drXpfcbe7ms9Nn3vd5OADgXufEGQL0JiCtfmxErmLj5Tb4yKXhT7oLEJzyRItDhvaN3TDwQxd7xL/xed0LsPPyiQ9D3AD7CMABosB+7ZH+jc/T13/XrQB6h4fj3YZfiBK/m0DcLp4m9RH/xufxdbxOlwICbTI82kFAzfx/Ez6Pr+N1uhNgJbLQsIYE8DNREu/804lnrzesKQFerysBtKep2gnr/k/kOZlXE76O171Kz5Q+JeCQTbWr0BI49JISoK/jdbQEzLprAwFWGW5u4CHhiQacmPmEPQRurucBr9NlI3a65A/er0ZL4QhRMLPxu9XeBx/xbzhMlHr0dXpdB92OA0SU71WoJME/SwSAPVTATh4UmsLnC1CpvAT09Qe6HAeCgqSKvChDtyZuONKNV3a0ssOuThY40MfGHne0tsMv9PlPQlxYAiDLUjtdCTDZ5agzy2kj3U1H3Z+wt+HVtJ9P/B2f30WUWFqlzPbUt4M0F0DnOfnKlKJ1/1eiRK3nXziQRW9Qe6Imtdm0oqQuBDgEuStO2vAOR6558UgctY6wedKXfZwoYLReSmD7ji9FUPZSAatfLiB+J4Hj3wlYjU7oQoA/7deBZj6OznOi16jd5rMF8BCzns6HthKcUrApdkYKeIcmd+48+Xs38MyBaMYuLlL7/GcJwAHu4hIqbjMVcJAorRtKkC9/oRH0farS5OctAe/SVJmmxjSJZps4dUpvJ8CPNFNbCIzr4WJ1/JnzIFpKswc4IZo2dLx+Dv3d6nDN1DKPIppijUxPAZL2ISJN+WnKZrJJ4b99L7AMrRsrwphPXiBgnypg4TBV8F+LBDq1ls7h+9DkQ1Mx7eY0pClXWgrIQlMDmirQVICmgjQVoikv7UlYt0gT4DRh7MculrnnCfh2sBOqV5RwWsGmFrQHww/Mp71fIU2IWbtRJC0EZKcpRHszH+1DCuPvfoH2dl2bu1n9v7KGV4qbZJjwqUtJFOAZE/jHAmi1UYrR6y6v5lG0gv/vF2hrq713YS0V0m5SbZrKvIqAt7TMW7Q7XzhJym+2OrqF1JXg/AoePu/oAocgXR3elZbA/sS7ruzlnyiBWZ876XXyowH0+j8XCtC4lgQWq6PzUwIKJymNmjhTSa2A92nin5F5T8rhIMIo2g4uEsF9NNDC9xzWNbEKYbUqEcTWCI8FTKMDGG34YQ7efYD+3192Bz8A3+c57+8RUZ+moikV4NAalM9z3tyT8mldarYAM/lkQEf34xLAeo7VBR/ZYoYKmNyLCRitNdzsWmfwovdHEcW1mpAiAc1oKpKkzr8s5Q8wOT7q31GtQjho4Z3PVSSIdZ9sV4IKmNTTBSarMDIZGU+asAYEa7UhWQL8aar0gqrzrOTjb3J07tPeI4COuHTKkK94ENzdpK7SsGqNob0UrWqDUijAUwqNkysgWKtChVIo4IOebdRJHWb4+joeCvrJcHa5oK7IUi+gsHY9tsnsyRFQVxtUUiSAdqvtP22tClBohsMXC1A0UIZj8wT2N5bM0C5MQO9UCCigjUNFkiOgcZKBJdkCfANsLbuFunErkdX3I98I4GuWYc90Qd1qpMKwm6UC+qRCQEFtTAhIjoCGSepe8qtQoL11B7qkvLaWh4srBVg80slWXjj6XlwlwNU1PPRo5aYCSI9UCiiL86bkCKiOO4UpFFAoW7asxQSn9HeAVboQaJXO24h00ekUwuy8dB7/xud5UTrj45PfoWUopVWoGgpPjgCnNvql9EMKaX37u0lSvqf+fjeFNybpgNYsub1QTm3yltJiTq9USBsDKqVkIKupTeAK6kBAfu2G5kuJAM8stGAqijwtE9b9Ep67n9LJHDa2Ok9No72Z8OZZaWryKuuBMlp18raIAto0vrk28XulFVlQkiltQS80WKzzsrYqy5ZWa2JfrRuTtA9I67ZRSLvrxbVqi31+prRe1L+pzUcaawv7AloqlEoxnqVjfm1noqJ2133Te18ohzZjxRIprzW0Alo7KZikdJ6VCmrX5tfutqTd8UbJ2VJJ6505LBETTVW0xlZbEyRrY4hFex13GWzaCF9a2wNqrM25gjz9ux4OOHJpiyHMvFvLXEmtH5e1amfVSiKLblGD9P4xBBgCDAGGAEPA6yHAzstVaGqDj6+VAMEpT8ADvHaN3YDb6O0SmbkJuhdA7/axD5q61c3d/Sorh4/4Nz6Pr+tWgOiUB7Vp6GZHR7ixG7ODZ4gZe9ypHinh6/S6gboUgCzc/S3qrnTMDpWP8yT2N30eX9cnM+eQLXWRFTpIFM+df/QfETx7Ha/D63UlwEbk8h0aq6czz8q8J+HreB1erysBtJcpXq2CemL/whKgr+N1eL3u2kCAVY69tJqH2F2JDThp5vH5i6t4CKTX6bIRO11yaJ0qailgZh/tVHsffMS/8Xl8XXTJIbodB2yiDFUqSvDXAgFid/BKzHYeH+HkQgHKl5cAX5clSdadgBJBks0myDCqgRP2NOBjfn7flnAkxAzHO1jgUCMzHKxhg5ONiTIlxKlYeRnPj6vpqxsl8rmfpgmsm6QJEg7wkPATr9DEflcwHeIhbi1Rrq7lwWTTETOnjQN4CqlWmV1Eq/tPptg9BCKWqj1R7aoSdqVWXQigd59vUNPNiMWYbeS5AuKogLsL1ePWIZ1d4ODlrroQQDPSeVAnFyQgcrb1xQJuf0+r114CP4wWsQS+04UAi929fMUYER7ReU705hcI2MvDzW9UIUiqBNqkUxkp4B1tt61WgNV949QPPERvogMWE8A/RwCBy9NpG9Gwg0BbEGi70NW5DGLmcOswF60K2PtAzEYCp+mdjdv97BJIoGuDLf1E9dCb9lblSsuQPWe+AG0PNUOYOZ+ixQNrNKktsS/6KLQEwj52MjrlWQJwIje8qVNFkOnvrRu4obifpYG2q+11Zk6jtoTBI7qpkNOeqSJ81lb9/XkChjZxwslFKiQ4rIsLTBa+P5d4nOtVZg5TLpPNtXrdBJGBrJ2buaF7qDal1uZACXsT50T4fFioE75DapFWo++HIvzk/Ja+T57nHHykKzOHKY+dOOd0b+GGQ18LbOHetqGb0evYEyXQTB+YIED8nsQSGNfSCXg9HCXKgVkiHZHdP3LPRs68wsxhyumgIsx26YiDCP3rV2ftQRWwncD83urdflwCLZxKgIUktGoggSzLQAj5lHs+EeAVZq6wVgWy0x7FVqkcW1YyAQodlYdp/JBHwIgQokyfMQveeCt7FY7LXPQZ1SfDmDl2HZ0ps/bABNBRuV0NFxOE7YD1QiEEZsz6Oo5emzkF7+0VZg4zk9VkD2LbJziYIUtdvWRilVJLgIfhI8P+1joHXTFzmLLglgmOA2y0peNC5RISXF+vkbtUwMhmAnTt/slmTiVidMXMYcpKBUQ92Mqzngc2EKhEBeCXHRh2SdvCoMYi1GvQ5Ct6bV5OZ8wcpndtRDq/cIQItzfSKrTToZSWJNg6RWQ8NValwXQgk0uVG8XpkJljHxIY4Bdsdbh3Bljlh7wYRBfw0v22jdywepzIGOsWVd108CI9OR0yc0k/COt3Vq2avGVzCCMtDvcOs12OdLqkP7XMF+J0yMw9s2vVTuI9orKn8n0MZs5g5jiDmUvdesBg5jiDmUu7Rb3BzHEGM2cwcwatYggwBBgCDAGGgOT9GMxcRgh43Zm5gclk5gbpUoDBzGWkgJQyc1aDmUuPNmCVY5GJexEzh0xdgI6ZuWYvY+bQ5Q+v06UAWZZLmBxyAvrJXVlCM00zjnc+bqfKzFWkVccuyhFuSZZ0J0B0yQElJAl+myoof/Xglb3VrLC3mi8cbh4A++v4wcHaFtgTIiiT64lQtpQEvEsuqCsBDlEePraFE2APHXX3qcxc9BYebn7Nw/kwHv76mIcbs+jzCwmUCpKgkEXOqjcBYRNbOSF2a5KBDOs/WvNQQbfmqc9FLyXQoq4bTPbU8XLpKeDjzxu7IHajlvGkXSgVcZdmPIq+Fr2EQGg9OrkjsqgrAcQZ1KhzHTfErnm2gAgqIHIDLQX62Axd/sRSNj0JyFWoqF/LZlUleLRczfB/SmBJooBGNSXImTt/Y+0sOnNGCXgnyRZ4rbezvlOpdAkZ4pfRmegu/r8CFtEqtEkVgN68ufMWqKttQ4ZwGczMFdU2dTMH0kXL3fkatfiUgDvzVSTzERWAg1nufIWd2gavj7bdmCHMXNIzguxmh/THwUka9PeUgFvfUgHb1BJAZ0CfQr6ln9qazxBmLmnKa7E7v5nTx8nMkDzdaIwm4PY8rQ3QttCsDh0HigZU5p6kYfA9kR3KljNnTivnJWbuCXueYv62kD5tXY8JregtiWPB7e8IPFhFn1tMoG0DNxT1NdVJcqbwblhYmCkuLm7G1q1bITIycqlWAunOzD1xovh2dh9Hi/qSuibYrd51fGRtYAE2ZB6U1UT5kK6Ns2XPUw/PFx48eNDy9OnTv0yfPp0haBcuXECa991MmTJ5jZlLclyUqXC1ihrgRKvRlcl0VqoypErEDwSuTSKwIUxEg6RY+jlf7tixQ+nYsSO4XC4QRRHOnj17i77Pe0lK2WvMnOfDshFBVqfTVMDF8XQ2ugsX+DzcX0ng+ngCvRsIStduH0H58uWhZMmSEBwcrDidTjhx4sQj7tkQiNeYOUZsMfNUZObonb84hig31vFYhZQHdIS+MYHAx/VdSolSpVGAUqFCBQXv/P79++Gjjz7y5Z5/hOsVZo4RW/4WOZr5r+/l4fJoAodmq91q5HoCN6mAdrVcULpMOcDM453fsGEDrF69mrzks7zGzL3jZ5avAhpE0hK4OVY1RcVuFUfhW1RAkypuKqCsIkmS8v3330N4eHg5rDq00eqCmXvPbJeO7/1KYB6kMZMJDELzSComio7CdyYSqF7WqVStVl354osv4N69e9g48yYj815j5gr55M9jpdXoWv8PXFA7WIKPWrowjAX7bk3ERKKIDrNy4OBB7Os7Yl//xhtv6IqZe8yPBppJT99AayM5iDnCIrWo3BxPFIcTd+UyYVeZ980339QlM5e0zuYkhO+DtrabJonQgC7qiSB+SZ/PzaWOXvE6M1dYvdNvFTVZXUtp5qdyKn3y2jFzhbS7npczmDmDmTOYOYOZM5g5zmDmDGbOYOYMWsUQYAgwBBgCDAEv/TGYuYwQYDBzGSnAYOYyUoDhM6eLNvB/gJlrWTt5zFxL3Y4DvCifDy4rQfgiAeJ2CvTu8+zxr4UCVKZVh3fKZ/Q7Drjkto2ruuHWFKL8XN0Ce6oUg0PNfGFvzeLwcy0rbGwmKE0ru8HplvvqUoBNkJct6iKyg+74AzzcpaVwepAA4Z/ycGM2Dw+/JzCgiQscYurczbwhYNH3H4qg7EuEPDBdmkjg4TqallABrVxg5eWGuhRA7+yEL1o5mQCPqxMKuTadwL3lBCIXE+jdwgUmh1xGlwKIK+jTQbSKKHuSWFPRErg2jUDEMgJRSwl8SOdCgUJwMb0JQM7HVtQ3YPhHdZnjX6I9If396jS1BGJ+INC0lgRZsmUP1Ta7cA9UF8wcbimWKFC4WN3aaJCkAR5PCFhBf6elULm8BG9lfY9ou3QVOR0xc7hp+44ZTSO3a/VfM4i8OpXOQlfRnomWQlAJNhNNusmrG2aOcXP+Vum3c4v5x+AfUiuXJtAeaC1BohFKlaICMmVJijHohpljZ8IBFufXq8aKj6MiooDzo1VeLo4KqBgswTvZ81ie8x5e95n7T5BNs02cjOFLkVBhxpHIDY1VSyCWNuKalZEZLSS+5KjKaz5z/znPNVmE4dP7Olm46wertSo0EYE/HuJXEKVRLSQW/Ssk4/28zswxAf4m0nNqb3UwQ9wYBWAjvk4Hs7++41mM+mQcSSVt5Hm0fKQ7M8fQy+L+9g8mfaoGUEbYFdH7a19REeOZSR6Y7QJureROcsyUT/s7h9Y1Y3vLuXz5cjE8PLzelStXPp0wYUI5rU2kSEBqmDmfwsWtTUZ3V8ObXvlSFXB9Fk20GvVv6gIb7+q1f/9+5+XLlxvFxsb2oJ83kWZy2fHjxw/u3Lnz0po1a2Du3Lnw+eefw7Rp0+DkyZNw9OjRulpbSHdmrkD+woHVB3ygBte8QHufOFoSN+YQuEkFdK7NK3369odRo0ZB165d4f3334egoCDGi+Kj2+0GnuchLCwM/vrrrxM3btxoprXDApkyZfIKM1cwVz7fUh+hGeQhopwbpgq4OZeH25MIhFQWlNAWLaFMmTJKuXLlGHqJ2CXilxUqVICFCxcihrZmy5YtON5k0zLuVWaOYTUYd/vmRh7ODydK1C6etYW7XxCoWpqHi5eurClRogRQAQj+QfPmzWHbtm30Y2FS0aJFscQR9Sn4DI7OK8wc+yA/P79y6LlYICAIpxMKctP3JhOlhOSEe/fvDytbtiz0798fjh07dpl+Xjcu0RHtRZ/nNWbOc7eyBFjdP/9JV2X3F9JF/jSimB0uhP3anT179sjp06draD1OciESrzNzBfz9AyoFBcmwbogIdSvgboR7n3a3czxVv3XLzOXz8wuoZHG4N5ksttbYz6cw07pg5gpoM0sfzvCZM5g5g5kzmLlXWRMbzBxnMHNpvzNnMHMG7GEIMAQYAgwBhgDdCrDzclVk5my8XPm1EiA45YnIyLV/TZm54x1D3OyA4zEz9xNR4nbx8EETN8YgO6pfVsIpD2n7EmYO4y/pOjbrg60vZububdYrM0dkW71qalSslzFz6MNldchmXQmwEbkicqEsEtZLmLl2qs9cOX2VgEP2q14xecxcVZWZK6bHNhB/OTmxWW3yI102YqdLbs2YuUOax1DSgGoY2ujAY2auhW7HATpYLUM27vpiKmA7DzHb1BS9msDENk6wCTpmp9lAJsrXV3YT4Z8edjjZ2wSnh1vgj09N8EcnG+wbKiDstEHXAkw2+Z/TK3iI30vvPC2B+7TOR27gIWEfD0s/EcHCy4t0LcBsl3fsmylC1FrNY452q6c+Jyy41OwPWRWarmsBtH//dvkYER5qbmeIGvzbjwqgDXlCKycSi6N0LcAhBA2c1s8JkSueFBC3ncAYKoC4SvTQo4A82mZWcJFiAdMGd3FD9ErV3ckjIHYLgVGtXVC4mP8s7RCxJKczZq4UtuHi/tbQD5u54dFKlZfzCHi0kcCgUBf4mRwfaHuiTk6HzFyBAoX9yr5fQ4K4FSovhwL+6UMf1xP4rIkLigVYmyY5LNEdM1cwc5Z3/UqWlAHWoaONGhH3n76EeTB2qOuGQsUDq3NPQiS6YubYpm0gRkbcTlj/jwJODaQCVhFoWt0N+QoVL/mS/89QZs4TWDDmLs38g5UqL3RmCBVAu9WadIrxTo68tmQcU2UYM8cCC2Lk539+EOD+MlXApUlUwFICZUpKycHNMpSZw5TDZHPv2zdDZNGikVZE7PjRAqLYBBYROhuXsmijXvOZ86TcZptrKQYRx50JNpihSdg8uhZ2sLVwllSco3nNZ44BHhabOPFLzTSS0bu7ebj7NROAX/7JyqXuzNgrPnOMawg0k88GfqiZRu5Qo6Jfmk5XYg7plnZz8mrdcAEuece1XvOZY+Sir7+1WcckC3zsSv8cR0AMCr589erVLfQzpsfFxX12/vz5+vPmzXNo7QJL5j2t/8+nVd0nwmlzXmDmCqujsW/Z9zHQ8k+qgHgq4OehPBQz8Qf//fffcKvVCnXr1kV7Qhg/fjwsWbIENm3a9ODQoUO/Xbx4cRWimFFRUV3Dw8Or9+7dO0DrDbNlzpwZpx7pzszR0fgd35Il5Mc7FBjefdfnAhQNdOyg7/9h7dq1kVZE8A/Kli2rlC5d+jF2id6LgiBAnTp1oFOnTowdPXz4MMTExFzBBR/nJZ+5LLiZe2cTz7YT4VeijKPrYZON/3bHjh3RmEkkF5FaROQSycV+/frBjBkzYOXKlbBr165Lv//++76IiIhvY2NjB546dSp08ODBDm1Q8wozl08USE+6vFRsfBDNeBAEmO3nFSVhzfz582Hz5s336F09duXKleX088Y+fPjwQ5rhSk2bNi2qVRec6ebQpukeY2F89Cozhx/4tjZ79Tzm1zKXTWuwuZ9qsIU4HTJzSdvSq0AhBjNnMHOcwcylfkVmMHOcwcyl7b6QwcxxBjNnwB6GAEOAIcAQYAjwks/c68jMTXqCmWvkBrPKzI3TvQB6x3/vFKLakyRl5uJ38UyQg5d/0a0AeoeHYSZfxMy1rM+Yuf66FIAs3MNtL2bm7m7idcvMEYxylRxmrlZlxswF6kqAjciVOiaTmUO7Qiq4tL5KwCH7o2vHS53+fiZK5WAJzHa5kB7bQMKVNS9m5s6vYG0gWpeN2OmS2zK/xUPP8ZnT6j+9LkS34wAvysfQivDkAoHFZPX4zJ1aLEC5shLQ16/peRyQMB7Z8vaicqSxA/bV8IVDzX1hT/Vi8FP1QLgynFdC6kpApxayLgXQnqhUqwZuxkncWcTD9Vk8/NtPgLPDBPi9Aw+RaNPW1gWFTam36kxXAXQaMW3eECfcW0jg+kzacLepFj1XvyLwRyfVZ64/MkM22alLAXQCt3bbFBEiFhC4+Q0BDGN3b5kaWDa8FxWzmEC/Ri4w83JFvQpYtXWyKgBLABkJFHHrewIXxlEBi2gJ1HOB3VWijt4E4GFcYIBF/NEjAK3ZsPpgUNmb36qlcJ8KGFzLBUX8AiZoG126YubEQKtzx7apqoDLU6iANarLEwq4iQJoFRpc2UnXBvxE7fBEV8wcYjbrN2olgIwQojZ3FiWWQAT9/dv6IpiIa4m2DakrZi6v2eacPW+o2gtd/kJtwHcWJgrAALN7WtOpBC/9rO1w64qZy2+y8H2HdnVB1DK1Ddz+Xo0IqgpQfYb+7UAgUJBvc8+OS5ahzFyBYn7m2s3qSRC/jijXZxC4Rnui2/PVhoyZPzODVzpXdQER3Ts49SxaV8wcfmguDF+Ha2G0pbo4QS0F7I1uUwF7xgjgb5N+0zoAXTJz79qIdGbFeCdcn6JmHus+ur3eoY/LPqcN2M4acHJj8nmdmSvg629thNsonvCmN+iIHLmRViMq5utP0WfOOYdLWWg7rzJzBQoV9a+IdoQIOyE7jRZtUZsJ61q/6OIEi0Mcrx0p6ZKZK5gjl4+jYjk1xC/S69fn8GxSh6PwxM5O8A2wTNdG7vwpcHvyGjPHDqnRTxHXvvjNpZtf03awgceZqDKhiwty5ys454svvpj8008/ddSmEfmS+TleY+beCrAGqSWA4d3nEjj6naDErCBKxWAGvnbbvn37tS5dusCePXti6OcN1UoEB66CLygVr/nMITsd+3Cruh6Op3fexy8I3FIJKFK0GDbgkEWLFkGpUqUU5ORq1KgBS5cuRYe/VQcPHsQ+/+3njDde85l7x2STr+E3+mAPUa7SKmRSiV28KRWvX7/+d5kyZTwBltkjQn8I/I0cORJ+//33szQP3bWROk+SUd9rPnN5eV4YXb6sDCtGi1C7kgy58+QNmz9/fvCff/55FzOPNoVILD6d0IMR43U3bdoU1q9fj6TinIEDB+K04r2sWbN61WcuR3HfgMoWu2tVMV//TnFxcSEYxrpz587Qt29f+OSTT6BHjx7/Sd27d2fXIG7Zvn17aNeuHWzZsgXu37+/Wxu9vcrMFdBG3Pwmk6n4gQMHqp44caIyrSKVT58+XefUqVO1n04XLlyof+XKlUZJ07///tt41apVuG6wcxnIzHlQmuQkn2ekvJzBzBnMnMHMvfKa2GDmOIOZS/udOYOZM2APQ4AhwBBgCDAE6FaAx2fO/hoyc19YPczchyozp/nMjdW9AHq3T3Rq9kJm7oieWYnhyWTm+ulSALJwUclh5qz6ZOb4BjVTxMwF6EqAjciVk8vMoV0hFVxKXyXgkAOTy8xV0i0zZ5UTrr6EmTu7nDFzUbpsxKJLbs38Fn9+PjNXU2XmGupSQJAsme2CHFGlgsRisSIzh05nsTt55fJiASrR501ETigZJJXXpQBJlmFKiBN2hgrKz/Ws8FNdPzjSIgD208ef6lji/+lI4OAgAUXosBvl5ewuJ60+e4mCVMr5MOTl1HSiA6/81pqHy5OJEvk9UdpWc0MAka26EkCnEH2mfuqEmPUY/Uo1hMFT+kuTCRxvReD39nQQo8LuzCbwSW0XmIXUhzdNr3FgKqI2UWtoxr8jELVBFYK4zbEWBM4MU9GzW9MJ9KnjAqso19JbCYyaNUAVgMBfpCYAaZU/u2nIDRV2/QsCA+s4we4KaqonATkCzWQqRkOMXkszSatJ5CZVAFaj63PUzGO6PJbA0NpO8DNbx3AqyqALZq66r7910uQetA2sI3BtBq1CmgAPreUpgYsjqIDqTjqY2b+k/1eO0wkzl8fP5Og0qqMLHm1Qaa3IJAI8CQWcHURgfC0nWHjnV9ohoC6YuQJFfM3vf9zEDfGb1DCO91c+mXkmgDbi0/0JzG3MwL8FnHqQrQtmLpFS2U6U67N51nifqD7zUAAPZ3oTWBUqQCBxrdEyqQtmDp97Gxc0sEvthZCX82Teg15GUFELOolK00oS2IkwiHs+N5QhzNw7Jpt08Z8lAuNDETVmAuaqwBPrWumY0KoeHYWtfD/txuiKmctrtYtfjv3UBZdGPe5CFcx4zC6iIHoWTYU1oNOIXPkKu5J5WOhVZs7HL8DeolsoC6rJIkLf/JaH618TJW4fz0rg0WIClcrJ8Fa2HAFc8k87vcbMFSjma67XGt3vfyJwbyVjRZW/p/OQ8CNimATilhDFJbGZaO4UHgp6hZkrULCIX7C2sGfo/W3aBnaOFNk6+BYtjdglaJbHqK23uNS5/aUrM1cwV56CfJXybF3MuOm7dOCa0tnJ/sbooPcXPLYrfJtL+YF5ujNz9Nq3ipYIYsCf+u0NOnD1aqaG+o39gShbhotg5aWr2GNNnDgRTy3zv/HGGympRunKzOG12em0GuAIXdQs5eEhvePdmriU6rTf793SBYF2+SGWbHR09FfIzUVGRmLDfC9z5szJBT/SnZnLYrLL8HA7gYfLiBK9mCjly8gQYLK3CbQ4sO/PPGPGjOKYeUEQlCFDhmBU3KnJbBNeYebyOQjfrwa94yuGiiC4ZLBYbWxHunv37oXpe49fvXo1A/wqVKiAsJ+CfNy9e/dww/e9l7QLrzFz7zqIMNRiZ3OdgEuXLoXs3Lnz3NSpU9GWkDn8YeaRWMSEAZYRBPzzzz8fTps2zfycduF1nzlP4PD8e/fufT88PHz9li1b7s6cORPatGnDSgCFeAhGRC/RvhDjc9+/fx8/N8dT7SJjfOY0CtcTXDZro0aNitIMtqWNeN7+/fvPLFiwgDleot8iCkKTyOHDh4OiKGgekOWp8Na6YOY8VSGPtqLLdeHChQb0M6f8+uuvx9Aosk+fPtCyZUs4f/78z1wi9KdbZs4DOeXTGnHWo0ePVqB5GPbvv//+um7dumBtbfDaMHMeQfm1pSuiOgYz5/kxmDnOYObSfmfOYOYM2MMQYAgwBBgCDAG6FfB/JzZrIjM3XvcC6B3/7cPXNTYrvcND2dfRX8DMtVJjs36uSwEsNuuWFzNzEZv16zNnZ4FDksHMYWxKer3uYrMm22cOqxkVUFZfJYCxWSslLzYrniHQXqmoHttA/Mt85i6osVljdNmIRZccWrfqi33mtNiszXQpQJakIJsgQ3nNZy52h8bM7eCVP+nflStKYBNl0OU4UCJIqmXlZZjc1KmcbEyUQ/Vs8EtzM5zoYoFfW5nhlya2hP1N+EejGrLooECv1xdyhicz19fxELeOjrp7eLg4joc/u/FwsjtLyh+deLi3iFaj3UTZP03AXuiMbgTQLtTu4UUjfuAhaqNKbP3vQwInu6nEFsZnjdlKn19PsKtVLI7UV6U0F0DnN92HdlHjjyHYhwKiNxG4NIFmvisV0lH1GEKOLnK96jeBgx4tBYcuBNCMzF8eJkLCXgJ3vlNpLcwsPmIpIPgRvVl9Dr2GEmi3igHXqPAPdSHAZJNO/7VIYJHfbn2DGedZVcGSuDJVE6MldD6LpVVpGRVstrlWZKQADzNXPdAWpB5m71ZD12H1QQGYojd5qg4+8ixuMZbGv0sFCLS68dC7FpeBzJycPUdee3AZmQ1SOA/a3E+ER5sTBSRNKOT0dwIThfiB1pCzcRnIzOUv7m9p1BYJlf1s4QLDQpwQt/XZAuKosLBuTgD6iLPWxrUkKFIssFqSszCvM3P5zVZh4PCuLjYL/WOhAMOaPl9AAl0rfNbaBT9+KbLrh9H/M1n5gVzica7Xmbk8Zptz3oJhTtaFfjvECWEtkgrgteqkNmqFPv9RqBu6NldNxNaMe9yQc3MZxMyhv+L+n+fQO3qUKF1p5sa1ShQQQ+v6T2MExpJi/YdtBNo3dLNB7Mg3AuD1duKczanHrhnCzOXnCflMlmVoVV/CAOIwvrVT8QiIo1Vm4WciC67MBGwn0LCGBHYH399sk351qJl/meNfujNzed548+1iRYqbalsd4rhRtArFe6YM9I6PauuC2HWaADqA4WIm67t5zFrVzMPphJnDa3JbHOLoRAF0ykDXAh1quiB+rSZgF1GwtFJxwukVZi5fUgGeOl+9lFsTwLOZqNke5EHOUgpTpTszpwoIVQVEUwFXlvFQvbQE8dpELm7L4y2Vt7nUBRZMV2YOBYSNbK4KiKHzoF9nC6qAlWqPFLGGCXjIPdtrNMOZufwmGz9kCIavoL1NPO2BNo8XlTIyXSdscig3V/KwaIgINl46x6lfevBJgVWhV5i5/BY736tVNTecXcTDylEitMav3rqk+4IzCAJs8n2rgxmlCrdu3Rpz7NixxilsY+nOzLE+2+mSTpod8sNAi7ApwGQZzKm8Q07tUBzfvz/asR0/fvwSTlFSiF16hZnD/v2tP/74o8LDhw9Dbt++3frRo0fd6fsOvnbt2l4ktEqUKKEg2HTx4sXaySwFrzJz+GHZIiIiEnr37g0hISHQsGFDtCRk4XyRkUPYz+l0wrlz547huiIZbcG7zFy2bNkYQ5qQkDBw1apVHsBPSUorYmDlcePGwc6dO+VkfIb3mTntrualPz60Km0MCwtj0Z8Rs9REKEgv0iq2lUv0oNalzxxDkk+ePFn+77//vo6gK5YIopZYKnPmzMHo0P7PKQV9+MwlwS+zYC+0bt069Btl1QiRy5iYmAXPWBPoz2dO6zKxHueLjIxcN2bMGLDb7cwwlVP9FD2Dp+6ZOVatfv/993Lh4eHXQkNDISoqaqq2Dn49mLkk1Sqzoih9T506tVVrrK8XM0eFSNrIXzNz5swGM2cwcwatYggwBBgCDAGGgCTHr1VsyMzRx9dKQFJmDk8j8VFj5ibqXgDGZkVmjrFyB4jCjp4OqOwcPo8+dLoV8Nhn7heixO8mgKBf3C71Ef/G5zs0cWNJDNelANy4RTZOzfx/Ez6P7JBemTkeT1+Ql0i8808nldhqWJNhBoLeBFTpFKIaAjw782rC1zs1cwPtmarqS4BDNiGNhbTWC0vgkE6pRfwJsMpwcz0PCU804MTMI82Lrwfo0WuR7Qi75A8YN3SEKJjZ+N1q74OPDEU+rGI29LoOuh0HiCjfq1BJgn+WCgB7qICdPCg0hS9Qfebo6w90OQ4EBUkVeVGGrrSf/7Urr+xpY4e9nS1wuK8V9naxAP59tBuvfBLiwhIAWZba60qAyS5HnVmm0lixmwmcHyTAxRE0DVcfzw8RIHq1elIZR6uU2a4j5Mxil/OWKUXr/q9EiVrPvFTg+jQezg2lGR9OH4cJcGUCrUr78fRS7Yma1mbTipK6EOAQ5K44acM+PnKN2mix5zk7SBVwZqAAj7aqz0etI2ye9GUfJwoYrY8ScMjbdnwpgrKXClitThniGT/Hw9nBAtyczTOeDp9HAfE7CRz/TsBqdEIXArBfx8zH0XlOlFYC6HKMVencME/meZbQyhBLA3Gb1KKXacnMuXPnyd+7gWcORDN2cZHa5z+ehe5NrFI4wF1cwgM2ckTU2jSUIF/+QiO0rUY/bwlIysyJZps4dUovJyOwYAuBcT1UfjTpDPTxPIiKQTvDaARB6PVz6O9Wh2uWlvkMYeaymWxS+G/fCyxD68eJEPbxkwKemMjR52fTTC8cpgpGVDPQxk7us3EZwMzhBm1eFgmUdovoq4XTiLGfqPzc8wR8O9gJGIicTivY1IL2YMAlBhb0KjPn4x9ob9dF5d+Uq2t4pbhJhvE9XEqiAB6SrsxQwNcDnUoxet3l1TyKZpiaX6CtHfckWOUVZs7HbHV0xbDt51fw8HlHFzgE6SojGPcn3nVlL/9ECcz63Emvkx/h9X8uFADRS4vV0YX7LxnmFWYuh4MII9Egjwjuo4EWvqcHwWQZptWqRBBbIzwWMI0OYLThhzl49wH6f3/bHfwA7vnnxF5h5vJpPVO2ADP5+POO7sclgPUcqxU+YleKAib3YgJGaw03O/dynMFrPnP5A0yOj7BqoACWYXrncxUJYt0n25WgAiZ9xgSM5FLGYXiFmfPxNzk6927nEUAglk4Z8hUPYo73OIhh1RpDu1la1QalUIBXmDkU8EHPNuqkDkdj/EpKQT8ZziwX1BWZJsCUcgFeYeZ8/Gi32qOVKgAjQIQvFqBooAxH5wmeiBCA3/SgJdA7FQLSnZnz8Q2wtWRmkQfU+o54sa9Zht3TRdC+lgvYS1EBfVIhIN2ZOZ8ixQJbdmjsgmtrebi4UoDFI51s5TWXjr4XVwmAzvif0BIq6mv6KJUC0pWZ81m1amWNssEV/8mV3/+YTxHL//wCHf9YzKbhgWb+VIGi1j/x+WrVa1/bsmVzt1RWoXRl5t67efPmb4MHD4YNGzbEHT169FB0dPQc9MvCGMRnz57dunnz5kfIzF27dm0n92LoO0OYuYJLlizhp02bBhh3GDkg5KTxEf/2PIew36lTp2qksItOf2ZOo09yxMTELHkq/jBL+DuK+OmnnyJwjpVC6NVrzBybYiORhXc7qQAUVK1aNTSHHM6lLEq615m5vFjn69evzzLtuftYKvPnz4d8+fKl5L28z8xpVePtX3/99aHmaskSRn6mjXcb92JCUTfMHKKWIRgJWgtnrXz22WdI6tZLRuPNeGZOg/vevnTp0h9I6CJmuW/fvsiXNF7d+cwV3LhxoxN9RoODg7Hxhj2j8erXZ47eaczcexEREcvnzZsHpUuX9mT29fKZ8/Pzs50+fXq8dodfW2bORUvEYOYMAYYAQ4AhwBDwegmw83IVLTbra8fMTcADvHYen7lEZm6C7gXQu33sg6ZudXPX4zO3HxE0HvB5fF23AkSnPKhNwxf7zOHr9LqBuhSALNz9l/jM4ev6ZOYcsqVutWREBqWv43V4va4E2IhcvkNj9XTmZT5zeB1erysBtJcpXq1C8nzm8Dq8XndtIMAqx15a/WKfuYurWHziWF02YqdLDq1T5QWxWenz+LrokkN0Ow6gj1yVimpsVvSX03zm4CT9u3x51WdOliRZdwJKBEk29I8b1cAJ+xrxj440tiX80tIMv3e2wJEQMxyqY4OTjYgyJcSpoB8dvb6avrpRIp/7aZrAqkn0egJnh/JwfiSv0ATnRvBwcy5twEd4iFtLlKtreTDZdMTMaeMA84/DKhNPpw+XJlERwxB4InB6MG0HiBvsIYAxmlBk7aoSdqVWXQhQA4y7GZEYs42ovdBWmvGBWBJqPD4MNosC7i5Uj1uHdGY2bV11IYBmpPOgTi7mHxe9VRWAmb0xm4oYpGbe89zt7wlD0H4YLWIJfKcLARa7e/mKMSI82qJasGFmWTe6S80w2rdhdxq3V43Nh0KQVAm0SacyUoDHZ65WgNV949QPqr9cDBOg9v9MiJZ5VQCBy9N59hxWI/Sn03ahMzQ2ay4WRO2g6mhzGmNzJ8l00pRAG/eWftqhN53UlSstQ/ac+QK0Td0MYeZ8ihYPrNGktup2rNASCPvYyeiUZwnAidzwpk52Yo+/t27ghuJ+lgZcBvvMDR7RTYWc9kwV4bO26u/PEzC0iRNOLlIhwWFdGPjRn8tAn7lcJptr9boJIgNZOzdzQ/dQbUqtzYES9ibOifD5sFAnfKf50n0/FNkh57fcf83CvOYzl8dOnHO6t3DDoa8FtnBv29CtYBXBBpxAM31gggDxexJLYFxLJ+D16Et3YJZIR2T3j885+PNabNacDirCbJeOOIjQv77q/q0K2E5gfm/1bj8ugRZOhdAJXasGEjvJJ4R8yj2fCPBabFasAtlpj2KrVE4NrIkCFDoqD2ut8kMeAWgiZnGI44oWN9V5480sxbiXe815jZlj19GZMmsPTAAdldvVcDFB2A6SCEDoLyXxWb3CzGFmsprsQWz7BAczZKmrl0ysUkxA88cC8nE6Y+aYKRKLEr1XHYGBjguVS0hwfb1G7iYKGJVCAV5h5jBlpQKiHmzlWc8DGwhUogLwyw4Mu6RtYXBT2vfbUgX9pS8zlyVLFnzMZCPSuYUjRLi9Eb0WHUppSYKtU0TGU2NVGqIKGMzpiZnT8IFssbGxOypXrljJZHVuD7DKD3kxiPnMtW3khtXjRMZYt6jqBqud/4zTGTNXICIiIqRjx44QHh4eoc1UPf5ymQICrcMCzMJWk0166HRJf2qZL8TpgZnT7n5WmvFwRGpwcNq2bRuyEVMSEhJ6PXjwoGN0dHTIw4cP3x85cmQB7uXR0b3OzBX43//+V2Ho0KEeDznmm4WecrVr12Y+c40aNYJdu3bBhQsXunOp965Le2ZOu/vZr169+iNiNR7ETHtkNmxdu3aFy5cvn5g6dSr6C+VNgTWhV5i5gvPmzbN/+eWXzLHM4x+HcYerVq0K+/fvV2jDbsVpMblTCPp5hZnLSev4Sqz3mHGsQlgSc+fOBVr/Z2irN59U3vV0Z+YKVaxYsTCCfHjHsc5//PHHyMX9RquLRVtRvUrk0HRn5vLQuzwTcTKsLgcOHIiPiooK5VIXwj1DmLk8ePdnz56NAZGna33/q1QXrzJzDceMGdPk/v37hydNmhTwCtUlY5g5epdzaMN6HW3masRm1csBRy7O8JkzBBgCDAGGAEPA/xUBBjOXEQIMZi4jBRjMXEYKMJg5PbSB156ZQxbOw8w9egEz53TJzXUpoGSQVNFEZKhCq8i1pQLE7uRZdYrbqTJz6DNnF+W7QbIUqEsBZjraHp4gwD/dCeyrbon/sZYfHAkNgP11fOFgPStsb8orE+o5wS1L+utGLUQmTWswSwYlcj1Rzg7n4ewwXrkwhodzI3n462Merk0jGFBQsfEy8KKcTV/jAC9X+LChC7EziKPTh3MjVVoLA6vF/0Qb7zg1UiielY3o5kTc7FN9jQO8XK8HBpLakUhqnR6iikHk7NJ4NSooWpSgzwQdBybqSoBdCGr1eWsXxG9LnEpcnqKeF6OAyxMJPFijCpjej5kkDdWTgBz+JvvIER1cLHimhw9CAJChZzTTV75QI+SiH93Eni6g10/V9kczZ5SAd5JsgVenGZo9qYsTHm1MMpnTHpkAWhoPVqmeKwhI+QXY8AvS5bRToAxl5vDMIKfF7pw9pyd6yGklkGQUxmp0dZpahbARf9raDWjlw6mxZ3y4DIzN6tmFzm22u5YuGSAyq8JnCbg2XY1NjLhB6PtuKFrcVIt78uvsGcLMJaJndveGjSNEiFmjTh2SVqFHKGCGFhmRTifKlpbhney5zc94H68zc4+NwuxEGN6ougRLh4gKoxZpV/pgrVYaVMCNWbRRb1GrkGYanCUZBx/pzswlTe8GWoWBWD1YsGXacK9+qYGvVMyNOSqxi/aEJpt0VmtLyTmdT3dm7vGRaL4CxYKY6zFCf3vV0ReFoIBb8wjc/ZrA0PYuuhoTv9AacHIRg3Rn5piAd7LnsVQopxFaNOPn6HwohpUAD3fmE7hJB7P2tdzgG2gNScH7epWZ83G5ZXU9QOv+RTofOr9SXQvcWUinF5MIhFR1QzF/cy0uZTib15i5LIyZO0R7n+08XA0jsGeGyFjqiMVUBB2Na9M1QcEivqVT8d5eYebe8jBz2ONcH0tg1iAnm/9ELKWJCihfWoL3cuezcSk/DE9XZo4FSDtx4kSg2ea6gQbC6D99ia4FBnRWDVTvLaOJCkAsk0tF/DIuHZk5vJM5rl+/fmzPnj2QidZTWgqRPVu6oEoZCbqFuhiKfJ+2hYdTiGIR2HcGsqZCQNoyc574et988431jz/+iMIggeXKlUNSC4OGc74Bln6BFnt7/I4A7o0+WkeUf+jKzCKkOrxv2jFzmTNnZrZskZGRjVauXMniTSLghLhNmzZt4OrVq8eioqKw7+aKFfcNI2IQrBgqQmVa/x2E9OJSzoymOTOH4RknDRs2DNGyJyJ+ogie56FTp06wfPlyuHTp0mo8rbfYXWsdhMWkz1BmDgVlv3///s/NmjVjnBDeeaS1sAoh+FSpUiUYOHAgy/yBAweOXbt2bYY26uZK5Z1/dWZOq+/5x44dG3jy5Mn7mFnkhJCJe//99wFjrG7cuBH++eefXejs9+uvv1bQ6vl7mOlXQHDSjJnz+fvvvxsuXLiQZXjmzJmwY8eOu/Turk5ISPh06dKlgjbxy6l9WAHu1WitNGfmsl+4cGHZlStXFjx48KBdSEhIUe0O50qysCmcDiltmDlaBWpp1SEP92qBZnXFzKVXei1is74WPnP6Zea4NIzNyhnMnMHMGbSKIcAQYAgwBBgCnnPwZzBzGSDAYOYyUoDBzGUoK2EwczpoA/8XfOZa1n6Jz1xtlZlrqdtxgBflm8HBEpxZgsycQO8+MnMCnFwgQFVadehgdlS344BdkEuG1HbDxcG8sr9SIOypVgwONfOFfTWLw5GGBBY1EZXKZakIV+qjQ6ergOJmmfTFWExH0JqNh8uTBQjvJcC/fXm4OoVnRhlNqtLRWJCDdCkgwCbLn7VQvVTODFUZOTzcOz+KwMP1Kuz09UAW0nSyLgVYiFz1s1AXO6m/NFE9rY/4gcC5ESpqg+4em78QsQtdodM2UKJBn5ZqQLU7i1UB95bTEqAC7q9SBWydwgSs0psA3Ha3FvM1jR3UxvXYEInNfVaqAlAI+q1sowL8zcIBbZML90B1wczhlqIUaCFfTuzsYuHrPAIQ9EMBd3/QBEwV6UDm2q5tN1bkdMLM4aZuTrPdteyHASLEbU8UgKwoE7BEFbB+IvpqudZox1GeDeEMZ+bYubHJLh05OFFgRpEeAUjuYiNGViJB64XMNudXXCIvpAtmjrnbBNrle9fn88yukE0j6PQhcqNq2xmxTMXNMJI0rWq9uGdblGQYM8dMMnjRveeDBm64vJxXELHBBozUytkhaiNGMLxxbQnQHZB7MW6TIcwcpnf8rdKJgzMF5qt4+zvkhuigNoiKwQjpR4hiJWw1liMZJzpeZ+Y8zn/L1owXWX2/+bXaDs4Np2Lo74uHIvQt/cO9HPjLEGaOuX3QBjp3/jAnxNP6f32mOphdCFNxs9BqyMtZ6nOpo7XSnZlj+I3ZJk6e0d/JAo4jbhxHG+6F0bQbnUygLuJmRX3LpVCAV5m5nIEWYTjG7MaA41dopuP380xAxBQCwaVkeDdnHiuX8rPm9GHmNL8gFJlDkqRC9H9HB5hJ74k9aBXaQpTw0Twk4Lc3xvLwYCpReBdrwLm51B3Jpikz5zlNz/L3339XvXnz5lYM2dWjRw/YsHFz37KlXBC7lihbewkKTq3x2xtILJp4hpu9xaUePUg9M6fd7YLaHcxBr+tz+PDh6wMGDAA0RSpTpoyCvBD9mflejpwdnW4ZCgQEAfxKFPz2xqkwHsy8HM2pvFxqwY9UM3PYE2VbuXKlGB0dvXDVqlUMu8EMa8ZgnsiHypQpU1AEDlScyS7Dg+083KLV57dhVACRLmuTwNQKSD4zR+94oFZsbyNic/LkyT/Gjx/P3MvQxQwpLYT8kqbg4GA0BlOGDx+OIr7K9Mab7WtWkmF+DxHK0QbMC8IILvXUVoqZOWnnzp1Vzp8/D6NHj4aWLVsCGuF17tyZJazvz0oY/RATxmhNSIi/Q98n1EJcK4v7+Vfkkh/SMW2YOVEUC//vf/9rRkU0unr1aqMrV66wRH9vfOrUqdrPSrRRV//tt98qHT9+vPKsWbNKaLPO3Kno+9OEmXNovY3PM1KBZKTUWrNlWGzW9CK3vBqbVX/MHJeC2KycwcwZzJzBzBnMXEYecOTiDGbOEGAIMAQYAgwB/1cEeJg5Gy9Xfq0EGMxcRgkwmLmMFPDaM3PWFDJzVh0yc8VSyMwV0x9u83+AmWvFfOYOos8c/2RAtV3868HM2QX5t3HNnRC1UvWWwITc3PUlPPOfo4PZD7oeyEwOedOBSQIca2aD4x1McLKnBY61N8H/2tphcUsRHE75mq4F0Ma5eOMUEa5N5uHSOB5uz+fh/goerkzg4fAQAY+ZwnUtgHaPMxaPFuH6FPWYNVaLjBWxgMDaHiJYBXm73udCo2cPcsKNaVTA1MTAmg9XEPi6o4jxib/RtQDiLNlzal8n3JqhOps90gySHi4jMKalC3h3iQF6FJBH28wKzpnb56uhH1rg7te8KkCL0Rq9jIeuNSyQM3e+mfS6GtqGl66YuVLYCRX1NXcZ8IEA97/VSmCnJmAJgRZVRSjmZ/Js3jo5nTFzzL6hUNHAkG7NBXg4XxOgeS/GLCJQrbQA+QsWLZtkR1tXzBw7VSlY2K9mszoCxNA7fnmy5vRH20HM90RxiSJwmbMUf+p/dMPMMQF58xcpXbOyAHHLVX9F1aqQh4ezCfhaRI8924sYjAxj5tih3Ls58trLlRIhYTUtgUkqcoaWnf+O5qkAIYpLHiuRYcwc/eBMhUWnCLCeCtBKII425P19efCzCP9yKcfNvMrM4Ye+40+rCmwhyoUxKvx9Zy6BNT1QAL+XSxlu4HVmjnkPFQsU0VsXLo5B2InA1fE4CgvgbyGLOBU7SA2t5RVmjgUYpALiI9eiAJ65/V2bSGBUCyrAbJ/Apd7dKd2YuaT9OXatnE8R882ry3m1BKiAG7Qx96gvoMPfi0L5phsz5+kRPBnMo9VjbIxviaJY8PDhw8H37t1rR/935I0bN+bP+XZJzLHZgXBJE3D7CxyFBSjiG9g0FVUyVcxcvSQHcTm3bt0q04w1p68NiI6OnvvHH3/s2b1794XVq1ezgGpoSdWqVStA56dPPvkEho6ccHn/DCtcHqsKQOSyWhkB8hUsUoZLPXaTImauwV9//dX+8uXLsGbNGujfvz+EhoYipQUOhwM8ATSR3ELMTKO1mIB9+/bd5zK9u3z3DF4ToBKLTtq1cmpA5dSe7qeYmSv4448/1rxz5063hISESWfOnFlz8ODBExs3boxCq6qwsDDo0qUL1KhRg3ltBQUFMd+tOnXqwPyFS26O6GKB6C+JEkXTP3QQ87e9dBROc5+5AC4RbsqnzU2yayPpuytWrHAiuaUoSr/Y2Ng5J0+e3Llnz56z6G6GmJrTXfI8HXnBZBdxAEuw21gDTi0vl+Y+c083bMTKcmoNO4v2N1Imb2vPvZ3K3scrsVmfG6+bSz0E4p3YrF5MBjNnMHOcwcy9+prYYOY4g5lL+505g5kzYA9DgCHAEGAIMAToVgCycgYzlwHnxP9fMHODdCnAYOYyUoDhM6eLNmCVY5GJexEzh0xdgJ595uq87j5zRJSvVAyW4O9FAvOXe6TFZv1roQDlyzFm7pBuxwGauRUfNXLBj+0E5WB1M+yprvrM7alaHI43t8OFcUQp6ZJAdKe+B0pXAbRrnLt6nIgDFvOVuzJJgFP9BLg+i4c7C3mIXEqgb3knELfcV5cCEDeb2dfJjJAi1xG49hWBW9+r0eAw3ZtPoFewCwX01KUA2rd/PK23KgBtqhA1wIzf/FYT8A0dA8owAaG6FGAhJRpP6akKeLRNPWL13H0Wk4+WSJOSdC5UolQZvQnAw2+bTyG//pN6uB6XAFqS4N1nJfAdgdsTiVK9hAzv5crdQdv00hUzF+RTOKDNmO6q01/0JpUbTRTAw61RRLE72USuIKdDZi6/TxFTrcEdVQFRG58UcIeWwM99BbCI0nVtz193zFyBgkXN9QZ+4GJxKZFWuTQhUcBd2hvN6u4EK3Eu0Kqc7pg5nyK+1pChnVQBGMbx5qxEARFUwPjOTvA3k0+45x/fZigz51Pc395mdDfVb/TSJNpt0oHrxjeqy989KmBYBxf4BtrbcS8nVjKEmcvvZyIfTfjYhWEdlfBedCK3nQr4msDDNXQlRgX0be2Gon7WRlzykJtXZ+YyZcpUXzuYyJek6jyvBAoU8/WvVKGsDFfm8Mqpz8ljAdG0QT+go3BXuqgvUDSwCpcyBu+VmLlyFy9e7Hb+/PlWhw8fLt+tWzdfrT1k06oWIgl5uUQHnKwBFteO7dNEVo2wJ0IBOCZELiDQvLYEeXyKvYjBSHNmLseNGzd2btu2Dfr27QuTJk2CH374ATZt2vTgwIEDf4aHh2+Njo7+mv7PECS2rl+/Xs4dFLxseZjITFOj1qsNGEflaNqoq5SX4e13cpm4lB/Vpo6Zy5o1K7Ngq1KlStGYmJiv1q5dC3Xr1gVBEBjwhIwQskIVK1ZkDlAMjGrZBmZ/LrD9oMi1PItXH4urs0VEkYPYIJaaA/NX9pkrpPXd79DXe9HqdLtnz57M3Qy9tjAyIhJbaBgmBZWCcZ84FRzMsPFenccz20JlKVEsJMgTVDPDfOY8p+hvXbt2rf65c+cOo6sZlkbp0qWZUVhoi9YJn7Xm1cGMCtgXJjCXy20jRLDxbBROrctZ2sVmTeLw9+78+fNJVFTUUmwbWJX69u0f3aY+YY04mgpYM0hUcCPLIciQI3u24pwXmbnCXPKsCgtqw34e+r9jtm3fcaZqOTvAcaLEryfKNDp9sNidc7jUBZRNn9isL2ho7MCaF+V7HzZzw8oRTjA7ZMiZ470A7tUhkTRl5l6WsputfC+Lw7UpX948Vu7VLNoyjJnLr1WttMBzDGbOYOY4g5l7tRWZwcxxBjOXtvtCBjPHGcycAXsYAgwBhgBDgCEg/Zk5Izar1wU8j5nDAFOvAzM3MJnM3GBdCni9mTkiW+pWTQEzR2Sr3gSUb98kmcxcE8bMVdCVAGTgqqaMmfPVXxtIJjNH20CcLhux0yU3f15s1kcaM4dMneiSQ3QpoGSQVNwuyncqlZdYLFZk5didp4/XlgpQraIEJiKDyy031Oc44JZhcogTtjfnlUMNrLC/jh8cDg2AfTX8YE9VMxztwCu/DOGVKmUlcLrleroT4GeR8WQGIuZjIEGexWS9OIGHm9/wcHcRTQsI3FtIYHE3EWyCvEx3AsqXkdloe38lD7c0yImlJNgZYjfLPmJ+c2v0JSBb0NueBozHq9dmJGb8MfSE2BlNMzqIQNvKV7orgcrBVMAhlVjEcHbPEzA61AnEGTRQTwLwENzOqpAm4HklEDGXQO9GLvANsIzkVPsf3TBzYskSrA2wE3rGjD5DwAMqIITOmQoV9W2jbUPqgpnDjdp3na4gFh0aA8pe/ZJm+j8C6LgwlygYbI1LdAbxOjPXhPsvM4cpb+mSagk8WKUGWH66BG7Tv89O4XEwi9P2Rr3OzAX7+PgU0KqPz5P7/JmLVsfJ3GE1rDUCfx7gNWkXuv5zESzEvZd7tllYujJzeOCX58KFC3CU/kRFRbXlVPIEgacCb2bNbW5UUxWAnBxGBX1MLC5SH+/TAQ4DMJttwgDuxWfQ6cLMsZOUGzduNBg2bBi0aNECtm7dCoqiTB80aBA2wOLvV3OzIIJnhvOMVGECaKN9tFUV9ZCOxJ0buaGYv6UB9/LT+7T3mXvjjTdY/NX4+PhOGA0RnZ7Q9WnmzJlw+/btnWXKV42b10tkXSVycph5zHjcLvUxik4jWtZx0x4ooCKXfAOytPWZe/PNN1kwZXrd0G7dujGLKoSeUExoaEtoVV9UcCx4uBpLgGcZV37kmZhoWpXq0tE6V75CTi75p51p7zOXOXNmFlCZVp/ZWJU8oR3LlCkHjWu5cTrBulKcD52arsJP2IgfLSYQTAe7TJkZN5SS49q095l76623mKtfbGzsunr16rGQjuXKBUP1im42GmNXit3m7lECg58Q/o5bQhRehb/f41KO8qR9bFatJLI8ePDg58qVK0M5KqJUCbc6FqxUu82vP1G/T3CH9kCxSwgEOlId3jRNY7M+TW1lvXnz5r+lS5fBAMoKMnL3V6i89KBWLojeRVdly4myf6wAVl6O5NTT94xj5p5TxO/RMeJWoeJqKOt7y3hG6/Zp4VLQsnxAWxcE2OXYQH+/slzqcIW0Z+aeIeINM83kzQ08RK2gC3ta56vR9XGg2dHZZOUHaHU/tfRWujNzrJ7a7Y6uFYNlWDtSBJeE8VidM7UJYH7u1dgKrzFz79kdfG+L3bUhv09B7PZypkF0UK8zcx5nwLRCcwxmzmDmOIOZe7UVmcHMcQYzl7b7QgYzxxnMnAF7GAIMAYYAQ4AhwHuxWQ1mzmsCDJ+5jBRg+MxlpADDZ04PbeC1j82KLFydqi/2mauj+szp06IqSJasNkGG8rSKnFwoMD8JjM1KHxVk6KpUlJDUAsklZ9GdgBJBUjkrL8P0D5zKX02JcrieDY40N8Mf3SxwrJ0Zfm1uS/ixKR8zp7kIvFsGKlbSlQCTTU449QNtpAeIcmeBxsgtUv3l7i7kFZrg/mICD5cQJXwUbQdEvqsbAbRHKVyxHKO1FKzveKiNR6z/Sd+px60RE4hSulTqB7M0F0DnN616tXMxQxis9y8U8C2Ba2EEejV3gckhl9GFADpdnvbdUCck7KElsI0JUJ4n4OY3BC5TAWPbOsEhyr11IcBkk47/MleAuN20jm/i4299+/wSuDGHjgWjCeweLECA3b0twwRkzZoVTx5deH4QaAvyDFTKvXWMGX1OCfCMZjw/iv4+nYCfTXrAqYFmM4SZq33hwoXDf4eH77baHGyQUvYSODRLhDvznl8CF2bwcH4knZVOoQ25NGvIebU9VK/7zOV58OBB6/YdPoBGNUQFiRTahcLkPi6I+O7ZAtDtckIXJ9zGQIMTidK3hQtNw5pwifCfV33mcIM263ffL4RebQgDOs6t4GH0Jy649xwB9xcQGNDGBTv6CSgAJrRzgtkujuUSA6153Wcud806DZbO6K96ai0LEyGsh4t5yt2ep2KWd79XH7H6PKAC+rV0Qa9mLrgzicCBYbQh21hDzsllkM9crgCLc+O2qSJj5fq0d8HYTxMFMH/FqQI8WKwCT5ELCXwc4lIC6QL/xFgeBoS66LrAtYR7drRQr8Rmze9wODryggCtG7gUhyDBxM8SBSBus2qEE6J+UAVELSLQ9n26mHHwgwLs0hEbcX7LvTjUqVdis+Z48PDhmLLlykNQidJKUgFYZSZ/6oSYFRq1S0uiYTU35C3AvOawN8uTjLO1dI/NWrBfv35+SC66pRLKhJ6qALzjCPl9TOt87CqNmVtCoHKwDNmy57FwGc3MPZXePXny5G92hwBjaSNGX0WNkYOadIGTsIZnAuKWEkWSWd+fUvQmfZi5JMmH/l/3eu83hJHdRQUJ3dvatzcqVpBBWacKiF9K6AQuKLUBNtOHmUtyh3J8M/c7GNpFRYyxBzo5jYeyZek0e4PajUbSKhVolz1mebpi5liXOmDg0HVDuvAsxDsOWvvGCIqLVhnYTZTrdIK3ZjAzy7vNpc4sL92ZOR//QOuHLepLcO5rHlYMFOGD+m4QXdJ90RWEwF+k2eHebTYFpMSu0+s+c3mcTvdxs0OOsjjcO2wOIYxLJNzf1kbcVwnv6x1mjlNd/XI+Ncd5rZi59EBwDGbOYOY4g5lL/YrMYOY4g5lL230hg5njDGbuBQJet2QIMAQYAgwBhoBXSv8Pt4IgP/7zX10AAAAASUVORK5CYII=";

	var img$1 = "data:image/svg+xml,%3csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='768' height='768' viewBox='0 0 768 768'%3e%3cpath fill='white' d='M379.5 288h4.5q39 0 67.5 28.5t28.5 67.5v6zM241.5 313.5q-18 36-18 70.5 0 66 47.25 113.25t113.25 47.25q34.5 0 70.5-18l-49.5-49.5q-12 3-21 3-39 0-67.5-28.5t-28.5-67.5q0-9 3-21zM64.5 136.5l40.5-40.5 567 567-40.5 40.5q-7.5-7.5-47.25-46.5t-60.75-60q-64.5 27-139.5 27-118.5 0-214.5-66t-138-174q16.5-39 51.75-86.25t68.25-72.75q-18-18-50.25-51t-36.75-37.5zM384 223.5q-30 0-58.5 12l-69-69q58.5-22.5 127.5-22.5 118.5 0 213.75 66t137.25 174q-36 88.5-109.5 151.5l-93-93q12-28.5 12-58.5 0-66-47.25-113.25t-113.25-47.25z'%3e%3c/path%3e%3c/svg%3e";

	var es = {
	  exit: 'Salir',
	  exitView: 'Salir de la vista Street View',
	  dragToInit: 'Arrastre y suelte para iniciar Google Street View',
	  noImages: 'Sin imágenes en la zona. Click en el mapa para trasladarse',
	  termsOfService: 'Condiciones del Servicio',
	  expand: 'Expandir',
	  minimize: 'Minimizar'
	};

	var en = {
	  exit: 'Exit',
	  exitView: 'Exit Street View mode',
	  dragToInit: 'Drag and drop to initialize Google Street View',
	  noImages: 'No images found. Click on the map to move',
	  termsOfService: 'Terms of Service',
	  expand: 'Expand',
	  minimize: 'Minimize'
	};

	var languages = /*#__PURE__*/Object.freeze({
		__proto__: null,
		es: es,
		en: en
	});

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
	/**
	 * Street View implementation for Open Layers.
	 *
	 * @constructor
	 * @param map Instance of the created map
	 * @param opt_options StreetView options, see [StreetView Options](#options) for more details.
	 */

	var StreetView = /*#__PURE__*/function () {
	  function StreetView(map, opt_options) {
	    classCallCheck(this, StreetView);

	    // Default options
	    this.options = Object.assign({
	      apiKey: null,
	      size: 'bg',
	      resizable: true,
	      sizeToggler: true,
	      defaultMapSize: 'expanded',
	      language: 'en',
	      target: null
	    }, opt_options); // Language support

	    this._i18n = languages[this.options.language];
	    this.map = map;
	    this.view = map.getView();
	    this.viewport = map.getTargetElement();
	    this._pegmanSelectedCoords = [];
	    this._pegmanHeading = 180;
	    this._streetViewInitEvt = new Event('streetViewInit');
	    this._streetViewExitEvt = new Event('streetViewExit');

	    this._prepareLayers();

	    this._addMapInteractions();

	    this._createMapControls();

	    this._prepareLayout();

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
	        var offset; // Calculating the sprite offset

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
	          attributions: "&copy; ".concat(new Date().getFullYear(), " Google Maps <a href=\"https://www.google.com/help/terms_maps/\" target=\"_blank\">").concat(this._i18n.termsOfService, "</a>"),
	          maxZoom: 19,
	          url: 'https://mt{0-3}.google.com/vt/?lyrs=svv|cb_client:apiv3&style=50&x={x}&y={y}&z={z}'
	        })
	      }); // Pegman Layer

	      this._pegmanLayer = new layer.Vector({
	        zIndex: 99,
	        source: new source.Vector(),
	        style: function style$1() {
	          return new style.Style({
	            image: new style.Icon({
	              anchor: [0.5, 32],
	              anchorXUnits: IconAnchorUnits.FRACTION,
	              anchorYUnits: IconAnchorUnits.PIXELS,
	              rotateWithView: true,
	              opacity: 1.0,
	              src: img,
	              size: [48, 48],
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
	    key: "_prepareLayout",
	    value: function _prepareLayout() {
	      var _this3 = this;

	      /**
	       * Create a handler to allow resize the layout
	       *
	       * @protected
	       */
	      var addHandlerResizable = function addHandlerResizable() {
	        var scrollHandler = document.createElement('div');
	        scrollHandler.className = 'ol-street-view--scroll-handler';
	        scrollHandler.innerHTML = '<span></span>';

	        _this3.viewport.append(scrollHandler);

	        var debounceRefresh = debounce(function () {
	          _this3._refreshMap(false);
	        }, 150);
	        interact__default['default'](_this3.viewport).resizable({
	          edges: {
	            top: scrollHandler,
	            left: false,
	            bottom: false,
	            right: false
	          },
	          listeners: {
	            start: function start() {
	              // If not removed, the resize is very janky
	              _this3.mapContainer.classList.remove('ol-street-view--transitions');
	            },
	            move: function move(event) {
	              var _event$target$dataset = event.target.dataset,
	                  x = _event$target$dataset.x,
	                  y = _event$target$dataset.y;
	              x = (parseFloat(x) || 0) + event.deltaRect.left;
	              y = (parseFloat(y) || 0) + event.deltaRect.top;
	              Object.assign(event.target.style, {
	                height: "".concat(event.rect.height, "px")
	              });
	              Object.assign(event.target.dataset, {
	                x: x,
	                y: y
	              });
	              debounceRefresh();
	            },
	            end: function end() {
	              _this3.mapContainer.classList.add('ol-street-view--transitions');

	              _this3._refreshMap(false);
	            }
	          },
	          modifiers: [interact__default['default'].modifiers.restrictSize({
	            min: {
	              width: null,
	              height: 200
	            }
	          })]
	        });
	      };
	      /**
	       * Create the streView container
	       * and move the map inside another parent container
	       *
	       * @protected
	       */


	      var addStreetViewHtml = function addStreetViewHtml() {
	        _this3.streetViewPanoramaDiv = document.createElement('div');
	        _this3.streetViewPanoramaDiv.id = 'ol-street-view--panorama';
	        var streetViewNoResultsDiv = document.createElement('div');
	        streetViewNoResultsDiv.className = 'ol-street-view--no-results';
	        streetViewNoResultsDiv.innerHTML = "\n            <div class=\"ol-street-view--no-results-icon\">\n                <img src=\"".concat(img$1, "\"/>\n            </div>\n            <div class=\"ol-street-view--no-results-text\">\n                ").concat(_this3._i18n.noImages, "\n            </div>\n        ");

	        _this3.streetViewPanoramaDiv.appendChild(streetViewNoResultsDiv); // Create exit control div


	        _this3.exitControlUI = document.createElement('button');
	        _this3.exitControlUI.innerHTML = _this3._i18n.exit;
	        _this3.exitControlUI.type = 'button';
	        _this3.exitControlUI.className = 'gm-control-active gm-control-exit';
	        _this3.exitControlUI.title = _this3._i18n.exitView; //this.exitControlUI.index = 1;

	        _this3.exitControlUI.onclick = _this3.hideStreetView.bind(_this3);
	        streetViewNoResultsDiv.appendChild(_this3.exitControlUI);
	        var parentMap = _this3.viewport.parentElement;
	        _this3.mapContainer = document.createElement('div');
	        _this3.mapContainer.id = 'ol-street-view--map-container';
	        _this3.mapContainer.className = 'ol-street-view--transitions'; // Move the map element (viewport) inside a new container

	        parentMap.replaceChild(_this3.mapContainer, _this3.viewport);

	        _this3.mapContainer.appendChild(_this3.streetViewPanoramaDiv);

	        _this3.mapContainer.appendChild(_this3.viewport);

	        _this3.viewport.classList.add('ol-street-view--map');

	        if (_this3.options.resizable) {
	          addHandlerResizable();
	        }
	      };

	      addStreetViewHtml();
	    }
	    /**
	     * @protected
	     */

	  }, {
	    key: "_createMapControls",
	    value: function _createMapControls() {
	      var _this4 = this;

	      /**
	       * @protected
	       */
	      var addPegmanInteraction = function addPegmanInteraction() {
	        var oldPosX = 0,
	            stopInteract; // Grab Left/Right Direction of Mouse for Pegman Image

	        var onMouseMove = function onMouseMove(e) {
	          // Left
	          if (e.pageX < oldPosX) {
	            _this4.pegmanDraggable.classList.add('ol-street-view--left');

	            _this4.pegmanDraggable.classList.remove('ol-street-view--right'); // Right

	          } else if (e.pageX > oldPosX) {
	            _this4.pegmanDraggable.classList.add('ol-street-view--right');

	            _this4.pegmanDraggable.classList.remove('ol-street-view--left');
	          }

	          oldPosX = e.pageX;
	          return oldPosX;
	        };

	        onMouseMove = onMouseMove.bind(_this4);
	        /**
	         * @protected
	         */

	        var terminateDragging = function terminateDragging() {
	          _this4._isDragging = false;
	          document.body.classList.remove('ol-street-view--activated-on-dragging'); // Reset Pegman

	          _this4.pegmanDraggable.classList.remove('ol-street-view--can-drop', 'ol-street-view--dragged', 'ol-street-view--left', 'ol-street-view--right', 'ol-street-view--active', 'ol-street-view--dropped');

	          _this4.pegmanDraggable.removeAttribute('style');

	          _this4.pegmanDraggable.removeAttribute('data-x');

	          _this4.pegmanDraggable.removeAttribute('data-y'); // Remove Dropzone Feedback


	          _this4.viewport.classList.remove('ol-street-view--drop-active', 'ol-street-view--drop-target');

	          document.removeEventListener('mousemove', onMouseMove);
	        }; // Add Escape support to abort the dragging


	        document.addEventListener('keydown', function (_ref) {
	          var key = _ref.key;

	          if (_this4._isDragging && key === 'Escape') {
	            stopInteract();
	            terminateDragging();

	            _this4.map.removeLayer(_this4._streetViewXyzLayer);
	          }
	        });
	        interact__default['default']('.ol-street-view--draggable').draggable({
	          inertia: false,
	          onmove: function onmove(e) {
	            _this4._isDragging = true;
	            stopInteract = e.interaction.stop;
	            document.addEventListener('mousemove', onMouseMove);

	            _this4.pegmanDraggable.classList.remove('ol-street-view--dropped');

	            var pTarget = e.target,
	                // Keep the Dragged Position in the data-x/data-y Attributes
	            x = (parseFloat(pTarget.getAttribute('data-x')) || 0) + e.dx,
	                y = (parseFloat(pTarget.getAttribute('data-y')) || 0) + e.dy; // Translate the Element

	            pTarget.style.webkitTransform = pTarget.style.transform = "translate(".concat(x, "px, ").concat(y, "px)"); // Update the Posiion Attributes

	            pTarget.setAttribute('data-x', x);
	            pTarget.setAttribute('data-y', y);
	          },
	          onend: function onend(e) {
	            var viewportOffset = _this4.mapContainer.getBoundingClientRect(); // To compensate if the map is not 100%  width of the browser


	            var mapDistanceX = viewportOffset.left;
	            var mapDistanceY = viewportOffset.top; // Compensate cursor offset

	            var location = _this4.map.getCoordinateFromPixel([e.client.x - mapDistanceX, e.client.y - mapDistanceY + _this4.pegmanDraggable.clientHeight - 10]);

	            _this4._pegmanSelectedCoords = location;

	            _this4._initPegmanOnMap();
	          }
	        }).styleCursor(false); // Enable Draggables to be Dropped into this Container

	        interact__default['default'](_this4.viewport).dropzone({
	          accept: '.ol-street-view--draggable',
	          overlap: 0.75,
	          ondropactivate: function ondropactivate() {
	            _this4.viewport.classList.add('ol-street-view--drop-active');
	          },
	          ondragenter: function ondragenter() {
	            // Add Stree View Layer showing areas wheres StreetView exists
	            _this4.map.addLayer(_this4._streetViewXyzLayer);

	            document.body.classList.add('ol-street-view--activated-on-dragging');

	            _this4.pegmanDraggable.classList.add('ol-street-view--active', 'ol-street-view--can-drop');

	            _this4.viewport.classList.add('ol-street-view--drop-target');
	          },
	          ondragleave: function ondragleave() {
	            // Remove the Drop Feedback Style
	            _this4.viewport.classList.remove('ol-street-view--drop-target');

	            _this4.pegmanDraggable.classList.remove('ol-street-view--can-drop');
	          },
	          ondrop: function ondrop() {
	            _this4.pegmanDraggable.classList.add('ol-street-view--dropped');
	          },
	          ondropdeactivate: function ondropdeactivate() {
	            return terminateDragging();
	          }
	        });
	      };
	      /**
	       * @protected
	       */


	      var addPegmanControl = function addPegmanControl() {
	        _this4.pegmanDivControl = document.createElement('div');
	        _this4.pegmanDivControl.id = 'ol-street-view--pegman-button-div';
	        _this4.pegmanDivControl.className = "ol-street-view--".concat(_this4.options.size, "-btn");
	        _this4.pegmanDivControl.title = _this4._i18n.dragToInit;
	        _this4.pegmanDraggable = document.createElement('div');
	        _this4.pegmanDraggable.id = 'ol-street-view--pegman-draggable';
	        _this4.pegmanDraggable.className = 'ol-street-view--draggable ol-street-view--drag-drop';
	        var pegmanBtn = document.createElement('div');
	        pegmanBtn.id = 'ol-street-view--pegman-button';

	        _this4.pegmanDivControl.append(_this4.pegmanDraggable);

	        _this4.pegmanDivControl.append(pegmanBtn);

	        var controlParams = {
	          element: _this4.pegmanDivControl,
	          target: _this4.options.target
	        };

	        _this4.map.addControl(new control.Control(controlParams));

	        addPegmanInteraction();
	      };

	      var addSizeTogglerControl = function addSizeTogglerControl() {
	        var compactClass = 'ol-street-view--compact';

	        if (_this4.options.defaultMapSize === 'compact') {
	          document.body.classList.add(compactClass);
	        }

	        var togglerDiv = document.createElement('div');
	        togglerDiv.className = 'ol-street-view--size-toggler ol-unselectable ol-control';
	        var togglerBtn = document.createElement('button');
	        togglerBtn.title = _this4._i18n.minimize;
	        togglerBtn.innerHTML = '<div class="ol-street-view--size-toggler-img"></div>';

	        togglerBtn.onclick = function () {
	          document.body.classList.toggle(compactClass);

	          if (document.body.classList.contains(compactClass)) {
	            // Minimized
	            togglerBtn.title = _this4._i18n.expand; // Store height for later

	            _this4._lastHeight = _this4.viewport.style.height; // Restore height if it was resized

	            _this4.viewport.style.height = null;
	          } else {
	            // Expanded
	            togglerBtn.title = _this4._i18n.minimize;
	            if (_this4._lastHeight) _this4.viewport.style.height = _this4._lastHeight;
	          } // Timeout to allow transition in ccs


	          setTimeout(function () {
	            _this4._refreshMap();
	          }, 150);
	        };

	        togglerDiv.append(togglerBtn);

	        _this4.map.addControl(new control.Control({
	          element: togglerDiv
	        }));
	      };

	      addPegmanControl();

	      if (this.options.sizeToggler) {
	        addSizeTogglerControl();
	      }
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
	                loader = new Loader(this.options.apiKey, {
	                  language: this.options.language
	                });
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
	      var _this5 = this;

	      var latLon = proj.transform(coords, this.view.getProjection(), 'EPSG:4326').reverse();
	      var latLonGoogle = {
	        lat: latLon[0],
	        lng: latLon[1]
	      };
	      var streetViewService = new google.maps.StreetViewService();
	      streetViewService.getPanoramaByLocation(latLonGoogle, SV_MAX_DISTANCE_METERS, function (_, status) {
	        if (status === google.maps.StreetViewStatus.OK) {
	          _this5._panorama.setPosition(latLonGoogle);

	          _this5._panorama.setVisible(true);
	        } else {
	          _this5._showNoDataMode();

	          _this5._updatePegmanPosition(coords, false);
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

	      this._centerMapToPegman();
	    }
	    /**
	     * @protected
	     */

	  }, {
	    key: "_centerMapToPegman",
	    value: function _centerMapToPegman() {
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
	      var _this6 = this;

	      this._panorama = new google.maps.StreetViewPanorama(this.streetViewPanoramaDiv, {
	        pov: {
	          heading: 165,
	          pitch: 0
	        },
	        zoom: 1,
	        visible: false,
	        motionTracking: false,
	        motionTrackingControl: false,
	        radius: SV_MAX_DISTANCE_METERS,
	        enableCloseButton: false,
	        fullscreenControl: false
	      });

	      this._panorama.addListener('position_changed', function () {
	        var position = _this6._panorama.getPosition();

	        _this6._updatePegmanPosition(position);
	      });

	      this._panorama.addListener('pov_changed', function () {
	        _this6._pegmanHeading = _this6._panorama.getPov().heading;

	        _this6._pegmanLayer.getSource().changed();
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
	     * Map click listener to translate StreetView position
	     *
	     * @protected
	     */

	  }, {
	    key: "_addClickListener",
	    value: function _addClickListener() {
	      var _this7 = this;

	      var clickListener = function clickListener(evt) {
	        var position = _this7.map.getCoordinateFromPixel(evt.pixel);

	        _this7._updateStreetViewPosition(position);

	        evt.preventDefault();
	        evt.stopPropagation();
	      };

	      this._keyClickOnMap = this.map.on('click', clickListener);
	    }
	    /**
	     * @protected
	     */

	  }, {
	    key: "_refreshMap",
	    value: function _refreshMap() {
	      var centerToPegman = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	      // Force refresh the layers
	      this.map.updateSize();
	      window.dispatchEvent(new Event('resize'));
	      if (centerToPegman) this._centerMapToPegman();
	    }
	    /**
	     * Show Street View mode
	     * @public
	     */

	  }, {
	    key: "showStreetView",
	    value: function showStreetView() {
	      var _this8 = this;

	      if (this._lastHeight) {
	        this.viewport.style.height = this._lastHeight;
	      } // Timeout to allow transition in ccs


	      setTimeout(function () {
	        _this8._refreshMap(false);
	      }, 150); // Only init one time

	      if (!this._isInitialized) {
	        this._initStreetView();
	      }

	      this._updateStreetViewPosition(this._pegmanSelectedCoords);

	      this._panorama.setVisible(true);

	      this._addClickListener();

	      this.viewport.dispatchEvent(this._streetViewInitEvt);
	    }
	    /**
	     * Disables Street View mode
	     * @public
	     */

	  }, {
	    key: "hideStreetView",
	    value: function hideStreetView() {
	      var _this9 = this;

	      this._selectPegman.getFeatures().clear();

	      var pegmanLayerSource = this._pegmanLayer.getSource();

	      pegmanLayerSource.clear();
	      this._pegmanSelectedCoords = []; // Remove SV Layer

	      this.map.removeLayer(this._streetViewXyzLayer);
	      document.body.classList.remove('ol-street-view--activated'); // Store height for later

	      this._lastHeight = this.viewport.style.height; // Restore height if it was resized

	      this.viewport.style.height = null;

	      this._panorama.setVisible(false);

	      setTimeout(function () {
	        _this9._refreshMap(false);
	      }, 150);
	      Observable.unByKey(this._keyClickOnMap); // Maybe, exit fullscreen

	      if (document.fullscreenElement) document.exitFullscreen();
	      this.viewport.dispatchEvent(this._streetViewExitEvt);
	    }
	  }]);

	  return StreetView;
	}();

	function debounce(func) {
	  var wait = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 250;
	  var timeout;
	  return function executedFunction() {
	    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    var later = function later() {
	      clearTimeout(timeout);
	      func.apply(void 0, args);
	    };

	    clearTimeout(timeout);
	    timeout = setTimeout(later, wait);
	  };
	}

	return StreetView;

})));
