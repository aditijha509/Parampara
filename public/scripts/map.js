// Map Page JavaScript

let map;
let markers = [];
let heatmapLayer = null;
let ambientSoundEnabled = true;
let currentSound = null;
let currentTileLayer;
let heatmapMarkers = [];

let currentLanguage =
    localStorage.getItem("language") || "en";

document.addEventListener('DOMContentLoaded', () => {

    const selector = document.getElementById("language-selector");
    selector.value = currentLanguage;

    // selector.addEventListener("change", (e) => {
    //     currentLanguage = e.target.value;
    //     localStorage.setItem("language", currentLanguage);

    //     // Re-apply language labels on existing style
    //     setMapLanguage(currentLanguage);
    //     addVillageMarkers(); // re-render markers with new language
    //     translatePage();
    // });
    selector.addEventListener("change", (e) => {

    currentLanguage = e.target.value;

    localStorage.setItem("language", currentLanguage);

    if (map && map.isStyleLoaded()) {
        setMapLanguage(currentLanguage);
    }

    addVillageMarkers();
    translatePage();
});

    initializeMap();       // map must come first
    setupEventListeners();
    loadCulturalItems();
    translatePage();
});

const sampleVillages = [
{
    name: {
        en: "Sundarbans Village",
        hi: "सुंदरबन गांव",
        mr: "सुंदरबन गाव"
    },
    coordinates: [21.9497, 88.8156],
    traditions: {
        en: ["Folk tales about tigers", "Traditional fishing methods", "Honey collection rituals"],
        hi: ["बाघों की लोककथाएँ", "पारंपरिक मछली पकड़ने की विधियाँ", "शहद संग्रह अनुष्ठान"],
        mr: ["वाघांच्या लोककथा", "पारंपरिक मासेमारी पद्धती", "मध संकलन विधी"]
    },
    festivals: {
        en: ["Bonbibi Puja", "Honey Festival"],
        hi: ["बोनबिबी पूजा", "हनी फेस्टिवल"],
        mr: ["बोनबिबी पूजा", "हनी फेस्टिवल"]
    },
    crafts: {
        en: ["Coconut shell crafts", "Traditional boat making"],
        hi: ["नारियल शिल्प", "पारंपरिक नाव निर्माण"],
        mr: ["नारळ हस्तकला", "पारंपरिक होडी निर्मिती"]
    },
    description: {
        en: "A village in the Sundarbans known for its unique relationship with nature and tigers.",
        hi: "सुंदरबन का एक गांव जो प्रकृति और बाघों के साथ अपने अनोखे संबंध के लिए प्रसिद्ध है।",
        mr: "निसर्ग आणि वाघांशी असलेल्या अनोख्या नात्यासाठी प्रसिद्ध गाव."
    },
    ambientSound: "birds"
},

{
    name: {
        en: "Kantha Village, Bengal",
        hi: "कांथा गांव, बंगाल",
        mr: "कांथा गाव, बंगाल"
    },
    coordinates: [22.5726, 88.3639],
    traditions: {
        en: ["Kantha embroidery", "Oral storytelling", "Traditional songs"],
        hi: ["कांथा कढ़ाई", "मौखिक कथाएँ", "पारंपरिक गीत"],
        mr: ["कांथा भरतकाम", "लोककथा", "पारंपरिक गीते"]
    },
    festivals: {
        en: ["Durga Puja", "Kali Puja"],
        hi: ["दुर्गा पूजा", "काली पूजा"],
        mr: ["दुर्गा पूजा", "काली पूजा"]
    },
    crafts: {
        en: ["Kantha stitch work", "Traditional sarees"],
        hi: ["कांथा सिलाई", "पारंपरिक साड़ियाँ"],
        mr: ["कांथा शिवणकाम", "पारंपरिक साड्या"]
    },
    description: {
        en: "Famous for Kantha embroidery, where old saris are layered and stitched.",
        hi: "कांथा कढ़ाई के लिए प्रसिद्ध, जिसमें पुरानी साड़ियों को जोड़कर सुंदर डिज़ाइन बनाए जाते हैं।",
        mr: "कांथा भरतकामासाठी प्रसिद्ध."
    },
    ambientSound: "flute"
},

{
    name: {
        en: "Madhubani Village, Bihar",
        hi: "मधुबनी गांव, बिहार",
        mr: "मधुबनी गाव, बिहार"
    },
    coordinates: [26.3537, 86.0719],
    traditions: {
        en: ["Madhubani painting", "Mithila art", "Folk songs"],
        hi: ["मधुबनी चित्रकला", "मिथिला कला", "लोकगीत"],
        mr: ["मधुबनी चित्रकला", "मिथिला कला", "लोकगीते"]
    },
    festivals: {
        en: ["Chhath Puja", "Teej"],
        hi: ["छठ पूजा", "तीज"],
        mr: ["छठ पूजा", "तीज"]
    },
    crafts: {
        en: ["Madhubani paintings", "Traditional pottery"],
        hi: ["मधुबनी पेंटिंग", "मिट्टी के बर्तन"],
        mr: ["मधुबनी चित्रे", "मातीची भांडी"]
    },
    description: {
        en: "Home to the world-famous Madhubani paintings.",
        hi: "विश्व प्रसिद्ध मधुबनी चित्रकला का केंद्र।",
        mr: "जगप्रसिद्ध मधुबनी चित्रकलेचे केंद्र."
    },
    ambientSound: "flute"
},

{
    name: {
        en: "Dokra Village, Chhattisgarh",
        hi: "डोकरा गांव, छत्तीसगढ़",
        mr: "डोकरा गाव, छत्तीसगड"
    },
    coordinates: [21.2787, 81.8661],
    traditions: {
        en: ["Dokra metal craft", "Tribal dances", "Harvest songs"],
        hi: ["डोकरा धातु कला", "जनजातीय नृत्य", "फसल गीत"],
        mr: ["डोकरा धातुकाम", "आदिवासी नृत्य", "पीक गीते"]
    },
    festivals: {
        en: ["Bastar Dussehra", "Harvest Festival"],
        hi: ["बस्तर दशहरा", "फसल उत्सव"],
        mr: ["बस्तर दसरा", "पीक उत्सव"]
    },
    crafts: {
        en: ["Dokra metalwork", "Bamboo crafts"],
        hi: ["डोकरा धातुकला", "बांस शिल्प"],
        mr: ["डोकरा धातुकाम", "बांबू हस्तकला"]
    },
    description: {
        en: "Known for Dokra metal casting.",
        hi: "डोकरा धातु ढलाई कला के लिए प्रसिद्ध।",
        mr: "डोकरा धातुकामासाठी प्रसिद्ध."
    },
    ambientSound: "birds"
}
];

function getTranslation() {
    return translations[currentLanguage];
}

function translatePage() {
    const t = getTranslation();

    document.querySelector(".map-header h2").textContent =
        t.mapTitle;

    document.querySelector(".map-header p").textContent =
        t.mapDescription;

    document.getElementById("village-name").textContent =
        t.selectVillage;

    document.getElementById("info-content").innerHTML =
        `<p>${t.clickVillage}</p>`;

    const heatmapBtn =
        document.getElementById("toggle-heatmap");

    if (heatmapLayer) {
        heatmapBtn.textContent =
            t.hideHeatmap;
    } else {
        heatmapBtn.textContent =
            t.toggleHeatmap;
    }

    document.getElementById("toggle-sound")
        .textContent =
        ambientSoundEnabled
            ? t.soundOn
            : t.soundOff;
}



function initializeMap() {
    map = new maplibregl.Map({
        container: 'map',
        style: getMapStyle(currentLanguage),
        center: [78.9629, 22.5937], // centre of India [lng, lat]
        zoom: 5
    });
    window.map = map;

    map.addControl(new maplibregl.NavigationControl());

    // Only add markers AFTER the map style has fully loaded
    map.on('load', () => {
        console.log("MAP LOADED");
        setMapLanguage(currentLanguage);
        addVillageMarkers();
    });
}
// function getMapStyle(language) {
  
   
    function getMapStyle() {
    return "/api/map-style";
}


function setMapLanguage(lang) {

    const style = map.getStyle();

    if (!style || !style.layers) {
        console.warn("Style not loaded yet");
        return;
    }

    style.layers.forEach(layer => {

        if (
            layer.type === "symbol" &&
            layer.layout &&
            layer.layout["text-field"]
        ) {

            if (lang === "hi") {

                map.setLayoutProperty(
                    layer.id,
                    "text-field",
                    [
                        "coalesce",
                        ["get", "name:hi"],
                        ["get", "name"]
                    ]
                );

            } else if (lang === "mr") {

                map.setLayoutProperty(
                    layer.id,
                    "text-field",
                    [
                        "coalesce",
                        ["get", "name:mr"],
                        ["get", "name:hi"],
                        ["get", "name"]
                    ]
                );

            } else {

                map.setLayoutProperty(
                    layer.id,
                    "text-field",
                    ["get", "name"]
                );

            }
        }
    });
}


function addVillageMarker(village) {
    const el = document.createElement('div');

    el.className = 'marker';

    // IMPORTANT: make it clickable
    el.style.width = "20px";
    el.style.height = "20px";
    el.style.borderRadius = "50%";
    el.style.background = "#f4a261";
    el.style.border = "2px solid white";
    el.style.cursor = "pointer";
    el.style.pointerEvents = "auto";

    const marker = new maplibregl.Marker(el)
        .setLngLat([village.coordinates[1], village.coordinates[0]])
        .addTo(map);

    // safer: attach via marker element
    marker.getElement().addEventListener('click', (e) => {
        e.stopPropagation(); // important
        showVillageInfo(village);
        playAmbientSound(village.ambientSound);
    });

    markers.push(marker);
}

function addVillageMarkers() {
    // Remove existing markers
    markers.forEach(m => m.remove());
    markers = [];

    sampleVillages.forEach(village => addVillageMarker(village));
}

function showVillageInfo(village) {

    const t = getTranslation();

    const infoPanel =
        document.getElementById('village-info');

    const villageName =
        document.getElementById('village-name');

    const infoContent =
        document.getElementById('info-content');

    // villageName.textContent = village.name;
    villageName.textContent =
    village.name[currentLanguage];

    infoContent.innerHTML = `
        <p>
            <strong>${t.description}:</strong>
           
            ${village.description[currentLanguage]}
        </p>

        <div class="village-details">

            <div class="detail-item">
                <h4>🎭 ${t.traditions}</h4>
              ${village.traditions[currentLanguage].join(', ')}
            </div>

            <div class="detail-item">
                <h4>🎉 ${t.festivals}</h4>
                ${village.festivals[currentLanguage].join(', ')}
            </div>

            <div class="detail-item">
                <h4>🎨 ${t.crafts}</h4>
                ${village.crafts[currentLanguage].join(', ')}
            </div>

        </div>

        <div style="margin-top:1.5rem;">
            <a href="trails.html"
               class="btn btn-primary">
               ${t.planVisit}
            </a>
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

    const closeBtn = document.getElementById('close-info');
    const heatmapBtn = document.getElementById('toggle-heatmap');
    const soundBtn = document.getElementById('toggle-sound');

    if (!closeBtn || !heatmapBtn || !soundBtn) {
        console.error("❌ Missing DOM elements:", {
            closeBtn,
            heatmapBtn,
            soundBtn
        });
        return;
    }

    closeBtn.addEventListener('click', () => {
        document.getElementById('village-info').classList.remove('active');
        if (currentSound) {
            currentSound.pause();
            currentSound = null;
        }
    });

    heatmapBtn.addEventListener('click', toggleHeatmap);
    soundBtn.addEventListener('click', toggleSound);
}



function toggleHeatmap() {
    const t = getTranslation();

    if (heatmapLayer) {
        // Remove heatmap overlay divs
        heatmapMarkers.forEach(m => m.remove());
        heatmapMarkers = [];
        heatmapLayer = null;
        document.getElementById('toggle-heatmap').textContent = t.toggleHeatmap;
    } else {
        heatmapLayer = true; // flag

        sampleVillages.forEach(village => {
            const intensity = Math.random() * 0.5 + 0.5;
            const size = Math.round(60 * intensity);

            const el = document.createElement('div');
            el.style.cssText = `
                width:${size}px; height:${size}px;
                border-radius:50%;
                background:rgba(244,162,97,${0.35 * intensity});
                border:1px solid rgba(244,162,97,0.6);
                pointer-events:none;
            `;

            const hm = new maplibregl.Marker({ element: el, anchor: 'center' })
                .setLngLat([village.coordinates[1], village.coordinates[0]])
                .addTo(map);

            heatmapMarkers.push(hm);
        });

        document.getElementById('toggle-heatmap').textContent = t.hideHeatmap;
    }
}


function toggleSound() {
    ambientSoundEnabled = !ambientSoundEnabled;
  const t = getTranslation();

document.getElementById('toggle-sound')
.textContent =
ambientSoundEnabled
? t.soundOn
: t.soundOff;
    
    if (!ambientSoundEnabled && currentSound) {
        currentSound.pause();
        currentSound = null;
    }
}



async function loadCulturalItems() {
    try {
        const response = await fetch('/api/items');

        if (!response.ok) {
            throw new Error("Failed to load cultural items");
        }

        const items = await response.json();

        items.forEach(item => {
            if (item.coordinates && item.coordinates.length === 2) {

                const el = document.createElement('div');
                el.className = 'cultural-marker';

                const marker = new maplibregl.Marker(el)
                    .setLngLat([item.coordinates[1], item.coordinates[0]])
                    .addTo(map);

                el.addEventListener("click", () => {
                    showPopup(item); // better than alert
                });
            }
        });

    } catch (error) {
        console.error("Error loading cultural items:", error);
    }
}

// const backToTopBtn = document.getElementById("backToTopBtn");
const backToTopBtn = document.getElementById("backToTopBtn");

if (backToTopBtn) {

    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add("show");
        } else {
            backToTopBtn.classList.remove("show");
        }
    });

    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

}

