// Heritage Paths Page JavaScript

let allPaths = [];
let allItems = [];
let currentPath = null;
let currentStepIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    loadPaths();
    loadItems();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('create-path-btn').addEventListener('click', () => {
        document.getElementById('create-path-modal').classList.add('active');
    });
    
    document.getElementById('close-create-modal').addEventListener('click', () => {
        document.getElementById('create-path-modal').classList.remove('active');
    });
    
    document.getElementById('create-path-form').addEventListener('submit', handleCreatePath);
    
    document.getElementById('close-player').addEventListener('click', () => {
        document.getElementById('path-player-modal').classList.remove('active');
        currentPath = null;
        currentStepIndex = 0;
    });
    
    document.getElementById('prev-step').addEventListener('click', () => {
        if (currentStepIndex > 0) {
            currentStepIndex--;
            displayPathStep();
        }
    });
    
    document.getElementById('next-step').addEventListener('click', () => {
        if (currentPath && currentStepIndex < currentPath.items.length - 1) {
            currentStepIndex++;
            displayPathStep();
        }
    });
}

async function loadPaths() {
    try {
        const response = await fetch('/api/paths');
        allPaths = await response.json();
        displayPaths();
    } catch (error) {
        console.error('Error loading paths:', error);
        displayPaths();
    }
}

async function loadItems() {
    try {
        const response = await fetch('/api/items');
        allItems = await response.json();
        populateItemsSelector();
    } catch (error) {
        console.error('Error loading items:', error);
    }
}

function displayPaths() {
    const pathsList = document.getElementById('paths-list');
    
    if (allPaths.length === 0) {
        pathsList.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
                <p style="font-size: 1.2rem; margin-bottom: 1rem;">No heritage paths yet</p>
                <p>Create the first path to guide users through a cultural journey!</p>
            </div>
        `;
        return;
    }
    
    pathsList.innerHTML = allPaths.map(path => `
        <div class="path-card" onclick="playPath('${path.id}')">
            <div class="path-card-header">
                <div>
                    <h3>${escapeHtml(path.title)}</h3>
                    <span class="path-card-theme">${escapeHtml(path.theme)}</span>
                </div>
            </div>
            <p>${escapeHtml(path.description)}</p>
            <div class="path-card-stats">
                <span>📚 ${path.items.length} items</span>
                <span>⏱️ ~${Math.ceil(path.items.length * 3)} min</span>
            </div>
        </div>
    `).join('');
}

function populateItemsSelector() {
    const itemsSelector = document.getElementById('available-items');
    
    if (allItems.length === 0) {
        itemsSelector.innerHTML = '<p style="color: var(--text-muted);">No items available. Add items to the gallery first.</p>';
        return;
    }
    
    itemsSelector.innerHTML = allItems.map(item => `
        <div class="item-checkbox">
            <input type="checkbox" name="path-items" value="${item.id}" id="item-${item.id}">
            <label for="item-${item.id}">${escapeHtml(item.title)} - ${escapeHtml(item.location)}</label>
        </div>
    `).join('');
}

async function handleCreatePath(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const selectedItems = Array.from(document.querySelectorAll('input[name="path-items"]:checked'))
        .map(cb => cb.value);
    
    if (selectedItems.length === 0) {
        alert('Please select at least one item for the path.');
        return;
    }
    
    const data = {
        title: formData.get('title'),
        theme: formData.get('theme'),
        description: formData.get('description'),
        items: selectedItems
    };
    
    try {
        const response = await fetch('/api/paths', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            const newPath = await response.json();
            allPaths.push(newPath);
            displayPaths();
            e.target.reset();
            document.getElementById('create-path-modal').classList.remove('active');
            alert('Path created successfully!');
        } else {
            alert('Error creating path. Please try again.');
        }
    } catch (error) {
        console.error('Error creating path:', error);
        alert('Error creating path. Please try again.');
    }
}

function playPath(pathId) {
    currentPath = allPaths.find(p => p.id === pathId);
    if (!currentPath) return;
    
    currentStepIndex = 0;
    document.getElementById('path-player-title').textContent = currentPath.title;
    document.getElementById('path-player-modal').classList.add('active');
    displayPathStep();
}

function displayPathStep() {
    if (!currentPath || currentPath.items.length === 0) return;
    
    const stepItemId = currentPath.items[currentStepIndex];
    const stepItem = allItems.find(item => item.id === stepItemId);
    
    if (!stepItem) {
        document.getElementById('path-content').innerHTML = '<p>Item not found</p>';
        return;
    }
    
    const progress = ((currentStepIndex + 1) / currentPath.items.length) * 100;
    document.getElementById('path-progress-fill').style.width = `${progress}%`;
    document.getElementById('path-progress-text').textContent = 
        `Step ${currentStepIndex + 1} of ${currentPath.items.length}`;
    
    let audioHTML = '';
    if (stepItem.audioUrl) {
        audioHTML = `
            <div class="path-step-audio">
                <audio controls class="audio-player">
                    <source src="${stepItem.audioUrl}" type="audio/mpeg">
                    Your browser does not support the audio element.
                </audio>
            </div>
        `;
    }
    
    document.getElementById('path-content').innerHTML = `
        <div class="path-step">
            ${stepItem.imageUrl ? `<img src="${stepItem.imageUrl}" alt="${stepItem.title}" class="path-step-image">` : ''}
            <h4>${escapeHtml(stepItem.title)}</h4>
            <p><strong>Location:</strong> ${escapeHtml(stepItem.location)}</p>
            <p>${escapeHtml(stepItem.description)}</p>
            ${audioHTML}
        </div>
    `;
    
    // Update button states
    document.getElementById('prev-step').disabled = currentStepIndex === 0;
    document.getElementById('next-step').disabled = currentStepIndex === currentPath.items.length - 1;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Make playPath available globally
window.playPath = playPath;

