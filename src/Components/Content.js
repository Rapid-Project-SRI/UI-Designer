import React, { useState } from 'react'
import { useDrop } from 'react-dnd'
import Draggable from 'react-draggable'
import Chart_Line from '../Charts/Chart_Line'
import Chart_Bar from '../Charts/Chart_Bar'
import { ItemTypes } from './ItemTypes'
import WidgetPanel from './WidgetPanel'
import './Content.css'
import Chart_Pie from '../Charts/Chart_Pie'

const Content = (props) => {
  const [widgets, setWidgets] = useState([])
  const [selectedWidget, setSelectedWidget] = useState(null)

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.WIDGET,
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset()
      const canvas = document.getElementById('canvas')
      const canvasRect = canvas.getBoundingClientRect()

      const newWidget = {
        id: `${item.id}-${Date.now()}`,
        name: item.name,
        x: offset.x - canvasRect.left,
        y: offset.y - canvasRect.top
      }

      setWidgets((prev) => {
        props.change([...prev, newWidget])
        return [...prev, newWidget]
      })
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  })

  const handleWidgetClick = (widget) => {
    setSelectedWidget(widget)
  }

  const handleClosePanel = () => {
    setSelectedWidget(null)
  }

  const updateWidgetPosition = (id, x, y) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, x, y } : w))
    )
  }

  return (
    <div style={{ display: 'flex' }}>
      <div
        id="canvas"
        ref={drop}
        style={{
          width: '100%',
          height: '800px',
          border: '2px dashed #ccc',
          position: 'relative',
          flex: 1,
          background: isOver ? '#f0f8ff' : 'white'
        }}
      >
        {widgets.map((widget) => (
          <Draggable
            key={widget.id}
            bounds="parent"
            position={{ x: widget.x, y: widget.y }}
            onStop={(e, data) => updateWidgetPosition(widget.id, data.x, data.y)}
          >
            <div
              onClick={() => handleWidgetClick(widget)}
              style={{ position: 'absolute', cursor: 'move' }}
            >
              {widget.name === 'Line' ? (
                <Chart_Line />
              ) : widget.name === 'Bar' ? (
                <Chart_Bar />
              ) : (
                <Chart_Pie />
              )}
            </div>
          </Draggable>
        ))}
      </div>

      {selectedWidget && <WidgetPanel onClose={handleClosePanel} />}
    </div>
  )
}

export default Content
