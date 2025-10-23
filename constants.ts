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
        hostedKey: "Gemini API 密钥已由服务器安全托管"
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
        message: "图片处理失败，请稍后重试。",
        retry: "重试"
      },
      history: {
        title: "最近生成"
      }
    },
    footer: {
      text: "由 Gemini Nano Banana 驱动"
    },
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
        hostedKey: "Gemini API key is securely managed on the server"
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
        message: "Failed to process the image. Please try again later.",
        retry: "Retry"
      },
      history: {
        title: "Recent Generations"
      }
    },
    footer: {
      text: "Powered by Gemini Nano Banana"
    },
  }
};