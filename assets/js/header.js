// assets/js/header.js

document.addEventListener("DOMContentLoaded", () => {
  const mobileToggle = document.querySelector(".mobile-toggle");
  const nav = document.querySelector(".nav");

  mobileToggle.addEventListener("click", () => {
    nav.classList.toggle("nav-open"); // toggle menu visibility
  });

  // Optional: Close mobile menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!nav.contains(e.target) && !mobileToggle.contains(e.target)) {
      nav.classList.remove("nav-open");
    }
  });
});

const toggleBtn = document.querySelector('.mobile-toggle');
const nav = document.querySelector('.nav');

toggleBtn.addEventListener('click', () => {
  nav.classList.toggle('active');
  toggleBtn.classList.toggle('active'); // optional: hamburger animation
});

<script>
document.addEventListener("DOMContentLoaded", function(){
  const toggleBtn = document.querySelector(".mobile-toggle");
  const navMenu = document.querySelector(".nav");

  toggleBtn.addEventListener("click", function(){
    navMenu.classList.toggle("show");
  });
});
</script>


