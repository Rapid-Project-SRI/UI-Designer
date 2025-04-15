import React, { useState, useRef, useEffect } from 'react'
import { useDrop } from 'react-dnd'
import LineChart from '../Charts/LineChart'
import BarChart from '../Charts/BarChart'
import PieChart from '../Charts/PieChart'
import { ItemTypes } from './ItemTypes'
import WidgetPanel from './WidgetPanel'
import Moveable from 'react-moveable'
import Selecto from 'react-selecto'
import './Content.css'

const Content = (props) => {
  const [widgets, setWidgets] = useState([])
  const [selectedWidgetIds, setSelectedWidgetIds] = useState([])
  const [selectedWidget, setSelectedWidget] = useState(null)
  const canvasRef = useRef(null)

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.WIDGET,
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset()
      const canvas = canvasRef.current
      const canvasRect = canvas.getBoundingClientRect()

      const newWidget = {
        id: `${item.id}-${Date.now()}`,
        name: item.name,
        x: offset.x - canvasRect.left,
        y: offset.y - canvasRect.top,
        width: 200,
        height: 150
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

  const handleWidgetClick = (e, widget) => {
    e.stopPropagation()
    setSelectedWidget(widget)
    setSelectedWidgetIds([widget.id])
  }

  const handleCanvasClick = () => {
    setSelectedWidget(null)
    setSelectedWidgetIds([])
  }

  const updateWidgetPosition = (id, x, y) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, x, y } : w))
    )
  }

  const updateWidgetSize = (id, width, height) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, width, height } : w))
    )
  }

  return (
    <div style={{ display: 'flex' }}>
      <div
        id="canvas"
        ref={(node) => {
          canvasRef.current = node
          drop(node)
        }}
        onClick={handleCanvasClick}
        style={{
          width: '100%',
          height: '800px',
          border: '2px dashed #ccc',
          position: 'relative',
          flex: 1,
          background: isOver ? '#f0f8ff' : 'white',
          overflow: 'hidden'
        }}
      >
        {widgets.map((widget) => (
          <div
            key={widget.id}
            id={`widget-${widget.id}`}
            className={`draggable-widget ${selectedWidgetIds.includes(widget.id) ? 'selected' : ''}`}
            style={{
              position: 'absolute',
              top: widget.y,
              left: widget.x,
              width: widget.width,
              height: widget.height,
              border: selectedWidgetIds.includes(widget.id) ? '2px solid #00f' : 'none'
            }}
            onClick={(e) => handleWidgetClick(e, widget)}
          >
            {widget.name === 'Line' ? (
              <LineChart />
            ) : widget.name === 'Bar' ? (
              <BarChart />
            ) : (
              <PieChart />
            )}
          </div>
        ))}

        <Moveable
          target={selectedWidgetIds.map(id => document.getElementById(`widget-${id}`)).filter(Boolean)}
          draggable
          resizable
          onDrag={({ target, left, top }) => {
            const id = target.id.replace('widget-', '')
            updateWidgetPosition(id, left, top)
          }}
          onResize={({ target, width, height }) => {
            const id = target.id.replace('widget-', '')
            updateWidgetSize(id, width, height)
          }}
          keepRatio={false}
          throttleDrag={0}
          throttleResize={0}
        />

        <Selecto
          container={canvasRef.current}
          selectableTargets={[".draggable-widget"]}
          hitRate={0}
          selectByClick
          selectFromInside
          toggleContinueSelect={['shift']}
          onSelect={({ selected }) => {
            const ids = selected.map((el) => el.id.replace('widget-', ''))
            setSelectedWidgetIds(ids)
            const widget = widgets.find(w => w.id === ids[0])
            setSelectedWidget(widget || null)
          }}
        />
      </div>

      {selectedWidget && <WidgetPanel onClose={() => setSelectedWidget(null)} />}
    </div>
  )
}

export default Content
