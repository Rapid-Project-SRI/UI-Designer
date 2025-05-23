import React, { useState } from 'react';
import { WidgetType } from '../storage/DesignStore';
import { FaChartPie } from "react-icons/fa";
import { FaRegChartBar } from "react-icons/fa";
import { FaChartLine } from "react-icons/fa6";
import { BsTextareaT } from "react-icons/bs";
import { PiTextbox } from "react-icons/pi";
import { RxSwitch } from "react-icons/rx";
import { MdOutlineBattery5Bar } from "react-icons/md";

import WidgetLibrarySection from './WidgetLibarySection';
import { WidgetCard } from './WidgetCard';


function WidgetPalette() {
  // When dragging starts, store the widget type in the dataTransfer object.
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, widgetType: WidgetType) => {
    event.dataTransfer.setData('application/reactflow', widgetType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className='p-2 flex flex-col min-w-full bg-primary gap-2 h-full overflow-y-auto'>
      <h2 className='font-bold'>Widget Libary</h2>
    
      <WidgetLibrarySection title="Pie Chart">
        <div onDragStart={(event) => onDragStart(event, 'Pie')} draggable>
          <WidgetCard header="Pie Widget">
            <FaChartPie size="100" color='var(--color-primary)' className=' w-full'/>
          </WidgetCard>
        </div>
      </WidgetLibrarySection>

      <WidgetLibrarySection title="Bar Chart">
        <div draggable onDragStart={(event) => onDragStart(event, 'Bar')}>
          <WidgetCard header="Bar Widget">
            <FaRegChartBar size="100" color='var(--color-primary)' className=' w-full'/>
          </WidgetCard>
        </div>
        <div draggable onDragStart={(event) => onDragStart(event, 'ProgressBar')}>
          <WidgetCard header="Progress Bar Widget">
            <MdOutlineBattery5Bar size="100" color='var(--color-primary)' className=' w-full'/>
          </WidgetCard>
        </div>
      </WidgetLibrarySection>

      <WidgetLibrarySection title="Line Graphs">
        <div draggable onDragStart={(event) => onDragStart(event, 'Line')}>
          <WidgetCard header="Line Chart">
            <FaChartLine size="100" color='var(--color-primary)' className=' w-full'/>
          </WidgetCard>
        </div>
      </WidgetLibrarySection>

      <WidgetLibrarySection title="Buttons">
        <div draggable onDragStart={(event) => onDragStart(event, 'Button')}>
          <WidgetCard header="Button Widget">
            Button Widget
          </WidgetCard>
        </div>
      </WidgetLibrarySection>

      <WidgetLibrarySection title="Gauges">
        <div draggable onDragStart={(event) => onDragStart(event, 'Gauge')}>
          <WidgetCard header="Gauge Widget">
            Gauge Widget
          </WidgetCard>
        </div>
      </WidgetLibrarySection>

      <WidgetLibrarySection title="Textboxes">
        <div draggable onDragStart={(event) => onDragStart(event, 'TextDisplay')}>
          <WidgetCard header="Text Display Widget">
            <PiTextbox size="100" color='var(--color-primary)' className=' w-full'/>
          </WidgetCard>
        </div>
        <div draggable onDragStart={(event) => onDragStart(event, 'TextBox')}>
          <WidgetCard header="Text Box Widget">
            <BsTextareaT size="100" color='var(--color-primary)' className=' w-full'/>          
          </WidgetCard>
        </div>
      </WidgetLibrarySection>

      <WidgetLibrarySection title="Switches">
        <div draggable onDragStart={(event) => onDragStart(event, 'Switch')}>
          <WidgetCard header="Switch Widget">
            <RxSwitch size="100" color='var(--color-primary)' className=' w-full'/>
          </WidgetCard>
        </div>
      </WidgetLibrarySection>

      <WidgetLibrarySection title="Images">
        <div draggable onDragStart={(event) => onDragStart(event, 'StaticImage')}>
          <WidgetCard header="Static Image Widget">
            Static Image Widget
          </WidgetCard>
        </div>
      </WidgetLibrarySection>
    </div>
  );
}

export default WidgetPalette;
