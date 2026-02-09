/**
 * EventInfo 컴포넌트 테스트
 * 
 * Requirements:
 * - 2.1: 결혼식 날짜를 표시
 * - 2.2: 결혼식 시간을 표시
 * - 2.3: 예식장 이름과 홀 정보를 표시
 * - 2.4: D-Day 카운트다운을 표시
 * - 2.5: 캘린더 앱에 일정을 추가할 수 있는 기능을 제공
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EventInfo } from './EventInfo';
import { EventConfig, LocationConfig } from '../types';

// 테스트용 기본 설정
const mockEventConfig: EventConfig = {
  date: '2025-05-15',
  time: '14:00',
  venueName: '그랜드 웨딩홀',
  hallName: '3층 그랜드홀',
  calendarEnabled: true,
};

const mockLocationConfig: LocationConfig = {
  address: '서울시 강남구 테헤란로 123',
  coordinates: {
    lat: 37.5,
    lng: 127.0,
  },
};

describe('EventInfo 컴포넌트', () => {
  // 날짜를 고정하여 D-Day 계산 테스트를 일관되게 수행
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-05-10'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Requirements 2.1: 결혼식 날짜 표시', () => {
    it('결혼식 날짜를 한국어 형식으로 표시한다', () => {
      render(<EventInfo config={mockEventConfig} />);
      
      // 2025년 5월 15일 목요일
      expect(screen.getByText('2025년 5월 15일 목요일')).toBeInTheDocument();
    });

    it('날짜에 적절한 aria-label이 있다', () => {
      render(<EventInfo config={mockEventConfig} />);
      
      expect(screen.getByLabelText(/결혼식 날짜/)).toBeInTheDocument();
    });
  });

  describe('Requirements 2.2: 결혼식 시간 표시', () => {
    it('결혼식 시간을 한국어 형식으로 표시한다 (오후)', () => {
      render(<EventInfo config={mockEventConfig} />);
      
      // 14:00 -> 오후 2시
      expect(screen.getByText('오후 2시')).toBeInTheDocument();
    });

    it('오전 시간을 올바르게 표시한다', () => {
      const morningConfig = { ...mockEventConfig, time: '10:30' };
      render(<EventInfo config={morningConfig} />);
      
      expect(screen.getByText('오전 10시 30분')).toBeInTheDocument();
    });

    it('정오를 올바르게 표시한다', () => {
      const noonConfig = { ...mockEventConfig, time: '12:00' };
      render(<EventInfo config={noonConfig} />);
      
      expect(screen.getByText('오후 12시')).toBeInTheDocument();
    });

    it('자정을 올바르게 표시한다', () => {
      const midnightConfig = { ...mockEventConfig, time: '00:30' };
      render(<EventInfo config={midnightConfig} />);
      
      expect(screen.getByText('오전 12시 30분')).toBeInTheDocument();
    });

    it('시간에 적절한 aria-label이 있다', () => {
      render(<EventInfo config={mockEventConfig} />);
      
      expect(screen.getByLabelText(/결혼식 시간/)).toBeInTheDocument();
    });
  });

  describe('Requirements 2.3: 예식장 이름과 홀 정보 표시', () => {
    it('예식장 이름을 표시한다', () => {
      render(<EventInfo config={mockEventConfig} />);
      
      expect(screen.getByText('그랜드 웨딩홀')).toBeInTheDocument();
    });

    it('홀 이름을 표시한다', () => {
      render(<EventInfo config={mockEventConfig} />);
      
      expect(screen.getByText('3층 그랜드홀')).toBeInTheDocument();
    });

    it('홀 이름이 없으면 표시하지 않는다', () => {
      const configWithoutHall = { ...mockEventConfig, hallName: undefined };
      render(<EventInfo config={configWithoutHall} />);
      
      expect(screen.getByText('그랜드 웨딩홀')).toBeInTheDocument();
      expect(screen.queryByText('3층 그랜드홀')).not.toBeInTheDocument();
    });

    it('예식장에 적절한 aria-label이 있다', () => {
      render(<EventInfo config={mockEventConfig} />);
      
      expect(screen.getByLabelText(/예식장/)).toBeInTheDocument();
    });
  });

  describe('Requirements 2.4: D-Day 카운트다운 표시', () => {
    it('미래 날짜에 대해 D-N 형식으로 표시한다', () => {
      render(<EventInfo config={mockEventConfig} />);
      
      // 2025-05-10에서 2025-05-15까지 5일 남음
      expect(screen.getByText('D-5')).toBeInTheDocument();
    });

    it('오늘이 결혼식인 경우 D-Day를 표시한다', () => {
      vi.setSystemTime(new Date('2025-05-15'));
      render(<EventInfo config={mockEventConfig} />);
      
      expect(screen.getByText('D-Day')).toBeInTheDocument();
    });

    it('과거 날짜에 대해 D+N 형식으로 표시한다', () => {
      vi.setSystemTime(new Date('2025-05-20'));
      render(<EventInfo config={mockEventConfig} />);
      
      // 2025-05-15에서 2025-05-20까지 5일 지남
      expect(screen.getByText('D+5')).toBeInTheDocument();
    });

    it('D-Day에 적절한 aria-label이 있다', () => {
      render(<EventInfo config={mockEventConfig} />);
      
      const ddayElement = screen.getByRole('status');
      expect(ddayElement).toHaveAttribute('aria-label', expect.stringContaining('5일 남았습니다'));
    });
  });

  describe('Requirements 2.5: 캘린더 추가 버튼', () => {
    it('calendarEnabled가 true이고 location이 있으면 캘린더 버튼을 표시한다', () => {
      render(<EventInfo config={mockEventConfig} location={mockLocationConfig} />);
      
      expect(screen.getByRole('link', { name: /캘린더에.*추가/i })).toBeInTheDocument();
    });

    it('캘린더 버튼이 올바른 Google Calendar URL을 가진다', () => {
      render(<EventInfo config={mockEventConfig} location={mockLocationConfig} />);
      
      const calendarLink = screen.getByRole('link', { name: /캘린더에.*추가/i });
      const href = calendarLink.getAttribute('href') || '';
      
      // URL에 필수 파라미터가 포함되어 있는지 확인
      expect(href).toContain('calendar.google.com');
      expect(href).toContain('action=TEMPLATE');
      // URL 디코딩하여 한글 텍스트 확인 (+ 기호를 공백으로 변환)
      const decodedHref = decodeURIComponent(href.replace(/\+/g, ' '));
      expect(decodedHref).toContain('그랜드 웨딩홀');
      expect(decodedHref).toContain('결혼식');
    });

    it('calendarEnabled가 false이면 캘린더 버튼을 표시하지 않는다', () => {
      const configDisabled = { ...mockEventConfig, calendarEnabled: false };
      render(<EventInfo config={configDisabled} location={mockLocationConfig} />);
      
      expect(screen.queryByRole('link', { name: /캘린더에.*추가/i })).not.toBeInTheDocument();
    });

    it('location이 없으면 캘린더 버튼을 표시하지 않는다', () => {
      render(<EventInfo config={mockEventConfig} />);
      
      expect(screen.queryByRole('link', { name: /캘린더에.*추가/i })).not.toBeInTheDocument();
    });

    it('캘린더 버튼이 새 탭에서 열린다', () => {
      render(<EventInfo config={mockEventConfig} location={mockLocationConfig} />);
      
      const calendarLink = screen.getByRole('link', { name: /캘린더에.*추가/i });
      expect(calendarLink).toHaveAttribute('target', '_blank');
      expect(calendarLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('접근성', () => {
    it('섹션에 적절한 aria-labelledby가 있다', () => {
      render(<EventInfo config={mockEventConfig} />);
      
      const section = screen.getByRole('region');
      expect(section).toHaveAttribute('aria-labelledby', 'event-info-title');
    });

    it('섹션 제목이 있다', () => {
      render(<EventInfo config={mockEventConfig} />);
      
      expect(screen.getByRole('heading', { name: '예식 안내' })).toBeInTheDocument();
    });
  });
});
