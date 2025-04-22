import React from 'react'

import BarWidget from '../Widgets/BarWidget';
import LineWidget from '../Widgets/LineWidget';
import PieWidget from '../Widgets/PieWidget';
// MUI widgets
import ButtonWidget from '../Widgets/ButtonWidget';
import TextDisplayWidget from '../Widgets/TextDisplayWidget';
import SwitchWidget from '../Widgets/SwitchWidget';
import GaugeWidget from '../Widgets/GaugeWidget';


const Sidebar=(props)=>{
    // Add new widgets to the list
    const list = [
        { name: "Line", id: 1, type: 'chart' },
        { name: "Bar", id: 2, type: 'chart' },
        { name: "Pie", id: 3, type: 'chart' },
        { name: "Button", id: 4, type: 'producer' },
        { name: "TextDisplay", id: 5, type: 'consumer' },
        { name: "Switch", id: 6, type: 'producer' },
        { name: "Gauge", id: 7, type: 'consumer' }
    ];
    return(
    <div style={{backgroundColor:"#EBEBEB",width:300,display:"flex",flexDirection:"column",alignItems:"center"}}>
        <br></br>
        <h3 style={{color:"black",margin:10}}>Widgets</h3>
        {list.map((ele, index) => {
            switch (ele.name) {
                case "Line":
                    return (<LineWidget key={index} name={ele.name} _id={ele.id} />);
                case "Bar":
                    return (<BarWidget key={index} name={ele.name} _id={ele.id} />);
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
        })}

    </div>)
}

export default Sidebar