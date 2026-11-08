/*
 * MOMENT storefront concept.
 * Product names, notes, prices and policies below are demo content and must be
 * replaced with the brand's real product data before launch.
 * Add the order WhatsApp number in WHATSAPP_NUMBER to enable order handoff.
 */
const WHATSAPP_NUMBER = ""; // Example format: 2010XXXXXXXX

const products = [
  { id: 1, name: "MOMENT 01", family: "Classic · Stainless Steel", profile: "classic", size: "40 MM", concentration: "QUARTZ MOVEMENT", price: 1450, tag: "FEATURED", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=90", arabic: "تصميم كلاسيكي بمينا واضحة وسوار معدني؛ اختيار عملي يليق بالاستخدام اليومي.", notes: "STAINLESS STEEL · WHITE DIAL", code: "MM-001" },
  { id: 2, name: "ATLAS STEEL", family: "Minimal · Silver", profile: "minimal", size: "42 MM", concentration: "QUARTZ MOVEMENT", price: 1690, tag: "POPULAR", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=1000&q=90", arabic: "خطوط هادئة ومينا بسيطة مع سوار فضي؛ ساعة سهلة التنسيق مع أغلب إطلالاتك.", notes: "SILVER CASE · CLEAN DIAL", code: "MM-002" },
  { id: 3, name: "NOIR CLASSIC", family: "Classic · Black", profile: "classic", size: "40 MM", concentration: "QUARTZ MOVEMENT", price: 1590, tag: "NEW ARRIVAL", image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1000&q=90", arabic: "مينا سوداء بتفاصيل واضحة وتصميم متوازن يناسب الشغل والخروجات.", notes: "BLACK DIAL · STEEL CASE", code: "MM-003" },
  { id: 4, name: "CHRONO BLACK", family: "Sport · Chronograph", profile: "sport", size: "44 MM", concentration: "CHRONOGRAPH", price: 1890, tag: "", image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=90", arabic: "ستايل رياضي بحضور أقوى وتفاصيل مستوحاة من ساعات الكرونوغراف.", notes: "CHRONOGRAPH · BLACK STRAP", code: "MM-004" },
  { id: 5, name: "SILVER LINE", family: "Minimal · Silver", profile: "minimal", size: "38 MM", concentration: "QUARTZ MOVEMENT", price: 1390, tag: "", image: "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=1000&q=90", arabic: "حجم مريح وتفاصيل بسيطة ولمسة فضية تناسب الإطلالات اليومية الهادية.", notes: "SILVER FINISH · MINIMAL DIAL", code: "MM-005" },
  { id: 6, name: "FIELD BLACK", family: "Sport · Everyday", profile: "sport", size: "42 MM", concentration: "QUARTZ MOVEMENT", price: 1750, tag: "", image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=1000&q=90", arabic: "تصميم عملي بطابع رياضي وسوار مريح؛ مناسب للحركة والاستخدام المتكرر.", notes: "DARK DIAL · SPORT STRAP", code: "MM-006" }
];

const state = { filter: "all", search: "", sort: "featured", cart: readCart(), activeProduct: null };
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const money = (amount) => `EGP ${Number(amount).toLocaleString("en-EG", { maximumFractionDigits: 0 })}`;
const grid = $("#productGrid");

function readCart() {
  try { return JSON.parse(localStorage.getItem("moment-demo-cart") || "[]"); }
  catch { return []; }
}
function saveCart() {
  try { localStorage.setItem("moment-demo-cart", JSON.stringify(state.cart)); } catch { /* Storage may be unavailable in private browsing. */ }
}
function productById(id) { return products.find((product) => product.id === Number(id)); }
function safeText(value) { return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]); }

function imageFallbacks(url) {
  if (!url || !url.includes("i.pinimg.com")) return [];
  const fallbacks = [];
  if (url.includes("/1200x/")) {
    fallbacks.push(url.replace("/1200x/", "/736x/"));
    fallbacks.push(url.replace("/1200x/", "/originals/"));
  }
  if (url.includes("/736x/")) {
    fallbacks.push(url.replace("/736x/", "/1200x/"));
    fallbacks.push(url.replace("/736x/", "/originals/"));
  }
  return [...new Set(fallbacks)];
}

function bindImageRecovery(img, wrapper) {
  if (!img || img.dataset.recoveryBound === "true") return;
  img.dataset.recoveryBound = "true";
  const fallbacks = (img.dataset.fallbacks || "").split("|").filter(Boolean);
  const recoveryUrls = fallbacks.length ? fallbacks : imageFallbacks(img.dataset.source || img.currentSrc || img.src);
  let attempt = 0;
  img.addEventListener("error", () => {
    if (attempt < recoveryUrls.length) {
      img.src = recoveryUrls[attempt++];
      return;
    }
    wrapper?.classList.add("image-missing");
  });
}

function productImageMarkup(product, className = "") {
  const fallbacks = imageFallbacks(product.image).join("|");
  return `<img${className ? ` class="${className}"` : ""} src="${product.image}" data-source="${product.image}" data-fallbacks="${fallbacks}" alt="${safeText(product.name)} perfume bottle" loading="lazy" referrerpolicy="no-referrer" />`;
}

function getVisibleProducts() {
  let list = products.filter((product) => {
    const matchesFilter = state.filter === "all" || product.profile === state.filter;
    const haystack = `${product.name} ${product.family} ${product.notes}`.toLowerCase();
    return matchesFilter && haystack.includes(state.search.toLowerCase());
  });
  if (state.sort === "low") list = [...list].sort((a, b) => a.price - b.price);
  if (state.sort === "high") list = [...list].sort((a, b) => b.price - a.price);
  return list;
}

function renderProducts() {
  const list = getVisibleProducts();
  grid.innerHTML = list.map((product) => `
    <article class="product-card" tabindex="0" role="button" aria-label="View ${safeText(product.name)}" data-open-product="${product.id}">
      <div class="product-visual">
${productImageMarkup(product)}
        <div class="image-fallback" aria-hidden="true"></div>
        ${product.tag ? `<span class="product-badge">${safeText(product.tag)}</span>` : ""}
      </div>
      <div class="product-info">
        <div><div class="product-name">${safeText(product.name)}</div><div class="product-sub">${safeText(product.family)} · ${product.size}</div><button class="add-button" type="button" data-add="${product.id}">ADD TO BAG +</button></div>
        <div class="product-price">${money(product.price)}</div>
      </div>
    </article>`).join("");
  $("#emptyState").hidden = list.length > 0;
  $$(".product-visual img", grid).forEach((img) => bindImageRecovery(img, img.closest(".product-visual")));
}

function renderSignaturePicks() {
  const featured = products.slice(0, 2);
  $("#signatureGrid").innerHTML = featured.map((product, index) => `
    <article class="signature-card" tabindex="0" role="button" aria-label="View ${safeText(product.name)}" data-open-signature="${product.id}">
      <div class="signature-visual">
        ${productImageMarkup(product)}
        <div class="image-fallback" aria-hidden="true"></div>
        <span class="signature-number">0${index + 1} / FEATURED</span>
      </div>
      <div class="signature-info">
        <div>
          <p class="signature-kicker">${safeText(product.family)} · ${product.size}</p>
          <h3>${safeText(product.name)}</h3>
          <p class="signature-price">${money(product.price)}</p>
        </div>
        <button class="signature-link" type="button" data-signature-view="${product.id}">VIEW MODEL <span>↗</span></button>
      </div>
    </article>`).join("");
  $$(".signature-visual img", $("#signatureGrid")).forEach((img) => bindImageRecovery(img, img.closest(".signature-visual")));
}

function cartCount() { return state.cart.reduce((sum, item) => sum + item.quantity, 0); }
function cartTotal() { return state.cart.reduce((sum, item) => sum + item.quantity * productById(item.id).price, 0); }
function addToCart(id) {
  const existing = state.cart.find((item) => item.id === Number(id));
  if (existing) existing.quantity += 1;
  else state.cart.push({ id: Number(id), quantity: 1 });
  saveCart(); renderCart(); openCart();
}
function changeQuantity(id, delta) {
  const item = state.cart.find((entry) => entry.id === Number(id));
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) state.cart = state.cart.filter((entry) => entry.id !== Number(id));
  saveCart(); renderCart();
}
function removeFromCart(id) {
  state.cart = state.cart.filter((entry) => entry.id !== Number(id));
  saveCart(); renderCart();
}
function renderCart() {
  const count = cartCount();
  $("#bagCount").textContent = count;
  $("#drawerCount").textContent = `(${count})`;
  $("#cartItems").innerHTML = state.cart.map((item) => {
    const product = productById(item.id);
    return `<div class="cart-line">
      ${productImageMarkup(product, "cart-thumb")}
      <div><h3>${safeText(product.name)}</h3><p>${product.size} · ${safeText(product.family)}</p><div class="quantity-control"><button type="button" aria-label="Decrease quantity" data-qty="${product.id}" data-delta="-1">−</button><span>${item.quantity}</span><button type="button" aria-label="Increase quantity" data-qty="${product.id}" data-delta="1">+</button></div><button type="button" class="remove-line" data-remove="${product.id}">REMOVE</button></div>
      <div class="cart-line-price">${money(product.price * item.quantity)}</div>
    </div>`;
  }).join("");
  const empty = count === 0;
  $("#cartEmpty").hidden = !empty;
  $("#cartFooter").hidden = empty;
  $("#cartSubtotal").textContent = money(cartTotal());
  $$(".cart-thumb").forEach((img) => bindImageRecovery(img, img));
}

const overlay = $("#overlay");
function showOverlay() { overlay.classList.add("open"); document.body.classList.add("locked"); }
function hideOverlay() { overlay.classList.remove("open"); document.body.classList.remove("locked"); }
function openCart() {
  closeProduct(); closeCheckout();
  $("#cartDrawer").classList.add("open");
  $("#cartDrawer").setAttribute("aria-hidden", "false");
  showOverlay();
}
function closeCart() {
  $("#cartDrawer").classList.remove("open");
  $("#cartDrawer").setAttribute("aria-hidden", "true");
  if (!$("#productModal").classList.contains("open") && !$("#checkoutModal").classList.contains("open")) hideOverlay();
}
function openProduct(id) {
  const product = productById(id);
  if (!product) return;
  state.activeProduct = product.id;
  closeCart(); closeCheckout();
  $("#modalContent").innerHTML = `
    <div class="modal-image-wrap">${productImageMarkup(product)}<div class="image-fallback" aria-hidden="true"></div></div>
    <div class="modal-product-info">
      <p class="eyebrow"><span></span> ${safeText(product.code)} / WATCH DETAILS</p>
      <h2>${safeText(product.name)}</h2>
      <p class="modal-meta">${safeText(product.concentration)} · ${product.size}</p>
      <div class="modal-price">${money(product.price)}</div>
      <p class="modal-description">${safeText(product.arabic)}</p>
      <div class="modal-detail"><strong>DESIGN DETAILS</strong><span>${safeText(product.notes)}</span></div>
      <div class="modal-detail"><strong>STYLE</strong><span>${safeText(product.family)}</span></div>
      <button type="button" class="button button-navy" data-modal-add="${product.id}">ADD TO BAG <span>↗</span></button>
    </div>`;
  const image = $(".modal-image-wrap img");
  bindImageRecovery(image, $(".modal-image-wrap"));
  $("#productModal").classList.add("open");
  $("#productModal").setAttribute("aria-hidden", "false");
  showOverlay();
}
function closeProduct() {
  $("#productModal").classList.remove("open");
  $("#productModal").setAttribute("aria-hidden", "true");
  state.activeProduct = null;
  if (!$("#cartDrawer").classList.contains("open") && !$("#checkoutModal").classList.contains("open")) hideOverlay();
}
function openCheckout() {
  closeCart(); closeProduct();
  $("#checkoutModal").classList.add("open");
  $("#checkoutModal").setAttribute("aria-hidden", "false");
  showOverlay();
}
function closeCheckout() {
  $("#checkoutModal").classList.remove("open");
  $("#checkoutModal").setAttribute("aria-hidden", "true");
  if (!$("#cartDrawer").classList.contains("open") && !$("#productModal").classList.contains("open")) hideOverlay();
}
function closeAll() { closeCart(); closeProduct(); closeCheckout(); hideOverlay(); }

// Product interactions use delegation so filtered and sorted cards stay interactive.
grid.addEventListener("click", (event) => {
  const add = event.target.closest("[data-add]");
  if (add) { event.stopPropagation(); addToCart(add.dataset.add); return; }
  const card = event.target.closest("[data-open-product]");
  if (card) openProduct(card.dataset.openProduct);
});
grid.addEventListener("keydown", (event) => {
  if ((event.key === "Enter" || event.key === " ") && event.target.matches("[data-open-product]")) { event.preventDefault(); openProduct(event.target.dataset.openProduct); }
});

const signatureGrid = $("#signatureGrid");
signatureGrid.addEventListener("click", (event) => {
  const view = event.target.closest("[data-signature-view]");
  const card = event.target.closest("[data-open-signature]");
  if (view) { event.stopPropagation(); openProduct(view.dataset.signatureView); return; }
  if (card) openProduct(card.dataset.openSignature);
});
signatureGrid.addEventListener("keydown", (event) => {
  if ((event.key === "Enter" || event.key === " ") && event.target.matches("[data-open-signature]")) {
    event.preventDefault(); openProduct(event.target.dataset.openSignature);
  }
});

$("#modalContent").addEventListener("click", (event) => {
  const add = event.target.closest("[data-modal-add]");
  if (add) { const id = add.dataset.modalAdd; closeProduct(); addToCart(id); }
});
$("#cartItems").addEventListener("click", (event) => {
  const qty = event.target.closest("[data-qty]");
  const remove = event.target.closest("[data-remove]");
  if (qty) changeQuantity(qty.dataset.qty, Number(qty.dataset.delta));
  if (remove) removeFromCart(remove.dataset.remove);
});

$$(".filter-chip").forEach((button) => button.addEventListener("click", () => {
  $$(".filter-chip").forEach((chip) => chip.classList.toggle("active", chip === button));
  state.filter = button.dataset.filter; renderProducts();
}));
$("#searchInput").addEventListener("input", (event) => { state.search = event.target.value.trim(); renderProducts(); });
$("#sortSelect").addEventListener("change", (event) => { state.sort = event.target.value; renderProducts(); });
$("#bagToggle").addEventListener("click", openCart);
$("#continueShopping").addEventListener("click", closeCart);
$("#overlay").addEventListener("click", closeAll);
$$("[data-close]").forEach((button) => button.addEventListener("click", closeAll));
$("#checkoutButton").addEventListener("click", openCheckout);
$("#menuToggle").addEventListener("click", () => {
  const nav = $("#mainNav");
  const open = nav.classList.toggle("open");
  $("#menuToggle").setAttribute("aria-expanded", String(open));
});
$$("#mainNav a").forEach((link) => link.addEventListener("click", () => {
  $("#mainNav").classList.remove("open");
  $("#menuToggle").setAttribute("aria-expanded", "false");
}));
$("#searchToggle").addEventListener("click", () => {
  $("#searchBox").scrollIntoView({ behavior: "smooth", block: "center" });
  $("#searchInput").focus({ preventScroll: true });
});
document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeAll(); });
window.addEventListener("scroll", () => $("#siteHeader").classList.toggle("scrolled", window.scrollY > 20), { passive: true });

$("#checkoutForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const lines = state.cart.map((item) => { const product = productById(item.id); return `${product.name} x ${item.quantity} — ${money(product.price * item.quantity)}`; });
  const message = ["New order request", `Name: ${form.get("name")}`, `Phone: ${form.get("phone")}`, `Governorate: ${form.get("governorate")}`, `Address: ${form.get("address")}`, "", ...lines, `Subtotal: ${money(cartTotal())}`].join("\n");
  if (!WHATSAPP_NUMBER) {
    $("#formFeedback").textContent = "Demo only: add the brand's WhatsApp number in app.js to enable order handoff.";
    return;
  }
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
  $("#formFeedback").textContent = "Your order message is ready in WhatsApp.";
});

$$(".hero-image, .editorial-visual img").forEach((img) => {
  img.dataset.source = img.src;
  bindImageRecovery(img, img.classList.contains("hero-image") ? $(".hero") : img.closest(".editorial-visual"));
});

$("#year").textContent = new Date().getFullYear();
renderProducts();
renderSignaturePicks();
renderCart();
