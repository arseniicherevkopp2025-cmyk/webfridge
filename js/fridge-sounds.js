(() => {
  const soundToggle = document.querySelector("#fridge-sound-toggle");
  const soundStatus = document.querySelector("#fridge-sound-status");
  const fridgeStage =
    document.querySelector("#fridge-stage") || document.querySelector(".hero .fridge");

  if (
    (soundToggle && !(soundToggle instanceof HTMLButtonElement)) ||
    (soundStatus && !(soundStatus instanceof HTMLParagraphElement)) ||
    (fridgeStage && !(fridgeStage instanceof HTMLElement)) ||
    Boolean(soundToggle) !== Boolean(soundStatus)
  ) {
    throw new Error("Fridge sound controls are invalid on the page.");
  }

  const sounds = {
    open: new Audio("assets/audio/fridge-open.mp3"),
    close: new Audio("assets/audio/fridge-close.mp3"),
    approve: new Audio("assets/audio/approve.mp3"),
    click: new Audio("assets/audio/click.mp3"),
  };
  const buttons = document.querySelectorAll("button, a.button");
  const confirmProductsButton = document.querySelector("#confirm-products");
  let soundsEnabled = sessionStorage.getItem("fridgeSoundsEnabled") === "true";

  Object.values(sounds).forEach((sound) => {
    sound.preload = "auto";
    sound.volume = 0.45;
  });

  function updateSoundToggle() {
    if (!(soundToggle instanceof HTMLButtonElement)) {
      return;
    }

    soundToggle.setAttribute("aria-pressed", String(soundsEnabled));
    soundToggle.textContent = soundsEnabled ? "Вимкнути звуки" : "Увімкнути звуки";
  }

  async function playSound(sound) {
    sound.currentTime = 0;

    try {
      await sound.play();
    } catch (error) {
      if (error instanceof DOMException && error.name === "NotAllowedError") {
        if (soundStatus instanceof HTMLParagraphElement) {
          soundStatus.textContent = "Браузер заблокував звук. Натисни «Увімкнути звуки».";
        }
        return;
      }

      if (soundStatus instanceof HTMLParagraphElement) {
        soundStatus.textContent = "Не вдалося відтворити звук.";
      }
      console.error("Fridge sound playback failed.", error);
    }
  }

  updateSoundToggle();

  buttons.forEach((button) => {
    if (button === soundToggle) {
      return;
    }

    button.addEventListener("click", () => {
      if (!soundsEnabled || button.matches(":disabled, [aria-disabled='true']")) {
        return;
      }

      if (button === confirmProductsButton) {
        void playSound(sounds.approve);
        return;
      }

      void playSound(sounds.click);
    });
  });

  if (
    soundToggle instanceof HTMLButtonElement &&
    soundStatus instanceof HTMLParagraphElement
  ) {
    soundToggle.addEventListener("click", () => {
      soundsEnabled = !soundsEnabled;
      sessionStorage.setItem("fridgeSoundsEnabled", String(soundsEnabled));
      updateSoundToggle();

      if (soundsEnabled) {
        soundStatus.textContent = "";
        void playSound(sounds.click).then(() => {
          window.setTimeout(() => {
            void playSound(sounds.open);
          }, 180);
        });
      } else {
        Object.values(sounds).forEach((sound) => sound.pause());
        void playSound(sounds.close);
        soundStatus.textContent = "Звуки вимкнено.";
      }
    });
  }

  fridgeStage?.addEventListener("animationstart", (event) => {
    const door = event.target;
    const isEmptyFridgeDoor =
      door instanceof HTMLImageElement &&
      door.classList.contains("fridge-door-open") &&
      (door.closest(".fridge-empty-animation") !== null ||
        door.closest(".hero .fridge") !== null);

    if (soundsEnabled && isEmptyFridgeDoor) {
      void playSound(sounds.open);
    }
  });
})();
