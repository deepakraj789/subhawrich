// Buying-list table, quantity controls, totals, and printing.
document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.getElementById("print-table-body");

  function renderPrintTable() {
    document.getElementById("print-date").textContent = "Date: " + new Date().toLocaleString();
    const cart = CartStore.getCart();
    let subtotalSum = 0;

    if (cart.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5">No products in cart</td></tr>';
    } else {
      tbody.innerHTML = cart.map((item, index) => {
        const rowSubtotal = item.qty * item.price;
        subtotalSum += rowSubtotal;
        return `
          <tr>
            <td>${index + 1}</td>
            <td>${escapeHtml(item.name)}</td>
            <td>
              <div class="qty-controls">
                <button type="button" class="qty-btn no-print" data-id="${item.id}" data-delta="-1" aria-label="Decrease quantity">-</button>
                <span>${item.qty}</span>
                <button type="button" class="qty-btn no-print" data-id="${item.id}" data-delta="1" aria-label="Increase quantity">+</button>
              </div>
            </td>
            <td>₹${item.price}</td>
            <td>
              <div class="subtotal-cell-inner">
                <span>₹${rowSubtotal}</span>
                <button type="button" class="remove-row-btn no-print" data-remove-id="${item.id}">Remove</button>
              </div>
            </td>
          </tr>`;
      }).join("");
    }

    const gstAmount = Math.round(subtotalSum * 0.10 * 100) / 100;
    const generatedTotal = Math.round((subtotalSum + gstAmount) * 100) / 100;
    document.getElementById("gst-value").textContent = "₹" + gstAmount;
    document.getElementById("generated-total-value").textContent = "₹" + generatedTotal;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[char]));
  }

  tbody.addEventListener("click", event => {
    const quantityButton = event.target.closest("[data-delta]");
    const removeButton = event.target.closest("[data-remove-id]");
    const cart = CartStore.getCart();

    if (quantityButton) {
      const id = Number(quantityButton.dataset.id);
      const item = cart.find(entry => entry.id === id);
      if (item) {
        item.qty = Math.max(1, item.qty + Number(quantityButton.dataset.delta));
        CartStore.saveCart(cart);
        renderPrintTable();
      }
    } else if (removeButton) {
      const id = Number(removeButton.dataset.removeId);
      CartStore.saveCart(cart.filter(entry => entry.id !== id));
      renderPrintTable();
    }
  });

  document.getElementById("print-button").addEventListener("click", () => window.print());
  renderPrintTable();
});
