// Product catalogue rendering and cart actions.
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("products-grid-container");
  const searchInput = document.getElementById("product-search");
  const searchButton = document.getElementById("search-button");

  function renderProductsGrid() {
    const query = (searchInput.value || "").trim().toLowerCase();
    const cart = CartStore.getCart();
    const filtered = PRODUCTS_DATA.filter(product =>
      product.name.toLowerCase().includes(query) || String(product.price).includes(query)
    );

    if (filtered.length === 0) {
      container.innerHTML = '<p class="empty-results">No products found.</p>';
      return;
    }

    container.innerHTML = filtered.map(product => {
      const isAdded = cart.some(item => item.id === product.id);
      return `
        <article class="product-item">
          <a class="product-card" href="${product.link}">
            <div class="price-badge">₹${product.price}</div>
            <div class="product-image-box">IMAGE</div>
            <div class="product-name-box">${product.name}</div>
          </a>
          <button type="button" class="cart-action-btn ${isAdded ? "in-cart" : ""}"
                  data-product-id="${product.id}">
            ${isAdded ? "REMOVE FROM CART" : "ADD TO CART"}
          </button>
        </article>`;
    }).join("");
  }

  container.addEventListener("click", event => {
    const button = event.target.closest("[data-product-id]");
    if (!button) return;
    const productId = Number(button.dataset.productId);
    const cart = CartStore.getCart();
    const existingIndex = cart.findIndex(item => item.id === productId);

    if (existingIndex >= 0) {
      cart.splice(existingIndex, 1);
    } else {
      const product = PRODUCTS_DATA.find(item => item.id === productId);
      if (product) cart.push({ id: product.id, name: product.name, price: product.price, qty: 1 });
    }
    CartStore.saveCart(cart);
    renderProductsGrid();
  });

  searchInput.addEventListener("input", renderProductsGrid);
  searchButton.addEventListener("click", renderProductsGrid);
  renderProductsGrid();
});
