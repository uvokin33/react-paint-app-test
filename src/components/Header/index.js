import React, { useState } from 'react';
import {  
    parseFileToObject, 
    saveFile,
    loadFile,
    clearCanvas,
    executeCommand,
} from '../../utils/utils';
import './style.scss';

const Header = ({ canvas: mainCanvas, setCanvas, isCanvasCreated }) => {
    const [contentToSave, setContentToSave] = useState('');
    let canvas = mainCanvas;

    const handleOnGenerate = () => {
        const commands = parseFileToObject(document.getElementById('data-textarea').value);
        if (commands.length) {
            commands.forEach(value => setTimeout(() => 
                canvas = executeCommand(value, canvas, setCanvas, setContentToSave), 0)
            );
        } else {
            canvas = {
                width: 0,
                height: 0,
            };
            setCanvas(canvas);
        }
    }

    const handleOnClickFile = () => {
        document.querySelector('input[type=file]').value = ''
    };

    const buttons = [
        <button key="clear-button" onClick={() => clearCanvas(canvas, setContentToSave)}>
            Clear canvas
        </button>,
        <button key="save-button" onClick={() => saveFile(contentToSave, 'output', 'text/plain')}>
            Save
        </button>,
    ];

    return (
        <header className="app-header">
            <div className="command-content">
                <div className="drop-area">
                    <input type="file" onClick={() => handleOnClickFile()} onChange={() => loadFile()} accept=".txt" />
                </div>
                <div className="command-area" >
                    <textarea cols="25" rows="8" id="data-textarea" />
                    <button onClick={handleOnGenerate}>Generate</button>
                    {isCanvasCreated && buttons}
                </div>
            </div>
            
        </header>
    );
};

export default Header;