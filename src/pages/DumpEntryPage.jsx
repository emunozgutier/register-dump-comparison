import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Upload, Save, FileText, AlertCircle, Trash2 } from 'lucide-react';
import { Card, Button, Form, Badge, ListGroup } from 'react-bootstrap';

const DumpEntryPage = () => {
    const { addDump, dumps, removeDump } = useAppStore();
    const [dumpName, setDumpName] = useState('');
    const [dumpContent, setDumpContent] = useState('');
    const [error, setError] = useState('');

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            setDumpContent(event.target.result);
            if (!dumpName) {
                setDumpName(file.name.replace(/\.[^/.]+$/, ""));
            }
        };
        reader.readAsText(file);
    };

    const parseDump = (content) => {
        const lines = content.split('\n');
        const data = {};
        let parseCount = 0;

        lines.forEach(line => {
            const cleanLine = line.split(/[#;]/)[0].trim();
            if (!cleanLine) return;
            const parts = cleanLine.split(/[\s=,:]+/);
            if (parts.length >= 2) {
                const key = parts[0];
                const value = parts[1];
                data[key] = value;
                parseCount++;
            }
        });
        return { data, count: parseCount };
    };

    const handleSave = () => {
        setError('');
        if (!dumpName.trim()) {
            setError('Name required.');
            return;
        }
        if (!dumpContent.trim()) {
            setError('Content required.');
            return;
        }

        const { data, count } = parseDump(dumpContent);

        if (count === 0) {
            setError('No valid registers found.');
            return;
        }

        const newDump = {
            id: Date.now().toString(),
            name: dumpName,
            timestamp: Date.now(),
            content: dumpContent,
            parsedData: data
        };

        addDump(newDump);
        setDumpName('');
        setDumpContent('');
    };

    return (
        <Card className="h-100 bg-[#161b22] border-[#30363d] text-[#c9d1d9] shadow-sm">
            <Card.Header className="bg-[#0d1117] border-bottom border-[#30363d] py-3">
                <h5 className="mb-0 text-white font-semibold">Dump Entry</h5>
                <small className="text-gray-500">Import dumps</small>
            </Card.Header>
            <Card.Body className="d-flex flex-column p-3">
                {/* Input Section */}
                <div className="mb-4">
                    <Form.Group className="mb-2">
                        <Form.Control
                            size="sm"
                            type="text"
                            placeholder="Dump Name (e.g. Working)"
                            value={dumpName}
                            onChange={(e) => setDumpName(e.target.value)}
                            className="bg-[#0d1117] border-[#30363d] text-white placeholder-gray-600"
                        />
                    </Form.Group>

                    <div className="mb-2 d-flex justify-content-end">
                        <Form.Label htmlFor="file-upload" className="btn btn-sm btn-outline-primary mb-0 d-flex align-items-center gap-1 cursor-pointer">
                            <Upload size={14} /> Upload
                        </Form.Label>
                        <Form.Control
                            id="file-upload"
                            type="file"
                            className="d-none"
                            onChange={handleFileUpload}
                        />
                    </div>

                    <Form.Control
                        as="textarea"
                        rows={6}
                        placeholder="0x1000 0xFF..."
                        value={dumpContent}
                        onChange={(e) => setDumpContent(e.target.value)}
                        className="bg-[#0d1117] border-[#30363d] text-white font-mono small mb-2 placeholder-gray-600"
                        style={{ resize: 'none' }}
                    />

                    {error && (
                        <div className="text-danger small mb-2 d-flex align-items-center gap-1">
                            <AlertCircle size={14} /> {error}
                        </div>
                    )}

                    <Button variant="success" size="sm" className="w-100 d-flex align-items-center justify-content-center gap-2" onClick={handleSave}>
                        <Save size={14} /> Parse & Save
                    </Button>
                </div>

                <hr className="border-secondary my-2" />

                {/* List */}
                <h6 className="text-gray-500 text-uppercase small font-bold mb-3">Saved Dumps</h6>
                <div className="flex-grow-1 overflow-auto" style={{ maxHeight: '300px' }}>
                    <ListGroup variant="flush">
                        {dumps.length === 0 ? (
                            <div className="text-center text-gray-500 small italic">No dumps saved.</div>
                        ) : (
                            dumps.map((dump) => (
                                <ListGroup.Item key={dump.id} className="bg-[#0d1117] border-[#30363d] text-gray-300 p-2 mb-2 rounded d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center gap-2 overflow-hidden">
                                        <FileText size={16} className="text-emerald-400 flex-shrink-0" />
                                        <div className="text-truncate">
                                            <div className="fw-bold small">{dump.name}</div>
                                            <div className="text-xs text-gray-500">{Object.keys(dump.parsedData).length} regs</div>
                                        </div>
                                    </div>
                                    <Button variant="link" className="text-gray-500 hover:text-danger p-0" onClick={() => removeDump(dump.id)}>
                                        <Trash2 size={14} />
                                    </Button>
                                </ListGroup.Item>
                            ))
                        )}
                    </ListGroup>
                </div>
            </Card.Body>
        </Card>
    );
};

export default DumpEntryPage;
