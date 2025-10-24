import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import ActuatorPage from './pages/ActuatorPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/actuator" element={<ActuatorPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;