"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Post } from "@/data/seedData";
import { PostCard } from "@/components/PostCard/PostCard";
import styles from "./page.module.css";

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/posts");
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (e) {
      console.error("Lỗi tải bài viết từ API:", e);
    } finally {
      setIsLoaded(true);
    }
  };

  // Fetch posts on mount and periodically sync
  useEffect(() => {
    fetchPosts();
    const interval = setInterval(fetchPosts, 4000); // sync every 4 seconds
    return () => clearInterval(interval);
  }, []);

  // Filter posts based on search query only
  const filteredPosts = posts.filter((post) => {
    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      post.author.toLowerCase().includes(query)
    );
  });

  if (!isLoaded) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Đang tải bài viết...</p>
      </div>
    );
  }

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

        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Tìm kiếm tiêu đề, tác giả..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          {searchQuery && (
            <button className={styles.clearSearch} onClick={() => setSearchQuery("")}>
              ✕
            </button>
          )}
        </div>
      </header>

      {/* Hero Welcome banner */}
      <section className={styles.hero}>
        <div className={styles.heroGlow}></div>
        <div className={styles.heroContent}>
          <span className={styles.heroTagline}>KÊNH CHIA SẺ KIẾN THỨC MỞ</span>
          <h2 className={styles.heroTitle}>Sáng Tạo Không Giới Hạn</h2>
          <p className={styles.heroSub}>
            Khám phá những bài viết chất lượng cao từ cộng đồng, nhúng trực tiếp hình ảnh, video trực quan và cả các widget tương tác tự chế.
          </p>
        </div>
      </section>

      {/* Main post grid */}
      <main className={styles.main}>
        {filteredPosts.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>Không tìm thấy bài viết nào phù hợp.</p>
            <button
              onClick={() => setSearchQuery("")}
              className={styles.resetFilterBtn}
            >
              Xem tất cả bài viết
            </button>
          </div>
        ) : (
          <div className={styles.grid}>
            {filteredPosts.map((post) => (
              <Link href={`/posts/${post.id}`} key={post.id} style={{ display: "contents" }}>
                <PostCard post={post} onClick={() => {}} />
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
