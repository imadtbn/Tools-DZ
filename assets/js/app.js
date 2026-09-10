const BASE_PATH = (function() {
    const path = window.location.pathname;

    // Extract base path dynamically for GitHub Pages (handles /Tools-DZ/ or /tools-dz/)
    // Check if it's the specific host imadtbn.github.io first
    if (window.location.hostname.includes('github.io')) {
        const parts = path.split('/');
        if (parts.length > 1 && parts[1]) {
            return '/' + parts[1];
        }
    }

    const match = path.match(/^\/([^\/]+)\//);
    if (match && (match[1].toLowerCase() === 'tools-dz')) {
        return '/' + match[1];
    }

    return '';
})();

// Helper to resolve URLs
function resolveUrl(url) {
    if (url.startsWith('/')) {
        return BASE_PATH + url;
    }
    // If it's a relative URL, just return it as is or handle logic
    // We are currently using relative paths in HTML like `./` or `../`
    // but this JS helper can be useful for dynamic JS fetches
    return url;
}

document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
});
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register(resolveUrl('/sw.js'))
            .then(registration => {
                console.log('SW registered with scope:', registration.scope);
            })
            .catch(error => {
                console.error('SW registration failed:', error);
            });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const nav = document.getElementById('main-nav');
    if(nav) {
        const toggleBtn = document.createElement('button');
        toggleBtn.innerHTML = '☰';
        toggleBtn.className = 'mobile-menu-toggle';
        toggleBtn.style.cssText = 'display: none; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-color);';

        // Add to DOM before nav
        if(window.innerWidth <= 768) {
            toggleBtn.style.display = 'block';
            nav.parentNode.insertBefore(toggleBtn, nav);
        }

        window.addEventListener('resize', () => {
            if(window.innerWidth <= 768) {
                if(!document.querySelector('.mobile-menu-toggle')) {
                    nav.parentNode.insertBefore(toggleBtn, nav);
                }
                toggleBtn.style.display = 'block';
            } else {
                toggleBtn.style.display = 'none';
                nav.classList.remove('active');
            }
        });

        toggleBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }
});
