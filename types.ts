export interface LanguageContent {
  header: {
    title: string;
  };
  editor: {
    initial: {
      title: string;
      prompt: string;
      paste: string;
      hostedKey: string;
    };
    loading: string;
    result: {
      title: string;
      original: string;
      processed: string;
      download: string;
      reset: string;
      retry: string;
    };
    error: {
      title: string;
      message: string;
      retry: string;
    };
    history: {
      title: string;
    }
  };
  footer: {
    text: string;
  };
}

export type AppState = 'initial' | 'loading' | 'result' | 'error';

export type Language = 'zh' | 'en';

export interface HistoryItem {
  original: string;
  mimeType: string;
  processed: string[];
}