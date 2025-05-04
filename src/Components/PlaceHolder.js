import React, { useState } from 'react'
import Content from './Content'
import Sidebar from './Sidebar'
import Button from '@mui/material/Button';

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
    <div style={{ height: '100%' }}>
      <div
        style={{
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
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', minHeight: '95%' }}>
        <Sidebar></Sidebar>
        <div style={{ flex: 1, margin: 10 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <h3>My UI Design</h3>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: 200
              }}
            >
              <Button
                variant="contained"
                onClick={save}
              >
                DOWNLOAD DESIGN
              </Button>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {[...Array(rowCount)].map((_, index) => {
              return (
                <div key={index} style={{ marginBottom: 10 }}>
                  <Content
                    change={(data) => {
                      changeHandler(index, data);
                    }}
                  ></Content>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceHolder;