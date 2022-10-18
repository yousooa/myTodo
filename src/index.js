import { $ } from './utils/utils.js';

export default function App() {
  const checkInput = (todo) => {
    if (todo.replace(/\s/g, '') === '') {
      return alert('다시 todo를 입력해주세요.');
    }
  };

  $('#todo-form').addEventListener('submit', (e) => {
    e.preventDefault();
  });
}

new App();