const userName = document.querySelector(".user-name"),
  userNameForm = document.querySelector(".user-name-form"),
  userNameInput = document.querySelector(".user-name-input");

const USER_NAME = "currentUser",
  DISPLAY_UN = "hiding";

const saveName = (name) => {
  localStorage.setItem(USER_NAME, name);
};

const handleSubmitName = function (e) {
  e.preventDefault();
  saveName(userNameInput.value);
  userNameInput.value = "";
  loadName();
};

const loadName = function () {
  const currUserName = localStorage.getItem(USER_NAME);

  if (currUserName) {
    userNameForm.classList.add(DISPLAY_UN);
    userName.innerHTML = currUserName + "의 오늘의 공부";
  } else {
    userNameForm.classList.remove(DISPLAY_UN);
  }
};

const initGreeting = () => {
  loadName();
  userNameForm.addEventListener("submit", handleSubmitName);
};

initGreeting();
