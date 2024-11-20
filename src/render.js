const header = document.querySelector('.header');
const content = document.querySelector('.content');
const footer = document.querySelector('.footer');

//test code
/*const text = document.createElement('h1');
text.innerText = "Hello World!";
header.appendChild(text);*/

//function importing not working, use following searches to get to sections:
// UI SECTION, MENU SECTION, CANVAS SECTION, BLUETOOTH SECTION
//window.electron.loginMenu();











//Clears content of a container - pass in header/content/footer
function clear(parent) {
    if(content.hasChildNodes()) {
        const del = document.querySelectorAll(parent > 'div');
        for(let i=0; i<del.length; i++) {
            content.removeChild(del[i]);
        }
    }
}

//
//  UI SECTION | MENU SECTION
//

//Used to update the status indicator for the box at the top
//Call in Bluetooth connection procedure
//Arguments: 0 for disconnected, 1 for unlocked, 2 for locked
(function connectionIndicator(state) {
    clear(header);
    const connectionDiv = document.createElement('div');
    connectionDiv.classList.add('indicator-div');
    const circle = document.createElement('canvas');
    circle.classList.add('indicator-circle');

    const X = 60;
    const Y = 40;
    circle.width = X;
    circle.height = Y;

    const ctx = circle.getContext("2d");
    ctx.scale(X / Y, 1);
    ctx.beginPath();
    ctx.arc(X/4, Y/2, 5, 0, 2 * Math.PI);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.stroke();
    

    const text = document.createElement('h3');
    text.classList.add('connection-text');
    text.innerText = "Current Status: ";
    switch (state) {
        case 1:
            ctx.fillStyle = "#40FF00";
            ctx.fill();
            text.innerText += 'Unlocked';
            break;
        case 2: 
            ctx.fillStyle = "#FF0000";
            text.innerText = 'Locked';
            break;
        default:
            ctx.fillStyle = "#D9D9D9";
            ctx.fill();
            text.innerText = 'Disconnected';
            break;
    }
    connectionDiv.appendChild(circle);
    connectionDiv.appendChild(text);
    header.appendChild(connectionDiv);
    
})(0);

//Displays the main login menu to connect to Canvas or set task
(function loginMenu() {
    clear(content);
    const canvas = document.createElement('div');
    canvas.classList.add('canvas-login');
    const canvas_btn = document.createElement('button');
    canvas_btn.classList.add('canvas-login-button')

    const canvas_icon = document.createElement('img');
    canvas_icon.classList.add('canvas-login-icon');
    canvas_icon.src = "./assets/canvas.png";
    
    const canvas_text = document.createElement('h2');
    canvas_text.innerText = 'Login with Canvas'
    canvas_text.classList.add('canvas-login-text');

    canvas_btn.appendChild(canvas_icon);
    canvas_btn.appendChild(canvas_text);

    //ADD EVENT LISTENER FOR LOGIN HERE
    //call another function to get login and api key

    canvas.appendChild(canvas_btn);

    content.appendChild(canvas);
})();

(function bluetoothButton(){
    clear(footer);
    const bluetooth_div = document.createElement('div');
    bluetooth_div.classList.add('bluetooth-div');
    const bluetooth_btn = document.createElement('button');
    bluetooth_btn.classList.add('bluetooth-button');

    const bluetooth_icon = document.createElement('img');
    bluetooth_icon.classList.add('bluetooth-icon');
    bluetooth_icon.src = "./assets/bluetooth.png";

    const bluetooth_text = document.createElement('h3');
    bluetooth_text.classList.add('bluetooth-text');
    bluetooth_text.innerText = "Link my Box";

    bluetooth_btn.appendChild(bluetooth_icon);
    bluetooth_btn.appendChild(bluetooth_text);

    bluetooth_div.appendChild(bluetooth_btn);

    footer.appendChild(bluetooth_div);

})();






//
//  CANVAS SECTION
//







//
//  BLUETOOTH SECTION
//