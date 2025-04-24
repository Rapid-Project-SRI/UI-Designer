import React from 'react'
import { useDrag } from 'react-dnd';
import {ItemTypes} from '../Components/ItemTypes'
import { BarChart } from '@mui/x-charts/BarChart';

const BarWidget=(props)=>{
    const { chartData, name, _id } = props;
    
    const dataset = [
        {key: 'Jan', value: chartData.datasets[0].data},
        {key: 'Feb', value: 59},
        {key: 'Mar', value: 80},
        {key: 'Apr', value: 81},
        {key: 'May', value: 56},
        {key: 'Jun', value: 55},
        {key: 'Jul', value: 40}
    ];

    const xAxisProperties = [{ scaleType: 'band', dataKey: 'key'}];
    const seriesProperties = [{ dataKey: 'value', label: 'Value' }];
    
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

    console.log(chartData)

    if (!chartData || !chartData.datasets || chartData.datasets.length === 0) {
        return <p>Loading chart data...</p>;
    }
    
    return(
        <div ref={drag} style={{ margin: 10, opacity: isDragging ? 0.5 : 1 }}>
            <BarChart 
                dataset={dataset}
                xAxis={xAxisProperties}
                series={seriesProperties}
                width={300}
                height={200}
                tooltip={{trigger: 'none'}}
            />
        </div>
    )
}

export default BarWidget;