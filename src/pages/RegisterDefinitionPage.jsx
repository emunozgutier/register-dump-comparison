import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Plus, Trash2, Save, X, Edit2, Settings, Zap } from 'lucide-react';
import { Card, Button, Form, Table, InputGroup, Row, Col } from 'react-bootstrap';

const RegisterDefinitionPage = () => {
    const { registerDefinitions, addDefinition, updateDefinition, deleteDefinition, setRegisterDefinitions } = useAppStore();

    // Generator State
    const [genConfig, setGenConfig] = useState({
        startAddress: '0x0',
        numRegisters: 10,
        wordSize: 4,
        lsbZero: true // "Option for 0 lsb"
    });

    // Manual Edit State
    const [isEditing, setIsEditing] = useState(null);
    const [formData, setFormData] = useState({ address: '', name: '', description: '' });

    const handleGenChange = (e) => {
        const { name, value, type, checked } = e.target;
        setGenConfig({
            ...genConfig,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const generateMap = () => {
        const count = parseInt(genConfig.numRegisters) || 0;
        const step = parseInt(genConfig.wordSize) || 4;
        let addr = parseInt(genConfig.startAddress, 16);
        if (isNaN(addr)) addr = 0;

        const newDefs = [];
        for (let i = 0; i < count; i++) {
            const currentAddr = '0x' + addr.toString(16).toUpperCase();
            newDefs.push({
                address: currentAddr,
                name: `REG_${i}`,
                description: genConfig.lsbZero ? 'LSB 0 Mode' : ''
            });
            addr += step;
        }

        // Replace existing or append? "Table will pop up" implies creating a new map.
        // I'll replace for clarity, or ask user? I'll replace.
        if (window.confirm("This will overwrite existing definitions. Continue?")) {
            setRegisterDefinitions(newDefs);
        }
    };

    // ... (Manual handlers kept for individual edits)
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleUpdate = (index) => {
        updateDefinition(index, formData);
        setIsEditing(null);
        setFormData({ address: '', name: '', description: '' });
    };

    const startEdit = (index, def) => {
        setIsEditing(index);
        setFormData(def);
    };

    const cancelEdit = () => {
        setIsEditing(null);
        setFormData({ address: '', name: '', description: '' });
    };

    return (
        <Card className="h-100 bg-[#161b22] border-[#30363d] text-[#c9d1d9] shadow-sm">
            <Card.Header className="bg-[#0d1117] border-bottom border-[#30363d] py-3">
                <h5 className="mb-0 text-white font-semibold flex items-center gap-2">
                    <Settings size={18} /> Register Map Configuration
                </h5>
            </Card.Header>
            <Card.Body className="d-flex flex-column p-3">
                {/* Generator Controls */}
                <div className="mb-4 bg-[#0d1117] p-3 rounded border border-[#30363d]">
                    <Row className="g-2 items-end">
                        <Col md={3}>
                            <Form.Label className="small text-gray-400">Start Addr</Form.Label>
                            <Form.Control
                                size="sm"
                                name="startAddress"
                                value={genConfig.startAddress}
                                onChange={handleGenChange}
                                className="bg-[#161b22] border-[#30363d] text-white font-mono"
                            />
                        </Col>
                        <Col md={3}>
                            <Form.Label className="small text-gray-400"># Registers</Form.Label>
                            <Form.Control
                                size="sm"
                                type="number"
                                name="numRegisters"
                                value={genConfig.numRegisters}
                                onChange={handleGenChange}
                                className="bg-[#161b22] border-[#30363d] text-white"
                            />
                        </Col>
                        <Col md={2}>
                            <Form.Label className="small text-gray-400">Word Size</Form.Label>
                            <Form.Control
                                size="sm"
                                type="number"
                                name="wordSize"
                                value={genConfig.wordSize}
                                onChange={handleGenChange}
                                className="bg-[#161b22] border-[#30363d] text-white"
                            />
                        </Col>
                        <Col md={2}>
                            <Form.Check
                                type="checkbox"
                                label="0 LSB"
                                name="lsbZero"
                                checked={genConfig.lsbZero}
                                onChange={handleGenChange}
                                className="small text-gray-400 pt-3"
                            />
                        </Col>
                        <Col md={2}>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={generateMap}
                                className="w-100 flex items-center justify-center gap-1"
                            >
                                <Zap size={14} /> Gen
                            </Button>
                        </Col>
                    </Row>
                </div>

                {/* Edit Form (Hidden unless editing) */}
                {isEditing !== null && (
                    <div className="mb-3 p-2 border border-blue-500/30 rounded bg-blue-900/10">
                        <div className="flex gap-2 mb-2">
                            <Form.Control size="sm" name="address" value={formData.address} onChange={handleInputChange} placeholder="Addr" className="bg-[#161b22] text-white border-0" />
                            <Form.Control size="sm" name="name" value={formData.name} onChange={handleInputChange} placeholder="Name" className="bg-[#161b22] text-white border-0" />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button size="sm" variant="secondary" onClick={cancelEdit}>Cancel</Button>
                            <Button size="sm" variant="success" onClick={() => handleUpdate(isEditing)}>Update</Button>
                        </div>
                    </div>
                )}

                {/* Table List */}
                <div className="flex-grow-1 overflow-auto" style={{ minHeight: '300px' }}>
                    <Table hover variant="dark" size="sm" className="mb-0 custom-table">
                        <thead className="sticky-top bg-[#161b22]">
                            <tr>
                                <th className="font-light text-gray-400">Addr</th>
                                <th className="font-light text-gray-400">Name</th>
                                {/* <th className="font-light text-gray-400">Desc</th> */}
                                <th className="text-end font-light text-gray-400">Act</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registerDefinitions.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="text-center text-gray-500 py-4">
                                        Configure and click 'Gen' to create map.
                                    </td>
                                </tr>
                            ) : (
                                registerDefinitions.map((def, idx) => (
                                    <tr key={idx}>
                                        <td className="font-mono text-blue-400 small align-middle">{def.address}</td>
                                        <td className="font-mono text-white small align-middle">
                                            <div className="d-flex justify-content-between">
                                                <span>{def.name}</span>
                                                {/* Show simple marker for LSB 0 if relevant, or just keep it simple */}
                                            </div>
                                        </td>
                                        <td className="text-end align-middle">
                                            <div className="d-flex justify-content-end gap-1">
                                                <Button variant="link" className="p-0 text-gray-400 hover:text-blue-400" onClick={() => startEdit(idx, def)}>
                                                    <Edit2 size={14} />
                                                </Button>
                                                <Button variant="link" className="p-0 text-gray-400 hover:text-red-400" onClick={() => deleteDefinition(idx)}>
                                                    <Trash2 size={14} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </div>
            </Card.Body>
        </Card>
    );
};

export default RegisterDefinitionPage;
