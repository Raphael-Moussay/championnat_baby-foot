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