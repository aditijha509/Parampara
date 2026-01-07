const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Sample data storage (in production, use a database)
let culturalItems = [];
let heritagePaths = [];
let userProgress = {};
let villagePosts = [];

// Initialize with sample data
function initializeSampleData() {
    // Sample cultural items
    culturalItems = [
        {
            id: '1',
            title: 'Kantha Embroidery Patterns',
            type: 'visual',
            location: 'Kantha Village, Bengal',
            coordinates: [22.5726, 88.3639],
            description: 'Traditional Kantha embroidery where old saris are layered and stitched with running stitches. Each pattern tells a story - the lotus represents purity, fish symbolize fertility, and trees represent life.',
            imageUrl: '',
            audioUrl: '',
            tags: ['embroidery', 'textile', 'bengal', 'kantha'],
            timestamp: new Date().toISOString()
        },
        {
            id: '2',
            title: 'Madhubani Painting: The Story of Radha-Krishna',
            type: 'visual',
            location: 'Madhubani Village, Bihar',
            coordinates: [26.3537, 86.0719],
            description: 'A traditional Madhubani painting depicting the divine love story of Radha and Krishna. The vibrant colors and geometric patterns are characteristic of this ancient art form.',
            imageUrl: '',
            audioUrl: '',
            tags: ['painting', 'madhubani', 'bihar', 'folk-art'],
            timestamp: new Date().toISOString()
        },
        {
            id: '3',
            title: 'The Tale of Bonbibi',
            type: 'story',
            location: 'Sundarbans Village',
            coordinates: [21.9497, 88.8156],
            description: 'An oral folk tale passed down through generations about Bonbibi, the forest goddess who protects the people of Sundarbans from tigers. This story reflects the unique relationship between humans and nature in this region.',
            imageUrl: '',
            audioUrl: '',
            tags: ['folklore', 'sundarbans', 'story', 'oral-tradition'],
            timestamp: new Date().toISOString()
        },
        {
            id: '4',
            title: 'Dokra Metal Craft: The Lost-Wax Technique',
            type: 'visual',
            location: 'Dokra Village, Chhattisgarh',
            coordinates: [21.2787, 81.8661],
            description: 'Traditional non-ferrous metal casting using the lost-wax casting method. This ancient technique has been preserved for over 4000 years and is still practiced by tribal communities.',
            imageUrl: '',
            audioUrl: '',
            tags: ['metalwork', 'dokra', 'craft', 'tribal'],
            timestamp: new Date().toISOString()
        }
    ];

    // Sample heritage path
    heritagePaths = [
        {
            id: 'path-1',
            title: 'The Journey of Kantha Stitch',
            description: 'Follow the evolution of Kantha embroidery from its origins in rural Bengal to its modern interpretations. This path takes you through villages, stories, and the symbolism behind each stitch.',
            items: ['1'],
            theme: 'Embroidery Traditions'
        }
    ];

    // Sample village posts
    villagePosts = [
        {
            id: 'post-1',
            village: 'Kantha Village, Bengal',
            title: 'Upcoming Durga Puja Festival',
            content: 'Join us for the grand Durga Puja celebration starting next week! Local artisans will showcase their latest Kantha work, and there will be traditional music and dance performances.',
            type: 'festival',
            date: '2024-10-15',
            timestamp: new Date().toISOString()
        },
        {
            id: 'post-2',
            village: 'Sundarbans Village',
            title: 'Honey Collection Season',
            content: 'The honey collection season has begun! Local honey collectors are venturing into the forest. This is a great time to learn about traditional honey collection methods and taste fresh wild honey.',
            type: 'harvest',
            date: '2024-10-20',
            timestamp: new Date().toISOString()
        },
        {
            id: 'post-3',
            village: 'Madhubani Village, Bihar',
            title: 'Annual Mela - Art and Craft Fair',
            content: 'The annual village mela is happening this month! Over 50 local artists will display their Madhubani paintings. There will be live painting demonstrations and workshops for visitors.',
            type: 'mela',
            date: '2024-11-01',
            timestamp: new Date().toISOString()
        }
    ];
}

// Initialize sample data on server start
initializeSampleData();

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Routes for Cultural Items
app.get('/api/items', (req, res) => {
    res.json(culturalItems);
});

app.post('/api/items', (req, res) => {
    try {
        if (!req.body.title || !req.body.type || !req.body.location) {
            return res.status(400).json({ error: 'Missing required fields: title, type, location' });
        }
        
        const newItem = {
            id: Date.now().toString(),
            title: req.body.title,
            type: req.body.type, // 'audio', 'visual', 'story'
            location: req.body.location,
            coordinates: req.body.coordinates || null,
            description: req.body.description || '',
            imageUrl: req.body.imageUrl || '',
            audioUrl: req.body.audioUrl || '',
            tags: Array.isArray(req.body.tags) ? req.body.tags : (req.body.tags ? [req.body.tags] : []),
            timestamp: new Date().toISOString()
        };
        culturalItems.push(newItem);
        res.json(newItem);
    } catch (error) {
        res.status(500).json({ error: 'Error adding item' });
    }
});

// API Routes for Heritage Paths
app.get('/api/paths', (req, res) => {
    res.json(heritagePaths);
});

app.post('/api/paths', (req, res) => {
    try {
        if (!req.body.title || !req.body.theme) {
            return res.status(400).json({ error: 'Missing required fields: title, theme' });
        }
        
        const newPath = {
            id: Date.now().toString(),
            title: req.body.title,
            description: req.body.description || '',
            items: Array.isArray(req.body.items) ? req.body.items : [],
            theme: req.body.theme
        };
        heritagePaths.push(newPath);
        res.json(newPath);
    } catch (error) {
        res.status(500).json({ error: 'Error creating path' });
    }
});

// API Routes for User Progress
app.get('/api/progress/:userId', (req, res) => {
    const userId = req.params.userId;
    res.json(userProgress[userId] || { badges: [], quests: [] });
});

app.post('/api/progress/:userId', (req, res) => {
    const userId = req.params.userId;
    if (!userProgress[userId]) {
        userProgress[userId] = { badges: [], quests: [], checkIns: [] };
    }
    userProgress[userId] = { ...userProgress[userId], ...req.body };
    res.json(userProgress[userId]);
});

// API Routes for Village Posts
app.get('/api/posts', (req, res) => {
    res.json(villagePosts);
});

app.post('/api/posts', (req, res) => {
    const newPost = {
        id: Date.now().toString(),
        village: req.body.village,
        title: req.body.title,
        content: req.body.content,
        type: req.body.type, // 'festival', 'harvest', 'mela'
        date: req.body.date,
        timestamp: new Date().toISOString()
    };
    villagePosts.push(newPost);
    res.json(newPost);
});

// API Route for AI Chat (simplified - in production, integrate with AI service)
app.post('/api/chat', (req, res) => {
    try {
        if (!req.body.question) {
            return res.status(400).json({ error: 'Question is required' });
        }
        
        const question = req.body.question.toLowerCase();
        let response = "I'm a cultural curator. Based on our archive, ";
        
        // Enhanced keyword matching (in production, use proper AI/NLP)
        if (question.includes('blue') && question.includes('door')) {
            response += "in many villages, doors are painted blue to ward off evil spirits and bring prosperity to the home. This tradition is especially common in rural areas where it's believed to protect the household.";
        } else if (question.includes('kantha') || question.includes('embroidery')) {
            response += "Kantha is a traditional embroidery style from Bengal, where old saris are layered and stitched together with running stitches to create beautiful patterns. Each pattern has symbolic meaning - lotus for purity, fish for fertility, and trees for life.";
        } else if (question.includes('madhubani') || question.includes('painting')) {
            response += "Madhubani painting is a traditional art form from Bihar, characterized by vibrant colors and geometric patterns. These paintings often depict mythological stories, nature, and daily life.";
        } else if (question.includes('dokra') || question.includes('metal')) {
            response += "Dokra is a traditional metal casting technique using the lost-wax method, practiced by tribal communities in Chhattisgarh. This ancient craft has been preserved for over 4000 years.";
        } else if (question.includes('festival') || question.includes('celebration')) {
            response += "rural festivals are deeply connected to agricultural cycles and local legends. Each village has unique celebrations tied to their heritage, like Durga Puja in Bengal, Chhath in Bihar, and harvest festivals across regions.";
        } else if (question.includes('sundarbans') || question.includes('tiger')) {
            response += "The Sundarbans region has a unique relationship with nature. Folk tales like the story of Bonbibi reflect the deep connection between the people and the forest, where tigers and humans coexist in a delicate balance.";
        } else if (question.includes('tradition') || question.includes('culture')) {
            response += "rural traditions are living practices passed down through generations. They include oral stories, craft techniques, festival rituals, and community practices that define each region's unique identity.";
        } else {
            response += "I can help you learn about rural traditions, crafts, festivals, and stories. Try asking about Kantha embroidery, Madhubani paintings, village festivals, or the traditions of specific regions like Sundarbans or Bengal.";
        }
        
        res.json({ response });
    } catch (error) {
        res.status(500).json({ error: 'Error processing chat request' });
    }
});

// API Route for GPS Check-in
app.post('/api/checkin', (req, res) => {
    const { userId, village, coordinates } = req.body;
    if (!userProgress[userId]) {
        userProgress[userId] = { badges: [], quests: [], checkIns: [] };
    }
    const checkIn = {
        village,
        coordinates,
        timestamp: new Date().toISOString()
    };
    userProgress[userId].checkIns.push(checkIn);
    
    // Award badge for first check-in
    if (userProgress[userId].checkIns.length === 1) {
        userProgress[userId].badges.push({
            name: 'First Explorer',
            description: 'Visited your first village',
            date: new Date().toISOString()
        });
    }
    
    res.json({ success: true, checkIn, badges: userProgress[userId].badges });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n✨ Parampara server running on http://localhost:${PORT}`);
    console.log(`📚 Sample data initialized:`);
    console.log(`   - ${culturalItems.length} cultural items`);
    console.log(`   - ${heritagePaths.length} heritage paths`);
    console.log(`   - ${villagePosts.length} village posts\n`);
});

