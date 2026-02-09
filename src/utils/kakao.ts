/**
 * 카카오 SDK 유틸리티 함수
 * 
 * 카카오톡 공유 기능을 위한 SDK 초기화 및 공유 함수를 제공합니다.
 * 
 * Requirements:
 * - 8.1: 카카오톡 공유 버튼 클릭 시 카카오톡 공유 기능 실행
 */

import { ShareConfig } from '../types';

/**
 * 카카오 SDK 초기화 결과 인터페이스
 */
export interface KakaoInitResult {
  /** 초기화 성공 여부 */
  success: boolean;
  /** 오류 메시지 (실패 시) */
  error?: string;
}

/**
 * 카카오 공유 결과 인터페이스
 */
export interface KakaoShareResult {
  /** 공유 성공 여부 */
  success: boolean;
  /** 오류 메시지 (실패 시) */
  error?: string;
}

/**
 * 카카오 SDK가 로드되었는지 확인
 * 
 * @returns SDK 로드 여부
 */
export function isKakaoSDKLoaded(): boolean {
  return typeof window !== 'undefined' && !!window.Kakao;
}

/**
 * 카카오 SDK가 초기화되었는지 확인
 * 
 * @returns SDK 초기화 여부
 */
export function isKakaoSDKInitialized(): boolean {
  return isKakaoSDKLoaded() && !!window.Kakao?.isInitialized();
}

/**
 * 카카오 SDK 초기화
 * 
 * SDK가 이미 초기화된 경우 다시 초기화하지 않습니다.
 * 
 * @param appKey - 카카오 앱 키
 * @returns 초기화 결과
 * 
 * @example
 * ```typescript
 * const result = initKakaoSDK('your-kakao-app-key');
 * if (result.success) {
 *   console.log('카카오 SDK 초기화 성공');
 * } else {
 *   console.error('초기화 실패:', result.error);
 * }
 * ```
 */
export function initKakaoSDK(appKey: string): KakaoInitResult {
  try {
    // 앱 키 유효성 검사
    if (!appKey || appKey.trim().length === 0) {
      return { success: false, error: '카카오 앱 키가 제공되지 않았습니다' };
    }

    // SDK 로드 확인
    if (!isKakaoSDKLoaded()) {
      return { success: false, error: '카카오 SDK가 로드되지 않았습니다' };
    }

    // 이미 초기화된 경우 성공 반환
    if (window.Kakao!.isInitialized()) {
      return { success: true };
    }

    // SDK 초기화
    window.Kakao!.init(appKey);

    // 초기화 확인
    if (window.Kakao!.isInitialized()) {
      return { success: true };
    }

    return { success: false, error: '카카오 SDK 초기화에 실패했습니다' };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다' 
    };
  }
}

/**
 * 카카오톡으로 청첩장 공유
 * 
 * 카카오톡 피드 형식으로 청첩장을 공유합니다.
 * SDK가 초기화되지 않은 경우 자동으로 초기화를 시도합니다.
 * 
 * Requirements: 8.1
 * 
 * @param config - 공유 설정 (ShareConfig)
 * @param url - 공유할 청첩장 URL
 * @returns 공유 결과
 * 
 * @example
 * ```typescript
 * const config: ShareConfig = {
 *   kakaoEnabled: true,
 *   kakaoAppKey: 'your-app-key',
 *   ogTitle: '결혼식에 초대합니다',
 *   ogDescription: '소중한 분들을 초대합니다',
 *   ogImage: 'https://example.com/image.jpg'
 * };
 * 
 * const result = shareToKakao(config, 'https://wedding.example.com');
 * if (result.success) {
 *   console.log('카카오톡 공유 실행됨');
 * }
 * ```
 */
export function shareToKakao(config: ShareConfig, url: string): KakaoShareResult {
  try {
    // 카카오 공유 기능 활성화 확인
    if (!config.kakaoEnabled) {
      return { success: false, error: '카카오톡 공유가 비활성화되어 있습니다' };
    }

    // SDK 로드 확인
    if (!isKakaoSDKLoaded()) {
      return { success: false, error: '카카오 SDK가 로드되지 않았습니다' };
    }

    // SDK 초기화 (필요한 경우)
    if (!window.Kakao!.isInitialized()) {
      if (!config.kakaoAppKey) {
        return { success: false, error: '카카오 앱 키가 설정되지 않았습니다' };
      }
      
      const initResult = initKakaoSDK(config.kakaoAppKey);
      if (!initResult.success) {
        return { success: false, error: initResult.error };
      }
    }

    // 카카오톡 공유 실행
    window.Kakao!.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: config.ogTitle || '결혼식에 초대합니다',
        description: config.ogDescription || '',
        imageUrl: config.ogImage || '',
        link: {
          mobileWebUrl: url,
          webUrl: url,
        },
      },
      buttons: [
        {
          title: '청첩장 보기',
          link: {
            mobileWebUrl: url,
            webUrl: url,
          },
        },
      ],
    });

    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '카카오톡 공유 중 오류가 발생했습니다' 
    };
  }
}
