// ============================
// Supabase Setup
// ============================
const SUPABASE_URL = "https://oixequtjnhlnarcuycca.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9peGVxdXRqbmhsbmFyY3V5Y2NhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMjMwNTUsImV4cCI6MjA3MzU5OTA1NX0.XcH-fUgnAm-yHn-ZIMDtuHNqyckwsxjFQk2MGre92S8";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================
// Signup Function
// ============================
if (document.getElementById("signupForm")) {
  const signupForm = document.getElementById("signupForm");

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("sName").value.trim();
    const email = document.getElementById("sEmail").value.trim();
    const password = document.getElementById("sPass").value.trim();
    const confirmPassword = document.getElementById("sCPass").value.trim();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const { data, error } = await supabaseClient.auth.signUp({
      email: email,
      password: password,
      options: {
        data: { full_name: name },
        // 🔑 redirect after email confirmation
        emailRedirectTo: "https://birla7878.github.io/Megaportal/verify.html"
      }
    });

    if (error) {
      alert("❌ Signup Failed: " + error.message);
    } else {
      alert("✅ Signup Successful! Please check your email for verification.");
      // 🚫 यहां direct redirect मत करो, पहले user को verify करना है
      window.location.href = "login.html";
    }
  });
}

// ============================
// Login Function
// ============================
if (document.getElementById("loginForm")) {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("lEmail").value.trim();
    const password = document.getElementById("lPass").value.trim();

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      alert("❌ Login Failed: " + error.message);
    } else {
      alert("✅ Login Successful!");
      // login ke baad redirect
      window.location.href = "social.html"; 
    }
  });
}

// ============================
// Navbar Auth State Handling
// ============================

document.addEventListener("DOMContentLoaded", async () => {
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");

  async function checkAuth() {
    const { data: { user } } = await supabaseClient.auth.getUser();

    if (user) {
      // ✅ Logged in
      if (loginBtn) {
        loginBtn.textContent = user.user_metadata?.full_name || "Profile";
        loginBtn.href = "profile.html";
      }

      if (signupBtn) {
        signupBtn.textContent = "Logout";
        signupBtn.href = "#";
        signupBtn.onclick = async (e) => {
          e.preventDefault();
          await supabaseClient.auth.signOut();
          window.location.href = "index.html";
        };
      }
    } else {
      // ❌ Logged out
      if (loginBtn) {
        loginBtn.textContent = "Login";
        loginBtn.href = "login.html";
      }

      if (signupBtn) {
        signupBtn.textContent = "Sign Up";
        signupBtn.href = "signup.html";
        signupBtn.onclick = null;
      }
    }
  }

  checkAuth();
  supabaseClient.auth.onAuthStateChange(() => checkAuth());
});
