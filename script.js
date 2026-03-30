(function () {
  var html = document.documentElement;
  var toggle = document.getElementById("themeToggle");
  var toggleSwitch = document.querySelector(".toggle-switch");
  var logo = document.getElementById("mainLogo");
  var logoLight = "assets/imgs/1.MARK-1A1A1A.png";
  var logoDark = "assets/imgs/2.MARK-F4F1EE.png";
  var imageOverlay = document.getElementById("liImageOverlay");
  var imageOverlayContent = document.querySelector(".image-overlay-content");
  var imageOverlayClose = document.getElementById("liImageOverlayClose");
  var overlayPreviewImage = document.getElementById("overlayPreviewImage");
  var overlayPreviewTitle = document.getElementById("overlayPreviewTitle");
  var overlayPreviewParagraph = document.getElementById(
    "overlayPreviewParagraph",
  );
  var overlayPreviewList = document.getElementById("overlayPreviewList");
  var overlayTriggers = document.querySelectorAll(
    "button[data-overlay-img], button[data-overlay-list], button[data-overlay-p]",
  );
  var scrollIndicator = document.querySelector(".scroll-indicator");
  var isOverlayOpen = false;

  function updateToggleVisualState() {
    var currentTheme = html.getAttribute("data-theme");
    if (!toggleSwitch) return;

    if (currentTheme === "dark") {
      toggleSwitch.classList.add("dark-mode");
      toggle.setAttribute("aria-pressed", "true");
    } else {
      toggleSwitch.classList.remove("dark-mode");
      toggle.setAttribute("aria-pressed", "false");
    }
  }

  function loadSavedTheme() {
    var savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      html.setAttribute("data-theme", "dark");
      if (logo) logo.src = logoDark;
    } else {
      html.setAttribute("data-theme", "light");
      if (logo) logo.src = logoLight;
    }
    updateToggleVisualState();
  }

  function changeTheme() {
    var currentTheme = html.getAttribute("data-theme");

    if (currentTheme === "dark") {
      html.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
      if (logo) logo.src = logoLight;
    } else {
      html.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
      if (logo) logo.src = logoDark;
    }
    updateToggleVisualState();
  }

  loadSavedTheme();

  if (toggle) {
    toggle.addEventListener("click", changeTheme);
    toggle.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        changeTheme();
      }
    });
  }

  var revealItems = document.querySelectorAll(".reveal");
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        }
      });
    },
    { threshold: 0.2 },
  );

  revealItems.forEach(function (item) {
    observer.observe(item);
  });

  function openOverlay(trigger) {
    if (!imageOverlay || !overlayPreviewImage || !trigger) return;

    var imageSrc = trigger.getAttribute("data-overlay-img");
    var textTitle = trigger.getAttribute("data-overlay-title");
    var textList = trigger.getAttribute("data-overlay-list");
    var textParagraph = trigger.getAttribute("data-overlay-p");

    if (overlayPreviewTitle) {
      overlayPreviewTitle.hidden = true;
      overlayPreviewTitle.textContent = "";
    }

    if (overlayPreviewList) {
      overlayPreviewList.hidden = true;
      overlayPreviewList.innerHTML = "";
    }

    if (overlayPreviewParagraph) {
      overlayPreviewParagraph.hidden = true;
      overlayPreviewParagraph.textContent = "";
    }

    if (imageSrc) {
      overlayPreviewImage.hidden = false;
      overlayPreviewImage.src = imageSrc;
      overlayPreviewImage.alt = trigger.textContent.trim() || "Preview image";
    } else {
      overlayPreviewImage.hidden = true;
      overlayPreviewImage.src = "";
      overlayPreviewImage.alt = "";
    }

    if (textList && overlayPreviewList) {
      var items = textList
        .split("|")
        .map(function (item) {
          return item.trim();
        })
        .filter(Boolean);

      items.forEach(function (item) {
        var li = document.createElement("li");
        li.textContent = item;
        overlayPreviewList.appendChild(li);
      });

      overlayPreviewList.hidden = items.length === 0;

      if (overlayPreviewTitle) {
        overlayPreviewTitle.textContent = textTitle || "My Example";
        overlayPreviewTitle.hidden = false;
      }

      if (imageOverlayContent) {
        imageOverlayContent.classList.add("overlay-with-copy");
      }
    } else if (textParagraph && overlayPreviewParagraph) {
      overlayPreviewParagraph.textContent = textParagraph;
      overlayPreviewParagraph.hidden = false;

      if (overlayPreviewTitle) {
        overlayPreviewTitle.textContent = textTitle || "My Example";
        overlayPreviewTitle.hidden = false;
      }

      if (imageOverlayContent) {
        imageOverlayContent.classList.add("overlay-with-copy");
      }
    } else if (imageOverlayContent) {
      imageOverlayContent.classList.remove("overlay-with-copy");
    }

    imageOverlay.hidden = false;
    html.style.overflow = "hidden";
    isOverlayOpen = true;
  }

  function closeImageOverlay() {
    if (!imageOverlay || !overlayPreviewImage) return;

    imageOverlay.hidden = true;
    overlayPreviewImage.src = "";
    overlayPreviewImage.hidden = false;

    if (overlayPreviewList) {
      overlayPreviewList.innerHTML = "";
      overlayPreviewList.hidden = true;
    }

    if (overlayPreviewTitle) {
      overlayPreviewTitle.textContent = "";
      overlayPreviewTitle.hidden = true;
    }

    if (overlayPreviewParagraph) {
      overlayPreviewParagraph.textContent = "";
      overlayPreviewParagraph.hidden = true;
    }

    if (imageOverlayContent) {
      imageOverlayContent.classList.remove("overlay-with-copy");
    }

    html.style.overflow = "";
    isOverlayOpen = false;
  }

  overlayTriggers.forEach(function (button) {
    button.addEventListener("click", function () {
      openOverlay(button);
    });
  });

  if (imageOverlay) {
    imageOverlay.addEventListener("click", function (e) {
      if (e.target && e.target.getAttribute("data-close-overlay") === "true") {
        closeImageOverlay();
      }
    });
  }

  if (imageOverlayClose) {
    imageOverlayClose.addEventListener("click", closeImageOverlay);
  }

  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOverlayOpen) {
      closeImageOverlay();
    }
  });

  var deckItems = Array.prototype.slice.call(
    document.querySelectorAll("main .hero, main .slide"),
  );

  if (deckItems.length > 0) {
    html.classList.add("deck-enabled");

    var currentIndex = 0;
    var isAnimating = false;
    var unlockTimer = null;

    function clampIndex(index) {
      return Math.max(0, Math.min(index, deckItems.length - 1));
    }

    function applyDeckState(index) {
      deckItems.forEach(function (item, i) {
        item.classList.toggle("is-active", i === index);
        item.classList.toggle("is-seen", i <= index);
      });

      if (scrollIndicator) {
        var isLastSlide = index >= deckItems.length - 1;
        scrollIndicator.style.display = isLastSlide ? "none" : "block";
      }
    }

    function nearestIndexToViewportTop() {
      var closestIndex = 0;
      var closestDistance = Infinity;

      deckItems.forEach(function (item, i) {
        var distance = Math.abs(item.getBoundingClientRect().top);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      });

      return closestIndex;
    }

    function goToIndex(nextIndex) {
      var targetIndex = clampIndex(nextIndex);
      if (targetIndex === currentIndex || isAnimating) return;

      currentIndex = targetIndex;
      applyDeckState(currentIndex);
      isAnimating = true;

      deckItems[currentIndex].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      if (unlockTimer) {
        clearTimeout(unlockTimer);
      }

      unlockTimer = setTimeout(function () {
        isAnimating = false;
      }, 650);
    }

    currentIndex = nearestIndexToViewportTop();
    applyDeckState(currentIndex);

    window.addEventListener(
      "wheel",
      function (e) {
        if (isOverlayOpen) return;

        if (Math.abs(e.deltaY) < 8 || isAnimating) return;

        e.preventDefault();

        if (e.deltaY > 0) {
          goToIndex(currentIndex + 1);
        } else {
          goToIndex(currentIndex - 1);
        }
      },
      { passive: false },
    );

    window.addEventListener("keydown", function (e) {
      if (isOverlayOpen) return;
      if (isAnimating) return;

      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        goToIndex(currentIndex + 1);
      }

      if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        goToIndex(currentIndex - 1);
      }
    });

    window.addEventListener(
      "scroll",
      function () {
        if (isAnimating) return;
        currentIndex = nearestIndexToViewportTop();
        applyDeckState(currentIndex);
      },
      { passive: true },
    );
  }
})();
