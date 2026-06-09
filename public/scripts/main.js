// Main JavaScript for Home Page

// Load village posts on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadVillagePosts();
});

async function loadVillagePosts() {
    try {
        const response = await fetch('/api/posts');
        const posts = await response.json();
        
        const postsGrid = document.getElementById('village-posts');
        if (!postsGrid) return;
        
        if (posts.length === 0) {
            postsGrid.innerHTML = '<p style="text-align: center; color: white;">No posts yet. Check back soon for updates from villages!</p>';
            return;
        }
        
        postsGrid.innerHTML = posts.slice(0, 6).map(post => `
            <div class="post-card">
                <h4>${escapeHtml(post.title)}</h4>
                <p class="post-meta">${post.village} • ${formatDate(post.timestamp)}</p>
                <p>${escapeHtml(post.content)}</p>
                <span style="display: inline-block; padding: 0.25rem 0.75rem; background: var(--primary-color); border-radius: 20px; font-size: 0.85rem; margin-top: 1rem;">
                    ${post.type}
                </span>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading posts:', error);
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}




const backToTopBtn = document.getElementById("backToTopBtn");

// Show button after scrolling
window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        backToTopBtn.classList.add("show");
    } else {
        backToTopBtn.classList.remove("show");
    }
});

// Smooth scroll to top
backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});