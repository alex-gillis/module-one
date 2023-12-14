const storyJSON = './moduleOne.json';
// referring to HTML objects associated with the storyline
let myPages, myChoices, myStory;
// referring to HTML objects associated with the character
let myHealth, myOxygen, myProfit;
// referring to HTML objects associated with the settings
let mySave, myLoad, myFeedback;
// referring to HTML objects associated with the settings
let myTitle;
// referring to storage page
let myPage;

// initializing the base statistics when the game loads
let currentHealth = 3;
let currentO2 = 100;
let totalProfit = 0;

// tracking the pages visited by characters
// ensures that the same page is not printed multiple times when retracing steps
let playersTrail = [];

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

function pushKey(reqPage, myKey) {
    document.addEventListener("keydown", (e) => {
        console.log("key down " + e.key);
        console.log("req key " + myKey);
        if (e.key === myKey) {
            e.preventDefault();

            popGame(reqPage);

            return false;
        }
    });
}

function startGame(pgNum) {
    mySave.innerHTML = `<button class="settings" onclick="saveGame()">Save Game</button>`;
    myLoad.innerHTML = `<button class="settings" onclick="loadGame()">Load Game</button>`;
    popGame(pgNum);
}

function hasExistingGame() {
    if (!localStorage.getItem("playerHistory")) {
        myTitle.innerHTML = `<button class="title__button" onclick="startGame(0)"><h2>Start Game</h2></button>`
    } else {
        myTitle.innerHTML = `<button class="title__button" onclick="startGame(0)"><h2>Start New Game</h2></button>
        <button class="title__button" onclick="loadGame()"><h2>Continue Game</h2></button>`
    }
}

function popGame(pgNum) {
    myPage = myPages[pgNum]; 
    // console.log('---page print out---', myPage)
    myStory.innerHTML = "";
    myStory.innerHTML = myPage.story;
    myChoices.innerHTML = "";
    for (const myChoice of myPage.choices) {
        // console.log('---choice loop---', myChoice)
        myChoices.innerHTML += `<button class="choices" onclick="popGame(${myChoice.nextPage})">${myChoice.option}</button><br>`
        
        // // add keyboard functionality
        // pushKey(myChoice.nextPage, myChoice.key);
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
    } else if (currentHealth <= 0) {
        myHealth.innerHTML = "Dead";
        // gonna have to put in whatever pgnumber it is with the appropriate death
        if (myPage.death != undefined) {
            popGame(!myPage?.death);
        } else {
            // generic death page
            popGame(8);
        }
    }

    // filling oxygen 
    currentO2 = myPage.oxygen + currentO2;
    myOxygen.innerHTML = currentO2;

    if (currentO2 <= 0) {
        // death from lack of air
        popGame(9);
    }

    // checking for restart to wipe the trail
    if (myPage.pageNum == 0) {
        playersTrail = [];
    }

    // keeping track of where the player has been
    playersTrail.push(pgNum);
    // console.log("Where the player has been...  " + playersTrail);

    myFeedback.innerHTML = "";
}

function saveGame() {
    // console.log("You attempted to save the game!");
    // console.log("Sadly there is no saving you >:P");
    
    localStorage.setItem("pageNumber", myPage.pageNum);
    localStorage.setItem("playerHistory", JSON.stringify(playersTrail));

    myFeedback.innerHTML = "Your progess has been saved";

}

function loadGame() {
    // console.log("You attempted to load the game!");
    if (!localStorage.getItem("playerHistory")) {
        startGame(localStorage.getItem("pageNumber"));
    } else {
        playersTrail = JSON.parse(localStorage.getItem("playerHistory"));
        popGame(localStorage.getItem("pageNumber"));
        startGame(localStorage.getItem("pageNumber"));
    }

    myFeedback.innerHTML = "Your progress has been restored";
}

function deleteSave() {
    localStorage.clear();
    hasExistingGame()

    myFeedback.innerHTML = "Save File Deleted";
}

function main() {
    myChoices  = document.getElementById("choices");
    myStory    = document.getElementById("story");

    myHealth   = document.getElementById("health");
    myOxygen   = document.getElementById("oxygen");
    myProfit   = document.getElementById("profit");

    mySave     = document.getElementById("save");
    myLoad     = document.getElementById("load"); 
    myFeedback = document.getElementById("feedback"); 

    myTitle    = document.getElementById("title");

    getJSONData(storyJSON, collectPages, onError);

    hasExistingGame();
}

main();