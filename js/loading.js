const resultsLink = document.querySelector("#show-results");

if (!(resultsLink instanceof HTMLAnchorElement)) {
  throw new Error("The results link is missing from the loading page.");
}

const searchParams = new URLSearchParams(
  window.location.search || sessionStorage.getItem("recipeForm") || ""
);
const query = searchParams.toString();

if (query) {
  resultsLink.href = `recipes.html?${query}`;
}
