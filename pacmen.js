var pos = 0;
var gameStarted = false;
var gameTimer = 0;
const pacArray = [
    ['./images/PacMan1.png', './images/PacMan2.png'],
    ['./images/PacMan3.png', './images/PacMan4.png']
];
var direction = 0;
var pacCounter = 0; //this allows us to use a single update timer to update the images on a different timeframe than the 20 sec position update
const pacMen = []; // This array holds all the pacmen

function setToRandom(scale) {
    return {
        x: Math.random() * scale,
        y: Math.random() * scale
    }
}
// Factory to make a PacMan at a random position with random velocity
function makePac() {
    // returns an object with random values scaled {x: 33, y: 21}
    let velocity = setToRandom(10); // {x:?, y:?}
    let position = setToRandom(200);
    // Add image to div id = game
    let game = document.getElementById('game');
    let newimg = document.createElement('img');
    newimg.style.position = 'absolute';
    newimg.src = './images/PacMan1.png';
    newimg.width = 100;
    newimg.style.left = position.x;
    newimg.style.top = position.y;
    newimg.focus = 0; //added to hold open/close mouth status
    newimg.direction = direction; //added to hold left/right facing status

    // add new Child image to game
    game.appendChild(newimg);
    // return details in an object
    return {
        position,
        velocity,
        newimg
    }
}

function update() {
    //loop over pacmen array and move each one and move image in DOM
    pacCounter += 5; //adding 5 every time update runs (20 milliseconds) - means when it's 100, one second has elapsed
    //update the 'Start Game' button to be able to reset the game once it has started
    if(gameStarted === false){ 
    document.getElementById('gameStart').setAttribute('onclick','ResetGame()');
    document.getElementById('gameStart').innerText = "Reset Game"
    }
    pacMen.forEach((item) => {
        checkCollisions(item)
        item.position.x += item.velocity.x;
        item.position.y += item.velocity.y;

        item.newimg.style.left = item.position.x;
        item.newimg.style.top = item.position.y;
    })
    if(pacCounter >= 100){pacCounter = 0;} //once it's reached 100 (1 second) reset the pacCounter back to zero
    gameStarted = true;
    gameTimer = setTimeout(update, 20);
}

function checkCollisions(item) {
    //console.log(item.newimg);
    let pac = item.newimg;
    
    if(item.position.x + item.velocity.x + item.newimg.width > window.innerWidth -10 || //removed 10 from the inner width to keep the scrollbar from flashing
    item.position.x + item.velocity.x <0) 
    item.velocity.x = -item.velocity.x;
    if(item.position.y + item.velocity.y + item.newimg.height > window.innerHeight ||
    item.position.y + item.velocity.y < 0) 
    item.velocity.y = -item.velocity.y;
    pacdirection = checkDirection(pac.direction, item.velocity.x); //check if we've reached a page bound on the x axis
    if(pacCounter >= 100 || pacdirection !== pac.direction){ //update the image if 1 second has passed or if the direction has changed
        let pacfocus = pac.focus;
        pacfocus = (pacfocus + 1) % 2;
        //console.log(pacCounter);
        pac.src = pacArray[pacdirection][pacfocus];
        pac.focus = pacfocus;
    }
    pac.direction = pacdirection; //update the direction after an opportunity for the image to be updated 
}
function checkDirection(direction, pos) {
    // reverse direction on hitting page bounds
    if (direction === 0 && pos < 0) {
        direction = 1;
    }
    if ( direction=== 1 && pos > 0){
        direction = 0;
    }
    return direction;
}

function makeOne() {
    pacMen.push(makePac()); // add a new PacMan
}

function takeOne() { // removes the last PacMan frm the game DOM element
    let game = document.getElementById('game');
    let pacCount = game.childElementCount; 
    if (pacCount > 0) {
    game.lastElementChild.remove(); //remove the DOM element
    pacMen.pop(); //remove the reference from the pacMen array
    }
   
}

function ResetGame() {
    let game = document.getElementById('game');
    //go through the game element and remove everything except for the buttons
    for (i=0; i < game.children.length; i++){
       if (game.children[i].tagName === 'IMG'){ 
           game.children[i].remove(); //remove the DOM element
           pacMen.pop(i); //remove the reference from the pacMen array
            //starts the search back at the beginning if an item was removed because the length has been changed
           i=0; 
        }
    }

    clearTimeout(gameTimer);
    //change the gameStart button back to update so that it can be run again
    document.getElementById('gameStart').setAttribute('onclick','update()'); 
    document.getElementById('gameStart').innerText = "Start Game";
    //reset the gameStarted variable for the next run
    gameStarted = false; 
}

