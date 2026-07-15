"use client";

import React, { useState, useEffect } from "react";
import { Post } from "@/data/seedData";
import { VideoEmbed } from "@/components/VideoEmbed/VideoEmbed";
import { CustomRender } from "@/components/CustomRender/CustomRender";
import styles from "./dev.slime.module.css";
import Link from "next/link";

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<"list" | "form" | "preview" | "global">("list");
  
  // Post Form State
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("Admin");
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [customHtml, setCustomHtml] = useState("");
  const [customCss, setCustomCss] = useState("");
  const [customJs, setCustomJs] = useState("");
  
  const [editingId, setEditingId] = useState<string | null>(null);

  // Global Code State
  const [globalHtml, setGlobalHtml] = useState("");
  const [globalCss, setGlobalCss] = useState("");
  const [globalJs, setGlobalJs] = useState("");

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/posts");
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (e) {
      console.error("Lỗi tải bài viết từ API:", e);
    }
  };

  const fetchGlobalCode = async () => {
    try {
      const res = await fetch("/api/global-code");
      if (res.ok) {
        const data = await res.json();
        setGlobalHtml(data.html || "");
        setGlobalCss(data.css || "");
        setGlobalJs(data.js || "");
      }
    } catch (e) {
      console.error("Lỗi tải cấu hình toàn trang:", e);
    }
  };

  // Load initial data on mount
  useEffect(() => {
    const initData = async () => {
      await Promise.all([fetchPosts(), fetchGlobalCode()]);
      setIsLoaded(true);
    };
    initData();
  }, []);

  // Reset form inputs
  const resetForm = () => {
    setTitle("");
    setExcerpt("");
    setContent("");
    setAuthor("Admin");
    setImageUrl("");
    setVideoUrl("");
    setCustomHtml("");
    setCustomCss("");
    setCustomJs("");
    setEditingId(null);
  };

  // Handle Form Submit (Save / Edit Post)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      alert("Tiêu đề và nội dung bài viết không được để trống!");
      return;
    }

    const defaultImage = imageUrl.trim() || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80";

    const postPayload: Post = {
      id: editingId || "post-" + Date.now(),
      title,
      excerpt: excerpt.trim() || content.substring(0, 120) + "...",
      content,
      category: "Chung", // default category
      author,
      imageUrl: defaultImage,
      videoUrl: videoUrl.trim() || undefined,
      customHtml: customHtml.trim() || undefined,
      customCss: customCss.trim() || undefined,
      customJs: customJs.trim() || undefined,
      createdAt: editingId 
        ? (posts.find(p => p.id === editingId)?.createdAt || new Date().toISOString()) 
        : new Date().toISOString(),
    };

    fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postPayload),
    })
      .then(async (res) => {
        if (res.ok) {
          alert(editingId ? "Đã cập nhật bài viết thành công!" : "Đã đăng bài viết mới thành công!");
          await fetchPosts();
          resetForm();
          setActiveTab("list");
        } else {
          alert("Lỗi khi lưu bài viết lên máy chủ.");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Lỗi kết nối đến máy chủ.");
      });
  };

  // Set up form for Editing
  const startEdit = (post: Post) => {
    setEditingId(post.id);
    setTitle(post.title);
    setExcerpt(post.excerpt);
    setContent(post.content);
    setAuthor(post.author);
    setImageUrl(post.imageUrl || "");
    setVideoUrl(post.videoUrl || "");
    setCustomHtml(post.customHtml || "");
    setCustomCss(post.customCss || "");
    setCustomJs(post.customJs || "");
    setActiveTab("form");
  };

  // Delete a post
  const deletePost = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) {
      fetch(`/api/posts?id=${id}`, {
        method: "DELETE",
      })
        .then(async (res) => {
          if (res.ok) {
            alert("Đã xóa bài viết thành công!");
            await fetchPosts();
          } else {
            alert("Lỗi khi xóa bài viết.");
          }
        })
        .catch((err) => {
          console.error(err);
          alert("Lỗi kết nối đến máy chủ.");
        });
    }
  };

  // Copy post link
  const handleCopyPostLink = (postId: string) => {
    if (typeof window !== "undefined") {
      const postUrl = `${window.location.origin}/posts/${postId}`;
      navigator.clipboard.writeText(postUrl).then(() => {
        alert(`Đã sao chép link bài viết:\n${postUrl}`);
      });
    }
  };

  // Reset to original seed data
  const handleResetData = () => {
    if (confirm("Hành động này sẽ khôi phục dữ liệu về bài viết mặc định và xóa hết các bài viết bạn đã đăng. Bạn có chắc không?")) {
      fetch("/api/posts?action=reset", {
        method: "POST",
      })
        .then(async (res) => {
          if (res.ok) {
            alert("Đã khôi phục dữ liệu mẫu thành công!");
            await fetchPosts();
            resetForm();
            setActiveTab("list");
          } else {
            alert("Lỗi khi khôi phục dữ liệu.");
          }
        })
        .catch((err) => {
          console.error(err);
          alert("Lỗi kết nối đến máy chủ.");
        });
    }
  };

  // Handle Save Global Config
  const handleSaveGlobal = (e: React.FormEvent) => {
    e.preventDefault();
    const globalCode = {
      html: globalHtml,
      css: globalCss,
      js: globalJs,
    };

    fetch("/api/global-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(globalCode),
    })
      .then(async (res) => {
        if (res.ok) {
          alert("Đã lưu cấu hình HTML/CSS/JS toàn trang thành công!");
          await fetchGlobalCode();
          setActiveTab("list");
        } else {
          alert("Lỗi khi lưu cấu hình toàn trang.");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Lỗi kết nối đến máy chủ.");
      });
  };

  if (!isLoaded) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Đang tải trang quản trị...</p>
      </div>
    );
  }

  // Create temporary post object for previewing
  const previewPost: Post = {
    id: editingId || "preview-temp",
    title: title || "Tiêu đề bài viết thử nghiệm",
    excerpt: excerpt || "Tóm tắt bài viết sẽ hiển thị ở đây...",
    content: content || "Nội dung bài viết thử nghiệm. Hãy nhập nội dung để xem trước.",
    category: "Chung",
    author: author || "Admin",
    imageUrl: imageUrl.trim() || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    videoUrl: videoUrl.trim() || undefined,
    customHtml: customHtml.trim() || undefined,
    customCss: customCss.trim() || undefined,
    customJs: customJs.trim() || undefined,
    createdAt: new Date().toISOString(),
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.logoLink}>
          <div className={styles.logoArea}>
            <span className={styles.logoIcon}>🛍️</span>
            <div>
              <h1 className={styles.logoText}>hhduongpho.shop</h1>
              <p className={styles.logoSubtext}>Trang quản trị (Admin Dashboard)</p>
            </div>
          </div>
        </Link>
        <div className={styles.headerActions}>
          <a href="/" className={styles.viewSiteBtn}>
            🏠 Xem trang chủ người dùng
          </a>
          <button onClick={handleResetData} className={styles.resetBtn}>
            🔄 Khôi phục bài viết mẫu
          </button>
        </div>
      </header>

      <main className={styles.mainContent}>
        {/* Navigation Tabs */}
        <div className={styles.tabNav}>
          <button
            className={`${styles.tabBtn} ${activeTab === "list" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("list")}
          >
            📋 Quản lý bài viết ({posts.length})
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === "form" ? styles.activeTab : ""}`}
            onClick={() => {
              if (!editingId) resetForm();
              setActiveTab("form");
            }}
          >
            ✍️ {editingId ? "Sửa bài viết" : "Đăng bài viết mới"}
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === "global" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("global")}
          >
            ⚙️ Cấu hình toàn trang
          </button>
          {activeTab === "form" && (
            <button
              className={`${styles.tabBtn} ${styles.previewToggleBtn}`}
              onClick={() => setActiveTab("preview")}
            >
              👁️ Xem trước (Live Preview)
            </button>
          )}
          {activeTab === "preview" && (
            <button
              className={`${styles.tabBtn} ${styles.formToggleBtn}`}
              onClick={() => setActiveTab("form")}
            >
              ✏️ Quay lại chỉnh sửa
            </button>
          )}
        </div>

        {/* Tab 1: List of posts */}
        {activeTab === "list" && (
          <section className={`${styles.cardPanel} animate-fade-in`}>
            <div className={styles.panelHeader}>
              <h2>Danh sách bài viết đã đăng</h2>
              <button onClick={() => { resetForm(); setActiveTab("form"); }} className={styles.addNewBtn}>
                ＋ Tạo bài viết mới
              </button>
            </div>

            {posts.length === 0 ? (
              <div className={styles.emptyState}>
                <p>Chưa có bài viết nào được đăng. Hãy tạo bài viết mới đầu tiên!</p>
              </div>
            ) : (
              <div className={styles.tableResponsive}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Ảnh</th>
                      <th>Tiêu đề</th>
                      <th>Tác giả</th>
                      <th>Ngày đăng</th>
                      <th>Nhúng bổ sung</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((post) => {
                      const hasCode = !!(post.customHtml || post.customCss || post.customJs);
                      const postDate = new Date(post.createdAt).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      });
                      return (
                        <tr key={post.id}>
                          <td>
                            <img
                              src={post.imageUrl}
                              alt=""
                              className={styles.tableThumbnail}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80";
                              }}
                            />
                          </td>
                          <td className={styles.tableTitle}>{post.title}</td>
                          <td>{post.author}</td>
                          <td>{postDate}</td>
                          <td>
                            <div className={styles.embeddedIndicators}>
                              {post.videoUrl && <span title="Có video" className={styles.indicator}>🎥</span>}
                              {hasCode && <span title="Có HTML/CSS/JS" className={styles.indicator}>⚡</span>}
                              {!post.videoUrl && !hasCode && <span className={styles.noIndicator}>-</span>}
                            </div>
                          </td>
                          <td>
                            <div className={styles.tableActions}>
                              <button onClick={() => handleCopyPostLink(post.id)} className={styles.copyBtn}>
                                Copy Link
                              </button>
                              <button onClick={() => startEdit(post)} className={styles.editBtn}>
                                Sửa
                              </button>
                              <button onClick={() => deletePost(post.id)} className={styles.deleteBtn}>
                                Xóa
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* Tab 2: Create/Edit Form */}
        {activeTab === "form" && (
          <form onSubmit={handleSubmit} className={`${styles.cardPanel} animate-fade-in`}>
            <div className={styles.panelHeader}>
              <h2>{editingId ? "Cập nhật bài viết" : "Tạo bài viết mới"}</h2>
              <div className={styles.formActionHeader}>
                <button
                  type="button"
                  onClick={() => setActiveTab("preview")}
                  className={styles.previewBtn}
                >
                  👁️ Xem trước bài viết
                </button>
                <button type="submit" className={styles.submitBtn}>
                  {editingId ? "💾 Lưu cập nhật" : "🚀 Đăng bài viết"}
                </button>
              </div>
            </div>

            <div className={styles.formGrid}>
              {/* Left Column: Basic Information */}
              <div className={styles.formColumn}>
                <h3 className={styles.formSectionTitle}>📌 Thông tin cơ bản</h3>
                
                <div className={styles.inputGroup}>
                  <label htmlFor="title">Tiêu đề bài viết *</label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Nhập tiêu đề hấp dẫn..."
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="author">Tác giả</label>
                  <input
                    type="text"
                    id="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Tên tác giả..."
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="imageUrl">Đường dẫn ảnh bìa (URL)</label>
                  <input
                    type="url"
                    id="imageUrl"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg..."
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="videoUrl">Đường dẫn video (YouTube hoặc link trực tiếp MP4, mỗi link trên một dòng)</label>
                  <textarea
                    id="videoUrl"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=...&#10;https://example.com/video.mp4"
                    rows={4}
                  ></textarea>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="excerpt">Tóm tắt bài viết (Ngắn)</label>
                  <input
                    type="text"
                    id="excerpt"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Mô tả ngắn gọn hiển thị ngoài trang chủ..."
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="content">Nội dung bài viết *</label>
                  <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Nhập nội dung chi tiết bài viết ở đây..."
                    rows={8}
                    required
                  ></textarea>
                </div>
              </div>

              {/* Right Column: Custom Code Injection */}
              <div className={styles.formColumn}>
                <h3 className={styles.formSectionTitle}>⚡ Nhúng mã nguồn tùy chỉnh (HTML, CSS, JS)</h3>
                <p className={styles.sectionSubtitle}>
                  Mã CSS sẽ được cô lập trong Shadow DOM của bài viết. JavaScript sẽ có biến `document` đại diện cho phần tử gốc của bài viết.
                </p>

                <div className={styles.inputGroup}>
                  <label htmlFor="customHtml" className={styles.codeLabel}>
                    HTML Tùy chỉnh (Cấu trúc giao diện)
                  </label>
                  <textarea
                    id="customHtml"
                    value={customHtml}
                    onChange={(e) => setCustomHtml(e.target.value)}
                    placeholder="<div class='widget'>...</div>"
                    rows={5}
                    className={styles.codeEditor}
                  ></textarea>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="customCss" className={styles.codeLabel}>
                    CSS Tùy chỉnh (Định dạng giao diện)
                  </label>
                  <textarea
                    id="customCss"
                    value={customCss}
                    onChange={(e) => setCustomCss(e.target.value)}
                    placeholder=".widget { background: #333; }"
                    rows={5}
                    className={styles.codeEditor}
                  ></textarea>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="customJs" className={styles.codeLabel}>
                    JavaScript Tùy chỉnh (Xử lý logic tương tác)
                  </label>
                  <textarea
                    id="customJs"
                    value={customJs}
                    onChange={(e) => setCustomJs(e.target.value)}
                    placeholder="document.querySelector('.widget').addEventListener('click', ...);"
                    rows={5}
                    className={styles.codeEditor}
                  ></textarea>
                </div>
              </div>
            </div>

            <div className={styles.formFooter}>
              <button type="button" onClick={() => setActiveTab("list")} className={styles.cancelBtn}>
                Hủy bỏ
              </button>
              <button type="submit" className={styles.submitBtnLarge}>
                {editingId ? "💾 Lưu cập nhật bài viết" : "🚀 Đăng bài viết lên trang chủ"}
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Live Preview */}
        {activeTab === "preview" && (
          <section className={`${styles.cardPanel} animate-fade-in`}>
            <div className={styles.previewBanner}>
              <span>👀 Chế độ xem trước bài viết</span>
              <button onClick={() => setActiveTab("form")} className={styles.formToggleBtn}>
                ✏️ Quay lại chỉnh sửa tiếp
              </button>
            </div>

            <div className={styles.previewWrapper}>
              {previewPost.imageUrl && (
                <div className={styles.prevImageContainer}>
                  <img src={previewPost.imageUrl} alt="" className={styles.prevImage} />
                  <div className={styles.prevImageOverlay} />
                </div>
              )}

              <div className={styles.prevBody}>
                <div className={styles.prevMeta}>
                  <span>✍️ Tác giả: <strong>{previewPost.author}</strong></span>
                  <span>📅 {new Date(previewPost.createdAt).toLocaleDateString("vi-VN")} (Vừa xong)</span>
                </div>

                <h1 className={styles.prevTitle}>{previewPost.title}</h1>

                <div className={styles.prevContent}>
                  {previewPost.content.split("\n\n").map((para, idx) => (
                    <p key={idx} className={styles.prevParagraph}>
                      {para}
                    </p>
                  ))}
                </div>

                {previewPost.videoUrl && (
                  <div className={styles.prevSection}>
                    <h4 className={styles.prevSectionTitle}>🎥 Video đính kèm</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      {previewPost.videoUrl
                        .split("\n")
                        .map((url) => url.trim())
                        .filter(Boolean)
                        .map((url, idx) => (
                          <VideoEmbed key={idx} videoUrl={url} />
                        ))}
                    </div>
                  </div>
                )}

                {(previewPost.customHtml || previewPost.customCss || previewPost.customJs) && (
                  <div className={styles.prevSection}>
                    <h4 className={styles.prevSectionTitle}>⚡ Nội dung tương tác (Custom Code)</h4>
                    <CustomRender
                      html={previewPost.customHtml}
                      css={previewPost.customCss}
                      js={previewPost.customJs}
                      postId="preview-temp-post"
                    />
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Tab 4: Global Code Settings */}
        {activeTab === "global" && (
          <form onSubmit={handleSaveGlobal} className={`${styles.cardPanel} animate-fade-in`}>
            <div className={styles.panelHeader}>
              <h2>⚙️ Cấu hình HTML, CSS, JS toàn website</h2>
              <button type="submit" className={styles.submitBtn}>
                💾 Lưu cấu hình
              </button>
            </div>

            <p className={styles.sectionSubtitle} style={{ marginBottom: "24px" }}>
              Mã nguồn ở đây sẽ được áp dụng cho <strong>toàn bộ trang web</strong> (bao gồm cả trang chủ và các trang bài viết chi tiết). 
              Hữu ích khi bạn muốn định dạng phong cách toàn trang, thêm thanh Menu cố định, chat bong bóng, tuyết rơi hoặc các script đo lường.
            </p>

            <div className={styles.formGrid}>
              {/* HTML and CSS configurations */}
              <div className={styles.formColumn}>
                <div className={styles.inputGroup}>
                  <label htmlFor="globalHtml" className={styles.codeLabel}>
                    HTML Toàn trang (Chèn ở cuối body)
                  </label>
                  <textarea
                    id="globalHtml"
                    value={globalHtml}
                    onChange={(e) => setGlobalHtml(e.target.value)}
                    placeholder="Ví dụ: <div class='floating-banner'>Chào mừng tới hhduongpho.shop!</div>"
                    rows={8}
                    className={styles.codeEditor}
                  ></textarea>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="globalCss" className={styles.codeLabel}>
                    CSS Toàn trang (Style cho mọi trang)
                  </label>
                  <textarea
                    id="globalCss"
                    value={globalCss}
                    onChange={(e) => setGlobalCss(e.target.value)}
                    placeholder="Ví dụ: body { border: 4px solid #6366f1; }"
                    rows={8}
                    className={styles.codeEditor}
                  ></textarea>
                </div>
              </div>

              {/* JS configurations */}
              <div className={styles.formColumn}>
                <div className={styles.inputGroup}>
                  <label htmlFor="globalJs" className={styles.codeLabel}>
                    JavaScript Toàn trang (Thực thi khi mở trang)
                  </label>
                  <textarea
                    id="globalJs"
                    value={globalJs}
                    onChange={(e) => setGlobalJs(e.target.value)}
                    placeholder="Ví dụ: console.log('Global Javascript is active!');"
                    rows={19}
                    className={styles.codeEditor}
                  ></textarea>
                </div>
              </div>
            </div>

            <div className={styles.formFooter}>
              <button type="button" onClick={() => setActiveTab("list")} className={styles.cancelBtn}>
                Hủy bỏ
              </button>
              <button type="submit" className={styles.submitBtnLarge}>
                💾 Lưu cấu hình toàn trang
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
