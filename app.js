const SUPABASE_URL = "https://qttcdxwsgyjffywbmyxq.supabase.co";
const SUPABASE_KEY = "sb_publishable_ugfBMpSeIfoCr9tkLmOjLQ_Bm53MWeq";

const supabase = supabaseJs.createClient(SUPABASE_URL, SUPABASE_KEY);

// تسجيل / دخول
async function auth(){
  if(!terms.checked) return alert("وافق على السياسات");

  let { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  });

  if(error){
    await supabase.auth.signUp({
      email: email.value,
      password: password.value
    });
  }
  location.href="profile.html";
}

// تحميل البروفايل
async function loadProfile(){
  const { data:{user} } = await supabase.auth.getUser();
  if(!user) return location.href="index.html";

  uEmail.innerText = user.email;

  let { data } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id",user.id)
    .single();

  plan.innerText = data.plan;
  upgrade.style.display = data.plan==="free"?"block":"none";
}

if(location.pathname.includes("profile")) loadProfile();

// ترقية
upgrade?.addEventListener("click",async()=>{
  const { data:{user} } = await supabase.auth.getUser();
  await supabase.from("subscriptions")
    .update({plan:"pro"})
    .eq("user_id",user.id);
  location.reload();
});

// أدمن
async function loadAdmin(){
  const { data:{user} } = await supabase.auth.getUser();
  if(!user) return;

  const { data } = await supabase
    .from("subscriptions")
    .select("user_id,plan,is_active");

  users.innerHTML="<tr><th>ID</th><th>Plan</th><th>Action</th></tr>";
  data.forEach(u=>{
    users.innerHTML+=`
    <tr>
      <td>${u.user_id}</td>
      <td>${u.plan}</td>
      <td>
        <button onclick="toggle('${u.user_id}','${u.plan}')">تغيير</button>
      </td>
    </tr>`;
  });
}

if(location.pathname.includes("admin")) loadAdmin();

async function toggle(id,plan){
  await supabase.from("subscriptions")
    .update({plan:plan==="free"?"pro":"free"})
    .eq("user_id",id);
  loadAdmin();
}

// خروج
function logout(){
  supabase.auth.signOut();
  location.href="index.html";
}