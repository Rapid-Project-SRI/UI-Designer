import React from 'react';
import '../styles/PropertiesPopup.css'; // Or your new CSS
import { designStore } from '../storage/DesignStore';
import CustomWidget from './CustomWidget';

interface WidgetEditPopupProps {
  position: { x: number; y: number };
  onClose: () => void;
}

const WidgetEditPopup: React.FC<WidgetEditPopupProps> = ({ position, onClose }) => {
  const selectedWidget = designStore.widgets.find(w => designStore.selectedWidgetIds.includes(w.id));
  if (!selectedWidget) return null;

  return (
    <div
      className="properties-popup"
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        zIndex: 1000,
        maxHeight: 400,
        height: 'auto',
      }}
    >
      <div className="properties-popup-header">
        <h3>Customize</h3>
        <button className="properties-popup-close-button" onClick={onClose}>×</button>
      </div>
      <div className="properties-popup-content">
        <CustomWidget selectedWidget={selectedWidget} />
      </div>
    </div>
  );
};

export default WidgetEditPopup;