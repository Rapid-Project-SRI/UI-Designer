import React from 'react'
import { useDrag } from 'react-dnd';
import {ItemTypes} from '../Components/ItemTypes'
//import Line from '../Images/Line.png'
import { LineChart } from '@mui/x-charts/LineChart';
const LineWidget=(props)=>{
    
    const { chartData, name, _id } = props;

    const [{ isDragging }, drag] = useDrag({
		item: {
			type: ItemTypes.WIDGET,
            id: _id,
            name:name
		},
		collect: monitor => ({
			isDragging: !!monitor.isDragging(),
		}),
	});

    if (!chartData || !chartData.datasets || chartData.datasets.length === 0) {
        return <p>Loading chart data...</p>;
    }

    console.log(chartData)

    // Create dataset from chartData.datasets[0].data
    const dataArr = chartData.datasets[0].data;
    const dataset = dataArr.map((y, idx) => ({ x: idx + 1, y }));

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