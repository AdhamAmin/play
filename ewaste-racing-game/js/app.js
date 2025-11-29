// Main Application - Initializes and coordinates all game systems
class App {
    constructor() {
        this.gameEngine = null;
        this.inputManager = null;
        this.currentScreen = 'loading';

        this.init();
    }

    async init() {
        try {
            console.log('🚀 Initializing Dr. WEEE Racing Championship...');

            // Show loading screen
            this.showLoadingScreen();

            // Verify dependencies
            if (typeof Translations === 'undefined') throw new Error('Translations not loaded');
            if (typeof GameConfig === 'undefined') throw new Error('GameConfig not loaded');
            if (typeof GameEngine === 'undefined') throw new Error('GameEngine not loaded');

            // Simulate loading assets
            await this.loadAssets();

            // Initialize game systems
            this.gameEngine = new GameEngine();
            this.inputManager = new InputManager();

            // Check if language has been selected
            const hasSelectedLanguage = localStorage.getItem(GameConfig.storage.language);

            // Hide loading screen
            this.hideLoadingScreen();

            if (!hasSelectedLanguage) {
                // Show language selector
                this.showLanguageSelector();
            } else {
                // Go directly to main menu
                this.showMainMenu();
            }

            // Setup menu event listeners
            this.setupMenuEvents();

            console.log('✅ Initialization complete!');
        } catch (error) {
            console.error('❌ Initialization failed:', error);
            const loadingText = document.getElementById('loading-text');
            if (loadingText) {
                loadingText.textContent = `Error: ${error.message}`;
                loadingText.style.color = '#ff3333';
            }
        }
    }

    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('active');
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        setTimeout(() => {
            loadingScreen.classList.remove('active');
        }, 500);
    }

    async loadAssets() {
        const progressBar = document.getElementById('loading-progress');
        const loadingText = document.getElementById('loading-text');
        const ecoTipText = document.getElementById('eco-tip-text');

        const steps = [
            { text: 'Initializing Eco-Engine...', duration: 300 },
            { text: 'Loading 3D Models...', duration: 400 },
            { text: 'Preparing Tracks...', duration: 500 },
            { text: 'Charging Batteries...', duration: 300 },
            { text: 'Recycling Assets...', duration: 400 },
            { text: 'Ready to Race!', duration: 300 }
        ];

        const tips = Object.values(Translations.en.tips);

        for (let i = 0; i < steps.length; i++) {
            loadingText.textContent = steps[i].text;
            progressBar.style.width = ((i + 1) / steps.length * 100) + '%';

            // Show random eco tip
            const randomTip = tips[Math.floor(Math.random() * tips.length)];
            ecoTipText.textContent = randomTip;

            await this.sleep(steps[i].duration);
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    showLanguageSelector() {
        const languageSelector = document.getElementById('language-selector');
        languageSelector.style.display = 'flex';

        // Add event listeners to language buttons
        const languageButtons = document.querySelectorAll('.language-btn');
        languageButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.dataset.lang;
                languageManager.setLanguage(lang);
                languageSelector.style.display = 'none';
                this.showMainMenu();
            });
        });
    }

    setupMenuEvents() {
        // Play button
        const btnPlay = document.getElementById('btn-play');
        if (btnPlay) {
            btnPlay.addEventListener('click', () => {
                soundManager.play('click');
                this.startQuickRace();
            });
            btnPlay.addEventListener('mouseenter', () => soundManager.play('hover'));
        }

        // Missions button
        const btnMissions = document.getElementById('btn-missions');
        if (btnMissions) {
            btnMissions.addEventListener('click', () => {
                soundManager.play('click');
                console.log('Missions screen - Coming soon!');
            });
            btnMissions.addEventListener('mouseenter', () => soundManager.play('hover'));
        }

        // Multiplayer button
        const btnMultiplayer = document.getElementById('btn-multiplayer');
        if (btnMultiplayer) {
            btnMultiplayer.addEventListener('click', () => {
                soundManager.play('click');
                console.log('Multiplayer setup - Coming soon!');
            });
            btnMultiplayer.addEventListener('mouseenter', () => soundManager.play('hover'));
        }

        // Customize button
        const btnCustomize = document.getElementById('btn-customize');
        if (btnCustomize) {
            btnCustomize.addEventListener('click', () => {
                soundManager.play('click');
                console.log('Customization - Coming soon!');
            });
            btnCustomize.addEventListener('mouseenter', () => soundManager.play('hover'));
        }

        // Leaderboard button
        const btnLeaderboard = document.getElementById('btn-leaderboard');
        if (btnLeaderboard) {
            btnLeaderboard.addEventListener('click', () => {
                soundManager.play('click');
                console.log('Leaderboard - Coming soon!');
            });
            btnLeaderboard.addEventListener('mouseenter', () => soundManager.play('hover'));
        }

        // Settings button
        const btnSettings = document.getElementById('btn-settings');
        if (btnSettings) {
            btnSettings.addEventListener('click', () => {
                soundManager.play('click');
                this.showSettings();
            });
            btnSettings.addEventListener('mouseenter', () => soundManager.play('hover'));
        }

        // Pause menu buttons
        const btnResume = document.getElementById('btn-resume');
        if (btnResume) {
            btnResume.addEventListener('click', () => {
                soundManager.play('click');
                this.resumeGame();
            });
            btnResume.addEventListener('mouseenter', () => soundManager.play('hover'));
        }

        const btnRestart = document.getElementById('btn-restart');
        if (btnRestart) {
            btnRestart.addEventListener('click', () => {
                soundManager.play('click');
                this.restartRace();
            });
            btnRestart.addEventListener('mouseenter', () => soundManager.play('hover'));
        }

        const btnQuit = document.getElementById('btn-quit');
        if (btnQuit) {
            btnQuit.addEventListener('click', () => {
                soundManager.play('click');
                this.quitToMenu();
            });
            btnQuit.addEventListener('mouseenter', () => soundManager.play('hover'));
        }

        // Pause key
        window.addEventListener('keydown', (e) => {
            if (e.code === GameConfig.controls.pause && this.currentScreen === 'game') {
                this.togglePause();
            }
        });

        // Game Mode Cards
        document.querySelectorAll('.mode-card').forEach(card => {
            card.addEventListener('mouseenter', () => soundManager.play('hover'));
            card.addEventListener('click', () => {
                soundManager.play('click');
                const mode = card.id === 'adventure-mode' ? 'adventure' : 'race';
                console.log(`Selected mode: ${mode}`);
                // For now, just start race for both
                this.startQuickRace();
            });
        });
    }

    startQuickRace() {
        console.log('🏁 Starting quick race...');

        this.hideMainMenu();

        // Show game container
        const gameContainer = document.getElementById('game-container');
        gameContainer.classList.remove('hidden');

        // Create a simple demo track
        this.createDemoTrack();

        // Start game
        this.currentScreen = 'game';
        this.gameEngine.setState('playing');
        this.gameEngine.start();

        console.log('🎮 Race started!');
    }

    createDemoTrack() {
        // Create a simple ground plane
        const groundGeometry = new THREE.PlaneGeometry(200, 200);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x2a2a2a,
            roughness: 0.8,
            metalness: 0.2
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.gameEngine.scene.add(ground);

        // Create a simple track with glowing edges
        const trackGeometry = new THREE.PlaneGeometry(20, 200);
        const trackMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            roughness: 0.6,
            metalness: 0.3,
            emissive: GameConfig.colors.primary,
            emissiveIntensity: 0.1
        });
        const track = new THREE.Mesh(trackGeometry, trackMaterial);
        track.rotation.x = -Math.PI / 2;
        track.position.y = 0.01;
        track.receiveShadow = true;
        this.gameEngine.scene.add(track);

        // Add glowing track borders
        this.createTrackBorder(-10, 0, 200);
        this.createTrackBorder(10, 0, 200);

        // Add some decorative elements
        this.createDecorations();
    }

    createTrackBorder(x, y, length) {
        const borderGeometry = new THREE.BoxGeometry(0.5, 1, length);
        const borderMaterial = new THREE.MeshStandardMaterial({
            color: GameConfig.colors.primary,
            emissive: GameConfig.colors.primary,
            emissiveIntensity: 0.8
        });
        const border = new THREE.Mesh(borderGeometry, borderMaterial);
        border.position.set(x, y + 0.5, 0);
        border.castShadow = true;
        this.gameEngine.scene.add(border);
    }

    createDecorations() {
        // Add some recycling bins as decorations
        for (let i = 0; i < 10; i++) {
            const binGeometry = new THREE.CylinderGeometry(0.5, 0.7, 1.5, 8);
            const binMaterial = new THREE.MeshStandardMaterial({
                color: GameConfig.colors.primary,
                emissive: GameConfig.colors.primary,
                emissiveIntensity: 0.3
            });
            const bin = new THREE.Mesh(binGeometry, binMaterial);

            const side = Math.random() > 0.5 ? -15 : 15;
            bin.position.set(
                side,
                0.75,
                -80 + i * 20
            );
            bin.castShadow = true;
            this.gameEngine.scene.add(bin);
        }
    }

    showSettings() {
        console.log('⚙️ Settings - Language selector');
        this.showLanguageSelector();
    }

    togglePause() {
        const pauseMenu = document.getElementById('pause-menu');

        if (this.gameEngine.state === 'playing') {
            this.gameEngine.setState('paused');
            pauseMenu.classList.remove('hidden');
        } else if (this.gameEngine.state === 'paused') {
            this.resumeGame();
        }
    }

    resumeGame() {
        const pauseMenu = document.getElementById('pause-menu');
        pauseMenu.classList.add('hidden');
        this.gameEngine.setState('playing');
    }

    restartRace() {
        const pauseMenu = document.getElementById('pause-menu');
        pauseMenu.classList.add('hidden');

        // Clear and recreate track
        this.gameEngine.clearEntities();
        this.createDemoTrack();

        this.gameEngine.setState('playing');
    }

    quitToMenu() {
        const pauseMenu = document.getElementById('pause-menu');
        const gameContainer = document.getElementById('game-container');

        pauseMenu.classList.add('hidden');
        gameContainer.classList.add('hidden');

        this.gameEngine.setState('menu');
        this.gameEngine.stop();
        this.gameEngine.clearEntities();

        this.showMainMenu();
    }

    updateStats() {
        // Load from storage
        const progress = JSON.parse(localStorage.getItem(GameConfig.storage.progress) || '{}');

        document.getElementById('total-recycled').textContent = progress.totalRecycled || 0;
        document.getElementById('total-stars').textContent = progress.totalStars || 0;
    }
}

// Initialize the application when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    const app = new App();
});
