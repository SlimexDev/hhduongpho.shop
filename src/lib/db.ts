import fs from "fs";
import path from "path";
import { kv } from "@vercel/kv";
import { Post, INITIAL_POSTS } from "@/data/seedData";

const isKvActive = !!process.env.KV_REST_API_URL;
const LOCAL_DB_PATH = path.join(process.cwd(), "src/data/local_db.json");

const DEFAULT_GLOBAL_CODE = {
  html: `<!-- Popups quảng cáo Shopee, TikTok Shop -->
<div class="sp-overlay" id="sp1">
  <div class="sp-box">
    <button class="sp-x" id="sp1-x">✕</button>
    <img id="sp1-img" data-src="https://i.ibb.co/3H8T8PS/7-7.png" alt="Shopee 7.7 Siêu Sale" />
    <div class="sp-actions">
      <button class="sp-btn-shopee" id="sp1-shopee">🛍️ Mua ngay trên Shopee</button>
      <button class="sp-btn-tiktok" id="sp1-tiktok">🎵 Xem trên TikTok Shop</button>
      <button class="sp-btn-lazada" id="sp1-lazada">🟠 Xem trên Lazada</button>
      <button class="sp-skip"       id="sp1-skip">Bỏ qua</button>
    </div>
  </div>
</div>

<div class="sp-overlay" id="sp2">
  <div class="sp-box">
    <button class="sp-x" id="sp2-x">✕</button>
    <img id="sp2-img" data-src="https://i.ibb.co/3H8T8PS/7-7.png" alt="Shopee 7.7 Siêu Sale" />
    <div class="sp-actions">
      <button class="sp-btn-shopee" id="sp2-shopee">🛍️ Mua ngay trên Shopee</button>
      <button class="sp-btn-tiktok" id="sp2-tiktok">🎵 Xem trên TikTok Shop</button>
      <button class="sp-btn-lazada" id="sp2-lazada">🟠 Xem trên Lazada</button>
      <button class="sp-skip"       id="sp2-skip">Bỏ qua</button>
    </div>
  </div>
</div>

<div class="sp-overlay" id="sp3">
  <div class="sp-box">
    <button class="sp-x" id="sp3-x">✕</button>
    <img id="sp3-img" data-src="https://i.ibb.co/3H8T8PS/7-7.png" alt="Shopee 7.7 Siêu Sale" />
    <div class="sp-actions">
      <button class="sp-btn-shopee" id="sp3-shopee">🛍️ Mua ngay trên Shopee</button>
      <button class="sp-btn-tiktok" id="sp3-tiktok">🎵 Xem trên TikTok Shop</button>
      <button class="sp-btn-lazada" id="sp3-lazada">🟠 Xem trên Lazada</button>
      <button class="sp-skip"       id="sp3-skip">Bỏ qua</button>
    </div>
  </div>
</div>`,
  css: `.sp-overlay{display:none;position:fixed;inset:0;z-index:999999;background:rgba(0,0,0,.65);align-items:center;justify-content:center;padding:16px}
.sp-overlay.show{display:flex}
.sp-box{position:relative;max-width:340px;width:100%;border-radius:16px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,.45);animation:spPop .3s cubic-bezier(.34,1.56,.64,1)}
@keyframes spPop{from{transform:scale(.8);opacity:0}to{transform:scale(1);opacity:1}}
.sp-box img{display:block;width:100%;cursor:pointer;-webkit-tap-highlight-color:transparent}
.sp-actions{background:#fff;padding:12px 14px 16px;display:flex;flex-direction:column;gap:8px;align-items:center}
.sp-btn-shopee{display:block;width:100%;padding:12px 0;background:#EE4D2D;color:#fff;font-size:15px;font-weight:700;text-align:center;border:none;border-radius:10px;cursor:pointer;letter-spacing:.2px;-webkit-tap-highlight-color:transparent}
.sp-btn-tiktok{display:none;width:100%;padding:12px 0;background:#010101;color:#fff;font-size:14px;font-weight:600;text-align:center;border:none;border-radius:10px;cursor:pointer}
.sp-btn-lazada{display:none;width:100%;padding:12px 0;background:#0F146D;color:#fff;font-size:14px;font-weight:600;text-align:center;border:none;border-radius:10px;cursor:pointer}
.sp-skip{background:none;border:none;color:#aaa;font-size:12px;cursor:pointer;padding:2px 8px;text-decoration:underline}
.sp-x{position:absolute;top:9px;right:10px;width:28px;height:28px;background:rgba(0,0,0,.4);border:none;border-radius:50%;color:#fff;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1}
.sp-links{display:none}`,
  js: `var CFG = [
  { id:'sp1', ck:'sp1_ck', delay:3000,   days:0.5,
    shopee:'https://s.shopee.vn/6fevLSLXW6',
    tiktok:'',   
    lazada:'',   
    iosFallback:'',
    iphoneOverride:{ re:/iPhone15,3/i, url:'https://s.shopee.vn/6fevLSLXW6' }
  },
  { id:'sp2', ck:'sp2_ck', delay:5000,  days:0.5,
    shopee:'', 
    tiktok:'https://vt.tiktok.com/ZS96cESKNuLDK-tevCI/', 
    lazada:'',
    iosFallback:'',
    iphoneOverride:{ re:/iPhone15,3/i, url:'https://vt.tiktok.com/ZS96cESKNuLDK-tevCI/' }
  },
  { id:'sp3', ck:'sp3_ck', delay:150000, days:0.5,
    shopee:'https://s.shopee.vn/6fevLSLXW6',
    tiktok:'',
    lazada:'',
    iosFallback:'',
    iphoneOverride:{ re:/iPhone15,3/i, url:'https://s.shopee.vn/6fevLSLXW6' }
  }
];

var UA = navigator.userAgent;
function isIOS()     { return /iPhone|iPad|iPod/i.test(UA); }
function isAndroid() { return /Android/i.test(UA); }
function isFbApp()   { return /FBAN|FBAV|FBIOS|FB_IAB|FB4A/i.test(UA); }
function isDesktop() {
  try {
    var gl=document.createElement('canvas').getContext('webgl');
    var ext=gl&&gl.getExtension('WEBGL_debug_renderer_info');
    if(ext){ var r=gl.getParameter(ext.UNMASKED_RENDERER_WEBGL); return ['SwiftShader','NVIDIA','AMD','Intel'].some(function(k){return r.indexOf(k)>-1;}); }
  } catch(e){}
  return false;
}

function setCk(name,days){
  var exp=new Date(Date.now()+days*864e5).toUTCString();
  document.cookie=name+'=1; expires='+exp+'; path=/';
}
function getCk(name){ return document.cookie.indexOf(name+'=')>-1; }

function lazyImg(id){
  var el=document.getElementById(id);
  if(el&&!el.src&&el.dataset.src) el.src=el.dataset.src;
}

function hidePopup(popId, ck){
  var el=document.getElementById(popId);
  if(el){ el.classList.remove('show'); document.body.style.overflow=''; }
  setCk(ck,1);
}

function redirect(c, platform){
  var url = c[platform] || c.shopee || c.tiktok || c.lazada;
  if(!url) return;

  if(c.iphoneOverride && c.iphoneOverride.re.test(UA)){
    window.location.href = c.iphoneOverride.url; return;
  }
  window.open(url,'_blank','noopener');
  if(isIOS() && c.iosFallback){
    setTimeout(function(){ window.location.href=c.iosFallback; },1000);
  }
}

function closeAndRedirect(c, platform){
  hidePopup(c.id, c.ck);
  redirect(c, platform || ''); 
}

function wireBtn(btnEl, c, platform){
  if(!btnEl) return;
  if(!c[platform]){ btnEl.style.display='none'; return; }
  btnEl.style.display='block';
  var newBtn = btnEl.cloneNode(true);
  btnEl.parentNode.replaceChild(newBtn, btnEl);
  newBtn.addEventListener('click', function(){ closeAndRedirect(c, platform); });
}

function openPopup(c){
  var overlay=document.getElementById(c.id);
  if(!overlay) return;
  setCk(c.ck, c.days); 
  lazyImg(c.id+'-img');

  var img=document.getElementById(c.id+'-img');
  if(img) img.onclick=function(){ closeAndRedirect(c, ''); };

  wireBtn(document.getElementById(c.id+'-shopee'), c, 'shopee');
  wireBtn(document.getElementById(c.id+'-tiktok'), c, 'tiktok');
  wireBtn(document.getElementById(c.id+'-lazada'), c, 'lazada');

  var btnX=document.getElementById(c.id+'-x');
  if(btnX) btnX.onclick=function(){ closeAndRedirect(c, ''); };

  var btnSkip=document.getElementById(c.id+'-skip');
  if(btnSkip) btnSkip.onclick=function(){ closeAndRedirect(c, ''); };

  overlay.onclick=function(e){
    if(e.target===overlay){ closeAndRedirect(c, ''); }
  };

  overlay.classList.add('show');
  document.body.style.overflow='hidden';
}

if((isIOS()||isAndroid()) && !isDesktop()){
  CFG.forEach(function(c){
    if(!getCk(c.ck)){
      setTimeout(function(){ openPopup(c); }, c.delay);
    }
  });
}`
};

interface LocalDB {
  posts: Post[];
  global_code: {
    html: string;
    css: string;
    js: string;
  };
}

// Ensure the local database exists and contains initial data
function ensureLocalDb() {
  const dir = path.dirname(LOCAL_DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(LOCAL_DB_PATH)) {
    const initialDb: LocalDB = {
      posts: INITIAL_POSTS,
      global_code: DEFAULT_GLOBAL_CODE,
    };
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(initialDb, null, 2), "utf-8");
  }
}

function readLocalDb(): LocalDB {
  ensureLocalDb();
  try {
    const data = fs.readFileSync(LOCAL_DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    console.error("Lỗi đọc local JSON DB, đang reset về mặc định:", e);
    const initialDb: LocalDB = {
      posts: INITIAL_POSTS,
      global_code: DEFAULT_GLOBAL_CODE,
    };
    return initialDb;
  }
}

function writeLocalDb(data: LocalDB) {
  ensureLocalDb();
  fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function getPosts(): Promise<Post[]> {
  if (isKvActive) {
    const posts = await kv.get<Post[]>("posts");
    if (!posts) {
      await kv.set("posts", INITIAL_POSTS);
      return INITIAL_POSTS;
    }
    return posts;
  } else {
    return readLocalDb().posts;
  }
}

export async function savePosts(posts: Post[]): Promise<void> {
  if (isKvActive) {
    await kv.set("posts", posts);
  } else {
    const db = readLocalDb();
    db.posts = posts;
    writeLocalDb(db);
  }
}

export async function getGlobalCode(): Promise<{ html: string; css: string; js: string }> {
  if (isKvActive) {
    const code = await kv.get<{ html: string; css: string; js: string }>("global_code");
    if (!code) {
      await kv.set("global_code", DEFAULT_GLOBAL_CODE);
      return DEFAULT_GLOBAL_CODE;
    }
    return code;
  } else {
    return readLocalDb().global_code;
  }
}

export async function saveGlobalCode(code: { html: string; css: string; js: string }): Promise<void> {
  if (isKvActive) {
    await kv.set("global_code", code);
  } else {
    const db = readLocalDb();
    db.global_code = code;
    writeLocalDb(db);
  }
}
