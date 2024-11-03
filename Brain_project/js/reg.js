const regFormData = {
  name: "",
  surname: "",
  mail: "",
  password: "",
};
function validate(event) {
  let valid = true;
  //проверка имени
  const nameField = document.getElementById("name");
  if (!nameField.value || nameField.value.length < 1) {
    alert("Имя пользователя должно иметь хотя бы одну букву!");
    valid = false;
  } else {
    regFormData.name = nameField.value;
  }
  //проверка фамилии
  const lnameField = document.getElementById("surname");
  if (!lnameField.value || lnameField.value.length < 1) {
    alert("Фамилия пользователя должна иметь хотя бы одну букву!");
    valid = false;
  } else {
    regFormData.surname = lnameField.value;
  }
  //проверка емейла
  const mailField = document.getElementById("mail");
  const re =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  if (!mailField.value || !re.test(String(mailField.value).toLowerCase())) {
    alert("Email не заполнен или некорректен!");
    valid = false;
  } else {
    regFormData.mail = mailField.value;
  }
  //проверка пароля
  const passwordField = document.getElementById("password");
  if (!passwordField.value || passwordField.value.length < 8) {
    alert("Пароль должен иметь не менее 8 символов!");
    valid = false;
  } else {
    regFormData.password = passwordField.value;
  }
  //сохранение в localStorage
  //localStorage.setItem("regFormData", JSON.stringify(regFormData));

  if (false === valid) {
    event.preventDefault();
  }
  return valid;
}
// async function post(event) {
//   event.preventDefault(); // Предотвращаем отправку формы по умолчанию

//   try {
//     const response = await fetch("http://localhost:8080/api/auth/register", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json;charset=utf-8",
//       },
//       body: JSON.stringify(regFormData),
//     });

//     if (response.ok) {
//       const result = await response.json();
//       alert(result.message);
//     } else {
//       throw new Error("Ошибка HTTP: " + response.status);
//     }
//   } catch (error) {
//     console.error("Ошибка при отправке данных на сервер:", error);
//     // Дополнительные действия в случае ошибки
//     alert(
//       "Ошибка при отправке данных на сервер. Пожалуйста, повторите попытку позже."
//     );
//   }
// }

// const myForm = document.getElementById("regform");
// myForm.addEventListener("submit", post);

// let result = await response.json();
// alert(result.message);
// const myForm = document.getElementById("regform");
// myForm.addEventListener("submit", validate);
async function post(event) {
  event.preventDefault(); // Предотвращаем отправку формы по умолчанию

  try {
    const response = await fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(regFormData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(result); // Выводим ответ сервера в консоль
      // Получение значения по ключу
      const value = result.status;
      alert(value); // Выведет значение свойства "status" из объекта "key" в JSON-ответе
      window.location.href = "http://127.0.0.1:5500/html/autorization.html";
    } else {
      throw new Error("Ошибка HTTP: " + response.status);
    }
  } catch (error) {
    console.error("Ошибка при отправке данных на сервер:", error);
    // Дополнительные действия в случае ошибки
    alert(
      "Ошибка при отправке данных на сервер. Пожалуйста, повторите попытку позже."
    );
  }
}

const myForm = document.getElementById("regform");

myForm.addEventListener("submit", function (event) {
  if (validate(event)) {
    post(event);
  } else {
    event.preventDefault();
  }
});
