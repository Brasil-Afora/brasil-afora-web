import { useState, useEffect } from 'react';

function useSessionStorage(key, initialValue) {
    const [value, setValue] = useState(() => {
        try {
            const item = window.sessionStorage.getItem(key);
            const savedValue = item ? JSON.parse(item) : initialValue;
            if (typeof savedValue === 'object' && savedValue !== null && !Array.isArray(savedValue)) {
                return { ...initialValue, ...savedValue };
            }
            
            return savedValue;
        } catch (error) {
            console.log("Erro ao ler do sessionStorage:", error);
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            window.sessionStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.log("Erro ao salvar no sessionStorage:", error);
        }
    }, [key, value]);

    return [value, setValue];
}

export default useSessionStorage;