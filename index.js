import {linesArrow, registerVariants} from './utils/constants.js';
import {hideAllElements, showOneElement} from './utils/helpers.js';

const body = document.querySelector('body');

const container = document.createElement('div');
const title = document.createElement('h1');
const textareaDiv = document.createElement('textarea');
const keyboardDiv = document.createElement('div');
const postDescription = document.createElement('h3');

const TOGETHER_ACTIVE_KEYS_LIMIT = 5;
const CAPS = 'caps';
const CAPS_UP = 'capsUp';
const CAPS_DOWN = 'capsDown';
const SHIFT_CAPS = 'shiftCaps';

const RU = 'ru';
const ENG = 'eng';

const TAB = 'Tab';
const SHIFT_LEFT = 'ShiftLeft';
const SHIFT_RIGHT = 'ShiftRight';
const CONTROL_LEFT = 'ControlLeft';
const CONTROL_RIGHT = 'ControlRight';
const META_LEFT = 'MetaLeft';
const ALT_LEFT = 'AltLeft';
const ALT_RIGHT = 'AltRight';
const SPACE = 'Space';
const CAPSLOCK = 'CapsLock';
const ENTER = 'Enter';
const DELETE = 'Delete';
const BACKSPACE = 'Backspace';

const ARROW_LEFT = 'ArrowLeft';
const ARROW_RIGHT = 'ArrowRight';
const ARROW_UP = 'ArrowUp';
const ARROW_DOWN = 'ArrowDown';

const configObj = {
  [TAB]: TAB,
  [SHIFT_LEFT]: SHIFT_LEFT,
  [SHIFT_RIGHT]: SHIFT_RIGHT,
  [CONTROL_LEFT]: CONTROL_LEFT,
  [CONTROL_RIGHT]: CONTROL_RIGHT,
  [META_LEFT]: META_LEFT,
  [ALT_LEFT]: ALT_LEFT,
  [ALT_RIGHT]: ALT_RIGHT,
  [SPACE]: SPACE,
  [CAPSLOCK]: CAPSLOCK,
  [ENTER]: ENTER,
  [DELETE]: DELETE,
  [BACKSPACE]: BACKSPACE,
};

let currentLanguage = ENG;
let activeMouseKey = null;
let togetherActiveKeys = new Set();
let keyRegister = CAPS_UP;
let isCapsLock = false;
let isShift = false;

const sessionStorageFunc = () => {
  const savedLanguage = sessionStorage.getItem('lang');
  if (savedLanguage) {
    currentLanguage = savedLanguage;
  } else {
    sessionStorage.setItem('lang', currentLanguage);
  }
};

sessionStorageFunc();

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

      createLanguageKeyVariants(key, currentItem);

      // mouse down handle
      key.addEventListener('mousedown', () => {
        textareaDiv.focus();

        if (item === CAPSLOCK) {
          capslockHandle(key);
        } else {
          key.classList.add('active');
        }

        if (item === SHIFT_LEFT || item === SHIFT_RIGHT) shiftLeftDownHandle();

        // eslint-disable-next-line no-prototype-builtins
        if (!configObj.hasOwnProperty(item)) {
          addOneCharacter(key.innerText);
        }

        if (item === BACKSPACE) {
          let deletedLeftCharacters = 1;

          const start = textareaDiv.selectionStart;
          const end = textareaDiv.selectionEnd;
          const sel = textareaDiv.value.substring(start, end);

          if (sel) deletedLeftCharacters = 0;

          textareaDiv.value = textareaDiv.value.substring(0, start - deletedLeftCharacters) + textareaDiv.value.substring(end);

          setTimeout(function () {
            textareaDiv.focus();
            textareaDiv.selectionStart = start - deletedLeftCharacters;
            textareaDiv.selectionEnd = start - deletedLeftCharacters;
          }, 0);
        }

        if (item === DELETE) {
          let deletedLeftCharacters = 1;

          const start = textareaDiv.selectionStart;
          const end = textareaDiv.selectionEnd;
          const sel = textareaDiv.value.substring(start, end);

          if (sel) deletedLeftCharacters = 0;

          textareaDiv.value = textareaDiv.value.substring(0, start) + textareaDiv.value.substring(end + deletedLeftCharacters);

          setTimeout(function () {
            textareaDiv.focus();
            textareaDiv.selectionStart = end;
            textareaDiv.selectionEnd = end;
          }, 0);
        }

        if (item === TAB) {
          addOneCharacter('\t');
        }

        if (item === ENTER) {
          addOneCharacter('\n');
        }

        activeMouseKey = item;
      });
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

    if (lang !== currentLanguage) languageKey.classList.add('hidden');
  }
};

const creatRegisterKeyVariants = (wrapper, contentObj) => {
  for (let item of registerVariants) {
    const variant = document.createElement('span');
    variant.classList.add(item.className);
    variant.innerText = contentObj[item.value];

    if (item.className !== CAPS_UP) variant.classList.add('hidden');

    wrapper.append(variant);
  }
};

const createDescription = () => {
  postDescription.classList.add('post-description');
  postDescription.innerText = 'Клавиатура создана в операционной системе Windows. Для переключения языка используется комбинация: любое сочетание ctrl + alt.' +
    ' Больше 4 клавиш на клавиатуре одновременно зажать нельзя';
  container.append(postDescription);
};


init();


document.addEventListener('mouseup', () => {
  if (activeMouseKey && activeMouseKey !== CAPSLOCK) {
    const activeEl = document.querySelector(`.${activeMouseKey}`);
    activeEl.classList.remove('active');

    if (activeMouseKey === SHIFT_LEFT || activeMouseKey === SHIFT_RIGHT) shiftLeftUpHandle();

    activeMouseKey = null;
  }
});

document.addEventListener('keydown', (event) => {
  textareaDiv.focus();

  if (
    event.code === TAB
    || event.code === 'AltLeft'
    || event.code === 'AltRight'
  ) event.preventDefault();

  const el = document.querySelector(`.${event.code}`);

  if (el && togetherActiveKeys.size < TOGETHER_ACTIVE_KEYS_LIMIT) {

    if (event.code === CAPSLOCK) {
      capslockHandle(el);
    } else {
      togetherActiveKeys.add(event.code);
      el.classList.add('active');
    }

    if (event.code === SHIFT_LEFT || event.code === SHIFT_RIGHT) shiftLeftDownHandle();

    if (
      event.code === ARROW_LEFT
      || event.code === ARROW_RIGHT
      || event.code === ARROW_UP
      || event.code === ARROW_DOWN
    ) {
      event.preventDefault();
      addOneCharacter(el.innerText);
    }

    if (event.code === TAB) {
      addOneCharacter('\t');
    }

    if (togetherActiveKeys.has('ControlLeft') && togetherActiveKeys.has('AltLeft')) changeLanguage();
  }
});

document.addEventListener('keyup', (event) => {
  const activeEl = document.querySelector(`.${event.code}`);
  if (activeEl) {

    if (event.code !== CAPSLOCK) {
      activeEl.classList.remove('active');
      togetherActiveKeys.delete(event.code);
    }
  }

  if (event.code === SHIFT_LEFT || event.code === SHIFT_RIGHT) shiftLeftUpHandle();
});


const shiftLeftDownHandle = () => {
  keyRegister = isCapsLock ? SHIFT_CAPS : CAPS_DOWN;
  isShift = true;
  hideKeys(keyRegister);
};

const shiftLeftUpHandle = () => {
  keyRegister = isCapsLock ? CAPS : CAPS_UP;
  isShift = false;
  hideKeys(keyRegister);
};


const capslockHandle = (capslock) => {
  isCapsLock = !isCapsLock;

  if (isCapsLock) {
    keyRegister = CAPS;
    hideKeys(keyRegister);

    capslock.classList.add('active');
    togetherActiveKeys.add(CAPSLOCK);

  } else {
    keyRegister = isShift ? CAPS_DOWN : CAPS_UP;
    hideKeys(keyRegister);

    capslock.classList.remove('active');
    togetherActiveKeys.delete(CAPSLOCK);
  }
};

const changeLanguage = () => {
  const previousLanguage = currentLanguage;
  currentLanguage = currentLanguage === ENG ? RU : ENG;

  sessionStorage.setItem('lang', currentLanguage);

  const keys = document.querySelectorAll('.key');

  Array.from(keys, (el) => {

    const previousLanguageKey = el.querySelector(`span.${previousLanguage}`);
    previousLanguageKey.classList.add('hidden');
    hideAllElements(previousLanguageKey);

    const currentLanguageKey = el.querySelector(`span.${currentLanguage}`);
    currentLanguageKey.classList.remove('hidden');
    hideAllElements(currentLanguageKey);
    showOneElement(currentLanguageKey, `.${keyRegister}`);
  });
};


// help function to select one active key for render in DOM
const hideKeys = (keyRegister) => {
  const keys = document.querySelectorAll(`span.${currentLanguage}`);
  Array.from(keys, (el) => {
    hideAllElements(el);
    showOneElement(el, `.${keyRegister}`);
  });
};

const addOneCharacter = (inner) => {
  const start = textareaDiv.selectionStart;
  const end = textareaDiv.selectionEnd;
  textareaDiv.value = textareaDiv.value.substring(0, start) + inner + textareaDiv.value.substring(end);

  textareaDiv.selectionStart = end + 1;
  textareaDiv.selectionEnd = end + 1;
};