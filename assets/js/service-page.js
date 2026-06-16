// assets/js/service-page.js

(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {
        initServiceMiniFlow();
        initServiceProblemGuide();
        initServiceSignsSwitcher();
    });

    function initServiceMiniFlow() {
        const flows = document.querySelectorAll("[data-service-mini-flow]");

        flows.forEach(function (flow) {
            const items = Array.from(flow.querySelectorAll(".service-mini-flow__item"));

            items.forEach(function (item) {
                item.addEventListener("click", function () {
                    items.forEach(function (button) {
                        button.classList.remove("is-active");
                    });

                    item.classList.add("is-active");
                });
            });
        });
    }

    function initServiceProblemGuide() {
        const guides = document.querySelectorAll("[data-service-problem-guide]");

        guides.forEach(function (guide) {
            const rows = Array.from(guide.querySelectorAll(".service-problem-row"));

            rows.forEach(function (row) {
                row.addEventListener("click", function () {
                    rows.forEach(function (button) {
                        button.classList.remove("is-active");
                    });

                    row.classList.add("is-active");
                });
            });
        });
    }

    function initServiceSignsSwitcher() {
        const signs = document.querySelector("[data-service-signs]");
        const title = document.querySelector("[data-service-signs-title]");
        const text = document.querySelector("[data-service-signs-text]");
        const link = document.querySelector("[data-service-signs-link]");
        const content = document.querySelector(".service-signs__content");

        if (!signs || !title || !text || !link || !content) {
            return;
        }

        const cards = Array.from(signs.querySelectorAll(".service-sign-card"));

        cards.forEach(function (card) {
            card.addEventListener("click", function () {
                const newTitle = card.dataset.title;
                const newText = card.dataset.text;
                const newButton = card.dataset.button;

                if (!newTitle || !newText || !newButton) {
                    return;
                }

                cards.forEach(function (item) {
                    item.classList.remove("is-active");
                });

                card.classList.add("is-active");
                content.classList.add("is-changing");

                setTimeout(function () {
                    title.textContent = newTitle;
                    text.textContent = newText;

                    link.innerHTML = `
                    ${newButton}
                    <i data-lucide="arrow-up-right" aria-hidden="true"></i>
                `;

                    if (window.lucide) {
                        window.lucide.createIcons();
                    }

                    content.classList.remove("is-changing");
                }, 160);
            });
        });
    }
    
})();