// ===== Supabase config =====
const SUPABASE_URL = "https://qttcdxwsgyjffywbmyxq.supabase.co";
const SUPABASE_KEY = "sb_publishable_ugfBMpSeIfoCr9tkLmOjLQ_Bm53MWeq";

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ===== Helpers =====
async function requireAuth() {
  const { data } = await supabase.auth.getSession();
  if (!data.session) {
    window.location.href = "index.html";
  }
  return data.session.user;
}

// ===== Login / Register =====
async function login(email, password) {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) return alert(error.message);
  window.location.href = "profile.html";
}

async function register(email, password) {
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) return alert(error.message);
  alert("تم إنشاء الحساب، سجل دخولك");
}

// ===== Profile =====
async function loadProfile() {
  const user = await requireAuth();
  document.getElementById("userEmail").innerText = user.email;
  document.getElementById("userId").innerText = user.id;
}

// ===== Admin check =====
async function loadAdmin() {
  const user = await requireAuth();
  const ADMIN_EMAIL = "admin@admin.com"; // غيره لو حابب
  if (user.email !== ADMIN_EMAIL) {
    alert("مش مسموح");
    window.location.href = "profile.html";
  }
}

// ===== Logout =====
async function logout() {
  await supabase.auth.signOut();
  window.location.href = "index.html";
  }
