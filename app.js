const SUPABASE_URL = "https://qttcdxwsgyjffywbmyxq.supabase.co";
const SUPABASE_KEY = "sb_publishable_ugfBMpSeIfoCr9tkLmOjLQ_Bm53MWeq";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// دخول أو تسجيل تلقائي
async function auth() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("اكتب الإيميل والباسورد");
    return;
  }

  // محاولة دخول
  let { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  // لو المستخدم مش موجود → نعمل تسجيل
  if (error) {
    let signup = await supabase.auth.signUp({
      email,
      password,
    });

    if (signup.error) {
      alert(signup.error.message);
      return;
    }
  }

  window.location.href = "profile.html";
}

// تحميل البروفايل
async function loadProfile() {
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("uEmail").innerText = data.user.email;
}

// خروج
async function logout() {
  await supabase.auth.signOut();
  window.location.href = "index.html";
        }
