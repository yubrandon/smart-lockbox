const header = document.querySelector('.header');
const content = document.querySelector('.content');
const footer = document.querySelector('.footer');

//test code
/*const text = document.createElement('h1');
text.innerText = "Hello World!";
header.appendChild(text);*/

//Function importing not working, will have to write all code in this file unless solution is found
//use following searches to get to sections:
// UI SECTION, MENU SECTION, CANVAS SECTION, BLUETOOTH SECTION, BOX SECTION
//window.electron.loginMenu();











//
//  UI SECTION | MENU SECTION
//

//Used to update the status indicator in the header
//Arguments: 0 for disconnected, 1 for unlocked, 2 for locked
(function connectionIndicator(state) {
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
    text.innerText = "Current Status: ";
    //Change indicator based on state
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
    //Append elements to div
    connectionDiv.appendChild(circle);
    connectionDiv.appendChild(text);
    header.appendChild(connectionDiv);
    
})(0);

//Displays the main login menu to connect to Canvas or set task
(function loginMenu() {
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
})();

(function bluetoothButton(){
    clear(footer);
    //Create div
    const bluetooth_div = document.createElement('div');
    bluetooth_div.classList.add('bluetooth-div');
    //Create button
    const bluetooth_btn = document.createElement('button');
    bluetooth_btn.classList.add('bluetooth-button');
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






//
//  CANVAS SECTION
//
(function modalSetup(){
    const dialog = document.querySelector('.modal');
    const modal = document.querySelector('.modal-container');
    //Prevents dialog from closing when clicking inside form
    modal.addEventListener('click', (event)=>event.stopPropagation());
    //Closes dialog if screen is clicked
    dialog.addEventListener('click',()=> dialog.close());
})();

function login() {
    clearModal();

    const field = document.querySelector('.modal-field');

    //Create title for modal
    const modal_header = document.querySelector('.modal-header');
    const title_div = document.createElement('div');
    const title = document.createElement('h4');
    title.innerText = "Enter Details Below";
    title.classList.add('modal-title');
    title_div.appendChild(title);
    modal_header.appendChild(title_div);
    
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
    url_form.placeholder = "URL";
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

    const form = document.querySelector('#modal-form');
    //Upon submission of form, perform following logic
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); //enable to stop refresh for testing
        //Get values from input fields
        const key = document.querySelector('#key').value;
        let url = document.querySelector('#url').value;
        //If url doesn't have scheme (only ip) add it in manually
        if(url[0] != 'h') url = 'http://' + url;
        if(url[url.length-1] == '/') url = url.slice(0,url.length-1);
        //Console.log(`${url}/api/v1/courses`);
        
        const dialog = document.querySelector('.modal');
        //Pass inputs to function, returns json
        const courseData = await getCourses(key,url);
        //Console.log(courseData);

        //Check for error
        if(courseData instanceof Error) {
            //Clears fields
            form.reset();
            
            alert('Login Error! Check your access code or URL.');
        }
        else {
            //Get user data
            const user = await getUser(key, url);
            //Console.log(user);
            addUser(user);

            form.reset();
            dialog.close();

            //Pass information to assignnments screen
            assignmentView(key, url, courseData);
        }
    })

    field.appendChild(submit_div);
}
async function getCourses(key, url) {
    //API call to get courses for current user
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
function addUser(user) {
    //Display name of logged in user at top

    //TODO: create function to get current box status OR check box status after connecton with box is set up
    //          - clear header and readd status indicator
    //          - current bug where dupe names can appear

    //Create object
    const nameDiv = document.createElement('div');
    const name = document.createElement('h3');
    name.classList.add('header-name');
    name.innerText = "Student: " + user.sortable_name;
    nameDiv.appendChild(name);

    //TODO: add logout button

    header.appendChild(nameDiv);
}
async function getUser(key, url) {
    //API call to get user info to add to header
    try {
        const response = await fetch(`${url}/api/v1/users/self/profile`, {
            method: "GET",
            headers: {
                "Authorization" : `Bearer ${key}`,
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
//New screen to show assignments to select
async function assignmentView(key, url, courseData) {   //TODO: ADD STYLING AND BUTTON TO GO TO NEXT SCREEN
    clear(content);
    //Fetch 2d array of courses and assignments
    const courseWork = await getCoursework(key, url, courseData);
    console.log(courseWork);
    //Iterate through array and create div for each course
    for(let i = 0; i<courseWork.length; i++) {
        const courseDiv = document.createElement('div');
        courseDiv.classList.add('course-div');

        const courseHeader = document.createElement('div');
        courseHeader.classList.add('course-header');
        const courseText = document.createElement('h2');
        courseText.innerText = "Course:" + courseWork[i][0].name;
        //Add interactable arrow next to course name

        courseHeader.appendChild(courseText);
        courseDiv.appendChild(courseHeader);

        const assignmentContainer = document.createElement('div');
        assignmentContainer.classList.add('course-assignments');

        //Iterate through nested array to get assignments for course
        for(let j=1; j<courseWork[i].length; j++) {
            let sub = await getSubmissions(key, url,courseWork[i][0].id, courseWork[i][j].id);
            console.log(sub);
            if(sub.attempt != courseWork[i][j].allowed_attempts || courseWork[i][j].allowed_attempts == -1) {
                const assignmentDiv = document.createElement('div');
                assignmentDiv.classList.add('assignment-div');
                const assignmentName = document.createElement('h3');
                assignmentName.classList.add('assignment-name');
                assignmentName.innerText = courseWork[i][j].name;
                assignmentDiv.appendChild(assignmentName);
    
                //Add button that appears when div is active to choose a specific assignment
                
                assignmentContainer.appendChild(assignmentDiv);
            }
        }
        //Add to body
        courseDiv.appendChild(assignmentContainer);
        content.appendChild(courseDiv);
    }

}

//Return a 2d array of each course and its assignments for the user
async function getCoursework(key, url, courses) {
    //Declare array
    let courseArray = new Array();
    //Iterate through courses
    for(let i=0; i<courses.length; i++) {
        const code = courses[i].id;
        //Array for assignments
        //First index in array will have course information
        let assignmentArray = new Array(courses[i]);
        //Get all assignments for each course
        let assignments = await getAssignments(key, url, code);
        //Push all assignment objects into array
        for(let j=0; j<assignments.length; j++) {
            assignmentArray.push(assignments[j]);
        }
        //Push assignment array into course array
        courseArray.push(assignmentArray);
        console.log(assignments);
    }
    //Console.log(courseArray);
    return courseArray;
}
async function getAssignments(key, url, courseID) {
    //API call to get assignments for a course code
    try {
        const response = await fetch(`${url}/api/v1/courses/${courseID}/assignments`, {
            method: "GET",
            headers: {
                "Authorization" : `Bearer ${key}`,
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
async function getSubmissions(key, url,course_id, assignment_id) {
    //Get list of submissions for an assignment
    let user = await getUser(key,url);
    try {
        const response = await fetch(`${url}/api/v1/courses/${course_id}/assignments/${assignment_id}/submissions/${user.id}`, {
            method: "GET",
            headers: {
                "Authorization" : `Bearer ${key}`,
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
//TODO: 
//NEXT SCREEN AFTER SELECTING ASSIGNMENT




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

//Clears content of a container - pass in object
function clear(parent) {
    if(parent.hasChildNodes()) {
        const del = document.querySelectorAll(`.${parent.classList[0]} > div`);
        for(let i=0; i<del.length; i++) {
            parent.removeChild(del[i]);
        }
    }
}

//Clears modal contents
function clearModal(){ 
    clear(document.querySelector('.modal-header'));
    clear(document.querySelector('.modal-field'));
}