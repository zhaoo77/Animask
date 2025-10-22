import { LanguageContent, Language } from './types';

export const TEXTS: Record<Language, LanguageContent> = {
  zh: {
    header: {
      title: "Animask"
    },
    editor: {
      initial: {
        title: "上传或粘贴您的图片",
        prompt: "点击选择文件",
        paste: "或直接粘贴图片 (Cmd+V)",
        noApiKey: "请先设置您的 API 密钥"
      },
      loading: "AI 正在处理中，请稍候...",
      result: {
        title: "处理完成",
        original: "原图",
        processed: "效果图",
        download: "下载",
        reset: "换一张图",
        retry: "再试一次"
      },
      error: {
        title: "发生错误",
        message: "图片处理失败，请检查您的API密钥或稍后重试。",
        retry: "重试"
      },
      history: {
        title: "最近生成"
      }
    },
    footer: {
      text: "由 Gemini Nano Banana 驱动"
    },
    apiKeyModal: {
      title: "设置 API 密钥",
      label: "您的 Gemini API 密钥",
      placeholder: "在此处粘贴您的密钥",
      save: "保存密钥",
      clear: "清除密钥",
      info: "您的密钥将安全地存储在浏览器本地，不会被分享。"
    }
  },
  en: {
    header: {
      title: "Animask"
    },
    editor: {
      initial: {
        title: "Upload or Paste Your Image",
        prompt: "Click to select a file",
        paste: "or paste an image (Cmd+V)",
        noApiKey: "Please set your API Key first"
      },
      loading: "AI is processing, please wait...",
      result: {
        title: "Processing Complete",
        original: "Original",
        processed: "Processed",
        download: "Download",
        reset: "Try Another",
        retry: "Try Again"
      },
      error: {
        title: "An Error Occurred",
        message: "Failed to process the image. Please check your API key or try again later.",
        retry: "Retry"
      },
      history: {
        title: "Recent Generations"
      }
    },
    footer: {
      text: "Powered by Gemini Nano Banana"
    },
    apiKeyModal: {
        title: "Set API Key",
        label: "Your Gemini API Key",
        placeholder: "Paste your key here",
        save: "Save Key",
        clear: "Clear Key",
        info: "Your key will be stored securely in your browser's local storage and will not be shared."
    }
  }
};
