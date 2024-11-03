document.addEventListener("DOMContentLoaded", function () {
  // Обработчик события клика на кнопку
  document
    .getElementById("subscribeButton1")
    .addEventListener("click", function (event) {
      event.preventDefault(); // Предотвращаем стандартное действие кнопки

      // Получение данных пользователя из localStorage
      const userData = JSON.parse(localStorage.getItem("userData"));

      // Создание объекта subData
      const subData = {
        userId: userData.user.id, // Берем userId из userData
        plan: "LITE",
      };

      // Вывод subData в консоль
      console.log("Данные подписки:", subData);
      localStorage.removeItem("userData");

      // Отправка данных на сервер
      fetch("http://localhost:8080/api/ai/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subData), // Отправляем объект subData в формате JSON
      })
        .then((response) => {
          // Проверка статуса ответа
          if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
          }

          // Возвращаем данные в формате JSON
          return response.json();
        })
        .then((updatedUserData) => {
          // Обновление данных пользователя в localStorage новыми данными
          localStorage.setItem("userData", JSON.stringify(updatedUserData));
          alert("Подписка успешно оформлена!");
          window.location.href = "AI.html";
        })
        .catch((error) => {
          console.error("Ошибка при отправке запроса на сервер:", error);
          alert(
            "Произошла ошибка при отправке запроса на сервер. Попробуйте позже."
          );
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
  // Обработчик события клика на кнопку
  document
    .getElementById("subscribeButton2")
    .addEventListener("click", function (event) {
      event.preventDefault(); // Предотвращаем стандартное действие кнопки

      // Получение данных пользователя из localStorage
      const userData = JSON.parse(localStorage.getItem("userData"));

      // Создание объекта subData
      const subData = {
        userId: userData.user.id, // Берем userId из userData
        plan: "AI",
      };

      // Вывод subData в консоль
      console.log("Данные подписки:", subData);

      // Отправка данных на сервер
      fetch("http://localhost:8080/api/ai/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subData), // Отправляем объект subData в формате JSON
      })
        .then((response) => {
          // Проверка статуса ответа
          if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
          }

          // Возвращаем данные в формате JSON
          return response.json();
        })
        .then((updatedUserData) => {
          // Обновление данных пользователя в localStorage новыми данными
          localStorage.setItem("userData", JSON.stringify(updatedUserData));
          alert("Подписка успешно оформлена!");
          window.location.href = "AI.html";
        })
        .catch((error) => {
          console.error("Ошибка при отправке запроса на сервер:", error);
          alert(
            "Произошла ошибка при отправке запроса на сервер. Попробуйте позже."
          );
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
  // Обработчик события клика на кнопку
  document
    .getElementById("subscribeButton3")
    .addEventListener("click", function (event) {
      event.preventDefault(); // Предотвращаем стандартное действие кнопки

      // Получение данных пользователя из localStorage
      const userData = JSON.parse(localStorage.getItem("userData"));

      // Создание объекта subData
      const subData = {
        userId: userData.user.id, // Берем userId из userData
        plan: "MASTER",
      };

      // Вывод subData в консоль
      console.log("Данные подписки:", subData);

      // Отправка данных на сервер
      fetch("http://localhost:8080/api/ai/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subData), // Отправляем объект subData в формате JSON
      })
        .then((response) => {
          // Проверка статуса ответа
          if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
          }

          // Возвращаем данные в формате JSON
          return response.json();
        })
        .then((updatedUserData) => {
          // Обновление данных пользователя в localStorage новыми данными
          localStorage.setItem("userData", JSON.stringify(updatedUserData));
          alert("Подписка успешно оформлена!");
          window.location.href = "AI.html";
        })
        .catch((error) => {
          console.error("Ошибка при отправке запроса на сервер:", error);
          alert(
            "Произошла ошибка при отправке запроса на сервер. Попробуйте позже."
          );
        });
    });
});
