import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import ActuatorPage from './pages/ActuatorPage';
import OpenAPISpecPage from './pages/OpenAPISpecPage';
import { ConfigProvider, useConfig } from './contexts/ConfigContext';
import { ConfigDialog } from './components/ConfigDialog';

function AppContent() {
  const { showConfigDialog, setShowConfigDialog, saveConfig, config } = useConfig();

  return (
    <>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/actuator" element={<ActuatorPage />} />
            <Route path="/openapi-spec" element={<OpenAPISpecPage />} />
          </Routes>
        </BrowserRouter>
      </div>

      <ConfigDialog
        isOpen={showConfigDialog}
        onClose={() => setShowConfigDialog(false)}
        onSave={saveConfig}
        initialConfig={config}
      />
    </>
  );
}

function App() {
  return (
    <ConfigProvider>
      <AppContent />
    </ConfigProvider>
  );
}

export default App;
