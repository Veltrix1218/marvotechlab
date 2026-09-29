/* ==========================================================================
   MARVO TECH LAB — PROFILE CARD SCRIPT
   ========================================================================== */

const WHATSAPP_NUMBER = "2347077282020";

document.addEventListener("DOMContentLoaded", function () {

  /* ========================================================================
     LIGHT / DARK THEME TOGGLE — remembers the choice for next visit,
     and respects the OS-level preference the very first time someone visits.
     ======================================================================== */
  const themeToggle = document.getElementById("theme-toggle");
  const root = document.documentElement;

  function applyTheme(theme) {
    if (theme === "light") {
      root.setAttribute("data-theme", "light");
    } else {
      root.removeAttribute("data-theme"); // dark is the default, no attribute needed
    }
  }

  const savedTheme = localStorage.getItem("marvoTheme");
  if (savedTheme) {
    applyTheme(savedTheme);
  } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    applyTheme("light");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const isLight = root.getAttribute("data-theme") === "light";
      const next = isLight ? "dark" : "light";
      applyTheme(next);
      localStorage.setItem("marvoTheme", next);
    });
  }

  const quoteDialog = document.getElementById("quote-dialog");
  const successDialog = document.getElementById("quote-success-dialog");
  const projectsDialog = document.getElementById("projects-dialog");

  document.querySelectorAll('[data-action="open-quote"]').forEach(function (btn) {
    btn.addEventListener("click", function () {
      launchPlane(btn);
      if (quoteDialog) quoteDialog.showModal();
    });
  });
  document.querySelectorAll('[data-action="open-projects"]').forEach(function (btn) {
    btn.addEventListener("click", function () { if (projectsDialog) projectsDialog.showModal(); });
  });
  document.querySelectorAll('[data-action="close-quote"]').forEach(function (btn) {
    btn.addEventListener("click", function () { if (quoteDialog) quoteDialog.close(); });
  });
  document.querySelectorAll('[data-action="close-project"]').forEach(function (btn) {
    btn.addEventListener("click", function () { if (projectsDialog) projectsDialog.close(); });
  });
  document.querySelectorAll('[data-action="close-success"]').forEach(function (btn) {
    btn.addEventListener("click", function () { if (successDialog) successDialog.close(); });
  });

  [quoteDialog, successDialog, projectsDialog].forEach(function (dialog) {
    if (!dialog) return;
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) dialog.close();
    });
  });

  function launchPlane(button) {
    if (!button) return;
    button.classList.add("plane-launch");
    setTimeout(function () { button.classList.remove("plane-launch"); }, 500);
  }

  const quoteForm = document.getElementById("quote-form");
  const statusEl = document.getElementById("quote-form-status");

  if (quoteForm) {
    quoteForm.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!quoteForm.checkValidity()) {
        quoteForm.reportValidity();
        if (statusEl) {
          statusEl.textContent = "Please fill in all required fields.";
          statusEl.className = "form-status error";
        }
        return;
      }

      const submitBtn = quoteForm.querySelector(".quote-submit");
      launchPlane(submitBtn);

      const data = Object.fromEntries(new FormData(quoteForm).entries());
      const requirements = Array.from(quoteForm.querySelectorAll('input[name="additional-requirement"]:checked'))
        .map(function (el) { return el.value; })
        .join(", ") || "None selected";

      const lines = [
        "Hello Marvo Tech Lab, I'd like to request a quote:",
        "",
        `Name: ${data.name || "-"}`,
        `Phone: ${data.phone || "-"}`,
        `Email: ${data.email || "-"}`,
        `Business/Brand Name: ${data.business || "-"}`,
        `Industry/Niche: ${data.niche || "-"}`,
        `Service Needed: ${data.service || "-"}`,
        `Additional Requirements: ${requirements}`,
        `Extra Details: ${data.requirements || "-"}`
      ];
      const message = encodeURIComponent(lines.join("\n"));
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

      if (statusEl) {
        statusEl.textContent = "";
        statusEl.className = "form-status";
      }

      setTimeout(function () {
        quoteDialog.close();
        quoteForm.reset();

        if (successDialog) successDialog.showModal();

        setTimeout(function () {
          window.open(whatsappUrl, "_blank");
        }, 1400);
      }, 400);
    });
  }

});
