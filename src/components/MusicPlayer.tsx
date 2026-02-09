/**
 * MusicPlayer 컴포넌트
 * 
 * 배경음악 재생/일시정지 기능을 제공하는 플로팅 버튼
 */

import { useState, useRef, useEffect } from 'react';

interface MusicPlayerProps {
  src: string;
  autoPlay?: boolean;
}

export const MusicPlayer = ({ src, autoPlay = false }: MusicPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleCanPlay = () => setIsLoaded(true);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('canplaythrough', handleCanPlay);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  // 자동 재생 시도 (사용자 인터랙션 필요할 수 있음)
  useEffect(() => {
    if (autoPlay && isLoaded && audioRef.current) {
      audioRef.current.play().catch(() => {
        // 자동 재생 차단됨 - 사용자가 버튼 클릭해야 함
        setIsPlaying(false);
      });
    }
  }, [autoPlay, isLoaded]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Audio playback failed:', error);
    }
  };

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="auto" />
      
      {/* 플로팅 뮤직 버튼 */}
      <button
        onClick={togglePlay}
        className={`fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          isPlaying 
            ? 'bg-gold-500 text-white' 
            : 'bg-white text-gold-600 border border-gold-300'
        }`}
        aria-label={isPlaying ? '음악 일시정지' : '음악 재생'}
      >
        {isPlaying ? (
          // Pause icon
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          // Play icon (music note)
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
        )}
        
        {/* 재생 중 애니메이션 */}
        {isPlaying && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-gold-500"></span>
          </span>
        )}
      </button>
    </>
  );
};

export default MusicPlayer;
