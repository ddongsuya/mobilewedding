/**
 * 지도 앱 연동 유틸리티 함수 단위 테스트
 * 
 * 네이버 지도와 카카오맵 URL 생성 함수를 검증합니다.
 * Requirements: 4.3, 4.4
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  generateNaverMapUrls,
  generateKakaoMapUrls,
  openNaverMap,
  openKakaoMap
} from './map';

describe('generateNaverMapUrls', () => {
  describe('URL 형식 검증 (URL format validation)', () => {
    it('앱 URL이 nmap:// 스킴으로 시작해야 한다', () => {
      const result = generateNaverMapUrls(37.5665, 126.9780, '서울시청');
      
      expect(result.appUrl).toMatch(/^nmap:\/\//);
    });
    
    it('웹 URL이 https://map.naver.com/v5/search/로 시작해야 한다', () => {
      const result = generateNaverMapUrls(37.5665, 126.9780, '서울시청');
      
      expect(result.webUrl).toMatch(/^https:\/\/map\.naver\.com\/v5\/search\//);
    });
    
    it('앱 URL에 place 경로가 포함되어야 한다', () => {
      const result = generateNaverMapUrls(37.5665, 126.9780, '서울시청');
      
      expect(result.appUrl).toContain('nmap://place?');
    });
  });
  
  describe('좌표 파라미터 검증 (Coordinate parameters validation)', () => {
    it('앱 URL에 위도(lat) 파라미터가 포함되어야 한다', () => {
      const result = generateNaverMapUrls(37.5665, 126.9780, '서울시청');
      
      expect(result.appUrl).toContain('lat=37.5665');
    });
    
    it('앱 URL에 경도(lng) 파라미터가 포함되어야 한다', () => {
      const result = generateNaverMapUrls(37.5665, 126.9780, '서울시청');
      
      expect(result.appUrl).toContain('lng=126.978');
    });
    
    it('음수 좌표를 올바르게 처리해야 한다', () => {
      const result = generateNaverMapUrls(-33.8688, -151.2093, 'Sydney Opera House');
      
      expect(result.appUrl).toContain('lat=-33.8688');
      expect(result.appUrl).toContain('lng=-151.2093');
    });
    
    it('소수점이 많은 좌표를 올바르게 처리해야 한다', () => {
      const result = generateNaverMapUrls(37.566826, 126.978656, '서울시청');
      
      expect(result.appUrl).toContain('lat=37.566826');
      expect(result.appUrl).toContain('lng=126.978656');
    });
  });
  
  describe('장소명 파라미터 검증 (Name parameter validation)', () => {
    it('앱 URL에 인코딩된 장소명이 포함되어야 한다', () => {
      const result = generateNaverMapUrls(37.5665, 126.9780, '서울시청');
      
      expect(result.appUrl).toContain('name=' + encodeURIComponent('서울시청'));
    });
    
    it('웹 URL에 인코딩된 장소명이 포함되어야 한다', () => {
      const result = generateNaverMapUrls(37.5665, 126.9780, '서울시청');
      
      expect(result.webUrl).toContain(encodeURIComponent('서울시청'));
    });
    
    it('특수 문자가 포함된 장소명을 올바르게 인코딩해야 한다', () => {
      const result = generateNaverMapUrls(37.5665, 126.9780, '그랜드 웨딩홀 (3층)');
      
      expect(result.appUrl).toContain(encodeURIComponent('그랜드 웨딩홀 (3층)'));
      expect(result.webUrl).toContain(encodeURIComponent('그랜드 웨딩홀 (3층)'));
    });
    
    it('영문 장소명을 올바르게 처리해야 한다', () => {
      const result = generateNaverMapUrls(37.5665, 126.9780, 'Seoul City Hall');
      
      expect(result.appUrl).toContain('name=Seoul%20City%20Hall');
      expect(result.webUrl).toContain('Seoul%20City%20Hall');
    });
  });
  
  describe('앱 이름 파라미터 검증 (App name parameter validation)', () => {
    it('앱 URL에 appname 파라미터가 포함되어야 한다', () => {
      const result = generateNaverMapUrls(37.5665, 126.9780, '서울시청');
      
      expect(result.appUrl).toContain('appname=wedding-invitation');
    });
  });
  
  describe('반환값 타입 검증 (Return type validation)', () => {
    it('NaverMapUrls 객체를 반환해야 한다', () => {
      const result = generateNaverMapUrls(37.5665, 126.9780, '서울시청');
      
      expect(result).toHaveProperty('appUrl');
      expect(result).toHaveProperty('webUrl');
      expect(typeof result.appUrl).toBe('string');
      expect(typeof result.webUrl).toBe('string');
    });
  });
});

describe('generateKakaoMapUrls', () => {
  describe('URL 형식 검증 (URL format validation)', () => {
    it('앱 URL이 kakaomap:// 스킴으로 시작해야 한다', () => {
      const result = generateKakaoMapUrls(37.5665, 126.9780, '서울시청');
      
      expect(result.appUrl).toMatch(/^kakaomap:\/\//);
    });
    
    it('웹 URL이 https://map.kakao.com/link/map/으로 시작해야 한다', () => {
      const result = generateKakaoMapUrls(37.5665, 126.9780, '서울시청');
      
      expect(result.webUrl).toMatch(/^https:\/\/map\.kakao\.com\/link\/map\//);
    });
    
    it('앱 URL에 look 경로가 포함되어야 한다', () => {
      const result = generateKakaoMapUrls(37.5665, 126.9780, '서울시청');
      
      expect(result.appUrl).toContain('kakaomap://look?');
    });
  });
  
  describe('좌표 파라미터 검증 (Coordinate parameters validation)', () => {
    it('앱 URL에 p 파라미터로 좌표가 포함되어야 한다', () => {
      const result = generateKakaoMapUrls(37.5665, 126.9780, '서울시청');
      
      expect(result.appUrl).toContain('p=37.5665,126.978');
    });
    
    it('웹 URL에 좌표가 포함되어야 한다', () => {
      const result = generateKakaoMapUrls(37.5665, 126.9780, '서울시청');
      
      expect(result.webUrl).toContain(',37.5665,126.978');
    });
    
    it('음수 좌표를 올바르게 처리해야 한다', () => {
      const result = generateKakaoMapUrls(-33.8688, -151.2093, 'Sydney Opera House');
      
      expect(result.appUrl).toContain('p=-33.8688,-151.2093');
      expect(result.webUrl).toContain(',-33.8688,-151.2093');
    });
    
    it('소수점이 많은 좌표를 올바르게 처리해야 한다', () => {
      const result = generateKakaoMapUrls(37.566826, 126.978656, '서울시청');
      
      expect(result.appUrl).toContain('p=37.566826,126.978656');
    });
  });
  
  describe('장소명 파라미터 검증 (Name parameter validation)', () => {
    it('웹 URL에 인코딩된 장소명이 포함되어야 한다', () => {
      const result = generateKakaoMapUrls(37.5665, 126.9780, '서울시청');
      
      expect(result.webUrl).toContain(encodeURIComponent('서울시청'));
    });
    
    it('특수 문자가 포함된 장소명을 올바르게 인코딩해야 한다', () => {
      const result = generateKakaoMapUrls(37.5665, 126.9780, '그랜드 웨딩홀 (3층)');
      
      expect(result.webUrl).toContain(encodeURIComponent('그랜드 웨딩홀 (3층)'));
    });
    
    it('영문 장소명을 올바르게 처리해야 한다', () => {
      const result = generateKakaoMapUrls(37.5665, 126.9780, 'Seoul City Hall');
      
      expect(result.webUrl).toContain('Seoul%20City%20Hall');
    });
  });
  
  describe('반환값 타입 검증 (Return type validation)', () => {
    it('KakaoMapUrls 객체를 반환해야 한다', () => {
      const result = generateKakaoMapUrls(37.5665, 126.9780, '서울시청');
      
      expect(result).toHaveProperty('appUrl');
      expect(result).toHaveProperty('webUrl');
      expect(typeof result.appUrl).toBe('string');
      expect(typeof result.webUrl).toBe('string');
    });
  });
});

describe('openNaverMap', () => {
  let originalLocation: Location;
  let mockLocationHref: string;
  
  beforeEach(() => {
    vi.useFakeTimers();
    
    // window.location.href를 모킹
    originalLocation = window.location;
    mockLocationHref = '';
    
    // @ts-ignore - 테스트를 위한 location 모킹
    delete window.location;
    // @ts-ignore
    window.location = {
      ...originalLocation,
      get href() {
        return mockLocationHref;
      },
      set href(value: string) {
        mockLocationHref = value;
      }
    };
  });
  
  afterEach(() => {
    vi.useRealTimers();
    // @ts-ignore
    window.location = originalLocation;
  });
  
  it('먼저 앱 URL로 이동해야 한다', () => {
    openNaverMap(37.5665, 126.9780, '서울시청');
    
    expect(mockLocationHref).toMatch(/^nmap:\/\//);
  });
  
  it('500ms 후 웹 URL로 폴백해야 한다', () => {
    openNaverMap(37.5665, 126.9780, '서울시청');
    
    // 초기에는 앱 URL
    expect(mockLocationHref).toMatch(/^nmap:\/\//);
    
    // 500ms 후 웹 URL로 변경
    vi.advanceTimersByTime(500);
    expect(mockLocationHref).toMatch(/^https:\/\/map\.naver\.com/);
  });
  
  it('올바른 좌표와 장소명으로 URL을 생성해야 한다', () => {
    openNaverMap(37.5665, 126.9780, '그랜드 웨딩홀');
    
    expect(mockLocationHref).toContain('lat=37.5665');
    expect(mockLocationHref).toContain('lng=126.978');
    expect(mockLocationHref).toContain(encodeURIComponent('그랜드 웨딩홀'));
  });
});

describe('openKakaoMap', () => {
  let originalLocation: Location;
  let mockLocationHref: string;
  
  beforeEach(() => {
    vi.useFakeTimers();
    
    // window.location.href를 모킹
    originalLocation = window.location;
    mockLocationHref = '';
    
    // @ts-ignore - 테스트를 위한 location 모킹
    delete window.location;
    // @ts-ignore
    window.location = {
      ...originalLocation,
      get href() {
        return mockLocationHref;
      },
      set href(value: string) {
        mockLocationHref = value;
      }
    };
  });
  
  afterEach(() => {
    vi.useRealTimers();
    // @ts-ignore
    window.location = originalLocation;
  });
  
  it('먼저 앱 URL로 이동해야 한다', () => {
    openKakaoMap(37.5665, 126.9780, '서울시청');
    
    expect(mockLocationHref).toMatch(/^kakaomap:\/\//);
  });
  
  it('500ms 후 웹 URL로 폴백해야 한다', () => {
    openKakaoMap(37.5665, 126.9780, '서울시청');
    
    // 초기에는 앱 URL
    expect(mockLocationHref).toMatch(/^kakaomap:\/\//);
    
    // 500ms 후 웹 URL로 변경
    vi.advanceTimersByTime(500);
    expect(mockLocationHref).toMatch(/^https:\/\/map\.kakao\.com/);
  });
  
  it('올바른 좌표와 장소명으로 URL을 생성해야 한다', () => {
    openKakaoMap(37.5665, 126.9780, '그랜드 웨딩홀');
    
    expect(mockLocationHref).toContain('p=37.5665,126.978');
    
    // 500ms 후 웹 URL 확인
    vi.advanceTimersByTime(500);
    expect(mockLocationHref).toContain(encodeURIComponent('그랜드 웨딩홀'));
  });
});

describe('엣지 케이스 (Edge cases)', () => {
  describe('빈 장소명 처리', () => {
    it('네이버 지도: 빈 장소명을 처리해야 한다', () => {
      const result = generateNaverMapUrls(37.5665, 126.9780, '');
      
      expect(result.appUrl).toContain('name=');
      expect(result.webUrl).toBe('https://map.naver.com/v5/search/');
    });
    
    it('카카오맵: 빈 장소명을 처리해야 한다', () => {
      const result = generateKakaoMapUrls(37.5665, 126.9780, '');
      
      expect(result.webUrl).toContain('/link/map/,');
    });
  });
  
  describe('경계값 좌표 처리', () => {
    it('네이버 지도: 0,0 좌표를 처리해야 한다', () => {
      const result = generateNaverMapUrls(0, 0, '원점');
      
      expect(result.appUrl).toContain('lat=0');
      expect(result.appUrl).toContain('lng=0');
    });
    
    it('카카오맵: 0,0 좌표를 처리해야 한다', () => {
      const result = generateKakaoMapUrls(0, 0, '원점');
      
      expect(result.appUrl).toContain('p=0,0');
    });
    
    it('네이버 지도: 극단적인 좌표값을 처리해야 한다', () => {
      const result = generateNaverMapUrls(90, 180, '북극점');
      
      expect(result.appUrl).toContain('lat=90');
      expect(result.appUrl).toContain('lng=180');
    });
    
    it('카카오맵: 극단적인 좌표값을 처리해야 한다', () => {
      const result = generateKakaoMapUrls(-90, -180, '남극점');
      
      expect(result.appUrl).toContain('p=-90,-180');
    });
  });
  
  describe('특수 문자 장소명 처리', () => {
    it('네이버 지도: &, =, ? 등 URL 특수 문자를 인코딩해야 한다', () => {
      const result = generateNaverMapUrls(37.5665, 126.9780, 'A&B=C?D');
      
      expect(result.appUrl).toContain(encodeURIComponent('A&B=C?D'));
      expect(result.webUrl).toContain(encodeURIComponent('A&B=C?D'));
    });
    
    it('카카오맵: &, =, ? 등 URL 특수 문자를 인코딩해야 한다', () => {
      const result = generateKakaoMapUrls(37.5665, 126.9780, 'A&B=C?D');
      
      expect(result.webUrl).toContain(encodeURIComponent('A&B=C?D'));
    });
    
    it('네이버 지도: 한글과 영문 혼합 장소명을 처리해야 한다', () => {
      const result = generateNaverMapUrls(37.5665, 126.9780, '서울 Grand Hotel');
      
      expect(result.appUrl).toContain(encodeURIComponent('서울 Grand Hotel'));
    });
    
    it('카카오맵: 한글과 영문 혼합 장소명을 처리해야 한다', () => {
      const result = generateKakaoMapUrls(37.5665, 126.9780, '서울 Grand Hotel');
      
      expect(result.webUrl).toContain(encodeURIComponent('서울 Grand Hotel'));
    });
  });
});
