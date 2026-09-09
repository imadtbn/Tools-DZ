window.initSearch = function(toolsData) {
    const searchInput = document.getElementById('main-search');
    const searchResults = document.getElementById('search-results');

    if (!searchInput || !searchResults) return;

    // Remove hidden on focus
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim() !== '') {
            searchResults.classList.remove('hidden');
        }
    });

    // Hide on blur (with delay to allow clicking results)
    searchInput.addEventListener('blur', () => {
        setTimeout(() => searchResults.classList.add('hidden'), 200);
    });

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();

        if (query === '') {
            searchResults.classList.add('hidden');
            searchResults.innerHTML = '';
            return;
        }

        // Search logic
        const results = toolsData.filter(tool => {
            const nameMatch = tool.name.toLowerCase().includes(query);
            const descMatch = tool.description.toLowerCase().includes(query);
            const keywordsMatch = tool.keywords.some(kw => kw.toLowerCase().includes(query));

            return nameMatch || descMatch || keywordsMatch;
        });

        renderSearchResults(results);
    });

    function renderSearchResults(results) {
        searchResults.classList.remove('hidden');

        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-item">لا توجد نتائج مطابقة</div>';
            return;
        }

        searchResults.innerHTML = results.map(tool => `
            <a href="${resolveUrl(tool.url)}" class="search-item" style="display: flex; align-items: center; padding: 10px; text-decoration: none; border-bottom: 1px solid var(--border-color); color: var(--text-color);">
                <span style="font-size: 1.5rem; margin-left: 10px;">${tool.icon}</span>
                <div>
                    <strong style="display: block;">${tool.name}</strong>
                    <span style="font-size: 0.85rem; color: var(--text-muted);">${tool.description.substring(0, 50)}...</span>
                </div>
            </a>
        `).join('');
    }
};

// Also apply CSS for search results dynamically here if not in main.css
const searchStyles = document.createElement('style');
searchStyles.textContent = `
    .search-results-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--surface-color);
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        max-height: 300px;
        overflow-y: auto;
        z-index: 1000;
        margin-top: 5px;
    }
    .search-item:hover {
        background-color: var(--bg-color);
    }
`;
document.head.appendChild(searchStyles);