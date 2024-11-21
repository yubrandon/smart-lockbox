const header = document.querySelector('.header');
const content = document.querySelector('.content');
const footer = document.querySelector('.footer');

//test code
/*const text = document.createElement('h1');
text.innerText = "Hello World!";
header.appendChild(text);*/

//function importing not working, use following searches to get to sections:
// UI SECTION, MENU SECTION, CANVAS SECTION, BLUETOOTH SECTION, BOX SECTION
//window.electron.loginMenu();











//
//  UI SECTION | MENU SECTION
//

//Used to update the status indicator in the header
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
    const dialog = document.querySelector('.modal');

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

    //call login when canvas button is clicked
    canvas_btn.addEventListener('click', ()=> {
        login();
        dialog.showModal();
    });

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
function login() {
    clearModal();
    const dialog = document.querySelector('.modal');
    const field = document.querySelector('.modal-field');

    //create title for modal
    const modal_header = document.querySelector('.modal-header');
    const title_div = document.createElement('div');
    const title = document.createElement('h4');
    title.innerText = "Enter Details Below";
    title.classList.add('modal-title');
    title_div.appendChild(title);
    modal_header.appendChild(title_div);
    
    //create field for api token input
    const key_div = document.createElement('div');
    key_div.classList.add('form');
    const key = document.createElement('input');
    key.type = "text";
    key.id = "key";
    key.name = "key"; 
    key.placeholder = "Access Token";
    key_div.appendChild(key);
    field.appendChild(key_div);

    //create field for url input
    const url_div = document.createElement('div');
    url_div.classList.add('form');
    const url = document.createElement('input');
    url.type = "text";
    url.id = "url";
    url.name = "url";
    url.placeholder = "URL";
    url_div.appendChild(url);
    field.appendChild(url_div);

    //create button for form submission
    const submit_div = document.createElement('div');
    submit_div.classList.add('submit-div')

    const submit_btn = document.createElement('button');
    submit_btn.id = "submit";
    submit_btn.name = "submit";
    submit_btn.classList.add('submit-btn');
    submit_btn.innerText = "Submit";
    submit_div.appendChild(submit_btn)
    
    submit_btn.addEventListener('click', () => {
        dialog.close();
    })
    
    field.appendChild(submit_div);


}
//TODO: COMPLETE API CALL USING ACCESS KEY & URL INPUT
//CREATE SECOND SCREEN THAT SHOWS ASSIGNMENTS FOR CLASSES AND SELECT DESIRED ASSIGNMENT
//CONFIRMATION POP UP FOR ASSIGNMENT




//
//  BLUETOOTH SECTION
//
//TO DO: BLUETOOTH CONNECTION PROCESS
//CHECK CURRENTLY CONNECTED DEVICES OR SEARCH FOR BLUETOOTH DEVICES
//LET USER SELECT DEVICE
//ESTABLISH CONNECTION




//
//  BOX SECTION
//

//*ASSUMES BLUETOOTH CONNECTION WITH BOX ESTABLISHED*
//CODE TO CONTROL BOX LOCK/COMMUNICATION









//
//  HELPER FUNCTIONS
//

//Clears content of a container
function clear(parent) {
    if(content.hasChildNodes()) {
        const del = document.querySelectorAll(parent > 'div');
        for(let i=0; i<del.length; i++) {
            content.removeChild(del[i]);
        }
    }
}

//Clears modal contents
function clearModal(){ 
    clear(document.querySelector('.modal-header'));
    clear(document.querySelector('.modal-field'));
}