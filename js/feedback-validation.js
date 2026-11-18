(() => {
  const form = document.getElementById("feedbackForm");
  if (!(form instanceof HTMLFormElement)) return;

  const successModal = document.getElementById("successModal");
  const modalCard = successModal?.querySelector(".feedback-modal__card");
  const closeModalButton = document.getElementById("closeModalBtn");
  const status = document.getElementById("formStatus");
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phonePattern = /^\+380\d{9}$/;

  const fields = [
    {
      input: document.getElementById("username"),
      error: document.getElementById("nameError"),
      validate: (value) =>
        value.trim().length >= 2 ? "" : "Введи ім’я щонайменше з 2 символів.",
    },
    {
      input: document.getElementById("email"),
      error: document.getElementById("emailError"),
      validate: (value) =>
        emailPattern.test(value.trim()) ? "" : "Введи коректну електронну адресу.",
    },
    {
      input: document.getElementById("phone"),
      error: document.getElementById("phoneError"),
      validate: (value) =>
        phonePattern.test(value.trim())
          ? ""
          : "Вкажи номер у форматі +380XXXXXXXXX без пробілів.",
    },
    {
      input: document.getElementById("message"),
      error: document.getElementById("messageError"),
      validate: (value) =>
        value.trim().length >= 10 ? "" : "Повідомлення має містити щонайменше 10 символів.",
    },
    {
      input: document.getElementById("agreement"),
      error: document.getElementById("agreementError"),
      validate: (_, input) =>
        input.checked ? "" : "Потрібно підтвердити згоду для демонстрації форми.",
    },
  ].filter((field) => field.input instanceof HTMLElement && field.error instanceof HTMLElement);

  let touched = new WeakSet();
  let returnFocusTo = null;

  const resetFieldState = ({ input, error }) => {
    input.setAttribute("aria-invalid", "false");
    input.classList.remove("border-error", "border-green", "is-invalid", "is-valid");
    error.textContent = "";
    error.hidden = true;
  };

  const validateField = (field) => {
    const message = field.validate(field.input.value ?? "", field.input);
    field.input.setAttribute("aria-invalid", String(Boolean(message)));
    field.input.classList.toggle("border-error", Boolean(message));
    field.input.classList.toggle("border-green", !message);
    field.input.classList.toggle("is-invalid", Boolean(message));
    field.input.classList.toggle("is-valid", !message);
    field.error.textContent = message;
    field.error.hidden = !message;
    return !message;
  };

  fields.forEach((field) => {
    resetFieldState(field);
    field.input.addEventListener("input", () => {
      if (touched.has(field.input)) validateField(field);
    });
    field.input.addEventListener("blur", () => {
      touched.add(field.input);
      validateField(field);
    });
    if (field.input.type === "checkbox") {
      field.input.addEventListener("change", () => {
        touched.add(field.input);
        validateField(field);
      });
    }
  });

  const closeSuccessModal = () => {
    if (!successModal || successModal.hidden) return;
    successModal.hidden = true;
    document.body.classList.remove("modal-open");
    returnFocusTo?.focus();
  };

  const openSuccessModal = () => {
    if (!successModal || !closeModalButton) return;
    returnFocusTo = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    successModal.hidden = false;
    document.body.classList.add("modal-open");
    closeModalButton.focus();
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const results = fields.map((field) => {
      touched.add(field.input);
      return validateField(field);
    });

    if (results.some((isValid) => !isValid)) {
      status.textContent = "Перевір поля, позначені червоним.";
      fields.find((field) => field.input.getAttribute("aria-invalid") === "true")?.input.focus();
      return;
    }

    status.textContent = "Усі поля пройшли перевірку. Дані не передаються на сервер.";
    form.reset();
    touched = new WeakSet();
    fields.forEach(resetFieldState);
    openSuccessModal();
  });

  closeModalButton?.addEventListener("click", closeSuccessModal);
  successModal?.addEventListener("click", (event) => {
    if (event.target === successModal) closeSuccessModal();
  });

  document.addEventListener("keydown", (event) => {
    if (!successModal || successModal.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeSuccessModal();
      return;
    }
    if (event.key !== "Tab") return;

    const focusable = [...successModal.querySelectorAll(
      'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )].filter((element) => element instanceof HTMLElement && !element.hidden);
    if (!focusable.length) {
      event.preventDefault();
      modalCard?.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
})();
