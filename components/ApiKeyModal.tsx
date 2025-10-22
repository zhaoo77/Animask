import React, { useState, useEffect } from 'react';
import { LanguageContent } from '../types';
import { CloseIcon } from './icons';

interface ApiKeyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (key: string) => void;
    onClear: () => void;
    currentKey: string;
    text: LanguageContent['apiKeyModal'];
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSave, onClear, currentKey, text }) => {
    const [apiKey, setApiKey] = useState(currentKey);

    useEffect(() => {
        setApiKey(currentKey);
    }, [currentKey]);

    const handleSave = () => {
        onSave(apiKey);
        onClose();
    };
    
    const handleClear = () => {
        setApiKey('');
        onClear();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm" onClick={onClose}>
            <div 
                className="bg-white dark:bg-[#2c2c2e] rounded-2xl shadow-2xl p-8 m-4 w-full max-w-md relative transform transition-all duration-300 ease-out scale-95 opacity-0 animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors" aria-label="Close">
                    <CloseIcon />
                </button>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{text.title}</h2>
                
                <div>
                    <label htmlFor="api-key" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{text.label}</label>
                    <input
                        type="password"
                        id="api-key"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder={text.placeholder}
                        className="mt-1 block w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                    />
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{text.info}</p>
                </div>
                
                <div className="mt-6 flex flex-col sm:flex-row-reverse gap-3">
                    <button
                        onClick={handleSave}
                        disabled={!apiKey}
                        className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {text.save}
                    </button>
                    <button
                        onClick={handleClear}
                        className="w-full inline-flex justify-center rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                    >
                        {text.clear}
                    </button>
                </div>
                {/* Fix: Removed unsupported `jsx` prop from `<style>` tag. */}
                <style>{`
                    @keyframes scale-in {
                        from { transform: scale(0.95); opacity: 0; }
                        to { transform: scale(1); opacity: 1; }
                    }
                    .animate-scale-in {
                        animation: scale-in 0.3s forwards cubic-bezier(0.2, 0.8, 0.2, 1);
                    }
                `}</style>
            </div>
        </div>
    );
};

export default ApiKeyModal;