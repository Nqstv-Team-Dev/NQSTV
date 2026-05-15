(function () {
    var crispLoaded = false;
    var crispScriptUrl = "https://client.crisp.chat/l.js";
    var consentEventName = "nqstv:cookies-updated";

    function hasCookieConsent() {
        if (window.NQSTVCookies && typeof window.NQSTVCookies.hasAccepted === "function") {
            return window.NQSTVCookies.hasAccepted();
        }

        return document.cookie.indexOf("nqstv_cookie_consent=accepted") !== -1;
    }

    function loadCrisp() {
        if (crispLoaded) {
            return;
        }

        crispLoaded = true;
        window.$crisp = window.$crisp || [];
        window.CRISP_WEBSITE_ID = "ff804b92-b2a3-4163-9eb2-6fcae561efd8";

        var script = document.createElement("script");
        script.src = crispScriptUrl;
        script.async = true;
        script.onerror = function () {
            console.warn("Crisp chat could not be loaded.");
        };

        document.head.appendChild(script);
    }

    function scheduleCrisp() {
        if ("requestIdleCallback" in window) {
            window.requestIdleCallback(loadCrisp, { timeout: 3000 });
            return;
        }

        window.setTimeout(loadCrisp, 2000);
    }

    function enableCrispLoading() {
        ["pointerdown", "keydown", "touchstart"].forEach(function (eventName) {
            window.addEventListener(eventName, loadCrisp, { once: true, passive: true });
        });

        if (document.readyState === "complete") {
            scheduleCrisp();
        } else {
            window.addEventListener("load", scheduleCrisp, { once: true });
        }
    }

    if (hasCookieConsent()) {
        enableCrispLoading();
    } else {
        window.addEventListener(consentEventName, function (event) {
            if (event.detail && event.detail.consent === "accepted") {
                enableCrispLoading();
                loadCrisp();
            }
        });
    }
})();
