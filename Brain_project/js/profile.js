document.addEventListener("DOMContentLoaded", function () {
  const userData = JSON.parse(localStorage.getItem("userData"));

  if (userData) {
    document.getElementById("userName").textContent = userData.user.name || "";
    document.getElementById("userLastName").textContent =
      userData.user.surname || "";
    document.getElementById("userEmail").textContent = userData.user.mail || "";
    if (userData.user.status !== "FREE") {
      document.getElementById("sub").style.display = "block"; // Показываем параграф о подписке
    } else {
      document.getElementById("sub").style.display = "none"; // Скрываем параграф о подписке
    }
    document.getElementById("userStatus").textContent =
      userData.user.status || "";
    document.getElementById("subUntil").textContent =
      userData.user.subscribedUntil || "";
  }

  // Получение данных пользователя из localStorage
  const userId = userData.user.id;
  // Создание объекта с данными для отправки на сервер
  const requestData = {
    userId: userId,
  };
  // Функция для парсинга строки в объект Date
  function parseDateString(dateString) {
    const parts = dateString.split(" ");
    const dateParts = parts[0].split(".");
    const timeParts = parts[1].split(":");

    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1; // Месяцы в JavaScript начинаются с 0
    const year = parseInt(dateParts[2], 10);
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);

    return new Date(year, month, day, hours, minutes);
  }
  // Отправка POST запроса на сервер
  fetch("http://localhost:8080/api/ai/history", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  })
    .then((response) => {
      // Проверка статуса ответа
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      // Возвращаем данные в формате JSON
      return response.json();
    })
    .then((diagnostics) => {
      // Обработка полученных данных
      console.log("Последние результаты диагностики:", diagnostics);
      // Получение контейнера для результатов диагностики
      const diagnosisContainer = document.getElementById("diagnosisResults");
      // Очистка содержимого контейнера
      diagnosisContainer.innerHTML = "";
      // Проверка наличия результатов
      if (diagnostics.length > 0) {
        // Вставка каждого результата в контейнер
        diagnostics.forEach((diagnosis) => {
          const diagnosisDate = parseDateString(diagnosis.date);

          const diagnosisText = `${diagnosisDate.toLocaleString()} : ${
            diagnosis.result
          }`;
          const diagnosisElement = document.createElement("p");
          diagnosisElement.classList.add("date-res");
          diagnosisElement.textContent = diagnosisText;
          diagnosisContainer.appendChild(diagnosisElement);
        });
      } else {
        // Скрытие элемента с надписью "Последние результаты диагностики"
        document.querySelector(".res").style.display = "none";
      }
    })
    .catch((error) => {
      console.error("Ошибка при отправке запроса на сервер:", error);
      alert(
        "Произошла ошибка при отправке запроса на сервер. Попробуйте позже."
      );
    });
});
