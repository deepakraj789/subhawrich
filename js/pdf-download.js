// Creates a PDF download of the buying list without opening the print dialog.
document.addEventListener("DOMContentLoaded", () => {
  const downloadButton = document.getElementById("download-pdf-button");
  if (!downloadButton) return;

  downloadButton.addEventListener("click", async () => {
    if (typeof window.html2pdf !== "function") {
      window.alert("The PDF tool could not load. Check your internet connection and try again.");
      return;
    }

    const header = document.querySelector(".print-header");
    const tableWrapper = document.querySelector(".print-table-wrapper");
    if (!header || !tableWrapper) {
      window.alert("The buying list could not be found.");
      return;
    }

    const originalLabel = downloadButton.textContent;
    downloadButton.disabled = true;
    downloadButton.textContent = "PREPARING PDF...";

    // Work on a copy so the on-screen table and its controls remain untouched.
    const exportRoot = document.createElement("div");
    exportRoot.className = "pdf-export-root";
    exportRoot.style.cssText = [
      "position: fixed",
      "left: 0",
      "top: 0",
      "width: 1100px",
      "padding: 24px",
      "background: #ffffff",
      "color: #000000",
      "box-sizing: border-box",
      "opacity: 0",
      "z-index: -1",
      "pointer-events: none"
    ].join(";");

    exportRoot.appendChild(header.cloneNode(true));
    exportRoot.appendChild(tableWrapper.cloneNode(true));
    exportRoot.querySelectorAll(".no-print").forEach(element => element.remove());
    exportRoot.querySelector(".print-table-wrapper").style.overflow = "visible";
    exportRoot.querySelector(".buying-table").style.minWidth = "0";
    document.body.appendChild(exportRoot);

    try {
      await window.html2pdf()
        .set({
          margin: 8,
          filename: "nexthealer-buying-list.pdf",
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
            scrollX: 0,
            scrollY: 0,
            onclone: clonedDocument => {
              const clonedRoot = clonedDocument.querySelector(".pdf-export-root");
              if (clonedRoot) {
                clonedRoot.style.opacity = "1";
                clonedRoot.style.position = "static";
                clonedRoot.style.left = "auto";
                clonedRoot.style.top = "auto";
                clonedRoot.style.zIndex = "auto";
              }
            }
          },
          jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
          pagebreak: { mode: ["css", "legacy"] }
        })
        .from(exportRoot)
        .save();
    } catch (error) {
      console.error("PDF generation failed:", error);
      window.alert("The PDF could not be generated. Please try again.");
    } finally {
      exportRoot.remove();
      downloadButton.disabled = false;
      downloadButton.textContent = originalLabel;
    }
  });
});
