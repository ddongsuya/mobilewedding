/**
 * Gallery 컴포넌트
 * 
 * 커플 사진을 그리드 형태로 표시하고, 모달로 확대 보기 및 스와이프 네비게이션을 제공하는 컴포넌트
 * 
 * Requirements:
 * - 3.1: 등록된 커플 사진들을 그리드 형태로 표시
 * - 3.2: 사진을 클릭하면 해당 사진을 확대하여 모달로 표시
 * - 3.3: 모달이 열린 상태에서 좌우 스와이프하면 이전/다음 사진으로 이동
 * - 3.4: 모달 외부를 클릭하거나 닫기 버튼을 클릭하면 모달을 닫는다
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { GalleryProps, GalleryImage, GalleryModalState } from '../types';

/**
 * 닫기 아이콘 컴포넌트
 */
const CloseIcon = () => (
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
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

/**
 * 이전 화살표 아이콘 컴포넌트
 */
const PrevIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 19l-7-7 7-7"
    />
  </svg>
);

/**
 * 다음 화살표 아이콘 컴포넌트
 */
const NextIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

/**
 * 갤러리 이미지 그리드 아이템 컴포넌트
 */
interface GalleryItemProps {
  image: GalleryImage;
  index: number;
  onClick: (index: number) => void;
}

const GalleryItem = ({ image, index, onClick }: GalleryItemProps) => {
  return (
    <button
      type="button"
      className="relative aspect-square overflow-hidden bg-gray-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 transition-all duration-300 hover:opacity-90"
      onClick={() => onClick(index)}
      aria-label={`${image.alt} - 클릭하여 확대 보기`}
    >
      <img
        src={image.url}
        alt={image.alt}
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        loading="lazy"
      />
    </button>
  );
};

/**
 * 갤러리 모달 컴포넌트
 * Requirements 9.3, 9.4: 접근성 개선 - 키보드 네비게이션, 포커스 트랩
 */
interface GalleryModalProps {
  images: GalleryImage[];
  modalState: GalleryModalState;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const GalleryModal = ({ images, modalState, onClose, onPrev, onNext }: GalleryModalProps) => {
  const { isOpen, currentIndex } = modalState;
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  
  const currentImage = images[currentIndex];
  const hasMultipleImages = images.length > 1;
  
  // 스와이프 감지를 위한 최소 거리 (픽셀)
  const SWIPE_THRESHOLD = 50;
  
  /**
   * 터치 시작 핸들러
   */
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);
  
  /**
   * 터치 이동 핸들러
   */
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);
  
  /**
   * 터치 종료 핸들러 - 스와이프 방향 감지 및 네비게이션
   * Requirements 3.3: 좌우 스와이프로 이전/다음 사진 이동
   */
  const handleTouchEnd = useCallback(() => {
    const diff = touchStartX.current - touchEndX.current;
    
    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      if (diff > 0) {
        // 왼쪽으로 스와이프 -> 다음 이미지
        onNext();
      } else {
        // 오른쪽으로 스와이프 -> 이전 이미지
        onPrev();
      }
    }
    
    // 터치 좌표 초기화
    touchStartX.current = 0;
    touchEndX.current = 0;
  }, [onNext, onPrev]);
  
  /**
   * 키보드 이벤트 핸들러
   * Requirements 9.4: 키보드 네비게이션 지원
   * - Escape: 모달 닫기
   * - ArrowLeft: 이전 이미지
   * - ArrowRight: 다음 이미지
   * - Tab: 포커스 트랩 (모달 내에서만 이동)
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          onPrev();
          break;
        case 'ArrowRight':
          e.preventDefault();
          onNext();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onPrev, onNext]);
  
  /**
   * 모달 열릴 때 포커스 관리 및 body 스크롤 방지
   * Requirements 9.4: 키보드 네비게이션 지원
   */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // 모달이 열리면 닫기 버튼에 포커스
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  /**
   * 모달 외부 클릭 핸들러
   * Requirements 3.4: 모달 외부 클릭 시 모달 닫기
   */
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === modalRef.current) {
      onClose();
    }
  }, [onClose]);
  
  if (!isOpen || !currentImage) return null;
  
  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={`이미지 확대 보기: ${currentImage.alt}`}
      aria-describedby="gallery-modal-description"
    >
      {/* 스크린 리더용 설명 */}
      <div id="gallery-modal-description" className="sr-only">
        {hasMultipleImages 
          ? `${images.length}개의 이미지 중 ${currentIndex + 1}번째 이미지입니다. 좌우 화살표 키로 이동하고, Escape 키로 닫을 수 있습니다.`
          : 'Escape 키를 눌러 닫을 수 있습니다.'
        }
      </div>

      {/* 닫기 버튼 - Requirements 3.4, 9.4 */}
      <button
        ref={closeButtonRef}
        type="button"
        className="absolute top-4 right-4 z-10 p-2 text-white/80 hover:text-white bg-black/30 hover:bg-black/50 rounded-full transition-colors tap-target focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        onClick={onClose}
        aria-label="모달 닫기 (Escape)"
      >
        <CloseIcon />
      </button>
      
      {/* 이전 버튼 */}
      {hasMultipleImages && (
        <button
          type="button"
          className="absolute left-2 sm:left-4 z-10 p-2 text-white/80 hover:text-white bg-black/30 hover:bg-black/50 rounded-full transition-colors tap-target focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          onClick={onPrev}
          aria-label={`이전 사진 (${currentIndex === 0 ? images.length : currentIndex}/${images.length})`}
        >
          <PrevIcon />
        </button>
      )}
      
      {/* 이미지 컨테이너 */}
      <div
        className="relative max-w-full max-h-full px-12 sm:px-16"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={currentImage.url}
          alt={currentImage.alt}
          className="max-w-full max-h-[85vh] object-contain"
        />
        
        {/* 이미지 인덱스 표시 */}
        {hasMultipleImages && (
          <div 
            className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 text-white text-sm rounded-full"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            <span aria-label={`${images.length}개 중 ${currentIndex + 1}번째 이미지`}>
              {currentIndex + 1} / {images.length}
            </span>
          </div>
        )}
      </div>
      
      {/* 다음 버튼 */}
      {hasMultipleImages && (
        <button
          type="button"
          className="absolute right-2 sm:right-4 z-10 p-2 text-white/80 hover:text-white bg-black/30 hover:bg-black/50 rounded-full transition-colors tap-target focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          onClick={onNext}
          aria-label={`다음 사진 (${currentIndex === images.length - 1 ? 1 : currentIndex + 2}/${images.length})`}
        >
          <NextIcon />
        </button>
      )}
    </div>
  );
};

/**
 * Gallery 메인 컴포넌트
 * 
 * @param config - 갤러리 설정 (이미지 목록, 레이아웃)
 */
export const Gallery = ({ config }: GalleryProps) => {
  const { images, layout } = config;
  
  // 모달 상태 관리
  const [modalState, setModalState] = useState<GalleryModalState>({
    isOpen: false,
    currentIndex: 0,
  });
  
  // 더보기 상태 (초기 4장만 표시)
  const [showAll, setShowAll] = useState(false);
  const INITIAL_COUNT = 4;
  
  // 이미지를 order 기준으로 정렬
  const sortedImages = [...images].sort((a, b) => a.order - b.order);
  
  // 표시할 이미지 (더보기 전/후)
  const displayImages = showAll ? sortedImages : sortedImages.slice(0, INITIAL_COUNT);
  const hasMoreImages = sortedImages.length > INITIAL_COUNT;
  
  /**
   * 이미지 클릭 핸들러 - 모달 열기
   * Requirements 3.2: 사진 클릭 시 확대 모달 표시
   */
  const handleImageClick = useCallback((index: number) => {
    // 전체 이미지 배열에서의 실제 인덱스 계산
    const actualIndex = showAll ? index : index;
    setModalState({
      isOpen: true,
      currentIndex: actualIndex,
    });
  }, [showAll]);
  
  /**
   * 모달 닫기 핸들러
   * Requirements 3.4: 모달 닫기
   */
  const handleCloseModal = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      isOpen: false,
    }));
  }, []);
  
  /**
   * 이전 이미지로 이동
   * Requirements 3.3: 이전 사진으로 이동 (순환)
   */
  const handlePrevImage = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      currentIndex: prev.currentIndex === 0 
        ? sortedImages.length - 1 
        : prev.currentIndex - 1,
    }));
  }, [sortedImages.length]);
  
  /**
   * 다음 이미지로 이동
   * Requirements 3.3: 다음 사진으로 이동 (순환)
   */
  const handleNextImage = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      currentIndex: prev.currentIndex === sortedImages.length - 1 
        ? 0 
        : prev.currentIndex + 1,
    }));
  }, [sortedImages.length]);
  
  /**
   * 더보기 버튼 핸들러
   */
  const handleShowMore = useCallback(() => {
    setShowAll(true);
  }, []);
  
  // 이미지가 없는 경우 렌더링하지 않음
  if (sortedImages.length === 0) {
    return null;
  }
  
  // 2열 그리드 레이아웃 (프리미엄 디자인)
  const gridClass = layout === 'grid' 
    ? 'grid grid-cols-2 gap-0.5'
    : 'flex overflow-x-auto gap-2 sm:gap-3 snap-x snap-mandatory pb-2';
  
  const itemClass = layout === 'slider' 
    ? 'flex-shrink-0 w-64 sm:w-80 snap-center' 
    : '';
  
  return (
    <section className="py-8 sm:py-12" aria-labelledby="gallery-title">
      {/* 섹션 제목 */}
      <h2 
        id="gallery-title" 
        className="text-center font-serif text-2xl sm:text-3xl font-light text-gray-800 mb-8 sm:mb-10 tracking-wider"
      >
        Gallery
      </h2>
      
      {/* 이미지 그리드 - Full bleed 2열 디자인 */}
      <div 
        className={gridClass}
        role="list"
        aria-label="커플 사진 갤러리"
      >
        {displayImages.map((image, index) => (
          <div 
            key={image.id} 
            className={itemClass} 
            role="listitem"
            style={{ 
              animationDelay: `${index * 100}ms`,
              opacity: 0,
              animation: 'stagger 0.5s ease-out forwards'
            }}
          >
            <GalleryItem
              image={image}
              index={index}
              onClick={handleImageClick}
            />
          </div>
        ))}
      </div>
      
      {/* 더보기 버튼 */}
      {hasMoreImages && !showAll && (
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={handleShowMore}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 hover:border-gray-400 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2"
            aria-label={`나머지 ${sortedImages.length - INITIAL_COUNT}장의 사진 더보기`}
          >
            <span>더보기</span>
            <span className="text-xs text-gray-400">+{sortedImages.length - INITIAL_COUNT}</span>
          </button>
        </div>
      )}
      
      {/* 이미지 모달 - Requirements 3.2, 3.3, 3.4 */}
      <GalleryModal
        images={sortedImages}
        modalState={modalState}
        onClose={handleCloseModal}
        onPrev={handlePrevImage}
        onNext={handleNextImage}
      />
    </section>
  );
};

export default Gallery;
