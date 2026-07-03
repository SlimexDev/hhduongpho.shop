export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl?: string;
  videoUrl?: string;
  author: string;
  createdAt: string;
  customHtml?: string;
  customCss?: string;
  customJs?: string;
}

export const INITIAL_POSTS: Post[] = [
  {
    id: "post-1",
    title: "Xu hướng Thiết kế Glassmorphism và Trải nghiệm UI/UX năm 2026",
    excerpt: "Khám phá cách tối ưu hóa giao diện web hiện đại với phong cách kính mờ (Glassmorphism), viền phát sáng mỏng và các hiệu ứng chuyển động vi mô (micro-animations).",
    content: `Trong thế giới thiết kế web hiện đại, trải nghiệm thị giác của người dùng đóng vai trò quyết định đến sự thành bại của một sản phẩm. Xu hướng Glassmorphism - kết hợp giữa sự trong suốt, làm mờ hậu cảnh (backdrop-filter) và những đường viền sắc nét, phát sáng tinh tế - đang trở thành tiêu chuẩn vàng của các giao diện cao cấp.

Bên cạnh yếu tố thẩm mỹ, việc kết hợp các chuyển động nhỏ (micro-interactions) khi người dùng di chuột qua thẻ bài viết, nhấn nút, hoặc chuyển đổi trang giúp giao diện trở nên 'sống động' và cuốn hút hơn. Tuy nhiên, lập trình viên cần chú ý đến hiệu năng khi sử dụng thuộc tính lọc mờ trên các thiết bị cấu hình thấp bằng cách áp dụng thuộc tính 'will-change' một cách hợp lý.`,
    category: "Thiết kế",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    videoUrl: "https://www.youtube.com/watch?v=RgdS0U83RkM",
    author: "Slime Designer",
    createdAt: "2026-07-02T10:00:00.000Z"
  },
  {
    id: "post-2",
    title: "Game Nhấp Chuột Nhận Quà (Tải mã HTML/CSS/JS tùy chỉnh)",
    excerpt: "Bài viết này minh họa sức mạnh của tính năng Custom Code. Admin đã nhúng trực tiếp một mini-game nhỏ sử dụng HTML, CSS và JavaScript riêng biệt ngay trong bài viết này!",
    content: `Chào mừng bạn đến với bài viết minh họa cho tính năng chèn mã tùy chỉnh. Phía bên dưới là một khối mini-game clicker được nạp hoàn toàn từ các trường HTML, CSS và JavaScript lưu trong cơ sở dữ liệu của bài viết này.

Mã CSS ở đây được cô lập hoàn toàn để không ảnh hưởng đến giao diện chính của trang web. Mã JavaScript tự động kích hoạt sau khi bài viết được mở ra, lắng nghe tương tác click của người dùng và lưu trạng thái điểm số một cách mượt mà. Hãy thử nhấp chuột vào slime bên dưới để trải nghiệm nhé!`,
    category: "Lập trình",
    imageUrl: "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=800&auto=format&fit=crop&q=80",
    author: "Slime Coder",
    createdAt: "2026-07-03T05:30:00.000Z",
    customHtml: `
<div class="game-container">
  <div class="score-board">
    <span>Điểm Slime:</span>
    <span id="slime-score">0</span>
  </div>
  <div class="slime-button-wrapper">
    <button id="click-slime-btn">🟢 Nhấn Vào Tôi!</button>
  </div>
  <div class="message" id="game-msg">Hãy chạm vào để đánh thức Slime!</div>
</div>
    `,
    customCss: `
.game-container {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  margin-top: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.score-board {
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
  gap: 8px;
}

#slime-score {
  color: #06b6d4;
  text-shadow: 0 0 10px rgba(6, 182, 212, 0.4);
}

.slime-button-wrapper {
  margin: 20px 0;
}

#click-slime-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  padding: 14px 28px;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

#click-slime-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.5);
}

#click-slime-btn:active {
  transform: translateY(1px) scale(0.98);
}

.message {
  font-size: 0.9rem;
  color: #94a3b8;
  font-style: italic;
  min-height: 20px;
  transition: all 0.3s;
}

.message.success {
  color: #10b981;
  font-weight: bold;
}
    `,
    customJs: `
const button = document.getElementById('click-slime-btn');
const scoreDisplay = document.getElementById('slime-score');
const msgDisplay = document.getElementById('game-msg');

let score = 0;
const rewards = [
  { score: 5, msg: "Slime bắt đầu ngọ nguậy! 🟢" },
  { score: 12, msg: "Slime đang lớn dần! 🌱" },
  { score: 25, msg: "Bảo bối xuất hiện! Lực chiến tăng vọt! ⚔️" },
  { score: 50, msg: "Slime tiến hóa thành Slime Chúa Tể! 👑" }
];

if (button && scoreDisplay) {
  button.addEventListener('click', () => {
    score++;
    scoreDisplay.textContent = score;
    
    // Add floating particle animation effect
    const scoreRect = scoreDisplay.getBoundingClientRect();
    const particle = document.createElement('span');
    particle.textContent = '+1';
    particle.style.position = 'fixed';
    particle.style.left = (scoreRect.left + Math.random() * 20) + 'px';
    particle.style.top = (scoreRect.top - 10) + 'px';
    particle.style.color = '#06b6d4';
    particle.style.fontWeight = 'bold';
    particle.style.pointerEvents = 'none';
    particle.style.transition = 'all 0.6s ease-out';
    document.body.appendChild(particle);
    
    setTimeout(() => {
      particle.style.transform = 'translateY(-30px)';
      particle.style.opacity = '0';
    }, 10);
    
    setTimeout(() => {
      particle.remove();
    }, 600);

    // Dynamic scale effects
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
      button.style.transform = 'scale(1)';
    }, 100);

    // Check level reward
    const reward = rewards.find(r => r.score === score);
    if (reward) {
      msgDisplay.textContent = reward.msg;
      msgDisplay.className = "message success";
      setTimeout(() => {
        msgDisplay.className = "message";
      }, 3000);
    }
  });
}
    `
  },
  {
    id: "post-3",
    title: "Hướng dẫn tối ưu và chia sẻ video chất lượng cao trực tuyến",
    excerpt: "Cách nhúng link video YouTube và video MP4 trực tiếp để đạt tốc độ tải trang nhanh nhất, không gây gián đoạn trải nghiệm người xem.",
    content: `Nhúng video vào trang web giúp bài viết trở nên sinh động gấp nhiều lần. Tuy nhiên, nếu không cấu hình đúng cách, video dung lượng lớn có thể làm tê liệt tốc độ tải trang.

1. Sử dụng YouTube Iframe: Đây là giải pháp tối ưu nhất cho băng thông vì máy chủ của Google sẽ chịu trách nhiệm truyền tải luồng video, đồng thời hỗ trợ tự động thay đổi độ phân giải tùy theo tốc độ mạng của người dùng.
2. Thẻ HTML5 Video trực tiếp: Thích hợp cho các đoạn video ngắn (dưới 10 giây) dùng làm nền hoặc ảnh động lặp lại (GIF chất lượng cao). Hãy luôn thêm thuộc tính 'preload=\"metadata\"' và 'controls' để người dùng chủ động tải video khi cần thiết.`,
    category: "Video",
    imageUrl: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&auto=format&fit=crop&q=80",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    author: "Video Maker",
    createdAt: "2026-07-01T08:15:00.000Z"
  }
];
