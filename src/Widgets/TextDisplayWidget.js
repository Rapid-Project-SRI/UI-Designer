import React, { useState, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '../Components/ItemTypes';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useSocketData } from '../hooks/useSocketData';

/**
 * MUI Text Input Widget (Consumer)
 * Props: 
 * - text (string): Default text
 * - variant (string): MUI variant
 * - _id (string): Unique identifier
 * - name (string): Component name
 * - isTemplate (boolean): Whether this is a template or instance
 * - instanceId (string): Unique identifier for the instance
 */
const TextDisplayWidget = ({
  text = 'Text',
  variant = 'outlined',
  _id,
  name,
  isTemplate = true,
  instanceId
}) => {
  const [value, setValue] = useState(text);
  const [topic, setTopic] = useState('');
  const { data, publish } = useSocketData(topic);

  useEffect(() => {
    if (data && data.datasets && data.datasets[0] && data.datasets[0].data[0] !== undefined) {
      setValue(data.datasets[0].data[0].toString());
    }
  }, [data]);

  const [{ isDragging }, drag] = useDrag({
    item: {
      type: ItemTypes.WIDGET,
      id: _id,
      name: name || text,
      isTemplate: true, // Only templates can be dragged
      componentType: 'TextDisplayWidget'
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const handleChange = (event) => {
    const newValue = event.target.value;
    setValue(newValue);

    // If there's a topic specified and this is not a template, publish the value
    if (topic) {
      console.log("🚀 ~ :55 ~ handleChange ~ topic:", topic)
      const numericValue = parseFloat(newValue);
      if (!isNaN(numericValue)) {
        publish(numericValue);
        console.log(`Published to topic ${topic}:`, numericValue);
      }
    }

    console.log('Input changed:', {
      value: newValue,
      previousValue: value,
      _id,
      instanceId,
      name,
      event: event.type
    });
  };

  const handleTopicChange = (event) => {
    const newTopic = event.target.value;
    setTopic(newTopic);
    console.log('Topic changed:', {
      topic: newTopic,
      instanceId,
      event: event.type
    });
  };

  const component = (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <TextField
        variant={variant}
        value={value}
        onChange={handleChange}
        fullWidth
        disabled={false}
        type="number"
        inputProps={{ step: "5" }}
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

  if (isTemplate) {
    return (
      <div ref={drag} style={{ margin: 10, opacity: isDragging ? 0.5 : 1 }}>
        {component}
      </div>
    );
  }

  // For instances, just render the component without drag functionality
  return (
    <div style={{ margin: 10 }}>
      {component}
    </div>
  );
};

export default TextDisplayWidget;