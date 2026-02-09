/**
 * 날짜 관련 유틸리티 함수
 * 
 * D-Day 계산 및 날짜 관련 기능을 제공합니다.
 * Requirements: 2.4, 2.5
 */

import { DdayResult, EventConfig, LocationConfig } from '../types';

/**
 * D-Day 계산 함수
 * 
 * 주어진 이벤트 날짜와 오늘 날짜의 차이를 계산합니다.
 * 
 * @param eventDate - 이벤트 날짜 (ISO 8601 format: YYYY-MM-DD)
 * @returns DdayResult - 남은 일수, 과거 여부, 오늘 여부를 포함한 결과
 * 
 * @example
 * // 미래 날짜
 * calculateDDay('2025-12-25') // { days: 10, isPast: false, isToday: false }
 * 
 * // 오늘 날짜
 * calculateDDay('2025-01-15') // { days: 0, isPast: false, isToday: true }
 * 
 * // 과거 날짜
 * calculateDDay('2024-12-01') // { days: 45, isPast: true, isToday: false }
 * 
 * **Validates: Requirements 2.4**
 */
export function calculateDDay(eventDate: string): DdayResult {
  const event = new Date(eventDate);
  const today = new Date();
  
  // 시간을 00:00:00으로 설정하여 날짜만 비교
  today.setHours(0, 0, 0, 0);
  event.setHours(0, 0, 0, 0);
  
  // 밀리초 단위 차이 계산
  const diffTime = event.getTime() - today.getTime();
  
  // 일 단위로 변환 (1일 = 24 * 60 * 60 * 1000 밀리초)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return {
    days: Math.abs(diffDays),
    isPast: diffDays < 0,
    isToday: diffDays === 0
  };
}

/**
 * Google Calendar URL 생성 함수
 * 
 * 결혼식 이벤트 정보를 기반으로 Google Calendar에 일정을 추가할 수 있는 URL을 생성합니다.
 * 
 * @param event - 결혼식 이벤트 설정 (날짜, 시간, 장소명, 홀 이름)
 * @param location - 위치 설정 (주소)
 * @returns Google Calendar URL 문자열
 * 
 * @example
 * const event = { date: '2025-05-15', time: '14:00', venueName: '그랜드 웨딩홀', hallName: '3층 그랜드홀', calendarEnabled: true };
 * const location = { address: '서울시 강남구 테헤란로 123', coordinates: { lat: 37.5, lng: 127.0 } };
 * generateCalendarUrl(event, location);
 * // Returns: "https://calendar.google.com/calendar/render?action=TEMPLATE&text=그랜드+웨딩홀+결혼식&dates=20250515T050000Z/20250515T070000Z&location=서울시+강남구+테헤란로+123&details=3층+그랜드홀"
 * 
 * **Validates: Requirements 2.5**
 */
export function generateCalendarUrl(event: EventConfig, location: LocationConfig): string {
  // 시작 시간 생성 (날짜 + 시간)
  const startDate = new Date(`${event.date}T${event.time}`);
  
  // 종료 시간 생성 (시작 시간 + 2시간)
  const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
  
  /**
   * Google Calendar에서 요구하는 날짜 형식으로 변환
   * 형식: YYYYMMDDTHHmmssZ (UTC 시간)
   * 
   * @param date - 변환할 Date 객체
   * @returns 포맷된 날짜 문자열
   */
  const formatDate = (date: Date): string => 
    date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  
  // URL 파라미터 생성
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${event.venueName} 결혼식`,
    dates: `${formatDate(startDate)}/${formatDate(endDate)}`,
    location: location.address,
    details: `${event.hallName || ''}`
  });
  
  return `https://calendar.google.com/calendar/render?${params}`;
}
