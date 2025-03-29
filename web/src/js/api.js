//  API CALLS

//Get courses for current user
async function getCourses(key, url) {
    try {
        const response = await fetch(`${url}/api/v1/courses`, {
            method: "GET",
            headers: {
                "Authorization" : `Bearer ${key}`,
                'Accept': 'application/json',         
                'Content-Type': 'application/json'
            },
        })
        //Data returned in json file
        //.then(response => response.json())
        //.then(data => console.log(data))  //validation
        //.catch(error => console.log("Error: ", error));

        //console.log("Response status:", response.status);

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
async function getUser(url, key) {
    try {
        const response = await fetch(`${url}/api/v1/users/self/profile`, {
            method: "GET",
            headers: {
                "Authorization" : `Bearer ${key}`,
            }
        })

        //console.log("Response Status:", response.status);

        if(!response.ok) {
            throw new Error(`HTTP Error. Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error fetching data: ", error);
        return error;
    }
}
//Get assignments for a course code
async function getAssignments(url, key, courseID) {
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
        //console.log('assignment info:',data);
        return data;
    } catch (error) {
        console.error("Error fetching data: ", error);
        return error;
    }
}
//Get list of submissions for an assignment
async function getSubmissions(url, key, course_id, assignment_id) {
    let user = await getUser(url, key);
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

//Return a 2d array of each course and its assignments for the user
async function getCoursework(url, key, courses, user) {
    //Declare array
    let courseArray = new Array();
    //Iterate through courses
    for(let i=0; i<courses.length; i++) {
        const code = courses[i].id;
        //console.log('course codes: ', code);
        //Array for assignments
        //First index in array will have course information
        let assignmentArray = new Array(courses[i]);
        //Get all assignments for each course
        let assignments = await getAssignments(url, key, code, user);
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

export { getCourses, getUser, getSubmissions, getCoursework };