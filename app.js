const supabaseUrl = "PUT_SUPABASE_URL_HERE";
const supabaseKey = "PUT_PUBLIC_ANON_KEY_HERE";

const supabase = window.supabase.createClient(
  supabaseUrl,
  supabaseKey
);

const form = document.getElementById("auth-form");
const msg = document.getElementById("msg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    msg.textContent = error.message;
  } else {
    window.location.href = "profile.html";
  }
});

signup.addEventListener("click", async () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  msg.textContent = error ? error.message : "تم إنشاء الحساب";
});

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const signup = document.getElementById("signup");
