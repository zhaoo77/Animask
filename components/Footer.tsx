
import React from 'react';
import { LanguageContent } from '../types';

interface FooterProps {
    text: LanguageContent['footer'];
}

const Footer: React.FC<FooterProps> = ({ text }) => {
  return (
    <footer className="w-full py-6 text-center">
      <p className="text-xs text-gray-500 dark:text-gray-400">{text.text}</p>
    </footer>
  );
};

export default Footer;
