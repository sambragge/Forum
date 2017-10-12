import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom'
import {render} from 'react-dom';
import App from './app';

import "../style";


const main = (
    <Router>
        <App/>
    </Router>
    );
    
const root = document.getElementById('root');


render(main, root);
