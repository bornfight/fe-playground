var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.defineProperty =
    $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties
        ? Object.defineProperty
        : function (d, f, n) {
              d != Array.prototype && d != Object.prototype && (d[f] = n.value);
          };
$jscomp.getGlobal = function (d) {
    return "undefined" != typeof window && window === d ? d : "undefined" != typeof global && null != global ? global : d;
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.polyfill = function (d, f, n, w) {
    if (f) {
        n = $jscomp.global;
        d = d.split(".");
        for (w = 0; w < d.length - 1; w++) {
            var g = d[w];
            g in n || (n[g] = {});
            n = n[g];
        }
        d = d[d.length - 1];
        w = n[d];
        f = f(w);
        f != w && null != f && $jscomp.defineProperty(n, d, { configurable: !0, writable: !0, value: f });
    }
};
$jscomp.polyfill(
    "Math.imul",
    function (d) {
        return d
            ? d
            : function (f, d) {
                  f = Number(f);
                  d = Number(d);
                  var n = f & 65535,
                      g = d & 65535;
                  return (n * g + (((((f >>> 16) & 65535) * g + n * ((d >>> 16) & 65535)) << 16) >>> 0)) | 0;
              };
    },
    "es6",
    "es3",
);
$jscomp.polyfill(
    "Math.clz32",
    function (d) {
        return d
            ? d
            : function (f) {
                  f = Number(f) >>> 0;
                  if (0 === f) return 32;
                  var d = 0;
                  0 === (f & 4294901760) && ((f <<= 16), (d += 16));
                  0 === (f & 4278190080) && ((f <<= 8), (d += 8));
                  0 === (f & 4026531840) && ((f <<= 4), (d += 4));
                  0 === (f & 3221225472) && ((f <<= 2), (d += 2));
                  0 === (f & 2147483648) && d++;
                  return d;
              };
    },
    "es6",
    "es3",
);
$jscomp.polyfill(
    "Math.trunc",
    function (d) {
        return d
            ? d
            : function (d) {
                  d = Number(d);
                  if (isNaN(d) || Infinity === d || -Infinity === d || 0 === d) return d;
                  var f = Math.floor(Math.abs(d));
                  return 0 > d ? -f : f;
              };
    },
    "es6",
    "es3",
);
$jscomp.SYMBOL_PREFIX = "jscomp_symbol_";
$jscomp.initSymbol = function () {
    $jscomp.initSymbol = function () {};
    $jscomp.global.Symbol || ($jscomp.global.Symbol = $jscomp.Symbol);
};
$jscomp.symbolCounter_ = 0;
$jscomp.Symbol = function (d) {
    return $jscomp.SYMBOL_PREFIX + (d || "") + $jscomp.symbolCounter_++;
};
$jscomp.initSymbolIterator = function () {
    $jscomp.initSymbol();
    var d = $jscomp.global.Symbol.iterator;
    d || (d = $jscomp.global.Symbol.iterator = $jscomp.global.Symbol("iterator"));
    "function" != typeof Array.prototype[d] &&
        $jscomp.defineProperty(Array.prototype, d, {
            configurable: !0,
            writable: !0,
            value: function () {
                return $jscomp.arrayIterator(this);
            },
        });
    $jscomp.initSymbolIterator = function () {};
};
$jscomp.arrayIterator = function (d) {
    var f = 0;
    return $jscomp.iteratorPrototype(function () {
        return f < d.length ? { done: !1, value: d[f++] } : { done: !0 };
    });
};
$jscomp.iteratorPrototype = function (d) {
    $jscomp.initSymbolIterator();
    d = { next: d };
    d[$jscomp.global.Symbol.iterator] = function () {
        return this;
    };
    return d;
};
$jscomp.makeIterator = function (d) {
    $jscomp.initSymbolIterator();
    var f = d[Symbol.iterator];
    return f ? f.call(d) : $jscomp.arrayIterator(d);
};
$jscomp.FORCE_POLYFILL_PROMISE = !1;
$jscomp.polyfill(
    "Promise",
    function (d) {
        function f() {
            this.batch_ = null;
        }
        function n(d) {
            return d instanceof g
                ? d
                : new g(function (f, D) {
                      f(d);
                  });
        }
        if (d && !$jscomp.FORCE_POLYFILL_PROMISE) return d;
        f.prototype.asyncExecute = function (d) {
            null == this.batch_ && ((this.batch_ = []), this.asyncExecuteBatch_());
            this.batch_.push(d);
            return this;
        };
        f.prototype.asyncExecuteBatch_ = function () {
            var d = this;
            this.asyncExecuteFunction(function () {
                d.executeBatch_();
            });
        };
        var w = $jscomp.global.setTimeout;
        f.prototype.asyncExecuteFunction = function (d) {
            w(d, 0);
        };
        f.prototype.executeBatch_ = function () {
            for (; this.batch_ && this.batch_.length; ) {
                var d = this.batch_;
                this.batch_ = [];
                for (var f = 0; f < d.length; ++f) {
                    var g = d[f];
                    delete d[f];
                    try {
                        g();
                    } catch (la) {
                        this.asyncThrow_(la);
                    }
                }
            }
            this.batch_ = null;
        };
        f.prototype.asyncThrow_ = function (d) {
            this.asyncExecuteFunction(function () {
                throw d;
            });
        };
        var g = function (d) {
            this.state_ = 0;
            this.result_ = void 0;
            this.onSettledCallbacks_ = [];
            var f = this.createResolveAndReject_();
            try {
                d(f.resolve, f.reject);
            } catch (u) {
                f.reject(u);
            }
        };
        g.prototype.createResolveAndReject_ = function () {
            function d(d) {
                return function (D) {
                    g || ((g = !0), d.call(f, D));
                };
            }
            var f = this,
                g = !1;
            return { resolve: d(this.resolveTo_), reject: d(this.reject_) };
        };
        g.prototype.resolveTo_ = function (d) {
            if (d === this) this.reject_(new TypeError("A Promise cannot resolve to itself"));
            else if (d instanceof g) this.settleSameAsPromise_(d);
            else {
                a: switch (typeof d) {
                    case "object":
                        var f = null != d;
                        break a;
                    case "function":
                        f = !0;
                        break a;
                    default:
                        f = !1;
                }
                f ? this.resolveToNonPromiseObj_(d) : this.fulfill_(d);
            }
        };
        g.prototype.resolveToNonPromiseObj_ = function (d) {
            var f = void 0;
            try {
                f = d.then;
            } catch (u) {
                this.reject_(u);
                return;
            }
            "function" == typeof f ? this.settleSameAsThenable_(f, d) : this.fulfill_(d);
        };
        g.prototype.reject_ = function (d) {
            this.settle_(2, d);
        };
        g.prototype.fulfill_ = function (d) {
            this.settle_(1, d);
        };
        g.prototype.settle_ = function (d, f) {
            if (0 != this.state_) throw Error(("Cannot settle(" + d + ", " + f) | ("): Promise already settled in state" + this.state_));
            this.state_ = d;
            this.result_ = f;
            this.executeOnSettledCallbacks_();
        };
        g.prototype.executeOnSettledCallbacks_ = function () {
            if (null != this.onSettledCallbacks_) {
                for (var d = this.onSettledCallbacks_, f = 0; f < d.length; ++f) d[f].call(), (d[f] = null);
                this.onSettledCallbacks_ = null;
            }
        };
        var ma = new f();
        g.prototype.settleSameAsPromise_ = function (d) {
            var f = this.createResolveAndReject_();
            d.callWhenSettled_(f.resolve, f.reject);
        };
        g.prototype.settleSameAsThenable_ = function (d, f) {
            var g = this.createResolveAndReject_();
            try {
                d.call(f, g.resolve, g.reject);
            } catch (la) {
                g.reject(la);
            }
        };
        g.prototype.then = function (d, f) {
            function u(d, f) {
                return "function" == typeof d
                    ? function (f) {
                          try {
                              n(d(f));
                          } catch (ea) {
                              D(ea);
                          }
                      }
                    : f;
            }
            var n,
                D,
                w = new g(function (d, f) {
                    n = d;
                    D = f;
                });
            this.callWhenSettled_(u(d, n), u(f, D));
            return w;
        };
        g.prototype.catch = function (d) {
            return this.then(void 0, d);
        };
        g.prototype.callWhenSettled_ = function (d, f) {
            function g() {
                switch (n.state_) {
                    case 1:
                        d(n.result_);
                        break;
                    case 2:
                        f(n.result_);
                        break;
                    default:
                        throw Error("Unexpected state: " + n.state_);
                }
            }
            var n = this;
            null == this.onSettledCallbacks_
                ? ma.asyncExecute(g)
                : this.onSettledCallbacks_.push(function () {
                      ma.asyncExecute(g);
                  });
        };
        g.resolve = n;
        g.reject = function (d) {
            return new g(function (f, g) {
                g(d);
            });
        };
        g.race = function (d) {
            return new g(function (f, g) {
                for (var u = $jscomp.makeIterator(d), w = u.next(); !w.done; w = u.next()) n(w.value).callWhenSettled_(f, g);
            });
        };
        g.all = function (d) {
            var f = $jscomp.makeIterator(d),
                u = f.next();
            return u.done
                ? n([])
                : new g(function (d, g) {
                      function w(f) {
                          return function (g) {
                              D[f] = g;
                              Q--;
                              0 == Q && d(D);
                          };
                      }
                      var D = [],
                          Q = 0;
                      do D.push(void 0), Q++, n(u.value).callWhenSettled_(w(D.length - 1), g), (u = f.next());
                      while (!u.done);
                  });
        };
        return g;
    },
    "es6",
    "es3",
);
var DracoDecoderModule = function (d) {
    function f(a, b) {
        a || W("Assertion failed: " + b);
    }
    function n(e, b) {
        if (0 === b || !e) return "";
        for (var c = 0, l, d = 0; ; ) {
            l = T[(e + d) >> 0];
            c |= l;
            if (0 == l && !b) break;
            d++;
            if (b && d == b) break;
        }
        b || (b = d);
        l = "";
        if (128 > c) {
            for (; 0 < b; )
                (c = String.fromCharCode.apply(String, T.subarray(e, e + Math.min(b, 1024)))), (l = l ? l + c : c), (e += 1024), (b -= 1024);
            return l;
        }
        return a.UTF8ToString(e);
    }
    function w(a) {
        return a.replace(/__Z[\w\d_]+/g, function (a) {
            return a === a ? a : a + " [" + a + "]";
        });
    }
    function g() {
        a: {
            var e = Error();
            if (!e.stack) {
                try {
                    throw Error(0);
                } catch (b) {
                    e = b;
                }
                if (!e.stack) {
                    e = "(no stack trace available)";
                    break a;
                }
            }
            e = e.stack.toString();
        }
        a.extraStackTrace && (e += "\n" + a.extraStackTrace());
        return w(e);
    }
    function ma(a, b) {
        0 < a % b && (a += b - (a % b));
        return a;
    }
    function D() {
        a.HEAP8 = fa = new Int8Array(F);
        a.HEAP16 = za = new Int16Array(F);
        a.HEAP32 = x = new Int32Array(F);
        a.HEAPU8 = T = new Uint8Array(F);
        a.HEAPU16 = Oa = new Uint16Array(F);
        a.HEAPU32 = Pa = new Uint32Array(F);
        a.HEAPF32 = Qa = new Float32Array(F);
        a.HEAPF64 = Ra = new Float64Array(F);
    }
    function Ma() {
        var e = a.usingWasm ? Aa : Sa,
            b = 2147483648 - e;
        if (x[ba >> 2] > b) return !1;
        var c = y;
        for (y = Math.max(y, ib); y < x[ba >> 2]; ) y = 536870912 >= y ? ma(2 * y, e) : Math.min(ma((3 * y + 2147483648) / 4, e), b);
        e = a.reallocBuffer(y);
        if (!e || e.byteLength != y) return (y = c), !1;
        a.buffer = F = e;
        D();
        return !0;
    }
    function u(e) {
        for (; 0 < e.length; ) {
            var b = e.shift();
            if ("function" == typeof b) b();
            else {
                var c = b.func;
                "number" === typeof c ? (void 0 === b.arg ? a.dynCall_v(c) : a.dynCall_vi(c, b.arg)) : c(void 0 === b.arg ? null : b.arg);
            }
        }
    }
    function la(e) {
        ha++;
        a.monitorRunDependencies && a.monitorRunDependencies(ha);
    }
    function Na(e) {
        ha--;
        a.monitorRunDependencies && a.monitorRunDependencies(ha);
        0 == ha && (null !== Ba && (clearInterval(Ba), (Ba = null)), sa && ((e = sa), (sa = null), e()));
    }
    function na() {
        return !!na.uncaught_exception;
    }
    function qa() {
        var e = A.last;
        if (!e) return (m.setTempRet0(0), 0) | 0;
        var b = A.infos[e],
            c = b.type;
        if (!c) return (m.setTempRet0(0), e) | 0;
        var l = Array.prototype.slice.call(arguments);
        a.___cxa_is_pointer_type(c);
        qa.buffer || (qa.buffer = Ta(4));
        x[qa.buffer >> 2] = e;
        e = qa.buffer;
        for (var d = 0; d < l.length; d++)
            if (l[d] && a.___cxa_can_catch(l[d], c, e)) return (e = x[e >> 2]), (b.adjusted = e), (m.setTempRet0(l[d]), e) | 0;
        e = x[e >> 2];
        return (m.setTempRet0(c), e) | 0;
    }
    function Q(e, b) {
        v.varargs = b;
        try {
            var c = v.get(),
                l = v.get(),
                d = v.get();
            e = 0;
            Q.buffer ||
                ((Q.buffers = [null, [], []]),
                (Q.printChar = function (b, c) {
                    var e = Q.buffers[b];
                    f(e);
                    if (0 === c || 10 === c) {
                        b = 1 === b ? a.print : a.printErr;
                        a: {
                            for (var l = (c = 0); e[l]; ) ++l;
                            if (16 < l - c && e.subarray && Ua) c = Ua.decode(e.subarray(c, l));
                            else
                                for (l = ""; ; ) {
                                    var d = e[c++];
                                    if (!d) {
                                        c = l;
                                        break a;
                                    }
                                    if (d & 128) {
                                        var g = e[c++] & 63;
                                        if (192 == (d & 224)) l += String.fromCharCode(((d & 31) << 6) | g);
                                        else {
                                            var h = e[c++] & 63;
                                            if (224 == (d & 240)) d = ((d & 15) << 12) | (g << 6) | h;
                                            else {
                                                var E = e[c++] & 63;
                                                if (240 == (d & 248)) d = ((d & 7) << 18) | (g << 12) | (h << 6) | E;
                                                else {
                                                    var k = e[c++] & 63;
                                                    if (248 == (d & 252)) d = ((d & 3) << 24) | (g << 18) | (h << 12) | (E << 6) | k;
                                                    else {
                                                        var ta = e[c++] & 63;
                                                        d = ((d & 1) << 30) | (g << 24) | (h << 18) | (E << 12) | (k << 6) | ta;
                                                    }
                                                }
                                            }
                                            65536 > d
                                                ? (l += String.fromCharCode(d))
                                                : ((d -= 65536), (l += String.fromCharCode(55296 | (d >> 10), 56320 | (d & 1023))));
                                        }
                                    } else l += String.fromCharCode(d);
                                }
                        }
                        b(c);
                        e.length = 0;
                    } else e.push(c);
                }));
            for (b = 0; b < d; b++) {
                for (var h = x[(l + 8 * b) >> 2], g = x[(l + (8 * b + 4)) >> 2], k = 0; k < g; k++) Q.printChar(c, T[h + k]);
                e += g;
            }
            return e;
        } catch (Ca) {
            return ("undefined" !== typeof FS && Ca instanceof FS.ErrnoError) || W(Ca), -Ca.errno;
        }
    }
    function ra(e, b) {
        ra.seen || (ra.seen = {});
        e in ra.seen || (a.dynCall_v(b), (ra.seen[e] = 1));
    }
    function ea(a) {
        this.name = "ExitStatus";
        this.message = "Program terminated with exit(" + a + ")";
        this.status = a;
    }
    function Da(e) {
        function b() {
            if (!a.calledRun && ((a.calledRun = !0), !ua)) {
                Va || ((Va = !0), u(Wa));
                u(Xa);
                if (a.onRuntimeInitialized) a.onRuntimeInitialized();
                if (a.postRun) for ("function" == typeof a.postRun && (a.postRun = [a.postRun]); a.postRun.length; ) Ya.unshift(a.postRun.shift());
                u(Ya);
            }
        }
        null === Za && (Za = Date.now());
        if (!(0 < ha)) {
            if (a.preRun) for ("function" == typeof a.preRun && (a.preRun = [a.preRun]); a.preRun.length; ) $a.unshift(a.preRun.shift());
            u($a);
            0 < ha ||
                a.calledRun ||
                (a.setStatus
                    ? (a.setStatus("Running..."),
                      setTimeout(function () {
                          setTimeout(function () {
                              a.setStatus("");
                          }, 1);
                          b();
                      }, 1))
                    : b());
        }
    }
    function W(e) {
        if (a.onAbort) a.onAbort(e);
        void 0 !== e ? (a.print(e), a.printErr(e), (e = JSON.stringify(e))) : (e = "");
        ua = !0;
        var b = "abort(" + e + ") at " + g() + "\nIf this abort() is unexpected, build with -s ASSERTIONS=1 which can give more information.";
        ab &&
            ab.forEach(function (a) {
                b = a(b, e);
            });
        throw b;
    }
    function p() {}
    function t(a) {
        return (a || p).__cache__;
    }
    function X(a, b) {
        var c = t(b),
            e = c[a];
        if (e) return e;
        e = Object.create((b || p).prototype);
        e.ptr = a;
        return (c[a] = e);
    }
    function Y(a) {
        if ("string" === typeof a) {
            for (var b = 0, c = 0; c < a.length; ++c) {
                var e = a.charCodeAt(c);
                55296 <= e && 57343 >= e && (e = (65536 + ((e & 1023) << 10)) | (a.charCodeAt(++c) & 1023));
                127 >= e ? ++b : (b = 2047 >= e ? b + 2 : 65535 >= e ? b + 3 : 2097151 >= e ? b + 4 : 67108863 >= e ? b + 5 : b + 6);
            }
            b = Array(b + 1);
            c = 0;
            e = b.length;
            if (0 < e) {
                e = c + e - 1;
                for (var d = 0; d < a.length; ++d) {
                    var f = a.charCodeAt(d);
                    55296 <= f && 57343 >= f && (f = (65536 + ((f & 1023) << 10)) | (a.charCodeAt(++d) & 1023));
                    if (127 >= f) {
                        if (c >= e) break;
                        b[c++] = f;
                    } else {
                        if (2047 >= f) {
                            if (c + 1 >= e) break;
                            b[c++] = 192 | (f >> 6);
                        } else {
                            if (65535 >= f) {
                                if (c + 2 >= e) break;
                                b[c++] = 224 | (f >> 12);
                            } else {
                                if (2097151 >= f) {
                                    if (c + 3 >= e) break;
                                    b[c++] = 240 | (f >> 18);
                                } else {
                                    if (67108863 >= f) {
                                        if (c + 4 >= e) break;
                                        b[c++] = 248 | (f >> 24);
                                    } else {
                                        if (c + 5 >= e) break;
                                        b[c++] = 252 | (f >> 30);
                                        b[c++] = 128 | ((f >> 24) & 63);
                                    }
                                    b[c++] = 128 | ((f >> 18) & 63);
                                }
                                b[c++] = 128 | ((f >> 12) & 63);
                            }
                            b[c++] = 128 | ((f >> 6) & 63);
                        }
                        b[c++] = 128 | (f & 63);
                    }
                }
                b[c] = 0;
            }
            a = k.alloc(b, fa);
            k.copy(b, fa, a);
        }
        return a;
    }
    function B() {
        throw "cannot construct a Status, no constructor in IDL";
    }
    function G() {
        this.ptr = lb();
        t(G)[this.ptr] = this;
    }
    function H() {
        this.ptr = mb();
        t(H)[this.ptr] = this;
    }
    function I() {
        this.ptr = nb();
        t(I)[this.ptr] = this;
    }
    function J() {
        this.ptr = ob();
        t(J)[this.ptr] = this;
    }
    function K() {
        this.ptr = pb();
        t(K)[this.ptr] = this;
    }
    function q() {
        this.ptr = qb();
        t(q)[this.ptr] = this;
    }
    function P() {
        this.ptr = rb();
        t(P)[this.ptr] = this;
    }
    function z() {
        this.ptr = sb();
        t(z)[this.ptr] = this;
    }
    function L() {
        this.ptr = tb();
        t(L)[this.ptr] = this;
    }
    function r() {
        this.ptr = ub();
        t(r)[this.ptr] = this;
    }
    function M() {
        this.ptr = vb();
        t(M)[this.ptr] = this;
    }
    function N() {
        this.ptr = wb();
        t(N)[this.ptr] = this;
    }
    function Z() {
        this.ptr = xb();
        t(Z)[this.ptr] = this;
    }
    function R() {
        this.ptr = yb();
        t(R)[this.ptr] = this;
    }
    function h() {
        this.ptr = zb();
        t(h)[this.ptr] = this;
    }
    function C() {
        this.ptr = Ab();
        t(C)[this.ptr] = this;
    }
    function ca() {
        throw "cannot construct a VoidPtr, no constructor in IDL";
    }
    function O() {
        this.ptr = Bb();
        t(O)[this.ptr] = this;
    }
    function S() {
        this.ptr = Cb();
        t(S)[this.ptr] = this;
    }
    var a = (d = d || {}),
        bb = !1,
        cb = !1;
    a.onRuntimeInitialized = function () {
        bb = !0;
        if (cb && "function" === typeof a.onModuleLoaded) a.onModuleLoaded(a);
    };
    a.onModuleParsed = function () {
        cb = !0;
        if (bb && "function" === typeof a.onModuleLoaded) a.onModuleLoaded(a);
    };
    a.isVersionSupported = function (a) {
        if ("string" !== typeof a) return !1;
        a = a.split(".");
        return 2 > a.length || 3 < a.length ? !1 : 1 == a[0] && 0 <= a[1] && 3 >= a[1] ? !0 : 0 != a[0] || 10 < a[1] ? !1 : !0;
    };
    a || (a = ("undefined" !== typeof d ? d : null) || {});
    var va = {},
        da;
    for (da in a) a.hasOwnProperty(da) && (va[da] = a[da]);
    var oa = !1,
        ka = !1,
        pa = !1,
        wa = !1;
    if (a.ENVIRONMENT)
        if ("WEB" === a.ENVIRONMENT) oa = !0;
        else if ("WORKER" === a.ENVIRONMENT) ka = !0;
        else if ("NODE" === a.ENVIRONMENT) pa = !0;
        else if ("SHELL" === a.ENVIRONMENT) wa = !0;
        else throw Error("The provided Module['ENVIRONMENT'] value is not valid. It must be one of: WEB|WORKER|NODE|SHELL.");
    else
        (oa = "object" === typeof window),
            (ka = "function" === typeof importScripts),
            (pa = "object" === typeof process && "function" === typeof require && !oa && !ka),
            (wa = !oa && !pa && !ka);
    if (pa) {
        a.print || (a.print = console.log);
        a.printErr || (a.printErr = console.warn);
        var Ea, Fa;
        a.read = function (a, b) {
            Ea || (Ea = require("fs"));
            Fa || (Fa = require("path"));
            a = Fa.normalize(a);
            a = Ea.readFileSync(a);
            return b ? a : a.toString();
        };
        a.readBinary = function (e) {
            e = a.read(e, !0);
            e.buffer || (e = new Uint8Array(e));
            f(e.buffer);
            return e;
        };
        a.thisProgram || (a.thisProgram = 1 < process.argv.length ? process.argv[1].replace(/\\/g, "/") : "unknown-program");
        a.arguments = process.argv.slice(2);
        process.on("uncaughtException", function (a) {
            if (!(a instanceof ea)) throw a;
        });
        a.inspect = function () {
            return "[Emscripten Module object]";
        };
    } else if (wa)
        a.print || (a.print = print),
            "undefined" != typeof printErr && (a.printErr = printErr),
            (a.read =
                "undefined" != typeof read
                    ? function (a) {
                          return read(a);
                      }
                    : function () {
                          throw "no read() available";
                      }),
            (a.readBinary = function (a) {
                if ("function" === typeof readbuffer) return new Uint8Array(readbuffer(a));
                a = read(a, "binary");
                f("object" === typeof a);
                return a;
            }),
            "undefined" != typeof scriptArgs ? (a.arguments = scriptArgs) : "undefined" != typeof arguments && (a.arguments = arguments),
            "function" === typeof quit &&
                (a.quit = function (a, b) {
                    quit(a);
                });
    else if (oa || ka)
        (a.read = function (a) {
            var b = new XMLHttpRequest();
            b.open("GET", a, !1);
            b.send(null);
            return b.responseText;
        }),
            ka &&
                (a.readBinary = function (a) {
                    var b = new XMLHttpRequest();
                    b.open("GET", a, !1);
                    b.responseType = "arraybuffer";
                    b.send(null);
                    return new Uint8Array(b.response);
                }),
            (a.readAsync = function (a, b, c) {
                var e = new XMLHttpRequest();
                e.open("GET", a, !0);
                e.responseType = "arraybuffer";
                e.onload = function () {
                    200 == e.status || (0 == e.status && e.response) ? b(e.response) : c();
                };
                e.onerror = c;
                e.send(null);
            }),
            "undefined" != typeof arguments && (a.arguments = arguments),
            "undefined" !== typeof console
                ? (a.print ||
                      (a.print = function (a) {
                          console.log(a);
                      }),
                  a.printErr ||
                      (a.printErr = function (a) {
                          console.warn(a);
                      }))
                : a.print || (a.print = function (a) {}),
            "undefined" === typeof a.setWindowTitle &&
                (a.setWindowTitle = function (a) {
                    document.title = a;
                });
    else throw Error("Unknown runtime environment. Where are we?");
    a.print || (a.print = function () {});
    a.printErr || (a.printErr = a.print);
    a.arguments || (a.arguments = []);
    a.thisProgram || (a.thisProgram = "./this.program");
    a.quit ||
        (a.quit = function (a, b) {
            throw b;
        });
    a.print = a.print;
    a.printErr = a.printErr;
    a.preRun = [];
    a.postRun = [];
    for (da in va) va.hasOwnProperty(da) && (a[da] = va[da]);
    va = void 0;
    var m = {
            setTempRet0: function (a) {
                return (tempRet0 = a);
            },
            getTempRet0: function () {
                return tempRet0;
            },
            stackSave: function () {
                return U;
            },
            stackRestore: function (a) {
                U = a;
            },
            getNativeTypeSize: function (a) {
                switch (a) {
                    case "i1":
                    case "i8":
                        return 1;
                    case "i16":
                        return 2;
                    case "i32":
                        return 4;
                    case "i64":
                        return 8;
                    case "float":
                        return 4;
                    case "double":
                        return 8;
                    default:
                        return "*" === a[a.length - 1] ? m.QUANTUM_SIZE : "i" === a[0] ? ((a = parseInt(a.substr(1))), f(0 === a % 8), a / 8) : 0;
                }
            },
            getNativeFieldSize: function (a) {
                return Math.max(m.getNativeTypeSize(a), m.QUANTUM_SIZE);
            },
            STACK_ALIGN: 16,
            prepVararg: function (a, b) {
                "double" === b || "i64" === b ? a & 7 && (f(4 === (a & 7)), (a += 4)) : f(0 === (a & 3));
                return a;
            },
            getAlignSize: function (a, b, c) {
                return c || ("i64" != a && "double" != a)
                    ? a
                        ? Math.min(b || (a ? m.getNativeFieldSize(a) : 0), m.QUANTUM_SIZE)
                        : Math.min(b, 8)
                    : 8;
            },
            dynCall: function (e, b, c) {
                return c && c.length ? a["dynCall_" + e].apply(null, [b].concat(c)) : a["dynCall_" + e].call(null, b);
            },
            functionPointers: [],
            addFunction: function (a) {
                for (var b = 0; b < m.functionPointers.length; b++) if (!m.functionPointers[b]) return (m.functionPointers[b] = a), 2 * (1 + b);
                throw "Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS.";
            },
            removeFunction: function (a) {
                m.functionPointers[(a - 2) / 2] = null;
            },
            warnOnce: function (e) {
                m.warnOnce.shown || (m.warnOnce.shown = {});
                m.warnOnce.shown[e] || ((m.warnOnce.shown[e] = 1), a.printErr(e));
            },
            funcWrappers: {},
            getFuncWrapper: function (a, b) {
                if (a) {
                    f(b);
                    m.funcWrappers[b] || (m.funcWrappers[b] = {});
                    var c = m.funcWrappers[b];
                    c[a] ||
                        (c[a] =
                            1 === b.length
                                ? function () {
                                      return m.dynCall(b, a);
                                  }
                                : 2 === b.length
                                ? function (c) {
                                      return m.dynCall(b, a, [c]);
                                  }
                                : function () {
                                      return m.dynCall(b, a, Array.prototype.slice.call(arguments));
                                  });
                    return c[a];
                }
            },
            getCompilerSetting: function (a) {
                throw "You must build with -s RETAIN_COMPILER_SETTINGS=1 for Runtime.getCompilerSetting or emscripten_get_compiler_setting to work";
            },
            stackAlloc: function (a) {
                var b = U;
                U = (U + a) | 0;
                U = (U + 15) & -16;
                return b;
            },
            staticAlloc: function (a) {
                var b = aa;
                aa = (aa + a) | 0;
                aa = (aa + 15) & -16;
                return b;
            },
            dynamicAlloc: function (a) {
                var b = x[ba >> 2];
                a = ((b + a + 15) | 0) & -16;
                x[ba >> 2] = a;
                return a >= y && !Ma() ? ((x[ba >> 2] = b), 0) : b;
            },
            alignMemory: function (a, b) {
                return Math.ceil(a / (b ? b : 16)) * (b ? b : 16);
            },
            makeBigInt: function (a, b, c) {
                return c ? +(a >>> 0) + 4294967296 * +(b >>> 0) : +(a >>> 0) + 4294967296 * +(b | 0);
            },
            GLOBAL_BASE: 1024,
            QUANTUM_SIZE: 4,
            __dummy__: 0,
        },
        ua = 0,
        Ua = "undefined" !== typeof TextDecoder ? new TextDecoder("utf8") : void 0;
    "undefined" !== typeof TextDecoder && new TextDecoder("utf-16le");
    var Aa = 65536,
        Sa = 16777216,
        ib = 16777216,
        fa,
        T,
        za,
        Oa,
        x,
        Pa,
        Qa,
        Ra,
        aa,
        Ga,
        U,
        xa,
        Ha,
        ba;
    var Ia = (aa = Ga = U = xa = Ha = ba = 0);
    a.reallocBuffer ||
        (a.reallocBuffer = function (a) {
            try {
                if (ArrayBuffer.transfer) var b = ArrayBuffer.transfer(F, a);
                else {
                    var c = fa;
                    b = new ArrayBuffer(a);
                    new Int8Array(b).set(c);
                }
            } catch (l) {
                return !1;
            }
            return Db(b) ? b : !1;
        });
    try {
        var Ja = Function.prototype.call.bind(Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, "byteLength").get);
        Ja(new ArrayBuffer(4));
    } catch (e) {
        Ja = function (a) {
            return a.byteLength;
        };
    }
    var Ka = a.TOTAL_STACK || 5242880,
        y = a.TOTAL_MEMORY || 16777216;
    y < Ka && a.printErr("TOTAL_MEMORY should be larger than TOTAL_STACK, was " + y + "! (TOTAL_STACK=" + Ka + ")");
    if (a.buffer) var F = a.buffer;
    else
        "object" === typeof WebAssembly && "function" === typeof WebAssembly.Memory
            ? ((a.wasmMemory = new WebAssembly.Memory({ initial: y / Aa })), (F = a.wasmMemory.buffer))
            : (F = new ArrayBuffer(y));
    D();
    x[0] = 1668509029;
    za[1] = 25459;
    if (115 !== T[2] || 99 !== T[3]) throw "Runtime error: expected the system to be little-endian!";
    a.HEAP = void 0;
    a.buffer = F;
    a.HEAP8 = fa;
    a.HEAP16 = za;
    a.HEAP32 = x;
    a.HEAPU8 = T;
    a.HEAPU16 = Oa;
    a.HEAPU32 = Pa;
    a.HEAPF32 = Qa;
    a.HEAPF64 = Ra;
    var $a = [],
        Wa = [],
        Xa = [],
        db = [],
        Ya = [],
        Va = !1;
    f(Math.imul && Math.fround && Math.clz32 && Math.trunc, "this is a legacy browser, build with LEGACY_VM_SUPPORT");
    var ha = 0,
        Ba = null,
        sa = null;
    a.preloadedImages = {};
    a.preloadedAudios = {};
    var V = null;
    (function () {
        function e() {
            try {
                if (a.wasmBinary) return new Uint8Array(a.wasmBinary);
                if (a.readBinary) return a.readBinary(d);
                throw "on the web, we need the wasm binary to be preloaded and set on Module['wasmBinary']. emcc.py will do that for you when generating HTML (but not JS)";
            } catch (jb) {
                W(jb);
            }
        }
        function b() {
            return a.wasmBinary || (!oa && !ka) || "function" !== typeof fetch
                ? new Promise(function (a, b) {
                      a(e());
                  })
                : fetch(d, { credentials: "same-origin" })
                      .then(function (a) {
                          if (!a.ok) throw "failed to load wasm binary file at '" + d + "'";
                          return a.arrayBuffer();
                      })
                      .catch(function () {
                          return e();
                      });
        }
        function c(c, e, l) {
            function f(b, c) {
                h = b.exports;
                if (h.memory) {
                    b = h.memory;
                    c = a.buffer;
                    b.byteLength < c.byteLength &&
                        a.printErr("the new buffer in mergeMemory is smaller than the previous one. in native wasm, we should grow memory here");
                    c = new Int8Array(c);
                    var e = new Int8Array(b);
                    V || c.set(e.subarray(a.STATIC_BASE, a.STATIC_BASE + a.STATIC_BUMP), a.STATIC_BASE);
                    e.set(c);
                    a.buffer = F = b;
                    D();
                }
                a.asm = h;
                a.usingWasm = !0;
                Na("wasm-instantiate");
            }
            function E(a) {
                f(a.instance, a.module);
            }
            function k(c) {
                b()
                    .then(function (a) {
                        return WebAssembly.instantiate(a, g);
                    })
                    .then(c)
                    .catch(function (b) {
                        a.printErr("failed to asynchronously prepare wasm: " + b);
                        W(b);
                    });
            }
            if ("object" !== typeof WebAssembly) return a.printErr("no native wasm support detected"), !1;
            if (!(a.wasmMemory instanceof WebAssembly.Memory)) return a.printErr("no native wasm Memory in use"), !1;
            e.memory = a.wasmMemory;
            g.global = { NaN: NaN, Infinity: Infinity };
            g["global.Math"] = c.Math;
            g.env = e;
            la("wasm-instantiate");
            if (a.instantiateWasm)
                try {
                    return a.instantiateWasm(g, f);
                } catch (kb) {
                    return a.printErr("Module.instantiateWasm callback failed with error: " + kb), !1;
                }
            a.wasmBinary || "function" !== typeof WebAssembly.instantiateStreaming || 0 === d.indexOf("data:") || "function" !== typeof fetch
                ? k(E)
                : WebAssembly.instantiateStreaming(fetch(d, { credentials: "same-origin" }), g)
                      .then(E)
                      .catch(function (b) {
                          a.printErr("wasm streaming compile failed: " + b);
                          a.printErr("falling back to ArrayBuffer instantiation");
                          k(E);
                      });
            return {};
        }
        var d = "draco_decoder.wasm",
            f = "draco_decoder.temp.asm.js";
        "function" === typeof a.locateFile && (a.locateFile("draco_decoder.wast"), (d = a.locateFile(d)), (f = a.locateFile(f)));
        var g = {
                global: null,
                env: null,
                asm2wasm: {
                    "f64-rem": function (a, b) {
                        return a % b;
                    },
                    debugger: function () {
                        debugger;
                    },
                },
                parent: a,
            },
            h = null;
        a.asmPreload = a.asm;
        var k = a.reallocBuffer;
        a.reallocBuffer = function (b) {
            if ("asmjs" === m) var c = k(b);
            else
                a: {
                    b = ma(b, a.usingWasm ? Aa : Sa);
                    var e = a.buffer.byteLength;
                    if (a.usingWasm)
                        try {
                            c = -1 !== a.wasmMemory.grow((b - e) / 65536) ? (a.buffer = a.wasmMemory.buffer) : null;
                            break a;
                        } catch (Jd) {
                            c = null;
                            break a;
                        }
                    c = void 0;
                }
            return c;
        };
        var m = "";
        a.asm = function (b, e, d) {
            if (!e.table) {
                var l = a.wasmTableSize;
                void 0 === l && (l = 1024);
                var f = a.wasmMaxTableSize;
                e.table =
                    "object" === typeof WebAssembly && "function" === typeof WebAssembly.Table
                        ? void 0 !== f
                            ? new WebAssembly.Table({ initial: l, maximum: f, element: "anyfunc" })
                            : new WebAssembly.Table({ initial: l, element: "anyfunc" })
                        : Array(l);
                a.wasmTable = e.table;
            }
            e.memoryBase || (e.memoryBase = a.STATIC_BASE);
            e.tableBase || (e.tableBase = 0);
            (b = c(b, e, d)) ||
                W(
                    "no binaryen method succeeded. consider enabling more options, like interpreting, if you want that: https://github.com/kripken/emscripten/wiki/WebAssembly#binaryen-methods",
                );
            return b;
        };
    })();
    Ia = m.GLOBAL_BASE;
    aa = Ia + 19104;
    Wa.push();
    V = null;
    a.STATIC_BASE = Ia;
    a.STATIC_BUMP = 19104;
    var Eb = aa;
    aa += 16;
    var A = {
            last: 0,
            caught: [],
            infos: {},
            deAdjust: function (a) {
                if (!a || A.infos[a]) return a;
                for (var b in A.infos) if (A.infos[b].adjusted === a) return b;
                return a;
            },
            addRef: function (a) {
                a && A.infos[a].refcount++;
            },
            decRef: function (e) {
                if (e) {
                    var b = A.infos[e];
                    f(0 < b.refcount);
                    b.refcount--;
                    0 !== b.refcount || b.rethrown || (b.destructor && a.dynCall_vi(b.destructor, e), delete A.infos[e], ___cxa_free_exception(e));
                }
            },
            clearRef: function (a) {
                a && (A.infos[a].refcount = 0);
            },
        },
        v = {
            varargs: 0,
            get: function (a) {
                v.varargs += 4;
                return x[(v.varargs - 4) >> 2];
            },
            getStr: function () {
                return n(v.get());
            },
            get64: function () {
                var a = v.get(),
                    b = v.get();
                0 <= a ? f(0 === b) : f(-1 === b);
                return a;
            },
            getZero: function () {
                f(0 === v.get());
            },
        },
        ya = {},
        La = 1;
    db.push(function () {
        var e = a._fflush;
        e && e(0);
        if ((e = Q.printChar)) {
            var b = Q.buffers;
            b[1].length && e(1, 10);
            b[2].length && e(2, 10);
        }
    });
    ba = m.staticAlloc(4);
    Ga = U = m.alignMemory(aa);
    xa = Ga + Ka;
    Ha = m.alignMemory(xa);
    x[ba >> 2] = Ha;
    a.wasmTableSize = 492;
    a.wasmMaxTableSize = 492;
    a.asmGlobalArg = {
        Math: Math,
        Int8Array: Int8Array,
        Int16Array: Int16Array,
        Int32Array: Int32Array,
        Uint8Array: Uint8Array,
        Uint16Array: Uint16Array,
        Uint32Array: Uint32Array,
        Float32Array: Float32Array,
        Float64Array: Float64Array,
        NaN: NaN,
        Infinity: Infinity,
        byteLength: Ja,
    };
    a.asmLibraryArg = {
        abort: W,
        assert: f,
        enlargeMemory: Ma,
        getTotalMemory: function () {
            return y;
        },
        abortOnCannotGrowMemory: function () {
            W(
                "Cannot enlarge memory arrays. Either (1) compile with  -s TOTAL_MEMORY=X  with X higher than the current value " +
                    y +
                    ", (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which allows increasing the size at runtime, or (3) if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 ",
            );
        },
        invoke_ii: function (e, b) {
            try {
                return a.dynCall_ii(e, b);
            } catch (c) {
                if ("number" !== typeof c && "longjmp" !== c) throw c;
                a.setThrew(1, 0);
            }
        },
        invoke_iii: function (e, b, c) {
            try {
                return a.dynCall_iii(e, b, c);
            } catch (l) {
                if ("number" !== typeof l && "longjmp" !== l) throw l;
                a.setThrew(1, 0);
            }
        },
        invoke_iiii: function (e, b, c, d) {
            try {
                return a.dynCall_iiii(e, b, c, d);
            } catch (E) {
                if ("number" !== typeof E && "longjmp" !== E) throw E;
                a.setThrew(1, 0);
            }
        },
        invoke_iiiiiii: function (e, b, c, d, f, g, h) {
            try {
                return a.dynCall_iiiiiii(e, b, c, d, f, g, h);
            } catch (ja) {
                if ("number" !== typeof ja && "longjmp" !== ja) throw ja;
                a.setThrew(1, 0);
            }
        },
        invoke_v: function (e) {
            try {
                a.dynCall_v(e);
            } catch (b) {
                if ("number" !== typeof b && "longjmp" !== b) throw b;
                a.setThrew(1, 0);
            }
        },
        invoke_vi: function (e, b) {
            try {
                a.dynCall_vi(e, b);
            } catch (c) {
                if ("number" !== typeof c && "longjmp" !== c) throw c;
                a.setThrew(1, 0);
            }
        },
        invoke_vii: function (e, b, c) {
            try {
                a.dynCall_vii(e, b, c);
            } catch (l) {
                if ("number" !== typeof l && "longjmp" !== l) throw l;
                a.setThrew(1, 0);
            }
        },
        invoke_viii: function (e, b, c, d) {
            try {
                a.dynCall_viii(e, b, c, d);
            } catch (E) {
                if ("number" !== typeof E && "longjmp" !== E) throw E;
                a.setThrew(1, 0);
            }
        },
        invoke_viiii: function (e, b, c, d, f) {
            try {
                a.dynCall_viiii(e, b, c, d, f);
            } catch (ta) {
                if ("number" !== typeof ta && "longjmp" !== ta) throw ta;
                a.setThrew(1, 0);
            }
        },
        invoke_viiiii: function (e, b, c, d, f, g) {
            try {
                a.dynCall_viiiii(e, b, c, d, f, g);
            } catch (ia) {
                if ("number" !== typeof ia && "longjmp" !== ia) throw ia;
                a.setThrew(1, 0);
            }
        },
        invoke_viiiiii: function (e, b, c, d, f, g, h) {
            try {
                a.dynCall_viiiiii(e, b, c, d, f, g, h);
            } catch (ja) {
                if ("number" !== typeof ja && "longjmp" !== ja) throw ja;
                a.setThrew(1, 0);
            }
        },
        __ZSt18uncaught_exceptionv: na,
        ___cxa_allocate_exception: function (a) {
            return Ta(a);
        },
        ___cxa_begin_catch: function (a) {
            var b = A.infos[a];
            b && !b.caught && ((b.caught = !0), na.uncaught_exception--);
            b && (b.rethrown = !1);
            A.caught.push(a);
            A.addRef(A.deAdjust(a));
            return a;
        },
        ___cxa_find_matching_catch: qa,
        ___cxa_pure_virtual: function () {
            ua = !0;
            throw "Pure virtual function called!";
        },
        ___cxa_throw: function (a, b, c) {
            A.infos[a] = { ptr: a, adjusted: a, type: b, destructor: c, refcount: 0, caught: !1, rethrown: !1 };
            A.last = a;
            "uncaught_exception" in na ? na.uncaught_exception++ : (na.uncaught_exception = 1);
            throw (
                a +
                " - Exception catching is disabled, this exception cannot be caught. Compile with -s DISABLE_EXCEPTION_CATCHING=0 or DISABLE_EXCEPTION_CATCHING=2 to catch."
            );
        },
        ___gxx_personality_v0: function () {},
        ___resumeException: function (a) {
            A.last || (A.last = a);
            throw (
                a +
                " - Exception catching is disabled, this exception cannot be caught. Compile with -s DISABLE_EXCEPTION_CATCHING=0 or DISABLE_EXCEPTION_CATCHING=2 to catch."
            );
        },
        ___setErrNo: function (e) {
            a.___errno_location && (x[a.___errno_location() >> 2] = e);
            return e;
        },
        ___syscall140: function (a, b) {
            v.varargs = b;
            try {
                var c = v.getStreamFromFD();
                v.get();
                var e = v.get(),
                    d = v.get(),
                    f = v.get();
                FS.llseek(c, e, f);
                x[d >> 2] = c.position;
                c.getdents && 0 === e && 0 === f && (c.getdents = null);
                return 0;
            } catch (ia) {
                return ("undefined" !== typeof FS && ia instanceof FS.ErrnoError) || W(ia), -ia.errno;
            }
        },
        ___syscall146: Q,
        ___syscall54: function (a, b) {
            v.varargs = b;
            return 0;
        },
        ___syscall6: function (a, b) {
            v.varargs = b;
            try {
                var c = v.getStreamFromFD();
                FS.close(c);
                return 0;
            } catch (l) {
                return ("undefined" !== typeof FS && l instanceof FS.ErrnoError) || W(l), -l.errno;
            }
        },
        _abort: function () {
            a.abort();
        },
        _emscripten_memcpy_big: function (a, b, c) {
            T.set(T.subarray(b, b + c), a);
            return a;
        },
        _pthread_getspecific: function (a) {
            return ya[a] || 0;
        },
        _pthread_key_create: function (a, b) {
            if (0 == a) return 22;
            x[a >> 2] = La;
            ya[La] = 0;
            La++;
            return 0;
        },
        _pthread_once: ra,
        _pthread_setspecific: function (a, b) {
            if (!(a in ya)) return 22;
            ya[a] = b;
            return 0;
        },
        DYNAMICTOP_PTR: ba,
        tempDoublePtr: Eb,
        ABORT: ua,
        STACKTOP: U,
        STACK_MAX: xa,
    };
    var eb = a.asm(a.asmGlobalArg, a.asmLibraryArg, F);
    a.asm = eb;
    a.___cxa_can_catch = function () {
        return a.asm.___cxa_can_catch.apply(null, arguments);
    };
    a.___cxa_is_pointer_type = function () {
        return a.asm.___cxa_is_pointer_type.apply(null, arguments);
    };
    var pb = (a._emscripten_bind_AttributeOctahedronTransform_AttributeOctahedronTransform_0 = function () {
            return a.asm._emscripten_bind_AttributeOctahedronTransform_AttributeOctahedronTransform_0.apply(null, arguments);
        }),
        Fb = (a._emscripten_bind_AttributeOctahedronTransform_InitFromAttribute_1 = function () {
            return a.asm._emscripten_bind_AttributeOctahedronTransform_InitFromAttribute_1.apply(null, arguments);
        }),
        Gb = (a._emscripten_bind_AttributeOctahedronTransform___destroy___0 = function () {
            return a.asm._emscripten_bind_AttributeOctahedronTransform___destroy___0.apply(null, arguments);
        }),
        Hb = (a._emscripten_bind_AttributeOctahedronTransform_quantization_bits_0 = function () {
            return a.asm._emscripten_bind_AttributeOctahedronTransform_quantization_bits_0.apply(null, arguments);
        }),
        sb = (a._emscripten_bind_AttributeQuantizationTransform_AttributeQuantizationTransform_0 = function () {
            return a.asm._emscripten_bind_AttributeQuantizationTransform_AttributeQuantizationTransform_0.apply(null, arguments);
        }),
        Ib = (a._emscripten_bind_AttributeQuantizationTransform_InitFromAttribute_1 = function () {
            return a.asm._emscripten_bind_AttributeQuantizationTransform_InitFromAttribute_1.apply(null, arguments);
        }),
        Jb = (a._emscripten_bind_AttributeQuantizationTransform___destroy___0 = function () {
            return a.asm._emscripten_bind_AttributeQuantizationTransform___destroy___0.apply(null, arguments);
        }),
        Kb = (a._emscripten_bind_AttributeQuantizationTransform_min_value_1 = function () {
            return a.asm._emscripten_bind_AttributeQuantizationTransform_min_value_1.apply(null, arguments);
        }),
        Lb = (a._emscripten_bind_AttributeQuantizationTransform_quantization_bits_0 = function () {
            return a.asm._emscripten_bind_AttributeQuantizationTransform_quantization_bits_0.apply(null, arguments);
        }),
        Mb = (a._emscripten_bind_AttributeQuantizationTransform_range_0 = function () {
            return a.asm._emscripten_bind_AttributeQuantizationTransform_range_0.apply(null, arguments);
        }),
        rb = (a._emscripten_bind_AttributeTransformData_AttributeTransformData_0 = function () {
            return a.asm._emscripten_bind_AttributeTransformData_AttributeTransformData_0.apply(null, arguments);
        }),
        Nb = (a._emscripten_bind_AttributeTransformData___destroy___0 = function () {
            return a.asm._emscripten_bind_AttributeTransformData___destroy___0.apply(null, arguments);
        }),
        Ob = (a._emscripten_bind_AttributeTransformData_transform_type_0 = function () {
            return a.asm._emscripten_bind_AttributeTransformData_transform_type_0.apply(null, arguments);
        }),
        yb = (a._emscripten_bind_DecoderBuffer_DecoderBuffer_0 = function () {
            return a.asm._emscripten_bind_DecoderBuffer_DecoderBuffer_0.apply(null, arguments);
        }),
        Pb = (a._emscripten_bind_DecoderBuffer_Init_2 = function () {
            return a.asm._emscripten_bind_DecoderBuffer_Init_2.apply(null, arguments);
        }),
        Qb = (a._emscripten_bind_DecoderBuffer___destroy___0 = function () {
            return a.asm._emscripten_bind_DecoderBuffer___destroy___0.apply(null, arguments);
        }),
        Rb = (a._emscripten_bind_Decoder_DecodeBufferToMesh_2 = function () {
            return a.asm._emscripten_bind_Decoder_DecodeBufferToMesh_2.apply(null, arguments);
        }),
        Sb = (a._emscripten_bind_Decoder_DecodeBufferToPointCloud_2 = function () {
            return a.asm._emscripten_bind_Decoder_DecodeBufferToPointCloud_2.apply(null, arguments);
        }),
        zb = (a._emscripten_bind_Decoder_Decoder_0 = function () {
            return a.asm._emscripten_bind_Decoder_Decoder_0.apply(null, arguments);
        }),
        Tb = (a._emscripten_bind_Decoder_GetAttributeByUniqueId_2 = function () {
            return a.asm._emscripten_bind_Decoder_GetAttributeByUniqueId_2.apply(null, arguments);
        }),
        Ub = (a._emscripten_bind_Decoder_GetAttributeFloatForAllPoints_3 = function () {
            return a.asm._emscripten_bind_Decoder_GetAttributeFloatForAllPoints_3.apply(null, arguments);
        }),
        Vb = (a._emscripten_bind_Decoder_GetAttributeFloat_3 = function () {
            return a.asm._emscripten_bind_Decoder_GetAttributeFloat_3.apply(null, arguments);
        }),
        Wb = (a._emscripten_bind_Decoder_GetAttributeIdByMetadataEntry_3 = function () {
            return a.asm._emscripten_bind_Decoder_GetAttributeIdByMetadataEntry_3.apply(null, arguments);
        }),
        Xb = (a._emscripten_bind_Decoder_GetAttributeIdByName_2 = function () {
            return a.asm._emscripten_bind_Decoder_GetAttributeIdByName_2.apply(null, arguments);
        }),
        Yb = (a._emscripten_bind_Decoder_GetAttributeId_2 = function () {
            return a.asm._emscripten_bind_Decoder_GetAttributeId_2.apply(null, arguments);
        }),
        Zb = (a._emscripten_bind_Decoder_GetAttributeInt16ForAllPoints_3 = function () {
            return a.asm._emscripten_bind_Decoder_GetAttributeInt16ForAllPoints_3.apply(null, arguments);
        }),
        $b = (a._emscripten_bind_Decoder_GetAttributeInt32ForAllPoints_3 = function () {
            return a.asm._emscripten_bind_Decoder_GetAttributeInt32ForAllPoints_3.apply(null, arguments);
        }),
        ac = (a._emscripten_bind_Decoder_GetAttributeInt8ForAllPoints_3 = function () {
            return a.asm._emscripten_bind_Decoder_GetAttributeInt8ForAllPoints_3.apply(null, arguments);
        }),
        bc = (a._emscripten_bind_Decoder_GetAttributeIntForAllPoints_3 = function () {
            return a.asm._emscripten_bind_Decoder_GetAttributeIntForAllPoints_3.apply(null, arguments);
        }),
        cc = (a._emscripten_bind_Decoder_GetAttributeMetadata_2 = function () {
            return a.asm._emscripten_bind_Decoder_GetAttributeMetadata_2.apply(null, arguments);
        }),
        dc = (a._emscripten_bind_Decoder_GetAttributeUInt16ForAllPoints_3 = function () {
            return a.asm._emscripten_bind_Decoder_GetAttributeUInt16ForAllPoints_3.apply(null, arguments);
        }),
        ec = (a._emscripten_bind_Decoder_GetAttributeUInt32ForAllPoints_3 = function () {
            return a.asm._emscripten_bind_Decoder_GetAttributeUInt32ForAllPoints_3.apply(null, arguments);
        }),
        fc = (a._emscripten_bind_Decoder_GetAttributeUInt8ForAllPoints_3 = function () {
            return a.asm._emscripten_bind_Decoder_GetAttributeUInt8ForAllPoints_3.apply(null, arguments);
        }),
        gc = (a._emscripten_bind_Decoder_GetAttribute_2 = function () {
            return a.asm._emscripten_bind_Decoder_GetAttribute_2.apply(null, arguments);
        }),
        hc = (a._emscripten_bind_Decoder_GetEncodedGeometryType_1 = function () {
            return a.asm._emscripten_bind_Decoder_GetEncodedGeometryType_1.apply(null, arguments);
        }),
        ic = (a._emscripten_bind_Decoder_GetFaceFromMesh_3 = function () {
            return a.asm._emscripten_bind_Decoder_GetFaceFromMesh_3.apply(null, arguments);
        }),
        jc = (a._emscripten_bind_Decoder_GetMetadata_1 = function () {
            return a.asm._emscripten_bind_Decoder_GetMetadata_1.apply(null, arguments);
        }),
        kc = (a._emscripten_bind_Decoder_GetTriangleStripsFromMesh_2 = function () {
            return a.asm._emscripten_bind_Decoder_GetTriangleStripsFromMesh_2.apply(null, arguments);
        }),
        lc = (a._emscripten_bind_Decoder_SkipAttributeTransform_1 = function () {
            return a.asm._emscripten_bind_Decoder_SkipAttributeTransform_1.apply(null, arguments);
        }),
        mc = (a._emscripten_bind_Decoder___destroy___0 = function () {
            return a.asm._emscripten_bind_Decoder___destroy___0.apply(null, arguments);
        }),
        wb = (a._emscripten_bind_DracoFloat32Array_DracoFloat32Array_0 = function () {
            return a.asm._emscripten_bind_DracoFloat32Array_DracoFloat32Array_0.apply(null, arguments);
        }),
        nc = (a._emscripten_bind_DracoFloat32Array_GetValue_1 = function () {
            return a.asm._emscripten_bind_DracoFloat32Array_GetValue_1.apply(null, arguments);
        }),
        oc = (a._emscripten_bind_DracoFloat32Array___destroy___0 = function () {
            return a.asm._emscripten_bind_DracoFloat32Array___destroy___0.apply(null, arguments);
        }),
        pc = (a._emscripten_bind_DracoFloat32Array_size_0 = function () {
            return a.asm._emscripten_bind_DracoFloat32Array_size_0.apply(null, arguments);
        }),
        vb = (a._emscripten_bind_DracoInt16Array_DracoInt16Array_0 = function () {
            return a.asm._emscripten_bind_DracoInt16Array_DracoInt16Array_0.apply(null, arguments);
        }),
        qc = (a._emscripten_bind_DracoInt16Array_GetValue_1 = function () {
            return a.asm._emscripten_bind_DracoInt16Array_GetValue_1.apply(null, arguments);
        }),
        rc = (a._emscripten_bind_DracoInt16Array___destroy___0 = function () {
            return a.asm._emscripten_bind_DracoInt16Array___destroy___0.apply(null, arguments);
        }),
        sc = (a._emscripten_bind_DracoInt16Array_size_0 = function () {
            return a.asm._emscripten_bind_DracoInt16Array_size_0.apply(null, arguments);
        }),
        Bb = (a._emscripten_bind_DracoInt32Array_DracoInt32Array_0 = function () {
            return a.asm._emscripten_bind_DracoInt32Array_DracoInt32Array_0.apply(null, arguments);
        }),
        tc = (a._emscripten_bind_DracoInt32Array_GetValue_1 = function () {
            return a.asm._emscripten_bind_DracoInt32Array_GetValue_1.apply(null, arguments);
        }),
        uc = (a._emscripten_bind_DracoInt32Array___destroy___0 = function () {
            return a.asm._emscripten_bind_DracoInt32Array___destroy___0.apply(null, arguments);
        }),
        vc = (a._emscripten_bind_DracoInt32Array_size_0 = function () {
            return a.asm._emscripten_bind_DracoInt32Array_size_0.apply(null, arguments);
        }),
        tb = (a._emscripten_bind_DracoInt8Array_DracoInt8Array_0 = function () {
            return a.asm._emscripten_bind_DracoInt8Array_DracoInt8Array_0.apply(null, arguments);
        }),
        wc = (a._emscripten_bind_DracoInt8Array_GetValue_1 = function () {
            return a.asm._emscripten_bind_DracoInt8Array_GetValue_1.apply(null, arguments);
        }),
        xc = (a._emscripten_bind_DracoInt8Array___destroy___0 = function () {
            return a.asm._emscripten_bind_DracoInt8Array___destroy___0.apply(null, arguments);
        }),
        yc = (a._emscripten_bind_DracoInt8Array_size_0 = function () {
            return a.asm._emscripten_bind_DracoInt8Array_size_0.apply(null, arguments);
        }),
        lb = (a._emscripten_bind_DracoUInt16Array_DracoUInt16Array_0 = function () {
            return a.asm._emscripten_bind_DracoUInt16Array_DracoUInt16Array_0.apply(null, arguments);
        }),
        zc = (a._emscripten_bind_DracoUInt16Array_GetValue_1 = function () {
            return a.asm._emscripten_bind_DracoUInt16Array_GetValue_1.apply(null, arguments);
        }),
        Ac = (a._emscripten_bind_DracoUInt16Array___destroy___0 = function () {
            return a.asm._emscripten_bind_DracoUInt16Array___destroy___0.apply(null, arguments);
        }),
        Bc = (a._emscripten_bind_DracoUInt16Array_size_0 = function () {
            return a.asm._emscripten_bind_DracoUInt16Array_size_0.apply(null, arguments);
        }),
        ob = (a._emscripten_bind_DracoUInt32Array_DracoUInt32Array_0 = function () {
            return a.asm._emscripten_bind_DracoUInt32Array_DracoUInt32Array_0.apply(null, arguments);
        }),
        Cc = (a._emscripten_bind_DracoUInt32Array_GetValue_1 = function () {
            return a.asm._emscripten_bind_DracoUInt32Array_GetValue_1.apply(null, arguments);
        }),
        Dc = (a._emscripten_bind_DracoUInt32Array___destroy___0 = function () {
            return a.asm._emscripten_bind_DracoUInt32Array___destroy___0.apply(null, arguments);
        }),
        Ec = (a._emscripten_bind_DracoUInt32Array_size_0 = function () {
            return a.asm._emscripten_bind_DracoUInt32Array_size_0.apply(null, arguments);
        }),
        nb = (a._emscripten_bind_DracoUInt8Array_DracoUInt8Array_0 = function () {
            return a.asm._emscripten_bind_DracoUInt8Array_DracoUInt8Array_0.apply(null, arguments);
        }),
        Fc = (a._emscripten_bind_DracoUInt8Array_GetValue_1 = function () {
            return a.asm._emscripten_bind_DracoUInt8Array_GetValue_1.apply(null, arguments);
        }),
        Gc = (a._emscripten_bind_DracoUInt8Array___destroy___0 = function () {
            return a.asm._emscripten_bind_DracoUInt8Array___destroy___0.apply(null, arguments);
        }),
        Hc = (a._emscripten_bind_DracoUInt8Array_size_0 = function () {
            return a.asm._emscripten_bind_DracoUInt8Array_size_0.apply(null, arguments);
        }),
        xb = (a._emscripten_bind_GeometryAttribute_GeometryAttribute_0 = function () {
            return a.asm._emscripten_bind_GeometryAttribute_GeometryAttribute_0.apply(null, arguments);
        }),
        Ic = (a._emscripten_bind_GeometryAttribute___destroy___0 = function () {
            return a.asm._emscripten_bind_GeometryAttribute___destroy___0.apply(null, arguments);
        }),
        Ab = (a._emscripten_bind_Mesh_Mesh_0 = function () {
            return a.asm._emscripten_bind_Mesh_Mesh_0.apply(null, arguments);
        }),
        Jc = (a._emscripten_bind_Mesh___destroy___0 = function () {
            return a.asm._emscripten_bind_Mesh___destroy___0.apply(null, arguments);
        }),
        Kc = (a._emscripten_bind_Mesh_num_attributes_0 = function () {
            return a.asm._emscripten_bind_Mesh_num_attributes_0.apply(null, arguments);
        }),
        Lc = (a._emscripten_bind_Mesh_num_faces_0 = function () {
            return a.asm._emscripten_bind_Mesh_num_faces_0.apply(null, arguments);
        }),
        Mc = (a._emscripten_bind_Mesh_num_points_0 = function () {
            return a.asm._emscripten_bind_Mesh_num_points_0.apply(null, arguments);
        }),
        Nc = (a._emscripten_bind_MetadataQuerier_GetDoubleEntry_2 = function () {
            return a.asm._emscripten_bind_MetadataQuerier_GetDoubleEntry_2.apply(null, arguments);
        }),
        Oc = (a._emscripten_bind_MetadataQuerier_GetEntryName_2 = function () {
            return a.asm._emscripten_bind_MetadataQuerier_GetEntryName_2.apply(null, arguments);
        }),
        Pc = (a._emscripten_bind_MetadataQuerier_GetIntEntry_2 = function () {
            return a.asm._emscripten_bind_MetadataQuerier_GetIntEntry_2.apply(null, arguments);
        }),
        Qc = (a._emscripten_bind_MetadataQuerier_GetStringEntry_2 = function () {
            return a.asm._emscripten_bind_MetadataQuerier_GetStringEntry_2.apply(null, arguments);
        }),
        Rc = (a._emscripten_bind_MetadataQuerier_HasDoubleEntry_2 = function () {
            return a.asm._emscripten_bind_MetadataQuerier_HasDoubleEntry_2.apply(null, arguments);
        }),
        Sc = (a._emscripten_bind_MetadataQuerier_HasEntry_2 = function () {
            return a.asm._emscripten_bind_MetadataQuerier_HasEntry_2.apply(null, arguments);
        }),
        Tc = (a._emscripten_bind_MetadataQuerier_HasIntEntry_2 = function () {
            return a.asm._emscripten_bind_MetadataQuerier_HasIntEntry_2.apply(null, arguments);
        }),
        Uc = (a._emscripten_bind_MetadataQuerier_HasStringEntry_2 = function () {
            return a.asm._emscripten_bind_MetadataQuerier_HasStringEntry_2.apply(null, arguments);
        }),
        ub = (a._emscripten_bind_MetadataQuerier_MetadataQuerier_0 = function () {
            return a.asm._emscripten_bind_MetadataQuerier_MetadataQuerier_0.apply(null, arguments);
        }),
        Vc = (a._emscripten_bind_MetadataQuerier_NumEntries_1 = function () {
            return a.asm._emscripten_bind_MetadataQuerier_NumEntries_1.apply(null, arguments);
        }),
        Wc = (a._emscripten_bind_MetadataQuerier___destroy___0 = function () {
            return a.asm._emscripten_bind_MetadataQuerier___destroy___0.apply(null, arguments);
        }),
        Cb = (a._emscripten_bind_Metadata_Metadata_0 = function () {
            return a.asm._emscripten_bind_Metadata_Metadata_0.apply(null, arguments);
        }),
        Xc = (a._emscripten_bind_Metadata___destroy___0 = function () {
            return a.asm._emscripten_bind_Metadata___destroy___0.apply(null, arguments);
        }),
        Yc = (a._emscripten_bind_PointAttribute_GetAttributeTransformData_0 = function () {
            return a.asm._emscripten_bind_PointAttribute_GetAttributeTransformData_0.apply(null, arguments);
        }),
        qb = (a._emscripten_bind_PointAttribute_PointAttribute_0 = function () {
            return a.asm._emscripten_bind_PointAttribute_PointAttribute_0.apply(null, arguments);
        }),
        Zc = (a._emscripten_bind_PointAttribute___destroy___0 = function () {
            return a.asm._emscripten_bind_PointAttribute___destroy___0.apply(null, arguments);
        }),
        $c = (a._emscripten_bind_PointAttribute_attribute_type_0 = function () {
            return a.asm._emscripten_bind_PointAttribute_attribute_type_0.apply(null, arguments);
        }),
        ad = (a._emscripten_bind_PointAttribute_byte_offset_0 = function () {
            return a.asm._emscripten_bind_PointAttribute_byte_offset_0.apply(null, arguments);
        }),
        bd = (a._emscripten_bind_PointAttribute_byte_stride_0 = function () {
            return a.asm._emscripten_bind_PointAttribute_byte_stride_0.apply(null, arguments);
        }),
        cd = (a._emscripten_bind_PointAttribute_data_type_0 = function () {
            return a.asm._emscripten_bind_PointAttribute_data_type_0.apply(null, arguments);
        }),
        dd = (a._emscripten_bind_PointAttribute_normalized_0 = function () {
            return a.asm._emscripten_bind_PointAttribute_normalized_0.apply(null, arguments);
        }),
        ed = (a._emscripten_bind_PointAttribute_num_components_0 = function () {
            return a.asm._emscripten_bind_PointAttribute_num_components_0.apply(null, arguments);
        }),
        fd = (a._emscripten_bind_PointAttribute_size_0 = function () {
            return a.asm._emscripten_bind_PointAttribute_size_0.apply(null, arguments);
        }),
        gd = (a._emscripten_bind_PointAttribute_unique_id_0 = function () {
            return a.asm._emscripten_bind_PointAttribute_unique_id_0.apply(null, arguments);
        }),
        mb = (a._emscripten_bind_PointCloud_PointCloud_0 = function () {
            return a.asm._emscripten_bind_PointCloud_PointCloud_0.apply(null, arguments);
        }),
        hd = (a._emscripten_bind_PointCloud___destroy___0 = function () {
            return a.asm._emscripten_bind_PointCloud___destroy___0.apply(null, arguments);
        }),
        id = (a._emscripten_bind_PointCloud_num_attributes_0 = function () {
            return a.asm._emscripten_bind_PointCloud_num_attributes_0.apply(null, arguments);
        }),
        jd = (a._emscripten_bind_PointCloud_num_points_0 = function () {
            return a.asm._emscripten_bind_PointCloud_num_points_0.apply(null, arguments);
        }),
        kd = (a._emscripten_bind_Status___destroy___0 = function () {
            return a.asm._emscripten_bind_Status___destroy___0.apply(null, arguments);
        }),
        ld = (a._emscripten_bind_Status_code_0 = function () {
            return a.asm._emscripten_bind_Status_code_0.apply(null, arguments);
        }),
        md = (a._emscripten_bind_Status_error_msg_0 = function () {
            return a.asm._emscripten_bind_Status_error_msg_0.apply(null, arguments);
        }),
        nd = (a._emscripten_bind_Status_ok_0 = function () {
            return a.asm._emscripten_bind_Status_ok_0.apply(null, arguments);
        }),
        od = (a._emscripten_bind_VoidPtr___destroy___0 = function () {
            return a.asm._emscripten_bind_VoidPtr___destroy___0.apply(null, arguments);
        }),
        pd = (a._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_INVALID_TRANSFORM = function () {
            return a.asm._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_INVALID_TRANSFORM.apply(null, arguments);
        }),
        qd = (a._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_NO_TRANSFORM = function () {
            return a.asm._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_NO_TRANSFORM.apply(null, arguments);
        }),
        rd = (a._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_OCTAHEDRON_TRANSFORM = function () {
            return a.asm._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_OCTAHEDRON_TRANSFORM.apply(null, arguments);
        }),
        sd = (a._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_QUANTIZATION_TRANSFORM = function () {
            return a.asm._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_QUANTIZATION_TRANSFORM.apply(null, arguments);
        }),
        td = (a._emscripten_enum_draco_EncodedGeometryType_INVALID_GEOMETRY_TYPE = function () {
            return a.asm._emscripten_enum_draco_EncodedGeometryType_INVALID_GEOMETRY_TYPE.apply(null, arguments);
        }),
        ud = (a._emscripten_enum_draco_EncodedGeometryType_POINT_CLOUD = function () {
            return a.asm._emscripten_enum_draco_EncodedGeometryType_POINT_CLOUD.apply(null, arguments);
        }),
        vd = (a._emscripten_enum_draco_EncodedGeometryType_TRIANGULAR_MESH = function () {
            return a.asm._emscripten_enum_draco_EncodedGeometryType_TRIANGULAR_MESH.apply(null, arguments);
        }),
        wd = (a._emscripten_enum_draco_GeometryAttribute_Type_COLOR = function () {
            return a.asm._emscripten_enum_draco_GeometryAttribute_Type_COLOR.apply(null, arguments);
        }),
        xd = (a._emscripten_enum_draco_GeometryAttribute_Type_GENERIC = function () {
            return a.asm._emscripten_enum_draco_GeometryAttribute_Type_GENERIC.apply(null, arguments);
        }),
        yd = (a._emscripten_enum_draco_GeometryAttribute_Type_INVALID = function () {
            return a.asm._emscripten_enum_draco_GeometryAttribute_Type_INVALID.apply(null, arguments);
        }),
        zd = (a._emscripten_enum_draco_GeometryAttribute_Type_NORMAL = function () {
            return a.asm._emscripten_enum_draco_GeometryAttribute_Type_NORMAL.apply(null, arguments);
        }),
        Ad = (a._emscripten_enum_draco_GeometryAttribute_Type_POSITION = function () {
            return a.asm._emscripten_enum_draco_GeometryAttribute_Type_POSITION.apply(null, arguments);
        }),
        Bd = (a._emscripten_enum_draco_GeometryAttribute_Type_TEX_COORD = function () {
            return a.asm._emscripten_enum_draco_GeometryAttribute_Type_TEX_COORD.apply(null, arguments);
        }),
        Cd = (a._emscripten_enum_draco_StatusCode_ERROR = function () {
            return a.asm._emscripten_enum_draco_StatusCode_ERROR.apply(null, arguments);
        }),
        Dd = (a._emscripten_enum_draco_StatusCode_INVALID_PARAMETER = function () {
            return a.asm._emscripten_enum_draco_StatusCode_INVALID_PARAMETER.apply(null, arguments);
        }),
        Ed = (a._emscripten_enum_draco_StatusCode_IO_ERROR = function () {
            return a.asm._emscripten_enum_draco_StatusCode_IO_ERROR.apply(null, arguments);
        }),
        Fd = (a._emscripten_enum_draco_StatusCode_OK = function () {
            return a.asm._emscripten_enum_draco_StatusCode_OK.apply(null, arguments);
        }),
        Gd = (a._emscripten_enum_draco_StatusCode_UNKNOWN_VERSION = function () {
            return a.asm._emscripten_enum_draco_StatusCode_UNKNOWN_VERSION.apply(null, arguments);
        }),
        Hd = (a._emscripten_enum_draco_StatusCode_UNSUPPORTED_VERSION = function () {
            return a.asm._emscripten_enum_draco_StatusCode_UNSUPPORTED_VERSION.apply(null, arguments);
        });
    a._emscripten_get_global_libc = function () {
        return a.asm._emscripten_get_global_libc.apply(null, arguments);
    };
    var Db = (a._emscripten_replace_memory = function () {
        return a.asm._emscripten_replace_memory.apply(null, arguments);
    });
    a._free = function () {
        return a.asm._free.apply(null, arguments);
    };
    a._llvm_bswap_i32 = function () {
        return a.asm._llvm_bswap_i32.apply(null, arguments);
    };
    var Ta = (a._malloc = function () {
        return a.asm._malloc.apply(null, arguments);
    });
    a._memcpy = function () {
        return a.asm._memcpy.apply(null, arguments);
    };
    a._memmove = function () {
        return a.asm._memmove.apply(null, arguments);
    };
    a._memset = function () {
        return a.asm._memset.apply(null, arguments);
    };
    a._sbrk = function () {
        return a.asm._sbrk.apply(null, arguments);
    };
    a.establishStackSpace = function () {
        return a.asm.establishStackSpace.apply(null, arguments);
    };
    a.getTempRet0 = function () {
        return a.asm.getTempRet0.apply(null, arguments);
    };
    a.runPostSets = function () {
        return a.asm.runPostSets.apply(null, arguments);
    };
    a.setTempRet0 = function () {
        return a.asm.setTempRet0.apply(null, arguments);
    };
    a.setThrew = function () {
        return a.asm.setThrew.apply(null, arguments);
    };
    a.stackAlloc = function () {
        return a.asm.stackAlloc.apply(null, arguments);
    };
    a.stackRestore = function () {
        return a.asm.stackRestore.apply(null, arguments);
    };
    a.stackSave = function () {
        return a.asm.stackSave.apply(null, arguments);
    };
    a.dynCall_ii = function () {
        return a.asm.dynCall_ii.apply(null, arguments);
    };
    a.dynCall_iii = function () {
        return a.asm.dynCall_iii.apply(null, arguments);
    };
    a.dynCall_iiii = function () {
        return a.asm.dynCall_iiii.apply(null, arguments);
    };
    a.dynCall_iiiiiii = function () {
        return a.asm.dynCall_iiiiiii.apply(null, arguments);
    };
    a.dynCall_v = function () {
        return a.asm.dynCall_v.apply(null, arguments);
    };
    a.dynCall_vi = function () {
        return a.asm.dynCall_vi.apply(null, arguments);
    };
    a.dynCall_vii = function () {
        return a.asm.dynCall_vii.apply(null, arguments);
    };
    a.dynCall_viii = function () {
        return a.asm.dynCall_viii.apply(null, arguments);
    };
    a.dynCall_viiii = function () {
        return a.asm.dynCall_viiii.apply(null, arguments);
    };
    a.dynCall_viiiii = function () {
        return a.asm.dynCall_viiiii.apply(null, arguments);
    };
    a.dynCall_viiiiii = function () {
        return a.asm.dynCall_viiiiii.apply(null, arguments);
    };
    m.stackAlloc = a.stackAlloc;
    m.stackSave = a.stackSave;
    m.stackRestore = a.stackRestore;
    m.establishStackSpace = a.establishStackSpace;
    m.setTempRet0 = a.setTempRet0;
    m.getTempRet0 = a.getTempRet0;
    a.asm = eb;
    if (V)
        if (
            ("function" === typeof a.locateFile ? (V = a.locateFile(V)) : a.memoryInitializerPrefixURL && (V = a.memoryInitializerPrefixURL + V),
            pa || wa)
        ) {
            var Id = a.readBinary(V);
            T.set(Id, m.GLOBAL_BASE);
        } else {
            var gb = function () {
                a.readAsync(V, fb, function () {
                    throw "could not load memory initializer " + V;
                });
            };
            la("memory initializer");
            var fb = function (d) {
                d.byteLength && (d = new Uint8Array(d));
                T.set(d, m.GLOBAL_BASE);
                a.memoryInitializerRequest && delete a.memoryInitializerRequest.response;
                Na("memory initializer");
            };
            if (a.memoryInitializerRequest) {
                var hb = function () {
                    var d = a.memoryInitializerRequest,
                        b = d.response;
                    200 !== d.status && 0 !== d.status
                        ? (console.warn(
                              "a problem seems to have happened with Module.memoryInitializerRequest, status: " + d.status + ", retrying " + V,
                          ),
                          gb())
                        : fb(b);
                };
                a.memoryInitializerRequest.response ? setTimeout(hb, 0) : a.memoryInitializerRequest.addEventListener("load", hb);
            } else gb();
        }
    a.then = function (d) {
        if (a.calledRun) d(a);
        else {
            var b = a.onRuntimeInitialized;
            a.onRuntimeInitialized = function () {
                b && b();
                d(a);
            };
        }
        return a;
    };
    ea.prototype = Error();
    ea.prototype.constructor = ea;
    var Za = null;
    sa = function b() {
        a.calledRun || Da();
        a.calledRun || (sa = b);
    };
    a.run = Da;
    a.exit = function (b, c) {
        if (!c || !a.noExitRuntime) {
            if (!a.noExitRuntime && ((ua = !0), (U = void 0), u(db), a.onExit)) a.onExit(b);
            pa && process.exit(b);
            a.quit(b, new ea(b));
        }
    };
    var ab = [];
    a.abort = W;
    if (a.preInit) for ("function" == typeof a.preInit && (a.preInit = [a.preInit]); 0 < a.preInit.length; ) a.preInit.pop()();
    Da();
    p.prototype = Object.create(p.prototype);
    p.prototype.constructor = p;
    p.prototype.__class__ = p;
    p.__cache__ = {};
    a.WrapperObject = p;
    a.getCache = t;
    a.wrapPointer = X;
    a.castObject = function (a, c) {
        return X(a.ptr, c);
    };
    a.NULL = X(0);
    a.destroy = function (a) {
        if (!a.__destroy__) throw "Error: Cannot destroy object. (Did you create it yourself?)";
        a.__destroy__();
        delete t(a.__class__)[a.ptr];
    };
    a.compare = function (a, c) {
        return a.ptr === c.ptr;
    };
    a.getPointer = function (a) {
        return a.ptr;
    };
    a.getClass = function (a) {
        return a.__class__;
    };
    var k = {
        buffer: 0,
        size: 0,
        pos: 0,
        temps: [],
        needed: 0,
        prepare: function () {
            if (k.needed) {
                for (var b = 0; b < k.temps.length; b++) a._free(k.temps[b]);
                k.temps.length = 0;
                a._free(k.buffer);
                k.buffer = 0;
                k.size += k.needed;
                k.needed = 0;
            }
            k.buffer || ((k.size += 128), (k.buffer = a._malloc(k.size)), f(k.buffer));
            k.pos = 0;
        },
        alloc: function (b, c) {
            f(k.buffer);
            b = b.length * c.BYTES_PER_ELEMENT;
            b = (b + 7) & -8;
            k.pos + b >= k.size ? (f(0 < b), (k.needed += b), (c = a._malloc(b)), k.temps.push(c)) : ((c = k.buffer + k.pos), (k.pos += b));
            return c;
        },
        copy: function (a, c, d) {
            switch (c.BYTES_PER_ELEMENT) {
                case 2:
                    d >>= 1;
                    break;
                case 4:
                    d >>= 2;
                    break;
                case 8:
                    d >>= 3;
            }
            for (var b = 0; b < a.length; b++) c[d + b] = a[b];
        },
    };
    B.prototype = Object.create(p.prototype);
    B.prototype.constructor = B;
    B.prototype.__class__ = B;
    B.__cache__ = {};
    a.Status = B;
    B.prototype.code = B.prototype.code = function () {
        return ld(this.ptr);
    };
    B.prototype.ok = B.prototype.ok = function () {
        return !!nd(this.ptr);
    };
    B.prototype.error_msg = B.prototype.error_msg = function () {
        return n(md(this.ptr));
    };
    B.prototype.__destroy__ = B.prototype.__destroy__ = function () {
        kd(this.ptr);
    };
    G.prototype = Object.create(p.prototype);
    G.prototype.constructor = G;
    G.prototype.__class__ = G;
    G.__cache__ = {};
    a.DracoUInt16Array = G;
    G.prototype.GetValue = G.prototype.GetValue = function (a) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        return zc(b, a);
    };
    G.prototype.size = G.prototype.size = function () {
        return Bc(this.ptr);
    };
    G.prototype.__destroy__ = G.prototype.__destroy__ = function () {
        Ac(this.ptr);
    };
    H.prototype = Object.create(p.prototype);
    H.prototype.constructor = H;
    H.prototype.__class__ = H;
    H.__cache__ = {};
    a.PointCloud = H;
    H.prototype.num_attributes = H.prototype.num_attributes = function () {
        return id(this.ptr);
    };
    H.prototype.num_points = H.prototype.num_points = function () {
        return jd(this.ptr);
    };
    H.prototype.__destroy__ = H.prototype.__destroy__ = function () {
        hd(this.ptr);
    };
    I.prototype = Object.create(p.prototype);
    I.prototype.constructor = I;
    I.prototype.__class__ = I;
    I.__cache__ = {};
    a.DracoUInt8Array = I;
    I.prototype.GetValue = I.prototype.GetValue = function (a) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        return Fc(b, a);
    };
    I.prototype.size = I.prototype.size = function () {
        return Hc(this.ptr);
    };
    I.prototype.__destroy__ = I.prototype.__destroy__ = function () {
        Gc(this.ptr);
    };
    J.prototype = Object.create(p.prototype);
    J.prototype.constructor = J;
    J.prototype.__class__ = J;
    J.__cache__ = {};
    a.DracoUInt32Array = J;
    J.prototype.GetValue = J.prototype.GetValue = function (a) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        return Cc(b, a);
    };
    J.prototype.size = J.prototype.size = function () {
        return Ec(this.ptr);
    };
    J.prototype.__destroy__ = J.prototype.__destroy__ = function () {
        Dc(this.ptr);
    };
    K.prototype = Object.create(p.prototype);
    K.prototype.constructor = K;
    K.prototype.__class__ = K;
    K.__cache__ = {};
    a.AttributeOctahedronTransform = K;
    K.prototype.InitFromAttribute = K.prototype.InitFromAttribute = function (a) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        return !!Fb(b, a);
    };
    K.prototype.quantization_bits = K.prototype.quantization_bits = function () {
        return Hb(this.ptr);
    };
    K.prototype.__destroy__ = K.prototype.__destroy__ = function () {
        Gb(this.ptr);
    };
    q.prototype = Object.create(p.prototype);
    q.prototype.constructor = q;
    q.prototype.__class__ = q;
    q.__cache__ = {};
    a.PointAttribute = q;
    q.prototype.size = q.prototype.size = function () {
        return fd(this.ptr);
    };
    q.prototype.GetAttributeTransformData = q.prototype.GetAttributeTransformData = function () {
        return X(Yc(this.ptr), P);
    };
    q.prototype.attribute_type = q.prototype.attribute_type = function () {
        return $c(this.ptr);
    };
    q.prototype.data_type = q.prototype.data_type = function () {
        return cd(this.ptr);
    };
    q.prototype.num_components = q.prototype.num_components = function () {
        return ed(this.ptr);
    };
    q.prototype.normalized = q.prototype.normalized = function () {
        return !!dd(this.ptr);
    };
    q.prototype.byte_stride = q.prototype.byte_stride = function () {
        return bd(this.ptr);
    };
    q.prototype.byte_offset = q.prototype.byte_offset = function () {
        return ad(this.ptr);
    };
    q.prototype.unique_id = q.prototype.unique_id = function () {
        return gd(this.ptr);
    };
    q.prototype.__destroy__ = q.prototype.__destroy__ = function () {
        Zc(this.ptr);
    };
    P.prototype = Object.create(p.prototype);
    P.prototype.constructor = P;
    P.prototype.__class__ = P;
    P.__cache__ = {};
    a.AttributeTransformData = P;
    P.prototype.transform_type = P.prototype.transform_type = function () {
        return Ob(this.ptr);
    };
    P.prototype.__destroy__ = P.prototype.__destroy__ = function () {
        Nb(this.ptr);
    };
    z.prototype = Object.create(p.prototype);
    z.prototype.constructor = z;
    z.prototype.__class__ = z;
    z.__cache__ = {};
    a.AttributeQuantizationTransform = z;
    z.prototype.InitFromAttribute = z.prototype.InitFromAttribute = function (a) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        return !!Ib(b, a);
    };
    z.prototype.quantization_bits = z.prototype.quantization_bits = function () {
        return Lb(this.ptr);
    };
    z.prototype.min_value = z.prototype.min_value = function (a) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        return Kb(b, a);
    };
    z.prototype.range = z.prototype.range = function () {
        return Mb(this.ptr);
    };
    z.prototype.__destroy__ = z.prototype.__destroy__ = function () {
        Jb(this.ptr);
    };
    L.prototype = Object.create(p.prototype);
    L.prototype.constructor = L;
    L.prototype.__class__ = L;
    L.__cache__ = {};
    a.DracoInt8Array = L;
    L.prototype.GetValue = L.prototype.GetValue = function (a) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        return wc(b, a);
    };
    L.prototype.size = L.prototype.size = function () {
        return yc(this.ptr);
    };
    L.prototype.__destroy__ = L.prototype.__destroy__ = function () {
        xc(this.ptr);
    };
    r.prototype = Object.create(p.prototype);
    r.prototype.constructor = r;
    r.prototype.__class__ = r;
    r.__cache__ = {};
    a.MetadataQuerier = r;
    r.prototype.HasEntry = r.prototype.HasEntry = function (a, c) {
        var b = this.ptr;
        k.prepare();
        a && "object" === typeof a && (a = a.ptr);
        c = c && "object" === typeof c ? c.ptr : Y(c);
        return !!Sc(b, a, c);
    };
    r.prototype.HasIntEntry = r.prototype.HasIntEntry = function (a, c) {
        var b = this.ptr;
        k.prepare();
        a && "object" === typeof a && (a = a.ptr);
        c = c && "object" === typeof c ? c.ptr : Y(c);
        return !!Tc(b, a, c);
    };
    r.prototype.GetIntEntry = r.prototype.GetIntEntry = function (a, c) {
        var b = this.ptr;
        k.prepare();
        a && "object" === typeof a && (a = a.ptr);
        c = c && "object" === typeof c ? c.ptr : Y(c);
        return Pc(b, a, c);
    };
    r.prototype.HasDoubleEntry = r.prototype.HasDoubleEntry = function (a, c) {
        var b = this.ptr;
        k.prepare();
        a && "object" === typeof a && (a = a.ptr);
        c = c && "object" === typeof c ? c.ptr : Y(c);
        return !!Rc(b, a, c);
    };
    r.prototype.GetDoubleEntry = r.prototype.GetDoubleEntry = function (a, c) {
        var b = this.ptr;
        k.prepare();
        a && "object" === typeof a && (a = a.ptr);
        c = c && "object" === typeof c ? c.ptr : Y(c);
        return Nc(b, a, c);
    };
    r.prototype.HasStringEntry = r.prototype.HasStringEntry = function (a, c) {
        var b = this.ptr;
        k.prepare();
        a && "object" === typeof a && (a = a.ptr);
        c = c && "object" === typeof c ? c.ptr : Y(c);
        return !!Uc(b, a, c);
    };
    r.prototype.GetStringEntry = r.prototype.GetStringEntry = function (a, c) {
        var b = this.ptr;
        k.prepare();
        a && "object" === typeof a && (a = a.ptr);
        c = c && "object" === typeof c ? c.ptr : Y(c);
        return n(Qc(b, a, c));
    };
    r.prototype.NumEntries = r.prototype.NumEntries = function (a) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        return Vc(b, a);
    };
    r.prototype.GetEntryName = r.prototype.GetEntryName = function (a, c) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        c && "object" === typeof c && (c = c.ptr);
        return n(Oc(b, a, c));
    };
    r.prototype.__destroy__ = r.prototype.__destroy__ = function () {
        Wc(this.ptr);
    };
    M.prototype = Object.create(p.prototype);
    M.prototype.constructor = M;
    M.prototype.__class__ = M;
    M.__cache__ = {};
    a.DracoInt16Array = M;
    M.prototype.GetValue = M.prototype.GetValue = function (a) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        return qc(b, a);
    };
    M.prototype.size = M.prototype.size = function () {
        return sc(this.ptr);
    };
    M.prototype.__destroy__ = M.prototype.__destroy__ = function () {
        rc(this.ptr);
    };
    N.prototype = Object.create(p.prototype);
    N.prototype.constructor = N;
    N.prototype.__class__ = N;
    N.__cache__ = {};
    a.DracoFloat32Array = N;
    N.prototype.GetValue = N.prototype.GetValue = function (a) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        return nc(b, a);
    };
    N.prototype.size = N.prototype.size = function () {
        return pc(this.ptr);
    };
    N.prototype.__destroy__ = N.prototype.__destroy__ = function () {
        oc(this.ptr);
    };
    Z.prototype = Object.create(p.prototype);
    Z.prototype.constructor = Z;
    Z.prototype.__class__ = Z;
    Z.__cache__ = {};
    a.GeometryAttribute = Z;
    Z.prototype.__destroy__ = Z.prototype.__destroy__ = function () {
        Ic(this.ptr);
    };
    R.prototype = Object.create(p.prototype);
    R.prototype.constructor = R;
    R.prototype.__class__ = R;
    R.__cache__ = {};
    a.DecoderBuffer = R;
    R.prototype.Init = R.prototype.Init = function (a, c) {
        var b = this.ptr;
        k.prepare();
        if ("object" == typeof a && "object" === typeof a) {
            var d = k.alloc(a, fa);
            k.copy(a, fa, d);
            a = d;
        }
        c && "object" === typeof c && (c = c.ptr);
        Pb(b, a, c);
    };
    R.prototype.__destroy__ = R.prototype.__destroy__ = function () {
        Qb(this.ptr);
    };
    h.prototype = Object.create(p.prototype);
    h.prototype.constructor = h;
    h.prototype.__class__ = h;
    h.__cache__ = {};
    a.Decoder = h;
    h.prototype.GetEncodedGeometryType = h.prototype.GetEncodedGeometryType = function (a) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        return hc(b, a);
    };
    h.prototype.DecodeBufferToPointCloud = h.prototype.DecodeBufferToPointCloud = function (a, c) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        c && "object" === typeof c && (c = c.ptr);
        return X(Sb(b, a, c), B);
    };
    h.prototype.DecodeBufferToMesh = h.prototype.DecodeBufferToMesh = function (a, c) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        c && "object" === typeof c && (c = c.ptr);
        return X(Rb(b, a, c), B);
    };
    h.prototype.GetAttributeId = h.prototype.GetAttributeId = function (a, c) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        c && "object" === typeof c && (c = c.ptr);
        return Yb(b, a, c);
    };
    h.prototype.GetAttributeIdByName = h.prototype.GetAttributeIdByName = function (a, c) {
        var b = this.ptr;
        k.prepare();
        a && "object" === typeof a && (a = a.ptr);
        c = c && "object" === typeof c ? c.ptr : Y(c);
        return Xb(b, a, c);
    };
    h.prototype.GetAttributeIdByMetadataEntry = h.prototype.GetAttributeIdByMetadataEntry = function (a, c, d) {
        var b = this.ptr;
        k.prepare();
        a && "object" === typeof a && (a = a.ptr);
        c = c && "object" === typeof c ? c.ptr : Y(c);
        d = d && "object" === typeof d ? d.ptr : Y(d);
        return Wb(b, a, c, d);
    };
    h.prototype.GetAttribute = h.prototype.GetAttribute = function (a, c) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        c && "object" === typeof c && (c = c.ptr);
        return X(gc(b, a, c), q);
    };
    h.prototype.GetAttributeByUniqueId = h.prototype.GetAttributeByUniqueId = function (a, c) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        c && "object" === typeof c && (c = c.ptr);
        return X(Tb(b, a, c), q);
    };
    h.prototype.GetMetadata = h.prototype.GetMetadata = function (a) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        return X(jc(b, a), S);
    };
    h.prototype.GetAttributeMetadata = h.prototype.GetAttributeMetadata = function (a, c) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        c && "object" === typeof c && (c = c.ptr);
        return X(cc(b, a, c), S);
    };
    h.prototype.GetFaceFromMesh = h.prototype.GetFaceFromMesh = function (a, c, d) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        c && "object" === typeof c && (c = c.ptr);
        d && "object" === typeof d && (d = d.ptr);
        return !!ic(b, a, c, d);
    };
    h.prototype.GetTriangleStripsFromMesh = h.prototype.GetTriangleStripsFromMesh = function (a, c) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        c && "object" === typeof c && (c = c.ptr);
        return kc(b, a, c);
    };
    h.prototype.GetAttributeFloat = h.prototype.GetAttributeFloat = function (a, c, d) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        c && "object" === typeof c && (c = c.ptr);
        d && "object" === typeof d && (d = d.ptr);
        return !!Vb(b, a, c, d);
    };
    h.prototype.GetAttributeFloatForAllPoints = h.prototype.GetAttributeFloatForAllPoints = function (a, c, d) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        c && "object" === typeof c && (c = c.ptr);
        d && "object" === typeof d && (d = d.ptr);
        return !!Ub(b, a, c, d);
    };
    h.prototype.GetAttributeIntForAllPoints = h.prototype.GetAttributeIntForAllPoints = function (a, c, d) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        c && "object" === typeof c && (c = c.ptr);
        d && "object" === typeof d && (d = d.ptr);
        return !!bc(b, a, c, d);
    };
    h.prototype.GetAttributeInt8ForAllPoints = h.prototype.GetAttributeInt8ForAllPoints = function (a, c, d) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        c && "object" === typeof c && (c = c.ptr);
        d && "object" === typeof d && (d = d.ptr);
        return !!ac(b, a, c, d);
    };
    h.prototype.GetAttributeUInt8ForAllPoints = h.prototype.GetAttributeUInt8ForAllPoints = function (a, c, d) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        c && "object" === typeof c && (c = c.ptr);
        d && "object" === typeof d && (d = d.ptr);
        return !!fc(b, a, c, d);
    };
    h.prototype.GetAttributeInt16ForAllPoints = h.prototype.GetAttributeInt16ForAllPoints = function (a, c, d) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        c && "object" === typeof c && (c = c.ptr);
        d && "object" === typeof d && (d = d.ptr);
        return !!Zb(b, a, c, d);
    };
    h.prototype.GetAttributeUInt16ForAllPoints = h.prototype.GetAttributeUInt16ForAllPoints = function (a, c, d) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        c && "object" === typeof c && (c = c.ptr);
        d && "object" === typeof d && (d = d.ptr);
        return !!dc(b, a, c, d);
    };
    h.prototype.GetAttributeInt32ForAllPoints = h.prototype.GetAttributeInt32ForAllPoints = function (a, c, d) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        c && "object" === typeof c && (c = c.ptr);
        d && "object" === typeof d && (d = d.ptr);
        return !!$b(b, a, c, d);
    };
    h.prototype.GetAttributeUInt32ForAllPoints = h.prototype.GetAttributeUInt32ForAllPoints = function (a, c, d) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        c && "object" === typeof c && (c = c.ptr);
        d && "object" === typeof d && (d = d.ptr);
        return !!ec(b, a, c, d);
    };
    h.prototype.SkipAttributeTransform = h.prototype.SkipAttributeTransform = function (a) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        lc(b, a);
    };
    h.prototype.__destroy__ = h.prototype.__destroy__ = function () {
        mc(this.ptr);
    };
    C.prototype = Object.create(p.prototype);
    C.prototype.constructor = C;
    C.prototype.__class__ = C;
    C.__cache__ = {};
    a.Mesh = C;
    C.prototype.num_faces = C.prototype.num_faces = function () {
        return Lc(this.ptr);
    };
    C.prototype.num_attributes = C.prototype.num_attributes = function () {
        return Kc(this.ptr);
    };
    C.prototype.num_points = C.prototype.num_points = function () {
        return Mc(this.ptr);
    };
    C.prototype.__destroy__ = C.prototype.__destroy__ = function () {
        Jc(this.ptr);
    };
    ca.prototype = Object.create(p.prototype);
    ca.prototype.constructor = ca;
    ca.prototype.__class__ = ca;
    ca.__cache__ = {};
    a.VoidPtr = ca;
    ca.prototype.__destroy__ = ca.prototype.__destroy__ = function () {
        od(this.ptr);
    };
    O.prototype = Object.create(p.prototype);
    O.prototype.constructor = O;
    O.prototype.__class__ = O;
    O.__cache__ = {};
    a.DracoInt32Array = O;
    O.prototype.GetValue = O.prototype.GetValue = function (a) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        return tc(b, a);
    };
    O.prototype.size = O.prototype.size = function () {
        return vc(this.ptr);
    };
    O.prototype.__destroy__ = O.prototype.__destroy__ = function () {
        uc(this.ptr);
    };
    S.prototype = Object.create(p.prototype);
    S.prototype.constructor = S;
    S.prototype.__class__ = S;
    S.__cache__ = {};
    a.Metadata = S;
    S.prototype.__destroy__ = S.prototype.__destroy__ = function () {
        Xc(this.ptr);
    };
    (function () {
        function b() {
            a.OK = Fd();
            a.ERROR = Cd();
            a.IO_ERROR = Ed();
            a.INVALID_PARAMETER = Dd();
            a.UNSUPPORTED_VERSION = Hd();
            a.UNKNOWN_VERSION = Gd();
            a.INVALID_GEOMETRY_TYPE = td();
            a.POINT_CLOUD = ud();
            a.TRIANGULAR_MESH = vd();
            a.ATTRIBUTE_INVALID_TRANSFORM = pd();
            a.ATTRIBUTE_NO_TRANSFORM = qd();
            a.ATTRIBUTE_QUANTIZATION_TRANSFORM = sd();
            a.ATTRIBUTE_OCTAHEDRON_TRANSFORM = rd();
            a.INVALID = yd();
            a.POSITION = Ad();
            a.NORMAL = zd();
            a.COLOR = wd();
            a.TEX_COORD = Bd();
            a.GENERIC = xd();
        }
        a.calledRun ? b() : Xa.unshift(b);
    })();
    if ("function" === typeof a.onModuleParsed) a.onModuleParsed();
    return d;
};
"object" === typeof module && module.exports && (module.exports = DracoDecoderModule);
