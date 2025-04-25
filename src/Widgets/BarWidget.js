import React from 'react'
import { useDrag } from 'react-dnd';
import {ItemTypes} from '../Components/ItemTypes'
import { BarChart } from '@mui/x-charts/BarChart';

const BarWidget=(props)=>{
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

    const dataset = [
        {key: 'Jan', value: chartData.datasets[0].data[0]},
        {key: 'Feb', value: chartData.datasets[0].data[1]},
        {key: 'Mar', value: chartData.datasets[0].data[2]},
        {key: 'Apr', value: chartData.datasets[0].data[3]},
        {key: 'May', value: chartData.datasets[0].data[4]},
        {key: 'Jun', value: chartData.datasets[0].data[5]},
        {key: 'Jul', value: chartData.datasets[0].data[6]}
    ];

    const xAxisProperties = [{ scaleType: 'band', dataKey: 'key'}];
    const seriesProperties = [{ dataKey: 'value', label: 'Value' }];
    
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