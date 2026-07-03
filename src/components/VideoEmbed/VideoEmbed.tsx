import React from "react";
import styles from "./VideoEmbed.module.css";

interface VideoEmbedProps {
  videoUrl: string;
}

export const VideoEmbed: React.FC<VideoEmbedProps> = ({ videoUrl }) => {
  if (!videoUrl) return null;

  // Helper to extract YouTube video ID
  const getYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Helper to extract Vimeo video ID
  const getVimeoId = (url: string): string | null => {
    const regExp = /(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_\-]+)?/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const ytId = getYouTubeId(videoUrl);
  const vimeoId = getVimeoId(videoUrl);
  const isDirectVideo = videoUrl.match(/\.(mp4|webm|ogg)$/i) || videoUrl.includes("mov_bbb"); // check direct URL

  if (ytId) {
    return (
      <div className={styles.container}>
        <iframe
          src={`https://www.youtube.com/embed/${ytId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className={styles.iframe}
        ></iframe>
      </div>
    );
  }

  if (vimeoId) {
    return (
      <div className={styles.container}>
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}`}
          title="Vimeo video player"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className={styles.iframe}
        ></iframe>
      </div>
    );
  }

  if (isDirectVideo) {
    return (
      <div className={styles.container}>
        <video controls className={styles.video} preload="metadata">
          <source src={videoUrl} />
          Trình duyệt của bạn không hỗ trợ thẻ phát video.
        </video>
      </div>
    );
  }

  // Fallback if URL is generic but might be embeddable or just a link
  return (
    <div className={styles.fallbackContainer}>
      <p className={styles.fallbackText}>Đường dẫn video không được nhận diện tự động.</p>
      <a href={videoUrl} target="_blank" rel="noopener noreferrer" className={styles.fallbackLink}>
        Xem video trên trang gốc ↗
      </a>
    </div>
  );
};
