import React from 'react';
import './WidgetPanel.css';

const WidgetPanel = ({ onClose }) => {
    return (
        <div className="settings-panel">
            <div className="settings-panel-header">
                <h3>Widget Panel</h3>
                <button onClick={onClose}>Close</button>
            </div>
            <div className="settings-panel-body">
                <p>For now this Panel is enpty.</p>
            </div>
        </div>
    );
};

export default WidgetPanel;