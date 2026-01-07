# Parampara

A community-driven digital archive for preserving rural cultural heritage. Parampara connects traditions with the world through interactive maps, audio stories, visual galleries, and responsible tourism.

## 🌟 Features

### Core Features
- **Cultural Mapping**: Interactive map-based exploration of rural villages and their unique traditions
- **Audio Stories**: Record and preserve oral histories from village elders
- **Visual Archive**: Gallery of traditional crafts (Kantha, Madhubani, Dokra) with detailed descriptions
- **Heritage Paths**: Curated guided journeys that connect stories and traditions across villages
- **Discovery Quest**: Gamified learning with scavenger hunts and digital badges
- **AI Chat Interface**: Talk to an AI curator about rural traditions and stories
- **Heritage Trails**: Plan responsible visits, connect with local hosts, and support artisans
- **GPS Check-in**: Physical-to-digital badges for village visits
- **Live Updates**: Real-time posts from villages about festivals and events

### Key Highlights
- **Heatmap Visualization**: See cultural activity intensity across regions
- **Ambient Sounds**: Immersive audio experience when exploring villages
- **Digital Passports**: Track your cultural exploration journey
- **Responsible Travel Guide**: Dos and Don'ts for respectful cultural visits

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd Parampara
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
Parampara/
├── server.js              # Express server and API routes
├── package.json           # Dependencies and scripts
├── README.md             # This file
└── public/               # Frontend files
    ├── index.html        # Home page
    ├── map.html          # Interactive map page
    ├── gallery.html      # Visual archive gallery
    ├── paths.html        # Heritage paths
    ├── quest.html        # Discovery quest
    ├── trails.html       # Heritage trails & local hosts
    ├── chat.html         # AI chat interface
    ├── styles/          # CSS stylesheets
    │   ├── main.css     # Main styles
    │   ├── map.css      # Map page styles
    │   ├── gallery.css  # Gallery styles
    │   ├── paths.css    # Paths styles
    │   ├── quest.css    # Quest styles
    │   ├── trails.css   # Trails styles
    │   └── chat.css     # Chat styles
    └── scripts/         # JavaScript files
        ├── main.js      # Home page logic
        ├── map.js       # Map functionality
        ├── gallery.js   # Gallery functionality
        ├── paths.js     # Paths functionality
        ├── quest.js     # Quest functionality
        ├── trails.js    # Trails functionality
        └── chat.js      # Chat functionality
```

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Mapping**: Leaflet.js (OpenStreetMap)
- **Styling**: Custom CSS with modern design principles

## 📡 API Endpoints

### Cultural Items
- `GET /api/items` - Get all cultural items
- `POST /api/items` - Add a new cultural item

### Heritage Paths
- `GET /api/paths` - Get all heritage paths
- `POST /api/paths` - Create a new heritage path

### User Progress
- `GET /api/progress/:userId` - Get user progress
- `POST /api/progress/:userId` - Update user progress

### Village Posts
- `GET /api/posts` - Get all village posts
- `POST /api/posts` - Create a new village post

### AI Chat
- `POST /api/chat` - Send a question to the AI curator

### GPS Check-in
- `POST /api/checkin` - Check in at a village location

## 🎨 Features in Detail

### 1. Cultural Mapping
Explore villages on an interactive map. Click on markers to learn about traditions, festivals, and crafts. Toggle heatmap view to see cultural activity intensity.

### 2. Visual Archive
Browse and contribute to a gallery of traditional crafts. Each item includes descriptions, locations, and tags for easy discovery.

### 3. Heritage Paths
Follow curated journeys that tell a story. Paths connect multiple cultural items in a narrative sequence, complete with audio and images.

### 4. Discovery Quest
Engage in scavenger hunts to unlock digital badges. Complete objectives by exploring the archive and visiting villages.

### 5. Heritage Trails
Plan responsible visits to villages. Get contact information for local hosts, learn dos and don'ts, and find route information.

### 6. AI Chat
Ask questions about rural traditions, crafts, festivals, and stories. The AI curator draws from the archive to provide answers.

## 🔮 Future Enhancements

- Database integration (MongoDB/PostgreSQL)
- User authentication and profiles
- Real audio file uploads and playback
- Advanced AI integration (OpenAI/Claude)
- Mobile app version
- Multi-language support
- Advanced analytics and insights
- Community forums
- Payment integration for craft purchases

## 🤝 Contributing

This is a community-driven project. Contributions are welcome! Areas for contribution:
- Adding more sample data
- Improving UI/UX
- Adding new features
- Writing documentation
- Testing and bug fixes

## 📝 License

MIT License - feel free to use this project for learning and development.

## 🙏 Acknowledgments

Parampara is designed to preserve the rich cultural heritage of rural communities. Special thanks to all the communities and artisans who keep these traditions alive.

---

**Preserving rural heritage, one story at a time.**
