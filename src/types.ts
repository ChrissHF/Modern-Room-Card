export interface ActionConfig {
  action: string;
  navigation_path?: string;
  url_path?: string;
  service?: string;
  target?: any;
  data?: any;
}

export interface MaterialRoomCardConfig {
  type: string;
  area?: string;
  area_id?: string;
  title?: string;
  name?: string; // fallback or legacy
  icon?: string;
  navigation_path?: string;
  temperature_entity?: string;
  humidity_entity?: string;
  window_entity?: string;
  entity?: string;
  secondary_text_source?: 'temperature' | 'humidity' | 'combined' | 'custom' | 'hidden';
  secondary_text_template?: string;
  show_icon?: boolean;
  show_secondary_text?: boolean;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
  feature_layout?: 'side' | 'bottom' | 'grid';
  feature_grid_columns?: number;
  style_type?: 'filled' | 'elevated' | 'transparent' | 'outlined' | 'translucent';
  features?: any[];
  card_mod?: any;
}

export interface AreaRegistryEntry {
  area_id: string;
  name: string;
  picture?: string | null;
  icon?: string | null;
}

export interface EntityRegistryEntry {
  entity_id: string;
  area_id?: string | null;
  device_id?: string | null;
  platform?: string;
  device_class?: string;
  unit_of_measurement?: string;
}

export interface DeviceRegistryEntry {
  id: string;
  area_id?: string | null;
  name?: string;
}

export interface HassState {
  entity_id: string;
  state: string;
  attributes: {
    friendly_name?: string;
    unit_of_measurement?: string;
    device_class?: string;
    icon?: string;
    [key: string]: any;
  };
  last_changed: string;
  last_updated: string;
}

export interface HomeAssistant {
  states: { [entity_id: string]: HassState };
  areas: { [area_id: string]: AreaRegistryEntry };
  entities: { [entity_id: string]: EntityRegistryEntry };
  devices: { [device_id: string]: DeviceRegistryEntry };
  language: string;
  themes: any;
  localize: (key: string, ...args: any[]) => string;
  callService: (
    domain: string,
    service: string,
    serviceData?: Record<string, any>,
    target?: Record<string, any>
  ) => Promise<any>;
}
