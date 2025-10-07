import React from 'react';
import ReactDOM from 'react-dom/client';
import {WikipediaViewer} from './wikipedia.js';
import './style.css';
import {TreeProvider} from '@/lib/tree-context';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <TreeProvider>
            <WikipediaViewer/>
        </TreeProvider>
    </React.StrictMode>,
);
