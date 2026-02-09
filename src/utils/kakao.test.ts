/**
 * 카카오 SDK 유틸리티 함수 테스트
 * 
 * Requirements: 8.1
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { 
  initKakaoSDK, 
  shareToKakao, 
  isKakaoSDKLoaded, 
  isKakaoSDKInitialized 
} from './kakao';
import { ShareConfig } from '../types';

// Mock Kakao SDK
const createMockKakaoSDK = (isInitialized = false) => ({
  init: vi.fn(),
  isInitialized: vi.fn(() => isInitialized),
  Share: {
    sendDefault: vi.fn(),
  },
});

describe('Kakao SDK 유틸리티', () => {
  let originalKakao: typeof window.Kakao;

  beforeEach(() => {
    // 원본 Kakao 저장
    originalKakao = window.Kakao;
  });

  afterEach(() => {
    // 원본 Kakao 복원
    window.Kakao = originalKakao;
    vi.clearAllMocks();
  });

  describe('isKakaoSDKLoaded', () => {
    it('SDK가 로드되지 않은 경우 false를 반환해야 한다', () => {
      window.Kakao = undefined;
      expect(isKakaoSDKLoaded()).toBe(false);
    });

    it('SDK가 로드된 경우 true를 반환해야 한다', () => {
      window.Kakao = createMockKakaoSDK();
      expect(isKakaoSDKLoaded()).toBe(true);
    });
  });

  describe('isKakaoSDKInitialized', () => {
    it('SDK가 로드되지 않은 경우 false를 반환해야 한다', () => {
      window.Kakao = undefined;
      expect(isKakaoSDKInitialized()).toBe(false);
    });

    it('SDK가 초기화되지 않은 경우 false를 반환해야 한다', () => {
      window.Kakao = createMockKakaoSDK(false);
      expect(isKakaoSDKInitialized()).toBe(false);
    });

    it('SDK가 초기화된 경우 true를 반환해야 한다', () => {
      window.Kakao = createMockKakaoSDK(true);
      expect(isKakaoSDKInitialized()).toBe(true);
    });
  });

  describe('initKakaoSDK', () => {
    it('앱 키가 없으면 실패해야 한다', () => {
      window.Kakao = createMockKakaoSDK();
      
      const result = initKakaoSDK('');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('카카오 앱 키가 제공되지 않았습니다');
    });

    it('앱 키가 공백만 있으면 실패해야 한다', () => {
      window.Kakao = createMockKakaoSDK();
      
      const result = initKakaoSDK('   ');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('카카오 앱 키가 제공되지 않았습니다');
    });

    it('SDK가 로드되지 않은 경우 실패해야 한다', () => {
      window.Kakao = undefined;
      
      const result = initKakaoSDK('test-app-key');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('카카오 SDK가 로드되지 않았습니다');
    });

    it('이미 초기화된 경우 성공을 반환해야 한다', () => {
      window.Kakao = createMockKakaoSDK(true);
      
      const result = initKakaoSDK('test-app-key');
      
      expect(result.success).toBe(true);
      expect(window.Kakao.init).not.toHaveBeenCalled();
    });

    it('초기화되지 않은 경우 init을 호출해야 한다', () => {
      const mockKakao = createMockKakaoSDK(false);
      // 초기화 후 isInitialized가 true를 반환하도록 설정
      mockKakao.isInitialized
        .mockReturnValueOnce(false)  // 첫 번째 호출 (초기화 전 확인)
        .mockReturnValueOnce(true);  // 두 번째 호출 (초기화 후 확인)
      window.Kakao = mockKakao;
      
      const result = initKakaoSDK('test-app-key');
      
      expect(result.success).toBe(true);
      expect(mockKakao.init).toHaveBeenCalledWith('test-app-key');
    });

    it('초기화 실패 시 오류를 반환해야 한다', () => {
      const mockKakao = createMockKakaoSDK(false);
      // 초기화 후에도 isInitialized가 false를 반환
      mockKakao.isInitialized.mockReturnValue(false);
      window.Kakao = mockKakao;
      
      const result = initKakaoSDK('test-app-key');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('카카오 SDK 초기화에 실패했습니다');
    });
  });

  describe('shareToKakao', () => {
    const baseConfig: ShareConfig = {
      kakaoEnabled: true,
      kakaoAppKey: 'test-app-key',
      ogTitle: '결혼식에 초대합니다',
      ogDescription: '소중한 분들을 초대합니다',
      ogImage: 'https://example.com/image.jpg',
    };

    const testUrl = 'https://wedding.example.com';

    it('카카오 공유가 비활성화된 경우 실패해야 한다', () => {
      window.Kakao = createMockKakaoSDK(true);
      const config: ShareConfig = { ...baseConfig, kakaoEnabled: false };
      
      const result = shareToKakao(config, testUrl);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('카카오톡 공유가 비활성화되어 있습니다');
    });

    it('SDK가 로드되지 않은 경우 실패해야 한다', () => {
      window.Kakao = undefined;
      
      const result = shareToKakao(baseConfig, testUrl);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('카카오 SDK가 로드되지 않았습니다');
    });

    it('앱 키 없이 초기화되지 않은 SDK로 공유 시 실패해야 한다', () => {
      window.Kakao = createMockKakaoSDK(false);
      const config: ShareConfig = { ...baseConfig, kakaoAppKey: undefined };
      
      const result = shareToKakao(config, testUrl);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('카카오 앱 키가 설정되지 않았습니다');
    });

    it('SDK가 초기화된 경우 공유를 실행해야 한다', () => {
      const mockKakao = createMockKakaoSDK(true);
      window.Kakao = mockKakao;
      
      const result = shareToKakao(baseConfig, testUrl);
      
      expect(result.success).toBe(true);
      expect(mockKakao.Share.sendDefault).toHaveBeenCalledWith({
        objectType: 'feed',
        content: {
          title: baseConfig.ogTitle,
          description: baseConfig.ogDescription,
          imageUrl: baseConfig.ogImage,
          link: {
            mobileWebUrl: testUrl,
            webUrl: testUrl,
          },
        },
        buttons: [
          {
            title: '청첩장 보기',
            link: {
              mobileWebUrl: testUrl,
              webUrl: testUrl,
            },
          },
        ],
      });
    });

    it('SDK가 초기화되지 않은 경우 자동으로 초기화해야 한다', () => {
      const mockKakao = createMockKakaoSDK(false);
      // 초기화 전: false, 초기화 후: true
      mockKakao.isInitialized
        .mockReturnValueOnce(false)  // shareToKakao 내 첫 번째 확인
        .mockReturnValueOnce(false)  // initKakaoSDK 내 첫 번째 확인
        .mockReturnValueOnce(true);  // initKakaoSDK 내 초기화 후 확인
      window.Kakao = mockKakao;
      
      const result = shareToKakao(baseConfig, testUrl);
      
      expect(result.success).toBe(true);
      expect(mockKakao.init).toHaveBeenCalledWith(baseConfig.kakaoAppKey);
      expect(mockKakao.Share.sendDefault).toHaveBeenCalled();
    });

    it('기본값으로 공유해야 한다 (ogTitle, ogDescription, ogImage가 없는 경우)', () => {
      const mockKakao = createMockKakaoSDK(true);
      window.Kakao = mockKakao;
      const config: ShareConfig = {
        kakaoEnabled: true,
        kakaoAppKey: 'test-app-key',
      };
      
      const result = shareToKakao(config, testUrl);
      
      expect(result.success).toBe(true);
      expect(mockKakao.Share.sendDefault).toHaveBeenCalledWith({
        objectType: 'feed',
        content: {
          title: '결혼식에 초대합니다',
          description: '',
          imageUrl: '',
          link: {
            mobileWebUrl: testUrl,
            webUrl: testUrl,
          },
        },
        buttons: [
          {
            title: '청첩장 보기',
            link: {
              mobileWebUrl: testUrl,
              webUrl: testUrl,
            },
          },
        ],
      });
    });

    it('공유 중 예외 발생 시 오류를 반환해야 한다', () => {
      const mockKakao = createMockKakaoSDK(true);
      mockKakao.Share.sendDefault.mockImplementation(() => {
        throw new Error('공유 실패');
      });
      window.Kakao = mockKakao;
      
      const result = shareToKakao(baseConfig, testUrl);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('공유 실패');
    });
  });
});
