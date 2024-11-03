// const logFormData = {
//   email: "",
//   password: "",
// };

// function validate(event) {
//   let valid = true;
//   //проверка емейла
//   const emailField = document.getElementById("email");
//   const re =
//     /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
//   if (!emailField.value || !re.test(String(emailField.value).toLowerCase())) {
//     alert("Email не заполнен или некорректен!");
//     valid = false;
//   } else {
//     logFormData.email = emailField.value;
//   }
//   //проверка пароля
//   const passwordField = document.getElementById("password");
//   if (!passwordField.value || passwordField.value.length < 8) {
//     alert("Пароль должен иметь не менее 8 символов!");
//     valid = false;
//   } else {
//     logFormData.password = passwordField.value;
//   }
//   //сохранение в localStorage
//   localStorage.setItem("logFormData", JSON.stringify(logFormData));

//   if (false === valid) {
//     event.preventDefault();
//   }
//   return valid;
// }
// const myForm2 = document.getElementById("logform");
// myForm2.addEventListener("submit", validate);
const logFormData = {
  mail: "",
  password: "",
};

async function postLoginData(formData) {
  try {
    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("userData", JSON.stringify(data));
      // Перенаправляем на страницу AI только если localStorage не пуст
      if (localStorage.getItem("userData")) {
        window.location.href = "http://127.0.0.1:5500/html/AI.html";
      }
    } else {
      throw new Error("Ошибка HTTP: " + response.status);
    }
  } catch (error) {
    console.error("Ошибка при отправке данных на сервер:", error);
    // Дополнительные действия в случае ошибки
    alert("Ошибка при входе. Пожалуйста, повторите попытку.");
  }
}

function validate(event) {
  event.preventDefault(); // Предотвращаем отправку формы по умолчанию

  // Получаем данные формы
  const mailField = document.getElementById("mail");
  const passwordField = document.getElementById("password");

  // Валидация email
  const re =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  if (!mailField.value || !re.test(String(mailField.value).toLowerCase())) {
    alert("Email не заполнен или некорректен!");
    return;
  }
  logFormData.mail = mailField.value;

  // Валидация пароля
  if (!passwordField.value || passwordField.value.length < 8) {
    alert("Пароль должен иметь не менее 8 символов!");
    return;
  }
  logFormData.password = passwordField.value;

  // Сохраняем данные в localStorage
  //localStorage.setItem("logFormData", JSON.stringify(logFormData));

  // Отправляем данные на бэкенд
  postLoginData(logFormData);
}

const myForm2 = document.getElementById("logform");
myForm2.addEventListener("submit", validate);
