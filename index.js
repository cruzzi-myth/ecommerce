// 1. GLOBAL VARIABLES
let currentSelectedId = null; 
let cart = [];

/**
 * Navigation Menu
 */
function openMenu() {
    document.body.classList.add("menu--open");
}

function closeMenu() {
    document.body.classList.remove("menu--open");
}

/**
 * Abstract Gallery Logic
 */
async function renderAbstracts(filter) {
  const abstractsWrapper = document.querySelector('.abstracts');
  
  // Show a loading state while waiting for the promise (optional but good)
  abstractsWrapper.innerHTML = `<i class="fas fa-spinner loading__spinner"></i>`;

  const abstracts = await getAbstracts();
  
  if (filter === "LOW_TO_HIGH") {
    abstracts.sort((a, b) => a.salePrice - b.salePrice);
  }
  else if (filter === "HIGH_TO_LOW") {
    abstracts.sort((a, b) => b.salePrice - a.salePrice);
  }
  else if (filter === "RATING") {
    abstracts.sort((a, b) => (b.rating || 0) - (a.rating || 0));  
  }

  const abstractsHtml = abstracts.map((abstract) => {
    return `<div class="abstract" onclick="openModal(${abstract.id})">
      <figure class="canvas__img--wrapper">
        <img class="canvas__img" src="${abstract.url}" alt="${abstract.title}">
        <div class="canvas__overlay">
           <div class="overlay__price">$${abstract.salePrice}</div>
           <button class="overlay__btn">View Details</button>
        </div>
      </figure>
      <div class="canvas_title">${abstract.title}</div>
      <div class="canvas__rating">
          ${renderRating(abstract.rating || 4.5)}
      </div>
      <div class="price">
        <span class="canvas__price--normal">$${abstract.originalPrice.toFixed(2)}</span>
        &nbsp;$${abstract.salePrice.toFixed(2)}
      </div>
    </div>`;
  }).join('');

  abstractsWrapper.innerHTML = abstractsHtml;
}

function filterAbstracts(event) {
    renderAbstracts(event.target.value);
}

/**
 * Modal Logic
 */
async function openModal(id) { // Added async
    currentSelectedId = id; 
    const abstracts = await getAbstracts(); // Added await
    const abstract = abstracts.find(a => a.id === id);
    
    document.getElementById('modal-img').src = abstract.url;
    document.getElementById('modal-title').innerText = abstract.title;
    document.getElementById('modal-description').innerText = `Medium: ${abstract.medium}. An original exploration of raw energy and emotion.`;
    document.getElementById('modal-price').innerHTML = `<span class="canvas__price--normal">$${abstract.originalPrice}</span> $${abstract.salePrice}`;
    
    const modal = document.getElementById('abstract-modal');
    modal.classList.add('modal--open');
    document.body.classList.add('body--modal-open');
}

function closeModal() {
    const modal = document.getElementById('abstract-modal');
    modal.classList.remove('modal--open');
    document.body.classList.remove('body--modal-open');
}

/**
 * Cart Logic
 */
function openCart() {
    document.getElementById('cart-sidebar').classList.add('cart-sidebar--open');
}

function closeCart() {
    document.getElementById('cart-sidebar').classList.remove('cart-sidebar--open');
}

async function addToCart() { // Added async
    const abstracts = await getAbstracts(); // Added await
    const piece = abstracts.find(a => a.id === currentSelectedId);
    
    cart.push(piece);
    updateCartUI();
    closeModal(); 
    openCart();   
}

function updateCartUI() {
    const cartItemsWrapper = document.querySelector('.cart__items');
    const cartCount = document.querySelector('.cart__count');
    const totalPriceEl = document.getElementById('cart-total-price');

    cartCount.innerText = cart.length;

    cartItemsWrapper.innerHTML = cart.map((item, index) => {
        return `
        <div class="cart__item" style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
            <img src="${item.url}" width="60" height="60" style="object-fit: cover; border-radius: 4px;">
            <div style="flex-grow: 1;">
                <p style="margin: 0; font-weight: bold;">${item.title}</p>
                <b style="color: #6030b1;">$${item.salePrice}</b>
            </div>
            <button onclick="removeFromCart(${index})" style="background: none; border: none; color: red; cursor: pointer; font-size: 20px;">&times;</button>
        </div>`;
    }).join('');

    const total = cart.reduce((acc, item) => acc + item.salePrice, 0);
    totalPriceEl.innerText = `$${total.toFixed(2)}`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

/**
 * Helper: Render Rating Stars
 */
function renderRating(rating) {
    let ratingHtml = "";
    for (let i = 0; i < Math.floor(rating); i++) {
        ratingHtml += '<i class="fa-solid fa-star"></i>';
    }
    if (!Number.isInteger(rating)) {
        ratingHtml += '<i class="fa-solid fa-star-half"></i>';
    }
    return ratingHtml;
}

// Initial Render
renderAbstracts(); // No need for setTimeout if renderAbstracts is async

/**
 * Data (Promise Mock)
 */
function getAbstracts() {
   return new Promise((resolve) => {
     setTimeout(() => {
        resolve([
                { id: 1, title: "The Thought", url: "imgs/thought.JPG", originalPrice: 1200, salePrice: 795, rating: 4.5, medium: "Mixed" },
                { id: 2, title: "Rage", url: "imgs/rage.JPG", originalPrice: 1200, salePrice: 795, rating: 5, medium: "Mixed" },
                { id: 3, title: "No Stress", url: "imgs/nostress.JPG", originalPrice: 1200, salePrice: 795, rating: 4, medium: "Mixed" },
                { id: 4, title: "The Vibe", url: "imgs/thevibe.JPG", originalPrice: 1200, salePrice: 795, rating: 4.5, medium: "Mixed" },
                { id: 5, title: "Depression", url: "imgs/depress.JPG", originalPrice: 1200, salePrice: 795, rating: 3, medium: "Mixed" },
                { id: 6, title: "Lifted", url: "imgs/lifted.JPG", originalPrice: 1200, salePrice: 795, rating: 5, medium: "Mixed" },
                { id: 7, title: "Zen", url: "imgs/zen.JPG", originalPrice: 1200, salePrice: 795, rating: 5, medium: "Mixed" },
                { id: 8, title: "Hurt", url: "imgs/hurtJPG.JPG", originalPrice: 1200, salePrice: 795, rating: 3.5, medium: "Mixed" },
            ]);
        }, 1000);
    });   
}
