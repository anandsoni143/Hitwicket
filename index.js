import InputHandler from './Core/Input.js';
import Board from './Modules/Board/Board.js';
import Player from './Modules/PlayerStub/PlayerStub.js';
let boardRef = new Board();
let playerA = new Player('A',1);
let playerB = new Player('B',2);w
//Section for testing the input

function draw() {
    boardRef.drawBoard(playerA.positionMap,playerB.positionMap);
}

async function initPlayers() {
  if (!playerA.isPlayerSet) {
    const result = await InputHandler.initPlayerInput(playerA.playerTag);
    playerA.setupPlayerData(result, false);
    playerA.isPlayerSet = true;
  }
  if (!playerB.isPlayerSet) {
    let result = await InputHandler.initPlayerInput(playerB.playerTag);
    playerB.setupPlayerData(result, true);
    playerB.isPlayerSet = true;
  }
}

async function playerMoves() {
  const movesA = await InputHandler.playerInput(playerA.playerTag);
  const prevPosA = playerA.getPreviousPosition(movesA[0]);
  if(prevPosA!== null){
  boardRef.clearBoardAtPos(prevPosA);
  }
  playerA.updatePosition(movesA,boardRef.getBoard(),playerB);
  //checkCollisions()
  draw();
  const movesB = await InputHandler.playerInput(playerB.playerTag);
  const prevPosB = playerB.getPreviousPosition(movesB[0]);
  if(prevPosB!==null){
  boardRef.clearBoardAtPos(prevPosB);
  }
  playerB.updatePosition(movesB,boardRef.getBoard(),playerA);
  draw();
}
function isGameOver(){
  let check = false;
  if(Object.keys(playerA.positionMap).length === 0){
    console.log('Player B Wins');
    check = true;
  }
  if(Object.keys(playerB.positionMap).length === 0){
    console.log('Player A wins');
    check = true;
  }
  return check;
}
async function mainLoop() {
  try {
    await initPlayers();
    draw();
    while (!isGameOver()) {
      await playerMoves();
    }
  } catch (e) {
    console.log('failed:', e)
  }
}
  
mainLoop()