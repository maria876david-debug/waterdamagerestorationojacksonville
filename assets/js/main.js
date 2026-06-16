(function () {
  "use strict";

  // ======= Sticky
  window.onscroll = function () {
    const ud_header = document.querySelector(".ud-header");
    const logo = document.querySelectorAll(".header-logo");

    if (ud_header) {
      if (window.pageYOffset > 50) {
        ud_header.classList.add("sticky");
      } else {
        ud_header.classList.remove("sticky");
      }
    }

    if (logo.length && ud_header) {
      const logoElement = document.querySelector(".header-logo");
      if (logoElement) {
        if (ud_header.classList.contains("sticky")) {
          logoElement.src = "assets/images/logo/logo.svg";
        } else {
          logoElement.src = "assets/images/logo/logo-white.svg";
        }
      }
    }
  };

  function initNavbarToggle() {
    const navbarToggler = document.querySelector("#navbarToggler");
    const navbarCollapse = document.querySelector("#navbarCollapse");
    const navbarOverlay = document.querySelector("#navbarOverlay");
    const navbarClose = document.querySelector("#navbarClose");

    if (navbarToggler && navbarCollapse) {
      // Open sidebar
      navbarToggler.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        navbarToggler.classList.toggle("navbarTogglerActive");
        navbarCollapse.classList.remove("translate-x-full");
        if (navbarOverlay) {
          navbarOverlay.classList.remove("hidden");
        }
      });

      const closeSidebar = () => {
        navbarToggler.classList.remove("navbarTogglerActive");
        navbarCollapse.classList.add("translate-x-full");
        if (navbarOverlay) {
          navbarOverlay.classList.add("hidden");
        }
      };

      if (navbarClose) {
        navbarClose.addEventListener("click", closeSidebar);
      }

      if (navbarOverlay) {
        navbarOverlay.addEventListener("click", closeSidebar);
      }

      const mobileLinks = document.querySelectorAll(
        "#navbarCollapse a:not(.mobile-accordion-toggle)"
      );
      mobileLinks.forEach((link) => {
        link.addEventListener("click", closeSidebar);
      });

      const accordionToggles = document.querySelectorAll(
        ".mobile-accordion-toggle"
      );
      accordionToggles.forEach((toggle) => {
        toggle.addEventListener("click", (e) => {
          e.preventDefault();
          const targetId = toggle.getAttribute("data-target");
          const targetContent = document.getElementById(targetId);
          const icon = toggle.querySelector(".mobile-accordion-icon");

          if (targetContent) {
            targetContent.classList.toggle("hidden");
            if (icon) {
              icon.classList.toggle("rotate-180");
            }
          }
        });
      });
    }
  }

  // Global FAQ toggle function for inline onclick handlers
  window.toggleFAQ = function toggleFAQ(button, index) {
    const faqItem = button.parentElement;
    const answer = document.getElementById(`faq-answer-${index}`);
    const icon = button.querySelector("svg");
    const isOpen = faqItem.classList.contains("open");

    // Close all others
    document.querySelectorAll("#faq .group.open").forEach((item) => {
      if (item !== faqItem) {
        item.classList.remove("open");
        const otherAnswer = item.querySelector('[id^="faq-answer-"]');
        otherAnswer.style.maxHeight = "0";
        item.querySelector("svg").style.transform = "rotate(0deg)";
      }
    });

    // Toggle current
    if (isOpen) {
      faqItem.classList.remove("open");
      answer.style.maxHeight = "0";
      icon.style.transform = "rotate(0deg)";
    } else {
      faqItem.classList.add("open");
      answer.style.maxHeight = answer.scrollHeight + "px";
      icon.style.transform = "rotate(180deg)";
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      setTimeout(initNavbarToggle, 100);
    });
  } else {
    setTimeout(initNavbarToggle, 100);
  }

  if (typeof WOW === "function") {
    new WOW().init();
  }

  window.initNavbarToggle = initNavbarToggle;
})();
