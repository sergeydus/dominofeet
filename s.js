(() => {
  // s.ts
  var uuid4 = () => {
    const ho = (n, p) => n.toString(16).padStart(p, 0);
    const data = crypto.getRandomValues(new Uint8Array(16));
    data[6] = data[6] & 15 | 64;
    data[8] = data[8] & 63 | 128;
    const view = new DataView(data.buffer);
    return `${ho(view.getUint32(0), 8)}-${ho(view.getUint16(4), 4)}-${ho(view.getUint16(6), 4)}-${ho(view.getUint16(8), 4)}-${ho(view.getUint32(10), 8)}${ho(view.getUint16(14), 4)}`;
  };
  if (document.readyState === "complete") {
    doEverything();
  } else {
    document.addEventListener("DOMContentLoaded", function() {
      doEverything();
    });
  }
  function doEverything() {
    var _a;
    var testpage = "http://localhost:5287/res/testpane.html";
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.hostname === "") {
      if (location.href != testpage)
        return;
    }
    var loadTimeMS = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
    var uid = uuid4();
    var deviceType = dType();
    var ref = ((_a = document.referrer) != null ? _a : "").replace(/https?:\/\//, "");
    ref = ref.replace(/\?.*$/, "");
    ref = ref.replace(/#.*$/, "");
    var data = { deviceType, uid, referrer: ref, pathname: window.location.pathname, loadTimeMS, isVisible: true };
    var msg = JSON.stringify(data);
    var msg2send = { method: "post", body: msg, headers: { "Content-Type": "application/json" }, keepalive: true };
    var ep = "https://stats.isotropic.us/api/postData";
    if (location.href == testpage)
      ep = "http://localhost:5287/api/postData";
    var upd = () => fetch(ep, msg2send);
    document.addEventListener("visibilitychange", function() {
      if (document.visibilityState == "hidden") {
        data.isVisible = false;
        msg = JSON.stringify(data);
        msg2send = { method: "post", body: msg, headers: { "Content-Type": "application/json" }, keepalive: true };
        upd();
      } else if (document.visibilityState == "visible") {
        data.isVisible = true;
        msg = JSON.stringify(data);
        msg2send = { method: "post", body: msg, headers: { "Content-Type": "application/json" }, keepalive: true };
        upd();
      }
    });
    setInterval(upd, 60 * 1e3);
    upd();
  }
  function dType() {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return "tablet";
    } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return "mobile";
    }
    return "desktop";
  }
})();
//# sourceMappingURL=s.js.map
