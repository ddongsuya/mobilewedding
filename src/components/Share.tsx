/**
 * Share 컴포넌트
 * 
 * 카카오톡 공유, 링크 복사, Web Share API를 통한 공유 기능을 제공하는 컴포넌트
 * 
 * Requirements:
 * - 8.1: 카카오톡 공유 버튼 클릭 시 카카오톡 공유 기능 실행
 * - 8.2: 링크 복사 버튼 클릭 시 청첩장 URL을 클립보드에 복사
 * - 8.3: Web Share API 지원 시 네이티브 공유 기능 제공
 * - 8.4: 공유 성공/실패 시 사용자에게 피드백 제공
 */

import { useState, useCallback, useEffect } from 'react';
import { ShareProps } from '../types';
import { copyToClipboard } from '../utils/clipboard';
import { shareToKakao } from '../utils/kakao';

/**
 * 피드백 상태 타입
 */
type FeedbackStatus = 'idle' | 'success' | 'error';

/**
 * 피드백 메시지 인터페이스
 */
interface FeedbackMessage {
  status: FeedbackStatus;
  message: string;
}

/**
 * 카카오톡 아이콘 컴포넌트
 */
const KakaoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.47 1.607 4.647 4.035 5.874l-.857 3.142a.5.5 0 00.764.545l3.683-2.456c.78.1 1.573.145 2.375.145 5.523 0 10-3.477 10-7.75S17.523 3 12 3z" />
  </svg>
);

/**
 * 링크 복사 아이콘 컴포넌트
 */
const LinkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
    />
  </svg>
);

/**
 * 공유 아이콘 컴포넌트 (Web Share API용)
 */
const ShareIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
    />
  </svg>
);

/**
 * 체크 아이콘 컴포넌트 (성공 시)
 */
const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

/**
 * Web Share API 지원 여부 확인
 */
const isWebShareSupported = (): boolean => {
  return typeof navigator !== 'undefined' && 
         typeof navigator.share === 'function';
};

/**
 * Web Share API를 사용한 네이티브 공유
 * Requirements 8.3
 * 
 * @param config - 공유 설정
 * @param url - 공유할 URL
 */
const shareNative = async (
  config: ShareProps['config'],
  url: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!isWebShareSupported()) {
      return { success: false, error: 'Web Share API가 지원되지 않습니다' };
    }

    await navigator.share({
      title: config.ogTitle || '결혼식에 초대합니다',
      text: config.ogDescription || '소중한 분들을 결혼식에 초대합니다',
      url: url,
    });

    return { success: true };
  } catch (error) {
    // 사용자가 공유를 취소한 경우
    if (error instanceof Error && error.name === 'AbortError') {
      return { success: false, error: '공유가 취소되었습니다' };
    }
    return { success: false, error: String(error) };
  }
};

/**
 * Share 메인 컴포넌트
 * 
 * @param config - 공유 설정
 * @param url - 공유할 청첩장 URL
 */
export const Share = ({ config, url }: ShareProps) => {
  const [feedback, setFeedback] = useState<FeedbackMessage>({ status: 'idle', message: '' });
  const [webShareSupported, setWebShareSupported] = useState(false);
  const [copyButtonStatus, setCopyButtonStatus] = useState<FeedbackStatus>('idle');

  // Web Share API 지원 여부 확인
  useEffect(() => {
    setWebShareSupported(isWebShareSupported());
  }, []);

  /**
   * 피드백 표시 함수
   * Requirements 8.4
   */
  const showFeedback = useCallback((status: FeedbackStatus, message: string) => {
    setFeedback({ status, message });
    
    // 3초 후 피드백 초기화
    setTimeout(() => {
      setFeedback({ status: 'idle', message: '' });
    }, 3000);
  }, []);

  /**
   * 카카오톡 공유 핸들러
   * Requirements 8.1, 8.4
   */
  const handleKakaoShare = useCallback(() => {
    if (!config.kakaoEnabled) {
      showFeedback('error', '카카오톡 공유가 비활성화되어 있습니다');
      return;
    }

    const result = shareToKakao(config, url);
    
    if (result.success) {
      showFeedback('success', '카카오톡 공유가 실행되었습니다');
    } else {
      showFeedback('error', result.error || '카카오톡 공유에 실패했습니다');
    }
  }, [config, url, showFeedback]);

  /**
   * 링크 복사 핸들러
   * Requirements 8.2, 8.4
   */
  const handleCopyLink = useCallback(async () => {
    const result = await copyToClipboard(url);
    
    if (result.success) {
      setCopyButtonStatus('success');
      showFeedback('success', '링크가 복사되었습니다');
      
      // 2초 후 버튼 상태 초기화
      setTimeout(() => {
        setCopyButtonStatus('idle');
      }, 2000);
    } else {
      setCopyButtonStatus('error');
      showFeedback('error', result.error || '링크 복사에 실패했습니다');
      
      // 2초 후 버튼 상태 초기화
      setTimeout(() => {
        setCopyButtonStatus('idle');
      }, 2000);
    }
  }, [url, showFeedback]);

  /**
   * 네이티브 공유 핸들러
   * Requirements 8.3, 8.4
   */
  const handleNativeShare = useCallback(async () => {
    const result = await shareNative(config, url);
    
    if (result.success) {
      showFeedback('success', '공유가 완료되었습니다');
    } else if (result.error !== '공유가 취소되었습니다') {
      // 사용자가 취소한 경우는 피드백을 표시하지 않음
      showFeedback('error', result.error || '공유에 실패했습니다');
    }
  }, [config, url, showFeedback]);

  return (
    <section className="section-container" aria-labelledby="share-title">
      <div className="card">
        {/* 섹션 제목 - Premium serif */}
        <h2 
          id="share-title" 
          className="text-center font-serif text-2xl sm:text-3xl font-light text-gray-800 mb-2 tracking-wider"
        >
          공유하기
        </h2>
        
        {/* 안내 문구 */}
        <p className="text-center text-sm text-gray-500 mb-8 tracking-wide">
          소중한 분들에게 청첩장을 전해주세요
        </p>

        {/* 공유 버튼들 - Premium minimal design */}
        <div 
          className="flex justify-center gap-6 flex-wrap"
          role="group"
          aria-label="공유 옵션"
        >
          {/* 카카오톡 공유 버튼 - Requirements 8.1 */}
          {config.kakaoEnabled && (
            <button
              type="button"
              onClick={handleKakaoShare}
              className="flex flex-col items-center justify-center gap-2 p-4 bg-yellow-400 text-yellow-900 rounded-full hover:bg-yellow-500 transition-all duration-300 tap-target w-16 h-16 focus-visible:ring-2 focus-visible:ring-yellow-600 focus-visible:ring-offset-2"
              aria-label="카카오톡으로 공유하기"
            >
              <KakaoIcon />
            </button>
          )}

          {/* 링크 복사 버튼 - Requirements 8.2 - Minimal text link style */}
          <button
            type="button"
            onClick={handleCopyLink}
            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-full transition-all duration-300 tap-target w-16 h-16 focus-visible:ring-2 focus-visible:ring-offset-2 ${
              copyButtonStatus === 'success' 
                ? 'bg-green-100 text-green-700 focus-visible:ring-green-500' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 focus-visible:ring-gray-500'
            }`}
            aria-label={copyButtonStatus === 'success' ? '링크가 복사되었습니다' : '청첩장 링크 복사하기'}
            aria-live="polite"
            disabled={copyButtonStatus === 'success'}
          >
            {copyButtonStatus === 'success' ? <CheckIcon /> : <LinkIcon />}
          </button>

          {/* 네이티브 공유 버튼 - Requirements 8.3 */}
          {webShareSupported && (
            <button
              type="button"
              onClick={handleNativeShare}
              className="flex flex-col items-center justify-center gap-2 p-4 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-all duration-300 tap-target w-16 h-16 focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
              aria-label="다른 앱으로 공유하기"
            >
              <ShareIcon />
            </button>
          )}
        </div>

        {/* 버튼 라벨 */}
        <div className="flex justify-center gap-6 mt-3">
          {config.kakaoEnabled && (
            <span className="text-xs text-gray-500 w-16 text-center">카카오톡</span>
          )}
          <span className="text-xs text-gray-500 w-16 text-center">
            {copyButtonStatus === 'success' ? '복사됨' : '링크 복사'}
          </span>
          {webShareSupported && (
            <span className="text-xs text-gray-500 w-16 text-center">공유</span>
          )}
        </div>

        {/* 피드백 메시지 - Requirements 8.4 - Toast style */}
        <div className="mt-6 min-h-[32px] flex items-center justify-center">
          {feedback.status !== 'idle' && (
            <div 
              className={`text-center text-sm py-2 px-4 rounded-full transition-all duration-300 ${
                feedback.status === 'success' 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
              role="status"
              aria-live="polite"
            >
              {feedback.message}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Share;
