var d = Object.defineProperty;
var m = (s, e, r) => e in s ? d(s, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : s[e] = r;
var i = (s, e, r) => m(s, typeof e != "symbol" ? e + "" : e, r);
const f = {
  SDK_CREATE: "The SDK could not be found.",
  IFRAME_NOT_FOUND: "The specified iframe could not be found.",
  EXPIRED_TOKEN: "Your token has expired. Please generate a new one.",
  DOM_NOT_IFRAME: "Cannot build the iframe as the DOM element is not an iframe.",
  INVALID_TOKEN: "The token is invalid or has expired. Please generate a new token.",
  INVALID_ORIGIN: "The origin of the source is not supported.",
  INVALID_DOMAIN: "The domain of the source is not supported.",
  ERROR_LOADING_IFRAME: "Failed to load the iframe correctly."
};
function u(s) {
  try {
    return new URL(s).origin === window.location.origin;
  } catch {
    return !1;
  }
}
const I = [
  ".sandboxqxm.com",
  ".quienpormi.com",
  ".quienxmi.com",
  ".qxm.com."
];
function l(s) {
  try {
    const e = new URL(s);
    if (e.hostname === "localhost")
      return e.port === "8000";
    if (e.protocol !== "https:")
      return !1;
    const r = e.hostname;
    return I.some((t) => t.endsWith(".") ? r.slice(0, -2).endsWith(t) : r.endsWith(t));
  } catch {
    return !1;
  }
}
const _ = [
  "iss",
  "iat",
  "exp",
  "data"
];
function p(s) {
  const e = Object.keys(s);
  return _.every((r) => e.includes(r));
}
function g(s) {
  try {
    const r = s.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"), t = JSON.parse(decodeURIComponent(atob(r).split("").map(function(n) {
      return "%" + ("00" + n.charCodeAt(0).toString(16)).slice(-2);
    }).join(""))), o = Math.floor(Date.now() / 1e3);
    return t.exp > o && p(t) ? t : null;
  } catch {
    return null;
  }
}
const E = "1.0.6", h = {
  all: [],
  resize: [],
  modals: [],
  error: []
};
class b {
  constructor(e, r) {
    i(this, "_domIframe");
    i(this, "_observers", h);
    i(this, "_checkExp");
    i(this, "_logs", !1);
    try {
      const { scrolling: t, resize: o, logs: n } = r ?? {};
      if (typeof e == "string" ? this._domIframe = document.querySelector(e) : this._domIframe = e, n === !0 && (this._logs = !0), this._logs && console.info("[QxmIframe]: Version " + E), !this._domIframe) {
        this.errorLog("IFRAME_NOT_FOUND");
        return;
      }
      if (!(this._domIframe instanceof HTMLIFrameElement)) {
        this.errorLog("DOM_NOT_IFRAME");
        return;
      }
      this._domIframe.setAttribute("frameborder", "0"), t || this._domIframe.setAttribute("scrolling", "no"), this.createListener(), (o ?? !0) && this.subscribe("resize", this.resize);
    } catch (t) {
      this.errorLog("SDK_CREATE", t);
    }
  }
  subscribe(e = "all", r) {
    this._observers[e].push(r);
  }
  error(e) {
    this.subscribe("error", e);
  }
  modals(e) {
    this.subscribe("modals", e);
  }
  async setToken(e) {
    const r = g(e);
    return clearInterval(this._checkExp), r ? r.aud && !u(r.aud) ? (this.errorLog("INVALID_ORIGIN"), null) : l(r.iss) ? (this._checkExp = setInterval(() => {
      const t = Math.floor(Date.now() / 1e3);
      r.exp < t && (clearInterval(this._checkExp), this.errorLog("EXPIRED_TOKEN"));
    }, 1e3), await this.setSrcIframe(r.iss, e) ? r : null) : (this.errorLog("INVALID_DOMAIN"), null) : (this.errorLog("INVALID_TOKEN"), null);
  }
  destroy() {
    this._domIframe = void 0, this._observers = h, clearInterval(this._checkExp);
  }
  setSrcIframe(e, r) {
    return new Promise((t) => {
      const o = this._domIframe, n = () => {
        c(), t(!0);
      }, a = () => {
        this.errorLog("ERROR_LOADING_IFRAME"), c(), t(!1);
      }, c = () => {
        o.removeEventListener("load", n), o.removeEventListener("error", a);
      };
      try {
        o.src = e + "/api/iframe/project/create?token=" + r, o.addEventListener("load", n), o.addEventListener("error", a);
      } catch {
        a();
      }
    });
  }
  createListener() {
    window.addEventListener("message", (e) => {
      const { origin: r, data: t } = e;
      if (l(r)) {
        this._logs && console.log("[QxmIframe]:", t);
        let o = t.type ?? "all";
        this._observers[o] || (o = "all"), this._observers[o].forEach((n) => n({
          _domIframe: this._domIframe,
          _observers: this._observers,
          data: t
        }));
      }
    });
  }
  errorLog(e, r = null) {
    const t = f[e] ?? e;
    this._logs && console.error("[QxmIframe]:", t, r), this._observers.error.forEach((o) => o({
      _domIframe: this._domIframe,
      _observers: this._observers,
      code: e,
      message: t,
      error: r
    }));
  }
  resize(e) {
    const { _domIframe: r, data: t } = e, o = window.getComputedStyle(r), n = parseInt(o.paddingTop) + parseInt(o.paddingBottom);
    r.style.setProperty("height", `${t.height + n}px`, "important");
  }
}
typeof window < "u" && (window.QxmIframeProject = b);
export {
  b as default
};
//# sourceMappingURL=qxm-iframe-project.es.js.map
