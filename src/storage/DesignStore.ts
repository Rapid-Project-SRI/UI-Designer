// src/stores/WidgetStore.ts
import { makeAutoObservable } from 'mobx';

// Define the types of widgets
export type WidgetType = 'Button' | 'Gauge' | 'Line' | 'Pie' | 'Switch' | 'TextDisplay' | 'Bar';

// Define the widget interface
export interface Widget {
    id: string;
    type: WidgetType;
    label: string;
    position: { x: number, y: number };
    style: {
        color: string;
        font: string;
    };
    selected?: boolean;
    selectedStream?: string;
}

export class DesignStore {
    widgets: Widget[] = [];
    selectedWidgetIds: string[] = [];
    nextWidgetId: number = 1;

    // Copy, Paste, and Undo Utilities
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
        this.widgets.forEach(widget => {
            widget.selected = ids.includes(widget.id);
        });
    }

    generateWidgetId(): string {
        return `widget_${this.nextWidgetId++}`;
    }

    updateWidgetPosition(id: string, position: { x: number, y: number }) {
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

    copySelectedWidgets() {
        const selectedWidgets = this.widgets.filter(widget => widget.selected);
        this.clipboard = selectedWidgets.map(widget => ({ ...widget }));
    }

    pasteClipboard() {
        if (!this.clipboard.length) return;

        const newWidgets = this.clipboard.map(original => {
            const newId = this.generateWidgetId();
            return {
                ...original,
                id: newId,
                label: `${original.label}_copy`,
                position: {
                    x: original.position.x + 40,
                    y: original.position.y + 40,
                }
            };
        });

        newWidgets.forEach(w => this.addWidget(w));
        this.setSelectedWidgets(newWidgets.map(w => w.id));
        this.saveHistory();
    }

    deleteSelectedWidgets() {
        const ids = new Set(this.selectedWidgetIds);
        this.widgets = this.widgets.filter(w => !ids.has(w.id));
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
        console.log(json)
        const data = JSON.parse(json);
        this.widgets = data.widgets || [];
        console.log(data.widgets)
        console.log(this.widgets)
        // Recalculate the next widget ID to avoid collisions
        const ids = this.widgets.map(w => parseInt(w.id.split('_')[1])).filter(n => !isNaN(n));
        const maxId = ids.length ? Math.max(...ids) : 0;
        this.nextWidgetId = maxId + 1;
    }

    updateWidgetStream(id: string, stream: string) {
        const widget = this.widgets.find((w) => w.id === id);
        if (widget) {
            widget.selectedStream = stream;
        }
    }

    // Add more methods as needed, similar to FlowStore
}

// Export an instance of the store
export const designStore = new DesignStore();