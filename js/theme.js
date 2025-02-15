document.addEventListener('DOMContentLoaded', function () {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    let savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    themeIcon.textContent = savedTheme === 'dark' ? 'light_mode' : 'dark_mode';

    let savedPosition = JSON.parse(localStorage.getItem('themeButtonPosition'));
    if (savedPosition) {
        themeToggle.style.left = `${savedPosition.x}px`;
        themeToggle.style.top = `${savedPosition.y}px`;
    } else {
        themeToggle.style.left = `calc(100% - 60px)`; // Default position (top-right)
        themeToggle.style.top = `70px`; // Below header
    }

    let isDragging = false;
    let startX, startY, startLeft, startTop;
    let touchStartTime = 0;

    function startDrag(e) {
        isDragging = false; // Reset dragging state
        touchStartTime = new Date().getTime(); // Record touch start time

        startX = e.clientX || e.touches[0].clientX;
        startY = e.clientY || e.touches[0].clientY;
        startLeft = parseInt(themeToggle.style.left) || 0;
        startTop = parseInt(themeToggle.style.top) || 0;

        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('touchend', stopDrag);
    }

    function drag(e) {
        isDragging = true; // Mark as dragging
        e.preventDefault();

        let currentX = e.clientX || e.touches[0].clientX;
        let currentY = e.clientY || e.touches[0].clientY;

        let deltaX = currentX - startX;
        let deltaY = currentY - startY;

        themeToggle.style.left = `${startLeft + deltaX}px`;
        themeToggle.style.top = `${startTop + deltaY}px`;
    }

    function stopDrag(e) {
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchmove', drag);
        document.removeEventListener('touchend', stopDrag);

        let touchDuration = new Date().getTime() - touchStartTime; // Calculate tap duration

        if (!isDragging && touchDuration < 200) {
            // If touch was short (<200ms), it's a tap
            toggleTheme();
        } else {
            // If dragged, save position
            localStorage.setItem(
                'themeButtonPosition',
                JSON.stringify({ x: parseInt(themeToggle.style.left), y: parseInt(themeToggle.style.top) })
            );
        }
    }

    function toggleTheme() {
        let currentTheme = document.body.getAttribute('data-theme');
        let newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.body.setAttribute('data-theme', newTheme);
        themeIcon.textContent = newTheme === 'dark' ? 'light_mode' : 'dark_mode';
        localStorage.setItem('theme', newTheme);
    }

    themeToggle.addEventListener('mousedown', startDrag);
    themeToggle.addEventListener('touchstart', startDrag, { passive: false });
});
