import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, MaterialRoomCardConfig } from './types';
import { fireEvent, getFeaturesStateObj, resolveArea, resolveAreaEntities } from './helpers';

@customElement('material-room-card-editor')
export class MaterialRoomCardEditor extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  
  @state() private _config!: MaterialRoomCardConfig;
  @state() private _featuresEditorLoaded = false;

  static get styles() {
    return css`
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
  public setConfig(config: MaterialRoomCardConfig): void {
    this._config = {
      show_icon: true,
      show_secondary_text: true,
      feature_layout: 'side',
      feature_grid_columns: 2,
      secondary_text_source: 'combined',
      ...config,
    };
  }

  private get _resolvedArea() {
    return resolveArea(this.hass, this._config);
  }

  private get _resolvedAreaEntities() {
    const area = this._resolvedArea;
    return area ? resolveAreaEntities(this.hass, area.area_id) : {};
  }

  protected firstUpdated(changedProperties: PropertyValues): void {
    super.firstUpdated(changedProperties);
    this._loadFeaturesEditor();
  }

  private async _loadFeaturesEditor() {
    if (!customElements.get('hui-card-features-editor')) {
      if ((window as any).loadCardHelpers) {
        try {
          const helpers = await (window as any).loadCardHelpers();
          const tile = await helpers.createCardElement({ type: 'tile', entity: 'light.dummy' });
          if (tile && tile.constructor && (tile.constructor as any).getConfigElement) {
            (tile.constructor as any).getConfigElement();
          }
        } catch (_) {
          // Ignore
        }
      }
      // Poll a few times for the features editor to register
      for (let i = 0; i < 40 && !customElements.get('hui-card-features-editor'); i++) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
    this._featuresEditorLoaded = !!customElements.get('hui-card-features-editor');
    if (this._featuresEditorLoaded) {
      this._patchFeaturesEditor();
    }
    this.requestUpdate();
  }

  private _patchFeaturesEditor() {
    const cls = customElements.get('hui-card-features-editor') as any;
    if (cls && !cls.__patchedForMaterialRoomCard) {
      cls.__patchedForMaterialRoomCard = true;

      const isMaterialRoomCardEditor = (el: HTMLElement) => {
        let parent: any = el;
        while (parent) {
          if (parent.tagName === 'MATERIAL-ROOM-CARD-EDITOR') {
            return true;
          }
          parent = parent.parentNode || parent.host;
        }
        return false;
      };

      const originalSupports = cls.prototype._supportsFeatureType;
      cls.prototype._supportsFeatureType = function(type: string) {
        if (isMaterialRoomCardEditor(this)) {
          return true;
        }
        return originalSupports.call(this, type);
      };

      const ALL_FEATURE_TYPES = [
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
        "water-heater-operation-modes",
      ];

      const originalGetSupported = cls.prototype._getSupportedFeaturesType;
      cls.prototype._getSupportedFeaturesType = function() {
        if (isMaterialRoomCardEditor(this)) {
          const customFeatures = ((window as any).customCardFeatures || []).map(
            (f: any) => `custom:${f.type}`
          );
          return ALL_FEATURE_TYPES.concat(customFeatures);
        }
        return originalGetSupported.call(this);
      };
    }
  }

  private _editDetailElement(ev: CustomEvent): void {
    ev.stopPropagation();
    const index = ev.detail.subElementConfig.index;
    const config = this._config.features![index!];
    
    // Create a feature context.
    const featureEntity = config.entity || this._config.entity || 'light.dummy';
    const featureContext = { entity_id: featureEntity };

    fireEvent(this, "edit-sub-element", {
      config: config,
      saveConfig: (newConfig: any) => this._updateFeature(index!, newConfig),
      context: featureContext,
      type: "feature",
    });
  }

  private _updateFeature(index: number, feature: any) {
    const features = (this._config.features || []).concat();
    features[index] = feature;
    this._config = {
      ...this._config,
      features,
    };
    fireEvent(this, "config-changed", { config: this._config });
  }

  // Handle value-changed from HA forms
  private _handleFormChanged(ev: CustomEvent, section: string) {
    ev.stopPropagation();
    if (!this._config) return;

    const value = ev.detail.value;
    const newConfig = {
      ...this._config,
      ...value,
    };

    // Ensure features are not wiped by form data
    newConfig.features = this._config.features || [];

    const oldAreaId = this._config.area_id || this._config.area;
    const newAreaId = newConfig.area_id || newConfig.area;

    if (newAreaId && newAreaId !== oldAreaId) {
      const area = resolveArea(this.hass, { area_id: newAreaId } as any);
      if (area) {
        newConfig.title = area.name || newConfig.title;
        if (area.icon) {
          newConfig.icon = area.icon;
        }
        const resolved = resolveAreaEntities(this.hass, area.area_id);
        if (resolved.temperature) {
          newConfig.temperature_entity = resolved.temperature;
        }
        if (resolved.humidity) {
          newConfig.humidity_entity = resolved.humidity;
        }
        if (resolved.window) {
          newConfig.window_entity = resolved.window;
        }
        if (resolved.mainLightOrSwitch) {
          newConfig.entity = resolved.mainLightOrSwitch;
        }
      }
    }

    this._config = newConfig;
    fireEvent(this, 'config-changed', { config: newConfig });
  }

  // Handle features-changed from HA features editor
  private _handleFeaturesChanged(ev: any) {
    ev.stopPropagation();
    let newFeatures: any[] | undefined;
    
    if (ev.detail && ev.detail.value !== undefined) {
      newFeatures = ev.detail.value;
    } else if (ev.detail && ev.detail.features !== undefined) {
      newFeatures = ev.detail.features;
    } else if (ev.detail && ev.detail.config && ev.detail.config.features !== undefined) {
      newFeatures = ev.detail.config.features;
    }

    if (newFeatures && Array.isArray(newFeatures)) {
      this._config = {
        ...this._config,
        features: newFeatures,
      };
      fireEvent(this, 'config-changed', { config: this._config });
    }
  }

  private _computeLabel = (schema: any): string => {
    return schema.label || schema.name;
  };

  protected render() {
    if (!this.hass || !this._config) return html``;

    const resolved = this._resolvedAreaEntities;

    // Create a copy of hass and inject a dummy light entity with color and brightness features enabled.
    // This tricks the HA card-features editor into showing the configuration panel.
    const dummyEntityId = 'light.dummy';
    const hassCopy = {
      ...this.hass,
      states: {
        ...this.hass.states,
        [dummyEntityId]: {
          entity_id: dummyEntityId,
          state: 'off',
          attributes: {
            friendly_name: 'Room Control Context',
            supported_features: 63, // Enable all light features
            color_modes: ['brightness', 'hs', 'color_temp'],
            supported_color_modes: ['brightness', 'hs', 'color_temp'],
          },
          last_changed: '',
          last_updated: '',
        }
      }
    };

    // Schemas for forms
    const configSchema = [
      { name: 'area_id', label: 'Select Room / Area', selector: { area: {} } },
      { name: 'title', label: 'Room Name Override', selector: { text: {} } },
      { name: 'icon', label: 'Room Icon Override', selector: { icon: {} } },
      {
        name: 'style_type',
        label: 'Card Style Preset',
        selector: {
          select: {
            mode: 'dropdown',
            options: [
              { value: 'filled', label: 'Filled' },
              { value: 'elevated', label: 'Elevated' },
              { value: 'transparent', label: 'Transparent' },
              { value: 'outlined', label: 'Outlined' },
              { value: 'translucent', label: 'Translucent' },
            ],
          },
        },
      },
    ];

    const contentSchema = [
      { name: 'temperature_entity', label: 'Temperature Sensor Override', placeholder: resolved.temperature || 'Auto-resolved', selector: { entity: { domain: 'sensor' } } },
      { name: 'humidity_entity', label: 'Humidity Sensor Override', placeholder: resolved.humidity || 'Auto-resolved', selector: { entity: { domain: 'sensor' } } },
      { name: 'window_entity', label: 'Window Sensor Override (Window open/closed)', placeholder: resolved.window || 'Auto-resolved', selector: { entity: { domain: 'binary_sensor' } } },
      { name: 'entity', label: 'Presence Sensor / Main Light Override', selector: { entity: {} } },
      {
        name: 'secondary_text_source',
        label: 'Secondary Text Source',
        selector: {
          select: {
            mode: 'dropdown',
            options: [
              { value: 'combined', label: 'Temperature & Humidity Combined' },
              { value: 'temperature', label: 'Temperature State' },
              { value: 'humidity', label: 'Humidity State' },
              { value: 'custom', label: 'Custom Template String' },
              { value: 'hidden', label: 'Hidden / None' },
            ],
          },
        },
      },
      ...(this._config.secondary_text_source === 'custom'
        ? [
            {
              name: 'secondary_text_template',
              label: 'Secondary Text Template (use {temperature} and {humidity})',
              selector: { text: {} },
            },
          ]
        : []),
      { name: 'show_icon', label: 'Show Room Icon', selector: { boolean: {} } },
      { name: 'show_secondary_text', label: 'Show Secondary Text', selector: { boolean: {} } },
    ];

    const interactionsSchema = [
      { name: 'tap_action', label: 'Tap Action', selector: { ui_action: { default_action: 'more-info' } } },
      { name: 'hold_action', label: 'Hold Action', selector: { ui_action: {} } },
      { name: 'double_tap_action', label: 'Double Tap Action', selector: { ui_action: {} } },
    ];

    const featuresLayoutSchema = [
      {
        name: 'feature_layout',
        label: 'Features Layout Position',
        selector: {
          select: {
            mode: 'dropdown',
            options: [
              { value: 'side', label: 'Side (horizontal, in header)' },
              { value: 'bottom', label: 'Bottom (vertical stack)' },
              { value: 'grid', label: 'Grid (configurable columns)' },
            ],
          },
        },
      },
      ...(this._config.feature_layout === 'grid'
        ? [{ name: 'feature_grid_columns', label: 'Grid Columns Count', selector: { number: { min: 1, max: 4, mode: 'box' } } }]
        : []),
    ];

    return html`
      <div class="editor-container">
        <!-- Section: Configuration -->
        <details class="editor-section" open>
          <summary>Configuration</summary>
          <div class="section-content">
            <ha-form
              .hass=${this.hass}
              .data=${this._config}
              .schema=${configSchema}
              .computeLabel=${this._computeLabel}
              @value-changed=${(e: CustomEvent) => this._handleFormChanged(e, 'config')}
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
              .schema=${contentSchema}
              .computeLabel=${this._computeLabel}
              @value-changed=${(e: CustomEvent) => this._handleFormChanged(e, 'content')}
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
              .schema=${interactionsSchema}
              .computeLabel=${this._computeLabel}
              @value-changed=${(e: CustomEvent) => this._handleFormChanged(e, 'interactions')}
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
              .schema=${featuresLayoutSchema}
              .computeLabel=${this._computeLabel}
              @value-changed=${(e: CustomEvent) => this._handleFormChanged(e, 'features-layout')}
            ></ha-form>
          </div>

          <!-- Feature management component -->
          <div class="features-container">
            <div class="features-header">Manage Feature Buttons</div>
            ${this._featuresEditorLoaded
              ? html`
                  <hui-card-features-editor
                    .hass=${hassCopy}
                    .stateObj=${hassCopy.states[dummyEntityId]}
                    .context=${{ entity_id: dummyEntityId }}
                    .features=${this._config.features || []}
                    @value-changed=${this._handleFeaturesChanged}
                    @features-changed=${this._handleFeaturesChanged}
                    @config-changed=${this._handleFeaturesChanged}
                    @edit-detail-element=${this._editDetailElement}
                  ></hui-card-features-editor>
                `
              : html`<div class="error-msg">Loading Home Assistant Feature Editor...</div>`}
          </div>
        </details>
      </div>
    `;
  }
}
