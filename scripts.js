const storyJSON = '../../moduleOne.json';
let myPages; 
let myChoices;
let myStory;
let myHealth;
let myOxygen;
let myProfit;

let currentHealth = 3;
let currentO2 = 100;
let totalProfit = 0;

let playersPath = [];

// test functions
/* 
    function myFunction() { document.getElementById("demo").innerHTML 
        = "<button id=\"demo\" class=\"choices\" onclick=\"myTest()\">
        YOU MADE YOUR CHOICE!</button>"; }
*/
// function myTest() { console.log("*** Button is operating as it should"); }

function forFors() {
    // console.log('---POP---', result)

    // --- Sample of looping over objectts ---
    // console.log('---Object.keys---', Object.keys(result)) // ['fieldA', 'fieldB']
    // console.log('---Object.values---', Object.values(result)) // [ 'something', 'some other thing' ]
    // console.log('---Object.entries---', Object.entries(result)) // [ [ 'fieldA', 'something' ], [ 'fieldB', 'some other thing' ] ]

    // const resultKeyArray = Object.keys(result)
    // for (let i = 0; i < resultKeyArray.length; i++) {
    //     console.log('result---', result[resultKeyArray[i]])
    // }

    // for (const key of resultKeyArray) {
    //     console.log('result2---', result[key])
    // }

    // for (const key in result) {
    //     console.log('result3---', result[key])
    // }

    // /*
    //     let result = {
    //         fieldA: 'something',
    //         fieldB: 'some other thing'
    //     }
    // result[fieldA]
    // */
    // // Laurtann is here

    // --- Sample of nested for loops ---
    // pages is an arr of obj. within each obj, there is a key called choices. Choices is an array.

    const testPageSingular = {
        choices: ['0', '1', '2']
    }
    const testPageSingular2 = {
        choices: [...testPageSingular.choices, '3']
    }
    const testPages = [testPageSingular, testPageSingular2]
    // for (let i = 0; i < testPages.length; i++) {
    //     console.log('---testPages[i]---', testPages[i])
    //     for (let j = 0; j < testPages[i].choices.length; j++) {
    //         console.log('---innerLoop---', testPages[i].choices[j])
    //     }
    // }

    for (const myPage of testPages) {
        console.log('---outerloop---', myPage)
        for (const myChoice of myPage.choices) {
            console.log('---innerloop---', myChoice)
        }
    };
}

function getJSONData(retrieveScript, success, failure) {
    fetch(retrieveScript)
        .then(function(response) {
            // console.log(response);
            return response.json();
        })
        .then(function(jsonData) {
            // console.log(jsonData);
            success(jsonData);
        })
        .catch(function(err) {
            console.log(err);
            failure();
        });

    // fetch(retrieveScript)
    //     .then(response => response.json())
    //     .then(jsonData => success(jsonData))
    //     .catch(err => failure());
}

function collectPages(result) {
    myPages = result.pages;
    // console.log('---POP---', myPages);
        
}

function onError() {
    console.log("*** Error has occured during fetch");
}

function popGame(pgNum) {
    const myPage = myPages[pgNum]; 
    // console.log('---page print out---', myPage)
    myStory.innerHTML = "";
    myStory.innerHTML = myPage.story;
    myChoices.innerHTML = "";
    for (const myChoice of myPage.choices) {
        // console.log('---choice loop---', myChoice)
        myChoices.innerHTML += `<button class="choices" onclick="popGame(${myChoice.nextPage})">${myChoice.option}</button><br>`
    }

    // calculating profits
    totalProfit = myPage.profit + totalProfit;
    myProfit.innerHTML = totalProfit;

    // setting vitals
    currentHealth = myPage.vitals + currentHealth;

    if (currentHealth == 3) {
        myHealth.innerHTML = "Healthy";
    } else if (currentHealth == 2) {
        myHealth.innerHTML = "Injured";
    } else if (currentHealth == 1) {
        myHealth.innerHTML = "Wounded";
    } else if (currentHealth == 0) {
        myHealth.innerHTML = "Dead";
        // gonna have to put in whatever pgnumber it is with the appropriate death
        if (myPage.death == undefined) {
            popGame(myPage.death);
        } else {
            // popGame(generic death);
        }
    }

    // filling oxygen 
    currentO2 = myPage.oxygen + currentO2;
    myOxygen.innerHTML = currentO2;

    if (currentO2 == 0) {
        // death from lack of air
        // popGame(oxygen death);
    }

    // keeping track of where the player has been
    playersPath.push(pgNum);

}

function main() {
    myChoices = document.getElementById("choices");
    myStory = document.getElementById("story");

    myHealth = document.getElementById("health");
    myOxygen = document.getElementById("oxygen");
    myProfit = document.getElementById("profit");

    getJSONData(storyJSON, collectPages, onError);
}

// const result = {
//     fieldA: 'something',
//     fieldB: 'some other thing'
// }

// popChoices('');

main();