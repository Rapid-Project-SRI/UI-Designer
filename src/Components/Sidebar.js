import React from 'react'

import BarWidget from '../Widgets/BarWidget'
import LineWidget from '../Widgets/LineWidget'
import PieWidget from '../Widgets/PieWidget'
import ButtonWidget from '../Widgets/ButtonWidget';
import SwitchWidget from '../Widgets/SwitchWidget';
import GaugeWidget from '../Widgets/GaugeWidget';
import TextDisplayWidget from '../Widgets/TextDisplayWidget';
import { useSocketData } from '../hooks/useSocketData';

const Sidebar = (props) => {
    // Widget definitions
    const list = [
        { name: "Line", id: 1, type: 'chart' },
        { name: "Bar", id: 2, type: 'chart' },
        { name: "Pie", id: 3, type: 'chart' },
        { name: "Button", id: 4, type: 'producer' },
        { name: "TextDisplay", id: 5, type: 'consumer' },
        { name: "Switch", id: 6, type: 'producer' },
        { name: "Gauge", id: 7, type: 'consumer' }
    ];

    const barData = useSocketData('topic_bar_data');
    const lineData = useSocketData('topic_line_data');

    // Group widgets by headings
    const groups = [
        {
            heading: 'Visualization',
            widgets: [list[0], list[1], list[2]] // Bar, Line, Pie
        },
        {
            heading: 'Interactive/Producers',
            widgets: [list[3], list[5]] // Button, Switch
        },
        {
            heading: 'Display/Consumers',
            widgets: [list[4], list[6]] // TextDisplay, Gauge
        }
    ];

    // State for open/close
    const [open, setOpen] = React.useState({ Visualization: false, Interactive: false, Display: false });

    const toggle = (heading) => {
        setOpen((prev) => ({ ...prev, [heading]: !prev[heading] }));
    };

    // Helper to render widgets
    const renderWidget = (ele, index) => {
        switch (ele.name) {
            case "Line":
                return (<LineWidget key={index} name={ele.name} _id={ele.id} chartData={lineData} />);
            case "Bar":
                return (<BarWidget key={index} name={ele.name} _id={ele.id} chartData={barData} />);
            case "Pie":
                return (<PieWidget key={index} name={ele.name} _id={ele.id} />);
            case "Button":
                return (<ButtonWidget key={index} label="Button" _id={ele.id} name={ele.name} />);
            case "TextDisplay":
                return (<TextDisplayWidget key={index} text="Text" _id={ele.id} name={ele.name} />);
            case "Switch":
                return (<SwitchWidget key={index} label="Switch" _id={ele.id} name={ele.name} />);
            case "Gauge":
                return (<GaugeWidget key={index} value={50} label="Gauge" _id={ele.id} name={ele.name} />);
            default:
                return null;
        }
    };

    return (
        <div style={{ backgroundColor: "#EBEBEB", width: 300, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <br />
            <h3 style={{ color: "black", margin: 10 }}>Widgets</h3>
            <div style={{ width: "90%" }}>
                {groups.map((group, i) => (
                    <div key={group.heading} style={{ marginBottom: 10 }}>
                        <div
                            style={{
                                cursor: "pointer",
                                background: "#d3d3d3",
                                padding: "8px 12px",
                                borderRadius: 4,
                                fontWeight: 600,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between"
                            }}
                            onClick={() => toggle(group.heading)}
                        >
                            <span>{group.heading}</span>
                            <span>{open[group.heading] ? "▲" : "▼"}</span>
                        </div>
                        {open[group.heading] && (
                            <div style={{ paddingLeft: 16, paddingTop: 6 }}>
                                {group.widgets.map((ele, idx) => renderWidget(ele, `${group.heading}-${idx}`))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Sidebar;