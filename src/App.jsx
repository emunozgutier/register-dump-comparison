import React, { useState } from 'react';
import { Container, Row, Col, Tabs, Tab } from 'react-bootstrap';
import RegisterDefinitionPage from './pages/RegisterDefinitionPage';
import DumpEntryPage from './pages/DumpEntryPage';
import ComparisonPage from './pages/ComparisonPage';
import { Fingerprint, FileInput, Columns } from 'lucide-react';
import './App.css';

function App() {
  const [key, setKey] = useState('data-entry');

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] pb-4">
      {/* Header */}
      <div className="border-b border-gray-800 bg-[#161b22]/90 backdrop-blur-md sticky top-0 z-50 mb-4">
        <Container fluid className="px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600/20 p-2 rounded-lg text-blue-400">
              <Fingerprint size={24} />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">RegCompare</span>
          </div>
        </Container>
      </div>

      <Container fluid className="px-4">
        <Tabs
          id="app-tabs"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="mb-4 border-bottom border-[#30363d] custom-tabs"
        >
          <Tab
            eventKey="data-entry"
            title={<span className="flex items-center gap-2"><FileInput size={16} /> Data Entry</span>}
          >
            <Row>
              {/* Column 1: Definitions */}
              <Col md={6} className="mb-4">
                <RegisterDefinitionPage />
              </Col>

              {/* Column 2: Dump Entry */}
              <Col md={6} className="mb-4">
                <DumpEntryPage />
              </Col>
            </Row>
          </Tab>

          <Tab
            eventKey="comparison"
            title={<span className="flex items-center gap-2"><Columns size={16} /> Comparison</span>}
          >
            <Row>
              <Col className="mb-4">
                <ComparisonPage />
              </Col>
            </Row>
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
}

export default App;
