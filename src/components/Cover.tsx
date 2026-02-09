/**
 * Cover 컴포넌트
 * 
 * 스크롤 리빌 방식으로 여러 장의 사진이 순차적으로 나타나는 커버
 * 첫 화면에서 강렬한 인상 전달
 */

import { useEffect, useState, useRef } from 'react';

interface CoverProps {
  groomName: string;
  brideName: string;
  date: string;
  time: string;
  venueName: string;
  coverImage: string;
  coverImages?: string[]; // 추가 커버 이미지들
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

/**
 * 개별 커버 섹션 컴포넌트
 */
interface CoverSectionProps {
  image: string;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  groomName?: string;
  brideName?: string;
  date?: string;
  time?: string;
  venueName?: string;
}

const CoverSection = ({ 
  image, 
  index, 
  isFirst, 
  isLast,
  groomName,
  brideName,
  date,
  time,
  venueName
}: CoverSectionProps) => {
  const [isVisible, setIsVisible] = useState(isFirst);
  const [isLoaded, setIsLoaded] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const dateParts = date ? formatDateParts(date) : null;
  
  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
  };

  useEffect(() => {
    const img = new Image();
    img.src = image;
    img.onload = () => setIsLoaded(true);
  }, [image]);

  useEffect(() => {
    if (isFirst) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { 
        threshold: 0.3,
        rootMargin: '-10% 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isFirst]);

  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight * (index + 1),
      behavior: 'smooth'
    });
  };

  return (
    <div 
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden"
      style={{ 
        position: isFirst ? 'relative' : 'sticky',
        top: 0,
        zIndex: index
      }}
    >
      {/* 배경 이미지 with mask reveal effect */}
      <div 
        className="absolute inset-0 transition-all duration-1000 ease-out"
        style={{ 
          clipPath: isVisible 
            ? 'inset(0% 0% 0% 0%)' 
            : 'inset(0% 0% 100% 0%)',
          opacity: isLoaded ? 1 : 0
        }}
      >
        <img
          src={image}
          alt={`웨딩 커버 사진 ${index + 1}`}
          className="w-full h-full object-cover object-center"
          style={{ transform: 'translateZ(0)' }}
        />
      </div>
      
      {/* 로딩 플레이스홀더 */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      {/* 그라데이션 오버레이 - 첫 번째와 마지막에만 */}
      {isFirst && (
        <div 
          className="absolute top-0 left-0 right-0 h-48 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)'
          }}
        />
      )}
      
      <div 
        className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)'
        }}
      />
      
      {/* 첫 번째 섹션: 이름 표시 */}
      {isFirst && groomName && brideName && (
        <div className="absolute top-0 left-0 right-0 pt-safe">
          <div className="pt-12 px-6 text-center">
            <p 
              className={`font-serif text-white text-2xl sm:text-3xl tracking-[0.2em] font-light transition-all duration-700 delay-300 ${
                isVisible && isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
              }`}
            >
              {groomName}
              <span className="mx-3 text-white/70">&</span>
              {brideName}
            </p>
          </div>
        </div>
      )}
      
      {/* 마지막 섹션: 날짜, 시간, 장소 + 스크롤 버튼 */}
      {isLast && dateParts && time && venueName && (
        <div className="absolute bottom-0 left-0 right-0 pb-safe">
          <div className="pb-20 px-6 text-center text-white">
            <div 
              className={`mb-4 transition-all duration-700 delay-500 ${
                isVisible && isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
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
            
            <p 
              className={`text-sm sm:text-base text-white/70 tracking-wider transition-all duration-700 delay-700 ${
                isVisible && isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {venueName}
            </p>
            
            <button
              onClick={handleScrollDown}
              className={`mt-8 text-white/60 hover:text-white transition-all duration-700 delay-900 ${
                isVisible && isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              aria-label="아래로 스크롤"
            >
              <ScrollDownIcon />
            </button>
          </div>
        </div>
      )}

      {/* 중간 섹션: 스크롤 힌트만 */}
      {!isFirst && !isLast && (
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <button
            onClick={handleScrollDown}
            className={`text-white/60 hover:text-white transition-all duration-500 ${
              isVisible && isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            aria-label="아래로 스크롤"
          >
            <ScrollDownIcon />
          </button>
        </div>
      )}
    </div>
  );
};

export const Cover = ({ 
  groomName, 
  brideName, 
  date, 
  time, 
  venueName, 
  coverImage,
  coverImages = []
}: CoverProps) => {
  // 모든 커버 이미지 배열 (기본 이미지 + 추가 이미지)
  const allImages = [coverImage, ...coverImages];
  const totalSections = allImages.length;

  return (
    <section 
      aria-label="웨딩 커버"
      style={{ height: `${totalSections * 100}vh` }}
    >
      {allImages.map((image, index) => (
        <CoverSection
          key={index}
          image={image}
          index={index}
          isFirst={index === 0}
          isLast={index === totalSections - 1}
          groomName={index === 0 ? groomName : undefined}
          brideName={index === 0 ? brideName : undefined}
          date={index === totalSections - 1 ? date : undefined}
          time={index === totalSections - 1 ? time : undefined}
          venueName={index === totalSections - 1 ? venueName : undefined}
        />
      ))}
    </section>
  );
};

export default Cover;
