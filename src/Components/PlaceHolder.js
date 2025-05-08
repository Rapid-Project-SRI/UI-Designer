import React, { useState } from 'react';
import Content from './Content';
import Sidebar from './Sidebar';
import { Box, Button, Typography } from '@mui/material';

const PlaceHolder = (props) => {
  const [rowCount, setRowCount] = useState(1);
  const [userData, setUserData] = useState({});

  const changeHandler = (index, data) => {
    setUserData({ ...userData, [index]: [...data] });
  };

  const save = () => {
    // Combine all widgets from all Content components
    const allWidgets = Object.values(userData).flat();

    // Map widgets to include stream in the saved data
    const designData = allWidgets.map((widget) => ({
      ...widget,
      stream: widget.stream || null // Include stream in the saved data
    }));

    const dataStr = JSON.stringify(designData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'ui-design.json';
    a.click();

    URL.revokeObjectURL(url);

    alert('Saved current UI design as JSON.');
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          backgroundColor: 'black',
          minWidth: '100%',
          height: '5%',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          padding: '10px 10px 10px 30px',
          fontWeight: 'bold'
        }}
      >
        UI Designer
      </Box>

      {/* Main Content Area */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        height: '95%',
        overflow: 'hidden'
      }}>
       

        {/* Content Area */}
        <Box sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: 2,
          overflow: 'auto'
        }}>
          {/* Header with Title and Save Button */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2
          }}>
            <Typography variant="h5">My UI Design</Typography>
            <Button
              variant="contained"
              onClick={save}
            >
              DOWNLOAD DESIGN
            </Button>
          </Box>

          {/* Content Rows */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[...Array(rowCount)].map((_, index) => (
              <Box
                key={index}
                sx={{
                  height: '400px', // Fixed height for each content area
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                  overflow: 'hidden'
                }}
              >
                <Content
                  change={(data) => changeHandler(index, data)}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PlaceHolder;