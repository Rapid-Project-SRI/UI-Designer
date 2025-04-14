import React, { useState } from 'react'
import { ItemTypes } from './ItemTypes'
import { useDrop } from 'react-dnd';
import LineChart from '../Charts/LineChart';
import BarChart from '../Charts/BarChart';
import PieChart from '../Charts/PieChart';
import RGL, { WidthProvider } from "react-grid-layout";
// Import for WidgetPanel
import WidgetPanel from './WidgetPanel';
//  import css -- IMP!!!
import '../../node_modules/react-grid-layout/css/styles.css';
import '../../node_modules/react-resizable/css/styles.css';
import './Content.css'
const ReactGridLayout = WidthProvider(RGL);
const Content = (props) => {
    const [row, setRow] = useState([])
    const [layout, setLayout] = useState([
        { i: 1, x: 0, y: 0, w: 1, h: 1, minH: 1, maxH: 1 },         // *** -- minH & maxH doesnt effect the grid items
        { i: 2, x: 2, y: 0, w: 1, h: 1, minH: 1, maxH: 1 },
        // {i: '3', x: 0, y: 0, w: 1, h: 1, minH: 1, maxH: 1},
        // {i: '4', x: 0, y: 0, w: 1, h: 1, minH: 1, maxH: 1}
    ])
    // This state is responsible to see if the panel is open or closed and to see witch widget did user select
    const [selectedWidget, setSelectedWidget] = useState(null);
    const [resizeplotly, setResizePlotly] = useState(false)
    const onLayoutChange = (layout) => {
        setLayout(layout)
    }

    // when user clicks a widgets, this function will be called
    const handleWidgetClick = (widget) => {
        setSelectedWidget(widget);
    };

    // later WidgetPanel will call this function, to know when the panel has to be closed
    const handleClosePanel = (widget) => {
        setSelectedWidget(null);
    };

    const onResize = (layouts) => {
        console.log(layouts)
        setLayout(layouts)
    };


    const [{ isOver }, drop] = useDrop({
        accept: ItemTypes.WIDGET,
        drop: (item, monitor) => {

            if (row.length < 4) {
                setRow((old) => {
                    props.change([...old, { name: item.name, id: item.id }])
                    return ([...old, { name: item.name, id: item.id }])
                })

            }
            else {
                alert("Maximum 4 items allowed on a row")
            }

        },
        collect: monitor => ({
            isOver: !!monitor.isOver(),
        }),
    });
    return (
        // Flex container is holding gridLayout and the widgetPanel
        <div style={{ display: "flex" }}>
          <div ref={drop} style={{ maxWidth: "100%", height: "auto", flex: 1 }}> 
            <ReactGridLayout
              compactType={"horizontal"}
              cols={4}
              onResize={onResize}
              width={100}
              layout={layout}
              onLayoutChange={onLayoutChange}
              draggableCancel=".MyDragCancel"
              isBounded={true}
            >
              {row.length !== 0 ? row.map((ele, index) => ( // this is conditional rendering, it means if row is empy it will not be renderd
                <div key={index + 1} onClick={() => handleWidgetClick(ele)}> 
                  {ele.name === "Line" ? (                 // but if its not empty, it will create div
                    <LineChart factor={index + 1} />
                  ) : ele.name === "Bar" ? (
                    <BarChart />
                  ) : (
                    <PieChart />
                  )}
                </div>
              )) : <div style={{ height: 200 }}></div>}
            </ReactGridLayout>
          </div>
      
          {/* Another conditional rendering: it will render the panel, if the widget is selected */}
          {selectedWidget && (
            <WidgetPanel onClose={handleClosePanel} />
          )}
        </div>
    );
}

export default Content