import { designStore } from '../storage/DesignStore';
import { Widget } from '../storage/DesignStore';

export function useWidgetCustomization(widgetId: string) {
  const widget = designStore.widgets.find(w => w.id === widgetId);

  // Defaults for robustness
  const style: Partial<Widget['style']> = widget?.style || {};
  const label = widget?.label || '';
  const font = style.font || 'inherit';
  const width = style.width || 80;
  const height = style.height || 80;
  const color = style.color || '#1976d2';

  // Proportional font size
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