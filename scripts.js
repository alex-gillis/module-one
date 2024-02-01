// the path to retrieve the JSON
const storyJSON = './moduleOne.json';
// tracks if player has stumbled across special deaths
const specialDeaths = [27, 29, 33, 40];
// this gives an alternate page depending on the player's actions 
const altPages = [35];
// referring to HTML objects associated with the storyline
let myPages, myChoices, myStory;
// referring to HTML objects associated with the character
let myHealth, myOxygen, myProfit;
// referring to HTML objects associated with the character for mobile
let myMobileHealth, myMobileOxygen, myMobileProfit;
// referring to HTML objects associated with the settings
let mySave, myLoad, myFeedback;
// referring to HTML objects associated with the settings for mobile
let myMobileSave, myMobileLoad, myMobileFeedback;
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

// special ending options 
let hasKraken = false;

function getJSONData(retrieveScript, success, failure) {
    // retrieval of the JSON file
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
            // console.log(err);
            failure();
        });

    // fetch(retrieveScript)
    //     .then(response => response.json())
    //     .then(jsonData => success(jsonData))
    //     .catch(err => failure());
}

function collectPages(result) {
    // this fetches the JSON and puts it into an array that can be accessed globally
    myPages = result.pages;
        
}

function onError() {
    // this is an error that will be thrown up if the JSON can't be loaded
    console.log("*** Error has occured during fetch");
}

function startGame(pgNum) {
    // the startGame function requires a pgNum (page number)
    // to populate the story from the spot in the JSON array

    mySave.innerHTML = `<button class="settings" onclick="saveGame()">Save Game</button>`;
    myLoad.innerHTML = `<button class="settings" onclick="loadGame()">Load Game</button>`;
    myMobileSave.innerHTML = `<button class="mobile_settings" onclick="saveGame()">Save Game</button>`;
    myMobileLoad.innerHTML = `<button class="mobile_settings" onclick="loadGame()">Load Game</button>`;
    checkLoad();
    popGame(pgNum);
}

function hasExistingGame() {
    // depending if there is a game file saved in localStorage
    // the title screen will have a "Load Game" button

    if (!localStorage.getItem("playerHistory")) {
        myTitle.innerHTML = `<button class="title__button" onclick="startGame(0)"><h2>Start Game</h2></button>`
    } else {
        myTitle.innerHTML = `<button class="title__button" onclick="startGame(0)"><h2>Start New Game</h2></button>
        <button class="title__button" onclick="loadGame()"><h2>Continue Game</h2></button>`
    }
}

function checkLoad() {
    // checkLoad is resposible for enabling/disabling 
    // the load game button depending on if there is a file
    if (!localStorage.getItem("playerHistory")) {
        myLoad.innerHTML = `<button class="settings" style="color: #7D7D7D;">Load Game</button>`;
        myMobileLoad.innerHTML = `<button class="mobile_settings" style="color: #7D7D7D;">Load Game</button>`;
    } else {
        myLoad.innerHTML = `<button class="settings" onclick="loadGame()">Load Game</button>`;
        myMobileLoad.innerHTML = `<button class="mobile_settings" onclick="loadGame()">Load Game</button>`;
    }
}

function popGame(pgNum) {
    myPage = myPages[pgNum]; 
    myStory.innerHTML = "";
    myStory.innerHTML = myPage.story;
    myChoices.innerHTML = "";
    for (const myChoice of myPage.choices) {
        myChoices.innerHTML += `<button class="choices" onclick="popGame(${myChoice.nextPage})">${myChoice.option}</button><br>`;
    }

    // checking for restart to wipe the trail
    if (myPage.pageNum == 0) {
        playersTrail = [];
        currentHealth = 3;
        totalProfit = 0;
        currentO2 = 100;
    }

    // calculating profits
    totalProfit = myPage.profit + totalProfit;
    popProfit(totalProfit);

    // setting vitals
    currentHealth = myPage.vitals + currentHealth;
    popHealth(currentHealth );
    healthChecker();

    // filling oxygen 
    currentO2 = myPage.oxygen + currentO2;
    popOxygen(currentO2 + "%");
    oxygenChecker();

    // keeping track of where the player has been
    playersTrail.push(pgNum);
    // console.log("Where the player has been...  " + playersTrail);

    // deathChecker checks for custom deaths
    deathChecker(pgNum);

    // checking for specific circumsances for special ending varients
    specialChecker(pgNum);

    // checks if the player needs an alternate page
    altChecker(pgNum);

    checkLoad();
    popFeedback("");
}

function saveGame() {
    // saving the file to localStorage
    localStorage.setItem("pageNumber", myPage.pageNum);
    localStorage.setItem("playerHistory", JSON.stringify(playersTrail));

    // check load is for resetting the menu buttons
    checkLoad();
    popFeedback("Your progess has been saved");
}

function loadGame() {
    // this is to ensure that there is a save file
    if (!localStorage.getItem("playerHistory")) {
        startGame(localStorage.getItem("pageNumber"));
    } else {
        playersTrail = JSON.parse(localStorage.getItem("playerHistory"));
        currentHealth = 3;
        currentO2 = 100;
        totalProfit = 0;

        let playProg = JSON.parse(localStorage.getItem("playerHistory"));
        // playProg.length = playProg.length - 1;
        let checkProg = playProg.pop();
        // console.log("Where the player has been...  " + playersTrail);
        // console.log("Where the player has been...  " + playProg);
        // console.log(checkProg);

        for (const myProg of playProg) {
            const PROGRESS = myPages[myProg];
            
            currentHealth = PROGRESS.vitals + currentHealth;
            currentO2 = PROGRESS.oxygen + currentO2;
            totalProfit = PROGRESS.profit + totalProfit;
        }

        const PROGRESS = myPages[checkProg];
        currentHealth = currentHealth - PROGRESS.vitals;
        currentO2 = currentO2 - PROGRESS.oxygen;
        totalProfit = totalProfit - PROGRESS.profit;

        popGame(localStorage.getItem("pageNumber"));
        startGame(localStorage.getItem("pageNumber"));
    }

    popFeedback("Your progress has been restored");
}

function deleteSave() {
    // this clears local storage of the save file
    localStorage.clear();
    // resets the menu buttons
    // has existing game is for the title screen
    hasExistingGame();
    // check load is for the menu buttons
    checkLoad();

    popFeedback("Your progress has been deleted");
}

function popFeedback(result) {
    myFeedback.innerHTML = result;
    myMobileFeedback.innerHTML = result;
}

function popHealth(result) {
    myHealth.innerHTML = result;
    myMobileHealth.innerHTML = result;
}

function popOxygen(result) {
    myOxygen.innerHTML = result;
    myMobileOxygen.innerHTML = result;
}

function popProfit(result) {
    myProfit.innerHTML = result;
    myMobileProfit.innerHTML = result;
}

function healthChecker() {
    if (currentHealth >= 3) {
        popHealth("Healthy");
        currentHealth = 3;
    } else if (currentHealth == 2) {
        popHealth("Injured");
    } else if (currentHealth == 1) {
        popHealth("Wounded");
    } else if (currentHealth <= 0) {
        popHealth("Dead");
        // gonna have to put in whatever pgnumber it is with the appropriate death
        if (myPage.death != undefined) {
            popGame(!myPage?.death);
        } else {
            // generic death page
            popGame(8);
        }
    }
}

function oxygenChecker() {
    if (currentO2 <= 0) {
        popHealth("Dead");
        popOxygen("Empty");
        // death from lack of air
        popGame(9);
    }
}

function deathChecker(pgNum) {
    if (specialDeaths.includes(pgNum)) {
        popHealth("Dead");
        popOxygen("Empty");
    }
}

function specialChecker(pgNum) {
    if (pgNum === 22 || pgNum === 31) {
        hasKraken = true;
    } else if (pgNum === 25 || pgNum === 30) {
        hasKraken = false;
    }
}

function altChecker(pgNum) {
    if (altPages.includes(pgNum) && hasKraken) {
        playersTrail.pop();
        popGame(36);
    }
}

function main() {
    // connecting HTML content to be populated through functions 
    myTitle          = document.getElementById("title");

    myChoices        = document.getElementById("choices");
    myStory          = document.getElementById("story");

    myHealth         = document.getElementById("health");
    myOxygen         = document.getElementById("oxygen");
    myProfit         = document.getElementById("profit");

    myMobileHealth   = document.getElementById("mobile_health");
    myMobileOxygen   = document.getElementById("mobile_oxygen");
    myMobileProfit   = document.getElementById("mobile_profit");

    mySave           = document.getElementById("save");
    myLoad           = document.getElementById("load"); 
    myFeedback       = document.getElementById("feedback"); 
    
    myMobileSave     = document.getElementById("mobile_save");
    myMobileLoad     = document.getElementById("mobile_load"); 
    myMobileFeedback = document.getElementById("mobile_feedback"); 

    // populating the array data from the json
    getJSONData(storyJSON, collectPages, onError);
    
    // checks if there is an existing game save
    hasExistingGame();
}

main();