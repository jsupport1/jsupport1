// JSupport1 site scripts (plain JS, no framework/build step required).

document.addEventListener("DOMContentLoaded", function () {
  // ---- Mobile nav toggle ----
  var menuButton = document.getElementById("mobile-menu-button");
  var mobileMenu = document.getElementById("mobile-menu");
  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", function () {
      var isHidden = mobileMenu.classList.contains("hidden");
      mobileMenu.classList.toggle("hidden");
      mobileMenu.classList.toggle("flex");
      menuButton.setAttribute("aria-expanded", isHidden ? "true" : "false");
    });

    // Close the mobile menu after a link inside it is tapped.
    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileMenu.classList.add("hidden");
        mobileMenu.classList.remove("flex");
        menuButton.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ---- Footer copyright year (was `{new Date().getFullYear()}` in React) ----
  var footerYear = document.getElementById("footer-year");
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

  // ---- "Last updated" dates on legal pages (was `{new Date().toLocaleDateString()}`) ----
  var privacyUpdated = document.getElementById("privacy-updated");
  if (privacyUpdated) {
    privacyUpdated.textContent = new Date().toLocaleDateString();
  }
  var termsUpdated = document.getElementById("terms-updated");
  if (termsUpdated) {
    termsUpdated.textContent = new Date().toLocaleDateString();
  }

  // ---- Contact form ----
  // The original Next.js form had no submit handler (no API route / backend),
  // so this just gives the static version a graceful client-side confirmation
  // instead of doing a native full-page GET submit. No data is sent anywhere;
  // wire up an endpoint (e.g. Formspree, a serverless function) here if needed.
  var contactForm = document.getElementById("contact-form");
  var contactMessage = document.getElementById("contact-form-message");
  if (contactForm && contactMessage) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      contactMessage.textContent =
        "Thanks! Your inquiry details are ready \u2014 connect this form to your email/CRM endpoint to send them automatically.";
      contactMessage.classList.remove("hidden");
      contactForm.reset();
    });
  }
});
