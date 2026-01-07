// Heritage Trails Page JavaScript

// Sample trail data
const sampleTrails = [
    {
        id: 'trail-1',
        title: 'Kantha Embroidery Trail',
        village: 'Kantha Village, Bengal',
        location: [22.5726, 88.3639],
        description: 'Experience the beautiful art of Kantha embroidery, where old saris are transformed into stunning works of art through intricate stitching.',
        host: {
            name: 'Priya Devi',
            role: 'Master Kantha Artist',
            contact: '+91 98765 43210',
            email: 'priya.kantha@example.com'
        },
        dos: [
            'Ask before taking photos of the artist at work',
            'Buy crafts directly from the weaver',
            'Respect the traditional techniques',
            'Learn about the symbolism behind patterns'
        ],
        donts: [
            'Don\'t touch unfinished work without permission',
            'Don\'t bargain aggressively',
            'Don\'t interrupt during prayer times',
            'Don\'t take photos of religious symbols without asking'
        ],
        route: {
            nearestStation: 'Howrah Railway Station',
            distance: '45 km',
            transport: 'Local bus or taxi available'
        }
    },
    {
        id: 'trail-2',
        title: 'Madhubani Painting Experience',
        village: 'Madhubani Village, Bihar',
        location: [26.3537, 86.0719],
        description: 'Discover the world-famous Madhubani paintings, a traditional art form that tells stories through vibrant colors and intricate patterns.',
        host: {
            name: 'Ramesh Kumar',
            role: 'Cultural Host & Artist',
            contact: '+91 98765 43211',
            email: 'ramesh.madhubani@example.com'
        },
        dos: [
            'Participate in painting workshops',
            'Support local artists by purchasing authentic work',
            'Learn about the stories behind each painting',
            'Respect the traditional color palette'
        ],
        donts: [
            'Don\'t copy designs without permission',
            'Don\'t use flash photography on paintings',
            'Don\'t rush the artists',
            'Don\'t bring large groups without prior notice'
        ],
        route: {
            nearestStation: 'Darbhanga Railway Station',
            distance: '30 km',
            transport: 'Auto-rickshaw or shared taxi'
        }
    },
    {
        id: 'trail-3',
        title: 'Dokra Metal Craft Trail',
        village: 'Dokra Village, Chhattisgarh',
        location: [21.2787, 81.8661],
        description: 'Witness the ancient art of Dokra metal casting, a technique passed down through generations using the lost-wax method.',
        host: {
            name: 'Lakshmi Bai',
            role: 'Dokra Artisan & Community Leader',
            contact: '+91 98765 43212',
            email: 'lakshmi.dokra@example.com'
        },
        dos: [
            'Watch the casting process from a safe distance',
            'Buy directly from the artisan families',
            'Learn about the tribal traditions',
            'Respect the workshop space'
        ],
        donts: [
            'Don\'t touch hot metal or tools',
            'Don\'t disturb during the casting process',
            'Don\'t take photos without permission',
            'Don\'t bargain disrespectfully'
        ],
        route: {
            nearestStation: 'Raipur Railway Station',
            distance: '120 km',
            transport: 'Bus or private taxi recommended'
        }
    }
];

document.addEventListener('DOMContentLoaded', () => {
    displayTrails();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('close-trail-modal').addEventListener('click', () => {
        document.getElementById('trail-detail-modal').classList.remove('active');
    });
}

function displayTrails() {
    const trailsList = document.getElementById('trails-list');
    
    trailsList.innerHTML = sampleTrails.map(trail => `
        <div class="trail-card" onclick="showTrailDetails('${trail.id}')">
            <div class="trail-card-header">
                <div>
                    <h3>${escapeHtml(trail.title)}</h3>
                    <div class="trail-card-location">
                        📍 ${escapeHtml(trail.village)}
                    </div>
                </div>
            </div>
            <p>${escapeHtml(trail.description)}</p>
            <div class="trail-features">
                <span class="trail-feature">👤 Meet the Artist</span>
                <span class="trail-feature">🗺️ Route Guide</span>
                <span class="trail-feature">📋 Dos & Don'ts</span>
            </div>
            <div class="trail-actions">
                <button class="btn btn-primary" onclick="event.stopPropagation(); showTrailDetails('${trail.id}')">
                    View Details
                </button>
                <button class="btn btn-secondary" onclick="event.stopPropagation(); openRoute('${trail.id}')">
                    Get Directions
                </button>
            </div>
        </div>
    `).join('');
}

function showTrailDetails(trailId) {
    const trail = sampleTrails.find(t => t.id === trailId);
    if (!trail) return;
    
    document.getElementById('trail-detail-title').textContent = trail.title;
    
    const content = document.getElementById('trail-detail-content');
    content.innerHTML = `
        <div class="trail-detail-section">
            <h4>About This Trail</h4>
            <p>${escapeHtml(trail.description)}</p>
            <p><strong>Location:</strong> ${escapeHtml(trail.village)}</p>
        </div>
        
        <div class="host-info">
            <h5>👤 Meet Your Cultural Host</h5>
            <div class="host-contact">
                <p><strong>${escapeHtml(trail.host.name)}</strong></p>
                <p>${escapeHtml(trail.host.role)}</p>
                <p>📞 ${escapeHtml(trail.host.contact)}</p>
                <p>✉️ ${escapeHtml(trail.host.email)}</p>
            </div>
        </div>
        
        <div class="dos-donts">
            <div class="dos-list">
                <h5>✅ Dos</h5>
                <ul>
                    ${trail.dos.map(item => `<li>${escapeHtml(item)}</li>`).join('')}
                </ul>
            </div>
            <div class="donts-list">
                <h5>❌ Don'ts</h5>
                <ul>
                    ${trail.donts.map(item => `<li>${escapeHtml(item)}</li>`).join('')}
                </ul>
            </div>
        </div>
        
        <div class="route-info">
            <h4>🗺️ Route Planner</h4>
            <p><strong>Nearest Railway Station:</strong> ${escapeHtml(trail.route.nearestStation)}</p>
            <p><strong>Distance from Station:</strong> ${escapeHtml(trail.route.distance)}</p>
            <p><strong>Transport Options:</strong> ${escapeHtml(trail.route.transport)}</p>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${trail.location[0]},${trail.location[1]}" 
               target="_blank" class="btn btn-primary" style="margin-top: 1rem;">
                Open in Google Maps
            </a>
        </div>
        
        <div style="margin-top: 2rem; padding: 1.5rem; background: rgba(244, 162, 97, 0.2); border-radius: var(--border-radius);">
            <h4 style="color: var(--accent-color); margin-bottom: 1rem;">📱 Check-in Feature</h4>
            <p style="margin-bottom: 1rem;">When you visit this village, use GPS to check-in and unlock a digital badge!</p>
            <button class="btn btn-primary" onclick="checkIn('${trail.id}')">
                Check-in (GPS Required)
            </button>
        </div>
    `;
    
    document.getElementById('trail-detail-modal').classList.add('active');
}

function openRoute(trailId) {
    const trail = sampleTrails.find(t => t.id === trailId);
    if (!trail) return;
    
    const url = `https://www.google.com/maps/dir/?api=1&destination=${trail.location[0]},${trail.location[1]}`;
    window.open(url, '_blank');
}

async function checkIn(trailId) {
    const trail = sampleTrails.find(t => t.id === trailId);
    if (!trail) return;
    
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser.');
        return;
    }
    
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const userId = localStorage.getItem('userId') || `user_${Date.now()}`;
            const checkInData = {
                userId,
                village: trail.village,
                coordinates: [position.coords.latitude, position.coords.longitude]
            };
            
            try {
                const response = await fetch('/api/checkin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(checkInData)
                });
                
                if (response.ok) {
                    const result = await response.json();
                    if (result.badges && result.badges.length > 0) {
                        alert(`Check-in successful! You earned: ${result.badges[result.badges.length - 1].name}`);
                    } else {
                        alert('Check-in successful! Thank you for visiting.');
                    }
                } else {
                    alert('Error checking in. Please try again.');
                }
            } catch (error) {
                console.error('Error checking in:', error);
                alert('Error checking in. Please try again.');
            }
        },
        (error) => {
            alert('Unable to get your location. Please enable GPS and try again.');
            console.error('Geolocation error:', error);
        }
    );
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Make functions available globally
window.showTrailDetails = showTrailDetails;
window.openRoute = openRoute;
window.checkIn = checkIn;

