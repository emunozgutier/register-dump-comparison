import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Upload, Save, FileText, AlertCircle, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DumpEntryPage = () => {
    const navigate = useNavigate();
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
                setDumpName(file.name.replace(/\.[^/.]+$/, "")); // remove extension
            }
        };
        reader.readAsText(file);
    };

    const parseDump = (content) => {
        const lines = content.split('\n');
        const data = {};
        let parseCount = 0;

        lines.forEach(line => {
            // Remove comments and trim
            const cleanLine = line.split(/[#;]/)[0].trim();
            if (!cleanLine) return;

            // Try to match basic "Address Value" or "Name Value" patterns
            // Supports: 0x100 0xFF, 0x100=0xFF, REG 0xFF
            const parts = cleanLine.split(/[\s=,:]+/);

            if (parts.length >= 2) {
                const key = parts[0];
                const value = parts[1];
                // We store as is, comparison page will handle normalization/matching
                data[key] = value;
                parseCount++;
            }
        });
        return { data, count: parseCount };
    };

    const handleSave = () => {
        setError('');
        if (!dumpName.trim()) {
            setError('Please provide a name for this dump.');
            return;
        }
        if (!dumpContent.trim()) {
            setError('Please provide dump content.');
            return;
        }

        const { data, count } = parseDump(dumpContent);

        if (count === 0) {
            setError('Could not parse any valid registers. content should be "Address Value" per line.');
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
        // navigate('/comparison'); // Optional: redirect to comparison or stay
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex flex-col gap-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    Register Dump Entry
                </h1>
                <p className="text-gray-400">Import or paste register dump files for comparison.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Input Section */}
                <div className="md:col-span-2 space-y-6">
                    <div className="glass-panel p-6 animate-fade-in-up">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-400 mb-2">Dump Name</label>
                            <input
                                type="text"
                                value={dumpName}
                                onChange={(e) => setDumpName(e.target.value)}
                                placeholder="e.g. Broken State, Working State, dump_v1.log"
                                className="input-field"
                            />
                        </div>

                        <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-gray-400">Dump Content</label>
                                <label className="cursor-pointer text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                                    <Upload size={14} /> Upload File
                                    <input type="file" className="hidden" onChange={handleFileUpload} />
                                </label>
                            </div>
                            <textarea
                                value={dumpContent}
                                onChange={(e) => setDumpContent(e.target.value)}
                                placeholder={`0x1000 0x00000001\n0x1004 0xDEADBEEF\n...`}
                                className="input-field font-mono h-[300px] resize-y"
                            />
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg flex items-center gap-2 text-red-200 text-sm">
                                <AlertCircle size={16} /> {error}
                            </div>
                        )}

                        <div className="flex justify-end">
                            <button
                                onClick={handleSave}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                            >
                                <Save size={18} /> Parse & Save Dump
                            </button>
                        </div>
                    </div>
                </div>

                {/* Saved Dumps Sidebar */}
                <div className="md:col-span-1">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Saved Dumps</h3>
                    <div className="space-y-3">
                        {dumps.length === 0 ? (
                            <div className="glass-panel p-4 text-center text-gray-500 text-sm">
                                No dumps saved yet.
                            </div>
                        ) : (
                            dumps.map((dump) => (
                                <div key={dump.id} className="glass-panel p-4 flex flex-col gap-2 group hover:border-emerald-500/50 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2 text-white font-medium">
                                            <FileText size={16} className="text-emerald-400" />
                                            {dump.name}
                                        </div>
                                        <button onClick={() => removeDump(dump.id)} className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                    <div className="text-xs text-gray-500 flex justify-between">
                                        <span>{new Date(dump.timestamp).toLocaleTimeString()}</span>
                                        <span>{Object.keys(dump.parsedData).length} regs</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DumpEntryPage;
