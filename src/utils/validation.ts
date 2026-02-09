/**
 * 유효성 검사 관련 유틸리티 함수
 * 
 * 방명록 및 RSVP 입력 데이터의 유효성을 검사하는 기능을 제공합니다.
 * Requirements: 6.3, 7.4
 */

import type { GuestbookInput, RsvpInput, ValidationResult } from '../types';

/**
 * 방명록 입력 데이터의 유효성을 검사하는 함수
 * 
 * 이름, 비밀번호, 메시지 필드의 유효성을 검사하고
 * 오류가 있는 경우 해당 필드에 대한 오류 메시지를 반환합니다.
 * 
 * @param input - 검사할 방명록 입력 데이터
 * @returns ValidationResult - 유효성 검사 결과 (isValid, errors)
 * 
 * @example
 * // 유효한 입력
 * const result = validateGuestbookInput({
 *   name: '홍길동',
 *   password: '1234',
 *   message: '결혼 축하합니다!'
 * });
 * // Returns: { isValid: true, errors: {} }
 * 
 * @example
 * // 빈 필드가 있는 경우 (Requirements 6.3)
 * const result = validateGuestbookInput({
 *   name: '',
 *   password: '12',
 *   message: '   '
 * });
 * // Returns: { 
 * //   isValid: false, 
 * //   errors: { 
 * //     name: '이름을 입력해주세요',
 * //     password: '비밀번호는 4자 이상이어야 합니다',
 * //     message: '메시지를 입력해주세요'
 * //   } 
 * // }
 * 
 * **Validates: Requirements 6.3**
 */
export function validateGuestbookInput(input: GuestbookInput): ValidationResult {
  const errors: Record<string, string> = {};
  
  // 이름 유효성 검사: 비어있거나 공백만 있으면 오류
  if (!input.name || input.name.trim().length === 0) {
    errors.name = '이름을 입력해주세요';
  }
  
  // 비밀번호 유효성 검사: 비어있거나 4자 미만이면 오류
  if (!input.password || input.password.length < 4) {
    errors.password = '비밀번호는 4자 이상이어야 합니다';
  }
  
  // 메시지 유효성 검사: 비어있거나 공백만 있으면 오류
  if (!input.message || input.message.trim().length === 0) {
    errors.message = '메시지를 입력해주세요';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * RSVP 입력 데이터의 유효성을 검사하는 함수
 * 
 * 이름, 연락처, 참석 인원 필드의 유효성을 검사하고
 * 오류가 있는 경우 해당 필드에 대한 오류 메시지를 반환합니다.
 * 
 * @param input - 검사할 RSVP 입력 데이터
 * @returns ValidationResult - 유효성 검사 결과 (isValid, errors)
 * 
 * @example
 * // 유효한 입력
 * const result = validateRsvpInput({
 *   name: '홍길동',
 *   phone: '010-1234-5678',
 *   attending: true,
 *   guestCount: 2
 * });
 * // Returns: { isValid: true, errors: {} }
 * 
 * @example
 * // 필수 항목 누락 (Requirements 7.4)
 * const result = validateRsvpInput({
 *   name: '',
 *   phone: '123',
 *   attending: true,
 *   guestCount: 0
 * });
 * // Returns: { 
 * //   isValid: false, 
 * //   errors: { 
 * //     name: '이름을 입력해주세요',
 * //     phone: '올바른 연락처를 입력해주세요',
 * //     guestCount: '참석 인원을 선택해주세요'
 * //   } 
 * // }
 * 
 * **Validates: Requirements 7.4**
 */
export function validateRsvpInput(input: RsvpInput): ValidationResult {
  const errors: Record<string, string> = {};
  
  // 이름 유효성 검사: 비어있거나 공백만 있으면 오류
  if (!input.name || input.name.trim().length === 0) {
    errors.name = '이름을 입력해주세요';
  }
  
  // 연락처 유효성 검사: 한국 휴대폰 번호 형식 검증
  // 형식: 01X-XXXX-XXXX 또는 01XXXXXXXXX (하이픈 선택)
  if (!input.phone || !/^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/.test(input.phone)) {
    errors.phone = '올바른 연락처를 입력해주세요';
  }
  
  // 참석 인원 유효성 검사: 참석하는 경우 인원이 1명 이상이어야 함
  if (input.attending && input.guestCount < 1) {
    errors.guestCount = '참석 인원을 선택해주세요';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
