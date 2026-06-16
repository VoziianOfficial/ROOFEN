// assets/js/home.js

(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {
        initHomeServiceSearch();
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
