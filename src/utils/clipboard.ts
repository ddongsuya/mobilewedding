/**
 * 클립보드 관련 유틸리티 함수
 * 
 * 텍스트를 클립보드에 복사하는 기능을 제공합니다.
 * Requirements: 4.5, 5.2, 8.2
 */

import { CopyResult } from '../types';

/**
 * 클립보드에 텍스트를 복사하는 함수
 * 
 * 최신 Clipboard API를 우선 사용하고, 지원하지 않는 브라우저에서는
 * 폴백(fallback) 방식으로 textarea 요소를 사용하여 복사합니다.
 * 
 * @param text - 클립보드에 복사할 텍스트
 * @returns Promise<CopyResult> - 복사 성공 여부와 오류 메시지를 포함한 결과
 * 
 * @example
 * // 주소 복사 (Requirements 4.5)
 * const result = await copyToClipboard('서울시 강남구 테헤란로 123');
 * if (result.success) {
 *   console.log('주소가 복사되었습니다');
 * }
 * 
 * @example
 * // 계좌번호 복사 (Requirements 5.2)
 * const result = await copyToClipboard('110-123-456789');
 * if (result.success) {
 *   showToast('계좌번호가 복사되었습니다');
 * }
 * 
 * @example
 * // URL 복사 (Requirements 8.2)
 * const result = await copyToClipboard('https://wedding.example.com/invitation');
 * if (!result.success) {
 *   console.error('복사 실패:', result.error);
 * }
 * 
 * **Validates: Requirements 4.5, 5.2, 8.2**
 */
export async function copyToClipboard(text: string): Promise<CopyResult> {
  try {
    // 최신 Clipboard API 사용 (권장)
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return { success: true };
    }
    
    // 폴백: 구형 브라우저를 위한 textarea 방식
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // 화면에 보이지 않도록 스타일 설정
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '0';
    textArea.style.opacity = '0';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    // execCommand를 사용하여 복사 실행
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    if (successful) {
      return { success: true };
    } else {
      return { success: false, error: 'execCommand copy failed' };
    }
  } catch (error) {
    return { success: false, error: String(error) };
  }
}
