// Configuration
const API_BASE_URL = "http://localhost:5000/api";

// 1. Fetch & Display Products from Database
async function loadProducts() {
  const container = document.getElementById("productGridContainer");
  try {
    const res = await fetch(`${API_BASE_URL}/products`);
    const products = await res.json();
    
    container.innerHTML = "";
    products.forEach((item, index) => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <span class="product-badge">${item.condition}</span>
        <img src="${item.imageUrl || 'placeholder.jpg'}" alt="${item.name}" class="product-img">
        <h3>${item.name}</h3>
        <p class="price">₹${Number(item.offerPrice).toLocaleString()}</p>
        <div class="slide-action-track" id="prodTrack_${index}">
          <span class="slider-label">SLIDE TO BUY →</span>
          <div class="slide-handle" id="prodHandle_${index}">➤</div>
        </div>
      `;
      container.appendChild(card);
      initSlider(`prodTrack_${index}`, `prodHandle_${index}`, () => {
        sendOrderToWhatsApp(item.name, item.offerPrice);
      });
    });
  } catch (err) {
    console.error("Failed to connect to backend server:", err);
  }
}

// 2. Bilingual WhatsApp Engine
function sendOrderToWhatsApp(productName, price) {
  const message = `Hello Charan Mobiles (Muthu Kumar),\nI would like to order:\n*Product:* ${productName}\n*Price:* ₹${price}\nPlease confirm order.`;
  window.open(`https://wa.me/916360509055?text=${encodeURIComponent(message)}`, "_blank");
}

// 3. Slider Touch/Mouse Movement
function initSlider(trackId, handleId, callback) {
  const track = document.getElementById(trackId);
  const handle = document.getElementById(handleId);
  let isDown = false, startX = 0, max = 0;

  const start = (e) => {
    isDown = true;
    startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    max = track.clientWidth - handle.clientWidth - 6;
  };
  const move = (e) => {
    if (!isDown) return;
    const x = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    let dist = x - startX;
    if (dist < 0) dist = 0;
    if (dist > max) dist = max;
    handle.style.left = `${dist + 3}px`;
    if (dist >= max - 2) {
      isDown = false;
      handle.style.left = '3px';
      callback();
    }
  };
  const stop = () => {
    isDown = false;
    handle.style.left = '3px';
  };

  handle.addEventListener('mousedown', start);
  window.addEventListener('mousemove', move);
  window.addEventListener('mouseup', stop);
  handle.addEventListener('touchstart', start, { passive: true });
  window.addEventListener('touchmove', move, { passive: true });
  window.addEventListener('touchend', stop);
}

document.addEventListener("DOMContentLoaded", loadProducts);

