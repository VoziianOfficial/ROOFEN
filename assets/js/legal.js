// assets/js/legal.js

(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {
        initLegalToc();
    });

    function initLegalToc() {
        const tocLinks = Array.from(document.querySelectorAll(".legal-toc a[href^='#']"));
        const sections = Array.from(document.querySelectorAll(".legal-document section[id]"));

        if (!tocLinks.length || !sections.length) {
            return;
        }

        tocLinks.forEach(function (link) {
            link.addEventListener("click", function () {
                setActiveLink(tocLinks, link);
            });
        });

        const observer = new IntersectionObserver(
            function (entries) {
                let visibleEntry = null;

                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        visibleEntry = entry;
                    }
                });

                if (!visibleEntry) {
                    return;
                }

                const id = visibleEntry.target.getAttribute("id");

                tocLinks.forEach(function (link) {
                    const href = link.getAttribute("href");
                    link.classList.toggle("is-active", href === `#${id}`);
                });
            },
            {
                root: null,
                threshold: 0.2,
                rootMargin: "-24% 0px -58% 0px"
            }
        );

        sections.forEach(function (section) {
            observer.observe(section);
        });
    }

    function setActiveLink(links, activeLink) {
        links.forEach(function (link) {
            link.classList.remove("is-active");
        });

        activeLink.classList.add("is-active");
    }
})();