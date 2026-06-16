// assets/js/contact.js

(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {
        injectContactConsentText();
        initContactForm();
        initRoofenContactAccordion();
    });

    function injectContactConsentText() {
        const config = window.ROOFEN_CONFIG || {};
        const consentText = config.contactForm?.consentText;
        const consentElement = document.querySelector('[data-config="contactConsentText"]');

        if (!consentElement || !consentText) {
            return;
        }

        consentElement.textContent = consentText;
    }

    function initContactForm() {
        const form = document.querySelector("[data-contact-form]");
        const message = document.querySelector("[data-contact-form-message]");

        if (!form || !message) {
            return;
        }

        form.addEventListener("submit", function (event) {
            event.preventDefault();

            clearMessage(message);
            clearFieldStates(form);

            const validation = validateForm(form);

            if (!validation.isValid) {
                showMessage(message, validation.message, "error");
                focusFirstInvalidField(form);
                return;
            }

            showMessage(
                message,
                "Thank you. Your roofing quote request has been prepared. A real backend can be connected later to send this form.",
                "success"
            );

            form.reset();
        });

        const fields = form.querySelectorAll("input, select, textarea");

        fields.forEach(function (field) {
            field.addEventListener("input", function () {
                field.classList.remove("is-invalid");
                field.classList.remove("is-valid");

                if (field.checkValidity()) {
                    field.classList.add("is-valid");
                }
            });

            field.addEventListener("blur", function () {
                if (!field.checkValidity()) {
                    field.classList.add("is-invalid");
                    return;
                }

                field.classList.add("is-valid");
            });
        });
    }

    function validateForm(form) {
        const requiredFields = Array.from(
            form.querySelectorAll("input[required], select[required], textarea[required]")
        );

        for (const field of requiredFields) {
            if (!field.checkValidity()) {
                field.classList.add("is-invalid");

                return {
                    isValid: false,
                    message: getErrorMessage(field)
                };
            }

            field.classList.add("is-valid");
        }

        return {
            isValid: true,
            message: ""
        };
    }

    function getErrorMessage(field) {
        const label = getFieldLabel(field);

        if (field.type === "checkbox") {
            return "Please confirm the consent checkbox before submitting your request.";
        }

        if (field.validity.valueMissing) {
            return `${label} is required.`;
        }

        if (field.validity.typeMismatch && field.type === "email") {
            return "Please enter a valid email address.";
        }

        if (field.validity.typeMismatch && field.type === "tel") {
            return "Please enter a valid phone number.";
        }

        return `Please check ${label.toLowerCase()} and try again.`;
    }

    function getFieldLabel(field) {
        const id = field.getAttribute("id");

        if (!id) {
            return "This field";
        }

        const label = document.querySelector(`label[for="${id}"]`);

        if (!label) {
            return "This field";
        }

        return label.textContent.trim();
    }

    function focusFirstInvalidField(form) {
        const firstInvalidField = form.querySelector(".is-invalid");

        if (firstInvalidField && typeof firstInvalidField.focus === "function") {
            firstInvalidField.focus();
        }
    }

    function showMessage(element, text, type) {
        element.textContent = text;
        element.classList.remove("is-error", "is-success");

        if (type === "error") {
            element.classList.add("is-error");
        }

        if (type === "success") {
            element.classList.add("is-success");
        }
    }

    function clearMessage(element) {
        element.textContent = "";
        element.classList.remove("is-error", "is-success");
    }

    function clearFieldStates(form) {
        const fields = form.querySelectorAll(".is-invalid, .is-valid");

        fields.forEach(function (field) {
            field.classList.remove("is-invalid", "is-valid");
        });
    }


    function initRoofenContactAccordion() {
        const accordion = document.querySelector("[data-roofen-contact-accordion]");

        if (!accordion) {
            return;
        }

        const items = Array.from(accordion.querySelectorAll(".roofen-contact-accordion__item"));

        items.forEach(function (item) {
            const button = item.querySelector(".roofen-contact-accordion__button");

            if (!button) {
                return;
            }

            button.addEventListener("click", function () {
                const isOpen = item.classList.contains("is-open");

                items.forEach(function (currentItem) {
                    const currentButton = currentItem.querySelector(".roofen-contact-accordion__button");

                    currentItem.classList.remove("is-open");

                    if (currentButton) {
                        currentButton.setAttribute("aria-expanded", "false");
                    }
                });

                if (!isOpen) {
                    item.classList.add("is-open");
                    button.setAttribute("aria-expanded", "true");
                }
            });
        });
    }
})();