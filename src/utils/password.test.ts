/**
 * 비밀번호 해싱 함수 단위 테스트
 * 
 * hashPassword, verifyPassword 함수의 기본 기능을 검증합니다.
 * Requirements: 6.4, 6.5, 10.4
 */

import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from './password';

describe('hashPassword', () => {
  describe('해시 생성 (Hash generation)', () => {
    it('비밀번호를 해싱하면 64자리 16진수 문자열을 반환해야 한다', async () => {
      const hash = await hashPassword('testPassword');
      
      expect(hash).toHaveLength(64);
      expect(hash).toMatch(/^[0-9a-f]{64}$/);
    });
    
    it('동일한 비밀번호는 항상 동일한 해시를 생성해야 한다', async () => {
      const password = 'consistentPassword';
      
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);
      
      expect(hash1).toBe(hash2);
    });
    
    it('다른 비밀번호는 다른 해시를 생성해야 한다', async () => {
      const hash1 = await hashPassword('password1');
      const hash2 = await hashPassword('password2');
      
      expect(hash1).not.toBe(hash2);
    });
    
    it('빈 문자열도 해싱할 수 있어야 한다', async () => {
      const hash = await hashPassword('');
      
      expect(hash).toHaveLength(64);
      expect(hash).toMatch(/^[0-9a-f]{64}$/);
    });
  });
  
  describe('다양한 입력값 처리 (Various input handling)', () => {
    it('한글 비밀번호를 해싱할 수 있어야 한다', async () => {
      const hash = await hashPassword('비밀번호123');
      
      expect(hash).toHaveLength(64);
      expect(hash).toMatch(/^[0-9a-f]{64}$/);
    });
    
    it('특수 문자가 포함된 비밀번호를 해싱할 수 있어야 한다', async () => {
      const hash = await hashPassword('P@ssw0rd!#$%');
      
      expect(hash).toHaveLength(64);
      expect(hash).toMatch(/^[0-9a-f]{64}$/);
    });
    
    it('이모지가 포함된 비밀번호를 해싱할 수 있어야 한다', async () => {
      const hash = await hashPassword('password🎉💒');
      
      expect(hash).toHaveLength(64);
      expect(hash).toMatch(/^[0-9a-f]{64}$/);
    });
    
    it('긴 비밀번호를 해싱할 수 있어야 한다', async () => {
      const longPassword = 'A'.repeat(1000);
      const hash = await hashPassword(longPassword);
      
      expect(hash).toHaveLength(64);
      expect(hash).toMatch(/^[0-9a-f]{64}$/);
    });
    
    it('공백이 포함된 비밀번호를 해싱할 수 있어야 한다', async () => {
      const hash = await hashPassword('pass word with spaces');
      
      expect(hash).toHaveLength(64);
      expect(hash).toMatch(/^[0-9a-f]{64}$/);
    });
    
    it('줄바꿈이 포함된 비밀번호를 해싱할 수 있어야 한다', async () => {
      const hash = await hashPassword('password\nwith\nnewlines');
      
      expect(hash).toHaveLength(64);
      expect(hash).toMatch(/^[0-9a-f]{64}$/);
    });
  });
  
  describe('대소문자 구분 (Case sensitivity)', () => {
    it('대소문자가 다른 비밀번호는 다른 해시를 생성해야 한다', async () => {
      const hashLower = await hashPassword('password');
      const hashUpper = await hashPassword('PASSWORD');
      const hashMixed = await hashPassword('Password');
      
      expect(hashLower).not.toBe(hashUpper);
      expect(hashLower).not.toBe(hashMixed);
      expect(hashUpper).not.toBe(hashMixed);
    });
  });
});

describe('verifyPassword', () => {
  describe('비밀번호 검증 (Password verification)', () => {
    it('올바른 비밀번호로 검증하면 true를 반환해야 한다 (Requirements 6.4)', async () => {
      const password = 'correctPassword';
      const hash = await hashPassword(password);
      
      const result = await verifyPassword(password, hash);
      
      expect(result).toBe(true);
    });
    
    it('잘못된 비밀번호로 검증하면 false를 반환해야 한다 (Requirements 6.5)', async () => {
      const originalPassword = 'correctPassword';
      const wrongPassword = 'wrongPassword';
      const hash = await hashPassword(originalPassword);
      
      const result = await verifyPassword(wrongPassword, hash);
      
      expect(result).toBe(false);
    });
    
    it('빈 비밀번호도 올바르게 검증해야 한다', async () => {
      const password = '';
      const hash = await hashPassword(password);
      
      const resultCorrect = await verifyPassword('', hash);
      const resultWrong = await verifyPassword('notEmpty', hash);
      
      expect(resultCorrect).toBe(true);
      expect(resultWrong).toBe(false);
    });
  });
  
  describe('다양한 비밀번호 검증 (Various password verification)', () => {
    it('한글 비밀번호를 올바르게 검증해야 한다', async () => {
      const password = '비밀번호123';
      const hash = await hashPassword(password);
      
      const resultCorrect = await verifyPassword('비밀번호123', hash);
      const resultWrong = await verifyPassword('비밀번호456', hash);
      
      expect(resultCorrect).toBe(true);
      expect(resultWrong).toBe(false);
    });
    
    it('특수 문자가 포함된 비밀번호를 올바르게 검증해야 한다', async () => {
      const password = 'P@ssw0rd!#$%';
      const hash = await hashPassword(password);
      
      const resultCorrect = await verifyPassword('P@ssw0rd!#$%', hash);
      const resultWrong = await verifyPassword('P@ssw0rd!#$', hash);
      
      expect(resultCorrect).toBe(true);
      expect(resultWrong).toBe(false);
    });
    
    it('이모지가 포함된 비밀번호를 올바르게 검증해야 한다', async () => {
      const password = 'password🎉💒';
      const hash = await hashPassword(password);
      
      const resultCorrect = await verifyPassword('password🎉💒', hash);
      const resultWrong = await verifyPassword('password🎉', hash);
      
      expect(resultCorrect).toBe(true);
      expect(resultWrong).toBe(false);
    });
  });
  
  describe('대소문자 구분 검증 (Case sensitivity verification)', () => {
    it('대소문자가 다른 비밀번호는 검증에 실패해야 한다', async () => {
      const password = 'Password123';
      const hash = await hashPassword(password);
      
      const resultExact = await verifyPassword('Password123', hash);
      const resultLower = await verifyPassword('password123', hash);
      const resultUpper = await verifyPassword('PASSWORD123', hash);
      
      expect(resultExact).toBe(true);
      expect(resultLower).toBe(false);
      expect(resultUpper).toBe(false);
    });
  });
  
  describe('공백 처리 검증 (Whitespace handling verification)', () => {
    it('앞뒤 공백이 다른 비밀번호는 검증에 실패해야 한다', async () => {
      const password = 'password';
      const hash = await hashPassword(password);
      
      const resultExact = await verifyPassword('password', hash);
      const resultLeadingSpace = await verifyPassword(' password', hash);
      const resultTrailingSpace = await verifyPassword('password ', hash);
      
      expect(resultExact).toBe(true);
      expect(resultLeadingSpace).toBe(false);
      expect(resultTrailingSpace).toBe(false);
    });
  });
  
  describe('잘못된 해시값 처리 (Invalid hash handling)', () => {
    it('잘못된 형식의 해시값과 비교하면 false를 반환해야 한다', async () => {
      const password = 'testPassword';
      
      const resultInvalidHash = await verifyPassword(password, 'invalidhash');
      const resultEmptyHash = await verifyPassword(password, '');
      
      expect(resultInvalidHash).toBe(false);
      expect(resultEmptyHash).toBe(false);
    });
  });
});

describe('hashPassword와 verifyPassword 통합 테스트 (Integration tests)', () => {
  it('방명록 시나리오: 메시지 작성 후 삭제 시 비밀번호 검증 (Requirements 6.4, 6.5, 10.4)', async () => {
    // 사용자가 방명록 메시지 작성 시 비밀번호 입력
    const userPassword = 'guestbook1234';
    
    // 비밀번호를 해싱하여 저장 (Requirements 10.4)
    const storedHash = await hashPassword(userPassword);
    
    // 삭제 시 올바른 비밀번호 입력 (Requirements 6.4)
    const correctPasswordResult = await verifyPassword(userPassword, storedHash);
    expect(correctPasswordResult).toBe(true);
    
    // 삭제 시 잘못된 비밀번호 입력 (Requirements 6.5)
    const wrongPasswordResult = await verifyPassword('wrongPassword', storedHash);
    expect(wrongPasswordResult).toBe(false);
  });
  
  it('여러 사용자의 비밀번호가 독립적으로 검증되어야 한다', async () => {
    const user1Password = 'user1Pass';
    const user2Password = 'user2Pass';
    
    const user1Hash = await hashPassword(user1Password);
    const user2Hash = await hashPassword(user2Password);
    
    // 각 사용자의 비밀번호는 자신의 해시로만 검증 성공
    expect(await verifyPassword(user1Password, user1Hash)).toBe(true);
    expect(await verifyPassword(user2Password, user2Hash)).toBe(true);
    
    // 다른 사용자의 해시로는 검증 실패
    expect(await verifyPassword(user1Password, user2Hash)).toBe(false);
    expect(await verifyPassword(user2Password, user1Hash)).toBe(false);
  });
});
