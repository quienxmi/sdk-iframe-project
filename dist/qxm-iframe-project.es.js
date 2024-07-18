var h = Object.defineProperty;
var d = (s, e, r) => e in s ? h(s, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : s[e] = r;
var i = (s, e, r) => d(s, typeof e != "symbol" ? e + "" : e, r);
const f = {
  SDK_CREATE: "The SDK could not be found.",
  IFRAME_NOT_FOUND: "The iframe could not be found.",
  DOM_NOT_IFRAME: "You cannot build the iframe because the DOM is not an iframe.",
  INVALID_TOKEN: "The token is expired or has an error. It is necessary to generate the token again.",
  INVALID_DOMAIN: "The source domain is not supported.",
  ERROR_LOADING_IFRAME: "The iframe could not be loaded correctly."
}, u = [
  "localhost",
  ".sandboxqxm.com",
  ".quienpormi.com",
  ".quienxmi.com",
  ".qxm.com."
];
function l(s) {
  try {
    const e = new URL(s), r = e.hostname;
    return u.some((t) => t === "localhost" ? r === "localhost" : e.protocol !== "https:" ? !1 : t.endsWith(".") ? r.slice(0, -2).endsWith(t) : r.endsWith(t));
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
function I(s) {
  const e = Object.keys(s);
  return _.every((r) => e.includes(r));
}
function p(s) {
  try {
    const r = s.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"), t = JSON.parse(decodeURIComponent(atob(r).split("").map(function(n) {
      return "%" + ("00" + n.charCodeAt(0).toString(16)).slice(-2);
    }).join(""))), o = Math.floor(Date.now() / 1e3);
    return t.exp > o && I(t) ? t : null;
  } catch {
    return null;
  }
}
const b = "1.0.5", m = {
  all: [],
  resize: [],
  modals: [],
  error: []
};
class g {
  constructor(e, r) {
    i(this, "_domIframe");
    i(this, "_observers", m);
    i(this, "_checkExp");
    i(this, "_logs", !1);
    try {
      const { scrolling: t, resize: o, logs: n } = r ?? {};
      if (typeof e == "string" ? this._domIframe = document.querySelector(e) : this._domIframe = e, n === !0 && (this._logs = !0), this._logs && console.info("[QxmIframe]: Version " + b), !this._domIframe) {
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
    const r = p(e);
    return r ? l(r.iss) ? (this._checkExp = setInterval(() => {
      const t = Math.floor(Date.now() / 1e3);
      r.exp < t && (this.errorLog("EXPIRED_TOKEN"), clearInterval(this._checkExp));
    }, 1e3), await this.setSrcIframe(r.iss, e) ? r : null) : (this.errorLog("INVALID_DOMAIN"), null) : (this.errorLog("INVALID_TOKEN"), null);
  }
  destroy() {
    this._domIframe = void 0, this._observers = m;
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
          data: t
        }));
      }
    });
  }
  errorLog(e, r = null) {
    const t = f[e] ?? e;
    this._logs && console.error("[QxmIframe]:", t, r), this._observers.error.forEach((o) => o({
      _domIframe: this._domIframe,
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
window.QxmIframeProject = g;
export {
  g as default
};
//# sourceMappingURL=qxm-iframe-project.es.js.map
