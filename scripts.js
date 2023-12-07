const pages = require('./moduleOne.json');
console.log(pages);

// test function
function myFunction() {
    document.getElementById("demo").innerHTML = "YOU MADE YOUR CHOICE!";
}

function main() {
    console.log(pages[0].story)
}

main();