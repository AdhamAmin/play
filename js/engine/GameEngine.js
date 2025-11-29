// Main Game Engine - Handles Three.js scene, rendering, and game loop
class GameEngine {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.canvas = null;

        this.clock = new THREE.Clock();
        this.deltaTime = 0;
        this.totalTime = 0;

        this.state = 'menu'; // menu, playing, paused, gameover
        this.isRunning = false;

        this.entities = [];
        this.lights = [];

        this.init();
    }

    init() {
        // Get canvas element
        this.canvas = document.getElementById('game-canvas');

        // Create scene
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(GameConfig.colors.dark, 50, 200);

        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            GameConfig.camera.fov,
            window.innerWidth / window.innerHeight,
            GameConfig.camera.near,
            GameConfig.camera.far
        );
        this.camera.position.set(0, 10, 20);
        this.camera.lookAt(0, 0, 0);

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: GameConfig.graphics.antialiasing,
            alpha: false
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = GameConfig.graphics.shadowsEnabled;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setClearColor(GameConfig.colors.dark);

        // Setup lighting
        this.setupLighting();

        // Handle window resize
        window.addEventListener('resize', () => this.onResize());

        console.log('🎮 Game Engine initialized');
    }

    setupLighting() {
        // Ambient light
        const ambient = new THREE.AmbientLight(0xffffff, 0.3);
        this.scene.add(ambient);
        this.lights.push(ambient);

        // Main directional light (sun)
        const sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
        sunLight.position.set(50, 100, 50);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.near = 0.5;
        sunLight.shadow.camera.far = 500;
        sunLight.shadow.camera.left = -100;
        sunLight.shadow.camera.right = 100;
        sunLight.shadow.camera.top = 100;
        sunLight.shadow.camera.bottom = -100;
        this.scene.add(sunLight);
        this.lights.push(sunLight);

        // Fill light (subtle)
        const fillLight = new THREE.DirectionalLight(0x4488ff, 0.3);
        fillLight.position.set(-50, 30, -50);
        this.scene.add(fillLight);
        this.lights.push(fillLight);

        // Dr. WEEE green accent light
        const accentLight = new THREE.PointLight(GameConfig.colors.primary, 0.5, 50);
        accentLight.position.set(0, 5, 0);
        this.scene.add(accentLight);
        this.lights.push(accentLight);
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.clock.start();
            this.gameLoop();
            console.log('🏁 Game started');
        }
    }

    stop() {
        this.isRunning = false;
        console.log('⏸️ Game stopped');
    }

    gameLoop() {
        if (!this.isRunning) return;

        requestAnimationFrame(() => this.gameLoop());

        // Calculate delta time
        this.deltaTime = this.clock.getDelta();
        this.totalTime += this.deltaTime;

        // Limit delta time to prevent spiral of death
        if (this.deltaTime > 0.1) {
            this.deltaTime = 0.1;
        }

        // Update game state
        if (this.state === 'playing') {
            this.update(this.deltaTime);
        }

        // Render scene
        this.render();
    }

    update(deltaTime) {
        // Update all entities
        for (const entity of this.entities) {
            if (entity.update) {
                entity.update(deltaTime);
            }
        }
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    addEntity(entity) {
        this.entities.push(entity);
        if (entity.mesh) {
            this.scene.add(entity.mesh);
        }
    }

    removeEntity(entity) {
        const index = this.entities.indexOf(entity);
        if (index > -1) {
            this.entities.splice(index, 1);
            if (entity.mesh) {
                this.scene.remove(entity.mesh);
            }
        }
    }

    clearEntities() {
        for (const entity of this.entities) {
            if (entity.mesh) {
                this.scene.remove(entity.mesh);
            }
        }
        this.entities = [];
    }

    setState(newState) {
        console.log(`🔄 State changed: ${this.state} → ${newState}`);
        this.state = newState;
    }

    onResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
    }

    getScene() {
        return this.scene;
    }

    getCamera() {
        return this.camera;
    }

    getRenderer() {
        return this.renderer;
    }

    getDeltaTime() {
        return this.deltaTime;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameEngine;
}
