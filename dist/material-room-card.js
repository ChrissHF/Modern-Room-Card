var ke = Object.defineProperty;
var Ue = (r, e, t) => e in r ? ke(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var g = (r, e, t) => Ue(r, typeof e != "symbol" ? e + "" : e, t);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const B = globalThis, ie = B.ShadowRoot && (B.ShadyCSS === void 0 || B.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, re = Symbol(), le = /* @__PURE__ */ new WeakMap();
let Ee = class {
  constructor(e, t, s) {
    if (this._$cssResult$ = !0, s !== re) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (ie && e === void 0) {
      const s = t !== void 0 && t.length === 1;
      s && (e = le.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && le.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Me = (r) => new Ee(typeof r == "string" ? r : r + "", void 0, re), Se = (r, ...e) => {
  const t = r.length === 1 ? r[0] : e.reduce((s, i, a) => s + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + r[a + 1], r[0]);
  return new Ee(t, r, re);
}, He = (r, e) => {
  if (ie) r.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const s = document.createElement("style"), i = B.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = t.cssText, r.appendChild(s);
  }
}, de = ie ? (r) => r : (r) => r instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const s of e.cssRules) t += s.cssText;
  return Me(t);
})(r) : r;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Re, defineProperty: Fe, getOwnPropertyDescriptor: ze, getOwnPropertyNames: De, getOwnPropertySymbols: Ne, getPrototypeOf: Ie } = Object, b = globalThis, he = b.trustedTypes, je = he ? he.emptyScript : "", J = b.reactiveElementPolyfillSupport, H = (r, e) => r, W = { toAttribute(r, e) {
  switch (e) {
    case Boolean:
      r = r ? je : null;
      break;
    case Object:
    case Array:
      r = r == null ? r : JSON.stringify(r);
  }
  return r;
}, fromAttribute(r, e) {
  let t = r;
  switch (e) {
    case Boolean:
      t = r !== null;
      break;
    case Number:
      t = r === null ? null : Number(r);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(r);
      } catch {
        t = null;
      }
  }
  return t;
} }, oe = (r, e) => !Re(r, e), ue = { attribute: !0, type: String, converter: W, reflect: !1, useDefault: !1, hasChanged: oe };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), b.litPropertyMetadata ?? (b.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let C = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = ue) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const s = Symbol(), i = this.getPropertyDescriptor(e, s, t);
      i !== void 0 && Fe(this.prototype, e, i);
    }
  }
  static getPropertyDescriptor(e, t, s) {
    const { get: i, set: a } = ze(this.prototype, e) ?? { get() {
      return this[t];
    }, set(o) {
      this[t] = o;
    } };
    return { get: i, set(o) {
      const c = i == null ? void 0 : i.call(this);
      a == null || a.call(this, o), this.requestUpdate(e, c, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? ue;
  }
  static _$Ei() {
    if (this.hasOwnProperty(H("elementProperties"))) return;
    const e = Ie(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(H("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(H("properties"))) {
      const t = this.properties, s = [...De(t), ...Ne(t)];
      for (const i of s) this.createProperty(i, t[i]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [s, i] of t) this.elementProperties.set(s, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, s] of this.elementProperties) {
      const i = this._$Eu(t, s);
      i !== void 0 && this._$Eh.set(i, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const s = new Set(e.flat(1 / 0).reverse());
      for (const i of s) t.unshift(de(i));
    } else e !== void 0 && t.push(de(e));
    return t;
  }
  static _$Eu(e, t) {
    const s = t.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var e;
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (e = this.constructor.l) == null || e.forEach((t) => t(this));
  }
  addController(e) {
    var t;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(e), this.renderRoot !== void 0 && this.isConnected && ((t = e.hostConnected) == null || t.call(e));
  }
  removeController(e) {
    var t;
    (t = this._$EO) == null || t.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
    for (const s of t.keys()) this.hasOwnProperty(s) && (e.set(s, this[s]), delete this[s]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return He(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var e;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$EO) == null || e.forEach((t) => {
      var s;
      return (s = t.hostConnected) == null ? void 0 : s.call(t);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$EO) == null || e.forEach((t) => {
      var s;
      return (s = t.hostDisconnected) == null ? void 0 : s.call(t);
    });
  }
  attributeChangedCallback(e, t, s) {
    this._$AK(e, s);
  }
  _$ET(e, t) {
    var a;
    const s = this.constructor.elementProperties.get(e), i = this.constructor._$Eu(e, s);
    if (i !== void 0 && s.reflect === !0) {
      const o = (((a = s.converter) == null ? void 0 : a.toAttribute) !== void 0 ? s.converter : W).toAttribute(t, s.type);
      this._$Em = e, o == null ? this.removeAttribute(i) : this.setAttribute(i, o), this._$Em = null;
    }
  }
  _$AK(e, t) {
    var a, o;
    const s = this.constructor, i = s._$Eh.get(e);
    if (i !== void 0 && this._$Em !== i) {
      const c = s.getPropertyOptions(i), n = typeof c.converter == "function" ? { fromAttribute: c.converter } : ((a = c.converter) == null ? void 0 : a.fromAttribute) !== void 0 ? c.converter : W;
      this._$Em = i;
      const d = n.fromAttribute(t, c.type);
      this[i] = d ?? ((o = this._$Ej) == null ? void 0 : o.get(i)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(e, t, s, i = !1, a) {
    var o;
    if (e !== void 0) {
      const c = this.constructor;
      if (i === !1 && (a = this[e]), s ?? (s = c.getPropertyOptions(e)), !((s.hasChanged ?? oe)(a, t) || s.useDefault && s.reflect && a === ((o = this._$Ej) == null ? void 0 : o.get(e)) && !this.hasAttribute(c._$Eu(e, s)))) return;
      this.C(e, t, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: s, reflect: i, wrapped: a }, o) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, o ?? t ?? this[e]), a !== !0 || o !== void 0) || (this._$AL.has(e) || (this.hasUpdated || s || (t = void 0), this._$AL.set(e, t)), i === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (t) {
      Promise.reject(t);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var s;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [a, o] of this._$Ep) this[a] = o;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [a, o] of i) {
        const { wrapped: c } = o, n = this[a];
        c !== !0 || this._$AL.has(a) || n === void 0 || this.C(a, void 0, o, n);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), (s = this._$EO) == null || s.forEach((i) => {
        var a;
        return (a = i.hostUpdate) == null ? void 0 : a.call(i);
      }), this.update(t)) : this._$EM();
    } catch (i) {
      throw e = !1, this._$EM(), i;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var t;
    (t = this._$EO) == null || t.forEach((s) => {
      var i;
      return (i = s.hostUpdated) == null ? void 0 : i.call(s);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
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
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((t) => this._$ET(t, this[t]))), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
C.elementStyles = [], C.shadowRootOptions = { mode: "open" }, C[H("elementProperties")] = /* @__PURE__ */ new Map(), C[H("finalized")] = /* @__PURE__ */ new Map(), J == null || J({ ReactiveElement: C }), (b.reactiveElementVersions ?? (b.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const R = globalThis, pe = (r) => r, q = R.trustedTypes, fe = q ? q.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, Ce = "$lit$", v = `lit$${Math.random().toFixed(9).slice(2)}$`, Pe = "?" + v, Be = `<${Pe}>`, E = document, F = () => E.createComment(""), z = (r) => r === null || typeof r != "object" && typeof r != "function", ae = Array.isArray, We = (r) => ae(r) || typeof (r == null ? void 0 : r[Symbol.iterator]) == "function", K = `[ 	
\f\r]`, k = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, me = /-->/g, _e = />/g, $ = RegExp(`>|${K}(?:([^\\s"'>=/]+)(${K}*=${K}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ge = /'/g, ye = /"/g, Te = /^(?:script|style|textarea|title)$/i, qe = (r) => (e, ...t) => ({ _$litType$: r, strings: e, values: t }), _ = qe(1), S = Symbol.for("lit-noChange"), m = Symbol.for("lit-nothing"), ve = /* @__PURE__ */ new WeakMap(), x = E.createTreeWalker(E, 129);
function Oe(r, e) {
  if (!ae(r) || !r.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return fe !== void 0 ? fe.createHTML(e) : e;
}
const Ve = (r, e) => {
  const t = r.length - 1, s = [];
  let i, a = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", o = k;
  for (let c = 0; c < t; c++) {
    const n = r[c];
    let d, u, l = -1, p = 0;
    for (; p < n.length && (o.lastIndex = p, u = o.exec(n), u !== null); ) p = o.lastIndex, o === k ? u[1] === "!--" ? o = me : u[1] !== void 0 ? o = _e : u[2] !== void 0 ? (Te.test(u[2]) && (i = RegExp("</" + u[2], "g")), o = $) : u[3] !== void 0 && (o = $) : o === $ ? u[0] === ">" ? (o = i ?? k, l = -1) : u[1] === void 0 ? l = -2 : (l = o.lastIndex - u[2].length, d = u[1], o = u[3] === void 0 ? $ : u[3] === '"' ? ye : ge) : o === ye || o === ge ? o = $ : o === me || o === _e ? o = k : (o = $, i = void 0);
    const h = o === $ && r[c + 1].startsWith("/>") ? " " : "";
    a += o === k ? n + Be : l >= 0 ? (s.push(d), n.slice(0, l) + Ce + n.slice(l) + v + h) : n + v + (l === -2 ? c : h);
  }
  return [Oe(r, a + (r[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class D {
  constructor({ strings: e, _$litType$: t }, s) {
    let i;
    this.parts = [];
    let a = 0, o = 0;
    const c = e.length - 1, n = this.parts, [d, u] = Ve(e, t);
    if (this.el = D.createElement(d, s), x.currentNode = this.el.content, t === 2 || t === 3) {
      const l = this.el.content.firstChild;
      l.replaceWith(...l.childNodes);
    }
    for (; (i = x.nextNode()) !== null && n.length < c; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const l of i.getAttributeNames()) if (l.endsWith(Ce)) {
          const p = u[o++], h = i.getAttribute(l).split(v), f = /([.?@])?(.*)/.exec(p);
          n.push({ type: 1, index: a, name: f[2], strings: h, ctor: f[1] === "." ? Ze : f[1] === "?" ? Je : f[1] === "@" ? Ke : V }), i.removeAttribute(l);
        } else l.startsWith(v) && (n.push({ type: 6, index: a }), i.removeAttribute(l));
        if (Te.test(i.tagName)) {
          const l = i.textContent.split(v), p = l.length - 1;
          if (p > 0) {
            i.textContent = q ? q.emptyScript : "";
            for (let h = 0; h < p; h++) i.append(l[h], F()), x.nextNode(), n.push({ type: 2, index: ++a });
            i.append(l[p], F());
          }
        }
      } else if (i.nodeType === 8) if (i.data === Pe) n.push({ type: 2, index: a });
      else {
        let l = -1;
        for (; (l = i.data.indexOf(v, l + 1)) !== -1; ) n.push({ type: 7, index: a }), l += v.length - 1;
      }
      a++;
    }
  }
  static createElement(e, t) {
    const s = E.createElement("template");
    return s.innerHTML = e, s;
  }
}
function T(r, e, t = r, s) {
  var o, c;
  if (e === S) return e;
  let i = s !== void 0 ? (o = t._$Co) == null ? void 0 : o[s] : t._$Cl;
  const a = z(e) ? void 0 : e._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== a && ((c = i == null ? void 0 : i._$AO) == null || c.call(i, !1), a === void 0 ? i = void 0 : (i = new a(r), i._$AT(r, t, s)), s !== void 0 ? (t._$Co ?? (t._$Co = []))[s] = i : t._$Cl = i), i !== void 0 && (e = T(r, i._$AS(r, e.values), i, s)), e;
}
class Ge {
  constructor(e, t) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: t }, parts: s } = this._$AD, i = ((e == null ? void 0 : e.creationScope) ?? E).importNode(t, !0);
    x.currentNode = i;
    let a = x.nextNode(), o = 0, c = 0, n = s[0];
    for (; n !== void 0; ) {
      if (o === n.index) {
        let d;
        n.type === 2 ? d = new L(a, a.nextSibling, this, e) : n.type === 1 ? d = new n.ctor(a, n.name, n.strings, this, e) : n.type === 6 && (d = new Qe(a, this, e)), this._$AV.push(d), n = s[++c];
      }
      o !== (n == null ? void 0 : n.index) && (a = x.nextNode(), o++);
    }
    return x.currentNode = E, i;
  }
  p(e) {
    let t = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(e, s, t), t += s.strings.length - 2) : s._$AI(e[t])), t++;
  }
}
class L {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, t, s, i) {
    this.type = 2, this._$AH = m, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = s, this.options = i, this._$Cv = (i == null ? void 0 : i.isConnected) ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const t = this._$AM;
    return t !== void 0 && (e == null ? void 0 : e.nodeType) === 11 && (e = t.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, t = this) {
    e = T(this, e, t), z(e) ? e === m || e == null || e === "" ? (this._$AH !== m && this._$AR(), this._$AH = m) : e !== this._$AH && e !== S && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : We(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== m && z(this._$AH) ? this._$AA.nextSibling.data = e : this.T(E.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var a;
    const { values: t, _$litType$: s } = e, i = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = D.createElement(Oe(s.h, s.h[0]), this.options)), s);
    if (((a = this._$AH) == null ? void 0 : a._$AD) === i) this._$AH.p(t);
    else {
      const o = new Ge(i, this), c = o.u(this.options);
      o.p(t), this.T(c), this._$AH = o;
    }
  }
  _$AC(e) {
    let t = ve.get(e.strings);
    return t === void 0 && ve.set(e.strings, t = new D(e)), t;
  }
  k(e) {
    ae(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let s, i = 0;
    for (const a of e) i === t.length ? t.push(s = new L(this.O(F()), this.O(F()), this, this.options)) : s = t[i], s._$AI(a), i++;
    i < t.length && (this._$AR(s && s._$AB.nextSibling, i), t.length = i);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, t); e !== this._$AB; ) {
      const i = pe(e).nextSibling;
      pe(e).remove(), e = i;
    }
  }
  setConnected(e) {
    var t;
    this._$AM === void 0 && (this._$Cv = e, (t = this._$AP) == null || t.call(this, e));
  }
}
class V {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, s, i, a) {
    this.type = 1, this._$AH = m, this._$AN = void 0, this.element = e, this.name = t, this._$AM = i, this.options = a, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = m;
  }
  _$AI(e, t = this, s, i) {
    const a = this.strings;
    let o = !1;
    if (a === void 0) e = T(this, e, t, 0), o = !z(e) || e !== this._$AH && e !== S, o && (this._$AH = e);
    else {
      const c = e;
      let n, d;
      for (e = a[0], n = 0; n < a.length - 1; n++) d = T(this, c[s + n], t, n), d === S && (d = this._$AH[n]), o || (o = !z(d) || d !== this._$AH[n]), d === m ? e = m : e !== m && (e += (d ?? "") + a[n + 1]), this._$AH[n] = d;
    }
    o && !i && this.j(e);
  }
  j(e) {
    e === m ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Ze extends V {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === m ? void 0 : e;
  }
}
class Je extends V {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== m);
  }
}
class Ke extends V {
  constructor(e, t, s, i, a) {
    super(e, t, s, i, a), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = T(this, e, t, 0) ?? m) === S) return;
    const s = this._$AH, i = e === m && s !== m || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, a = e !== m && (s === m || i);
    i && this.element.removeEventListener(this.name, this, s), a && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var t;
    typeof this._$AH == "function" ? this._$AH.call(((t = this.options) == null ? void 0 : t.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Qe {
  constructor(e, t, s) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    T(this, e);
  }
}
const Ye = { I: L }, Q = R.litHtmlPolyfillSupport;
Q == null || Q(D, L), (R.litHtmlVersions ?? (R.litHtmlVersions = [])).push("3.3.3");
const Xe = (r, e, t) => {
  const s = (t == null ? void 0 : t.renderBefore) ?? e;
  let i = s._$litPart$;
  if (i === void 0) {
    const a = (t == null ? void 0 : t.renderBefore) ?? null;
    s._$litPart$ = i = new L(e.insertBefore(F(), a), a, void 0, t ?? {});
  }
  return i._$AI(r), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const A = globalThis;
let P = class extends C {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var t;
    const e = super.createRenderRoot();
    return (t = this.renderOptions).renderBefore ?? (t.renderBefore = e.firstChild), e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Xe(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var e;
    super.connectedCallback(), (e = this._$Do) == null || e.setConnected(!0);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = this._$Do) == null || e.setConnected(!1);
  }
  render() {
    return S;
  }
};
var Ae;
P._$litElement$ = !0, P.finalized = !0, (Ae = A.litElementHydrateSupport) == null || Ae.call(A, { LitElement: P });
const Y = A.litElementPolyfillSupport;
Y == null || Y({ LitElement: P });
(A.litElementVersions ?? (A.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Le = (r) => (e, t) => {
  t !== void 0 ? t.addInitializer(() => {
    customElements.define(r, e);
  }) : customElements.define(r, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const et = { attribute: !0, type: String, converter: W, reflect: !1, hasChanged: oe }, tt = (r = et, e, t) => {
  const { kind: s, metadata: i } = t;
  let a = globalThis.litPropertyMetadata.get(i);
  if (a === void 0 && globalThis.litPropertyMetadata.set(i, a = /* @__PURE__ */ new Map()), s === "setter" && ((r = Object.create(r)).wrapped = !0), a.set(t.name, r), s === "accessor") {
    const { name: o } = t;
    return { set(c) {
      const n = e.get.call(this);
      e.set.call(this, c), this.requestUpdate(o, n, r, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(o, void 0, r, c), c;
    } };
  }
  if (s === "setter") {
    const { name: o } = t;
    return function(c) {
      const n = this[o];
      e.call(this, c), this.requestUpdate(o, n, r, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function ne(r) {
  return (e, t) => typeof t == "object" ? tt(r, e, t) : ((s, i, a) => {
    const o = i.hasOwnProperty(a);
    return i.constructor.createProperty(a, s), o ? Object.getOwnPropertyDescriptor(i, a) : void 0;
  })(r, e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function I(r) {
  return ne({ ...r, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const st = { CHILD: 2 }, it = (r) => (...e) => ({ _$litDirective$: r, values: e });
let rt = class {
  constructor(e) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(e, t, s) {
    this._$Ct = e, this._$AM = t, this._$Ci = s;
  }
  _$AS(e, t) {
    return this.update(e, t);
  }
  update(e, t) {
    return this.render(...t);
  }
};
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { I: ot } = Ye, be = (r) => r, $e = () => document.createComment(""), U = (r, e, t) => {
  var a;
  const s = r._$AA.parentNode, i = e === void 0 ? r._$AB : e._$AA;
  if (t === void 0) {
    const o = s.insertBefore($e(), i), c = s.insertBefore($e(), i);
    t = new ot(o, c, r, r.options);
  } else {
    const o = t._$AB.nextSibling, c = t._$AM, n = c !== r;
    if (n) {
      let d;
      (a = t._$AQ) == null || a.call(t, r), t._$AM = r, t._$AP !== void 0 && (d = r._$AU) !== c._$AU && t._$AP(d);
    }
    if (o !== i || n) {
      let d = t._$AA;
      for (; d !== o; ) {
        const u = be(d).nextSibling;
        be(s).insertBefore(d, i), d = u;
      }
    }
  }
  return t;
}, w = (r, e, t = r) => (r._$AI(e, t), r), at = {}, nt = (r, e = at) => r._$AH = e, ct = (r) => r._$AH, X = (r) => {
  r._$AR(), r._$AA.remove();
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const we = (r, e, t) => {
  const s = /* @__PURE__ */ new Map();
  for (let i = e; i <= t; i++) s.set(r[i], i);
  return s;
}, lt = it(class extends rt {
  constructor(r) {
    if (super(r), r.type !== st.CHILD) throw Error("repeat() can only be used in text expressions");
  }
  dt(r, e, t) {
    let s;
    t === void 0 ? t = e : e !== void 0 && (s = e);
    const i = [], a = [];
    let o = 0;
    for (const c of r) i[o] = s ? s(c, o) : o, a[o] = t(c, o), o++;
    return { values: a, keys: i };
  }
  render(r, e, t) {
    return this.dt(r, e, t).values;
  }
  update(r, [e, t, s]) {
    const i = ct(r), { values: a, keys: o } = this.dt(e, t, s);
    if (!Array.isArray(i)) return this.ut = o, a;
    const c = this.ut ?? (this.ut = []), n = [];
    let d, u, l = 0, p = i.length - 1, h = 0, f = a.length - 1;
    for (; l <= p && h <= f; ) if (i[l] === null) l++;
    else if (i[p] === null) p--;
    else if (c[l] === o[h]) n[h] = w(i[l], a[h]), l++, h++;
    else if (c[p] === o[f]) n[f] = w(i[p], a[f]), p--, f--;
    else if (c[l] === o[f]) n[f] = w(i[l], a[f]), U(r, n[f + 1], i[l]), l++, f--;
    else if (c[p] === o[h]) n[h] = w(i[p], a[h]), U(r, i[l], i[p]), p--, h++;
    else if (d === void 0 && (d = we(o, h, f), u = we(c, l, p)), d.has(c[l])) if (d.has(c[p])) {
      const y = u.get(o[h]), Z = y !== void 0 ? i[y] : null;
      if (Z === null) {
        const ce = U(r, i[l]);
        w(ce, a[h]), n[h] = ce;
      } else n[h] = w(Z, a[h]), U(r, i[l], Z), i[y] = null;
      h++;
    } else X(i[p]), p--;
    else X(i[l]), l++;
    for (; h <= f; ) {
      const y = U(r, n[f + 1]);
      w(y, a[h]), n[h++] = y;
    }
    for (; l <= p; ) {
      const y = i[l++];
      y !== null && X(y);
    }
    return this.ut = o, nt(r, n), S;
  }
}), dt = Se`
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
function M(r, e, t = {}, s = {}) {
  r.dispatchEvent(
    new CustomEvent(e, {
      bubbles: s.bubbles !== !1,
      composed: s.composed !== !1,
      detail: t
    })
  );
}
function xe(r) {
  if (!r) return !1;
  const e = r.state.toLowerCase();
  return ["on", "home", "active", "open", "playing", "above_horizon"].includes(e);
}
function te(r, e) {
  if (!r || !r.areas) return null;
  const t = e.area_id || e.area;
  if (!t) return null;
  if (r.areas[t])
    return r.areas[t];
  const s = t.toLowerCase();
  return Object.values(r.areas).find(
    (a) => a.area_id && a.area_id.toLowerCase() === s || a.name && a.name.toLowerCase() === s
  ) || null;
}
function se(r, e) {
  const t = {};
  if (!r || !r.entities) return t;
  const s = Object.values(r.entities).filter((n) => {
    if (n.area_id === e) return !0;
    if (n.device_id && r.devices) {
      const d = r.devices[n.device_id];
      if (d && d.area_id === e) return !0;
    }
    return !1;
  }), i = s.find((n) => {
    var h, f;
    if (!n.entity_id.startsWith("sensor.") || n.device_class === "battery" || n.entity_id.includes("battery") || n.entity_id.includes("batterie")) return !1;
    if (n.device_class === "temperature") return !0;
    const u = r.states[n.entity_id];
    if ((f = (h = u == null ? void 0 : u.attributes) == null ? void 0 : h.unit_of_measurement) != null && f.includes("°")) return !0;
    const l = n.entity_id.split("."), p = l[1] ? l[1].toLowerCase() : "";
    return p.includes("temp") || p.includes("temperature");
  });
  i && (t.temperature = i.entity_id);
  const a = s.find((n) => {
    var h;
    if (!n.entity_id.startsWith("sensor.") || n.device_class === "battery" || n.entity_id.includes("battery") || n.entity_id.includes("batterie")) return !1;
    if (n.device_class === "humidity") return !0;
    const u = r.states[n.entity_id];
    if (((h = u == null ? void 0 : u.attributes) == null ? void 0 : h.unit_of_measurement) === "%") return !0;
    const l = n.entity_id.split("."), p = l[1] ? l[1].toLowerCase() : "";
    return p.includes("hum") || p.includes("humidity");
  });
  a && (t.humidity = a.entity_id);
  const o = s.find((n) => {
    if (!n.entity_id.startsWith("binary_sensor.")) return !1;
    if (n.device_class === "window" || n.device_class === "door" || n.device_class === "opening") return !0;
    const u = n.entity_id.split("."), l = u[1] ? u[1].toLowerCase() : "";
    return l.includes("window") || l.includes("fenster") || l.includes("door") || l.includes("tuer") || l.includes("opening");
  });
  o && (t.window = o.entity_id);
  const c = s.find((n) => n.entity_id.startsWith("light."));
  if (c)
    t.mainLightOrSwitch = c.entity_id;
  else {
    const n = s.find((d) => d.entity_id.startsWith("switch."));
    n && (t.mainLightOrSwitch = n.entity_id);
  }
  return t;
}
function ee(r, e, t, s) {
  if (!((s === "tap" ? t.tap_action : s === "hold" ? t.hold_action : t.double_tap_action) || (s === "tap" ? {} : null))) return;
  const o = t.entity || t.temperature_entity || t.humidity_entity || "";
  M(r, "hass-action", {
    config: {
      entity: o,
      tap_action: t.tap_action || { action: "more-info" },
      hold_action: t.hold_action,
      double_tap_action: t.double_tap_action
    },
    action: s
  });
}
var ht = Object.defineProperty, ut = Object.getOwnPropertyDescriptor, G = (r, e, t, s) => {
  for (var i = s > 1 ? void 0 : s ? ut(e, t) : e, a = r.length - 1, o; a >= 0; a--)
    (o = r[a]) && (i = (s ? o(e, t, i) : o(i)) || i);
  return s && i && ht(e, t, i), i;
};
let N = class extends P {
  constructor() {
    super(...arguments);
    g(this, "hass");
    g(this, "_config");
    g(this, "_featuresEditorLoaded", !1);
    g(this, "_computeLabel", (e) => e.label || e.name);
  }
  static get styles() {
    return Se`
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
  setConfig(e) {
    this._config = {
      show_icon: !0,
      show_secondary_text: !0,
      feature_layout: "side",
      feature_grid_columns: 2,
      secondary_text_source: "combined",
      ...e
    };
  }
  get _resolvedArea() {
    return te(this.hass, this._config);
  }
  get _resolvedAreaEntities() {
    const e = this._resolvedArea;
    return e ? se(this.hass, e.area_id) : {};
  }
  firstUpdated(e) {
    super.firstUpdated(e), this._loadFeaturesEditor();
  }
  async _loadFeaturesEditor() {
    if (!customElements.get("hui-card-features-editor")) {
      if (window.loadCardHelpers)
        try {
          const t = await (await window.loadCardHelpers()).createCardElement({ type: "tile", entity: "light.dummy" });
          t && t.constructor && t.constructor.getConfigElement && t.constructor.getConfigElement();
        } catch {
        }
      for (let e = 0; e < 40 && !customElements.get("hui-card-features-editor"); e++)
        await new Promise((t) => setTimeout(t, 100));
    }
    this._featuresEditorLoaded = !!customElements.get("hui-card-features-editor"), this._featuresEditorLoaded && this._patchFeaturesEditor(), this.requestUpdate();
  }
  _patchFeaturesEditor() {
    const e = customElements.get("hui-card-features-editor");
    if (e && !e.__patchedForMaterialRoomCard) {
      e.__patchedForMaterialRoomCard = !0;
      const t = (o) => {
        let c = o;
        for (; c; ) {
          if (c.tagName === "MATERIAL-ROOM-CARD-EDITOR")
            return !0;
          c = c.parentNode || c.host;
        }
        return !1;
      }, s = e.prototype._supportsFeatureType;
      e.prototype._supportsFeatureType = function(o) {
        return t(this) ? !0 : s.call(this, o);
      };
      const i = [
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
      ], a = e.prototype._getSupportedFeaturesType;
      e.prototype._getSupportedFeaturesType = function() {
        if (t(this)) {
          const o = (window.customCardFeatures || []).map(
            (c) => `custom:${c.type}`
          );
          return i.concat(o);
        }
        return a.call(this);
      };
    }
  }
  _editDetailElement(e) {
    e.stopPropagation();
    const t = e.detail.subElementConfig.index, s = this._config.features[t], a = { entity_id: s.entity || this._config.entity || "light.dummy" };
    M(this, "edit-sub-element", {
      config: s,
      saveConfig: (o) => this._updateFeature(t, o),
      context: a,
      type: "feature"
    });
  }
  _updateFeature(e, t) {
    const s = (this._config.features || []).concat();
    s[e] = t, this._config = {
      ...this._config,
      features: s
    }, M(this, "config-changed", { config: this._config });
  }
  // Handle value-changed from HA forms
  _handleFormChanged(e, t) {
    if (e.stopPropagation(), !this._config) return;
    const s = e.detail.value, i = {
      ...this._config,
      ...s
    };
    i.features = this._config.features || [];
    const a = this._config.area_id || this._config.area, o = i.area_id || i.area;
    if (o && o !== a) {
      const c = te(this.hass, { area_id: o });
      if (c) {
        i.title = c.name || i.title, c.icon && (i.icon = c.icon);
        const n = se(this.hass, c.area_id);
        n.temperature && (i.temperature_entity = n.temperature), n.humidity && (i.humidity_entity = n.humidity), n.window && (i.window_entity = n.window), n.mainLightOrSwitch && (i.entity = n.mainLightOrSwitch);
      }
    }
    this._config = i, M(this, "config-changed", { config: i });
  }
  // Handle features-changed from HA features editor
  _handleFeaturesChanged(e) {
    e.stopPropagation();
    let t;
    e.detail && e.detail.value !== void 0 ? t = e.detail.value : e.detail && e.detail.features !== void 0 ? t = e.detail.features : e.detail && e.detail.config && e.detail.config.features !== void 0 && (t = e.detail.config.features), t && Array.isArray(t) && (this._config = {
      ...this._config,
      features: t
    }, M(this, "config-changed", { config: this._config }));
  }
  render() {
    if (!this.hass || !this._config) return _``;
    const e = this._resolvedAreaEntities, t = "light.dummy", s = {
      ...this.hass,
      states: {
        ...this.hass.states,
        [t]: {
          entity_id: t,
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
    }, i = [
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
    ], a = [
      { name: "temperature_entity", label: "Temperature Sensor Override", placeholder: e.temperature || "Auto-resolved", selector: { entity: { domain: "sensor" } } },
      { name: "humidity_entity", label: "Humidity Sensor Override", placeholder: e.humidity || "Auto-resolved", selector: { entity: { domain: "sensor" } } },
      { name: "window_entity", label: "Window Sensor Override (Window open/closed)", placeholder: e.window || "Auto-resolved", selector: { entity: { domain: "binary_sensor" } } },
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
    ], o = [
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
    return _`
      <div class="editor-container">
        <!-- Section: Configuration -->
        <details class="editor-section" open>
          <summary>Configuration</summary>
          <div class="section-content">
            <ha-form
              .hass=${this.hass}
              .data=${this._config}
              .schema=${i}
              .computeLabel=${this._computeLabel}
              @value-changed=${(n) => this._handleFormChanged(n, "config")}
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
              .schema=${a}
              .computeLabel=${this._computeLabel}
              @value-changed=${(n) => this._handleFormChanged(n, "content")}
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
              .schema=${o}
              .computeLabel=${this._computeLabel}
              @value-changed=${(n) => this._handleFormChanged(n, "interactions")}
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
              @value-changed=${(n) => this._handleFormChanged(n, "features-layout")}
            ></ha-form>
          </div>

          <!-- Feature management component -->
          <div class="features-container">
            <div class="features-header">Manage Feature Buttons</div>
            ${this._featuresEditorLoaded ? _`
                  <hui-card-features-editor
                    .hass=${s}
                    .stateObj=${s.states[t]}
                    .context=${{ entity_id: t }}
                    .features=${this._config.features || []}
                    @value-changed=${this._handleFeaturesChanged}
                    @features-changed=${this._handleFeaturesChanged}
                    @config-changed=${this._handleFeaturesChanged}
                    @edit-detail-element=${this._editDetailElement}
                  ></hui-card-features-editor>
                ` : _`<div class="error-msg">Loading Home Assistant Feature Editor...</div>`}
          </div>
        </details>
      </div>
    `;
  }
};
G([
  ne({ attribute: !1 })
], N.prototype, "hass", 2);
G([
  I()
], N.prototype, "_config", 2);
G([
  I()
], N.prototype, "_featuresEditorLoaded", 2);
N = G([
  Le("material-room-card-editor")
], N);
var pt = Object.defineProperty, ft = Object.getOwnPropertyDescriptor, j = (r, e, t, s) => {
  for (var i = s > 1 ? void 0 : s ? ft(e, t) : e, a = r.length - 1, o; a >= 0; a--)
    (o = r[a]) && (i = (s ? o(e, t, i) : o(i)) || i);
  return s && i && pt(e, t, i), i;
};
let O = class extends P {
  constructor() {
    super(...arguments);
    g(this, "hass");
    g(this, "_config");
    g(this, "_resolvedStyleType", "filled");
    g(this, "_resolvedEntities", {});
    g(this, "_observer");
    g(this, "_featuresLoaded", !1);
    g(this, "_featureDataCache", /* @__PURE__ */ new Map());
  }
  static get styles() {
    return dt;
  }
  // Set configuration
  setConfig(e) {
    if (!e)
      throw new Error("Invalid configuration");
    this._config = {
      show_icon: !0,
      show_secondary_text: !0,
      feature_layout: "side",
      feature_grid_columns: 2,
      secondary_text_source: "combined",
      ...e
    }, this._featureDataCache.clear(), this._updateStyleType();
  }
  connectedCallback() {
    super.connectedCallback(), this._setupObserver(), this._updateStyleType(), this._loadFeatures();
  }
  disconnectedCallback() {
    this._observer && (this._observer.disconnect(), this._observer = void 0), super.disconnectedCallback();
  }
  firstUpdated(e) {
    super.firstUpdated(e), this._loadFeatures();
  }
  // Performance optimization:
  // - When features are configured: ALWAYS update on state changes so interactive feature
  //   controls (light buttons, toggles, sliders, service calls, custom features) receive the
  //   new hass and stateObj in real time without getting stuck or requiring a page refresh.
  // - When NO features are configured: only update when the card's room entities, sensors,
  //   theme, language, or registries change.
  shouldUpdate(e) {
    var t;
    if (e.has("_config") || e.has("_resolvedStyleType") || e.has("_resolvedEntities"))
      return !0;
    if (e.has("hass")) {
      const s = e.get("hass");
      if (!s || !this.hass || s.themes !== this.hass.themes || s.language !== this.hass.language || s.areas !== this.hass.areas || s.entities !== this.hass.entities || s.devices !== this.hass.devices || (((t = this._config) == null ? void 0 : t.features) || []).length > 0)
        return !0;
      const a = this._config.entity || this._resolvedEntities.mainLightOrSwitch;
      if (a && s.states[a] !== this.hass.states[a])
        return !0;
      const o = this._temperatureEntity;
      if (o && s.states[o] !== this.hass.states[o])
        return !0;
      const c = this._humidityEntity;
      if (c && s.states[c] !== this.hass.states[c])
        return !0;
      const n = this._windowEntity;
      return !!(n && s.states[n] !== this.hass.states[n]);
    }
    return !0;
  }
  willUpdate(e) {
    if (super.willUpdate(e), e.has("_config"))
      this._updateStyleType(), this._resolveEntities();
    else if (e.has("hass")) {
      const t = e.get("hass");
      (!t || t.areas !== this.hass.areas || t.entities !== this.hass.entities || t.devices !== this.hass.devices) && this._resolveEntities();
    }
  }
  _resolveEntities() {
    if (!this.hass) return;
    const e = this._resolvedArea;
    if (!e) {
      Object.keys(this._resolvedEntities).length > 0 && (this._resolvedEntities = {});
      return;
    }
    const t = se(this.hass, e.area_id);
    (this._resolvedEntities.temperature !== t.temperature || this._resolvedEntities.humidity !== t.humidity || this._resolvedEntities.window !== t.window || this._resolvedEntities.mainLightOrSwitch !== t.mainLightOrSwitch) && (this._resolvedEntities = t);
  }
  _setupObserver() {
    this._observer || (this._observer = new MutationObserver(() => {
      this._updateStyleType();
    }), this._observer.observe(this, { attributes: !0, attributeFilter: ["class"] }));
  }
  _updateStyleType() {
    var s;
    const e = ["filled", "elevated", "transparent", "outlined", "translucent"];
    let t = ((s = this._config) == null ? void 0 : s.style_type) || "filled";
    for (const i of e)
      if (this.classList.contains(i)) {
        t = i;
        break;
      }
    this._resolvedStyleType !== t && (this._resolvedStyleType = t, this.setAttribute("style-type", t));
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
  _getFeatureData(e, t) {
    const s = (e == null ? void 0 : e.entity) || (e == null ? void 0 : e.entity_id) || t;
    let i = this._featureDataCache.get(e);
    return (!i || i.context.entity_id !== s) && (i = {
      context: { entity_id: s },
      features: [e]
    }, this._featureDataCache.set(e, i)), i;
  }
  // Getters for resolved configuration
  get _resolvedArea() {
    return te(this.hass, this._config);
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
    var t;
    const e = this._windowEntity;
    return e && ((t = this.hass) != null && t.states[e]) ? xe(this.hass.states[e]) : !1;
  }
  get _areaName() {
    var e;
    return this._config.title || this._config.name || ((e = this._resolvedArea) == null ? void 0 : e.name) || "Room";
  }
  get _areaIcon() {
    var e;
    return this._config.icon || ((e = this._resolvedArea) == null ? void 0 : e.icon) || "mdi:home";
  }
  get _secondaryText() {
    var o, c;
    const e = this._config.secondary_text_source || "combined", t = this._temperatureEntity, s = this._humidityEntity;
    let i = "";
    if (t && ((o = this.hass) != null && o.states[t])) {
      const n = this.hass.states[t];
      i = `${n.state}${n.attributes.unit_of_measurement || "°C"}`;
    }
    let a = "";
    if (s && ((c = this.hass) != null && c.states[s])) {
      const n = this.hass.states[s];
      a = `${n.state}${n.attributes.unit_of_measurement || "%"}`;
    }
    return e === "temperature" ? i : e === "humidity" ? a : e === "combined" ? [i, a].filter(Boolean).join(" • ") : e === "custom" && this._config.secondary_text_template ? this._config.secondary_text_template.replace("{temperature}", i).replace("{humidity}", a) : "";
  }
  get _presenceActive() {
    var t;
    const e = this._config.entity || this._resolvedEntities.mainLightOrSwitch;
    return e && ((t = this.hass) != null && t.states[e]) ? xe(this.hass.states[e]) : !1;
  }
  // Action Mappings
  _handleTap(e) {
    this._hasFeatureInPath(e) || ee(this, this.hass, this._config, "tap");
  }
  _handleHold(e) {
    this._hasFeatureInPath(e) || (e.preventDefault(), ee(this, this.hass, this._config, "hold"));
  }
  _handleDoubleTap(e) {
    this._hasFeatureInPath(e) || ee(this, this.hass, this._config, "double_tap");
  }
  _hasFeatureInPath(e) {
    return e.composedPath().some(
      (s) => s.tagName === "HUI-CARD-FEATURES" || s.classList && (s.classList.contains("mrc-features-side") || s.classList.contains("mrc-features-bottom") || s.classList.contains("mrc-features-grid"))
    );
  }
  // Render individual features with stable context, arrays, and stateObj
  _renderFeatureElements(e) {
    const t = this._config.entity || this._resolvedEntities.mainLightOrSwitch;
    return lt(
      e,
      (s, i) => s.id || s.entity || s.entity_id || `${s.type || "feat"}_${i}`,
      (s) => {
        var c;
        const i = this._getFeatureData(s, t), a = i.context.entity_id, o = a && ((c = this.hass) != null && c.states) ? this.hass.states[a] : void 0;
        return _`
          <hui-card-features
            .hass=${this.hass}
            .stateObj=${o}
            .context=${i.context}
            .color=${this._config.color}
            .features=${i.features}
          ></hui-card-features>
        `;
      }
    );
  }
  // Rendering
  render() {
    if (!this.hass || !this._config) return _``;
    const e = this._config.feature_layout || "side", t = this._config.features || [], s = t.length > 0;
    return _`
      <ha-card
        class="${this._resolvedStyleType}"
        @click=${this._handleTap}
        @contextmenu=${this._handleHold}
        @dblclick=${this._handleDoubleTap}
      >
        <div class="mrc-content">
          <div class="mrc-header">
            <div class="mrc-room-info">
              ${this._config.show_icon ? _`
                    <div class="mrc-icon-wrap ${this._presenceActive ? "active" : ""}">
                      <ha-icon .icon=${this._areaIcon}></ha-icon>
                      ${this._presenceActive ? _`
                            <div class="mrc-presence">
                              <ha-icon icon="mdi:account"></ha-icon>
                            </div>
                          ` : ""}
                      ${this._windowActive ? _`
                            <div class="mrc-window-badge">
                              <ha-icon icon="mdi:window-open-variant"></ha-icon>
                            </div>
                          ` : ""}
                    </div>
                  ` : ""}
              <div class="mrc-text">
                <div class="mrc-name">${this._areaName}</div>
                ${this._config.show_secondary_text && this._secondaryText ? _`<div class="mrc-sub">${this._secondaryText}</div>` : ""}
              </div>
            </div>

            <!-- Features or Status on the side -->
            ${s && e === "side" ? _`
                  <div class="mrc-header-side-wrap">
                    <div class="mrc-features-side">
                      ${this._renderFeatureElements(t)}
                    </div>
                  </div>
                ` : ""}
          </div>
        </div>

        <!-- Features stacked vertically -->
        ${s && e === "bottom" ? _`
              <div class="mrc-features-bottom">
                ${this._renderFeatureElements(t)}
              </div>
            ` : ""}

        <!-- Features in a Grid -->
        ${s && e === "grid" ? _`
              <div
                class="mrc-features-grid"
                style="--grid-columns: ${this._config.feature_grid_columns || 2}"
              >
                ${this._renderFeatureElements(t)}
              </div>
            ` : ""}
      </ha-card>
    `;
  }
  // Home Assistant Card API
  getCardSize() {
    var t;
    return ((t = this._config) == null ? void 0 : t.features) && this._config.features.length > 0 ? 3 : 2;
  }
  static getConfigElement() {
    return document.createElement("material-room-card-editor");
  }
  static getStubConfig(e) {
    let t = "", s = "Bedroom", i = "mdi:bed";
    if (e && e.areas && Object.keys(e.areas).length > 0) {
      const a = Object.values(e.areas)[0];
      t = a.area_id, s = a.name, i = a.icon || "mdi:home";
    }
    return {
      type: "custom:material-room-card",
      area: t || "bedroom",
      title: s,
      icon: i,
      show_icon: !0,
      show_secondary_text: !0,
      feature_layout: "side",
      style_type: "filled",
      features: []
    };
  }
};
j([
  ne({ attribute: !1 })
], O.prototype, "hass", 2);
j([
  I()
], O.prototype, "_config", 2);
j([
  I()
], O.prototype, "_resolvedStyleType", 2);
j([
  I()
], O.prototype, "_resolvedEntities", 2);
O = j([
  Le("material-room-card")
], O);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "material-room-card",
  name: "Material Room Card",
  preview: !0,
  description: "A premium Material You card for Home Assistant representing a Room or Area."
});
console.info(
  "%c MATERIAL-ROOM-CARD %c v2.2.1 ",
  "color: white; background: #4c5c92; font-weight: 700;",
  "color: #4c5c92; background: white; font-weight: 700;"
);
export {
  O as MaterialRoomCard
};
//# sourceMappingURL=material-room-card.js.map
