import React from 'react';
import ReactDOM from 'react-dom/client';
import '../../assets/main.css';
import App from './App';
import { TreeProvider } from '@/lib/tree-context';
import { ThemeProvider } from '@/components/theme-provider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="rabbithole-theme">
      <TreeProvider>
        <App />
      </TreeProvider>
    </ThemeProvider>
  </React.StrictMode>,
);

