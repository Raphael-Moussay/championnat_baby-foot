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

// Menu burger
const burger = document.querySelector('.burger-menu');
const tabs = document.querySelector('.tabs');
if (burger && tabs) {
    burger.addEventListener('click', function() {
        const isOpen = tabs.classList.toggle('open');
        burger.classList.toggle('open', isOpen);
        burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    // Ferme le menu si on clique sur un lien
    tabs.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            tabs.classList.remove('open');
            burger.classList.remove('open');
            burger.setAttribute('aria-expanded', 'false');
        });
    });
}