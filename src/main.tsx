import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './components/router/AppRouter';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Failed to find the root element with id 'root'");
}

const root = ReactDOM.createRoot(rootElement);

// The root.render method is where the application is attached to the DOM.
// By wrapping AppRouter with AuthProvider, we make the authentication state
// (like the current user and loading status) available to all routes and components.
root.render(
  <React.StrictMode>
    <AppProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </AppProvider>
  </React.StrictMode>
);
