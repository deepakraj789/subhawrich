// Home / About Us / Contact section switching.
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll("[data-section]");
  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const selected = button.dataset.section;
      buttons.forEach(item => item.classList.toggle("active-nav", item === button));
      document.querySelectorAll(".section-panel").forEach(panel => {
        panel.classList.toggle("active-section", panel.id === "section-" + selected);
      });
    });
  });
});
