import {linesArrow, registerVariants} from './utils/constants.js';

const body = document.querySelector('body');

const container = document.createElement('div');
const title = document.createElement('h1');
const textareaDiv = document.createElement('textarea');
const keyboardDiv = document.createElement('div');
const postDescription = document.createElement('h3');


const DEFAULT_LANG = 'eng';
// const DEFAULT_LANG = 'ru';
const TOGETHER_ACTIVE_KEYS_LIMIT = 3;

let activeMouseKey = null;
let togetherActiveKeys = new Set();

const init = () => {
  container.classList.add('container');
  body.append(container);

  createTitle();
  createTextArea();
  createKeyboard();
  createDescription();
};

const createTitle = () => {
  title.classList.add('title');
  title.innerText = 'Virtual Keyboard';
  container.append(title);
};

const createTextArea = () => {
  textareaDiv.classList.add('textarea');
  container.append(textareaDiv);
};

const createKeyboard = () => {
  keyboardDiv.classList.add('keyboard');
  container.append(keyboardDiv);

  for (let i = 0; i < linesArrow.length; i++) {
    const keyBoardLine = document.createElement('div');
    keyBoardLine.classList.add('keyboard-line', `line-${i + 1}`);

    const lineArrowItem = Object.keys(linesArrow[i]);
    for (let item of lineArrowItem) {
      const currentItem = linesArrow[i][item];
      const key = document.createElement('div');
      key.classList.add('key', item);
      keyBoardLine.append(key);

      key.addEventListener('mousedown', (event) => {
        event.preventDefault();
        key.classList.add('active');
        activeMouseKey = key;
      });

      createLanguageKeyVariants(key, currentItem);
    }

    keyboardDiv.append(keyBoardLine);
  }
};

const createLanguageKeyVariants = (wrapper, contentObj) => {
  const languagesArr = Object.keys(contentObj);

  for (let lang of languagesArr) {

    const languageKey = document.createElement('span');
    languageKey.classList.add(lang);
    wrapper.append(languageKey);
    creatRegisterKeyVariants(languageKey, contentObj[lang]);

    if (lang !== DEFAULT_LANG) languageKey.classList.add('hidden');
  }
};

const creatRegisterKeyVariants = (wrapper, contentObj) => {
  for (let item of registerVariants) {
    const variant = document.createElement('span');
    variant.classList.add(item.className);
    variant.innerText = contentObj[item.value];

    if (item.className !== 'capsUp') variant.classList.add('hidden');

    wrapper.append(variant);
  }
};

const createDescription = () => {
  postDescription.classList.add('post-description');
  postDescription.innerText = 'Клавиатура создана в операционной системе Windows. Для переключения языка используется комбинация: левые ctrl + alt';
  container.append(postDescription);
};


init();

document.addEventListener('mouseup', () => {
  if (activeMouseKey) {
    activeMouseKey.classList.remove('active');
    activeMouseKey = null;
  }
});

document.addEventListener('keydown', (event) => {
  if (event.code === 'Tab') event.preventDefault();
  const el = document.querySelector(`.${event.code}`);
  if (el && togetherActiveKeys.size < TOGETHER_ACTIVE_KEYS_LIMIT) {
    el.classList.add('active');
    togetherActiveKeys.add(event.code);
  }
});

document.addEventListener('keyup', (event) => {
  const activeEl = document.querySelector(`.${event.code}`);
  if (activeEl) {
    activeEl.classList.remove('active');
    togetherActiveKeys.delete(event.code);
  }
});