const yearMonthEl = document.querySelector(".year-month");
const calDateEl = document.querySelector(".cal-date");
const preBtn = document.querySelector(".pre-btn");
const nextBtn = document.querySelector(".next-btn");

let currDate = new Date();

/*
1. 현재 달 달력 표시
2. 이전 달 달력 표시
3. 다음 달 달력 표시
4. 특정 날짜 클릭 -> 배열 리턴
*/

// '20200101' -> date 객체
const strToDate = (str) => {
  let yy = str.substr(0, 4);
  let mm = str.substr(4, 2) - 1;
  let dd = str.substr(6, 2);
  return new Date(yy, mm, dd);
};

// date 객체 -> '20200101'
const dateToStr = (date) => {
  let mm = date.getMonth() + 1;
  let dd = date.getDate();
  return [
    date.getFullYear(),
    (mm > 9 ? "" : "0") + mm,
    (dd > 9 ? "" : "0") + dd,
  ].join("");
};

// '20200101' -> 1 (월요이리)
const strToDay = (str) => {
  const y = str.substr(0, 4);
  const m = str.substr(4, 2);
  const d = str.substr(6, 2);
  const date = new Date(y, m - 1, d);
  const day = date.getDay();
  return day;
};

const checkNumWeeks = (first, last) => {
  return first > 4 && first - last > 4 ? 6 : 5;
};

const buildCalendar = () => {
  const currMonthFirstDate = new Date(
    currDate.getFullYear(),
    currDate.getMonth(),
    1
  );
  const currMonthLastDay = new Date(
    currDate.getFullYear(),
    currDate.getMonth() + 1,
    0
  );

  // 현재 '연도-월' 표시
  const currYear = currMonthFirstDate.getFullYear();
  const currMonth = currMonthFirstDate.getMonth() + 1;
  const currYearEl = yearMonthEl.querySelector(".year");
  const currMonthEl = yearMonthEl.querySelector(".month");
  const currFirstDay = currMonthFirstDate.getDay();
  const currLastDay = currMonthLastDay.getDay();
  currYearEl.innerHTML = currYear;
  currMonthEl.innerHTML = currMonth;

  // 현재 '날짜 표시'
  // 1일 요일 맞춰주기

  for (let temp = 0; temp < currFirstDay; temp++) {
    let newDateEl = document.createElement("div");
    newDateEl.className = "date";
    calDateEl.appendChild(newDateEl);
  }

  for (let date = 1; date <= currMonthLastDay.getDate(); date++) {
    let newDateEl = document.createElement("div");
    newDateEl.className = "date";
    let year = String(currDate.getFullYear());
    let month =
      currDate.getMonth() + 1 < 10
        ? "0" + String(currDate.getMonth() + 1)
        : String(currDate.getMonth() + 1);
    let dd = date < 10 ? "0" + String(date) : String(date);

    let strDate = year + month + dd;
    newDateEl.classList.add(strDate);
    let day = strToDay(strDate);
    if (day == 0) newDateEl.classList.add("sun");
    if (day == 6) newDateEl.classList.add("sat");

    newDateEl.innerHTML = date;
    calDateEl.appendChild(newDateEl);
  }

  // 남은 빈칸 채워주기
  let numWeeks = checkNumWeeks(currFirstDay, currLastDay);
  for (
    let temp = document.querySelectorAll(".date").length;
    temp < numWeeks * 7;
    temp++
  ) {
    let newDateEl = document.createElement("div");
    newDateEl.className = "date";
    calDateEl.appendChild(newDateEl);
  }
};

const delCalendar = () => {
  const dateAllEl = document.querySelectorAll(".date");
  dateAllEl.forEach((el) => {
    calDateEl.removeChild(el);
  });
};

const moveCalendar = () => {
  preBtn.addEventListener("click", handleMoveCalendar);
  nextBtn.addEventListener("click", handleMoveCalendar);
};

const handleMoveCalendar = (e) => {
  unselectCalDate();
  delCalendar();
  const type = e.target.className;
  if (type == "pre-btn") {
    currDate = new Date(currDate.getFullYear(), currDate.getMonth() - 1, 1);
  }
  if (type == "next-btn") {
    currDate = new Date(currDate.getFullYear(), currDate.getMonth() + 1, 1);
  }
  buildCalendar(currDate);
};

const selectCalDate = () => {
  let dateEl = document.getElementsByClassName(`${dateToStr(currDate)}`)[0];
  dateEl.classList.add("selected");
};

const unselectCalDate = () => {
  let dateEl = document.getElementsByClassName(`${dateToStr(currDate)}`)[0];
  dateEl.classList.remove("selected");
  clearLiDom();
};

const handleClickDate = (e) => {
  let strDate = e.target.classList[1];
  unselectCalDate();
  currDate = strToDate(strDate);
  selectCalDate();
  fetchLiDom(strDate);
  drawingChart();
  updateTimer();
};

const clickDate = () => {
  calDateEl.addEventListener("click", handleClickDate);
};

buildCalendar(currDate);
moveCalendar();
selectCalDate();

clickDate();
