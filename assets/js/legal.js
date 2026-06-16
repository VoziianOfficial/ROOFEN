// assets/js/legal.js

(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {
        initLegalToc();
        initLegalSectionHighlight();
    });

    function initLegalToc() {
        const toc = document.querySelector(".legal-toc");

        if (!toc) {
            return;
        }

        const tocLinks = Array.from(toc.querySelectorAll("a[href^='#']"));

        tocLinks.forEach(function (link) {
            link.addEventListener("click", function () {
                tocLinks.forEach(function (item) {
                    item.classList.remove("is-active");
                });

                link.classList.add("is-active");
            });
        });
    }

    function initLegalSectionHighlight() {
        const documentBlock = document.querySelector(".legal-document");
        const tocLinks = Array.from(document.querySelectorAll(".legal-toc a[href^='#']"));

        if (!documentBlock || !tocLinks.length) {
            return;
        }

        const sections = Array.from(documentBlock.querySelectorAll("section[id]"));

        if (!sections.length) {
            return;
        }

        const observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    const id = entry.target.getAttribute("id");

                    if (!id) {
                        return;
                    }

                    setActiveTocLink(tocLinks, id);
                });
            },
            {
                root: null,
                threshold: 0.28,
                rootMargin: "-18% 0px -62% 0px"
            }
        );

        sections.forEach(function (section) {
            observer.observe(section);
        });
    }

    function setActiveTocLink(links, id) {
        links.forEach(function (link) {
            const href = link.getAttribute("href");

            if (href === `#${id}`) {
                link.classList.add("is-active");
                scrollTocLinkIntoView(link);
                return;
            }

            link.classList.remove("is-active");
        });
    }

    function scrollTocLinkIntoView(link) {
        const tocNav = link.closest(".legal-toc nav");

        if (!tocNav) {
            return;
        }

        const isScrollable = tocNav.scrollWidth > tocNav.clientWidth;

        if (!isScrollable) {
            return;
        }

        link.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center"
        });
    }
})();