// Shared cart storage for products.html and print.html.
(() => {
  const COOKIE_NAME = "subhaw_rich_cart";
  const COOKIE_MAX_AGE = 60 * 60 * 24; // Preserve the prototype's one-day expiry.
  const DEMO_CART = [];
  let memoryCart = null;

  function isValidCart(value) {
    return Array.isArray(value) && value.every(item =>
      item && Number.isInteger(item.id) &&
      typeof item.name === "string" &&
      Number.isFinite(item.price) && item.price >= 0 &&
      Number.isInteger(item.qty) && item.qty >= 1
    );
  }

  function readCookie() {
    const prefix = COOKIE_NAME + "=";
    const entry = document.cookie.split(";").map(part => part.trim()).find(part => part.startsWith(prefix));
    if (!entry) return null;
    try {
      const value = JSON.parse(decodeURIComponent(entry.slice(prefix.length)));
      return isValidCart(value) ? value : null;
    } catch {
      return null;
    }
  }

  function writeCookie(cart) {
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = COOKIE_NAME + "=" + encodeURIComponent(JSON.stringify(cart)) +
      "; Path=/; Max-Age=" + COOKIE_MAX_AGE + "; SameSite=Lax" + secure;
  }

  function getCart() {
    try {
      const cookieCart = readCookie();
      if (cookieCart !== null) {
        memoryCart = cookieCart;
        return cookieCart;
      }
    } catch { /* Continue to the fallback storage. */ }

    try {
      const fallback = localStorage.getItem(COOKIE_NAME);
      if (fallback !== null) {
        const parsed = JSON.parse(fallback);
        if (isValidCart(parsed)) {
          memoryCart = parsed;
          return parsed;
        }
      }
    } catch { /* Storage may be disabled by the browser. */ }

    if (memoryCart !== null) return memoryCart;

    const initialCart = DEMO_CART.map(item => ({ ...item }));
    saveCart(initialCart);
    return initialCart;
  }

  function saveCart(cart) {
    const safeCart = Array.isArray(cart) ? cart : [];
    memoryCart = safeCart;
    try { writeCookie(safeCart); } catch { /* Use fallback storage below. */ }
    try { localStorage.setItem(COOKIE_NAME, JSON.stringify(safeCart)); } catch { /* Memory remains available. */ }
  }

  window.CartStore = { getCart, saveCart };
})();
