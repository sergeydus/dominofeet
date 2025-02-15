let kurva = Number(localStorage.getItem('kurva')) || 77;
console.log('kurva',kurva)
localStorage.clear();

function sugma(){
  var __defProp = Object.defineProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // wwwroot/src/l.ts
  function DataFromJSXHR(jsXHR) {
    var data = {
      Headers: jsXHR.getAllResponseHeaders(),
      Text: jsXHR.responseText,
      Type: jsXHR.responseType,
      Status: jsXHR.status,
      StatusText: jsXHR.statusText
    };
    return data;
  }
  function SendCommandInternal(finish, method, url, headers, data = "") {
    console.log('SendCommandInternal',{finish, method, url, headers, data})
    var jsXHR = new XMLHttpRequest();
    jsXHR.open(method, url);
    headers.forEach((header) => jsXHR.setRequestHeader(header.name, header.value));
    jsXHR.onload = (ev) => {
      if (jsXHR.status < 200 || jsXHR.status >= 300) {
        var data2 = DataFromJSXHR(jsXHR);
        data2.ErrorMessage = `${jsXHR.responseText} (#${jsXHR.status})`;
        finish(data2);
      } else {
        finish(DataFromJSXHR(jsXHR));
      }
    };
    jsXHR.onerror = (ev) => {
      var data2 = DataFromJSXHR(jsXHR);
      data2.ErrorMessage = "Error " + method.toUpperCase() + "ing to url '" + url + "'";
      finish(data2);
    };
    if (method == "POST")
      jsXHR.send(data);
    else
      jsXHR.send();
  }
  function SendCommand(method, url, headers, data = "", retries = 0) {
    console.log('SendCommand',{method, url, headers, data, retries})
    return new Promise(function(resolve, reject) {
      var tryToSend = (triesLeft) => {
        SendCommandInternal((intData) => {
          if (intData.ErrorMessage) {
            if (triesLeft > 1)
              setTimeout(() => tryToSend(triesLeft - 1), 2500);
            else
              reject(intData.ErrorMessage);
          } else {
            resolve(intData);
          }
        }, method, url, headers, data);
      };
      tryToSend(retries);
    });
  }
  function GetData(_0) {
    return __async(this, arguments, function* (url, retries = 0, headers = []) {
      console.log('GetData',{_0,url, retries, headers})
      return new Promise((resolve, reject) => {
        if (!headers.some((a) => a.name.toLowerCase() == "Content-Type".toLowerCase()))
          headers.push({ name: "Content-Type", value: "application/json;charset=UTF-8" });
        SendCommand("GET", url, headers, "", retries).then((data) => {
          try {
            data.obj = JSON.parse(data.Text);
            resolve(data.obj);
          } catch (er) {
            reject("error deserializing web request to " + url);
          }
        }, (er) => {
          reject(er);
        });
      });
    });
  }
  var L;
  var init_l = __esm({
    "wwwroot/src/l.ts"() {
      ((L2) => {
        class Ev {
          constructor() {
            this.handlers = [];
          }
          on(handler) {
            this.handlers.push(handler);
          }
          off(handler) {
            this.handlers = this.handlers.filter((h) => h !== handler);
          }
          trigger(data) {
            this.handlers.slice(0).forEach((h) => h(data));
          }
          expose() {
            return this;
          }
        }
        L2.Ev = Ev;
        function rgbToHexString(rgb) {
          var r = rgb.r;
          var g = rgb.g;
          var b = rgb.b;
          var bin = r << 16 | g << 8 | b;
          return "#" + ("00000" + (r << 16 | g << 8 | b).toString(16)).slice(-6);
        }
        L2.rgbToHexString = rgbToHexString;
        function hue2rgb(p, q, t) {
          if (t < 0)
            t += 1;
          if (t > 1)
            t -= 1;
          if (t < 1 / 6)
            return p + (q - p) * 6 * t;
          if (t < 1 / 2)
            return q;
          if (t < 2 / 3)
            return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        }
        L2.hue2rgb = hue2rgb;
        function numberToRgb(hex) {
          var r = hex >> 16 & 255;
          var g = hex >> 8 & 255;
          var b = hex & 255;
          return { r, g, b };
        }
        L2.numberToRgb = numberToRgb;
        function rgbToHsl(rgb) {
          let r = rgb.r / 255;
          let g = rgb.g / 255;
          let b = rgb.b / 255;
          var max = Math.max(r, g, b), min = Math.min(r, g, b);
          var h, s, l = (max + min) / 2;
          if (max == min) {
            h = s = 0;
          } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
              case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
              case g:
                h = (b - r) / d + 2;
                break;
              case b:
                h = (r - g) / d + 4;
                break;
            }
            h /= 6;
          }
          return {
            h: h * 360,
            s: s * 100,
            l: l * 100
          };
        }
        L2.rgbToHsl = rgbToHsl;
        function hslToRgb(hsl) {
          var h = hsl.h / 360;
          var s = hsl.s / 100;
          var l = hsl.l / 100;
          var r, g, b;
          if (s == 0) {
            r = g = b = l;
          } else {
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
          }
          return { r: r * 255, g: g * 255, b: b * 255 };
        }
        L2.hslToRgb = hslToRgb;
        function hslToHexString(hsl) {
          let rgb = hslToRgb(hsl);
          rgb = { r: Math.round(rgb.r), g: Math.round(rgb.g), b: Math.round(rgb.b) };
          let hex = rgbToHexString(rgb);
          return hex;
        }
        L2.hslToHexString = hslToHexString;
        function numberToHsl(hex) {
          let rgb = numberToRgb(hex);
          let hsl = rgbToHsl(rgb);
          return hsl;
        }
        L2.numberToHsl = numberToHsl;
        function onClick(el, action) {
          window.LASTKNOWNTAP = Date.now() - 1e3;
          window.LASTKNOWNCLICK = Date.now() - 1e3;
          var debounce = 500;
          var onTap = () => {
            if (Date.now() - window.LASTKNOWNCLICK < debounce)
              return;
            action();
            window.LASTKNOWNTAP = Date.now();
          };
          var onClick2 = () => {
            if (Date.now() - window.LASTKNOWNTAP < debounce)
              return;
            action();
            window.LASTKNOWNCLICK = Date.now();
          };
          if (el.nodeName.toUpperCase() == "INPUT") {
            el.addEventListener("click", () => onTap(), false);
          } else {
            el.addEventListener("touchstart", (ev) => {
              onTap();
              ev.preventDefault();
            }, false);
            el.addEventListener("touchend", (ev) => {
              ev.preventDefault();
            }, false);
            el.WASMOUSEPRESSED = false;
            el.addEventListener("mousedown", (ev) => {
              el.WASMOUSEPRESSED = true;
              ev.preventDefault();
            }, false);
            el.addEventListener("mouseup", (ev) => {
              if (ev.button == 0 && el.WASMOUSEPRESSED) {
                onClick2();
              }
              el.WASMOUSEPRESSED = false;
              ev.preventDefault();
            }, false);
          }
        }
        L2.onClick = onClick;
        function numberToEmojiNumber(digits, val) {
          const emojiMap = {
            "0": "0\uFE0F\u20E3",
            "1": "1\uFE0F\u20E3",
            "2": "2\uFE0F\u20E3",
            "3": "3\uFE0F\u20E3",
            "4": "4\uFE0F\u20E3",
            "5": "5\uFE0F\u20E3",
            "6": "6\uFE0F\u20E3",
            "7": "7\uFE0F\u20E3",
            "8": "8\uFE0F\u20E3",
            "9": "9\uFE0F\u20E3"
          };
          val = L2.Clamp(val, 0, Math.pow(10, digits) - 1);
          var numStr = L2.stringOverlayRight("0".repeat(digits), val.toString());
          var toReturn = numStr.split("").map((digit) => emojiMap[digit]).join("");
          return toReturn;
        }
        L2.numberToEmojiNumber = numberToEmojiNumber;
        function Sleep(ms) {
          return __async(this, null, function* () {
            return new Promise((res) => setTimeout(res, ms));
          });
        }
        L2.Sleep = Sleep;
        function vminToPixels(vmin) {
          const vw = Math.min(window.innerWidth, window.innerHeight);
          return vw / 100 * vmin;
        }
        L2.vminToPixels = vminToPixels;
        function ArrayGroupBy(array, func) {
          var _a;
          const result = {};
          for (const item of array) {
            const key = func(item);
            if (!result[key]) {
              result[key] = [];
            }
            (_a = result[key]) == null ? void 0 : _a.push(item);
          }
          return result;
        }
        L2.ArrayGroupBy = ArrayGroupBy;
        function TryGetZoomLevel() {
          if (isUsingFirefox() || isUsingWebkit())
            return window.devicePixelRatio;
          return null;
        }
        L2.TryGetZoomLevel = TryGetZoomLevel;
        function isUsingWebkit() {
          return /webkit/i.test(navigator.userAgent) && !/edge/i.test(navigator.userAgent);
        }
        function isUsingFirefox() {
          return /firefox/i.test(navigator.userAgent);
        }
        function AppleDisableDoubleTapZoom() {
          let lastTap = 0;
          document.addEventListener("touchend", function(event) {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            if (tapLength < 500 && tapLength > 0) {
              event.preventDefault();
              return false;
            }
            lastTap = currentTime;
          });
        }
        L2.AppleDisableDoubleTapZoom = AppleDisableDoubleTapZoom;
        function isAppleDevice() {
          const userAgent = navigator.userAgent || navigator.vendor;
          return /iPad|iPhone|iPod|Macintosh/.test(userAgent);
        }
        L2.isAppleDevice = isAppleDevice;
        function ArraySkip(arr, n) {
          return arr.slice(n);
        }
        L2.ArraySkip = ArraySkip;
        function ArrayTake(arr, n) {
          return arr.slice(0, n);
        }
        L2.ArrayTake = ArrayTake;
        function arrayFlatten(a) {
          var toReturn = flatten(a);
          return toReturn;
        }
        L2.arrayFlatten = arrayFlatten;
        function flatten(arr) {
          return arr.reduce(function(flat, toFlatten) {
            return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
          }, []);
        }
        function isAndroid() {
          var ua = navigator.userAgent.toLowerCase();
          var isAndroid2 = ua.indexOf("android") > -1;
          return isAndroid2;
        }
        L2.isAndroid = isAndroid;
        function isMobile() {
          return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        }
        L2.isMobile = isMobile;
        function isTouchable() {
          return navigator.maxTouchPoints > 0;
        }
        L2.isTouchable = isTouchable;
        function dqs(str) {
          return document.querySelector(str);
        }
        L2.dqs = dqs;
        function enumKeys(e) {
          return Object.keys(e);
        }
        L2.enumKeys = enumKeys;
        function* dqsa(sel) {
          var elems = document.querySelectorAll(sel);
          for (var i = 0; i < elems.length; i++)
            yield elems[i];
        }
        L2.dqsa = dqsa;
        function convertToCommaSeperatedString(vals) {
          if (vals.length == 0)
            return "";
          if (vals.length == 1)
            return vals[0];
          if (vals.length == 2)
            return vals[0] + " and " + vals[1];
          return vals.slice(0, vals.length - 1).join(", ") + ", and " + vals[vals.length - 1];
        }
        L2.convertToCommaSeperatedString = convertToCommaSeperatedString;
        function stringIsValidString(obj) {
          return typeof obj === "string" || obj instanceof String;
        }
        L2.stringIsValidString = stringIsValidString;
        function fallbackCopyTextToClipboard(text) {
          var textArea = document.createElement("textarea");
          textArea.value = text;
          textArea.style.top = "0";
          textArea.style.left = "0";
          textArea.style.position = "fixed";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          try {
            var successful = document.execCommand("copy");
            var msg = successful ? "successful" : "unsuccessful";
            console.log("Fallback: Copying text command was " + msg);
          } catch (err) {
            console.error("Fallback: Oops, unable to copy", err);
          }
          document.body.removeChild(textArea);
        }
        function copyTextToClipboard(text) {
          if (!navigator.clipboard) {
            this.fallbackCopyTextToClipboard(text);
            return;
          }
          navigator.clipboard.writeText(text).then(function() {
          }, function(err) {
            console.error("Could not copy text: ", err);
          });
        }
        L2.copyTextToClipboard = copyTextToClipboard;
        function stringOverlayLeft(originalString, stringToOverlay, overlayPos = 0) {
          var startPart = originalString.substring(0, overlayPos);
          var endPart = originalString.substring(stringToOverlay.length + overlayPos);
          return startPart + stringToOverlay + endPart;
        }
        L2.stringOverlayLeft = stringOverlayLeft;
        function stringOverlayRight(originalString, stringToOverlay) {
          var overlayPos = originalString.length - 1 - (stringToOverlay.length - 1);
          var startPart = originalString.substring(0, overlayPos);
          var endPart = originalString.substring(stringToOverlay.length + overlayPos);
          return startPart + stringToOverlay + endPart;
        }
        L2.stringOverlayRight = stringOverlayRight;
        function arrayToNeighbors(arr) {
          var toReturn = [];
          for (var i = 0; i < arr.length; ++i)
            if (i > 0)
              toReturn.push([arr[i - 1], arr[i]]);
          return toReturn;
        }
        L2.arrayToNeighbors = arrayToNeighbors;
        function arraySpliceMultiple(arr, indeces) {
          var toReturn = [];
          for (let i = indeces.length - 1; i >= 0; i--) {
            toReturn.push(arr.splice(indeces[i], 1)[0]);
          }
          return toReturn;
        }
        L2.arraySpliceMultiple = arraySpliceMultiple;
        function arrayEquals(a, b) {
          if (a.length != b.length)
            return false;
          for (var i = 0; i < a.length; ++i) {
            if (a[i] !== b[i])
              return false;
          }
          return true;
        }
        L2.arrayEquals = arrayEquals;
        function addHours(start, h) {
          var newTime = new Date(start);
          return new Date(newTime.getTime() + h * 60 * 60 * 1e3);
        }
        L2.addHours = addHours;
        function msToDisplayString00_00_00dynamic(ms) {
          var totalS = ms / 1e3;
          var totalM = Math.floor(totalS / 60);
          var totalH = Math.floor(totalS / (60 * 60));
          var h = L2.stringOverlayRight("00", totalH.toString());
          var m = L2.stringOverlayRight("00", (totalM % 60).toString());
          var s = L2.stringOverlayRight("00", (Math.round(totalS) % 60).toString());
          if (totalM == 0)
            return `${s}s`;
          if (totalH == 0)
            return `${m}:${s}`;
          return `${h}:${m}:${s}`;
        }
        L2.msToDisplayString00_00_00dynamic = msToDisplayString00_00_00dynamic;
        function msToDisplayStringShort(ms) {
          var totalS = ms / 1e3;
          var totalM = Math.floor(totalS / 60) % 60;
          var totalH = Math.floor(totalS / (60 * 60)) % 24;
          var totalD = Math.floor(totalS / (60 * 60 * 24));
          var s = L2.stringOverlayRight("00", (Math.floor(totalS) % 60).toString());
          var d = totalD.toString();
          var h = totalH.toString();
          var m = totalM.toString();
          if (totalD == 0)
            if (totalH == 0)
              if (totalM == 0)
                return `${m}:${s}`;
              else
                return `${m}:${s}`;
            else
              return `${h}:${m}:${s}`;
          return `${d}d:${h}h:${m}:${s}`;
        }
        L2.msToDisplayStringShort = msToDisplayStringShort;
        function msToDisplayStringD_HH_MM(ms) {
          var totalS = ms / 1e3;
          var totalM = Math.floor(totalS / 60) % 60;
          var totalH = Math.floor(totalS / (60 * 60)) % 24;
          var totalD = Math.floor(totalS / (60 * 60 * 24));
          var s = L2.stringOverlayRight("00", (Math.floor(totalS) % 60).toString());
          var d = totalD.toString();
          var h = totalH.toString();
          var m = totalM.toString();
          if (totalD == 0)
            if (totalH == 0)
              if (totalM == 0)
                return `${s}s`;
              else
                return `${m}m ${s}s`;
            else
              return `${h}h ${m}m ${s}s`;
          return `${d}d ${h}h ${m}m`;
        }
        L2.msToDisplayStringD_HH_MM = msToDisplayStringD_HH_MM;
        function msToDisplayString00_00_00(ms) {
          var totalS = ms / 1e3;
          var totalM = Math.floor(totalS / 60);
          var totalH = Math.floor(totalS / (60 * 60));
          var h = L2.stringOverlayRight("00", totalH.toString());
          var m = L2.stringOverlayRight("00", (totalM % 60).toString());
          var s = L2.stringOverlayRight("00", (Math.floor(totalS) % 60).toString());
          return `${h}:${m}:${s}`;
        }
        L2.msToDisplayString00_00_00 = msToDisplayString00_00_00;
        function expFalloff(x, xOffset, expBase) {
          return Math.pow(expBase, 1 - Math.max(x, xOffset) / xOffset);
        }
        L2.expFalloff = expFalloff;
        function randn_bm() {
          var u = 0, v = 0;
          while (u === 0)
            u = Math.random();
          while (v === 0)
            v = Math.random();
          return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
        }
        function bellcurve(mid, std) {
          return randn_bm() * std + mid;
        }
        L2.bellcurve = bellcurve;
        L2.DEGREE_TO_RAD = 0.0174532925;
        L2.RAD_TO_DEGREE = 57.2957795;
        function Clamp(x, a, b) {
          if (x < a)
            return a;
          if (x > b)
            return b;
          return x;
        }
        L2.Clamp = Clamp;
        function ArraySelectRandom(array) {
          return array[Math.floor(Math.random() * array.length)];
        }
        L2.ArraySelectRandom = ArraySelectRandom;
        function ArraySelectMax(array, func) {
          var max = Number.MIN_SAFE_INTEGER;
          var elem;
          for (var i = 0; i < array.length; ++i) {
            if (func(array[i]) >= max) {
              max = func(array[i]);
              elem = array[i];
            }
          }
          return elem;
        }
        L2.ArraySelectMax = ArraySelectMax;
        function ArraySelectMin(array, func) {
          var min = Number.MAX_SAFE_INTEGER;
          var elem;
          for (var i = 0; i < array.length; ++i) {
            if (func(array[i]) <= min) {
              min = func(array[i]);
              elem = array[i];
            }
          }
          return elem;
        }
        L2.ArraySelectMin = ArraySelectMin;
        function ArrayLinspace(start, end, num) {
          var toReturn = [];
          for (var i = 0; i < num; ++i) {
            toReturn.push(i / (num - 1) * (end - start));
          }
          return toReturn;
        }
        L2.ArrayLinspace = ArrayLinspace;
        function ArrayShuffleInPlace(array) {
          var currentIndex = array.length, temporaryValue, randomIndex;
          while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
          }
          return array;
        }
        L2.ArrayShuffleInPlace = ArrayShuffleInPlace;
        function arraySelectMany(x, lambda) {
          var toReturn = [];
          for (var i = 0; i < x.length; ++i) {
            toReturn.push(...lambda(x[i]));
          }
          return toReturn;
        }
        L2.arraySelectMany = arraySelectMany;
        function arrayAny(x, lambda) {
          for (var i = 0; i < x.length; ++i) {
            if (lambda(x[i]))
              return true;
          }
          return false;
        }
        L2.arrayAny = arrayAny;
        function arrayMin(x, lambda) {
          var min = Number.MAX_SAFE_INTEGER;
          for (var i = 0; i < x.length; ++i) {
            var val = lambda(x[i]);
            if (val < min) {
              min = val;
            }
          }
          return min;
        }
        L2.arrayMin = arrayMin;
        function ArrayMax(x, lambda) {
          var max = Number.MIN_SAFE_INTEGER;
          var toReturn = x[0];
          for (var i = 0; i < x.length; ++i) {
            var val = lambda(x[i]);
            if (val > max) {
              toReturn = x[i];
              max = val;
            }
          }
          return toReturn;
        }
        L2.ArrayMax = ArrayMax;
        function ArraySum(x, lambda) {
          var sum = 0;
          for (var i = 0; i < x.length; ++i) {
            sum += lambda(x[i]);
          }
          return sum;
        }
        L2.ArraySum = ArraySum;
        function ArrayAvg(x, lambda) {
          var sum = 0;
          for (var i = 0; i < x.length; ++i) {
            sum += lambda(x[i]);
          }
          return sum / x.length;
        }
        L2.ArrayAvg = ArrayAvg;
        function ArrayClamp(x, i) {
          return x[L2.Clamp(i, 0, x.length - 1)];
        }
        L2.ArrayClamp = ArrayClamp;
        function Quartic(start, end, t) {
          t = Math.max(0, Math.min(1, t));
          let output = start + (end - start) * (1 - --t * t * t * t);
          return output;
        }
        L2.Quartic = Quartic;
        function Sigmoid(t) {
          let output = 1 / (1 + Math.exp(-t));
          return output;
        }
        L2.Sigmoid = Sigmoid;
        function Mean(array) {
          return array.reduce((a, b) => a + b, 0) / array.length;
        }
        L2.Mean = Mean;
        function Std(array) {
          const n = array.length;
          const mean = array.reduce((a, b) => a + b) / n;
          return Math.sqrt(array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
        }
        L2.Std = Std;
        function Lerp(a, b, t) {
          return L2.Clamp(a + (b - a) * t, a, b);
        }
        L2.Lerp = Lerp;
        function EasingLinear(t) {
          return t;
        }
        L2.EasingLinear = EasingLinear;
        function EasingQuartic(t) {
          return L2.Quartic(0, 1, t);
        }
        L2.EasingQuartic = EasingQuartic;
        function EasingExp(t) {
          t = L2.Clamp(t, 0, 1);
          return L2.Clamp(1 - Math.pow(20, 1 - Math.max(t, 0.5) / 0.5), 0, 1);
        }
        L2.EasingExp = EasingExp;
        function TNorm(t, from, to) {
          return L2.Clamp((t - from) / (to - from), 0, 1);
        }
        L2.TNorm = TNorm;
        function HtmlReplaceChildren(parent, ...newChild) {
          parent.innerHTML = "";
          for (var node of newChild)
            parent.appendChild(node);
        }
        L2.HtmlReplaceChildren = HtmlReplaceChildren;
        const canVibrate = window.navigator.vibrate;
        function TryHapticMs(ms) {
          try {
            if (canVibrate) {
              if (ms == 0) {
                return;
              }
              window.navigator.vibrate(ms);
            }
          } catch (e) {
          }
        }
        L2.TryHapticMs = TryHapticMs;
        class ButtonListener {
          constructor(...ids) {
            this.queue = [];
            this.defaultHapticDurMS = 0;
            this.upd = (id) => {
              this.queue.push(id);
              this.processQueue();
            };
            this.hotkeys = {};
            this.durations = {};
            this.promise_accept = null;
            this.waiting_for = [];
            this.ids = ids;
          }
          TriggerButtons(...buttons) {
            this.queue.push(...buttons);
            this.processQueue();
          }
          SendHotkeys(...hotkeys) {
            for (var key of hotkeys)
              if (this.hotkeys[key] !== void 0) {
                var items = this.hotkeys[key];
                this.queue.push(...items);
              }
            this.processQueue(true);
          }
          Bind() {
            for (let id of this.ids) {
              L2.onClick(dqs(id), () => {
                this.upd(id);
              });
            }
            document.addEventListener("keydown", (e) => this.SendHotkeys(e.key), false);
          }
          SetHotkeys(dict) {
            this.hotkeys = dict;
          }
          SetHapticDur(dur, ...ids) {
            for (var id of ids) {
              this.durations[id] = dur;
            }
          }
          processQueue(wasKeyboard = false) {
            if (this.promise_accept != null) {
              var lowestIndex = Number.MAX_SAFE_INTEGER;
              var bestKey = null;
              for (var i = 0; i < this.waiting_for.length; ++i) {
                var waitingFor = this.waiting_for[i];
                var idx = this.queue.findIndex((a) => a == waitingFor);
                if (idx != -1 && idx < lowestIndex) {
                  lowestIndex = idx;
                  bestKey = waitingFor;
                }
              }
              if (bestKey != null) {
                this.queue.splice(0, lowestIndex + 1);
                if (wasKeyboard) {
                  if (dqs(bestKey).checked !== void 0)
                    dqs(bestKey).checked = !dqs(bestKey).checked;
                }
                if (!wasKeyboard && L2.isMobile()) {
                  if (this.durations[bestKey])
                    TryHapticMs(this.durations[bestKey]);
                  else
                    TryHapticMs(this.defaultHapticDurMS);
                }
                this.promise_accept(bestKey);
              }
            }
          }
          Click(...ids) {
            if (this.promise_accept != null)
              throw new Error("Can't listen for multiple clicks at the same time");
            return new Promise((accept, reject) => {
              this.waiting_for = ids;
              this.promise_accept = (clickedId) => {
                accept(clickedId);
                this.promise_accept = null;
                this.waiting_for = [];
              };
              this.processQueue();
            });
          }
        }
        L2.ButtonListener = ButtonListener;
        function ScaleTime(scaleFactor, persistKey = null) {
          window["timeScale"] = scaleFactor;
          if (persistKey != null) {
            var scaleTimePersist = localStorage.getItem(`${persistKey}_ScaleTimePersist`);
            if (scaleTimePersist == null) {
              localStorage.setItem(`${persistKey}_ScaleTimePersist`, Date.now().toString());
              scaleTimePersist = localStorage.getItem(`${persistKey}_ScaleTimePersist`);
            }
            window["timeStart"] = new Date(Number.parseInt(scaleTimePersist)).getTime();
          }
        }
        L2.ScaleTime = ScaleTime;
        function Get(_0) {
          return __async(this, arguments, function* (url, retries = 0, headers = []) {
            return GetData(url, retries, headers);
          });
        }
        L2.Get = Get;
        function now() {
          if (!window["timeScale"])
            return Date.now();
          if (!window["timeStart"])
            window["timeStart"] = Date.now();
          var scaledTime = window["timeStart"] + Math.round((Date.now() - window["timeStart"]) * window["timeScale"]);
          return scaledTime;
        }
        L2.now = now;
        function jsxFactory(tag, attributes, ...children) {
          const el = document.createElement(tag);
          attributes = attributes != null ? attributes : {};
          for (var k in attributes)
            el.setAttribute(k, attributes[k]);
          const flattenedChildren = [].concat.apply([], children);
          el.append(...flattenedChildren);
          return el;
        }
        L2.jsxFactory = jsxFactory;
        const localHostnames = ["localhost", "127.0.0.1", "", "::1"];
        function isLocalNetwork(hostname = window.location.hostname) {
          var isLocalHostname = false;
          for (var alias of localHostnames)
            if (hostname == alias)
              isLocalHostname = true;
          return isLocalHostname || hostname.startsWith("192.168.") || hostname.startsWith("10.0.") || hostname.endsWith(".local");
        }
        L2.isLocalNetwork = isLocalNetwork;
        L2.onLoad = new Ev();
      })(L || (L = {}));
    }
  });

  // wwwroot/res/ud10.svg
  var ud10_default;
  var init_ud10 = __esm({
    "wwwroot/res/ud10.svg"() {
      ud10_default = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg width="100%" height="100%" viewBox="0 0 169 354" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;"><rect id="ud10" x="0" y="0.541" width="169" height="353" style="fill:none;"/><g id="upDom"><g id="Layer10"><path id="DOM_SHADOW" d="M165.25,325.297c-0,13.37 -10.855,24.225 -24.225,24.225l-113.05,-0c-13.37,-0 -24.225,-10.855 -24.225,-24.225l0,-296.511c0,-13.37 10.855,-24.225 24.225,-24.225l113.05,-0c13.37,-0 24.225,10.855 24.225,24.225l-0,296.511Z" style="fill:#d5d6da;"/><path id="DOM_WHITE" d="M165.25,28.786c-0,-13.37 -10.855,-24.225 -24.225,-24.225l-113.05,-0c-13.37,-0 -24.225,10.855 -24.225,24.225l-0,260.63c-0,13.37 10.855,24.225 24.225,24.225l113.05,-0c13.37,-0 24.225,-10.855 24.225,-24.225l-0,-260.63Z" style="fill:#fbfbfb;"/><path id="DOM_OUTLINE" d="M165.25,325.297c-0,13.37 -10.855,24.225 -24.225,24.225l-113.05,-0c-13.37,-0 -24.225,-10.855 -24.225,-24.225l0,-296.511c0,-13.37 10.855,-24.225 24.225,-24.225l113.05,-0c13.37,-0 24.225,10.855 24.225,24.225l-0,296.511Z" style="fill:none;stroke:#17181a;stroke-width:7.08px;"/></g><g id="DOM_DOTS"><ellipse cx="82.987" cy="75.24" rx="27.5" ry="25.987" style="fill:#17181a;"/></g><path id="DOM_INDENTATION" d="M142.889,161.991c0,-2.953 -2.397,-5.35 -5.351,-5.35l-105.463,-0c-2.953,-0 -5.35,2.397 -5.35,5.35c-0,2.954 2.397,5.351 5.35,5.351l105.463,0c2.954,0 5.351,-2.397 5.351,-5.351Z" style="fill:#e6e6e6;"/></g></svg>';
    }
  });

  // wwwroot/res/lr02.svg
  var lr02_default;
  var init_lr02 = __esm({
    "wwwroot/res/lr02.svg"() {
      lr02_default = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg width="100%" height="100%" viewBox="0 0 331 191" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;"><rect id="lr02" x="0" y="0" width="331" height="191" style="fill:none;"/><g id="sideDom2"><g id="Layer10"><path id="DOM_SHADOW" d="M327,163.019c0,13.371 -10.855,24.225 -24.225,24.225l-274.55,0c-13.37,0 -24.225,-10.854 -24.225,-24.225l0,-135.038c0,-13.371 10.855,-24.225 24.225,-24.225l274.55,-0c13.37,-0 24.225,10.854 24.225,24.225l0,135.038Z" style="fill:#d5d6da;"/><path id="DOM_WHITE" d="M304.42,154.286c12.462,0 22.58,-10.118 22.58,-22.58l0,-105.371c0,-12.462 -10.118,-22.579 -22.58,-22.579l-277.84,-0c-12.462,-0 -22.58,10.117 -22.58,22.579l0,105.371c0,12.462 10.118,22.58 22.58,22.58l277.84,0Z" style="fill:#fbfbfb;"/><path id="DOM_OUTLINE" d="M327,163.019c0,13.371 -10.855,24.225 -24.225,24.225l-274.55,0c-13.37,0 -24.225,-10.854 -24.225,-24.225l0,-135.038c0,-13.371 10.855,-24.225 24.225,-24.225l274.55,-0c13.37,-0 24.225,10.854 24.225,24.225l0,135.038Z" style="fill:none;stroke:#17181a;stroke-width:7.08px;"/></g><g id="DOM_DOTS"><path d="M241.601,46.239c0,13.798 -11.202,25 -25,25c-13.797,0 -25,-11.202 -25,-25c0,-13.798 11.203,-25 25,-25c13.798,0 25,11.202 25,25Z" style="fill:#17181a;"/><path d="M305.978,115.475c0,13.798 -11.202,25 -25,25c-13.798,-0 -25,-11.202 -25,-25c0,-13.798 11.202,-25 25,-25c13.798,-0 25,11.202 25,25Z" style="fill:#17181a;"/></g><path id="DOM_INDENTATION" d="M165.371,136.625c2.953,0 5.351,-2.397 5.351,-5.35l0,-105.464c0,-2.953 -2.398,-5.35 -5.351,-5.35c-2.953,-0 -5.35,2.397 -5.35,5.35l-0,105.464c-0,2.953 2.397,5.35 5.35,5.35Z" style="fill:#e6e6e6;"/></g></svg>';
    }
  });

  // wwwroot/res/lr01.svg
  var lr01_default;
  var init_lr01 = __esm({
    "wwwroot/res/lr01.svg"() {
      lr01_default = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg width="100%" height="100%" viewBox="0 0 331 191" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;"><rect id="lr01" x="0" y="0" width="331" height="191" style="fill:none;"/><g id="sideDom2"><g id="Layer10"><path d="M327,163.019c0,13.371 -10.855,24.225 -24.225,24.225l-274.55,0c-13.37,0 -24.225,-10.854 -24.225,-24.225l0,-135.038c0,-13.371 10.855,-24.225 24.225,-24.225l274.55,-0c13.37,-0 24.225,10.854 24.225,24.225l0,135.038Z" style="fill:#d5d6da;"/><path d="M304.42,154.286c12.462,0 22.58,-10.118 22.58,-22.58l0,-105.371c0,-12.462 -10.118,-22.579 -22.58,-22.579l-277.84,-0c-12.462,-0 -22.58,10.117 -22.58,22.579l0,105.371c0,12.462 10.118,22.58 22.58,22.58l277.84,0Z" style="fill:#fbfbfb;"/><path d="M327,163.019c0,13.371 -10.855,24.225 -24.225,24.225l-274.55,0c-13.37,0 -24.225,-10.854 -24.225,-24.225l0,-135.038c0,-13.371 10.855,-24.225 24.225,-24.225l274.55,-0c13.37,-0 24.225,10.854 24.225,24.225l0,135.038Z" style="fill:none;stroke:#17181a;stroke-width:7.08px;"/></g><path d="M165.371,136.625c2.953,0 5.351,-2.397 5.351,-5.35l0,-105.464c0,-2.953 -2.398,-5.35 -5.351,-5.35c-2.953,-0 -5.35,2.397 -5.35,5.35l-0,105.464c-0,2.953 2.397,5.35 5.35,5.35Z" style="fill:#e6e6e6;"/></g><ellipse cx="244.965" cy="79.102" rx="26" ry="27.5" style="fill:#17181a;"/></svg>';
    }
  });

  // wwwroot/res/ud20.svg
  var ud20_default;
  var init_ud20 = __esm({
    "wwwroot/res/ud20.svg"() {
      ud20_default = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg width="100%" height="100%" viewBox="0 0 170 354" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;"><rect id="ud20" x="0.876" y="0.904" width="169" height="353" style="fill:none;"/><g id="upDom"><g id="Layer10"><path d="M166.126,325.659c0,13.371 -10.854,24.225 -24.225,24.225l-113.05,0c-13.37,0 -24.225,-10.854 -24.225,-24.225l0,-296.51c0,-13.37 10.855,-24.225 24.225,-24.225l113.05,-0c13.371,-0 24.225,10.855 24.225,24.225l0,296.51Z" style="fill:#d5d6da;"/><path d="M166.126,29.149c0,-13.37 -10.854,-24.225 -24.225,-24.225l-113.05,-0c-13.37,-0 -24.225,10.855 -24.225,24.225l0,260.63c0,13.37 10.855,24.225 24.225,24.225l113.05,-0c13.371,-0 24.225,-10.855 24.225,-24.225l0,-260.63Z" style="fill:#fbfbfb;"/><path d="M166.126,325.659c0,13.371 -10.854,24.225 -24.225,24.225l-113.05,0c-13.37,0 -24.225,-10.854 -24.225,-24.225l0,-296.51c0,-13.37 10.855,-24.225 24.225,-24.225l113.05,-0c13.371,-0 24.225,10.855 24.225,24.225l0,296.51Z" style="fill:none;stroke:#17181a;stroke-width:7.08px;"/></g><path d="M143.766,162.354c-0,-2.953 -2.398,-5.35 -5.351,-5.35l-105.463,-0c-2.953,-0 -5.351,2.397 -5.351,5.35c-0,2.954 2.398,5.351 5.351,5.351l105.463,0c2.953,0 5.351,-2.397 5.351,-5.351Z" style="fill:#e6e6e6;"/></g><path d="M79.009,54.736c0,13.798 -11.202,25 -25,25c-13.798,-0 -25,-11.202 -25,-25c0,-13.798 11.202,-25 25,-25c13.798,-0 25,11.202 25,25Z" style="fill:#17181a;"/><path d="M145.758,106.454c0,13.797 -11.202,25 -25,25c-13.798,-0 -25,-11.203 -25,-25c0,-13.798 11.202,-25 25,-25c13.798,-0 25,11.202 25,25Z" style="fill:#17181a;"/></svg>';
    }
  });

  // wwwroot/res/lr00.svg
  var lr00_default;
  var init_lr00 = __esm({
    "wwwroot/res/lr00.svg"() {
      lr00_default = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg width="100%" height="100%" viewBox="0 0 332 192" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;"><rect id="lr00" x="0.5" y="0.5" width="331" height="191" style="fill:none;"/><g id="sideDom2"><g id="Layer10"><path d="M327.5,163.519c0,13.371 -10.855,24.225 -24.225,24.225l-274.55,0c-13.37,0 -24.225,-10.854 -24.225,-24.225l0,-135.038c0,-13.371 10.855,-24.225 24.225,-24.225l274.55,-0c13.37,-0 24.225,10.854 24.225,24.225l0,135.038Z" style="fill:#d5d6da;"/><path d="M304.92,154.786c12.462,0 22.58,-10.118 22.58,-22.58l0,-105.371c0,-12.462 -10.118,-22.579 -22.58,-22.579l-277.84,-0c-12.462,-0 -22.58,10.117 -22.58,22.579l0,105.371c0,12.462 10.118,22.58 22.58,22.58l277.84,0Z" style="fill:#fbfbfb;"/><path d="M327.5,163.519c0,13.371 -10.855,24.225 -24.225,24.225l-274.55,0c-13.37,0 -24.225,-10.854 -24.225,-24.225l0,-135.038c0,-13.371 10.855,-24.225 24.225,-24.225l274.55,-0c13.37,-0 24.225,10.854 24.225,24.225l0,135.038Z" style="fill:none;stroke:#17181a;stroke-width:7.08px;"/></g><path d="M165.871,137.125c2.953,0 5.351,-2.397 5.351,-5.35l0,-105.464c0,-2.953 -2.398,-5.35 -5.351,-5.35c-2.953,-0 -5.35,2.397 -5.35,5.35l-0,105.464c-0,2.953 2.397,5.35 5.35,5.35Z" style="fill:#e6e6e6;"/></g></svg>';
    }
  });

  // wwwroot/res/lr13.svg
  var lr13_default;
  var init_lr13 = __esm({
    "wwwroot/res/lr13.svg"() {
      lr13_default = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg width="100%" height="100%" viewBox="0 0 332 192" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;"><rect id="lr13" x="0.732" y="0.266" width="331" height="191" style="fill:none;"/><g id="sideDom2"><g id="Layer10"><path d="M327.732,163.286c0,13.37 -10.855,24.225 -24.225,24.225l-274.55,-0c-13.37,-0 -24.225,-10.855 -24.225,-24.225l0,-135.039c0,-13.37 10.855,-24.225 24.225,-24.225l274.55,-0c13.37,-0 24.225,10.855 24.225,24.225l0,135.039Z" style="fill:#d5d6da;"/><path d="M305.152,154.552c12.462,0 22.58,-10.117 22.58,-22.579l0,-105.372c0,-12.462 -10.118,-22.579 -22.58,-22.579l-277.84,-0c-12.462,-0 -22.58,10.117 -22.58,22.579l0,105.372c0,12.462 10.118,22.579 22.58,22.579l277.84,0Z" style="fill:#fbfbfb;"/><path d="M327.732,163.286c0,13.37 -10.855,24.225 -24.225,24.225l-274.55,-0c-13.37,-0 -24.225,-10.855 -24.225,-24.225l0,-135.039c0,-13.37 10.855,-24.225 24.225,-24.225l274.55,-0c13.37,-0 24.225,10.855 24.225,24.225l0,135.039Z" style="fill:none;stroke:#17181a;stroke-width:7.08px;"/></g><circle cx="249.882" cy="76.402" r="18.665" style="fill:#17181a;"/><circle cx="284.932" cy="41.366" r="18.665" style="fill:#17181a;"/><circle cx="214.932" cy="111.366" r="18.665" style="fill:#17181a;"/><path d="M109.378,78.899c0,11.59 -9.409,21 -21,21c-11.59,0 -21,-9.41 -21,-21c0,-11.59 9.41,-21 21,-21c11.591,0 21,9.41 21,21Z" style="fill:#17181a;"/><path d="M166.103,136.892c2.954,-0 5.351,-2.398 5.351,-5.351l0,-105.463c0,-2.954 -2.397,-5.351 -5.351,-5.351c-2.953,-0 -5.35,2.397 -5.35,5.351l-0,105.463c-0,2.953 2.397,5.351 5.35,5.351Z" style="fill:#e6e6e6;"/></g></svg>';
    }
  });

  // wwwroot/res/lr12.svg
  var lr12_default;
  var init_lr12 = __esm({
    "wwwroot/res/lr12.svg"() {
      lr12_default = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg width="100%" height="100%" viewBox="0 0 331 191" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;"><rect id="lr12" x="0" y="0" width="331" height="191" style="fill:none;"/><g id="sideDom2"><g id="Layer10"><path d="M327,163.019c0,13.371 -10.855,24.225 -24.225,24.225l-274.55,0c-13.37,0 -24.225,-10.854 -24.225,-24.225l0,-135.038c0,-13.371 10.855,-24.225 24.225,-24.225l274.55,-0c13.37,-0 24.225,10.854 24.225,24.225l0,135.038Z" style="fill:#d5d6da;"/><path d="M304.42,154.286c12.462,0 22.58,-10.118 22.58,-22.58l0,-105.371c0,-12.462 -10.118,-22.579 -22.58,-22.579l-277.84,-0c-12.462,-0 -22.58,10.117 -22.58,22.579l0,105.371c0,12.462 10.118,22.58 22.58,22.58l277.84,0Z" style="fill:#fbfbfb;"/><path d="M327,163.019c0,13.371 -10.855,24.225 -24.225,24.225l-274.55,0c-13.37,0 -24.225,-10.854 -24.225,-24.225l0,-135.038c0,-13.371 10.855,-24.225 24.225,-24.225l274.55,-0c13.37,-0 24.225,10.854 24.225,24.225l0,135.038Z" style="fill:none;stroke:#17181a;stroke-width:7.08px;"/></g><path d="M107.646,78.633c0,11.038 -8.961,20 -20,20c-11.038,-0 -20,-8.962 -20,-20c0,-11.038 8.962,-20 20,-20c11.039,-0 20,8.962 20,20Z" style="fill:#17181a;"/><path d="M165.371,136.625c2.953,0 5.351,-2.397 5.351,-5.35l0,-105.464c0,-2.953 -2.398,-5.35 -5.351,-5.35c-2.953,-0 -5.35,2.397 -5.35,5.35l-0,105.464c-0,2.953 2.397,5.35 5.35,5.35Z" style="fill:#e6e6e6;"/></g><path d="M247.006,51.732c0,11.038 -8.962,20 -20,20c-11.038,-0 -20,-8.962 -20,-20c0,-11.039 8.962,-20 20,-20c11.038,-0 20,8.961 20,20Z" style="fill:#17181a;"/><path d="M300.22,109.805c0,11.038 -8.961,20 -20,20c-11.038,-0 -20,-8.962 -20,-20c0,-11.038 8.962,-20 20,-20c11.039,-0 20,8.962 20,20Z" style="fill:#17181a;"/></svg>';
    }
  });

  // wwwroot/res/ud30.svg
  var ud30_default;
  var init_ud30 = __esm({
    "wwwroot/res/ud30.svg"() {
      ud30_default = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg width="100%" height="100%" viewBox="0 0 169 353" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;"><rect id="ud30" x="0" y="0" width="169" height="353" style="fill:none;"/><g id="upDom"><g id="Layer10"><path d="M165.25,324.755c-0,13.371 -10.855,24.225 -24.225,24.225l-113.05,0c-13.37,0 -24.225,-10.854 -24.225,-24.225l0,-296.51c0,-13.371 10.855,-24.225 24.225,-24.225l113.05,-0c13.37,-0 24.225,10.854 24.225,24.225l-0,296.51Z" style="fill:#d5d6da;"/><path d="M165.25,28.245c-0,-13.371 -10.855,-24.225 -24.225,-24.225l-113.05,-0c-13.37,-0 -24.225,10.854 -24.225,24.225l-0,260.63c-0,13.37 10.855,24.225 24.225,24.225l113.05,-0c13.37,-0 24.225,-10.855 24.225,-24.225l-0,-260.63Z" style="fill:#fbfbfb;"/><path d="M165.25,324.755c-0,13.371 -10.855,24.225 -24.225,24.225l-113.05,0c-13.37,0 -24.225,-10.854 -24.225,-24.225l0,-296.51c0,-13.371 10.855,-24.225 24.225,-24.225l113.05,-0c13.37,-0 24.225,10.854 24.225,24.225l-0,296.51Z" style="fill:none;stroke:#17181a;stroke-width:7.08px;"/></g><path d="M142.889,161.45c0,-2.953 -2.397,-5.35 -5.351,-5.35l-105.463,-0c-2.953,-0 -5.35,2.397 -5.35,5.35c-0,2.954 2.397,5.351 5.35,5.351l105.463,0c2.954,0 5.351,-2.397 5.351,-5.351Z" style="fill:#e6e6e6;"/><circle cx="84.45" cy="79.022" r="18.665" style="fill:#17181a;"/><circle cx="119.5" cy="43.987" r="18.665" style="fill:#17181a;"/><circle cx="49.5" cy="113.987" r="18.665" style="fill:#17181a;"/></g></svg>';
    }
  });

  // wwwroot/res/next_symbol.svg
  var next_symbol_default;
  var init_next_symbol = __esm({
    "wwwroot/res/next_symbol.svg"() {
      next_symbol_default = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg width="100%" height="100%" viewBox="0 0 344 261" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;"><rect id="next_symbol" x="0.492" y="0.527" width="342.968" height="259.483" style="fill:none;"/><g id="arrow"><g id="back"><path id="dark0" d="M32.355,220.342c-0,-0 61.132,-26.075 104.385,-99.828c38.566,-65.76 1.162,-87.047 -27.067,-87.962c-37.58,-1.218 -67.382,27.415 -61.446,70.044c5.602,40.23 24.507,68.152 72.71,72.115c48.202,3.964 151.837,-23.058 151.837,-23.058" style="fill:none;stroke:#024f1a;stroke-width:57.26px;"/><path id="dark1" d="M205.515,122.239l97.927,13.031c6.246,5.662 -40.578,43.351 -84.044,94.081" style="fill:none;stroke:#024f1a;stroke-width:58.33px;"/></g><g id="fore"><path id="light0" d="M32.355,220.342c-0,-0 61.132,-26.075 104.385,-99.828c38.566,-65.76 1.162,-87.047 -27.067,-87.962c-37.58,-1.218 -67.382,27.415 -61.446,70.044c5.602,40.23 24.507,68.152 72.71,72.115c48.202,3.964 151.837,-23.058 151.837,-23.058" style="fill:none;stroke:#029430;stroke-width:25.55px;"/><path id="light1" d="M206.149,122.239l97.293,13.031c5.605,4.258 -41.415,41.27 -84.044,94.081" style="fill:none;stroke:#029430;stroke-width:25.55px;"/></g></g></svg>';
    }
  });

  // wwwroot/res/0.svg
  var __default;
  var init__ = __esm({
    "wwwroot/res/0.svg"() {
      __default = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg width="100%" height="100%" viewBox="0 0 51 55" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;"><rect id="_0" serif:id="0" x="0" y="0" width="51" height="55" style="fill:none;"/><path id="p0" d="M14.991,8.46c-4.959,2.226 -15.569,41.5 8.858,39.542c20.587,-1.651 19.339,-22.547 18.252,-26.578c-2.151,-7.977 -11.763,-15.373 -24.892,-14.412" style="fill:none;stroke:#17181a;stroke-width:12.5px;"/></svg>';
    }
  });

  // wwwroot/res/1.svg
  var __default2;
  var init__2 = __esm({
    "wwwroot/res/1.svg"() {
      __default2 = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg width="100%" height="100%" viewBox="0 0 22 57" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;"><rect id="_1" serif:id="1" x="0" y="0" width="22" height="57" style="fill:none;"/><path d="M15.09,49.454l-0.225,-41.06" style="fill:none;stroke:#17181a;stroke-width:12.5px;"/><path d="M14.877,8.246l-8.186,5.594" style="fill:none;stroke:#17181a;stroke-width:12.5px;"/></svg>';
    }
  });

  // wwwroot/res/2.svg
  var __default3;
  var init__3 = __esm({
    "wwwroot/res/2.svg"() {
      __default3 = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg width="100%" height="100%" viewBox="0 0 50 56" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;"><rect id="_2" serif:id="2" x="0" y="0" width="50" height="56" style="fill:none;"/><path d="M12.321,15.349c0,0 18.181,-17.463 18.831,2.375c0.339,10.349 -15.099,24.939 -15.099,29.689c6.617,2.545 23.412,-1.357 23.412,-1.357" style="fill:none;stroke:#17181a;stroke-width:12.5px;"/></svg>';
    }
  });

  // wwwroot/res/3.svg
  var __default4;
  var init__4 = __esm({
    "wwwroot/res/3.svg"() {
      __default4 = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg width="100%" height="100%" viewBox="0 0 33 55" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;"><rect id="_3" serif:id="3" x="0" y="0" width="33" height="54.984" style="fill:none;"/><path d="M6.959,7.492c0,-0 16.158,-2.779 16.158,5.757c0,8.536 -10.299,14.701 -10.299,14.701c-0,-0 13.328,-0.673 13.328,10.61c0,11.283 -15.481,8.973 -15.481,8.973" style="fill:none;stroke:#17181a;stroke-width:12.5px;"/></svg>';
    }
  });

  // wwwroot/res/4.svg
  var __default5;
  var init__5 = __esm({
    "wwwroot/res/4.svg"() {
      __default5 = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg width="100%" height="100%" viewBox="0 0 38 57" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;"><rect id="_4" serif:id="4" x="0" y="0" width="38" height="57" style="fill:none;"/><path d="M30.123,6.843l-0.219,42.851" style="fill:none;stroke:#17181a;stroke-width:8.15px;"/><path d="M8.278,7.069l-0.732,18.783c7.477,0.837 14.908,0.766 21.803,-0.725" style="fill:none;stroke:#17181a;stroke-width:12.5px;"/><path d="M30.123,6.843l-0.219,42.851" style="fill:none;stroke:#17181a;stroke-width:12.5px;"/></svg>';
    }
  });

  // wwwroot/res/5.svg
  var __default6;
  var init__6 = __esm({
    "wwwroot/res/5.svg"() {
      __default6 = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg width="100%" height="100%" viewBox="0 0 38 57" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;"><rect id="_5" serif:id="5" x="0" y="0" width="38" height="56.044" style="fill:none;"/><path d="M30.803,7.497l-20.439,0.935l-0.668,15.363c-0,-0 19.905,-3.073 20.706,13.359c0.582,11.923 -15.095,14.294 -23.378,8.549" style="fill:none;stroke:#17181a;stroke-width:12.5px;"/></svg>';
    }
  });

  // wwwroot/res/6.svg
  var __default7;
  var init__7 = __esm({
    "wwwroot/res/6.svg"() {
      __default7 = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg width="100%" height="100%" viewBox="0 0 41 61" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;"><rect id="_6" serif:id="6" x="0" y="0" width="41" height="61" style="fill:none;"/><path d="M21.267,7.196c-0,0 -27.174,34.418 -7.567,45.15c15.198,5.605 21.41,-5.122 20.459,-11.982c-0.846,-6.099 -10.424,-15.885 -25.727,-5.977" style="fill:none;stroke:#17181a;stroke-width:12.5px;"/></svg>';
    }
  });

  // wwwroot/res/7.svg
  var __default8;
  var init__8 = __esm({
    "wwwroot/res/7.svg"() {
      __default8 = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg width="100%" height="100%" viewBox="0 0 37 54" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;"><rect id="_7" serif:id="7" x="0" y="0" width="37" height="53.961" style="fill:none;"/><path d="M6.817,7.489c3.361,0.556 22.951,-0.612 22.951,-0.612l-14.689,39.476" style="fill:none;stroke:#17181a;stroke-width:12.5px;"/></svg>';
    }
  });

  // wwwroot/res/8.svg
  var __default9;
  var init__9 = __esm({
    "wwwroot/res/8.svg"() {
      __default9 = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg width="100%" height="100%" viewBox="0 0 39 58" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;"><rect id="_8" serif:id="8" x="-0" y="0" width="39" height="58" style="fill:none;"/><path d="M7.639,20.821c-1.938,-5.138 4.142,-10.871 9.538,-12.664c9.068,-3.012 14.112,3.569 14.391,8.123c0.709,11.605 -23.783,15.513 -22.268,28.184c0.474,3.96 6.453,6.574 9.829,5.927c6.641,-1.272 9.248,-5.399 9.12,-9.054c-0.298,-8.555 -17.864,-13.236 -20.61,-20.516Z" style="fill:none;stroke:#17181a;stroke-width:12.5px;"/></svg>';
    }
  });

  // wwwroot/res/9.svg
  var __default10;
  var init__10 = __esm({
    "wwwroot/res/9.svg"() {
      __default10 = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg width="100%" height="100%" viewBox="0 0 41 56" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;">\n    <g transform="matrix(1,0,0,1,-10610,-7096)">\n        <g id="_9" serif:id="9" transform="matrix(1.18909,0,0,1.10645,-2010.28,-758.892)">\n            <rect x="10613.4" y="7099.17" width="34.48" height="50.612" style="fill:none;"/>\n            <g transform="matrix(-1.46724,1.93107e-16,-1.79686e-16,-1.57684,30622.2,86706.3)">\n                <path d="M13626,50457C13626,50457 13611.1,50475 13621.8,50480.6C13630.1,50483.5 13633.5,50477.9 13633,50474.3C13632.5,50471.1 13627.3,50466 13619,50471.2" style="fill:none;stroke:rgb(23,24,26);stroke-width:7.16px;"/>\n            </g>\n        </g>\n    </g>\n</svg>\n';
    }
  });

  // wwwroot/res/trophy.svg
  var trophy_default;
  var init_trophy = __esm({
    "wwwroot/res/trophy.svg"() {
      trophy_default = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg width="100%" height="100%" viewBox="0 0 161 161" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><rect id="trophy" x="0.761" y="0.846" width="160" height="160" style="fill:none;"/><path d="M65.407,106.483c-22.123,-1.177 -22.385,-23.253 -22.385,-23.253c0,0 -27.84,-8.205 -28.831,-34.99c-0.99,-26.785 19.586,-28.294 29.822,-20.935l0.66,-3.532l69.012,-0.295l0.33,4.71c0,-0 33.351,-14.128 33.351,18.838c-0,32.966 -32.69,35.615 -32.69,35.615c-0,0 5.038,23.842 -18.076,23.842c-1.651,3.827 0.347,16.778 0.347,16.778c0,-0 34.239,-1.06 34.239,14.835l-102.363,0.117c0.265,-9.966 17.746,-14.658 34.586,-14.658l1.998,-17.072Zm-22.176,-32.363c-0,-0 -17.943,-9.842 -17.943,-24.019c-0,-11.586 8.094,-20.852 17.943,-13.292l-0,37.311Zm72.223,-35.36l0.547,33.165c0,0 18.728,-8.395 18.728,-22.497c-0,-14.984 -14.077,-17.984 -19.275,-10.668Z" style="fill:#ffdf00;"/><path d="M40.399,14.743c1.29,-0.612 2.727,-0.954 4.232,-0.96l69.012,-0.294c2.56,-0.011 4.911,0.945 6.692,2.535c1.793,-0.341 3.731,-0.614 5.732,-0.745c6.793,-0.447 14.128,0.797 19.983,5.069c6.102,4.452 11.306,12.316 11.306,26.678c-0,29.317 -20.207,39.895 -32.546,43.621c-0.432,5.548 -2.049,12.328 -6.759,17.449c-2.13,2.316 -4.85,4.42 -8.378,5.94c6.102,0.733 13.209,2.165 18.661,4.949c7.877,4.022 12.842,10.404 12.842,19.111c-0,5.512 -4.466,9.983 -9.979,9.989l-102.362,0.118c-2.697,0.003 -5.281,-1.085 -7.164,-3.016c-1.883,-1.931 -2.905,-4.542 -2.834,-7.238c0.157,-5.935 2.981,-11.159 8.333,-15.241c5.771,-4.401 15.517,-7.399 26.108,-8.58c-12.942,-4.937 -17.612,-16.39 -19.296,-23.847c-10.055,-4.809 -28.863,-17.056 -29.774,-41.672c-0.553,-14.969 4.518,-24.004 10.754,-29.14c7.289,-6.004 17.024,-7.044 25.437,-4.726Zm25.008,91.74l-1.998,17.072c-16.84,-0 -34.321,4.692 -34.586,14.658l102.363,-0.117c-0,-15.895 -34.239,-14.835 -34.239,-14.835c0,-0 -1.998,-12.951 -0.347,-16.778c23.114,0 18.076,-23.842 18.076,-23.842c-0,0 32.69,-2.649 32.69,-35.615c-0,-32.966 -33.351,-18.838 -33.351,-18.838l-0.33,-4.71l-69.012,0.295l-0.66,3.532c-10.236,-7.359 -30.812,-5.85 -29.822,20.935c0.991,26.785 28.831,34.99 28.831,34.99c0,0 0.262,22.076 22.385,23.253Zm-22.176,-32.363c-0,-0 -17.943,-9.842 -17.943,-24.019c-0,-11.586 8.094,-20.852 17.943,-13.292l-0,37.311Zm72.223,-35.36c5.198,-7.316 19.275,-4.316 19.275,10.668c-0,14.102 -18.728,22.497 -18.728,22.497l-0.547,-33.165Z" style="fill:#8d8008;"/></svg>';
    }
  });

  // wwwroot/res/trophy_off.svg
  var trophy_off_default;
  var init_trophy_off = __esm({
    "wwwroot/res/trophy_off.svg"() {
      trophy_off_default = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg width="100%" height="100%" viewBox="0 0 161 161" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><rect id="trophy_off" x="0.055" y="0.637" width="160" height="160" style="fill:none;"/><path d="M64.701,106.274c-22.123,-1.177 -22.385,-23.253 -22.385,-23.253c-0,0 -27.84,-8.205 -28.831,-34.99c-0.99,-26.785 19.585,-28.293 29.821,-20.935l0.661,-3.532l69.012,-0.294l0.33,4.709c0,0 33.35,-14.128 33.35,18.838c0,32.966 -32.69,35.616 -32.69,35.616c0,-0 5.039,23.841 -18.075,23.841c-1.651,3.827 0.347,16.778 0.347,16.778c0,-0 34.238,-1.06 34.238,14.835l-102.362,0.117c0.264,-9.966 17.746,-14.658 34.586,-14.658l1.998,-17.072Zm-22.177,-32.363c0,0 -17.943,-9.842 -17.943,-24.019c0,-11.585 8.095,-20.852 17.943,-13.292l0,37.311Zm72.224,-35.36l0.547,33.165c-0,0 18.727,-8.395 18.727,-22.497c0,-14.984 -14.077,-17.984 -19.274,-10.668Z" style="fill:#e3e3e3;"/></svg>';
    }
  });

  // wwwroot/res/6x6.svg
  var x6_default;
  var init_x6 = __esm({
    "wwwroot/res/6x6.svg"() {
      x6_default = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg width="100%" height="100%" viewBox="0 0 17 7" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;"><rect id="_6x6" serif:id="6x6" x="0" y="0.229" width="16.32" height="6.72" style="fill:none;"/><path d="M3.309,1.21c-0,-0 -2.947,3.564 -0.821,4.676c1.648,0.58 2.322,-0.531 2.219,-1.241c-0.092,-0.632 -1.131,-1.645 -2.79,-0.619" style="fill:none;stroke:#18191c;stroke-width:0.98px;"/><path d="M13.349,1.21c0,-0 -2.947,3.564 -0.821,4.676c1.649,0.58 2.322,-0.531 2.219,-1.241c-0.092,-0.632 -1.13,-1.645 -2.79,-0.619" style="fill:none;stroke:#18191c;stroke-width:0.98px;"/><path d="M6.837,5.106l2.839,-2.3" style="fill:none;stroke:#18191c;stroke-width:0.63px;stroke-miterlimit:1;"/><path d="M7.216,2.933l2.203,2.055" style="fill:none;stroke:#18191c;stroke-width:0.63px;stroke-miterlimit:1;"/></svg>';
    }
  });

  // wwwroot/res/7x7.svg
  var x7_default;
  var init_x7 = __esm({
    "wwwroot/res/7x7.svg"() {
      x7_default = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg width="100%" height="100%" viewBox="0 0 17 7" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;"><rect id="_7x7" serif:id="7x7" x="0" y="0" width="16.32" height="6.72" style="fill:none;"/><path d="M2.272,1.471c0.365,0.061 2.494,-0.066 2.494,-0.066l-1.596,4.29" style="fill:none;stroke:#17181a;stroke-width:1px;"/><path d="M11.862,1.471c0.366,0.061 2.495,-0.066 2.495,-0.066l-1.597,4.29" style="fill:none;stroke:#17181a;stroke-width:1px;"/><path d="M6.837,4.989l2.839,-2.301" style="fill:none;stroke:#18191c;stroke-width:0.63px;stroke-miterlimit:1;"/><path d="M7.216,2.815l2.203,2.056" style="fill:none;stroke:#18191c;stroke-width:0.63px;stroke-miterlimit:1;"/></svg>';
    }
  });

  // wwwroot/res/8x8.svg
  var x8_default;
  var init_x8 = __esm({
    "wwwroot/res/8x8.svg"() {
      x8_default = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg width="100%" height="100%" viewBox="0 0 17 7" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;"><rect id="_8x8" serif:id="8x8" x="0" y="-0" width="16.32" height="6.72" style="fill:none;"/><path d="M1.85,2.489c-0.214,-0.566 0.456,-1.198 1.05,-1.395c0.999,-0.332 1.555,0.393 1.585,0.895c0.079,1.278 -2.619,1.708 -2.452,3.104c0.052,0.436 0.71,0.724 1.082,0.653c0.732,-0.14 1.019,-0.595 1.005,-0.997c-0.033,-0.943 -1.968,-1.458 -2.27,-2.26Z" style="fill:none;stroke:#17181a;stroke-width:1px;"/><path d="M11.926,2.489c-0.214,-0.566 0.456,-1.198 1.05,-1.395c0.999,-0.332 1.555,0.393 1.586,0.895c0.078,1.278 -2.62,1.708 -2.453,3.104c0.052,0.436 0.711,0.724 1.082,0.653c0.732,-0.14 1.019,-0.595 1.005,-0.997c-0.033,-0.943 -1.968,-1.458 -2.27,-2.26Z" style="fill:none;stroke:#17181a;stroke-width:1px;"/><path d="M6.837,4.944l2.839,-2.3" style="fill:none;stroke:#18191c;stroke-width:0.63px;stroke-miterlimit:1;"/><path d="M7.216,2.77l2.203,2.056" style="fill:none;stroke:#18191c;stroke-width:0.63px;stroke-miterlimit:1;"/></svg>';
    }
  });

  // wwwroot/src/svgs.tsx
  function svgToHtml(svgString) {
    var document2 = parser.parseFromString(svgString, "image/svg+xml");
    var svgToReturn = document2.documentElement;
    svgToReturn.style.height = "100%";
    svgToReturn.style.width = "auto";
    return svgToReturn;
  }
  function svgToAnimatedHtml(svgString, totalMS = 1e3, msBetweenStroke = 0) {
    var svg = svgToHtml(svgString);
    var paths = [...svg.querySelectorAll("path")];
    var pathGroups = [];
    for (var i = 0; i < 9; ++i)
      pathGroups.push(paths.filter((p2) => p2.id && p2.id.endsWith(i.toString())));
    pathGroups = pathGroups.filter((g) => g.length != 0);
    var lengthOfAllSegments = 0;
    for (var pg of pathGroups) {
      lengthOfAllSegments += pg[0].getTotalLength();
    }
    var i = 0;
    var currTime = 0;
    for (var pg of pathGroups) {
      var pathEl = pg[0];
      var totalLength = pathEl.getTotalLength();
      var timeToSpend = totalLength / lengthOfAllSegments * totalMS / 1e3;
      const styleSheet = document.createElement("style");
      styleSheet.type = "text/css";
      styleSheet.innerHTML = `
        @keyframes animateSvgPath${i} {
            from {
                stroke-dashoffset: ${totalLength};
            }
            to {
                stroke-dashoffset: 0;
            }
        }
    `;
      svg.appendChild(styleSheet);
      for (var p of pg) {
        p.style.strokeDasharray = totalLength.toString();
        p.style.strokeDashoffset = totalLength.toString();
        p.style.animation = `animateSvgPath${i} ${timeToSpend}s ease-out forwards`;
        p.style.animationDelay = `${currTime}s`;
      }
      currTime += timeToSpend;
      currTime += msBetweenStroke / 1e3;
      i++;
    }
    return svg;
  }
  function numberToHtml(int) {
    var num = numbers[int % 10];
    var svg1 = svgToHtml(num);
    var svg2 = null;
    if (int >= 10) {
      var num2 = numbers[Math.floor(int / 10) % 10];
      svg2 = svgToHtml(num2);
      return /* @__PURE__ */ L.jsxFactory("div", {
        style: "display:flex; justify-content:center; align-items:center; width:100%; height:100%"
      }, /* @__PURE__ */ L.jsxFactory("div", {
        style: "display:flex; height:75%"
      }, svg2), /* @__PURE__ */ L.jsxFactory("div", {
        style: "display:flex; height:75%"
      }, svg1));
    }
    return /* @__PURE__ */ L.jsxFactory("div", {
      style: "display:flex; justify-content:center; align-items:center; width:100%; height:100%"
    }, /* @__PURE__ */ L.jsxFactory("div", {
      style: "display:flex; height:75%"
    }, svg1));
  }
  var ud10, lr02, lr01, ud20, lr00, lr13, lr12, ud30, dom, parser, numbers;
  var init_svgs = __esm({
    "wwwroot/src/svgs.tsx"() {
      init_l();
      init_ud10();
      init_lr02();
      init_lr01();
      init_ud20();
      init_lr00();
      init_lr13();
      init_lr12();
      init_ud30();
      init_next_symbol();
      init__();
      init__2();
      init__3();
      init__4();
      init__5();
      init__6();
      init__7();
      init__8();
      init__9();
      init__10();
      init_trophy();
      init_trophy_off();
      init_x6();
      init_x7();
      init_x8();
      ud10 = { v0: 1, v1: 0, svg: ud10_default };
      lr02 = { v0: 0, v1: 2, svg: lr02_default };
      lr01 = { v0: 0, v1: 1, svg: lr01_default };
      ud20 = { v0: 2, v1: 0, svg: ud20_default };
      lr00 = { v0: 0, v1: 0, svg: lr00_default };
      lr13 = { v0: 1, v1: 3, svg: lr13_default };
      lr12 = { v0: 1, v1: 2, svg: lr12_default };
      ud30 = { v0: 3, v1: 0, svg: ud30_default };
      dom = { ud10, lr02, lr01, ud20, lr13, lr12, ud30, lr00 };
      parser = new DOMParser();
      numbers = [__default, __default2, __default3, __default4, __default5, __default6, __default7, __default8, __default9, __default10];
    }
  });

  // wwwroot/src/constants.ts
  var dom_def;
  var init_constants = __esm({
    "wwwroot/src/constants.ts"() {
      init_svgs();
      dom_def = { lr: dom.lr02, ud: dom.ud10 };
    }
  });

  // wwwroot/src/board.tsx
  var Board;
  var init_board = __esm({
    "wwwroot/src/board.tsx"() {
      init_l();
      init_svgs();
      init_constants();
      Board = class {
        constructor(def, addBorder = false) {
          this.addBorder = addBorder;
          this.dominoes = [];
          this.blocks = [];
          this.topRow = [];
          this.bottomRow = [];
          this.dominoUpdate = new L.Ev();
          this.td = 1;
          this.bd = 1;
          this.rd = 1;
          this.ld = 1;
          this.zAt = 0;
          var _a, _b, _c, _d, _e, _f;
          this.ogDef = def;
          this.w = def.colSums.length;
          this.h = def.rowSums.length;
          this.rowSums = def.rowSums.map((g) => {
            return { elLeft: /* @__PURE__ */ L.jsxFactory("div", {
              class: "pText pLeftRight svgPath-black"
            }, numberToHtml(g)), elRight: /* @__PURE__ */ L.jsxFactory("div", {
              class: "pText pLeftRight svgPath-black"
            }, numberToHtml(g)), goal: g };
          });
          this.colSums = def.colSums.map((g) => {
            return { elTop: /* @__PURE__ */ L.jsxFactory("div", {
              class: "pText pTopBot svgPath-black"
            }, numberToHtml(g)), elBottom: /* @__PURE__ */ L.jsxFactory("div", {
              class: "pText pTopBot svgPath-black"
            }, numberToHtml(g)), goal: g };
          });
          this.squares = [];
          for (var y = 0; y < def.board.length; ++y) {
            var toAdd = [];
            for (var x = 0; x < def.board[0].length; ++x) {
              var el;
              var classString = "";
              var borderStr = "";
              if (addBorder)
                borderStr = "b";
              if (x == 0 && y == 0)
                classString = "sq sqBottomLeft" + borderStr;
              else if (x == def.board[0].length - 1 && y == def.board.length - 1)
                classString = "sq sqTopRight" + borderStr;
              else if (x == 0 && y == def.board.length - 1)
                classString = "sq sqTopLeft" + borderStr;
              else if (x == def.board[0].length - 1 && y == 0)
                classString = "sq sqBottomRight" + borderStr;
              else if (x == 0)
                classString = "sq sqLeft" + borderStr;
              else if (y == 0)
                classString = "sq sqBottom" + borderStr;
              else if (x == def.board[0].length - 1)
                classString = "sq sqRight" + borderStr;
              else if (y == def.board.length - 1)
                classString = "sq sqTop" + borderStr;
              else
                classString = "sq";
              el = /* @__PURE__ */ L.jsxFactory("div", {
                class: classString,
                contenteditable: "false"
              });
              var sq = { el, val: 0, hasDomino: false, isBlackTile: !def.board[y][x], x, y };
              if ((y + x) % 2 == 0) {
                sq.el.classList.add("sqTinted");
              }
              toAdd.push(sq);
            }
            this.squares.push(toAdd);
          }
          for (var sq of this.SquaresIter()) {
            if (!sq.isBlackTile)
              continue;
            var mods = [];
            if ((_a = this.TrySquare(sq.x, sq.y + 1)) == null ? void 0 : _a.isBlackTile)
              mods.push("sqBlackTopOpen");
            if ((_b = this.TrySquare(sq.x, sq.y - 1)) == null ? void 0 : _b.isBlackTile)
              mods.push("sqBlackBottomOpen");
            if ((_c = this.TrySquare(sq.x + 1, sq.y)) == null ? void 0 : _c.isBlackTile)
              mods.push("sqBlackRightOpen");
            if ((_d = this.TrySquare(sq.x - 1, sq.y)) == null ? void 0 : _d.isBlackTile)
              mods.push("sqBlackLeftOpen");
            var top = /* @__PURE__ */ L.jsxFactory("div", {
              class: "sqBlockTop"
            });
            var outline = /* @__PURE__ */ L.jsxFactory("div", {
              class: "sqBlockOutline"
            });
            var blackTileEl = /* @__PURE__ */ L.jsxFactory("div", {
              class: "sqBlockShadow"
            }, outline, top);
            this.blocks.push(blackTileEl);
            top.classList.add(...mods);
            outline.classList.add(...mods);
            blackTileEl.classList.add(...mods);
            blackTileEl.style.zIndex = `${this.incrZ(sq.y)}`;
            top.style.zIndex = `${this.incrZ(sq.y)}`;
            outline.style.zIndex = `${this.incrZ(sq.y)}`;
            if (((_e = this.TrySquare(sq.x, sq.y + 1)) == null ? void 0 : _e.isBlackTile) && this.TrySquare(sq.x + 1, sq.y + 1) && !this.TrySquare(sq.x + 1, sq.y + 1).isBlackTile && this.TrySquare(sq.x + 1, sq.y) && this.TrySquare(sq.x + 1, sq.y).isBlackTile)
              blackTileEl.appendChild(/* @__PURE__ */ L.jsxFactory("div", {
                class: "blockTRPatch"
              }));
            if (((_f = this.TrySquare(sq.x, sq.y + 1)) == null ? void 0 : _f.isBlackTile) && this.TrySquare(sq.x - 1, sq.y + 1) && !this.TrySquare(sq.x - 1, sq.y + 1).isBlackTile && this.TrySquare(sq.x - 1, sq.y) && this.TrySquare(sq.x - 1, sq.y).isBlackTile)
              blackTileEl.appendChild(/* @__PURE__ */ L.jsxFactory("div", {
                class: "blockTLPatch"
              }));
            sq.el.appendChild(blackTileEl);
          }
          var rows = [];
          this.topRow.push(/* @__PURE__ */ L.jsxFactory("div", {
            class: "pCorner"
          }));
          this.topRow.push(...this.colSums.map((s) => s.elTop));
          this.topRow.push(/* @__PURE__ */ L.jsxFactory("div", {
            class: "pCorner"
          }));
          rows.push(/* @__PURE__ */ L.jsxFactory("div", {
            class: "row"
          }, this.topRow));
          for (var i = 0; i < this.squares.length; ++i) {
            var y = this.squares.length - 1 - i;
            rows.push(/* @__PURE__ */ L.jsxFactory("div", {
              class: "row"
            }, this.rowSums[y].elLeft, this.squares[y].map((sq2) => sq2.el), this.rowSums[y].elRight));
          }
          this.bottomRow.push(/* @__PURE__ */ L.jsxFactory("div", {
            class: "pCorner"
          }));
          this.bottomRow.push(...this.colSums.map((s) => s.elBottom));
          this.bottomRow.push(/* @__PURE__ */ L.jsxFactory("div", {
            class: "pCorner"
          }));
          rows.push(/* @__PURE__ */ L.jsxFactory("div", {
            class: "row"
          }, this.bottomRow));
          this.el = /* @__PURE__ */ L.jsxFactory("div", {
            class: "board"
          }, rows);
        }
        *SquaresIter() {
          for (var y = 0; y < this.squares.length; ++y)
            for (var x = 0; x < this.squares[y].length; ++x)
              yield this.squares[y][x];
        }
        IsOpen(x, y) {
          if (this.squares[y] === void 0 || this.squares[y][x] === void 0)
            return false;
          var sq = this.squares[y][x];
          if (sq.hasDomino || sq.isBlackTile)
            return false;
          return true;
        }
        TrySquare(x, y) {
          if (this.squares[y] === void 0 || this.squares[y][x] === void 0)
            return null;
          return this.squares[y][x];
        }
        getSqPxBounds(x, y) {
          if (this.squares[y] === void 0 || this.squares[y][x] === void 0)
            return { left: 0, bottom: 0, right: 0, top: 0 };
          else {
            var rect = this.squares[y][x].el.getClientRects()[0];
            if (!rect)
              return { left: 0, bottom: 0, right: 0, top: 0 };
            return {
              left: rect.left,
              bottom: rect.bottom,
              right: rect.right,
              top: rect.top
            };
          }
        }
        getRawPxBounds() {
          var blSq = this.getSqPxBounds(0, 0);
          var trSq = this.getSqPxBounds(this.w - 1, this.h - 1);
          return { left: blSq.left, bottom: blSq.bottom, right: trSq.right, top: trSq.top };
        }
        changeVisState(visState) {
          for (var el of this.topRow)
            el.style.visibility = visState;
          for (var el of this.bottomRow)
            el.style.visibility = visState;
          this.bottomRow[this.w + 1].style.visibility = visState;
          this.topRow[this.w + 1].style.visibility = visState;
          for (var rs of this.rowSums)
            rs.elRight.style.visibility = visState;
          this.bottomRow[0].style.visibility = visState;
          this.topRow[0].style.visibility = visState;
          for (var rs of this.rowSums)
            rs.elLeft.style.visibility = visState;
        }
        MakeBlocksVisibleAnimation() {
          for (var block of this.blocks) {
            block.style.clipPath = "polygon(0% -30%, 100% -30%, 100% 100%, 0% 100%)";
          }
        }
        MakeNumbersVisibleAnimation() {
          var visState = "visible";
          for (var el of this.topRow) {
            el.style.visibility = visState;
            el.classList.add("pAnimStart");
            el.classList.add("pAnimTopStart");
            el.clientWidth;
            el.classList.add("pAnimEndTopBottom");
            el.classList.add("pAnimEnd");
          }
          for (var el of this.bottomRow) {
            el.style.visibility = visState;
            el.classList.add("pAnimStart");
            el.classList.add("pAnimBottomStart");
            el.clientWidth;
            el.classList.add("pAnimEndTopBottom");
            el.classList.add("pAnimEnd");
          }
          this.bottomRow[this.w + 1].style.visibility = visState;
          this.topRow[this.w + 1].style.visibility = visState;
          for (var rs of this.rowSums) {
            var el = rs.elRight;
            el.style.visibility = visState;
            el.classList.add("pAnimStart");
            el.classList.add("pAnimRightStart");
            el.clientWidth;
            el.classList.add("pAnimEndLeftRight");
            el.classList.add("pAnimEnd");
          }
          this.bottomRow[0].style.visibility = visState;
          this.topRow[0].style.visibility = visState;
          for (var rs of this.rowSums) {
            var el = rs.elLeft;
            el.style.visibility = visState;
            el.classList.add("pAnimStart");
            el.classList.add("pAnimLeftStart");
            el.clientWidth;
            el.classList.add("pAnimEndLeftRight");
            el.classList.add("pAnimEnd");
          }
        }
        MakeNumbersVisible() {
          this.changeVisState("visible");
        }
        MakeNumbersInvisible() {
          this.changeVisState("hidden");
        }
        ShowTop() {
          for (var el of this.topRow)
            el.style.display = "block";
          this.td = 1;
        }
        HideTop() {
          for (var el of this.topRow)
            el.style.display = "none";
          this.td = 0;
        }
        ShowBottom() {
          for (var el of this.bottomRow)
            el.style.display = "block";
          this.bd = 1;
        }
        HideBottom() {
          for (var el of this.bottomRow)
            el.style.display = "none";
          this.bd = 0;
        }
        ShowRight() {
          this.bottomRow[this.w + 1].style.display = "block";
          this.topRow[this.w + 1].style.display = "block";
          for (var rs of this.rowSums)
            rs.elRight.style.display = "block";
          this.rd = 1;
        }
        HideRight() {
          this.bottomRow[this.w + 1].style.display = "none";
          this.topRow[this.w + 1].style.display = "none";
          for (var rs of this.rowSums)
            rs.elRight.style.display = "none";
          this.rd = 0;
        }
        ShowLeft() {
          this.bottomRow[0].style.display = "block";
          this.topRow[0].style.display = "block";
          for (var rs of this.rowSums)
            rs.elLeft.style.display = "block";
          this.ld = 1;
        }
        HideLeft() {
          this.bottomRow[0].style.display = "none";
          this.topRow[0].style.display = "none";
          for (var rs of this.rowSums)
            rs.elLeft.style.display = "none";
          this.ld = 0;
        }
        UnsetWidth() {
          this.el.style.setProperty("--sSize", `unset`);
        }
        SnapVminToPixel(prop) {
          var marg = window.getComputedStyle(document.documentElement).getPropertyValue(prop);
          var pTextMargin = parseFloat(marg);
          var px = this.vminToPixels(pTextMargin);
          px = Math.floor(px);
          this.el.style.setProperty(prop, `${px}px`);
          return px;
        }
        SetWidth(totalVw) {
          var _a;
          var zoomLevel = (_a = L.TryGetZoomLevel()) != null ? _a : 1;
          zoomLevel = L.Clamp(zoomLevel, 0.66666, 1);
          var pTextMargin = this.SnapVminToPixel("--pTextMargin");
          pTextMargin = this.pxToVmins(pTextMargin);
          var vwShrink = pTextMargin * this.ld * 2 + pTextMargin * this.rd * 2;
          var sSize = (totalVw - vwShrink) / (this.w + 1 / 2 * this.ld + 1 / 2 * this.rd);
          sSize = sSize * zoomLevel;
          var ssizePX = this.vminToPixels(sSize);
          ssizePX = Math.round(ssizePX);
          if (ssizePX % 2 == 1)
            ssizePX -= 1;
          this.el.style.setProperty("--sSize", `${ssizePX}px`);
        }
        vminToPixels(vmin) {
          const vw = Math.min(window.innerWidth, window.innerHeight);
          return vw / 100 * vmin;
        }
        pxToVmins(px) {
          const vw = Math.min(window.innerWidth, window.innerHeight);
          return px * (100 / vw);
        }
        SetWidthDesktop() {
          var _a;
          var zoomLevel = (_a = L.TryGetZoomLevel()) != null ? _a : 1;
          zoomLevel = L.Clamp(zoomLevel, 0.66666, 1);
          this.SnapVminToPixel("--pTextMargin");
          var rootStyle = getComputedStyle(document.documentElement);
          var sSizeValue = rootStyle.getPropertyValue("--sSize").trim();
          var ssize = parseFloat(sSizeValue);
          var scale = 6 / this.h;
          ssize = ssize * scale;
          ssize = ssize * zoomLevel;
          var ssizePX = this.vminToPixels(ssize);
          ssizePX = Math.round(ssizePX);
          if (ssizePX % 2 == 1)
            ssizePX -= 1;
          this.el.style.setProperty("--sSize", `${ssizePX}px`);
        }
        incrZ(y) {
          this.zAt += 1;
          return this.zAt + (this.h - 1 - y) * 1e5;
        }
        AddUd(x, y) {
          if (!(this.IsOpen(x, y) && this.IsOpen(x, y + 1))) {
            return false;
          }
          var d = Board.Ud();
          var domino = { x1: x, y1: y, x2: x, y2: y + 1, el: d, isUd: true };
          this.dominoes.push(domino);
          var zMod = this.incrZ(y + 1);
          d.style.zIndex = `${zMod + 19e4}`;
          d.classList.add("placeStart");
          this.squares[y + 1][x].el.append(d);
          d.clientWidth;
          d.style.zIndex = `${zMod}`;
          d.classList.add("placeEnd");
          this.squares[y + 1][x].val = dom_def.ud.v0;
          this.squares[y + 1][x].hasDomino = true;
          this.squares[y][x].val = dom_def.ud.v1;
          this.squares[y][x].hasDomino = true;
          this.UpdateBoard();
          this.dominoUpdate.trigger({ play: { ud: true, x: domino.x1, y: domino.y1 }, type: "add" });
          return true;
        }
        Remove(x, y) {
          for (var i = 0; i < this.dominoes.length; ++i) {
            var domino = this.dominoes[i];
            if (domino.x1 == x && domino.y1 == y || domino.x2 == x && domino.y2 == y) {
              var sq1 = this.squares[domino.y1][domino.x1];
              var sq2 = this.squares[domino.y2][domino.x2];
              domino.el.remove();
              sq1.val = 0;
              sq1.hasDomino = false;
              sq2.val = 0;
              sq2.hasDomino = false;
              this.dominoes.splice(i, 1);
              this.UpdateBoard();
              this.dominoUpdate.trigger({ play: { ud: false, x: domino.x1, y: domino.y1 }, type: "remove" });
              return true;
            }
          }
          return false;
        }
        static Rl(classToAdd = "") {
          var classes = "rlDom domShadow " + classToAdd;
          var el = svgToHtml(dom_def.lr.svg);
          var d = /* @__PURE__ */ L.jsxFactory("div", {
            class: classes
          }, /* @__PURE__ */ L.jsxFactory("div", {
            class: "domimglr"
          }, el));
          return d;
        }
        static Ud(classToAdd = "") {
          var classes = "udDom domShadow " + classToAdd;
          var el = svgToHtml(dom_def.ud.svg);
          var d = /* @__PURE__ */ L.jsxFactory("div", {
            class: classes
          }, /* @__PURE__ */ L.jsxFactory("div", {
            class: "domimg"
          }, el));
          return d;
        }
        AddPlays(plays) {
          for (var domino of plays) {
            if (domino.ud)
              this.AddUd(domino.x, domino.y);
            else
              this.AddLr(domino.x, domino.y);
          }
        }
        AddLr(x, y) {
          if (!(this.IsOpen(x, y) && this.IsOpen(x + 1, y))) {
            return false;
          }
          var d = Board.Rl();
          var domino = { x1: x, y1: y, x2: x + 1, y2: y, el: d, isUd: false };
          this.dominoes.push(domino);
          d.classList.add("placeStart");
          var zMod = this.incrZ(y);
          d.style.zIndex = `${zMod + 1e5}`;
          this.squares[y][x].el.append(d);
          d.clientWidth;
          d.style.zIndex = `${zMod}`;
          d.classList.add("placeEnd");
          this.squares[y][x].val = dom_def.lr.v0;
          this.squares[y][x].hasDomino = true;
          this.squares[y][x + 1].val = dom_def.lr.v1;
          this.squares[y][x + 1].hasDomino = true;
          this.UpdateBoard();
          this.dominoUpdate.trigger({ play: { ud: false, x: domino.x1, y: domino.y1 }, type: "add" });
          return true;
        }
        ChangeSvgPathColor(els, col) {
          var classes = ["svgPath-red", "svgPath-green", "svgPath-black"];
          var toAdd = classes.filter((c) => c.match(col));
          var toRem = classes.filter((c) => !c.match(col));
          for (var el of els) {
            el.classList.remove(...toRem);
            el.classList.add(...toAdd);
          }
        }
        UpdateBoard() {
          var didWin = this.DidWin();
          var dominoMap = {};
          for (var dom2 of this.dominoes) {
            dominoMap[`${dom2.y1},${dom2.x1}`] = dom2;
          }
          for (var i = 0; i < this.rowSums.length; ++i) {
            var sum = 0;
            var areAnyFilled = false;
            for (var sq of this.squares[i]) {
              sum += sq.val;
              if (sq.hasDomino)
                areAnyFilled = true;
            }
            var rowSum = this.rowSums[i];
            if (sum == 0 && areAnyFilled == false)
              sum = -5;
            if (didWin && this.ogDef.gameCode.type != "display")
              this.ChangeSvgPathColor([rowSum.elLeft, rowSum.elRight], "black");
            else if (sum < rowSum.goal)
              this.ChangeSvgPathColor([rowSum.elLeft, rowSum.elRight], "black");
            else if (sum == rowSum.goal)
              this.ChangeSvgPathColor([rowSum.elLeft, rowSum.elRight], "green");
            else if (sum > this.rowSums[i].goal)
              this.ChangeSvgPathColor([rowSum.elLeft, rowSum.elRight], "red");
          }
          for (var x = 0; x < this.w; ++x) {
            var sum = 0;
            var areAnyFilled = false;
            for (var y = 0; y < this.h; ++y) {
              sum += this.squares[y][x].val;
              if (this.squares[y][x].hasDomino)
                areAnyFilled = true;
            }
            var colSum = this.colSums[x];
            if (sum == 0 && areAnyFilled == false)
              sum = -5;
            if (didWin && this.ogDef.gameCode.type != "display")
              this.ChangeSvgPathColor([colSum.elBottom, colSum.elTop], "black");
            else if (sum < colSum.goal)
              this.ChangeSvgPathColor([colSum.elBottom, colSum.elTop], "black");
            else if (sum == colSum.goal)
              this.ChangeSvgPathColor([colSum.elBottom, colSum.elTop], "green");
            else if (sum > colSum.goal)
              this.ChangeSvgPathColor([colSum.elBottom, colSum.elTop], "red");
          }
        }
        plays() {
          var dominos = this.dominoes.map((d) => {
            return { ud: d.isUd, x: d.x1, y: d.y1 };
          });
          return dominos;
        }
        toSaveState() {
          var dominos = this.plays();
          return { gameDef: this.ogDef, dominos };
        }
        Serialize() {
          var saveState = this.toSaveState();
          return JSON.stringify(saveState);
        }
        DidWin() {
          for (var x = 0; x < this.w; ++x) {
            for (var y = 0; y < this.h; ++y) {
              var sq = this.squares[y][x];
              if (!(sq.hasDomino || sq.isBlackTile))
                return false;
            }
          }
          for (var x = 0; x < this.colSums.length; ++x) {
            var sum = 0;
            for (var y = 0; y < this.h; ++y)
              sum += this.squares[y][x].val;
            if (this.colSums[x].goal != sum)
              return false;
          }
          for (var y = 0; y < this.rowSums.length; ++y) {
            var sum = 0;
            for (var x = 0; x < this.w; ++x)
              sum += this.squares[y][x].val;
            if (this.rowSums[y].goal != sum)
              return false;
          }
          return true;
        }
      };
    }
  });

  // wwwroot/src/storage.ts
  var Storage;
  var init_storage = __esm({
    "wwwroot/src/storage.ts"() {
      init_l();
      Storage = class {
        constructor(board, storePrefix = "game_") {
          this.board = board;
          this.storePrefix = storePrefix;
          this.isLoading = false;
          board.dominoUpdate.on((d) => this.onDominoUpdate(d));
        }
        static ClearOldStorageElectron(numToKeep, gidFilter = null) {
          var storage = this.GetStorageElectron();
          var bsids = L.ArrayGroupBy(storage, (s) => s.boardSizeId);
          for (var bsid in bsids) {
            if (gidFilter != null && bsid != gidFilter)
              continue;
            var stores = bsids[bsid];
            stores = stores.sort((a, b) => a.startTime - b.startTime);
            var numToDelete = stores.length - numToKeep;
            var prefixesToDelete = [];
            for (var i = 0; i < numToDelete; ++i) {
              prefixesToDelete.push(stores[i].prefix);
            }
            for (var pfx of prefixesToDelete) {
              localStorage.removeItem(pfx + "startTime");
              localStorage.removeItem(pfx + "endTime");
              localStorage.removeItem(pfx + "gameInProgress");
            }
          }
        }
        static GetStorageElectron() {
          var matchingStorage = [];
          var _xLen, _x;
          for (_x in localStorage) {
            if (!localStorage.hasOwnProperty(_x)) {
              continue;
            }
            if (/game_\d+_\d+startTime/.test(_x)) {
              var bsid = /game_(\d+)_\d+startTime/.exec(_x)[1];
              var pfx = /(game_\d+_\d+)startTime/.exec(_x)[1];
              var st = Number.parseInt(localStorage.getItem(_x));
              var el = {
                prefix: pfx,
                boardSizeId: bsid,
                startTime: st
              };
              el.gameInProgress = localStorage.getItem(pfx + "gameInProgress");
              var endTimeStr = localStorage.getItem(pfx + "endTime");
              if (endTimeStr !== null)
                el.endTime = Number.parseInt(endTimeStr);
              matchingStorage.push(el);
            }
          }
          return matchingStorage;
        }
        static ClearOldStorage(numToKeep) {
          var storage = this.GetStorage();
          var dailies = L.ArrayGroupBy(storage, (s) => s.dailyId.toString());
          var dailyIdxes = Object.keys(dailies);
          dailyIdxes = dailyIdxes.sort((a) => Number.parseInt(a));
          var deleteAmount = dailyIdxes.length - numToKeep;
          for (var i = 0; i < deleteAmount; ++i) {
            var set = dailies[dailyIdxes[i]];
            for (var se of set) {
              localStorage.removeItem(se.prefix + "startTime");
              localStorage.removeItem(se.prefix + "endTime");
              localStorage.removeItem(se.prefix + "gameInProgress");
            }
          }
        }
        static GetStorage() {
          var matchingStorage = [];
          var _xLen, _x;
          for (_x in localStorage) {
            if (!localStorage.hasOwnProperty(_x)) {
              continue;
            }
            if (/game_\d+_\d+startTime/.test(_x)) {
              var strDailyId = /game_(\d+)_\d+startTime/.exec(_x)[1];
              var pfx = /(game_\d+_\d+)startTime/.exec(_x)[1];
              var st = Number.parseInt(localStorage.getItem(_x));
              var did = Number(strDailyId);
              if (isNaN(did))
                continue;
              var el = {
                prefix: pfx,
                dailyId: did,
                startTime: st
              };
              el.gameInProgress = localStorage.getItem(pfx + "gameInProgress");
              var endTimeStr = localStorage.getItem(pfx + "endTime");
              if (endTimeStr !== null)
                el.endTime = Number.parseInt(endTimeStr);
              matchingStorage.push(el);
            }
          }
          return matchingStorage;
        }
        SaveGameTimerStart() {
          var t = L.now();
          var str = this.board.Serialize();
          localStorage.setItem(`${this.storePrefix}gameInProgress`, str);
          localStorage.setItem(`${this.storePrefix}startTime`, t.toString());
        }
        SaveGameTimerEnd() {
          if (localStorage.getItem(`${this.storePrefix}endTime`) != null)
            return;
          var t = L.now();
          var str = this.board.Serialize();
          localStorage.setItem(`${this.storePrefix}endTime`, t.toString());
          localStorage.setItem(`${this.storePrefix}gameInProgress`, str);
          localStorage.setItem(`${this.storePrefix}endTime`, t.toString());
        }
        onDominoUpdate(d) {
          if (this.isLoading)
            return;
          var str = this.board.Serialize();
          localStorage.setItem(`${this.storePrefix}gameInProgress`, str);
        }
        IsGameInProgress() {
          return localStorage.getItem(`${this.storePrefix}gameInProgress`) !== null;
        }
        GetElapsedTime() {
          var endTime = localStorage.getItem(`${this.storePrefix}endTime`);
          var startTime = localStorage.getItem(`${this.storePrefix}startTime`);
          if (startTime == null || endTime == null)
            return "???";
          var diff = Number.parseInt(endTime) - Number.parseInt(startTime);
          return L.msToDisplayString00_00_00dynamic(diff);
        }
        GetElapsedTimeMS() {
          var endTime = localStorage.getItem(`${this.storePrefix}endTime`);
          var startTime = localStorage.getItem(`${this.storePrefix}startTime`);
          return Number.parseInt(endTime) - Number.parseInt(startTime);
        }
        LoadGameFromStorage() {
          this.isLoading = true;
          var saveState = JSON.parse(localStorage.getItem(`${this.storePrefix}gameInProgress`));
          this.board.AddPlays(saveState.dominos);
          this.isLoading = false;
        }
      };
    }
  });

  // wwwroot/lvls/lvls.json
  var lvls_exports = {};
  __export(lvls_exports, {
    default: () => lvls_default,
    gameListList: () => gameListList,
    nGames: () => nGames
  });
  var nGames, gameListList, lvls_default;
  var init_lvls = __esm({
    "wwwroot/lvls/lvls.json"() {
      nGames = 27376;
      gameListList = [
        { endIndex: 500, relUrl: "lvls/split/0.json" },
        { endIndex: 1e3, relUrl: "lvls/split/1.json" },
        { endIndex: 1500, relUrl: "lvls/split/2.json" },
        { endIndex: 2e3, relUrl: "lvls/split/3.json" },
        { endIndex: 2500, relUrl: "lvls/split/4.json" },
        { endIndex: 3e3, relUrl: "lvls/split/5.json" },
        { endIndex: 3500, relUrl: "lvls/split/6.json" },
        { endIndex: 4e3, relUrl: "lvls/split/7.json" },
        { endIndex: 4500, relUrl: "lvls/split/8.json" },
        { endIndex: 5e3, relUrl: "lvls/split/9.json" },
        { endIndex: 5500, relUrl: "lvls/split/10.json" },
        { endIndex: 6e3, relUrl: "lvls/split/11.json" },
        { endIndex: 6500, relUrl: "lvls/split/12.json" },
        { endIndex: 7e3, relUrl: "lvls/split/13.json" },
        { endIndex: 7500, relUrl: "lvls/split/14.json" },
        { endIndex: 8e3, relUrl: "lvls/split/15.json" },
        { endIndex: 8500, relUrl: "lvls/split/16.json" },
        { endIndex: 9e3, relUrl: "lvls/split/17.json" },
        { endIndex: 9500, relUrl: "lvls/split/18.json" },
        { endIndex: 1e4, relUrl: "lvls/split/19.json" },
        { endIndex: 10500, relUrl: "lvls/split/20.json" },
        { endIndex: 11e3, relUrl: "lvls/split/21.json" },
        { endIndex: 11500, relUrl: "lvls/split/22.json" },
        { endIndex: 12e3, relUrl: "lvls/split/23.json" },
        { endIndex: 12500, relUrl: "lvls/split/24.json" },
        { endIndex: 13e3, relUrl: "lvls/split/25.json" },
        { endIndex: 13500, relUrl: "lvls/split/26.json" },
        { endIndex: 14e3, relUrl: "lvls/split/27.json" },
        { endIndex: 14500, relUrl: "lvls/split/28.json" },
        { endIndex: 15e3, relUrl: "lvls/split/29.json" },
        { endIndex: 15500, relUrl: "lvls/split/30.json" },
        { endIndex: 16e3, relUrl: "lvls/split/31.json" },
        { endIndex: 16500, relUrl: "lvls/split/32.json" },
        { endIndex: 17e3, relUrl: "lvls/split/33.json" },
        { endIndex: 17500, relUrl: "lvls/split/34.json" },
        { endIndex: 18e3, relUrl: "lvls/split/35.json" },
        { endIndex: 18500, relUrl: "lvls/split/36.json" },
        { endIndex: 19e3, relUrl: "lvls/split/37.json" },
        { endIndex: 19500, relUrl: "lvls/split/38.json" },
        { endIndex: 2e4, relUrl: "lvls/split/39.json" },
        { endIndex: 20500, relUrl: "lvls/split/40.json" },
        { endIndex: 21e3, relUrl: "lvls/split/41.json" },
        { endIndex: 21500, relUrl: "lvls/split/42.json" },
        { endIndex: 22e3, relUrl: "lvls/split/43.json" },
        { endIndex: 22500, relUrl: "lvls/split/44.json" },
        { endIndex: 23e3, relUrl: "lvls/split/45.json" },
        { endIndex: 23500, relUrl: "lvls/split/46.json" },
        { endIndex: 24e3, relUrl: "lvls/split/47.json" },
        { endIndex: 24500, relUrl: "lvls/split/48.json" },
        { endIndex: 25e3, relUrl: "lvls/split/49.json" },
        { endIndex: 25500, relUrl: "lvls/split/50.json" },
        { endIndex: 26e3, relUrl: "lvls/split/51.json" },
        { endIndex: 26500, relUrl: "lvls/split/52.json" },
        { endIndex: 27e3, relUrl: "lvls/split/53.json" },
        { endIndex: 27376, relUrl: "lvls/split/54.json" }
      ];
      lvls_default = {
        nGames,
        gameListList
      };
    }
  });

  // wwwroot/src/statistics.ts
  function sIdxTolIdx(gIdx) {
    return { lvlSize: 6 + Math.floor(gIdx / 3), subIdx: gIdx % 3 };
  }
  var IEndlessStats, IStats, Statistics;
  var init_statistics = __esm({
    "wwwroot/src/statistics.ts"() {
      init_l();
      init_storage();
      ((IEndlessStats2) => {
        function empty() {
          return { solved: 0, perfect: 0, bestTimeMS: 0, medianTimeMS: 0 };
        }
        IEndlessStats2.empty = empty;
      })(IEndlessStats || (IEndlessStats = {}));
      ((IStats2) => {
        function ToShareableString(s, boardSize, showTime) {
          var games = s.dailyStats[boardSize.toString()].arr;
          var trophy = "\u{1F3C6}";
          if (s.dailyStats[boardSize.toString()].numWonToday < 5)
            trophy = "\u{1F3C5}";
          var str = "";
          for (var g of games) {
            if (!g)
              str += "\u2B1C";
            else if (g.isClairvoyant && g.didSolve)
              str += "\u{1F52E}";
            else if (g.isPerfect && g.didSolve)
              str += "\u{1F9D9}\u200D\u2642\uFE0F";
            else if (g.didSolve)
              str += "\u2705";
            else
              str += "\u2B1C";
          }
          var nums = games.filter((g2) => g2 && g2.time).map((g2) => g2.time);
          var avg = 0;
          if (games.length > 0) {
            var sum = L.ArraySum(nums, (a) => a);
            avg = Math.round(sum / games.length);
          }
          if (showTime) {
            var avgSeconds = Math.round(avg / 1e3);
            str += `
\u231A${L.numberToEmojiNumber(3, avgSeconds)}`;
          }
          str = `DOMINO FIT #${s.dIndex + 1} ${boardSize}x${boardSize} 
${trophy}${str}`;
          return str;
        }
        IStats2.ToShareableString = ToShareableString;
      })(IStats || (IStats = {}));
      Statistics = class {
        constructor() {
          this.onUpdate = new L.Ev();
          this.onLoad = new L.Ev();
          this.allSolves = [];
          this.didLoad = false;
          this.lastFinishIdx = 0;
          this.gamesPerWeek = 9;
          this.firstDailyStart = new Date("18 Feb 2024 00:00:01");
          this.data = {
            solved: 0,
            currentStreak: 0,
            bestStreak: 0,
            timeTillNextDaily: "",
            gameArray: [],
            dIndex: 0,
            stats6: IEndlessStats.empty(),
            stats7: IEndlessStats.empty(),
            stats8: IEndlessStats.empty(),
            dailyStats: { "6": { arr: [], numWonToday: 0 }, "7": { arr: [], numWonToday: 0 }, "8": { arr: [], numWonToday: 0 } }
          };
        }
        Load() {
          this.LoadSolves();
          this.RecalculateStats();
          var updTimeToNextDaily = () => {
            var daily = this.GetCurrentDaily();
            var elapsed = this.tom(daily.startTime).getTime() - L.now();
            if (elapsed < 0) {
              elapsed = 0;
            }
            var str = L.msToDisplayStringD_HH_MM(elapsed);
            if (this.data.timeTillNextDaily != str) {
              this.data.timeTillNextDaily = str;
              this.onUpdate.trigger(this.data);
            }
          };
          setInterval(() => {
            updTimeToNextDaily();
          }, 250);
          updTimeToNextDaily();
        }
        AddStart(gc, startTime = -1) {
          if (startTime == -1) {
            startTime = new Date(L.now()).getTime();
          }
          this.allSolves.push({ dIndex: gc.idx, sIndex: gc.sIdx, pStartTime: startTime, didSolve: false, isDaily: gc.type == "daily", isPerfect: true, isnew: true, isClairvoyant: true });
          this.Save();
          this.RecalculateStats();
        }
        HasFinish(gc) {
          for (var i = 0; i < this.allSolves.length; ++i) {
            var curr = this.allSolves[this.allSolves.length - 1 - i];
            if (curr.dIndex == gc.idx && curr.sIndex == gc.sIdx) {
              return curr.didSolve == true;
            }
          }
          return false;
        }
        AddFinish(gc, solveTimeMS) {
          for (var i = 0; i < this.allSolves.length; ++i) {
            var curr = this.allSolves[this.allSolves.length - 1 - i];
            if (curr.dIndex == gc.idx && curr.sIndex == gc.sIdx) {
              curr.didSolve = true;
              curr.time = solveTimeMS;
              this.Save();
              this.RecalculateStats();
              break;
            }
          }
        }
        GetWasPerfectGame(gc) {
          for (var i = 0; i < this.allSolves.length; ++i) {
            var curr = this.allSolves[this.allSolves.length - 1 - i];
            if (curr.dIndex == gc.idx && curr.sIndex == gc.sIdx) {
              return curr.isPerfect;
            }
          }
          return true;
        }
        ClearElectronLevelData(gameSize) {
          Storage.ClearOldStorageElectron(1, gameSize.toString());
          var filteredSolve = this.allSolves.filter((a) => a.dIndex != gameSize || a.didSolve == false);
          this.allSolves = filteredSolve;
          this.Save();
          this.RecalculateStats();
        }
        SetImperfectGame(gc) {
          for (var i = 0; i < this.allSolves.length; ++i) {
            var curr = this.allSolves[this.allSolves.length - 1 - i];
            if (curr.dIndex == gc.idx && curr.sIndex == gc.sIdx) {
              if (curr.isPerfect == true) {
                curr.isPerfect = false;
                this.Save();
                this.RecalculateStats();
              }
              break;
            }
          }
        }
        SetNotClairvoyant(gc) {
          for (var i = 0; i < this.allSolves.length; ++i) {
            var curr = this.allSolves[this.allSolves.length - 1 - i];
            if (curr.dIndex == gc.idx && curr.sIndex == gc.sIdx) {
              if (curr.isClairvoyant) {
                curr.isClairvoyant = false;
                this.Save();
                this.RecalculateStats();
              }
              break;
            }
          }
        }
        RecalculateStats() {
          var today = this.GetCurrentDaily();
          var dIndex = today.index;
          var getEndlessStats = (num) => {
            var _a, _b;
            var statsOnLevel = this.allSolves.filter((a) => a.dIndex == num && !a.isDaily && a.didSolve);
            statsOnLevel.sort((a, b) => {
              var _a2, _b2;
              return ((_a2 = a.time) != null ? _a2 : 1e6) - ((_b2 = b.time) != null ? _b2 : 1e6);
            });
            var endlessStats = IEndlessStats.empty();
            endlessStats.solved = statsOnLevel.length;
            endlessStats.perfect = statsOnLevel.filter((a) => a.isPerfect).length;
            endlessStats.bestTimeMS = statsOnLevel.length == 0 ? 0 : (_a = statsOnLevel[0].time) != null ? _a : 0;
            endlessStats.medianTimeMS = statsOnLevel.length == 0 ? 0 : (_b = statsOnLevel[Math.floor(statsOnLevel.length / 2)].time) != null ? _b : 0;
            return endlessStats;
          };
          this.data.stats6 = getEndlessStats(6);
          this.data.stats7 = getEndlessStats(7);
          this.data.stats8 = getEndlessStats(8);
          var solvesToday = this.allSolves.filter((a) => a.dIndex == today.index && a.didSolve);
          solvesToday.sort((a, b) => a.sIndex - b.sIndex);
          var numWonToday6 = this.allSolves.filter((a) => a.dIndex == today.index && a.sIndex < 3 && a.didSolve).length;
          var numWonToday7 = this.allSolves.filter((a) => a.dIndex == today.index && (a.sIndex >= 3 && a.sIndex < 6) && a.didSolve).length;
          var numWonToday8 = this.allSolves.filter((a) => a.dIndex == today.index && a.sIndex >= 6 && a.didSolve).length;
          while (this.data.gameArray.length < this.gamesPerWeek) {
            this.data.gameArray.push(null);
          }
          var playsToday = this.allSolves.filter((a) => a.dIndex == today.index);
          for (var i = 0; i < this.gamesPerWeek; ++i) {
            var matchingPlay = playsToday.find((play) => play.sIndex == i);
            this.data.gameArray[i] = matchingPlay;
          }
          this.data.dailyStats["6"].arr = [this.data.gameArray[0], this.data.gameArray[1], this.data.gameArray[2]];
          this.data.dailyStats["7"].arr = [this.data.gameArray[3], this.data.gameArray[4], this.data.gameArray[5]];
          this.data.dailyStats["8"].arr = [this.data.gameArray[6], this.data.gameArray[7], this.data.gameArray[8]];
          var bestStreak = 0;
          var solvedDailies = this.allSolves.filter((a) => a.didSolve);
          var solvedGamesByDay = L.ArrayGroupBy(solvedDailies, (a) => a.dIndex);
          var solvedDailyGroups = [];
          for (var idx in solvedGamesByDay) {
            if (solvedGamesByDay[idx].length > 0 && !solvedGamesByDay[idx][0].isnew) {
              if (solvedGamesByDay[idx].length >= 5)
                solvedDailyGroups.push(solvedGamesByDay[idx]);
            } else {
              var x = 0;
              var y = 0;
              var z = 0;
              for (var sg of solvedGamesByDay[idx]) {
                if (sg.sIndex < 3)
                  x++;
                else if (sg.sIndex < 6)
                  y++;
                else
                  z++;
              }
              if (x >= 3 || y >= 3 || z >= 3)
                solvedDailyGroups.push(solvedGamesByDay[idx]);
            }
          }
          var solved = solvedDailyGroups.length;
          var currStreak = 0;
          for (var i = 0; i < solvedDailyGroups.length; ++i) {
            if (i > 0 && solvedDailyGroups[i][0].dIndex == solvedDailyGroups[i - 1][0].dIndex + 1) {
              currStreak += 1;
            } else {
              currStreak = 1;
            }
            if (currStreak > bestStreak)
              bestStreak = currStreak;
            this.lastFinishIdx = solvedDailyGroups[i][0].dIndex;
          }
          var didChange = false;
          if (this.data.bestStreak != bestStreak)
            didChange = true;
          this.data.bestStreak = bestStreak;
          if (this.data.currentStreak != currStreak)
            didChange = true;
          this.data.currentStreak = currStreak;
          if (this.data.solved != solved)
            didChange = true;
          this.data.solved = solved;
          if (this.data.dailyStats["6"].numWonToday != numWonToday6)
            didChange = true;
          this.data.dailyStats["6"].numWonToday = numWonToday6;
          if (this.data.dailyStats["7"].numWonToday != numWonToday7)
            didChange = true;
          this.data.dailyStats["7"].numWonToday = numWonToday7;
          if (this.data.dailyStats["8"].numWonToday != numWonToday8)
            didChange = true;
          this.data.dailyStats["8"].numWonToday = numWonToday8;
          if (this.data.dIndex != dIndex)
            didChange = true;
          this.data.dIndex = dIndex;
          if (didChange) {
            if (!this.didLoad)
              this.onLoad.trigger(this.data);
            this.onUpdate.trigger(this.data);
          }
        }
        Save() {
          localStorage.setItem("allSolves", JSON.stringify(this.allSolves));
        }
        LoadSolves() {
          if (localStorage.getItem("allSolves") == null)
            this.allSolves = [];
          else
            this.allSolves = JSON.parse(localStorage.getItem("allSolves"));
        }
        tom(date) {
          var dStart = new Date(date.getTime());
          dStart.setDate(dStart.getDate() + 1);
          return dStart;
        }
        nextWeek(date) {
          var dStart = new Date(date.getTime());
          dStart.setDate(dStart.getDate() + 7);
          return dStart;
        }
        GetCurrentWeekly() {
          var now = L.now();
          var weeklyStart = new Date(this.firstDailyStart.getTime());
          var weekIndex = 0;
          while (this.nextWeek(weeklyStart).getTime() < now) {
            weeklyStart = this.nextWeek(weeklyStart);
            weekIndex += 1;
          }
          return { index: weekIndex, startTime: weeklyStart };
        }
        GetCurrentDaily() {
          var now = L.now();
          var dailyStart = new Date(this.firstDailyStart.getTime());
          var dailyIndex = 0;
          while (this.tom(dailyStart).getTime() < now) {
            dailyStart = this.tom(dailyStart);
            dailyIndex += 1;
          }
          return { index: dailyIndex, startTime: dailyStart };
        }
        LastGamePlayedIndex() {
          var today = this.GetCurrentDaily();
          var todaysGames = this.allSolves.filter((a) => a.dIndex == today.index);
          todaysGames.sort((a, b) => a.sIndex - b.sIndex);
          if (todaysGames.length == 0)
            return 0;
          var gamesWeAreWorkingOn = todaysGames.filter((a) => a.didSolve == false);
          if (gamesWeAreWorkingOn.length > 0)
            return gamesWeAreWorkingOn[0].sIndex;
          var gamesWeSolved = todaysGames.filter((a) => a.didSolve);
          var lastGameWeSolved = gamesWeSolved[gamesWeSolved.length - 1];
          return Math.min(lastGameWeSolved.sIndex + 1, this.gamesPerWeek - 1);
        }
        SaveLastPlayedGame(lastPlayedGame) {
          localStorage.setItem("df_lastplayedgame", JSON.stringify(lastPlayedGame));
        }
        SaveLastPlayedDaily(lastPlayedGame) {
          var lidx = sIdxTolIdx(lastPlayedGame.sIndex);
          if (lidx.lvlSize == 6)
            localStorage.setItem("df_lastPlayedDaily_6", JSON.stringify(lastPlayedGame));
          if (lidx.lvlSize == 7)
            localStorage.setItem("df_lastPlayedDaily_7", JSON.stringify(lastPlayedGame));
          if (lidx.lvlSize == 8)
            localStorage.setItem("df_lastPlayedDaily_8", JSON.stringify(lastPlayedGame));
        }
        SaveLastPlayedElectron(lastPlayedGame) {
          if (lastPlayedGame.dIndex == 6)
            localStorage.setItem("df_lastPlayedElectron_6", JSON.stringify(lastPlayedGame));
          if (lastPlayedGame.dIndex == 7)
            localStorage.setItem("df_lastPlayedElectron_7", JSON.stringify(lastPlayedGame));
          if (lastPlayedGame.dIndex == 8)
            localStorage.setItem("df_lastPlayedElectron_8", JSON.stringify(lastPlayedGame));
        }
        LoadLastPlayedDaily(dIndex, lvlSize) {
          var lDaily = localStorage.getItem(`df_lastPlayedDaily_${lvlSize}`);
          if (!lDaily)
            return { dIndex: 0, sIndex: 0 };
          var lpg = JSON.parse(lDaily);
          if (lpg.dIndex != dIndex)
            return { dIndex: 0, sIndex: 0 };
          return lpg;
        }
        LoadLastPlayedElectron(lvlSize) {
          var lDaily = localStorage.getItem(`df_lastPlayedElectron_${lvlSize}`);
          if (!lDaily)
            return { dIndex: lvlSize, sIndex: -1 };
          var lpg = JSON.parse(lDaily);
          return { dIndex: lvlSize, sIndex: lpg.sIndex };
        }
        LoadLastPlayedGame() {
          var lastPlayedGame = localStorage.getItem("df_lastplayedgame");
          if (!lastPlayedGame)
            return { dIndex: 0, sIndex: 0 };
          return JSON.parse(lastPlayedGame);
        }
      };
    }
  });

  // wwwroot/src/settings.ts
  var Settings;
  var init_settings = __esm({
    "wwwroot/src/settings.ts"() {
      init_l();
      Settings = class {
        constructor() {
          this.onUpdate = new L.Ev();
          this.gameSize = 6;
          this.LoadAndUpdate();
        }
        LoadAndUpdate() {
          this.showTime = localStorage.getItem("showTime") === "true";
          this.hideCheckerboard = false;
          this.darkModeToggle = localStorage.getItem("darkModeToggle") === "true";
          this.colorblindMode = localStorage.getItem("colorblindMode") === "true";
          this.muteSound = localStorage.getItem("muteSound") === "true";
          if (localStorage.getItem("gameSize") !== void 0 && localStorage.getItem("gameSize") !== null)
            this.gameSize = Number.parseInt(localStorage.getItem("gameSize"));
          this.clickToToggle = localStorage.getItem("clickToToggle") === "true";
        }
        SaveAndUpdate() {
          localStorage.setItem("showTime", this.showTime ? "true" : "false");
          localStorage.setItem("hideCheckerboard", "false");
          localStorage.setItem("darkModeToggle", this.darkModeToggle ? "true" : "false");
          localStorage.setItem("colorblindMode", this.colorblindMode ? "true" : "false");
          localStorage.setItem("muteSound", this.muteSound ? "true" : "false");
          localStorage.setItem("clickToToggle", this.clickToToggle ? "true" : "false");
          localStorage.setItem("gameSize", this.gameSize.toString());
          this.onUpdate.trigger(this);
        }
      };
    }
  });

  // wwwroot/src/shared.ts
  var GameCode, IPlay, GameDef;
  var init_shared = __esm({
    "wwwroot/src/shared.ts"() {
      ((GameCode4) => {
        function Next(gc) {
          return { idx: gc.idx, sIdx: gc.sIdx + 1, type: "daily" };
        }
        GameCode4.Next = Next;
        function Prev(gc) {
          return { idx: gc.idx, sIdx: gc.sIdx - 1, type: "daily" };
        }
        GameCode4.Prev = Prev;
      })(GameCode || (GameCode = {}));
      ((IPlay3) => {
        function isEqual(a, b) {
          return a.ud === b.ud && a.x === b.x && a.y === b.y;
        }
        IPlay3.isEqual = isEqual;
        function toOrderedJson(play) {
          var ordered = { ud: play.ud, x: play.x, y: play.y };
          var orderedJson = JSON.stringify(ordered);
          return orderedJson;
        }
        IPlay3.toOrderedJson = toOrderedJson;
        function ArrayIPlaysAreEqual(p1, p2) {
          var p1s = p1.map((a) => toOrderedJson(a));
          var p2s = p2.map((a) => toOrderedJson(a));
          var map = {};
          for (var p of p1s) {
            map[p] = true;
          }
          for (var p of p2s) {
            if (!map[p])
              return false;
          }
          return true;
        }
        IPlay3.ArrayIPlaysAreEqual = ArrayIPlaysAreEqual;
      })(IPlay || (IPlay = {}));
      GameDef = class {
        constructor(dispMask, rowSums, colSums, gameCode = { idx: 0, sIdx: 0, type: "unknown" }) {
          this.rowSums = rowSums;
          this.colSums = colSums;
          this.gameCode = gameCode;
          var maskLinesStr = dispMask.split(/\r?\n/).filter((m) => m != "");
          this.board = maskLinesStr.map((a) => Array.from(a).map((a2) => a2 != "X"));
          this.board.reverse();
        }
      };
    }
  });

  // wwwroot/src/tilings.ts
  var GameTilings, GameTiling, Tiling;
  var init_tilings = __esm({
    "wwwroot/src/tilings.ts"() {
      init_constants();
      init_l();
      init_shared();
      GameTilings = class {
        constructor(list) {
          this.list = list;
        }
        static FromJson(url) {
          return __async(this, null, function* () {
            console.log('fromjson get')
            var gl = yield L.Get(url);
            var gt = new GameTilings(gl);
            return gt;
          });
        }
        static FromMeta(metaJson, iWeWant) {
          return __async(this, null, function* () {
            console.log('from meta',{metaJson:JSON.parse(JSON.stringify(metaJson)),iWeWant})
            var iWeNeed = iWeWant;
            var iOffset = 0;
            if (iWeWant >= metaJson.nGames) { // nGames=27376
              iOffset = metaJson.nGames * Math.floor(iWeWant / metaJson.nGames);
              iWeNeed = iWeWant % metaJson.nGames;
            }
            var glNeeded = metaJson.gameListList[0].relUrl;
            console.log('glNeeded',{glNeeded,metaJson:JSON.parse(JSON.stringify(metaJson)),m:metaJson.gameListList})

            for (var i = 0; i < metaJson.gameListList.length; ++i) {
              console.log('for',glNeeded)
              if (metaJson.gameListList[i].endIndex >= iWeNeed) {
                glNeeded = metaJson.gameListList[i].relUrl;
                break;
              }
            }
            console.log('frommeta get',{glNeeded,metaJson,iWeWant,iOffset})
            var gl = yield L.Get(glNeeded);
            console.log('gl',gl)
            // var gli0 = gl.startIdx + iOffset;
            var gli0 = gl.startIdx + kurva; //change i offset here from 0 to 500 2ez 123
            var paddedGL = [];
            for (var i = 0; i < gli0; ++i)
              paddedGL.push(gl.games[0]);
            paddedGL.push(...gl.games);
            console.log('paddedGL',paddedGL)
            gl.games = paddedGL;
            return new GameTilings(gl);
          });
        }
        GetTilings(gc) {
          return new GameTiling(this.list.masks, this.list.games[gc.idx % this.list.games.length][gc.sIdx], gc);
        }
        HasTiling(gc) {
          return this.list.games[gc.idx % this.list.games.length][gc.sIdx];
        }
        HasTilingNoLoop(gc) {
          if (gc.idx > this.list.games.length - 1 || gc.sIdx > this.list.games[gc.idx].length - 1) {
            return false;
          }
          return true;
        }
        NumTilings(dIndx) {
          return this.list.games[dIndx % this.list.games.length].length;
        }
      };
      GameTiling = class {
        constructor(masks, g, gameCode) {
          this.tilings = [];
          var level = g.substring(0, 3);
          var maskFull = masks[level].map((mf) => mf);
          var b64 = g.substring(3);
          var arr = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
          var nBlack = Number.parseInt(g.substring(1, 3));
          var blackSquares = arr.slice(0, nBlack);
          arr = arr.slice(nBlack);
          for (var blackSquare of blackSquares) {
            var x = 8 - 1 - blackSquare % 8;
            var y = 8 - 1 - Math.floor(blackSquare / 8);
            var newStr = L.stringOverlayLeft(maskFull[y], "1", x);
            maskFull[y] = newStr;
          }
          while (arr.length > 0) {
            var byt = arr.slice(0, 8);
            arr = arr.slice(8);
            var rows = [];
            for (var i = 0; i < byt.length; ++i) {
              var toAdd = "";
              for (var j = 0; j < 8; ++j) {
                if (maskFull[i][j] == "1")
                  toAdd = toAdd + "X";
                else
                  toAdd = toAdd + ((byt[i] >> 8 - 1 - j & 1) == 1 ? "-" : " ");
              }
              rows.push(toAdd);
            }
            this.tilings.push(new Tiling(rows));
          }
          var rcs = this.tilings[0].toRcs(dom_def.lr.v0, dom_def.lr.v1, dom_def.ud.v0, dom_def.ud.v1);
          this.def = new GameDef(this.tilings[0].toString(), rcs.rowSums, rcs.colSums, gameCode);
        }
      };
      Tiling = class {
        constructor(sol) {
          this.sol = sol;
          this.plays = [];
          {
            while ([...this.sol[0]].every((a) => a == "X")) {
              this.sol.splice(0, 1);
            }
            while ([...this.sol[this.sol.length - 1]].every((a) => a == "X")) {
              this.sol.splice(this.sol.length - 1, 1);
            }
            while (this.sol.every((a) => a[0] == "X")) {
              this.sol = this.sol.map((a) => a.slice(1));
            }
            while (this.sol.every((a) => a[a.length - 1] == "X")) {
              this.sol = this.sol.map((a) => a.slice(0, -1));
            }
          }
          this.board = this.sol.map((a) => Array.from(a).map((a2) => a2 != "X"));
          var counted = this.sol.map((a) => Array.from(a).map((a2) => a2 == "X"));
          for (var x = 0; x < counted.length; ++x) {
            for (var y = 0; y < counted[x].length; ++y) {
              if (counted[y][x])
                continue;
              if (this.sol[y][x] == "-") {
                this.plays.push({ x, y, ud: false });
                counted[y][x + 1] = true;
              } else if (this.sol[y][x] == " ") {
                this.plays.push({ x, y, ud: true });
                counted[y + 1][x] = true;
              }
              counted[y][x] = true;
            }
          }
        }
        toRcs(h0, h1, v0, v1) {
          var rowSums = this.board.map((a) => 0);
          var colSums = this.board[0].map((a) => 0);
          for (var i = 0; i < this.plays.length; ++i) {
            var placement = this.plays[i];
            if (placement.ud) {
              rowSums[placement.y] += v1;
              colSums[placement.x] += v1;
              rowSums[placement.y + 1] += v0;
              colSums[placement.x] += v0;
            } else {
              rowSums[placement.y] += h0;
              colSums[placement.x] += h0;
              rowSums[placement.y] += h1;
              colSums[placement.x + 1] += h1;
            }
          }
          return { rowSums, colSums };
        }
        toString() {
          var toDisp = "";
          for (var i = 0; i < this.sol.length; ++i) {
            toDisp = toDisp + this.sol[this.sol.length - i - 1] + "\r\n";
          }
          return toDisp;
        }
      };
    }
  });

  // wwwroot/src/board_history.tsx
  var BoardHistory;
  var init_board_history = __esm({
    "wwwroot/src/board_history.tsx"() {
      init_l();
      BoardHistory = class {
        constructor(board, plays) {
          this.board = board;
          this.plays = plays;
          this.rowNumbers = [];
          this.colNumbers = [];
          this.topRow = [];
          this.bottomRow = [];
          this.td = 1;
          this.bd = 1;
          this.rd = 1;
          this.ld = 1;
          this.grid = board.map((b) => b.map((e2) => 0));
          var openSpots = L.arrayFlatten(this.board).filter((a) => a).length;
          var numDominos = openSpots / 2;
          this.h = this.grid.length;
          this.w = this.grid[0].length;
          for (var i = 0; i < this.plays.length; ++i) {
            var percent = (this.plays.length - 1 - i + (numDominos - this.plays.length) + 1) / numDominos;
            var p = this.plays[i];
            this.grid[p.y][p.x] = percent;
            if (p.ud) {
              this.grid[p.y + 1][p.x] = percent;
            } else {
              this.grid[p.y][p.x + 1] = percent;
            }
          }
          for (var i = 0; i < board.length; ++i) {
            this.rowNumbers.push({ elLeft: /* @__PURE__ */ L.jsxFactory("div", {
              class: "hP hSideLeft"
            }, "\u2013", i + 1), elRight: /* @__PURE__ */ L.jsxFactory("div", {
              class: "hP hSideRight"
            }, "\u2013", i + 1), score: 0 });
          }
          for (var i = 0; i < board[0].length; ++i) {
            this.colNumbers.push({ elTop: /* @__PURE__ */ L.jsxFactory("div", {
              class: "hP hSideTop"
            }, "|", i + 1), elBottom: /* @__PURE__ */ L.jsxFactory("div", {
              class: "hP hSideBottom"
            }, "|", i + 1), score: 0 });
          }
          var squareRows = [];
          for (var y = 0; y < this.h; ++y) {
            var toAdd = [];
            for (var x = 0; x < this.w; ++x) {
              var s = L.Clamp(100 + this.grid[y][x] * 155, 0, 255);
              if (this.grid[y][x] < 1e-9)
                s = 0;
              var e = /* @__PURE__ */ L.jsxFactory("div", {
                class: "hsq hsql"
              });
              e.style.backgroundColor = `${L.rgbToHexString({ r: 0, g: s / 1.75, b: s })}`;
              toAdd.push(e);
            }
            squareRows.push(/* @__PURE__ */ L.jsxFactory("div", {
              class: "hrow"
            }, this.rowNumbers[y].elLeft, toAdd, this.rowNumbers[y].elRight));
          }
          squareRows.reverse();
          var rows = [];
          this.topRow.push(/* @__PURE__ */ L.jsxFactory("div", {
            class: "hP hCorner"
          }));
          this.topRow.push(...this.colNumbers.map((s2) => s2.elTop));
          this.topRow.push(/* @__PURE__ */ L.jsxFactory("div", {
            class: "hP hCorner"
          }));
          rows.push(/* @__PURE__ */ L.jsxFactory("div", {
            class: "hrow"
          }, this.topRow));
          rows.push(...squareRows);
          this.bottomRow.push(/* @__PURE__ */ L.jsxFactory("div", {
            class: "hP hCorner"
          }));
          this.bottomRow.push(...this.colNumbers.map((s2) => s2.elBottom));
          this.bottomRow.push(/* @__PURE__ */ L.jsxFactory("div", {
            class: "hP hCorner"
          }));
          rows.push(/* @__PURE__ */ L.jsxFactory("div", {
            class: "hrow"
          }, this.bottomRow));
          this.prompt = /* @__PURE__ */ L.jsxFactory("div", {
            class: "historyPrompt"
          }, "your path, ", /* @__PURE__ */ L.jsxFactory("div", {
            class: "hPStart"
          }, "start"), " to ", /* @__PURE__ */ L.jsxFactory("div", {
            class: "hPFinish"
          }, "finish"));
          this.el = /* @__PURE__ */ L.jsxFactory("div", {
            class: "historyContainer"
          }, /* @__PURE__ */ L.jsxFactory("div", {
            class: "history"
          }, rows), this.prompt);
          var solveOrder = this.GetSolveOrder();
          var rcs = L.ArrayTake(solveOrder, 3);
          var getEls = (rOrC) => {
            var toReturn = [];
            if (rOrC.type == "|") {
              toReturn.push(this.colNumbers[rOrC.rank].elBottom);
              toReturn.push(this.colNumbers[rOrC.rank].elTop);
            } else {
              toReturn.push(this.rowNumbers[rOrC.rank].elLeft);
              toReturn.push(this.rowNumbers[rOrC.rank].elRight);
            }
            return toReturn;
          };
          if (rcs.length > 0)
            getEls(rcs[0]).map((e2) => e2.classList.add("hpFirst"));
          if (rcs.length > 1)
            getEls(rcs[1]).map((e2) => e2.classList.add("hpSecond"));
          if (rcs.length > 2)
            getEls(rcs[2]).map((e2) => e2.classList.add("hpThird"));
        }
        GetSolveOrder() {
          var spotFillTime = this.board.map((b) => b.map((sq) => Number(sq ? -1 : 1)));
          for (var i = 0; i < this.plays.length; ++i) {
            var p = this.plays[i];
            spotFillTime[p.y][p.x] = i + 1;
            if (p.ud) {
              spotFillTime[p.y + 1][p.x] = i + 1;
            } else {
              spotFillTime[p.y][p.x + 1] = i + 1;
            }
          }
          var rcFillTimes = [];
          for (var y = 0; y < spotFillTime.length; ++y) {
            var latest = Number.MIN_SAFE_INTEGER;
            var filled = true;
            for (var x = 0; x < spotFillTime[y].length; ++x) {
              if (spotFillTime[y][x] > latest)
                latest = spotFillTime[y][x];
              if (spotFillTime[y][x] == -1)
                filled = false;
            }
            if (filled)
              rcFillTimes.push({ type: "\u2013", rank: y, time: latest });
          }
          for (var x = 0; x < spotFillTime.length; ++x) {
            var latest = Number.MIN_SAFE_INTEGER;
            var filled = true;
            for (var y = 0; y < spotFillTime[x].length; ++y) {
              if (spotFillTime[y][x] > latest)
                latest = spotFillTime[y][x];
              if (spotFillTime[y][x] == -1)
                filled = false;
            }
            if (filled)
              rcFillTimes.push({ type: "|", rank: x, time: latest });
          }
          rcFillTimes.sort((a, b) => a.time - b.time);
          return rcFillTimes;
        }
        GetDescription(count = 3) {
          var rcFillTimes = this.GetSolveOrder();
          var rcs = L.ArrayTake(rcFillTimes, count).map((a) => {
            return a.type.toString() + (a.rank + 1).toString();
          });
          var firstFew = L.convertToCommaSeperatedString(rcs);
          return firstFew;
        }
        HidePrompt() {
          this.prompt.style.display = "none";
        }
        ShowTop() {
          for (var el of this.topRow)
            el.style.display = "block";
          this.td = 1;
        }
        HideTop() {
          for (var el of this.topRow)
            el.style.display = "none";
          this.td = 0;
        }
        ShowBottom() {
          for (var el of this.bottomRow)
            el.style.display = "block";
          this.bd = 1;
        }
        HideBottom() {
          for (var el of this.bottomRow)
            el.style.display = "none";
          this.bd = 0;
        }
        ShowRight() {
          this.bottomRow[this.w + 1].style.display = "block";
          this.topRow[this.w + 1].style.display = "block";
          for (var rs of this.rowNumbers)
            rs.elRight.style.display = "block";
          this.rd = 1;
        }
        HideRight() {
          this.bottomRow[this.w + 1].style.display = "none";
          this.topRow[this.w + 1].style.display = "none";
          for (var rs of this.rowNumbers)
            rs.elRight.style.display = "none";
          this.rd = 0;
        }
        HideRightVisibility() {
          this.bottomRow[this.w + 1].style.visibility = "hidden";
          this.topRow[this.w + 1].style.visibility = "hidden";
          for (var rs of this.rowNumbers)
            rs.elRight.style.visibility = "hidden";
        }
        ShowLeft() {
          this.bottomRow[0].style.display = "block";
          this.topRow[0].style.display = "block";
          for (var rs of this.rowNumbers)
            rs.elLeft.style.display = "block";
          this.ld = 1;
        }
        HideLeft() {
          this.bottomRow[0].style.display = "none";
          this.topRow[0].style.display = "none";
          for (var rs of this.rowNumbers)
            rs.elLeft.style.display = "none";
          this.ld = 0;
        }
      };
    }
  });

  // wwwroot/src/board_overlay.tsx
  var BoardOverlay;
  var init_board_overlay = __esm({
    "wwwroot/src/board_overlay.tsx"() {
      init_l();
      BoardOverlay = class {
        constructor(board, startHidden, code) {
          this.board = board;
          this.startHidden = startHidden;
          this.code = code;
          this.sq = board.squares[board.squares[0].length - 1 - 2][1];
          var str = "click";
          if (L.isTouchable()) {
            str = "tap";
          }
          var levels = [];
          if (code.type == "daily") {
            for (var i = 0; i < 3; ++i) {
              if (i < code.sIdx % 3 + 1)
                levels.push(/* @__PURE__ */ L.jsxFactory("div", {
                  class: "circ"
                }));
              else
                levels.push(/* @__PURE__ */ L.jsxFactory("div", {
                  class: "circ dcirc"
                }));
            }
          }
          this.el = /* @__PURE__ */ L.jsxFactory("div", {
            class: "gameOverlay"
          }, /* @__PURE__ */ L.jsxFactory("div", {
            class: "gameOverlayBG",
            title: "Start Game\nhotkey: 'w'"
          }), /* @__PURE__ */ L.jsxFactory("div", {
            class: "gameOverlayText"
          }, str, " to start"), /* @__PURE__ */ L.jsxFactory("div", {
            class: "gameOverlayCircles"
          }, levels));
          this.el.style.setProperty("--wScale", (board.w - 2).toString());
          this.el.style.setProperty("--hScale", (board.h - 4).toString());
          if (this.startHidden)
            this.MakeInvisibleAnimation();
          this.sq.el.appendChild(this.el);
        }
        MakeInvisibleAnimation() {
          this.el.style.opacity = "0";
          this.el.style.pointerEvents = "none";
        }
      };
    }
  });

  // wwwroot/src/board_win_overlay.tsx
  var BoardWinOverlay;
  var init_board_win_overlay = __esm({
    "wwwroot/src/board_win_overlay.tsx"() {
      init_l();
      BoardWinOverlay = class {
        constructor(board) {
          this.board = board;
          this.sq = board.squares[board.h - 1][0];
        }
        Display(didPerfect) {
          return __async(this, null, function* () {
            if (didPerfect)
              this.el = /* @__PURE__ */ L.jsxFactory("div", {
                id: "winAnimation",
                class: "winAnimation"
              }, " ", /* @__PURE__ */ L.jsxFactory("img", {
                src: "res/complete2.svg",
                class: "winText",
                draggable: "false"
              }), /* @__PURE__ */ L.jsxFactory("img", {
                src: "res/Wizardry.svg",
                class: "winSubtext"
              }));
            else
              this.el = /* @__PURE__ */ L.jsxFactory("div", {
                id: "winAnimation",
                class: "winAnimation"
              }, " ", /* @__PURE__ */ L.jsxFactory("div", null, /* @__PURE__ */ L.jsxFactory("img", {
                src: "res/complete2.svg",
                class: "winText",
                draggable: "false"
              })), " ");
            this.el.style.setProperty("--wScale", this.board.w.toString());
            this.el.style.setProperty("--hScale", this.board.h.toString());
            this.sq.el.appendChild(this.el);
            yield L.Sleep(750);
            this.el.style.opacity = "1";
            yield L.Sleep(1500);
            this.el.style.opacity = "0";
            yield L.Sleep(300 * 4);
          });
        }
      };
    }
  });

  // wwwroot/src/domino_select.tsx
  function lSounds(ctx, ...mp3Files) {
    var onFirstSoundLoaded = (fName) => {
      pSound(ctx, fName, 0);
      var firstTouch = (ev) => {
        window.removeEventListener("touchstart", firstTouch);
      };
      window.addEventListener("touchstart", firstTouch);
    };
    var firstLoadedSound = null;
    for (var mp3File of mp3Files) {
      ((f) => {
        loadSound(DominoSelect.ctx, f).then((buf) => {
          loadedSounds[f] = buf;
          if (firstLoadedSound == null) {
            firstLoadedSound = f;
            onFirstSoundLoaded(f);
          }
        });
      })(mp3File);
    }
    if (loadedSounds[mp3File]) {
      var newCtx = ctx.createBufferSource();
      newCtx.buffer = loadedSounds[mp3File];
      newCtx.connect(ctx.destination);
      newCtx.start(0);
    }
  }
  function pSound(ctx, mp3File, gain = 1) {
    if (loadedSounds[mp3File]) {
      var newCtx = ctx.createBufferSource();
      newCtx.buffer = loadedSounds[mp3File];
      var gainNode = ctx.createGain();
      gainNode.gain.value = gain;
      gainNode.connect(ctx.destination);
      newCtx.connect(gainNode);
      gainNode.connect(ctx.destination);
      newCtx.start(0);
    }
  }
  function loadSound(ctx, soundName) {
    return new Promise((accept, reject) => {
      var request = new XMLHttpRequest();
      request.open("GET", soundName);
      request.responseType = "arraybuffer";
      request.onload = function() {
        ctx.decodeAudioData(this.response, function(buf) {
          accept(buf);
        }, function(err) {
          reject(err);
        });
      };
      request.send();
    });
  }
  var IShadowState, _DominoSelect, DominoSelect, loadedSounds;
  var init_domino_select = __esm({
    "wwwroot/src/domino_select.tsx"() {
      init_board();
      init_l();
      ((IShadowState2) => {
        function IsEqual(a, b) {
          return a.x === b.x && a.y === b.y && a.isUd === b.isUd && a.exists === b.exists && a.isBlack === b.isBlack;
        }
        IShadowState2.IsEqual = IsEqual;
      })(IShadowState || (IShadowState = {}));
      document.addEventListener("DOMContentLoaded", function() {
        L.dqs("#container").onmouseup = () => {
          DominoSelect.OnLeaveContainer.trigger();
        };
        L.dqs("#container").onmouseleave = () => {
          DominoSelect.OnLeaveContainer.trigger();
        };
      });
      _DominoSelect = class {
        constructor(game, settings, isUd = true) {
          this.game = game;
          this.settings = settings;
          this.isUd = isUd;
          this.onDispose = new L.Ev();
          this.disabled = false;
          this.slowEnable = null;
          this.lastMouseShadowPos = { x: -777, y: -777 };
          this.touchPaintbrush = false;
          this.touchEraserbrush = false;
          this.paintbrush = false;
          this.eraserbrush = false;
          this.usingTouch = false;
          this.isWithinTouchMove = false;
          _DominoSelect.loadSound();
          this.ud = /* @__PURE__ */ L.jsxFactory("div", {
            class: "control"
          }, Board.Ud());
          this.rl = /* @__PURE__ */ L.jsxFactory("div", {
            class: "control"
          }, Board.Rl());
          this.shadow = {
            el: null,
            state: { exists: false, isUd: false, x: -1, y: -1, isBlack: false },
            sq: null
          };
          this.el = /* @__PURE__ */ L.jsxFactory("div", {
            class: "controlsFlex"
          }, this.ud, this.rl);
          this.Update(this.isUd);
          L.onClick(this.el, () => {
            if (!this.settings.clickToToggle)
              return;
            this.lastMouseShadowPos.x = -777;
            this.lastMouseShadowPos.y = -777;
            this.Update(!this.isUd);
          });
          L.onClick(this.ud, () => {
            if (this.settings.clickToToggle)
              return;
            this.lastMouseShadowPos.x = -777;
            this.lastMouseShadowPos.y = -777;
            this.Update(true);
          });
          L.onClick(this.rl, () => {
            if (this.settings.clickToToggle)
              return;
            this.lastMouseShadowPos.x = -777;
            this.lastMouseShadowPos.y = -777;
            this.Update(false);
          });
          if (L.isMobile()) {
            this.el.ontouchend = (ev) => {
              ev.preventDefault();
            };
          } else {
            if (!L.isTouchable()) {
              var mouseRightSwap = L.dqs("#mouseRightSwap");
              this.el.onmouseenter = () => {
                if (!window["DOMRIGHTCLICK"] && !this.disabled)
                  mouseRightSwap.style.opacity = "1";
              };
              this.el.onmouseleave = () => {
                mouseRightSwap.style.opacity = "0";
              };
            }
          }
          var onRightClick = (e) => {
            this.Update(!this.isUd);
            window["DOMRIGHTCLICK"] = true;
            e.preventDefault();
          };
          document.addEventListener("contextmenu", onRightClick, false);
          this.onDispose.on((e) => document.removeEventListener("contextmenu", onRightClick));
          var onKeyPress = (e) => {
            var key = e.key.toUpperCase();
            if (e.altKey || e.shiftKey || e.ctrlKey)
              return;
            if (key == "ENTER" || key == " " || key == "1" || key == "2")
              this.Update(!this.isUd);
          };
          document.addEventListener("keydown", onKeyPress, false);
          this.onDispose.on((e) => document.removeEventListener("keydown", onKeyPress));
          var hitbox = /* @__PURE__ */ L.jsxFactory("div", {
            class: "gameHitbox"
          });
          hitbox.style.width = `calc(var(--sSize) * ${this.game.squares.length})`;
          hitbox.style.height = `calc(var(--sSize) * ${this.game.squares[0].length})`;
          hitbox.onmouseup = (ev) => this.handleMouse(ev, "release");
          hitbox.onmousemove = (ev) => this.handleMouse(ev, "move");
          hitbox.onmousedown = (ev) => this.handleMouse(ev, "press");
          hitbox.onmouseleave = (ev) => {
            this.lastMouseShadowPos.x = -777;
            this.lastMouseShadowPos.y = -777;
            this.updShadowFromPx(-777, -777);
          };
          hitbox.ontouchstart = (ev) => this.handleTouch(ev, "press");
          hitbox.ontouchend = (ev) => this.handleTouch(ev, "release");
          hitbox.ontouchmove = (ev) => this.handleTouch(ev, "move");
          hitbox.ontouchcancel = (ev) => {
            this.touchPaintbrush = false;
            this.touchEraserbrush = false;
          };
          var sq1 = this.game.squares[this.game.squares.length - 1][0];
          sq1.el.appendChild(hitbox);
          var turnOffBrushes = () => {
            this.paintbrush = false;
            this.eraserbrush = false;
          };
          _DominoSelect.OnLeaveContainer.on(turnOffBrushes);
          this.onDispose.on((e) => _DominoSelect.OnLeaveContainer.off(turnOffBrushes));
        }
        Disable() {
          if (this.slowEnable) {
            clearTimeout(this.slowEnable);
            this.slowEnable = null;
          }
          this.ud.children[0].classList.remove("fadedSlowAnimation");
          this.rl.children[0].classList.remove("fadedSlowAnimation");
          this.disabled = true;
          this.Update(this.isUd);
        }
        xy2Action(x, y) {
          var dominoSquare = this.xyToDominoSquare(x, y);
          var openSquare = this.xyToOpenSquare(x, y);
          if (dominoSquare)
            return { result: "remove", sq: dominoSquare };
          if (openSquare)
            return { result: "add", sq: openSquare };
          return { result: "nothing", sq: null };
        }
        updShadowFromPx(x, y) {
          var _a, _b, _c, _d;
          var action = this.xy2Action(x, y);
          if (x == -777 && y == -777)
            action.result = "nothing";
          var newShadowState = { exists: action.result == "add", isBlack: this.eraserbrush, isUd: this.isUd, x: (_b = (_a = action == null ? void 0 : action.sq) == null ? void 0 : _a.x) != null ? _b : -1, y: (_d = (_c = action == null ? void 0 : action.sq) == null ? void 0 : _c.y) != null ? _d : -1 };
          var didShadowChange = !IShadowState.IsEqual(this.shadow.state, newShadowState);
          if (!didShadowChange)
            return;
          if (this.shadow.sq) {
            if (this.shadow.el)
              this.shadow.el.remove();
            this.shadow.el = null;
            this.shadow.sq = null;
          }
          if (newShadowState.exists) {
            var sq = this.game.squares[newShadowState.y][newShadowState.x];
            this.shadow.sq = sq;
            if (newShadowState.isUd)
              this.shadow.el = /* @__PURE__ */ L.jsxFactory("div", {
                class: "shadowDomino shadowDominoUD"
              });
            else
              this.shadow.el = /* @__PURE__ */ L.jsxFactory("div", {
                class: "shadowDomino shadowDominoRL"
              });
            this.shadow.sq.el.appendChild(this.shadow.el);
            this.shadow.el.clientWidth;
            this.shadow.el.style.opacity = ".6";
          }
          if (this.shadow.el) {
            if (this.eraserbrush) {
              this.shadow.el.classList.add("shadowDominoRemove");
              this.shadow.el.clientWidth;
              this.shadow.el.style.opacity = ".1";
            } else {
              this.shadow.el.classList.remove("shadowDominoRemove");
            }
          }
          this.shadow.state = newShadowState;
        }
        HideControls() {
          return __async(this, null, function* () {
            this.ud.style.visibility = "";
            this.el.style.opacity = "0";
            yield L.Sleep(100);
            this.el.style.pointerEvents = "none";
          });
        }
        Enable() {
          if (this.slowEnable) {
            clearTimeout(this.slowEnable);
            this.slowEnable = null;
          }
          this.ud.children[0].classList.remove("fadedSlowAnimation");
          this.rl.children[0].classList.remove("fadedSlowAnimation");
          this.disabled = false;
          this.Update(this.isUd);
          this.ud.children[0].classList.add("fadedSlowAnimation");
          this.rl.children[0].classList.add("fadedSlowAnimation");
          this.slowEnable = setTimeout(() => {
            this.ud.children[0].classList.remove("fadedSlowAnimation");
            this.rl.children[0].classList.remove("fadedSlowAnimation");
          }, 300);
        }
        handleMouse(ev, details) {
          if (this.usingTouch) {
            ev.preventDefault();
            return;
          }
          var isRightMB;
          var e = e || window.event;
          if ("which" in e)
            isRightMB = e.which == 3;
          else if ("button" in e)
            isRightMB = e.button == 2;
          if (isRightMB)
            return;
          ev.preventDefault();
          var clicked = details == "press";
          if (details == "release" || clicked) {
            this.paintbrush = false;
            this.eraserbrush = false;
          }
          var action = this.xy2Action(ev.clientX, ev.clientY);
          if (this.game.DidWin()) {
            return;
          }
          if (action.result == "remove") {
            if (clicked || this.eraserbrush) {
              var wasRemoved = this.RemoveDomino(action.sq.x, action.sq.y);
              if (clicked && wasRemoved)
                this.eraserbrush = true;
            }
          } else if (action.result == "add") {
            if (clicked || this.paintbrush) {
              var wasAdded = this.AddDomino(action.sq.x, action.sq.y);
              if (clicked && wasAdded)
                this.paintbrush = true;
            }
          }
          this.updShadowFromPx(ev.clientX, ev.clientY);
          this.lastMouseShadowPos = { x: ev.clientX, y: ev.clientY };
        }
        xyToSq(x, y) {
          var rawTargetEl = document.elementsFromPoint(x, y);
          var sqs = rawTargetEl.filter((el) => el.classList.contains("sq"));
          if (sqs.length == 0)
            return null;
          var dominoUnderCursor = [...this.game.SquaresIter()].find((t) => t.el == sqs[0]);
          return dominoUnderCursor;
        }
        xyToDominoSquare(x, y) {
          var dominoUnderCursor = this.xyToSq(x, y);
          if (dominoUnderCursor && !dominoUnderCursor.hasDomino) {
            dominoUnderCursor = null;
          }
          return dominoUnderCursor;
        }
        xyToOpenSquare(x, y) {
          var _a, _b, _c;
          var nearbyOpenSquare;
          var w = (_c = (_b = (_a = this.game.squares[0][0]) == null ? void 0 : _a.el) == null ? void 0 : _b.clientWidth) != null ? _c : 0;
          if (this.isUd) {
            y += w / 2;
          } else {
            x -= w / 2;
          }
          var bounds = this.game.getRawPxBounds();
          if (x > Math.floor(bounds.right))
            x = Math.floor(bounds.right);
          if (x < Math.floor(bounds.left))
            x = Math.floor(bounds.left);
          if (y < Math.floor(bounds.top))
            y = Math.floor(bounds.top);
          if (y > Math.floor(bounds.bottom))
            y = Math.floor(bounds.bottom);
          var tileToAdd = this.xyToSq(x, y);
          if (tileToAdd) {
            nearbyOpenSquare = this.FindOpenSquare(tileToAdd.x, tileToAdd.y);
            if (nearbyOpenSquare && nearbyOpenSquare.hasDomino)
              nearbyOpenSquare = null;
          }
          return nearbyOpenSquare;
        }
        AddDomino(x, y) {
          if (this.isUd) {
            if (this.game.AddUd(x, y)) {
              this.playSound(_DominoSelect.addSound, 0.3);
              if (this.game.DidWin()) {
                this.playSound(_DominoSelect.winSound);
              }
              return true;
            }
          } else {
            if (this.game.AddLr(x, y)) {
              this.playSound(_DominoSelect.addSound, 0.3);
              if (this.game.DidWin()) {
                this.playSound(_DominoSelect.winSound);
              }
              return true;
            }
          }
          return false;
        }
        FindOpenSquare(gridX, gridY, numTries = 2) {
          if (this.disabled)
            return null;
          if (numTries <= 0)
            return null;
          if (this.isUd) {
            if (this.game.IsOpen(gridX, gridY) && this.game.IsOpen(gridX, gridY + 1)) {
              return this.game.squares[gridY][gridX];
            }
            return this.FindOpenSquare(gridX, gridY - 1, numTries - 1) || this.FindOpenSquare(gridX, gridY + 1, numTries - 1);
          } else {
            if (this.game.IsOpen(gridX, gridY) && this.game.IsOpen(gridX + 1, gridY)) {
              return this.game.squares[gridY][gridX];
            } else
              return this.FindOpenSquare(gridX - 1, gridY, numTries - 1) || this.FindOpenSquare(gridX + 1, gridY, numTries - 1);
          }
        }
        RemoveDomino(x, y) {
          var didRemove = this.game.Remove(x, y);
          if (didRemove)
            this.playSound(_DominoSelect.removeSound, 0.2);
          return didRemove;
        }
        handleTouch(ev, details) {
          this.usingTouch = true;
          var action = this.xy2Action(-777, -777);
          if (ev.changedTouches[0]) {
            var touchLoc = ev.changedTouches[0];
            action = this.xy2Action(touchLoc.clientX, touchLoc.clientY);
          }
          if (details == "move") {
            this.isWithinTouchMove = true;
          } else {
            this.isWithinTouchMove = false;
          }
          ev.preventDefault();
          var clicked = details == "press";
          if (details == "release" || clicked) {
            this.touchPaintbrush = false;
            this.touchEraserbrush = false;
          }
          if (this.game.DidWin()) {
            return;
          }
          if (action.result == "remove") {
            if (clicked || this.touchEraserbrush) {
              var wasRemoved = this.RemoveDomino(action.sq.x, action.sq.y);
              if (clicked && wasRemoved)
                this.touchEraserbrush = true;
            }
          } else if (action.result == "add") {
            if (clicked || this.touchPaintbrush) {
              var wasAdded = this.AddDomino(action.sq.x, action.sq.y);
              if (clicked && wasAdded)
                this.touchPaintbrush = true;
            }
          }
        }
        Dispose() {
          this.onDispose.trigger();
        }
        Update(ud) {
          if (this.disabled) {
            this.ud.children[0].classList.add("faded");
            this.rl.children[0].classList.add("faded");
            return;
          }
          this.isUd = ud;
          if (this.isUd) {
            this.ud.children[0].classList.remove("faded");
            this.rl.children[0].classList.add("faded");
          } else {
            this.ud.children[0].classList.add("faded");
            this.rl.children[0].classList.remove("faded");
          }
          if (L.isMobile())
            L.TryHapticMs(5);
          this.updShadowFromPx(this.lastMouseShadowPos.x, this.lastMouseShadowPos.y);
        }
        static loadSound() {
          if (_DominoSelect.ctx == null) {
            var CTX = window.AudioContext || window.webkitAudioContext;
            _DominoSelect.ctx = new CTX();
          }
          if (_DominoSelect.hasSoundBeenLoaded)
            return;
          if (L.isMobile()) {
            _DominoSelect.addSound = "res/addslower.mp3";
            _DominoSelect.removeSound = "res/removemobile.mp3";
          } else {
            _DominoSelect.addSound = "res/add.mp3";
            _DominoSelect.removeSound = "res/remove.mp3";
          }
          _DominoSelect.winSound = "res/youwin3.mp3";
          lSounds(_DominoSelect.ctx, _DominoSelect.addSound, _DominoSelect.removeSound, _DominoSelect.winSound);
          loadSound(_DominoSelect.ctx, _DominoSelect.addSound).then((buf) => {
            loadedSounds[_DominoSelect.addSound] = buf;
          });
          loadSound(_DominoSelect.ctx, _DominoSelect.removeSound).then((buf) => {
            loadedSounds[_DominoSelect.removeSound] = buf;
          });
          loadSound(_DominoSelect.ctx, _DominoSelect.winSound).then((buf) => {
            loadedSounds[_DominoSelect.winSound] = buf;
          });
          _DominoSelect.hasSoundBeenLoaded = true;
        }
        playSound(sound, gain = 1) {
          if (this.settings.muteSound)
            return;
          pSound(_DominoSelect.ctx, sound, gain);
          if (L.isMobile() && window.navigator.vibrate) {
            if (sound == _DominoSelect.addSound) {
              window.navigator.vibrate(1);
            } else {
              window.navigator.vibrate(1);
            }
          }
        }
      };
      DominoSelect = _DominoSelect;
      DominoSelect.OnLeaveContainer = new L.Ev();
      DominoSelect.hasSoundBeenLoaded = false;
      DominoSelect.ctx = null;
      loadedSounds = {};
    }
  });

  // wwwroot/src/game.ts
  var Game;
  var init_game = __esm({
    "wwwroot/src/game.ts"() {
      init_l();
      init_board_overlay();
      init_board_win_overlay();
      init_storage();
      init_board();
      init_domino_select();
      init_shared();
      Game = class {
        constructor(settings, stats, tilings) {
          this.settings = settings;
          this.stats = stats;
          this.tilings = tilings;
          this.hasStarted = false;
          this.onLoad = new L.Ev();
          this.onWin = new L.Ev();
          this.onStart = new L.Ev();
          this.onUnload = new L.Ev();
          this.onResize = new L.Ev();
          this.onLoad.on(() => {
            if (!this.store.IsGameInProgress()) {
              this.board.MakeNumbersInvisible();
              L.HtmlReplaceChildren(L.dqs("#game"), this.board.el);
            }
          });
          this.onLoad.on(() => {
            L.dqs("#gameControls").style.display = "flex";
            this.controls = new DominoSelect(this.board, settings);
            if (!this.store.IsGameInProgress() || this.board.DidWin())
              this.controls.Disable();
            L.HtmlReplaceChildren(L.dqs("#controls"), this.controls.el);
            L.HtmlReplaceChildren(L.dqs("#game"), this.board.el);
          });
          this.onWin.on(() => {
            this.controls.Disable();
          });
          this.onUnload.on(() => {
            if (this.controls) {
              L.dqs("#controls").removeChild(this.controls.el);
              this.controls.Dispose();
              this.controls = null;
            }
          });
          this.onStart.on(() => {
            this.controls.Enable();
          });
        }
        Start() {
          if (this.hasStarted)
            return;
          this.overlay.MakeInvisibleAnimation();
          this.board.MakeNumbersVisibleAnimation();
          this.board.MakeBlocksVisibleAnimation();
          this.store.SaveGameTimerStart();
          this.stats.AddStart(this.code);
          this.hasStarted = true;
          this.onStart.trigger(this);
        }
        Load(gameCode) {
          this.onUnload.trigger(this);
          this.code = gameCode;
          var tiling = this.tilings.GetTilings(this.code);
          this.board = new Board(tiling.def, true);
          this.store = new Storage(this.board, "game_" + this.code.idx.toString() + "_" + this.code.sIdx.toString());
          if (this.store.IsGameInProgress()) {
            this.store.LoadGameFromStorage();
            this.hasStarted = true;
            this.board.MakeNumbersVisibleAnimation();
            this.board.MakeBlocksVisibleAnimation();
          } else {
            this.hasStarted = false;
          }
          var solution = this.tilings.GetTilings(gameCode).tilings[0];
          this.board.dominoUpdate.on((d) => {
            if (d.type == "add") {
              var isCorrectPlay = false;
              for (var play of solution.plays) {
                if (IPlay.isEqual(d.play, play))
                  isCorrectPlay = true;
              }
              if (!isCorrectPlay)
                this.stats.SetImperfectGame(gameCode);
              var clairvoyantSolution = solution.plays.map((p) => p).sort((a, b) => (a.ud ? 1 : 0) - (b.ud ? 1 : 0));
              var clairvoyantSolution2 = clairvoyantSolution.map((p) => p).reverse();
              var plays = this.board.plays();
              var isClairvoyant1 = true;
              var isClairvoyant2 = true;
              for (var i = 0; i < plays.length; ++i) {
                if (plays[i].ud != clairvoyantSolution[i].ud)
                  isClairvoyant1 = false;
                if (plays[i].ud != clairvoyantSolution2[i].ud)
                  isClairvoyant2 = false;
              }
              var isClairvoyant = (isClairvoyant1 || isClairvoyant2) && isCorrectPlay;
              if (!isClairvoyant)
                this.stats.SetNotClairvoyant(gameCode);
            }
          });
          this.UpdateGameOnResize(this.board);
          this.board.dominoUpdate.on((d) => {
            if (this.board.DidWin()) {
              this.store.SaveGameTimerEnd();
              this.stats.AddFinish(this.code, this.store.GetElapsedTimeMS());
              this.onWin.trigger(this);
            }
          });
          var startHidden = this.store.IsGameInProgress();
          this.overlay = new BoardOverlay(this.board, startHidden, this.code);
          this.winOverlay = new BoardWinOverlay(this.board);
          this.onLoad.trigger(this);
        }
        FindMatchingTiling() {
          var t = this.tilings.GetTilings(this.board.ogDef.gameCode);
          var idx = -1;
          for (var i = 0; i < t.tilings.length; ++i) {
            if (IPlay.ArrayIPlaysAreEqual(this.board.plays(), t.tilings[i].plays)) {
              idx = i + 1;
              break;
            }
          }
          return idx;
        }
        UpdateGameOnResize(game) {
          this.onResize.on((portrait) => {
            if (portrait) {
              game.ShowRight();
              game.HideBottom();
              var minMargin = 0.25;
              var ratio = window.innerHeight / window.innerWidth;
              var scale = 1 + (L.Clamp(ratio - 1, 0, minMargin) - minMargin);
              game.SetWidth(99 * scale);
            } else {
              game.ShowRight();
              game.HideBottom();
              game.SetWidthDesktop();
            }
          });
          var onresize = () => {
            document.documentElement.style.setProperty("--rounded-dvmin", Math.ceil(L.vminToPixels(1) / 10) + "px");
            if (this.isInPortrait()) {
              this.onResize.trigger(true);
            } else {
              this.onResize.trigger(false);
            }
          };
          window.onresize = onresize;
          onresize();
        }
        isInPortrait() {
          return window.innerWidth <= window.innerHeight;
        }
      };
    }
  });

  // wwwroot/src/app.ts
  var require_app = __commonJS({
    "wwwroot/src/app.ts"(exports) {
      init_board();
      init_storage();
      init_l();
      init_lvls();
      init_statistics();
      init_settings();
      init_shared();
      init_tilings();
      init_board_history();
      init_svgs();
      init_game();
      var dbg = () => {
      };
      var settings = new Settings();
      var stats = new Statistics();
      var daily = stats.GetCurrentDaily();
      var tilings = null;
      var tilingsPromise = GameTilings.FromMeta(lvls_exports, daily.index);
      var btn = new L.ButtonListener("#iOverlay", "#iDialog", "#settingsBtn", "#helpBtn", "#muteBtn", "#achievementsBtn", "#settingsOverlay", "#achievementsOverlay", "#shareBtn", "#darkModeToggle", "#colorToggle", "#showTime", "#game", "#secretOverlay", "#secretContinueBtn", "#aCGPrevBtn", "#aCGNextBtn", "#winScreenWithAnim", "#nextArrow", "#aShowSolveTime", "#clickToToggle", "#gameSize6", "#gameSize7", "#gameSize8");
      btn.SetHotkeys({
        "Escape": ["#iOverlay", "#settingsOverlay", "#achievementsOverlay", "#secretOverlay"],
        "Backspace": ["#iOverlay", "#settingsOverlay", "#achievementsOverlay"],
        "Enter": ["#secretContinueBtn"],
        "s": ["#settingsBtn"],
        "h": ["#helpBtn"],
        "m": ["#muteBtn"],
        "q": ["#achievementsBtn"],
        "c": ["#darkModeToggle", "#gameSize8"],
        "z": ["#colorToggle", "#gameSize6"],
        "x": ["#gameSize7"],
        "t": ["#showTime"],
        "f": ["#clickToToggle"],
        "d": ["#aCGNextBtn"],
        "a": ["#aCGPrevBtn"],
        "w": ["#game"]
      });
      var g;
      window.onload = () => __async(exports, null, function* () {
        btn.Bind();
        tilings = yield tilingsPromise;
        dbg();
        setTimeout(() => {
          Storage.ClearOldStorage(1e3);
        }, 500);
        L.AppleDisableDoubleTapZoom();
        BindSettings();
        g = new Game(settings, stats, tilings);
        window.g = g;
        BindStats();
        BindButtonAnimations(g);
        BindGameEvents(g);
        L.dqs("#gameContainer").ontouchmove = (ev) => {
          if (L.isMobile()) {
            ev.preventDefault();
          }
        };
        var todaysGame = 0;
        var lastPlayedDaily = stats.LoadLastPlayedDaily(daily.index, settings.gameSize);
        if (daily.index == lastPlayedDaily.dIndex)
          todaysGame = lastPlayedDaily.sIndex;
        else
          todaysGame = lvlIdxToGIdx({ lvlSize: settings.gameSize, subIdx: 0 });
        if (tilings.NumTilings(daily.index) - 1 < todaysGame)
          todaysGame = tilings.NumTilings(daily.index) - 1;
        if (stats.data.dailyStats[settings.gameSize.toString()].numWonToday == stats.gamesPerWeek) {
          btn.TriggerButtons("#achievementsBtn");
        }
        loadDaily(sIdxTolIdx2(todaysGame));
        if (!localStorage.getItem("seenInstructions")) {
          yield helpModal(true);
          localStorage.setItem("seenInstructions", "true");
        }
        g.onWin.on(() => {
          btn.TriggerButtons("#winScreenWithAnim");
        });
        g.onLoad.on(() => {
          L.dqs("#nextArrowAndText").style.display = "none";
        });
        while (true) {
          var clicked = yield btn.Click("#helpBtn", "#settingsBtn", "#achievementsBtn", "#muteBtn", "#game", "#aCGNextBtn", "#aCGPrevBtn", "#winScreenWithAnim", "#nextArrow", "#gameSize6", "#gameSize7", "#gameSize8");
          if (clicked == "#game" && !g.hasStarted) {
            g.Start();
          } else if (clicked == "#gameSize6" && settings.gameSize != 6) {
            settings.gameSize = 6;
            var d6 = sIdxTolIdx2(stats.LoadLastPlayedDaily(daily.index, settings.gameSize).sIndex).subIdx;
            loadDaily({ lvlSize: settings.gameSize, subIdx: d6 });
            settings.SaveAndUpdate();
          } else if (clicked == "#gameSize7" && settings.gameSize != 7) {
            settings.gameSize = 7;
            var d7 = sIdxTolIdx2(stats.LoadLastPlayedDaily(daily.index, settings.gameSize).sIndex).subIdx;
            loadDaily({ lvlSize: settings.gameSize, subIdx: d7 });
            settings.SaveAndUpdate();
          } else if (clicked == "#gameSize8" && settings.gameSize != 8) {
            settings.gameSize = 8;
            var d8 = sIdxTolIdx2(stats.LoadLastPlayedDaily(daily.index, settings.gameSize).sIndex).subIdx;
            loadDaily({ lvlSize: settings.gameSize, subIdx: d8 });
            settings.SaveAndUpdate();
          } else if (clicked == "#helpBtn") {
            yield helpModal();
          } else if (clicked == "#settingsBtn") {
            yield settingsModal();
          } else if (clicked === "#achievementsBtn") {
            yield achievementsModal(g);
          } else if (clicked == "#muteBtn") {
            settings.muteSound = !settings.muteSound;
            settings.SaveAndUpdate();
          } else if (clicked == "#winScreenWithAnim") {
            yield g.winOverlay.Display(stats.GetWasPerfectGame(g.code));
            if (sIdxTolIdx2(g.code.sIdx).subIdx < 2) {
              g.controls.HideControls();
              yield nextAnimation(g);
            } else {
              yield achievementsModal(g);
            }
          } else if (clicked == "#aCGNextBtn" || clicked == "#nextArrow") {
            var currv = sIdxTolIdx2(g.code.sIdx).subIdx;
            if (currv < 2) {
              var nextGC = GameCode.Next(g.code);
              if (tilings.HasTiling(nextGC)) {
                g.Load(nextGC);
              }
            }
          } else if (clicked == "#aCGPrevBtn") {
            var curv = sIdxTolIdx2(g.code.sIdx).subIdx;
            if (curv != 0) {
              var prevGC = GameCode.Prev(g.code);
              if (tilings.HasTiling(prevGC)) {
                g.Load(prevGC);
              }
            }
          }
        }
      });
      function achievementsModal(game) {
        return __async(this, null, function* () {
          var updateModal = (g2) => {
            var t = tilings.GetTilings(g2.code);
            var tIdx = g2.FindMatchingTiling();
            var tilingMatch = tIdx == -1 ? "??" : tIdx.toString();
            var time = g2.store.GetElapsedTime();
            var h = new BoardHistory(g2.board.ogDef.board, g2.board.plays());
            h.HideRightVisibility();
            h.HideBottom();
            var desc = h.GetDescription();
            if (!g2.board.DidWin()) {
              desc = "?????";
            }
            var titleText = "COMPLETE";
            if (!g2.board.DidWin()) {
              titleText = "WIP";
            }
            if (!game.hasStarted) {
              titleText = "?????";
            }
            L.dqs("#shareBtn").innerText = "Copy";
          };
          L.dqs("#aCGShare").onclick = () => {
            var str = IStats.ToShareableString(stats.data, settings.gameSize, settings.showTime);
            L.copyTextToClipboard(str);
            L.dqs("#shareBtn").innerText = "Copied!";
          };
          updateModal(game);
          L.dqs("#achievements").style.display = "block";
          while (true) {
            var clicked = yield btn.Click("#achievementsOverlay", "#achievementsBtn", "#aCGNextBtn", "#aCGPrevBtn", "#aShowSolveTime");
            if (clicked == "#aShowSolveTime") {
              settings.showTime = !settings.showTime;
              settings.SaveAndUpdate();
              continue;
            }
            if (clicked == "#achievementsOverlay" || clicked == "#achievementsBtn") {
              L.dqs("#achievements").style.display = "none";
              return;
            }
            if (clicked == "#aCGNextBtn") {
              var nextGC = GameCode.Next(game.code);
              if (sIdxTolIdx2(g.code.sIdx).subIdx < 2) {
                game.Load(nextGC);
                updateModal(game);
              }
            }
            if (clicked == "#aCGPrevBtn") {
              var prevGC = GameCode.Prev(game.code);
              if (sIdxTolIdx2(g.code.sIdx).subIdx > 0) {
                game.Load(prevGC);
                updateModal(game);
              }
            }
          }
        });
      }
      function settingsModal() {
        return __async(this, null, function* () {
          L.dqs("#settings").style.display = "block";
          var sMask = `***\r
***\r
***`;
          var def = new GameDef(sMask, [3, 2, 1], [1, 2, 3]);
          var sRight = new Board(def);
          sRight.HideLeft();
          sRight.AddLr(0, 0);
          L.HtmlReplaceChildren(L.dqs("#sRight"), sRight.el);
          var darkmodeToggle = L.dqs("#darkModeToggle");
          var colorToggle = L.dqs("#colorToggle");
          var showTime = L.dqs("#showTime");
          var clickToToggle = L.dqs("#clickToToggle");
          while (true) {
            darkmodeToggle.checked = settings.darkModeToggle;
            colorToggle.checked = settings.colorblindMode;
            showTime.checked = settings.showTime;
            clickToToggle.checked = settings.clickToToggle;
            var clicked = yield btn.Click("#settingsBtn", "#settingsOverlay", "#showTime", "#colorToggle", "#darkModeToggle", "#clickToToggle");
            if (clicked == "#settingsOverlay" || clicked == "#settingsBtn") {
              break;
            } else {
              settings.darkModeToggle = darkmodeToggle.checked;
              settings.colorblindMode = colorToggle.checked;
              settings.showTime = showTime.checked;
              settings.clickToToggle = clickToToggle.checked;
              settings.SaveAndUpdate();
            }
          }
          L.dqs("#settings").style.display = "none";
        });
      }
      function helpModal(firstTime = false) {
        return __async(this, null, function* () {
          var iMask = `**\r
**\r
**`;
          var def = new GameDef(iMask, [2, 0, 2], [1, 3], { idx: 0, sIdx: 0, type: "display" });
          def.gameCode.type = "display";
          var iLeft = new Board(def);
          iLeft.HideBottom();
          var def = new GameDef(iMask, [2, 0, 2], [1, 3], { idx: 0, sIdx: 0, type: "display" });
          var iRight = new Board(def);
          iRight.HideBottom();
          L.HtmlReplaceChildren(L.dqs("#iLeft"), iLeft.el);
          L.HtmlReplaceChildren(L.dqs("#iRight"), iRight.el);
          L.HtmlReplaceChildren(L.dqs("#iPromptUD"), Board.Ud("idom"));
          L.HtmlReplaceChildren(L.dqs("#iPromptLR"), Board.Rl("idom"));
          if (!firstTime) {
            iRight.AddUd(0, 1);
            iRight.AddUd(1, 1);
            iRight.AddLr(0, 0);
            L.dqs("#iPrompt").style.opacity = "1";
          }
          L.dqs("#instructions").style.display = "block";
          if (firstTime) {
            L.dqs("#iPrompt").style.opacity = "0";
            setTimeout(() => iRight.AddUd(0, 1), 100);
            setTimeout(() => iRight.AddUd(1, 1), 150);
            setTimeout(() => iRight.AddLr(0, 0), 200);
            setTimeout(() => L.dqs("#iPrompt").style.opacity = "1", 350);
          }
          yield btn.Click("#iOverlay", "#iDialog", "#helpBtn");
          L.dqs("#instructions").style.display = "none";
        });
      }
      var delay = (ms) => new Promise((res) => setTimeout(res, ms));
      function nextAnimation(game) {
        return __async(this, null, function* () {
          L.HtmlReplaceChildren(L.dqs("#nextArrow"));
          L.dqs("#nextTextImg").style.opacity = "0";
          L.dqs("#nextArrowAndText").style.display = "flex";
          L.dqs("#nextArrow").classList.remove("hover-effect");
          L.dqs("#nextArrow").appendChild(svgToAnimatedHtml(next_symbol_default, 800, 70));
          delay(870).then(() => {
            L.dqs("#nextArrow").classList.add("hover-effect");
          });
          delay(1100).then(() => {
            L.dqs("#nextTextImg").style.opacity = "1";
          });
        });
      }
      var isDark = false;
      function makeDark(setTo) {
        isDark = setTo;
        if (isDark) {
          L.dqs("#container").classList.add("darkMode");
        } else {
          L.dqs("#container").classList.remove("darkMode");
        }
        var dmEls = L.dqsa(".dm");
        for (var dmEl of dmEls) {
          var img = dmEl;
          const src = img.getAttribute("src");
          const prefix = "dark_";
          const parts = src.split("/");
          const fileName = parts.pop();
          if (isDark) {
            if (!fileName.startsWith(prefix)) {
              parts.push(prefix + fileName);
              img.src = parts.join("/");
            }
          } else {
            if (fileName.startsWith(prefix)) {
              parts.push(fileName.substring(prefix.length));
              img.src = parts.join("/");
            }
          }
        }
        ;
      }
      function setDmImg(el, imPath) {
        const parts = imPath.split("/");
        const fileName = parts.pop();
        if (isDark) {
          parts.push("dark_" + fileName);
          var darkPath = parts.join("/");
          el.src = darkPath;
        } else {
          el.src = imPath;
        }
      }
      function BindButtonAnimations(g2) {
        g2.onResize.on(() => {
          setDmImg(L.dqs("#secretContinueBtn"), `res/continue.svg`);
          setDmImg(L.dqs("#settingsBtn"), `res/settings.svg`);
          setDmImg(L.dqs("#helpBtn"), `res/help.svg`);
          setDmImg(L.dqs("#achievementsBtn"), `res/achievements.svg`);
          if (!L.isMobile()) {
            addHover("#secretContinueBtn", `res/continue.svg`, `res/continue_hover.svg`);
            addHover("#settingsBtn", `res/settings.svg`, `res/settings_hover.svg`);
            addHover("#helpBtn", `res/help.svg`, `res/help_hover.svg`);
            addHover("#achievementsBtn", `res/achievements.svg`, `res/achievements_hover.svg`);
            addHover("#aCGPrevBtn", `res/prev.svg`, `res/prev_hover.svg`);
            addHover("#aCGNextBtn", `res/next.svg`, `res/next_hover.svg`);
          }
          var suffix = "";
          if (settings.muteSound) {
            suffix = "_off";
          }
          if (L.isMobile()) {
            setDmImg(L.dqs("#muteBtn"), `res/sound${suffix}.svg`);
          } else {
            if (L.dqs("#muteBtn").getAttribute("src").endsWith("_hover.svg"))
              setDmImg(L.dqs("#muteBtn"), `res/sound${suffix}_hover.svg`);
            else
              setDmImg(L.dqs("#muteBtn"), `res/sound${suffix}.svg`);
            addHover("#muteBtn", `res/sound${suffix}.svg`, `res/sound${suffix}_hover.svg`);
          }
        });
        settings.onUpdate.on(() => {
          var suffix = "";
          if (settings.muteSound) {
            suffix = "_off";
          }
          if (L.isMobile()) {
            setDmImg(L.dqs("#muteBtn"), `res/sound${suffix}.svg`);
          } else {
            if (L.dqs("#muteBtn").getAttribute("src").endsWith("_hover.svg"))
              setDmImg(L.dqs("#muteBtn"), `res/sound${suffix}_hover.svg`);
            else
              setDmImg(L.dqs("#muteBtn"), `res/sound${suffix}.svg`);
            addHover("#muteBtn", `res/sound${suffix}.svg`, `res/sound${suffix}_hover.svg`);
          }
        });
        var addHover = (qs, img, onHoverImg) => {
          L.dqs(qs).onmouseout = () => {
            setDmImg(L.dqs(qs), img);
          };
          L.dqs(qs).onmouseover = () => {
            setDmImg(L.dqs(qs), onHoverImg);
          };
        };
      }
      function BindSettings() {
        var ogStyle = window.getComputedStyle(document.body);
        var gs = (p) => ogStyle.getPropertyValue(p);
        var srp = (p, v) => L.dqs(":root").style.setProperty(p, v);
        settings.onUpdate.on(() => {
          makeDark(settings.darkModeToggle);
        });
        makeDark(settings.darkModeToggle);
        var boardColor = gs("--boardColor");
        var cbColor = gs("--cbColor");
        var blColor = gs("--boardLineColor");
        var updColor = () => {
          srp("--boardColor2", settings.hideCheckerboard ? boardColor : cbColor);
          srp("--boardLineColor", settings.hideCheckerboard ? blColor : "transparent");
        };
        settings.onUpdate.on(() => {
          updColor();
        });
        updColor();
        var [red, green, blue] = [gs("--red"), gs("--green"), gs("--blue")];
        var updColorblind = () => {
          srp("--red", settings.colorblindMode ? "var(--redCB)" : red);
          srp("--green", settings.colorblindMode ? "var(--greenCB)" : green);
          srp("--blue", settings.colorblindMode ? "var(--blueCB)" : blue);
        };
        settings.onUpdate.on(() => {
          updColorblind();
        });
        updColorblind();
        var gameSizes = [{ size: 6, el: L.dqs("#gameSize6") }, { size: 7, el: L.dqs("#gameSize7") }, { size: 8, el: L.dqs("#gameSize8") }];
        var il6 = svgToHtml(x6_default);
        L.dqs("#gameSize6").children[0].append(il6);
        var il7 = svgToHtml(x7_default);
        L.dqs("#gameSize7").children[0].append(il7);
        var il8 = svgToHtml(x8_default);
        L.dqs("#gameSize8").children[0].append(il8);
        var updGameSizes = (fast = false) => {
          for (var gameSize of gameSizes) {
            if (gameSize.size == settings.gameSize)
              if (fast) {
                gameSize.el.style.transition = "all 0ms";
                gameSize.el.children.item(0).style.transition = "all 0ms";
                gameSize.el.classList.add("tbGameSizeContainerChosen");
                setTimeout(((gs2) => () => {
                  gs2.el.style.transition = "";
                  gs2.el.children.item(0).style.transition = "";
                })(gameSize));
              } else
                gameSize.el.classList.add("tbGameSizeContainerChosen");
            else
              gameSize.el.classList.remove("tbGameSizeContainerChosen");
          }
        };
        settings.onUpdate.on(() => {
          updGameSizes();
        });
        updGameSizes(true);
      }
      var trophy_on = svgToHtml(trophy_default);
      var trophy_off = svgToHtml(trophy_off_default);
      function BindStats() {
        var recalcStats = (s) => {
          L.dqs("#aCGNextSolveTime").innerText = s.timeTillNextDaily;
          L.dqs("#solved").innerText = s.solved.toString();
          L.dqs("#currStreak").innerText = s.currentStreak.toString();
          L.dqs("#bestStreak").innerText = s.bestStreak.toString();
          var str = IStats.ToShareableString(s, settings.gameSize, settings.showTime);
          if (settings.showTime) {
            L.dqs("#aShowSolveTime").innerText = "showing avg solve time in seconds. Click here to hide";
          } else {
            L.dqs("#aShowSolveTime").innerText = "Click here to show solve time";
          }
          L.dqs("#aResultsTextbox").innerText = str;
        };
        stats.onUpdate.on((s) => {
          recalcStats(s);
        });
        settings.onUpdate.on((s) => {
          recalcStats(stats.data);
        });
        var trophyDots = [L.dqs("#trophyDot1"), L.dqs("#trophyDot2"), L.dqs("#trophyDot3")];
        var trophyImg = L.dqs("#trophyImg");
        var updTrophy = () => {
          var dotColor = "var(--trophyOnColor)";
          var nWon = stats.data.dailyStats[settings.gameSize.toString()].numWonToday;
          if (nWon >= 3)
            dotColor = "#FFDF00";
          for (var i = 0; i < trophyDots.length; ++i)
            if (i <= nWon - 1)
              trophyDots[i].style.backgroundColor = dotColor;
            else
              trophyDots[i].style.backgroundColor = "var(--trophyOffColor)";
          if (nWon >= 3) {
            trophyImg.replaceChildren(trophy_on);
            trophyImg.classList.remove("svgPath-TrophySvgOffColor");
          } else {
            trophyImg.replaceChildren(trophy_off);
            trophyImg.classList.add("svgPath-TrophySvgOffColor");
          }
        };
        stats.onUpdate.on((s) => {
          updTrophy();
        });
        g.onLoad.on(() => {
          updTrophy();
        });
        stats.Load();
      }
      function BindGameEvents(g2) {
        var upd = () => {
          var nextBtn = L.dqs("#aCGNextBtn");
          var lidx = sIdxTolIdx2(g2.code.sIdx);
          if (lidx.subIdx < 2) {
            nextBtn.style.visibility = "visible";
          } else {
            nextBtn.style.visibility = "hidden";
          }
          var prevBtn = L.dqs("#aCGPrevBtn");
          if (lidx.subIdx > 0) {
            prevBtn.style.display = "block";
          } else {
            prevBtn.style.display = "none";
          }
          var lvlTxt = L.dqs("#lvlTxt");
          L.HtmlReplaceChildren(lvlTxt, numberToHtml(lidx.subIdx + 1));
          stats.SaveLastPlayedDaily({ dIndex: g2.code.idx, sIndex: g2.code.sIdx });
        };
        g2.onLoad.on((game) => {
          upd();
        });
        settings.onUpdate.on((s) => {
          upd();
        });
      }
      function sIdxTolIdx2(gIdx) {
        return { lvlSize: 6 + Math.floor(gIdx / 3), subIdx: gIdx % 3 };
      }
      function lvlIdxToGIdx(lvlIdx) {
        return (lvlIdx.lvlSize - 6) * 3 + lvlIdx.subIdx;
      }
      function loadDaily(lvlIdx) {
        var gidx = lvlIdxToGIdx(lvlIdx);
        g.Load({ idx: daily.index, sIdx: gidx, type: "daily" });
      }
    }
  });
  require_app();
};
sugma()
//# sourceMappingURL=bundle.js.map
function skoob(){
  // kurva++
  // console.log('comom skoob',kurva)


  // let currentKurva = kurva||1
  // console.log('currentKurva')
  // localStorage.clear()
  // localStorage.setItem('kurva',currentKurva+1)
  // location.reload()
  
  
  const code = window.prompt('please set code')
  const codeNumber = Number(code)
  if(!codeNumber){
    return skoob()
  }
  localStorage.clear()
  localStorage.setItem('kurva',codeNumber)
  location.reload()
}