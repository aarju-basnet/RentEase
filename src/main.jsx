/**
 * main.jsx - Application Entry Point
 *
 * Renders the root App component into the DOM.
 * Imports global styles for the entire application.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
