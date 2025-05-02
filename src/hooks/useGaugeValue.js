import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

export const useGaugeValue = (topic = 'output_node_8') => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const handle = (val) => {
      console.log(`Received from ${topic}:`, val);
      setValue(val);
    };
    socket.on(topic, handle);
    return () => socket.off(topic, handle);
  }, [topic]);

  return value;
};
