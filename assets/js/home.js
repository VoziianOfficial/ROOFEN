// assets/js/home.js

(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {
        initHomeServiceSearch();
        initHomeAboutSwitcher();
        initHomeFaqAccordion();
    });

    function initHomeServiceSearch() {
        const searchInput = document.querySelector("[data-home-service-search]");
        const resultsWrap = document.querySelector("[data-home-service-results]");
        const config = window.ROOFEN_CONFIG || {};
        const services = Array.isArray(config.services) ? config.services : [];

        if (!searchInput || !resultsWrap || !services.length) {
            return;
        }

        const serviceEntries = services.map(function (service) {
            const searchTerms = [
                service.name,
                service.shortName,
                service.description,
                service.url
            ]
                .filter(Boolean)
                .join(" ");

            return {
                name: service.name,
                shortName: service.shortName || "",
                url: service.url,
                searchTerms: normalizeText(searchTerms),
                tokens: tokenizeText(searchTerms)
            };
        });

        searchInput.addEventListener("input", function () {
            renderServiceResults(searchInput.value);
        });

        searchInput.addEventListener("keydown", function (event) {
            if (event.key !== "Enter") {
                return;
            }

            const normalizedQuery = normalizeText(searchInput.value);

            if (!normalizedQuery) {
                return;
            }

            const firstVisibleLink = serviceEntries.find(function (service) {
                return matchesService(service, normalizedQuery);
            });

            if (firstVisibleLink) {
                event.preventDefault();
                window.location.href = firstVisibleLink.url;
            }
        });

        renderServiceResults(searchInput.value);

        function renderServiceResults(query) {
            const normalizedQuery = normalizeText(query);

            resultsWrap.innerHTML = "";

            if (!normalizedQuery) {
                resultsWrap.hidden = true;
                resultsWrap.classList.remove("has-no-results");
                return;
            }

            const matches = serviceEntries.filter(function (service) {
                return matchesService(service, normalizedQuery);
            });

            if (!matches.length) {
                resultsWrap.hidden = false;
                resultsWrap.classList.add("has-no-results");
                showNoResultsMessage(resultsWrap);
                return;
            }

            const fragment = document.createDocumentFragment();

            matches.slice(0, 6).forEach(function (service) {
                const link = document.createElement("a");
                const name = document.createElement("span");
                const meta = document.createElement("span");

                link.href = service.url;
                link.className = "home-search__result";
                link.setAttribute("aria-label", service.name);

                name.className = "home-search__result-name";
                name.textContent = service.name;

                meta.className = "home-search__result-meta";
                meta.textContent = service.shortName || "Roofing service";

                link.appendChild(name);
                link.appendChild(meta);
                fragment.appendChild(link);
            });

            resultsWrap.hidden = false;
            resultsWrap.classList.remove("has-no-results");
            resultsWrap.appendChild(fragment);
        }
    }

    function matchesService(service, normalizedQuery) {
        if (!normalizedQuery) {
            return false;
        }

        const queryTokens = tokenizeText(normalizedQuery);

        if (!queryTokens.length) {
            return false;
        }

        return queryTokens.every(function (queryToken) {
            return service.tokens.some(function (serviceToken) {
                return serviceToken.startsWith(queryToken);
            });
        });
    }

    function showNoResultsMessage(container) {
        const message = document.createElement("span");
        message.className = "home-search__no-results";
        message.setAttribute("data-no-results", "");
        message.textContent = "No services match this search.";

        container.appendChild(message);
    }

    function normalizeText(value) {
        return String(value)
            .toLowerCase()
            .trim()
            .replace(/\s+/g, " ");
    }

    function tokenizeText(value) {
        return normalizeText(value)
            .split(" ")
            .map(function (token) {
                return token.trim();
            })
            .filter(Boolean);
    }
})();


function initHomeAboutSwitcher() {
    const section = document.querySelector(".home-about");

    if (!section) {
        return;
    }

    const kicker = section.querySelector("[data-about-kicker]");
    const title = section.querySelector("[data-about-title]");
    const mainText = section.querySelector("[data-about-text-main]");
    const noteText = section.querySelector("[data-about-text-note]");
    const steps = Array.from(section.querySelectorAll("[data-about-step]"));

    if (!kicker || !title || !mainText || !noteText || !steps.length) {
        return;
    }

    const content = {
        request: {
            kicker: "Aggregator platform",
            title: "A simpler way to start your roofing request.",
            main:
                "Start by sharing the roofing issue you want help with — repair, replacement, inspection, storm damage, emergency work, or gutter-related support.",
            note:
                "<strong>Roofen keeps the first step simple.</strong> You describe the project, and the platform helps organize your request before connecting you with independent local providers."
        },

        local: {
            kicker: "Local provider matching",
            title: "Your request is matched around area and type.",
            main:
                "Roofing needs can vary by location, roof material, urgency, and project size. Roofen helps route your request toward relevant local roofing professionals.",
            note:
                "<strong>Roofen does not perform roofing work.</strong> Contractors and service providers are independent, and homeowners should verify licensing and insurance before hiring."
        },

        quotes: {
            kicker: "Quote comparison",
            title: "Compare roofing options without messy searching.",
            main:
                "Instead of contacting random companies one by one, you can review available options from independent local professionals in a more organized way.",
            note:
                "<strong>The goal is clarity.</strong> Roofen helps homeowners compare possible roofing solutions, pricing conversations, timelines, and provider fit."
        },

        contractor: {
            kicker: "Homeowner choice",
            title: "You stay in control of who you hire.",
            main:
                "After reviewing available roofing options, you choose the contractor that feels right for your roof, your timeline, and your budget.",
            note:
                "<strong>You make the final decision.</strong> Roofen helps with connection and comparison, but the hiring choice always belongs to the homeowner."
        }
    };

    function updateAboutContent(key) {
        const selectedContent = content[key];

        if (!selectedContent) {
            return;
        }

        section.classList.add("is-changing");

        window.setTimeout(function () {
            kicker.textContent = selectedContent.kicker;
            title.textContent = selectedContent.title;
            mainText.textContent = selectedContent.main;
            noteText.innerHTML = selectedContent.note;

            section.classList.remove("is-changing");
        }, 130);

        steps.forEach(function (step) {
            const isActive = step.dataset.aboutStep === key;

            step.classList.toggle("is-active", isActive);
            step.setAttribute("aria-pressed", String(isActive));
        });
    }

    steps.forEach(function (step) {
        step.addEventListener("click", function () {
            updateAboutContent(step.dataset.aboutStep);
        });

        step.addEventListener("keydown", function (event) {
            if (event.key !== "Enter" && event.key !== " ") {
                return;
            }

            event.preventDefault();
            updateAboutContent(step.dataset.aboutStep);
        });
    });
}

function initHomeFaqAccordion() {
    const accordion = document.querySelector(".home-faq [data-accordion]");

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
        parts.panel.hidden = true;
    }

    function openItem(item) {
        const parts = getParts(item);

        if (!parts.button || !parts.panel) {
            return;
        }

        item.classList.add("is-open");
        parts.button.setAttribute("aria-expanded", "true");
        parts.panel.hidden = false;
    }

    items.forEach(function (item, index) {
        if (index === 0) {
            openItem(item);
        } else {
            closeItem(item);
        }
    });

    accordion.addEventListener(
        "click",
        function (event) {
            const button = event.target.closest("[data-accordion-button]");

            if (!button || !accordion.contains(button)) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            const currentItem = button.closest("[data-accordion-item]");
            const isOpen = button.getAttribute("aria-expanded") === "true";

            items.forEach(closeItem);

            if (!isOpen && currentItem) {
                openItem(currentItem);
            }
        },
        true
    );
}