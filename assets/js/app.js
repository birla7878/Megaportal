// MegaPortal Pro - Functional JS (LocalStorage demo)

// Helpers
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

const storage = {
  get(key, fallback){
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch(e){ return fallback; }
  },
  set(key, val){ localStorage.setItem(key, JSON.stringify(val)); }
};

function toast(msg){
  const t = $('#toast');
  if(!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 2000);
}

// Mobile nav toggle
(function(){
  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.style.display = (nav.style.display === 'flex') ? 'none' : 'flex';
    });
  }
})();

// ---- Cart state ----
const CART_KEY = 'mp_cart';
function getCart(){ return storage.get(CART_KEY, []); }
function setCart(items){ storage.set(CART_KEY, items); updateCartCount(); }
function updateCartCount(){
  const count = getCart().reduce((a, it)=>a+it.qty, 0);
  const el = $('#cartCount');
  if (el) el.textContent = String(count);
}
function addToCart(product){
  const cart = getCart();
  const idx = cart.findIndex(it => it.id === product.id);
  if (idx >= 0) { cart[idx].qty += 1; }
  else { cart.push({...product, qty:1}); }
  setCart(cart);
  toast('Added to cart');
}
function changeQty(id, delta){
  const cart = getCart().map(it=> it.id===id ? {...it, qty: Math.max(1, it.qty+delta)} : it);
  setCart(cart);
  renderCart();
}
function removeFromCart(id){
  const cart = getCart().filter(it => it.id !== id);
  setCart(cart);
  renderCart();
}

// ---- Data (demo) ----
const PRODUCTS = [
  {id:'p1', name:'Elegant Saree', price:3499, cat:'Clothing', img:'https://picsum.photos/seed/prod1/900/700', tags:['New'], pop:90, ts: 20250101},
  {id:'p2', name:'Groom Sherwani', price:7999, cat:'Clothing', img:'https://picsum.photos/seed/prod2/900/700', tags:[], pop:85, ts: 20241220},
  {id:'p3', name:'Wedding Rings Set', price:5499, cat:'Jewellery', img:'https://picsum.photos/seed/prod3/900/700', tags:[], pop:95, ts: 20250210},
  {id:'p4', name:'Designer Watch', price:9299, cat:'Accessories', img:'https://picsum.photos/seed/prod4/900/700', tags:[], pop:70, ts: 20241111},
  {id:'p5', name:'Bridal Jewellery', price:12499, cat:'Jewellery', img:'https://picsum.photos/seed/prod5/900/700', tags:[], pop:88, ts: 20250303},
  {id:'p6', name:'Leather Shoes', price:2799, cat:'Accessories', img:'https://picsum.photos/seed/prod6/900/700', tags:[], pop:60, ts: 20240102},
  {id:'p7', name:'Gift Hampers', price:1299, cat:'Accessories', img:'https://picsum.photos/seed/prod7/900/700', tags:[], pop:40, ts: 20250222},
  {id:'p8', name:'Fashion Sunglasses', price:899, cat:'Accessories', img:'https://picsum.photos/seed/prod8/900/700', tags:[], pop:50, ts: 20240202},
];

const PROFILES = [
  {id:'u1', name:'Anjali Sharma', age:26, looking:'Groom', edu:'B.Tech', city:'Delhi', religion:'Hindu', height:`5'4"`, tags:['Vegetarian','Software Engg.'], img:'https://randomuser.me/api/portraits/women/68.jpg', gotra:{khas:"Bhardwaj", maa:"Kashyap", dadi:"Vashishtha"}},
  {id:'u2', name:'Rahul Verma', age:29, looking:'Bride', edu:'MBA', city:'Mumbai', religion:'Hindu', height:`5'9"`, tags:['Fitness','Marketing'], img:'https://randomuser.me/api/portraits/men/36.jpg', gotra:{khas:"Garg", maa:"Bhardwaj", dadi:"Kashyap"}},
  {id:'u3', name:'Priya Singh', age:25, looking:'Groom', edu:'MBBS', city:'Lucknow', religion:'Sikh', height:`5'3"`, tags:['Doctor','Non-smoker'], img:'https://randomuser.me/api/portraits/women/22.jpg', gotra:{khas:"Kashyap", maa:"Vashishtha", dadi:"Garg"}},
  {id:'u4', name:'Arjun Mehta', age:31, looking:'Bride', edu:'B.Tech', city:'Pune', religion:'Hindu', height:`5'10"`, tags:['DevOps','Traveller'], img:'https://randomuser.me/api/portraits/men/52.jpg', gotra:{khas:"Bhardwaj", maa:"Kashyap", dadi:"Vats"}},
  {id:'u5', name:'Neha Gupta', age:27, looking:'Groom', edu:'MBA', city:'Bangalore', religion:'Hindu', height:`5'5"`, tags:['Finance','Foodie'], img:'https://randomuser.me/api/portraits/women/57.jpg', gotra:{khas:"Vashishtha", maa:"Bhardwaj", dadi:"Kashyap"}},
];

const DEFAULT_POSTS = [
  {id:'post1', author:'Amit Kumar', time:'2h', scope:'Public', text:'Sunset today was insane 🌅 Loved the vibe with friends.', img:'https://picsum.photos/seed/feed1/1000/520', likes:0},
  {id:'post2', author:'Neha Singh', time:'5h', scope:'Friends', text:'New art piece completed! Feeling proud 🎨', img:'https://picsum.photos/seed/feed2/1000/520', likes:3}
];

// ---- Page initializers ----
document.addEventListener('DOMContentLoaded', ()=>{
  updateCartCount();

// ---- Hero Slideshow ----
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const totalSlides = slides.length;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove('active');
    if (i === index) {
      slide.classList.add('active');
    }
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  showSlide(currentSlide);
}

// Auto-slide every 5 seconds
setInterval(nextSlide, 5000);


  // Slideshow for highlights
const slideshows = document.querySelectorAll(".slideshow");
slideshows.forEach(show=>{
  let idx = 0;
  const imgs = show.querySelectorAll("img");
  if(imgs.length <= 1) return;
  imgs[0].classList.add("active");
  setInterval(()=>{
    imgs[idx].classList.remove("active");
    idx = (idx+1) % imgs.length;
    imgs[idx].classList.add("active");
  }, 4000); // 4 sec per slide
});


  // ---- Signup Page ----
const signupForm = $('#signupForm');
if(signupForm){
  signupForm.addEventListener('submit', e=>{
    e.preventDefault();
    const name = $('#sName').value.trim();
    const email = $('#sEmail').value.trim().toLowerCase();
    const pass = $('#sPass').value;
    const cpass = $('#sCPass').value;

    if(pass !== cpass){ toast('Passwords do not match'); return; }

    let users = storage.get('mp_users', []);
    if(users.find(u=>u.email===email)){ toast('Email already registered'); return; }

    users.push({name,email,pass});
    storage.set('mp_users', users);
    toast('Account created! Please login');
    setTimeout(()=>location.href='login.html',1200);
  });
}

// ---- Login Page ----
const loginForm = $('#loginForm');
if(loginForm){
  loginForm.addEventListener('submit', e=>{
    e.preventDefault();
    const email = $('#lEmail').value.trim().toLowerCase();
    const pass = $('#lPass').value;
    const users = storage.get('mp_users', []);
    const user = users.find(u=>u.email===email && u.pass===pass);
    if(!user){ toast('Invalid credentials'); return; }
    storage.set('mp_loggedIn', user);
    toast(`Welcome, ${user.name}`);
    setTimeout(()=>location.href='index.html',1000);
  });
}

// ---- Navbar user state ----
document.addEventListener('DOMContentLoaded', ()=>{
  const nav = document.querySelector('.nav');
  if(!nav) return;
  const user = storage.get('mp_loggedIn', null);
  if(user){
    nav.innerHTML += `<span style="margin-left:12px">Hi, ${user.name}</span> 
      <a href="#" id="logoutBtn" class="btn btn-ghost">Logout</a>`;
    $('#logoutBtn')?.addEventListener('click', e=>{
      e.preventDefault();
      storage.set('mp_loggedIn', null);
      toast('Logged out');
      setTimeout(()=>location.reload(),800);
    });
  }
});


  // Contact page
  const cform = $('#contactForm');
  if (cform){
    cform.addEventListener('submit', (e)=>{
      e.preventDefault();
      const name = $('#cname').value.trim();
      const email = $('#cemail').value.trim();
      const msg = $('#cmsg').value.trim();
      if(!name || !email || !msg){ toast('Please fill all fields'); return; }
      const msgs = storage.get('mp_messages', []);
      msgs.push({id:Date.now(), name, email, msg});
      storage.set('mp_messages', msgs);
      cform.reset();
      toast('Message sent (saved locally)');
    });
  }

  // Matrimonial page
  const grid = $('#profilesGrid');
  if (grid){
    function renderProfiles(items){
      grid.innerHTML = items.map(p=>`
        <article class="card profile">
          <div class="thumb"><img src="${p.img}" alt="${p.name}"></div>
          <div class="info">
            <h3>${p.name}, ${p.age}</h3>
            <div class="meta">${p.edu} • ${p.city} • ${p.religion}</div>
            <div class="tags">
              <span class="tag">${p.height}</span>
              ${p.tags.map(t=>`<span class="tag">${t}</span>`).join('')}
            </div>
            <div class="gotra">
              <p><strong>Khas Gotra:</strong> ${p.gotra.khas}</p>
              <p><strong>Maa ka Gotra:</strong> ${p.gotra.maa}</p>
              <p><strong>Dadi ka Gotra:</strong> ${p.gotra.dadi}</p>
            </div>
            <div class="p-actions">
              <button class="small view-profile" data-id="${p.id}">View Profile</button>
              <button class="small primary" data-contact="${p.id}">Contact</button>
            </div>
          </div>
        </article>
      `).join('');
      $$('[data-contact]').forEach(btn=>{
        btn.addEventListener('click', ()=>{ toast('Contact request sent (demo)'); });
      });
      $$('.view-profile').forEach(btn=>{
        btn.addEventListener('click', ()=>{
          const prof = PROFILES.find(x=>x.id===btn.dataset.id);
          if(!prof) return;
          const details = `
            <h2>${prof.name}, ${prof.age}</h2>
            <p><strong>Education:</strong> ${prof.edu}</p>
            <p><strong>City:</strong> ${prof.city}</p>
            <p><strong>Religion:</strong> ${prof.religion}</p>
            <p><strong>Khas Gotra:</strong> ${prof.gotra.khas}</p>
            <p><strong>Maa ka Gotra:</strong> ${prof.gotra.maa}</p>
            <p><strong>Dadi ka Gotra:</strong> ${prof.gotra.dadi}</p>
            <img src="${prof.img}" style="max-width:200px;border-radius:12px;margin-top:10px">
          `;
          $('#profileDetails').innerHTML = details;
          $('#profileModal').style.display = 'flex';
        });
      });
    }
    function applyFilters(){
      const looking = $('#fLooking').value;
      const minAge = parseInt($('#fMinAge').value) || 18;
      const maxAge = parseInt($('#fMaxAge').value) || 70;
      const religion = $('#fReligion').value.toLowerCase();
      const city = $('#fCity').value.toLowerCase();
      const edu = $('#fEdu').value.toLowerCase();
      const filtered = PROFILES.filter(p=>{
        return (!looking || p.looking===looking)
          && p.age >= minAge && p.age <= maxAge
          && (!religion || p.religion.toLowerCase()===religion)
          && (!city || p.city.toLowerCase().includes(city))
          && (!edu || p.edu.toLowerCase()===edu);
      });
      renderProfiles(filtered);
    }
    $('#applyMat')?.addEventListener('click', applyFilters);
    $('#resetMat')?.addEventListener('click', ()=>renderProfiles(PROFILES));
    renderProfiles(PROFILES);

    const closeBtn = document.querySelector('.close');
    closeBtn?.addEventListener('click', ()=>$('#profileModal').style.display='none');
    window.addEventListener('click', e=>{
      if(e.target.id==='profileModal') $('#profileModal').style.display='none';
    });
  }

  // Social page
  const feed = $('#feed');
  if (feed){
    const postsKey = 'mp_posts';
    if(!storage.get(postsKey)) storage.set(postsKey, DEFAULT_POSTS);
    function renderFeed(){
      const posts = storage.get(postsKey, []);
      feed.innerHTML = posts.map(p=>`
        <article class="post" data-id="${p.id}">
          <div class="post-head">
            <div class="ava"><img src="https://i.pravatar.cc/100?u=${encodeURIComponent(p.author)}"></div>
            <div><div class="pmeta">${p.author} <span class="ptime">· ${p.time}</span></div>
            <div class="ptime">${p.scope}</div></div>
          </div>
          <div class="pbody">${p.text}</div>
          ${p.img?`<div class="pimg"><img src="${p.img}"></div>`:''}
          <div class="pactions">
            <button class="action like">👍 Like (${p.likes||0})</button>
            <button class="action comment-btn">💬 Comment</button>
            <button class="action">↗️ Share</button>
          </div>
          <div class="comments"></div>
          <div class="comment-box">
            <input class="input" type="text" placeholder="Write a comment...">
            <button class="btn btn-ghost add-comment">Post</button>
          </div>
        </article>
      `).join('');
      $$('#feed .post').forEach(el=>{
        const id = el.dataset.id;
        el.querySelector('.like').addEventListener('click', ()=>{
          const posts = storage.get(postsKey, []);
          const idx = posts.findIndex(x=>x.id===id);
          posts[idx].likes = (posts[idx].likes||0)+1;
          storage.set(postsKey, posts);
          renderFeed();
        });
        el.querySelector('.add-comment').addEventListener('click', ()=>{
          const inp = el.querySelector('.comment-box input');
          const txt = inp.value.trim();
          if(!txt) return;
          const key = 'mp_comments_'+id;
          const arr = storage.get(key, []);
          arr.push({id:Date.now(), text:txt});
          storage.set(key, arr);
          inp.value='';
          renderComments(el,id);
        });
        renderComments(el,id);
      });
    }
    function renderComments(postEl,id){
      const arr = storage.get('mp_comments_'+id, []);
      postEl.querySelector('.comments').innerHTML = arr.map(c=>`<div class="sub">• ${c.text}</div>`).join('');
    }
    renderFeed();
    $('#newPostForm')?.addEventListener('submit', e=>{
      e.preventDefault();
      const author = $('#npAuthor').value.trim() || 'You';
      const text = $('#npText').value.trim();
      if(!text){ toast('Write something'); return; }
      const posts = storage.get('mp_posts', []);
      posts.unshift({id:'post'+Date.now(), author, time:'now', scope:'Public', text, img:'', likes:0});
      storage.set('mp_posts', posts);
      $('#npText').value='';
      renderFeed();
      toast('Posted');
    });
  }

  // Shop page
  const shop = $('#shopGrid');
  if (shop){
    function renderShop(items){
      shop.innerHTML = items.map(p=>`
        <article class="product">
          <div class="pimg-wrap"><img src="${p.img}"></div>
          <div class="pcontent">
            <h3>${p.name} ${p.tags.includes('New')?'<span class="badge">New</span>':''}</h3>
            <div class="price">₹${p.price.toLocaleString('en-IN')}</div>
            <div style="margin-top:10px;display:flex;gap:8px">
              <button class="btn btn-primary" data-buy="${p.id}">Buy Now</button>
              <button class="btn btn-ghost" data-add="${p.id}">Add to Cart</button>
            </div>
          </div>
        </article>
      `).join('');
      $$('[data-add]').forEach(btn=>{
        btn.addEventListener('click', ()=>{
          const p = PRODUCTS.find(x=>x.id===btn.dataset.add);
          addToCart({id:p.id, name:p.name, price:p.price, img:p.img});
        });
      });
      $$('[data-buy]').forEach(btn=>{
        btn.addEventListener('click', ()=>{
          const p = PRODUCTS.find(x=>x.id===btn.dataset.buy);
          addToCart({id:p.id, name:p.name, price:p.price, img:p.img});
          location.href='cart.html';
        });
      });
    }
    function applyShop(){
      const q = $('#q').value.toLowerCase();
      const cat = $('#cat').value;
      const sort = $('#sort').value;
      let items = PRODUCTS.filter(p=>(!q||p.name.toLowerCase().includes(q))&&(!cat||p.cat===cat));
      if(sort==='lth') items.sort((a,b)=>a.price-b.price);
      else if(sort==='htl') items.sort((a,b)=>b.price-a.price);
      else if(sort==='new') items.sort((a,b)=>b.ts-a.ts);
      else if(sort==='pop') items.sort((a,b)=>b.pop-a.pop);
      renderShop(items);
    }
    $('#applyShop')?.addEventListener('click', applyShop);
    renderShop(PRODUCTS);
  }

  // Cart page
  if (location.pathname.endsWith('cart.html')) renderCart();
});

function renderCart(){
  const wrap=$('#cartWrap');
  if(!wrap) return;
  const cart=getCart();
  if(!cart.length){ wrap.innerHTML='<p class="sub">Your cart is empty.</p>'; return; }
  const total=cart.reduce((a,it)=>a+it.price*it.qty,0);
  wrap.innerHTML=`
    ${cart.map(it=>`
      <div class="cart-item">
        <img src="${it.img}">
        <div style="flex:1">
          <div class="cart-row"><strong>${it.name}</strong><span>₹${it.price.toLocaleString('en-IN')}</span></div>
          <div class="cart-row">
            <div class="qty">
              <button onclick="changeQty('${it.id}',-1)">−</button>
              <span>${it.qty}</span>
              <button onclick="changeQty('${it.id}',1)">+</button>
            </div>
            <button class="btn btn-ghost" onclick="removeFromCart('${it.id}')">Remove</button>
          </div>
        </div>
      </div>
    `).join('')}
    <div class="cart-row" style="margin-top:

        <div class="cart-row" style="margin-top:12px">
      <div class="total">Total: ₹${total.toLocaleString('en-IN')}</div>
      <button class="btn btn-primary" onclick="checkout()">Checkout</button>
    </div>
  `;
}

function checkout(){
  storage.set('mp_last_order', {
    id: 'ORD'+Date.now(),
    items: getCart(),
    ts: Date.now()
  });
  setCart([]);
  renderCart();
  toast('Order placed (demo)');
}

