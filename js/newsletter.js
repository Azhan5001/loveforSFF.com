document.addEventListener('DOMContentLoaded', function() {
    const trigger = document.querySelector('.newsletter-trigger');
    const popup = document.getElementById('newsletterPopup');
    
    // Show/hide inline form on trigger click
    trigger.addEventListener('click', () => {
      const form = document.querySelector(`[data-theme="${document.body.dataset.theme}"] .inline-form`);
      form.style.display = form.style.display === 'block' ? 'none' : 'block';
    });
  
    // Show popup on first visit
    if (!localStorage.getItem('newsletterShown')) {
      popup.style.display = 'flex';
      localStorage.setItem('newsletterShown', 'true');
    }
  
    // Close popup when clicking outside
    popup.addEventListener('click', (e) => {
      if (e.target === popup) {
        popup.style.display = 'none';
      }
    });
  
    // Theme change handler
    document.querySelector('.theme-toggle').addEventListener('click', () => {
      const currentTheme = document.body.dataset.theme;
      const forms = document.querySelectorAll('.inline-form');
      
      forms.forEach(form => {
        form.style.display = form.dataset.theme === currentTheme ? 'block' : 'none';
      });
    });
  });