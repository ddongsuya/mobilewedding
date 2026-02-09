/**
 * 모바일 청첩장 TypeScript 인터페이스 정의
 * 
 * 이 파일은 모바일 청첩장 애플리케이션에서 사용되는 모든 타입을 정의합니다.
 * Requirements: 1.1-10.4
 */

// ============================================================================
// 청첩장 전체 설정 (Wedding Configuration)
// ============================================================================

/**
 * 청첩장 전체 설정 인터페이스
 * 모든 청첩장 데이터를 포함하는 최상위 설정 객체
 */
export interface WeddingConfig {
  couple: CoupleConfig;
  event: EventConfig;
  gallery: GalleryConfig;
  location: LocationConfig;
  accounts: AccountConfig;
  guestbook: GuestbookConfig;
  rsvp: RsvpConfig;
  share: ShareConfig;
  theme: ThemeConfig;
  /** 커버 이미지 URL (풀스크린 히어로 이미지) */
  coverImage?: string;
}

// ============================================================================
// 신랑/신부 정보 (Couple Information)
// Requirements: 1.1, 1.2, 1.3, 1.4
// ============================================================================

/**
 * 신랑/신부 설정 인터페이스
 */
export interface CoupleConfig {
  /** 신랑 정보 */
  groom: PersonInfo;
  /** 신부 정보 */
  bride: PersonInfo;
  /** 인사말 문구 */
  greeting: string;
}

/**
 * 개인 정보 인터페이스 (신랑 또는 신부)
 */
export interface PersonInfo {
  /** 이름 */
  name: string;
  /** 영문 이름 (선택) */
  englishName?: string;
  /** 아버지 정보 */
  father: ParentInfo;
  /** 어머니 정보 */
  mother: ParentInfo;
  /** 연락처 (선택) */
  phone?: string;
}

/**
 * 부모님 정보 인터페이스
 */
export interface ParentInfo {
  /** 이름 */
  name: string;
  /** 연락처 (선택) */
  phone?: string;
  /** 관계 (장남, 차남, 삼남, 장녀, 차녀, 삼녀 또는 기타) */
  relation: '장남' | '차남' | '삼남' | '장녀' | '차녀' | '삼녀' | string;
}

// ============================================================================
// 결혼식 정보 (Event Information)
// Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
// ============================================================================

/**
 * 결혼식 정보 인터페이스
 */
export interface EventConfig {
  /** 결혼식 날짜 (ISO 8601 format: YYYY-MM-DD) */
  date: string;
  /** 결혼식 시간 (HH:mm format) */
  time: string;
  /** 예식장 이름 */
  venueName: string;
  /** 홀 이름 (선택) */
  hallName?: string;
  /** 캘린더 추가 기능 활성화 여부 */
  calendarEnabled: boolean;
}

// ============================================================================
// 갤러리 설정 (Gallery Configuration)
// Requirements: 3.1, 3.2, 3.3, 3.4
// ============================================================================

/**
 * 갤러리 설정 인터페이스
 */
export interface GalleryConfig {
  /** 갤러리 이미지 목록 */
  images: GalleryImage[];
  /** 레이아웃 타입 */
  layout: 'grid' | 'slider';
}

/**
 * 갤러리 이미지 인터페이스
 */
export interface GalleryImage {
  /** 고유 식별자 */
  id: string;
  /** 이미지 URL */
  url: string;
  /** 대체 텍스트 (접근성) */
  alt: string;
  /** 표시 순서 */
  order: number;
}


// ============================================================================
// 위치 정보 (Location Information)
// Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6
// ============================================================================

/**
 * 위치 정보 인터페이스
 */
export interface LocationConfig {
  /** 주소 */
  address: string;
  /** 상세 주소 (선택) */
  detailAddress?: string;
  /** 좌표 정보 */
  coordinates: {
    /** 위도 */
    lat: number;
    /** 경도 */
    lng: number;
  };
  /** 교통 안내 정보 (선택) */
  transportation?: {
    /** 지하철 안내 */
    subway?: string;
    /** 버스 안내 */
    bus?: string;
    /** 자가용 안내 */
    car?: string;
    /** 주차 안내 */
    parking?: string;
  };
}

// ============================================================================
// 계좌 정보 (Account Information)
// Requirements: 5.1, 5.2, 5.3, 5.4
// ============================================================================

/**
 * 계좌 정보 설정 인터페이스
 */
export interface AccountConfig {
  /** 신랑측 계좌 목록 */
  groom: BankAccount[];
  /** 신부측 계좌 목록 */
  bride: BankAccount[];
}

/**
 * 은행 계좌 인터페이스
 */
export interface BankAccount {
  /** 은행명 */
  bank: string;
  /** 계좌번호 */
  accountNumber: string;
  /** 예금주 */
  holder: string;
  /** 카카오페이 송금 링크 (선택) */
  kakaoPayLink?: string;
}

// ============================================================================
// 방명록 설정 및 데이터 모델 (Guestbook)
// Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 10.1
// ============================================================================

/**
 * 방명록 설정 인터페이스
 */
export interface GuestbookConfig {
  /** 방명록 기능 활성화 여부 */
  enabled: boolean;
  /** 메시지 최대 길이 */
  maxLength: number;
}

/**
 * 방명록 메시지 데이터 모델
 * Firebase에 저장되는 메시지 형태
 */
export interface GuestbookMessage {
  /** 고유 식별자 */
  id: string;
  /** 작성자 이름 */
  name: string;
  /** 비밀번호 해시 (삭제 시 검증용) */
  passwordHash: string;
  /** 축하 메시지 내용 */
  message: string;
  /** 작성 일시 */
  createdAt: Date;
}

/**
 * 방명록 입력 인터페이스
 * 사용자가 방명록 작성 시 입력하는 데이터
 */
export interface GuestbookInput {
  /** 작성자 이름 */
  name: string;
  /** 비밀번호 (평문, 저장 시 해시됨) */
  password: string;
  /** 축하 메시지 내용 */
  message: string;
}

// ============================================================================
// RSVP 설정 및 데이터 모델 (RSVP)
// Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 10.2
// ============================================================================

/**
 * RSVP 설정 인터페이스
 */
export interface RsvpConfig {
  /** RSVP 기능 활성화 여부 */
  enabled: boolean;
  /** 식사 옵션 표시 여부 */
  mealOption: boolean;
  /** RSVP 마감일 (선택, ISO 8601 format) */
  deadline?: string;
}

/**
 * RSVP 응답 데이터 모델
 * Firebase에 저장되는 응답 형태
 */
export interface RsvpResponse {
  /** 고유 식별자 */
  id: string;
  /** 응답자 이름 */
  name: string;
  /** 연락처 */
  phone: string;
  /** 참석 여부 */
  attending: boolean;
  /** 참석 인원 */
  guestCount: number;
  /** 식사 참석 여부 (선택) */
  mealAttending?: boolean;
  /** 추가 메시지 (선택) */
  message?: string;
  /** 응답 일시 */
  createdAt: Date;
}

/**
 * RSVP 입력 인터페이스
 * 사용자가 RSVP 제출 시 입력하는 데이터
 */
export interface RsvpInput {
  /** 응답자 이름 */
  name: string;
  /** 연락처 */
  phone: string;
  /** 참석 여부 */
  attending: boolean;
  /** 참석 인원 */
  guestCount: number;
  /** 식사 참석 여부 (선택) */
  mealAttending?: boolean;
  /** 추가 메시지 (선택) */
  message?: string;
}


// ============================================================================
// 공유 설정 (Share Configuration)
// Requirements: 8.1, 8.2, 8.3, 8.4
// ============================================================================

/**
 * 공유 설정 인터페이스
 */
export interface ShareConfig {
  /** 카카오톡 공유 기능 활성화 여부 */
  kakaoEnabled: boolean;
  /** 카카오 앱 키 (선택) */
  kakaoAppKey?: string;
  /** Open Graph 이미지 URL (선택) */
  ogImage?: string;
  /** Open Graph 제목 (선택) */
  ogTitle?: string;
  /** Open Graph 설명 (선택) */
  ogDescription?: string;
}

// ============================================================================
// 테마 설정 (Theme Configuration)
// Requirements: 9.1, 9.2, 9.3, 9.4
// ============================================================================

/**
 * 테마 설정 인터페이스
 */
export interface ThemeConfig {
  /** 주요 색상 (hex 코드) */
  primaryColor: string;
  /** 폰트 패밀리 */
  fontFamily: string;
  /** 배경 이미지 URL (선택) */
  backgroundImage?: string;
}

// ============================================================================
// 컴포넌트 Props 인터페이스 (Component Props)
// ============================================================================

/**
 * CoupleInfo 컴포넌트 Props
 */
export interface CoupleInfoProps {
  config: CoupleConfig;
}

/**
 * EventInfo 컴포넌트 Props
 */
export interface EventInfoProps {
  config: EventConfig;
}

/**
 * Gallery 컴포넌트 Props
 */
export interface GalleryProps {
  config: GalleryConfig;
}

/**
 * Map 컴포넌트 Props
 */
export interface MapProps {
  config: LocationConfig;
}

/**
 * Account 컴포넌트 Props
 */
export interface AccountProps {
  config: AccountConfig;
}

/**
 * Guestbook 컴포넌트 Props
 */
export interface GuestbookProps {
  config: GuestbookConfig;
  messages: GuestbookMessage[];
  onSubmit: (input: GuestbookInput) => Promise<void>;
  onDelete: (id: string, password: string) => Promise<void>;
}

/**
 * RSVP 컴포넌트 Props
 */
export interface RsvpProps {
  config: RsvpConfig;
  onSubmit: (input: RsvpInput) => Promise<void>;
}

/**
 * Share 컴포넌트 Props
 */
export interface ShareProps {
  config: ShareConfig;
  url: string;
}

// ============================================================================
// 애플리케이션 상태 (Application State)
// ============================================================================

/**
 * 애플리케이션 전역 상태 인터페이스
 */
export interface AppState {
  /** 청첩장 설정 데이터 */
  config: WeddingConfig | null;
  /** 방명록 메시지 목록 */
  guestbookMessages: GuestbookMessage[];
  /** 로딩 상태 */
  isLoading: boolean;
  /** 오류 메시지 */
  error: string | null;
}

/**
 * 갤러리 모달 상태 인터페이스
 */
export interface GalleryModalState {
  /** 모달 열림 여부 */
  isOpen: boolean;
  /** 현재 표시 중인 이미지 인덱스 */
  currentIndex: number;
}

/**
 * 폼 상태 인터페이스 (제네릭)
 */
export interface FormState<T> {
  /** 폼 데이터 */
  data: T;
  /** 필드별 오류 메시지 */
  errors: Record<string, string>;
  /** 제출 중 여부 */
  isSubmitting: boolean;
}


// ============================================================================
// 유틸리티 타입 (Utility Types)
// ============================================================================

/**
 * D-Day 계산 결과 인터페이스
 * Requirements: 2.4
 */
export interface DdayResult {
  /** 남은 일수 (절대값) */
  days: number;
  /** 결혼식이 지났는지 여부 */
  isPast: boolean;
  /** 오늘이 결혼식인지 여부 */
  isToday: boolean;
}

/**
 * 클립보드 복사 결과 인터페이스
 * Requirements: 4.5, 5.2, 8.2
 */
export interface CopyResult {
  /** 복사 성공 여부 */
  success: boolean;
  /** 오류 메시지 (실패 시) */
  error?: string;
}

/**
 * 유효성 검사 결과 인터페이스
 * Requirements: 6.3, 7.4
 */
export interface ValidationResult {
  /** 유효성 검사 통과 여부 */
  isValid: boolean;
  /** 필드별 오류 메시지 */
  errors: Record<string, string>;
}

// ============================================================================
// 오류 처리 (Error Handling)
// Requirements: 10.3
// ============================================================================

/**
 * API 오류 코드 타입
 */
export type ApiErrorCode = 'NETWORK_ERROR' | 'SERVER_ERROR' | 'VALIDATION_ERROR' | 'NOT_FOUND';

/**
 * API 오류 인터페이스
 */
export interface ApiError {
  /** 오류 코드 */
  code: ApiErrorCode;
  /** 오류 메시지 */
  message: string;
  /** 상세 오류 정보 (선택) */
  details?: Record<string, string>;
}

// ============================================================================
// 카카오 SDK 타입 (Kakao SDK Types)
// Requirements: 8.1
// Note: Window.Kakao 전역 타입은 src/vite-env.d.ts에 정의되어 있습니다.
// ============================================================================

/**
 * 카카오 공유 링크 인터페이스
 */
export interface KakaoShareLink {
  mobileWebUrl: string;
  webUrl: string;
}

/**
 * 카카오 공유 콘텐츠 인터페이스
 */
export interface KakaoShareContent {
  title: string;
  description?: string;
  imageUrl?: string;
  link: KakaoShareLink;
}

/**
 * 카카오 공유 버튼 인터페이스
 */
export interface KakaoShareButton {
  title: string;
  link: KakaoShareLink;
}
