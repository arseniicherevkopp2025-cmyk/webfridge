const ingredientsInput = document.querySelector("#ingredients");
const confirmProductsButton = document.querySelector("#confirm-products");
const fridgeStage = document.querySelector("#fridge-stage");
const confirmationStatus = document.querySelector("#product-confirmation-status");

if (
  !(ingredientsInput instanceof HTMLInputElement) ||
  !(confirmProductsButton instanceof HTMLButtonElement) ||
  !(fridgeStage instanceof HTMLDivElement) ||
  !(confirmationStatus instanceof HTMLParagraphElement)
) {
  throw new Error("Product confirmation controls are missing from the page.");
}

const emptyFridgeLabel = "Порожній холодильник автоматично відчиняється";

ingredientsInput.addEventListener("input", () => {
  ingredientsInput.setCustomValidity("");

  if (fridgeStage.dataset.state === "filled") {
    fridgeStage.dataset.state = "empty";
    fridgeStage.setAttribute("aria-label", emptyFridgeLabel);
    confirmProductsButton.disabled = false;
    confirmationStatus.textContent = "";
  }
});

confirmProductsButton.addEventListener("click", () => {
  if (!ingredientsInput.value.trim()) {
    ingredientsInput.setCustomValidity("Спочатку введи продукти.");
    ingredientsInput.reportValidity();
    return;
  }

  ingredientsInput.setCustomValidity("");
  fridgeStage.dataset.state = "filled";
  fridgeStage.setAttribute(
    "aria-label",
    "Холодильник наповнений продуктами та відчиняється"
  );
  confirmProductsButton.disabled = true;
  confirmationStatus.textContent = "Продукти підтверджено — холодильник наповнено.";
});
