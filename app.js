// Supabase config
const SUPABASE_URL = "https://qttcdxwsgyjffywbmyxq.supabase.co";
const SUPABASE_KEY = "sb_publishable_ugfBMpSeIfoCr9tkLmOjLQ_Bm53MWeq";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// ===== تسجيل / دخول =====
async function auth() {
  const emailEl = document.getElementById("email");
  const passwordEl = document.getElementById("password");
  const termsEl = document.getElementById("terms");

  if (!termsEl.checked) {
    alert("وافق على السياسات");
    return;
  }

  let { error } = await supabase.auth.signInWithPassword({
    email: emailEl.value,
    password: passwordEl.value,
  });

  if (error) {
    const { error: signUpError } = await supabase.auth.signUp({
      email: emailEl.value,
      password: passwordEl.value,
    });
    if (signUpError) {
      alert(signUpError.message);
      return;
    }
  }

  window.location.href = "profile.html";
}

// ===== تحميل البروفايل =====
async function loadProfile() {
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("uEmail").innerText = user.email;

  let { data: sub } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!sub) {
    await supabase.from("subscriptions").insert({
      user_id: user.id,
      plan: "free",
      is_active: true,
    });
    document.getElementById("plan").innerText = "free";
  } else {
    document.getElementById("plan").innerText = sub.plan;
    if (sub.plan !== "free") {
      document.getElementById("upgrade").style.display = "none";
    }
  }
}

// ===== ترقية =====
async function upgradePlan() {
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) return;

  await supabase
    .from("subscriptions")
    .update({ plan: "pro" })
    .eq("user_id", user.id);

  location.reload();
}

// ===== أدمن =====
async function loadAdmin() {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return;

  const { data: users } = await supabase
    .from("subscriptions")
    .select("user_id, plan");

  const table = document.getElementById("users");
  table.innerHTML =
    "<tr><th>User ID</th><th>Plan</th><th>Action</th></tr>";

  users.forEach((u) => {
    table.innerHTML += `
      <tr>
        <td>${u.user_id}</td>
        <td>${u.plan}</td>
        <td>
          <button onclick="togglePlan('${u.user_id}','${u.plan}')">
            تغيير
          </button>
        </td>
      </tr>`;
  });
}

async function togglePlan(id, plan) {
  await supabase
    .from("subscriptions")
    .update({ plan: plan === "free" ? "pro" : "free" })
    .eq("user_id", id);
  loadAdmin();
}

// ===== خروج =====
async function logout() {
  await supabase.auth.signOut();
  window.location.href = "index.html";
}

// ===== تشغيل تلقائي حسب الصفحة =====
if (window.location.pathname.includes("profile")) {
  loadProfile();
}

if (window.location.pathname.includes("admin")) {
  loadAdmin();
}