import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import MainLayout from './components/layout/MainLayout';
import AppRouter from './components/router/AppRouter';
import './components/chart-styles.css';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainLayout>
          <AppRouter />
        </MainLayout>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;