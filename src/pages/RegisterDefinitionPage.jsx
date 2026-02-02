import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Plus, Trash2, Save, X, Edit2 } from 'lucide-react';
import { Card, Button, Form, Table, InputGroup } from 'react-bootstrap';

const RegisterDefinitionPage = () => {
    const { registerDefinitions, addDefinition, updateDefinition, deleteDefinition } = useAppStore();

    const [isEditing, setIsEditing] = useState(null);
    const [formData, setFormData] = useState({ address: '', name: '', description: '' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAdd = () => {
        if (!formData.address || !formData.name) return;
        let def = { ...formData };
        if (!def.address.startsWith('0x')) {
            def.address = '0x' + def.address;
        }

        addDefinition(def);
        setFormData({ address: '', name: '', description: '' });
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
                <h5 className="mb-0 text-white font-semibold">Register Definitions</h5>
                <small className="text-gray-500">Define your register map</small>
            </Card.Header>
            <Card.Body className="d-flex flex-column p-3">
                {/* Form */}
                <div className="mb-4 bg-[#0d1117] p-3 rounded border border-[#30363d]">
                    <div className="mb-2">
                        <Form.Control
                            size="sm"
                            type="text"
                            name="address"
                            placeholder="Address (0x...)"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="bg-[#161b22] border-[#30363d] text-white mb-2 font-mono placeholder-gray-600"
                        />
                        <Form.Control
                            size="sm"
                            type="text"
                            name="name"
                            placeholder="Name (e.g. CTRL)"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="bg-[#161b22] border-[#30363d] text-white mb-2 font-mono placeholder-gray-600"
                        />
                        <Form.Control
                            size="sm"
                            type="text"
                            name="description"
                            placeholder="Description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="bg-[#161b22] border-[#30363d] text-white placeholder-gray-600"
                        />
                    </div>
                    <div className="d-flex justify-content-end gap-2">
                        {isEditing !== null && (
                            <Button variant="outline-secondary" size="sm" onClick={cancelEdit}>
                                <X size={14} />
                            </Button>
                        )}
                        <Button
                            variant={isEditing !== null ? "primary" : "success"}
                            size="sm"
                            onClick={isEditing !== null ? () => handleUpdate(isEditing) : handleAdd}
                            className="d-flex align-items-center gap-1"
                        >
                            {isEditing !== null ? <Save size={14} /> : <Plus size={14} />}
                            {isEditing !== null ? 'Save' : 'Add'}
                        </Button>
                    </div>
                </div>

                {/* List */}
                <div className="flex-grow-1 overflow-auto" style={{ minHeight: '300px', maxHeight: '600px' }}>
                    <Table hover variant="dark" size="sm" className="mb-0 custom-table">
                        <thead className="sticky-top bg-[#161b22]">
                            <tr>
                                <th className="font-light text-gray-400">Addr</th>
                                <th className="font-light text-gray-400">Name</th>
                                <th className="text-end font-light text-gray-400">Act</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registerDefinitions.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="text-center text-gray-500 py-4">
                                        No definitions.
                                    </td>
                                </tr>
                            ) : (
                                registerDefinitions.map((def, idx) => (
                                    <tr key={idx}>
                                        <td className="font-mono text-blue-400 small align-middle">{def.address}</td>
                                        <td className="font-mono text-white small align-middle" title={def.description}>
                                            <div>{def.name}</div>
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
