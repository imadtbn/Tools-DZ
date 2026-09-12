// Favorites Management System
const Favorites = {
    getKey: () => 'tools_dz_favorites',

    getAll: function() {
        const data = localStorage.getItem(this.getKey());
        return data ? JSON.parse(data) : [];
    },

    add: function(toolId) {
        let favs = this.getAll();
        if (!favs.includes(toolId)) {
            favs.push(toolId);
            localStorage.setItem(this.getKey(), JSON.stringify(favs));
        }
    },

    remove: function(toolId) {
        let favs = this.getAll();
        favs = favs.filter(id => id !== toolId);
        localStorage.setItem(this.getKey(), JSON.stringify(favs));
    },

    isFavorite: function(toolId) {
        return this.getAll().includes(toolId);
    },

    toggle: function(toolId) {
        if (this.isFavorite(toolId)) {
            this.remove(toolId);
            return false;
        } else {
            this.add(toolId);
            return true;
        }
    }
};