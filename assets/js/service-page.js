// assets/js/service-page.js

(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {
        initServiceMiniFlow();
        initServiceProblemGuide();
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
})();