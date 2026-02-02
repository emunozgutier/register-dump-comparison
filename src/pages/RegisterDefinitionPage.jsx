import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Plus, Trash2, Save, X, Edit2 } from 'lucide-react';

const RegisterDefinitionPage = () => {
    const { registerDefinitions, addDefinition, updateDefinition, deleteDefinition } = useAppStore();

    const [isEditing, setIsEditing] = useState(null); // Index of item being edited
    const [formData, setFormData] = useState({ address: '', name: '', description: '' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateAddress = (addr) => {
        // Simple hex validation
        return /^0x[0-9A-Fa-f]+$/.test(addr);
    };

    const handleAdd = () => {
        if (!formData.address || !formData.name) return;
        if (!formData.address.startsWith('0x')) {
            // Auto-prepend 0x if missing
            formData.address = '0x' + formData.address;
        }

        addDefinition(formData);
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
        <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex flex-col gap-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Register Definitions
                </h1>
                <p className="text-gray-400">Define the register map (Address mapping) for interpretation.</p>
            </div>

            {/* Add / Edit Form */}
            <div className="glass-panel p-6 mb-8 animate-fade-in-up">
                <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                    {isEditing !== null ? <Edit2 size={20} /> : <Plus size={20} />}
                    {isEditing !== null ? 'Edit Register' : 'Add New Register'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Address (Hex)</label>
                        <input
                            type="text"
                            name="address"
                            placeholder="0x1000"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="input-field font-mono"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="CTRL_REG"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="input-field font-mono"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Description</label>
                        <input
                            type="text"
                            name="description"
                            placeholder="Control Register..."
                            value={formData.description}
                            onChange={handleInputChange}
                            className="input-field"
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    {isEditing !== null && (
                        <button onClick={cancelEdit} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                            <X size={16} /> Cancel
                        </button>
                    )}
                    <button
                        onClick={isEditing !== null ? () => handleUpdate(isEditing) : handleAdd}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg flex items-center gap-2 shadow-lg shadow-blue-500/20"
                    >
                        {isEditing !== null ? <Save size={16} /> : <Plus size={16} />}
                        {isEditing !== null ? 'Update Definition' : 'Add Definition'}
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="glass-panel overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#161b22] border-b border-[#30363d]">
                            <th className="p-4 font-semibold text-gray-300 w-32">Address</th>
                            <th className="p-4 font-semibold text-gray-300 w-48">Name</th>
                            <th className="p-4 font-semibold text-gray-300">Description</th>
                            <th className="p-4 font-semibold text-gray-300 w-24 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {registerDefinitions.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="p-8 text-center text-gray-500 italic">
                                    No definitions yet. Add one above.
                                </td>
                            </tr>
                        ) : (
                            registerDefinitions.map((def, idx) => (
                                <tr key={idx} className="border-b border-[#30363d]/50 hover:bg-[#1f242c] transition-colors">
                                    <td className="p-4 font-mono text-blue-400">{def.address}</td>
                                    <td className="p-4 font-mono font-medium text-white">{def.name}</td>
                                    <td className="p-4 text-gray-400">{def.description}</td>
                                    <td className="p-4 text-right flex justify-end gap-2">
                                        <button onClick={() => startEdit(idx, def)} className="p-2 text-gray-400 hover:text-blue-400 bg-transparent hover:bg-blue-500/10 rounded-md">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => deleteDefinition(idx)} className="p-2 text-gray-400 hover:text-red-400 bg-transparent hover:bg-red-500/10 rounded-md">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RegisterDefinitionPage;
