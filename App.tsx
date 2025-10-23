import React, { useState, useCallback, useEffect, useRef } from 'react';
import { AppState, Language, HistoryItem } from './types';
import { TEXTS } from './constants';
import { processImageWithAnimalHeads } from './services/geminiService';
import Header from './components/Header';
import Footer from './components/Footer';
import { UploadIcon, DownloadIcon } from './components/icons';
import ShineLoading from './components/ShineLoading';

const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const AnimatedSection: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => {
    return (
        <div className={`transition-all duration-700 ease-out opacity-100 translate-y-0 ${className}`}>
            {children}
        </div>
    );
};

export default function App() {
    const [language, setLanguage] = useState<Language>('zh');
    const [appState, setAppState] = useState<AppState>('initial');
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [processedImages, setProcessedImages] = useState<string[]>([]);
    const [originalMimeType, setOriginalMimeType] = useState<string | null>(null);
    const [isRetrying, setIsRetrying] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [history, setHistory] = useState<HistoryItem[]>([]);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const lastImageRef = useRef<HTMLDivElement>(null);
    const [showLeftFade, setShowLeftFade] = useState(false);
    const [showRightFade, setShowRightFade] = useState(false);

    const text = TEXTS[language];

    const updateScrollFades = useCallback(() => {
        const el = scrollContainerRef.current;
        if (!el) return;
        const isScrollable = el.scrollWidth > el.clientWidth;
        if (!isScrollable) {
            setShowLeftFade(false);
            setShowRightFade(false);
            return;
        }
        const isAtStart = el.scrollLeft < 10;
        const isAtEnd = el.scrollWidth - el.scrollLeft - el.clientWidth < 10;
        setShowLeftFade(!isAtStart);
        setShowRightFade(!isAtEnd);
    }, []);

     useEffect(() => {
        updateScrollFades();
        if (lastImageRef.current) {
            lastImageRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'end' });
        }
    }, [processedImages, updateScrollFades]);

    const handleReset = useCallback(() => {
        if (originalImage && processedImages.length > 0 && originalMimeType) {
            const newHistoryItem: HistoryItem = {
                original: originalImage,
                mimeType: originalMimeType,
                processed: processedImages,
            };
            setHistory(prev => [newHistoryItem, ...prev].slice(0, 5));
        }

        setAppState('initial');
        setOriginalImage(null);
        setProcessedImages([]);
        setOriginalMimeType(null);
        setIsRetrying(false);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }, [originalImage, processedImages, originalMimeType]);
    
    const handleSubmit = useCallback(async (file: File) => {
        if (!file.type.startsWith('image/')) {
            setError('Please upload a valid image file.');
            setAppState('error');
            return;
        }

        handleReset();
        setAppState('loading');
        setError(null);

        try {
            const dataUrl = await fileToDataUrl(file);
            setOriginalImage(dataUrl);
            setOriginalMimeType(file.type);

            const resultDataUrl = await processImageWithAnimalHeads(dataUrl, file.type);

            setProcessedImages([resultDataUrl]);
            setAppState('result');
        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(errorMessage);
            setAppState('error');
        }
    }, [handleReset]);

    const handleRetry = useCallback(async () => {
        if (!originalImage || !originalMimeType || isRetrying) return;

        setIsRetrying(true);
        setError(null);

        try {
            const resultDataUrl = await processImageWithAnimalHeads(originalImage, originalMimeType);
            setProcessedImages(prev => [...prev, resultDataUrl]);
        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(errorMessage);
            // We keep the app state on 'result' but show an error message briefly
            // Or we could switch to a full error state. Let's show a toast/alert later.
            // For now, let's just log it and maybe show a small indicator.
        } finally {
            setIsRetrying(false);
        }
    }, [originalImage, originalMimeType, isRetrying]);

    const loadFromHistory = useCallback((item: HistoryItem, index: number) => {
        handleReset();
        setOriginalImage(item.original);
        setOriginalMimeType(item.mimeType);
        setProcessedImages(item.processed);
        setAppState('result');
        setHistory(prev => prev.filter((_, i) => i !== index));
    }, [handleReset]);


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleSubmit(file);
        }
    };
    
    const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
        const file = event.dataTransfer.files?.[0];
        if (file) {
            handleSubmit(file);
        }
    }, [handleSubmit]);

    useEffect(() => {
        const handlePaste = (event: ClipboardEvent) => {
            if (appState !== 'initial') return;
            const items = event.clipboardData?.items;
            if (!items) return;
            for (const item of items) {
                if (item.type.includes('image')) {
                    const file = item.getAsFile();
                    if (file) {
                        handleSubmit(file);
                    }
                    event.preventDefault();
                    return;
                }
            }
        };
        window.addEventListener('paste', handlePaste);
        return () => window.removeEventListener('paste', handlePaste);
    }, [handleSubmit, appState]);

    const toggleLanguage = () => {
        setLanguage(prev => (prev === 'zh' ? 'en' : 'zh'));
    };

    const downloadImage = (image: string) => {
        if (!image) return;
        const link = document.createElement('a');
        link.href = image;
        link.download = `animask-image-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    const renderContent = () => {
        switch (appState) {
            case 'loading':
                return (
                    <div className="text-center">
                        <ShineLoading />
                        <h3 className="mt-4 text-lg font-medium text-gray-600 dark:text-gray-400">{text.editor.loading}</h3>
                        {originalImage && <img src={originalImage} alt="Uploading" className="mt-8 max-h-64 rounded-lg mx-auto shadow-lg opacity-50" />}
                    </div>
                );
            case 'result':
                return (
                    <div className="w-full max-w-6xl mx-auto flex flex-col h-full">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white text-center mb-10">{text.editor.result.title}</h2>
                        
                        {/* Desktop Layout: Adaptive Flexbox */}
                        <div className="hidden md:flex gap-6 items-center justify-center flex-grow">
                            <div className="relative group flex-1 min-w-0">
                                <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2 text-center">{text.editor.result.original}</h3>
                                <img src={originalImage} alt="Original" className="rounded-xl shadow-2xl w-full h-auto object-contain max-h-[60vh]" />
                            </div>
                            {processedImages.map((img, index) => (
                                <div key={index} className="relative group flex-1 min-w-0">
                                    <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2 text-center">{`${text.editor.result.processed} #${index + 1}`}</h3>
                                    <img src={img} alt={`Processed ${index + 1}`} className="rounded-xl shadow-2xl w-full h-auto object-contain max-h-[60vh]" />
                                    <button onClick={() => downloadImage(img)} className="absolute bottom-3 right-3 bg-black/60 text-white p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm" aria-label={`Download result ${index + 1}`}>
                                        <DownloadIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            ))}
                            {isRetrying && (
                                <div className="relative group flex-1 min-w-0 flex flex-col items-center justify-center">
                                    <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2 text-center">&nbsp;</h3>
                                    <div className="w-full max-h-[60vh] aspect-square bg-gray-200 dark:bg-gray-800/50 rounded-xl shadow-lg flex items-center justify-center">
                                        <ShineLoading />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Mobile Layout: Vertical Scroll */}
                        <div className="md:hidden flex flex-col gap-8">
                            <div>
                                <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2 text-center">{text.editor.result.original}</h3>
                                <img src={originalImage} alt="Original" className="rounded-xl shadow-2xl w-full max-w-sm mx-auto" />
                            </div>
                            <div className="relative">
                                 {showLeftFade && <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-[#1D1D1F] to-transparent z-10 pointer-events-none"></div>}
                                 {showRightFade && <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-[#1D1D1F] to-transparent z-10 pointer-events-none"></div>}
                                <div 
                                    ref={scrollContainerRef} 
                                    onScroll={updateScrollFades}
                                    className="flex overflow-x-auto snap-x snap-mandatory py-2 -mx-4 px-4 gap-4"
                                >
                                    {processedImages.map((img, index) => (
                                        <div key={index} ref={index === processedImages.length - 1 ? lastImageRef : null} className="flex-shrink-0 w-[85%] snap-center">
                                            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2 text-center">{`${text.editor.result.processed} #${index + 1}`}</h3>
                                            <div className="relative group">
                                                <img src={img} alt={`Processed ${index + 1}`} className="rounded-xl shadow-lg w-full" />
                                                <button onClick={() => downloadImage(img)} className="absolute bottom-3 right-3 bg-black/60 text-white p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm" aria-label={`Download result ${index + 1}`}>
                                                    <DownloadIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {isRetrying && (
                                        <div className="flex-shrink-0 w-[85%] snap-center">
                                            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2 text-center">&nbsp;</h3>
                                            <div className="w-full aspect-square bg-gray-200 dark:bg-gray-800/50 rounded-xl shadow-lg flex items-center justify-center">
                                                <ShineLoading />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 flex justify-center items-center flex-wrap gap-4">
                            <button onClick={handleRetry} disabled={isRetrying} className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                                {text.editor.result.retry}
                            </button>
                            <button onClick={handleReset} disabled={isRetrying} className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                                {text.editor.result.reset}
                            </button>
                        </div>
                    </div>
                );
            case 'error':
                 return (
                    <div className="text-center max-w-2xl">
                        <h3 className="text-2xl font-semibold text-red-600 dark:text-red-400">{text.editor.error.title}</h3>
                        <p className="mt-4 text-gray-600 dark:text-gray-300 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">{error || text.editor.error.message}</p>
                        <button onClick={handleReset} className="mt-6 px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300">
                            {text.editor.error.retry}
                        </button>
                    </div>
                );
            case 'initial':
            default:
                return (
                    <div
                        className={`relative w-full max-w-xl p-8 border-2 border-dashed rounded-2xl transition-colors ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'}`}
                        onDragEnter={() => setIsDragging(true)}
                        onDragLeave={() => setIsDragging(false)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />
                        <div className="text-center cursor-pointer">
                            <UploadIcon className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500" />
                            <h3 className="mt-4 text-2xl font-medium text-gray-800 dark:text-gray-200">{text.editor.initial.title}</h3>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{text.editor.initial.prompt}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">{text.editor.initial.paste}</p>
                            <p className="mt-4 text-xs text-emerald-600 dark:text-emerald-400">{text.editor.initial.hostedKey}</p>
                        </div>
                    </div>
                );
        }
    }

    const renderHistory = () => {
        if (history.length === 0) return null;
        return (
             <div className="w-full max-w-6xl mx-auto py-8 px-4">
                <h3 className="text-xl font-bold text-center text-gray-800 dark:text-gray-200 mb-4">{text.editor.history.title}</h3>
                <div className="flex justify-center gap-4 overflow-x-auto pb-4">
                    {history.map((item, index) => (
                        <button 
                            key={index} 
                            onClick={() => loadFromHistory(item, index)} 
                            className="flex-shrink-0 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow transform hover:-translate-y-1"
                        >
                            <img src={item.original} alt={`History ${index + 1}`} className="w-24 h-24 object-cover" />
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-[#1D1D1F] text-gray-900 dark:text-gray-100 min-h-screen flex flex-col">
            <Header
                language={language}
                toggleLanguage={toggleLanguage}
                text={text.header}
            />
            <main className="flex-grow flex flex-col items-center justify-center px-4 pt-20 pb-10">
                 <AnimatedSection className="w-full flex items-center justify-center flex-grow">
                    {renderContent()}
                </AnimatedSection>
                {appState !== 'initial' && history.length > 0 && <div className="w-full max-w-6xl mx-auto my-6 border-t border-gray-200 dark:border-gray-700"></div>}
                {appState !== 'loading' && renderHistory()}
            </main>
            <Footer text={text.footer}/>
        </div>
    );
}