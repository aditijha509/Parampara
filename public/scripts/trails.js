

// ── Translation 
function tTrail(key) {
    if (typeof PARAMPARA_TRANSLATIONS === 'undefined') return key;
    const lang = localStorage.getItem('parampara_lang')
              || localStorage.getItem('language')
              || 'en';
    const dict = PARAMPARA_TRANSLATIONS[lang] || PARAMPARA_TRANSLATIONS['en'];
    return (dict && dict[key]) || (PARAMPARA_TRANSLATIONS['en'][key]) || key;
}

// ── Trail data — keys only, text lives in translations.js 
const sampleTrails = [
    {
        id: 'trail-1',
        titleKey:       'trail1_title',
        villageKey:     'trail1_village',
        location:       [22.5726, 88.3639],
        descKey:        'trail1_desc',
        image: 'https://cdn.sanity.io/images/vk5tclvq/production/b8e3393aa0c18abb3bb4ce48ef2e712813a30f8f-1658x1406.png?auto=format&q=40',
        host: {
            nameKey:    'trail1_host_name',
            roleKey:    'trail1_host_role',
            contact:    '+91 98765 43210',
            email:      'priya.kantha@example.com'
        },
        dosKeys:  ['trail1_do1','trail1_do2','trail1_do3','trail1_do4'],
        dontsKeys:['trail1_dont1','trail1_dont2','trail1_dont3','trail1_dont4'],
        route: {
            stationKey:   'trail1_station',
            distanceKey:  'trail1_distance',
            transportKey: 'trail1_transport'
        }
    },
    {
        id: 'trail-2',
        titleKey:       'trail2_title',
        villageKey:     'trail2_village',
        location:       [26.3537, 86.0719],
        descKey:        'trail2_desc',
        image:          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4sVlLc1XrhZXvPk3haP-bMeL0eqlGsZuRbQ&s',
        host: {
            nameKey:    'trail2_host_name',
            roleKey:    'trail2_host_role',
            contact:    '+91 98765 43211',
            email:      'ramesh.madhubani@example.com'
        },
        dosKeys:  ['trail2_do1','trail2_do2','trail2_do3','trail2_do4'],
        dontsKeys:['trail2_dont1','trail2_dont2','trail2_dont3','trail2_dont4'],
        route: {
            stationKey:   'trail2_station',
            distanceKey:  'trail2_distance',
            transportKey: 'trail2_transport'
        }
    }, 
    {
        id: 'trail-3',
        titleKey:       'trail3_title',
        villageKey:     'trail3_village',
        location:       [21.2787, 81.8661],
        descKey:        'trail3_desc',
        image:           'https://cdn.shopify.com/s/files/1/0444/9337/3595/files/IUJ_480x480.png?v=1602150639',
        host: {
            nameKey:    'trail3_host_name',
            roleKey:    'trail3_host_role',
            contact:    '+91 98765 43212',
            email:      'lakshmi.dokra@example.com'
        },
        dosKeys:  ['trail3_do1','trail3_do2','trail3_do3','trail3_do4'],
        dontsKeys:['trail3_dont1','trail3_dont2','trail3_dont3','trail3_dont4'],
        route: {
            stationKey:   'trail3_station',
            distanceKey:  'trail3_distance',
            transportKey: 'trail3_transport'
        }
    }
];

// ── Re-render on language change 
window.addEventListener('parampara:langchange', () => {
    displayTrails();
    // If detail modal is open, re-render it too
    const modal = document.getElementById('trail-detail-modal');
    if (modal && modal.classList.contains('active')) {
        const titleEl = document.getElementById('trail-detail-title');
        const openTrailId = titleEl && titleEl.dataset.openTrailId;
        if (openTrailId) showTrailDetails(openTrailId);
    }
});

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
    <div class="trail-item">
        <div class="trail-card" onclick="showTrailDetails('${trail.id}')">
            <div class="trail-card-header">
                <div>
                    <h3>${escapeHtml(tTrail(trail.titleKey))}</h3>
                    <div class="trail-card-location">
                        📍 ${escapeHtml(tTrail(trail.villageKey))}
                    </div>
                </div>
            </div>
            <p>${escapeHtml(tTrail(trail.descKey))}</p>
            <div class="trail-features">
                <span class="trail-feature">👤 ${tTrail('trail_feature_meet')}</span>
                <span class="trail-feature">🗺️ ${tTrail('trail_feature_route')}</span>
                <span class="trail-feature">📋 ${tTrail('trail_feature_dos')}</span>
            </div>
            <div class="trail-actions">
                <button class="btn btn-primary"
                    onclick="event.stopPropagation(); showTrailDetails('${trail.id}')">
                    ${tTrail('trail_btn_details')}
                </button>
                <button class="btn btn-secondary"
                    onclick="event.stopPropagation(); openRoute('${trail.id}')">
                    ${tTrail('trail_btn_directions')}
                </button>
            </div>
        </div>
                     <div class="trail-image-wrap">
            <img src="${trail.image}" alt="${escapeHtml(tTrail(trail.titleKey))}" class="trail-image" loading="lazy"> 
                    </div>
     </div>
`).join('');
}

function showTrailDetails(trailId) {
    const trail = sampleTrails.find(t => t.id === trailId);
    if (!trail) return;

    // Store which trail is open so we can re-render on lang change
    const titleEl = document.getElementById('trail-detail-title');
    titleEl.textContent        = tTrail(trail.titleKey);
    titleEl.dataset.openTrailId = trailId;

    document.getElementById('trail-detail-content').innerHTML = `
        <div class="trail-detail-section">
            <h4>${tTrail('trail_about')}</h4>
            <p>${escapeHtml(tTrail(trail.descKey))}</p>
            <p><strong>${tTrail('trail_location_label')}:</strong> ${escapeHtml(tTrail(trail.villageKey))}</p>
        </div>

        <div class="host-info">
            <h5>👤 ${tTrail('trail_meet_host')}</h5>
            <div class="host-contact">
                <p><strong>${escapeHtml(tTrail(trail.host.nameKey))}</strong></p>
                <p>${escapeHtml(tTrail(trail.host.roleKey))}</p>
                <p>📞 ${escapeHtml(trail.host.contact)}</p>
                <p>✉️ ${escapeHtml(trail.host.email)}</p>
            </div>
        </div>

        <div class="dos-donts">
            <div class="dos-list">
                <h5>✅ ${tTrail('trail_dos')}</h5>
                <ul>
                    ${trail.dosKeys.map(k => `<li>${escapeHtml(tTrail(k))}</li>`).join('')}
                </ul>
            </div>
            <div class="donts-list">
                <h5>❌ ${tTrail('trail_donts')}</h5>
                <ul>
                    ${trail.dontsKeys.map(k => `<li>${escapeHtml(tTrail(k))}</li>`).join('')}
                </ul>
            </div>
        </div>

        <div class="route-info">
            <h4>🗺️ ${tTrail('trail_route_planner')}</h4>
            <p><strong>${tTrail('trail_nearest_station')}:</strong> ${escapeHtml(tTrail(trail.route.stationKey))}</p>
            <p><strong>${tTrail('trail_distance')}:</strong> ${escapeHtml(tTrail(trail.route.distanceKey))}</p>
            <p><strong>${tTrail('trail_transport')}:</strong> ${escapeHtml(tTrail(trail.route.transportKey))}</p>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${trail.location[0]},${trail.location[1]}"
               target="_blank" class="btn btn-primary" style="margin-top:1rem;">
                ${tTrail('trail_open_maps')}
            </a>
        </div>

        <div style="margin-top:2rem;padding:1.5rem;background:rgba(244,162,97,0.2);border-radius:var(--border-radius);">
            <h4 style="color:var(--accent-color);margin-bottom:1rem;">📱 ${tTrail('trail_checkin_title')}</h4>
            <p style="margin-bottom:1rem;">${tTrail('trail_checkin_desc')}</p>
            <button class="btn btn-primary" onclick="checkIn('${trail.id}')">
                ${tTrail('trail_checkin_btn')}
            </button>
        </div>
    `;

    document.getElementById('trail-detail-modal').classList.add('active');
}

function openRoute(trailId) {
    const trail = sampleTrails.find(t => t.id === trailId);
    if (!trail) return;
    window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${trail.location[0]},${trail.location[1]}`,
        '_blank'
    );
}

async function checkIn(trailId) {
    const trail = sampleTrails.find(t => t.id === trailId);
    if (!trail) return;

    if (!navigator.geolocation) {
        alert(tTrail('trail_geo_unsupported'));
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const userId = localStorage.getItem('userId') || `user_${Date.now()}`;
            const checkInData = {
                userId,
                village: tTrail(trail.villageKey),
                coordinates: [position.coords.latitude, position.coords.longitude]
            };
            try {
                const response = await fetch('/api/checkin', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(checkInData)
                });
                if (response.ok) {
                    const result = await response.json();
                    if (result.badges && result.badges.length > 0) {
                        alert(`${tTrail('trail_checkin_badge')}: ${result.badges[result.badges.length - 1].name}`);
                    } else {
                        alert(tTrail('trail_checkin_success'));
                    }
                } else {
                    alert(tTrail('trail_checkin_error'));
                }
            } catch (error) {
                console.error('Error checking in:', error);
                alert(tTrail('trail_checkin_error'));
            }
        },
        (error) => {
            alert(tTrail('trail_geo_error'));
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

window.showTrailDetails = showTrailDetails;
window.openRoute        = openRoute;
window.checkIn          = checkIn;
window.openRoute = openRoute;
window.checkIn = checkIn;



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
