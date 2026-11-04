<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🚦 ПДД Игра РБ 2026</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background-color: #0F172A; color: #F8FAFC; margin: 0; padding: 20px; display: flex; flex-direction: column; align-items: center; }
        .card { background-color: #1E293B; border-radius: 16px; padding: 20px; width: 100%; max-width: 400px; border: 1px solid #334155; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); margin-top: 20px; box-sizing: border-box; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .title { font-size: 20px; font-weight: bold; color: #FFF; margin: 0; }
        .wallet { color: #F59E0B; font-size: 18px; font-weight: bold; background-color: #0F172A; padding: 6px 14px; border-radius: 20px; border: 1px solid #F59E0B; }
        .question-text { font-size: 18px; font-weight: bold; text-align: center; line-height: 1.4; margin-bottom: 20px; color: #E2E8F0; }
        .visual-box { background-color: #0F172A; border-radius: 12px; width: 100px; height: 100px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto; font-size: 45px; border: 1px solid #334155; }
        .option-btn { background-color: #0F172A; border: 1px solid #334155; color: #E2E8F0; width: 100%; padding: 15px; border-radius: 12px; font-size: 16px; text-align: left; margin-bottom: 12px; cursor: pointer; transition: all 0.2s; box-sizing: border-box; }
        .option-btn:hover { background-color: #1E293B; }
        .correct { background-color: #16A34A !important; border-color: #22C55E !important; color: white; }
        .wrong { background-color: #DC2626 !important; border-color: #EF4444 !important; color: white; }
        .expl-box { background-color: #0F172A; border: 1px solid #F59E0B; border-radius: 12px; padding: 15px; margin-top: 15px; display: none; }
        .expl-text { font-size: 14px; color: #CBD5E1; line-height: 1.5; margin: 0 0 15px 0; }
        .next-btn { background-color: #38BDF8; color: #0F172A; border: none; width: 100%; padding: 12px; border-radius: 10px; font-size: 16px; font-weight: bold; cursor: pointer; }
    </style>
</head>
<body>
    <div class="card">
        <div class="header">
            <h1 class="title">🚦 ПДД Игра РБ</h1>
            <div id="wallet" class="wallet">🪙 0</div>
        </div>
        <div id="question" class="question-text">Загрузка вопроса...</div>
        <div id="visual" class="visual-box">⚡</div>
        <div id="options-container"></div>
        <div id="expl-box" class="expl-box">
            <p id="expl-text" class="expl-text">Объяснение...</p>
            <button id="next-btn" class="next-btn" onclick="nextQuestion()">Дальше ➡️</button>
        </div>
    </div>
    <script>
        const questionsDB = [
            { id: 1, text: "Какое максимальное ограничение скорости установлено в РБ для лиц, передвигающихся на средствах персональной мобильности (СПМ)?", visual: "🛴", options: ["Не более 20 км/ч", "Не более 25 км/ч", "Не более 30 км/ч"], correct: 1, expl: "Согласно ПДД РБ, движение на средствах персональной мобильности разрешено со скоростью не более 25 км/ч." },
            { id: 2, text: "Регулировщик обращен к вам лицом, его руки вытянуты в стороны или опущены. Какое движение вам разрешено?", visual: "👮‍♂️", options: ["Движение запрещено строго", "Разрешено движение только прямо", "Разрешен поворот направо"], correct: 0, expl: "Если регулировщик расположен к вам грудью или спиной — это жест 'Стена', движение запрещено во всех направлениях (п. 35.1 ПДД РБ)." },
            { id: 3, text: "Включен красный сигнал светофора и дополнительная зеленая стрелка направо. Обязаны ли вы уступать дорогу ТС с других направлений?", visual: "🚦", options: ["Не обязаны, у нас зеленая стрелка", "Обязаны уступить дорогу ТС, движущимся с других направлений", "Преимущество определяется по помехе справа"], correct: 1, expl: "При движении в направлении стрелки, включенной одновременно с красным сигналом, водитель ОБЯЗАН уступить дорогу ТС, движущимся с других направлений (п. 39 ПДД РБ)." },
            { id: 4, text: "Вы въезжаете на нерегулируемый перекресток с круговым движением. Знаков приоритета нет. Кто имеет преимущество?", visual: "🔄", options: ["Водители, которые уже находятся на кольце", "Вы, так как являетесь помехой справа", "Тот, кто едет быстрее"], correct: 0, expl: "В РБ по умолчанию перекресток с круговым движением является главным. Въезжающий на кольцо обязан уступить дорогу (п. 109.2 ПДД РБ)." }
        ];
        let currentIdx = 0; let coins = 0; let isAnswered = false;
        function loadQuestion() {
            isAnswered = false; const q = questionsDB[currentIdx];
            document.getElementById("question").innerText = q.text;
            document.getElementById("visual").innerText = q.visual;
            document.getElementById("expl-box").style.display = "none";
            const container = document.getElementById("options-container"); container.innerHTML = "";
            q.options.forEach((opt, idx) => {
                const btn = document.createElement("button"); btn.className = "option-btn"; btn.innerText = opt;
                btn.onclick = () => checkAnswer(idx, btn); container.appendChild(btn);
            });
        }
        function checkAnswer(selectedIdx, btn) {
            if (isAnswered) return; isAnswered = true; const q = questionsDB[currentIdx];
            const buttons = document.getElementsByClassName("option-btn");
            if (selectedIdx === q.correct) { btn.classList.add("correct"); coins += 15; document.getElementById("wallet").innerText = "🪙 " + coins; }
            else { btn.classList.add("wrong"); buttons[q.correct].classList.add("correct"); }
            document.getElementById("expl-text").innerText = "📖 " + q.expl; document.getElementById("expl-box").style.display = "block";
        }
        function nextQuestion() {
            if (currentIdx < questionsDB.length - 1) { currentIdx++; loadQuestion(); }
            else { alert("🏆 Сессия завершена!\nВы отлично потренировались.\nЗаработано: " + coins + " монет 🪙"); currentIdx = 0; coins = 0; document.getElementById("wallet").innerText = "🪙 0"; loadQuestion(); }
        }
        loadQuestion();
    </script>
</body>
</html>
