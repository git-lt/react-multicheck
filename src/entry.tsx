import React from 'react'
import ReactDOM from 'react-dom'

import App from './App';
const el = document.createElement('div');
el.setAttribute('id', 'root');
document.body.appendChild(el);

ReactDOM.render(<App/>, el);
