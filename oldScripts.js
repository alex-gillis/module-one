// const pages = require('./moduleOne.json');
// console.log(pages);
const storyJSON = '../../moduleOne.json';
let pages; 
let pageNum = 0;
let listChoices = "";
let storyDetails = "";

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

function popChoices(result) {
    pages = result;
    // storyDetails = pages[pageNum].story;
    // console.log(pages[pageNum].story);
    // for (let i = 0; i < pages[pageNum].choices.length; i++) {
    //     if (i >= 1) {
    //         listChoices += "<p id=\"demo\" onclick=\"myFunction()\" class=\"choice\">" + pages[pageNum].choices[i].option + "</p>";
    //     } else {
    //         listChoices += "</br>" + pages[pageNum].choices[i].option;
    //     }
    // }
    // document.getElementById("choices").innerHTML = listChoices;


}

function main() {
    getJSONData(storyJSON, popChoices, onError);

    let myChoices = document.getElementById("choices");

    // myChoices.innerHTML = popChoices(1);
}

main();