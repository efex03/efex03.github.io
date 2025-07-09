// Fallout Decay Loading Screen JavaScript

// Global variables to store server information
let serverInfo = {
    serverName: 'Fallout Decay Server',
    serverURL: '',
    mapName: 'Loading...',
    maxPlayers: 0,
    steamID: 'Loading...',
    gamemode: 'Loading...',
    volume: 1,
    language: 'en'
};

let fileProgress = {
    total: 0,
    needed: 0,
    currentFile: 'Initializing...'
};

let currentStatus = 'Initializing connection...';

// Background carousel images - using relative paths for Garry's Mod compatibility
const backgroundImages = [
    'assets/imgs/background/1.png',
    'assets/imgs/background/2.jpg',
    'assets/imgs/background/3.jpg',
    'assets/imgs/background/4.jpg',
    'assets/imgs/background/5.jpg',
    'assets/imgs/background/6.jpg',
    'assets/imgs/background/7.jpg',
    'assets/imgs/background/8.jpg',
    'assets/imgs/background/10.jpg'
];

// Configuration loaded from JSON
let loadingConfig = {
    about: { title: "About", content: "Loading..." },
    basics: { title: "The Basics", content: "Loading..." },
    tips: []
};

// Initialize the loading screen
document.addEventListener('DOMContentLoaded', function() {
    loadConfiguration().then(() => {
        initializeBackgroundCarousel();
        populateStaticContent();
        initializeTipsRotation();
        initializeURLParameters();
        addFadeInAnimations();
    });
});

// Initialize background carousel
function initializeBackgroundCarousel() {
    const carouselContainer = document.getElementById('carousel-images');
    
    // Create image elements
    backgroundImages.forEach((imagePath, index) => {
        const img = document.createElement('div');
        img.className = 'carousel-image';
        img.style.backgroundImage = `url('${imagePath}')`;
        carouselContainer.appendChild(img);
    });

    // Start carousel rotation
    let currentImageIndex = 0;
    const images = document.querySelectorAll('.carousel-image');
    
    setInterval(() => {
        images[currentImageIndex].style.opacity = '0';
        currentImageIndex = (currentImageIndex + 1) % images.length;
        images[currentImageIndex].style.opacity = '1';
    }, 5000); // Change image every 5 seconds
}

// Load configuration from JSON file
async function loadConfiguration() {
    console.log('Attempting to load configuration...');
    
    // Try multiple potential paths for the config file
    const configPaths = [
        'loading-screen-config/config.json',
        './loading-screen-config/config.json',
        '/loading-screen-config/config.json',
        'config.json'
    ];
    
    for (const configPath of configPaths) {
        try {
            console.log(`Trying to load config from: ${configPath}`);
            const response = await fetch(configPath);
            
            if (!response.ok) {
                console.warn(`Failed to load from ${configPath}: HTTP ${response.status} ${response.statusText}`);
                continue;
            }
            
            const configData = await response.json();
            loadingConfig = configData;
            console.log('✅ Loading screen configuration loaded successfully from:', configPath);
            console.log('Loaded config:', loadingConfig);
            return; // Success, exit the function
            
        } catch (error) {
            console.warn(`Failed to load config from ${configPath}:`, error.message);
            continue;
        }
    }
    
    // If all paths failed, try to embed the config directly
    console.warn('All config paths failed, attempting to load embedded config...');
    try {
        // Load the actual config data directly (avoiding fetch issues)
        loadingConfig = {
            "about": {
                "title": "About",
                "content": "Welcome to Fallout Decay, a post-apocalyptic survival RPG set in the year 2095, where you play as a survivor navigating a world ravaged by radiation and hostile mutated creatures. To survive, you must scavenge resources, craft essential tools, and eliminate the dangerous abominations that roam the wasteland. Choose your own path and specialization to develop unique skills and abilities that will help you thrive in this harsh environment. Throughout your journey, you'll encounter various communities—some will offer trade and sanctuary, while others may be raiders, slavers, or hostile groups looking to rob or eliminate you. Your survival depends on making the right alliances and knowing who to trust in this unforgiving world."
            },
            "basics": {
                "title": "Laws of the Wasteland",
                "rules": [
                    "Do not RDM. Read the full rules ingame to see when it's permissible to kill another player.",
                    "General prop/physgun abuse is not allowed.",
                    "Blatant disrespect toward players/staff will not be tolerated.",
                    "Exploitation and loop-holing of the rules is not allowed.",
                    "New Life Rule- This means when you die you may not go back to an area you were killed for 5 minutes. (Except for PvE)"
                ],
                "footer": "to read all rules type /rules in game..."
            },
            "tips": [
                {
                    "icon": "assets/silkicons/lightbulb.png",
                    "text": "Visit our website at https://falloutdecay.com to find the wiki or donate."
                },
                {
                    "icon": "assets/silkicons/application_lightning.png",
                    "text": "Killing irradiated creatures will yield loot and experience."
                },
                {
                    "icon": "assets/silkicons/wrench.png",
                    "text": "There are different classes that have different perks."
                },
                {
                    "icon": "assets/silkicons/flag_red.png",
                    "text": "Watch out in the wasteland, not everyone is so friendly."
                },
                {
                    "icon": "assets/silkicons/package.png",
                    "text": "We have PAC editor, but you need to be whitelisted to use it."
                },
                {
                    "icon": "assets/silkicons/package.png",
                    "text": "Join our discord to stay connected with the community and server updates."
                },
                {
                    "icon": "assets/silkicons/bomb.png",
                    "text": "Weapons and armors have durability. Be sure to repair them."
                },
                {
                    "icon": "assets/silkicons/flag_green.png",
                    "text": "New to the wasteland? Check out our wiki for more information."
                },
                {
                    "icon": "assets/silkicons/car.png",
                    "text": "You can craft vehicles to get around quicker, but you need a lot of resources to do it."
                }
            ]
        };
        console.log('✅ Using embedded configuration data');
        console.log('Loaded config:', loadingConfig);
        
    } catch (error) {
        console.error('❌ Failed to load embedded config, using fallback:', error);
        // Use original fallback content if everything else fails
        loadingConfig = {
            about: {
                title: "About",
                content: "Welcome to Fallout Decay, a post-apocalyptic survival server where you must navigate the harsh wasteland. Build, explore, and survive alongside other vault dwellers in this immersive Garry's Mod experience."
            },
            basics: {
                title: "The Basics",
                rules: [
                    "Use your spawn menu to access tools and weapons",
                    "Collect resources to build shelters and fortifications",
                    "Team up with other survivors for better chances of survival",
                    "Beware of radiation zones and hostile creatures",
                    "Respect other players and their builds",
                    "No griefing or destroying others' property",
                    "Follow admin instructions at all times"
                ],
                footer: "to read all rules type /rules in game"
            },
            tips: [
                { icon: "assets/silkicons/lightbulb.png", text: "Welcome to Fallout Decay! Explore the wasteland with other survivors." },
                { icon: "assets/silkicons/application_lightning.png", text: "Donate to get exclusive perks like 1.5x XP boost and special vehicles!" },
                { icon: "assets/silkicons/wrench.png", text: "Use the spawn menu to access tools, weapons, and building materials." },
                { icon: "assets/silkicons/car.png", text: "Donators can access upgradable vehicles for faster travel." },
                { icon: "assets/silkicons/package.png", text: "Donators get increased prop limits from 75 to 100." }
            ]
        };
    }
}

// Populate static content from configuration
function populateStaticContent() {
    // Update About section
    const aboutTitle = document.getElementById('about-title');
    const aboutContent = document.getElementById('about-content');
    if (aboutTitle) aboutTitle.textContent = loadingConfig.about.title;
    if (aboutContent) aboutContent.textContent = loadingConfig.about.content;

    // Update Basics section
    const basicsTitle = document.getElementById('basics-title');
    const basicsContent = document.getElementById('basics-content');
    if (basicsTitle) basicsTitle.textContent = loadingConfig.basics.title;
    if (basicsContent) {
        if (loadingConfig.basics.rules && Array.isArray(loadingConfig.basics.rules)) {
            // Create ordered list for rules
            const orderedList = document.createElement('ol');
            loadingConfig.basics.rules.forEach(rule => {
                const listItem = document.createElement('li');
                listItem.textContent = rule;
                orderedList.appendChild(listItem);
            });
            basicsContent.innerHTML = '';
            basicsContent.appendChild(orderedList);
            
            // Add footer text if it exists
            if (loadingConfig.basics.footer) {
                const footerText = document.createElement('p');
                footerText.className = 'basics-footer';
                footerText.textContent = loadingConfig.basics.footer;
                basicsContent.appendChild(footerText);
            }
        } else {
            // Fallback to content if rules array doesn't exist
            basicsContent.textContent = loadingConfig.basics.content || 'Loading...';
        }
    }

    // Create tip elements
    const tipsContainer = document.getElementById('loading-tips');
    if (tipsContainer && loadingConfig.tips.length > 0) {
        tipsContainer.innerHTML = ''; // Clear existing content
        
        loadingConfig.tips.forEach((tip, index) => {
            const tipItem = document.createElement('div');
            tipItem.className = 'tip-item';
            if (index === 0) tipItem.classList.add('active');
            
            const tipIcon = document.createElement('img');
            tipIcon.src = tip.icon;
            tipIcon.alt = 'Tip';
            tipIcon.className = 'tip-icon';
            
            const tipText = document.createElement('span');
            tipText.className = 'tip-text';
            tipText.textContent = tip.text;
            
            tipItem.appendChild(tipIcon);
            tipItem.appendChild(tipText);
            tipsContainer.appendChild(tipItem);
        });
    }
}

// Initialize tips rotation
function initializeTipsRotation() {
    const tipsContainer = document.getElementById('loading-tips');
    let currentTipIndex = 0;

    function showRandomTip() {
        const tipItems = tipsContainer.querySelectorAll('.tip-item');
        
        if (tipItems.length === 0 || loadingConfig.tips.length === 0) {
            return; // No tips to show
        }
        
        // Hide current tip
        tipItems.forEach(item => {
            item.classList.remove('active');
        });

        // Get a random tip index (different from current one if possible)
        let nextTipIndex;
        if (tipItems.length > 1) {
            do {
                nextTipIndex = Math.floor(Math.random() * tipItems.length);
            } while (nextTipIndex === currentTipIndex);
        } else {
            nextTipIndex = 0;
        }

        // Show random tip
        const nextTip = tipItems[nextTipIndex];
        if (nextTip) {
            nextTip.classList.add('active');
        }

        currentTipIndex = nextTipIndex;
    }

    // Show first random tip immediately
    showRandomTip();
    
    // Rotate tips randomly every 8 seconds forever
    setInterval(showRandomTip, 8000);
}

// Initialize URL parameters (for testing)
function initializeURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Check for URL parameters (for testing purposes)
    if (urlParams.has('Map')) {
        serverInfo.mapName = urlParams.get('Map');
        updateMapDisplay();
    }
    
    if (urlParams.has('SteamId')) {
        serverInfo.steamID = urlParams.get('SteamId');
        updateSteamIDDisplay();
    }
}

// Add fade-in animations to panels
function addFadeInAnimations() {
    const panels = document.querySelectorAll('.server-info-panel, .loading-progress, .player-info-panel, .tips-panel');
    
    panels.forEach((panel, index) => {
        panel.style.opacity = '0';
        panel.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            panel.classList.add('fade-in');
            panel.style.opacity = '1';
            panel.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// Update display functions
function updateServerName() {
    const element = document.getElementById('server-name');
    if (element) {
        element.textContent = serverInfo.serverName;
    }
}

function updateMapDisplay() {
    const element = document.getElementById('map-name');
    if (element) {
        element.textContent = serverInfo.mapName;
        element.classList.add('status-updating');
        setTimeout(() => element.classList.remove('status-updating'), 1000);
    }
}

function updateGamemodeDisplay() {
    const element = document.getElementById('gamemode');
    if (element) {
        element.textContent = serverInfo.gamemode;
        element.classList.add('status-updating');
        setTimeout(() => element.classList.remove('status-updating'), 1000);
    }
}

function updatePlayerCountDisplay() {
    const element = document.getElementById('player-count');
    if (element) {
        element.textContent = `${serverInfo.maxPlayers}/${serverInfo.maxPlayers}`;
    }
}

function updateSteamIDDisplay() {
    const element = document.getElementById('steam-id');
    if (element) {
        element.textContent = serverInfo.steamID;
    }
}

function updateLanguageDisplay() {
    const element = document.getElementById('language');
    if (element) {
        const languageNames = {
            'en': 'English',
            'es': 'Español',
            'fr': 'Français',
            'de': 'Deutsch',
            'it': 'Italiano',
            'pt': 'Português',
            'ru': 'Русский',
            'zh': '中文',
            'ja': '日本語',
            'ko': '한국어'
        };
        element.textContent = languageNames[serverInfo.language] || serverInfo.language;
    }
}

function updateStatusDisplay() {
    const element = document.getElementById('status-text');
    if (element) {
        element.textContent = currentStatus;
        element.classList.add('status-updating');
        setTimeout(() => element.classList.remove('status-updating'), 1000);
    }
}

function updateProgressBar() {
    const progressFill = document.getElementById('progress-fill');
    const filesProgress = document.getElementById('files-progress');
    
    if (progressFill && filesProgress) {
        if (fileProgress.total > 0) {
            const percentage = ((fileProgress.total - fileProgress.needed) / fileProgress.total) * 100;
            progressFill.style.width = `${percentage}%`;
            filesProgress.textContent = `${fileProgress.total - fileProgress.needed}/${fileProgress.total} files`;
        } else {
            progressFill.style.width = '0%';
            filesProgress.textContent = '0/0 files';
        }
    }
}

function updateCurrentFileDisplay() {
    const element = document.getElementById('current-file-name');
    if (element) {
        element.textContent = fileProgress.currentFile;
    }
}

// Garry's Mod Loading Screen Functions
// These functions are called directly by Garry's Mod

/**
 * Called at the start, when the loading screen finishes loading all assets.
 * @param {string} serverName - Server's name (hostname convar)
 * @param {string} serverURL - URL for the loading screen (sv_loadingurl convar)
 * @param {string} mapName - The name of the map the server is playing
 * @param {number} maxPlayers - Maximum number of players for the server
 * @param {string} steamID - 64-bit, numeric Steam community ID of the client joining
 * @param {string} gamemode - The gamemode the server is currently playing
 * @param {number} volume - The value of the player's in-game 'snd_musicvolume' console variable (0 to 1)
 * @param {string} language - The value of the player's in-game 'gmod_language' console variable
 */
function GameDetails(serverName, serverURL, mapName, maxPlayers, steamID, gamemode, volume, language) {
    console.log('GameDetails called:', { serverName, serverURL, mapName, maxPlayers, steamID, gamemode, volume, language });
    
    // Update server information
    serverInfo.serverName = serverName || 'Fallout Decay Server';
    serverInfo.serverURL = serverURL || '';
    serverInfo.mapName = mapName || 'Loading...';
    serverInfo.maxPlayers = maxPlayers || 0;
    serverInfo.steamID = steamID || 'Loading...';
    serverInfo.gamemode = gamemode || 'Loading...';
    serverInfo.volume = volume || 1;
    serverInfo.language = language || 'en';
    
    // Update displays
    updateServerName();
    updateMapDisplay();
    updateGamemodeDisplay();
    updatePlayerCountDisplay();
    updateSteamIDDisplay();
    updateLanguageDisplay();
    
    // Set initial status
    currentStatus = 'Retrieving server info...';
    updateStatusDisplay();
}

/**
 * Called at the start
 * @param {number} total - Total number of files the client will have to download
 */
function SetFilesTotal(total) {
    console.log('SetFilesTotal called:', total);
    fileProgress.total = total;
    updateProgressBar();
}

/**
 * Called when the client starts downloading a file
 * @param {string} fileName - The full path and name of the file the client is downloading
 */
function DownloadingFile(fileName) {
    console.log('DownloadingFile called:', fileName);
    fileProgress.currentFile = fileName;
    updateCurrentFileDisplay();
    
    // Update status
    currentStatus = 'Downloading files...';
    updateStatusDisplay();
}

/**
 * Called when the client's joining status changes
 * @param {string} status - Current joining status
 */
function SetStatusChanged(status) {
    console.log('SetStatusChanged called:', status);
    currentStatus = status;
    updateStatusDisplay();
}

/**
 * Called when the number of files remaining for the client to download changes
 * @param {number} needed - Number of files left for the client to download
 */
function SetFilesNeeded(needed) {
    console.log('SetFilesNeeded called:', needed);
    fileProgress.needed = needed;
    updateProgressBar();
}

// Utility functions for testing (can be called from browser console)
window.testLoadingScreen = {
    // Test GameDetails function
    testGameDetails: function() {
        GameDetails(
            'Fallout Decay Test Server',
            'https://example.com/loading-screen.html',
            'gm_construct',
            32,
            '76561198012345678',
            'sandbox',
            0.5,
            'en'
        );
    },
    
    // Test file download simulation
    testFileDownload: function() {
        SetFilesTotal(150);
        SetFilesNeeded(150);
        
        const testFiles = [
            'materials/models/props/cs_office/table_office01a.mdl',
            'materials/models/props/cs_office/table_office01a.vmt',
            'materials/models/props/cs_office/table_office01a.vtf',
            'sound/ambient/office/office_ambience.wav',
            'lua/autorun/client/init.lua'
        ];
        
        let currentFile = 0;
        const interval = setInterval(() => {
            if (currentFile < testFiles.length) {
                DownloadingFile(testFiles[currentFile]);
                SetFilesNeeded(150 - currentFile - 1);
                currentFile++;
            } else {
                clearInterval(interval);
                SetStatusChanged('Starting Lua...');
            }
        }, 1000);
    },
    
    // Test status changes
    testStatusChanges: function() {
        const statuses = [
            'Retrieving server info...',
            'Downloading files...',
            'Starting Lua...',
            'Loading gamemode...',
            'Connecting to server...',
            'Almost ready...'
        ];
        
        let currentStatus = 0;
        const interval = setInterval(() => {
            if (currentStatus < statuses.length) {
                SetStatusChanged(statuses[currentStatus]);
                currentStatus++;
            } else {
                clearInterval(interval);
            }
        }, 2000);
    }
};

// Add some console logging for debugging
console.log('Fallout Decay Loading Screen initialized');
console.log('Available test functions:');
console.log('- testLoadingScreen.testGameDetails()');
console.log('- testLoadingScreen.testFileDownload()');
console.log('- testLoadingScreen.testStatusChanges()'); 