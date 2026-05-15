(function () {
    var cookieName = "nqstv_cookie_consent";
    var cookieMaxAge = 60 * 60 * 24 * 180;
    var validChoices = {
        accepted: true,
        declined: true
    };

    function getConsent() {
        var cookies = document.cookie ? document.cookie.split("; ") : [];

        for (var index = 0; index < cookies.length; index += 1) {
            var parts = cookies[index].split("=");
            var name = parts.shift();

            if (name === cookieName) {
                var value = decodeURIComponent(parts.join("="));
                return validChoices[value] ? value : "";
            }
        }

        return "";
    }

    function saveConsent(choice) {
        if (!validChoices[choice]) {
            return;
        }

        var cookieValue = cookieName + "=" + encodeURIComponent(choice) +
            "; Max-Age=" + cookieMaxAge +
            "; Path=/; SameSite=Lax";

        if (window.location.protocol === "https:") {
            cookieValue += "; Secure";
        }

        document.cookie = cookieValue;
        window.dispatchEvent(new CustomEvent("nqstv:cookies-updated", {
            detail: {
                consent: choice
            }
        }));
    }

    function removeBanner(banner) {
        banner.classList.add("cookie-consent--closing");

        window.setTimeout(function () {
            banner.remove();
        }, 220);
    }

    function renderBanner() {
        if (getConsent() || document.querySelector(".cookie-consent")) {
            return;
        }

        var banner = document.createElement("aside");
        banner.className = "cookie-consent";
        banner.setAttribute("role", "region");
        banner.setAttribute("aria-label", "Cookie preferences");
        banner.innerHTML = [
            '<div class="cookie-consent__copy">',
            '<strong>Cookie preferences</strong>',
            '<p>We use essential cookies to remember your choice. With your permission, we also load live chat to help answer inquiries.</p>',
            "</div>",
            '<div class="cookie-consent__actions">',
            '<button class="cookie-consent__button cookie-consent__button--ghost" type="button" data-cookie-choice="declined">Decline</button>',
            '<button class="cookie-consent__button" type="button" data-cookie-choice="accepted">Accept</button>',
            "</div>"
        ].join("");

        banner.addEventListener("click", function (event) {
            var button = event.target.closest("[data-cookie-choice]");

            if (!button) {
                return;
            }

            saveConsent(button.getAttribute("data-cookie-choice"));
            removeBanner(banner);
        });

        document.body.appendChild(banner);
    }

    window.NQSTVCookies = {
        getConsent: getConsent,
        hasAccepted: function () {
            return getConsent() === "accepted";
        },
        hasDeclined: function () {
            return getConsent() === "declined";
        },
        setConsent: saveConsent
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", renderBanner, { once: true });
    } else {
        renderBanner();
    }
})();
