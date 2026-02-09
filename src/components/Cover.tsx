/**
 * Cover 컴포넌트
 * 
 * 풀스크린 세로 사진 커버 + 텍스트 오버레이
 * 첫 화면에서 감성 전달 최우선
 */

import { useEffect, useState } from 'react';

interface CoverProps {
  groomName: string;
  brideName: string;
  date: string;
  time: string;
  venueName: string;
  coverImage: string;
}

/**
 * 스크롤 다운 아이콘 컴포넌트
 */
const ScrollDownIcon = () => (
  <div className="animate-bounce">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M19 14l-7 7m0 0l-7-7m7 7V3"
      />
    </svg>
  </div>
);

/**
 * 날짜 포맷팅 (큰 숫자 스타일)
 */
const formatDateParts = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const weekday = weekdays[date.getDay()];
  
  return { year, month, day, weekday };
};

export const Cover = ({ groomName, brideName, date, time, venueName, coverImage }: CoverProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const dateParts = formatDateParts(date);
  
  // 시간 포맷팅 (14:00 -> 2:00 PM)
  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
  };

  useEffect(() => {
    // 이미지 프리로드
    const img = new Image();
    img.src = coverImage;
    img.onload = () => setIsLoaded(true);
  }, [coverImage]);

  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <section 
      className="relative h-screen w-full overflow-hidden"
      aria-label="웨딩 커버"
    >
      {/* 배경 이미지 */}
      <div 
        className={`absolute inset-0 transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ willChange: isLoaded ? 'auto' : 'opacity' }}
      >
        <img
          src={coverImage}
          alt="웨딩 커버 사진"
          className="w-full h-full object-cover object-center"
          style={{ transform: 'translateZ(0)' }}
        />
      </div>
      
      {/* 로딩 플레이스홀더 */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      {/* 상단 그라데이션 오버레이 */}
      <div 
        className="absolute top-0 left-0 right-0 h-48 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)'
        }}
      />
      
      {/* 하단 그라데이션 오버레이 */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)'
        }}
      />
      
      {/* 상단 텍스트 - 이름 */}
      <div className="absolute top-0 left-0 right-0 pt-safe">
        <div className="pt-12 px-6 text-center">
          <p 
            className={`font-serif text-white text-2xl sm:text-3xl tracking-[0.2em] font-light transition-all duration-700 delay-200 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
            style={{ transform: isLoaded ? 'translateY(0) translateZ(0)' : 'translateY(-1rem) translateZ(0)' }}
          >
            {groomName}
            <span className="mx-3 text-white/70">&</span>
            {brideName}
          </p>
        </div>
      </div>
      
      {/* 하단 텍스트 - 날짜, 시간, 장소 */}
      <div className="absolute bottom-0 left-0 right-0 pb-safe">
        <div className="pb-20 px-6 text-center text-white">
          {/* 날짜 - 큰 숫자 스타일 */}
          <div 
            className={`mb-4 transition-all duration-700 delay-300 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transform: isLoaded ? 'translateY(0) translateZ(0)' : 'translateY(1rem) translateZ(0)' }}
          >
            <div className="flex items-center justify-center gap-2 font-serif">
              <span className="text-5xl sm:text-6xl font-light tracking-wider">
                {dateParts.month}
              </span>
              <span className="text-3xl sm:text-4xl text-white/60">.</span>
              <span className="text-5xl sm:text-6xl font-light tracking-wider">
                {dateParts.day}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-center gap-3 text-sm sm:text-base text-white/80 tracking-widest">
              <span>{dateParts.year}</span>
              <span className="text-white/40">|</span>
              <span>{dateParts.weekday}</span>
              <span className="text-white/40">|</span>
              <span>{formatTime(time)}</span>
            </div>
          </div>
          
          {/* 장소 */}
          <p 
            className={`text-sm sm:text-base text-white/70 tracking-wider transition-all duration-700 delay-500 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {venueName}
          </p>
          
          {/* 스크롤 다운 버튼 */}
          <button
            onClick={handleScrollDown}
            className={`mt-8 text-white/60 hover:text-white transition-all duration-700 delay-700 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            aria-label="아래로 스크롤"
          >
            <ScrollDownIcon />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Cover;
