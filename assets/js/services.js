// assets/js/services.js

(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {
        initServiceSelector();
        initProblemGuideRows();
    });

    function initServiceSelector() {
        const selector = document.querySelector("[data-services-selector]");

        if (!selector) {
            return;
        }

        const chips = Array.from(selector.querySelectorAll(".chip"));

        chips.forEach(function (chip) {
            chip.addEventListener("click", function () {
                chips.forEach(function (item) {
                    item.classList.remove("is-active");
                });

                chip.classList.add("is-active");

                const targetId = chip.getAttribute("href");

                if (!targetId || !targetId.startsWith("#")) {
                    return;
                }

                const targetCard = document.querySelector(targetId);

                if (!targetCard) {
                    return;
                }

                highlightServiceCard(targetCard);
            });
        });
    }

    function highlightServiceCard(card) {
        const highlightedCards = document.querySelectorAll(".services-card.is-highlighted");

        highlightedCards.forEach(function (item) {
            item.classList.remove("is-highlighted");
        });

        card.classList.add("is-highlighted");

        window.setTimeout(function () {
            card.classList.remove("is-highlighted");
        }, 1600);
    }

    function initProblemGuideRows() {
        const guide = document.querySelector("[data-services-guide]");

        if (!guide) {
            return;
        }

        const rows = Array.from(guide.querySelectorAll(".services-guide-row"));

        rows.forEach(function (row) {
            row.addEventListener("click", function () {
                rows.forEach(function (item) {
                    item.classList.remove("is-active");
                });

                row.classList.add("is-active");
            });
        });
    }
})();