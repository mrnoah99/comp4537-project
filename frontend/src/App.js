import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import PromptGenerator from './pages/PromptGenerator';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Catch-all route for 404 Not Found */}
        <Route path="*" element={<NotFound />} />
        <Route path="/prompt-generator" element={<PromptGenerator />} />
      </Routes>
    </Router>
  );
}

export default App;