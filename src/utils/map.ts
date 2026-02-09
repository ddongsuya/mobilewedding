/**
 * 지도 앱 연동 유틸리티 함수
 * 
 * 네이버 지도와 카카오맵 앱/웹으로 연결하는 기능을 제공합니다.
 * Requirements: 4.3, 4.4
 */

/**
 * 네이버 지도 앱 URL 생성 결과 인터페이스
 */
export interface NaverMapUrls {
  /** 네이버 지도 앱 URL (nmap:// 스킴) */
  appUrl: string;
  /** 네이버 지도 웹 URL (폴백용) */
  webUrl: string;
}

/**
 * 카카오맵 앱 URL 생성 결과 인터페이스
 */
export interface KakaoMapUrls {
  /** 카카오맵 앱 URL (kakaomap:// 스킴) */
  appUrl: string;
  /** 카카오맵 웹 URL (폴백용) */
  webUrl: string;
}

/**
 * 네이버 지도 URL을 생성하는 함수
 * 
 * 앱 URL과 웹 URL을 모두 생성하여 반환합니다.
 * 앱이 설치되어 있지 않은 경우 웹 URL로 폴백할 수 있습니다.
 * 
 * @param lat - 위도 (latitude)
 * @param lng - 경도 (longitude)
 * @param name - 장소명
 * @returns NaverMapUrls - 앱 URL과 웹 URL을 포함한 객체
 * 
 * @example
 * const urls = generateNaverMapUrls(37.5665, 126.9780, '서울시청');
 * console.log(urls.appUrl);  // nmap://place?lat=37.5665&lng=126.978&name=...
 * console.log(urls.webUrl);  // https://map.naver.com/v5/search/...
 * 
 * **Validates: Requirements 4.3**
 */
export function generateNaverMapUrls(lat: number, lng: number, name: string): NaverMapUrls {
  const encodedName = encodeURIComponent(name);
  
  const appUrl = `nmap://place?lat=${lat}&lng=${lng}&name=${encodedName}&appname=wedding-invitation`;
  const webUrl = `https://map.naver.com/v5/search/${encodedName}`;
  
  return { appUrl, webUrl };
}

/**
 * 카카오맵 URL을 생성하는 함수
 * 
 * 앱 URL과 웹 URL을 모두 생성하여 반환합니다.
 * 앱이 설치되어 있지 않은 경우 웹 URL로 폴백할 수 있습니다.
 * 
 * @param lat - 위도 (latitude)
 * @param lng - 경도 (longitude)
 * @param name - 장소명
 * @returns KakaoMapUrls - 앱 URL과 웹 URL을 포함한 객체
 * 
 * @example
 * const urls = generateKakaoMapUrls(37.5665, 126.9780, '서울시청');
 * console.log(urls.appUrl);  // kakaomap://look?p=37.5665,126.978
 * console.log(urls.webUrl);  // https://map.kakao.com/link/map/...
 * 
 * **Validates: Requirements 4.4**
 */
export function generateKakaoMapUrls(lat: number, lng: number, name: string): KakaoMapUrls {
  const encodedName = encodeURIComponent(name);
  
  const appUrl = `kakaomap://look?p=${lat},${lng}`;
  const webUrl = `https://map.kakao.com/link/map/${encodedName},${lat},${lng}`;
  
  return { appUrl, webUrl };
}

/**
 * 네이버 지도 앱 또는 웹으로 연결하는 함수
 * 
 * 먼저 네이버 지도 앱 URL로 이동을 시도하고,
 * 앱이 설치되어 있지 않은 경우 500ms 후 웹 URL로 폴백합니다.
 * 
 * @param lat - 위도 (latitude)
 * @param lng - 경도 (longitude)
 * @param name - 장소명
 * 
 * @example
 * // 예식장 위치로 네이버 지도 열기
 * openNaverMap(37.5665, 126.9780, '그랜드 웨딩홀');
 * 
 * **Validates: Requirements 4.3**
 */
export function openNaverMap(lat: number, lng: number, name: string): void {
  const { appUrl, webUrl } = generateNaverMapUrls(lat, lng, name);
  
  window.location.href = appUrl;
  setTimeout(() => {
    window.location.href = webUrl;
  }, 500);
}

/**
 * 카카오맵 앱 또는 웹으로 연결하는 함수
 * 
 * 먼저 카카오맵 앱 URL로 이동을 시도하고,
 * 앱이 설치되어 있지 않은 경우 500ms 후 웹 URL로 폴백합니다.
 * 
 * @param lat - 위도 (latitude)
 * @param lng - 경도 (longitude)
 * @param name - 장소명
 * 
 * @example
 * // 예식장 위치로 카카오맵 열기
 * openKakaoMap(37.5665, 126.9780, '그랜드 웨딩홀');
 * 
 * **Validates: Requirements 4.4**
 */
export function openKakaoMap(lat: number, lng: number, name: string): void {
  const { appUrl, webUrl } = generateKakaoMapUrls(lat, lng, name);
  
  window.location.href = appUrl;
  setTimeout(() => {
    window.location.href = webUrl;
  }, 500);
}
