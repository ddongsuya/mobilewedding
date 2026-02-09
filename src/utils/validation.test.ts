/**
 * 유효성 검사 함수 단위 테스트
 * 
 * validateGuestbookInput, validateRsvpInput 함수의 기본 기능을 검증합니다.
 * Requirements: 6.3, 7.4
 */

import { describe, it, expect } from 'vitest';
import { validateGuestbookInput, validateRsvpInput } from './validation';
import type { GuestbookInput, RsvpInput } from '../types';

describe('validateGuestbookInput', () => {
  describe('유효한 입력 (Valid input)', () => {
    it('모든 필드가 올바르게 입력되면 isValid가 true여야 한다', () => {
      const input: GuestbookInput = {
        name: '홍길동',
        password: '1234',
        message: '결혼 축하합니다!'
      };
      
      const result = validateGuestbookInput(input);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });
    
    it('영문 이름과 메시지도 유효해야 한다', () => {
      const input: GuestbookInput = {
        name: 'John Doe',
        password: 'pass1234',
        message: 'Congratulations on your wedding!'
      };
      
      const result = validateGuestbookInput(input);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });
    
    it('특수 문자가 포함된 입력도 유효해야 한다', () => {
      const input: GuestbookInput = {
        name: '김철수 (친구)',
        password: 'p@ss!',
        message: '축하해요~!! 🎉💒'
      };
      
      const result = validateGuestbookInput(input);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });
    
    it('정확히 4자리 비밀번호도 유효해야 한다', () => {
      const input: GuestbookInput = {
        name: '테스트',
        password: '1234',
        message: '축하합니다'
      };
      
      const result = validateGuestbookInput(input);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });
  });
  
  describe('이름 유효성 검사 (Name validation) - Requirements 6.3', () => {
    it('이름이 빈 문자열이면 오류 메시지를 반환해야 한다', () => {
      const input: GuestbookInput = {
        name: '',
        password: '1234',
        message: '축하합니다'
      };
      
      const result = validateGuestbookInput(input);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBe('이름을 입력해주세요');
    });
    
    it('이름이 공백만 있으면 오류 메시지를 반환해야 한다', () => {
      const input: GuestbookInput = {
        name: '   ',
        password: '1234',
        message: '축하합니다'
      };
      
      const result = validateGuestbookInput(input);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBe('이름을 입력해주세요');
    });
    
    it('이름이 탭과 줄바꿈만 있으면 오류 메시지를 반환해야 한다', () => {
      const input: GuestbookInput = {
        name: '\t\n  ',
        password: '1234',
        message: '축하합니다'
      };
      
      const result = validateGuestbookInput(input);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBe('이름을 입력해주세요');
    });
    
    it('이름 앞뒤에 공백이 있어도 내용이 있으면 유효해야 한다', () => {
      const input: GuestbookInput = {
        name: '  홍길동  ',
        password: '1234',
        message: '축하합니다'
      };
      
      const result = validateGuestbookInput(input);
      
      expect(result.isValid).toBe(true);
      expect(result.errors.name).toBeUndefined();
    });
  });
  
  describe('비밀번호 유효성 검사 (Password validation) - Requirements 6.3', () => {
    it('비밀번호가 빈 문자열이면 오류 메시지를 반환해야 한다', () => {
      const input: GuestbookInput = {
        name: '홍길동',
        password: '',
        message: '축하합니다'
      };
      
      const result = validateGuestbookInput(input);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.password).toBe('비밀번호는 4자 이상이어야 합니다');
    });
    
    it('비밀번호가 4자 미만이면 오류 메시지를 반환해야 한다', () => {
      const input: GuestbookInput = {
        name: '홍길동',
        password: '123',
        message: '축하합니다'
      };
      
      const result = validateGuestbookInput(input);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.password).toBe('비밀번호는 4자 이상이어야 합니다');
    });
    
    it('비밀번호가 1자이면 오류 메시지를 반환해야 한다', () => {
      const input: GuestbookInput = {
        name: '홍길동',
        password: 'a',
        message: '축하합니다'
      };
      
      const result = validateGuestbookInput(input);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.password).toBe('비밀번호는 4자 이상이어야 합니다');
    });
    
    it('비밀번호가 5자 이상이면 유효해야 한다', () => {
      const input: GuestbookInput = {
        name: '홍길동',
        password: '12345',
        message: '축하합니다'
      };
      
      const result = validateGuestbookInput(input);
      
      expect(result.isValid).toBe(true);
      expect(result.errors.password).toBeUndefined();
    });
    
    it('비밀번호에 공백이 포함되어도 길이에 포함되어야 한다', () => {
      const input: GuestbookInput = {
        name: '홍길동',
        password: 'a b ',
        message: '축하합니다'
      };
      
      const result = validateGuestbookInput(input);
      
      expect(result.isValid).toBe(true);
      expect(result.errors.password).toBeUndefined();
    });
  });
  
  describe('메시지 유효성 검사 (Message validation) - Requirements 6.3', () => {
    it('메시지가 빈 문자열이면 오류 메시지를 반환해야 한다', () => {
      const input: GuestbookInput = {
        name: '홍길동',
        password: '1234',
        message: ''
      };
      
      const result = validateGuestbookInput(input);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.message).toBe('메시지를 입력해주세요');
    });
    
    it('메시지가 공백만 있으면 오류 메시지를 반환해야 한다', () => {
      const input: GuestbookInput = {
        name: '홍길동',
        password: '1234',
        message: '     '
      };
      
      const result = validateGuestbookInput(input);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.message).toBe('메시지를 입력해주세요');
    });
    
    it('메시지가 탭과 줄바꿈만 있으면 오류 메시지를 반환해야 한다', () => {
      const input: GuestbookInput = {
        name: '홍길동',
        password: '1234',
        message: '\t\n\r'
      };
      
      const result = validateGuestbookInput(input);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.message).toBe('메시지를 입력해주세요');
    });
    
    it('메시지 앞뒤에 공백이 있어도 내용이 있으면 유효해야 한다', () => {
      const input: GuestbookInput = {
        name: '홍길동',
        password: '1234',
        message: '  축하합니다  '
      };
      
      const result = validateGuestbookInput(input);
      
      expect(result.isValid).toBe(true);
      expect(result.errors.message).toBeUndefined();
    });
  });
  
  describe('복합 오류 (Multiple errors) - Requirements 6.3', () => {
    it('모든 필드가 비어있으면 모든 오류 메시지를 반환해야 한다', () => {
      const input: GuestbookInput = {
        name: '',
        password: '',
        message: ''
      };
      
      const result = validateGuestbookInput(input);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBe('이름을 입력해주세요');
      expect(result.errors.password).toBe('비밀번호는 4자 이상이어야 합니다');
      expect(result.errors.message).toBe('메시지를 입력해주세요');
      expect(Object.keys(result.errors)).toHaveLength(3);
    });
    
    it('모든 필드가 공백만 있으면 모든 오류 메시지를 반환해야 한다', () => {
      const input: GuestbookInput = {
        name: '   ',
        password: '  ',
        message: '   '
      };
      
      const result = validateGuestbookInput(input);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBe('이름을 입력해주세요');
      expect(result.errors.password).toBe('비밀번호는 4자 이상이어야 합니다');
      expect(result.errors.message).toBe('메시지를 입력해주세요');
    });
    
    it('이름과 메시지만 비어있으면 해당 오류만 반환해야 한다', () => {
      const input: GuestbookInput = {
        name: '',
        password: '1234',
        message: ''
      };
      
      const result = validateGuestbookInput(input);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBe('이름을 입력해주세요');
      expect(result.errors.password).toBeUndefined();
      expect(result.errors.message).toBe('메시지를 입력해주세요');
      expect(Object.keys(result.errors)).toHaveLength(2);
    });
    
    it('비밀번호만 짧으면 비밀번호 오류만 반환해야 한다', () => {
      const input: GuestbookInput = {
        name: '홍길동',
        password: '12',
        message: '축하합니다'
      };
      
      const result = validateGuestbookInput(input);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBeUndefined();
      expect(result.errors.password).toBe('비밀번호는 4자 이상이어야 합니다');
      expect(result.errors.message).toBeUndefined();
      expect(Object.keys(result.errors)).toHaveLength(1);
    });
  });
  
  describe('엣지 케이스 (Edge cases)', () => {
    it('한 글자 이름도 유효해야 한다', () => {
      const input: GuestbookInput = {
        name: '김',
        password: '1234',
        message: '축하합니다'
      };
      
      const result = validateGuestbookInput(input);
      
      expect(result.isValid).toBe(true);
    });
    
    it('한 글자 메시지도 유효해야 한다', () => {
      const input: GuestbookInput = {
        name: '홍길동',
        password: '1234',
        message: '축'
      };
      
      const result = validateGuestbookInput(input);
      
      expect(result.isValid).toBe(true);
    });
    
    it('긴 메시지도 유효해야 한다', () => {
      const input: GuestbookInput = {
        name: '홍길동',
        password: '1234',
        message: '축하합니다! '.repeat(100)
      };
      
      const result = validateGuestbookInput(input);
      
      expect(result.isValid).toBe(true);
    });
    
    it('이모지만 있는 이름도 유효해야 한다', () => {
      const input: GuestbookInput = {
        name: '🎉',
        password: '1234',
        message: '축하합니다'
      };
      
      const result = validateGuestbookInput(input);
      
      expect(result.isValid).toBe(true);
    });
    
    it('이모지만 있는 메시지도 유효해야 한다', () => {
      const input: GuestbookInput = {
        name: '홍길동',
        password: '1234',
        message: '🎉💒❤️'
      };
      
      const result = validateGuestbookInput(input);
      
      expect(result.isValid).toBe(true);
    });
    
    it('숫자만 있는 이름도 유효해야 한다', () => {
      const input: GuestbookInput = {
        name: '123',
        password: '1234',
        message: '축하합니다'
      };
      
      const result = validateGuestbookInput(input);
      
      expect(result.isValid).toBe(true);
    });
  });
});

describe('validateRsvpInput', () => {
  describe('유효한 입력 (Valid input) - Requirements 7.4', () => {
    it('모든 필드가 올바르게 입력되면 isValid가 true여야 한다', () => {
      const input: RsvpInput = {
        name: '홍길동',
        phone: '010-1234-5678',
        attending: true,
        guestCount: 2
      };
      
      const result = validateRsvpInput(input);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });
    
    it('하이픈 없는 연락처도 유효해야 한다', () => {
      const input: RsvpInput = {
        name: '홍길동',
        phone: '01012345678',
        attending: true,
        guestCount: 1
      };
      
      const result = validateRsvpInput(input);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });
    
    it('불참석인 경우 guestCount가 0이어도 유효해야 한다', () => {
      const input: RsvpInput = {
        name: '홍길동',
        phone: '010-1234-5678',
        attending: false,
        guestCount: 0
      };
      
      const result = validateRsvpInput(input);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });
    
    it('선택적 필드(mealAttending, message)가 있어도 유효해야 한다', () => {
      const input: RsvpInput = {
        name: '홍길동',
        phone: '010-1234-5678',
        attending: true,
        guestCount: 2,
        mealAttending: true,
        message: '축하합니다!'
      };
      
      const result = validateRsvpInput(input);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });
  });
  
  describe('이름 유효성 검사 (Name validation) - Requirements 7.4', () => {
    it('이름이 빈 문자열이면 오류 메시지를 반환해야 한다', () => {
      const input: RsvpInput = {
        name: '',
        phone: '010-1234-5678',
        attending: true,
        guestCount: 1
      };
      
      const result = validateRsvpInput(input);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBe('이름을 입력해주세요');
    });
    
    it('이름이 공백만 있으면 오류 메시지를 반환해야 한다', () => {
      const input: RsvpInput = {
        name: '   ',
        phone: '010-1234-5678',
        attending: true,
        guestCount: 1
      };
      
      const result = validateRsvpInput(input);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBe('이름을 입력해주세요');
    });
    
    it('이름 앞뒤에 공백이 있어도 내용이 있으면 유효해야 한다', () => {
      const input: RsvpInput = {
        name: '  홍길동  ',
        phone: '010-1234-5678',
        attending: true,
        guestCount: 1
      };
      
      const result = validateRsvpInput(input);
      
      expect(result.isValid).toBe(true);
      expect(result.errors.name).toBeUndefined();
    });
  });
  
  describe('연락처 유효성 검사 (Phone validation) - Requirements 7.4', () => {
    it('연락처가 빈 문자열이면 오류 메시지를 반환해야 한다', () => {
      const input: RsvpInput = {
        name: '홍길동',
        phone: '',
        attending: true,
        guestCount: 1
      };
      
      const result = validateRsvpInput(input);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.phone).toBe('올바른 연락처를 입력해주세요');
    });
    
    it('잘못된 형식의 연락처는 오류 메시지를 반환해야 한다', () => {
      const input: RsvpInput = {
        name: '홍길동',
        phone: '123-456-7890',
        attending: true,
        guestCount: 1
      };
      
      const result = validateRsvpInput(input);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.phone).toBe('올바른 연락처를 입력해주세요');
    });
    
    it('010으로 시작하는 연락처는 유효해야 한다', () => {
      const input: RsvpInput = {
        name: '홍길동',
        phone: '010-1234-5678',
        attending: true,
        guestCount: 1
      };
      
      const result = validateRsvpInput(input);
      
      expect(result.isValid).toBe(true);
      expect(result.errors.phone).toBeUndefined();
    });
    
    it('011으로 시작하는 연락처도 유효해야 한다', () => {
      const input: RsvpInput = {
        name: '홍길동',
        phone: '011-123-4567',
        attending: true,
        guestCount: 1
      };
      
      const result = validateRsvpInput(input);
      
      expect(result.isValid).toBe(true);
      expect(result.errors.phone).toBeUndefined();
    });
    
    it('016으로 시작하는 연락처도 유효해야 한다', () => {
      const input: RsvpInput = {
        name: '홍길동',
        phone: '016-123-4567',
        attending: true,
        guestCount: 1
      };
      
      const result = validateRsvpInput(input);
      
      expect(result.isValid).toBe(true);
      expect(result.errors.phone).toBeUndefined();
    });
    
    it('너무 짧은 연락처는 오류 메시지를 반환해야 한다', () => {
      const input: RsvpInput = {
        name: '홍길동',
        phone: '010-123',
        attending: true,
        guestCount: 1
      };
      
      const result = validateRsvpInput(input);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.phone).toBe('올바른 연락처를 입력해주세요');
    });
    
    it('02로 시작하는 일반 전화번호는 오류 메시지를 반환해야 한다', () => {
      const input: RsvpInput = {
        name: '홍길동',
        phone: '02-1234-5678',
        attending: true,
        guestCount: 1
      };
      
      const result = validateRsvpInput(input);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.phone).toBe('올바른 연락처를 입력해주세요');
    });
  });
  
  describe('참석 인원 유효성 검사 (Guest count validation) - Requirements 7.4', () => {
    it('참석하는데 인원이 0이면 오류 메시지를 반환해야 한다', () => {
      const input: RsvpInput = {
        name: '홍길동',
        phone: '010-1234-5678',
        attending: true,
        guestCount: 0
      };
      
      const result = validateRsvpInput(input);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.guestCount).toBe('참석 인원을 선택해주세요');
    });
    
    it('참석하는데 인원이 음수이면 오류 메시지를 반환해야 한다', () => {
      const input: RsvpInput = {
        name: '홍길동',
        phone: '010-1234-5678',
        attending: true,
        guestCount: -1
      };
      
      const result = validateRsvpInput(input);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.guestCount).toBe('참석 인원을 선택해주세요');
    });
    
    it('참석하고 인원이 1명 이상이면 유효해야 한다', () => {
      const input: RsvpInput = {
        name: '홍길동',
        phone: '010-1234-5678',
        attending: true,
        guestCount: 1
      };
      
      const result = validateRsvpInput(input);
      
      expect(result.isValid).toBe(true);
      expect(result.errors.guestCount).toBeUndefined();
    });
    
    it('불참석인 경우 인원이 0이어도 유효해야 한다', () => {
      const input: RsvpInput = {
        name: '홍길동',
        phone: '010-1234-5678',
        attending: false,
        guestCount: 0
      };
      
      const result = validateRsvpInput(input);
      
      expect(result.isValid).toBe(true);
      expect(result.errors.guestCount).toBeUndefined();
    });
    
    it('불참석인 경우 인원이 음수여도 guestCount 오류가 없어야 한다', () => {
      const input: RsvpInput = {
        name: '홍길동',
        phone: '010-1234-5678',
        attending: false,
        guestCount: -1
      };
      
      const result = validateRsvpInput(input);
      
      expect(result.errors.guestCount).toBeUndefined();
    });
  });
  
  describe('복합 오류 (Multiple errors) - Requirements 7.4', () => {
    it('모든 필드가 잘못되면 모든 오류 메시지를 반환해야 한다', () => {
      const input: RsvpInput = {
        name: '',
        phone: '123',
        attending: true,
        guestCount: 0
      };
      
      const result = validateRsvpInput(input);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBe('이름을 입력해주세요');
      expect(result.errors.phone).toBe('올바른 연락처를 입력해주세요');
      expect(result.errors.guestCount).toBe('참석 인원을 선택해주세요');
      expect(Object.keys(result.errors)).toHaveLength(3);
    });
    
    it('이름과 연락처만 잘못되면 해당 오류만 반환해야 한다', () => {
      const input: RsvpInput = {
        name: '',
        phone: 'invalid',
        attending: true,
        guestCount: 2
      };
      
      const result = validateRsvpInput(input);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBe('이름을 입력해주세요');
      expect(result.errors.phone).toBe('올바른 연락처를 입력해주세요');
      expect(result.errors.guestCount).toBeUndefined();
      expect(Object.keys(result.errors)).toHaveLength(2);
    });
  });
  
  describe('엣지 케이스 (Edge cases)', () => {
    it('한 글자 이름도 유효해야 한다', () => {
      const input: RsvpInput = {
        name: '김',
        phone: '010-1234-5678',
        attending: true,
        guestCount: 1
      };
      
      const result = validateRsvpInput(input);
      
      expect(result.isValid).toBe(true);
    });
    
    it('영문 이름도 유효해야 한다', () => {
      const input: RsvpInput = {
        name: 'John Doe',
        phone: '010-1234-5678',
        attending: true,
        guestCount: 1
      };
      
      const result = validateRsvpInput(input);
      
      expect(result.isValid).toBe(true);
    });
    
    it('많은 인원도 유효해야 한다', () => {
      const input: RsvpInput = {
        name: '홍길동',
        phone: '010-1234-5678',
        attending: true,
        guestCount: 100
      };
      
      const result = validateRsvpInput(input);
      
      expect(result.isValid).toBe(true);
    });
  });
});
