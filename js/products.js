// Product catalogue rendering and cart actions.
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("products-grid-container");
  const searchInput = document.getElementById("product-search");
  const searchButton = document.getElementById("search-button");

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[character]));
  }

  function getProductImage(product) {
    const image = typeof product.image === "string" ? product.image.trim() : "";
    // Product images can use local relative paths or normal HTTP(S) URLs.
    // Reject executable or embedded-data URLs.
    if (!image || /^(?:javascript|data):/i.test(image)) return "";
    return image;
  }

  function renderProductsGrid() {
    const query = (searchInput.value || "").trim().toLowerCase();
    const cart = CartStore.getCart();
    const filtered = PRODUCTS_DATA.filter(product =>
      String(product.name).toLowerCase().includes(query) || String(product.price).includes(query)
    );

    if (filtered.length === 0) {
      container.innerHTML = '<p class="empty-results">No products found.</p>';
      return;
    }

    container.innerHTML = filtered.map(product => {
      const isAdded = cart.some(item => item.id === product.id);
      const image = getProductImage(product);
      const imageMarkup = image
        ? `<img class="product-image" src="${escapeHtml(image)}" alt="${escapeHtml(product.name)}" loading="lazy">
           <span class="image-fallback" hidden>IMAGE UNAVAILABLE</span>`
        : '<span class="image-fallback">IMAGE</span>';

      return `
        <article class="product-item">
          <a class="product-card" href="${escapeHtml(product.link || "#")}">
            <div class="price-badge">₹${escapeHtml(product.price)}</div>
            <div class="product-image-box">${imageMarkup}</div>
            <div class="product-name-box">${escapeHtml(product.name)}</div>
          </a>
          <button type="button" class="cart-action-btn ${isAdded ? "in-cart" : ""}"
                  data-product-id="${Number(product.id)}">
            ${isAdded ? "REMOVE FROM CART" : "ADD TO CART"}
          </button>
        </article>`;
    }).join("");
  }

  // If a product image path is incorrect or the file is missing, show the fallback.
  // Capture is enabled because image load errors do not bubble normally.
  container.addEventListener("error", event => {
    const image = event.target;
    if (!(image instanceof HTMLImageElement) || !image.classList.contains("product-image")) return;
    image.hidden = true;
    const fallback = image.nextElementSibling;
    if (fallback) fallback.hidden = false;
  }, true);

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
