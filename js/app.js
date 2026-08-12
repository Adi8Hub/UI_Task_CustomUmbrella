(() => {
  "use strict";

  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  // All product-specific data lives here, so adding another color
  // requires only one configuration entry rather than new event logic.
  const themes = {
    pink: {
      image: "assets/Pink umbrella.png",
      alt: "Pink umbrella"
    },
    blue: {
      image: "assets/Blue umbrella.png",
      alt: "Blue umbrella"
    },
    yellow: {
      image: "assets/Yello umbrella.png",
      alt: "Yellow umbrella"
    }
  };

  const state = {
    color: "blue",
    logoUrl: null,
    changeTimer: null
  };

  const app = document.querySelector(".app");
  const umbrellaImage = document.getElementById("umbrellaImage");
  const logoPreview = document.getElementById("logoPreview");
  const loader = document.getElementById("loader");
  const logoInput = document.getElementById("logoInput");
  const uploadName = document.getElementById("uploadName");
  const removeLogo = document.getElementById("removeLogo");
  const errorMessage = document.getElementById("errorMessage");
  const swatches = document.querySelectorAll(".swatch");

  function setActiveSwatch(color) {
    swatches.forEach((swatch) => {
      const active = swatch.dataset.color === color;
      swatch.classList.toggle("is-active", active);
      swatch.setAttribute("aria-pressed", String(active));
    });
  }

  function changeColor(color) {
    if (!themes[color] || color === state.color) return;

    state.color = color;
    app.dataset.color = color;
    setActiveSwatch(color);

    clearTimeout(state.changeTimer);

    // The demo intentionally shows the loader for a short, visible period.
    // Do not let browser caching make the transition appear instantaneous.
    const TRANSITION_MS = 700;
    const startedAt = performance.now();
    const hadLogo = !logoPreview.hidden && Boolean(state.logoUrl);

    // Hide the logo immediately. It will be restored only after the new
    // umbrella image has loaded AND the short demo-style transition elapsed.
    if (hadLogo) {
      logoPreview.hidden = true;
    }

    umbrellaImage.classList.add("is-loading");
    loader.classList.add("is-visible");

    const newImage = new Image();
    newImage.src = themes[color].image;

    const finishTransition = () => {
      const elapsed = performance.now() - startedAt;
      const remaining = Math.max(0, TRANSITION_MS - elapsed);

      clearTimeout(state.changeTimer);
      state.changeTimer = setTimeout(() => {
        umbrellaImage.src = themes[color].image;
        umbrellaImage.alt = themes[color].alt;
        umbrellaImage.classList.remove("is-loading");
        loader.classList.remove("is-visible");

        // The logo appears together with the newly displayed umbrella.
        if (hadLogo && state.logoUrl) {
          logoPreview.hidden = false;
        }
      }, remaining);
    };

    newImage.onload = finishTransition;

    // If the asset fails, still complete the UI transition instead of
    // leaving the loader visible forever.
    newImage.onerror = finishTransition;

    // Cached images can complete before onload is observable in some
    // browsers, so explicitly handle an already-complete image.
    if (newImage.complete) {
      finishTransition();
    }
  }

  function clearLogo() {
    if (state.logoUrl) {
      URL.revokeObjectURL(state.logoUrl);
      state.logoUrl = null;
    }

    logoPreview.hidden = true;
    logoPreview.removeAttribute("src");
    uploadName.textContent = "UPLOAD LOGO";
    removeLogo.hidden = true;
    logoInput.value = "";
    errorMessage.textContent = "";
  }

  function handleUpload(file) {
    errorMessage.textContent = "";

    if (!file) return;

    const validTypes = new Set(["image/png", "image/jpeg"]);

    if (!validTypes.has(file.type)) {
      errorMessage.textContent = "Please select a PNG or JPG file.";
      logoInput.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      errorMessage.textContent = "Maximum file size is 5MB.";
      logoInput.value = "";
      return;
    }

    if (state.logoUrl) {
      URL.revokeObjectURL(state.logoUrl);
    }

    state.logoUrl = URL.createObjectURL(file);
    logoPreview.src = state.logoUrl;
    logoPreview.hidden = false;
    uploadName.textContent = file.name;
    removeLogo.hidden = false;
  }

  swatches.forEach((swatch) => {
    swatch.addEventListener("click", () => changeColor(swatch.dataset.color));
  });

  logoInput.addEventListener("change", (event) => {
    handleUpload(event.target.files[0]);
  });

  removeLogo.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    clearLogo();
  });

  window.addEventListener("beforeunload", () => {
    if (state.logoUrl) URL.revokeObjectURL(state.logoUrl);
  });
})();
