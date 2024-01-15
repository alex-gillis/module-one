// the path to retrieve the JSON
const storyJSON = './moduleOne.json';
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
            console.log(err);
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
    myProfit.innerHTML       = totalProfit;
    myMobileProfit.innerHTML = totalProfit;

    // setting vitals
    currentHealth = myPage.vitals + currentHealth;

    if (currentHealth >= 3) {
        myHealth.innerHTML = "Healthy";
        myMobileHealth.innerHTML = "Healthy";
        currentHealth = 3;
    } else if (currentHealth == 2) {
        myHealth.innerHTML = "Injured";
        myMobileHealth.innerHTML = "Injured";
    } else if (currentHealth == 1) {
        myHealth.innerHTML = "Wounded";
        myMobileHealth.innerHTML = "Wounded";
    } else if (currentHealth <= 0) {
        myHealth.innerHTML = "Dead";
        myMobileHealth.innerHTML = "Dead";
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
    myOxygen.innerHTML       = currentO2 + "%";
    myMobileOxygen.innerHTML = currentO2 + "%";

    if (currentO2 <= 0) {
        myHealth.innerHTML       = "Dead";
        myOxygen.innerHTML       = "Empty";
        myMobileHealth.innerHTML = "Dead";
        myMobileOxygen.innerHTML = "Empty";
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

    checkLoad();
    myFeedback.innerHTML = "";
    myMobileFeedback.innerHTML = "";
}

function saveGame() {
    // saving the file to localStorage
    localStorage.setItem("pageNumber", myPage.pageNum);
    localStorage.setItem("playerHistory", JSON.stringify(playersTrail));

    // check load is for resetting the menu buttons
    checkLoad();
    myFeedback.innerHTML = "Your progess has been saved";
    myMobileFeedback.innerHTML = "Your progess has been saved";
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
            let progress = myPages[myProg];
            
            currentHealth = progress.vitals + currentHealth;
            currentO2 = progress.oxygen + currentO2;
            totalProfit = progress.profit + totalProfit;
        }

        let progress = myPages[checkProg];
        currentHealth = currentHealth - progress.vitals;
        currentO2 = currentO2 - progress.oxygen;
        totalProfit = totalProfit - progress.profit;

        popGame(localStorage.getItem("pageNumber"));
        startGame(localStorage.getItem("pageNumber"));
    }

    myFeedback.innerHTML = "Your progress has been restored";
    myMobileFeedback.innerHTML = "Your progress has been restored";
}

function deleteSave() {
    // this clears local storage of the save file
    localStorage.clear();
    // resets the menu buttons
    // has existing game is for the title screen
    hasExistingGame()
    // check load is for the menu buttons
    checkLoad();

    myFeedback.innerHTML = "Your progress has been deleted";
    myMobileFeedback.innerHTML = "Your progress has been deleted";
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