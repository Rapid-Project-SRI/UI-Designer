import { designStore } from '../storage/DesignStore';
import { Widget } from '../storage/DesignStore';

/*
 * useWidgetCustomization is a custom hook for extracting and formatting widget customization properties.
 * Provides robust defaults and proportional font sizing for widget rendering.
 *
 * @param {string} widgetId - The ID of the widget to customize.
 * @returns {object} An object containing the widget, style, label, font, width, height, color, and computed fontSize.
 */
export function useWidgetCustomization(widgetId: string) {
  // Find the widget by ID from the design store
  const widget = designStore.widgets.find(w => w.id === widgetId);

  // Extract style properties with defaults for robustness
  const style: Partial<Widget['style']> = widget?.style || {};
  const label = widget?.label || '';
  const font = style.font || 'inherit';
  const width = style.width || 200;
  const height = style.height || 100;
  const color = style.color || '#6CA9AE';

  // Proportional font size based on width (default base is 14px)
  const baseFontSize = 14;
  const fontSize = Math.round(baseFontSize * (width / 80));

  return {
    widget,
    style,
    label,
    font,
    width,
    height,
    color,
    fontSize,
  };
}