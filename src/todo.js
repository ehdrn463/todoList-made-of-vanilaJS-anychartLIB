const todo = document.querySelector(".todo"),
  todoList = document.querySelectorAll(".todo-list"),
  todoInput = todo.querySelector("input"),
  todoForm = todo.querySelector("form"),
  done = document.querySelector(".done"),
  doneList = done.querySelector("done-list"),
  playBtn = document.querySelector("content .play"),
  playBtnAll = document.querySelectorAll("button.play"),
  todayTime = document.querySelector(".today-time"),
  chartEl = document.querySelector("#todayRecord");

const TODO_LIST = "todo",
  DONE_LIST = "done";

let selTodos = {};
let selDones = {};
// 날짜: todos, dones
// 'dailyTodo'={'20210228': [{id:xxx, text: yyy, ongoing:false, ongoingTime: 1000, done: false}, {todo2}, {todo3}], '20210301':[{todo1}, {todo2}] }
// 'delayedTodo'={'20210228': [{id:xxx, text: yyy, ongoing:false, ongoingTime: 1000, done: false}, {todo2}, {todo3}], '20210301':[{todo1}, {todo2}] }

let selectedEl = document.querySelector(".selected");
let selDate = document.querySelector(".selected").classList[1];

const createSelObj = () => {
  let selDate = document.querySelector(".selected").classList[1];
  // 아무 것도 없으면 [] 빈거 만들어주기
  if (!selTodos[selDate]) {
    selTodos[selDate] = [];
  }
  if (!selDones[selDate]) {
    selDones[selDate] = [];
  }
  const id = String(Date.now());
  const text = todoInput.value;
  const newTodo = {
    id,
    text,
    ongoing: false,
    ongoingTime: 0,
  };
  selTodos[selDate].push(newTodo);
  todoForm.reset();
  saveList(TODO_LIST);
  saveList(DONE_LIST);
  return newTodo;
};

const loadList = () => {
  selTodos = JSON.parse(localStorage.getItem(TODO_LIST)) || [];
  selDones = JSON.parse(localStorage.getItem(DONE_LIST)) || [];
};

const saveList = (listName) => {
  listName === TODO_LIST
    ? localStorage.setItem(TODO_LIST, JSON.stringify(selTodos))
    : localStorage.setItem(DONE_LIST, JSON.stringify(selDones));
};

const recordTime = (e) => {
  localStorage.setItem(TODO_LIST, JSON.stringify(selTodos));
  let selDate = document.querySelector(".selected").classList[1];
  loadList();
  let timeEl = e.target.parentNode.querySelector(".timer");
  let liId = e.target.parentNode.id;
  let changeObjIdx = selTodos[selDate].findIndex((todo) => todo.id == liId);

  let totalMil = 0;
  selDones[selDate].forEach((done) => {
    totalMil += done.ongoingTime;
  });
  selTodos[selDate].forEach((todo) => {
    totalMil += todo.ongoingTime;
  });

  // 재생눌렀을때 타이머가 업데이트되어야 함
  if (!selTodos[selDate][changeObjIdx].ongoing) {
    selTodos[selDate][changeObjIdx].ongoing = true;
    e.target.innerHTML = "⏸";
    stopWatch = setInterval(function () {
      selTodos[selDate][changeObjIdx].ongoingTime += 1000;
      totalMil += 1000;
      let strTime = milSecToStrTime(
        selTodos[selDate][changeObjIdx].ongoingTime
      );
      timeEl.innerText = strTime;
      todayTime.textContent =
        selTodos[selDate] && selDones[selDate]
          ? milSecToStrTime(totalMil)
          : "00:00:00";
      saveList(TODO_LIST);
    }, 1000);
  } else {
    selTodos[selDate][changeObjIdx].ongoing = false;
    drawingChart();
    e.target.innerText = "▶";
    clearInterval(stopWatch);
    saveList(TODO_LIST);
  }
};

const deleteTodo = (e) => {
  let selDate = document.querySelector(".selected").classList[1];
  const li = e.target.parentNode;
  const id = e.target.parentNode.id;
  const liClassList = e.target.parentNode.classList;
  let type = liClassList.contains("todo-list") ? TODO_LIST : DONE_LIST;
  const ul = document.querySelector(`.${type}`);
  ul.removeChild(li);
  let selectedList = JSON.parse(localStorage.getItem(type))[selDate];
  let newList = selectedList.filter((list) => {
    return list.id != id;
  });
  let newObj = {};
  newObj[selDate] = newList;
  localStorage.setItem(type, JSON.stringify(newObj));
};

const updateTimer = () => {
  loadList();
  let selDate = document.querySelector(".selected").classList[1];
  let totalMil = 0;
  selTodos[selDate] &&
    selTodos[selDate].forEach((todo) => {
      totalMil += todo.ongoingTime;
      // addTodoUI(todo); // 왜 넣었는지 기억안남... 있으면 중복돼서 주석처리함
    });
  selTodos[selDate] &&
    selDones[selDate].forEach((done) => {
      totalMil += done.ongoingTime;
      // addDoneUI(done);
    });
  todayTime.textContent =
    selTodos[selDate] && selDones[selDate]
      ? milSecToStrTime(totalMil)
      : "00:00:00";
};

const addTodoUI = (todoObj) => {
  const newLi = document.createElement("li"),
    playBtn = document.createElement("button"),
    actionText = document.createElement("div"),
    timerText = document.createElement("div"),
    delBtn = document.createElement("button"),
    moveBtn = document.createElement("button");

  newLi.id = `${todoObj.id}`;
  newLi.className = "todo-list";
  playBtn.className = "play";
  playBtn.innerText = "▶";
  playBtn.addEventListener("click", recordTime);
  actionText.className = "action";
  actionText.innerText = `${todoObj.text}`;
  timerText.className = "timer";
  timerText.innerText = `${milSecToStrTime(todoObj.ongoingTime)}`;
  delBtn.className = "del-btn";
  delBtn.innerText = "❌";
  delBtn.addEventListener("click", deleteTodo);
  moveBtn.className = "move-btn";
  moveBtn.innerText = "✔";
  moveBtn.addEventListener("click", handleMove);
  newLi.appendChild(playBtn);
  newLi.appendChild(actionText);
  newLi.appendChild(timerText);
  newLi.appendChild(delBtn);
  newLi.appendChild(moveBtn);
  todo.appendChild(newLi);
};

const addDoneUI = (todoObj) => {
  const newLi = document.createElement("li"),
    goodBtn = document.createElement("button"),
    actionText = document.createElement("div"),
    timerText = document.createElement("timer"),
    delBtn = document.createElement("button"),
    moveBtn = document.createElement("button");

  newLi.id = `${todoObj.id}`;
  newLi.className = "done-list";
  goodBtn.className = "good";
  goodBtn.innerText = "👍";
  actionText.className = "action";
  actionText.innerText = `${todoObj.text}`;
  timerText.className = "timer";
  timerText.innerText = `${milSecToStrTime(todoObj.ongoingTime)}`;
  delBtn.className = "del-btn";
  delBtn.innerText = "❌";
  delBtn.addEventListener("click", deleteTodo);
  moveBtn.className = "move-btn";
  moveBtn.innerText = "⏪";
  moveBtn.addEventListener("click", handleMove);

  newLi.appendChild(goodBtn);
  newLi.appendChild(actionText);
  newLi.appendChild(timerText);
  newLi.appendChild(delBtn);
  newLi.appendChild(moveBtn);
  done.appendChild(newLi);
};

const fetchLiDom = (strDate) => {
  selTodos[strDate] &&
    selTodos[strDate].forEach((e) => {
      addTodoUI(e);
    });
  selDones[strDate] &&
    selDones[strDate].forEach((e) => {
      addDoneUI(e);
    });
};

const clearLiDom = () => {
  let todoList = document.querySelectorAll(".todo-list"),
    doneList = document.querySelectorAll(".done-list");

  todoList &&
    todoList.forEach((e) => {
      e.parentNode.removeChild(e);
    });
  doneList &&
    doneList.forEach((e) => {
      e.parentNode.removeChild(e);
    });
};

const milSecToStrTime = (milSec) => {
  let hour = Math.floor((milSec / (1000 * 60 * 6)) % 24);
  let min = Math.floor((milSec / (1000 * 60)) % 60);
  let sec = Math.floor((milSec / 1000) % 60);
  let strTime = `${hour < 10 ? "0" + hour : hour}:${
    min < 10 ? "0" + min : min
  }:${sec < 10 ? "0" + sec : sec}`;
  return strTime;
};

const handleSubmit = (e) => {
  e.preventDefault();
  let newTodoObj = createSelObj();
  addTodoUI(newTodoObj);
};

const handleMove = (e) => {
  loadList();
  let selDate = document.querySelector(".selected").classList[1];
  const li = e.target.parentNode;
  const liId = e.target.parentNode.id;
  const liClassList = e.target.parentNode.classList;

  if (liClassList.contains("todo-list")) {
    todo.removeChild(li);
    let same = selTodos[selDate].filter((todo) => todo.id != liId);
    let changeObj = selTodos[selDate].filter((todo) => todo.id == liId);
    selTodos[selDate] = same;
    addDoneUI(...changeObj);
    selDones[selDate].push(...changeObj);
  } else {
    done.removeChild(li);
    let same = selDones[selDate].filter((done) => done.id != liId);
    let changeObj = selDones[selDate].filter((done) => done.id == liId);
    selDones[selDate] = same;
    addTodoUI(...changeObj);
    selTodos[selDate].push(...changeObj);
  }
  saveList(TODO_LIST);
  saveList(DONE_LIST);
};

const drawingChart = () => {
  loadList();
  if (chartEl.hasChildNodes()) chartEl.removeChild(chartEl.firstChild);

  let selDate = document.querySelector(".selected").classList[1];
  // 둘다 비었으면 종료
  if (!(selTodos[selDate] || selDones[selDate])) return;
  // 비었으면 빈배열 만들어줌.
  if (!selTodos[selDate]) selTodos[selDate] = [];
  if (!selDones[selDate]) selDones[selDate] = [];

  selTodos[selDate] &&
    selTodos[selDate].forEach((todo) => {
      todo.x = todo.text;
      todo.value = todo.ongoingTime / 1000;
    });

  selTodos[selDate] &&
    selDones[selDate].forEach((done) => {
      done.x = done.text;
      done.value = done.ongoingTime / 1000;
    });

  anychart.onDocumentReady(function () {
    let data2 = selTodos[selDate].concat(selDones[selDate]);
    let chart = anychart.pie();
    // chart.title("오늘의 기록");
    chart.data(data2);
    chart.container("todayRecord");
    chart.draw();
    chart.background().fill("rgba(255, 255, 255, 0.025");
  });
  saveList(TODO_LIST);
  saveList(DONE_LIST);
};

const updateChart = () => {};

const initTodo = () => {
  updateTimer();
  drawingChart();
  todoForm.addEventListener("submit", handleSubmit);
  // playBtnAll.forEach((play) => {
  //   play.addEventListener("click", drawingChart);
  //   console.log("1");
  // });
};

initTodo();
