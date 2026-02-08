// ===== Supabase config =====
const SUPABASE_URL = "https://qttcdxwsgyjffywbmyxq.supabase.co";
const SUPABASE_KEY = "sb_publishable_ugfBMpSeIfoCr9tkLmOjLQ_Bm53MWeq";

// إنشاء العميل صح
const { createClient } = supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

// ===== Helpers =====
async function requireAuth() {
  const { data } = await sb.auth.getSession();
  if (!data.session) {
    window.location.href = "index.html";
    return;
  }
  return data.session.user;
}

// ===== Login / Register =====
async function login(email, password) {
  const { error } = await sb.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    alert(error.message);
    return;
  }
  window.location.href = "profile.html";
}

async function register(email, password) {
  const { error } = await sb.auth.signUp({
    email,
    password,
  });
  if (error) {
    alert(error.message);
    return;
  }
  alert("تم إنشاء الحساب، سجل دخولك");
}

// ===== Profile =====
async function loadProfile() {
  const user = await requireAuth();
  if (!user) return;

  document.getElementById("userEmail").innerText = user.email;
  document.getElementById("userId").innerText = user.id;
}

// ===== Admin check =====
async function loadAdmin() {
  const user = await requireAuth();
  if (!user) return;

  const ADMIN_EMAIL = "admin@admin.com"; // عدله براحتك
  if (user.email !== ADMIN_EMAIL) {
    alert("مش مسموح");
    window.location.href = "profile.html";
  }
}

// ===== Logout =====
async function logout() {
  await sb.auth.signOut();
  window.location.href = "index.html";
}
