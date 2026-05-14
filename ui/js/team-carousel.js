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
            track.scrollLeft = startScrollLeft - dragDistance;
        });

        const stopDragging = (event) => {
            if (!isDragging || event.pointerId !== activePointerId) {
                return;
            }

            isDragging = false;
            activePointerId = null;
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
            track.classList.remove("is-dragging");
        });

        track.addEventListener("scroll", updateButtons, { passive: true });
        window.addEventListener("resize", updateButtons);
        updateButtons();
    });
})();
