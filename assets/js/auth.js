// Supabase client setup
const SUPABASE_URL = "https://oixequtjnhlnarcuycca.supabase.co"; // apna URL
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9peGVxdXRqbmhsbmFyY3V5Y2NhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMjMwNTUsImV4cCI6MjA3MzU5OTA1NX0.XcH-fUgnAm-yHn-ZIMDtuHNqyckwsxjFQk2MGre92S8"; // apna anon key

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// -------- SIGNUP FUNCTION --------
async function handleSignup(e) {
  e.preventDefault();

  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  const { user, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (error) {
    alert("Error: " + error.message);
  } else {
    alert("Signup successful! Please check your email for confirmation.");
    window.location.href = "login.html";
  }
}

// -------- LOGIN FUNCTION --------
async function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const { user, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    alert("Error: " + error.message);
  } else {
    alert("Login successful!");
    window.location.href = "social.html"; // login ke baad social page pe bhej do
  }
}

// -------- LOGOUT FUNCTION --------
async function handleLogout() {
  await supabase.auth.signOut();
  alert("Logged out!");
  window.location.href = "login.html";
}
