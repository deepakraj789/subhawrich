// Downloads the buying list as an A4 portrait PDF.
// Interactive quantity and remove controls are excluded from the PDF render only.
document.addEventListener("DOMContentLoaded", () => {
  const downloadButton = document.getElementById("download-pdf-button");
  const pdfContent = document.getElementById("pdf-content");

  if (!downloadButton || !pdfContent) return;

  // Keep this selector limited to the cart controls, not the quantity text itself.
  const excludedControlsSelector = [
    "button.qty-btn",
    "button.remove-row-btn",
    ".qty-controls > button",
    ".subtotal-cell-inner > button"
  ].join(", ");

  downloadButton.addEventListener("click", async () => {
    if (typeof window.html2pdf !== "function") {
      window.alert("The PDF tool could not load. Check that the PDF library script loaded successfully.");
      return;
    }

    const originalLabel = downloadButton.textContent;
    downloadButton.disabled = true;
    downloadButton.textContent = "PREPARING PDF...";

    try {
      await window.html2pdf()
        .set({
          margin: [10, 10, 10, 10],
          filename: "subhaw-rich-buying-list.pdf",
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
            scrollX: 0,
            scrollY: 0,

            // Primary exclusion: html2canvas skips these elements while rendering.
            // nodeType/matches are used instead of instanceof Element because
            // the callback may receive elements from its cloned iframe document.
            ignoreElements: element =>
              Boolean(
                element &&
                element.nodeType === 1 &&
                typeof element.matches === "function" &&
                element.matches(excludedControlsSelector)
              ),

            // Secondary exclusion: physically remove the same controls from
            // html2canvas's cloned document. The live page is never modified.
            onclone: clonedDocument => {
              clonedDocument
                .querySelectorAll(`#pdf-content ${excludedControlsSelector}`)
                .forEach(element => element.remove());

              const clonedContent = clonedDocument.getElementById("pdf-content");
              const clonedWrapper = clonedDocument.querySelector(".print-table-wrapper");
              const clonedTable = clonedDocument.querySelector(".buying-table");

              if (clonedContent) {
                clonedContent.style.width = "100%";
                clonedContent.style.maxWidth = "none";
                clonedContent.style.backgroundColor = "#ffffff";
              }
              if (clonedWrapper) {
                clonedWrapper.style.width = "100%";
                clonedWrapper.style.overflow = "visible";
              }
              if (clonedTable) {
                clonedTable.style.width = "100%";
                clonedTable.style.minWidth = "0";
                clonedTable.style.tableLayout = "fixed";
              }
            }
          },
          jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait"
          },
          pagebreak: {
            mode: ["css", "legacy"],
            avoid: ["tr"]
          }
        })
        .from(pdfContent)
        .save();
    } catch (error) {
      console.error("PDF generation failed:", error);
      window.alert("The PDF could not be generated. Check the browser console for details.");
    } finally {
      downloadButton.disabled = false;
      downloadButton.textContent = originalLabel;
    }
  });
});
