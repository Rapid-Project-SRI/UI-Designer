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

export class DesignStore {
  widgets: Widget[] = [];
  selectedWidgetIds: string[] = [];
  nextWidgetId: number = 1;

  clipboard: Widget[] = [];
  history: { widgets: Widget[] }[] = [];
  historyIndex: number = -1;


  constructor() {
    makeAutoObservable(this);
  }

  addWidget(widget: Widget) {
    this.widgets.push(widget);
  }

  deleteWidget(id: string) {
    this.widgets = this.widgets.filter((w) => w.id !== id);
  }

  setSelectedWidgets(ids: string[]) {
    this.selectedWidgetIds = ids;
    this.widgets.forEach((widget) => {
      widget.selected = ids.includes(widget.id);
    });
  }

  generateWidgetId(): string {
    return `widget_${this.nextWidgetId++}`;
  }

  updateWidgetPosition(id: string, position: { x: number; y: number }) {
    const widget = this.widgets.find((w) => w.id === id);
    if (widget) {
      widget.position = position;
    }
  }

  updateWidgetLabel(id: string, label: string) {
    const widget = this.widgets.find((w) => w.id === id);
    if (widget) {
      widget.label = label;
    }
  }

  updateWidgetColor(id: string, color: string) {
    const widget = this.widgets.find((w) => w.id === id);
    if (widget) {
      widget.style.color = color;
    }
  }

  updateWidgetFont(id: string, font: string) {
    const widget = this.widgets.find((w) => w.id === id);
    if (widget) {
      widget.style.font = font;
    }
  }

  updateWidgetSize(id: string, width: number, height: number) {
    const widget = this.widgets.find((w) => w.id === id);
    if (widget) {
      widget.style.width = width;
      widget.style.height = height;
    }
  }

  updateWidgetShape(id: string, borderRadius: number) {
    const widget = this.widgets.find((w) => w.id === id);
    if (widget) {
      widget.style.borderRadius = borderRadius;
    }
  }

  updateWidgetImage(id: string, imageUrl: string) {
    const widget = this.widgets.find((w) => w.id === id);
    if (widget && widget.type === 'StaticImage') {
      widget.imageUrl = imageUrl;
    }
  }

  copySelectedWidgets() {
    const selectedWidgets = this.widgets.filter((widget) => widget.selected);
    this.clipboard = selectedWidgets.map((widget) => ({ ...widget }));
  }

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

  deleteSelectedWidgets() {
    const ids = new Set(this.selectedWidgetIds);
    this.widgets = this.widgets.filter((w) => !ids.has(w.id));
    this.setSelectedWidgets([]);
    this.saveHistory();
  }

  saveHistory() {
    const snapshot = {
      widgets: JSON.parse(JSON.stringify(this.widgets))
    };
    this.history = this.history.slice(0, this.historyIndex + 1);
    this.history.push(snapshot);
    this.historyIndex++;
  }

  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      const snapshot = this.history[this.historyIndex];
      this.widgets = snapshot.widgets;
      this.setSelectedWidgets([]);
    }
  }

  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      const snapshot = this.history[this.historyIndex];
      this.widgets = snapshot.widgets;
      this.setSelectedWidgets([]);
    }
  }

  serialize() {
    return JSON.stringify({ widgets: this.widgets });
  }

  hydrate(json: string) {
    const data = JSON.parse(json);
    this.widgets = data.widgets || [];

    const ids = this.widgets
      .map((w) => parseInt(w.id.split('_')[1]))
      .filter((n) => !isNaN(n));
    const maxId = ids.length ? Math.max(...ids) : 0;
    this.nextWidgetId = maxId + 1;
  }

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

  placementBounds: { x: number; y: number; width: number; height: number } | null = null;

  getPlacementBounds() {
    return this.placementBounds;
  }

  setPlacementBounds(bounds: { x: number; y: number; width: number; height: number }) {
    this.placementBounds = bounds;
  }
  
  clearPlacementBounds() {
    this.placementBounds = null;
  }

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

export const designStore = new DesignStore();