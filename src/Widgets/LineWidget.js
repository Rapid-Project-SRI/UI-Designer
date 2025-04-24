import React from 'react'
import { useDrag } from 'react-dnd';
import {ItemTypes} from '../Components/ItemTypes'
import Line from '../Images/Line.png'
import { LineChart } from '@mui/x-charts/LineChart';
const LineWidget=(props)=>{
    const dataset = [
        { x: 1, y: 2 },
        { x: 2, y: 5.5 },
        { x: 3, y: 2 },
        { x: 5, y: 8.5 },
        { x: 8, y: 1.5 },
        { x: 10, y: 5 },
      ];
    
    const [{ isDragging }, drag] = useDrag({
		item: {
			type: ItemTypes.WIDGET,
            id: props._id,
            name:props.name
		},
		collect: monitor => ({
			isDragging: !!monitor.isDragging(),
		}),
	});
    return(
        <div ref={drag} style={{ margin: 10, opacity: isDragging ? 0.5 : 1 }}>
            <LineChart
                dataset={dataset}
                xAxis={[{ dataKey: 'x' }]}
                series={[{ dataKey: 'y' }]}
                height={200}
                width={300}
                tooltip={{trigger: 'none'}}
            />
        </div>
    )
}

export default LineWidget;