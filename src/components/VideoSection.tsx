/**
 * VideoSection 컴포넌트
 * 
 * 식전 영상을 표시하는 섹션 (YouTube 임베드 또는 직접 비디오)
 */

interface VideoSectionProps {
  youtubeId?: string;  // YouTube 영상 ID
  videoUrl?: string;   // 직접 비디오 URL
  title?: string;
}

export const VideoSection = ({ 
  youtubeId, 
  videoUrl,
  title = '식전 영상' 
}: VideoSectionProps) => {
  // YouTube ID나 비디오 URL이 없으면 렌더링하지 않음
  if (!youtubeId && !videoUrl) return null;

  return (
    <section className="section-container" aria-labelledby="video-section-title">
      <div className="card">
        <h2 
          id="video-section-title"
          className="text-center font-serif text-2xl sm:text-3xl font-light text-gray-800 mb-8 tracking-wider"
        >
          Pre-Wedding Film
        </h2>

        <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-md">
          {youtubeId ? (
            // YouTube 임베드
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
              title={title}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : videoUrl ? (
            // 직접 비디오
            <video
              src={videoUrl}
              controls
              className="absolute inset-0 w-full h-full object-cover"
              playsInline
            >
              <track kind="captions" />
              브라우저가 비디오를 지원하지 않습니다.
            </video>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
