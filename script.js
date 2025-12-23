const screen = document.getElementById("screen");
const btn = document.getElementById("btn");
const canvas = document.getElementById("timerCanvas");
const ctx = canvas.getContext("2d");

let nickname = "";
let round = 0;
let mistakes = 0;
let maxRounds = 50;
let timeLeft = 15;
let countdownInterval = null;
let currentAnswer = "";
let gameEnded = false;
const QUESTION_TIME = 15;

// Пример вопросов
const hardTasks = [
{q:"7×8?",a:"56"},{q:"2+2×2?",a:"6"},{q:"Секунд в часе?",a:"3600"},
{q:"15% от 200?",a:"30"},{q:"√144?",a:"12"},{q:"9³?",a:"729"},
{q:"(10−2)²?",a:"64"},{q:"Нулей в миллионе?",a:"6"},
{q:"100÷0,5?",a:"200"},{q:"5! ?",a:"120"},
{q:"1кг пуха или железа?",a:"одинаково"},{q:"Месяцев с 28 днями?",a:"12"},
{q:"Сторон у круга?",a:"0"},{q:"Проиграл один в шахматах — сколько выиграло?",a:"1"},
{q:"Что больше 0 или -1?",a:"0"},{q:"Можно ли в решете носить воду?",a:"да"},
{q:"Что растёт и не живёт?",a:"возраст"},{q:"Что идёт и не приходит?",a:"время"},
{q:"Концов у палки?",a:"2"},{q:"Сколько раз вычесть 5 из 25?",a:"1"},
{q:"Напиши слово СЛОВО маленькими",a:"слово"},{q:"Букв в слове СЕМЬ?",a:"4"},
{q:"Сколько «о» в слове молоко?",a:"3"},{q:"Первая буква алфавита?",a:"а"},
{q:"Последняя буква алфавита?",a:"я"},{q:"Слов в этой фразе?",a:"4"},
{q:"Число после 9?",a:"10"},{q:"Напиши «ничего»",a:"ничего"},
{q:"Это вопрос? да/нет",a:"да"},{q:"Напиши неправильный ответ",a:"неправильный"},
{q:"Сколько рёбер у куба?",a:"12"},{q:"Сколько граней у куба?",a:"6"},
{q:"Углов у треугольника?",a:"3"},{q:"Минут в 2 часах?",a:"120"},
{q:"Секунд в минуте?",a:"60"},{q:"Чётное: 7 или 8?",a:"8"},
{q:"3²?",a:"9"},{q:"Дней в неделе?",a:"7"},{q:"Месяцев в году?",a:"12"},
{q:"100−7×13?",a:"9"},{q:"Что можно сломать не трогая?",a:"обещание"},
{q:"Что исчезает если сказать?",a:"тишина"},{q:"Что всегда впереди?",a:"будущее"},
{q:"Что ловят но не бросают?",a:"простуда"},{q:"Ключ без замка?",a:"пианино"},
{q:"8×8?",a:"64"},{q:"Секунд в 10 минутах?",a:"600"},{q:"50% от 50?",a:"25"},
{q:"√81?",a:"9"},{q:"Напиши число сто",a:"100"}
];
maxRounds = hardTasks.length;

// ---------- Функции таймера ----------
function drawTimer(timeLeft) {
    ctx.clearRect(0,0,80,80);
    ctx.beginPath();
    ctx.arc(40,40,35,-Math.PI/2,(-Math.PI/2 + 2*Math.PI*(timeLeft/QUESTION_TIME)));
    ctx.strokeStyle = "#00ffcc";
    ctx.lineWidth = 6;
    ctx.stroke();
    ctx.fillStyle = "#fff";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(timeLeft,40,40);
}

// ---------- Таймер ----------
function startTimer() {
    clearInterval(countdownInterval);
    timeLeft = QUESTION_TIME;
    drawTimer(timeLeft);
    countdownInterval = setInterval(() => {
        timeLeft--;
        drawTimer(timeLeft);
        if(timeLeft<=0){
            clearInterval(countdownInterval);
            mistakes++;
            nextRound();
        }
    },1000);
}

// ---------- Финиш ----------
function finishGame() {
    gameEnded = true;
    clearInterval(countdownInterval);
    let container = document.getElementById("game");
    if(mistakes >= Math.ceil(maxRounds/5)){
        container.innerHTML = `<h1 style="color:#ff4444; text-shadow:0 0 10px #ff0000;">❌ ПРОИГРЫШ ❌</h1><p>Ошибок: ${mistakes} из ${maxRounds}</p>`;
    } else {
        container.innerHTML = `<h1 class="win">🎉 ПОБЕДА 🎉</h1>
        <p>🎄 ${nickname}, ты прошёл игру 🎁</p>
        <p>Ошибок: ${mistakes} из ${maxRounds}</p>`;
    }
}

// ---------- Следующий вопрос ----------
function nextRound(){
    clearInterval(countdownInterval);
    if(round>0){
        const inp = document.getElementById("answer");
        if(inp && inp.value.trim().toLowerCase()!==currentAnswer.toLowerCase()){
            mistakes++;
            if(inp) inp.classList.add("error");
            setTimeout(()=>{if(inp) inp.classList.remove("error")},500);
        }
    }
    round++;
    if(round>maxRounds){
        finishGame();
        return;
    }
    const task = hardTasks[round-1];
    currentAnswer = task.a;
    screen.innerHTML = `<p><b>Раунд ${round}/${maxRounds}</b> | Ошибки: ${mistakes}</p>
        <p>${task.q}</p>
        <input id="answer" autocomplete="off">`;
    startTimer();
}

// ---------- Старт игры ----------
btn.onclick = ()=>{
    if(!nickname){
        nickname = document.getElementById("nick").value.trim();
        if(!nickname) return;
    }
    nextRound();
};

// ---------- Новогодний снег ----------
const snowCanvas = document.createElement("canvas");
snowCanvas.id = "snow";
snowCanvas.width = window.innerWidth;
snowCanvas.height = window.innerHeight;
document.body.appendChild(snowCanvas);
snowCanvas.style.position = "fixed";
snowCanvas.style.top = "0";
snowCanvas.style.left = "0";
snowCanvas.style.pointerEvents = "none";
snowCanvas.style.zIndex = "0";
const snowCtx = snowCanvas.getContext("2d");
let snowflakes = [];
function createSnowflakes() {
    snowflakes = [];
    for(let i=0;i<100;i++){
        snowflakes.push({x:Math.random()*window.innerWidth,y:Math.random()*window.innerHeight,r:Math.random()*3+1,d:Math.random()*1});
    }
}
function drawSnow() {
    snowCtx.clearRect(0,0,snowCanvas.width,snowCanvas.height);
    snowCtx.fillStyle = "white";
    snowCtx.beginPath();
    for(let i=0;i<snowflakes.length;i++){
        let f = snowflakes[i];
        snowCtx.moveTo(f.x,f.y);
        snowCtx.arc(f.x,f.y,f.r,0,Math.PI*2,true);
    }
    snowCtx.fill();
    updateSnow();
}
function updateSnow(){
    for(let i=0;i<snowflakes.length;i++){
        let f = snowflakes[i];
        f.y += Math.pow(f.d,2)+1;
        f.x += Math.sin(f.y*0.01);
        if(f.y>snowCanvas.height){f.y=0;f.x=Math.random()*snowCanvas.width;}
    }
    requestAnimationFrame(drawSnow);
}
window.addEventListener("resize",()=>{
    snowCanvas.width = window.innerWidth;
    snowCanvas.height = window.innerHeight;
    createSnowflakes();
});
createSnowflakes();
drawSnow();

