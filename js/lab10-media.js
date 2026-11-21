(() => {
  function initializeMedia() {
    const sliderElement = document.querySelector(".dinner-swiper");
    if (!sliderElement || sliderElement.dataset.mediaReady) return;
    sliderElement.dataset.mediaReady = "true";
    const notice = document.getElementById("mediaLibraryNotice");
    const controls = document.querySelector(".dinner-controls");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pauseButton = document.getElementById("dinnerAutoplay");
    if (typeof window.Swiper === "function") {
      const updatePauseButton = (running) => {
        pauseButton.textContent = running ? "Зупинити гортання" : "Увімкнути гортання";
        pauseButton.setAttribute("aria-pressed", String(running));
      };
      const slider = new window.Swiper(sliderElement, {
        slidesPerView: 1,
        spaceBetween: 24,
        loop: true,
        speed: reducedMotion.matches ? 0 : 450,
        autoplay: reducedMotion.matches
          ? false
          : { delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true },
        navigation: { prevEl: ".dinner-prev", nextEl: ".dinner-next" },
        pagination: { el: ".dinner-pagination", clickable: true },
        keyboard: { enabled: true, onlyInViewport: true },
        a11y: {
          enabled: true,
          prevSlideMessage: "Попередні страви",
          nextSlideMessage: "Наступні страви",
          paginationBulletMessage: "Перейти до слайда {{index}}",
          slideLabelMessage: "{{index}} із {{slidesLength}}",
        },
        breakpoints: { 640: { slidesPerView: 2 }, 1101: { slidesPerView: 3 } },
        on: {
          autoplayStart: () => updatePauseButton(true),
          autoplayStop: () => updatePauseButton(false),
        },
      });
      updatePauseButton(slider.autoplay.running);
      pauseButton.addEventListener("click", () =>
        slider.autoplay.running ? slider.autoplay.stop() : slider.autoplay.start(),
      );
      sliderElement.addEventListener("focusin", () => slider.autoplay.stop());
      reducedMotion.addEventListener("change", (event) => {
        if (event.matches) {
          slider.autoplay.stop();
          slider.params.speed = 0;
        }
      });
    } else {
      controls.hidden = true;
      notice.hidden = false;
      notice.textContent =
        "Автоматичне гортання зараз недоступне. Усі ідеї залишаються нижче звичайними картками.";
    }
    if (typeof window.Fancybox?.bind === "function") {
      window.Fancybox.bind('[data-fancybox="student-dinners"]', {
        animated: !reducedMotion.matches,
        Carousel: {
          transition: "fade",
          l10n: {
            NEXT: "Наступне зображення",
            PREV: "Попереднє зображення",
            GOTO: "Перейти до зображення %d",
          },
        },
        Images: { Panzoom: { maxScale: 3 } },
        Toolbar: {
          display: { left: ["infobar"], middle: [], right: ["iterateZoom", "close"] },
        },
        l10n: {
          CLOSE: "Закрити",
          NEXT: "Наступне зображення",
          PREV: "Попереднє зображення",
          MODAL: "Натисни Escape, щоб закрити галерею",
          ERROR: "Не вдалося відкрити зображення",
          IMAGE_ERROR: "Зображення недоступне",
          TOGGLE_ZOOM: "Збільшити або зменшити",
          TOGGLE_THUMBS: "Мініатюри",
          TOGGLE_SLIDESHOW: "Слайдшоу",
          TOGGLE_FULLSCREEN: "На весь екран",
          DOWNLOAD: "Завантажити",
          ITERATEZOOM: "Збільшити або зменшити",
        },
      });
    } else {
      notice.hidden = false;
      notice.textContent +=
        " Галерея тимчасово недоступна; натискання відкриє окреме зображення.";
    }
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", initializeMedia, { once: true });
  else initializeMedia();
})();
