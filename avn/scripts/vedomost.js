// Загрузка данных из памяти браузера
let students = JSON.parse(localStorage.getItem('avn_db')) || [];

// Элементы интерфейса
const body = document.getElementById('vedomostBody');
const nameInput = document.getElementById('studentName');
const btnAdd = document.getElementById('btnAdd');
const btnClear = document.getElementById('btnClear');

// Инициализация
window.onload = render;

// Добавление студента
btnAdd.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (!name) return alert("Введите ФИО!");

    students.push({
        id: Date.now(),
        name: name,
        rk1: 0, ok1: 0, srs1: 0,
        rk2: 0, ok2: 0, srs2: 0,
        ex: 0
    });

    nameInput.value = "";
    save();
});

// Обновление баллов
function update(id, field, val) {
    const s = students.find(x => x.id === id);
    let num = parseFloat(val) || 0;
    
    // Лимиты баллов
    const limits = { rk: 15, ok: 10, srs: 5, ex: 40 };
    const type = field.replace(/\d/g, ''); // получаем rk, ok или srs
    const max = limits[type] || 15;

    if (num > max) num = max;
    if (num < 0) num = 0;

    s[field] = num;
    save();
}

// Удаление студента
function remove(id) {
    if (confirm("Удалить студента?")) {
        students = students.filter(x => x.id !== id);
        save();
    }
}

// Очистка всей базы
btnClear.addEventListener('click', () => {
    if (confirm("ВНИМАНИЕ! Это удалит всех студентов. Продолжить?")) {
        students = [];
        save();
    }
});

function save() {
    localStorage.setItem('avn_db', JSON.stringify(students));
    render();
}

function render() {
    body.innerHTML = "";
    let totalSum = 0, admittedCount = 0;

    students.forEach((s, i) => {
        const rating = s.rk1 + s.ok1 + s.srs1 + s.rk2 + s.ok2 + s.srs2;
        const canExam = rating >= 30;
        const total = rating + (canExam ? s.ex : 0);
        
        if (canExam) admittedCount++;
        totalSum += total;

        let gText = "2 (неуд)", gClass = "g-2";
        if (!canExam) { gText = "Н/Д"; gClass = "g-none"; }
        else if (total >= 87) { gText = "5 (отл)"; gClass = "g-5"; }
        else if (total >= 74) { gText = "4 (хор)"; gClass = "g-4"; }
        else if (total >= 60) { gText = "3 (удов)"; gClass = "g-3"; }

        const row = `
            <tr>
                <td>${i + 1}</td>
                <td class="fio-cell">${s.name}</td>
                <td class="c-rk"><input type="number" value="${s.rk1}" onchange="update(${s.id},'rk1',this.value)"></td>
                <td class="c-rk"><input type="number" value="${s.ok1}" onchange="update(${s.id},'ok1',this.value)"></td>
                <td class="c-rk"><input type="number" value="${s.srs1}" onchange="update(${s.id},'srs1',this.value)"></td>
                <td class="c-ok"><input type="number" value="${s.rk2}" onchange="update(${s.id},'rk2',this.value)"></td>
                <td class="c-ok"><input type="number" value="${s.ok2}" onchange="update(${s.id},'ok2',this.value)"></td>
                <td class="c-ok"><input type="number" value="${s.srs2}" onchange="update(${s.id},'srs2',this.value)"></td>
                <td class="c-rating" style="color:${canExam ? 'green' : 'red'}">${rating}</td>
                <td class="c-exam"><input type="number" value="${s.ex}" ${!canExam ? 'disabled' : ''} onchange="update(${s.id},'ex',this.value)"></td>
                <td class="c-total">${total}</td>
                <td><span class="grade-box ${gClass}">${gText}</span></td>
                <td><button onclick="remove(${s.id})">❌</button></td>
            </tr>`;
        body.insertAdjacentHTML('beforeend', row);
    });

    // Обновление статки
    document.getElementById('statTotal').innerText = students.length;
    document.getElementById('statPass').innerText = admittedCount;
    document.getElementById('statAvg').innerText = students.length ? (totalSum / students.length).toFixed(1) : 0;
}