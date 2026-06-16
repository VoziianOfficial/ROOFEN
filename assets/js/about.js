// assets/js/about.js

(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {
        initAboutMarquee();
    });

    function initAboutMarquee() {
        const marquee = document.querySelector("[data-about-marquee]");

        if (!marquee) {
            return;
        }

        const pauseMarquee = function () {
            marquee.classList.add("is-paused");
        };

        const playMarquee = function () {
            marquee.classList.remove("is-paused");
        };

        marquee.addEventListener("mouseenter", pauseMarquee);
        marquee.addEventListener("mouseleave", playMarquee);

        marquee.addEventListener("focusin", pauseMarquee);
        marquee.addEventListener("focusout", playMarquee);

        marquee.addEventListener("touchstart", pauseMarquee, { passive: true });

        marquee.addEventListener(
            "touchend",
            function () {
                window.setTimeout(playMarquee, 900);
            },
            { passive: true }
        );
    }
})();