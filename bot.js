let dice = document.querySelector('.dice');      
let rollMax = 8
let angleX = 0,
    angleY = 0,
    result = 1,
    delay = 1000,
    canRoll = true

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
}


const roll = () =>{
  
  canRoll = false   
  const xTurn = 4 + getRandomInt(rollMax),
      yTurn = 4 + getRandomInt(rollMax)
  
  
  angleX += 90 * xTurn
  angleY += 90 * yTurn
    if(angleX%180){
    getRandomInt(3) > 1 && (angleX += 90)}
    
  dice.style.transform = "rotateX(" + angleX + "deg) rotateY(" + angleY + "deg)"
  dice.style.transitionDuration = delay + 'ms'
    
  let x = angleX%360,
      y = angleY%360
    
  if(x === 0 || x === 180){
    switch ((x+y)%360) {
  case 0: result = 1
        break
  case 90: result = 5
        break
  case 180: result = 6
        break
  case 270: result = 2
        break
  default:
    console.error(123456);
    }
  }
  else if( x === 90){
    result = 4
  }
  else if( x === 270){
    result = 3
  }
  
  setTimeout(() => canRoll = true, delay)
  
  console.log('result:', result)
  return(result)
}

let player = "blue";
let zindex = 0;
let turn = "red";
let redStartPoint = 1;
let greenStartPoint = 14;
let yellowStartPoint = 27;
let blueStartPoint = 40;

let redMovedSteps = { 
  redToken1 : 0,
  redToken2 : 0,
  redToken3 : 0,
  redToken4 : 0
};
let greenMovedSteps = {
  greenToken1 : 0,
  greenToken2 : 0,
  greenToken3 : 0,
  greenToken4 : 0
};
let yellowMovedSteps = {
  yellowToken1 : 0,
  yellowToken2 : 0,
  yellowToken3 : 0,
  yellowToken4 : 0
};
let blueMovedSteps = {
  blueToken1 : 0,
  blueToken2 : 0,
  blueToken3 : 0,
  blueToken4 : 0
};
let whoHasWon = {
  red : false,
  green : false,
  yellow : false,
  blue : false
}

let players = ["red","green","yellow","blue"];
let moveableTokenNum = [];

function rollDice(){
  if (turn != player){
    roll();
    setTimeout(() => {
      findMovableTokens();
    }, 1500);
  } else {
    clearInterval(rollDice);
    addEventListenersToDice();
  }
}
setInterval(rollDice, 3000);

function transitionToNextPlayer(){
    let previousTurn;
    previousTurn = turn;
    let nextPlayerIndex;
    if (players[players.indexOf(previousTurn)+1] == undefined){
        nextPlayerIndex = 0;
    } else {
        nextPlayerIndex = players.indexOf(previousTurn)+1
    }
    turn = players[nextPlayerIndex]
    document.querySelector(`.${previousTurn}Player`).classList.remove(`${previousTurn}Ready`);
    dice.remove();
    addDiceElement(turn);
    dice = document.querySelector('.dice')
    document.querySelector(`.${turn}Player`).classList.add(`${turn}Ready`);
}
function findMovableTokens(){
  
    if (turn == "red"){
      reduceZindexFromPreviousTokens();
        moveableTokenNum = [];
        let count = 0;
        let redTokens = document.querySelectorAll(".tokenRed");
            for (let index = 0; index < redTokens.length; index++) {
              let containerOFClickedToken = redTokens[index].parentNode;
              if (containerOFClickedToken.id.includes("Home") == false){
                console.log("You are outside of home");
                if (isInFinishLine(containerOFClickedToken) == true){
                  if (redMovedSteps[redTokens[index].id] + result < 7 ){
                    moveableTokenNum.push(redTokens[index].id.slice(-1));
                    count++;
                    console.log("You are outside of home, at the finish line, and within six units.");
                  } else {
                    console.log("You are outside of home, at the finish line, and outside six units.");
                  }
                } else if (isInFinishLine(containerOFClickedToken) == false){
                  count++;
                  moveableTokenNum.push(redTokens[index].id.slice(-1));
                  console.log("You are outside of home, and not at the finish line.");
                }
              } else if (containerOFClickedToken.id.includes("Home") && result == 6){
                moveableTokenNum.push(redTokens[index].id.slice(-1));
                count++;
              } else if (containerOFClickedToken.id.includes("Home")){
                console.log("You're inside of home");
              } 
              else {
                count++;
              }
              redTokens[index].style.zIndex =  "10";

            }

            if (count == 0){
                console.log("count == 0");
                checkWin();
                transitionToNextPlayer()
            } else {
              botMove();
            }     
      } else if (turn == "green"){
        reduceZindexFromPreviousTokens();
        moveableTokenNum = [];
        let count = 0;
        let greenTokens = document.querySelectorAll(".tokenGreen");
            for (let index = 0; index < greenTokens.length; index++) {
              let containerOFClickedToken = greenTokens[index].parentNode;
              if (containerOFClickedToken.id.includes("Home") == false){
                console.log("You are outside of home");
                if (isInFinishLine(containerOFClickedToken) == true){
                  if (greenMovedSteps[greenTokens[index].id]+ result < 7 ){
                    count++;                    
                    moveableTokenNum.push(greenTokens[index].id.slice(-1));
                    console.log("You are outside of home, at the finish line, and within six units.");
                  } else {
                    console.log("You are outside of home, at the finish line, and outside six units.");
                  }
                } else if (isInFinishLine(containerOFClickedToken) == false){
                  count++;                 
                  moveableTokenNum.push(greenTokens[index].id.slice(-1));
                  console.log("You are outside of home, and not at the finish line.");
                }
              } else if (containerOFClickedToken.id.includes("Home") && result == 6){
                count++;                
                moveableTokenNum.push(greenTokens[index].id.slice(-1));
              } else if (containerOFClickedToken.id.includes("Home")){
                console.log("You're inside of home");
              } 
               else {
                    count++;
              }
              greenTokens[index].style.zIndex = "10";
            }
                if (count == 0){
                  checkWin();
                    transitionToNextPlayer()
            } else {
              botMove();
            }
      } else if (turn == "yellow"){
        reduceZindexFromPreviousTokens();
        moveableTokenNum = [];
        let count = 0;
        let yellowTokens = document.querySelectorAll(".tokenYellow");
            for (let index = 0; index < yellowTokens.length; index++) {
              let containerOFClickedToken = yellowTokens[index].parentNode;
              if (containerOFClickedToken.id.includes("Home") == false){
                console.log("You are outside of home");
                if (isInFinishLine(containerOFClickedToken) == true){
                  if (yellowMovedSteps[yellowTokens[index].id] + result < 7 ){
                    count++;                    
                    moveableTokenNum.push(yellowTokens[index].id.slice(-1));
                    console.log("You are outside of home, at the finish line, and within six units.");
                  } else {
                    console.log("You are outside of home, at the finish line, and outside six units.");
                  }
                } else if (isInFinishLine(containerOFClickedToken) == false){
                  count++;                 
                  moveableTokenNum.push(yellowTokens[index].id.slice(-1));
                  console.log("You are outside of home, and not at the finish line.");
                }
              } else if (containerOFClickedToken.id.includes("Home") && result == 6){
                count++;                
                moveableTokenNum.push(yellowTokens[index].id.slice(-1));
              }  else if (containerOFClickedToken.id.includes("Home")){
                console.log("You're inside of home");
              } 
              else {
                count++;  
              }
              yellowTokens[index].style.zIndex = "10";
            }
            if (count == 0){
                checkWin();
                transitionToNextPlayer()
            } else {
              botMove();
            }
      } else if (turn == "blue"){
        console.log("blue find movable tokens");
        reduceZindexFromPreviousTokens();
        moveableTokenNum = [];
        let count = 0;
        let blueTokens = document.querySelectorAll(".tokenBlue");
        console.log(blueTokens)
            for (let index = 0; index < blueTokens.length; index++) {
              let containerOFClickedToken = blueTokens[index].parentNode;
              if (containerOFClickedToken.id.includes("Home") == false){
                console.log("You are outside of home");
                if (isInFinishLine(containerOFClickedToken) == true){
                  if (blueMovedSteps[blueTokens[index].id] + result  < 7 ){
                    count++;
                    blueTokens[index].addEventListener("click",function(){
                        console.log(blueTokens[index]);
                         blueTokens[index].addEventListener("click", botMove)
                    });
                    
                    moveableTokenNum.push(blueTokens[index].id.slice(-1));
                    console.log("You are outside of home, at the finish line, and within six units.");
                  } else {
                    console.log("You are outside of home, at the finish line, and outside six units.");
                  }
                } else if (isInFinishLine(containerOFClickedToken) == false){
                  count++;
                  blueTokens[index].addEventListener("click",function(){
                    console.log(blueTokens[index]);
                     blueTokens[index].addEventListener("click", botMove)
                });
                  
                  moveableTokenNum.push(blueTokens[index].id.slice(-1));
                  console.log("You are outside of home, and not at the finish line.");
                }
              } else if (containerOFClickedToken.id.includes("Home") && result == 6){
                count++;
                blueTokens[index].addEventListener("click",function(){
                    console.log(blueTokens[index]);
                     blueTokens[index].addEventListener("click", botMove)
                });
                
                moveableTokenNum.push(blueTokens[index].id.slice(-1));
              } else if (containerOFClickedToken.id.includes("Home")){
                console.log("You're inside of home");
              } 
               else {
                  count++;
              }
              blueTokens[index].style.zIndex = "10";
            }
            if (count == 0){
              transitionToNextPlayer()
          }
      }
}
function botMove(event){
  let clickedToken;
  if (turn != player){
    let random = Math.floor(Math.random() * moveableTokenNum.length);
    let tokenNum = moveableTokenNum[random];
    let token = document.getElementById(`${turn}Token${tokenNum}`)
    clickedToken = token;
  } else {
    console.log("blue turn to move");
    console.log(clickedToken);
    clickedToken = event.target;
  }
    let containerOFClickedToken = clickedToken.parentNode;
    let step;
    let nextStep;
    console.log("why blue doesn't come here if turn is six it should  be here");
    console.log(result);
    if (result == 6) {
      console.log("got six");
      console.log(turn);
      clickedToken.remove();
      if (containerOFClickedToken.id.includes("Home")){
      if (turn == "red"){
        document.getElementById(`step${redStartPoint}`).appendChild(clickedToken); 
      } else if(turn == "green"){
        document.getElementById(`step${greenStartPoint}`).appendChild(clickedToken);
      } else if(turn == "yellow"){
        document.getElementById(`step${yellowStartPoint}`).appendChild(clickedToken);
      } else if (turn == "blue"){
        console.log("blue go outside of home");
        document.getElementById(`step${blueStartPoint}`).appendChild(clickedToken);
      }
    }
    } if (!(containerOFClickedToken.id.includes("Home"))) {
      updateMovedSteps();
      step = containerOFClickedToken.id.slice(4);
      nextStep = Number(step) + result;
      if (shouldChangeDirection()){
        moveToFinishLine();
      } else if (isInFinishLine(containerOFClickedToken)){
        if (moveInFinishLine()){
          //addEventListenersToDice();
          return;
        }
      }
       else if (nextStep > 52){
        nextStep = nextStep - 52;
        document.getElementById("step" + nextStep).appendChild(clickedToken);
        if (checkForOpponentTokens()){
          //addEventListenersToDice();
          return;
        }
      } else {
        document.getElementById("step" + nextStep).appendChild(clickedToken);
        if (checkForOpponentTokens()){
          //addEventListenersToDice();
          return;
        }
      }
      if (checkWin()){
        return;
      }
    }
    if ( result == 6){
      addEventListenersToDice();
      return;
    }
    transitionToNextPlayer()
  
    
    function shouldChangeDirection(){ 
      if (turn == "red" && redMovedSteps[clickedToken.id] > 50){
          redMovedSteps[clickedToken.id] -= 50;
          return true; 
      } else if (turn == "green" && greenMovedSteps[clickedToken.id] > 50){
          greenMovedSteps[clickedToken.id] -= 50;
          return true;
      } else if (turn == "yellow" && yellowMovedSteps[clickedToken.id] > 50){
          yellowMovedSteps[clickedToken.id] -= 50;
          return true
      }else if (turn == "blue" && blueMovedSteps[clickedToken.id] > 50){
          blueMovedSteps[clickedToken.id] -= 50;
          return true;
      }
    }
    function moveToFinishLine(){
      if (turn == "red"){
        if (redMovedSteps[clickedToken.id] > 5){
          clickedToken.remove();
        } else {
          document.getElementById(`${turn}Step${redMovedSteps[clickedToken.id]}`).appendChild(clickedToken)
        }
      } else if (turn == "green"){
         if (greenMovedSteps[clickedToken.id] > 5){
          clickedToken.remove();
         } else {
          document.getElementById(`${turn}Step${greenMovedSteps[clickedToken.id]}`).appendChild(clickedToken)
         }
      } else if (turn == "yellow"){
        if (yellowMovedSteps[clickedToken.id] > 5){
          clickedToken.remove();
        } else {
          document.getElementById(`${turn}Step${yellowMovedSteps[clickedToken.id]}`).appendChild(clickedToken)
        }
      } else if (turn == "blue"){
        if (blueMovedSteps[clickedToken.id] > 5){
          clickedToken.remove();
        } else {
          document.getElementById(`${turn}Step${blueMovedSteps[clickedToken.id]}`).appendChild(clickedToken)
        }
      }
    }
    function moveInFinishLine(){
      if (turn == "red"){
        if (redMovedSteps[clickedToken.id] > 6){
          redMovedSteps[clickedToken.id] -= result;
          document.getElementById(`${turn}Step${redMovedSteps[clickedToken.id]}`).appendChild(clickedToken);
        } else if (redMovedSteps[clickedToken.id] < 6){
          document.getElementById(`${turn}Step${redMovedSteps[clickedToken.id]}`).appendChild(clickedToken);
        } else if (redMovedSteps[clickedToken.id] == 6){
          clickedToken.remove();
          return true;
        }
      } else if (turn == "green"){
        if (greenMovedSteps[clickedToken.id] > 6){
          greenMovedSteps[clickedToken.id] -= result;
          document.getElementById(`${turn}Step${greenMovedSteps[clickedToken.id]}`).appendChild(clickedToken);
        } else if (greenMovedSteps[clickedToken.id] < 6){
          document.getElementById(`${turn}Step${greenMovedSteps[clickedToken.id]}`).appendChild(clickedToken);
        } else if (greenMovedSteps[clickedToken.id] == 6){
          clickedToken.remove();
          return true;
        }
      } else if (turn == "yellow"){
        if (yellowMovedSteps[clickedToken.id] > 6){
          yellowMovedSteps[clickedToken.id] -= result;
          document.getElementById(`${turn}Step${yellowMovedSteps[clickedToken.id]}`).appendChild(clickedToken);
        } else if (yellowMovedSteps[clickedToken.id] < 6){
          document.getElementById(`${turn}Step${yellowMovedSteps[clickedToken.id]}`).appendChild(clickedToken);
        } else if (yellowMovedSteps[clickedToken.id] == 6){
          clickedToken.remove();;
          return true;
        }
      } else if (turn == "blue"){
        if (blueMovedSteps[clickedToken.id] > 6){
          blueMovedSteps[clickedToken.id] -= result;
          document.getElementById(`${turn}Step${blueMovedSteps[clickedToken.id]}`).appendChild(clickedToken);
        } else if (blueMovedSteps[clickedToken.id] < 6){
          document.getElementById(`${turn}Step${blueMovedSteps[clickedToken.id]}`).appendChild(clickedToken);
        } else if (blueMovedSteps[clickedToken.id] == 6){
          clickedToken.remove();
          checkWin();
          return true;
        }
      }
    }
    function updateMovedSteps(){
      if (turn == "red"){
        redMovedSteps[clickedToken.id] += result;
      } else if (turn == "green"){
        greenMovedSteps[clickedToken.id] += result;
      } else if (turn == "yellow"){
        yellowMovedSteps[clickedToken.id] += result;
      } else if (turn == "blue"){
        blueMovedSteps[clickedToken.id] += result;
      }
    }
    function checkForOpponentTokens(){
      let tokens = document.getElementById("step" + nextStep).children;
      if (tokens.length == 1){
         return false;
      }else if (isSafeSpot()){
        return false;
      } else {
        let tokenColors = [];
        for (let index = 0; index < tokens.length; index++) {
          tokenColors[index] = tokens[index].id.slice(0,-6)
        }
        if(hasDuplicates(tokenColors)){
          return false;
        } else {
          let tokenColor = tokens[0].id.slice(0,-6);
          let tokenNum = tokens[0].id.slice(-1);
          let token = document.getElementById(`${tokenColor}Token${tokenNum}`)
          tokens[0].remove();
          document.getElementById(`${tokenColor}Token${tokenNum}Home`).appendChild(token);
          reduceSteps(tokenColor,tokenNum);
          return true;
        }
      }
      function reduceSteps(color,num){
        if (color == "red"){
          redMovedSteps[`redToken${num}`] = 0;;
        } else if (color == "green"){
          greenMovedSteps[`greenToken${num}`] = 0;
        } else if (color == "yellow"){
          yellowMovedSteps[`yellowToken${num}`] = 0;
        } else if (color == "blue"){
          blueMovedSteps[`blueToken${num}`] = 0;
        }
      }
      function isSafeSpot(){
            let spot = document.getElementById("step" + nextStep).id.slice(4)
            if ( spot == 1 || spot == 14 || spot == 27 || spot == 40 ||
                 spot == 9 || spot == 22 || spot == 35 || spot == 48){
              return true;
            }
      }
    }
    
}
function addDiceElement(color){
    document.getElementById(`${color}DiceContainer`).innerHTML = 
    `<div class="dice">
    <div class="face" data-id="1">
      <div class="point point-middle point-center"></div>
    </div>
    <div class="face" data-id="2">
      <div class="point point-top point-right"></div>
      <div class="point point-bottom point-left"></div>
    </div>
    <div class="face" data-id="6">
      <div class="point point-top point-right"></div>
      <div class="point point-top point-left"></div>
      <div class="point point-middle point-right"></div>
      <div class="point point-middle point-left"></div>
      <div class="point point-bottom point-right"></div>
      <div class="point point-bottom point-left"></div>
    </div>
    <div class="face" data-id="5">
      <div class="point point-top point-right"></div>
      <div class="point point-top point-left"></div>
      <div class="point point-middle point-center"></div>
      <div class="point point-bottom point-right"></div>
      <div class="point point-bottom point-left"></div>
    </div>
    <div class="face" data-id="3">
      <div class="point point-top point-right"></div>
      <div class="point point-middle point-center"></div>
      <div class="point point-bottom point-left"></div>
    </div>
    <div class="face" data-id="4">
      <div class="point point-top point-right"></div>
      <div class="point point-top point-left"></div>
      <div class="point point-bottom point-right"></div>
      <div class="point point-bottom point-left"></div>
    </div>
  </div>`
  }

  function reduceZindexFromPreviousTokens(){
    if (turn == "red"){
      let blueTokens = document.querySelectorAll(".tokenBlue");
      for (let index = 0; index < blueTokens.length; index++) {
        blueTokens[index].style.zIndex = "5";
      }
    } else if (turn == "green"){
      let redTokens = document.querySelectorAll(".tokenRed");
      for (let index = 0; index < redTokens.length; index++) {
        redTokens[index].style.zIndex = "5";
      }
    } else if(turn == "yellow"){
      let greenTokens = document.querySelectorAll(".tokenGreen");
      for (let index = 0; index < greenTokens.length; index++) {
        greenTokens[index].style.zIndex = "5";
      }
    } else if (turn == "blue"){
      let yellowTokens = document.querySelectorAll(".tokenYellow");
      for (let index = 0; index < yellowTokens.length; index++) {
        yellowTokens[index].style.zIndex = "5";
      }
    }
  }

  function isInFinishLine(container){
    if ( container.className.includes("finishLine") ){
      return true;
    } else {
      return false
    }
  }

  function checkWin () {
    if (turn == "red" && document.querySelectorAll(".tokenRed").length == 0){
      checkRank();
      let playerIndex = players.indexOf("red");
      players.splice(playerIndex,1);
      whoHasWon.red = true;
      return true;
    } else if (turn == "green" && document.querySelectorAll(".tokenGreen").length == 0) {
      checkRank();
      let playerIndex = players.indexOf("green");
      players.splice(playerIndex,1);
      whoHasWon.green = true;
      return true;
    } else if (turn == "yellow" && document.querySelectorAll(".tokenYellow").length == 0){
      checkRank();
      let playerIndex = players.indexOf("yellow");
      players.splice(playerIndex,1);
      whoHasWon.yellow = true;
      return true;
    } else if (turn == "blue" && document.querySelectorAll(".tokenBlue").length == 0){
      checkRank();
      let playerIndex = players.indexOf("blue");
      players.splice(playerIndex,1);
      whoHasWon.blue = true;
      return true;
    }
  }
  function checkRank(){
    let wonPlayercount = 0;
      for (const key in whoHasWon) {
        if (whoHasWon[key] == true){
          wonPlayercount ++;
        }
      }
      console.log(`${turn} placed no: ${wonPlayercount + 1}`);
  }
  function hasDuplicates(array) {
    for (let i = 0; i < array.length; i++) {
      for (let j = i + 1; j < array.length; j++) {
        if (array[i] === array[j]) {
          return true;
        }
      }
    }
    return false;
  }

  function addEventListenersToDice(){
    dice.addEventListener('click',roll);
    //dice.addEventListener('click', preparePlayerTurn);
  }
  function removeEventListenersFromDice(){
    console.log("remove event listeners from dice")
    dice.removeEventListener('click',roll);
    dice.removeEventListener('click', preparePlayerTurn);
  }
  /*function addEventListenersToPlayerTokens(){
    if (turn == "blue"){
        let moveableTokenNum = [];
        let count = 0;
        let blueTokens = document.querySelectorAll(".tokenBlue");
            for (let index = 0; index < blueTokens.length; index++) {
              let containerOFClickedToken = blueTokens[index].parentNode;
              if (containerOFClickedToken.id.includes("Home") == false){
                console.log("You are outside of home");
                if (isInFinishLine(containerOFClickedToken) == true){
                  if (blueMovedSteps[blueTokens[index].id] + result  < 7 ){
                    count++;
                    blueTokens[index].addEventListener("click", botMove);
                    
                    moveableTokenNum.push(blueTokens[index].id.slice(-1));
                    console.log("You are outside of home, at the finish line, and within six units.");
                  } else {
                    console.log("You are outside of home, at the finish line, and outside six units.");
                  }
                } else if (isInFinishLine(containerOFClickedToken) == false){
                  count++;
                  blueTokens[index].addEventListener("click", botMove);
                  
                  moveableTokenNum.push(blueTokens[index].id.slice(-1));
                  console.log("You are outside of home, and not at the finish line.");
                }
              } else if (containerOFClickedToken.id.includes("Home") && result == 6){
                count++;
                blueTokens[index].addEventListener("click", botMove);
                
                moveableTokenNum.push(blueTokens[index].id.slice(-1));
              } else if (containerOFClickedToken.id.includes("Home")){
                console.log("You're inside of home");
              } 
               else {
                  count++;
              }
              console.log("add z index 10 to the current token ");
              blueTokens[index].style.zIndex = "10";
            }
            if (count == 0){
            setTimeout(() => {
              transitionToNextPlayer();
            }, 2000);
          }
      }
  }*/
  function preparePlayerTurn() {
    console.log("Prepare player's turn");
    removeEventListenersFromDice();
    findMovableTokens();
    //addEventListenersToPlayerTokens();
  }


 