/**
 * 클립보드 복사 함수 단위 테스트
 * 
 * copyToClipboard 함수의 기본 기능을 검증합니다.
 * Requirements: 4.5, 5.2, 8.2
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { copyToClipboard } from './clipboard';

describe('copyToClipboard', () => {
  // 원본 navigator.clipboard 저장
  const originalClipboard = navigator.clipboard;
  
  beforeEach(() => {
    // DOM 메서드 모킹
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => document.createElement('textarea'));
    vi.spyOn(document.body, 'removeChild').mockImplementation(() => document.createElement('textarea'));
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
    // navigator.clipboard 복원
    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
      writable: true,
      configurable: true
    });
  });
  
  describe('Clipboard API 사용 (Modern browsers)', () => {
    it('Clipboard API가 지원될 때 성공적으로 복사해야 한다', async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        writable: true,
        configurable: true
      });
      
      const result = await copyToClipboard('테스트 텍스트');
      
      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
      expect(mockWriteText).toHaveBeenCalledWith('테스트 텍스트');
    });
    
    it('Clipboard API 실패 시 오류를 반환해야 한다', async () => {
      const mockWriteText = vi.fn().mockRejectedValue(new Error('Permission denied'));
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        writable: true,
        configurable: true
      });
      
      const result = await copyToClipboard('테스트 텍스트');
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain('Permission denied');
    });
  });
  
  describe('폴백 방식 (Fallback for older browsers)', () => {
    beforeEach(() => {
      // Clipboard API 비활성화
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        writable: true,
        configurable: true
      });
    });
    
    it('execCommand가 성공하면 success: true를 반환해야 한다', async () => {
      // execCommand 모킹 (document에 직접 추가)
      (document as unknown as { execCommand: (cmd: string) => boolean }).execCommand = vi.fn().mockReturnValue(true);
      
      // textarea 요소 모킹
      const mockTextArea = {
        value: '',
        style: {} as CSSStyleDeclaration,
        focus: vi.fn(),
        select: vi.fn()
      };
      vi.spyOn(document, 'createElement').mockReturnValue(mockTextArea as unknown as HTMLTextAreaElement);
      
      const result = await copyToClipboard('폴백 테스트');
      
      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
    });
    
    it('execCommand가 실패하면 success: false를 반환해야 한다', async () => {
      // execCommand 실패 모킹
      (document as unknown as { execCommand: (cmd: string) => boolean }).execCommand = vi.fn().mockReturnValue(false);
      
      // textarea 요소 모킹
      const mockTextArea = {
        value: '',
        style: {} as CSSStyleDeclaration,
        focus: vi.fn(),
        select: vi.fn()
      };
      vi.spyOn(document, 'createElement').mockReturnValue(mockTextArea as unknown as HTMLTextAreaElement);
      
      const result = await copyToClipboard('폴백 테스트');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('execCommand copy failed');
    });
  });
  
  describe('다양한 입력값 처리 (Various input handling)', () => {
    beforeEach(() => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        writable: true,
        configurable: true
      });
    });
    
    it('주소 문자열을 복사할 수 있어야 한다 (Requirements 4.5)', async () => {
      const address = '서울시 강남구 테헤란로 123';
      const result = await copyToClipboard(address);
      
      expect(result.success).toBe(true);
    });
    
    it('계좌번호를 복사할 수 있어야 한다 (Requirements 5.2)', async () => {
      const accountNumber = '110-123-456789';
      const result = await copyToClipboard(accountNumber);
      
      expect(result.success).toBe(true);
    });
    
    it('URL을 복사할 수 있어야 한다 (Requirements 8.2)', async () => {
      const url = 'https://wedding.example.com/invitation/abc123';
      const result = await copyToClipboard(url);
      
      expect(result.success).toBe(true);
    });
    
    it('빈 문자열을 복사할 수 있어야 한다', async () => {
      const result = await copyToClipboard('');
      
      expect(result.success).toBe(true);
    });
    
    it('특수 문자가 포함된 텍스트를 복사할 수 있어야 한다', async () => {
      const specialText = '축하합니다! 🎉💒 #결혼식 @신랑신부';
      const result = await copyToClipboard(specialText);
      
      expect(result.success).toBe(true);
    });
    
    it('줄바꿈이 포함된 텍스트를 복사할 수 있어야 한다', async () => {
      const multilineText = '신한은행\n110-123-456789\n홍길동';
      const result = await copyToClipboard(multilineText);
      
      expect(result.success).toBe(true);
    });
    
    it('긴 텍스트를 복사할 수 있어야 한다', async () => {
      const longText = 'A'.repeat(10000);
      const result = await copyToClipboard(longText);
      
      expect(result.success).toBe(true);
    });
  });
  
  describe('반환값 타입 검증 (Return type validation)', () => {
    it('성공 시 CopyResult 형식을 반환해야 한다', async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        writable: true,
        configurable: true
      });
      
      const result = await copyToClipboard('테스트');
      
      expect(typeof result.success).toBe('boolean');
      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
    });
    
    it('실패 시 error 필드가 문자열이어야 한다', async () => {
      const mockWriteText = vi.fn().mockRejectedValue(new Error('Test error'));
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        writable: true,
        configurable: true
      });
      
      const result = await copyToClipboard('테스트');
      
      expect(typeof result.success).toBe('boolean');
      expect(result.success).toBe(false);
      expect(typeof result.error).toBe('string');
    });
  });
  
  describe('예외 처리 (Exception handling)', () => {
    it('예외 발생 시 오류를 캐치하고 CopyResult를 반환해야 한다', async () => {
      const mockWriteText = vi.fn().mockRejectedValue(new TypeError('Clipboard not available'));
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        writable: true,
        configurable: true
      });
      
      const result = await copyToClipboard('테스트');
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
