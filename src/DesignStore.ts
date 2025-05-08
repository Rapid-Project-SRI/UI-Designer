import { makeAutoObservable } from 'mobx';

export interface CanvasRect {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface Widget {
    id: string;
    name: string;
    x: number;
    y: number;
    color?: string;
    font?: string;
    selectedNode?: string | null;
}

export class DesignStore {
    canvas: CanvasRect | null = null;
    widgets: Widget[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    setCanvas(rect: CanvasRect) {
        this.canvas = rect;
    }

    addWidget(widget: Widget) {
        this.widgets.push(widget);
    }

    updateWidgetPosition(id: string, x: number, y: number) {
        const w = this.widgets.find(w => w.id === id);
        if (w) {
            w.x = x;
            w.y = y;
        }
    }

    updateWidgetStyle(id: string, changes: Partial<Widget>) {
        const w = this.widgets.find(w => w.id === id);
        if (w) {
            Object.assign(w, changes);
        }
    }

    loadDesign(designData: { canvas?: CanvasRect | null; widgets?: Widget[] }) {
        this.canvas = designData.canvas || null;
        this.widgets = designData.widgets || [];
    }

    get designData(): { canvas: CanvasRect | null; widgets: Widget[]} {
        return {
            canvas: this.canvas,
            widgets: [...this.widgets]
        };
    }
}

export const designStore = new DesignStore();