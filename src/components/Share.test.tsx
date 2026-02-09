/**
 * Share 컴포넌트 테스트
 * 
 * Requirements:
 * - 8.1: 카카오톡 공유 버튼 클릭 시 카카오톡 공유 기능 실행
 * - 8.2: 링크 복사 버튼 클릭 시 청첩장 URL을 클립보드에 복사
 * - 8.3: Web Share API 지원 시 네이티브 공유 기능 제공
 * - 8.4: 공유 성공/실패 시 사용자에게 피드백 제공
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Share } from './Share';
import { ShareConfig } from '../types';

// 기본 테스트 설정
const defaultConfig: ShareConfig = {
  kakaoEnabled: true,
  kakaoAppKey: 'test-app-key',
  ogTitle: '결혼식에 초대합니다',
  ogDescription: '소중한 분들을 초대합니다',
  ogImage: 'https://example.com/image.jpg',
};

const testUrl = 'https://wedding.example.com/invitation';

// 클립보드 API 모킹
const mockClipboard = {
  writeText: vi.fn(),
};

// Kakao SDK 모킹
const mockKakaoShare = {
  sendDefault: vi.fn(),
};

const mockKakao = {
  init: vi.fn(),
  isInitialized: vi.fn(() => true),
  Share: mockKakaoShare,
};

describe('Share 컴포넌트', () => {
  beforeEach(() => {
    // 클립보드 API 모킹
    Object.defineProperty(navigator, 'clipboard', {
      value: mockClipboard,
      writable: true,
      configurable: true,
    });
    mockClipboard.writeText.mockResolvedValue(undefined);

    // Kakao SDK 모킹
    (window as unknown as { Kakao: typeof mockKakao }).Kakao = mockKakao;
    mockKakao.isInitialized.mockReturnValue(true);
    mockKakaoShare.sendDefault.mockClear();

    // Web Share API 모킹 제거 (기본적으로 지원하지 않음)
    Object.defineProperty(navigator, 'share', {
      value: undefined,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('렌더링', () => {
    it('섹션 제목이 표시되어야 한다', () => {
      render(<Share config={defaultConfig} url={testUrl} />);
      
      expect(screen.getByRole('heading', { name: '공유하기' })).toBeInTheDocument();
    });

    it('안내 문구가 표시되어야 한다', () => {
      render(<Share config={defaultConfig} url={testUrl} />);
      
      expect(screen.getByText('소중한 분들에게 청첩장을 전해주세요')).toBeInTheDocument();
    });

    it('카카오톡 공유 버튼이 표시되어야 한다 (kakaoEnabled가 true일 때)', () => {
      render(<Share config={defaultConfig} url={testUrl} />);
      
      expect(screen.getByRole('button', { name: '카카오톡으로 공유하기' })).toBeInTheDocument();
    });

    it('카카오톡 공유 버튼이 숨겨져야 한다 (kakaoEnabled가 false일 때)', () => {
      const configWithoutKakao: ShareConfig = {
        ...defaultConfig,
        kakaoEnabled: false,
      };
      
      render(<Share config={configWithoutKakao} url={testUrl} />);
      
      expect(screen.queryByRole('button', { name: '카카오톡으로 공유하기' })).not.toBeInTheDocument();
    });

    it('링크 복사 버튼이 표시되어야 한다', () => {
      render(<Share config={defaultConfig} url={testUrl} />);
      
      expect(screen.getByRole('button', { name: '청첩장 링크 복사하기' })).toBeInTheDocument();
    });
  });

  describe('Requirements 8.1: 카카오톡 공유', () => {
    it('카카오톡 공유 버튼 클릭 시 Kakao.Share.sendDefault가 호출되어야 한다', () => {
      render(<Share config={defaultConfig} url={testUrl} />);
      
      const kakaoButton = screen.getByRole('button', { name: '카카오톡으로 공유하기' });
      fireEvent.click(kakaoButton);
      
      expect(mockKakaoShare.sendDefault).toHaveBeenCalledWith({
        objectType: 'feed',
        content: {
          title: defaultConfig.ogTitle,
          description: defaultConfig.ogDescription,
          imageUrl: defaultConfig.ogImage,
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

    it('Kakao SDK가 초기화되지 않은 경우 init을 호출해야 한다', () => {
      mockKakao.isInitialized.mockReturnValue(false);
      
      render(<Share config={defaultConfig} url={testUrl} />);
      
      const kakaoButton = screen.getByRole('button', { name: '카카오톡으로 공유하기' });
      fireEvent.click(kakaoButton);
      
      expect(mockKakao.init).toHaveBeenCalledWith(defaultConfig.kakaoAppKey);
    });
  });

  describe('Requirements 8.2: 링크 복사', () => {
    it('링크 복사 버튼 클릭 시 URL이 클립보드에 복사되어야 한다', async () => {
      render(<Share config={defaultConfig} url={testUrl} />);
      
      const copyButton = screen.getByRole('button', { name: '청첩장 링크 복사하기' });
      fireEvent.click(copyButton);
      
      await waitFor(() => {
        expect(mockClipboard.writeText).toHaveBeenCalledWith(testUrl);
      });
    });

    it('복사 성공 시 버튼 텍스트가 "복사됨"으로 변경되어야 한다', async () => {
      render(<Share config={defaultConfig} url={testUrl} />);
      
      const copyButton = screen.getByRole('button', { name: '청첩장 링크 복사하기' });
      fireEvent.click(copyButton);
      
      await waitFor(() => {
        expect(screen.getByText('복사됨')).toBeInTheDocument();
      });
    });
  });

  describe('Requirements 8.3: Web Share API', () => {
    it('Web Share API가 지원되면 공유 버튼이 표시되어야 한다', async () => {
      // Web Share API 지원 모킹
      Object.defineProperty(navigator, 'share', {
        value: vi.fn().mockResolvedValue(undefined),
        writable: true,
        configurable: true,
      });
      
      render(<Share config={defaultConfig} url={testUrl} />);
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: '다른 앱으로 공유하기' })).toBeInTheDocument();
      });
    });

    it('Web Share API가 지원되지 않으면 공유 버튼이 숨겨져야 한다', () => {
      render(<Share config={defaultConfig} url={testUrl} />);
      
      expect(screen.queryByRole('button', { name: '다른 앱으로 공유하기' })).not.toBeInTheDocument();
    });

    it('공유 버튼 클릭 시 navigator.share가 호출되어야 한다', async () => {
      const mockShare = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'share', {
        value: mockShare,
        writable: true,
        configurable: true,
      });
      
      render(<Share config={defaultConfig} url={testUrl} />);
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: '다른 앱으로 공유하기' })).toBeInTheDocument();
      });
      
      const shareButton = screen.getByRole('button', { name: '다른 앱으로 공유하기' });
      fireEvent.click(shareButton);
      
      await waitFor(() => {
        expect(mockShare).toHaveBeenCalledWith({
          title: defaultConfig.ogTitle,
          text: defaultConfig.ogDescription,
          url: testUrl,
        });
      });
    });
  });

  describe('Requirements 8.4: 피드백 제공', () => {
    it('링크 복사 성공 시 성공 피드백이 표시되어야 한다', async () => {
      render(<Share config={defaultConfig} url={testUrl} />);
      
      const copyButton = screen.getByRole('button', { name: '청첩장 링크 복사하기' });
      fireEvent.click(copyButton);
      
      await waitFor(() => {
        expect(screen.getByText('링크가 복사되었습니다')).toBeInTheDocument();
      });
    });

    it('링크 복사 실패 시 오류 피드백이 표시되어야 한다', async () => {
      mockClipboard.writeText.mockRejectedValue(new Error('Copy failed'));
      
      render(<Share config={defaultConfig} url={testUrl} />);
      
      const copyButton = screen.getByRole('button', { name: '청첩장 링크 복사하기' });
      fireEvent.click(copyButton);
      
      await waitFor(() => {
        expect(screen.getByText(/링크 복사에 실패했습니다|Copy failed/)).toBeInTheDocument();
      });
    });

    it('카카오톡 공유 실행 시 피드백이 표시되어야 한다', async () => {
      render(<Share config={defaultConfig} url={testUrl} />);
      
      const kakaoButton = screen.getByRole('button', { name: '카카오톡으로 공유하기' });
      fireEvent.click(kakaoButton);
      
      await waitFor(() => {
        expect(screen.getByText('카카오톡 공유가 실행되었습니다')).toBeInTheDocument();
      });
    });

    it('피드백 메시지에 적절한 role과 aria-live 속성이 있어야 한다', async () => {
      render(<Share config={defaultConfig} url={testUrl} />);
      
      const copyButton = screen.getByRole('button', { name: '청첩장 링크 복사하기' });
      fireEvent.click(copyButton);
      
      await waitFor(() => {
        const feedbackElement = screen.getByRole('status');
        expect(feedbackElement).toHaveAttribute('aria-live', 'polite');
      });
    });
  });

  describe('접근성', () => {
    it('모든 버튼에 적절한 aria-label이 있어야 한다', () => {
      render(<Share config={defaultConfig} url={testUrl} />);
      
      expect(screen.getByRole('button', { name: '카카오톡으로 공유하기' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '청첩장 링크 복사하기' })).toBeInTheDocument();
    });

    it('섹션에 적절한 aria-labelledby가 있어야 한다', () => {
      render(<Share config={defaultConfig} url={testUrl} />);
      
      const section = screen.getByRole('region', { name: '공유하기' });
      expect(section).toBeInTheDocument();
    });
  });

  describe('기본값 처리', () => {
    it('ogTitle이 없을 때 기본 제목이 사용되어야 한다', () => {
      const configWithoutTitle: ShareConfig = {
        kakaoEnabled: true,
        kakaoAppKey: 'test-app-key',
      };
      
      render(<Share config={configWithoutTitle} url={testUrl} />);
      
      const kakaoButton = screen.getByRole('button', { name: '카카오톡으로 공유하기' });
      fireEvent.click(kakaoButton);
      
      expect(mockKakaoShare.sendDefault).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({
            title: '결혼식에 초대합니다',
          }),
        })
      );
    });
  });
});
