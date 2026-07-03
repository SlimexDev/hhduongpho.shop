import { NextRequest, NextResponse } from "next/server";
import { getPosts, savePosts } from "@/lib/db";
import { Post, INITIAL_POSTS } from "@/data/seedData";

// GET /api/posts
// GET /api/posts?id=...
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    const postsList = await getPosts();
    
    if (id) {
      const post = postsList.find((p) => p.id === id);
      if (!post) {
        return NextResponse.json({ error: "Không tìm thấy bài viết" }, { status: 404 });
      }
      return NextResponse.json(post);
    }
    
    return NextResponse.json(postsList);
  } catch (e) {
    console.error("Lỗi GET /api/posts:", e);
    return NextResponse.json({ error: "Lỗi máy chủ nội bộ" }, { status: 500 });
  }
}

// POST /api/posts
// POST /api/posts?action=reset
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "reset") {
      await savePosts(INITIAL_POSTS);
      return NextResponse.json({ success: true, posts: INITIAL_POSTS });
    }

    const body = await request.json();
    const newOrUpdatedPost: Post = body;
    
    if (!newOrUpdatedPost.id || !newOrUpdatedPost.title || !newOrUpdatedPost.content) {
      return NextResponse.json({ error: "Thông tin bài viết không hợp lệ" }, { status: 400 });
    }
    
    const postsList = await getPosts();
    const exists = postsList.some((p) => p.id === newOrUpdatedPost.id);
    
    let updatedList: Post[];
    if (exists) {
      // Edit mode
      updatedList = postsList.map((p) => (p.id === newOrUpdatedPost.id ? newOrUpdatedPost : p));
    } else {
      // Create mode (prepend to top)
      updatedList = [newOrUpdatedPost, ...postsList];
    }
    
    await savePosts(updatedList);
    return NextResponse.json({ success: true, post: newOrUpdatedPost });
  } catch (e) {
    console.error("Lỗi POST /api/posts:", e);
    return NextResponse.json({ error: "Lỗi máy chủ nội bộ" }, { status: 500 });
  }
}

// DELETE /api/posts?id=...
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "Thiếu mã bài viết" }, { status: 400 });
    }
    
    const postsList = await getPosts();
    const exists = postsList.some((p) => p.id === id);
    
    if (!exists) {
      return NextResponse.json({ error: "Không tìm thấy bài viết để xóa" }, { status: 404 });
    }
    
    const filteredList = postsList.filter((p) => p.id !== id);
    await savePosts(filteredList);
    
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Lỗi DELETE /api/posts:", e);
    return NextResponse.json({ error: "Lỗi máy chủ nội bộ" }, { status: 500 });
  }
}
