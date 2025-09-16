// ----------------------
// Stories Scroll
// ----------------------
const stories = document.getElementById("stories");
const leftBtn = document.querySelector(".story-arrow.left");
const rightBtn = document.querySelector(".story-arrow.right");

if (stories && leftBtn && rightBtn) {
  leftBtn.addEventListener("click", () => {
    stories.scrollBy({ left: -200, behavior: "smooth" });
  });
  rightBtn.addEventListener("click", () => {
    stories.scrollBy({ left: 200, behavior: "smooth" });
  });
}

// ----------------------
// Supabase Setup
// ----------------------
const SUPABASE_URL = "https://your-project.supabase.co"; // replace with your Supabase URL
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9peGVxdXRqbmhsbmFyY3V5Y2NhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMjMwNTUsImV4cCI6MjA3MzU5OTA1NX0.XcH-fUgnAm-yHn-ZIMDtuHNqyckwsxjFQk2MGre92S8"; // replace with your anon key
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ----------------------
// DOM Elements
// ----------------------
const newPostForm = document.getElementById("newPostForm");
const npAuthor = document.getElementById("npAuthor");
const npText = document.getElementById("npText");
const feedContainer = document.getElementById("feed");
const chatBox = document.querySelector(".chatbox .chat-messages");
const chatInput = document.querySelector(".chatbox input");

// ----------------------
// Render Post Function
// ----------------------
function renderPost(post, comments = []) {
  const div = document.createElement("div");
  div.className = "post panel";
  div.innerHTML = `
    <div class="post-header">
      <img src="https://i.pravatar.cc/50?u=${post.author}" alt="User">
      <div>
        <strong>${post.author}</strong><br>
        <small>${new Date(post.created_at).toLocaleString()}</small>
      </div>
    </div>
    <div class="post-content">${post.content}</div>
    <div class="post-actions">
      <button class="btn btn-ghost small" onclick="likePost('${post.id}')">👍 Like (${post.likes})</button>
      <button class="btn btn-ghost small" onclick="toggleCommentBox('${post.id}')">💬 Comment (${comments.length})</button>
    </div>
    <div class="comment-box" id="comments-${post.id}" style="display:none;margin-top:10px;">
      <div class="comments-list">
        ${comments.map(c => `<div><strong>${c.author}</strong>: ${c.content}</div>`).join("")}
      </div>
      <input class="input comment-input" placeholder="Write a comment..." data-postid="${post.id}">
      <button class="btn btn-primary small comment-btn" data-postid="${post.id}">Post</button>
    </div>
  `;
  feedContainer.prepend(div);
}

// ----------------------
// Load Posts
// ----------------------
async function loadPosts() {
  feedContainer.innerHTML = "";
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return console.error(error);

  for (let post of posts) {
    const { data: comments } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", post.id)
      .order("created_at", { ascending: true });
    renderPost(post, comments || []);
  }
}

// ----------------------
// Like Post
// ----------------------
async function likePost(postId) {
  await supabase
    .from("posts")
    .update({ likes: supabase.raw("likes + 1") })
    .eq("id", postId);
  loadPosts();
}

// ----------------------
// Toggle Comment Box
// ----------------------
function toggleCommentBox(postId) {
  const box = document.getElementById(`comments-${postId}`);
  if (box) box.style.display = box.style.display === "none" ? "block" : "none";
}

// ----------------------
// Add Comment
// ----------------------
document.addEventListener("click", async e => {
  if (e.target.classList.contains("comment-btn")) {
    const postId = e.target.dataset.postid;
    const input = document.querySelector(`.comment-input[data-postid="${postId}"]`);
    const content = input.value.trim();
    if (!content) return;
    await supabase.from("comments").insert([{ post_id: postId, author: "Anonymous", content }]);
    input.value = "";
    loadPosts();
  }
});

// ----------------------
// New Post Submission
// ----------------------
if (newPostForm) {
  newPostForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const author = npAuthor.value.trim() || "Anonymous";
    const content = npText.value.trim();
    if (!content) return alert("Content required.");
    await supabase.from("posts").insert([{ author, content, likes: 0 }]);
    npText.value = "";
    loadPosts();
  });
}

// ----------------------
// Live Chat
// ----------------------
if (chatInput) {
  chatInput.addEventListener("keypress", async e => {
    if (e.key === "Enter") {
      const message = chatInput.value.trim();
      if (!message) return;
      await supabase.from("chat").insert([{ author: "Anonymous", message }]);
      chatInput.value = "";
    }
  });

  supabase
    .from("chat")
    .on("INSERT", payload => {
      const msg = payload.new;
      const div = document.createElement("div");
      div.textContent = `${msg.author}: ${msg.message}`;
      chatBox.appendChild(div);
      chatBox.scrollTop = chatBox.scrollHeight;
    })
    .subscribe();
}

// ----------------------
// Initial Load
// ----------------------
loadPosts();
