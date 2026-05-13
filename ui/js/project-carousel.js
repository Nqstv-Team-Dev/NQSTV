(function () {
    "use strict";

    function initProjectCarousel(carousel) {
        var windowEl = carousel.querySelector(".project-carousel-window");
        var track = carousel.querySelector(".project-carousel-track");
        var prevButton = carousel.querySelector(".project-carousel-prev");
        var nextButton = carousel.querySelector(".project-carousel-next");
        var countEl = carousel.querySelector(".project-carousel-count");

        if (!windowEl || !track || !prevButton || !nextButton) {
            return;
        }

        var cards = Array.prototype.slice.call(track.querySelectorAll(".project-card"));
        var activeIndex = 0;
        var scrollTimer = 0;
        var isPointerDown = false;
        var isDragging = false;
        var pointerStartX = 0;
        var scrollStartX = 0;
        var suppressClick = false;

        function getVisibleCards() {
            return cards.filter(function (card) {
                return card.parentElement === track;
            });
        }

        function updateCounter() {
            var visibleCards = getVisibleCards();
            var total = visibleCards.length;

            if (!countEl || total === 0) {
                return;
            }

            countEl.textContent = "Project " + (activeIndex + 1) + " of " + total;
        }

        function getScrollTargetForCard(card) {
            var styles = window.getComputedStyle(windowEl);
            var gutter = parseFloat(styles.paddingLeft) || 0;
            var target = card.offsetLeft - track.offsetLeft - gutter;
            var maxScroll = windowEl.scrollWidth - windowEl.clientWidth;

            return Math.max(0, Math.min(target, maxScroll));
        }

        function setActiveCard(index, behavior) {
            var visibleCards = getVisibleCards();
            var total = visibleCards.length;

            if (total === 0) {
                return;
            }

            activeIndex = ((index % total) + total) % total;
            windowEl.scrollTo({
                left: getScrollTargetForCard(visibleCards[activeIndex]),
                top: 0,
                behavior: behavior || "smooth"
            });
            updateCounter();
        }

        function updateIndexFromScroll() {
            var visibleCards = getVisibleCards();
            var windowLeft = windowEl.getBoundingClientRect().left;
            var closestIndex = 0;
            var closestDistance = Infinity;

            visibleCards.forEach(function (card, index) {
                var distance = Math.abs(card.getBoundingClientRect().left - windowLeft);

                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestIndex = index;
                }
            });

            activeIndex = closestIndex;
            updateCounter();
        }

        prevButton.addEventListener("click", function () {
            setActiveCard(activeIndex - 1);
        });

        nextButton.addEventListener("click", function () {
            setActiveCard(activeIndex + 1);
        });

        windowEl.addEventListener("scroll", function () {
            window.clearTimeout(scrollTimer);
            scrollTimer = window.setTimeout(updateIndexFromScroll, 80);
        }, { passive: true });

        windowEl.addEventListener("pointerdown", function (event) {
            if (event.button !== undefined && event.button !== 0) {
                return;
            }

            isPointerDown = true;
            isDragging = false;
            pointerStartX = event.clientX;
            scrollStartX = windowEl.scrollLeft;
            windowEl.classList.add("is-pointer-down");
            if (event.target.setPointerCapture) {
                event.target.setPointerCapture(event.pointerId);
            }
        });

        windowEl.addEventListener("pointermove", function (event) {
            if (!isPointerDown) {
                return;
            }

            var deltaX = event.clientX - pointerStartX;

            if (Math.abs(deltaX) > 6) {
                isDragging = true;
                suppressClick = true;
                carousel.classList.add("is-dragging");
                windowEl.scrollLeft = scrollStartX - deltaX;
                event.preventDefault();
            }
        });

        function endPointerDrag() {
            if (!isPointerDown) {
                return;
            }

            isPointerDown = false;
            windowEl.classList.remove("is-pointer-down");
            carousel.classList.remove("is-dragging");

            if (isDragging) {
                window.clearTimeout(scrollTimer);
                scrollTimer = window.setTimeout(updateIndexFromScroll, 60);
                window.setTimeout(function () {
                    suppressClick = false;
                }, 140);
            }

            isDragging = false;
        }

        windowEl.addEventListener("pointerup", endPointerDrag);
        windowEl.addEventListener("pointercancel", endPointerDrag);
        windowEl.addEventListener("lostpointercapture", endPointerDrag);

        windowEl.addEventListener("click", function (event) {
            if (!suppressClick) {
                return;
            }

            suppressClick = false;
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
        }, true);

        var lastWidth = window.innerWidth;
        window.addEventListener("resize", function () {
            if (window.innerWidth !== lastWidth) {
                lastWidth = window.innerWidth;
                setActiveCard(activeIndex, "auto");
            }
        });

        updateCounter();
    }

    document.addEventListener("DOMContentLoaded", function () {
        document.querySelectorAll(".project-carousel").forEach(initProjectCarousel);
    });
})();
