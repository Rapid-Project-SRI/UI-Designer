// src/stores/WidgetStore.ts
import { makeAutoObservable } from 'mobx';

export type WidgetType =
  | 'Button'
  | 'Gauge'
  | 'ProgressBar'
  | 'Line'
  | 'Pie'
  | 'Switch'
  | 'TextDisplay'
  | 'TextBox'
  | 'Bar'
  | 'StaticImage';

export interface Widget {
  id: string;
  type: WidgetType;
  label: string;
  position: { x: number; y: number };
  style: {
    color: string;
    font: string;
    width?: number;
    height?: number;
    borderRadius?: number;
  };
  selected?: boolean;
  selectedStreams?: string[];
  imageUrl?: string;
}

/**
 * DesignStore manages the state of all widgets in the UI Designer.
 * Handles widget creation, updates, selection, clipboard, history, and serialization.
 */
export class DesignStore {
  widgets: Widget[] = [];
  selectedWidgetIds: string[] = [];
  nextWidgetId: number = 1;

  clipboard: Widget[] = [];
  history: { widgets: Widget[] }[] = [];
  historyIndex: number = -1;

  placementBounds: { x: number; y: number; width: number; height: number } | null = null;

  /**
   * Initializes the DesignStore and makes it observable with MobX.
   * @return {void}
   */
  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Adds a new widget to the store.
   * @param {Widget} widget - The widget to add.
   * @return {void}
   */
  addWidget(widget: Widget) {
    this.widgets.push(widget);
  }

  /**
   * Deletes a widget by its ID.
   * @param {string} id - The ID of the widget to delete.
   * @return {void}
   */
  deleteWidget(id: string) {
    this.widgets = this.widgets.filter((w) => w.id !== id);
    this.selectedWidgetIds = this.selectedWidgetIds.filter((selectedId) => selectedId !== id);
  }

  /**
   * Sets the selected widgets by their IDs.
   * @param {string[]} ids - Array of widget IDs to select.
   * @return {void}
   */
  setSelectedWidgets(ids: string[]) {
    this.selectedWidgetIds = ids;
    this.widgets.forEach((widget) => {
      widget.selected = ids.includes(widget.id);
    });
  }

  /**
   * Generates a new unique widget ID.
   * @return {string} The generated widget ID.
   */
  generateWidgetId(): string {
    return `widget_${this.nextWidgetId++}`;
  }

  /**
   * Updates a widget by its ID.
   * @param {string} id - The ID of the widget to update.
   * @param {Widget} newWidget - The new widget data.
   * @return {void}
   */
  updateWidget(id: string, newWidget: Widget) {
    const index = this.widgets.findIndex((w) => w.id === id);
    if (index !== -1) {
      this.widgets[index] = newWidget;
    }
  }

  /**
   * Updates the position of a widget.
   * @param {string} id - The widget ID.
   * @param {{ x: number, y: number }} position - The new position.
   * @return {void}
   */
  updateWidgetPosition(id: string, position: { x: number; y: number }) {
    const widget = this.widgets.find((w) => w.id === id);
    if (widget) {
      widget.position = position;
    }
  }

  /**
   * Updates the label of a widget.
   * @param {string} id - The widget ID.
   * @param {string} label - The new label.
   * @return {void}
   */
  updateWidgetLabel(id: string, label: string) {
    const widget = this.widgets.find((w) => w.id === id);
    if (widget) {
      widget.label = label;
    }
  }

  /**
   * Updates the color of a widget.
   * @param {string} id - The widget ID.
   * @param {string} color - The new color.
   * @return {void}
   */
  updateWidgetColor(id: string, color: string) {
    const widget = this.widgets.find((w) => w.id === id);
    if (widget) {
      widget.style.color = color;
    }
  }

  /**
   * Updates the font of a widget.
   * @param {string} id - The widget ID.
   * @param {string} font - The new font.
   * @return {void}
   */
  updateWidgetFont(id: string, font: string) {
    const widget = this.widgets.find((w) => w.id === id);
    if (widget) {
      widget.style.font = font;
    }
  }

  /**
   * Updates the size of a widget.
   * @param {string} id - The widget ID.
   * @param {number} width - The new width.
   * @param {number} height - The new height.
   * @return {void}
   */
  updateWidgetSize(id: string, width: number, height: number) {
    const widget = this.widgets.find((w) => w.id === id);
    if (widget) {
      widget.style.width = width;
      widget.style.height = height;
    }
  }

  /**
   * Updates the border radius (shape) of a widget.
   * @param {string} id - The widget ID.
   * @param {number} borderRadius - The new border radius.
   * @return {void}
   */
  updateWidgetShape(id: string, borderRadius: number) {
    const widget = this.widgets.find((w) => w.id === id);
    if (widget) {
      widget.style.borderRadius = borderRadius;
    }
  }

  /**
   * Updates the image URL of a StaticImage widget.
   * @param {string} id - The widget ID.
   * @param {string} imageUrl - The new image URL.
   * @return {void}
   */
  updateWidgetImage(id: string, imageUrl: string) {
    const widget = this.widgets.find((w) => w.id === id);
    if (widget && widget.type === 'StaticImage') {
      widget.imageUrl = imageUrl;
    }
  }

  /**
   * Copies the currently selected widgets to the clipboard.
   * @return {void}
   */
  copySelectedWidgets() {
    const selectedWidgets = this.widgets.filter((widget) => widget.selected);
    this.clipboard = selectedWidgets.map((widget) => ({ ...widget }));
  }

  /**
   * Pastes widgets from the clipboard, offsetting their position and generating new IDs.
   * @return {void}
   */
  pasteClipboard() {
    if (!this.clipboard.length) return;

    const newWidgets = this.clipboard.map((original) => {
      const newId = this.generateWidgetId();
      return {
        ...original,
        id: newId,
        label: `${original.label}_copy`,
        position: {
          x: original.position.x + 40,
          y: original.position.y + 40
        }
      };
    });

    newWidgets.forEach((w) => this.addWidget(w));
    this.setSelectedWidgets(newWidgets.map((w) => w.id));
    this.saveHistory();
  }

  /**
   * Deletes all currently selected widgets.
   * @return {void}
   */
  deleteSelectedWidgets() {
    const ids = new Set(this.selectedWidgetIds);
    this.widgets = this.widgets.filter((w) => !ids.has(w.id));
    this.setSelectedWidgets([]);
    this.saveHistory();
  }

  /**
   * Saves the current widget state to the history stack for undo/redo.
   * @return {void}
   */
  saveHistory() {
    const snapshot = {
      widgets: JSON.parse(JSON.stringify(this.widgets))
    };
    this.history = this.history.slice(0, this.historyIndex + 1);
    this.history.push(snapshot);
    this.historyIndex++;
  }

  /**
   * Undoes the last widget state change.
   * @return {void}
   */
  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      const snapshot = this.history[this.historyIndex];
      this.widgets = snapshot.widgets;
      this.setSelectedWidgets([]);
    }
  }

  /**
   * Redoes the last undone widget state change.
   * @return {void}
   */
  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      const snapshot = this.history[this.historyIndex];
      this.widgets = snapshot.widgets;
      this.setSelectedWidgets([]);
    }
  }

  /**
   * Serializes the current widget state to a JSON string.
   * @return {string} JSON string of widgets.
   */
  serialize() {
    return JSON.stringify({ widgets: this.widgets });
  }

  /**
   * Hydrates the widget state from a JSON string.
   * @param {string} json - The JSON string to load.
   * @return {void}
   */
  hydrate(json: string) {
    const data = JSON.parse(json);
    this.widgets = data.widgets || [];

    // Update nextWidgetId to avoid ID collisions
    const ids = this.widgets
      .map((w) => parseInt(w.id.split('_')[1]))
      .filter((n) => !isNaN(n));
    const maxId = ids.length ? Math.max(...ids) : 0;
    this.nextWidgetId = maxId + 1;
  }

  /**
   * Updates the selectedStreams property for a widget, toggling the stream.
   * @param {string} id - The widget ID.
   * @param {string} stream - The stream to toggle.
   * @return {void}
   */
  updateWidgetStream(id: string, stream: string) {
    const widget = this.widgets.find((w) => w.id === id);
    if (widget) {
      if (!widget.selectedStreams) {
        widget.selectedStreams = [];
      }
      const index = widget.selectedStreams.indexOf(stream);
      if (index === -1) {
        widget.selectedStreams.push(stream);
      } else {
        widget.selectedStreams.splice(index, 1);
      }
    }
  }


  getPlacementBounds() {
    return this.placementBounds;
  }

  /**
   * Sets the placement bounds for widget placement.
   * @param {{ x: number, y: number, width: number, height: number }} bounds - The bounds to set.
   * @return {void}
   */
  setPlacementBounds(bounds: { x: number; y: number; width: number; height: number }) {
    this.placementBounds = bounds;
  }

  /**
   * Clears the placement bounds.
   * @return {void}
   */
  clearPlacementBounds() {
    this.placementBounds = null;
  }

  /**
   * Checks if a position is within the current placement bounds.
   * @param {{ x: number, y: number }} position - The position to check.
   * @return {boolean} True if within bounds, false otherwise.
   */
  isWithinBounds(position: { x: number; y: number }) {
    const bounds = this.placementBounds;
    if (!bounds) return true;
    return (
      position.x >= bounds.x &&
      position.x <= bounds.x + bounds.width &&
      position.y >= bounds.y &&
      position.y <= bounds.y + bounds.height
    );
  }
}

/**
 * Singleton instance of DesignStore for use throughout the app.
 */
export const designStore = new DesignStore();