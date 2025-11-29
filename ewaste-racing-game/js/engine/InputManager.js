// Input Manager - Handles keyboard, gamepad, and touch input for multiple players
class InputManager {
    constructor() {
        this.keys = {};
        this.prevKeys = {};
        this.playerInputs = {
            player1: {},
            player2: {},
            player3: {},
            player4: {}
        };

        this.gamepads = {};
        this.touchControls = null;

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Keyboard events
        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));

        // Gamepad events
        window.addEventListener('gamepadconnected', (e) => this.onGamepadConnected(e));
        window.addEventListener('gamepaddisconnected', (e) => this.onGamepadDisconnected(e));

        // Touch events for mobile
        this.setupTouchControls();
    }

    onKeyDown(event) {
        this.keys[event.code] = true;

        // Prevent default for game controls
        if (this.isGameKey(event.code)) {
            event.preventDefault();
        }
    }

    onKeyUp(event) {
        this.keys[event.code] = false;

        if (this.isGameKey(event.code)) {
            event.preventDefault();
        }
    }

    isGameKey(code) {
        // Check if this key is used in game controls
        const controls = GameConfig.controls;
        for (const player in controls) {
            if (typeof controls[player] === 'object') {
                for (const action in controls[player]) {
                    if (controls[player][action] === code) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    onGamepadConnected(event) {
        console.log(`🎮 Gamepad connected: ${event.gamepad.id}`);
        this.gamepads[event.gamepad.index] = event.gamepad;
    }

    onGamepadDisconnected(event) {
        console.log(`🎮 Gamepad disconnected: ${event.gamepad.id}`);
        delete this.gamepads[event.gamepad.index];
    }

    setupTouchControls() {
        // Touch controls would be rendered as overlay buttons
        // For now, we'll implement simple touch areas
        if ('ontouchstart' in window) {
            console.log('📱 Touch controls enabled');
            // Touch implementation would go here
        }
    }

    update() {
        // Store previous frame keys for "pressed" detection
        this.prevKeys = { ...this.keys };

        // Update player inputs based on keyboard
        this.updatePlayerInput('player1', GameConfig.controls.player1);
        this.updatePlayerInput('player2', GameConfig.controls.player2);
        this.updatePlayerInput('player3', GameConfig.controls.player3);
        this.updatePlayerInput('player4', GameConfig.controls.player4);

        // Update gamepad inputs
        this.updateGamepadInputs();
    }

    updatePlayerInput(playerKey, controlMap) {
        const input = {
            forward: this.isKeyDown(controlMap.up),
            backward: this.isKeyDown(controlMap.down),
            left: this.isKeyDown(controlMap.left),
            right: this.isKeyDown(controlMap.right),
            powerup: this.isKeyPressed(controlMap.powerup),
            drift: this.isKeyDown(controlMap.drift)
        };

        this.playerInputs[playerKey] = input;
    }

    updateGamepadInputs() {
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];

        for (let i = 0; i < gamepads.length; i++) {
            const gamepad = gamepads[i];
            if (!gamepad) continue;

            // Map gamepad to player (gamepad 0 = player1, etc.)
            const playerKey = `player${i + 1}`;
            if (!this.playerInputs[playerKey]) continue;

            // Axes: 0 = left stick X, 1 = left stick Y
            const deadzone = 0.2;
            const axisX = Math.abs(gamepad.axes[0]) > deadzone ? gamepad.axes[0] : 0;
            const axisY = Math.abs(gamepad.axes[1]) > deadzone ? gamepad.axes[1] : 0;

            // Override keyboard input with gamepad input
            if (Math.abs(axisX) > 0 || Math.abs(axisY) > 0 || gamepad.buttons.some(b => b.pressed)) {
                this.playerInputs[playerKey] = {
                    forward: axisY < -deadzone || gamepad.buttons[7].pressed, // Left trigger or stick up
                    backward: axisY > deadzone || gamepad.buttons[6].pressed, // Right trigger or stick down
                    left: axisX < -deadzone,
                    right: axisX > deadzone,
                    powerup: gamepad.buttons[0].pressed, // A button
                    drift: gamepad.buttons[2].pressed // X button
                };
            }
        }
    }

    getPlayerInput(playerKey) {
        return this.playerInputs[playerKey] || {
            forward: false,
            backward: false,
            left: false,
            right: false,
            powerup: false,
            drift: false
        };
    }

    isKeyDown(code) {
        return this.keys[code] === true;
    }

    isKeyPressed(code) {
        // Key was pressed this frame (wasn't down last frame, is down now)
        return this.keys[code] === true && this.prevKeys[code] !== true;
    }

    isKeyReleased(code) {
        // Key was released this frame (was down last frame, isn't down now)
        return this.keys[code] !== true && this.prevKeys[code] === true;
    }

    reset() {
        this.keys = {};
        this.prevKeys = {};
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InputManager;
}
