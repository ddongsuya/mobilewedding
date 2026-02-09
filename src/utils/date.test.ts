/**
 * D-Day 계산 함수 단위 테스트
 * 
 * calculateDDay 함수의 기본 기능을 검증합니다.
 * Requirements: 2.4
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { calculateDDay } from './date';

describe('calculateDDay', () => {
  // 테스트를 위해 현재 날짜를 고정
  const MOCK_TODAY = new Date('2025-01-15T00:00:00.000Z');
  
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(MOCK_TODAY);
  });
  
  afterEach(() => {
    vi.useRealTimers();
  });
  
  describe('미래 날짜 (Future dates)', () => {
    it('미래 날짜에 대해 올바른 일수를 계산해야 한다', () => {
      const result = calculateDDay('2025-01-20');
      
      expect(result.days).toBe(5);
      expect(result.isPast).toBe(false);
      expect(result.isToday).toBe(false);
    });
    
    it('한 달 후 날짜에 대해 올바른 일수를 계산해야 한다', () => {
      const result = calculateDDay('2025-02-15');
      
      expect(result.days).toBe(31);
      expect(result.isPast).toBe(false);
      expect(result.isToday).toBe(false);
    });
    
    it('1년 후 날짜에 대해 올바른 일수를 계산해야 한다', () => {
      const result = calculateDDay('2026-01-15');
      
      expect(result.days).toBe(365);
      expect(result.isPast).toBe(false);
      expect(result.isToday).toBe(false);
    });
    
    it('내일 날짜에 대해 1일을 반환해야 한다', () => {
      const result = calculateDDay('2025-01-16');
      
      expect(result.days).toBe(1);
      expect(result.isPast).toBe(false);
      expect(result.isToday).toBe(false);
    });
  });
  
  describe('오늘 날짜 (Today)', () => {
    it('오늘 날짜에 대해 isToday가 true여야 한다', () => {
      const result = calculateDDay('2025-01-15');
      
      expect(result.days).toBe(0);
      expect(result.isPast).toBe(false);
      expect(result.isToday).toBe(true);
    });
  });
  
  describe('과거 날짜 (Past dates)', () => {
    it('과거 날짜에 대해 isPast가 true여야 한다', () => {
      const result = calculateDDay('2025-01-10');
      
      expect(result.days).toBe(5);
      expect(result.isPast).toBe(true);
      expect(result.isToday).toBe(false);
    });
    
    it('어제 날짜에 대해 1일을 반환해야 한다', () => {
      const result = calculateDDay('2025-01-14');
      
      expect(result.days).toBe(1);
      expect(result.isPast).toBe(true);
      expect(result.isToday).toBe(false);
    });
    
    it('한 달 전 날짜에 대해 올바른 일수를 계산해야 한다', () => {
      const result = calculateDDay('2024-12-15');
      
      expect(result.days).toBe(31);
      expect(result.isPast).toBe(true);
      expect(result.isToday).toBe(false);
    });
    
    it('1년 전 날짜에 대해 올바른 일수를 계산해야 한다', () => {
      const result = calculateDDay('2024-01-15');
      
      // 2024년은 윤년이므로 366일
      expect(result.days).toBe(366);
      expect(result.isPast).toBe(true);
      expect(result.isToday).toBe(false);
    });
  });
  
  describe('엣지 케이스 (Edge cases)', () => {
    it('윤년 2월 29일을 올바르게 처리해야 한다', () => {
      // 2024년은 윤년
      const result = calculateDDay('2024-02-29');
      
      expect(result.isPast).toBe(true);
      expect(result.days).toBeGreaterThan(0);
    });
    
    it('연말 날짜를 올바르게 처리해야 한다', () => {
      const result = calculateDDay('2025-12-31');
      
      expect(result.isPast).toBe(false);
      expect(result.isToday).toBe(false);
      expect(result.days).toBe(350); // 1월 15일부터 12월 31일까지
    });
    
    it('연초 날짜를 올바르게 처리해야 한다', () => {
      const result = calculateDDay('2025-01-01');
      
      expect(result.isPast).toBe(true);
      expect(result.days).toBe(14);
    });
  });
  
  describe('반환값 타입 검증 (Return type validation)', () => {
    it('days는 항상 0 이상의 정수여야 한다', () => {
      const futureResult = calculateDDay('2025-02-01');
      const pastResult = calculateDDay('2024-12-01');
      const todayResult = calculateDDay('2025-01-15');
      
      expect(futureResult.days).toBeGreaterThanOrEqual(0);
      expect(pastResult.days).toBeGreaterThanOrEqual(0);
      expect(todayResult.days).toBeGreaterThanOrEqual(0);
      
      expect(Number.isInteger(futureResult.days)).toBe(true);
      expect(Number.isInteger(pastResult.days)).toBe(true);
      expect(Number.isInteger(todayResult.days)).toBe(true);
    });
    
    it('isPast와 isToday는 boolean이어야 한다', () => {
      const result = calculateDDay('2025-01-20');
      
      expect(typeof result.isPast).toBe('boolean');
      expect(typeof result.isToday).toBe('boolean');
    });
    
    it('isPast와 isToday는 동시에 true일 수 없다', () => {
      const futureResult = calculateDDay('2025-02-01');
      const pastResult = calculateDDay('2024-12-01');
      const todayResult = calculateDDay('2025-01-15');
      
      // 미래: isPast=false, isToday=false
      expect(futureResult.isPast && futureResult.isToday).toBe(false);
      
      // 과거: isPast=true, isToday=false
      expect(pastResult.isPast && pastResult.isToday).toBe(false);
      
      // 오늘: isPast=false, isToday=true
      expect(todayResult.isPast && todayResult.isToday).toBe(false);
    });
  });
});


/**
 * 캘린더 URL 생성 함수 단위 테스트
 * 
 * generateCalendarUrl 함수의 기본 기능을 검증합니다.
 * Requirements: 2.5
 */

import { generateCalendarUrl } from './date';
import { EventConfig, LocationConfig } from '../types';

describe('generateCalendarUrl', () => {
  // 테스트용 기본 이벤트 설정
  const baseEvent: EventConfig = {
    date: '2025-05-15',
    time: '14:00',
    venueName: '그랜드 웨딩홀',
    hallName: '3층 그랜드홀',
    calendarEnabled: true
  };
  
  // 테스트용 기본 위치 설정
  const baseLocation: LocationConfig = {
    address: '서울시 강남구 테헤란로 123',
    coordinates: {
      lat: 37.5,
      lng: 127.0
    }
  };
  
  describe('URL 형식 검증 (URL format validation)', () => {
    it('Google Calendar URL 기본 형식을 가져야 한다', () => {
      const url = generateCalendarUrl(baseEvent, baseLocation);
      
      expect(url).toMatch(/^https:\/\/calendar\.google\.com\/calendar\/render\?/);
    });
    
    it('action=TEMPLATE 파라미터를 포함해야 한다', () => {
      const url = generateCalendarUrl(baseEvent, baseLocation);
      
      expect(url).toContain('action=TEMPLATE');
    });
  });
  
  describe('필수 파라미터 검증 (Required parameters validation)', () => {
    it('text 파라미터에 예식장 이름과 "결혼식"을 포함해야 한다', () => {
      const url = generateCalendarUrl(baseEvent, baseLocation);
      const urlObj = new URL(url);
      const text = urlObj.searchParams.get('text');
      
      expect(text).toBe('그랜드 웨딩홀 결혼식');
    });
    
    it('dates 파라미터를 포함해야 한다', () => {
      const url = generateCalendarUrl(baseEvent, baseLocation);
      const urlObj = new URL(url);
      const dates = urlObj.searchParams.get('dates');
      
      expect(dates).toBeTruthy();
      expect(dates).toContain('/'); // 시작/종료 날짜 구분자
    });
    
    it('location 파라미터에 주소를 포함해야 한다', () => {
      const url = generateCalendarUrl(baseEvent, baseLocation);
      const urlObj = new URL(url);
      const location = urlObj.searchParams.get('location');
      
      expect(location).toBe('서울시 강남구 테헤란로 123');
    });
    
    it('details 파라미터에 홀 이름을 포함해야 한다', () => {
      const url = generateCalendarUrl(baseEvent, baseLocation);
      const urlObj = new URL(url);
      const details = urlObj.searchParams.get('details');
      
      expect(details).toBe('3층 그랜드홀');
    });
  });
  
  describe('날짜/시간 형식 검증 (Date/time format validation)', () => {
    it('dates 파라미터가 올바른 형식이어야 한다 (YYYYMMDDTHHmmssZ)', () => {
      const url = generateCalendarUrl(baseEvent, baseLocation);
      const urlObj = new URL(url);
      const dates = urlObj.searchParams.get('dates');
      
      // 형식: YYYYMMDDTHHmmssZ/YYYYMMDDTHHmmssZ
      expect(dates).toMatch(/^\d{8}T\d{6}Z\/\d{8}T\d{6}Z$/);
    });
    
    it('종료 시간이 시작 시간보다 2시간 후여야 한다', () => {
      const url = generateCalendarUrl(baseEvent, baseLocation);
      const urlObj = new URL(url);
      const dates = urlObj.searchParams.get('dates');
      
      const [startStr, endStr] = dates!.split('/');
      
      // 날짜 문자열을 파싱하여 시간 차이 계산
      const parseGoogleDate = (str: string): Date => {
        const year = parseInt(str.substring(0, 4));
        const month = parseInt(str.substring(4, 6)) - 1;
        const day = parseInt(str.substring(6, 8));
        const hour = parseInt(str.substring(9, 11));
        const minute = parseInt(str.substring(11, 13));
        const second = parseInt(str.substring(13, 15));
        return new Date(Date.UTC(year, month, day, hour, minute, second));
      };
      
      const startDate = parseGoogleDate(startStr);
      const endDate = parseGoogleDate(endStr);
      
      const diffHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
      expect(diffHours).toBe(2);
    });
  });
  
  describe('선택적 필드 처리 (Optional fields handling)', () => {
    it('hallName이 없을 때 details가 빈 문자열이어야 한다', () => {
      const eventWithoutHall: EventConfig = {
        ...baseEvent,
        hallName: undefined
      };
      
      const url = generateCalendarUrl(eventWithoutHall, baseLocation);
      const urlObj = new URL(url);
      const details = urlObj.searchParams.get('details');
      
      expect(details).toBe('');
    });
  });
  
  describe('다양한 입력값 처리 (Various input handling)', () => {
    it('다른 날짜와 시간으로 올바른 URL을 생성해야 한다', () => {
      const event: EventConfig = {
        date: '2025-12-25',
        time: '11:30',
        venueName: '크리스마스 웨딩홀',
        hallName: '루돌프홀',
        calendarEnabled: true
      };
      
      const location: LocationConfig = {
        address: '서울시 종로구 세종대로 1',
        coordinates: { lat: 37.5, lng: 126.9 }
      };
      
      const url = generateCalendarUrl(event, location);
      const urlObj = new URL(url);
      
      expect(urlObj.searchParams.get('text')).toBe('크리스마스 웨딩홀 결혼식');
      expect(urlObj.searchParams.get('location')).toBe('서울시 종로구 세종대로 1');
      expect(urlObj.searchParams.get('details')).toBe('루돌프홀');
    });
    
    it('특수 문자가 포함된 주소를 올바르게 인코딩해야 한다', () => {
      const location: LocationConfig = {
        address: '서울시 강남구 테헤란로 123 (역삼동)',
        coordinates: { lat: 37.5, lng: 127.0 }
      };
      
      const url = generateCalendarUrl(baseEvent, location);
      
      // URL이 유효한지 확인 (파싱 가능해야 함)
      expect(() => new URL(url)).not.toThrow();
      
      // 주소가 올바르게 인코딩되어 있는지 확인
      const urlObj = new URL(url);
      expect(urlObj.searchParams.get('location')).toBe('서울시 강남구 테헤란로 123 (역삼동)');
    });
  });
});
