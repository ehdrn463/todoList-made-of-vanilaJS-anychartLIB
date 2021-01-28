const todo = document.querySelector(".todo"),
  todoList = document.querySelectorAll(".todo-list"),
  todoInput = todo.querySelector("input"),
  todoForm = todo.querySelector("form"),
  done = document.querySelector(".done"),
  doneList = done.querySelector("done-list"),
  playBtn = document.querySelector("content .play"),
  playBtnAll = document.querySelectorAll("button.play"),
  todayTime = document.querySelector(".today-time");

const TODO_LIST = "todo",
  DONE_LIST = "done";

let todos = [];
let dones = [];

const milSecToStrTime = function (milSec) {
  let hour = Math.floor((milSec / (1000 * 60 * 6)) % 24);
  let min = Math.floor((milSec / (1000 * 60)) % 60);
  let sec = Math.floor((milSec / 1000) % 60);

  let strTime = `${hour < 10 ? "0" + hour : hour}:${
    min < 10 ? "0" + min : min
  }:${sec < 10 ? "0" + sec : sec}`;
  return strTime;
};

const recordTime = function (e) {
  todos = JSON.parse(localStorage.getItem(TODO_LIST)) || [];
  dones = JSON.parse(localStorage.getItem(DONE_LIST)) || [];
  let timeEl = e.target.parentNode.querySelector(".timer");
  let liId = e.target.parentNode.id;
  let changeObjIdx = todos.findIndex((todo) => todo.id == liId);

  let totalMil = 0;
  dones.forEach((done) => {
    totalMil += done.ongoingTime;
  });
  todos.forEach((todo) => {
    totalMil += todo.ongoingTime;
  });

  // 재생눌렀을때 타이머가 업데이트되어야 함
  if (!todos[changeObjIdx].ongoing) {
    todos[changeObjIdx].ongoing = true;
    e.target.innerHTML = "⏸";
    stopWatch = setInterval(function () {
      todos[changeObjIdx].ongoingTime += 1000;
      totalMil += 1000;
      let strTime = milSecToStrTime(todos[changeObjIdx].ongoingTime);
      timeEl.innerText = strTime;
      todayTime.textContent =
        todos && dones ? milSecToStrTime(totalMil) : "00:00:00";
      localStorage.setItem(TODO_LIST, JSON.stringify(todos));
    }, 1000);
  } else {
    todos[changeObjIdx].ongoing = false;
    e.target.innerText = "▶";
    clearInterval(stopWatch);
    localStorage.setItem(TODO_LIST, JSON.stringify(todos));
  }
  // localStorage.setItem(TODO_LIST, JSON.stringify(todos));
};

const createTodo = function () {
  const id = String(Date.now());
  const text = todoInput.value;
  const newTodo = {
    id,
    text,
    ongoing: false,
    ongoingTime: 0,
  };
  todos.push(newTodo);
  localStorage.setItem(TODO_LIST, JSON.stringify(todos));
  todoForm.reset();
  return newTodo;
};

const deleteTodo = function (e) {
  const li = e.target.parentNode;
  const id = e.target.parentNode.id;
  const liClassList = e.target.parentNode.classList;
  let type = liClassList.contains("todo-list") ? TODO_LIST : DONE_LIST;
  const ul = document.querySelector(`.${type}`);
  ul.removeChild(li);

  let selectedList = JSON.parse(localStorage.getItem(type));
  const newList = selectedList.filter((list) => {
    return list.id != id;
  });
  localStorage.setItem(type, JSON.stringify(newList));
};

const loadTodo = function () {
  todos = JSON.parse(localStorage.getItem(TODO_LIST)) || [];
  dones = JSON.parse(localStorage.getItem(DONE_LIST)) || [];
  let totalMil = 0;
  todos.forEach((todo) => {
    totalMil += todo.ongoingTime;
    addTodoUI(todo);
  });
  dones.forEach((done) => {
    totalMil += done.ongoingTime;
    addDoneUI(done);
  });
  todayTime.textContent =
    todos && dones ? milSecToStrTime(totalMil) : "00:00:00";
};

const addTodoUI = function (todoObj) {
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

const addDoneUI = function (todoObj) {
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

const handleSubmit = function (e) {
  e.preventDefault();
  let newTodoObj = createTodo();
  addTodoUI(newTodoObj);
};

const handleMove = function (e) {
  todos = JSON.parse(localStorage.getItem(TODO_LIST)) || [];
  dones = JSON.parse(localStorage.getItem(DONE_LIST)) || [];

  const li = e.target.parentNode;
  const liId = e.target.parentNode.id;
  const liClassList = e.target.parentNode.classList;

  if (liClassList.contains("todo-list")) {
    todo.removeChild(li);

    // done.appendChild(li);
    let same = todos.filter((todo) => todo.id != liId);
    let changeObj = todos.filter((todo) => todo.id == liId);
    todos = same;
    addDoneUI(...changeObj);
    dones.push(...changeObj);
  } else {
    done.removeChild(li);

    let same = dones.filter((done) => done.id != liId);
    let changeObj = dones.filter((done) => done.id == liId);
    dones = same;
    addTodoUI(...changeObj);
    todos.push(...changeObj);
  }
  localStorage.setItem(TODO_LIST, JSON.stringify(todos));
  localStorage.setItem(DONE_LIST, JSON.stringify(dones));
};

const drawingChart = function () {
  todos = JSON.parse(localStorage.getItem(TODO_LIST)) || [];
  dones = JSON.parse(localStorage.getItem(DONE_LIST)) || [];

  todos.forEach((todo) => {
    todo.x = todo.text;
    todo.value = todo.ongoingTime / 1000;
  });
  dones.forEach((done) => {
    done.x = done.text;
    done.value = done.ongoingTime / 1000;
  });

  anychart.onDocumentReady(function () {
    let data2 = todos.concat(dones);
    let chart = anychart.pie();
    // chart.title("오늘의 기록");
    chart.data(data2);
    chart.container("todayRecord");
    chart.draw();
    chart.background().fill("rgba(255, 255, 255, 0.025");
  });
  localStorage.setItem(TODO_LIST, JSON.stringify(todos));
  localStorage.setItem(DONE_LIST, JSON.stringify(dones));
};

loadTodo();
drawingChart();
todoForm.addEventListener("submit", handleSubmit);

playBtnAll.forEach((play) => {
  play.addEventListener("click", drawingChart);
});
// setInterval(accTime, 1000);
