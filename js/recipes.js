const ingredientTags = document.querySelector("#ingredient-tags");
const ingredientAvailability = document.querySelectorAll(".available");
const filterSummary = document.querySelector("#filter-summary");

if (
  !(ingredientTags instanceof HTMLUListElement) ||
  ingredientAvailability.length === 0 ||
  !(filterSummary instanceof HTMLParagraphElement)
) {
  throw new Error("Ingredient display elements are missing from the results page.");
}

const sampleIngredients = ["Рис", "Яйця", "Цибуля", "Сіль"];
const searchParams = new URLSearchParams(
  window.location.search || sessionStorage.getItem("recipeForm") || ""
);
const ingredientsParam = searchParams.get("ingredients");
const ingredients = ingredientsParam
  ? ingredientsParam
      .split(/[,;\n]+/)
      .map((ingredient) => ingredient.trim().replace(/\s+/g, " "))
      .filter(Boolean)
      .map(
        (ingredient) =>
          ingredient.charAt(0).toLocaleUpperCase("uk-UA") + ingredient.slice(1)
      )
  : sampleIngredients;
const displayedIngredients = ingredients.length ? ingredients : sampleIngredients;

ingredientTags.replaceChildren(
  ...displayedIngredients.map((ingredient) => {
    const tag = document.createElement("li");
    tag.textContent = ingredient;
    return tag;
  })
);

const ingredientsSummary = displayedIngredients.join(", ");

ingredientAvailability.forEach((element) => {
  element.textContent = `Є вдома: ${ingredientsSummary}`;
});

const budgetParam = searchParams.get("budget");
const budget = budgetParam === null ? 50 : Number(budgetParam);
const servings = searchParams.get("servings") || "2";
const time = searchParams.get("time") || "30";

if (Number.isFinite(budget) && budget >= 0) {
  filterSummary.textContent = `${budget} ₴ на докупку · ${servings} порції · до ${time} хв`;
}
