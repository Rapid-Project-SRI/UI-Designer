import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

export const useSocketData = (topic) => {
  const [data, setData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const handleData = (incoming) => {
      //console.log(`Received on topic ${topic}:`, incoming); // DEBUG

      setData({
        labels: ['Warrior Health'],
        datasets: [
          {
            label: topic,
            backgroundColor: 'rgb(7, 154, 39)',
            borderColor: 'rgb(0, 0, 0)',
            borderWidth: 2,
            data: [incoming]
          }
        ]
      });
    };

    socket.on(topic, handleData);
    return () => socket.off(topic, handleData);
  }, [topic]);

  return data;
};
