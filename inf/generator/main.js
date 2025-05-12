// При загрузке страницы
document.addEventListener("DOMContentLoaded", function () {
    // Загружаем статусы из localStorage
    const correctTasks = JSON.parse(localStorage.getItem("correctTasks")) || [];
    const incorrectTasks =
        JSON.parse(localStorage.getItem("incorrectTasks")) || [];

    // Обновляем статусы заданий
    updateTaskStatuses(correctTasks, incorrectTasks);

    // Для работы ссылок скачивания (в реальном проекте нужно указать реальные пути к файлам)
    document.querySelectorAll(".download-btn").forEach((btn) => {
        btn.addEventListener("click", function (e) {
            if (this.getAttribute("href") === "#") {
                e.preventDefault();
                alert("В реальном приложении здесь будет скачивание файла");
            }
        });
    });
});

// Функция обновления статусов заданий
function updateTaskStatuses(correctTasks, incorrectTasks) {
    document.querySelectorAll(".task").forEach((task) => {
        const taskId = task.id.split("-")[1];
        const statusElement = task.querySelector(".task-status");

        if (correctTasks.includes(taskId)) {
            statusElement.textContent = "Решено верно";
            statusElement.className = "task-status status-correct";
        } else if (incorrectTasks.includes(taskId)) {
            statusElement.textContent = "Решено неверно";
            statusElement.className = "task-status status-incorrect";
        } else {
            statusElement.textContent = "Не решено";
            statusElement.className = "task-status status-unsolved";
        }
    });
}

// Показать конкретное задание по ID
function showTaskById() {
    const taskSearch = document.getElementById("task-search");
    const taskId = taskSearch.value.trim();
    const errorElement = document.getElementById("search-error");

    // Очищаем предыдущие ошибки
    errorElement.textContent = "";

    // Скрыть все группы и задания
    document.querySelectorAll(".group, .task").forEach((el) => {
        el.classList.remove("active");
        el.style.display = "none";
    });

    // Проверить формат ID (6 цифр)
    if (!/^\d{6}$/.test(taskId)) {
        errorElement.textContent =
            "Введите 6-значный ID задания (например: 010001)";
        return;
    }

    const taskElement = document.getElementById(`task-${taskId}`);

    if (taskElement) {
        // Очищаем поле поиска
        taskSearch.value = "";

        // Показать родительскую группу и её заголовок
        const groupId = taskId.substring(0, 2);
        const groupElement = document.getElementById(`group-${groupId}`);
        groupElement.classList.add("active");
        groupElement.style.display = "block";
        groupElement.querySelector("h2").style.display = "block";

        // Показать только нужное задание
        taskElement.style.display = "block";
    } else {
        errorElement.textContent = "Задание с таким ID не найдено";
    }
}

// Показать выбранную группу (все задания)
function showSelectedGroup() {
    // Очищаем поле поиска и сообщения об ошибках
    document.getElementById("task-search").value = "";
    document.getElementById("search-error").textContent = "";

    // Скрыть все группы
    document.querySelectorAll(".group").forEach((group) => {
        group.classList.remove("active");
        group.style.display = "none";
    });

    // Показать выбранную группу
    const selectedGroup = document.getElementById("groups").value;
    const groupElement = document.getElementById(`group-${selectedGroup}`);
    groupElement.classList.add("active");
    groupElement.style.display = "block";

    // Показать все задания в группе
    groupElement.querySelectorAll(".task").forEach((task) => {
        task.style.display = "block";
    });
}

// Проверить ответ
function checkAnswer(taskId, correctAnswer) {
    const inputElement = document.querySelector(
        `#task-${taskId} .answer-input`
    );
    const resultElement = document.getElementById(`result-${taskId}`);
    const solutionBtn = document.querySelector(
        `#task-${taskId} .show-solution`
    );
    const solutionElement = document.querySelector(`#task-${taskId} .solution`);
    const userAnswer = inputElement.value.trim();

    if (userAnswer === "") {
        resultElement.textContent = "";
        resultElement.className = "result";
        solutionBtn.style.display = "none";
        solutionElement.style.display = "none";
        return;
    }

    // Загружаем текущие списки
    let correctTasks = JSON.parse(localStorage.getItem("correctTasks")) || [];
    let incorrectTasks =
        JSON.parse(localStorage.getItem("incorrectTasks")) || [];

    // Удаляем задание из обоих списков (если было там)
    correctTasks = correctTasks.filter((id) => id !== taskId);
    incorrectTasks = incorrectTasks.filter((id) => id !== taskId);

    if (userAnswer.toLowerCase() === correctAnswer) {
        resultElement.textContent = "✓ Правильно!";
        resultElement.className = "result correct";
        // Добавляем в список правильных
        correctTasks.push(taskId);
    } else {
        resultElement.textContent = "✗ Неправильно. Попробуйте ещё раз.";
        resultElement.className = "result incorrect";
        // Добавляем в список неправильных
        incorrectTasks.push(taskId);
    }

    // Сохраняем обновлённые списки
    localStorage.setItem("correctTasks", JSON.stringify(correctTasks));
    localStorage.setItem("incorrectTasks", JSON.stringify(incorrectTasks));

    // Обновляем статусы на странице
    updateTaskStatuses(correctTasks, incorrectTasks);

    // Показываем решение
    solutionBtn.style.display = "block";
    solutionBtn.textContent = "Показать решение";
    solutionElement.style.display = "none";
}

// Показать/скрыть решение
function toggleSolution(taskId) {
    const solutionElement = document.querySelector(`#task-${taskId} .solution`);
    const solutionBtn = document.querySelector(
        `#task-${taskId} .show-solution`
    );

    if (solutionElement.style.display === "none") {
        solutionElement.style.display = "block";
        solutionBtn.textContent = "Скрыть решение";
        loadCodeAndOutput(taskId);
    } else {
        solutionElement.style.display = "none";
        solutionBtn.textContent = "Показать решение";
    }
}

// Загрузка кода и вывода из файлов
function loadCodeAndOutput(taskId) {
    // Загрузка кода
    const codeElement = document.getElementById(`code-${taskId}`);
    if (codeElement) {
        const codePath = `./content/tasksByGroups/group-${taskId.substring(
            0,
            2
        )}/${taskId}/code/${taskId}.py`;
        fetch(codePath)
            .then((response) => response.text())
            .then((code) => {
                codeElement.textContent = code;
                hljs.highlightElement(codeElement); // Подсветка синтаксиса
            })
            .catch((error) => {
                codeElement.textContent = "Код невозможно загрузить в локальной версии. Откройте https://ege.kpokodul.ru/inf";
                console.error("Ошибка загрузки кода:", error);
            });
    }

    // Загрузка вывода
    const outputBlock = document.getElementById(`output-${taskId}`);
    if (outputBlock) {
        const outputPath = `./content/tasksByGroups/group-${taskId.substring(
            0,
            2
        )}/${taskId}/code/${taskId}-out.txt`;
        fetch(outputPath)
            .then((response) => response.text())
            .then((output) => {
                outputBlock.textContent =
                    output || "Программа не выводит данных";
            })
            .catch((error) => {
                outputBlock.textContent =
                    "Вывод невозможно загрузить в локальной версии. Откройте https://ege.kpokodul.ru/inf";
                console.error("Ошибка загрузки вывода:", error);
            });
    }
}
function copyCode(taskId) {
    const codeBlock = document.getElementById(`code-${taskId}`);
    if (!codeBlock) return;

    const range = document.createRange();
    range.selectNode(codeBlock);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);

    try {
        document.execCommand("copy");
        const btn = event.target;
        btn.textContent = "Скопировано!";
        setTimeout(() => (btn.textContent = "Копировать"), 2000);
    } catch (err) {
        console.error("Ошибка копирования:", err);
    }

    window.getSelection().removeAllRanges();
}
