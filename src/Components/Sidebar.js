import React from 'react'

import BarWidget from '../Widgets/BarWidget'
import LineWidget from '../Widgets/LineWidget'
import PieWidget from '../Widgets/PieWidget'


const Sidebar=(props)=>{
    const list=[
        {name:"Line",id:1},
        {name:"Bar",id:2},
        {name:"Pie",id:3}
    ]
    return(
    <div style={{backgroundColor:"#EBEBEB",width:300,display:"flex",flexDirection:"column",alignItems:"center"}}>
        <br></br>
        <h3 style={{color:"black",margin:10}}>Widgets</h3>
        {list.map((ele,index)=>{
            if(ele.name==="Line"){
                return(<LineWidget key={index} name={ele.name} _id={ele.id}></LineWidget>)
            }
            if(ele.name==="Bar"){
                return(<BarWidget key={index} name={ele.name} _id={ele.id}></BarWidget>)
            }
            if(ele.name==="Pie"){
                return(<PieWidget key={index} name={ele.name} _id={ele.id}></PieWidget>)
            }
           
        })}

    </div>)
}

export default Sidebar