import React from "react";
import { Post } from "@/data/seedData";
import styles from "./PostCard.module.css";

interface PostCardProps {
  post: Post;
  onClick: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onClick }) => {
  const formattedDate = new Date(post.createdAt).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const hasCode = !!(post.customHtml || post.customCss || post.customJs);

  return (
    <article className={styles.card} onClick={onClick}>
      {post.imageUrl && (
        <div className={styles.imageWrapper}>
          <img
            src={post.imageUrl}
            alt={post.title}
            className={styles.image}
            loading="lazy"
            onError={(e) => {
              // Fallback image if link fails
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80";
            }}
          />
          <div className={styles.badges}>
            {post.videoUrl && <span className={styles.videoBadge}>🎥 Video</span>}
            {hasCode && <span className={styles.codeBadge}>⚡ Tương tác</span>}
          </div>
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.meta}>
          <span className={styles.author}>✍️ {post.author}</span>
          <span className={styles.date}>{formattedDate}</span>
        </div>
        <h3 className={styles.title}>{post.title}</h3>
        <p className={styles.excerpt}>{post.excerpt}</p>
        <div className={styles.footer}>
          <span className={styles.readMore}>Đọc chi tiết →</span>
        </div>
      </div>
    </article>
  );
};
