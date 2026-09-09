const BASE_PATH = (function() {
    // If we are on GitHub pages, path might be /tools-dz/
    // This simple logic helps us compute the base path dynamically
    // based on the location of index.html or other known files.
    const path = window.location.pathname;

    // For github pages support assuming repo name is tools-dz
    if (path.includes('/tools-dz/')) {
        return '/tools-dz';
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
