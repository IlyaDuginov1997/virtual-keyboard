import {linesArrow} from './utils/constants.js';

const body = document.querySelector('body');

const keyBoardDiv = document.createElement('div');
keyBoardDiv.classList.add('keyboard');
body.append(keyBoardDiv);

for (let i = 0; i < linesArrow.length; i++) {
    const keyBoardLine = document.createElement('div');
    keyBoardLine.classList.add('keyboard-line', `line-${i + 1}`);

    const lineArrowItem = Object.keys(linesArrow[i]);
    for (let item of lineArrowItem) {
        const key = document.createElement('div');
        key.classList.add('key', `${item.toLowerCase()}`);
        key.innerText = linesArrow[i][item].eng.lowerCase;
        keyBoardLine.append(key);
    }

    keyBoardDiv.append(keyBoardLine);
}