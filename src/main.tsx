import React from 'react';
import ReactDOM from 'react-dom/client';
import NewApp from './NewApp';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Failed to find the root element with id 'root'");
}

const root = ReactDOM.createRoot(rootElement);

// The root.render method is where the application is attached to the DOM.
// By using the App component, we ensure the navigation layout is properly rendered
// (like the current user and loading status) available to all routes and components.
root.render(
  <React.StrictMode>
    <NewApp />
  </React.StrictMode>
);
