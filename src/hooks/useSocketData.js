import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

/*
 * useSocketData is a custom React hook for subscribing to real-time data from a socket.io server.
 * It listens for updates on a given topic and formats the data for chart components.
 *
 * @param {string} topic - The socket.io topic/event name to subscribe to.
 * @returns {object} Chart.js-compatible data object with labels and datasets.
 */
export const useSocketData = (topic) => {
  // State for chart data
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
    // Subscribe to the topic on mount, and clean up on unmount or topic change
    socket.on(topic, handleData);
    return () => socket.off(topic, handleData);
  }, [topic]);

  return data;
};