const input = document.querySelector('.form-input');
const form = document.querySelector('form');
const ul = document.querySelector('.todo-list');
const checkbox = document.querySelector('.checkbox');
const deleteBtn = document.querySelector('.delete-btn');
const tagUl = document.querySelector('.tag-list');
const tagNav = document.querySelector('.tag-nav-list');
const tagName = document.querySelector('.tag-name');

//EventListner

//初期データをLocalStorageから取得してDOMに表示
document.addEventListener('DOMContentLoaded', getTodosLS);
document.addEventListener('DOMContentLoaded', getTagsLS);

//todo formのsubmit event
form.addEventListener('submit', addTodoLS);

// 改行を防止
ul.addEventListener('keydown', function (e) {
  if (e.keyCode === 13) {
    e.preventDefault();
  }
});

///////todo functions /////////////

//LocalStorageからtodosを取得してDOMに表示
function getTodosLS() {
  let todos;
  localStorage.getItem('todos')
    ? (todos = JSON.parse(localStorage.getItem('todos')))
    : (todos = []);
  createTodos(todos);
}

// LocalStorageにtodosを保存
function addTodoLS(e) {
  e.preventDefault();
  if (input.value === '') {
    return;
  }
  const tags = selectTags();
  const todo = {
    id: new Date().getTime(),
    text: input.value,
    completed: false,
    tags: tags,
  };
  let todos;
  localStorage.getItem('todos')
    ? (todos = JSON.parse(localStorage.getItem('todos')))
    : (todos = []);
  todos = [...todos, todo];
  localStorage.setItem('todos', JSON.stringify(todos));
  input.value = '';
  createTodos(todos);
}

//todoのelementを作成してDOMに追加

function createTodos(todos) {
  if (!todos) return;
  const df = document.createDocumentFragment();
  todos.forEach((todo) => {
    const todoLi = document.createElement('li');
    todoLi.classList.add('todo-item');
    todoLi.setAttribute('id', todo.id);

    df.appendChild(todoLi);

    const checkboxSpan = document.createElement('span');
    checkboxSpan.classList.add('checkbox-span');

    const checkbox = document.createElement('input');
    checkbox.classList.add('checkbox');
    checkbox.setAttribute('type', 'checkbox');

    checkbox.addEventListener('click', function () {
      toggleCompletedLS(todo.id);
    });
    checkboxSpan.appendChild(checkbox);
    todoLi.appendChild(checkboxSpan);

    const textSpan = document.createElement('span');
    textSpan.classList.add('text-span');

    const editText = document.createElement('input');
    editText.classList.add('editText');
    editText.setAttribute('type', 'text');
    editText.setAttribute('value', todo.text);
    editText.addEventListener('blur', function (e) {
      updateTodoLS(e, todo.id);
    });
    editText.addEventListener('focus', function (e) {
      getCurrentTodo(e);
    });
    textSpan.appendChild(editText);
    todoLi.appendChild(textSpan);

    if (todo.completed == true) {
      checkbox.classList.add('completed');
      editText.classList.add('completed');
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    deleteBtn.addEventListener('click', function () {
      deleteTodoLS(todo.id);
    });
    todoLi.appendChild(deleteBtn);
  });
  ul.replaceChildren(df);
}

// toggle　完了

function toggleCompletedLS(id) {
  const todos = JSON.parse(localStorage.getItem('todos'));
  todos.forEach((todo) => {
    if (todo.id == id) {
      todo.completed = !todo.completed;
    }
  });
  localStorage.setItem('todos', JSON.stringify(todos));
  createTodos(todos);
}

//todoをクリックしたときに現在のtodoを取得
let currenTodo;
function getCurrentTodo(e) {
  currenTodo = e.target.value;
}

// 編集したtodoをLocalStorageに保存して、todoを更新
function updateTodoLS(e, id) {
  if (currenTodo === e.target.value) {
    return;
  } else {
    const todos = JSON.parse(localStorage.getItem('todos'));
    todos.forEach((todo) => {
      if (todo.id == id) {
        todo.text = e.target.value;
      }
    });
    localStorage.setItem('todos', JSON.stringify(todos));
    createTodos(todos);
  }
}

//LocalStorageからtodoを削除して新しいtodoを作る
function deleteTodoLS(id) {
  const todos = JSON.parse(localStorage.getItem('todos'));
  todos.forEach((todo) => {
    if (todo.id == id) {
      todos.splice(todos.indexOf(todo), 1);
    }
  });
  localStorage.setItem('todos', JSON.stringify(todos));
  createTodos(todos);
}

function filterTodo(e) {
  const todos = JSON.parse(localStorage.getItem('todos'));
  const filteredTodos = todos.filter((todo) => {
    return todo.tag == e.target.value;
  });
  createTodos(filteredTodos);
}

//////////////Tag functions///////////

//LocalStorageからtagsを取得してDOMに表示
function getTagsLS() {
  let tags;
  localStorage.getItem('tags')
    ? (tags = JSON.parse(localStorage.getItem('tags')))
    : (tags = ['All', '今日の予定', '買い物リスト', '今週の予定', 'ノート']);
  createTags(tags);
  createTagnav(tags);
  showTagName();
}

//タグをLocalStorageに追加 (まだ実装していない)

function addTagsLS(e) {
  e.preventDefault();
  const tag = input.value;
  const tags = [];
  localStorage.getItem('todos')
    ? (tags = JSON.parse(localStorage.getItem('tags')))
    : (todos = []);
  tags = [...tags, tag];
  tags = [...new Set(tags)];
  localStorage.setItem('tags', JSON.stringify(tags));
  input.value = '';
  createTags(tags);
  createTagnav(tags);
}

// タグのelementsを作成
function createTags(tags) {
  const df = document.createDocumentFragment();
  tags
    .filter((tag) => tag !== 'All')
    .forEach((tag) => {
      //<li>
      const tagLi = document.createElement('li');
      tagLi.classList.add('tag-item');
      tagLi.setAttribute('title', tag);
      tagLi.setAttribute('for', tag);
      df.appendChild(tagLi);
      //<input> checkbox
      const checkboxTag = document.createElement('input');
      checkboxTag.classList.add('checkbox-tag');
      checkboxTag.setAttribute('type', 'checkbox');
      checkboxTag.setAttribute('name', 'tags');
      checkboxTag.setAttribute('value', tag);
      checkboxTag.setAttribute('id', tag);
      tagLi.appendChild(checkboxTag);
      //<label> text
      const tagText = document.createElement('label');
      tagText.classList.add('tag-text');
      tagText.textContent = tag;
      //click text and check checkbox
      tagText.setAttribute('for', tag);
      tagText.addEventListener('click', function (e) {
        addClass(e);
      });
      tagLi.appendChild(tagText);
    });
  tagUl.replaceChildren(df);
}

// タグのelementsを作成
function createTagnav(tags) {
  const df = document.createDocumentFragment();
  tags.forEach((tag) => {
    const li = document.createElement('li');
    li.classList.add('tag-nav-item');
    li.textContent = tag;
    li.addEventListener('click', function (e) {
      filteredTodosByTag(tag);
      addClassTag(e);
    });
    df.appendChild(li);
  });
  tagNav.replaceChildren(df);
}

//選んだTagのarrayを返す

function selectTags() {
  const tagCheckbox = document.querySelectorAll('input[name="tags"]:checked');
  const tags = [];
  tagCheckbox.forEach((checkbox) => {
    tags.push(checkbox.value);
  });
  return tags;
}

//タグを選択した時にtodoをfilterする
function filteredTodosByTag(tag) {
  const todos = JSON.parse(localStorage.getItem('todos'));
  if (!todos) return;
  if (tag === 'All') {
    createTodos(todos);
  } else {
    const filteredTodos = todos.filter((todo) => {
      return todo.tags.includes(tag);
    });
    createTodos(filteredTodos);
  }
  showTagName(tag);
}

////タグを選択した際にそのタグ名をトップに表示
function showTagName(tag) {
  tagName.textContent = tag || 'All';
}

//選択されたタグにclassを付与
function addClassTag(e) {
  const selectedTag = e.target;
  const tags = document.querySelectorAll('.tag-nav-item');

  tags.forEach((tag) => {
    if (tag === selectedTag) {
      tag.classList.add('active');
    } else {
      tag.classList.remove('active');
    }
  });
}

//チェックボックスをクリックした時にクラス名を足す
function addClass(e) {
  const prevSibling = e.target.previousElementSibling;
  if (!prevSibling.checked) {
    e.target.parentElement.classList.add('checked');
  } else {
    e.target.parentElement.classList.remove('checked');
  }
}
