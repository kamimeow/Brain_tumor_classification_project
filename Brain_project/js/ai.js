var dt = new DataTransfer();

$(".input-file input[type=file]").on("change", function () {
  let $files_list = $(this).closest(".input-file").next();
  $files_list.empty();

  for (var i = 0; i < this.files.length; i++) {
    let file = this.files.item(i);
    dt.items.add(file);

    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
      let new_file_input =
        '<div class="input-file-list-item">' +
        '<img class="input-file-list-img" src="' +
        reader.result +
        '">' +
        '<span class="input-file-list-name">' +
        file.name +
        "</span>" +
        '<a href="#" onclick="removeFilesItem(this); return false;" class="input-file-list-remove">x</a>' +
        "</div>" +
        '<a href="" id="Button1" class="f-button-1">Готово</a>';
      $files_list.append(new_file_input);
    };
  }
  this.files = dt.files;
});
// Обработчик события клика на ссылку "Готово"
$(document).on("click", "#Button1", function (event) {
  event.preventDefault(); // Предотвращаем стандартное действие ссылки
  $("#Button1").hide();
  const pleaseWaitText = $('<p class="pleaseWait">Пожалуйста, ожидайте.</p>');

  // Заменяем кнопку на текст "Пожалуйста, ожидайте"
  $("#Button1").replaceWith(pleaseWaitText);
  // Получение данных пользователя из localStorage
  const userData = JSON.parse(localStorage.getItem("userData"));
  console.log(userData.user.id);
  // Создание FormData из объекта DataTransfer
  const formData = new FormData();
  for (let i = 0; i < dt.items.length; i++) {
    formData.append("image", dt.items[i].getAsFile());
  }
  formData.append("id", userData.user.id);

  console.log(formData);
  // Получение текущей истории диагнозов из localStorage
  let diagnosisHistory =
    JSON.parse(localStorage.getItem("diagnosisHistory")) || [];
  // Отправка данных на сервер
  fetch("http://localhost:8080/api/ai/predict", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      // Проверка статуса ответа
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      // Возвращаем данные в формате JSON
      return response.json();
    })

    .then((data) => {
      console.log(data);
      // // Добавление нового диагноза в историю
      diagnosisHistory.push(data.result);
      // // Сохранение обновленной истории диагнозов в localStorage
      localStorage.setItem(
        "diagnosisHistory",
        JSON.stringify(diagnosisHistory)
      );
      // Удаление прошлых данных userData из localStorage
      //localStorage.removeItem("userData");
      // Сохранение новых данных userData в localStorage
      localStorage.setItem("userData", JSON.stringify(data.user));
      // Сохранение полученного диагноза в localStorage
      localStorage.setItem("diagnosis", JSON.stringify(data.result));
      window.location.href = "AI2.html";
    })
    .catch((error) => {
      console.error("Ошибка при отправке запроса на сервер:", error);
      alert(
        "Произошла ошибка при отправке запроса на сервер. Попробуйте позже."
      );
    });
});

function removeFilesItem(target) {
  let name = $(target).prev().text();
  let input = $(target).closest(".input-file-row").find("input[type=file]");
  $(target).closest(".input-file-list-item").remove();
  // Скрываем кнопку "Готово"
  $("#Button1").hide();
  for (let i = 0; i < dt.items.length; i++) {
    if (name === dt.items[i].getAsFile().name) {
      dt.items.remove(i);
    }
  }
  input[0].files = dt.files;
}

document.addEventListener("DOMContentLoaded", function () {
  const userData = JSON.parse(localStorage.getItem("userData"));

  if (userData) {
    console.log(userData.user.freeAttempts);
    document.getElementById("attempts").textContent =
      userData.user.freeAttempts || "";
    if (userData.user.status !== "FREE") {
      document.getElementById("sub2").style.display = "none";
      document.getElementById("sub3").style.display = "none"; // Скрываем параграф о подписке
    } else {
      document.getElementById("sub2").style.display = "block";
      document.getElementById("sub3").style.display = "block"; // Показываем параграф о подписке
    }
  }
});
