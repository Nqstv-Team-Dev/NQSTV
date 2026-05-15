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
        var visibleCards = cards.filter(function (card) {
            return card.parentElement === track;
        });
        var cardTargets = [];
        var activeIndex = 0;
        var scrollTimer = 0;
        var resizeFrame = 0;
        var dragFrame = 0;
        var pendingDragScrollLeft = 0;
        var isPointerDown = false;
        var isDragging = false;
        var pointerStartX = 0;
        var scrollStartX = 0;
        var suppressClick = false;

        function refreshMeasurements() {
            visibleCards = cards.filter(function (card) {
                return card.parentElement === track;
            });

            var styles = window.getComputedStyle(windowEl);
            var gutter = parseFloat(styles.paddingLeft) || 0;
            var maxScroll = Math.max(0, windowEl.scrollWidth - windowEl.clientWidth);

            cardTargets = visibleCards.map(function (card) {
                var target = card.offsetLeft - track.offsetLeft - gutter;
                return Math.max(0, Math.min(target, maxScroll));
            });
        }

        function updateCounter() {
            var total = visibleCards.length;

            if (!countEl || total === 0) {
                return;
            }

            countEl.textContent = "Project " + (activeIndex + 1) + " of " + total;
        }

        function setActiveCard(index, behavior) {
            var total = visibleCards.length;

            if (total === 0) {
                return;
            }

            activeIndex = ((index % total) + total) % total;
            windowEl.scrollTo({
                left: cardTargets[activeIndex] || 0,
                top: 0,
                behavior: behavior || "smooth"
            });
            updateCounter();
        }

        function updateIndexFromScroll() {
            var scrollLeft = windowEl.scrollLeft;
            var closestIndex = 0;
            var closestDistance = Infinity;

            cardTargets.forEach(function (target, index) {
                var distance = Math.abs(target - scrollLeft);

                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestIndex = index;
                }
            });

            activeIndex = closestIndex;
            updateCounter();
        }

        function writeDragScroll() {
            dragFrame = 0;
            windowEl.scrollLeft = pendingDragScrollLeft;
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
                pendingDragScrollLeft = scrollStartX - deltaX;
                if (!dragFrame) {
                    dragFrame = window.requestAnimationFrame(writeDragScroll);
                }
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
                if (!resizeFrame) {
                    resizeFrame = window.requestAnimationFrame(function () {
                        resizeFrame = 0;
                        refreshMeasurements();
                        setActiveCard(activeIndex, "auto");
                    });
                }
            }
        });

        refreshMeasurements();
        updateCounter();
    }

    document.addEventListener("DOMContentLoaded", function () {
        document.querySelectorAll(".project-carousel").forEach(initProjectCarousel);
    });
})();
