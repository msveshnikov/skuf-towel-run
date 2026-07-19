/**
 * Skuf's Wet Floor Run
 * Core Game Engine
 */

// --- Audio Synthesizer (Web Audio API) ---
class GameAudio {
    constructor() {
        this.ctx = null;
        this.bgmInterval = null;
        this.isMuted = false;
        this.bgmSequence = 0;
        this.bgmTempo = 135; // BPM
        this.synthVolume = 0.15;
    }

    init() {
        if (this.ctx) return;
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playClick() {
        if (this.isMuted) return;
        this.init(); this.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        gain.gain.setValueAtTime(this.synthVolume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    }

    playJump() {
        if (this.isMuted) return;
        this.init(); this.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.15);

        gain.gain.setValueAtTime(this.synthVolume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.15);
    }

    playSlip() {
        if (this.isMuted) return;
        this.init(); this.resume();
        // Squeaky slide sound: two rapid pitch drops
        const now = this.ctx.currentTime;
        const playSqueak = (delay) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(500, now + delay);
            osc.frequency.linearRampToValueAtTime(150, now + delay + 0.08);

            gain.gain.setValueAtTime(this.synthVolume * 1.5, now + delay);
            gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.08);

            osc.start(now + delay);
            osc.stop(now + delay + 0.08);
        };
        playSqueak(0);
        playSqueak(0.09);
    }

    playSplash() {
        if (this.isMuted) return;
        this.init(); this.resume();

        // Generate white noise for water splash
        const bufferSize = this.ctx.sampleRate * 0.25; // 0.25 seconds
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1000;
        filter.Q.value = 2.0;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(this.synthVolume * 1.5, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start();
        noise.stop(this.ctx.currentTime + 0.25);
    }

    playFreeze() {
        if (this.isMuted) return;
        this.init(); this.resume();
        const now = this.ctx.currentTime;
        const notes = [600, 480, 380, 290, 200]; // descending notes
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);

            gain.gain.setValueAtTime(this.synthVolume * 0.8, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.12);

            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.12);
        });
    }

    playWarm() {
        if (this.isMuted) return;
        this.init(); this.resume();
        const now = this.ctx.currentTime;
        // Warm retro chord arpeggio rising
        const notes = [261.6, 329.6, 392.0, 523.3]; // C4, E4, G4, C5
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.06);

            gain.gain.setValueAtTime(this.synthVolume * 0.7, now + idx * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.06 + 0.2);

            osc.start(now + idx * 0.06);
            osc.stop(now + idx * 0.06 + 0.2);
        });
    }

    playVictory() {
        if (this.isMuted) return;
        this.init(); this.resume();
        const now = this.ctx.currentTime;
        // Upbeat major chiptune fan-fare
        const melody = [261.6, 329.6, 392.0, 523.3, 392.0, 523.3, 659.3];
        const durations = [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.4];
        let cumulativeTime = 0;

        melody.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, now + cumulativeTime);

            gain.gain.setValueAtTime(this.synthVolume, now + cumulativeTime);
            gain.gain.setValueAtTime(this.synthVolume, now + cumulativeTime + durations[idx] - 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + cumulativeTime + durations[idx]);

            osc.start(now + cumulativeTime);
            osc.stop(now + cumulativeTime + durations[idx]);

            cumulativeTime += durations[idx];
        });
    }

    startBgm() {
        if (this.isMuted) return;
        this.init(); this.resume();
        if (this.bgmInterval) return;

        const secondsPerBeat = 60 / this.bgmTempo;
        const tick = () => {
            if (this.isMuted) return;
            const now = this.ctx.currentTime;

            // Simple retro bassline sequencer: C - G - Am - F
            const bassline = [
                130.8, 130.8, 130.8, 130.8, // C3
                98.0, 98.0, 98.0, 98.0,     // G2
                110.0, 110.0, 110.0, 110.0, // A2
                87.3, 87.3, 87.3, 87.3      // F2
            ];

            const leadMelody = [
                261.6, 329.6, 392.0, 523.3, // C arpeggio
                293.7, 392.0, 493.9, 587.3, // G arpeggio
                329.6, 440.0, 523.3, 659.3, // Am arpeggio
                349.2, 440.0, 523.3, 698.5  // F arpeggio
            ];

            const step = this.bgmSequence % 16;

            // Play bass note (sawtooth oscillator, low-pass filter for thump)
            const bassOsc = this.ctx.createOscillator();
            const bassFilter = this.ctx.createBiquadFilter();
            const bassGain = this.ctx.createGain();

            bassOsc.type = 'sawtooth';
            bassOsc.frequency.setValueAtTime(bassline[step], now);

            bassFilter.type = 'lowpass';
            bassFilter.frequency.setValueAtTime(300, now);

            bassGain.gain.setValueAtTime(this.synthVolume * 1.2, now);
            bassGain.gain.exponentialRampToValueAtTime(0.01, now + secondsPerBeat * 0.8);

            bassOsc.connect(bassFilter);
            bassFilter.connect(bassGain);
            bassGain.connect(this.ctx.destination);

            bassOsc.start(now);
            bassOsc.stop(now + secondsPerBeat * 0.8);

            // Play melodic accompaniment every alternate beat
            if (step % 2 === 0) {
                const leadOsc = this.ctx.createOscillator();
                const leadGain = this.ctx.createGain();

                leadOsc.type = 'triangle';
                leadOsc.frequency.setValueAtTime(leadMelody[step], now);

                leadGain.gain.setValueAtTime(this.synthVolume * 0.4, now);
                leadGain.gain.exponentialRampToValueAtTime(0.01, now + secondsPerBeat * 0.5);

                leadOsc.connect(leadGain);
                leadGain.connect(this.ctx.destination);

                leadOsc.start(now);
                leadOsc.stop(now + secondsPerBeat * 0.5);
            }

            this.bgmSequence++;
        };

        // Run the tick schedule
        this.bgmInterval = setInterval(tick, secondsPerBeat * 1000);
    }

    stopBgm() {
        if (this.bgmInterval) {
            clearInterval(this.bgmInterval);
            this.bgmInterval = null;
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.stopBgm();
        } else {
            this.startBgm();
        }
        return this.isMuted;
    }
}

// --- Game Engine Main Code ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// State Machine constants
const STATES = {
    START: 'start',
    PLAYING: 'playing',
    RESUME_PROMPT: 'resume_prompt',
    AD_PLAYING: 'ad_playing',
    GAMEOVER: 'gameover',
    VICTORY: 'victory'
};

let gameState = STATES.START;
const gameAudio = new GameAudio();

// Asset setup
const spriteProcessor = new SpriteProcessor({
    width: 1024, height: 559, frameCount: 4,
    frameBounds: [
        { x: 29, w: 241 }, // frame 0 – left foot forward
        { x: 281, w: 224 }, // frame 1 – stride peak
        { x: 516, w: 211 }, // frame 2 – right foot forward
        { x: 742, w: 265 }  // frame 3 – slide / both feet down
    ]
});
let playerSprites = []; // Array of processed canvases
let spritesLoaded = false;

// Granny sprites (mop_lady / bucket_lady)
let grannySprites = [];      // [idle+bucket, mop-raised, mop-low, mop-extended]
let grannySpritesLoaded = false;

// Game entities and metrics
let player = {
    // Spatial coordinates (world space)
    x: 100,
    y: 0,
    vy: 0,
    width: 60,   // Collision width
    height: 120, // Collision height

    // Movement parameters
    speed: 0,
    maxSpeed: 8,
    accel: 0.15,
    decel: 0.25,
    jumpStrength: -13.5,
    gravity: 0.52,

    // Status state flags
    isOnGround: false,
    isDucking: false,
    isSliding: false,
    isSlipped: false,
    isFrozen: false,
    isInvulnerable: 0, // frames

    // Slipped state timers
    slipTimer: 0,
    slipDuration: 80, // frames player slides out of control

    // Core game stats
    temperature: 100, // percentage 0-100
    traction: 100,    // percentage 0-100
    wetness: 0,       // current wet level of feet, decays when standing/careful

    // Animation frame timing
    animFrame: 0,
    animTimer: 0
};

// Camera control
let cameraX = 0;
let LEVEL_END_X = 5000; // overridden by level config

// --- Level Configs ---
let currentLevel = 1;
const LEVEL_CONFIGS = [
    {
        // Level 1 — Public Baths (Aqua Palace) — TUTORIAL
        id: 1,
        name: 'Public Baths',
        theme: 'aqua',
        length: 5000,
        coolingRate: 0.018,
        floorBase: '#0d3d7a',
        floorTile: '#1a4a8a',
        floorWet: 'rgba(86, 204, 242, 0.14)',
        groutColor: '#2d7ed4',
        fanWeight: 0.20,
        bucketWeight: 0.50,
        mopWeight: 0.75,
        radiatorSpacing: 900,
        minSpacing: 400,
        maxSpacingJitter: 300
    },
    {
        // Level 2 — Steam Sauna Rooms — EASY
        id: 2,
        name: 'Steam Sauna Rooms',
        theme: 'sauna',
        length: 6000,
        coolingRate: 0.024,
        floorBase: '#1a0d08',
        floorTile: '#2b1612',
        floorWet: 'rgba(255, 123, 0, 0.10)',
        groutColor: '#3a1a0e',
        fanWeight: 0.15,
        bucketWeight: 0.55,
        mopWeight: 0.80,
        radiatorSpacing: 1100,
        minSpacing: 320,
        maxSpacingJitter: 260
    },
    {
        // Level 3 — VIP Draft Hallway — MEDIUM
        id: 3,
        name: 'VIP Draft Hallway',
        theme: 'ice',
        length: 7000,
        coolingRate: 0.030,
        floorBase: '#060f14',
        floorTile: '#112330',
        floorWet: 'rgba(144, 224, 239, 0.12)',
        groutColor: '#1a3545',
        fanWeight: 0.45,
        bucketWeight: 0.62,
        mopWeight: 0.82,
        radiatorSpacing: 1300,
        minSpacing: 270,
        maxSpacingJitter: 240
    },
    {
        // Level 4 — Jungle Spa — MEDIUM+
        id: 4,
        name: 'Jungle Spa',
        theme: 'jungle',
        length: 7500,
        coolingRate: 0.033,
        floorBase: '#0a1f0a',
        floorTile: '#122b12',
        floorWet: 'rgba(80, 200, 80, 0.13)',
        groutColor: '#1e4a1e',
        fanWeight: 0.35,
        bucketWeight: 0.60,
        mopWeight: 0.82,
        radiatorSpacing: 1400,
        minSpacing: 250,
        maxSpacingJitter: 230
    },
    {
        // Level 5 — Volcanic Hot Springs — HARD
        id: 5,
        name: 'Volcanic Hot Springs',
        theme: 'volcano',
        length: 8000,
        coolingRate: 0.038,
        floorBase: '#1a0500',
        floorTile: '#2a0800',
        floorWet: 'rgba(255, 60, 0, 0.15)',
        groutColor: '#4a1000',
        fanWeight: 0.40,
        bucketWeight: 0.65,
        mopWeight: 0.85,
        radiatorSpacing: 1500,
        minSpacing: 230,
        maxSpacingJitter: 210
    },
    {
        // Level 6 — Arctic Ice Pool — HARD+
        id: 6,
        name: 'Arctic Ice Pool',
        theme: 'arctic',
        length: 8500,
        coolingRate: 0.044,
        floorBase: '#0a1a2a',
        floorTile: '#102235',
        floorWet: 'rgba(200, 240, 255, 0.20)',
        groutColor: '#1e4060',
        fanWeight: 0.55,
        bucketWeight: 0.68,
        mopWeight: 0.85,
        radiatorSpacing: 1600,
        minSpacing: 210,
        maxSpacingJitter: 200
    },
    {
        // Level 7 — Underground Cistern — VERY HARD
        id: 7,
        name: 'Underground Cistern',
        theme: 'cistern',
        length: 9000,
        coolingRate: 0.050,
        floorBase: '#0d0820',
        floorTile: '#18103a',
        floorWet: 'rgba(160, 100, 255, 0.14)',
        groutColor: '#2a1860',
        fanWeight: 0.50,
        bucketWeight: 0.70,
        mopWeight: 0.87,
        radiatorSpacing: 1700,
        minSpacing: 195,
        maxSpacingJitter: 190
    },
    {
        // Level 8 — Neon Nightclub Pool — VERY HARD+
        id: 8,
        name: 'Neon Nightclub Pool',
        theme: 'neon',
        length: 9500,
        coolingRate: 0.055,
        floorBase: '#1a0020',
        floorTile: '#280030',
        floorWet: 'rgba(255, 0, 200, 0.15)',
        groutColor: '#4a0060',
        fanWeight: 0.60,
        bucketWeight: 0.72,
        mopWeight: 0.88,
        radiatorSpacing: 1800,
        minSpacing: 180,
        maxSpacingJitter: 180
    },
    {
        // Level 9 — Rooftop Infinity Pool — EXTREME
        id: 9,
        name: 'Rooftop Infinity Pool',
        theme: 'rooftop',
        length: 10500,
        coolingRate: 0.062,
        floorBase: '#050d18',
        floorTile: '#0a1825',
        floorWet: 'rgba(100, 200, 255, 0.18)',
        groutColor: '#142a40',
        fanWeight: 0.65,
        bucketWeight: 0.75,
        mopWeight: 0.90,
        radiatorSpacing: 2000,
        minSpacing: 165,
        maxSpacingJitter: 170
    },
    {
        // Level 10 — The Final Chamber — MAX DIFFICULTY
        id: 10,
        name: 'The Final Chamber',
        theme: 'final',
        length: 12000,
        coolingRate: 0.072,
        floorBase: '#100000',
        floorTile: '#1a0000',
        floorWet: 'rgba(255, 30, 30, 0.20)',
        groutColor: '#380000',
        fanWeight: 0.70,
        bucketWeight: 0.80,
        mopWeight: 0.92,
        radiatorSpacing: 2200,
        minSpacing: 150,
        maxSpacingJitter: 160
    }
];

// --- Theme Configs for Different Colors / Graphics ---
const THEME_CONFIGS = {
    aqua: {
        wallBg: '#1a4a8a',
        wallGradStart: 'rgba(80, 140, 220, 0.28)',
        wallGradEnd: 'rgba(10, 35, 80, 0.35)',
        pillarGradLeft: '#1e5fa8',
        pillarGradMid: '#2d7ed4',
        pillarGradRight: '#163d72',
        pillarCapital1: '#4aacdf',
        pillarCapital2: '#2d7ed4',
        pillarDeco: 'mosaic_dots',
        windowType: 'arch',
        windowGradStart: '#0077b6',
        windowGradEnd: '#48cae4',
        windowRippleType: 'water',
        windowRippleColor: 'rgba(255, 255, 255, 0.18)',
        windowFrameColor: '#f5c842',
        friezeType: 'wave',
        friezeColor1: 'rgba(74, 172, 223, 0.5)',
        friezeColor2: 'rgba(86, 204, 242, 0.3)',
        wainscotingColor: '#1155a0',
        wainscotingStripeTop: '#4aacdf',
        wainscotingStripeBottom: '#0d3d7a',
        mosaicColors: ['#56ccf2', '#2d9cdb', '#1a4a8a', '#0077b6', '#48cae4', '#00b4d8'],
        decorType: 'starfish',
        pipeColor: '#0d5fa8',
        pipeHighlight: '#4aacdf',
        pipeJoint1: '#f5c842',
        pipeJoint2: '#d4a800',
        radiatorColor: '#0d3d7a',
        radiatorFinColor: '#1a6ab8',
        radiatorValveColor: '#56ccf2',
        radiatorValveGlow: '#00f2fe',
        waterPoolColor1: '#48cae4',
        waterPoolColor2: '#90e0ef',
        waterPoolColor3: '#00b4d8',
        waterPoolColor4: 'rgba(0, 119, 182, 0)',
        waterPoolRippleColor: '#56ccf2',
        glowColor: '#00f2fe',
        bodyBg: '#1b2030',
        cardBg: 'rgba(22, 26, 38, 0.7)'
    },
    sauna: {
        wallBg: '#2b1612',
        wallGradStart: 'rgba(78, 46, 40, 0.4)',
        wallGradEnd: 'rgba(26, 10, 7, 0.5)',
        pillarGradLeft: '#3e2723',
        pillarGradMid: '#4e342e',
        pillarGradRight: '#27120c',
        pillarCapital1: '#8d6e63',
        pillarCapital2: '#5d4037',
        pillarDeco: 'wood_grain',
        windowType: 'rect',
        windowGradStart: '#e65100',
        windowGradEnd: '#ffcc80',
        windowRippleType: 'steam_haze',
        windowRippleColor: 'rgba(255, 255, 255, 0.1)',
        windowFrameColor: '#ff9800',
        friezeType: 'none',
        friezeColor1: 'rgba(141, 110, 99, 0.5)',
        friezeColor2: 'rgba(93, 64, 55, 0.3)',
        wainscotingColor: '#1d0b08',
        wainscotingStripeTop: '#5d4037',
        wainscotingStripeBottom: '#3e2723',
        mosaicColors: ['#5d4037', '#4e342e', '#3e2723', '#8d6e63', '#d7ccc8', '#ffe0b2'],
        decorType: 'thermometer',
        pipeColor: '#a1887f',
        pipeHighlight: '#d7ccc8',
        pipeJoint1: '#ff9800',
        pipeJoint2: '#e65100',
        radiatorColor: '#4e342e',
        radiatorFinColor: '#5d4037',
        radiatorValveColor: '#ff9800',
        radiatorValveGlow: '#ff5722',
        waterPoolColor1: '#ff7b00',
        waterPoolColor2: '#ffb74d',
        waterPoolColor3: '#e65100',
        waterPoolColor4: 'rgba(230, 81, 0, 0)',
        waterPoolRippleColor: '#ff5722',
        glowColor: '#ff9800',
        bodyBg: '#1e0d07',
        cardBg: 'rgba(38, 20, 15, 0.75)'
    },
    ice: {
        wallBg: '#0e1a24',
        wallGradStart: 'rgba(32, 58, 67, 0.4)',
        wallGradEnd: 'rgba(15, 32, 39, 0.5)',
        pillarGradLeft: '#152e3c',
        pillarGradMid: '#22485e',
        pillarGradRight: '#0d1f2b',
        pillarCapital1: '#4fc3f7',
        pillarCapital2: '#0288d1',
        pillarDeco: 'frost_lines',
        windowType: 'arch',
        windowGradStart: '#00bcd4',
        windowGradEnd: '#e0f7fa',
        windowRippleType: 'bubbles',
        windowRippleColor: 'rgba(255, 255, 255, 0.3)',
        windowFrameColor: '#b0bec5',
        friezeType: 'icicle',
        friezeColor1: 'rgba(79, 195, 247, 0.4)',
        friezeColor2: 'rgba(224, 247, 250, 0.3)',
        wainscotingColor: '#091118',
        wainscotingStripeTop: '#4fc3f7',
        wainscotingStripeBottom: '#1b3648',
        mosaicColors: ['#b2ebf2', '#80deea', '#4dd0e1', '#26c6da', '#00bcd4', '#0097a7'],
        decorType: 'beer_mug',
        pipeColor: '#90a4ae',
        pipeHighlight: '#cfd8dc',
        pipeJoint1: '#00bcd4',
        pipeJoint2: '#00838f',
        radiatorColor: '#263238',
        radiatorFinColor: '#37474f',
        radiatorValveColor: '#80deea',
        radiatorValveGlow: '#00bcd4',
        waterPoolColor1: '#80deea',
        waterPoolColor2: '#e0f7fa',
        waterPoolColor3: '#00bcd4',
        waterPoolColor4: 'rgba(0, 188, 212, 0)',
        waterPoolRippleColor: '#26c6da',
        glowColor: '#a5f3fc',
        bodyBg: '#091016',
        cardBg: 'rgba(15, 25, 35, 0.75)'
    },
    jungle: {
        wallBg: '#081a08',
        wallGradStart: 'rgba(27, 67, 28, 0.35)',
        wallGradEnd: 'rgba(5, 14, 5, 0.45)',
        pillarGradLeft: '#133814',
        pillarGradMid: '#1e5320',
        pillarGradRight: '#0d250e',
        pillarCapital1: '#81c784',
        pillarCapital2: '#4caf50',
        pillarDeco: 'leaf_veins',
        windowType: 'arch',
        windowGradStart: '#2e7d32',
        windowGradEnd: '#81c784',
        windowRippleType: 'leaves',
        windowRippleColor: 'rgba(200, 255, 200, 0.25)',
        windowFrameColor: '#ffeb3b',
        friezeType: 'ivy',
        friezeColor1: 'rgba(129, 199, 132, 0.5)',
        friezeColor2: 'rgba(76, 175, 80, 0.3)',
        wainscotingColor: '#040e04',
        wainscotingStripeTop: '#4caf50',
        wainscotingStripeBottom: '#1b5e20',
        mosaicColors: ['#a5d6a7', '#81c784', '#66bb6a', '#4caf50', '#43a047', '#2e7d32'],
        decorType: 'flower',
        pipeColor: '#4caf50',
        pipeHighlight: '#a5d6a7',
        pipeJoint1: '#c8e6c9',
        pipeJoint2: '#81c784',
        radiatorColor: '#1b5e20',
        radiatorFinColor: '#2e7d32',
        radiatorValveColor: '#81c784',
        radiatorValveGlow: '#4caf50',
        waterPoolColor1: '#66bb6a',
        waterPoolColor2: '#a5d6a7',
        waterPoolColor3: '#388e3c',
        waterPoolColor4: 'rgba(56, 142, 60, 0)',
        waterPoolRippleColor: '#81c784',
        glowColor: '#4ade80',
        bodyBg: '#041004',
        cardBg: 'rgba(15, 30, 15, 0.75)'
    },
    volcano: {
        wallBg: '#140400',
        wallGradStart: 'rgba(62, 10, 0, 0.45)',
        wallGradEnd: 'rgba(10, 2, 0, 0.55)',
        pillarGradLeft: '#1f0500',
        pillarGradMid: '#2a0800',
        pillarGradRight: '#120200',
        pillarCapital1: '#ff3d00',
        pillarCapital2: '#dd2c00',
        pillarDeco: 'lava_cracks',
        windowType: 'rect',
        windowGradStart: '#b71c1c',
        windowGradEnd: '#ff3d00',
        windowRippleType: 'magma',
        windowRippleColor: 'rgba(255, 60, 0, 0.35)',
        windowFrameColor: '#ffb300',
        friezeType: 'none',
        friezeColor1: 'rgba(255, 61, 0, 0.4)',
        friezeColor2: 'rgba(221, 44, 0, 0.2)',
        wainscotingColor: '#0c0100',
        wainscotingStripeTop: '#ff3d00',
        wainscotingStripeBottom: '#3e0a00',
        mosaicColors: ['#ff8a80', '#ff5252', '#ff1744', '#d500f0', '#ffd740', '#ff9100'],
        decorType: 'fire',
        pipeColor: '#37474f',
        pipeHighlight: '#ff5722',
        pipeJoint1: '#ff5722',
        pipeJoint2: '#dd2c00',
        radiatorColor: '#212121',
        radiatorFinColor: '#303030',
        radiatorValveColor: '#ff1744',
        radiatorValveGlow: '#ff9100',
        waterPoolColor1: '#ff3d00',
        waterPoolColor2: '#ffb74d',
        waterPoolColor3: '#dd2c00',
        waterPoolColor4: 'rgba(221, 44, 0, 0)',
        waterPoolRippleColor: '#ff9100',
        glowColor: '#f97316',
        bodyBg: '#100200',
        cardBg: 'rgba(30, 10, 5, 0.8)'
    },
    arctic: {
        wallBg: '#061320',
        wallGradStart: 'rgba(13, 44, 71, 0.4)',
        wallGradEnd: 'rgba(4, 10, 16, 0.5)',
        pillarGradLeft: '#0b2238',
        pillarGradMid: '#12395c',
        pillarGradRight: '#061626',
        pillarCapital1: '#80d8ff',
        pillarCapital2: '#40c4ff',
        pillarDeco: 'icicles',
        windowType: 'arch',
        windowGradStart: '#0091ea',
        windowGradEnd: '#40c4ff',
        windowRippleType: 'snow',
        windowRippleColor: 'rgba(255, 255, 255, 0.45)',
        windowFrameColor: '#e0f7fa',
        friezeType: 'icicle',
        friezeColor1: 'rgba(128, 216, 255, 0.5)',
        friezeColor2: 'rgba(224, 247, 250, 0.35)',
        wainscotingColor: '#030b14',
        wainscotingStripeTop: '#80d8ff',
        wainscotingStripeBottom: '#0091ea',
        mosaicColors: ['#e0f7fa', '#b2ebf2', '#80deea', '#4dd0e1', '#00e5ff', '#00b0ff'],
        decorType: 'snowflake',
        pipeColor: '#4fc3f7',
        pipeHighlight: '#ffffff',
        pipeJoint1: '#e0f7fa',
        pipeJoint2: '#00e5ff',
        radiatorColor: '#1c3144',
        radiatorFinColor: '#007ebb',
        radiatorValveColor: '#00e5ff',
        radiatorValveGlow: '#e0f7fa',
        waterPoolColor1: '#00e5ff',
        waterPoolColor2: '#e0f7fa',
        waterPoolColor3: '#00b0ff',
        waterPoolColor4: 'rgba(0, 176, 255, 0)',
        waterPoolRippleColor: '#80d8ff',
        glowColor: '#38bdf8',
        bodyBg: '#050f18',
        cardBg: 'rgba(10, 20, 30, 0.75)'
    },
    cistern: {
        wallBg: '#12101a',
        wallGradStart: 'rgba(35, 28, 54, 0.4)',
        wallGradEnd: 'rgba(12, 10, 18, 0.5)',
        pillarGradLeft: '#171324',
        pillarGradMid: '#261f3b',
        pillarGradRight: '#0f0c17',
        pillarCapital1: '#9575cd',
        pillarCapital2: '#673ab7',
        pillarDeco: 'moss',
        windowType: 'arch',
        windowGradStart: '#120c1f',
        windowGradEnd: '#512da8',
        windowRippleType: 'dripping_water',
        windowRippleColor: 'rgba(150, 100, 250, 0.25)',
        windowFrameColor: '#b388ff',
        friezeType: 'none',
        friezeColor1: 'rgba(149, 117, 205, 0.4)',
        friezeColor2: 'rgba(103, 58, 183, 0.2)',
        wainscotingColor: '#08060d',
        wainscotingStripeTop: '#673ab7',
        wainscotingStripeBottom: '#311b92',
        mosaicColors: ['#d1c4e9', '#b39ddb', '#9575cd', '#7e57c2', '#673ab7', '#5e35b1'],
        decorType: 'lantern',
        pipeColor: '#795548',
        pipeHighlight: '#bcaaa4',
        pipeJoint1: '#8d6e63',
        pipeJoint2: '#5d4037',
        radiatorColor: '#311b92',
        radiatorFinColor: '#4527a0',
        radiatorValveColor: '#b388ff',
        radiatorValveGlow: '#673ab7',
        waterPoolColor1: '#b388ff',
        waterPoolColor2: '#d1c4e9',
        waterPoolColor3: '#673ab7',
        waterPoolColor4: 'rgba(103, 58, 183, 0)',
        waterPoolRippleColor: '#9575cd',
        glowColor: '#a8a29e',
        bodyBg: '#0b0a10',
        cardBg: 'rgba(20, 15, 30, 0.8)'
    },
    neon: {
        wallBg: '#08000d',
        wallGradStart: 'rgba(28, 0, 48, 0.4)',
        wallGradEnd: 'rgba(4, 0, 8, 0.5)',
        pillarGradLeft: '#10001c',
        pillarGradMid: '#1e0033',
        pillarGradRight: '#0a0012',
        pillarCapital1: '#ff007f',
        pillarCapital2: '#d500f9',
        pillarDeco: 'neon_pulse',
        windowType: 'rect',
        windowGradStart: '#0a0010',
        windowGradEnd: '#ff007f',
        windowRippleType: 'equalizer',
        windowRippleColor: 'rgba(0, 242, 254, 0.45)',
        windowFrameColor: '#00f2fe',
        friezeType: 'neon',
        friezeColor1: '#ff007f',
        friezeColor2: '#00f2fe',
        wainscotingColor: '#040006',
        wainscotingStripeTop: '#ff007f',
        wainscotingStripeBottom: '#00f2fe',
        mosaicColors: ['#ff007f', '#ff00ff', '#d500f9', '#8a2be2', '#00ffff', '#1e90ff'],
        decorType: 'music_note',
        pipeColor: '#ff00ff',
        pipeHighlight: '#00ffff',
        pipeJoint1: '#00ffff',
        pipeJoint2: '#ff00ff',
        radiatorColor: '#12001a',
        radiatorFinColor: '#1a0026',
        radiatorValveColor: '#ff007f',
        radiatorValveGlow: '#00ffff',
        waterPoolColor1: '#ff00ff',
        waterPoolColor2: '#8a2be2',
        waterPoolColor3: '#00ffff',
        waterPoolColor4: 'rgba(0, 255, 255, 0)',
        waterPoolRippleColor: '#ff007f',
        glowColor: '#f43f5e',
        bodyBg: '#07000c',
        cardBg: 'rgba(25, 0, 40, 0.8)'
    },
    rooftop: {
        wallBg: '#030914',
        wallGradStart: 'rgba(13, 29, 51, 0.45)',
        wallGradEnd: 'rgba(2, 5, 10, 0.55)',
        pillarGradLeft: '#071526',
        pillarGradMid: '#0e223c',
        pillarGradRight: '#040a13',
        pillarCapital1: '#ffb300',
        pillarCapital2: '#ff6f00',
        pillarDeco: 'city_lights',
        windowType: 'arch',
        windowGradStart: '#880e4f',
        windowGradEnd: '#d81b60',
        windowRippleType: 'clouds',
        windowRippleColor: 'rgba(255, 179, 0, 0.3)',
        windowFrameColor: '#ffb300',
        friezeType: 'none',
        friezeColor1: 'rgba(255, 111, 0, 0.5)',
        friezeColor2: 'rgba(21, 101, 192, 0.3)',
        wainscotingColor: '#010408',
        wainscotingStripeTop: '#ff6f00',
        wainscotingStripeBottom: '#1565c0',
        mosaicColors: ['#ffe082', '#ffd54f', '#ffca28', '#ffb300', '#ff8f00', '#ff6f00'],
        decorType: 'sun',
        pipeColor: '#ffb300',
        pipeHighlight: '#ffffff',
        pipeJoint1: '#ffd54f',
        pipeJoint2: '#ffb300',
        radiatorColor: '#003050',
        radiatorFinColor: '#004870',
        radiatorValveColor: '#ffb300',
        radiatorValveGlow: '#ffd54f',
        waterPoolColor1: '#ffb300',
        waterPoolColor2: '#ffe082',
        waterPoolColor3: '#ff8f00',
        waterPoolColor4: 'rgba(255, 143, 0, 0)',
        waterPoolRippleColor: '#ffca28',
        glowColor: '#ec4899',
        bodyBg: '#05070e',
        cardBg: 'rgba(15, 20, 30, 0.8)'
    },
    final: {
        wallBg: '#0d0000',
        wallGradStart: 'rgba(45, 0, 0, 0.45)',
        wallGradEnd: 'rgba(5, 0, 0, 0.55)',
        pillarGradLeft: '#150000',
        pillarGradMid: '#220000',
        pillarGradRight: '#0a0000',
        pillarCapital1: '#ffc107',
        pillarCapital2: '#d50000',
        pillarDeco: 'runes',
        windowType: 'rect',
        windowGradStart: '#2d0000',
        windowGradEnd: '#ffc107',
        windowRippleType: 'power_vortex',
        windowRippleColor: 'rgba(255, 215, 0, 0.35)',
        windowFrameColor: '#ffc107',
        friezeType: 'none',
        friezeColor1: 'rgba(213, 0, 0, 0.5)',
        friezeColor2: 'rgba(255, 193, 7, 0.3)',
        wainscotingColor: '#070000',
        wainscotingStripeTop: '#d50000',
        wainscotingStripeBottom: '#ffc107',
        mosaicColors: ['#ff8a80', '#ff5252', '#ff1744', '#d50000', '#ffd740', '#ffb300'],
        decorType: 'runes',
        pipeColor: '#ffd700',
        pipeHighlight: '#ff1744',
        pipeJoint1: '#ffd740',
        pipeJoint2: '#ff1744',
        radiatorColor: '#2d0000',
        radiatorFinColor: '#3e0000',
        radiatorValveColor: '#ffd700',
        radiatorValveGlow: '#ff1744',
        waterPoolColor1: '#ffd700',
        waterPoolColor2: '#ff8a80',
        waterPoolColor3: '#d50000',
        waterPoolColor4: 'rgba(213, 0, 0, 0)',
        waterPoolRippleColor: '#ff1744',
        glowColor: '#fbbf24',
        bodyBg: '#0a0000',
        cardBg: 'rgba(25, 0, 0, 0.85)'
    }
};

// Gets the theme configuration for the active level
function getActiveTheme() {
    const cfg = getLevelConfig();
    return THEME_CONFIGS[cfg.theme] || THEME_CONFIGS.aqua;
}

function getLevelConfig() {
    return LEVEL_CONFIGS[currentLevel - 1] || LEVEL_CONFIGS[0];
}

// Applies theme CSS variables to the DOM
function applyLevelTheme() {
    const theme = getActiveTheme();
    const root = document.documentElement;
    root.style.setProperty('--glow-cyan', theme.glowColor);
    root.style.setProperty('--bg-color', theme.bodyBg);
    root.style.setProperty('--card-bg', theme.cardBg);
    // Derive a translucent cloud color from the level's accent glow
    // We parse the hex color and create a low-opacity rgba version for the ambient steam
    const hex = theme.glowColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    root.style.setProperty('--cloud-color', `rgba(${r}, ${g}, ${b}, 0.08)`);
    
    document.body.style.background = `radial-gradient(circle at center, ${theme.bodyBg} 0%, #08090d 100%)`;
}

// Level maps, generated procedurally
let obstacles = [];
let radiators = [];
let particles = [];

// Stats trackers for Victory panel
let runTimer = 0;
let mopsDodgedCount = 0;
let adsWatchedCount = 0;
let resumeCount = 0; // limit to 2 resumes per run

// Input tracking
const keys = {
    right: false,
    left: false,
    up: false,
    down: false
};



// --- Procedural Level Generation ---
function generateLevel() {
    obstacles = [];
    radiators = [];
    particles = [];

    const cfg = getLevelConfig();
    applyLevelTheme();
    LEVEL_END_X = cfg.length;

    // Spawn radiators/heaters to warm up
    for (let x = 600; x < LEVEL_END_X - 400; x += cfg.radiatorSpacing) {
        radiators.push({
            x: x,
            width: 70,
            height: 90
        });
    }

    // Spawn obstacles: fans, mop ladies, bucket ladies, scrubbing machines
    let xPointer = 400;
    while (xPointer < LEVEL_END_X - 250) {
        // Decide spacing based on position (get harder as you go)
        const densityMultiplier = xPointer < 2000 ? 1.0 : (xPointer < 3800 ? 0.8 : 0.6);
        const spacing = (cfg.minSpacing + Math.random() * cfg.maxSpacingJitter) * densityMultiplier;

        xPointer += spacing;
        if (xPointer >= LEVEL_END_X - 250) break;

        // Radiator zones are safe, don't spawn hazards directly on them
        const isNearRadiator = radiators.some(r => Math.abs(r.x - xPointer) < 200);
        if (isNearRadiator) continue;

        // Choose hazard type based on level config weights
        const rand = Math.random();
        if (rand < cfg.fanWeight) {
            // Fan (blown wind from ceiling or floor)
            const ceilingFan = Math.random() > 0.5;
            obstacles.push({
                type: 'fan',
                x: xPointer,
                y: ceilingFan ? 150 : 360,
                width: 60,
                height: 60,
                isCeiling: ceilingFan,
                windWidth: 160,
                rotAngle: 0
            });
        } else if (rand < cfg.bucketWeight) {
            // Old lady with bucket (splashing water)
            obstacles.push({
                type: 'bucket_lady',
                x: xPointer,
                y: 340,
                width: 50,
                height: 80,
                splashTimer: Math.random() * 120,
                splashCooldown: 150,
                state: 'idle'
            });
        } else if (rand < cfg.mopWeight) {
            // Old lady with mop (swiping feet)
            obstacles.push({
                type: 'mop_lady',
                x: xPointer,
                y: 340,
                width: 50,
                height: 80,
                swipeTimer: 0,
                swipeState: 'back',
                mopX: xPointer - 40,
                mopWidth: 80
            });
        } else {
            // Scrubbing machine (moving obstacle)
            obstacles.push({
                type: 'scrub_machine',
                x: xPointer,
                y: 370,
                width: 70,
                height: 50,
                speed: 1.5 + Math.random() * 1.5,
                direction: -1,
                startX: xPointer,
                range: 120
            });
        }
    }
}

// --- Input Bindings ---
window.addEventListener('keydown', (e) => {
    // Keyboard inputs
    switch (e.code) {
        case 'ArrowRight':
        case 'KeyD':
            keys.right = true;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            keys.left = true;
            break;
        case 'ArrowUp':
        case 'KeyW':
        case 'Space':
            keys.up = true;
            break;
        case 'ArrowDown':
        case 'KeyS':
            keys.down = true;
            break;
    }
});

window.addEventListener('keyup', (e) => {
    switch (e.code) {
        case 'ArrowRight':
        case 'KeyD':
            keys.right = false;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            keys.left = false;
            break;
        case 'ArrowUp':
        case 'KeyW':
        case 'Space':
            keys.up = false;
            break;
        case 'ArrowDown':
        case 'KeyS':
            keys.down = false;
            break;
    }
});

// --- Touch Screen Mobile Controls Setup ---
const btnLeft = document.getElementById('btnLeft');
const btnRight = document.getElementById('btnRight');
const btnJump = document.getElementById('btnJump');
const btnDuck = document.getElementById('btnDuck');

if (btnLeft) {
    btnLeft.addEventListener('touchstart', (e) => { e.preventDefault(); keys.left = true; });
    btnLeft.addEventListener('touchend', (e) => { e.preventDefault(); keys.left = false; });
    btnLeft.addEventListener('touchcancel', (e) => { e.preventDefault(); keys.left = false; });
}
if (btnRight) {
    btnRight.addEventListener('touchstart', (e) => { e.preventDefault(); keys.right = true; });
    btnRight.addEventListener('touchend', (e) => { e.preventDefault(); keys.right = false; });
    btnRight.addEventListener('touchcancel', (e) => { e.preventDefault(); keys.right = false; });
}
if (btnJump) {
    btnJump.addEventListener('touchstart', (e) => { e.preventDefault(); keys.up = true; });
    btnJump.addEventListener('touchend', (e) => { e.preventDefault(); keys.up = false; });
    btnJump.addEventListener('touchcancel', (e) => { e.preventDefault(); keys.up = false; });
}
if (btnDuck) {
    btnDuck.addEventListener('touchstart', (e) => { e.preventDefault(); keys.down = true; });
    btnDuck.addEventListener('touchend', (e) => { e.preventDefault(); keys.down = false; });
    btnDuck.addEventListener('touchcancel', (e) => { e.preventDefault(); keys.down = false; });
}

// Automatically show mobile controls if a touch device is detected
function detectTouchDevice() {
    const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    if (isTouch) {
        const mobileControls = document.getElementById('mobileControls');
        if (mobileControls) mobileControls.classList.add('visible');

        // Hide standard keyboard control badges
        const controlsReminder = document.getElementById('controlsReminder');
        if (controlsReminder) controlsReminder.style.display = 'none';
    }
}
detectTouchDevice();

// --- Responsive Game Wrapper Scaling ---
function scaleGame() {
    const wrapper = document.querySelector('.game-wrapper');
    if (!wrapper) return;
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Scale to fit screen dimension (maximum fit)
    const scale = Math.min(w / 960, h / 540);
    wrapper.style.transform = `scale(${scale})`;
}
window.addEventListener('resize', scaleGame);
window.addEventListener('load', scaleGame);
scaleGame();
setTimeout(scaleGame, 100);

// UI Buttons Event Listeners
document.getElementById('startBtn').addEventListener('click', () => {
    gameAudio.playClick();
    currentLevel = 1;
    startGame();
});

document.getElementById('retryBtn').addEventListener('click', () => {
    gameAudio.playClick();
    startGame(); // retry same level
});

document.getElementById('winRetryBtn').addEventListener('click', () => {
    gameAudio.playClick();
    startGame(); // replay same level
});

document.getElementById('nextLevelBtn').addEventListener('click', () => {
    gameAudio.playClick();
    if (currentLevel < LEVEL_CONFIGS.length) {
        currentLevel++;
    }
    startGame();
});

document.getElementById('restartGameBtn').addEventListener('click', () => {
    gameAudio.playClick();
    document.getElementById('resumePromptScreen').classList.add('hidden');
    triggerGameOver("WASHHOUSE FATIGUE", "You chose to freeze instead of viewing a dumpling commercial.");
});

document.getElementById('watchAdBtn').addEventListener('click', () => {
    gameAudio.playClick();
    document.getElementById('resumePromptScreen').classList.add('hidden');
    skipAd();
});

// Settings buttons
const audioBtn = document.getElementById('audioToggle');
audioBtn.addEventListener('click', () => {
    const isMuted = gameAudio.toggleMute();
    audioBtn.innerHTML = isMuted ? '🔇' : '🔊';
    audioBtn.style.borderColor = isMuted ? 'rgba(255, 78, 80, 0.4)' : 'var(--glow-cyan)';
});

const scanlineBtn = document.getElementById('scanlineToggle');
const crtOverlay = document.getElementById('crtOverlay');
scanlineBtn.addEventListener('click', () => {
    gameAudio.playClick();
    crtOverlay.classList.toggle('disabled');
    scanlineBtn.innerHTML = crtOverlay.classList.contains('disabled') ? '📺❌' : '📺';
});

// --- Gameplay Mechanics & Engine Loops ---

function startGame() {
    // Reset metrics
    player.x = 100;
    player.y = 300;
    player.vy = 0;
    player.speed = 0;
    player.temperature = 100;
    player.traction = 100;
    player.wetness = 0;
    player.isOnGround = false;
    player.isDucking = false;
    player.isSliding = false;
    player.isSlipped = false;
    player.isFrozen = false;
    player.isInvulnerable = 0;

    cameraX = 0;
    runTimer = 0;
    mopsDodgedCount = 0;
    adsWatchedCount = 0;
    resumeCount = 0;

    keys.right = false;
    keys.left = false;
    keys.up = false;
    keys.down = false;

    generateLevel();

    // UI visibility transitions
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('gameOverScreen').classList.add('hidden');
    document.getElementById('victoryScreen').classList.add('hidden');
    document.getElementById('gameHud').classList.add('visible');
    document.getElementById('controlsReminder').classList.add('visible');

    gameState = STATES.PLAYING;
    gameAudio.stopBgm();
    gameAudio.startBgm();
}

function triggerGameOver(reason, advice) {
    gameState = STATES.GAMEOVER;
    gameAudio.stopBgm();
    gameAudio.playFreeze();

    document.getElementById('gameHud').classList.remove('visible');
    document.getElementById('controlsReminder').classList.remove('visible');

    document.getElementById('deathReason').innerText = reason;
    document.getElementById('deathAdvice').innerText = advice;
    document.getElementById('gameOverScreen').classList.remove('hidden');
}

function triggerVictory() {
    gameState = STATES.VICTORY;
    gameAudio.stopBgm();
    gameAudio.playVictory();

    document.getElementById('gameHud').classList.remove('visible');
    document.getElementById('controlsReminder').classList.remove('visible');

    // Populate stats
    document.getElementById('statTime').innerText = (runTimer / 60).toFixed(1) + 's';
    document.getElementById('statMops').innerText = mopsDodgedCount;
    document.getElementById('statAds').innerText = adsWatchedCount;

    // Level-aware victory text
    const isLastLevel = currentLevel >= LEVEL_CONFIGS.length;
    const cfg = getLevelConfig();
    const titleEl = document.getElementById('victoryTitle');
    const subEl = document.getElementById('victorySubTitle');
    const nextBtn = document.getElementById('nextLevelBtn');

    if (isLastLevel) {
        titleEl.innerText = 'GRAND VICTORY! 🏆';
        titleEl.style.color = 'var(--glow-yellow)';
        titleEl.style.filter = 'drop-shadow(0 0 14px rgba(249, 212, 35, 0.7))';
        subEl.innerText = `You conquered all ${LEVEL_CONFIGS.length} levels of the bathhouse gauntlet!`;
        if (nextBtn) nextBtn.classList.add('hidden');
    } else {
        titleEl.innerText = `LEVEL ${currentLevel} CLEAR! 🎉`;
        titleEl.style.color = 'var(--glow-green)';
        titleEl.style.filter = 'drop-shadow(0 0 10px rgba(0, 255, 135, 0.5))';
        subEl.innerText = `You survived the ${cfg.name}! The next room awaits...`;
        if (nextBtn) nextBtn.classList.remove('hidden');
    }

    document.getElementById('victoryScreen').classList.remove('hidden');
}

// Resuming game
function skipAd() {
    // Resume player parameters
    player.temperature = 100;
    player.traction = 100;
    player.wetness = 0;
    player.isSlipped = false;
    player.isFrozen = false;
    player.vy = 0;
    player.speed = 2; // slow push forward
    player.isInvulnerable = 150; // 2.5 seconds invulnerability

    adsWatchedCount++;
    resumeCount++;

    gameState = STATES.PLAYING;
    gameAudio.startBgm();
}

function offerResume() {
    gameState = STATES.RESUME_PROMPT;
    gameAudio.stopBgm();

    document.getElementById('gameHud').classList.remove('visible');
    document.getElementById('controlsReminder').classList.remove('visible');

    const countdownDiv = document.getElementById('resumeCountdown');
    let timer = 5;
    countdownDiv.innerText = timer;

    document.getElementById('resumePromptScreen').classList.remove('hidden');

    const interval = setInterval(() => {
        timer--;
        if (timer >= 0) {
            countdownDiv.innerText = timer;
        } else {
            clearInterval(interval);
            if (gameState === STATES.RESUME_PROMPT) {
                document.getElementById('resumePromptScreen').classList.add('hidden');
                triggerGameOver("FROZEN RIGID", "You took too long to watch the sponsor video!");
            }
        }
    }, 1000);

    // Cancel callback helper on action buttons
    const watchAdBtn = document.getElementById('watchAdBtn');
    const restartBtn = document.getElementById('restartGameBtn');

    const cleanup = () => {
        clearInterval(interval);
        watchAdBtn.removeEventListener('click', cleanup);
        restartBtn.removeEventListener('click', cleanup);
    };

    watchAdBtn.addEventListener('click', cleanup);
    restartBtn.addEventListener('click', cleanup);
}

// --- Game Logic Update ---
function updatePhysics() {
    // 1. Decays & invulnerability ticks
    if (player.isInvulnerable > 0) player.isInvulnerable--;
    runTimer++;

    // Minor passive cooling - rate depends on level
    player.temperature -= getLevelConfig().coolingRate;

    // Damp floor traction recovery when not sprinting
    const floorIsWet = isFloorWetAt(player.x);
    if (!keys.right && player.traction < 100) {
        player.traction += 0.9; // recover grip slowly
    }

    if (player.traction > 100) player.traction = 100;
    if (player.traction < 0) player.traction = 0;

    // 2. Movement Controls & Slip Physics
    if (player.isSlipped) {
        // Player is sliding helplessly on the floor
        player.slipTimer--;
        player.isDucking = true; // collision bounds squished during slip

        // Slipping maintains high momentum with minor friction deceleration
        player.speed *= 0.975;
        player.x += player.speed;

        // Recover traction slightly during the slide
        player.traction += 0.4;

        if (player.slipTimer <= 0) {
            player.isSlipped = false;
            player.traction = 40; // regain control with low grip
        }
    } else {
        // Standard locomotion
        player.isDucking = keys.down && player.isOnGround;

        if (player.isDucking) {
            // Ducking decelerates player speed rapidly
            player.speed -= player.decel * 1.5;
            if (player.speed < 0) player.speed = 0;

            // Ducking slide: if slide executed at high velocity, trigger momentary slide
            if (keys.right && player.speed > 5) {
                player.isSliding = true;
            }
        } else {
            player.isSliding = false;

            if (keys.right) {
                // Accelerate
                player.speed += player.accel;
                if (player.speed > player.maxSpeed) player.speed = player.maxSpeed;
            } else if (keys.left) {
                // Brake / Back up carefully
                player.speed -= player.decel;
                if (player.speed < -2) player.speed = -2; // minor backtrack
            } else {
                // Glide friction
                if (player.speed > 0) player.speed -= player.decel * 0.5;
                if (player.speed < 0) player.speed += player.decel * 0.5;
                if (Math.abs(player.speed) < 0.1) player.speed = 0;
            }
        }

        // Apply traction mechanics on wet floor
        if (floorIsWet && player.isOnGround) {
            // Running fast on wet tiles strips away traction
            if (player.speed > 2.5) {
                const speedFactor = (player.speed - 2.5) * 0.15;
                player.traction -= speedFactor;
            }

            // High velocity on wet floor triggers a sudden catastrophic slip
            if (player.traction <= 0 && player.speed > 3) {
                player.isSlipped = true;
                player.slipTimer = player.slipDuration;
                gameAudio.playSlip();

                // Propel forward with extra slide inertia
                player.speed = Math.max(player.speed * 1.3, 7.5);

                // Emit sliding splash particles
                for (let i = 0; i < 15; i++) {
                    particles.push({
                        x: player.x + Math.random() * player.width,
                        y: 420,
                        vx: (Math.random() - 0.3) * player.speed,
                        vy: -Math.random() * 4 - 2,
                        size: 3 + Math.random() * 5,
                        color: 'rgba(180, 210, 240, 0.7)',
                        life: 20 + Math.random() * 20
                    });
                }
            }
        } else if (player.isOnGround) {
            // Dry ground traction restoration
            player.traction += 1.2;
        }

        player.x += player.speed;

        // 3. Jump Physics
        if (keys.up && player.isOnGround && !player.isDucking) {
            player.vy = player.jumpStrength;
            player.isOnGround = false;
            gameAudio.playJump();

            // Spawn slight takeoff water splashes if jumping from puddle
            if (floorIsWet) {
                for (let i = 0; i < 6; i++) {
                    particles.push({
                        x: player.x + player.width / 2,
                        y: 420,
                        vx: (Math.random() - 0.5) * 4,
                        vy: -Math.random() * 3 - 2,
                        size: 2 + Math.random() * 3,
                        color: 'rgba(200, 220, 255, 0.6)',
                        life: 15
                    });
                }
            }
        }
    }

    // Apply gravity
    player.y += player.vy;
    player.vy += player.gravity;

    // Floor boundaries
    const floorY = 420; // pixels from top

    // Bounds height matches ducking/sliding state
    player.height = (player.isDucking || player.isSlipped) ? 60 : 120;
    const playerFeet = player.y + player.height;

    if (playerFeet >= floorY) {
        player.y = floorY - player.height;
        player.vy = 0;
        player.isOnGround = true;
    }

    // Keep player within horizontal world bounds
    if (player.x < 50) {
        player.x = 50;
        player.speed = 0;
    }

    // 4. Update Camera position (scrolling viewport)
    // Target position is centering the player on the left side of screen
    const targetCameraX = player.x - 220;
    cameraX += (targetCameraX - cameraX) * 0.1;
    if (cameraX < 0) cameraX = 0;
    if (cameraX > LEVEL_END_X - 960) cameraX = LEVEL_END_X - 960;

    // 5. Check temperature limits
    if (player.temperature <= 0) {
        player.temperature = 0;
        if (resumeCount < 2) {
            offerResume();
        } else {
            triggerGameOver("DEEP FROST SHOCK", "All your heat escaped. The sauna is too far!");
        }
    }

    // Limit temperature to 100% max
    if (player.temperature > 100) player.temperature = 100;

    // 6. Check Victory Condition
    if (player.x >= LEVEL_END_X - 100) {
        triggerVictory();
    }
}

function updateObstacles() {
    const playerBox = {
        left: player.x,
        right: player.x + player.width,
        top: player.y,
        bottom: player.y + player.height
    };

    obstacles.forEach(obs => {
        // Custom hazard logic
        switch (obs.type) {
            case 'fan':
                // Animate rotor angle
                obs.rotAngle += 0.25;

                // Ceiling/floor fans blowing cold wind horizontally
                // Wind stretches out to the left of the fan
                const windLeft = obs.x - obs.windWidth;
                const windRight = obs.x;

                // Vertical extent of the wind zone
                const windTop = obs.isCeiling ? obs.y : obs.y - 30;
                const windBottom = obs.isCeiling ? obs.y + 110 : obs.y + 60;

                // Check if player is in the wind stream
                if (player.x + player.width > windLeft && player.x < windRight) {
                    // Wind hits player if player is high enough (ceiling fan) or low enough (floor fan)
                    // Floor fan wind is duckable, ceiling fan wind is jumpable
                    const isWindHitting = !(obs.isCeiling ? player.y + player.height > windBottom : player.isDucking);

                    if (isWindHitting && player.isInvulnerable <= 0) {
                        player.temperature -= 0.38; // freeze player

                        // Push player back slightly due to wind resistance
                        player.speed -= 0.05;

                        // Spawn wind chill particles on player
                        if (Math.random() < 0.3) {
                            particles.push({
                                x: player.x + Math.random() * player.width,
                                y: player.y + Math.random() * player.height,
                                vx: -4 - Math.random() * 3,
                                vy: (Math.random() - 0.5) * 2,
                                size: 2 + Math.random() * 2,
                                color: 'rgba(0, 242, 254, 0.4)',
                                life: 10 + Math.random() * 10
                            });
                        }
                    }
                }

                // Decorative wind particles flowing from fan
                if (Math.random() < 0.2) {
                    particles.push({
                        x: obs.x,
                        y: obs.y + 20 + Math.random() * 20,
                        vx: -5 - Math.random() * 4,
                        vy: (Math.random() - 0.5) * 1.5,
                        size: 1 + Math.random() * 2,
                        color: 'rgba(230, 248, 255, 0.2)',
                        life: 25
                    });
                }
                break;

            case 'bucket_lady':
                obs.splashTimer++;

                // Wind up throw
                if (obs.splashTimer % obs.splashCooldown > obs.splashCooldown - 30) {
                    obs.state = 'winding';
                }

                // Execute Splash Throw
                if (obs.splashTimer % obs.splashCooldown === 0) {
                    obs.state = 'throwing';

                    // Throw splash: spawn splash water entities heading left
                    gameAudio.playSplash();

                    for (let i = 0; i < 8; i++) {
                        particles.push({
                            isWaterHazard: true,
                            x: obs.x - 20,
                            y: obs.y + 10,
                            vx: -6 - Math.random() * 4,
                            vy: -3 - Math.random() * 4,
                            size: 8 + Math.random() * 8,
                            color: 'rgba(160, 220, 255, 0.7)',
                            life: 60
                        });
                    }
                }

                // Return to idle
                if (obs.splashTimer % obs.splashCooldown === 30) {
                    obs.state = 'idle';
                }
                break;

            case 'mop_lady':
                obs.swipeTimer += 0.04;
                // Swing mop back and forth
                const swipeOffset = Math.sin(obs.swipeTimer) * 60;
                obs.mopX = obs.x - 30 + swipeOffset;

                // Check collision with mop head
                const mopBox = {
                    left: obs.mopX - 15,
                    right: obs.mopX + 15,
                    top: 405, // foot level swipe
                    bottom: 420
                };

                // If player feet collide with mop head and not jumping, slip instantly!
                if (playerBox.right > mopBox.left && playerBox.left < mopBox.right &&
                    playerBox.bottom > mopBox.top && player.isInvulnerable <= 0) {

                    if (player.isOnGround && !player.isSlipped) {
                        player.isSlipped = true;
                        player.slipTimer = player.slipDuration;
                        player.traction = 0;
                        player.speed = Math.max(player.speed * 1.2, 6);
                        gameAudio.playSlip();
                    } else if (!player.isOnGround && player.vy > 0) {
                        // Dodged mop successfully! Increment statistics
                        mopsDodgedCount++;
                        // Temporarily flag mop lady to avoid duplicate scoring
                        obs.swipeTimer += 1.0; // speed up swipe sequence
                    }
                }
                break;

            case 'scrub_machine':
                // Roams back and forth
                obs.x += obs.speed * obs.direction;
                if (obs.x < obs.startX - obs.range) {
                    obs.direction = 1;
                } else if (obs.x > obs.startX + obs.range) {
                    obs.direction = -1;
                }

                // Check collision with machine
                const machBox = {
                    left: obs.x,
                    right: obs.x + obs.width,
                    top: obs.y,
                    bottom: obs.y + obs.height
                };

                if (playerBox.right > machBox.left && playerBox.left < machBox.right &&
                    playerBox.bottom > machBox.top && playerBox.top < machBox.bottom) {

                    if (player.isInvulnerable <= 0) {
                        // Impact details: instant slip and knocks player back/down
                        if (!player.isSlipped) {
                            player.isSlipped = true;
                            player.slipTimer = player.slipDuration - 20;
                            player.speed = -4; // bounce backward
                            player.temperature -= 12; // shock cold penalty
                            player.traction = 10;
                            player.isInvulnerable = 60;
                            gameAudio.playSlip();
                        }
                    }
                }

                // Spawn dirty soap bubbles behind machine
                if (Math.random() < 0.15) {
                    particles.push({
                        x: obs.x + (obs.direction === 1 ? 0 : obs.width),
                        y: 410 + Math.random() * 10,
                        vx: -obs.direction * 1,
                        vy: -Math.random() * 1.5,
                        size: 3 + Math.random() * 4,
                        color: 'rgba(220, 240, 240, 0.4)',
                        life: 30
                    });
                }
                break;
        }
    });

    // Check collision with radiators (warm player up!)
    radiators.forEach(rad => {
        if (player.x + player.width > rad.x - 30 && player.x < rad.x + rad.width + 30) {
            // Warm zone heats player up
            player.temperature += 0.42;

            // Dry wet feet
            if (player.traction < 100) player.traction += 0.8;

            // Spawn ambient warm steam sparkles
            if (Math.random() < 0.25) {
                particles.push({
                    x: rad.x + Math.random() * rad.width,
                    y: rad.y - 10,
                    vx: (Math.random() - 0.5) * 1.5,
                    vy: -Math.random() * 2 - 1,
                    size: 3 + Math.random() * 4,
                    color: 'rgba(255, 200, 150, 0.5)', // warm orange steam
                    life: 25
                });
            }

            // Play warm hum sound periodically
            if (runTimer % 18 === 0) {
                gameAudio.playWarm();
            }
        }
    });
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;

        // Apply water gravity
        if (p.isWaterHazard) {
            p.vy += 0.18; // water gravity

            // Check splash hitting floor
            if (p.y >= 420) {
                p.y = 420;
                p.life = 0; // dies on impact

                // Create wet puddle floor zone at collision spot
                // and mini-splashes
                for (let k = 0; k < 3; k++) {
                    particles.push({
                        x: p.x,
                        y: 420,
                        vx: (Math.random() - 0.5) * 4,
                        vy: -Math.random() * 3 - 1,
                        size: 2 + Math.random() * 2,
                        color: 'rgba(160, 200, 255, 0.5)',
                        life: 15
                    });
                }
                continue;
            }

            // Check collision with player
            if (player.isInvulnerable <= 0) {
                const playerBox = {
                    left: player.x,
                    right: player.x + player.width,
                    top: player.y,
                    bottom: player.y + player.height
                };
                if (p.x > playerBox.left && p.x < playerBox.right &&
                    p.y > playerBox.top && p.y < playerBox.bottom) {

                    player.temperature -= 15; // huge chill
                    player.traction -= 22; // lose grip
                    p.life = 0; // absorb water splash
                    gameAudio.playSplash();

                    // Flash invuln shield momentarily
                    player.isInvulnerable = 15;
                }
            }
        }

        if (p.life <= 0) {
            particles.splice(i, 1);
        }
    }
}

// --- Floor Wetness Helper ---
function isFloorWetAt(worldX) {
    // Certain areas of the floor have natural wet puddles
    // Puddles spawned every 400px starting from 400
    // Wet zones are 140px wide
    const distInZone = (worldX + 50) % 430;
    return distInZone < 130 && worldX > 300 && worldX < LEVEL_END_X - 300;
}

// --- Drawing & Rendering Layout ---

// --- Aqua Palace dot-mosaic starfish helper ---
// --- Dynamic Wall Decor Helper for Different Themes ---
function drawWallDecor(x, y, r, t, type, colors) {
    if (type === 'starfish') {
        const dotColors = colors || [
            '#e8543a', '#f5a623', '#f9e054', '#6fcf97', '#56ccf2',
            '#bb6bd9', '#eb5757', '#2d9cdb', '#27ae60', '#f2994a'
        ];
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(t);
        // Draw arm silhouette first (dark blue)
        ctx.fillStyle = 'rgba(12, 52, 110, 0.75)';
        ctx.beginPath();
        for (let a = 0; a < 5; a++) {
            const outerA = (a / 5) * Math.PI * 2 - Math.PI / 2;
            const innerA = outerA + Math.PI / 5;
            const ox = Math.cos(outerA) * r;
            const oy = Math.sin(outerA) * r;
            const ix = Math.cos(innerA) * r * 0.35;
            const iy = Math.sin(innerA) * r * 0.35;
            a === 0 ? ctx.moveTo(ox, oy) : ctx.lineTo(ox, oy);
            ctx.lineTo(ix, iy);
        }
        ctx.closePath();
        ctx.fill();
        // Overlay colorful dots
        const seed = Math.floor(x * 7 + y * 13);
        let d = 0;
        for (let ring = 0; ring <= Math.floor(r / 6); ring++) {
            const ringR = ring * 6;
            const count = ring === 0 ? 1 : ring * 5;
            for (let j = 0; j < count; j++) {
                const ang = (j / count) * Math.PI * 2;
                const dx = Math.cos(ang) * ringR;
                const dy = Math.sin(ang) * ringR;
                const inStar = Math.sqrt(dx * dx + dy * dy) < r * 0.72;
                if (!inStar) continue;
                ctx.fillStyle = dotColors[(seed + d++) % dotColors.length];
                ctx.beginPath();
                ctx.arc(dx, dy, 2.5, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        ctx.restore();
    } else if (type === 'thermometer') {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(t * 0.1);
        ctx.fillStyle = '#b71c1c';
        ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#1d0b08';
        ctx.beginPath(); ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#ff9800';
        ctx.lineWidth = 1.5;
        for (let a = 0; a < 8; a++) {
            const ang = -Math.PI + (a / 7) * Math.PI;
            ctx.beginPath();
            ctx.moveTo(Math.cos(ang) * r * 0.6, Math.sin(ang) * r * 0.6);
            ctx.lineTo(Math.cos(ang) * r * 0.75, Math.sin(ang) * r * 0.75);
            ctx.stroke();
        }
        ctx.strokeStyle = '#ff3d00';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(0.5) * r * 0.7, Math.sin(0.5) * r * 0.7);
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
    } else if (type === 'beer_mug') {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(t * 0.3);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(r * 0.3, 0, r * 0.3, -Math.PI / 2, Math.PI / 2);
        ctx.stroke();
        ctx.fillStyle = '#f9d423';
        ctx.fillRect(-r * 0.4, -r * 0.5, r * 0.7, r);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fillRect(-r * 0.3, -r * 0.4, r * 0.1, r * 0.8);
        ctx.fillRect(-r * 0.1, -r * 0.4, r * 0.1, r * 0.8);
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-r * 0.35, -r * 0.55, r * 0.25, 0, Math.PI * 2);
        ctx.arc(-r * 0.1, -r * 0.6, r * 0.25, 0, Math.PI * 2);
        ctx.arc(r * 0.15, -r * 0.55, r * 0.25, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    } else if (type === 'flower') {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(t);
        ctx.fillStyle = '#ff4081';
        for (let i = 0; i < 5; i++) {
            ctx.rotate(Math.PI * 2 / 5);
            ctx.beginPath();
            ctx.ellipse(0, -r * 0.6, r * 0.35, r * 0.5, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.fillStyle = '#ffeb3b';
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    } else if (type === 'fire') {
        ctx.save();
        ctx.translate(x, y);
        ctx.fillStyle = '#37474f';
        ctx.fillRect(-6, 0, 12, r * 0.7);
        ctx.fillRect(-r * 0.4, r * 0.5, r * 0.8, 8);
        const pulse = Math.abs(Math.sin(runTimer * 0.1)) * 5;
        const flameR = r * 0.6 + pulse;
        const fireGrad = ctx.createRadialGradient(0, -10, 2, 0, -15, flameR);
        fireGrad.addColorStop(0, '#ffeb3b');
        fireGrad.addColorStop(0.3, '#ff9100');
        fireGrad.addColorStop(1, 'rgba(255, 61, 0, 0)');
        ctx.fillStyle = fireGrad;
        ctx.beginPath();
        ctx.arc(0, -10, flameR, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    } else if (type === 'snowflake') {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(t * 0.5);
        ctx.strokeStyle = '#e0f7fa';
        ctx.lineWidth = 2.5;
        for (let i = 0; i < 6; i++) {
            ctx.rotate(Math.PI / 3);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, -r * 0.95);
            ctx.moveTo(0, -r * 0.5);
            ctx.lineTo(-r * 0.25, -r * 0.7);
            ctx.moveTo(0, -r * 0.5);
            ctx.lineTo(r * 0.25, -r * 0.7);
            ctx.stroke();
        }
        ctx.restore();
    } else if (type === 'lantern') {
        ctx.save();
        ctx.translate(x, y);
        ctx.strokeStyle = '#5d4037';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -r);
        ctx.lineTo(0, -r * 0.3);
        ctx.stroke();
        ctx.fillStyle = '#795548';
        ctx.beginPath();
        ctx.moveTo(-r * 0.4, -r * 0.3);
        ctx.lineTo(r * 0.4, -r * 0.3);
        ctx.lineTo(0, -r * 0.6);
        ctx.closePath();
        ctx.fill();
        ctx.shadowColor = '#ffe082';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#fff9c4';
        ctx.fillRect(-r * 0.25, -r * 0.3, r * 0.5, r * 0.65);
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#5d4037';
        ctx.lineWidth = 2;
        ctx.strokeRect(-r * 0.25, -r * 0.3, r * 0.5, r * 0.65);
        ctx.beginPath();
        ctx.moveTo(-r * 0.25, 0); ctx.lineTo(r * 0.25, 0);
        ctx.moveTo(0, -r * 0.3); ctx.lineTo(0, r * 0.35);
        ctx.stroke();
        ctx.restore();
    } else if (type === 'music_note') {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(t * 0.4);
        ctx.shadowColor = '#ff00ff';
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#00ffff';
        ctx.beginPath();
        ctx.arc(-r * 0.3, r * 0.3, r * 0.22, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(-r * 0.14, -r * 0.5, 4, r * 0.8);
        ctx.beginPath();
        ctx.arc(r * 0.2, r * 0.1, r * 0.22, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(r * 0.36, -r * 0.7, 4, r * 0.8);
        ctx.save();
        ctx.rotate(-0.25);
        ctx.fillRect(-r * 0.25, -r * 0.55, r * 0.75, 6);
        ctx.restore();
        ctx.shadowBlur = 0;
        ctx.restore();
    } else if (type === 'sun') {
        ctx.save();
        ctx.translate(x, y);
        ctx.strokeStyle = 'rgba(255, 111, 0, 0.4)';
        ctx.lineWidth = 2;
        for (let i = 0; i < 8; i++) {
            const ang = (i / 8) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(ang) * r * 0.9, Math.sin(ang) * r * 0.9);
            ctx.stroke();
        }
        const sunGrad = ctx.createLinearGradient(0, -r * 0.6, 0, r * 0.6);
        sunGrad.addColorStop(0, '#ffd54f');
        sunGrad.addColorStop(1, '#ff6f00');
        ctx.fillStyle = sunGrad;
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    } else if (type === 'runes') {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(t * 0.2);
        ctx.shadowColor = '#ff1744';
        ctx.shadowBlur = 8;
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(0, -r * 0.85);
        ctx.lineTo(r * 0.6, 0);
        ctx.lineTo(0, r * 0.85);
        ctx.lineTo(-r * 0.6, 0);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, -r * 0.85); ctx.lineTo(0, r * 0.85);
        ctx.moveTo(-r * 0.6, 0); ctx.lineTo(r * 0.6, 0);
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.restore();
    }
}

// --- Dynamic Pillar Decoration Helper ---
function drawPillarDeco(cx, startY, endY, decoType, colX) {
    if (decoType === 'mosaic_dots') {
        for (let py = startY; py < endY; py += 22) {
            const dotCol = ['#56ccf2', '#f5a623', '#6fcf97', '#eb5757', '#bb6bd9'][(Math.floor(py / 22) + Math.floor(colX / 280)) % 5];
            ctx.fillStyle = dotCol;
            ctx.beginPath();
            ctx.arc(cx, py, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    } else if (decoType === 'wood_grain') {
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx - 8, startY); ctx.lineTo(cx - 8, endY);
        ctx.moveTo(cx + 8, startY); ctx.lineTo(cx + 8, endY);
        ctx.stroke();
    } else if (decoType === 'frost_lines') {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let py = startY; py < endY - 20; py += 30) {
            ctx.moveTo(cx - 15, py);
            ctx.lineTo(cx + 15, py + 20);
            ctx.moveTo(cx + 15, py);
            ctx.lineTo(cx - 15, py + 20);
        }
        ctx.stroke();
    } else if (decoType === 'leaf_veins') {
        ctx.strokeStyle = 'rgba(120, 220, 120, 0.25)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx, startY); ctx.lineTo(cx, endY);
        for (let py = startY + 15; py < endY; py += 40) {
            ctx.moveTo(cx, py); ctx.lineTo(cx - 10, py - 10);
            ctx.moveTo(cx, py + 20); ctx.lineTo(cx + 10, py + 10);
        }
        ctx.stroke();
    } else if (decoType === 'lava_cracks') {
        ctx.strokeStyle = '#ff3d00';
        ctx.shadowColor = '#ff9100';
        ctx.shadowBlur = 4;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        let currentX = cx;
        ctx.moveTo(currentX, startY);
        for (let py = startY + 15; py < endY; py += 15) {
            currentX += (Math.sin(py * 0.05 + colX) * 4);
            ctx.lineTo(currentX, py);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
    } else if (decoType === 'icicles') {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        for (let py = startY + 10; py < endY; py += 50) {
            ctx.beginPath();
            ctx.moveTo(cx - 6, py);
            ctx.lineTo(cx + 6, py);
            ctx.lineTo(cx, py + 15);
            ctx.closePath();
            ctx.fill();
        }
    } else if (decoType === 'moss') {
        ctx.fillStyle = 'rgba(46, 125, 50, 0.5)';
        for (let py = startY + 30; py < endY; py += 60) {
            ctx.beginPath();
            ctx.arc(cx + Math.sin(py) * 8, py, 6 + Math.cos(py) * 3, 0, Math.PI * 2);
            ctx.fill();
        }
    } else if (decoType === 'neon_pulse') {
        ctx.shadowColor = '#00f2fe';
        ctx.shadowBlur = 8;
        ctx.fillStyle = (runTimer % 40 < 20) ? '#ff007f' : '#00f2fe';
        ctx.fillRect(cx - 3, startY, 6, endY - startY);
        ctx.shadowBlur = 0;
    } else if (decoType === 'city_lights') {
        ctx.fillStyle = 'rgba(255, 215, 0, 0.75)';
        for (let py = startY + 10; py < endY - 10; py += 24) {
            ctx.fillRect(cx - 10, py, 4, 6);
            ctx.fillRect(cx + 6, py, 4, 6);
            if (Math.sin(py + colX) > 0) {
                ctx.fillRect(cx - 2, py, 4, 6);
            }
        }
    } else if (decoType === 'runes') {
        ctx.fillStyle = '#ff1744';
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 6;
        ctx.font = '8px monospace';
        const runesSymbols = ['▼', '✦', '✥', '✚', '⚛', '⚜', '✵', '❖'];
        for (let py = startY + 15; py < endY; py += 45) {
            const sym = runesSymbols[Math.floor(py + colX) % runesSymbols.length];
            ctx.fillText(sym, cx - 4, py);
        }
        ctx.shadowBlur = 0;
    }
}


function drawParallaxBackground() {
    const theme = getActiveTheme();

    // 1. Sky / Wall base
    ctx.fillStyle = theme.wallBg;
    ctx.fillRect(0, 0, 960, 420);

    // Subtle vertical gradient overlay
    const wallGrad = ctx.createLinearGradient(0, 0, 0, 420);
    wallGrad.addColorStop(0, theme.wallGradStart);
    wallGrad.addColorStop(1, theme.wallGradEnd);
    ctx.fillStyle = wallGrad;
    ctx.fillRect(0, 0, 960, 420);

    // ---- Layer 0: Far wall — windows and pillars ----
    const bg0Scroll = -cameraX * 0.12;
    for (let x = (bg0Scroll % 280) - 280; x < 960 + 280; x += 280) {
        // Pillar between windows
        const pillarGrad = ctx.createLinearGradient(x + 195, 0, x + 235, 0);
        pillarGrad.addColorStop(0, theme.pillarGradLeft);
        pillarGrad.addColorStop(0.4, theme.pillarGradMid);
        pillarGrad.addColorStop(1, theme.pillarGradRight);
        ctx.fillStyle = pillarGrad;
        ctx.fillRect(x + 195, 40, 40, 380);

        // Pillar capital (top decorative band)
        ctx.fillStyle = theme.pillarCapital1;
        ctx.fillRect(x + 190, 35, 50, 8);
        ctx.fillStyle = theme.pillarCapital2;
        ctx.fillRect(x + 192, 43, 46, 4);

        // Pillar decoration
        drawPillarDeco(x + 215, 60, 380, theme.pillarDeco, x);

        // Windows
        const winX = x + 20;
        const winW = 170;
        const archH = 60;
        const winY = 60;
        const winBodyH = 200;

        ctx.save();
        ctx.beginPath();
        if (theme.windowType === 'rect') {
            ctx.rect(winX, winY, winW, archH + winBodyH);
        } else {
            ctx.moveTo(winX, winY + archH);
            ctx.lineTo(winX, winY + archH + winBodyH);
            ctx.lineTo(winX + winW, winY + archH + winBodyH);
            ctx.lineTo(winX + winW, winY + archH);
            ctx.arc(winX + winW / 2, winY + archH, winW / 2, 0, Math.PI, true);
            ctx.closePath();
        }
        ctx.clip();

        // Window background view gradient
        const winGrad = ctx.createLinearGradient(winX, winY, winX, winY + archH + winBodyH);
        winGrad.addColorStop(0, theme.windowGradStart);
        winGrad.addColorStop(1, theme.windowGradEnd);
        ctx.fillStyle = winGrad;
        ctx.fillRect(winX, winY, winW, archH + winBodyH);

        // Window animation details
        if (theme.windowRippleType === 'water') {
            ctx.strokeStyle = theme.windowRippleColor;
            ctx.lineWidth = 1.5;
            for (let wy = 0; wy < winBodyH; wy += 18) {
                const rippleOff = Math.sin(runTimer * 0.03 + wy * 0.3 + x * 0.01) * 8;
                ctx.beginPath();
                ctx.moveTo(winX, winY + archH + wy + rippleOff);
                ctx.bezierCurveTo(
                    winX + winW * 0.33, winY + archH + wy + rippleOff - 5,
                    winX + winW * 0.66, winY + archH + wy + rippleOff + 5,
                    winX + winW, winY + archH + wy + rippleOff
                );
                ctx.stroke();
            }
        } else if (theme.windowRippleType === 'steam_haze') {
            ctx.fillStyle = theme.windowRippleColor;
            for (let i = 0; i < 4; i++) {
                const wispX = winX + 20 + i * 40 + Math.sin(runTimer * 0.02 + i) * 8;
                ctx.fillRect(wispX, winY, 12, archH + winBodyH);
            }
        } else if (theme.windowRippleType === 'bubbles') {
            ctx.fillStyle = theme.windowRippleColor;
            for (let i = 0; i < 8; i++) {
                const bx = winX + ((i * 27 + x * 7) % (winW - 10));
                const by = winY + archH + winBodyH - ((runTimer * 1.5 + i * 40) % (archH + winBodyH));
                ctx.beginPath();
                ctx.arc(bx, by, 3 + (i % 3), 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (theme.windowRippleType === 'leaves') {
            ctx.fillStyle = theme.windowRippleColor;
            for (let i = 0; i < 3; i++) {
                const lx = winX + winW * 0.25 + i * 40;
                const ly = winY + archH + 30 + i * 40 + Math.sin(runTimer * 0.04 + i) * 5;
                ctx.beginPath();
                ctx.ellipse(lx, ly, 15, 8, Math.PI / 4, 0, Math.PI * 2);
                ctx.ellipse(lx + 10, ly + 10, 10, 6, -Math.PI / 4, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (theme.windowRippleType === 'magma') {
            ctx.fillStyle = theme.windowRippleColor;
            for (let i = 0; i < 5; i++) {
                const lx = winX + 20 + i * 30 + Math.sin(runTimer * 0.02 + i) * 4;
                const ly = winY + ((runTimer * 0.8 + i * 50) % (archH + winBodyH));
                ctx.beginPath();
                ctx.arc(lx, ly, 6 + (i % 4), 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (theme.windowRippleType === 'snow') {
            ctx.fillStyle = theme.windowRippleColor;
            for (let i = 0; i < 15; i++) {
                const sx = winX + ((i * 19 + x * 3) % (winW - 6));
                const sy = winY + ((runTimer * 1.2 + i * 25) % (archH + winBodyH));
                ctx.beginPath();
                ctx.arc(sx, sy, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (theme.windowRippleType === 'dripping_water') {
            ctx.fillStyle = theme.windowRippleColor;
            for (let i = 0; i < 6; i++) {
                const dx = winX + ((i * 35 + x * 9) % (winW - 10));
                const dy = winY + ((runTimer * 2.2 + i * 35) % (archH + winBodyH));
                ctx.fillRect(dx, dy, 2, 8);
            }
        } else if (theme.windowRippleType === 'equalizer') {
            ctx.fillStyle = theme.windowRippleColor;
            for (let i = 0; i < 6; i++) {
                const barW = 18;
                const barH = 30 + Math.abs(Math.sin(runTimer * 0.05 + i * 0.5)) * 120;
                const barX = winX + 15 + i * 25;
                ctx.fillRect(barX, winY + archH + winBodyH - barH, barW, barH);
            }
        } else if (theme.windowRippleType === 'clouds') {
            ctx.fillStyle = theme.windowRippleColor;
            for (let i = 0; i < 2; i++) {
                const cx = winX + ((runTimer * 0.3 + i * 120) % (winW + 80)) - 40;
                const cy = winY + 40 + i * 60;
                ctx.beginPath();
                ctx.arc(cx, cy, 25, 0, Math.PI * 2);
                ctx.arc(cx + 20, cy + 5, 20, 0, Math.PI * 2);
                ctx.arc(cx - 20, cy + 5, 15, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (theme.windowRippleType === 'power_vortex') {
            ctx.strokeStyle = theme.windowRippleColor;
            ctx.lineWidth = 2;
            ctx.save();
            ctx.translate(winX + winW / 2, winY + archH + winBodyH / 2);
            ctx.rotate(runTimer * 0.03);
            ctx.beginPath();
            for (let i = 0; i < 50; i++) {
                const angle = 0.1 * i;
                const r = 2 * i;
                const vx = Math.cos(angle) * r;
                const vy = Math.sin(angle) * r;
                if (i === 0) ctx.moveTo(vx, vy);
                else ctx.lineTo(vx, vy);
            }
            ctx.stroke();
            ctx.restore();
        }

        ctx.restore();

        // Window Frame
        ctx.strokeStyle = theme.windowFrameColor;
        ctx.lineWidth = 3;
        if (theme.windowType === 'rect') {
            ctx.strokeRect(winX, winY, winW, archH + winBodyH);
        } else {
            ctx.beginPath();
            ctx.moveTo(winX, winY + archH);
            ctx.lineTo(winX, winY + archH + winBodyH);
            ctx.lineTo(winX + winW, winY + archH + winBodyH);
            ctx.lineTo(winX + winW, winY + archH);
            ctx.arc(winX + winW / 2, winY + archH, winW / 2, 0, Math.PI, true);
            ctx.closePath();
            ctx.stroke();

            // Keystone dot
            ctx.fillStyle = theme.windowFrameColor;
            ctx.beginPath();
            ctx.arc(winX + winW / 2, winY + 4, 7, 0, Math.PI * 2);
            ctx.fill();
        }

        // Sill at bottom of window
        ctx.fillStyle = theme.wainscotingStripeBottom;
        ctx.fillRect(winX - 5, winY + archH + winBodyH, winW + 10, 10);
        ctx.fillStyle = theme.wainscotingStripeTop;
        ctx.fillRect(winX - 5, winY + archH + winBodyH, winW + 10, 3);
    }

    // ---- Layer 0.5: Frieze near ceiling ----
    if (theme.friezeType === 'wave') {
        ctx.strokeStyle = theme.friezeColor1;
        ctx.lineWidth = 2;
        for (let wx = -40; wx < 960 + 40; wx += 80) {
            const waveOff = -cameraX * 0.12;
            const wx2 = ((wx + waveOff) % 960 + 960) % 960;
            ctx.beginPath();
            ctx.arc(wx2 + 40, 28, 22, Math.PI, 0, false);
            ctx.stroke();
        }
        ctx.strokeStyle = theme.friezeColor2;
        for (let wx = -40; wx < 960 + 40; wx += 80) {
            const waveOff = -cameraX * 0.12 + 40;
            const wx2 = ((wx + waveOff) % 960 + 960) % 960;
            ctx.beginPath();
            ctx.arc(wx2 + 40, 18, 16, Math.PI, 0, false);
            ctx.stroke();
        }
    } else if (theme.friezeType === 'icicle') {
        ctx.fillStyle = theme.friezeColor1;
        const width = 20;
        const iceOff = -cameraX * 0.12;
        for (let ix = (iceOff % width) - width; ix < 960 + width; ix += width) {
            const height = 15 + Math.abs(Math.sin((ix + cameraX) * 0.01)) * 20;
            ctx.beginPath();
            ctx.moveTo(ix, 0);
            ctx.lineTo(ix + width, 0);
            ctx.lineTo(ix + width / 2, height);
            ctx.closePath();
            ctx.fill();
        }
    } else if (theme.friezeType === 'ivy') {
        ctx.strokeStyle = '#1b5e20';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 20);
        ctx.lineTo(960, 20);
        ctx.stroke();

        ctx.fillStyle = theme.friezeColor1;
        const spacing = 40;
        const ivyOff = -cameraX * 0.12;
        for (let ix = (ivyOff % spacing) - spacing; ix < 960 + spacing; ix += spacing) {
            ctx.beginPath();
            ctx.ellipse(ix + 20, 25, 8, 12, 0.2, 0, Math.PI * 2);
            ctx.ellipse(ix + 32, 28, 6, 8, -0.3, 0, Math.PI * 2);
            ctx.fill();
        }
    } else if (theme.friezeType === 'neon') {
        ctx.shadowColor = theme.friezeColor1;
        ctx.shadowBlur = 10;
        ctx.strokeStyle = theme.friezeColor2;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, 20);
        ctx.lineTo(960, 20);
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.fillStyle = theme.friezeColor1;
        const pulse = Math.abs(Math.sin(runTimer * 0.05)) * 40;
        ctx.fillRect((pulse * 10) % 960, 18, 50, 4);
    }

    // ---- Layer 1: Nearer wall band — wainscoting ----
    const bg1Scroll = -cameraX * 0.4;
    ctx.fillStyle = theme.wainscotingColor;
    ctx.fillRect(0, 320, 960, 100);
    ctx.fillStyle = theme.wainscotingStripeTop;
    ctx.fillRect(0, 318, 960, 4);
    ctx.fillStyle = theme.wainscotingStripeBottom;
    ctx.fillRect(0, 416, 960, 4);

    // Mosaic squares
    const mosaicColors = theme.mosaicColors;
    for (let x = (bg1Scroll % 12) - 12; x < 960 + 12; x += 12) {
        for (let y = 322; y < 414; y += 12) {
            const ci = (Math.floor((x + bg1Scroll) / 12) * 7 + Math.floor(y / 12) * 3) & 0xfff;
            ctx.fillStyle = mosaicColors[ci % mosaicColors.length];
            ctx.fillRect(x + 1, y + 1, 10, 10);
        }
    }

    // ---- Wall Decorations ----
    const sfScroll = -cameraX * 0.25;
    for (let sx = (sfScroll % 400) - 400; sx < 960 + 400; sx += 400) {
        const sfRot = runTimer * 0.003 + sx * 0.005;
        drawWallDecor(sx + 200, 185, 48, sfRot, theme.decorType, theme.decorColors);
        drawWallDecor(sx + 50, 290, 22, -sfRot * 1.3, theme.decorType, theme.decorColors);
        drawWallDecor(sx + 350, 260, 18, sfRot * 0.8, theme.decorType, theme.decorColors);
    }

    // ---- Layer 2: Near pipes ----
    for (let x = (bg1Scroll % 320) - 320; x < 960 + 320; x += 320) {
        ctx.fillStyle = theme.pipeColor;
        ctx.fillRect(x - 60, 45, 320, 10);
        ctx.fillStyle = theme.pipeHighlight;
        ctx.fillRect(x - 60, 45, 320, 3);

        ctx.fillStyle = theme.pipeJoint1;
        ctx.fillRect(x + 100, 40, 14, 20);
        ctx.fillStyle = theme.pipeJoint2;
        ctx.fillRect(x + 102, 42, 10, 16);
    }

    // ---- Draw Radiators ----
    radiators.forEach(rad => {
        const radX = rad.x - cameraX;
        if (radX < -100 || radX > 1060) return;

        ctx.fillStyle = theme.radiatorColor;
        ctx.fillRect(radX, rad.y, rad.width, rad.height);

        ctx.fillStyle = theme.radiatorFinColor;
        const numFins = 8;
        const finWidth = rad.width / numFins;
        for (let i = 0; i < numFins; i++) {
            ctx.fillRect(radX + i * finWidth + 2, rad.y + 5, finWidth - 4, rad.height - 10);
        }

        // Valve
        ctx.fillStyle = theme.radiatorValveColor;
        ctx.fillRect(radX - 10, rad.y + 40, 10, 15);
        ctx.shadowColor = theme.radiatorValveGlow;
        ctx.shadowBlur = 8;
        ctx.fillRect(radX - 10, rad.y + 40, 10, 15);
        ctx.shadowBlur = 0;
        ctx.fillStyle = theme.radiatorColor;
        ctx.fillRect(radX - 15, rad.y + rad.height - 20, 15, 10);
    });
}

function drawFloorTiles() {
    const floorY = 420;

    // Draw solid dark floor base (level-tinted)
    const lvlCfg = getLevelConfig();
    ctx.fillStyle = lvlCfg.floorBase;
    ctx.fillRect(0, floorY, 960, 120);

    // Floor scroll (Fast scroll - matches camera 1:1)
    const floorScroll = -cameraX;

    // Draw wet tiles reflections
    ctx.strokeStyle = lvlCfg.groutColor;
    ctx.lineWidth = 1;
    for (let x = (floorScroll % 80) - 80; x < 960 + 80; x += 80) {
        const worldTileX = cameraX + x;

        // Check if this tile section is wet
        if (isFloorWetAt(worldTileX)) {
            ctx.fillStyle = lvlCfg.floorWet;
            ctx.fillRect(x, floorY, 80, 120);
        } else {
            ctx.fillStyle = lvlCfg.floorTile;
            ctx.fillRect(x, floorY, 80, 120);
        }

        // Draw horizontal/vertical grout lines
        ctx.strokeRect(x, floorY, 80, 60);
        ctx.strokeRect(x, floorY + 60, 80, 60);
    }
}

// Draw entities
function drawEntities() {
    // 1. Towel Station at End
    const towelX = (LEVEL_END_X - 100) - cameraX;
    if (towelX > -100 && towelX < 1060) {
        // Glowing portal/hanger style towel rack
        ctx.fillStyle = '#3a2b10';
        ctx.fillRect(towelX + 10, 220, 80, 200); // rack background

        // Glowing Towel
        const glowPulse = Math.abs(Math.sin(runTimer * 0.08));
        ctx.shadowColor = '#f9d423';
        ctx.shadowBlur = 10 + glowPulse * 20;

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(towelX + 25, 240, 50, 90); // White plush towel
        // Folding details
        ctx.fillStyle = '#e8eff7';
        ctx.fillRect(towelX + 25, 310, 50, 10);
        ctx.fillRect(towelX + 25, 260, 50, 4);

        ctx.shadowBlur = 0; // reset shadow

        // Steam rack arches
        ctx.strokeStyle = '#f9d423';
        ctx.lineWidth = 5;
        ctx.strokeRect(towelX + 20, 230, 60, 190);
    }

    // 2. Spawned Obstacles
    obstacles.forEach(obs => {
        const obsX = obs.x - cameraX;
        if (obsX < -150 || obsX > 1110) return;

        switch (obs.type) {
            case 'fan':
                // Stand pipe
                ctx.fillStyle = '#2d3345';
                ctx.fillRect(obsX + obs.width / 2 - 4, obs.y + 10, 8, obs.isCeiling ? -160 : 70);

                // Fan ring cage
                ctx.strokeStyle = '#444d66';
                ctx.lineWidth = 4;
                ctx.fillStyle = '#1c202b';
                ctx.beginPath();
                ctx.arc(obsX + obs.width / 2, obs.y + 30, 28, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                // Fan blades (rotating)
                ctx.save();
                ctx.translate(obsX + obs.width / 2, obs.y + 30);
                ctx.rotate(obs.rotAngle);
                ctx.fillStyle = '#7c8fa6';
                for (let b = 0; b < 4; b++) {
                    ctx.rotate(Math.PI / 2);
                    ctx.beginPath();
                    ctx.ellipse(0, -12, 6, 12, 0, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();

                // Center hub
                ctx.fillStyle = '#00f2fe';
                ctx.beginPath();
                ctx.arc(obsX + obs.width / 2, obs.y + 30, 6, 0, Math.PI * 2);
                ctx.fill();

                // Draw translucent cold wind stream area
                const windLeft = obsX - obs.windWidth;
                const gradient = ctx.createLinearGradient(windLeft, obs.y + 30, obsX, obs.y + 30);
                gradient.addColorStop(0, 'rgba(0, 242, 254, 0)');
                gradient.addColorStop(1, 'rgba(0, 242, 254, 0.15)');

                ctx.fillStyle = gradient;
                const windTop = obs.isCeiling ? obs.y + 5 : obs.y - 15;
                ctx.fillRect(windLeft, windTop, obs.windWidth, 50);
                break;

            case 'bucket_lady': {
                // Animate: idle=frame0, winding=frame1, throwing=frame2, returning=frame3
                let grannyFrame = 0;
                if (obs.state === 'winding') grannyFrame = 1;
                else if (obs.state === 'throwing') grannyFrame = 2;

                if (grannySpritesLoaded && grannySprites.length > 0) {
                    drawGrannySprite(obsX + obs.width / 2, obs.y + obs.height, grannyFrame);
                } else {
                    // Fallback vector
                    ctx.fillStyle = '#4b285c';
                    ctx.fillRect(obsX, obs.y + 20, obs.width, 60);
                    ctx.fillStyle = '#ffcc44';
                    ctx.beginPath();
                    ctx.arc(obsX + obs.width / 2, obs.y + 12, 12, 0, Math.PI * 2);
                    ctx.fill();
                }
                break;
            }

            case 'mop_lady': {
                // Animate: mop swing phase drives frame selection
                const mopPhase = (Math.sin(obs.swipeTimer) + 1) / 2; // 0..1
                const grannyMopFrame = mopPhase < 0.33 ? 1 : (mopPhase < 0.66 ? 2 : 3);

                if (grannySpritesLoaded && grannySprites.length > 0) {
                    drawGrannySprite(obsX + obs.width / 2, obs.y + obs.height, grannyMopFrame);
                } else {
                    // Fallback vector (no sprites) — draw body + mop
                    ctx.fillStyle = '#204b6b';
                    ctx.fillRect(obsX, obs.y + 20, obs.width, 60);
                    ctx.fillStyle = '#ff6b6b';
                    ctx.beginPath();
                    ctx.arc(obsX + obs.width / 2, obs.y + 12, 12, 0, Math.PI * 2);
                    ctx.fill();
                    const mopWorldX = obs.mopX - cameraX;
                    ctx.strokeStyle = '#c48f5e';
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.moveTo(obsX + obs.width / 2 - 5, obs.y + 40);
                    ctx.lineTo(mopWorldX, 412);
                    ctx.stroke();
                    ctx.fillStyle = '#eaf0f8';
                    ctx.fillRect(mopWorldX - 15, 408, 30, 12);
                }
                break;
            }

            case 'scrub_machine':
                // Red industrial scrubbing vehicle
                ctx.fillStyle = '#bd2222'; // base housing
                ctx.fillRect(obsX, obs.y, obs.width, obs.height - 10);

                // Handle/Steer bar
                ctx.strokeStyle = '#5a6275';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(obsX + (obs.direction === 1 ? 5 : obs.width - 5), obs.y);
                ctx.lineTo(obsX + (obs.direction === 1 ? -10 : obs.width + 10), obs.y - 15);
                ctx.stroke();

                // Splash skirt rubber bottom
                ctx.fillStyle = '#15171a';
                ctx.fillRect(obsX - 2, obs.y + obs.height - 10, obs.width + 4, 10);

                // Small wheels
                ctx.fillStyle = '#3a3a3a';
                ctx.beginPath();
                ctx.arc(obsX + 15, obs.y + obs.height, 6, 0, Math.PI * 2);
                ctx.arc(obsX + obs.width - 15, obs.y + obs.height, 6, 0, Math.PI * 2);
                ctx.fill();

                // Yellow warning strobe lamp
                ctx.fillStyle = (runTimer % 20 < 10) ? '#ffcc00' : '#4a3d00';
                ctx.fillRect(obsX + obs.width / 2 - 6, obs.y - 6, 12, 6);
                break;
        }
    });
}

function drawFloorReflection() {
    // Canvas mirror translation rendering
    ctx.save();

    // Position floor reflection below tiles baseline y=420
    ctx.translate(0, 840);
    ctx.scale(1, -0.6); // flip vertically, flatten reflection height
    ctx.globalAlpha = 0.22; // very translucent

    // 1. Draw Player Reflection
    const playerFlippedY = 420 - (player.y + player.height); // vertical offset reflection
    drawPlayerSprite(player.x - cameraX, playerFlippedY, true);

    // 2. Draw Towel Hanger Reflection
    const towelX = (LEVEL_END_X - 100) - cameraX;
    if (towelX > -100 && towelX < 1060) {
        ctx.fillStyle = '#3a2b10';
        ctx.fillRect(towelX + 10, 220, 80, 200);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(towelX + 25, 240, 50, 90);
    }

    // 3. Draw Hazard Reflections
    obstacles.forEach(obs => {
        const obsX = obs.x - cameraX;
        if (obsX < -150 || obsX > 1110) return;

        if (obs.type === 'bucket_lady' || obs.type === 'mop_lady') {
            if (grannySpritesLoaded && grannySprites.length > 0) {
                drawGrannySprite(obsX + obs.width / 2, obs.y + obs.height, 0, true);
            } else {
                ctx.fillStyle = obs.type === 'bucket_lady' ? '#4b285c' : '#204b6b';
                ctx.fillRect(obsX, obs.y + 20, obs.width, 60);
            }
        } else if (obs.type === 'scrub_machine') {
            ctx.fillStyle = '#bd2222';
            ctx.fillRect(obsX, obs.y, obs.width, obs.height);
        }
    });

    ctx.restore();

    // Draw blue specular reflection ripple layer on top of floor
    ctx.fillStyle = 'rgba(0, 242, 254, 0.05)';
    ctx.fillRect(0, 420, 960, 120);
}

function drawPlayerSprite(drawX, drawY, isReflection = false) {
    if (player.isInvulnerable > 0 && Math.floor(runTimer / 4) % 2 === 0 && !isReflection) {
        return; // blinking invulnerable frame skip
    }

    // Add glowing frost ring if freezing below 30% temperature
    if (player.temperature < 35 && !isReflection) {
        const coldGlow = Math.abs(Math.sin(runTimer * 0.1)) * 12;
        ctx.shadowColor = '#00f2fe';
        ctx.shadowBlur = 5 + coldGlow;
    }

    if (spritesLoaded && playerSprites.length > 0) {
        // Sprite is sliced and cropped correctly
        const currentFrame = playerSprites[player.animFrame];

        ctx.save();
        ctx.translate(drawX + player.width / 2, drawY + player.height / 2);

        // Rotate sprite 90 degrees if player slipped flat
        if (player.isSlipped) {
            ctx.rotate(Math.PI / 2);
        }

        // Draw sprite
        // Scaled to fit current player box dimensions
        const scaleW = player.width / currentFrame.width;
        const scaleH = player.height / currentFrame.height;

        ctx.scale(scaleW, scaleH);

        // Flip sprite if backing up left
        if (keys.left && !player.isSlipped) {
            ctx.scale(-1, 1);
        }

        ctx.drawImage(currentFrame, -currentFrame.width / 2, -currentFrame.height / 2);
        ctx.restore();
    } else {
        // Fallback vector drawing if sprite sheet is loading/failing
        // Funny fat retro guy silhouette
        ctx.fillStyle = player.isFrozen ? '#b0f2fe' : (player.isSlipped ? '#d47c40' : '#d4a373');

        ctx.save();
        ctx.translate(drawX + player.width / 2, drawY + player.height / 2);
        if (player.isSlipped) ctx.rotate(Math.PI / 2);

        // Body fat ball
        ctx.beginPath();
        ctx.arc(0, 20, 30, 0, Math.PI * 2); // belly
        ctx.arc(0, -25, 20, 0, Math.PI * 2); // chest/head
        ctx.fill();

        // Hair spikes
        ctx.fillStyle = '#5c4538';
        ctx.fillRect(-15, -48, 30, 6);

        // Short pants
        ctx.fillStyle = '#6b705c';
        ctx.fillRect(-22, 38, 44, 18);
        ctx.restore();
    }

    // Reset shadow blur
    ctx.shadowBlur = 0;

    // Draw ice block frame surrounding player if frozen solid
    if (player.isFrozen && !isReflection) {
        ctx.fillStyle = 'rgba(0, 242, 254, 0.45)';
        ctx.strokeStyle = '#d0f8ff';
        ctx.lineWidth = 3;
        ctx.fillRect(drawX - 8, drawY - 8, player.width + 16, player.height + 16);
        ctx.strokeRect(drawX - 8, drawY - 8, player.width + 16, player.height + 16);
    }
}

function drawParticles() {
    particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        // Drop circle or square
        ctx.arc(p.x - cameraX, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawHUD() {
    // Update DOM HUD meters directly for high visual performance
    const tempFill = document.getElementById('tempFill');
    const tractionFill = document.getElementById('tractionFill');
    const distanceMarker = document.getElementById('distanceMarker');
    const distanceText = document.getElementById('distanceText');

    if (tempFill) tempFill.style.width = Math.max(0, player.temperature) + '%';
    if (tractionFill) tractionFill.style.width = Math.max(0, player.traction) + '%';

    // Update level indicator with level name
    const levelText = document.getElementById('hudLevelText');
    if (levelText) {
        const lvlCfg = getLevelConfig();
        levelText.innerText = `LEVEL ${currentLevel}: ${lvlCfg.name.toUpperCase()}`;
        // Tint it the theme glow color
        levelText.style.color = getActiveTheme().glowColor;
    }

    // Progress percentage
    const progress = Math.min(1.0, player.x / LEVEL_END_X);
    if (distanceMarker) distanceMarker.style.left = (progress * 90) + '%';

    // Display remaining distance meters
    const metersLeft = Math.max(0, Math.ceil((LEVEL_END_X - player.x) / 10));
    if (distanceText) distanceText.style.innerText = metersLeft + 'm';
    if (distanceText) distanceText.innerHTML = metersLeft + 'm';

    // Freezing screen vignetting effect
    if (player.temperature < 40) {
        const frostIntensity = (40 - player.temperature) / 40; // 0.0 to 1.0
        ctx.strokeStyle = `rgba(0, 242, 254, ${frostIntensity * 0.45})`;
        ctx.lineWidth = 15 * frostIntensity;
        ctx.strokeRect(0, 0, 960, 540); // frost border glow
    }
}

// --- Animation frame state cycles ---
function animatePlayer() {
    if (player.isSlipped) {
        player.animFrame = 3; // slide frame
        return;
    }

    if (player.isDucking) {
        player.animFrame = 2; // ducking/crouched frame
        return;
    }

    if (!player.isOnGround) {
        player.animFrame = 1; // jump/float frame
        return;
    }

    // Run cycle animation speed based on velocity.
    // We cap the increment so sprinting doesn't make legs blur — max 0.18 per frame (~11fps cycle).
    if (Math.abs(player.speed) > 0.3) {
        const animIncrement = Math.min(Math.abs(player.speed) * 0.045, 0.18);
        player.animTimer += animIncrement;
        player.animFrame = Math.floor(player.animTimer) % 4; // cycle through frames 0-3
    } else {
        player.animFrame = 0; // idle standing
    }
}

// --- Primary Loop ---
function loop() {
    if (gameState === STATES.PLAYING) {
        // Physics update
        updatePhysics();
        updateObstacles();
        updateParticles();
        animatePlayer();

        // Render scene
        drawParallaxBackground();
        drawFloorReflection();
        drawFloorTiles();
        drawParticles();
        drawEntities();

        // Player water pool + model drawing
        drawWaterPool();
        drawPlayerSprite(player.x - cameraX, player.y);

        // Update HUD dials
        drawHUD();
    }

    requestAnimationFrame(loop);
}

// --- Water pool under player ---
function drawWaterPool() {
    if (!player.isOnGround) return; // only when standing / running on floor

    const theme = getActiveTheme();
    const cx = player.x - cameraX + player.width / 2;
    const cy = 420; // floor Y
    const baseRx = player.width * 0.8 + Math.abs(player.speed) * 1.2; // wider when sprinting
    const ry = 7 + Math.abs(player.speed) * 0.3;

    // Pulse driven by footsteps (anim frame changes)
    const pulse = Math.abs(Math.sin(player.animTimer * 0.8)) * 4;

    // Outer glow ring
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = theme.waterPoolColor1;
    ctx.beginPath();
    ctx.ellipse(cx, cy, baseRx + 10 + pulse, ry + 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Main pool body
    ctx.globalAlpha = 0.38;
    const poolGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, baseRx + pulse);
    poolGrad.addColorStop(0, theme.waterPoolColor2);
    poolGrad.addColorStop(0.5, theme.waterPoolColor3);
    poolGrad.addColorStop(1, theme.waterPoolColor4);
    ctx.fillStyle = poolGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, baseRx + pulse, ry, 0, 0, Math.PI * 2);
    ctx.fill();

    // Specular highlight
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.beginPath();
    ctx.ellipse(cx - baseRx * 0.18, cy - 1, baseRx * 0.3, ry * 0.4, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // Ripple rings that expand outward (timed to footstep)
    const rippleT = player.animTimer % 1.0;
    ctx.globalAlpha = (1 - rippleT) * 0.25;
    ctx.strokeStyle = theme.waterPoolRippleColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(cx, cy, baseRx * (0.5 + rippleT * 0.8), ry * (0.5 + rippleT * 0.6), 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
}

// Draws a granny sprite centred at (cx, feetY) using given frame index.
// isReflection=true renders at reduced opacity (called by drawFloorReflection).
function drawGrannySprite(cx, feetY, frameIndex = 0, isReflection = false) {
    if (!grannySpritesLoaded || grannySprites.length === 0) return;
    const frame = grannySprites[Math.min(frameIndex, grannySprites.length - 1)];
    // Render granny at a consistent height of ~100px (matches obs.height * 1.2)
    const renderH = 110;
    const scale = renderH / frame.height;
    const renderW = frame.width * scale;
    ctx.save();
    if (isReflection) ctx.globalAlpha *= 0.5;
    ctx.drawImage(frame, cx - renderW / 2, feetY - renderH, renderW, renderH);
    ctx.restore();
}

// --- Preload sprites and boot ---
async function init() {
    try {
        console.log("Loading sprite sheets...");
        // Load skuf (player) sprite sheet
        playerSprites = await spriteProcessor.loadAndProcess('assets/skuf_sprites.jpg');
        spritesLoaded = true;
        console.log("Player sprites loaded!", playerSprites);
    } catch (e) {
        console.error("Player sprite sheet loading failed, using fallback.", e);
        spritesLoaded = false;
    }

    try {
        // Load granny sprite sheet
        const grannyProcessor = new SpriteProcessor(window.GRANNY_SPRITE_CONFIG);
        grannySprites = await grannyProcessor.loadAndProcess('assets/granny_sprites.jpg');
        grannySpritesLoaded = true;
        console.log("Granny sprites loaded!", grannySprites);
    } catch (e) {
        console.error("Granny sprite sheet loading failed, using fallback vectors.", e);
        grannySpritesLoaded = false;
    }

    // Start game loop
    requestAnimationFrame(loop);
}

// Boot application
init();
