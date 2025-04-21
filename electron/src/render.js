const header = document.querySelector('.header');
const content = document.querySelector('.content');
const footer = document.querySelector('.footer');

const { getCourses, getUser, getSubmissions, getCoursework } = require('./js/api.js');
const { connectSerial, lockSerial, unlockSerial } = require('./js/serial.js');
const boxConnection = connectionMonitor();
const currentUser = userInfo();


//
//  UI/MENU
//


//Used to update the status indicator in the header
function updateConnectionIndicator() {
    clear(header);
    //Create div
    const connection_div = document.createElement('div');
    connection_div.classList.add('indicator-div');
    //Create canvas for shape
    const circle = document.createElement('canvas');
    circle.classList.add('indicator-circle');
    //Dimensions
    const X = 60;
    const Y = 40;
    circle.width = X;
    circle.height = Y;

    //Create circle
    const ctx = circle.getContext("2d");
    ctx.scale(X / Y, 1);
    ctx.beginPath();
    ctx.arc(X/4, Y/2, 5, 0, 2 * Math.PI);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.stroke();
    
    //Create text
    const text = document.createElement('h3');
    text.classList.add('connection-text');
    //Change indicator based on state
    if(boxConnection.isConnected()) {
        ctx.fillStyle = "#40FF00";
        ctx.fill();
        text.innerText += 'Connected';
    } 
    else {
        ctx.fillStyle = "#D9D9D9";
        ctx.fill();
        text.innerText = 'Disconnected';
    }
            
    //Append elements to div
    connection_div.appendChild(circle);
    connection_div.appendChild(text);
    header.appendChild(connection_div);
}

//Displays the main login menu to connect to Canvas or set task
function loginMenu() {
    //Refresh indicator
    updateConnectionIndicator();
    
    clear(content);
    const dialog = document.querySelector('.modal');

    //Create div
    const canvas = document.createElement('div');
    canvas.classList.add('canvas-login');
    //Create button
    const canvas_btn = document.createElement('button');
    canvas_btn.classList.add('canvas-login-button')

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

    //Call login when canvas button is clicked
    canvas_btn.addEventListener('click', ()=> {
        login();
        dialog.showModal();
    });

    //Append button to div
    canvas.appendChild(canvas_btn);
    //Append div to body
    content.appendChild(canvas);
}
loginMenu();

clear(footer);
(function bluetoothButton(){
    //Create div
    const bluetooth_div = document.createElement('div');
    bluetooth_div.classList.add('bluetooth-div');
    //Create button
    const bluetooth_btn = document.createElement('button');
    bluetooth_btn.classList.add('bluetooth-button');
    bluetooth_btn.addEventListener('click', () => {
        if(boxConnection.isConnected()) boxConnection.disconnect();
        else boxConnection.connect();
    })

    //Create image
    const bluetooth_icon = document.createElement('img');
    bluetooth_icon.classList.add('bluetooth-icon');
    bluetooth_icon.src = "./static/bluetooth.png";
    //Create text
    const bluetooth_text = document.createElement('h3');
    bluetooth_text.classList.add('bluetooth-text');
    bluetooth_text.innerText = "Link my Box";
    //Append elements to button
    bluetooth_btn.appendChild(bluetooth_icon);
    bluetooth_btn.appendChild(bluetooth_text);
    //Append button to div
    bluetooth_div.appendChild(bluetooth_btn);
    //Append div to footer
    footer.appendChild(bluetooth_div);

})();

(function connectBtn(){
    //create div
    const connect_div = document.createElement('div');
    connect_div.classList.add('connect-div');
    //Create button
    const connect_btn = document.createElement('button');
    connect_btn.classList.add('connect-button');
    connect_btn.innerText = "Connect";
    connect_btn.id = 'connect-button';

    // Blah
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

            console.log('Connected to device: ' + device.name);

            const server = await device.gatt.connect();
            console.log('Connected to GATT server');

            disconnectBtn.disabled = false;
            connectBtn.disabled = true;
            connectBtn.innerText = 'Connected';

            device.addEventListener('gattserverdisconnected', () => {
                console.log('Device disconnected');
                disconnectBtn.disabled = true;
                connectBtn.disabled = false;
                connectBtn.innerText = 'Connect';
            });

            window.currentBLEDevice = device;

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
    //Blah

    //Append button to div
    connect_div.appendChild(connect_btn);
    //Append div to footer
    footer.appendChild(connect_div);
})();

(function disconnectBtn(){
    //create div
    const disconnect_div = document.createElement('div');
    disconnect_div.classList.add('disconnect-div');
    //Create button
    const disconnect_btn = document.createElement('button');
    disconnect_btn.classList.add('disconnect-button');
    disconnect_btn.innerText = "Disconnect";
    disconnect_btn.id = 'disconnect-button';

    //blah
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

//Display name of logged in user at top
function addUser() {
    //Refresh indicator
    updateConnectionIndicator();

    //Create object
    const name_div = document.createElement('div');
    name_div.classList.add('header-name');
    const name = document.createElement('h3');
    name.classList.add('header-name');
    name.innerText = "Student: " + currentUser.getName();

    const logout = document.createElement('button');
    logout.classList.add('logout-button');
    logout.innerText = 'Log out';
    logout.addEventListener('click', () => {
        currentUser.clearName();
        loginMenu();

    })

    name_div.appendChild(name);
    name_div.appendChild(logout);

    header.appendChild(name_div);
}





//
//  CANVAS ASSIGNMENT NAVIGATION
//

function login() {
    //Fill modal with fields for login
    loginModal();

    //Handle form submission
    const form = document.querySelector('#modal-form');
    //Upon submission of form, check form values and login if valid
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); //Enable to stop refresh
        //Get values from input fields
        const key = document.querySelector('#key').value;
        let url = document.querySelector('#url').value;
        //If url doesn't have scheme (only ip) add it in manually
        if(url[0] != 'h') url = 'http://' + url;
        if(url[url.length-1] == '/') url = url.slice(0,url.length-1);
        //console.log(`${url}/api/v1/courses`);
        
        const dialog = document.querySelector('.modal');
        //Pass inputs to function, returns json
        const courseData = await getCourses(key,url);
        //Console.log(courseData);

        var pressed = false;
        //Check for error
        if(courseData instanceof Error) {
            //Clears fields
            form.reset();
            
            alert('Login Error! Check your access code or URL.');
        }
        else {
            pressed = true;
            //Store data and get Canvas information for student
            currentUser.setKey(key);
            currentUser.setUrl(url);
            const user = await getUser();
            currentUser.setName(user.name);

            //console.log(user);
            addUser();

            form.reset();
            dialog.close();

            //Pass information to assignments screen
            assignmentView(courseData);
            pressed = false;
        }
        //Event listener will clean itself up upon next screen being displayed
    }, { once: true });
}


//New screen to show assignments to select
async function assignmentView(courseData) {
    clear(content);
    //Fetch 2d array of courses and assignments
    const courseWork = await getCoursework(courseData);
    //console.log(courseWork);
    //Iterate through array and create div for each course
    for(let i = 0; i<courseWork.length; i++) {
        const course = courseWork[i][0];
        const course_div = document.createElement('div');
        course_div.classList.add('course-div');

        const courseHeader = document.createElement('div');
        courseHeader.classList.add('course-header-div');
        const courseText = document.createElement('h2');
        courseText.classList.add('course-header');
        courseText.innerText = "Course:" + course.name;
        //Add interactable arrow next to course name

        courseHeader.appendChild(courseText);
        course_div.appendChild(courseHeader);

        const assignment_container = document.createElement('div');
        assignment_container.classList.add('course-assignments');

        //Iterate through nested array to get assignments for course
        for(let j=1; j<courseWork[i].length; j++) {
            const assignment = courseWork[i][j];
            let sub = await getSubmissions(course.id, assignment.id);
            //console.log(sub);
            if(sub.attempt != assignment.allowed_attempts || assignment.allowed_attempts == -1) {
                const assignment_div = document.createElement('div');
                assignment_div.classList.add('assignment-div');
                const assignment_header = document.createElement('h3');
                assignment_header.classList.add('assignment-name');
                const assignmentName = assignment.name
                assignment_header.innerText = assignmentName;
                assignment_div.appendChild(assignment_header);
    
                //Add button that appears when div is active to choose a specific assignment
                const assignment_button_div = document.createElement('div');
                assignment_button_div.classList.add('assignment-button-div');
                const assignment_select = document.createElement('button');
                const dialog = document.querySelector('.modal');
                assignment_select.addEventListener('click', (event) => {
                    //console.log("course, assignment, name:", course.id, assignment.id, assignmentName)
                    currentUser.setCourseId(course.id);
                    currentUser.setAssignmentId(assignment.id);
                    currentUser.setAssignmentName(assignmentName);
                    //console.log('assignment chosen');
                    if(boxConnection.isConnected()) {
                        //Display confirmation
                        event.preventDefault();
                        confirmationModal(assignmentName);
                        dialog.showModal();
                    }
                    else {
                        //Indicate error
                        alert('Box not connected!');
                    }
                });
                assignment_select.classList.add('assignment-button');
                const select_text = document.createElement('p');
                select_text.innerText = 'Select';
                select_text.classList.add('assignment-button-text');

                assignment_select.appendChild(select_text);
                assignment_button_div.appendChild(assignment_select);
                assignment_div.appendChild(assignment_button_div);
                assignment_container.appendChild(assignment_div);
            }
        }
        //Add to body
        course_div.appendChild(assignment_container);
        content.appendChild(course_div);
    }

}
//Screen while locking
async function lockedView() {
    //console.log("course, assignment, name:", currentUser.getCourseId(), currentUser.getAssignmentId(), currentUser.getAssignmentName());

    clear(content);
    //Track current number of submissions
    const currentSubmissions = await getSubmissions(currentUser.getCourseId(), currentUser.getAssignmentId());
    console.log(currentSubmissions);

    //Display current assignment and add button
    const lock_div = document.createElement('div');
    lock_div.classList.add('lock-screen-div');

    const lock_header = document.createElement('h4');
    lock_header.classList.add('lock-screen-header');
    lock_header.innerText = 'Current assignment:';

    const assignment_name = document.createElement('h1');
    assignment_name.classList.add('lock-screen-name');
    assignment_name.innerText = `${currentUser.getAssignmentName()}`;

    const completion_button = document.createElement('button');
    completion_button.classList.add('lock-screen-button');
    completion_button.innerText = 'Assignment Completed';
    completion_button.addEventListener('click', async () => {
        //Check completion
        const submissionCount = await getSubmissions(currentUser.getCourseId(), currentUser.getAssignmentId());
        console.log(submissionCount);
        //If submission count hasn't changed, the current session has not been completed
        if(submissionCount.attempt === currentSubmissions.attempt) {
            console.log('incomplete');
            alert('The assignment has not been completed!');
        } 
        else {
            console.log('assignment complete');
            setTimeout(boxConnection.unlock, 5 * 1000);
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



//Add fields for login process
function loginModal(){
    clearModal();

    //Create title for modal
    const modal_header = document.querySelector('.modal-header');
    const title_div = document.createElement('div');
    const title = document.createElement('h4');
    title.innerText = "Enter Details Below";
    title.classList.add('modal-title');
    title_div.appendChild(title);
    modal_header.appendChild(title_div);

    const field = document.querySelector('.modal-field');

    //Create field for api token input
    const key_div = document.createElement('div');
    key_div.classList.add('form');
    const key_form = document.createElement('input');
    key_form.type = "text";
    key_form.id = "key";
    key_form.name = "key"; 
    key_form.placeholder = "Access Token";
    key_div.appendChild(key_form);
    field.appendChild(key_div);

    //Create field for url input
    const url_div = document.createElement('div');
    url_div.classList.add('form');
    const url_form = document.createElement('input');
    url_form.type = "text";
    url_form.id = "url";
    url_form.name = "url";
    url_form.placeholder = "Dashboard URL";
    url_div.appendChild(url_form);
    field.appendChild(url_div);

    //Create button for form submission
    const submit_div = document.createElement('div');
    submit_div.classList.add('submit-div')

    const submit_btn = document.createElement('button');
    submit_btn.id = "submit";
    submit_btn.name = "submit";
    submit_btn.classList.add('submit-btn');
    submit_btn.innerText = "Submit";
    submit_div.appendChild(submit_btn);

    field.appendChild(submit_div);
}

async function confirmationModal(assignment) {
    clearModal();

    //Change header title
    const modal_header = document.querySelector('.modal-header');
    const header = document.createElement('h4');
    header.innerText = "Assignment Confirmation";
    modal_header.appendChild(header);
    
    //Add assignment selected
    const assignmentName = document.createElement('h2');
    assignmentName.innerText = `${assignment}`;
    modal_header.appendChild(assignmentName);

    const field = document.querySelector('.modal-field');
    const selectionButtons = document.createElement('div');
    selectionButtons.classList.add('modal-buttons-div')
    //Add buttons to confirm
    const confirmButton = document.createElement('button');
    confirmButton.classList.add('modal-assignment-confirm');
    confirmButton.innerText = 'Confirm';
    const dialog = document.querySelector('.modal');
    confirmButton.addEventListener('click', (event) => {
        if(!boxConnection.isConnected()) {
            alert('Box disconnected! Returning to main menu.');
            dialog.close();
            loginMenu();
            return;
        }
        event.preventDefault();
        promptLocking();
    }, { once: true });
    selectionButtons.appendChild(confirmButton);
    const rejectButton = document.createElement('button');
    rejectButton.classList.add('modal-assignment-reject');
    rejectButton.innerText = 'Cancel';
    rejectButton.addEventListener('click', (event) => {
        event.preventDefault();
        //Close the modal if user rejects
        dialog.close();
    }, { once: true });

    selectionButtons.appendChild(rejectButton);

    field.appendChild(selectionButtons);
}
//After confirmation, prompt user to place their device in the box
function promptLocking() {
    clearModal(); 

    //Change header title
    const modal_header = document.querySelector('.modal-header');
    const header = document.createElement('h4');
    header.innerText = "Place your device in the box and close the cover";
    modal_header.appendChild(header);

    const field = document.querySelector('.modal-field');
    const buttonDiv = document.createElement('div');
    buttonDiv.classList.add('modal-locking-div');

    const confirmButton = document.createElement('button');
    confirmButton.classList.add('modal-locking-button');
    confirmButton.innerText = "Confirm";
    confirmButton.addEventListener('click', (event) => {
        event.preventDefault();
        const dialog = document.querySelector('.modal');
        //console.log('Locking...');
        if(!boxConnection.isConnected()) {
            alert('Box disconnected! Returning to main menu.');
            dialog.close();
            loginMenu();
            return;
        }
        //set delay according to time for solenoid to extend
        setTimeout(boxConnection.lock, 5 * 1000);
        //boxConnection.lock();
        dialog.close();
        lockedView();
    }, { once: true });

    buttonDiv.appendChild(confirmButton);
    field.appendChild(buttonDiv);
}





// DATA OBJECTS
//Connection management
function connectionMonitor() {
    var connected = false;
    var port;
    const connect = () => {
        connected = true;
        port = connectSerial();
        refreshHeader();
    }
    const disconnect = () => {
        connected = false;
        refreshHeader();
    }
    const lock = () => {
        serialLock(port);
    }
    const unlock = () => {
        serialUnlock(port);
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
    clear(document.querySelector('.modal-header'));
    clear(document.querySelector('.modal-field'));
}

//Update changes in header
function refreshHeader() {
    clear(header);
    updateConnectionIndicator();
    if(currentUser.getName() != "") addUser();
}


