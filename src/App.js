import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJs, Title, Tooltip, LineElement, Legend, CategoryScale, LinearScale, PointElement } from 'chart.js';
import "./App.css"
ChartJs.register(Title, Tooltip, LineElement, Legend, CategoryScale, LinearScale, PointElement);

const NoiseTracker = () => {
  const [noiseLevel, setNoiseLevel] = useState(0);

  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Noise Data',
        data: [],
        backgroundColor: '#73A9AD',
        borderColor: '#B3C890',
        pointStyle: 'none',
      },
    ],
    options: {
      scales: {
        y: {
          grid: {
            display: false
          }
        }
      }
    }
  });

  useEffect(() => {
    let darr = [];
    let larr = [];
    let c = " ";
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        // Set up the analyzer
        const analyser = audioContext.createAnalyser();
        source.connect(analyser);
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray =new Uint8Array(bufferLength);

        // Update noise level and chart data every 100ms
        const updateNoiseLevel = () => {
          analyser.getByteFrequencyData(dataArray);
          const sum = dataArray.reduce((acc, val) => acc + val);
          const avg = sum / bufferLength;
          setNoiseLevel(avg);
          darr.push(avg);
          larr.push(c);
          setData({
            labels: larr,
            datasets: [
              {
                label: 'Noise Data',
                data: darr,
                backgroundColor: '#73A9AD',
                borderColor: '#B3C890',
                pointRadius:0
              },
            ],
            options: {
              scales: {
                y: {
                  grid: {
                    display: false
                  }
                },
                x: {
                  grid: {
                    display: false
                  }
                }
              },
              plugins: {
                legend: {
                  display: false
                },
                tooltip: {
                  enabled: false
                }
              }
            }
          });
        };
        setInterval(updateNoiseLevel, 100);
      });

  }, []);

  return (
    <div className="container">
      <h1 className="title">SoundSense</h1>
      <div className="chart-container">
        <Line data={data} options={data.options} />
      </div>
      <h2 className="noise-level">Noise Level: {noiseLevel.toFixed(2)}</h2>
    </div>
 );
};

export default NoiseTracker;