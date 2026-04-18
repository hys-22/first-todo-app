/*
input         入力欄
list          タスク一覧の箱（この中にliを入れる）
li            ひとつのタスクの本体(textの箱)
text          タスクの文字部分（liの中の一部）
deleteBtn     削除ボタン
doneBtn       完了ボタン
tasks         保存用の配列
task          1つのタスクデータ
localStorage  ブラウザの中の保存庫
editBtn       編集ボタン

*/

function addTask() {
  const input = document.getElementById("taskInput");
  const list = document.getElementById("taskList");

  if (input.value === "") return;

  const li = document.createElement("li");

  // テキスト部分（重要）
  const text = document.createElement("span");
  text.textContent = input.value;

  // 完了
  const doneBtn = document.createElement("button");
  doneBtn.textContent = "完了";
  doneBtn.onclick = function () {
    li.classList.toggle("done");
    saveTasks();
  };

  // 削除
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "×";
  deleteBtn.onclick = function () {
    li.remove();
    saveTasks();
  };


  //編集
  const editBtn = document.createElement("button");
  editBtn.textContent = "編集";

  editBtn.onclick = function () {
    const newInput = document.createElement("input");
    newInput.value = text.textContent;

    li.replaceChild(newInput,text);

    newInput.onkeydown = function (e) {
      if (e.key ==="Enter") {
        text.textContent = newInput.value;
        li.replaceChild(text,newInput);
        saveTasks();
      }
    };
  };

  //期限
  const dateInput = document.getElementById("dateInput");

  const date = document.createElement("small");
  date.textContent = dateInput.value;


  li.appendChild(text);
  li.appendChild(date);
  li.appendChild(deleteBtn);
  li.appendChild(doneBtn);
  li.appendChild(editBtn);

  list.appendChild(li);

  input.value = "";

  saveTasks();
  loadTasks();
  renderCalendar();
}

//保存
function saveTasks() {
  const list = document.getElementById("taskList");

  const tasks = [];

  list.querySelectorAll("li").forEach(li => {
    tasks.push({
      text: li.querySelector("span").textContent,
      date: li.querySelector("small").textContent,
      done: li.classList.contains("done")
    });
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

//読み込み
function loadTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];


  tasks.sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return a.date.localeCompare(b.date);
  });

  tasks.forEach(task => {
    const li = document.createElement("li");

    const date = document.createElement("small");
    date.textContent = task.date;

    const text = document.createElement("span");
    text.textContent = task.text;

    if (task.done) {
      li.classList.add("done");
    }

    const doneBtn = document.createElement("button");
    doneBtn.textContent = "完了";
    doneBtn.onclick = function () {
      li.classList.toggle("done");
      saveTasks();
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "×";
    deleteBtn.onclick = function () {
      li.remove();
      saveTasks();
    };

    const editBtn = document.createElement("button");
    editBtn.textContent = "編集";

    editBtn.onclick = function() {
      const newInput = document.createElement("input");
      newInput.value = text.textContent;

      li.replaceChild(newInput,text);

      newInput.onkeydown = function(e) {
        if(e.key === "Enter"){
          text.textContent = newInput.value;
          li.replaceChild(text,newInput);
          saveTasks();
        }
      };
    };

    li.appendChild(text);
    li.appendChild(date);
    li.appendChild(deleteBtn);
    li.appendChild(doneBtn);
    li.appendChild(editBtn);

    list.appendChild(li);
  });
}

//全部表示
function filterAll() {
  document.querySelectorAll("li").forEach(li => {
    li.style.display = "list-item";
  });
}

//完了だけ表示
function filterDone() {
  document.querySelectorAll("li").forEach(li => {
    if (li.classList.contains("done")){
      li.style.display = "list-item";
    }
    else{
      li.style.display = "none";
    }
  });
}

//未完了だけ表示
function filterUndone() {

  document.querySelectorAll("li").forEach(li => {
    li.style.display = "list-item";
  });

  document.querySelectorAll("li").forEach(li => {
    if (!li.classList.contains("done")){
      li.style.display = "list-item";
    }
    else{
      li.style.display = "none";
    }
  });
}


const input = document.getElementById("taskInput");

input.onkeydown = function (e) {
  if(e.key === "Enter") {
    addTask();
  }
};

let currentDate = new Date();

function renderCalendar() {

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const calendar = document.getElementById("calendar");
  calendar.innerHTML = "";

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  document.getElementById("monthLabel").textContent =
  `${year}年 ${month + 1}月`;

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate =new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    calendar.appendChild(document.createElement("div"));
  }

  for (let d = 1; d <= lastDate; d++) {
    const day = document.createElement("div");
    day.className = "day";

    const dateStr = `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;

    day.onclick = function() {
      document.getElementById("dateInput").value = dateStr;

      document.querySelectorAll(".day").forEach(d =>{
        d.style.border = "1px solid #ccc";
      });

      day.style.border = "2px solid blue";
    };
    
    const todayStr = new Date().toISOString().split("T")[0];

    if (dateStr === todayStr) {
     day.style.backgroundColor = "#ffeaa7";
    }

    //日付表示
    const title = document.createElement("div");
    title.textContent = d;
    day.appendChild(title);

    //タスク表示
    tasks.forEach(task => {
      if (task.date === dateStr) {
        const  p =document.createElement("div");
        p.textContent = task.text;
        day.appendChild(p);
      }
    });

    calendar.appendChild(day);
  }
}

function prevMonth(){
  currentDate.setMonth(currentDate.getMonth() -1);
  renderCalendar();
}

function nextMonth(){
  currentDate.setMonth(currentDate.getMonth() +1);
  renderCalendar();
}

loadTasks();
renderCalendar();