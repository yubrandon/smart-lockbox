function clear() {
    const body = document.querySelector('.container');
    if(body.hasChildNodes()) {
        let temp = document.querySelectorAll('.container > div');
        for(let i = 0; i < temp.length; i++) {
            body.removeChild(temp[i]);
        }
    }
}

export default clear;