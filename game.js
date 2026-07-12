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
        { x: 29,  w: 241 }, // frame 0 – left foot forward
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
        // Level 1 — Public Baths
        id: 1,
        name: 'Public Baths',
        length: 5000,
        coolingRate: 0.022,
        floorBase: '#121620',
        floorTile: '#141924',
        floorWet: 'rgba(0, 242, 254, 0.08)',
        groutColor: '#1d2333',
        fanWeight: 0.25,
        bucketWeight: 0.55,
        mopWeight: 0.80,
        // rest = scrub_machine
        radiatorSpacing: 1100,
        minSpacing: 350,
        maxSpacingJitter: 300
    },
    {
        // Level 2 — Steam Sauna Rooms
        id: 2,
        name: 'Steam Sauna Rooms',
        length: 6500,
        coolingRate: 0.026,
        floorBase: '#1a0d08',
        floorTile: '#2b1612',
        floorWet: 'rgba(255, 123, 0, 0.10)',
        groutColor: '#3a1a0e',
        fanWeight: 0.15,
        bucketWeight: 0.50,
        mopWeight: 0.80,
        radiatorSpacing: 1300,
        minSpacing: 280,
        maxSpacingJitter: 260
    },
    {
        // Level 3 — VIP Draft Hallway
        id: 3,
        name: 'VIP Draft Hallway',
        length: 8000,
        coolingRate: 0.032,
        floorBase: '#060f14',
        floorTile: '#112330',
        floorWet: 'rgba(144, 224, 239, 0.12)',
        groutColor: '#1a3545',
        fanWeight: 0.45,   // lots of fans!
        bucketWeight: 0.60,
        mopWeight: 0.80,
        radiatorSpacing: 1500,
        minSpacing: 220,
        maxSpacingJitter: 220
    }
];

function getLevelConfig() {
    return LEVEL_CONFIGS[currentLevel - 1] || LEVEL_CONFIGS[0];
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
        subEl.innerText = 'You conquered all 3 levels of the bathhouse gauntlet!';
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

function drawParallaxBackground() {
    // Clear viewport
    ctx.fillStyle = '#0a0d14';
    ctx.fillRect(0, 0, 960, 540);

    // Layer 0: Tiled Distant Wall (Slowest scroll)
    const bg0Scroll = -cameraX * 0.15;
    ctx.fillStyle = '#11141c';
    // Draw background stripes/tiles
    for (let x = (bg0Scroll % 240) - 240; x < 960 + 240; x += 240) {
        ctx.fillRect(x, 0, 110, 420);
        
        // Draw window showing snow storm outside
        ctx.fillStyle = '#05070d';
        ctx.fillRect(x + 10, 80, 90, 110);
        ctx.fillStyle = 'rgba(0, 242, 254, 0.08)'; // frosted glow
        ctx.fillRect(x + 10, 80, 90, 110);
        
        // Window frames
        ctx.strokeStyle = '#181d26';
        ctx.lineWidth = 4;
        ctx.strokeRect(x + 10, 80, 90, 110);
        ctx.beginPath();
        ctx.moveTo(x + 55, 80); ctx.lineTo(x + 55, 190);
        ctx.moveTo(x + 10, 135); ctx.lineTo(x + 100, 135);
        ctx.stroke();

        // Draw snow particles falling outside window
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        for (let s = 0; s < 4; s++) {
            const snowX = x + 15 + ((runTimer * 0.4 + s * 30) % 80);
            const snowY = 85 + ((runTimer * 0.8 + s * 25) % 100);
            ctx.fillRect(snowX, snowY, 2, 2);
        }

        ctx.fillStyle = '#11141c'; // restore color
    }

    // Layer 1: Piping & lockers (Medium scroll)
    const bg1Scroll = -cameraX * 0.45;
    for (let x = (bg1Scroll % 320) - 320; x < 960 + 320; x += 320) {
        // Draw locker group
        ctx.fillStyle = '#1d222d';
        ctx.fillRect(x + 40, 180, 100, 240);
        ctx.fillStyle = '#222836';
        ctx.fillRect(x + 45, 185, 42, 230);
        ctx.fillRect(x + 93, 185, 42, 230);
        // Lock details
        ctx.fillStyle = '#0f1118';
        ctx.fillRect(x + 78, 280, 4, 15);
        ctx.fillRect(x + 97, 280, 4, 15);
        
        // Draw copper steam pipes
        ctx.fillStyle = '#4c2e26';
        ctx.fillRect(x - 60, 45, 320, 12);
        ctx.fillStyle = '#7a493d';
        ctx.fillRect(x - 60, 45, 320, 4); // Highlight line
    }

    // Draw Radiators (Layer 1.5)
    radiators.forEach(rad => {
        const radX = rad.x - cameraX;
        if (radX < -100 || radX > 1060) return;

        // Radiator drawing: dark copper base with vertical warming fins
        ctx.fillStyle = '#3a2620';
        ctx.fillRect(radX, rad.y, rad.width, rad.height);
        
        // Fins
        ctx.fillStyle = '#784638';
        const numFins = 8;
        const finWidth = rad.width / numFins;
        for (let i = 0; i < numFins; i++) {
            ctx.fillRect(radX + i * finWidth + 2, rad.y + 5, finWidth - 4, rad.height - 10);
        }
        
        // Valve / Pipes
        ctx.fillStyle = '#ff7b54'; // glowing heat valve
        ctx.fillRect(radX - 10, rad.y + 40, 10, 15);
        ctx.fillStyle = '#8f4f3d';
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

    // Update level indicator
    const levelText = document.getElementById('hudLevelText');
    if (levelText) levelText.innerText = 'LEVEL ' + currentLevel;

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

        // Player model drawing
        drawPlayerSprite(player.x - cameraX, player.y);

        // Update HUD dials
        drawHUD();
    }

    requestAnimationFrame(loop);
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
