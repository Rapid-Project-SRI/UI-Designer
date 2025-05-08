import React from 'react';
import { Handle, Position } from '@xyflow/react';
import ButtonWidget from '../Widgets/ButtonWidget';
import SwitchWidget from '../Widgets/SwitchWidget';
import GaugeWidget from '../Widgets/GaugeWidget';
import TextDisplayWidget from '../Widgets/TextDisplayWidget';
import LineWidget from '../Widgets/LineWidget';
import BarWidget from '../Widgets/BarWidget';
import PieWidget from '../Widgets/PieWidget';

// Custom node components that wrap our existing widgets
export const CustomNode = ({ data }) => {
    const { type, label, ...props } = data;

    const renderWidget = () => {
        switch (type) {
            case 'Button':
                return <ButtonWidget {...props} />;
            case 'Switch':
                return <SwitchWidget {...props} />;
            case 'Gauge':
                return <GaugeWidget {...props} />;
            case 'TextDisplay':
                return <TextDisplayWidget {...props} />;
            case 'Line':
                return <LineWidget {...props} />;
            case 'Bar':
                return <BarWidget {...props} />;
            case 'Pie':
                return <PieWidget {...props} />;
            default:
                return null;
        }
    };

    return (
        <div className="custom-node">
            <Handle type="target" position={Position.Top} style={{ display: 'none' }} />
            <div className="custom-node-content">
                {renderWidget()}
            </div>
            <Handle type="source" position={Position.Bottom} style={{ display: 'none' }} />
        </div>
    );
};

// Node types configuration for React Flow
export const nodeTypes = {
    custom: CustomNode,
};

// Template definitions for the sidebar
export const nodeTemplates = [
    {
        type: 'Button',
        label: 'Button',
        data: {
            type: 'Button',
            label: 'Button',
            variant: 'contained',
            color: 'primary'
        }
    },
    {
        type: 'Switch',
        label: 'Switch',
        data: {
            type: 'Switch',
            label: 'Switch',
            checked: false
        }
    },
    {
        type: 'Gauge',
        label: 'Gauge',
        data: {
            type: 'Gauge',
            value: 50,
            label: 'Gauge',
            min: 0,
            max: 100
        }
    },
    {
        type: 'TextDisplay',
        label: 'Text Display',
        data: {
            type: 'TextDisplay',
            text: 'Text',
            variant: 'body1'
        }
    },
    {
        type: 'Line',
        label: 'Line Chart',
        data: {
            type: 'Line',
            chartData: {
                datasets: [{ data: [5, 10, 8, 12, 7, 9, 11] }]
            }
        }
    },
    {
        type: 'Bar',
        label: 'Bar Chart',
        data: {
            type: 'Bar',
            chartData: {
                datasets: [{ data: [12, 19, 3, 5, 2, 3, 7] }]
            }
        }
    },
    {
        type: 'Pie',
        label: 'Pie Chart',
        data: {
            type: 'Pie'
        }
    }
]; 