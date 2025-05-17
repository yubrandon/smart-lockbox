const header = document.querySelector('.header');
const content = document.querySelector('.content');

import { getCourses, getUser, getSubmissions, getCoursework } from './js/api.js';
const boxConnection = connectionMonitor();
const currentUser = userInfo();


//
//  UI/MENU
//

//Update badge based on connection status
function updateConnectionIndicator() {
    const connection_badge = document.querySelector('.badge');
    //Change indicator based on state
    if(boxConnection.isConnected()) {
        if(connection_badge.classList.contains('bg-danger')) 
            connection_badge.classList.remove('bg-danger');
        connection_badge.classList.add('bg-success');
        connection_badge.innerText = 'Connected';
    } 
    else {
        if(connection_badge.classList.contains('bg-success')) 
            connection_badge.classList.remove('bg-success');
        connection_badge.classList.add('bg-danger');
        connection_badge.innerText = 'Disconnected';
    }
}

//Displays the main login menu to connect to Canvas or set task
function loginMenu() {
    //Refresh indicator
    updateConnectionIndicator();
    
    clear(content);

    //Create div
    const canvas = document.createElement('div');
    canvas.classList.add('canvas-login');
    //Create button
    const canvas_btn = document.createElement('button');

    //Create image
    const canvas_icon = document.createElement('img');
    canvas_icon.classList.add('canvas-login-icon');
    canvas_icon.src = "./static/canvas.png";
    //Create text
    const canvas_text = document.createElement('h2');
    canvas_text.innerText = 'Login with Canvas'
    canvas_text.classList.add('canvas-login-text');
    //Append elements to button
    canvas_btn.appendChild(canvas_icon);
    canvas_btn.appendChild(canvas_text);

    //Open modal on click
    canvas_btn.type = 'button';
    canvas_btn.classList.add('btn','btn-lg', 'btn-outline-dark', 'border', 'border-dark', 'p-5');
    canvas_btn.setAttribute("data-bs-toggle","modal");
    canvas_btn.setAttribute("data-bs-target", "#modal");


    //Call login when canvas button is clicked
    canvas_btn.addEventListener('click', (event)=> {
        login();
        
    });

    //Append button to div
    canvas.appendChild(canvas_btn);
    //Append div to body
    content.appendChild(canvas);
}
loginMenu();

const footer = document.querySelector('.footer');
clear(footer);
/*(function connectBtn(){
    //create div
    const connect_div = document.createElement('div');
    connect_div.classList.add('connect-div');
    //Create button
    const connect_btn = document.createElement('button');
    connect_btn.classList.add('connect-button');
    connect_btn.innerText = "Connect";
    connect_btn.id = 'connect-button';

    //EventListener for click
    connect_btn.addEventListener('click', async () => {
        console.log('Connect button clicked');
        const connectBtn = document.getElementById('connect-button');
        const disconnectBtn = document.getElementById('disconnect-button');

        connectBtn.disabled = true;
        connectBtn.innerText = 'Connecting...';

        try {
            
            const device = await navigator.bluetooth.requestDevice({
                filters: [{ services: [0x180E] }],
                optionalServices: ['battery_service']
            }); 

            // Unsure what the microcontroller would be so just set it acceptAllDevices
            const device = await navigator.bluetooth.requestDevice({
                // filters: [...] <- Prefer filters to save energy & show relevant devices.
                // acceptAllDevices here ensures dialog can populate, we don't care with what.
                acceptAllDevices: true
            });

            console.log('Connected to device: ' + device.name);

            const server = await device.gatt.connect();
            console.log('Connected to GATT server');

            disconnectBtn.disabled = false;
            connectBtn.disabled = true;
            connectBtn.innerText = 'Connected';

            // EventListener for 
            device.addEventListener('gattserverdisconnected', () => {
                console.log('Device disconnected');
                disconnectBtn.disabled = true;
                connectBtn.disabled = false;
                connectBtn.innerText = 'Connect';
            });

            window.currentBLEDevice = device;

        // Any interruption before the the async is finished (changing focus of window)
        } catch (error) {
            if (error instanceof DOMException && error.name === 'NotFoundError') {
                console.log('User canceled the Bluetooth device selection');
            } else {
                console.error('Error: ', error);
            }

            connectBtn.disabled = false;
            connectBtn.innerText = 'Connect';
        }
    });

    //Append button to div
    connect_div.appendChild(connect_btn);
    //Append div to footer
    footer.appendChild(connect_div);
})();*/

(function disconnectBtn(){
    //create div
    const disconnect_div = document.createElement('div');
    disconnect_div.classList.add('disconnect-div');
    //Create button
    const disconnect_btn = document.createElement('button');
    disconnect_btn.classList.add('disconnect-button');
    disconnect_btn.innerText = "Disconnect";
    disconnect_btn.id = 'disconnect-button';

    disconnect_btn.addEventListener('click', () => {
        if (window.currentBLEDevice && window.currentBLEDevice.gatt.connected) {
            window.currentBLEDevice.gatt.disconnect();
            console.log('Manually disconnected from device.');
        }
    });

    //Append button to div
    disconnect_div.appendChild(disconnect_btn);
    //Append div to footer
    footer.appendChild(disconnect_div);
})();
/*
(function bluetoothButton(){
    const footer = document.querySelector('.footer');
    clear(footer);
    //Create button
    const bluetooth_btn = document.createElement('button');
    bluetooth_btn.classList.add('bluetooth-button', 'btn', 'btn-outline-primary', 'border', 'border-dark');
    bluetooth_btn.addEventListener('click', () => {
        if(boxConnection.isConnected()) boxConnection.disconnect();
        else boxConnection.connect();
    })
    const content_div = document.createElement('div');
    content_div.classList.add('p-2', 'd-flex', 'flex-row','align-items-center');
    //Create image
    const bluetooth_icon = document.createElement('img');
    bluetooth_icon.classList.add('bluetooth-icon','pe-3');
    bluetooth_icon.src = "./static/bluetooth.png";
    //Create text
    const bluetooth_text = document.createElement('h3');
    bluetooth_text.classList.add('bluetooth-text','m-0','text-center');
    bluetooth_text.innerText = "Link my Box";
    //Append elements to button
    content_div.appendChild(bluetooth_icon);
    content_div.appendChild(bluetooth_text);
    bluetooth_btn.appendChild(content_div);
    //Append button to div
    footer.appendChild(bluetooth_btn);

})();
*/

//Display name of logged in user at top
function addUser() {
    //Create object
    const header_info = document.querySelector('.header-name');

    const label = document.createElement('h5');
    label.classList.add('m-0', 'text-center', 'me-2', 'text-light');
    label.innerText = "Student: ";
    
    const name = document.createElement('h4');
    name.classList.add('header-name', 'm-0', 'me-3', 'text-info');
    name.innerText = currentUser.getName();

    const logout = document.createElement('button');
    logout.classList.add('logout-button', 'btn', 'btn-outline-light', 'text-center');
    logout.innerText = 'Log out';
    logout.addEventListener('click', () => {
        currentUser.clearName();
        boxConnection.unlock();
        clear(header_info);
        loginMenu();

    })
    header_info.appendChild(label);
    header_info.appendChild(name);
    header_info.appendChild(logout);

}





//
//  CANVAS ASSIGNMENT NAVIGATION
//

function login() {
    //Fill modal with fields for login
    loginModal();

    //Handle form submission
    const form = document.querySelector('#submit');

    //Toggle modal on click, alert will show if error
    form.setAttribute("data-bs-toggle", "modal");
    form.setAttribute("data-bs-target", "#modal");

    //Upon submission of form, check form values and login if valid
    form.addEventListener('click', async (event) => {
        event.preventDefault(); //Enable to stop refresh
        //Get values from input fields
        const key = document.querySelector('#key').value;
        let url = document.querySelector('#url').value;
        //If url doesn't have scheme (only ip) add it in manually
        if(url[0] != 'h') url = 'http://' + url;
        if(url[url.length-1] == '/') url = url.slice(0,url.length-1);
        //console.log(`${url}/api/v1/courses`);
        
        //Pass inputs to function, returns json
        const courseData = await getCourses(key,url);
        //console.log('course data: ', courseData);
        //Console.log(courseData);

        //Check for error
        if(courseData instanceof Error) {
            alert('Login Error! Check your access code or URL.');
        }
        else {
            //Store data and get Canvas information for student
            currentUser.setKey(key);
            currentUser.setUrl(url);
            const user = await getUser(currentUser.getUrl(), currentUser.getKey());
            currentUser.setName(user.name);

            //Pass information to assignments screen
            await assignmentView(courseData);

            //console.log(user);
            addUser();            


        }
        //Event listener will clean itself up upon next screen being displayed
    }, { once: true });
}


//New screen to show assignments to select
async function assignmentView(courseData) {
    clear(content);
    //Fetch 2d array of courses and assignments
    const courseWork = await getCoursework(currentUser.getUrl(), currentUser.getKey(), courseData, currentUser);
    //console.log(courseWork);
    //Iterate through array and create div for each course
    for(let i = 0; i<courseWork.length; i++) {
        const course = courseWork[i][0];
        //Create div with header
        const accordion_div = document.createElement('div');
        accordion_div.classList.add('accordion-div', 'me-1', 'pb-3');
        const header = document.createElement('h2');
        header.innerText = "Course: " + course.name;
        header.classList.add('m-0', 'border-bottom', 'border-dark');
        accordion_div.appendChild(header);

        //Create accordion for each course
        const accordion = document.createElement('div');
        accordion.classList.add('accordion', 'accordion-flush');
        accordion.id = "accordion";
        //Iterate through nested array to get assignments for course
        for(let j=1; j<courseWork[i].length; j++) {
            const assignment = courseWork[i][j];
            let sub = await getSubmissions(currentUser.getUrl(), currentUser.getKey(), course.id, assignment.id);
            //console.log(sub);
            //Check if attempts can be made
            if(sub.attempt != assignment.allowed_attempts || assignment.allowed_attempts == -1) {
                //Create an accordion item
                const item = document.createElement('div');
                item.classList.add('accordion-item');

                //Create header for the item
                const item_header = document.createElement('h2');
                item_header.classList.add('accordion-header');
                const item_btn = document.createElement('button');
                item_btn.classList.add('accordion-button', 'collapsed');
                item_btn.setAttribute("aria-expanded", "false");
                item_btn.innerText = assignment.name;
                item_btn.type = "button";
                item_btn.setAttribute("data-bs-toggle","collapse");
                item_btn.setAttribute("data-bs-target",`#collapse${i}${j}`);
                item_header.appendChild(item_btn);
                item.appendChild(item_header);

                //Create the description
                const desc = document.createElement('div');
                desc.id = `collapse${i}${j}`;
                desc.classList.add('accordion-collapse', 'collapse');
                desc.setAttribute("data-bs-parent", "#accordion");

                const body = document.createElement('div');
                body.classList.add('accordion-body');
                body.innerHTML = assignment.description;
                
                const select_div = document.createElement('div');
                select_div.classList.add('d-flex','flex-row-reverse');
                const select_btn = document.createElement('button');
                select_btn.type = "button";
                select_btn.setAttribute("data-bs-toggle", "modal");
                select_btn.setAttribute("data-bs-target", "#modal");
                select_btn.classList.add('btn', 'btn-outline-success');
                select_btn.innerText = 'Select';
                select_btn.addEventListener('click', (event) => {
                    //console.log("course, assignment, name:", course.id, assignment.id, assignmentName)
                    currentUser.setCourseId(course.id);
                    currentUser.setAssignmentId(assignment.id);
                    currentUser.setAssignmentName(assignment.name);
                    //console.log('assignment chosen');
                    //Display confirmation
                    confirmationModal(assignment.name);
                });
                
                select_div.appendChild(select_btn);

                //Add button to body and then add to item
                body.appendChild(select_div);
                desc.appendChild(body);
                item.appendChild(desc);
                accordion.appendChild(item);
            }
        }
        //Add to body
        accordion_div.appendChild(accordion);
        content.appendChild(accordion_div);
    }

}




//Add fields for login process
function loginModal(){
    clearModal();

    //Create title for modal
    const modal_title = document.querySelector('.modal-title');
    modal_title.innerText = "Enter Details Below";

    const form = document.querySelector('.modal-form');

    //Create field for api token input
    const key_div = document.createElement('div');
    key_div.classList.add('mb-3');

    const key_label = document.createElement('label');
    key_label.classList.add('form-label');
    key_label.for = "key";
    key_label.innerText = "Access Token";
    key_div.appendChild(key_label);

    const key_form = document.createElement('input');
    key_form.type = "text";
    key_form.id = "key";
    key_form.placeholder = "Access Token";
    key_form.classList.add('form-control');
    key_div.appendChild(key_form);

    form.appendChild(key_div);

    //Create field for url input
    const url_div = document.createElement('div');
    url_div.classList.add('mb-4');

    const url_label = document.createElement('label');
    url_label.classList.add('form-label');
    url_label.innerText = "Canvas URL";
    url_label.for = "url";
    url_div.appendChild(url_label);

    const url_form = document.createElement('input');
    url_form.type = "text";
    url_form.id = "url";
    url_form.classList.add('form-control');
    url_form.placeholder = "Canvas URL";
    url_div.appendChild(url_form);

    form.appendChild(url_div);

    //Create button for form submission
    const submit_div = document.createElement('div');
    submit_div.classList.add('d-flex','flex-row-reverse');
    const submit_btn = document.createElement('button');
    submit_btn.id = "submit";
    submit_btn.classList.add('btn','btn-primary');
    submit_btn.innerText = "Submit";
    submit_div.appendChild(submit_btn);
    form.appendChild(submit_div);

}

async function confirmationModal(assignment) {
    clearModal();

    //Change header title
    const modal_title = document.querySelector('.modal-title');
    modal_title.innerText = "Assignment Confirmation";
    
    //Main modal content body
    const field = document.querySelector('.modal-form');

    //Add assignment selected
    const assignmentName = document.createElement('h2');
    assignmentName.classList.add('m-0','mb-5')
    assignmentName.innerText = `${assignment}`;
    field.appendChild(assignmentName);

    //Create buttons
    const btn_div = document.createElement('div');
    btn_div.classList.add('d-flex', 'flex-row-reverse');

    const cancel = document.createElement('button');
    cancel.type = "button";
    cancel.classList.add('btn', 'btn-secondary');
    cancel.setAttribute("data-bs-dismiss", "modal");
    cancel.innerText = "Close";

    const confirm = document.createElement('button');
    confirm.type = "button";
    confirm.classList.add('btn', 'btn-primary', 'ms-2');
    confirm.innerText = "Confirm";
    confirm.addEventListener('click', (event) => {
        if(!boxConnection.isConnected()) {
            alert('Box disconnected!');
        }
        else {
            event.preventDefault();
            promptLocking();
        }
        
    }, { once: true });

    btn_div.appendChild(confirm);
    btn_div.appendChild(cancel);

    field.appendChild(btn_div);
}
//After confirmation, prompt user to place their device in the box
function promptLocking() {
    clearModal(); 

    //Change header title
    const modal_title = document.querySelector('.modal-title');
    modal_title.innerText = "Box Locking";

    const form = document.querySelector('.modal-form');
    const text = document.createElement('p');
    text.innerText = "Place your device in the box and close the cover";
    form.appendChild(text);

    const buttonDiv = document.createElement('div');
    buttonDiv.classList.add('d-flex','flex-row-reverse');

    const confirm = document.createElement('button');
    confirm.classList.add('btn','btn-primary');
    confirm.setAttribute('data-bs-dismiss', 'modal');
    confirm.innerText = "Confirm";
    confirm.addEventListener('click', async (event) => {
        event.preventDefault();
        if(!boxConnection.isConnected()) {
            alert('Box disconnected!');
        }
        else {
            //Display locked screen
            clear(content);
            boxConnection.lock();
            lockedView();
        }
        
    }, { once: true });

    buttonDiv.appendChild(confirm);
    form.appendChild(buttonDiv);
}

//Screen while locked
async function lockedView() {
    //console.log("course, assignment, name:", currentUser.getCourseId(), currentUser.getAssignmentId(), currentUser.getAssignmentName());

    //Track current number of submissions
    const currentSubmissions = await getSubmissions(currentUser.getUrl(), currentUser.getKey(), currentUser.getCourseId(), currentUser.getAssignmentId());
    console.log(currentSubmissions);
    console.log("current submissions:", currentSubmissions.attempt)

    //Display current assignment and add button
    const lock_div = document.createElement('div');
    lock_div.classList.add('container-fluid', 'd-flex', 'flex-column', 'col-6');

    const lock_header = document.createElement('h4');
    lock_header.classList.add('mx-0', 'my-4', 'text-center');
    lock_header.innerText = 'Current assignment:';

    const assignment_name = document.createElement('h1');
    assignment_name.classList.add('mx-0', 'mb-5', 'text-center');
    assignment_name.innerText = `${currentUser.getAssignmentName()}`;

    const completion_button = document.createElement('button');
    completion_button.classList.add('btn', 'btn-outline-success', 'col-6', 'offset-md-3');
    completion_button.innerText = 'Assignment Completed';
    completion_button.addEventListener('click', async (event) => {
        //Check completion
        const submissionCount = await getSubmissions(currentUser.getUrl(), currentUser.getKey(), currentUser.getCourseId(), currentUser.getAssignmentId());
        console.log('submissions: ', submissionCount.count);
        //If submission count hasn't changed, the current session has not been completed
        if(submissionCount.attempt === currentSubmissions.attempt) {
            console.log('incomplete');
            alert('The assignment has not been completed!');
        } 
        else {
            console.log('assignment complete');
            alert('Congrauations on completing your assignment!');
            boxConnection.unlock();
            //Return to assignment screen
            if(boxConnection.isConnected()) {
                assignmentView(await getCourses(currentUser.getKey(),currentUser.getUrl()));
            }
            else {
                alert('Box disconnected! Returning to main menu.');
                loginMenu();
            }
        }
    })

    lock_div.appendChild(lock_header);
    lock_div.appendChild(assignment_name);
    lock_div.appendChild(completion_button);
    content.appendChild(lock_div);

}



// DATA OBJECTS
//Connection management
function connectionMonitor() {
    var connected = false;
    var port;
    var fail = false;
    const connect = async () => {
        //Prompt user for port connection
        port = await navigator.serial.requestPort();
        const ports = await navigator.serial.getPorts();
        console.log(port);
        console.log('readable: ',port.readable);
        //console.log(ports);
        if(port.readable || port.writable) {
            await port.close();
        }
        //Open connection with port, if error, do not toggle connection
        await port.open({baudRate: 115200})
        .catch((err) => {
            console.log('connection failed');
            fail = true;
        })
        .then(() => {
            if(!fail) {
                console.log('connection successful');
                connected = true;
                unlock();
                updateConnectionIndicator();
            }
        });        
    }
    const disconnect = () => {
        connected = false;
        unlock();
        updateConnectionIndicator();
    }
    const lock = async () => {
        //console.log(port);
        //Write '1' to the device
        if(connected) {
            const encoder = new TextEncoder();
            const writer = port.writable.getWriter();
            await writer.write(encoder.encode('1'));
            writer.releaseLock();
        }
    }
    const unlock = async () => {
        //console.log(port);
        //Write '0' to the device
        if(connected) {
            const encoder = new TextEncoder();
            const writer = port.writable.getWriter();
            await writer.write(encoder.encode('0'));
            writer.releaseLock();
        }
    }
    const isConnected = () => {return connected};
    return { connect, disconnect, isConnected, lock, unlock };
}


//User info management
function userInfo() {
    var data = {
        name : "",
        key : "",
        url : "",
        courseId: 0,
        assignmentId: 0,
        assignmentName: "",
    }
    const setName = (newName) => data.name = newName;
    const getName = () => data.name;
    const clearName = () => data.name = "";

    const setKey = (newKey) => data.key = newKey;
    const getKey = () => data.key;

    const setUrl = (newUrl) => data.url = newUrl;
    const getUrl = () => data.url;

    const setCourseId = (newCourseId) => data.courseId = newCourseId;
    const getCourseId = () => data.courseId;

    const setAssignmentId = (newAssignmentId) => data.assignmentId = newAssignmentId;
    const getAssignmentId = () => data.assignmentId;

    const setAssignmentName = (newAssignmentName) => data.assignmentName = newAssignmentName;
    const getAssignmentName = () => data.assignmentName;

    return { setName, getName, clearName, setKey, getKey, setUrl, getUrl, 
        setCourseId, getCourseId, setAssignmentId, getAssignmentId, setAssignmentName, getAssignmentName,
     };
}




//
//  HELPER FUNCTIONS
//
//Defines modal for pop up dialogs
(function modalSetup(){
    const dialog = document.querySelector('.modal');
    const modal = document.querySelector('.modal-container');
    //Prevents dialog from closing when clicking inside form
    modal.addEventListener('click', (event)=>event.stopPropagation());
    //Closes dialog if screen is clicked
    //dialog.addEventListener('click',()=> dialog.close());
})();

//Clears content of a container - pass in object
function clear(parent) {
    if(parent.hasChildNodes()) {
        /*const del = document.querySelectorAll(`.${parent.classList[0]} > *`);
        for(let i=0; i<del.length; i++) {
            parent.removeChild(del[i]);
        }*/
       parent.innerHTML = "";
    }
}

//Clears modal contents
function clearModal(){ 
    clear(document.querySelector('.modal-form'));
}

