// Map Page JavaScript

let map;
let markers = [];
let heatmapLayer = null;
let ambientSoundEnabled = true;
let currentSound = null;

// Sample village data
const sampleVillages = [
    {
        name: 'Sundarbans Village',
        coordinates: [21.9497, 88.8156],
        traditions: ['Folk tales about tigers', 'Traditional fishing methods', 'Honey collection rituals'],
        festivals: ['Bonbibi Puja', 'Honey Festival'],
        crafts: ['Coconut shell crafts', 'Traditional boat making'],
        description: 'A village in the Sundarbans known for its unique relationship with nature and tigers.',
        ambientSound: 'birds'
    },
    {
        name: 'Kantha Village, Bengal',
        coordinates: [22.5726, 88.3639],
        traditions: ['Kantha embroidery', 'Oral storytelling', 'Traditional songs'],
        festivals: ['Durga Puja', 'Kali Puja'],
        crafts: ['Kantha stitch work', 'Traditional sarees'],
        description: 'Famous for Kantha embroidery, where old saris are layered and stitched with beautiful patterns.',
        ambientSound: 'flute'
    },
    {
        name: 'Madhubani Village, Bihar',
        coordinates: [26.3537, 86.0719],
        traditions: ['Madhubani painting', 'Mithila art', 'Folk songs'],
        festivals: ['Chhath Puja', 'Teej'],
        crafts: ['Madhubani paintings', 'Traditional pottery'],
        description: 'Home to the world-famous Madhubani paintings, a traditional art form passed down through generations.',
        ambientSound: 'flute'
    },
    {
        name: 'Dokra Village, Chhattisgarh',
        coordinates: [21.2787, 81.8661],
        traditions: ['Dokra metal craft', 'Tribal dances', 'Harvest songs'],
        festivals: ['Bastar Dussehra', 'Harvest Festival'],
        crafts: ['Dokra metalwork', 'Bamboo crafts'],
        description: 'Known for Dokra, a traditional non-ferrous metal casting technique using the lost-wax casting method.',
        ambientSound: 'birds'
    }
];

document.addEventListener('DOMContentLoaded', () => {
    initializeMap();
    setupEventListeners();
    loadCulturalItems();
});

function initializeMap() {
    // Initialize Leaflet map centered on India
    map = L.map('map').setView([23.0225, 72.5714], 5);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);
    
    // Add sample village markers
    sampleVillages.forEach(village => {
        addVillageMarker(village);
    });
}

function addVillageMarker(village) {
    const marker = L.marker(village.coordinates).addTo(map);
    
    marker.bindPopup(`
        <div style="color: #1a1a2e;">
            <h3 style="color: #f4a261; margin-bottom: 0.5rem;">${village.name}</h3>
            <p style="margin-bottom: 0.5rem;">${village.description}</p>
            <strong>Festivals:</strong> ${village.festivals.join(', ')}
        </div>
    `);
    
    marker.on('click', () => {
        showVillageInfo(village);
        playAmbientSound(village.ambientSound);
    });
    
    marker.on('mouseover', () => {
        if (ambientSoundEnabled) {
            playAmbientSound(village.ambientSound);
        }
    });
    
    markers.push({ marker, village });
}

function showVillageInfo(village) {
    const infoPanel = document.getElementById('village-info');
    const villageName = document.getElementById('village-name');
    const infoContent = document.getElementById('info-content');
    
    villageName.textContent = village.name;
    infoContent.innerHTML = `
        <p><strong>Description:</strong> ${village.description}</p>
        <div class="village-details">
            <div class="detail-item">
                <h4>🎭 Traditions</h4>
                <p>${village.traditions.join(', ')}</p>
            </div>
            <div class="detail-item">
                <h4>🎉 Festivals</h4>
                <p>${village.festivals.join(', ')}</p>
            </div>
            <div class="detail-item">
                <h4>🎨 Crafts</h4>
                <p>${village.crafts.join(', ')}</p>
            </div>
        </div>
        <div style="margin-top: 1.5rem;">
            <a href="trails.html" class="btn btn-primary">Plan a Visit</a>
        </div>
    `;
    
    infoPanel.classList.add('active');
}

function playAmbientSound(type) {
    if (!ambientSoundEnabled) return;
    
    // In a real implementation, you would play actual audio files
    // For now, we'll just log it
    console.log(`Playing ambient sound: ${type}`);
    
    // You can integrate actual audio files here
    // const audio = new Audio(`/sounds/${type}.mp3`);
    // audio.loop = true;
    // audio.volume = 0.3;
    // audio.play();
    // currentSound = audio;
}

function setupEventListeners() {
    document.getElementById('close-info').addEventListener('click', () => {
        document.getElementById('village-info').classList.remove('active');
        if (currentSound) {
            currentSound.pause();
            currentSound = null;
        }
    });
    
    document.getElementById('toggle-heatmap').addEventListener('click', toggleHeatmap);
    document.getElementById('toggle-sound').addEventListener('click', toggleSound);
}

function toggleHeatmap() {
    // Simple heatmap visualization using marker intensity
    // In production, use a proper heatmap library
    if (heatmapLayer) {
        map.removeLayer(heatmapLayer);
        heatmapLayer = null;
        document.getElementById('toggle-heatmap').textContent = 'Toggle Heatmap';
    } else {
        // Create a simple visual heatmap effect
        markers.forEach(({ marker, village }) => {
            const intensity = Math.random() * 0.5 + 0.5; // Simulated activity
            const circle = L.circle(village.coordinates, {
                radius: 50000 * intensity,
                fillColor: '#f4a261',
                fillOpacity: 0.3 * intensity,
                color: '#f4a261',
                weight: 1
            }).addTo(map);
            
            if (!heatmapLayer) {
                heatmapLayer = L.layerGroup();
            }
            heatmapLayer.addLayer(circle);
        });
        
        if (heatmapLayer) {
            map.addLayer(heatmapLayer);
        }
        document.getElementById('toggle-heatmap').textContent = 'Hide Heatmap';
    }
}

function toggleSound() {
    ambientSoundEnabled = !ambientSoundEnabled;
    document.getElementById('toggle-sound').textContent = 
        `Ambient Sounds: ${ambientSoundEnabled ? 'ON' : 'OFF'}`;
    
    if (!ambientSoundEnabled && currentSound) {
        currentSound.pause();
        currentSound = null;
    }
}

async function loadCulturalItems() {
    try {
        const response = await fetch('/api/items');
        const items = await response.json();
        
        // Add markers for cultural items with coordinates
        items.forEach(item => {
            if (item.coordinates && item.coordinates.length === 2) {
                const marker = L.marker(item.coordinates).addTo(map);
                marker.bindPopup(`
                    <div style="color: #1a1a2e;">
                        <h4 style="color: #f4a261;">${item.title}</h4>
                        <p>${item.description}</p>
                        <small>Type: ${item.type}</small>
                    </div>
                `);
            }
        });
    } catch (error) {
        console.error('Error loading cultural items:', error);
    }
}

