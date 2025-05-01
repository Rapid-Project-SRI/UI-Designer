import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

export const useSocketData = (topic) => {
  const [data, setData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    console.log("🚀 ~ :7 ~ inuseeffect useSocketData ~ topic:", topic)

    // Notify server about subscription
    if (topic) {
      socket.emit('subscribe', topic);
      console.log(`Subscribed to topic: ${topic}`);
    }

    const handleData = (flowValue) => {
      console.log(`Received FlowValue on topic ${topic}:`, flowValue);
      setData({
        labels: ['Warrior Health'],
        datasets: [
          {
            label: topic,
            backgroundColor: 'rgb(7, 154, 39)',
            borderColor: 'rgb(0, 0, 0)',
            borderWidth: 2,
            data: [flowValue]
          }
        ]
      });
    };

    socket.on(topic, handleData);
    return () => {
      socket.off(topic, handleData);
      if (topic) {
        console.log(`Unsubscribed from topic: ${topic}`);
      }
    };
  }, [topic]);

  const publish = (message) => {
    console.log("🚀 ~ :35 ~ publish ~ message:", message)
    const flowValue = {
      value: parseFloat(message), // Convert to number
      timestamp: new Date().toISOString()
    };
    socket.emit(topic, flowValue);
  };

  return { data, publish };
};