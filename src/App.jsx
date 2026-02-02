import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import RegisterDefinitionPage from './pages/RegisterDefinitionPage';
import DumpEntryPage from './pages/DumpEntryPage';
import ComparisonPage from './pages/ComparisonPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] flex flex-col items-center">
        <div className="w-full max-w-7xl">
          <Navigation />
          <main className="px-6 pb-12 w-full">
            <Routes>
              <Route path="/" element={<RegisterDefinitionPage />} />
              <Route path="/dump-entry" element={<DumpEntryPage />} />
              <Route path="/comparison" element={<ComparisonPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
