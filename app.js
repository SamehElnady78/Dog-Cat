const supabaseUrl = "https://qttcdxwsgyjffywbmyxq.supabase.co";
const supabaseKey = "sb_publishable_ugfBMpSeIfoCr9tkLmOjLQ_Bm53MWeq";

const supabase = window.supabase.createClient(
  supabaseUrl,
  supabaseKey
);

function getValues() {
  return {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value
  };
}

async function login() {
  const { email, password } = getValues();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    document.getElementById("msg").innerText = error.message;
  } else {
    window.location.href = "profile.html";
  }
}

async function signup() {
  const { email, password } = getValues();

  const { error } = await supabase.auth.signUp({
    email,
    password
  });

  document.getElementById("msg").innerText =
    error ? error.message : "تم إنشاء الحساب، ادخل الآن";
}
