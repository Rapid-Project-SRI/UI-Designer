import React, { useState, useEffect } from 'react'
import { useDrag } from 'react-dnd';
import { ItemTypes } from '../Components/ItemTypes'
import { LineChart } from '@mui/x-charts/LineChart';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useSocketData } from '../hooks/useSocketData';

const MAX_POINTS = 50; // Fixed capacity for the chart

const LineWidget = (props) => {
    const [topic, setTopic] = useState('');
    const [dataset, setDataset] = useState(() => {
        // Initialize with MAX_POINTS points
        return Array.from({ length: MAX_POINTS }, (_, i) => ({
            x: i + 1,
            y: 0
        }));
    });
    const { data } = useSocketData(topic);

    useEffect(() => {
        if (data && data.datasets && data.datasets[0] && data.datasets[0].data[0] !== undefined) {
            const flowValue = data.datasets[0].data[0];
            console.log('FlowValue received in LineWidget:', flowValue);

            setDataset(prevDataset => {
                // Shift all values left by one position
                const newDataset = prevDataset.slice(1);
                // Add new value at the end
                newDataset.push({
                    x: newDataset[newDataset.length - 1].x + 1,
                    y: flowValue.value
                });
                console.log('Updated dataset:', newDataset);
                return newDataset;
            });
        }
    }, [data]);

    const handleTopicChange = (event) => {
        const newTopic = event.target.value;
        setTopic(newTopic);
        console.log('Topic changed:', {
            topic: newTopic,
            instanceId: props.instanceId,
            event: event.type
        });
    };

    const [{ isDragging }, drag] = useDrag({
        item: {
            type: ItemTypes.WIDGET,
            id: props._id,
            name: props.name,
            isTemplate: true,
            componentType: 'LineWidget'
        },
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    });

    const content = (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            padding: 1,
            border: '1px solid #ccc',
            borderRadius: 1
        }}>
            <LineChart
                dataset={dataset}
                xAxis={[{ dataKey: 'x' }]}
                series={[{ dataKey: 'y' }]}
                height={200}
                width={300}
                tooltip={{ trigger: 'none' }}
            />
            <TextField
                variant="standard"
                value={topic}
                onChange={handleTopicChange}
                placeholder="Enter topic name..."
                size="small"
                sx={{
                    '& .MuiInputBase-input': {
                        color: 'grey.600',
                        fontSize: '0.875rem'
                    }
                }}
                disabled={false}
            />
        </Box>
    );

    if (true) {
        return (
            <div
                ref={drag}
                style={{
                    margin: 10,
                    opacity: isDragging ? 0.5 : 1,
                    cursor: 'move'
                }}
            >
                {content}
            </div>
        );
    }

    return (
        <div style={{ margin: 10 }}>
            {content}
        </div>
    );
}

export default LineWidget;