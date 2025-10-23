import React, { useState, useEffect } from 'react';
import { LanguageIcon } from './icons';
import { Language, LanguageContent } from '../types';

interface HeaderProps {
  language: Language;
  toggleLanguage: () => void;
  text: LanguageContent['header'];
}

const Header: React.FC<HeaderProps> = ({ language, toggleLanguage, text }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/80 dark:bg-black/70 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
      <nav className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{text.title}</h1>
        <div className="flex items-center space-x-5">
            <button
                onClick={toggleLanguage}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="Toggle language"
            >
                <LanguageIcon />
            </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;