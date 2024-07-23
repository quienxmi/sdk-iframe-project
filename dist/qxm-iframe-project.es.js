var u = Object.defineProperty;
var d = (o, e, r) => e in o ? u(o, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : o[e] = r;
var i = (o, e, r) => d(o, typeof e != "symbol" ? e + "" : e, r);
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
function m(o) {
  try {
    return new URL(o).origin === window.location.origin;
  } catch {
    return !1;
  }
}
const p = [
  ".sandboxqxm.com",
  ".quienpormi.com",
  ".quienxmi.com",
  ".qxm.com."
];
function l(o) {
  try {
    const e = new URL(o);
    if (e.hostname === "localhost")
      return e.port === "8000";
    if (e.protocol !== "https:")
      return !1;
    const r = e.hostname;
    return p.some((t) => t.endsWith(".") ? r.slice(0, -2).endsWith(t) : r.endsWith(t));
  } catch {
    return !1;
  }
}
const I = [
  "iss",
  "iat",
  "exp",
  "data"
];
function _(o) {
  const e = Object.keys(o);
  return I.every((r) => e.includes(r));
}
function E(o) {
  try {
    const r = o.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"), t = JSON.parse(decodeURIComponent(atob(r).split("").map(function(n) {
      return "%" + ("00" + n.charCodeAt(0).toString(16)).slice(-2);
    }).join(""))), s = Math.floor(Date.now() / 1e3);
    return t.exp > s && _(t) ? t : null;
  } catch {
    return null;
  }
}
const b = "1.0.7", h = {
  all: [],
  resize: [],
  event: [],
  error: []
};
class v {
  constructor(e, r) {
    i(this, "_domIframe");
    i(this, "_observers", h);
    i(this, "_checkExp");
    i(this, "_logs", !1);
    try {
      const { scrolling: t, resize: s, logs: n } = r ?? {};
      if (typeof e == "string" ? this._domIframe = document.querySelector(e) : this._domIframe = e, n === !0 && (this._logs = !0), this._logs && console.info("[QxmIframe]: Version " + b), !this._domIframe) {
        this.pushError("IFRAME_NOT_FOUND");
        return;
      }
      if (!(this._domIframe instanceof HTMLIFrameElement)) {
        this.pushError("DOM_NOT_IFRAME");
        return;
      }
      this._domIframe.setAttribute("frameborder", "0"), t || this._domIframe.setAttribute("scrolling", "no"), this.createListener(), (s ?? !0) && this.subscribe("resize", this.resize);
    } catch (t) {
      this.pushError("SDK_CREATE", null, t), this.destroy();
    }
  }
  subscribe(e = "all", r) {
    this._observers[e].push(r);
  }
  subscribeError(e) {
    this.subscribe("error", e);
  }
  subscribeEvent(e) {
    this.subscribe("event", e);
  }
  async setToken(e) {
    e = e.trim();
    const r = E(e);
    return clearInterval(this._checkExp), r ? r.aud && !m(r.aud) ? (this.pushError("INVALID_ORIGIN"), null) : l(r.iss) ? (this._checkExp = setInterval(() => {
      const t = Math.floor(Date.now() / 1e3);
      r.exp < t && (clearInterval(this._checkExp), this.pushError("EXPIRED_TOKEN"));
    }, 1e3), await this.setSrcIframe(r.iss, e) ? r : null) : (this.pushError("INVALID_DOMAIN"), null) : (this.pushError("INVALID_TOKEN"), null);
  }
  destroy() {
    this._domIframe = void 0, this._observers = h, clearInterval(this._checkExp);
  }
  setSrcIframe(e, r) {
    return new Promise((t) => {
      const s = this._domIframe, n = () => {
        c(), t(!0);
      }, a = () => {
        this.pushError("ERROR_LOADING_IFRAME"), c(), t(!1);
      }, c = () => {
        s.removeEventListener("load", n), s.removeEventListener("error", a);
      };
      try {
        s.src = e + "/api/iframe/project/create?token=" + r, s.addEventListener("load", n), s.addEventListener("error", a);
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
        let s = t.type ?? "all";
        if (this._observers[s] || (s = "all"), s === "error") {
          this.pushError(t.code, t.message);
          return;
        }
        this._observers[s].forEach((n) => n({
          _domIframe: this._domIframe,
          data: t
        }));
      }
    });
  }
  pushError(e, r = null, t = null) {
    r || (r = f[e] ?? e), this._logs && console.error("[QxmIframe]:", r, t), this._observers.error.forEach((s) => s({
      _domIframe: this._domIframe,
      code: e,
      message: r,
      error: t
    }));
  }
  resize(e) {
    const { _domIframe: r, data: t } = e, s = window.getComputedStyle(r), n = parseInt(s.paddingTop) + parseInt(s.paddingBottom);
    r.style.setProperty("height", `${t.height + n}px`, "important");
  }
}
typeof window < "u" && (window.QxmIframeProject = v);
export {
  v as default
};
//# sourceMappingURL=qxm-iframe-project.es.js.map
