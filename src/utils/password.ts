/**
 * 비밀번호 해싱 관련 유틸리티 함수
 * 
 * 비밀번호를 SHA-256으로 해싱하고 검증하는 기능을 제공합니다.
 * Requirements: 6.4, 6.5, 10.4
 */

/**
 * 비밀번호를 SHA-256으로 해싱하는 함수
 * 
 * Web Crypto API를 사용하여 비밀번호를 안전하게 해싱합니다.
 * 
 * @param password - 해싱할 비밀번호 문자열
 * @returns Promise<string> - 16진수 문자열로 인코딩된 해시값
 * 
 * @example
 * // 방명록 메시지 저장 시 비밀번호 해싱 (Requirements 10.4)
 * const hash = await hashPassword('myPassword123');
 * // Returns: "a1b2c3d4e5f6..." (64자리 16진수 문자열)
 * 
 * **Validates: Requirements 10.4**
 */
export async function hashPassword(password: string): Promise<string> {
  // TextEncoder를 사용하여 문자열을 UTF-8 바이트 배열로 변환
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  
  // Web Crypto API를 사용하여 SHA-256 해시 생성
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  
  // ArrayBuffer를 Uint8Array로 변환
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  
  // 각 바이트를 2자리 16진수 문자열로 변환하여 연결
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * 비밀번호와 해시값을 비교하여 검증하는 함수
 * 
 * 입력된 비밀번호를 해싱하여 저장된 해시값과 비교합니다.
 * 
 * @param password - 검증할 비밀번호 문자열
 * @param hash - 저장된 해시값 (16진수 문자열)
 * @returns Promise<boolean> - 비밀번호가 일치하면 true, 아니면 false
 * 
 * @example
 * // 방명록 메시지 삭제 시 비밀번호 검증 (Requirements 6.4, 6.5)
 * const isValid = await verifyPassword('myPassword123', storedHash);
 * if (isValid) {
 *   // 메시지 삭제 진행
 * } else {
 *   // 비밀번호 오류 메시지 표시
 * }
 * 
 * **Validates: Requirements 6.4, 6.5**
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // 입력된 비밀번호를 해싱
  const inputHash = await hashPassword(password);
  
  // 해시값 비교
  return inputHash === hash;
}
