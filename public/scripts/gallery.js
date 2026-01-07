// Gallery Page JavaScript

let allItems = [];

document.addEventListener('DOMContentLoaded', () => {
    loadGalleryItems();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('add-item-btn').addEventListener('click', () => {
        document.getElementById('add-item-modal').classList.add('active');
    });
    
    document.getElementById('close-modal').addEventListener('click', () => {
        document.getElementById('add-item-modal').classList.remove('active');
    });
    
    document.getElementById('add-item-form').addEventListener('submit', handleAddItem);
    
    document.getElementById('search-input').addEventListener('input', filterItems);
    document.getElementById('type-filter').addEventListener('change', filterItems);
}

async function loadGalleryItems() {
    try {
        const response = await fetch('/api/items');
        allItems = await response.json();
        displayItems(allItems);
    } catch (error) {
        console.error('Error loading items:', error);
        displayItems([]);
    }
}

function displayItems(items) {
    const galleryGrid = document.getElementById('gallery-grid');
    
    if (items.length === 0) {
        galleryGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted);">
                <p style="font-size: 1.2rem; margin-bottom: 1rem;">No items yet</p>
                <p>Be the first to add a cultural item to the archive!</p>
            </div>
        `;
        return;
    }
    
    galleryGrid.innerHTML = items.map(item => `
        <div class="gallery-item" onclick="viewItem('${item.id}')">
            <div class="gallery-item-image">
                ${item.imageUrl 
                    ? `<img src="${item.imageUrl}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover;">`
                    : `<span>${getTypeIcon(item.type)}</span>`
                }
            </div>
            <div class="gallery-item-content">
                <span class="gallery-item-type">${item.type}</span>
                <h3>${escapeHtml(item.title)}</h3>
                <p>${escapeHtml(item.description.substring(0, 100))}${item.description.length > 100 ? '...' : ''}</p>
                <div class="gallery-item-location">
                    📍 ${escapeHtml(item.location)}
                </div>
                ${item.tags && item.tags.length > 0 ? `
                    <div class="gallery-item-tags">
                        ${item.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function getTypeIcon(type) {
    const icons = {
        'visual': '🖼️',
        'audio': '🎧',
        'story': '📖'
    };
    return icons[type] || '📄';
}

function filterItems() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const typeFilter = document.getElementById('type-filter').value;
    
    let filtered = allItems;
    
    if (typeFilter !== 'all') {
        filtered = filtered.filter(item => item.type === typeFilter);
    }
    
    if (searchTerm) {
        filtered = filtered.filter(item => 
            item.title.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm) ||
            item.location.toLowerCase().includes(searchTerm) ||
            (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
        );
    }
    
    displayItems(filtered);
}

async function handleAddItem(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        title: formData.get('title'),
        type: formData.get('type'),
        location: formData.get('location'),
        description: formData.get('description'),
        imageUrl: formData.get('imageUrl') || '',
        audioUrl: formData.get('audioUrl') || '',
        tags: formData.get('tags') ? formData.get('tags').split(',').map(t => t.trim()) : []
    };
    
    try {
        const response = await fetch('/api/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            const newItem = await response.json();
            allItems.push(newItem);
            displayItems(allItems);
            e.target.reset();
            document.getElementById('add-item-modal').classList.remove('active');
            alert('Item added successfully!');
        } else {
            alert('Error adding item. Please try again.');
        }
    } catch (error) {
        console.error('Error adding item:', error);
        alert('Error adding item. Please try again.');
    }
}

function viewItem(id) {
    const item = allItems.find(i => i.id === id);
    if (item) {
        // In a full implementation, show a detailed view modal
        alert(`Viewing: ${item.title}\n\n${item.description}`);
    }
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

