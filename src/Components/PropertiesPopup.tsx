import React from 'react';
import '../styles/PropertiesPopup.css';
import CustomWidget from './CustomWidget';
import { observer } from 'mobx-react-lite';
import { designStore } from '../storage/DesignStore';

interface PropertiesPopupProps {
    title: string;
}

/*
 * PropertiesPopup displays a popup for editing the properties of the selected widget.
 * Wraps the CustomWidget component and provides a header with the widget type/title.
 *
 * @param {PropertiesPopupProps} props - The popup title to display.
 * @returns {JSX.Element} The rendered properties popup.
 */
const PropertiesPopup: React.FC<PropertiesPopupProps> = observer(({ title }) => {
    return (
        <div
            className="properties-popup"
            style={{ maxHeight: '400px', height: 'auto' }}
        >
            <div className="properties-popup-header">
                <h3>{title} Properties</h3>
            </div>
            <div className="properties-popup-content">
                {/* Renders the widget customization UI */}
                <CustomWidget/>
            </div>
        </div>
    );
});

export default PropertiesPopup;