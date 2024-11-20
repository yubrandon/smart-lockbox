import clear from './clear.js';

const container = document.querySelector('.container');

//add regions to screen
function layout() {
    const header = document.createAttribute('div');
    header.classList.add('header');

    const content = document.createAttribute('div');
    content.classList.add('content');

    const footer = document.createAttribute('div');
    footer.classList.add('footer');

    container.appendChild(header);
    container.appendChild(content);
    container.appendChild(footer);

}
layout();