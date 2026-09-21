import { css } from 'lit';

export const styles = css`
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
