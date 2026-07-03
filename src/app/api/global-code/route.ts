import { NextRequest, NextResponse } from "next/server";
import { getGlobalCode, saveGlobalCode } from "@/lib/db";

// GET /api/global-code
export async function GET() {
  try {
    const code = await getGlobalCode();
    return NextResponse.json(code);
  } catch (e) {
    console.error("Lỗi GET /api/global-code:", e);
    return NextResponse.json({ error: "Lỗi máy chủ nội bộ" }, { status: 500 });
  }
}

// POST /api/global-code
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { html, css, js } = body;
    
    // Allow empty values for resetting/clearing
    const code = {
      html: html || "",
      css: css || "",
      js: js || "",
    };
    
    await saveGlobalCode(code);
    return NextResponse.json({ success: true, code });
  } catch (e) {
    console.error("Lỗi POST /api/global-code:", e);
    return NextResponse.json({ error: "Lỗi máy chủ nội bộ" }, { status: 500 });
  }
}
