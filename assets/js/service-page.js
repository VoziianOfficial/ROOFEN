// assets/js/service-page.js

(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {
        initServiceMiniFlow();
        initServiceProblemGuide();
        initServiceSignsSwitcher();
        initServiceFaqAccordion();
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

    function initServiceFaqAccordion() {
        const accordions = document.querySelectorAll("[data-accordion]");

        accordions.forEach(function (accordion) {
            const items = Array.from(accordion.querySelectorAll("[data-accordion-item]"));

            items.forEach(function (item, index) {
                const button = item.querySelector("[data-accordion-button]");
                if (!button) return;

                const panelId = button.getAttribute("aria-controls");
                const panel = panelId ? document.getElementById(panelId) : item.querySelector(".faq-panel");
                if (!panel) return;

                const shouldBeOpen = button.getAttribute("aria-expanded") === "true" || index === 0;

                item.classList.toggle("is-open", shouldBeOpen);
                button.setAttribute("aria-expanded", shouldBeOpen ? "true" : "false");
                panel.hidden = !shouldBeOpen;

                button.addEventListener("click", function (event) {
                    event.preventDefault();
                    event.stopImmediatePropagation();

                    const isOpen = item.classList.contains("is-open");

                    items.forEach(function (currentItem) {
                        const currentButton = currentItem.querySelector("[data-accordion-button]");
                        if (!currentButton) return;

                        const currentPanelId = currentButton.getAttribute("aria-controls");
                        const currentPanel = currentPanelId
                            ? document.getElementById(currentPanelId)
                            : currentItem.querySelector(".faq-panel");

                        currentItem.classList.remove("is-open");
                        currentButton.setAttribute("aria-expanded", "false");

                        if (currentPanel) {
                            currentPanel.hidden = true;
                        }
                    });

                    if (!isOpen) {
                        item.classList.add("is-open");
                        button.setAttribute("aria-expanded", "true");
                        panel.hidden = false;
                    }
                }, true);
            });
        });
    }
    
})();