// assets/js/services.js

(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {
        initServicesCleanIconMarquee();
        initServiceSelector();
        initProblemGuideRows();
        initServicesFaqAccordion();
    });

    window.addEventListener("resize", debounce(function () {
        rebuildServicesCleanIconMarquee();
    }, 180));

    function initServiceSelector() {
        const selector = document.querySelector("[data-services-selector]");

        if (!selector) {
            return;
        }

        selector.addEventListener("click", function (event) {
            const chip = event.target.closest(".chip");

            if (!chip || !selector.contains(chip)) {
                return;
            }

            const targetId = chip.getAttribute("href");

            selector.querySelectorAll(".chip").forEach(function (item) {
                item.classList.remove("is-active");
            });

            selector.querySelectorAll('.chip[href="' + targetId + '"]').forEach(function (item) {
                item.classList.add("is-active");
            });

            if (!targetId || !targetId.startsWith("#")) {
                return;
            }

            const targetCard = document.querySelector(targetId);

            if (!targetCard) {
                return;
            }

            highlightServiceCard(targetCard);
        });
    }

    function initServicesCleanIconMarquee() {
        const selector = document.querySelector("[data-services-selector]");

        if (!selector) {
            return;
        }

        buildServicesCleanIconMarquee(selector);
    }

    function rebuildServicesCleanIconMarquee() {
        const selector = document.querySelector("[data-services-selector]");

        if (!selector) {
            return;
        }

        buildServicesCleanIconMarquee(selector);
    }

    function buildServicesCleanIconMarquee(selector) {
        selector.querySelectorAll("[data-marquee-clone='true']").forEach(function (clone) {
            clone.remove();
        });

        selector.style.removeProperty("--services-marquee-distance");

        const originalChips = Array.from(
            selector.querySelectorAll(".chip:not([data-marquee-clone='true'])")
        );

        if (!originalChips.length) {
            return;
        }

        function cloneSet() {
            originalChips.forEach(function (chip) {
                const clone = chip.cloneNode(true);

                clone.dataset.marqueeClone = "true";
                clone.setAttribute("aria-hidden", "true");
                clone.setAttribute("tabindex", "-1");

                selector.appendChild(clone);
            });
        }

        cloneSet();

        const firstOriginal = originalChips[0];
        const firstClone = selector.querySelector("[data-marquee-clone='true']");

        if (firstOriginal && firstClone) {
            const distance = firstClone.offsetLeft - firstOriginal.offsetLeft;
            selector.style.setProperty("--services-marquee-distance", distance + "px");
        }

        while (selector.scrollWidth < window.innerWidth * 3) {
            cloneSet();
        }

        if (window.lucide) {
            window.lucide.createIcons();
        }
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

    function initServicesFaqAccordion() {
        const accordion = document.querySelector(".services-faq [data-accordion]");

        if (!accordion) {
            return;
        }

        const items = Array.from(accordion.querySelectorAll("[data-accordion-item]"));

        if (!items.length) {
            return;
        }

        function getParts(item) {
            return {
                button: item.querySelector("[data-accordion-button]"),
                panel: item.querySelector(".faq-panel")
            };
        }

        function closeItem(item) {
            const parts = getParts(item);

            if (!parts.button || !parts.panel) {
                return;
            }

            item.classList.remove("is-open");
            parts.button.setAttribute("aria-expanded", "false");
            parts.panel.setAttribute("aria-hidden", "true");
            parts.panel.setAttribute("hidden", "");
        }

        function openItem(item) {
            const parts = getParts(item);

            if (!parts.button || !parts.panel) {
                return;
            }

            item.classList.add("is-open");
            parts.button.setAttribute("aria-expanded", "true");
            parts.panel.setAttribute("aria-hidden", "false");
            parts.panel.removeAttribute("hidden");
        }

        items.forEach(function (item) {
            const parts = getParts(item);

            if (parts.button && parts.button.getAttribute("aria-expanded") === "true") {
                openItem(item);
            } else {
                closeItem(item);
            }
        });

        accordion.addEventListener("click", function (event) {
            const button = event.target.closest("[data-accordion-button]");

            if (!button || !accordion.contains(button)) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            const currentItem = button.closest("[data-accordion-item]");
            const isOpen = currentItem.classList.contains("is-open");

            items.forEach(closeItem);

            if (!isOpen) {
                openItem(currentItem);
            }
        }, true);
    }

    function debounce(callback, delay) {
        let timeoutId;

        return function () {
            window.clearTimeout(timeoutId);

            timeoutId = window.setTimeout(function () {
                callback();
            }, delay);
        };
    }
})();


