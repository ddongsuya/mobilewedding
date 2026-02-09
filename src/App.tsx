/**
 * App 컴포넌트
 * 
 * 모바일 청첩장의 메인 애플리케이션 컴포넌트
 * 모든 섹션을 통합하고 데이터 흐름을 관리합니다.
 * 
 * Requirements: 1.1-10.4
 * 
 * Accessibility (Requirements 9.3, 9.4):
 * - Skip links for keyboard navigation
 * - Proper ARIA landmarks
 * - Semantic HTML structure
 * - Focus management
 */

import { useState, useEffect, useCallback } from 'react';
import './App.css';

// 컴포넌트 임포트
import {
  Cover,
  CoupleInfo,
  EventInfo,
  Account,
  Gallery,
  Guestbook,
  RSVP,
  Share,
  MusicPlayer,
  VideoSection,
} from './components';

// 타입 임포트
import type {
  WeddingConfig,
  GuestbookMessage,
  GuestbookInput,
  RsvpInput,
} from './types';

// 서비스 임포트
import { getMessages, addMessage, deleteMessage } from './services/guestbook';
import { submitRsvp } from './services/rsvp';

/**
 * 샘플 청첩장 설정 데이터
 * 실제 사용 시에는 Firebase 또는 API에서 가져옵니다.
 */
const SAMPLE_WEDDING_CONFIG: WeddingConfig = {
  // 커버 이미지 (세로 사진 권장)
  coverImage: '/cover.jpg',
  couple: {
    groom: {
      name: '임정모',
      father: {
        name: '임광현',
        relation: '장남',
      },
      mother: {
        name: '이향숙',
        relation: '장남',
      },
    },
    bride: {
      name: '최화형',
      father: {
        name: '최승현',
        relation: '장녀',
      },
      mother: {
        name: '기길란',
        relation: '장녀',
      },
    },
    greeting: `8월의 끝자락
여름의 열기를 닮은 뜨거운 마음으로
평생을 약속하는 첫 걸음을 내딛습니다.

기쁜 마음으로 참석하시어
시원한 축하 한스푼 보태주시면 감사하겠습니다.`,
  },
  event: {
    date: '2026-08-29',
    time: '12:30',
    venueName: '여수히든베이호텔',
    hallName: '그랜드볼룸홀 B2F',
    calendarEnabled: true,
  },
  gallery: {
    images: [
      {
        id: '1',
        url: '/gallery-1.jpg',
        alt: '웨딩 사진 1',
        order: 1,
      },
      {
        id: '2',
        url: '/gallery-2.jpg',
        alt: '웨딩 사진 2',
        order: 2,
      },
      {
        id: '3',
        url: '/gallery-3.jpg',
        alt: '웨딩 사진 3',
        order: 3,
      },
      {
        id: '4',
        url: '/gallery-4.jpg',
        alt: '웨딩 사진 4',
        order: 4,
      },
      {
        id: '5',
        url: '/gallery-5.jpg',
        alt: '웨딩 사진 5',
        order: 5,
      },
    ],
    layout: 'grid',
  },
  location: {
    address: '전남 여수시 신월로 496-25 히든베이호텔',
    detailAddress: '여수히든베이호텔 그랜드볼룸홀 B2F',
    coordinates: {
      lat: 34.7604,
      lng: 127.6627,
    },
    transportation: {
      car: '여수엑스포역에서 차량 10분',
      parking: '호텔 내 주차장 이용 가능',
    },
  },
  accounts: {
    groom: [
      {
        bank: '카카오뱅크',
        accountNumber: '3333-07-6498378',
        holder: '임정모',
      },
    ],
    bride: [
      {
        bank: '카카오뱅크',
        accountNumber: '3333-20-0635992',
        holder: '최화형',
      },
    ],
  },
  guestbook: {
    enabled: true,
    maxLength: 500,
  },
  rsvp: {
    enabled: true,
    mealOption: true,
    deadline: '2025-03-08',
  },
  share: {
    kakaoEnabled: true,
    kakaoAppKey: 'a93bc92f73d8370de545abb1ea7d2db8',
    ogImage: '/cover.jpg',
    ogTitle: '임정모 ♥ 최화형 결혼합니다',
    ogDescription: '2026년 8월 29일 토요일 오후 12시 30분\n여수히든베이호텔 그랜드볼룸홀 B2F',
  },
  theme: {
    primaryColor: '#e11d48',
    fontFamily: 'Pretendard, sans-serif',
  },
  // 배경음악 설정 (저작권 무료 BGM)
  music: {
    enabled: true,
    src: '/lkoliks-romantic-wedding-background-music-337990.mp3',
  },
  // 식전 영상 설정 (YouTube ID 또는 비디오 URL)
  video: {
    enabled: true,
    youtubeId: 'rfP2K1pPmLo',
    title: '식전 영상',
  },
};

/**
 * 샘플 방명록 메시지 (Firebase 연동 전 데모용)
 */
const SAMPLE_GUESTBOOK_MESSAGES: GuestbookMessage[] = [
  {
    id: 'sample-1',
    name: '박지훈',
    passwordHash: '',
    message: '두 분의 결혼을 진심으로 축하드립니다! 항상 행복하세요 💕',
    createdAt: new Date('2025-01-15T10:30:00'),
  },
  {
    id: 'sample-2',
    name: '최수진',
    passwordHash: '',
    message: '민준아, 서연아 결혼 축하해! 오래오래 행복하게 살아~',
    createdAt: new Date('2025-01-14T15:20:00'),
  },
  {
    id: 'sample-3',
    name: '정현우',
    passwordHash: '',
    message: '축하합니다! 결혼식에서 뵙겠습니다 🎉',
    createdAt: new Date('2025-01-13T09:45:00'),
  },
];

/**
 * 청첩장 ID (실제 사용 시에는 URL 파라미터 또는 환경 변수에서 가져옵니다)
 */
const WEDDING_ID = import.meta.env.VITE_WEDDING_ID || 'demo-wedding';

/**
 * 로딩 스피너 컴포넌트 - Premium Custom Loading
 * Requirements 9.3: 스크린 리더 호환성
 */
const LoadingSpinner = () => (
  <div 
    className="flex items-center justify-center min-h-screen"
    style={{ backgroundColor: '#faf9f7' }}
    role="status"
    aria-live="polite"
    aria-busy="true"
  >
    <div className="text-center">
      {/* Custom heart loading animation */}
      <div className="relative w-16 h-16 mx-auto mb-6">
        <svg
          className="w-16 h-16 text-primary-400 animate-heartbeat"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>
      <p className="font-serif text-gray-600 tracking-wider text-sm">청첩장을 준비하고 있습니다</p>
      <span className="sr-only">로딩 중입니다. 잠시만 기다려주세요.</span>
    </div>
  </div>
);

/**
 * 에러 메시지 컴포넌트
 * Requirements 9.3: 스크린 리더 호환성
 */
interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => (
  <div 
    className="flex items-center justify-center min-h-screen bg-gray-50 p-4"
    role="alert"
    aria-live="assertive"
  >
    <div className="text-center max-w-md">
      <div className="text-red-500 mb-4" aria-hidden="true">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">오류가 발생했습니다</h2>
      <p className="text-gray-600 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          aria-label="다시 시도하기"
        >
          다시 시도
        </button>
      )}
    </div>
  </div>
);

/**
 * App 메인 컴포넌트
 */
function App() {
  // 상태 관리
  const [config] = useState<WeddingConfig>(SAMPLE_WEDDING_CONFIG);
  const [guestbookMessages, setGuestbookMessages] = useState<GuestbookMessage[]>(SAMPLE_GUESTBOOK_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHeader, setShowHeader] = useState(false);

  // 현재 페이지 URL (공유용)
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  /**
   * 스크롤 기반 헤더 표시 로직
   * 커버 영역을 지나면 헤더가 나타남
   */
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      // 커버 영역(100vh)의 80%를 지나면 헤더 표시
      setShowHeader(scrollY > windowHeight * 0.8);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /**
   * 방명록 메시지 로드
   * Firebase 연동 시 활성화
   */
  const loadGuestbookMessages = useCallback(async () => {
    try {
      const messages = await getMessages(WEDDING_ID);
      setGuestbookMessages(messages);
    } catch (err) {
      console.error('방명록 로드 실패:', err);
      // Firebase 연동 전에는 샘플 데이터 유지
      // setError('방명록을 불러오는데 실패했습니다.');
    }
  }, []);

  /**
   * 초기 데이터 로드
   */
  useEffect(() => {
    const initializeApp = async () => {
      setIsLoading(true);
      try {
        // Firebase 연동 시 방명록 메시지 로드
        await loadGuestbookMessages();
      } catch (err) {
        console.error('초기화 실패:', err);
        // 에러가 발생해도 샘플 데이터로 표시
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [loadGuestbookMessages]);

  /**
   * 방명록 메시지 등록 핸들러
   * Requirements 6.2: 새 축하 메시지를 저장하고 목록에 추가
   */
  const handleGuestbookSubmit = useCallback(async (input: GuestbookInput) => {
    try {
      const newMessage = await addMessage(WEDDING_ID, input);
      // 새 메시지를 목록 맨 앞에 추가
      setGuestbookMessages((prev) => [newMessage, ...prev]);
    } catch (err) {
      // Firebase 연동 전에는 로컬에서 처리
      const localMessage: GuestbookMessage = {
        id: `local-${Date.now()}`,
        name: input.name,
        passwordHash: '',
        message: input.message,
        createdAt: new Date(),
      };
      setGuestbookMessages((prev) => [localMessage, ...prev]);
      console.log('로컬 모드: 메시지가 임시로 추가되었습니다.');
    }
  }, []);

  /**
   * 방명록 메시지 삭제 핸들러
   * Requirements 6.4: 올바른 비밀번호 입력 시 메시지 삭제
   */
  const handleGuestbookDelete = useCallback(async (messageId: string, password: string) => {
    try {
      await deleteMessage(WEDDING_ID, messageId, password);
      // 삭제된 메시지를 목록에서 제거
      setGuestbookMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    } catch (err) {
      // Firebase 연동 전에는 로컬에서 처리
      if (messageId.startsWith('local-') || messageId.startsWith('sample-')) {
        setGuestbookMessages((prev) => prev.filter((msg) => msg.id !== messageId));
        console.log('로컬 모드: 메시지가 삭제되었습니다.');
      } else {
        throw err;
      }
    }
  }, []);

  /**
   * RSVP 제출 핸들러
   * Requirements 7.2: RSVP 응답 저장
   */
  const handleRsvpSubmit = useCallback(async (input: RsvpInput) => {
    try {
      await submitRsvp(WEDDING_ID, input);
    } catch (err) {
      // Firebase 연동 전에는 로컬에서 처리
      console.log('로컬 모드: RSVP가 임시로 저장되었습니다.', input);
    }
  }, []);

  /**
   * 에러 재시도 핸들러
   */
  const handleRetry = useCallback(() => {
    setError(null);
    loadGuestbookMessages();
  }, [loadGuestbookMessages]);

  // 로딩 상태
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // 에러 상태
  if (error) {
    return <ErrorMessage message={error} onRetry={handleRetry} />;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#faf9f7' }}>
      {/* 
        Skip Links - Requirements 9.4: 키보드 네비게이션 지원
        Allows keyboard users to skip directly to main content or specific sections
      */}
      <a href="#main-content" className="skip-link">
        본문으로 바로가기
      </a>
      <a href="#couple-info" className="skip-link" style={{ top: '3.5rem' }}>
        신랑신부 소개로 바로가기
      </a>
      <a href="#guestbook" className="skip-link" style={{ top: '6rem' }}>
        방명록으로 바로가기
      </a>

      {/* Fullscreen Cover Section */}
      {config.coverImage && (
        <Cover
          groomName={config.couple.groom.name}
          brideName={config.couple.bride.name}
          date={config.event.date}
          time={config.event.time}
          venueName={config.event.venueName}
          coverImage={config.coverImage}
        />
      )}

      {/* Sticky Header - 스크롤 후 나타남 */}
      <header 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          showHeader 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
        style={{ 
          backgroundColor: 'rgba(250, 249, 247, 0.95)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)'
        }}
        role="banner"
      >
        <div className="py-3 px-4 text-center border-b border-gold-200/50">
          <p className="font-serif text-lg text-gray-800 tracking-wide">
            {config.couple.groom.name}
            <span className="mx-2 text-gold-500" aria-hidden="true">♥</span>
            {config.couple.bride.name}
          </p>
        </div>
      </header>

      {/* Main Content - Requirements 9.3: 시맨틱 HTML, ARIA 랜드마크 */}
      <main id="main-content" className="pb-8" role="main">
        {/* Elegant Divider */}
        <div className="flex items-center justify-center py-8" aria-hidden="true">
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-gold-300 to-transparent"></div>
        </div>

        {/* 1. 신랑/신부 정보 - Requirements 1.1-1.4 */}
        <div id="couple-info">
          <CoupleInfo config={config.couple} />
        </div>

        {/* Elegant Divider */}
        <div className="flex items-center justify-center py-12" aria-hidden="true">
          <div className="flex items-center gap-4">
            <div className="w-20 h-px bg-gradient-to-r from-transparent to-gold-300"></div>
            <svg className="w-4 h-4 text-gold-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z"/>
            </svg>
            <div className="w-20 h-px bg-gradient-to-l from-transparent to-gold-300"></div>
          </div>
        </div>

        {/* 2. 결혼식 일정 - Requirements 2.1-2.5 */}
        <EventInfo config={config.event} location={config.location} />

        {/* 식전 영상 - 갤러리 전에 배치 */}
        {config.video?.enabled && (
          <VideoSection 
            youtubeId={config.video.youtubeId}
            title={config.video.title}
          />
        )}

        {/* 3. 갤러리 - Requirements 3.1-3.4 */}
        <Gallery config={config.gallery} />

        {/* 4. 오시는 길 (Map 컴포넌트가 구현되면 추가)
        <Map config={config.location} />
        */}

        {/* 5. 축의금 계좌 - Requirements 5.1-5.4 */}
        <Account config={config.accounts} />

        {/* 6. 방명록 - Requirements 6.1-6.5 */}
        <div id="guestbook">
          <Guestbook
            config={config.guestbook}
            messages={guestbookMessages}
            onSubmit={handleGuestbookSubmit}
            onDelete={handleGuestbookDelete}
          />
        </div>

        {/* 7. 참석 여부 RSVP - Requirements 7.1-7.5 */}
        <RSVP config={config.rsvp} onSubmit={handleRsvpSubmit} />

        {/* 8. 공유하기 - Requirements 8.1-8.4 */}
        <Share config={config.share} url={currentUrl} />
      </main>

      {/* 배경음악 플레이어 */}
      {config.music?.enabled && (
        <MusicPlayer src={config.music.src} />
      )}

      {/* Footer - Premium Design */}
      <footer 
        className="section-container text-center pt-12 pb-16"
        role="contentinfo"
      >
        <div className="flex items-center justify-center gap-3 mb-4" aria-hidden="true">
          <div className="w-8 h-px bg-gold-300"></div>
          <svg className="w-3 h-3 text-gold-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <div className="w-8 h-px bg-gold-300"></div>
        </div>
        <p className="font-serif text-gray-600 tracking-wider">
          {config.couple.groom.name} & {config.couple.bride.name}
        </p>
        <p className="text-xs text-gray-400 mt-3 tracking-wide">
          © 2025 Mobile Wedding Invitation
        </p>
      </footer>
    </div>
  );
}

export default App;
