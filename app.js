// 1. بيانات Supabase (غيرهم من الداشبورد)
const SUPABASE_URL = "https://XXXX.supabase.co";
const SUPABASE_KEY = "sb_publishable_XXXX";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// 2. تسجيل دخول
async function login(email, password) {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert(error.message);
  } else {
    window.location.href = "profile.html";
  }
}

// 3. تسجيل خروج
async function logout() {
  await supabase.auth.signOut();
  window.location.href = "index.html";
}

// 4. جلب بيانات المستخدم
async function loadProfile() {
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("uEmail").innerText = data.user.email;
    }
