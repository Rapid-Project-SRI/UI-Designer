import React from 'react';
import '../styles/PropertiesPopup.css';
import CustomWidget from './CustomWidget';
import { observer } from 'mobx-react-lite';
import { designStore } from '../storage/DesignStore';

interface PropertiesPopupProps {
    title: string;
}

const PropertiesPopup: React.FC<PropertiesPopupProps> = observer(({ title }) => {
    const selectedWidget = designStore.widgets.find(w => designStore.selectedWidgetIds.includes(w.id));

    if (!selectedWidget) return null;

    return (
        <div
            className="properties-popup"
            style={{ maxHeight: '400px', height: 'auto' }}
        >
            <div className="properties-popup-header">
                <h3>{title} Properties</h3>
            </div>
            <div className="properties-popup-content">
                <CustomWidget
                    selectedWidget={selectedWidget}
                />
            </div>
        </div>
    );
});

export default PropertiesPopup; 