(() => {
  const calculator = document.querySelector("[data-portion-calculator]");
  if (!calculator) return;

  const servingsInput = calculator.querySelector("#servings-count");
  const ingredientRows = [...calculator.querySelectorAll("#ingredient-checklist li")];
  const shoppingList = calculator.querySelector("#shopping-list-result");
  const copyButton = calculator.querySelector("#copy-shopping-list");
  const copyStatus = calculator.querySelector("#copy-status");

  const formatQuantity = (value) => {
    if (Number.isInteger(value)) return String(value);
    return new Intl.NumberFormat("uk-UA", {
      maximumFractionDigits: 1,
    }).format(value);
  };

  const updateCalculator = () => {
    const servings = Number.parseInt(servingsInput.value, 10);
    if (!Number.isFinite(servings) || servings < 1 || servings > 8) {
      servingsInput.setAttribute("aria-invalid", "true");
      shoppingList.textContent = "Вкажи від 1 до 8 порцій.";
      return;
    }
    servingsInput.removeAttribute("aria-invalid");
    const scale = servings / 2;
    const missing = [];

    ingredientRows.forEach((row) => {
      const amount = Number(row.dataset.amount);
      const unit = row.dataset.unit;
      const output = row.querySelector("output");
      const checkbox = row.querySelector('input[type="checkbox"]');
      if (amount === 0) {
        output.textContent = "за смаком";
      } else {
        output.textContent = `${formatQuantity(amount * scale)} ${unit}`;
      }
      if (!checkbox.checked && row.dataset.ingredient !== "Сіль") {
        missing.push(row.dataset.ingredient);
      }
    });

    shoppingList.textContent = missing.length
      ? `${missing.join(", ")} · ${missing.length} ${missing.length === 1 ? "позиція" : "позиції"}`
      : "Усе вже є вдома.";
    copyStatus.textContent = "";
  };

  servingsInput.addEventListener("input", updateCalculator);
  ingredientRows.forEach((row) => {
    row.querySelector('input[type="checkbox"]').addEventListener("change", updateCalculator);
  });

  copyButton.addEventListener("click", async () => {
    const missing = ingredientRows
      .filter((row) => !row.querySelector('input[type="checkbox"]').checked && row.dataset.ingredient !== "Сіль")
      .map((row) => `${row.dataset.ingredient} — ${row.querySelector("output").textContent}`);
    const text = missing.length ? `Докупити: ${missing.join(", ")}` : "Усі інгредієнти вже є вдома.";

    try {
      await navigator.clipboard.writeText(text);
      copyStatus.textContent = "Список скопійовано.";
    } catch {
      copyStatus.textContent = "Не вдалося скопіювати автоматично. Виділи список вище й скопіюй вручну.";
    }
  });

  updateCalculator();
})();


(() => {
  const widget = document.querySelector("[data-weekly-budget]");
  if (!widget) return;

  const totalInput = widget.querySelector("#weekly-budget-total");
  const spentInput = widget.querySelector("#weekly-budget-spent");
  const mealsInput = widget.querySelector("#weekly-budget-meals");
  const summary = widget.querySelector("#weekly-budget-summary");
  const progress = widget.querySelector("#weekly-budget-progress");
  const progressBar = widget.querySelector("#weekly-budget-progress-bar");
  const progressLabel = widget.querySelector("#weekly-budget-progress-label");
  const storageKey = "student-fridge-weekly-budget-v1";
  const money = new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 0 });

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
    if (saved) {
      totalInput.value = saved.total ?? totalInput.value;
      spentInput.value = saved.spent ?? spentInput.value;
      mealsInput.value = saved.meals ?? mealsInput.value;
    }
  } catch {
    // Continue with default values if browser storage is unavailable.
  }

  const updateBudget = () => {
    const total = Number(totalInput.value);
    const spent = Number(spentInput.value);
    const meals = Number.parseInt(mealsInput.value, 10);
    const valid = Number.isFinite(total) && total >= 0 && Number.isFinite(spent) && spent >= 0 && Number.isFinite(meals) && meals >= 1;

    [totalInput, spentInput, mealsInput].forEach((input) => input.removeAttribute("aria-invalid"));
    if (!valid) {
      [totalInput, spentInput, mealsInput].forEach((input) => {
        if (input.value === "" || Number(input.value) < 0 || (input === mealsInput && meals < 1)) input.setAttribute("aria-invalid", "true");
      });
      summary.textContent = "Вкажи суми від 0 ₴ та хоча б один прийом їжі.";
      progressBar.style.width = "0%";
      progress.setAttribute("aria-valuenow", "0");
      progressLabel.textContent = "Перевір введені значення.";
      return;
    }

    const remaining = total - spent;
    const percent = total === 0 ? (spent > 0 ? 100 : 0) : Math.min(100, Math.round((spent / total) * 100));
    const perMeal = Math.max(0, remaining) / meals;
    if (remaining < 0) {
      summary.textContent = `Бюджет перевищено на ${money.format(Math.abs(remaining))} ₴. Спробуй використати продукти, які вже є.`;
    } else {
      summary.innerHTML = `<strong>Залишилось ${money.format(remaining)} ₴</strong> · орієнтир ${money.format(perMeal)} ₴ на прийом їжі.`;
    }
    progressBar.style.width = `${percent}%`;
    progress.setAttribute("aria-valuenow", String(percent));
    progressLabel.textContent = `Використано ${percent}% бюджету`;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ total, spent, meals }));
    } catch {
      // The calculator still works for the current page view.
    }
  };

  [totalInput, spentInput, mealsInput].forEach((input) => input.addEventListener("input", updateBudget));
  updateBudget();
})();
