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
        connection_badge.classList.add('bg-success');
        connection_badge.innerText += 'Connected';
    } 
    else {
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
    canvas_btn.classList.add('btn','btn-lg', 'bg-secondary-subtle', 'border', 'border-dark');
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

(function bluetoothButton(){
    const footer = document.querySelector('.footer-right');
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
    const form = document.querySelector('#submit');
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
        
        const dialog = document.querySelector('.modal');
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

            //console.log(user);
            addUser();
            //close the dialogue

            //Pass information to assignments screen
            assignmentView(courseData);
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
            let sub = await getSubmissions(currentUser.getUrl(), currentUser.getKey(), course.id, assignment.id);
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
    const modal_title = document.querySelector('.modal-title');
    modal_title.innerText = "Place your device in the box and close the cover";

    const field = document.querySelector('.modal-field');
    const buttonDiv = document.createElement('div');
    buttonDiv.classList.add('modal-locking-div');

    const confirmButton = document.createElement('button');
    confirmButton.classList.add('modal-locking-button');
    confirmButton.innerText = "Confirm";
    confirmButton.addEventListener('click', async (event) => {
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
        boxConnection.lock();
        dialog.close();
        lockedView();
        setTimeout(lockedView, 5 * 1000);
    }, { once: true });

    buttonDiv.appendChild(confirmButton);
    field.appendChild(buttonDiv);
}

//Screen while locked
async function lockedView() {
    //console.log("course, assignment, name:", currentUser.getCourseId(), currentUser.getAssignmentId(), currentUser.getAssignmentName());

    clear(content);
    //Track current number of submissions
    const currentSubmissions = await getSubmissions(currentUser.getUrl(), currentUser.getKey(), currentUser.getCourseId(), currentUser.getAssignmentId());
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
        const submissionCount = await getSubmissions(currentUser.getUrl(), currentUser.getKey(), currentUser.getCourseId(), currentUser.getAssignmentId());
        console.log('submissions: ', submissionCount);
        //If submission count hasn't changed, the current session has not been completed
        if(submissionCount.attempt === currentSubmissions.attempt) {
            console.log('incomplete');
            alert('The assignment has not been completed!');
        } 
        else {
            console.log('assignment complete');
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
    }, {once: true})

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
    const connect = async () => {
        port = await navigator.serial.requestPort();
        //const ports = await navigator.serial.getPorts();
        console.log(port);
        console.log('readable: ',port.readable);
        connected = true;
        if(port.readable.locked) {
            console.log('okay');
        }
        //console.log(ports);
        if(port.readable || port.writable) {
            await port.close();
        }
        await port.open({baudRate: 115200});
        unlock();
        refreshHeader();
    }
    const disconnect = () => {
        connected = false;
        unlock();
        refreshHeader();
    }
    const lock = async () => {
        console.log(port);
        const encoder = new TextEncoder();
        const writer = port.writable.getWriter();
        await writer.write(encoder.encode('1'));
        writer.releaseLock();
    }
    const unlock = async () => {
        console.log(port);
        const encoder = new TextEncoder();
        const writer = port.writable.getWriter();
        await writer.write(encoder.encode('0'));
        writer.releaseLock();
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

//Update changes in header
function refreshHeader() {
    updateConnectionIndicator();
    if(currentUser.getName() != "") addUser();
}


