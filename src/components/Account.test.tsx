/**
 * Account 컴포넌트 테스트
 * 
 * Requirements:
 * - 5.1: 신랑측과 신부측 계좌 정보를 구분하여 표시
 * - 5.2: 계좌번호를 클립보드에 복사
 * - 5.3: 복사 완료 피드백을 사용자에게 표시
 * - 5.4: 카카오페이 송금 링크가 제공된 경우 카카오페이 송금 버튼을 표시
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Account } from './Account';
import { AccountConfig } from '../types';

// Mock clipboard utility
vi.mock('../utils/clipboard', () => ({
  copyToClipboard: vi.fn(),
}));

import { copyToClipboard } from '../utils/clipboard';

const mockCopyToClipboard = vi.mocked(copyToClipboard);

describe('Account 컴포넌트', () => {
  const mockConfig: AccountConfig = {
    groom: [
      {
        bank: '신한은행',
        accountNumber: '110-123-456789',
        holder: '김신랑',
        kakaoPayLink: 'https://kakaopay.com/groom',
      },
      {
        bank: '국민은행',
        accountNumber: '123-456-789012',
        holder: '김아버지',
      },
    ],
    bride: [
      {
        bank: '우리은행',
        accountNumber: '1002-123-456789',
        holder: '이신부',
        kakaoPayLink: 'https://kakaopay.com/bride',
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockCopyToClipboard.mockResolvedValue({ success: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Requirements 5.1: 신랑측/신부측 계좌 구분 표시', () => {
    it('신랑측 계좌 그룹을 표시한다', () => {
      render(<Account config={mockConfig} />);
      
      expect(screen.getByText('신랑측 계좌')).toBeInTheDocument();
    });

    it('신부측 계좌 그룹을 표시한다', () => {
      render(<Account config={mockConfig} />);
      
      expect(screen.getByText('신부측 계좌')).toBeInTheDocument();
    });

    it('아코디언을 열면 계좌 정보가 표시된다', () => {
      render(<Account config={mockConfig} />);
      
      // 신랑측 아코디언 열기
      fireEvent.click(screen.getByText('신랑측 계좌'));
      
      // 계좌 정보 확인
      expect(screen.getByText('김신랑')).toBeInTheDocument();
      expect(screen.getByText('신한은행')).toBeInTheDocument();
      expect(screen.getByText('110-123-456789')).toBeInTheDocument();
    });

    it('계좌가 없는 경우 해당 그룹을 표시하지 않는다', () => {
      const configWithNoGroom: AccountConfig = {
        groom: [],
        bride: mockConfig.bride,
      };
      
      render(<Account config={configWithNoGroom} />);
      
      expect(screen.queryByText('신랑측 계좌')).not.toBeInTheDocument();
      expect(screen.getByText('신부측 계좌')).toBeInTheDocument();
    });

    it('모든 계좌가 없는 경우 컴포넌트를 렌더링하지 않는다', () => {
      const emptyConfig: AccountConfig = {
        groom: [],
        bride: [],
      };
      
      const { container } = render(<Account config={emptyConfig} />);
      
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Requirements 5.2: 계좌번호 클립보드 복사', () => {
    it('복사 버튼을 클릭하면 계좌번호가 클립보드에 복사된다', async () => {
      render(<Account config={mockConfig} />);
      
      // 신랑측 아코디언 열기
      fireEvent.click(screen.getByText('신랑측 계좌'));
      
      // 복사 버튼 클릭
      const copyButtons = screen.getAllByRole('button', { name: /복사하기/i });
      fireEvent.click(copyButtons[0]);
      
      await waitFor(() => {
        expect(mockCopyToClipboard).toHaveBeenCalledWith('110-123-456789');
      });
    });
  });

  describe('Requirements 5.3: 복사 완료 피드백', () => {
    it('복사 성공 시 "복사됨" 피드백을 표시한다', async () => {
      mockCopyToClipboard.mockResolvedValue({ success: true });
      
      render(<Account config={mockConfig} />);
      
      // 신랑측 아코디언 열기
      fireEvent.click(screen.getByText('신랑측 계좌'));
      
      // 복사 버튼 클릭
      const copyButtons = screen.getAllByRole('button', { name: /복사하기/i });
      fireEvent.click(copyButtons[0]);
      
      await waitFor(() => {
        expect(screen.getByText('복사됨')).toBeInTheDocument();
      });
    });

    it('복사 실패 시 "실패" 피드백을 표시한다', async () => {
      mockCopyToClipboard.mockResolvedValue({ success: false, error: 'Copy failed' });
      
      render(<Account config={mockConfig} />);
      
      // 신랑측 아코디언 열기
      fireEvent.click(screen.getByText('신랑측 계좌'));
      
      // 복사 버튼 클릭
      const copyButtons = screen.getAllByRole('button', { name: /복사하기/i });
      fireEvent.click(copyButtons[0]);
      
      await waitFor(() => {
        expect(screen.getByText('실패')).toBeInTheDocument();
      });
    });
  });

  describe('Requirements 5.4: 카카오페이 송금 버튼', () => {
    it('카카오페이 링크가 있는 경우 송금 버튼을 표시한다', () => {
      render(<Account config={mockConfig} />);
      
      // 신랑측 아코디언 열기
      fireEvent.click(screen.getByText('신랑측 계좌'));
      
      const kakaoPayButtons = screen.getAllByRole('link', { name: /카카오페이로 송금하기/i });
      expect(kakaoPayButtons.length).toBeGreaterThan(0);
      expect(kakaoPayButtons[0]).toHaveAttribute('href', 'https://kakaopay.com/groom');
    });

    it('카카오페이 링크가 없는 경우 송금 버튼을 표시하지 않는다', () => {
      const configWithoutKakaoPay: AccountConfig = {
        groom: [
          {
            bank: '신한은행',
            accountNumber: '110-123-456789',
            holder: '김신랑',
            // kakaoPayLink 없음
          },
        ],
        bride: [],
      };
      
      render(<Account config={configWithoutKakaoPay} />);
      
      // 신랑측 아코디언 열기
      fireEvent.click(screen.getByText('신랑측 계좌'));
      
      expect(screen.queryByRole('link', { name: /카카오페이로 송금하기/i })).not.toBeInTheDocument();
    });

    it('카카오페이 버튼은 새 탭에서 열린다', () => {
      render(<Account config={mockConfig} />);
      
      // 신랑측 아코디언 열기
      fireEvent.click(screen.getByText('신랑측 계좌'));
      
      const kakaoPayButtons = screen.getAllByRole('link', { name: /카카오페이로 송금하기/i });
      expect(kakaoPayButtons[0]).toHaveAttribute('target', '_blank');
      expect(kakaoPayButtons[0]).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('접근성', () => {
    it('섹션에 적절한 aria-labelledby가 있다', () => {
      render(<Account config={mockConfig} />);
      
      const section = screen.getByRole('region', { name: /마음 전하실 곳/i });
      expect(section).toBeInTheDocument();
    });

    it('아코디언 버튼에 aria-expanded 속성이 있다', () => {
      render(<Account config={mockConfig} />);
      
      const groomButton = screen.getByRole('button', { name: '신랑측 계좌' });
      expect(groomButton).toHaveAttribute('aria-expanded', 'false');
      
      fireEvent.click(groomButton);
      expect(groomButton).toHaveAttribute('aria-expanded', 'true');
    });

    it('복사 버튼에 적절한 aria-label이 있다', () => {
      render(<Account config={mockConfig} />);
      
      // 신랑측 아코디언 열기
      fireEvent.click(screen.getByText('신랑측 계좌'));
      
      expect(screen.getByRole('button', { name: '김신랑님 계좌번호 복사하기' })).toBeInTheDocument();
    });
  });
});
