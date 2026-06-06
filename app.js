/**
 * Parnav Roy | Medwise Academy Hub
 * Core Application Engine Script
 */

// Initialize Icons via Lucide Engine
lucide.createIcons();

// Global Structural Variable Declarations and Default Arrays
let timeRemaining = 1500; 
let clockRunning = false;
let countdownTimerId = null;
let selectedAudioKey = 'refreshing';
let currentBioVal = 65;
let currentChemVal = 40;

// Analytics Performance States Map Tracking Metrics
let totalCyclesCompleted = 0;
let totalMinutesStudied = 0;

// Multi-Topic Flashcard Database for Class 10 Advanced Active Recall
const flashcardMatrix = {
    bio: [
        { q: "Which phase of mitosis involves chromosomes splitting and moving towards opposite poles?", a: "Anaphase" },
        { q: "What is the force responsible for drawing water upwards through xylem columns in high plants?", a: "Transpiration Pull / Suction Force" },
        { q: "Name the stage of the cell cycle where active DNA synthesis and DNA replication take place.", a: "S-Phase (Synthesis Phase)" },
        { q: "Which specific blood vessels supply oxygenated blood directly to the muscles of the heart?", a: "Coronary Arteries" }
    ],
    chem: [
        { q: "What element separates at the anode loop during electrolysis of copper sulphate using platinum nodes?", a: "Oxygen Gas (O2)" },
        { q: "What happens to the electron affinity of elements as you move from left to right across a period?", a: "It increases due to decrease in atomic size and increase in nuclear charge." },
        { q: "What is the organic compound suffix indicator for a functional group containing triple covalent carbon bonds?", a: "-yne (Alkynes)" },
        { q: "Name the industrial process used exclusively for the continuous production of Nitric Acid.", a: "Ostwald's Process" }
    ]
};

let selectedRecallCategory = 'all';
let structuralRecallIndex = 0;
let answerFieldRevealed = false;

// Initialize Workspace Tracking Pipelines on Content Boot Load
document.addEventListener("DOMContentLoaded", () => {
    updateTaskCounters();
    initializeScratchpadMemory();
    runLiveDigitalClockEngine();
    cycleNextCard(); 
});

/**
 * Section A: Live Clock and Core Component Utilities
 */
function runLiveDigitalClockEngine() {
    setInterval(() => {
        const timeNode = new Date();
        const outputString = timeNode.toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
        document.getElementById('liveDigitalClock').innerText = `${outputString} IST`;
    }, 1000);
}

function initializeScratchpadMemory() {
    const backupData = localStorage.getItem('medwise_scratchpad');
    if (backupData) {
        document.getElementById('scratchpadArea').value = backupData;
    }
}

function saveScratchpadContent(dataVal) {
    localStorage.setItem('medwise_scratchpad', dataVal);
}

/**
 * Section B: Task and Checklist Management System
 */
function updateTaskCounters() {
    const targetWrapper = document.getElementById('todoListContainer');
    document.getElementById('taskCounter').innerText = `${targetWrapper.children.length} Remaining`;
}

function addNewWorkspaceTask() {
    const sourceInputField = document.getElementById('newTaskInput');
    const inputContent = sourceInputField.value.trim();
    if (!inputContent) return;

    const rowItem = document.createElement('div');
    rowItem.className = "flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold animate-fade-in";
    rowItem.innerHTML = `
        <span class="text-slate-700">${inputContent}</span>
        <button onclick="this.parentElement.remove(); updateTaskCounters();" class="text-slate-400 hover:text-rose-500 transition-all">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
        </button>
    `;
    document.getElementById('todoListContainer').appendChild(rowItem);
    lucide.createIcons();
    sourceInputField.value = "";
    updateTaskCounters();
}

/**
 * Section C: Document Search and Board Scope Filtering Engine
 */
function searchChaptersEngine() {
    const searchString = document.getElementById('chapterSearch').value.toLowerCase();
    const targetCards = document.querySelectorAll('.chapter-card');
    targetCards.forEach(card => {
        const structuralTitleText = card.querySelector('.chapter-title').innerText.toLowerCase();
        card.style.display = structuralTitleText.includes(searchString) ? 'flex' : 'none';
    });
}

function filterBoard(scopeRuleValue) {
    const targetCards = document.querySelectorAll('.chapter-card');
    targetCards.forEach(card => {
        const validationArray = card.getAttribute('data-board').split(' ');
        if (scopeRuleValue === 'all' || validationArray.includes(scopeRuleValue)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

/**
 * Section D: Advanced Audio and Timer Matrix Controller Configuration
 */
function setAudioSource(trackKeyName) {
    document.getElementById('audio-refreshing').pause();
    document.getElementById('audio-motivating').pause();
    
    selectedAudioKey = trackKeyName;
    
    document.getElementById('btn-audio-refreshing').className = trackKeyName === 'refreshing' ? "flex-1 py-1.5 bg-brand text-white text-xs font-bold rounded-lg transition-all" : "flex-1 py-1.5 bg-white text-slate-600 text-xs font-bold rounded-lg border border-slate-200 hover:border-brand/40 transition-all";
    document.getElementById('btn-audio-motivating').className = trackKeyName === 'motivating' ? "flex-1 py-1.5 bg-brand text-white text-xs font-bold rounded-lg transition-all" : "flex-1 py-1.5 bg-white text-slate-600 text-xs font-bold rounded-lg border border-slate-200 hover:border-brand/40 transition-all";

    if (clockRunning) {
        const audioInstance = document.getElementById('audio-' + selectedAudioKey);
        audioInstance.volume = 0.3;
        audioInstance.play().catch(() => {});
    }
}

function toggleTimerSystem() {
    const miniatureBtn = document.getElementById('miniPlayBtn');
    const overlayBtn = document.getElementById('fullscreenPlayBtn');
    const audioTrackInstance = document.getElementById('audio-' + selectedAudioKey);
    const cinematicVideoNode = document.getElementById('bgVideoLoopNode');

    if (clockRunning) {
        clearInterval(countdownTimerId);
        clockRunning = false;
        miniatureBtn.innerText = "Resume Sprint";
        overlayBtn.innerText = "Resume Sprint";
        audioTrackInstance.pause();
        cinematicVideoNode.pause();
    } else {
        clockRunning = true;
        miniatureBtn.innerText = "Pause";
        overlayBtn.innerText = "Pause Sprint";
        
        audioTrackInstance.volume = 0.3;
        audioTrackInstance.play().catch(() => console.log("Viewport validation requested for audio nodes."));
        cinematicVideoNode.play().catch(() => {});

        countdownTimerId = setInterval(() => {
            if (timeRemaining > 0) {
                timeRemaining--;
                refreshTimerVisualsData();
                if (timeRemaining % 60 === 0) {
                    totalMinutesStudied++;
                    recalculatePerformanceInsightMetrics();
                }
            } else {
                clearInterval(countdownTimerId);
                totalCyclesCompleted++;
                recalculatePerformanceInsightMetrics();
                alert("Sprint completed successfully. Update notes buffer.");
                resetTimerSystem();
            }
        }, 1000);
    }
}

function resetTimerSystem() {
    clearInterval(countdownTimerId);
    clockRunning = false;
    timeRemaining = 1500;
    refreshTimerVisualsData();
    document.getElementById('miniPlayBtn').innerText = "Start Sprint";
    document.getElementById('fullscreenPlayBtn').innerText = "Start Sprint";
    document.getElementById('audio-refreshing').pause();
    document.getElementById('audio-motivating').pause();
    document.getElementById('bgVideoLoopNode').pause();
}

function refreshTimerVisualsData() {
    let internalMinutes = Math.floor(timeRemaining / 60);
    let internalSeconds = timeRemaining % 60;
    let computedDisplayString = `${internalMinutes.toString().padStart(2, '0')}:${internalSeconds.toString().padStart(2, '0')}`;
    document.getElementById('miniTimer').innerText = computedDisplayString;
    document.getElementById('fullscreenTimer').innerText = computedDisplayString;
}

function adjustVolumeLevel(gainLevelValue) {
    document.getElementById('audio-refreshing').volume = gainLevelValue;
    document.getElementById('audio-motivating').volume = gainLevelValue;
}

function launchFullscreenSprint() {
    document.getElementById('fullscreenOverlay').classList.remove('hidden');
    document.getElementById('fullscreenOverlay').classList.add('flex');
}

function exitFullscreenSprint() {
    document.getElementById('fullscreenOverlay').classList.add('hidden');
    document.getElementById('fullscreenOverlay').classList.remove('flex');
}

/**
 * Section E: Advanced Active Recall Array Mapping Architecture
 */
function swapActiveRecallCategory(categoryKey) {
    selectedRecallCategory = categoryKey;
    structuralRecallIndex = 0;
    cycleNextCard();
}

function fetchCurrentRecallDeck() {
    if (selectedRecallCategory === 'all') {
        return [...flashcardMatrix.bio, ...flashcardMatrix.chem];
    }
    return flashcardMatrix[selectedRecallCategory];
}

function cycleNextCard() {
    const deckInstance = fetchCurrentRecallDeck();
    if (deckInstance.length === 0) return;
    
    structuralRecallIndex = (structuralRecallIndex + 1) % deckInstance.length;
    const targetCardNode = deckInstance[structuralRecallIndex];
    
    document.getElementById('recallField').innerText = targetCardNode.q;
    document.getElementById('recallField').className = "bg-slate-50 rounded-2xl p-6 text-center border border-slate-100 min-h-[110px] flex items-center justify-center font-bold text-xs text-slate-700 leading-relaxed";
    answerFieldRevealed = false;
}

function revealAnswerBlock() {
    if (answerFieldRevealed) return;
    const deckInstance = fetchCurrentRecallDeck();
    const activeTargetNode = deckInstance[structuralRecallIndex];
    
    document.getElementById('recallField').innerText = `💡 KEY RESPONSE:\n${activeTargetNode.a}`;
    document.getElementById('recallField').className = "bg-brand-light text-brand rounded-2xl p-6 text-center border border-brand/20 min-h-[110px] flex items-center justify-center font-extrabold text-xs leading-relaxed";
    answerFieldRevealed = true;
}

/**
 * Section F: Diagnostic Analytics Meter Calibration Logs
 */
function boostStatMetric(disciplineTypeKey) {
    if (disciplineTypeKey === 'bio') {
        if (currentBioVal < 100) currentBioVal = Math.min(100, currentBioVal + 5);
        document.getElementById('bioBarPct').innerText = `${currentBioVal}%`;
        document.getElementById('bioBarFluid').style.width = `${currentBioVal}%`;
    } else if (disciplineTypeKey === 'chem') {
        if (currentChemVal < 100) currentChemVal = Math.min(100, currentChemVal + 5);
        document.getElementById('chemBarPct').innerText = `${currentChemVal}%`;
        document.getElementById('chemBarFluid').style.width = `${currentChemVal}%`;
    }
}

function recalculatePerformanceInsightMetrics() {
    document.getElementById('statCyclesCounter').innerText = totalCyclesCompleted;
    document.getElementById('statTimeStudied').innerText = `${totalMinutesStudied} mins`;
    
    const metricNode = document.getElementById('statFocusVelocity');
    if (totalCyclesCompleted >= 4) {
        metricNode.innerText = "Elite Tier";
        metricNode.className = "text-2xl font-black font-mono text-brand-accent";
    } else if (totalCyclesCompleted > 0) {
        metricNode.innerText = "Accelerated";
        metricNode.className = "text-2xl font-black font-mono text-emerald-400";
    } else {
        metricNode.innerText = "Optimal";
        metricNode.className = "text-2xl font-black font-mono text-amber-400";
    }
}
