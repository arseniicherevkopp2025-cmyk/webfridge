const productForm = document.querySelector("form.panel");

if (!(productForm instanceof HTMLFormElement)) {
  throw new Error("The product form is missing from the page.");
}

const formValues = new URLSearchParams(
  window.location.search || sessionStorage.getItem("recipeForm") || ""
);
const isExample =
  formValues.get("example") === "1" ||
  sessionStorage.getItem("loadProductExample") === "true";

if (isExample) {
  sessionStorage.removeItem("loadProductExample");
  formValues.set("ingredients", "Рис, яйця, цибуля, сіль");
  formValues.set("budget", "50");
  formValues.set("time", "30");
  formValues.set("servings", "2");
  formValues.set("equipment", "stove");
}

for (const [name, value] of formValues) {
  const control = productForm.elements.namedItem(name);

  if (control instanceof RadioNodeList) {
    const selectedControl = Array.from(control).find(
      (item) => item instanceof HTMLInputElement && item.value === value
    );
    if (selectedControl instanceof HTMLInputElement) {
      selectedControl.checked = true;
    }
  } else if (control instanceof HTMLInputElement) {
    control.value = value;
  }
}

productForm.addEventListener("submit", () => {
  const formData = new FormData(productForm);
  sessionStorage.setItem(
    "recipeForm",
    new URLSearchParams(formData).toString()
  );
});
