import React from 'react'
import { useDrag } from 'react-dnd';
import {ItemTypes} from '../Components/ItemTypes'
import { PieChart } from '@mui/x-charts/PieChart';

const PieWidget=(props)=>{
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
            <PieChart
                colors={['red', 'blue', 'yellow']}  
                series={[
                {
                    arcLabel: (item) => `${item.value}%`,
                    data: [
                        { id: 0, value: 10, label: 'Red' },
                        { id: 1, value: 15, label: 'Blue' },
                        { id: 2, value: 20, label: 'Yellow' },
                    ],
                },
            ]}
            width={200}
            height={100}
            tooltip={{trigger: 'none'}}
            />
        </div>
    )
}

export default PieWidget