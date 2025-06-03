import React, { useState, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import '../styles/CustomWidget.css';
import { designStore, Widget } from '../storage/DesignStore';
import { observer } from 'mobx-react-lite';

 /*
 * CustomWidget provides UI for customizing the currently selected widget's properties.
 * Allows editing of label, font, color, and size, and supports widget deletion.
 *
 * @returns {JSX.Element | null} The rendered customizer, or null if no widget is selected.
 */
const CustomWidget: React.FC = observer(() => {
  // Find the currently selected widget
  const selectedWidget = designStore.widgets.find(w => designStore.selectedWidgetIds.includes(w.id));

  // State for dropdowns and widget property editing
  const [isColorOpen, setIsColorOpen] = useState(false);
  const [isFontOpen, setIsFontOpen] = useState(false);
  // sizeInput is used for the size input field, but is not always applied to the widget unless 'Apply' is clicked
  const [sizeInput, setSizeInput] = useState(selectedWidget?.style.width || 80);
  const [widgetProps, setWidgetProps] = useState<Widget | null>(selectedWidget || null);

  // Keep widgetProps in sync with the selected widget
  useEffect(() => {
    if (!selectedWidget) {
      setWidgetProps(null);
    } else {
      setWidgetProps(selectedWidget);
    }
  }, [selectedWidget]);

  // If no widget is selected, render nothing
  if (!selectedWidget) {
    return null;
  }

  /*
   * Toggles the color picker dropdown.
   * @return {void}
   */
  const toggleColorDropdown = () => {
    setIsColorOpen(!isColorOpen);
    if (isFontOpen) setIsFontOpen(false);
  };

  /*
   * Toggles the font picker dropdown.
   * @return {void}
   */
  const toggleFontDropdown = () => {
    setIsFontOpen(!isFontOpen);
    if (isColorOpen) setIsColorOpen(false);
  };

  /*
   * Handles color change from the color picker.
   * @param {string} color - The new color value.
   * @return {void}
   */
  const handleColorChange = (color: string) => {
    if (!widgetProps) return;
    const editedWidget: Widget = {
      ...widgetProps, 
      style: {
        ...widgetProps.style,
        color: color
      }
    }
    setWidgetProps(editedWidget);
  };

  /*
   * Handles font selection from the dropdown.
   * @param {string} font - The selected font.
   * @return {void}
   */
  const handleFontSelect = (font: string) => {
    if (!widgetProps) return;
    setIsFontOpen(false);
    const editedWidget: Widget = {
      ...widgetProps, 
      style: {
        ...widgetProps.style,
        font: font
      }
    }
    setWidgetProps(editedWidget);
  };

  // List of available font options
  const fontOptions = ['Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana'];

  /*
   * Applies the current widgetProps to the selected widget in the design store.
   * @return {void}
   */
  const handleApply = () => {
    if (selectedWidget && widgetProps) {
      // Only width is updated from sizeInput; height is not handled here
      designStore.updateWidget(selectedWidget.id, {
        ...widgetProps,
        style: {
          ...widgetProps.style,
          width: sizeInput
        }
      });
    }
  }

  /*
   * Handles label text change for the widget.
   * @param {string} newLabel - The new label value.
   * @return {void}
   */
  const handleLabelChange = (newLabel: string) => {
    if (!widgetProps) return;
    const editedWidget: Widget = {
      ...widgetProps, 
      label: newLabel
    }
    setWidgetProps(editedWidget);
  };

  // Check if the selected widget is a StaticImage (color customization is disabled for these)
  const isStaticImage = selectedWidget.type === 'StaticImage';

  return (
    <div className="custom-widget" style={{ overflow: 'visible', maxHeight: 'none' }}>
      {/* Label editing */}
      <div className="property-group">
        <label>Label</label>
        <input
          type="text"
          value={widgetProps?.label || ''}
          onChange={(e) => handleLabelChange(e.target.value)}
          className="label-input"
        />
      </div>

      {/* Font selection */}
      <div className="property-group">
        <label>Font</label>
        <div className="dropdown-toggle" onClick={toggleFontDropdown}>
          {widgetProps?.style.font || 'Select Font'}
          <span className={`arrow ${isFontOpen ? 'up' : 'down'}`}></span>
        </div>
        {isFontOpen && (
          <div className="font-menu">
            {fontOptions.map((font) => (
              <div
                key={font}
                className="font-option"
                style={{ fontFamily: font }}
                onClick={() => handleFontSelect(font)}
              >
                {font}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Color customization is disabled for StaticImage widgets */}
      {!isStaticImage && (
        <div className="property-group">
          <label>Color</label>
          <div className="dropdown-toggle" onClick={toggleColorDropdown}>
            <span className="color-preview" style={{ backgroundColor: widgetProps?.style.color }}></span>
            {widgetProps?.style.color || 'Select Color'}
            <span className={`arrow ${isColorOpen ? 'up' : 'down'}`}></span>
          </div>
          {isColorOpen && (
            <div style={{ padding: 10 }}>
              <HexColorPicker color={widgetProps?.style.color || ''} onChange={handleColorChange} />
              <div className="color-value">{widgetProps?.style.color}</div>
            </div>
          )}
        </div>
      )}

      {/* Size Control */}
      <div className="property-group">
        <label>Size</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="number"
            value={sizeInput}
            onChange={(e) => setSizeInput(Number(e.target.value))}
            placeholder="Size"
            min={10}
            style={{ width: 60 }}
          />
          <button onClick={handleApply} style={{ padding: '2px 8px', fontSize: 12 }}>Apply</button>

           {/* Delete button */}
          <button onClick={() => designStore.deleteWidget(selectedWidget.id)}
            style={{padding: '2px 8px', fontSize: 12}}>Delete</button>
        </div>
      </div>
    </div>
  );
});

export default CustomWidget;