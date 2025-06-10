// Shared functions and utilities

// Save data to localStorage
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Load data from localStorage
function loadData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

// Clear data from localStorage
function clearData(key) {
    localStorage.removeItem(key);
}

// Generate a unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

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