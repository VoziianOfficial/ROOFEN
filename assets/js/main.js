
(function () {
    "use strict";

    const config = window.ROOFEN_CONFIG || {};

    const selectors = {
        header: "[data-header]",
        mobileMenu: "[data-mobile-menu]",
        mobileMenuOpen: "[data-mobile-menu-open]",
        mobileMenuClose: "[data-mobile-menu-close]",
        mobileMenuOverlay: "[data-mobile-menu-overlay]",
        dropdown: "[data-dropdown]",
        dropdownToggle: "[data-dropdown-toggle]",
        dropdownMenu: "[data-dropdown-menu]",
        accordion: "[data-accordion]",
        accordionButton: "[data-accordion-button]",
        cookieBanner: "[data-cookie-banner]",
        cookieAccept: "[data-cookie-accept]",
        cookieCancel: "[data-cookie-cancel]",
        mobileStickyCta: "[data-mobile-sticky-cta]",
        sectionRail: "[data-section-rail]",
        sectionRailLink: "[data-section-rail-link]"
    };

    const state = {
        dropdownCloseTimer: null,
        lastFocusedElement: null
    };

    document.addEventListener("DOMContentLoaded", function () {
        applyConfigEverywhere(); 

        injectConfigValues();
        injectServiceLists();
        setActiveNavigation();
        initStickyHeader();
        initMobileMenu();
        initDropdowns();
        initAccordions();
        initCookieBanner();
        initSmoothAnchors();
        initSectionRail();
        initExternalLinks();
        initLucideIcons();
    });

    function injectConfigValues() {
        const configElements = document.querySelectorAll("[data-config]");

        configElements.forEach(function (element) {
            const key = element.getAttribute("data-config");

            if (!key || typeof config[key] === "undefined") {
                return;
            }

            element.textContent = config[key];
        });

        const brandElements = document.querySelectorAll("[data-config-brand]");

        brandElements.forEach(function (element) {
            element.innerHTML = getBrandMarkup();
        });

        const phoneHrefElements = document.querySelectorAll('[data-config-href="phone"]');

        phoneHrefElements.forEach(function (element) {
            if (!config.phoneNumber) return;

            element.setAttribute("href", "tel:" + sanitizePhone(config.phoneNumber));

            if (element.hasAttribute("data-config-phone-text")) {
                element.textContent = config.phoneDisplayText || config.phoneNumber;
            }
        });

        const emailHrefElements = document.querySelectorAll('[data-config-href="email"]');

        emailHrefElements.forEach(function (element) {
            if (!config.email) return;

            element.setAttribute("href", "mailto:" + config.email);

            if (element.hasAttribute("data-config-email-text")) {
                element.textContent = config.email;
            }
        });

        const mapHrefElements = document.querySelectorAll('[data-config-href="map"]');

        mapHrefElements.forEach(function (element) {
            if (!config.mapUrl) return;

            element.setAttribute("href", config.mapUrl);
            element.setAttribute("target", "_blank");
            element.setAttribute("rel", "noopener noreferrer");
        });

        const currentYearElements = document.querySelectorAll("[data-current-year]");

        currentYearElements.forEach(function (element) {
            element.textContent = new Date().getFullYear();
        });
    }

    function injectServiceLists() {
        if (!Array.isArray(config.services)) {
            return;
        }

        const serviceListElements = document.querySelectorAll("[data-service-list]");

        serviceListElements.forEach(function (list) {
            const variant = list.getAttribute("data-service-list");

            list.innerHTML = "";

            config.services.forEach(function (service) {
                const item = document.createElement("li");
                const link = document.createElement("a");

                link.href = service.url;
                link.textContent = service.name;

                if (variant === "dropdown") {
                    link.className = "dropdown-service-link";
                    link.innerHTML = `
            <span class="dropdown-service-link__icon" aria-hidden="true">
              <i data-lucide="${service.icon}"></i>
            </span>
            <span class="dropdown-service-link__content">
              <span class="dropdown-service-link__name">${service.name}</span>
              <span class="dropdown-service-link__text">${service.shortName}</span>
            </span>
            <span class="dropdown-service-link__arrow" aria-hidden="true">
              <i data-lucide="arrow-up-right"></i>
            </span>
          `;
                }

                if (variant === "footer") {
                    link.className = "footer-link";
                }

                if (variant === "mobile") {
                    link.className = "mobile-menu__service-link";
                    link.innerHTML = `
            <span>${service.name}</span>
            <i data-lucide="arrow-up-right" aria-hidden="true"></i>
          `;
                }

                item.appendChild(link);
                list.appendChild(item);
            });
        });

        const serviceSelects = document.querySelectorAll("[data-service-select]");

        serviceSelects.forEach(function (select) {
            if (select.children.length > 1) {
                return;
            }

            const options = config.contactForm?.services || config.services.map(function (service) {
                return service.name;
            });

            options.forEach(function (serviceName) {
                const option = document.createElement("option");
                option.value = serviceName;
                option.textContent = serviceName;
                select.appendChild(option);
            });
        });

        const urgencySelects = document.querySelectorAll("[data-urgency-select]");

        urgencySelects.forEach(function (select) {
            if (select.children.length > 1) {
                return;
            }

            const options = config.contactForm?.urgency || ["Normal", "Soon", "Emergency", "Not sure"];

            options.forEach(function (urgencyName) {
                const option = document.createElement("option");
                option.value = urgencyName;
                option.textContent = urgencyName;
                select.appendChild(option);
            });
        });
    }

    function setActiveNavigation() {
        const currentPage = getCurrentPageName();
        const navLinks = document.querySelectorAll("[data-nav-link], .site-nav a, .mobile-menu a, .footer-link");

        navLinks.forEach(function (link) {
            const href = link.getAttribute("href");

            if (!href) return;

            const normalizedHref = href.split("#")[0];

            if (
                normalizedHref === currentPage ||
                (currentPage === "" && normalizedHref === "index.html") ||
                (currentPage === "index.html" && normalizedHref === "")
            ) {
                link.classList.add("is-active");
                link.setAttribute("aria-current", "page");
            }
        });
    }

    function initStickyHeader() {
        const header = document.querySelector(selectors.header);

        if (!header) {
            return;
        }

        const updateHeader = function () {
            if (window.scrollY > 8) {
                header.classList.add("is-scrolled");
            } else {
                header.classList.remove("is-scrolled");
            }
        };

        updateHeader();

        window.addEventListener("scroll", updateHeader, { passive: true });
    }

    function initMobileMenu() {
        const menu = document.querySelector(selectors.mobileMenu);
        const openButtons = document.querySelectorAll(selectors.mobileMenuOpen);
        const closeButtons = document.querySelectorAll(selectors.mobileMenuClose);
        const overlay = document.querySelector(selectors.mobileMenuOverlay);

        if (!menu || !openButtons.length) {
            return;
        }

        openButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                openMobileMenu(menu, button);
            });
        });

        closeButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                closeMobileMenu(menu);
            });
        });

        if (overlay) {
            overlay.addEventListener("click", function () {
                closeMobileMenu(menu);
            });
        }

        menu.addEventListener("click", function (event) {
            const link = event.target.closest("a");

            if (link) {
                closeMobileMenu(menu);
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && menu.classList.contains("is-open")) {
                closeMobileMenu(menu);
            }

            if (event.key === "Tab" && menu.classList.contains("is-open")) {
                trapFocus(event, menu);
            }
        });
    }

    function openMobileMenu(menu, trigger) {
        state.lastFocusedElement = trigger || document.activeElement;

        menu.classList.add("is-open");
        menu.setAttribute("aria-hidden", "false");

        document.documentElement.classList.add("menu-open");
        document.body.classList.add("menu-open");

        const openButtons = document.querySelectorAll(selectors.mobileMenuOpen);

        openButtons.forEach(function (button) {
            button.setAttribute("aria-expanded", "true");
        });

        const firstFocusable = getFocusableElements(menu)[0];

        if (firstFocusable) {
            firstFocusable.focus();
        }
    }

    function closeMobileMenu(menu) {
        menu.classList.remove("is-open");
        menu.setAttribute("aria-hidden", "true");

        document.documentElement.classList.remove("menu-open");
        document.body.classList.remove("menu-open");

        const openButtons = document.querySelectorAll(selectors.mobileMenuOpen);

        openButtons.forEach(function (button) {
            button.setAttribute("aria-expanded", "false");
        });

        if (state.lastFocusedElement && typeof state.lastFocusedElement.focus === "function") {
            state.lastFocusedElement.focus();
        }
    }

    function initDropdowns() {
        const dropdowns = document.querySelectorAll(selectors.dropdown);

        dropdowns.forEach(function (dropdown) {
            const toggle = dropdown.querySelector(selectors.dropdownToggle);
            const menu = dropdown.querySelector(selectors.dropdownMenu);

            if (!toggle || !menu) {
                return;
            }

            toggle.setAttribute("aria-expanded", "false");

            dropdown.addEventListener("mouseenter", function () {
                openDropdown(dropdown, toggle);
            });

            dropdown.addEventListener("mouseleave", function () {
                delayCloseDropdown(dropdown, toggle);
            });

            dropdown.addEventListener("focusin", function () {
                openDropdown(dropdown, toggle);
            });

            dropdown.addEventListener("focusout", function (event) {
                if (!dropdown.contains(event.relatedTarget)) {
                    delayCloseDropdown(dropdown, toggle);
                }
            });

            toggle.addEventListener("click", function (event) {
                const href = toggle.getAttribute("href");

                if (!href || href === "#") {
                    event.preventDefault();
                }

                if (dropdown.classList.contains("is-open")) {
                    closeDropdown(dropdown, toggle);
                } else {
                    openDropdown(dropdown, toggle);
                }
            });

            toggle.addEventListener("keydown", function (event) {
                if (event.key === "ArrowDown") {
                    event.preventDefault();
                    openDropdown(dropdown, toggle);

                    const firstLink = menu.querySelector("a");

                    if (firstLink) {
                        firstLink.focus();
                    }
                }
            });

            menu.addEventListener("keydown", function (event) {
                const links = Array.from(menu.querySelectorAll("a"));
                const currentIndex = links.indexOf(document.activeElement);

                if (event.key === "Escape") {
                    closeDropdown(dropdown, toggle);
                    toggle.focus();
                }

                if (event.key === "ArrowDown") {
                    event.preventDefault();
                    const nextLink = links[currentIndex + 1] || links[0];
                    nextLink.focus();
                }

                if (event.key === "ArrowUp") {
                    event.preventDefault();
                    const previousLink = links[currentIndex - 1] || links[links.length - 1];
                    previousLink.focus();
                }
            });
        });

        document.addEventListener("click", function (event) {
            dropdowns.forEach(function (dropdown) {
                if (!dropdown.contains(event.target)) {
                    const toggle = dropdown.querySelector(selectors.dropdownToggle);
                    closeDropdown(dropdown, toggle);
                }
            });
        });
    }

    function openDropdown(dropdown, toggle) {
        clearTimeout(state.dropdownCloseTimer);

        dropdown.classList.add("is-open");

        if (toggle) {
            toggle.setAttribute("aria-expanded", "true");
        }
    }

    function closeDropdown(dropdown, toggle) {
        dropdown.classList.remove("is-open");

        if (toggle) {
            toggle.setAttribute("aria-expanded", "false");
        }
    }

    function delayCloseDropdown(dropdown, toggle) {
        clearTimeout(state.dropdownCloseTimer);

        state.dropdownCloseTimer = window.setTimeout(function () {
            closeDropdown(dropdown, toggle);
        }, 220);
    }

    function initAccordions() {
        const accordions = document.querySelectorAll(selectors.accordion);

        accordions.forEach(function (accordion) {
            const buttons = accordion.querySelectorAll(selectors.accordionButton);
            const allowMultiple = accordion.hasAttribute("data-accordion-multiple");

            buttons.forEach(function (button) {
                const panelId = button.getAttribute("aria-controls");
                const panel = panelId ? document.getElementById(panelId) : null;

                if (!panel) {
                    return;
                }

                const isOpen = button.getAttribute("aria-expanded") === "true";

                setAccordionState(button, panel, isOpen);

                button.addEventListener("click", function () {
                    const currentlyOpen = button.getAttribute("aria-expanded") === "true";

                    if (!allowMultiple) {
                        buttons.forEach(function (otherButton) {
                            const otherPanelId = otherButton.getAttribute("aria-controls");
                            const otherPanel = otherPanelId ? document.getElementById(otherPanelId) : null;

                            if (otherButton !== button && otherPanel) {
                                setAccordionState(otherButton, otherPanel, false);
                            }
                        });
                    }

                    setAccordionState(button, panel, !currentlyOpen);
                });
            });
        });
    }

    function setAccordionState(button, panel, isOpen) {
        button.setAttribute("aria-expanded", String(isOpen));
        panel.hidden = !isOpen;

        const item = button.closest("[data-accordion-item]");

        if (item) {
            item.classList.toggle("is-open", isOpen);
        }
    }

    function initCookieBanner() {
        const banner = document.querySelector(selectors.cookieBanner);
        const acceptButton = document.querySelector(selectors.cookieAccept);
        const cancelButton = document.querySelector(selectors.cookieCancel);
        const stickyCta = document.querySelector(selectors.mobileStickyCta);

        if (!banner) {
            return;
        }

        const savedChoice = localStorage.getItem("roofenCookieConsent");

        if (savedChoice) {
            banner.hidden = true;
            document.body.classList.remove("cookie-visible");

            if (stickyCta) {
                stickyCta.classList.remove("is-cookie-visible");
            }

            return;
        }

        banner.hidden = false;
        document.body.classList.add("cookie-visible");

        if (stickyCta) {
            stickyCta.classList.add("is-cookie-visible");
        }

        const saveChoice = function (choice) {
            localStorage.setItem("roofenCookieConsent", choice);
            banner.classList.add("is-hiding");

            window.setTimeout(function () {
                banner.hidden = true;
                banner.classList.remove("is-hiding");
                document.body.classList.remove("cookie-visible");

                if (stickyCta) {
                    stickyCta.classList.remove("is-cookie-visible");
                }
            }, 240);
        };

        if (acceptButton) {
            acceptButton.addEventListener("click", function () {
                saveChoice("accepted");
            });
        }

        if (cancelButton) {
            cancelButton.addEventListener("click", function () {
                saveChoice("cancelled");
            });
        }
    }

    function initSmoothAnchors() {
        const anchorLinks = document.querySelectorAll('a[href*="#"]:not([href="#"])');

        anchorLinks.forEach(function (link) {
            link.addEventListener("click", function (event) {
                const href = link.getAttribute("href");

                if (!href) {
                    return;
                }

                const currentUrl = window.location.pathname.split("/").pop() || "index.html";
                const linkUrl = href.split("#")[0];
                const hash = href.includes("#") ? "#" + href.split("#")[1] : "";

                const isSamePage =
                    !linkUrl ||
                    linkUrl === currentUrl ||
                    (currentUrl === "index.html" && linkUrl === "");

                if (!isSamePage || !hash) {
                    return;
                }

                const target = document.querySelector(hash);

                if (!target) {
                    return;
                }

                event.preventDefault();

                const header = document.querySelector(selectors.header);
                const headerOffset = header ? header.offsetHeight + 18 : 18;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerOffset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: prefersReducedMotion() ? "auto" : "smooth"
                });

                history.pushState(null, "", hash);
            });
        });
    }

    function initSectionRail() {
        const rail = document.querySelector(selectors.sectionRail);

        if (!rail) {
            return;
        }

        const links = Array.from(document.querySelectorAll(selectors.sectionRailLink));

        if (!links.length) {
            return;
        }

        const sections = links
            .map(function (link) {
                const id = link.getAttribute("href");

                if (!id || !id.startsWith("#")) {
                    return null;
                }

                const section = document.querySelector(id);

                if (!section) {
                    return null;
                }

                return {
                    link: link,
                    section: section
                };
            })
            .filter(Boolean);

        if (!sections.length) {
            return;
        }

        const setActiveLink = function (activeLink) {
            links.forEach(function (link) {
                const isActive = link === activeLink;

                link.classList.toggle("is-active", isActive);

                if (isActive) {
                    link.setAttribute("aria-current", "page");
                } else {
                    link.removeAttribute("aria-current");
                }
            });
        };

        const activeFromHash = window.location.hash
            ? sections.find(function (item) {
                return "#" + item.section.id === window.location.hash;
            })
            : null;

        if (activeFromHash) {
            setActiveLink(activeFromHash.link);
        } else {
            setActiveLink(sections[0].link);
        }

        const observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    const activeItem = sections.find(function (item) {
                        return item.section === entry.target;
                    });

                    if (!activeItem) {
                        return;
                    }

                    setActiveLink(activeItem.link);
                });
            },
            {
                root: null,
                threshold: 0.35,
                rootMargin: "-18% 0px -55% 0px"
            }
        );

        sections.forEach(function (item) {
            observer.observe(item.section);
        });
    }

    function initExternalLinks() {
        const links = document.querySelectorAll('a[target="_blank"]');

        links.forEach(function (link) {
            const rel = link.getAttribute("rel") || "";

            if (!rel.includes("noopener")) {
                link.setAttribute("rel", (rel + " noopener noreferrer").trim());
            }
        });
    }

    function initLucideIcons() {
        if (window.lucide && typeof window.lucide.createIcons === "function") {
            window.lucide.createIcons({
                attrs: {
                    "aria-hidden": "true"
                }
            });
        }
    }

    function getBrandMarkup() {
        const companyName = config.companyName || "Roofen";
        const accentPart = config.brandAccentPart || "en";

        if (!companyName.endsWith(accentPart)) {
            return escapeHtml(companyName);
        }

        const basePart = companyName.slice(0, companyName.length - accentPart.length);

        return `${escapeHtml(basePart)}<span class="brand-accent">${escapeHtml(accentPart)}</span>`;
    }

    function getCurrentPageName() {
        const page = window.location.pathname.split("/").pop();

        return page || "index.html";
    }

    function sanitizePhone(phone) {
        return String(phone).replace(/[^\d+]/g, "");
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function prefersReducedMotion() {
        return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    function getFocusableElements(container) {
        return Array.from(
            container.querySelectorAll(
                'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )
        ).filter(function (element) {
            return element.offsetParent !== null || element === document.activeElement;
        });
    }

    function trapFocus(event, container) {
        const focusableElements = getFocusableElements(container);

        if (!focusableElements.length) {
            event.preventDefault();
            return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
        }

        if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
        }
    }

    function applyConfigEverywhere() {
        const config = window.ROOFEN_CONFIG || {};

        const original = {
            companyName: "Roofen",
            phoneNumber: "+1 737 555 0198",
            phoneCompact: "+17375550198",
            phoneDisplayText: "(737) 555-0198",
            email: "support@roofenquotes.com",
            address: "11801 Domain Blvd, Austin, TX 78758, USA",
            mapUrl: "https://www.google.com/maps/search/?api=1&query=11801+Domain+Blvd,+Austin,+TX+78758,+USA",
            serviceArea: "United States roofing contractor matching network",
            companyId: "RFN-US-48291"
        };

        const next = {
            companyName: config.companyName || original.companyName,
            phoneNumber: config.phoneNumber || original.phoneNumber,
            phoneCompact: sanitizePhone(config.phoneNumber || original.phoneNumber),
            phoneDisplayText: config.phoneDisplayText || config.phoneNumber || original.phoneDisplayText,
            email: config.email || original.email,
            address: config.address || original.address,
            mapUrl: config.mapUrl || original.mapUrl,
            serviceArea: config.serviceArea || original.serviceArea,
            companyId: config.companyId || original.companyId
        };

        replaceTextEverywhere(original.companyName, next.companyName);
        replaceTextEverywhere(original.phoneNumber, next.phoneNumber);
        replaceTextEverywhere(original.phoneDisplayText, next.phoneDisplayText);
        replaceTextEverywhere(original.email, next.email);
        replaceTextEverywhere(original.address, next.address);
        replaceTextEverywhere(original.serviceArea, next.serviceArea);
        replaceTextEverywhere(original.companyId, next.companyId);

        replaceAttributesEverywhere(original.companyName, next.companyName);
        replaceAttributesEverywhere(original.phoneNumber, next.phoneNumber);
        replaceAttributesEverywhere(original.phoneCompact, next.phoneCompact);
        replaceAttributesEverywhere(original.phoneDisplayText, next.phoneDisplayText);
        replaceAttributesEverywhere(original.email, next.email);
        replaceAttributesEverywhere(original.address, next.address);
        replaceAttributesEverywhere(original.mapUrl, next.mapUrl);
        replaceAttributesEverywhere(original.serviceArea, next.serviceArea);
        replaceAttributesEverywhere(original.companyId, next.companyId);

        updateAllPhones(next);
        updateAllEmails(next);
        updateAllMaps(next);
        updateAllBrands(next);

        if (Array.isArray(config.services)) {
            updateServiceNamesEverywhere(config.services);
        }

        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    function replaceTextEverywhere(from, to) {
        if (!from || !to || from === to) return;

        const ignoredTags = ["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "SELECT"];

        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function (node) {
                    const parent = node.parentElement;

                    if (!parent || ignoredTags.includes(parent.tagName)) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    if (!node.nodeValue || !node.nodeValue.includes(from)) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        const nodes = [];

        while (walker.nextNode()) {
            nodes.push(walker.currentNode);
        }

        nodes.forEach(function (node) {
            node.nodeValue = node.nodeValue.split(from).join(to);
        });
    }

    function replaceAttributesEverywhere(from, to) {
        if (!from || !to || from === to) return;

        const elements = document.querySelectorAll("*");

        elements.forEach(function (element) {
            Array.from(element.attributes).forEach(function (attr) {
                if (!attr.value || !attr.value.includes(from)) return;

                element.setAttribute(attr.name, attr.value.split(from).join(to));
            });
        });
    }

    function updateAllPhones(data) {
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');

        phoneLinks.forEach(function (link) {
            link.setAttribute("href", "tel:" + data.phoneCompact);

            const text = link.textContent.trim();

            if (
                text.includes("737") ||
                text.includes("555") ||
                text.includes("+1") ||
                /^\(?\d/.test(text)
            ) {
                link.textContent = data.phoneDisplayText;
            }

            if (link.getAttribute("aria-label")) {
                link.setAttribute("aria-label", "Call " + data.companyName);
            }
        });
    }

    function updateAllEmails(data) {
        const emailLinks = document.querySelectorAll('a[href^="mailto:"]');

        emailLinks.forEach(function (link) {
            link.setAttribute("href", "mailto:" + data.email);

            if (link.textContent.includes("@")) {
                link.textContent = data.email;
            }

            if (link.getAttribute("aria-label")) {
                link.setAttribute("aria-label", "Email " + data.companyName);
            }
        });
    }

    function updateAllMaps(data) {
        const mapLinks = document.querySelectorAll('a[href*="google.com/maps"], a[href="#"][data-config-href="map"]');

        mapLinks.forEach(function (link) {
            link.setAttribute("href", data.mapUrl);
            link.setAttribute("target", "_blank");
            link.setAttribute("rel", "noopener noreferrer");
        });
    }

    function updateAllBrands(data) {
        const brandElements = document.querySelectorAll(".site-brand__text, [data-config-brand]");

        brandElements.forEach(function (brand) {
            brand.innerHTML = createBrandHTML(data.companyName, window.ROOFEN_CONFIG?.brandAccentPart);
        });

        const brandLinks = document.querySelectorAll(".site-brand");

        brandLinks.forEach(function (link) {
            link.setAttribute("aria-label", data.companyName + " home");
        });
    }

    function updateServiceNamesEverywhere(services) {
        const originalServices = [
            "Roof Repair",
            "Roof Replacement",
            "Emergency Roof Repair",
            "Storm Damage Roof Repair",
            "Roof Inspection",
            "Gutter Installation & Repair"
        ];

        services.forEach(function (service, index) {
            const oldName = originalServices[index];

            if (!oldName || !service.name) return;

            replaceTextEverywhere(oldName, service.name);
            replaceAttributesEverywhere(oldName, service.name);
        });
    }

    function createBrandHTML(companyName, accentPart) {
        if (!companyName) return "";

        if (!accentPart || !companyName.endsWith(accentPart)) {
            return escapeHTML(companyName);
        }

        const mainPart = companyName.slice(0, -accentPart.length);

        return (
            escapeHTML(mainPart) +
            '<span class="brand-accent">' +
            escapeHTML(accentPart) +
            "</span>"
        );
    }

    function sanitizePhone(phone) {
        return String(phone || "").replace(/[^\d+]/g, "");
    }

    function escapeHTML(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
})();
