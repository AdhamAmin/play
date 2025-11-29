// Game Configuration
const GameConfig = {
    // Graphics Settings
    graphics: {
        targetFPS: 60,
        shadowsEnabled: true,
        particlesEnabled: true,
        postProcessing: true,
        antialiasing: true,
        maxParticles: 1000
    },

    // Camera Settings
    camera: {
        fov: 75,
        near: 0.1,
        far: 1000,
        followDistance: 15,
        followHeight: 8,
        lookAhead: 5,
        smoothing: 0.1
    },

    // Physics Settings
    physics: {
        gravity: -9.8,
        maxSpeed: 200,
        acceleration: 50,
        braking: 100,
        turnSpeed: 2.5,
        driftFactor: 0.95,
        friction: 0.98,
        airResistance: 0.99
    },

    // Player Settings
    player: {
        maxPlayers: 4,
        defaultCharacter: 'dr-weee',
        startingLives: 3
    },

    // AI Settings
    ai: {
        difficulties: {
            easy: {
                maxSpeed: 0.7,
                turnSpeed: 0.8,
                errorMargin: 5,
                catchupBoost: 1.2
            },
            medium: {
                maxSpeed: 0.85,
                turnSpeed: 0.9,
                errorMargin: 3,
                catchupBoost: 1.15
            },
            hard: {
                maxSpeed: 0.95,
                turnSpeed: 1.0,
                errorMargin: 1,
                catchupBoost: 1.1
            }
        },
        rubberBanding: true,
        defaultDifficulty: 'medium'
    },

    // Race Settings
    race: {
        defaultLaps: 3,
        checkpointTimeout: 60,
        respawnDelay: 2,
        countdownDuration: 3
    },

    // Power-Up Settings
    powerups: {
        spawnInterval: 10,
        maxActive: 6,
        duration: 5,
        types: [
            { id: 'recycle-boost', rarity: 'common' },
            { id: 'ewaste-shield', rarity: 'common' },
            { id: 'solar-power', rarity: 'rare' },
            { id: 'compost-slowdown', rarity: 'common' },
            { id: 'battery-surge', rarity: 'rare' }
        ]
    },

    // Scoring
    scoring: {
        firstPlace: 100,
        secondPlace: 75,
        thirdPlace: 50,
        fourthPlace: 25,
        powerupCollect: 10,
        lapBonus: 20,
        perfectLap: 50
    },

    // Mission Settings
    missions: {
        totalMissions: 10,
        levelsPerMission: 5,
        starsToUnlock: [0, 5, 15, 30, 50, 75, 100, 130, 165, 200]
    },

    // Controls
    controls: {
        player1: {
            up: 'ArrowUp',
            down: 'ArrowDown',
            left: 'ArrowLeft',
            right: 'ArrowRight',
            powerup: 'ShiftRight',
            drift: 'ControlRight'
        },
        player2: {
            up: 'KeyW',
            down: 'KeyS',
            left: 'KeyA',
            right: 'KeyD',
            powerup: 'ShiftLeft',
            drift: 'ControlLeft'
        },
        player3: {
            up: 'KeyI',
            down: 'KeyK',
            left: 'KeyJ',
            right: 'KeyL',
            powerup: 'KeyU',
            drift: 'KeyO'
        },
        player4: {
            up: 'KeyT',
            down: 'KeyG',
            left: 'KeyF',
            right: 'KeyH',
            powerup: 'KeyR',
            drift: 'KeyY'
        },
        pause: 'Escape',
        changeCamera: 'KeyC'
    },

    // Audio Settings
    audio: {
        masterVolume: 0.7,
        musicVolume: 0.5,
        sfxVolume: 0.8,
        engineVolume: 0.6
    },

    // Visual Effects
    effects: {
        bloomStrength: 1.5,
        bloomThreshold: 0.8,
        bloomRadius: 0.5,
        trailLength: 20,
        particleLifetime: 2
    },

    // Storage Keys
    storage: {
        language: 'drweee_language',
        progress: 'drweee_progress',
        settings: 'drweee_settings',
        leaderboard: 'drweee_leaderboard',
        customization: 'drweee_customization'
    },

    // Colors (Dr. WEEE Brand)
    colors: {
        primary: 0x00ff00,
        primaryGlow: 0x00ff0080,
        secondary: 0x00d4ff,
        accent: 0xffea00,
        warning: 0xff0055,
        dark: 0x0a0a0a,
        light: 0xffffff,

        // Character Colors
        drWeee: 0x00ff00,
        captainCircuit: 0x00d4ff,
        batteryBelle: 0xffea00,
        recycleRanger: 0xff8800
    }
};

// Export for module systems (optional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameConfig;
}

// Expose to window for browser
window.GameConfig = GameConfig;
