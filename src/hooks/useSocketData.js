import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

export const useSocketData = (topic) => {
  const [data, setData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    let handleData;
    if (topic === 'topic_bar_data') {
      // For bar chart: expects 7 values
      handleData = (val1, val2, val3, val4, val5, val6, val7) => {
        setData({
          labels: ['Warrior Health'],
          datasets: [
            {
              label: topic,
              backgroundColor: 'rgb(7, 154, 39)',
              borderColor: 'rgb(0, 0, 0)',
              borderWidth: 2,
              data: [val1, val2, val3, val4, val5, val6, val7]
            }
          ]
        });
      };
    } else if (topic === 'topic_line_data') {
      // For line chart: expects 6 values
      handleData = (val1, val2, val3, val4, val5, val6) => {
        setData({
          labels: ['1', '2', '3', '4', '5', '6'],
          datasets: [
            {
              label: topic,
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 2,
              data: [val1, val2, val3, val4, val5, val6]
            }
          ]
        });
      };
    } else {
      // fallback: just pass all args as data
      handleData = (...vals) => {
        setData({
          labels: vals.map((_, i) => String(i + 1)),
          datasets: [
            {
              label: topic,
              backgroundColor: 'rgba(200,200,200,0.2)',
              borderColor: 'rgba(0,0,0,1)',
              borderWidth: 2,
              data: vals
            }
          ]
        });
      };
    }
    socket.on(topic, handleData);
    return () => socket.off(topic, handleData);
  }, [topic]);

  return data;
};