import React, { useState } from 'react';
import Canvas from './components/Canvas';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.scss';

function App() {
  const [canvas, setCanvas] = useState({ 
    width: 0, 
    height: 0 
  });

  const totalCanvasSize = canvas.width * canvas.height;
  const isCanvasCreated = !!totalCanvasSize;

  return (
    <div className="app">
      <Header canvas={canvas} setCanvas={setCanvas} isCanvasCreated={isCanvasCreated} />
      <Canvas canvas={canvas} totalCanvasSize={totalCanvasSize} />
      <Footer />
    </div>
  );
}

export default App;
