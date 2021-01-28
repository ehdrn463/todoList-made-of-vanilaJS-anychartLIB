const currTime = document.querySelector(".curr-time");

const getCurrTime = function () {
  const clock = new Date();
  const hour = clock.getHours();
  const min = clock.getMinutes();
  const sec = clock.getSeconds();
  currTime.textContent = `${hour >= 10 ? hour : "0" + hour}:${
    min >= 10 ? min : "0" + min
  }:${sec >= 10 ? sec : "0" + sec}`;
};

const initClock = () => {
  getCurrTime();
  setInterval(getCurrTime, 1000);
};

initClock();
