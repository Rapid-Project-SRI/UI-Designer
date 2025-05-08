import React, { useState } from 'react';
import { nodeTemplates } from '../nodes/CustomNodes';
import { Box, Typography } from '@mui/material';
import './Sidebar.css';

interface NodeTemplate {
    type: string;
    label: string;
    data: {
        type: string;
        label?: string;
        variant?: string;
        color?: string;
        checked?: boolean;
        value?: number;
        min?: number;
        max?: number;
        text?: string;
        chartData?: {
            datasets: Array<{ data: number[] }>;
        };
    };
}

const Sidebar: React.FC = () => {
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [dragState, setDragState] = useState<string>('');

    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        console.log('Drag started:', nodeType);
        setDragState('dragging');
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    const onDragEnd = (event: React.DragEvent) => {
        console.log('Drag ended');
        setDragState('');
    };

    const onDragEnter = (event: React.DragEvent) => {
        console.log('Drag entered target');
        event.preventDefault();
    };

    const onDragLeave = (event: React.DragEvent) => {
        console.log('Drag left target');
        event.preventDefault();
    };

    const handleClick = (template: NodeTemplate) => {
        console.log('Clicked template:', template);
        console.log('Template type:', template.type);
        console.log('Template data:', template.data);
        setSelectedItem(template.type);

        // Reset selection after 500ms
        setTimeout(() => {
            setSelectedItem(null);
        }, 500);
    };

    return (
        <Box className="sidebar">
            <Box className="sidebar-header">
                <Typography variant="h6">Widgets</Typography>
            </Box>
            <Box className="sidebar-content">
                {nodeTemplates.map((template: NodeTemplate) => (
                    <Box
                        key={template.type}
                        className={`sidebar-item ${selectedItem === template.type ? 'selected' : ''} ${dragState}`}
                        onDragStart={(event) => onDragStart(event, JSON.stringify(template))}
                        onDragEnd={onDragEnd}
                        onDragEnter={onDragEnter}
                        onDragLeave={onDragLeave}
                        onClick={() => handleClick(template)}
                        draggable
                        sx={{
                            '&:hover': {
                                backgroundColor: 'action.hover',
                            },
                            '&.dragging': {
                                opacity: 0.5,
                                backgroundColor: 'action.selected',
                            },
                        }}
                    >
                        <Typography className="sidebar-item-content">
                            {template.label}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default Sidebar; 