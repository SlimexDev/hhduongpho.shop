import React, { useEffect } from "react";
import { Post } from "@/data/seedData";
import { VideoEmbed } from "../VideoEmbed/VideoEmbed";
import { CustomRender } from "../CustomRender/CustomRender";
import styles from "./PostDetail.module.css";

interface PostDetailProps {
  post: Post;
  onClose: () => void;
}

export const PostDetail: React.FC<PostDetailProps> = ({ post, onClose }) => {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const formattedDate = new Date(post.createdAt).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Đóng">
          ✕
        </button>



        <div className={styles.body}>
          <div className={styles.meta}>
            <span className={styles.author}>✍️ Tác giả: <strong>{post.author}</strong></span>
            <span className={styles.date}>📅 {formattedDate}</span>
          </div>

          <h1 className={styles.title}>{post.title}</h1>

          <div className={styles.content}>
            {/* Split paragraphs by double newlines */}
            {post.content.split("\n\n").map((para, idx) => (
              <p key={idx} className={styles.paragraph}>
                {para}
              </p>
            ))}
          </div>

          {/* Render embedded video if URL is present */}
          {post.videoUrl && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>🎥 Video đính kèm</h3>
              <VideoEmbed videoUrl={post.videoUrl} />
            </div>
          )}

          {/* Render custom HTML, CSS, JS if present */}
          {(post.customHtml || post.customCss || post.customJs) && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>⚡ Nội dung tương tác (Custom Code)</h3>
              <CustomRender
                html={post.customHtml}
                css={post.customCss}
                js={post.customJs}
                postId={post.id}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
