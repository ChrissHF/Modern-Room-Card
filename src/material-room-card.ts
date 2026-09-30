import { LitElement, html, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { HomeAssistant, MaterialRoomCardConfig } from './types';
import { styles } from './styles';
import {
  resolveArea,
  resolveAreaEntities,
  handleAction,
  isActive,
  ResolvedAreaEntities,
} from './helpers';
import './material-room-card-editor';

// Helper to extract the primary entity associated with a card feature
function extractFeatureEntity(feat: any, defaultEntity?: string): string | undefined {
  if (!feat || typeof feat !== 'object') return defaultEntity;
  if (typeof feat.entity === 'string' && feat.entity) return feat.entity;
  if (typeof feat.entity_id === 'string' && feat.entity_id) return feat.entity_id;
  if (Array.isArray(feat.entity_id) && typeof feat.entity_id[0] === 'string') return feat.entity_id[0];

  // Inspect entries (e.g. custom:service-call)
  if (Array.isArray(feat.entries)) {
    for (const entry of feat.entries) {
      if (!entry || typeof entry !== 'object') continue;
      if (typeof entry.entity === 'string' && entry.entity) return entry.entity;
      if (typeof entry.entity_id === 'string' && entry.entity_id) return entry.entity_id;
      const targetId = entry.tap_action?.target?.entity_id || entry.tap_action?.data?.entity_id;
      if (typeof targetId === 'string' && targetId) return targetId;
      if (Array.isArray(targetId) && typeof targetId[0] === 'string') return targetId[0];
    }
  }

  // Inspect buttons (legacy custom:service-call)
  if (Array.isArray(feat.buttons)) {
    for (const btn of feat.buttons) {
      if (!btn || typeof btn !== 'object') continue;
      if (typeof btn.entity === 'string' && btn.entity) return btn.entity;
      if (typeof btn.entity_id === 'string' && btn.entity_id) return btn.entity_id;
      const targetId = btn.tap_action?.target?.entity_id || btn.tap_action?.data?.entity_id;
      if (typeof targetId === 'string' && targetId) return targetId;
      if (Array.isArray(targetId) && typeof targetId[0] === 'string') return targetId[0];
    }
  }

  return defaultEntity;
}

// Helper to collect all entity IDs referenced anywhere in card features
function getAllFeatureEntities(features?: any[]): Set<string> {
  const entities = new Set<string>();
  if (!features || !Array.isArray(features)) return entities;

  for (const feat of features) {
    if (!feat || typeof feat !== 'object') continue;
    if (typeof feat.entity === 'string' && feat.entity) entities.add(feat.entity);
    if (typeof feat.entity_id === 'string' && feat.entity_id) entities.add(feat.entity_id);
    if (Array.isArray(feat.entity_id)) {
      feat.entity_id.forEach((id: any) => typeof id === 'string' && id && entities.add(id));
    }

    if (Array.isArray(feat.entries)) {
      for (const entry of feat.entries) {
        if (!entry || typeof entry !== 'object') continue;
        if (typeof entry.entity === 'string' && entry.entity) entities.add(entry.entity);
        if (typeof entry.entity_id === 'string' && entry.entity_id) entities.add(entry.entity_id);
        const tapTarget = entry.tap_action?.target?.entity_id || entry.tap_action?.data?.entity_id;
        if (typeof tapTarget === 'string' && tapTarget) entities.add(tapTarget);
        if (Array.isArray(tapTarget)) tapTarget.forEach((id: any) => typeof id === 'string' && id && entities.add(id));
        const holdTarget = entry.hold_action?.target?.entity_id || entry.hold_action?.data?.entity_id;
        if (typeof holdTarget === 'string' && holdTarget) entities.add(holdTarget);
        if (Array.isArray(holdTarget)) holdTarget.forEach((id: any) => typeof id === 'string' && id && entities.add(id));
      }
    }

    if (Array.isArray(feat.buttons)) {
      for (const btn of feat.buttons) {
        if (!btn || typeof btn !== 'object') continue;
        if (typeof btn.entity === 'string' && btn.entity) entities.add(btn.entity);
        if (typeof btn.entity_id === 'string' && btn.entity_id) entities.add(btn.entity_id);
        const tapTarget = btn.tap_action?.target?.entity_id || btn.tap_action?.data?.entity_id;
        if (typeof tapTarget === 'string' && tapTarget) entities.add(tapTarget);
        if (Array.isArray(tapTarget)) tapTarget.forEach((id: any) => typeof id === 'string' && id && entities.add(id));
      }
    }
  }

  return entities;
}

@customElement('material-room-card')
export class MaterialRoomCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _config!: MaterialRoomCardConfig;
  @state() private _resolvedStyleType: string = 'filled';
  @state() private _resolvedEntities: ResolvedAreaEntities = {};

  private _observer?: MutationObserver;
  private _featuresLoaded = false;
  private _featureDataCache = new Map<any, { context: { entity_id?: string }; features: [any] }>();
  private _unsubscribeStates?: () => void;

  static get styles() {
    return styles;
  }

  // Set configuration
  public setConfig(config: MaterialRoomCardConfig): void {
    if (!config) {
      throw new Error('Invalid configuration');
    }
    this._config = {
      show_icon: true,
      show_secondary_text: true,
      feature_layout: 'side',
      feature_grid_columns: 2,
      secondary_text_source: 'combined',
      ...config,
    };
    this._featureDataCache.clear();
    this._updateStyleType();
  }

  public connectedCallback(): void {
    super.connectedCallback();
    this._subscribeStates();
    this._setupObserver();
    this._updateStyleType();
    this._loadFeatures();
  }

  public disconnectedCallback(): void {
    if (this._unsubscribeStates) {
      this._unsubscribeStates();
      this._unsubscribeStates = undefined;
    }
    if (this._observer) {
      this._observer.disconnect();
      this._observer = undefined;
    }
    super.disconnectedCallback();
  }

  private _subscribeStates(): void {
    if (this._unsubscribeStates) return;
    try {
      const event = new CustomEvent('context-request', {
        bubbles: true,
        composed: true,
        cancelable: true,
      });
      (event as any).context = 'states';
      (event as any).subscribe = true;
      (event as any).callback = (states: Record<string, any>, unsubscribe: () => void) => {
        this._unsubscribeStates = unsubscribe;
        if (this.hass && states) {
          this.hass = {
            ...this.hass,
            states,
          };
          this.requestUpdate();
        }
      };
      this.dispatchEvent(event);
    } catch (_) {
      // Fallback gracefully if context-request is not supported
    }
  }

  protected firstUpdated(changedProperties: PropertyValues): void {
    super.firstUpdated(changedProperties);
    this._loadFeatures();
  }

  // Performance optimization:
  // - Real-time responsiveness: Tracks all entities used by room sensors, presence,
  //   and all configured features (including buttons, sliders, service-call entries).
  // - High efficiency: Ignores updates for unrelated entities across Home Assistant,
  //   preventing UI lag while guaranteeing instantaneous state updates for all features.
  protected shouldUpdate(changedProperties: PropertyValues): boolean {
    if (
      changedProperties.has('_config') ||
      changedProperties.has('_resolvedStyleType') ||
      changedProperties.has('_resolvedEntities')
    ) {
      return true;
    }

    if (changedProperties.has('hass')) {
      const oldHass = changedProperties.get('hass') as HomeAssistant | undefined;
      if (!oldHass || !this.hass) {
        return true;
      }

      // Check global theme, language, or entity registry modifications
      if (
        oldHass.themes !== this.hass.themes ||
        oldHass.language !== this.hass.language ||
        oldHass.areas !== this.hass.areas ||
        oldHass.entities !== this.hass.entities ||
        oldHass.devices !== this.hass.devices
      ) {
        return true;
      }

      // Check primary room entity
      const mainEntity = this._config?.entity || this._resolvedEntities.mainLightOrSwitch;
      if (mainEntity && oldHass.states[mainEntity] !== this.hass.states[mainEntity]) {
        return true;
      }

      // Check sensor entities
      const tempEntity = this._temperatureEntity;
      if (tempEntity && oldHass.states[tempEntity] !== this.hass.states[tempEntity]) {
        return true;
      }

      const humEntity = this._humidityEntity;
      if (humEntity && oldHass.states[humEntity] !== this.hass.states[humEntity]) {
        return true;
      }

      const winEntity = this._windowEntity;
      if (winEntity && oldHass.states[winEntity] !== this.hass.states[winEntity]) {
        return true;
      }

      // Check entities targeted by card features
      const features = this._config?.features || [];
      if (features.length > 0) {
        const featureEntities = getAllFeatureEntities(features);
        if (featureEntities.size > 0) {
          for (const ent of featureEntities) {
            if (oldHass.states[ent] !== this.hass.states[ent]) {
              return true;
            }
          }
        } else {
          // If features exist without statically discoverable entities (e.g. dynamic templates),
          // update on state changes to ensure interactive elements never get stuck.
          if (oldHass.states !== this.hass.states) {
            return true;
          }
        }
      }

      // No entity relevant to this card changed — skip render
      return false;
    }

    return true;
  }

  protected willUpdate(changedProperties: PropertyValues): void {
    super.willUpdate(changedProperties);

    if (changedProperties.has('_config')) {
      this._updateStyleType();
      this._resolveEntities();
    } else if (changedProperties.has('hass')) {
      const oldHass = changedProperties.get('hass') as HomeAssistant | undefined;
      // Only re-resolve if registry objects actually changed (not on every state tick)
      if (
        !oldHass ||
        oldHass.areas !== this.hass.areas ||
        oldHass.entities !== this.hass.entities ||
        oldHass.devices !== this.hass.devices
      ) {
        this._resolveEntities();
      }
    }
  }

  private _resolveEntities() {
    if (!this.hass) return;
    const area = this._resolvedArea;
    if (!area) {
      if (Object.keys(this._resolvedEntities).length > 0) {
        this._resolvedEntities = {};
      }
      return;
    }

    const entities = resolveAreaEntities(this.hass, area.area_id);
    if (
      this._resolvedEntities.temperature !== entities.temperature ||
      this._resolvedEntities.humidity !== entities.humidity ||
      this._resolvedEntities.window !== entities.window ||
      this._resolvedEntities.mainLightOrSwitch !== entities.mainLightOrSwitch
    ) {
      this._resolvedEntities = entities;
    }
  }

  private _setupObserver() {
    if (this._observer) return;
    this._observer = new MutationObserver(() => {
      this._updateStyleType();
    });
    this._observer.observe(this, { attributes: true, attributeFilter: ['class'] });
  }

  private _updateStyleType() {
    const classes = ['filled', 'elevated', 'transparent', 'outlined', 'translucent'];
    let styleType = this._config?.style_type || 'filled';

    // Prioritize Card Mod classes if present on the host
    for (const c of classes) {
      if (this.classList.contains(c)) {
        styleType = c as any;
        break;
      }
    }

    if (this._resolvedStyleType !== styleType) {
      this._resolvedStyleType = styleType;
      this.setAttribute('style-type', styleType);
    }
  }

  private async _loadFeatures() {
    if (this._featuresLoaded) return;
    this._featuresLoaded = true;

    if ((window as any).loadCardHelpers) {
      try {
        const helpers = await (window as any).loadCardHelpers();
        // Force HA to load the tile card and all card feature elements
        helpers.createCardElement({
          type: 'tile',
          entity: 'light.dummy',
          features: [{ type: 'target-temperature' }],
        });
      } catch (_) {
        // Ignore
      }
    }

    // Force a re-render once hui-card-features is registered
    if (customElements.get('hui-card-features')) {
      this.requestUpdate();
    } else {
      customElements.whenDefined('hui-card-features').then(() => {
        this.requestUpdate();
      });
    }
  }

  // Stable feature data cache to avoid reference thrashing on hui-card-features
  private _getFeatureData(feat: any, defaultEntity?: string) {
    const targetEntity = extractFeatureEntity(feat, defaultEntity);
    let cached = this._featureDataCache.get(feat);
    if (!cached || cached.context.entity_id !== targetEntity) {
      cached = {
        context: { entity_id: targetEntity },
        features: [feat],
      };
      this._featureDataCache.set(feat, cached);
    }
    return cached;
  }

  // Getters for resolved configuration
  private get _resolvedArea() {
    return resolveArea(this.hass, this._config);
  }

  private get _temperatureEntity() {
    return this._config.temperature_entity || this._resolvedEntities.temperature;
  }

  private get _humidityEntity() {
    return this._config.humidity_entity || this._resolvedEntities.humidity;
  }

  private get _windowEntity() {
    return this._config.window_entity || this._resolvedEntities.window;
  }

  private get _windowActive(): boolean {
    const winEnt = this._windowEntity;
    if (winEnt && this.hass?.states[winEnt]) {
      return isActive(this.hass.states[winEnt]);
    }
    return false;
  }

  private get _areaName(): string {
    return this._config.title || this._config.name || this._resolvedArea?.name || 'Room';
  }

  private get _areaIcon(): string {
    return this._config.icon || this._resolvedArea?.icon || 'mdi:home';
  }

  private get _secondaryText(): string {
    const source = this._config.secondary_text_source || 'combined';
    const tempEntity = this._temperatureEntity;
    const humEntity = this._humidityEntity;

    let tempStr = '';
    if (tempEntity && this.hass?.states[tempEntity]) {
      const s = this.hass.states[tempEntity];
      tempStr = `${s.state}${s.attributes.unit_of_measurement || '°C'}`;
    }

    let humStr = '';
    if (humEntity && this.hass?.states[humEntity]) {
      const s = this.hass.states[humEntity];
      humStr = `${s.state}${s.attributes.unit_of_measurement || '%'}`;
    }

    if (source === 'temperature') return tempStr;
    if (source === 'humidity') return humStr;

    if (source === 'combined') {
      return [tempStr, humStr].filter(Boolean).join(' • ');
    }

    if (source === 'custom' && this._config.secondary_text_template) {
      return this._config.secondary_text_template
        .replace('{temperature}', tempStr)
        .replace('{humidity}', humStr);
    }

    return '';
  }

  private get _presenceActive(): boolean {
    const mainEnt = this._config.entity || this._resolvedEntities.mainLightOrSwitch;
    if (mainEnt && this.hass?.states[mainEnt]) {
      return isActive(this.hass.states[mainEnt]);
    }
    return false;
  }

  // Action Mappings
  private _handleTap(ev: UIEvent) {
    if (this._hasFeatureInPath(ev)) return;
    handleAction(this, this.hass, this._config, 'tap');
  }

  private _handleHold(ev: Event) {
    if (this._hasFeatureInPath(ev)) return;
    ev.preventDefault();
    handleAction(this, this.hass, this._config, 'hold');
  }

  private _handleDoubleTap(ev: UIEvent) {
    if (this._hasFeatureInPath(ev)) return;
    handleAction(this, this.hass, this._config, 'double_tap');
  }

  private _hasFeatureInPath(ev: Event): boolean {
    const path = ev.composedPath();
    return path.some(
      (el: any) =>
        el.tagName === 'HUI-CARD-FEATURES' ||
        (el.classList &&
          (el.classList.contains('mrc-features-side') ||
            el.classList.contains('mrc-features-bottom') ||
            el.classList.contains('mrc-features-grid')))
    );
  }

  // Render individual features with stable context, arrays, unique keys, and stateObj
  private _renderFeatureElements(features: any[]) {
    const defaultEntity = this._config.entity || this._resolvedEntities.mainLightOrSwitch;
    return repeat(
      features,
      (feat, index) =>
        feat?.id
          ? `${feat.id}_${index}`
          : `${feat?.type || 'feat'}_${feat?.entity || feat?.entity_id || ''}_${index}`,
      (feat) => {
        try {
          const data = this._getFeatureData(feat, defaultEntity);
          const targetEntity = data.context.entity_id;
          const stateObj = targetEntity && this.hass?.states ? this.hass.states[targetEntity] : undefined;
          return html`
            <hui-card-features
              .hass=${this.hass}
              .stateObj=${stateObj}
              .context=${data.context}
              .color=${this._config.color}
              .features=${data.features}
            ></hui-card-features>
          `;
        } catch (err) {
          console.error('[material-room-card] Feature render error:', err);
          return html``;
        }
      }
    );
  }

  // Rendering
  protected render() {
    if (!this.hass || !this._config) return html``;

    const layout = this._config.feature_layout || 'side';
    const features = this._config.features || [];
    const hasFeatures = features.length > 0;

    return html`
      <ha-card
        class="${this._resolvedStyleType}"
        @click=${this._handleTap}
        @contextmenu=${this._handleHold}
        @dblclick=${this._handleDoubleTap}
      >
        <div class="mrc-content">
          <div class="mrc-header">
            <div class="mrc-room-info">
              ${this._config.show_icon
                ? html`
                    <div class="mrc-icon-wrap ${this._presenceActive ? 'active' : ''}">
                      <ha-icon .icon=${this._areaIcon}></ha-icon>
                      ${this._presenceActive
                        ? html`
                            <div class="mrc-presence">
                              <ha-icon icon="mdi:account"></ha-icon>
                            </div>
                          `
                        : ''}
                      ${this._windowActive
                        ? html`
                            <div class="mrc-window-badge">
                              <ha-icon icon="mdi:window-open-variant"></ha-icon>
                            </div>
                          `
                        : ''}
                    </div>
                  `
                : ''}
              <div class="mrc-text">
                <div class="mrc-name">${this._areaName}</div>
                ${this._config.show_secondary_text && this._secondaryText
                  ? html`<div class="mrc-sub">${this._secondaryText}</div>`
                  : ''}
              </div>
            </div>

            <!-- Features or Status on the side -->
            ${hasFeatures && layout === 'side'
              ? html`
                  <div class="mrc-header-side-wrap">
                    <div class="mrc-features-side">
                      ${this._renderFeatureElements(features)}
                    </div>
                  </div>
                `
              : ''}
          </div>
        </div>

        <!-- Features stacked vertically -->
        ${hasFeatures && layout === 'bottom'
          ? html`
              <div class="mrc-features-bottom">
                ${this._renderFeatureElements(features)}
              </div>
            `
          : ''}

        <!-- Features in a Grid -->
        ${hasFeatures && layout === 'grid'
          ? html`
              <div
                class="mrc-features-grid"
                style="--grid-columns: ${this._config.feature_grid_columns || 2}"
              >
                ${this._renderFeatureElements(features)}
              </div>
            `
          : ''}
      </ha-card>
    `;
  }

  // Home Assistant Card API
  public getCardSize(): number {
    const hasFeatures = this._config?.features && this._config.features.length > 0;
    return hasFeatures ? 3 : 2;
  }

  public static getConfigElement() {
    return document.createElement('material-room-card-editor');
  }

  public static getStubConfig(hass: HomeAssistant): Record<string, any> {
    // Attempt to grab the first available area as stub default
    let firstAreaId = '';
    let firstAreaName = 'Bedroom';
    let firstAreaIcon = 'mdi:bed';

    if (hass && hass.areas && Object.keys(hass.areas).length > 0) {
      const firstArea = Object.values(hass.areas)[0];
      firstAreaId = firstArea.area_id;
      firstAreaName = firstArea.name;
      firstAreaIcon = firstArea.icon || 'mdi:home';
    }

    return {
      type: 'custom:material-room-card',
      area: firstAreaId || 'bedroom',
      title: firstAreaName,
      icon: firstAreaIcon,
      show_icon: true,
      show_secondary_text: true,
      feature_layout: 'side',
      style_type: 'filled',
      features: [],
    };
  }
}

// Register custom card details for Home Assistant preview listing
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'material-room-card',
  name: 'Material Room Card',
  preview: true,
  description: 'A premium Material You card for Home Assistant representing a Room or Area.',
});

console.info(
  `%c MATERIAL-ROOM-CARD %c v2.2.2 `,
  'color: white; background: #4c5c92; font-weight: 700;',
  'color: #4c5c92; background: white; font-weight: 700;'
);

