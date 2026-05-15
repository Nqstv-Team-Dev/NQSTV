(function () {
    const carousels = document.querySelectorAll("[data-team-carousel]");

    carousels.forEach((carousel) => {
        const track = carousel.querySelector("[data-carousel-track]");
        const previousButton = carousel.querySelector("[data-carousel-prev]");
        const nextButton = carousel.querySelector("[data-carousel-next]");

        if (!track || !previousButton || !nextButton) {
            return;
        }

        let isDragging = false;
        let startX = 0;
        let startScrollLeft = 0;
        let activePointerId = null;
        let dragged = false;
        let pendingDragFrame = 0;
        let pendingScrollLeft = 0;

        const clampScrollLeft = (value) => {
            const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
            return Math.min(Math.max(value, 0), maxScroll);
        };

        const flushPendingDragFrame = () => {
            if (!pendingDragFrame) {
                return;
            }

            window.cancelAnimationFrame(pendingDragFrame);
            track.scrollLeft = pendingScrollLeft;
            pendingDragFrame = 0;
        };

        const getStep = () => {
            const card = track.querySelector(".staff-card");
            if (!card) {
                return track.clientWidth;
            }

            const styles = window.getComputedStyle(track);
            const gap = parseFloat(styles.columnGap || styles.gap || "0");
            return card.getBoundingClientRect().width + gap;
        };

        const updateButtons = () => {
            const maxScroll = track.scrollWidth - track.clientWidth - 2;
            previousButton.disabled = track.scrollLeft <= 2;
            nextButton.disabled = track.scrollLeft >= maxScroll;
        };

        previousButton.addEventListener("click", () => {
            track.scrollBy({ left: -getStep(), behavior: "smooth" });
        });

        nextButton.addEventListener("click", () => {
            track.scrollBy({ left: getStep(), behavior: "smooth" });
        });

        track.addEventListener("keydown", (event) => {
            if (event.key === "ArrowLeft") {
                event.preventDefault();
                track.scrollBy({ left: -getStep(), behavior: "smooth" });
            }

            if (event.key === "ArrowRight") {
                event.preventDefault();
                track.scrollBy({ left: getStep(), behavior: "smooth" });
            }
        });

        track.addEventListener("pointerdown", (event) => {
            if (event.button !== 0) {
                return;
            }

            isDragging = true;
            dragged = false;
            flushPendingDragFrame();
            activePointerId = event.pointerId;
            startX = event.clientX;
            startScrollLeft = track.scrollLeft;
            track.classList.add("is-dragging");
            track.setPointerCapture(event.pointerId);
        });

        track.addEventListener("pointermove", (event) => {
            if (!isDragging || event.pointerId !== activePointerId) {
                return;
            }

            const dragDistance = event.clientX - startX;
            dragged = Math.abs(dragDistance) > 4;
            pendingScrollLeft = clampScrollLeft(startScrollLeft - dragDistance);

            if (!pendingDragFrame) {
                pendingDragFrame = window.requestAnimationFrame(() => {
                    track.scrollLeft = pendingScrollLeft;
                    pendingDragFrame = 0;
                });
            }

            if (dragged) {
                event.preventDefault();
            }
        });

        const stopDragging = (event) => {
            if (!isDragging || event.pointerId !== activePointerId) {
                return;
            }

            isDragging = false;
            activePointerId = null;
            flushPendingDragFrame();

            track.classList.remove("is-dragging");

            if (track.hasPointerCapture(event.pointerId)) {
                track.releasePointerCapture(event.pointerId);
            }
        };

        track.addEventListener("pointerup", stopDragging);
        track.addEventListener("pointercancel", stopDragging);
        track.addEventListener("lostpointercapture", () => {
            isDragging = false;
            activePointerId = null;
            flushPendingDragFrame();
            track.classList.remove("is-dragging");
        });

        track.addEventListener("click", (event) => {
            if (!dragged) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();
            dragged = false;
        }, true);

        track.addEventListener("wheel", (event) => {
            if (Math.abs(event.deltaX) <= Math.abs(event.deltaY) && !event.shiftKey) {
                return;
            }

            event.preventDefault();
            track.scrollLeft += event.deltaX || event.deltaY;
        }, { passive: false });

        track.addEventListener("scroll", updateButtons, { passive: true });
        window.addEventListener("resize", updateButtons);
        updateButtons();
    });
})();
