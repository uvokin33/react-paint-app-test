import React from 'react';
import './style.scss';

const Footer = () => (
    <footer className="app-footer">
        <h3>Commands</h3>
        <p><b>[C w h]</b> - Create a canvas</p>
        <p><b>[L x1 y1 x2 y2]</b> - Draw a line</p>
        <p><b>[R x1 y1 x2 y2]</b> - Draw a rectangle</p>
        <p><b>[B x1 x2 c]</b> - Fill area with character 'c'</p>
    </footer>
);

export default Footer;