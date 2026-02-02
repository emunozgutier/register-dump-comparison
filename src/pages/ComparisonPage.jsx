import React, { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { AlertTriangle } from 'lucide-react';
import { Card, Button, ButtonGroup, Table, Badge } from 'react-bootstrap';
import { twMerge } from 'tailwind-merge';

const ComparisonPage = () => {
    const { registerDefinitions, dumps } = useAppStore();
    const [selectedDumpIds, setSelectedDumpIds] = useState([]);
    const [showDiffsOnly, setShowDiffsOnly] = useState(false);

    const toggleDump = (id) => {
        if (selectedDumpIds.includes(id)) {
            setSelectedDumpIds(selectedDumpIds.filter(d => d !== id));
        } else {
            setSelectedDumpIds([...selectedDumpIds, id]);
        }
    };

    const comparisonData = useMemo(() => {
        if (selectedDumpIds.length === 0) return [];
        const activeDumps = dumps.filter(d => selectedDumpIds.includes(d.id));
        const allAddresses = new Set();
        registerDefinitions.forEach(def => allAddresses.add(def.address.toLowerCase()));
        activeDumps.forEach(dump => {
            Object.keys(dump.parsedData).forEach(addr => allAddresses.add(addr.toLowerCase()));
        });

        let rows = Array.from(allAddresses).sort().map(address => {
            const def = registerDefinitions.find(d => d.address.toLowerCase() === address);
            const values = activeDumps.map(dump => {
                const val = dump.parsedData[address] || (def && dump.parsedData[def.name]) || '-';
                return val;
            });
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
        <Card className="h-100 bg-[#161b22] border-[#30363d] text-[#c9d1d9] shadow-sm">
            <Card.Header className="bg-[#0d1117] border-bottom border-[#30363d] py-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div>
                    <h5 className="mb-0 text-white font-semibold">Comparison</h5>
                    <small className="text-gray-500">Compare dumps</small>
                </div>
                <Button
                    variant={showDiffsOnly ? "warning" : "outline-secondary"}
                    size="sm"
                    onClick={() => setShowDiffsOnly(!showDiffsOnly)}
                    className="d-flex align-items-center gap-1"
                >
                    <AlertTriangle size={14} />
                    {showDiffsOnly ? 'Diffs' : 'All'}
                </Button>
            </Card.Header>
            <Card.Body className="d-flex flex-column p-0">
                {/* Dump Selector */}
                <div className="p-3 bg-[#0d1117] border-bottom border-[#30363d]">
                    <div className="d-flex flex-wrap gap-1">
                        {dumps.length === 0 && <span className="text-muted small">No dumps available</span>}
                        {dumps.map(dump => (
                            <Button
                                key={dump.id}
                                size="sm"
                                variant={selectedDumpIds.includes(dump.id) ? "primary" : "outline-secondary"}
                                onClick={() => toggleDump(dump.id)}
                                className="py-0 px-2 small"
                                style={{ fontSize: '0.75rem' }}
                            >
                                {dump.name}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="flex-grow-1 overflow-auto" style={{ minHeight: '300px', maxHeight: '600px' }}>
                    <Table size="sm" hover variant="dark" className="mb-0 custom-table text-nowrap">
                        <thead className="sticky-top bg-[#161b22]">
                            <tr>
                                <th className="font-light text-gray-400 bg-[#161b22]" style={{ position: 'sticky', left: 0, zIndex: 10 }}>Addr</th>
                                <th className="font-light text-gray-400 bg-[#161b22]" style={{ position: 'sticky', left: '60px', zIndex: 10 }}>Name</th>
                                {selectedDumpIds.map(id => (
                                    <th key={id} className="font-light text-gray-400">{dumps.find(d => d.id === id)?.name}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {comparisonData.length === 0 ? (
                                <tr><td colSpan="100%" className="text-center text-gray-500 py-4">Select dumps to compare.</td></tr>
                            ) : (
                                comparisonData.map((row) => (
                                    <tr key={row.address} className={row.isMismatch ? "bg-red-900/20" : ""}>
                                        <td className="font-mono text-blue-400 small bg-[#161b22]" style={{ position: 'sticky', left: 0 }}>{row.address}</td>
                                        <td className="font-mono text-white small bg-[#161b22]" title={row.description} style={{ position: 'sticky', left: '60px' }}>
                                            {row.name}
                                        </td>
                                        {row.values.map((val, i) => (
                                            <td key={i} className={twMerge(
                                                "font-mono small",
                                                row.isMismatch ? "text-warning fw-bold" : "text-gray-400"
                                            )}>
                                                {val}
                                            </td>
                                        ))}
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

export default ComparisonPage;
