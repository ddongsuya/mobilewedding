/// <reference types="vite/client" />

// Firebase environment variables
interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_WEDDING_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Kakao SDK types
interface Window {
  Kakao?: {
    init: (appKey: string) => void;
    isInitialized: () => boolean;
    Share: {
      sendDefault: (options: KakaoShareOptions) => void;
    };
  };
}

interface KakaoShareOptions {
  objectType: 'feed';
  content: {
    title: string;
    description: string;
    imageUrl: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  };
  buttons?: Array<{
    title: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  }>;
}
