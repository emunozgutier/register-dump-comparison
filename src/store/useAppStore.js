import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAppStore = create(
    persist(
        (set) => ({
            // Register Definitions: Array of { address: string, name: string, fields: Array<Field> }
            registerDefinitions: [],

            // Dumps: Array of { id: string, name: string, timestamp: number, content: string, parsedData: Record<string, string> }
            dumps: [],

            // Actions
            addDefinition: (definition) => set((state) => ({
                registerDefinitions: [...state.registerDefinitions, definition]
            })),

            setRegisterDefinitions: (definitions) => set(() => ({
                registerDefinitions: definitions
            })),

            updateDefinition: (index, definition) => set((state) => {
                const newDefs = [...state.registerDefinitions];
                newDefs[index] = definition;
                return { registerDefinitions: newDefs };
            }),

            deleteDefinition: (index) => set((state) => ({
                registerDefinitions: state.registerDefinitions.filter((_, i) => i !== index)
            })),

            addDump: (dump) => set((state) => ({
                dumps: [...state.dumps, dump]
            })),

            removeDump: (id) => set((state) => ({
                dumps: state.dumps.filter((d) => d.id !== id)
            })),

            updateDump: (id, newDump) => set((state) => ({
                dumps: state.dumps.map((d) => d.id === id ? { ...d, ...newDump } : d)
            })),
        }),
        {
            name: 'register-dump-storage',
        }
    )
);
