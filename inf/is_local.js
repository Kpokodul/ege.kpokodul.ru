// Проверяем, открыт ли файл локально
if (window.location.protocol === 'file:') {
    // Показываем вашу плашку
    const warningDiv = document.querySelector('.warning');
    if (warningDiv) {
        warningDiv.style.display = 'block';
        
        // Логика перенаправления
        let seconds = 15;
        const countdownElement = document.getElementById('countdown');
        let redirectTimer = setTimeout(redirectToOnline, seconds*1000);
        
        // Обновляем счетчик
        const countdownInterval = setInterval(updateCountdown, 1000);
        
        function updateCountdown() {
            seconds--;
            countdownElement.textContent = seconds;
            if (seconds <= 0) clearInterval(countdownInterval);
        }
        
        function redirectToOnline() {
            window.location.href = 'https://ege.kpokodul.ru/inf';
        }
    }
}