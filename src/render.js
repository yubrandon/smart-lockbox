const header = document.querySelector('.header');
const content = document.querySelector('.content');
const footer = document.querySelector('.footer');

const text = document.createElement('h1');
text.innerText = "Hello World!";
header.appendChild(text);
//test code above

//window.electron.loginMenu();











//Clears content of a container - pass in header/content/footer
function clear(parent) {
    if(content.hasChildNodes()) {
        const del = document.querySelectorAll(`.${parent} > div`);
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
    const circle = document.createElement('div');
    //create indicator

    const text = document.createElement('h3');
    text.classList.add('connection-text');
    text.innerText = "Current Status: ";
    switch (state) {
        case 1:
            text.innerText += 'Unlocked';
            break;
        case 2: 
            text.innerText = 'Locked';
            break;
        default:
            text.innerText = 'Disconnected';
            break;
    }
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
    const bluetooth_div = document.createElement('div');
    const bluetooth_btn = document.createElement('button');
    bluetooth_btn.classList.add('bluetooth-button');

    const bluetooth_icon = document.createElement('img');
    bluetooth_icon.classList.add('bluetooth-icon');
    bluetooth_icon.src = "./assets/bluetooth.png"

    const bluetooth_text = document.createElement('h3');
    bluetooth_text.classList.add('bluetooth-text');
    bluetooth_text.innerText = "Bluetooth";

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