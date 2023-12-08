// test function
function myFunction() {
    document.getElementById("demo").innerHTML = "YOU MADE YOUR CHOICE!";
}

function getJSONData(retrieveScript, success, failure) {
    fetch(retrieveScript)
        .then(response => response.json())
        .then(jsonData => success(jsonData))
        .catch(err => failure());
}

function onError() {
    console.log("*** Error has occured during AJAX data transmission");
}