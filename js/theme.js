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
    themeToggle.style.top = savedPosition ? savedPosition.top : '60px'; // Adjust based on header height

    themeToggle.addEventListener('mousedown', function (e) {
        isDragging = false;
        offsetX = e.clientX - themeToggle.getBoundingClientRect().left;
        offsetY = e.clientY - themeToggle.getBoundingClientRect().top;
        startX = e.clientX;
        startY = e.clientY;

        document.addEventListener('mousemove', onMouseMove);
    });

    function onMouseMove(e) {
        isDragging = true;
        themeToggle.style.left = e.clientX - offsetX + 'px';
        themeToggle.style.top = e.clientY - offsetY + 'px';
        themeToggle.style.right = 'auto'; // Reset right to prevent conflicting positioning
    }

    themeToggle.addEventListener('mouseup', function (e) {
        document.removeEventListener('mousemove', onMouseMove);

        // Detect if the button was dragged
        if (Math.abs(e.clientX - startX) > 5 || Math.abs(e.clientY - startY) > 5) {
            isDragging = true;
        }

        if (!isDragging) {
            // Change theme only if it was a click (not drag)
            const currentTheme = document.body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.body.setAttribute('data-theme', newTheme);
            themeIcon.textContent = newTheme === 'dark' ? 'light_mode' : 'dark_mode';
            localStorage.setItem('theme', newTheme);
        }

        if (isDragging) {
            // Save position if it was moved
            localStorage.setItem(
                'themeTogglePosition',
                JSON.stringify({
                    top: themeToggle.style.top,
                    right: window.innerWidth - themeToggle.getBoundingClientRect().right + 'px',
                })
            );
        }
        isDragging = false;
    });

    // Ensure button stays within screen bounds on resize
    window.addEventListener('resize', function () {
        const rect = themeToggle.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
            themeToggle.style.right = '20px';
            localStorage.setItem('themeTogglePosition', JSON.stringify({ top: themeToggle.style.top, right: '20px' }));
        }
    });
});
