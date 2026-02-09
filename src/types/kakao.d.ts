/**
 * 카카오 SDK TypeScript 타입 선언
 * 
 * 카카오톡 공유 SDK의 타입을 정의합니다.
 * 
 * Requirements: 8.1
 * 
 * @see https://developers.kakao.com/docs/latest/ko/message/js-link
 */

/**
 * 카카오 공유 링크 인터페이스
 */
export interface KakaoLink {
  /** 모바일 웹 URL */
  mobileWebUrl: string;
  /** 웹 URL */
  webUrl: string;
}

/**
 * 카카오 공유 콘텐츠 인터페이스
 */
export interface KakaoContent {
  /** 제목 */
  title: string;
  /** 설명 */
  description: string;
  /** 이미지 URL */
  imageUrl: string;
  /** 링크 정보 */
  link: KakaoLink;
}

/**
 * 카카오 공유 버튼 인터페이스
 */
export interface KakaoButton {
  /** 버튼 제목 */
  title: string;
  /** 버튼 링크 */
  link: KakaoLink;
}

/**
 * 카카오 피드 공유 옵션 인터페이스
 */
export interface KakaoFeedShareOptions {
  /** 공유 타입 (피드) */
  objectType: 'feed';
  /** 콘텐츠 정보 */
  content: KakaoContent;
  /** 버튼 목록 (선택) */
  buttons?: KakaoButton[];
}

/**
 * 카카오 공유 API 인터페이스
 */
export interface KakaoShareAPI {
  /**
   * 기본 공유 메시지 전송
   * @param options - 공유 옵션
   */
  sendDefault: (options: KakaoFeedShareOptions) => void;
}

/**
 * 카카오 SDK 인터페이스
 */
export interface KakaoSDK {
  /**
   * SDK 초기화
   * @param appKey - 카카오 앱 키
   */
  init: (appKey: string) => void;
  
  /**
   * SDK 초기화 여부 확인
   * @returns 초기화 여부
   */
  isInitialized: () => boolean;
  
  /**
   * 공유 API
   */
  Share: KakaoShareAPI;
}

/**
 * Window 인터페이스 확장
 * 카카오 SDK가 window 객체에 추가됨
 */
declare global {
  interface Window {
    Kakao?: KakaoSDK;
  }
}

export {};
