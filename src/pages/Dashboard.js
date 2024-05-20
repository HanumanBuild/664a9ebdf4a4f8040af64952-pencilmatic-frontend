import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import axios from 'axios';

const Dashboard = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current);

    // Load existing drawings
    const loadDrawings = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_PENCILMATIC_BACKEND_URL}/api/drawings`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        res.data.forEach((drawing) => {
          canvas.loadFromJSON(drawing.data);
        });
      } catch (error) {
        console.error(error);
      }
    };

    loadDrawings();

    // Save drawing
    const saveDrawing = async () => {
      try {
        const data = JSON.stringify(canvas.toJSON());
        await axios.post(`${process.env.REACT_APP_PENCILMATIC_BACKEND_URL}/api/drawings`, { data }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
      } catch (error) {
        console.error(error);
      }
    };

    // Save drawing every 5 minutes
    const interval = setInterval(saveDrawing, 300000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6">Pencilmatic</h2>
        <canvas ref={canvasRef} width="800" height="600" className="border border-gray-300"></canvas>
      </div>
    </div>
  );
};

export default Dashboard;