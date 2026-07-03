"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Post } from "@/data/seedData";
import { VideoEmbed } from "@/components/VideoEmbed/VideoEmbed";
import { CustomRender } from "@/components/CustomRender/CustomRender";
import styles from "./post.module.css";

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && id) {
      const saved = localStorage.getItem("slime_posts");
      if (saved) {
        const postsList: Post[] = JSON.parse(saved);
        const found = postsList.find((p) => p.id === id);
        if (found) {
          setPost(found);
        }
      }
      setIsLoaded(true);
    }
  }, [id]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      const postUrl = `${window.location.origin}/posts/${id}`;
      navigator.clipboard.writeText(postUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  if (!isLoaded) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Đang tải bài viết...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className={styles.notFoundContainer}>
        <h2>Không tìm thấy bài viết</h2>
        <p>Bài viết này có thể đã bị xóa hoặc đường dẫn không chính xác.</p>
        <Link href="/" className={styles.backHomeBtn}>
          🏠 Quay lại trang chủ
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={styles.container}>
      {/* Header section */}
      <header className={styles.header}>
        <Link href="/" className={styles.logoLink}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>🛍️</span>
            <h1 className={styles.logoText}>hhduongpho.shop</h1>
          </div>
        </Link>
        <Link href="/" className={styles.backBtnLink}>
          ⬅️ Quay lại trang chủ
        </Link>
      </header>

      {/* Main post body */}
      <main className={styles.main}>
        <article className={styles.article}>
          {post.imageUrl && (
            <div className={styles.imageContainer}>
              <img
                src={post.imageUrl}
                alt={post.title}
                className={styles.image}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80";
                }}
              />
              <div className={styles.imageOverlay} />
            </div>
          )}

          <div className={styles.body}>
            <div className={styles.metaRow}>
              <div className={styles.meta}>
                <span className={styles.author}>✍️ Tác giả: <strong>{post.author}</strong></span>
                <span className={styles.date}>📅 {formattedDate}</span>
              </div>
              <button 
                onClick={handleCopyLink} 
                className={`${styles.copyLinkBtn} ${copied ? styles.copied : ""}`}
              >
                {copied ? "✅ Đã sao chép link" : "🔗 Sao chép liên kết"}
              </button>
            </div>

            <h1 className={styles.title}>{post.title}</h1>

            <div className={styles.content}>
              {post.content.split("\n\n").map((para, idx) => (
                <p key={idx} className={styles.paragraph}>
                  {para}
                </p>
              ))}
            </div>

            {/* Embedded video */}
            {post.videoUrl && (
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>🎥 Video đính kèm</h3>
                <VideoEmbed videoUrl={post.videoUrl} />
              </section>
            )}

            {/* Custom HTML/CSS/JS code container */}
            {(post.customHtml || post.customCss || post.customJs) && (
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>⚡ Nội dung tương tác (Custom Code)</h3>
                <CustomRender
                  html={post.customHtml}
                  css={post.customCss}
                  js={post.customJs}
                  postId={post.id}
                />
              </section>
            )}
          </div>
        </article>
      </main>
    </div>
  );
}
