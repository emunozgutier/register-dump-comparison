import React, { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const ComparisonPage = () => {
    const { registerDefinitions, dumps } = useAppStore();
    const [selectedDumpIds, setSelectedDumpIds] = useState([]);
    const [showDiffsOnly, setShowDiffsOnly] = useState(false);

    // Toggle dump selection
    const toggleDump = (id) => {
        if (selectedDumpIds.includes(id)) {
            setSelectedDumpIds(selectedDumpIds.filter(d => d !== id));
        } else {
            setSelectedDumpIds([...selectedDumpIds, id]);
        }
    };

    // Calculate the comparison data
    const comparisonData = useMemo(() => {
        if (selectedDumpIds.length === 0) return [];

        const activeDumps = dumps.filter(d => selectedDumpIds.includes(d.id));

        // Collect all unique addresses from definitions and selected dumps
        const allAddresses = new Set();
        registerDefinitions.forEach(def => allAddresses.add(def.address.toLowerCase()));
        activeDumps.forEach(dump => {
            Object.keys(dump.parsedData).forEach(addr => allAddresses.add(addr.toLowerCase()));
        });

        // Create sorted rows
        let rows = Array.from(allAddresses).sort().map(address => {
            // Find definition
            const def = registerDefinitions.find(d => d.address.toLowerCase() === address);

            // Get values for each dump
            const values = activeDumps.map(dump => {
                // Try direct match or key match (if dump used names instead of addresses)
                // Normalize keys to lowercase for matching
                const val = dump.parsedData[address] ||
                    (def && dump.parsedData[def.name]) ||
                    '-';
                return val;
            });

            // Check for mismatch (ignore dashes if they mean missing vs existing, or treat as mismatch?)
            // We treat unique non-dash values as the set. If logic set size > 1, it's a diff.
            const uniqueValues = new Set(values.filter(v => v !== '-'));
            const isMismatch = uniqueValues.size > 1;

            return {
                address,
                name: def ? def.name : 'Unknown',
                description: def ? def.description : '',
                values,
                isMismatch
            };
        });

        if (showDiffsOnly) {
            rows = rows.filter(r => r.isMismatch);
        }

        return rows;
    }, [registerDefinitions, dumps, selectedDumpIds, showDiffsOnly]);

    return (
        <div className="max-w-[95%] mx-auto">
            <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent">
                        Comparisons
                    </h1>
                    <p className="text-gray-400">Select dumps to compare side-by-side.</p>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-[#161b22] border border-[#30363d] rounded-lg p-1">
                        {dumps.map(dump => (
                            <button
                                key={dump.id}
                                onClick={() => toggleDump(dump.id)}
                                className={twMerge(
                                    "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                                    selectedDumpIds.includes(dump.id)
                                        ? "bg-blue-600 text-white shadow-sm"
                                        : "text-gray-400 hover:text-white hover:bg-[#21262d]"
                                )}
                            >
                                {dump.name}
                            </button>
                        ))}
                        {dumps.length === 0 && <span className="px-3 py-1.5 text-xs text-gray-500">No dumps available</span>}
                    </div>

                    <button
                        onClick={() => setShowDiffsOnly(!showDiffsOnly)}
                        className={twMerge(
                            "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors",
                            showDiffsOnly
                                ? "bg-orange-500/10 border-orange-500/50 text-orange-400"
                                : "bg-[#161b22] border-[#30363d] text-gray-400 hover:border-gray-500"
                        )}
                    >
                        <AlertTriangle size={16} />
                        {showDiffsOnly ? 'Showing Diffs' : 'Show All'}
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="glass-panel overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#161b22] border-b border-[#30363d]">
                            <th className="p-4 font-semibold text-gray-300 w-32 sticky left-0 bg-[#161b22] z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.5)]">Address</th>
                            <th className="p-4 font-semibold text-gray-300 w-48 sticky left-32 bg-[#161b22] z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.5)]">Name</th>
                            {selectedDumpIds.map(id => {
                                const dump = dumps.find(d => d.id === id);
                                return (
                                    <th key={id} className="p-4 font-semibold text-gray-300 min-w-[150px]">
                                        {dump?.name}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {comparisonData.length === 0 ? (
                            <tr>
                                <td colSpan={2 + selectedDumpIds.length} className="p-12 text-center text-gray-500">
                                    {selectedDumpIds.length === 0
                                        ? "Select at least one dump to view data."
                                        : "No matching registers found (or all match if 'Showing Diffs' is active)."}
                                </td>
                            </tr>
                        ) : (
                            comparisonData.map((row) => (
                                <tr
                                    key={row.address}
                                    className={twMerge(
                                        "border-b border-[#30363d]/50 hover:bg-[#1f242c] transition-colors",
                                        row.isMismatch && "bg-red-900/10 hover:bg-red-900/20"
                                    )}
                                >
                                    <td className="p-4 font-mono text-blue-400 sticky left-0 bg-[#0d1117] md:bg-inherit z-10">{row.address}</td>
                                    <td className="p-4 font-mono text-xs text-gray-300 sticky left-32 bg-[#0d1117] md:bg-inherit z-10" title={row.description}>
                                        <div className="font-bold">{row.name}</div>
                                        <div className="text-gray-500 truncate max-w-[12rem]">{row.description}</div>
                                    </td>
                                    {row.values.map((val, i) => (
                                        <td key={i} className={twMerge(
                                            "p-4 font-mono text-sm",
                                            row.isMismatch
                                                ? "text-orange-300 font-bold" // Highlight mismatched values
                                                : "text-gray-400"
                                        )}>
                                            {val}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ComparisonPage;
