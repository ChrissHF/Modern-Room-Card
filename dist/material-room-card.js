var Ut = Object.defineProperty;
var Mt = (r, t, e) => t in r ? Ut(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var v = (r, t, e) => Mt(r, typeof t != "symbol" ? t + "" : t, e);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const V = globalThis, ot = V.ShadowRoot && (V.ShadyCSS === void 0 || V.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, nt = Symbol(), lt = /* @__PURE__ */ new WeakMap();
let St = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== nt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (ot && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = lt.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && lt.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Ft = (r) => new St(typeof r == "string" ? r : r + "", void 0, nt), Ct = (r, ...t) => {
  const e = r.length === 1 ? r[0] : t.reduce((i, s, o) => i + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + r[o + 1], r[0]);
  return new St(e, r, nt);
}, Ht = (r, t) => {
  if (ot) r.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), s = V.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = e.cssText, r.appendChild(i);
  }
}, ht = ot ? (r) => r : (r) => r instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return Ft(e);
})(r) : r;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Rt, defineProperty: zt, getOwnPropertyDescriptor: Dt, getOwnPropertyNames: jt, getOwnPropertySymbols: Nt, getPrototypeOf: It } = Object, w = globalThis, ut = w.trustedTypes, Bt = ut ? ut.emptyScript : "", Q = w.reactiveElementPolyfillSupport, z = (r, t) => r, G = { toAttribute(r, t) {
  switch (t) {
    case Boolean:
      r = r ? Bt : null;
      break;
    case Object:
    case Array:
      r = r == null ? r : JSON.stringify(r);
  }
  return r;
}, fromAttribute(r, t) {
  let e = r;
  switch (t) {
    case Boolean:
      e = r !== null;
      break;
    case Number:
      e = r === null ? null : Number(r);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(r);
      } catch {
        e = null;
      }
  }
  return e;
} }, at = (r, t) => !Rt(r, t), pt = { attribute: !0, type: String, converter: G, reflect: !1, useDefault: !1, hasChanged: at };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), w.litPropertyMetadata ?? (w.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let O = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = pt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), s = this.getPropertyDescriptor(t, i, e);
      s !== void 0 && zt(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: s, set: o } = Dt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(n) {
      this[e] = n;
    } };
    return { get: s, set(n) {
      const c = s == null ? void 0 : s.call(this);
      o == null || o.call(this, n), this.requestUpdate(t, c, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? pt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(z("elementProperties"))) return;
    const t = It(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(z("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(z("properties"))) {
      const e = this.properties, i = [...jt(e), ...Nt(e)];
      for (const s of i) this.createProperty(s, e[s]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [i, s] of e) this.elementProperties.set(i, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, i] of this.elementProperties) {
      const s = this._$Eu(e, i);
      s !== void 0 && this._$Eh.set(s, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const s of i) e.unshift(ht(s));
    } else t !== void 0 && e.push(ht(t));
    return e;
  }
  static _$Eu(t, e) {
    const i = e.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((e) => e(this));
  }
  addController(t) {
    var e;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((e = t.hostConnected) == null || e.call(t));
  }
  removeController(t) {
    var e;
    (e = this._$EO) == null || e.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const i of e.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Ht(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((e) => {
      var i;
      return (i = e.hostConnected) == null ? void 0 : i.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var i;
      return (i = e.hostDisconnected) == null ? void 0 : i.call(e);
    });
  }
  attributeChangedCallback(t, e, i) {
    this._$AK(t, i);
  }
  _$ET(t, e) {
    var o;
    const i = this.constructor.elementProperties.get(t), s = this.constructor._$Eu(t, i);
    if (s !== void 0 && i.reflect === !0) {
      const n = (((o = i.converter) == null ? void 0 : o.toAttribute) !== void 0 ? i.converter : G).toAttribute(e, i.type);
      this._$Em = t, n == null ? this.removeAttribute(s) : this.setAttribute(s, n), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var o, n;
    const i = this.constructor, s = i._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const c = i.getPropertyOptions(s), a = typeof c.converter == "function" ? { fromAttribute: c.converter } : ((o = c.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? c.converter : G;
      this._$Em = s;
      const h = a.fromAttribute(e, c.type);
      this[s] = h ?? ((n = this._$Ej) == null ? void 0 : n.get(s)) ?? h, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, s = !1, o) {
    var n;
    if (t !== void 0) {
      const c = this.constructor;
      if (s === !1 && (o = this[t]), i ?? (i = c.getPropertyOptions(t)), !((i.hasChanged ?? at)(o, e) || i.useDefault && i.reflect && o === ((n = this._$Ej) == null ? void 0 : n.get(t)) && !this.hasAttribute(c._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: s, wrapped: o }, n) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, n ?? e ?? this[t]), o !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), s === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var i;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [o, n] of this._$Ep) this[o] = n;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [o, n] of s) {
        const { wrapped: c } = n, a = this[o];
        c !== !0 || this._$AL.has(o) || a === void 0 || this.C(o, void 0, n, a);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (i = this._$EO) == null || i.forEach((s) => {
        var o;
        return (o = s.hostUpdate) == null ? void 0 : o.call(s);
      }), this.update(e)) : this._$EM();
    } catch (s) {
      throw t = !1, this._$EM(), s;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$EO) == null || e.forEach((i) => {
      var s;
      return (s = i.hostUpdated) == null ? void 0 : s.call(i);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((e) => this._$ET(e, this[e]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
O.elementStyles = [], O.shadowRootOptions = { mode: "open" }, O[z("elementProperties")] = /* @__PURE__ */ new Map(), O[z("finalized")] = /* @__PURE__ */ new Map(), Q == null || Q({ ReactiveElement: O }), (w.reactiveElementVersions ?? (w.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const D = globalThis, ft = (r) => r, Z = D.trustedTypes, _t = Z ? Z.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, Tt = "$lit$", $ = `lit$${Math.random().toFixed(9).slice(2)}$`, Pt = "?" + $, Wt = `<${Pt}>`, T = document, j = () => T.createComment(""), N = (r) => r === null || typeof r != "object" && typeof r != "function", ct = Array.isArray, qt = (r) => ct(r) || typeof (r == null ? void 0 : r[Symbol.iterator]) == "function", Y = `[ 	
\f\r]`, F = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, mt = /-->/g, yt = />/g, x = RegExp(`>|${Y}(?:([^\\s"'>=/]+)(${Y}*=${Y}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), gt = /'/g, vt = /"/g, Ot = /^(?:script|style|textarea|title)$/i, Vt = (r) => (t, ...e) => ({ _$litType$: r, strings: t, values: e }), g = Vt(1), P = Symbol.for("lit-noChange"), m = Symbol.for("lit-nothing"), bt = /* @__PURE__ */ new WeakMap(), S = T.createTreeWalker(T, 129);
function Lt(r, t) {
  if (!ct(r) || !r.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return _t !== void 0 ? _t.createHTML(t) : t;
}
const Gt = (r, t) => {
  const e = r.length - 1, i = [];
  let s, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = F;
  for (let c = 0; c < e; c++) {
    const a = r[c];
    let h, l, d = -1, _ = 0;
    for (; _ < a.length && (n.lastIndex = _, l = n.exec(a), l !== null); ) _ = n.lastIndex, n === F ? l[1] === "!--" ? n = mt : l[1] !== void 0 ? n = yt : l[2] !== void 0 ? (Ot.test(l[2]) && (s = RegExp("</" + l[2], "g")), n = x) : l[3] !== void 0 && (n = x) : n === x ? l[0] === ">" ? (n = s ?? F, d = -1) : l[1] === void 0 ? d = -2 : (d = n.lastIndex - l[2].length, h = l[1], n = l[3] === void 0 ? x : l[3] === '"' ? vt : gt) : n === vt || n === gt ? n = x : n === mt || n === yt ? n = F : (n = x, s = void 0);
    const u = n === x && r[c + 1].startsWith("/>") ? " " : "";
    o += n === F ? a + Wt : d >= 0 ? (i.push(h), a.slice(0, d) + Tt + a.slice(d) + $ + u) : a + $ + (d === -2 ? c : u);
  }
  return [Lt(r, o + (r[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class I {
  constructor({ strings: t, _$litType$: e }, i) {
    let s;
    this.parts = [];
    let o = 0, n = 0;
    const c = t.length - 1, a = this.parts, [h, l] = Gt(t, e);
    if (this.el = I.createElement(h, i), S.currentNode = this.el.content, e === 2 || e === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (s = S.nextNode()) !== null && a.length < c; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const d of s.getAttributeNames()) if (d.endsWith(Tt)) {
          const _ = l[n++], u = s.getAttribute(d).split($), f = /([.?@])?(.*)/.exec(_);
          a.push({ type: 1, index: o, name: f[2], strings: u, ctor: f[1] === "." ? Jt : f[1] === "?" ? Kt : f[1] === "@" ? Qt : J }), s.removeAttribute(d);
        } else d.startsWith($) && (a.push({ type: 6, index: o }), s.removeAttribute(d));
        if (Ot.test(s.tagName)) {
          const d = s.textContent.split($), _ = d.length - 1;
          if (_ > 0) {
            s.textContent = Z ? Z.emptyScript : "";
            for (let u = 0; u < _; u++) s.append(d[u], j()), S.nextNode(), a.push({ type: 2, index: ++o });
            s.append(d[_], j());
          }
        }
      } else if (s.nodeType === 8) if (s.data === Pt) a.push({ type: 2, index: o });
      else {
        let d = -1;
        for (; (d = s.data.indexOf($, d + 1)) !== -1; ) a.push({ type: 7, index: o }), d += $.length - 1;
      }
      o++;
    }
  }
  static createElement(t, e) {
    const i = T.createElement("template");
    return i.innerHTML = t, i;
  }
}
function k(r, t, e = r, i) {
  var n, c;
  if (t === P) return t;
  let s = i !== void 0 ? (n = e._$Co) == null ? void 0 : n[i] : e._$Cl;
  const o = N(t) ? void 0 : t._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== o && ((c = s == null ? void 0 : s._$AO) == null || c.call(s, !1), o === void 0 ? s = void 0 : (s = new o(r), s._$AT(r, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = s : e._$Cl = s), s !== void 0 && (t = k(r, s._$AS(r, t.values), s, i)), t;
}
class Zt {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: i } = this._$AD, s = ((t == null ? void 0 : t.creationScope) ?? T).importNode(e, !0);
    S.currentNode = s;
    let o = S.nextNode(), n = 0, c = 0, a = i[0];
    for (; a !== void 0; ) {
      if (n === a.index) {
        let h;
        a.type === 2 ? h = new M(o, o.nextSibling, this, t) : a.type === 1 ? h = new a.ctor(o, a.name, a.strings, this, t) : a.type === 6 && (h = new Yt(o, this, t)), this._$AV.push(h), a = i[++c];
      }
      n !== (a == null ? void 0 : a.index) && (o = S.nextNode(), n++);
    }
    return S.currentNode = T, s;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class M {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, i, s) {
    this.type = 2, this._$AH = m, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = s, this._$Cv = (s == null ? void 0 : s.isConnected) ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = k(this, t, e), N(t) ? t === m || t == null || t === "" ? (this._$AH !== m && this._$AR(), this._$AH = m) : t !== this._$AH && t !== P && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : qt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== m && N(this._$AH) ? this._$AA.nextSibling.data = t : this.T(T.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var o;
    const { values: e, _$litType$: i } = t, s = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = I.createElement(Lt(i.h, i.h[0]), this.options)), i);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === s) this._$AH.p(e);
    else {
      const n = new Zt(s, this), c = n.u(this.options);
      n.p(e), this.T(c), this._$AH = n;
    }
  }
  _$AC(t) {
    let e = bt.get(t.strings);
    return e === void 0 && bt.set(t.strings, e = new I(t)), e;
  }
  k(t) {
    ct(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, s = 0;
    for (const o of t) s === e.length ? e.push(i = new M(this.O(j()), this.O(j()), this, this.options)) : i = e[s], i._$AI(o), s++;
    s < e.length && (this._$AR(i && i._$AB.nextSibling, s), e.length = s);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, e); t !== this._$AB; ) {
      const s = ft(t).nextSibling;
      ft(t).remove(), t = s;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class J {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, s, o) {
    this.type = 1, this._$AH = m, this._$AN = void 0, this.element = t, this.name = e, this._$AM = s, this.options = o, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = m;
  }
  _$AI(t, e = this, i, s) {
    const o = this.strings;
    let n = !1;
    if (o === void 0) t = k(this, t, e, 0), n = !N(t) || t !== this._$AH && t !== P, n && (this._$AH = t);
    else {
      const c = t;
      let a, h;
      for (t = o[0], a = 0; a < o.length - 1; a++) h = k(this, c[i + a], e, a), h === P && (h = this._$AH[a]), n || (n = !N(h) || h !== this._$AH[a]), h === m ? t = m : t !== m && (t += (h ?? "") + o[a + 1]), this._$AH[a] = h;
    }
    n && !s && this.j(t);
  }
  j(t) {
    t === m ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Jt extends J {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === m ? void 0 : t;
  }
}
class Kt extends J {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== m);
  }
}
class Qt extends J {
  constructor(t, e, i, s, o) {
    super(t, e, i, s, o), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = k(this, t, e, 0) ?? m) === P) return;
    const i = this._$AH, s = t === m && i !== m || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, o = t !== m && (i === m || s);
    s && this.element.removeEventListener(this.name, this, i), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Yt {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    k(this, t);
  }
}
const Xt = { I: M }, X = D.litHtmlPolyfillSupport;
X == null || X(I, M), (D.litHtmlVersions ?? (D.litHtmlVersions = [])).push("3.3.3");
const te = (r, t, e) => {
  const i = (e == null ? void 0 : e.renderBefore) ?? t;
  let s = i._$litPart$;
  if (s === void 0) {
    const o = (e == null ? void 0 : e.renderBefore) ?? null;
    i._$litPart$ = s = new M(t.insertBefore(j(), o), o, void 0, e ?? {});
  }
  return s._$AI(r), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const C = globalThis;
let L = class extends O {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var e;
    const t = super.createRenderRoot();
    return (e = this.renderOptions).renderBefore ?? (e.renderBefore = t.firstChild), t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = te(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) == null || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) == null || t.setConnected(!1);
  }
  render() {
    return P;
  }
};
var Et;
L._$litElement$ = !0, L.finalized = !0, (Et = C.litElementHydrateSupport) == null || Et.call(C, { LitElement: L });
const tt = C.litElementPolyfillSupport;
tt == null || tt({ LitElement: L });
(C.litElementVersions ?? (C.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const kt = (r) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(r, t);
  }) : customElements.define(r, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ee = { attribute: !0, type: String, converter: G, reflect: !1, hasChanged: at }, ie = (r = ee, t, e) => {
  const { kind: i, metadata: s } = e;
  let o = globalThis.litPropertyMetadata.get(s);
  if (o === void 0 && globalThis.litPropertyMetadata.set(s, o = /* @__PURE__ */ new Map()), i === "setter" && ((r = Object.create(r)).wrapped = !0), o.set(e.name, r), i === "accessor") {
    const { name: n } = e;
    return { set(c) {
      const a = t.get.call(this);
      t.set.call(this, c), this.requestUpdate(n, a, r, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(n, void 0, r, c), c;
    } };
  }
  if (i === "setter") {
    const { name: n } = e;
    return function(c) {
      const a = this[n];
      t.call(this, c), this.requestUpdate(n, a, r, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function dt(r) {
  return (t, e) => typeof e == "object" ? ie(r, t, e) : ((i, s, o) => {
    const n = s.hasOwnProperty(o);
    return s.constructor.createProperty(o, i), n ? Object.getOwnPropertyDescriptor(s, o) : void 0;
  })(r, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function W(r) {
  return dt({ ...r, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const se = { CHILD: 2 }, re = (r) => (...t) => ({ _$litDirective$: r, values: t });
let oe = class {
  constructor(t) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, e, i) {
    this._$Ct = t, this._$AM = e, this._$Ci = i;
  }
  _$AS(t, e) {
    return this.update(t, e);
  }
  update(t, e) {
    return this.render(...e);
  }
};
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { I: ne } = Xt, $t = (r) => r, wt = () => document.createComment(""), H = (r, t, e) => {
  var o;
  const i = r._$AA.parentNode, s = t === void 0 ? r._$AB : t._$AA;
  if (e === void 0) {
    const n = i.insertBefore(wt(), s), c = i.insertBefore(wt(), s);
    e = new ne(n, c, r, r.options);
  } else {
    const n = e._$AB.nextSibling, c = e._$AM, a = c !== r;
    if (a) {
      let h;
      (o = e._$AQ) == null || o.call(e, r), e._$AM = r, e._$AP !== void 0 && (h = r._$AU) !== c._$AU && e._$AP(h);
    }
    if (n !== s || a) {
      let h = e._$AA;
      for (; h !== n; ) {
        const l = $t(h).nextSibling;
        $t(i).insertBefore(h, s), h = l;
      }
    }
  }
  return e;
}, E = (r, t, e = r) => (r._$AI(t, e), r), ae = {}, ce = (r, t = ae) => r._$AH = t, de = (r) => r._$AH, et = (r) => {
  r._$AR(), r._$AA.remove();
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const At = (r, t, e) => {
  const i = /* @__PURE__ */ new Map();
  for (let s = t; s <= e; s++) i.set(r[s], s);
  return i;
}, le = re(class extends oe {
  constructor(r) {
    if (super(r), r.type !== se.CHILD) throw Error("repeat() can only be used in text expressions");
  }
  dt(r, t, e) {
    let i;
    e === void 0 ? e = t : t !== void 0 && (i = t);
    const s = [], o = [];
    let n = 0;
    for (const c of r) s[n] = i ? i(c, n) : n, o[n] = e(c, n), n++;
    return { values: o, keys: s };
  }
  render(r, t, e) {
    return this.dt(r, t, e).values;
  }
  update(r, [t, e, i]) {
    const s = de(r), { values: o, keys: n } = this.dt(t, e, i);
    if (!Array.isArray(s)) return this.ut = n, o;
    const c = this.ut ?? (this.ut = []), a = [];
    let h, l, d = 0, _ = s.length - 1, u = 0, f = o.length - 1;
    for (; d <= _ && u <= f; ) if (s[d] === null) d++;
    else if (s[_] === null) _--;
    else if (c[d] === n[u]) a[u] = E(s[d], o[u]), d++, u++;
    else if (c[_] === n[f]) a[f] = E(s[_], o[f]), _--, f--;
    else if (c[d] === n[f]) a[f] = E(s[d], o[f]), H(r, a[f + 1], s[d]), d++, f--;
    else if (c[_] === n[u]) a[u] = E(s[_], o[u]), H(r, s[d], s[_]), _--, u++;
    else if (h === void 0 && (h = At(n, u, f), l = At(c, d, _)), h.has(c[d])) if (h.has(c[_])) {
      const p = l.get(n[u]), y = p !== void 0 ? s[p] : null;
      if (y === null) {
        const b = H(r, s[d]);
        E(b, o[u]), a[u] = b;
      } else a[u] = E(y, o[u]), H(r, s[d], y), s[p] = null;
      u++;
    } else et(s[_]), _--;
    else et(s[d]), d++;
    for (; u <= f; ) {
      const p = H(r, a[f + 1]);
      E(p, o[u]), a[u++] = p;
    }
    for (; d <= _; ) {
      const p = s[d++];
      p !== null && et(p);
    }
    return this.ut = n, ce(r, a), P;
  }
}), he = Ct`
  :host {
    display: block;
    width: 100%;
    box-sizing: border-box;
    container-type: inline-size;
  }

  ha-card {
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border-radius: var(--ha-card-border-radius, 28px);
    transition: background-color 0.28s cubic-bezier(0.4, 0, 0.2, 1),
                box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1),
                border-color 0.28s cubic-bezier(0.4, 0, 0.2, 1);
    
    background-color: var(--ha-card-background, var(--card-background-color, transparent));
    border: var(--ha-card-border, var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, transparent));
    box-shadow: var(--ha-card-box-shadow, none);
  }

  ha-card:hover {
    filter: brightness(1.04);
  }

  /* ─── Presets ─── */
  
  /* Filled Preset */
  :host([style-type="filled"]),
  :host(.filled) {
    --ha-card-background: var(--md-sys-color-surface-container, var(--card-background-color, #212121));
    --ha-card-border-width: 0px;
    --ha-card-border-color: transparent;
    --ha-card-box-shadow: none;
  }

  /* Elevated Preset */
  :host([style-type="elevated"]),
  :host(.elevated) {
    --ha-card-background: var(--md-sys-color-surface-container-high, var(--card-background-color, #2a2a2a));
    --ha-card-border-width: 0px;
    --ha-card-border-color: transparent;
    --ha-card-box-shadow: var(--md-sys-elevation-level1, var(--ha-card-box-shadow, 0px 1px 3px rgba(0,0,0,0.3)));
  }

  /* Transparent Preset */
  :host([style-type="transparent"]),
  :host(.transparent) {
    --ha-card-background: transparent;
    --ha-card-border-width: 0px;
    --ha-card-border-color: transparent;
    --ha-card-box-shadow: none;
  }

  /* Outlined Preset */
  :host([style-type="outlined"]),
  :host(.outlined) {
    --ha-card-background: transparent;
    --ha-card-border-width: 1px;
    --ha-card-border-color: var(--md-sys-color-outline, var(--divider-color, rgba(255,255,255,0.12)));
    --ha-card-box-shadow: none;
  }

  /* Translucent Preset (Glassmorphism) */
  :host([style-type="translucent"]),
  :host(.translucent) {
    --ha-card-background: rgba(var(--md-sys-color-surface-container-rgb, 33, 33, 33), 0.55);
    --ha-card-border-width: 1px;
    --ha-card-border-color: var(--md-sys-color-outline-variant, var(--divider-color, rgba(255,255,255,0.08)));
    --ha-card-box-shadow: none;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  /* ─── Content Styling ─── */
  .mrc-content {
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    box-sizing: border-box;
  }

  .mrc-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 8px;
  }

  .mrc-room-info {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    flex: 0 1 auto;
  }

  /* ─── Icon Wrapper & Badge ─── */
  .mrc-icon-wrap {
    position: relative;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    border-radius: var(--md-sys-shape-corner-medium, 12px);
    background-color: var(--secondary-background-color, rgba(255, 255, 255, 0.05));
    transition: background-color 0.28s ease, transform 0.2s ease;
  }

  .mrc-icon-wrap.active {
    background-color: rgba(var(--rgb-primary-color, var(--rgb-state-icon, 76, 92, 146)), 0.16);
  }

  .mrc-icon-wrap > ha-state-icon,
  .mrc-icon-wrap > ha-icon {
    --mdc-icon-size: 22px;
    color: var(--secondary-text-color, #9e9e9e);
    transition: color 0.28s ease;
  }

  .mrc-icon-wrap.active > ha-state-icon,
  .mrc-icon-wrap.active > ha-icon {
    color: var(--state-icon-active-color, var(--md-sys-color-primary, #4c5c92));
  }

  /* Presence Badge */
  .mrc-presence {
    position: absolute;
    top: -5px;
    right: -5px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background-color: var(--md-sys-color-tertiary, #f57c00);
    border: 2px solid var(--ha-card-background, var(--card-background-color, #212121));
    box-shadow: 0 1.5px 3px rgba(0, 0, 0, 0.25);
    z-index: 2;
    animation: mrc-pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }

  .mrc-presence > ha-icon {
    --mdc-icon-size: 10px;
    color: #ffffff;
  }

  /* Window Badge */
  .mrc-window-badge {
    position: absolute;
    bottom: -5px;
    right: -5px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background-color: var(--info-color, #03a9f4);
    border: 2px solid var(--ha-card-background, var(--card-background-color, #212121));
    box-shadow: 0 1.5px 3px rgba(0, 0, 0, 0.25);
    z-index: 2;
    animation: mrc-pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }

  .mrc-window-badge > ha-icon {
    --mdc-icon-size: 10px;
    color: #ffffff;
  }

  /* ─── Text & Labels ─── */
  .mrc-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .mrc-name {
    font-size: var(--mrc-title-font-size, var(--md-sys-typescale-title-small-size, 14px));
    font-weight: var(--md-sys-typescale-title-medium-weight, 500);
    color: var(--md-sys-color-on-surface, var(--primary-text-color, #e3e3e3));
    line-height: 1.35;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mrc-sub {
    font-size: var(--mrc-sub-font-size, var(--md-sys-typescale-body-small-size, 12px));
    color: var(--md-sys-color-on-surface-variant, var(--secondary-text-color, #9e9e9e));
    line-height: 1.3;
    margin-top: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* ─── Status Row / Pills ─── */
  .mrc-status {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
  }

  .mrc-pill {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    border-radius: var(--md-sys-shape-corner-small, 10px);
    background-color: rgba(var(--rgb-info-color, 3, 169, 244), 0.12);
    color: var(--info-color, #03a9f4);
    animation: mrc-pop-slow 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }

  .mrc-pill > ha-icon {
    --mdc-icon-size: 16px;
  }

  /* ─── Layout: Side ─── */
  .mrc-header-side-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 0 0 calc(50% - 16px);
    max-width: calc(50% - 16px);
    justify-content: flex-end;
    min-width: 0;
  }

  .mrc-features-side {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    justify-content: flex-end;
    min-width: 0;
  }

  /* Custom overrides for features in side mode */
  .mrc-features-side hui-card-features {
    --feature-height: 40px;
    --feature-button-size: 100%;
    width: 100%;
    min-width: 40px;
    flex: 1;
  }

  /* ─── Layout: Bottom ─── */
  .mrc-features-bottom {
    padding: 0 12px 12px 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    box-sizing: border-box;
    width: 100%;
  }

  /* ─── Layout: Grid ─── */
  .mrc-features-grid {
    padding: 0 12px 12px 12px;
    display: grid;
    grid-template-columns: repeat(var(--grid-columns, 2), 1fr);
    gap: 8px;
    box-sizing: border-box;
    width: 100%;
  }

  /* ─── Animation Effects ─── */
  @keyframes mrc-pop {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes mrc-pop-slow {
    0% {
      transform: scale(0.6);
      opacity: 0;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;
function R(r, t, e = {}, i = {}) {
  r.dispatchEvent(
    new CustomEvent(t, {
      bubbles: i.bubbles !== !1,
      composed: i.composed !== !1,
      detail: e
    })
  );
}
function xt(r) {
  if (!r) return !1;
  const t = r.state.toLowerCase();
  return ["on", "home", "active", "open", "playing", "above_horizon"].includes(t);
}
function st(r, t) {
  if (!r || !r.areas) return null;
  const e = t.area_id || t.area;
  if (!e) return null;
  if (r.areas[e])
    return r.areas[e];
  const i = e.toLowerCase();
  return Object.values(r.areas).find(
    (o) => o.area_id && o.area_id.toLowerCase() === i || o.name && o.name.toLowerCase() === i
  ) || null;
}
function rt(r, t) {
  const e = {};
  if (!r || !r.entities) return e;
  const i = Object.values(r.entities).filter((a) => {
    if (a.area_id === t) return !0;
    if (a.device_id && r.devices) {
      const h = r.devices[a.device_id];
      if (h && h.area_id === t) return !0;
    }
    return !1;
  }), s = i.find((a) => {
    var u, f;
    if (!a.entity_id.startsWith("sensor.") || a.device_class === "battery" || a.entity_id.includes("battery") || a.entity_id.includes("batterie")) return !1;
    if (a.device_class === "temperature") return !0;
    const l = r.states[a.entity_id];
    if ((f = (u = l == null ? void 0 : l.attributes) == null ? void 0 : u.unit_of_measurement) != null && f.includes("°")) return !0;
    const d = a.entity_id.split("."), _ = d[1] ? d[1].toLowerCase() : "";
    return _.includes("temp") || _.includes("temperature");
  });
  s && (e.temperature = s.entity_id);
  const o = i.find((a) => {
    var u;
    if (!a.entity_id.startsWith("sensor.") || a.device_class === "battery" || a.entity_id.includes("battery") || a.entity_id.includes("batterie")) return !1;
    if (a.device_class === "humidity") return !0;
    const l = r.states[a.entity_id];
    if (((u = l == null ? void 0 : l.attributes) == null ? void 0 : u.unit_of_measurement) === "%") return !0;
    const d = a.entity_id.split("."), _ = d[1] ? d[1].toLowerCase() : "";
    return _.includes("hum") || _.includes("humidity");
  });
  o && (e.humidity = o.entity_id);
  const n = i.find((a) => {
    if (!a.entity_id.startsWith("binary_sensor.")) return !1;
    if (a.device_class === "window" || a.device_class === "door" || a.device_class === "opening") return !0;
    const l = a.entity_id.split("."), d = l[1] ? l[1].toLowerCase() : "";
    return d.includes("window") || d.includes("fenster") || d.includes("door") || d.includes("tuer") || d.includes("opening");
  });
  n && (e.window = n.entity_id);
  const c = i.find((a) => a.entity_id.startsWith("light."));
  if (c)
    e.mainLightOrSwitch = c.entity_id;
  else {
    const a = i.find((h) => h.entity_id.startsWith("switch."));
    a && (e.mainLightOrSwitch = a.entity_id);
  }
  return e;
}
function it(r, t, e, i) {
  if (!((i === "tap" ? e.tap_action : i === "hold" ? e.hold_action : e.double_tap_action) || (i === "tap" ? {} : null))) return;
  const n = e.entity || e.temperature_entity || e.humidity_entity || "";
  R(r, "hass-action", {
    config: {
      entity: n,
      tap_action: e.tap_action || { action: "more-info" },
      hold_action: e.hold_action,
      double_tap_action: e.double_tap_action
    },
    action: i
  });
}
var ue = Object.defineProperty, pe = Object.getOwnPropertyDescriptor, K = (r, t, e, i) => {
  for (var s = i > 1 ? void 0 : i ? pe(t, e) : t, o = r.length - 1, n; o >= 0; o--)
    (n = r[o]) && (s = (i ? n(t, e, s) : n(s)) || s);
  return i && s && ue(t, e, s), s;
};
let B = class extends L {
  constructor() {
    super(...arguments);
    v(this, "hass");
    v(this, "_config");
    v(this, "_featuresEditorLoaded", !1);
    v(this, "_computeLabel", (t) => t.label || t.name);
  }
  static get styles() {
    return Ct`
      :host {
        display: block;
      }
      .editor-container {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .editor-section {
        border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
        border-radius: 12px;
        overflow: hidden;
      }
      .editor-section[open] {
        padding-bottom: 12px;
      }
      summary {
        font-weight: 500;
        padding: 12px 16px;
        background-color: var(--secondary-background-color, rgba(255, 255, 255, 0.03));
        cursor: pointer;
        outline: none;
        user-select: none;
      }
      summary:hover {
        background-color: var(--secondary-background-color, rgba(255, 255, 255, 0.06));
      }
      .section-content {
        padding: 16px 16px 0 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .features-container {
        padding: 16px;
        border-top: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
      }
      .features-header {
        font-weight: 500;
        margin-bottom: 8px;
        color: var(--primary-text-color);
      }
      .error-msg {
        color: var(--error-color, #db4437);
        font-size: 13px;
        padding: 8px 16px;
      }
    `;
  }
  // Set config from editor parent
  setConfig(t) {
    this._config = {
      show_icon: !0,
      show_secondary_text: !0,
      feature_layout: "side",
      feature_grid_columns: 2,
      secondary_text_source: "combined",
      ...t
    };
  }
  get _resolvedArea() {
    return st(this.hass, this._config);
  }
  get _resolvedAreaEntities() {
    const t = this._resolvedArea;
    return t ? rt(this.hass, t.area_id) : {};
  }
  firstUpdated(t) {
    super.firstUpdated(t), this._loadFeaturesEditor();
  }
  async _loadFeaturesEditor() {
    if (!customElements.get("hui-card-features-editor")) {
      if (window.loadCardHelpers)
        try {
          const e = await (await window.loadCardHelpers()).createCardElement({ type: "tile", entity: "light.dummy" });
          e && e.constructor && e.constructor.getConfigElement && e.constructor.getConfigElement();
        } catch {
        }
      for (let t = 0; t < 40 && !customElements.get("hui-card-features-editor"); t++)
        await new Promise((e) => setTimeout(e, 100));
    }
    this._featuresEditorLoaded = !!customElements.get("hui-card-features-editor"), this._featuresEditorLoaded && this._patchFeaturesEditor(), this.requestUpdate();
  }
  _patchFeaturesEditor() {
    const t = customElements.get("hui-card-features-editor");
    if (t && !t.__patchedForMaterialRoomCard) {
      t.__patchedForMaterialRoomCard = !0;
      const e = (n) => {
        let c = n;
        for (; c; ) {
          if (c.tagName === "MATERIAL-ROOM-CARD-EDITOR")
            return !0;
          c = c.parentNode || c.host;
        }
        return !1;
      }, i = t.prototype._supportsFeatureType;
      t.prototype._supportsFeatureType = function(n) {
        return e(this) ? !0 : i.call(this, n);
      };
      const s = [
        "alarm-modes",
        "area-controls",
        "bar-gauge",
        "button",
        "climate-fan-modes",
        "climate-hvac-modes",
        "climate-preset-modes",
        "climate-swing-modes",
        "climate-swing-horizontal-modes",
        "counter-actions",
        "cover-open-close",
        "cover-position-favorite",
        "cover-position",
        "cover-tilt-favorite",
        "cover-tilt-position",
        "cover-tilt",
        "date-set",
        "fan-direction",
        "fan-oscillate",
        "fan-preset-modes",
        "fan-speed",
        "humidifier-modes",
        "humidifier-toggle",
        "lawn-mower-commands",
        "light-brightness",
        "light-color-temp",
        "light-color-favorites",
        "lock-commands",
        "lock-open-door",
        "media-player-playback",
        "media-player-sound-mode",
        "media-player-source",
        "media-player-volume-buttons",
        "media-player-volume-slider",
        "numeric-input",
        "precipitation-forecast",
        "select-options",
        "trend-graph",
        "target-humidity",
        "target-temperature",
        "temperature-forecast",
        "toggle",
        "update-actions",
        "vacuum-commands",
        "valve-open-close",
        "valve-position-favorite",
        "valve-position",
        "water-heater-operation-modes"
      ], o = t.prototype._getSupportedFeaturesType;
      t.prototype._getSupportedFeaturesType = function() {
        if (e(this)) {
          const n = (window.customCardFeatures || []).map(
            (c) => `custom:${c.type}`
          );
          return s.concat(n);
        }
        return o.call(this);
      };
    }
  }
  _editDetailElement(t) {
    t.stopPropagation();
    const e = t.detail.subElementConfig.index, i = this._config.features[e], o = { entity_id: i.entity || this._config.entity || "light.dummy" };
    R(this, "edit-sub-element", {
      config: i,
      saveConfig: (n) => this._updateFeature(e, n),
      context: o,
      type: "feature"
    });
  }
  _updateFeature(t, e) {
    const i = (this._config.features || []).concat();
    i[t] = e, this._config = {
      ...this._config,
      features: i
    }, R(this, "config-changed", { config: this._config });
  }
  // Handle value-changed from HA forms
  _handleFormChanged(t, e) {
    if (t.stopPropagation(), !this._config) return;
    const i = t.detail.value, s = {
      ...this._config,
      ...i
    };
    s.features = this._config.features || [];
    const o = this._config.area_id || this._config.area, n = s.area_id || s.area;
    if (n && n !== o) {
      const c = st(this.hass, { area_id: n });
      if (c) {
        s.title = c.name || s.title, c.icon && (s.icon = c.icon);
        const a = rt(this.hass, c.area_id);
        a.temperature && (s.temperature_entity = a.temperature), a.humidity && (s.humidity_entity = a.humidity), a.window && (s.window_entity = a.window), a.mainLightOrSwitch && (s.entity = a.mainLightOrSwitch);
      }
    }
    this._config = s, R(this, "config-changed", { config: s });
  }
  // Handle features-changed from HA features editor
  _handleFeaturesChanged(t) {
    t.stopPropagation();
    let e;
    t.detail && t.detail.value !== void 0 ? e = t.detail.value : t.detail && t.detail.features !== void 0 ? e = t.detail.features : t.detail && t.detail.config && t.detail.config.features !== void 0 && (e = t.detail.config.features), e && Array.isArray(e) && (this._config = {
      ...this._config,
      features: e
    }, R(this, "config-changed", { config: this._config }));
  }
  render() {
    if (!this.hass || !this._config) return g``;
    const t = this._resolvedAreaEntities, e = "light.dummy", i = {
      ...this.hass,
      states: {
        ...this.hass.states,
        [e]: {
          entity_id: e,
          state: "off",
          attributes: {
            friendly_name: "Room Control Context",
            supported_features: 63,
            // Enable all light features
            color_modes: ["brightness", "hs", "color_temp"],
            supported_color_modes: ["brightness", "hs", "color_temp"]
          },
          last_changed: "",
          last_updated: ""
        }
      }
    }, s = [
      { name: "area_id", label: "Select Room / Area", selector: { area: {} } },
      { name: "title", label: "Room Name Override", selector: { text: {} } },
      { name: "icon", label: "Room Icon Override", selector: { icon: {} } },
      {
        name: "style_type",
        label: "Card Style Preset",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "filled", label: "Filled" },
              { value: "elevated", label: "Elevated" },
              { value: "transparent", label: "Transparent" },
              { value: "outlined", label: "Outlined" },
              { value: "translucent", label: "Translucent" }
            ]
          }
        }
      }
    ], o = [
      { name: "temperature_entity", label: "Temperature Sensor Override", placeholder: t.temperature || "Auto-resolved", selector: { entity: { domain: "sensor" } } },
      { name: "humidity_entity", label: "Humidity Sensor Override", placeholder: t.humidity || "Auto-resolved", selector: { entity: { domain: "sensor" } } },
      { name: "window_entity", label: "Window Sensor Override (Window open/closed)", placeholder: t.window || "Auto-resolved", selector: { entity: { domain: "binary_sensor" } } },
      { name: "entity", label: "Presence Sensor / Main Light Override", selector: { entity: {} } },
      {
        name: "secondary_text_source",
        label: "Secondary Text Source",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "combined", label: "Temperature & Humidity Combined" },
              { value: "temperature", label: "Temperature State" },
              { value: "humidity", label: "Humidity State" },
              { value: "custom", label: "Custom Template String" },
              { value: "hidden", label: "Hidden / None" }
            ]
          }
        }
      },
      ...this._config.secondary_text_source === "custom" ? [
        {
          name: "secondary_text_template",
          label: "Secondary Text Template (use {temperature} and {humidity})",
          selector: { text: {} }
        }
      ] : [],
      { name: "show_icon", label: "Show Room Icon", selector: { boolean: {} } },
      { name: "show_secondary_text", label: "Show Secondary Text", selector: { boolean: {} } }
    ], n = [
      { name: "tap_action", label: "Tap Action", selector: { ui_action: { default_action: "more-info" } } },
      { name: "hold_action", label: "Hold Action", selector: { ui_action: {} } },
      { name: "double_tap_action", label: "Double Tap Action", selector: { ui_action: {} } }
    ], c = [
      {
        name: "feature_layout",
        label: "Features Layout Position",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "side", label: "Side (horizontal, in header)" },
              { value: "bottom", label: "Bottom (vertical stack)" },
              { value: "grid", label: "Grid (configurable columns)" }
            ]
          }
        }
      },
      ...this._config.feature_layout === "grid" ? [{ name: "feature_grid_columns", label: "Grid Columns Count", selector: { number: { min: 1, max: 4, mode: "box" } } }] : []
    ];
    return g`
      <div class="editor-container">
        <!-- Section: Configuration -->
        <details class="editor-section" open>
          <summary>Configuration</summary>
          <div class="section-content">
            <ha-form
              .hass=${this.hass}
              .data=${this._config}
              .schema=${s}
              .computeLabel=${this._computeLabel}
              @value-changed=${(a) => this._handleFormChanged(a, "config")}
            ></ha-form>
          </div>
        </details>
 
        <!-- Section: Content & Appearance -->
        <details class="editor-section">
          <summary>Content & Appearance</summary>
          <div class="section-content">
            <ha-form
              .hass=${this.hass}
              .data=${this._config}
              .schema=${o}
              .computeLabel=${this._computeLabel}
              @value-changed=${(a) => this._handleFormChanged(a, "content")}
            ></ha-form>
          </div>
        </details>
 
        <!-- Section: Interactions -->
        <details class="editor-section">
          <summary>Interactions (Tap, Hold, Double-Tap)</summary>
          <div class="section-content">
            <ha-form
              .hass=${this.hass}
              .data=${this._config}
              .schema=${n}
              .computeLabel=${this._computeLabel}
              @value-changed=${(a) => this._handleFormChanged(a, "interactions")}
            ></ha-form>
          </div>
        </details>
 
        <!-- Section: Features Layout & Management -->
        <details class="editor-section" open>
          <summary>Features (Quick Controls)</summary>
          <div class="section-content">
            <ha-form
              .hass=${this.hass}
              .data=${this._config}
              .schema=${c}
              .computeLabel=${this._computeLabel}
              @value-changed=${(a) => this._handleFormChanged(a, "features-layout")}
            ></ha-form>
          </div>

          <!-- Feature management component -->
          <div class="features-container">
            <div class="features-header">Manage Feature Buttons</div>
            ${this._featuresEditorLoaded ? g`
                  <hui-card-features-editor
                    .hass=${i}
                    .stateObj=${i.states[e]}
                    .context=${{ entity_id: e }}
                    .features=${this._config.features || []}
                    @value-changed=${this._handleFeaturesChanged}
                    @features-changed=${this._handleFeaturesChanged}
                    @config-changed=${this._handleFeaturesChanged}
                    @edit-detail-element=${this._editDetailElement}
                  ></hui-card-features-editor>
                ` : g`<div class="error-msg">Loading Home Assistant Feature Editor...</div>`}
          </div>
        </details>
      </div>
    `;
  }
};
K([
  dt({ attribute: !1 })
], B.prototype, "hass", 2);
K([
  W()
], B.prototype, "_config", 2);
K([
  W()
], B.prototype, "_featuresEditorLoaded", 2);
B = K([
  kt("material-room-card-editor")
], B);
var fe = Object.defineProperty, _e = Object.getOwnPropertyDescriptor, q = (r, t, e, i) => {
  for (var s = i > 1 ? void 0 : i ? _e(t, e) : t, o = r.length - 1, n; o >= 0; o--)
    (n = r[o]) && (s = (i ? n(t, e, s) : n(s)) || s);
  return i && s && fe(t, e, s), s;
};
function me(r, t) {
  var e, i, s, o, n, c, a, h;
  if (!r || typeof r != "object") return t;
  if (typeof r.entity == "string" && r.entity) return r.entity;
  if (typeof r.entity_id == "string" && r.entity_id) return r.entity_id;
  if (Array.isArray(r.entity_id) && typeof r.entity_id[0] == "string") return r.entity_id[0];
  if (Array.isArray(r.entries))
    for (const l of r.entries) {
      if (!l || typeof l != "object") continue;
      if (typeof l.entity == "string" && l.entity) return l.entity;
      if (typeof l.entity_id == "string" && l.entity_id) return l.entity_id;
      const d = ((i = (e = l.tap_action) == null ? void 0 : e.target) == null ? void 0 : i.entity_id) || ((o = (s = l.tap_action) == null ? void 0 : s.data) == null ? void 0 : o.entity_id);
      if (typeof d == "string" && d) return d;
      if (Array.isArray(d) && typeof d[0] == "string") return d[0];
    }
  if (Array.isArray(r.buttons))
    for (const l of r.buttons) {
      if (!l || typeof l != "object") continue;
      if (typeof l.entity == "string" && l.entity) return l.entity;
      if (typeof l.entity_id == "string" && l.entity_id) return l.entity_id;
      const d = ((c = (n = l.tap_action) == null ? void 0 : n.target) == null ? void 0 : c.entity_id) || ((h = (a = l.tap_action) == null ? void 0 : a.data) == null ? void 0 : h.entity_id);
      if (typeof d == "string" && d) return d;
      if (Array.isArray(d) && typeof d[0] == "string") return d[0];
    }
  return t;
}
function ye(r) {
  var e, i, s, o, n, c, a, h, l, d, _, u;
  const t = /* @__PURE__ */ new Set();
  if (!r || !Array.isArray(r)) return t;
  for (const f of r)
    if (!(!f || typeof f != "object")) {
      if (typeof f.entity == "string" && f.entity && t.add(f.entity), typeof f.entity_id == "string" && f.entity_id && t.add(f.entity_id), Array.isArray(f.entity_id) && f.entity_id.forEach((p) => typeof p == "string" && p && t.add(p)), Array.isArray(f.entries))
        for (const p of f.entries) {
          if (!p || typeof p != "object") continue;
          typeof p.entity == "string" && p.entity && t.add(p.entity), typeof p.entity_id == "string" && p.entity_id && t.add(p.entity_id);
          const y = ((i = (e = p.tap_action) == null ? void 0 : e.target) == null ? void 0 : i.entity_id) || ((o = (s = p.tap_action) == null ? void 0 : s.data) == null ? void 0 : o.entity_id);
          typeof y == "string" && y && t.add(y), Array.isArray(y) && y.forEach((A) => typeof A == "string" && A && t.add(A));
          const b = ((c = (n = p.hold_action) == null ? void 0 : n.target) == null ? void 0 : c.entity_id) || ((h = (a = p.hold_action) == null ? void 0 : a.data) == null ? void 0 : h.entity_id);
          typeof b == "string" && b && t.add(b), Array.isArray(b) && b.forEach((A) => typeof A == "string" && A && t.add(A));
        }
      if (Array.isArray(f.buttons))
        for (const p of f.buttons) {
          if (!p || typeof p != "object") continue;
          typeof p.entity == "string" && p.entity && t.add(p.entity), typeof p.entity_id == "string" && p.entity_id && t.add(p.entity_id);
          const y = ((d = (l = p.tap_action) == null ? void 0 : l.target) == null ? void 0 : d.entity_id) || ((u = (_ = p.tap_action) == null ? void 0 : _.data) == null ? void 0 : u.entity_id);
          typeof y == "string" && y && t.add(y), Array.isArray(y) && y.forEach((b) => typeof b == "string" && b && t.add(b));
        }
    }
  return t;
}
let U = class extends L {
  constructor() {
    super(...arguments);
    v(this, "hass");
    v(this, "_config");
    v(this, "_resolvedStyleType", "filled");
    v(this, "_resolvedEntities", {});
    v(this, "_observer");
    v(this, "_featuresLoaded", !1);
    v(this, "_featureDataCache", /* @__PURE__ */ new Map());
    v(this, "_unsubscribeStates");
  }
  static get styles() {
    return he;
  }
  // Set configuration
  setConfig(t) {
    if (!t)
      throw new Error("Invalid configuration");
    this._config = {
      show_icon: !0,
      show_secondary_text: !0,
      feature_layout: "side",
      feature_grid_columns: 2,
      secondary_text_source: "combined",
      ...t
    }, this._featureDataCache.clear(), this._updateStyleType();
  }
  connectedCallback() {
    super.connectedCallback(), this._subscribeStates(), this._setupObserver(), this._updateStyleType(), this._loadFeatures();
  }
  disconnectedCallback() {
    this._unsubscribeStates && (this._unsubscribeStates(), this._unsubscribeStates = void 0), this._observer && (this._observer.disconnect(), this._observer = void 0), super.disconnectedCallback();
  }
  _subscribeStates() {
    if (!this._unsubscribeStates)
      try {
        const t = new CustomEvent("context-request", {
          bubbles: !0,
          composed: !0,
          cancelable: !0
        });
        t.context = "states", t.subscribe = !0, t.callback = (e, i) => {
          this._unsubscribeStates = i, this.hass && e && (this.hass = {
            ...this.hass,
            states: e
          }, this.requestUpdate());
        }, this.dispatchEvent(t);
      } catch {
      }
  }
  firstUpdated(t) {
    super.firstUpdated(t), this._loadFeatures();
  }
  // Performance optimization:
  // - Real-time responsiveness: Tracks all entities used by room sensors, presence,
  //   and all configured features (including buttons, sliders, service-call entries).
  // - High efficiency: Ignores updates for unrelated entities across Home Assistant,
  //   preventing UI lag while guaranteeing instantaneous state updates for all features.
  shouldUpdate(t) {
    var e, i;
    if (t.has("_config") || t.has("_resolvedStyleType") || t.has("_resolvedEntities"))
      return !0;
    if (t.has("hass")) {
      const s = t.get("hass");
      if (!s || !this.hass || s.themes !== this.hass.themes || s.language !== this.hass.language || s.areas !== this.hass.areas || s.entities !== this.hass.entities || s.devices !== this.hass.devices)
        return !0;
      const o = ((e = this._config) == null ? void 0 : e.entity) || this._resolvedEntities.mainLightOrSwitch;
      if (o && s.states[o] !== this.hass.states[o])
        return !0;
      const n = this._temperatureEntity;
      if (n && s.states[n] !== this.hass.states[n])
        return !0;
      const c = this._humidityEntity;
      if (c && s.states[c] !== this.hass.states[c])
        return !0;
      const a = this._windowEntity;
      if (a && s.states[a] !== this.hass.states[a])
        return !0;
      const h = ((i = this._config) == null ? void 0 : i.features) || [];
      if (h.length > 0) {
        const l = ye(h);
        if (l.size > 0) {
          for (const d of l)
            if (s.states[d] !== this.hass.states[d])
              return !0;
        } else if (s.states !== this.hass.states)
          return !0;
      }
      return !1;
    }
    return !0;
  }
  willUpdate(t) {
    if (super.willUpdate(t), t.has("_config"))
      this._updateStyleType(), this._resolveEntities();
    else if (t.has("hass")) {
      const e = t.get("hass");
      (!e || e.areas !== this.hass.areas || e.entities !== this.hass.entities || e.devices !== this.hass.devices) && this._resolveEntities();
    }
  }
  _resolveEntities() {
    if (!this.hass) return;
    const t = this._resolvedArea;
    if (!t) {
      Object.keys(this._resolvedEntities).length > 0 && (this._resolvedEntities = {});
      return;
    }
    const e = rt(this.hass, t.area_id);
    (this._resolvedEntities.temperature !== e.temperature || this._resolvedEntities.humidity !== e.humidity || this._resolvedEntities.window !== e.window || this._resolvedEntities.mainLightOrSwitch !== e.mainLightOrSwitch) && (this._resolvedEntities = e);
  }
  _setupObserver() {
    this._observer || (this._observer = new MutationObserver(() => {
      this._updateStyleType();
    }), this._observer.observe(this, { attributes: !0, attributeFilter: ["class"] }));
  }
  _updateStyleType() {
    var i;
    const t = ["filled", "elevated", "transparent", "outlined", "translucent"];
    let e = ((i = this._config) == null ? void 0 : i.style_type) || "filled";
    for (const s of t)
      if (this.classList.contains(s)) {
        e = s;
        break;
      }
    this._resolvedStyleType !== e && (this._resolvedStyleType = e, this.setAttribute("style-type", e));
  }
  async _loadFeatures() {
    if (!this._featuresLoaded) {
      if (this._featuresLoaded = !0, window.loadCardHelpers)
        try {
          (await window.loadCardHelpers()).createCardElement({
            type: "tile",
            entity: "light.dummy",
            features: [{ type: "target-temperature" }]
          });
        } catch {
        }
      customElements.get("hui-card-features") ? this.requestUpdate() : customElements.whenDefined("hui-card-features").then(() => {
        this.requestUpdate();
      });
    }
  }
  // Stable feature data cache to avoid reference thrashing on hui-card-features
  _getFeatureData(t, e) {
    const i = me(t, e);
    let s = this._featureDataCache.get(t);
    return (!s || s.context.entity_id !== i) && (s = {
      context: { entity_id: i },
      features: [t]
    }, this._featureDataCache.set(t, s)), s;
  }
  // Getters for resolved configuration
  get _resolvedArea() {
    return st(this.hass, this._config);
  }
  get _temperatureEntity() {
    return this._config.temperature_entity || this._resolvedEntities.temperature;
  }
  get _humidityEntity() {
    return this._config.humidity_entity || this._resolvedEntities.humidity;
  }
  get _windowEntity() {
    return this._config.window_entity || this._resolvedEntities.window;
  }
  get _windowActive() {
    var e;
    const t = this._windowEntity;
    return t && ((e = this.hass) != null && e.states[t]) ? xt(this.hass.states[t]) : !1;
  }
  get _areaName() {
    var t;
    return this._config.title || this._config.name || ((t = this._resolvedArea) == null ? void 0 : t.name) || "Room";
  }
  get _areaIcon() {
    var t;
    return this._config.icon || ((t = this._resolvedArea) == null ? void 0 : t.icon) || "mdi:home";
  }
  get _secondaryText() {
    var n, c;
    const t = this._config.secondary_text_source || "combined", e = this._temperatureEntity, i = this._humidityEntity;
    let s = "";
    if (e && ((n = this.hass) != null && n.states[e])) {
      const a = this.hass.states[e];
      s = `${a.state}${a.attributes.unit_of_measurement || "°C"}`;
    }
    let o = "";
    if (i && ((c = this.hass) != null && c.states[i])) {
      const a = this.hass.states[i];
      o = `${a.state}${a.attributes.unit_of_measurement || "%"}`;
    }
    return t === "temperature" ? s : t === "humidity" ? o : t === "combined" ? [s, o].filter(Boolean).join(" • ") : t === "custom" && this._config.secondary_text_template ? this._config.secondary_text_template.replace("{temperature}", s).replace("{humidity}", o) : "";
  }
  get _presenceActive() {
    var e;
    const t = this._config.entity || this._resolvedEntities.mainLightOrSwitch;
    return t && ((e = this.hass) != null && e.states[t]) ? xt(this.hass.states[t]) : !1;
  }
  // Action Mappings
  _handleTap(t) {
    this._hasFeatureInPath(t) || it(this, this.hass, this._config, "tap");
  }
  _handleHold(t) {
    this._hasFeatureInPath(t) || (t.preventDefault(), it(this, this.hass, this._config, "hold"));
  }
  _handleDoubleTap(t) {
    this._hasFeatureInPath(t) || it(this, this.hass, this._config, "double_tap");
  }
  _hasFeatureInPath(t) {
    return t.composedPath().some(
      (i) => i.tagName === "HUI-CARD-FEATURES" || i.classList && (i.classList.contains("mrc-features-side") || i.classList.contains("mrc-features-bottom") || i.classList.contains("mrc-features-grid"))
    );
  }
  // Render individual features with stable context, arrays, unique keys, and stateObj
  _renderFeatureElements(t) {
    const e = this._config.entity || this._resolvedEntities.mainLightOrSwitch;
    return le(
      t,
      (i, s) => i != null && i.id ? `${i.id}_${s}` : `${(i == null ? void 0 : i.type) || "feat"}_${(i == null ? void 0 : i.entity) || (i == null ? void 0 : i.entity_id) || ""}_${s}`,
      (i) => {
        var s;
        try {
          const o = this._getFeatureData(i, e), n = o.context.entity_id, c = n && ((s = this.hass) != null && s.states) ? this.hass.states[n] : void 0;
          return g`
            <hui-card-features
              .hass=${this.hass}
              .stateObj=${c}
              .context=${o.context}
              .color=${this._config.color}
              .features=${o.features}
            ></hui-card-features>
          `;
        } catch (o) {
          return console.error("[material-room-card] Feature render error:", o), g``;
        }
      }
    );
  }
  // Rendering
  render() {
    if (!this.hass || !this._config) return g``;
    const t = this._config.feature_layout || "side", e = this._config.features || [], i = e.length > 0;
    return g`
      <ha-card
        class="${this._resolvedStyleType}"
        @click=${this._handleTap}
        @contextmenu=${this._handleHold}
        @dblclick=${this._handleDoubleTap}
      >
        <div class="mrc-content">
          <div class="mrc-header">
            <div class="mrc-room-info">
              ${this._config.show_icon ? g`
                    <div class="mrc-icon-wrap ${this._presenceActive ? "active" : ""}">
                      <ha-icon .icon=${this._areaIcon}></ha-icon>
                      ${this._presenceActive ? g`
                            <div class="mrc-presence">
                              <ha-icon icon="mdi:account"></ha-icon>
                            </div>
                          ` : ""}
                      ${this._windowActive ? g`
                            <div class="mrc-window-badge">
                              <ha-icon icon="mdi:window-open-variant"></ha-icon>
                            </div>
                          ` : ""}
                    </div>
                  ` : ""}
              <div class="mrc-text">
                <div class="mrc-name">${this._areaName}</div>
                ${this._config.show_secondary_text && this._secondaryText ? g`<div class="mrc-sub">${this._secondaryText}</div>` : ""}
              </div>
            </div>

            <!-- Features or Status on the side -->
            ${i && t === "side" ? g`
                  <div class="mrc-header-side-wrap">
                    <div class="mrc-features-side">
                      ${this._renderFeatureElements(e)}
                    </div>
                  </div>
                ` : ""}
          </div>
        </div>

        <!-- Features stacked vertically -->
        ${i && t === "bottom" ? g`
              <div class="mrc-features-bottom">
                ${this._renderFeatureElements(e)}
              </div>
            ` : ""}

        <!-- Features in a Grid -->
        ${i && t === "grid" ? g`
              <div
                class="mrc-features-grid"
                style="--grid-columns: ${this._config.feature_grid_columns || 2}"
              >
                ${this._renderFeatureElements(e)}
              </div>
            ` : ""}
      </ha-card>
    `;
  }
  // Home Assistant Card API
  getCardSize() {
    var e;
    return ((e = this._config) == null ? void 0 : e.features) && this._config.features.length > 0 ? 3 : 2;
  }
  static getConfigElement() {
    return document.createElement("material-room-card-editor");
  }
  static getStubConfig(t) {
    let e = "", i = "Bedroom", s = "mdi:bed";
    if (t && t.areas && Object.keys(t.areas).length > 0) {
      const o = Object.values(t.areas)[0];
      e = o.area_id, i = o.name, s = o.icon || "mdi:home";
    }
    return {
      type: "custom:material-room-card",
      area: e || "bedroom",
      title: i,
      icon: s,
      show_icon: !0,
      show_secondary_text: !0,
      feature_layout: "side",
      style_type: "filled",
      features: []
    };
  }
};
q([
  dt({ attribute: !1 })
], U.prototype, "hass", 2);
q([
  W()
], U.prototype, "_config", 2);
q([
  W()
], U.prototype, "_resolvedStyleType", 2);
q([
  W()
], U.prototype, "_resolvedEntities", 2);
U = q([
  kt("material-room-card")
], U);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "material-room-card",
  name: "Material Room Card",
  preview: !0,
  description: "A premium Material You card for Home Assistant representing a Room or Area."
});
console.info(
  "%c MATERIAL-ROOM-CARD %c v2.2.2 ",
  "color: white; background: #4c5c92; font-weight: 700;",
  "color: #4c5c92; background: white; font-weight: 700;"
);
export {
  U as MaterialRoomCard
};
//# sourceMappingURL=material-room-card.js.map
