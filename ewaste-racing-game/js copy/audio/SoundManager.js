class SoundManager {
    constructor() {
        this.context = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.context.createGain();
        this.masterGain.connect(this.context.destination);
        this.masterGain.gain.value = 0.5; // Default volume

        this.sounds = {};
        this.music = {};
        this.currentMusic = null;
        this.isMuted = false;

        // Preload standard sounds (placeholders for now)
        this.loadSound('click', 'assets/audio/click.mp3');
        this.loadSound('hover', 'assets/audio/hover.mp3');
        this.loadSound('start', 'assets/audio/race-start.mp3');
        this.loadSound('engine', 'assets/audio/engine-loop.mp3');

        // Background music tracks
        this.loadMusic('menu', 'assets/audio/menu-theme.mp3');
        this.loadMusic('race', 'assets/audio/race-theme.mp3');
    }

    async loadSound(name, url) {
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
            this.sounds[name] = audioBuffer;
        } catch (e) {
            console.warn(`Sound ${name} not found at ${url}, using synth fallback.`);
        }
    }

    async loadMusic(name, url) {
        // Music is streamed/loaded differently usually, but for simple games:
        this.music[name] = new Audio(url);
        this.music[name].loop = true;
    }

    play(name) {
        if (this.isMuted) return;

        if (this.context.state === 'suspended') {
            this.context.resume();
        }

        if (this.sounds[name]) {
            const source = this.context.createBufferSource();
            source.buffer = this.sounds[name];
            source.connect(this.masterGain);
            source.start(0);
        } else {
            // Synth fallback for missing files
            this.playSynth(name);
        }
    }

    playMusic(name) {
        if (this.isMuted) return;

        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
        }

        if (this.music[name]) {
            this.currentMusic = this.music[name];
            this.currentMusic.volume = this.masterGain.gain.value;
            this.currentMusic.play().catch(e => console.log("Audio play failed (user interaction needed first)"));
        }
    }

    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.pause();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.masterGain.gain.value = 0;
            if (this.currentMusic) this.currentMusic.pause();
        } else {
            this.masterGain.gain.value = 0.5;
            if (this.currentMusic) this.currentMusic.play();
        }
        return this.isMuted;
    }

    // Simple synthesizer for fallback sounds
    playSynth(type) {
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();

        osc.connect(gain);
        gain.connect(this.masterGain);

        const now = this.context.currentTime;

        if (type === 'click') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
        } else if (type === 'hover') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(400, now);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
        }
    }
}

// Export instance
const soundManager = new SoundManager();
window.soundManager = soundManager; // Make global for easy access
