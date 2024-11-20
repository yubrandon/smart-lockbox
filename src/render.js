const header = document.querySelector('.header');
const content = document.querySelector('.content');
const footer = document.querySelector('.footer');

const text = document.createElement('h1');
text.innerText = "Hello World!";
header.appendChild(text);
//test code above

//window.electron.loginMenu();











//clears content of a container - pass in header/content/footer
function clear(parent) {
    if(content.hasChildNodes()) {
        const del = document.querySelectorAll(`.${parent} > div`);
        for(let i=0; i<del.length; i++) {
            content.removeChild(del[i]);
        }
    }
}

//
//STARTING MENU
//
(function loginMenu() {
    clear(content);
    const canvas = document.createElement('div');
    canvas.classList.add('canvas-login');
    const canvas_btn = document.createElement('button');
    canvas_btn.classList.add('canvas-login-button')

    const canvas_logo = document.createElement('img');
    canvas_logo.classList.add('canvas-login-logo');
    canvas_logo.src = "./assets/canvaslogo.png";
    
    const canvas_text = document.createElement('h2');
    canvas_text.innerText = 'Login with Canvas'
    canvas_text.classList.add('canvas-login-text');

    canvas_btn.appendChild(canvas_logo);
    canvas_btn.appendChild(canvas_text);

    //ADD EVENT LISTENER FOR LOGIN HERE

    canvas.appendChild(canvas_btn);

    content.appendChild(canvas);
})();