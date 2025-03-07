const header = document.querySelector('.header');
const content = document.querySelector('.content');
const footer = document.querySelector('.footer');

//test code
/*const text = document.createElement('h1');
text.innerText = "Hello World!";
header.appendChild(text);*/

//Function importing not working, will have to write all code in this file unless solution is found
//Separated into sections: UI/MENU , CANVAS, BLUETOOTH, BOX
//window.electron.loginMenu();










// DATA OBJECTS

//Connection management
function connectionMonitor() {
    var connected = false;
    const connect = () => {
        connected = true;
        refreshHeader();
    }
    const disconnect = () => {
        connected = false;
        refreshHeader();
    }
    const isConnected = () => {return connected};
    return { connect, disconnect, isConnected };
}
const boxConnection = connectionMonitor();

//User info management
function userInfo() {
    var data = {
        name : "",
        key : "",
        url : "",
    }
    const setName = (newName) => data.name = newName;
    const getName = () => data.name;
    const clearName = () => data.name = "";

    const setKey = (newKey) => data.key = newKey;
    const getKey = () => data.key;
    const clearKey = () => data.key = "";

    const setUrl = (newUrl) => data.url = newUrl;
    const getUrl = () => data.url;
    const clearUrl = () => data.url = "";

    return { setName, getName, clearName, setKey, getKey, clearKey, setUrl, getUrl, clearUrl };
}
const currentUser = userInfo();

//
//  UI/MENU
//


//Used to update the status indicator in the header
function updateConnectionIndicator() {
    clear(header);
    //Create div
    const connectionDiv = document.createElement('div');
    connectionDiv.classList.add('indicator-div');
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
    connectionDiv.appendChild(circle);
    connectionDiv.appendChild(text);
    header.appendChild(connectionDiv);
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
    canvas_icon.src = "./assets/canvas.png";
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

(function bluetoothButton(){
    clear(footer);
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
    bluetooth_icon.src = "./assets/bluetooth.png";
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

//Display name of logged in user at top
function addUser() {
    //Refresh indicator
    updateConnectionIndicator();

    //Create object
    const nameDiv = document.createElement('div');
    nameDiv.classList.add('header-name');
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

    nameDiv.appendChild(name);
    nameDiv.appendChild(logout);

    header.appendChild(nameDiv);
}
//Update changes in header
function refreshHeader() {
    clear(header);
    updateConnectionIndicator();
    if(currentUser.getName() != "") addUser();
}




//
//  CANVAS
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
        const courseDiv = document.createElement('div');
        courseDiv.classList.add('course-div');

        const courseHeader = document.createElement('div');
        courseHeader.classList.add('course-header-div');
        const courseText = document.createElement('h2');
        courseText.classList.add('course-header');
        courseText.innerText = "Course:" + courseWork[i][0].name;
        //Add interactable arrow next to course name

        courseHeader.appendChild(courseText);
        courseDiv.appendChild(courseHeader);

        const assignmentContainer = document.createElement('div');
        assignmentContainer.classList.add('course-assignments');

        //Iterate through nested array to get assignments for course
        for(let j=1; j<courseWork[i].length; j++) {
            let sub = await getSubmissions(courseWork[i][0].id, courseWork[i][j].id);
            //console.log(sub);
            if(sub.attempt != courseWork[i][j].allowed_attempts || courseWork[i][j].allowed_attempts == -1) {
                const assignmentDiv = document.createElement('div');
                assignmentDiv.classList.add('assignment-div');
                const assignmentHeader = document.createElement('h3');
                assignmentHeader.classList.add('assignment-name');
                const assignmentName = courseWork[i][j].name
                assignmentHeader.innerText = assignmentName;
                assignmentDiv.appendChild(assignmentHeader);
    
                //Add button that appears when div is active to choose a specific assignment
                const assignmentButton = document.createElement('div');
                assignmentButton.classList.add('assignment-button-div');
                const selectButton = document.createElement('button');
                const dialog = document.querySelector('.modal');
                selectButton.addEventListener('click', (event) => {
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
                selectButton.classList.add('assignment-button');
                const selectText = document.createElement('p');
                selectText.innerText = 'Select';
                selectText.classList.add('assignment-button-text');

                selectButton.appendChild(selectText);
                assignmentButton.appendChild(selectButton);
                assignmentDiv.appendChild(assignmentButton);
                assignmentContainer.appendChild(assignmentDiv);
            }
        }
        //Add to body
        courseDiv.appendChild(assignmentContainer);
        content.appendChild(courseDiv);
    }

}

//Return a 2d array of each course and its assignments for the user
async function getCoursework(courses) {
    //Declare array
    let courseArray = new Array();
    //Iterate through courses
    for(let i=0; i<courses.length; i++) {
        const code = courses[i].id;
        //Array for assignments
        //First index in array will have course information
        let assignmentArray = new Array(courses[i]);
        //Get all assignments for each course
        let assignments = await getAssignments(code);
        //Push all assignment objects into array
        for(let j=0; j<assignments.length; j++) {
            assignmentArray.push(assignments[j]);
        }
        //Push assignment array into course array
        courseArray.push(assignmentArray);
        //console.log(assignments);
    }
    //Console.log(courseArray);
    return courseArray;
}







//
//  BLUETOOTH
//
//TO DO: BLUETOOTH CONNECTION PROCESS
//CHECK CURRENTLY CONNECTED DEVICES OR SEARCH FOR BLUETOOTH DEVICES
//LET USER SELECT DEVICE
//ESTABLISH CONNECTION




//
//  BOX 
//

//*ASSUMES BLUETOOTH CONNECTION WITH BOX ESTABLISHED*
//CODE TO CONTROL BOX LOCK/COMMUNICATION









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

function confirmationModal(assignment) {
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
    confirmButton.addEventListener('click', (event) => {
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
        const dialog = document.querySelector('.modal');
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
        //Go to locked view
    }, { once: true });

    buttonDiv.appendChild(confirmButton);
    field.appendChild(buttonDiv);
}


//
//  API CALLS
//

//Get courses for current user
async function getCourses(key, url) {
    try {
        const response = await fetch(`${url}/api/v1/courses`, {
            method: "GET",
            headers: {
                "Authorization" : `Bearer ${key}`,
            }
        })
        //Data returned in json file
        //.then(response => response.json())
        //.then(data => console.log(data))  //validation
        //.catch(error => console.log("Error: ", error));
        if(!response.ok) {
            throw new Error(`HTTP Error. Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data: ", error);
        return error;
    }
}
//Get user info to add to header
async function getUser() {
    try {
        const response = await fetch(`${currentUser.getUrl()}/api/v1/users/self/profile`, {
            method: "GET",
            headers: {
                "Authorization" : `Bearer ${currentUser.getKey()}`,
            }
        })
        if(!response.ok) {
            throw new Error(`HTTP Error. Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data: ", error);
        return error;
    }
}
//Get assignments for a course code
async function getAssignments(courseID) {
    try {
        const response = await fetch(`${currentUser.getUrl()}/api/v1/courses/${courseID}/assignments`, {
            method: "GET",
            headers: {
                "Authorization" : `Bearer ${currentUser.getKey()}`,
            }
        })
        if(!response.ok) {
            throw new Error(`HTTP Error. Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data: ", error);
        return error;
    }
}
//Get list of submissions for an assignment
async function getSubmissions(course_id, assignment_id) {
    let user = await getUser();
    try {
        const response = await fetch(`${currentUser.getUrl()}/api/v1/courses/${course_id}/assignments/${assignment_id}/submissions/${user.id}`, {
            method: "GET",
            headers: {
                "Authorization" : `Bearer ${currentUser.getKey()}`,
            }
        })
        if(!response.ok) {
            throw new Error(`HTTP Error. Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data: ", error);
        return error;
    }
}