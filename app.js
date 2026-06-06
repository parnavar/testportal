// ===============================
// 🔐 LOCAL STORAGE ENGINE
// ===============================
function saveData(key, value){
    localStorage.setItem(key, JSON.stringify(value));
}

function loadData(key, fallback){
    return JSON.parse(localStorage.getItem(key)) || fallback;
}

// ===============================
// 🌙 DARK MODE
// ===============================
function toggleDarkMode(){
    document.body.classList.toggle("dark");
    saveData("darkMode", document.body.classList.contains("dark"));
}

if(loadData("darkMode", false)){
    document.body.classList.add("dark");
}

// ===============================
// 🎯 GOAL SYSTEM
// ===============================
function saveGoal(){
    const val = document.getElementById("goalInput").value;
    saveData("goal", val);
    document.getElementById("goalDisplay").innerText = val;
}

document.getElementById("goalDisplay").innerText = loadData("goal","");

// ===============================
// 🔥 HEATMAP
// ===============================
function drawHeatmap(){
    const canvas = document.getElementById("heatmap");
    const ctx = canvas.getContext("2d");

    let data = loadData("heatmap", Array(30).fill(0));

    data.forEach((v,i)=>{
        ctx.fillStyle = v>5 ? "#0284c7" : v>2 ? "#38bdf8" : "#e0f2fe";
        ctx.fillRect((i%10)*30, Math.floor(i/10)*30, 20, 20);
    });
}
drawHeatmap();

// ===============================
// 📊 PERFORMANCE GRAPH
// ===============================
function drawGraph(){
    const canvas = document.getElementById("performanceChart");
    const ctx = canvas.getContext("2d");

    let data = loadData("performance",[40,50,60]);

    ctx.beginPath();
    ctx.moveTo(0,200-data[0]);

    data.forEach((v,i)=>{
        ctx.lineTo(i*50,200-v);
    });

    ctx.strokeStyle = "#0052cc";
    ctx.stroke();
}
drawGraph();

// ===============================
// 🧠 SPACED REPETITION
// ===============================
function scheduleCard(card){
    let now = Date.now();
    card.nextReview = now + (card.interval || 1) * 86400000;
    card.interval = (card.interval || 1) * 2;
}

// ===============================
// 📁 EXPORT / IMPORT
// ===============================
function exportData(){
    const data = JSON.stringify(localStorage);
    const blob = new Blob([data], {type:"application/json"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "medwise-backup.json";
    a.click();
}

function importData(){
    const input = document.createElement("input");
    input.type="file";
    input.onchange = e=>{
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = ()=>{
            const data = JSON.parse(reader.result);
            Object.keys(data).forEach(k=>localStorage.setItem(k,data[k]));
            location.reload();
        };
        reader.readAsText(file);
    };
    input.click();
}

// ===============================
// 🔔 NOTIFICATIONS
// ===============================
function notify(msg){
    if(Notification.permission==="granted"){
        new Notification(msg);
    } else {
        Notification.requestPermission();
    }
}

// ===============================
// ⌨️ SHORTCUTS
// ===============================
document.addEventListener("keydown", (e)=>{
    if(e.key===" "){
        toggleTimerSystem();
    }
    if(e.key==="d"){
        toggleDarkMode();
    }
});

// ===============================
// 🧪 QUIZ MODE
// ===============================
function generateQuiz(){
    let q = "What is pH of neutral solution?";
    let options = ["5","7","9"];
    console.log(q, options);
}

// ===============================
// 🎧 AUDIO MIXER
// ===============================
function mixAudio(vol1, vol2){
    document.getElementById('audio-refreshing').volume = vol1;
    document.getElementById('audio-motivating').volume = vol2;
}

// ===============================
// 📅 STREAK SYSTEM
// ===============================
function updateStreak(){
    let last = loadData("lastStudy",0);
    let today = new Date().toDateString();

    if(last !== today){
        let streak = loadData("streak",0)+1;
        saveData("streak", streak);
        saveData("lastStudy", today);
    }
}
updateStreak();
