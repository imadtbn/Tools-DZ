document.addEventListener('DOMContentLoaded', async () => {
    // 1. Fetch data
    let toolsData = [];
    let categoriesData = [];

    try {
        const toolsRes = await fetch(resolveUrl('/data/tools.json'));
        toolsData = await toolsRes.json();

        const catRes = await fetch(resolveUrl('/data/categories.json'));
        categoriesData = await catRes.json();
    } catch (e) {
        console.error('Failed to load data', e);
        return;
    }

    // 2. Render Categories (if container exists)
    const catContainer = document.getElementById('categories-container');
    if (catContainer) {
        catContainer.innerHTML = categoriesData.map(cat => `
            <a href="${resolveUrl('/pages/categories.html')}#${cat.id}" class="card category-card">
                <div class="card-icon">${cat.icon}</div>
                <h4>${cat.name}</h4>
                <p>${cat.description}</p>
            </a>
        `).join('');
    }

    // 3. Render Popular/Featured Tools
    const popContainer = document.getElementById('popular-tools-container');
    if (popContainer) {
        const featuredTools = toolsData.filter(t => t.featured);
        popContainer.innerHTML = featuredTools.map(t => createToolCard(t)).join('');
    }

    // 4. Render New Tools
    const newContainer = document.getElementById('new-tools-container');
    if (newContainer) {
        const newTools = toolsData.filter(t => t.new);
        newContainer.innerHTML = newTools.map(t => createToolCard(t)).join('');
    }

    // Store data globally for search
    window.TOOLS_DATA = toolsData;

    // Init search if script is loaded before
    if (window.initSearch) {
        window.initSearch(toolsData);
    }
});

function createToolCard(tool) {
    const isNew = tool.new ? '<span style="background:var(--accent-color); color:#fff; font-size:0.8rem; padding:2px 6px; border-radius:4px; margin-right:5px;">جديد</span>' : '';

    return `
        <div class="card tool-card">
            <div class="card-icon">${tool.icon}</div>
            <h4>${tool.name} ${isNew}</h4>
            <p>${tool.description}</p>
            <div style="margin-top: auto; display: flex; justify-content: space-between; align-items: center;">
                <a href="${resolveUrl(tool.url)}" class="btn">استخدام الأداة</a>
                <button class="fav-btn" data-id="${tool.id}" title="إضافة للمفضلة" style="background:none; border:none; cursor:pointer; font-size:1.2rem;">
                    ${window.Favorites && window.Favorites.isFavorite(tool.id) ? '⭐' : '☆'}
                </button>
            </div>
        </div>
    `;
}

// Global Event listener for favorite buttons
document.addEventListener('click', (e) => {
    if (e.target.closest('.fav-btn')) {
        const btn = e.target.closest('.fav-btn');
        const toolId = btn.getAttribute('data-id');
        if (window.Favorites) {
            const isFav = window.Favorites.toggle(toolId);
            btn.textContent = isFav ? '⭐' : '☆';
        }
    }
});