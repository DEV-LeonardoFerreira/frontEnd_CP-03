// =============================================
// NEXUS FORGE | script.js
// =============================================
 
// === NAVBAR SCROLL ===
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
}
 
// === HAMBURGER MENU ===
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}
 
// === SCROLL REVEAL ===
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length > 0) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObserver.observe(el));
}
 
// === PRODUCT FILTER ===
const filterBtns = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.product-card');
if (filterBtns.length > 0) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !match);
        if (match) {
          card.style.animation = 'none';
          card.offsetHeight;
          card.style.animation = 'fadeSlideUp 0.4s ease both';
        }
      });
    });
  });
}
 
// === CONTACT FORM ===
const form = document.getElementById('contatoForm');
const formSuccess = document.getElementById('formSuccess');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Mensagem';
      btn.disabled = false;
      form.reset();
      if (formSuccess) {
        formSuccess.classList.add('visible');
        setTimeout(() => formSuccess.classList.remove('visible'), 4000);
      }
    }, 1500);
  });
}
 
// =============================================
// === CARRINHO DE COMPRAS ===
// =============================================
const cartIcon = document.getElementById('cartIcon');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const closeCart = document.getElementById('closeCart');
const cartItemsContainer = document.getElementById('cartItems');
const cartBadge = document.getElementById('cartBadge');
const cartTotalValue = document.getElementById('cartTotalValue');

let cart = [];

// Abrir e Fechar Carrinho
function toggleCart() {
  if(cartSidebar) cartSidebar.classList.toggle('active');
  if(cartOverlay) cartOverlay.classList.toggle('active');
}

if(cartIcon) cartIcon.addEventListener('click', toggleCart);
if(closeCart) closeCart.addEventListener('click', toggleCart);
if(cartOverlay) cartOverlay.addEventListener('click', toggleCart);

// Adicionar produto ao carrinho
const addButtons = document.querySelectorAll('.add-to-cart');
addButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const name = btn.getAttribute('data-name');
    const price = parseFloat(btn.getAttribute('data-price'));
    const img = btn.getAttribute('data-img');

    cart.push({ name, price, img });
    updateCartUI();
    
    // Feedback visual no botão
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Adicionado';
    btn.style.color = 'var(--dark)';
    btn.style.background = 'var(--pink)';
    
    // Abre o carrinho automaticamente ao adicionar
    if(cartSidebar && !cartSidebar.classList.contains('active')) {
        toggleCart();
    }

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.color = '';
      btn.style.background = '';
    }, 1500);
  });
});

// Atualizar interface do carrinho
function updateCartUI() {
  if(!cartBadge || !cartItemsContainer || !cartTotalValue) return;

  cartBadge.innerText = cart.length; // Atualiza o número no ícone
  cartItemsContainer.innerHTML = ''; // Limpa a lista atual
  
  let total = 0;
  
  cart.forEach((item, index) => {
    total += item.price;
    
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>R$ ${item.price.toFixed(2).replace('.', ',')}</p>
      </div>
      <i class="fas fa-trash remove-item" onclick="removeFromCart(${index})"></i>
    `;
    cartItemsContainer.appendChild(div);
  });
  
  cartTotalValue.innerText = 'R$ ' + total.toFixed(2).replace('.', ',');
}

// Remover item do carrinho
window.removeFromCart = function(index) {
  cart.splice(index, 1);
  updateCartUI();
}