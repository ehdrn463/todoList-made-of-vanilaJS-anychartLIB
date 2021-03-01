const body = document.querySelector("body");

const paintImage = () => {
  const img = new Image();
  let clock = new Date();
  let hour = clock.getHours();
  img.className = "bg-light";

  if (hour >= 6 && hour < 11) {
    img.src = "./imgs/morning.jpg";
  }
  if (hour >= 11 && hour < 19) {
    img.src = "./imgs/afternoon.jpg";
  }
  if (hour >= 19 || hour < 1) {
    img.src = "./imgs/night.jpg";
  }
  if (hour >= 1 && hour < 6) {
    img.src = `./imgs/dawn.jpg`;
  }

  img.classList.add("bgImage");
  body.prepend(img);
  return true;
};

// 1시간마다 반복
// 한시간
// const updateInterval = 1000 * 60 * 60;

// const updateBackground = () => {
//   setTimeout(paintImage, updateInterval);
// };

const bgInit = () => {
  paintImage();
};

bgInit();
