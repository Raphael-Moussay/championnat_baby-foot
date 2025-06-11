// Shared functions and utilities

// Initialize tabs active state
function initTabs() {
    const currentPage = window.location.pathname.split('/').pop();
    const tabs = document.querySelectorAll('.tabs li');
    
    tabs.forEach(tab => {
        const link = tab.querySelector('a');
        if (link && link.getAttribute('href') === currentPage) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initTabs();
});

window.addEventListener('DOMContentLoaded', () => {
    const intro = document.getElementById('intro-animation');
    if (!intro) return;
    setTimeout(() => {
        intro.classList.add('hide');
        setTimeout(() => { intro.style.display = 'none'; }, 900);
    }, 4000); // Durée de l'animation (modifiable)
});