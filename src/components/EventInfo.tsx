/**
 * EventInfo 컴포넌트
 * 
 * 결혼식 날짜, 시간, 장소, D-Day 카운트다운, 캘린더 추가 버튼을 표시하는 컴포넌트
 * 
 * Requirements:
 * - 2.1: 결혼식 날짜를 표시
 * - 2.2: 결혼식 시간을 표시
 * - 2.3: 예식장 이름과 홀 정보를 표시
 * - 2.4: D-Day 카운트다운을 표시
 * - 2.5: 캘린더 앱에 일정을 추가할 수 있는 기능을 제공
 */

import { EventConfig, LocationConfig } from '../types';
import { calculateDDay, generateCalendarUrl } from '../utils/date';

/**
 * EventInfo 컴포넌트 Props
 * LocationConfig는 캘린더 URL 생성에 필요하므로 선택적으로 받습니다.
 */
export interface EventInfoProps {
  config: EventConfig;
  location?: LocationConfig;
}

/**
 * 한국어 요일 배열
 */
const KOREAN_DAYS = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

/**
 * 날짜를 한국어 형식으로 포맷팅
 * @param dateString - ISO 8601 형식의 날짜 문자열 (YYYY-MM-DD)
 * @returns 포맷된 날짜 문자열 (YYYY년 MM월 DD일 요일)
 */
const formatKoreanDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = KOREAN_DAYS[date.getDay()];
  
  return `${year}년 ${month}월 ${day}일 ${dayOfWeek}`;
};

/**
 * 시간을 한국어 형식으로 포맷팅
 * @param timeString - HH:mm 형식의 시간 문자열
 * @returns 포맷된 시간 문자열 (HH시 MM분 또는 오전/오후 HH시 MM분)
 */
const formatKoreanTime = (timeString: string): string => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const period = hours < 12 ? '오전' : '오후';
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  
  if (minutes === 0) {
    return `${period} ${displayHours}시`;
  }
  return `${period} ${displayHours}시 ${minutes}분`;
};

/**
 * 캘린더 아이콘 컴포넌트
 */
const CalendarIcon = () => (
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
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

/**
 * D-Day 표시 컴포넌트 - Premium elegant design
 */
interface DdayDisplayProps {
  eventDate: string;
}

const DdayDisplay = ({ eventDate }: DdayDisplayProps) => {
  const dday = calculateDDay(eventDate);
  
  let ddayText: string;
  let ddayLabel: string;
  
  if (dday.isToday) {
    ddayText = 'D-Day';
    ddayLabel = '오늘이 결혼식입니다';
  } else if (dday.isPast) {
    ddayText = `D+${dday.days}`;
    ddayLabel = `결혼식이 ${dday.days}일 지났습니다`;
  } else {
    ddayText = `D-${dday.days}`;
    ddayLabel = `결혼식까지 ${dday.days}일 남았습니다`;
  }
  
  return (
    <div 
      className="inline-flex items-center justify-center"
      role="status"
      aria-label={ddayLabel}
    >
      <div className="relative">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-gold-300 flex items-center justify-center">
          <span className="font-serif text-xl sm:text-2xl text-gold-600 tracking-wider">{ddayText}</span>
        </div>
      </div>
    </div>
  );
};

/**
 * 캘린더 추가 버튼 컴포넌트
 */
interface CalendarButtonProps {
  event: EventConfig;
  location: LocationConfig;
}

const CalendarButton = ({ event, location }: CalendarButtonProps) => {
  const calendarUrl = generateCalendarUrl(event, location);
  
  return (
    <a
      href={calendarUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors tap-target shadow-sm"
      aria-label="Google 캘린더에 결혼식 일정 추가하기"
    >
      <CalendarIcon />
      <span className="text-sm font-medium">캘린더에 추가</span>
    </a>
  );
};

/**
 * 장소 아이콘 컴포넌트
 */
const LocationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

/**
 * EventInfo 메인 컴포넌트
 * 
 * @param config - 결혼식 이벤트 설정
 * @param location - 위치 설정 (캘린더 URL 생성에 필요, 선택적)
 */
export const EventInfo = ({ config, location }: EventInfoProps) => {
  const { date, time, venueName, hallName, calendarEnabled } = config;
  
  const formattedDate = formatKoreanDate(date);
  const formattedTime = formatKoreanTime(time);
  
  // 캘린더 버튼 표시 여부: calendarEnabled가 true이고 location이 제공된 경우
  const showCalendarButton = calendarEnabled && location;
  
  return (
    <section className="section-container" aria-labelledby="event-info-title">
      <div className="card">
        {/* 섹션 제목 - Premium serif */}
        <h2 
          id="event-info-title" 
          className="text-center font-serif text-2xl sm:text-3xl font-light text-gray-800 mb-8 sm:mb-10 tracking-wider"
        >
          예식 안내
        </h2>
        
        {/* D-Day 카운트다운 - Premium circular design */}
        <div className="flex justify-center mb-8">
          <DdayDisplay eventDate={date} />
        </div>
        
        {/* 날짜 및 시간 정보 */}
        <div className="text-center space-y-3 mb-8">
          {/* 날짜 - Requirements 2.1 */}
          <p 
            className="font-serif text-xl sm:text-2xl text-gray-800 font-light tracking-wide"
            aria-label={`결혼식 날짜: ${formattedDate}`}
          >
            {formattedDate}
          </p>
          
          {/* 시간 - Requirements 2.2 */}
          <p 
            className="text-base sm:text-lg text-gray-600 tracking-wide"
            aria-label={`결혼식 시간: ${formattedTime}`}
          >
            {formattedTime}
          </p>
        </div>
        
        {/* Elegant divider */}
        <div className="flex items-center justify-center mb-8" aria-hidden="true">
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-gold-300 to-transparent"></div>
        </div>
        
        {/* 장소 정보 - Requirements 2.3 */}
        <div className="flex items-center justify-center gap-2 text-center mb-10">
          <LocationIcon />
          <div>
            <p 
              className="font-serif text-lg sm:text-xl text-gray-800 font-light tracking-wide"
              aria-label={`예식장: ${venueName}`}
            >
              {venueName}
            </p>
            {hallName && (
              <p 
                className="text-sm sm:text-base text-gray-500 mt-1 tracking-wide"
                aria-label={`홀: ${hallName}`}
              >
                {hallName}
              </p>
            )}
          </div>
        </div>
        
        {/* 캘린더 추가 버튼 - Requirements 2.5 - Premium minimal design */}
        {showCalendarButton && (
          <div className="flex justify-center">
            <CalendarButton event={config} location={location} />
          </div>
        )}
      </div>
    </section>
  );
};

export default EventInfo;
