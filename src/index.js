import $ from './utils/DomElement.js';
import { ERROR_INPUT_MESSAGE, DELETE_TODO_MASSAGE, EDIT_MESSAGE } from './utils/message.js';
import store from './store/store.js';

export default function App() {
  this.todoList = [];
  this.init = () => {
    if (store.getLocalStorage()) {
      this.todoList = store.getLocalStorage();
    }
    render();
    initaddEventListeners();
  };
  const resetInput = () => {
    $('#todo-input').value = '';
    $('#todo-input').focus();
    $('#category-select').options[0].selected = true;
  };
  const checkInput = (todoInput) => {
    if (todoInput.replace(/\s/g, '') === '') {
      resetInput();
      alert(ERROR_INPUT_MESSAGE.blank('입력'));
      return false;
    }
    return true;
  };
  const updateCount = () => {
    const count = $('#todo-list').querySelectorAll('li').length;
    const completedCount = this.todoList.filter((todo) => todo.isCompleted === true).length;
    const notCompletedCount = count - completedCount;
    $('#todo-count').textContent = `진행: ${notCompletedCount}개 완료: ${completedCount}개`;
  };
  const render = () => {
    const todoListTemplate = this.todoList
      .map((todo, index) => {
        return `
      <li data-todo-id="${index}" class="todo-item">
        <div class="${todo.isCompleted ? 'completed' : ''} checkbox">&#10003;</div>
        <div class="${todo.isCompleted ? 'completed' : ''} todo">${todo.content}</div>
        <div class="todo-end">
          <span class="category">${todo.category}</span>
          <button class="delete-button">x</button>
        </div>
      </li>
      `;
      })
      .join('');
    $('#todo-list').innerHTML = todoListTemplate;
    updateCount();
  };
  const addTodo = () => {
    const todoInput = $('#todo-input').value;
    const category = $('#category-select').options[$('#category-select').selectedIndex].text;
    if (!checkInput(todoInput)) {
      return;
    }
    this.todoList.push({ category, content: todoInput, isCompleted: false });
    store.setLocalStorage(this.todoList);
    render();
    resetInput();
  };
  const deleteTodo = (todoId) => {
    if (window.confirm(DELETE_TODO_MASSAGE)) {
      this.todoList.splice(todoId, 1);
      store.setLocalStorage(this.todoList);
      render();
    }
  };
  const editContent = (todoId) => {
    const { content } = this.todoList[todoId];
    const editedContent = prompt(EDIT_MESSAGE('todo'), content);
    if (!editedContent) {
      return;
    }
    if (editedContent.replace(/\s/g, '') === '') {
      alert(ERROR_INPUT_MESSAGE.blank('수정'));
      return;
    }
    this.todoList[todoId].content = editedContent;
    store.setLocalStorage(this.todoList);
    render();
  };
  const editCategory = (todoId) => {
    const { category } = this.todoList[todoId];
    const editedCategory = prompt(EDIT_MESSAGE('테마'), category);
    const categoryOptions = ['공부', '개인 성장', '인맥 관리'];
    if (!editedCategory) {
      return;
    }
    if (!categoryOptions.includes(editedCategory)) {
      alert(ERROR_INPUT_MESSAGE.notInCategoryOptions);
      return;
    }
    this.todoList[todoId].category = editedCategory;
    store.setLocalStorage(this.todoList);
    render();
  };
  const completeTodo = (todoId) => {
    this.todoList[todoId].isCompleted = !this.todoList[todoId].isCompleted;
    store.setLocalStorage(this.todoList);
    render();
  };
  const isCompleted = (todoId) => {
    return this.todoList[todoId].isCompleted === true;
  };
  const initaddEventListeners = () => {
    $('#todo-form').addEventListener('submit', (e) => {
      e.preventDefault();
      addTodo();
    });
    $('#todo-list').addEventListener('click', (e) => {
      const { todoId } = e.target.closest('li').dataset;
      if (e.target.classList.contains('delete-button')) {
        deleteTodo(todoId);
        return;
      }
      if (e.target.classList.contains('todo') && !isCompleted(todoId)) {
        editContent(todoId);
        return;
      }
      if (e.target.classList.contains('category') && !isCompleted(todoId)) {
        editCategory(todoId);
        return;
      }
      if (e.target.classList.contains('checkbox')) {
        completeTodo(todoId);
      }
    });
  };
}

const app = new App();
app.init();
