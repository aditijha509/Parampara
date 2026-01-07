// Discovery Quest Page JavaScript

const userId = localStorage.getItem('userId') || `user_${Date.now()}`;
let userProgress = {
    badges: [],
    quests: [],
    checkIns: []
};

// Sample quests
const availableQuests = [
    {
        id: 'quest-1',
        title: 'Find the 3 Hidden Folk-tales of the Sundarbans',
        description: 'Explore the Sundarbans region and discover three unique folk tales that have been passed down through generations.',
        objectives: [
            { id: 'obj-1', text: 'Discover the tale of Bonbibi', completed: false },
            { id: 'obj-2', text: 'Find the story of the honey collectors', completed: false },
            { id: 'obj-3', text: 'Learn about the tiger and human relationship', completed: false }
        ],
        reward: {
            type: 'badge',
            name: 'Sundarbans Explorer',
            description: 'Unlocked after discovering all Sundarbans folk tales',
            icon: '🌊'
        }
    },
    {
        id: 'quest-2',
        title: 'Explore Traditional Crafts',
        description: 'Visit galleries and learn about three different traditional craft forms from different regions.',
        objectives: [
            { id: 'obj-4', text: 'Learn about Kantha embroidery', completed: false },
            { id: 'obj-5', text: 'Discover Madhubani paintings', completed: false },
            { id: 'obj-6', text: 'Explore Dokra metalwork', completed: false }
        ],
        reward: {
            type: 'wallpaper',
            name: 'Craft Master',
            description: 'Download a high-quality wallpaper of traditional crafts',
            icon: '🎨'
        }
    }
];

document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('userId')) {
        localStorage.setItem('userId', userId);
    }
    loadUserProgress();
    displayQuests();
});

async function loadUserProgress() {
    try {
        const response = await fetch(`/api/progress/${userId}`);
        const progress = await response.json();
        if (progress.badges) {
            userProgress = progress;
        }
        displayProgress();
    } catch (error) {
        console.error('Error loading progress:', error);
        displayProgress();
    }
}

function displayProgress() {
    document.getElementById('badge-count').textContent = userProgress.badges?.length || 0;
    document.getElementById('quest-completed').textContent = userProgress.quests?.length || 0;
    document.getElementById('check-ins').textContent = userProgress.checkIns?.length || 0;
    
    displayBadges();
}

function displayBadges() {
    const badgesGrid = document.getElementById('badges-grid');
    
    const allBadges = [
        ...(userProgress.badges || []),
        ...availableQuests.map(q => q.reward).filter(r => 
            userProgress.quests?.includes(r.name)
        )
    ];
    
    if (allBadges.length === 0) {
        badgesGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-muted);">
                <p>No badges earned yet. Complete quests to unlock badges!</p>
            </div>
        `;
        return;
    }
    
    badgesGrid.innerHTML = allBadges.map(badge => `
        <div class="badge-card">
            <div class="badge-icon">${badge.icon || '🏆'}</div>
            <h4>${escapeHtml(badge.name)}</h4>
            <p>${escapeHtml(badge.description)}</p>
        </div>
    `).join('');
}

function displayQuests() {
    const questsList = document.getElementById('quests-list');
    
    questsList.innerHTML = availableQuests.map(quest => {
        const completed = userProgress.quests?.includes(quest.reward.name) || false;
        const completedObjectives = quest.objectives.filter(obj => {
            const progress = userProgress.quests?.find(q => q.id === quest.id);
            return progress?.completedObjectives?.includes(obj.id) || false;
        }).length;
        
        return `
            <div class="quest-card ${completed ? 'completed' : ''}">
                <h4>${escapeHtml(quest.title)} ${completed ? '✓' : ''}</h4>
                <p>${escapeHtml(quest.description)}</p>
                <div class="quest-objectives">
                    ${quest.objectives.map(obj => {
                        const isCompleted = completed || 
                            (userProgress.quests?.find(q => q.id === quest.id)?.completedObjectives?.includes(obj.id));
                        return `
                            <div class="objective-item ${isCompleted ? 'completed' : ''}">
                                <div class="objective-checkbox ${isCompleted ? 'completed' : ''}">
                                    ${isCompleted ? '✓' : ''}
                                </div>
                                <span>${escapeHtml(obj.text)}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
                <div class="quest-reward">
                    <h5>Reward: ${quest.reward.icon} ${escapeHtml(quest.reward.name)}</h5>
                    <p>${escapeHtml(quest.reward.description)}</p>
                    ${completed && quest.reward.type === 'wallpaper' ? `
                        <button class="btn btn-primary" onclick="downloadWallpaper('${quest.id}')" style="margin-top: 1rem;">
                            Download Wallpaper
                        </button>
                    ` : ''}
                </div>
                ${!completed ? `
                    <button class="btn btn-primary" onclick="startQuest('${quest.id}')" style="margin-top: 1rem;">
                        Start Quest
                    </button>
                ` : ''}
            </div>
        `;
    }).join('');
}

function startQuest(questId) {
    const quest = availableQuests.find(q => q.id === questId);
    if (!quest) return;
    
    // In a real implementation, this would navigate to relevant content
    alert(`Starting quest: ${quest.title}\n\nVisit the gallery and map to find the items for this quest!`);
    
    // Mark quest as started
    if (!userProgress.quests) {
        userProgress.quests = [];
    }
    
    const questProgress = userProgress.quests.find(q => q.id === questId);
    if (!questProgress) {
        userProgress.quests.push({
            id: questId,
            started: true,
            completedObjectives: []
        });
        saveProgress();
    }
}

function completeObjective(questId, objectiveId) {
    if (!userProgress.quests) {
        userProgress.quests = [];
    }
    
    let questProgress = userProgress.quests.find(q => q.id === questId);
    if (!questProgress) {
        questProgress = { id: questId, completedObjectives: [] };
        userProgress.quests.push(questProgress);
    }
    
    if (!questProgress.completedObjectives.includes(objectiveId)) {
        questProgress.completedObjectives.push(objectiveId);
        
        const quest = availableQuests.find(q => q.id === questId);
        if (quest && questProgress.completedObjectives.length === quest.objectives.length) {
            // Quest completed!
            if (!userProgress.badges) {
                userProgress.badges = [];
            }
            userProgress.badges.push(quest.reward);
            userProgress.quests = userProgress.quests.filter(q => q.id !== questId);
            userProgress.quests.push({ id: questId, completed: true, reward: quest.reward.name });
            
            alert(`Quest completed! You earned: ${quest.reward.name}`);
        }
        
        saveProgress();
        displayProgress();
        displayQuests();
    }
}

async function saveProgress() {
    try {
        await fetch(`/api/progress/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userProgress)
        });
    } catch (error) {
        console.error('Error saving progress:', error);
    }
    
    // Also save to localStorage as backup
    localStorage.setItem('userProgress', JSON.stringify(userProgress));
}

function downloadWallpaper(questId) {
    // In a real implementation, this would download an actual wallpaper
    alert('Wallpaper download feature coming soon! For now, you can take a screenshot of your favorite craft from the gallery.');
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Make functions available globally
window.startQuest = startQuest;
window.completeObjective = completeObjective;
window.downloadWallpaper = downloadWallpaper;

