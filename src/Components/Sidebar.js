import React from 'react'
import { nodeTemplates } from '../nodes/CustomNodes';
import './Sidebar.css';

const Sidebar = () => {
    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h3>Widgets</h3>
            </div>
            <div className="sidebar-content">
                {nodeTemplates.map((template) => (
                    <div
                        key={template.type}
                        className="sidebar-item"
                        onDragStart={(event) => onDragStart(event, JSON.stringify(template))}
                        draggable
                    >
                        <div className="sidebar-item-content">
                            {template.label}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Sidebar;