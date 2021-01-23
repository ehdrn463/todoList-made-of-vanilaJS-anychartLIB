/* 필요한 기능
0120: 스톱워치 (공부시간 체크) - setInertval clearInterval 조사
0121: 스톱워치 (휴식시간 체크)
*/

const todo = document.querySelector(".todo"),
  todoList = todo.querySelector("todo-list"),
  todoInput = todo.querySelector("input"),
  todoForm = todo.querySelector("form"),
  done = document.querySelector(".done"),
  doneList = done.querySelector("done-list"),
  playBtn = document.querySelector("content .play");

const TODO_LIST = "todo",
  DONE_LIST = "done";

let todos = [];
let dones = [];

const calcTime = function (start, position) {
  let nowTime = String(Date.now());
  let distance = nowTime - start;
  // 시간 = (60 * 60 * 24 * 1000)
  let hour = Math.floor((distance % (60 * 60 * 1000 * 24)) / (1000 * 60 * 60));
  let min = Math.floor((distance % (60 * 60 * 1000)) / (1000 * 60));
  let sec = Math.floor((distance % (1000 * 60)) / 1000);
  let remainder = `${hour < 10 ? "0" + hour : hour}:${
    min < 10 ? "0" + min : min
  }:${sec < 10 ? "0" + sec : sec}`;
  // console.log(position, remainder);
  // console.log(position);
  position.innerText = remainder;
  return remainder;
};

const recordTime = function (e) {
  todos = JSON.parse(localStorage.getItem(TODO_LIST)) || [];
  dones = JSON.parse(localStorage.getItem(DONE_LIST)) || [];
  let timeEl = e.target.parentNode.querySelector(".timer");
  let liId = e.target.parentNode.id;
  let changeObjIdx = todos.findIndex((todo) => todo.id == liId);
  let changeObj = todos.filter((todo) => todo.id == liId)[0];
  let clickTime = String(Date.now());
  // 재생눌렀을때
  // 타이머가 업데이트되어야 함
  if (!todos[changeObjIdx].ongoing) {
    todos[changeObjIdx].ongoing = true;
    e.target.innerText = "⏸";
    stopWatch = setInterval(function () {
      let ongoingTime = calcTime(clickTime, timeEl);
      todos[changeObjIdx].ongoingTime += ongoingTime;
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
    ongoingTime: "00:00:00",
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

  todos.forEach((todo) => addTodoUI(todo));
  dones.forEach((done) => addDoneUI(done));
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
  timerText.innerText = `${todoObj.ongoingTime}`;
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
  timerText.innerText = `${todoObj.ongoingTime}`;
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

const progressCal = function () {
  todos = JSON.parse(localStorage.getItem(TODO_LIST)) || [];
  dones = JSON.parse(localStorage.getItem(DONE_LIST)) || [];

  todos.forEach((todo) => {
    todo.x = todo.text;
    todo.value += strTosec(todo.ongoingTime);
  });
  dones.forEach((done) => {
    done.x = done.text;
    done.value += strTosec(done.ongoingTime);
  });

  anychart.onDocumentReady(function () {
    let data2 = todos.concat(dones);
    let chart = anychart.pie();
    chart.title("오늘의 기록");
    chart.data(data2);
    chart.container("todayRecord");
    chart.draw();
  });
  localStorage.setItem(TODO_LIST, JSON.stringify(todos));
  localStorage.setItem(DONE_LIST, JSON.stringify(dones));
};

const strTosec = function (strTime) {
  // '00:00:00'
  const divTime = strTime.split(":");
  let hour = parseInt(divTime[0]);
  let min = parseInt(divTime[1]);
  let sec = parseInt(divTime[2]);
  let totalSec = sec + min * 60 + hour * 3600;
  return totalSec;
};

loadTodo();
todoForm.addEventListener("submit", handleSubmit);
progressCal();
