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
    //create div
    const connectionDiv = document.createElement('div');
    connectionDiv.classList.add('indicator-div');
    //create canvas for shape
    const circle = document.createElement('canvas');
    circle.classList.add('indicator-circle');
    //dimensions
    const X = 60;
    const Y = 40;
    circle.width = X;
    circle.height = Y;

    //create circle
    const ctx = circle.getContext("2d");
    ctx.scale(X / Y, 1);
    ctx.beginPath();
    ctx.arc(X/4, Y/2, 5, 0, 2 * Math.PI);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.stroke();
    
    //create text
    const text = document.createElement('h3');
    text.classList.add('connection-text');
    text.innerText = "Current Status: ";
    //change indicator based on state
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
    //append elements to div
    connectionDiv.appendChild(circle);
    connectionDiv.appendChild(text);
    //append div to header
    header.appendChild(connectionDiv);
    
})(0);

//Displays the main login menu to connect to Canvas or set task
(function loginMenu() {
    clear(content);
    //create div
    const canvas = document.createElement('div');
    canvas.classList.add('canvas-login');
    //create button
    const canvas_btn = document.createElement('button');
    canvas_btn.classList.add('canvas-login-button')

    //create image
    const canvas_icon = document.createElement('img');
    canvas_icon.classList.add('canvas-login-icon');
    canvas_icon.src = "./assets/canvas.png";
    //create text
    const canvas_text = document.createElement('h2');
    canvas_text.innerText = 'Login with Canvas'
    canvas_text.classList.add('canvas-login-text');
    //append elements to button
    canvas_btn.appendChild(canvas_icon);
    canvas_btn.appendChild(canvas_text);

    //ADD EVENT LISTENER FOR LOGIN HERE
    //call another function to get login and api key

    //append button to div
    canvas.appendChild(canvas_btn);
    //append div to body
    content.appendChild(canvas);
})();

(function bluetoothButton(){
    clear(footer);
    //create div
    const bluetooth_div = document.createElement('div');
    bluetooth_div.classList.add('bluetooth-div');
    //create button
    const bluetooth_btn = document.createElement('button');
    bluetooth_btn.classList.add('bluetooth-button');
    //create image
    const bluetooth_icon = document.createElement('img');
    bluetooth_icon.classList.add('bluetooth-icon');
    bluetooth_icon.src = "./assets/bluetooth.png";
    //create text
    const bluetooth_text = document.createElement('h3');
    bluetooth_text.classList.add('bluetooth-text');
    bluetooth_text.innerText = "Link my Box";
    //append elements to button
    bluetooth_btn.appendChild(bluetooth_icon);
    bluetooth_btn.appendChild(bluetooth_text);
    //append button to div
    bluetooth_div.appendChild(bluetooth_btn);
    //append div to footer
    footer.appendChild(bluetooth_div);

})();






//
//  CANVAS SECTION
//







//
//  BLUETOOTH SECTION
//