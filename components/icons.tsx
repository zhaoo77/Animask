import React from 'react';

export const SpinnerIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export const UploadIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M3 17.25V6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v10.5A2.25 2.25 0 0118.75 19.5H5.25A2.25 2.25 0 013 17.25z" />
  </svg>
);

export const DownloadIcon: React.FC<{className?: string}> = ({ className = 'h-5 w-5' }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

export const LanguageIcon: React.FC<{className?: string}> = ({ className = 'h-6 w-6' }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
    </svg>
);

export const SettingsIcon: React.FC<{className?: string}> = ({ className = 'h-6 w-6' }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.007 1.11-.95.595.053 1.022.574 1.022 1.178v.042a2.25 2.25 0 01-1.883 2.185 2.25 2.25 0 01-2.245-1.019.25.25 0 00-.433-.114.25.25 0 00-.114.433 2.25 2.25 0 011.07 2.498 2.25 2.25 0 01-2.498 1.07.25.25 0 00-.433.114.25.25 0 00.114.433 2.25 2.25 0 012.185 1.883v.042c0 .604.427 1.125 1.022 1.178.55.048 1.02-.408 1.11-.95.09-.542-.2-1.078-.732-1.282a.25.25 0 01-.142-.245v-.136c0-.138.112-.25.25-.25h.136a.25.25 0 01.245.142c.532.204.822.74.732 1.282.09.542.56 1.007 1.11.95.595-.053 1.022-.574 1.022-1.178v-.042a2.25 2.25 0 011.883-2.185 2.25 2.25 0 012.245 1.019.25.25 0 00.433.114.25.25 0 00.114-.433 2.25 2.25 0 01-1.07-2.498 2.25 2.25 0 012.498-1.07.25.25 0 00.433-.114.25.25 0 00-.114-.433 2.25 2.25 0 01-2.185-1.883v-.042c0-.604-.427-1.125-1.022-1.178-.55-.048-1.02.408-1.11.95-.09.542.2 1.078.732 1.282a.25.25 0 01.142.245v.136c0 .138-.112.25-.25.25h-.136a.25.25 0 01-.245-.142c-.532-.204-.822-.74-.732-1.282zM12 15a3 3 0 100-6 3 3 0 000 6z" />
    </svg>
);

export const CloseIcon: React.FC<{className?: string}> = ({ className = 'h-6 w-6' }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);
