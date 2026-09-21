import { HomeAssistant, MaterialRoomCardConfig, AreaRegistryEntry, EntityRegistryEntry, HassState } from './types';

// Fire custom events
export function fireEvent(node: HTMLElement, type: string, detail: any = {}, options: any = {}) {
  node.dispatchEvent(
    new CustomEvent(type, {
      bubbles: options.bubbles !== false,
      composed: options.composed !== false,
      detail,
    })
  );
}

// Check if a state is "active" or "on"
export function isActive(stateObj?: HassState): boolean {
  if (!stateObj) return false;
  const state = stateObj.state.toLowerCase();
  return ['on', 'home', 'active', 'open', 'playing', 'above_horizon'].includes(state);
}

// Resolve the area registry entry based on config
export function resolveArea(hass: HomeAssistant, config: MaterialRoomCardConfig): AreaRegistryEntry | null {
  if (!hass || !hass.areas) return null;

  const targetArea = config.area_id || config.area;
  if (!targetArea) return null;

  // 1. Direct match by area_id
  if (hass.areas[targetArea]) {
    return hass.areas[targetArea];
  }

  // 2. Case-insensitive lookup by name or ID
  const lowerTarget = targetArea.toLowerCase();
  const resolved = Object.values(hass.areas).find(
    (a) =>
      (a.area_id && a.area_id.toLowerCase() === lowerTarget) ||
      (a.name && a.name.toLowerCase() === lowerTarget)
  );

  return resolved || null;
}

// Resolve entities inside the specified area
export interface ResolvedAreaEntities {
  temperature?: string;
  humidity?: string;
  window?: string;
  mainLightOrSwitch?: string;
}

export function resolveAreaEntities(hass: HomeAssistant, areaId: string): ResolvedAreaEntities {
  const result: ResolvedAreaEntities = {};
  if (!hass || !hass.entities) return result;

  // Gather all entities in the area
  const areaEntities = Object.values(hass.entities).filter((ent) => {
    if (ent.area_id === areaId) return true;
    if (ent.device_id && hass.devices) {
      const dev = hass.devices[ent.device_id];
      if (dev && dev.area_id === areaId) return true;
    }
    return false;
  });

  // Find temperature sensor
  const tempSensor = areaEntities.find((ent) => {
    const isSensor = ent.entity_id.startsWith('sensor.');
    if (!isSensor) return false;
    
    // Exclude battery sensors
    if (ent.device_class === 'battery') return false;
    if (ent.entity_id.includes('battery') || ent.entity_id.includes('batterie')) return false;
    
    // Check device_class
    if (ent.device_class === 'temperature') return true;

    // Check states attribute for unit
    const stateObj = hass.states[ent.entity_id];
    if (stateObj?.attributes?.unit_of_measurement?.includes('°')) return true;

    // Check entity_id naming
    const parts = ent.entity_id.split('.');
    const namePart = parts[1] ? parts[1].toLowerCase() : '';
    return namePart.includes('temp') || namePart.includes('temperature');
  });
  if (tempSensor) result.temperature = tempSensor.entity_id;

  // Find humidity sensor
  const humSensor = areaEntities.find((ent) => {
    const isSensor = ent.entity_id.startsWith('sensor.');
    if (!isSensor) return false;

    // Exclude battery sensors
    if (ent.device_class === 'battery') return false;
    if (ent.entity_id.includes('battery') || ent.entity_id.includes('batterie')) return false;

    // Check device_class
    if (ent.device_class === 'humidity') return true;

    // Check states attribute for unit
    const stateObj = hass.states[ent.entity_id];
    if (stateObj?.attributes?.unit_of_measurement === '%') return true;

    // Check entity_id naming
    const parts = ent.entity_id.split('.');
    const namePart = parts[1] ? parts[1].toLowerCase() : '';
    return namePart.includes('hum') || namePart.includes('humidity');
  });
  if (humSensor) result.humidity = humSensor.entity_id;

  // Find window binary sensor
  const windowSensor = areaEntities.find((ent) => {
    const isBinarySensor = ent.entity_id.startsWith('binary_sensor.');
    if (!isBinarySensor) return false;

    if (ent.device_class === 'window' || ent.device_class === 'door' || ent.device_class === 'opening') return true;

    const parts = ent.entity_id.split('.');
    const namePart = parts[1] ? parts[1].toLowerCase() : '';
    return namePart.includes('window') || namePart.includes('fenster') || namePart.includes('door') || namePart.includes('tuer') || namePart.includes('opening');
  });
  if (windowSensor) result.window = windowSensor.entity_id;

  // Find main light or switch
  const lightEnt = areaEntities.find((ent) => ent.entity_id.startsWith('light.'));
  if (lightEnt) {
    result.mainLightOrSwitch = lightEnt.entity_id;
  } else {
    const switchEnt = areaEntities.find((ent) => ent.entity_id.startsWith('switch.'));
    if (switchEnt) result.mainLightOrSwitch = switchEnt.entity_id;
  }

  return result;
}

// Get the entity to determine context for features (prioritizing interactive domains like light/switch to prevent editor load errors)
export function getFeaturesStateObj(hass: HomeAssistant, config: MaterialRoomCardConfig): HassState | null {
  if (!hass) return null;

  // 1. Explicitly configured entity
  if (config.entity && hass.states[config.entity]) {
    return hass.states[config.entity];
  }

  // 2. Fallback to resolved area main light/switch
  const area = resolveArea(hass, config);
  if (area) {
    const resolved = resolveAreaEntities(hass, area.area_id);
    if (resolved.mainLightOrSwitch && hass.states[resolved.mainLightOrSwitch]) {
      return hass.states[resolved.mainLightOrSwitch];
    }
  }

  // 3. Fallback to first valid entity in features list
  if (config.features && config.features.length > 0) {
    for (const feat of config.features) {
      const eid = feat?.entity || feat?.entity_id;
      if (eid && hass.states[eid]) {
        return hass.states[eid];
      }
    }
  }

  // 4. Fallback to any light or switch in states list
  const anyLightOrSwitch = Object.keys(hass.states).find(
    (eid) => eid.startsWith('light.') || eid.startsWith('switch.')
  );
  if (anyLightOrSwitch && hass.states[anyLightOrSwitch]) {
    return hass.states[anyLightOrSwitch];
  }

  // 5. Default dummy light state if nothing else matches (ensures editor gets a valid features-supporting domain)
  const dummyId = 'light.dummy';
  return (
    hass.states[dummyId] || {
      entity_id: dummyId,
      state: 'off',
      attributes: { friendly_name: 'Room Light', supported_features: 0 },
      last_changed: '',
      last_updated: '',
    }
  );
}

// Handle action dispatching (tap, hold, double tap)
export function handleAction(
  node: HTMLElement,
  hass: HomeAssistant,
  config: MaterialRoomCardConfig,
  actionType: 'tap' | 'hold' | 'double_tap'
) {
  const actionConfig =
    actionType === 'tap'
      ? config.tap_action
      : actionType === 'hold'
      ? config.hold_action
      : config.double_tap_action;

  // Default tap action is more-info if not explicitly configured
  const finalActionConfig = actionConfig || (actionType === 'tap' ? { action: 'more-info' } : null);
  if (!finalActionConfig) return;

  // Find a target entity context
  const targetEntity = config.entity || config.temperature_entity || config.humidity_entity || '';

  fireEvent(node, 'hass-action', {
    config: {
      entity: targetEntity,
      tap_action: config.tap_action || { action: 'more-info' },
      hold_action: config.hold_action,
      double_tap_action: config.double_tap_action,
    },
    action: actionType,
  });
}
