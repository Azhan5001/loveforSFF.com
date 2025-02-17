document.addEventListener('DOMContentLoaded', function () {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedPosition = JSON.parse(localStorage.getItem('themeTogglePosition'));

    let isDragging = false;
    let offsetX, offsetY, startX, startY;

    // Apply saved theme
    document.body.setAttribute('data-theme', savedTheme);
    themeIcon.textContent = savedTheme === 'dark' ? 'light_mode' : 'dark_mode';

    // Apply saved or default position (top-right below header)
    themeToggle.style.position = 'fixed';
    themeToggle.style.right = savedPosition ? savedPosition.right : '20px';
    themeToggle.style.top = savedPosition ? savedPosition.top : '60px';

    // Get screen boundaries
    function getBounds() {
        return {
            minX: 0,
            maxX: window.innerWidth - themeToggle.offsetWidth,
            minY: 0,
            maxY: window.innerHeight - themeToggle.offsetHeight
        };
    }

    // Handle Mouse & Touch Events
    function startDrag(e) {
        e.preventDefault();
        isDragging = false;

        const event = e.touches ? e.touches[0] : e;
        offsetX = event.clientX - themeToggle.getBoundingClientRect().left;
        offsetY = event.clientY - themeToggle.getBoundingClientRect().top;
        startX = event.clientX;
        startY = event.clientY;

        const isTouch = e.type === "touchstart";
        const moveEvent = isTouch ? "touchmove" : "mousemove";
        const endEvent = isTouch ? "touchend" : "mouseup";

        document.addEventListener(moveEvent, onMove);
        document.addEventListener(endEvent, endDrag);
        document.addEventListener(endEvent, savePosition);
    }

    function endDrag(e) {
        const event = e.changedTouches ? e.changedTouches[0] : e;
        if (Math.abs(event.clientX - startX) > 5 || Math.abs(event.clientY - startY) > 5) {
            isDragging = true;
        }

        if (!isDragging) {
            const currentTheme = document.body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.body.setAttribute('data-theme', newTheme);
            themeIcon.textContent = newTheme === 'dark' ? 'light_mode' : 'dark_mode';
            localStorage.setItem('theme', newTheme);
        }

        const isTouch = e.type === "touchend";
        const moveEvent = isTouch ? "touchmove" : "mousemove";
        const endEvent = isTouch ? "touchend" : "mouseup";

        document.removeEventListener(moveEvent, onMove);
        document.removeEventListener(endEvent, endDrag);
        document.removeEventListener(endEvent, savePosition);
    }

    function onMove(e) {
        isDragging = true;
        const event = e.touches ? e.touches[0] : e;
        const bounds = getBounds();

        let newX = event.clientX - offsetX;
        let newY = event.clientY - offsetY;

        // Prevent moving out of bounds
        newX = Math.max(bounds.minX, Math.min(newX, bounds.maxX));
        newY = Math.max(bounds.minY, Math.min(newY, bounds.maxY));

        themeToggle.style.left = newX + 'px';
        themeToggle.style.top = newY + 'px';
        themeToggle.style.right = 'auto';
    }

    function savePosition(e) {
        if (isDragging) {
            localStorage.setItem(
                'themeTogglePosition',
                JSON.stringify({ 
                    top: themeToggle.style.top, 
                    right: window.innerWidth - themeToggle.getBoundingClientRect().right + 'px' 
                })
            );
        }
        isDragging = false;
    }

    function adjustPosition() {
        const bounds = getBounds();
        const rect = themeToggle.getBoundingClientRect();

        let newLeft = parseInt(themeToggle.style.left) || rect.left;
        let newTop = parseInt(themeToggle.style.top) || rect.top;

        newLeft = Math.max(bounds.minX, Math.min(newLeft, bounds.maxX));
        newTop = Math.max(bounds.minY, Math.min(newTop, bounds.maxY));

        themeToggle.style.left = newLeft + 'px';
        themeToggle.style.top = newTop + 'px';

        localStorage.setItem('themeTogglePosition', JSON.stringify({ top: themeToggle.style.top, right: '20px' }));
    }

    // Attach Event Listeners
    themeToggle.addEventListener('mousedown', startDrag);
    themeToggle.addEventListener('touchstart', startDrag);

    window.addEventListener('resize', adjustPosition);
});