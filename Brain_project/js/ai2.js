document.addEventListener("DOMContentLoaded", function () {
  const diagnosis = JSON.parse(localStorage.getItem("diagnosis"));

  if (diagnosis.result) {
    document.getElementById("diag").textContent = diagnosis.result || "";
  }
});
