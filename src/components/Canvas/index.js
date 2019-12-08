import React, { useLayoutEffect, useState } from 'react';
import { GRID_SIZE } from '../../constants';
import { range } from '../../utils/utils';
import './style.scss';

const Canvas = ({ canvas, totalCanvasSize }) => {
    const content = [];
    const contentStyle = {};
    // eslint-disable-next-line
    const [size, setSize] = useState([0, 0]);
    
    useLayoutEffect(() => {
        const updateSize = () => setSize([
            window.innerWidth, 
            window.innerHeight,
        ]);
        window.addEventListener('resize', () => updateSize());
        return window.removeEventListener('resize', () => updateSize());
    }, []);
    
    if (totalCanvasSize) {
        range(1, totalCanvasSize + 1).map(value => content.push(
            <div id={value} key={value} className={`canvas-item canvas-item-${value}`} />
        ));
        contentStyle.gridTemplateColumns = `repeat(${canvas.width}, ${GRID_SIZE}px)`;
        contentStyle.gridTemplateRows = `repeat(${canvas.height}, ${GRID_SIZE}px)`;

        const canvasSize = document.getElementById('canvas').getBoundingClientRect();
        if ((canvas.width * GRID_SIZE) > canvasSize.width) {
            contentStyle.justifyContent = 'flex-start';
        }
    }

    return (
        <div className="app-canvas">
            <div id="canvas" className="canvas-content" style={contentStyle}> 
                {content}
            </div>
        </div>
    );
};

export default Canvas;