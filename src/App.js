import "./App.css";
import Arena from "./Components/Arena/Arena";
import Scores from "./Components/Scores/Scores";
import React, { useEffect, useReducer } from "react";

const prepareItems = (x, y) => {
  const rnd = Math.random();
  if (rnd < 0.03) {
    return "mushroom";
  }
  return undefined;
};

const initBug = () => {
  const y = Math.floor(Math.random() * 18);
  let x = 0;
  const direction = Math.random() < 0.5 ? "bugleft" : "bugright";
  if (direction === "bugleft") {
    x = xSize - 1;
  } else {
    x = 0;
  }
  return { x: x, y: y, direction: direction };
};

const initBugs = (x, y) => {
  let bugs = [];

  for (let x = 0; x < 5; x++) {
    bugs.push(initBug());
  }
  return bugs;
};

const prepareArena = (cx, cy) => {
  let arena = [];
  for (let y = 0; y < cy; y++) {
    let yLine = [];
    for (let x = 0; x < cx; x++) {
      yLine.push({
        background: Math.random() < 0.5 ? "green" : "yellow",
        content: prepareItems(),
        id: y * 1000 + x,
      });
    }
    arena.push(yLine);
  }
  return arena;
};

let semaphore = 0;
const xSize = 20;
const ySize = 20;
const prepareInitialState = () => {
  const state = {
    player_is_alive: true,
    game_is_started: false,
    game_arena: prepareArena(xSize, ySize),
    player_x: 0,
    player_y: 0,
    score: 0,
    bugs: initBugs(),
  };
  return placeBugs(state);
};

const moveBug = (bug) => {
  //let bug = Object.assign({}, pbug);
  if (bug.direction === "bugleft") {
    bug.x = bug.x - 1;
    if (bug.x < 0) {
      return initBug();
    }
  } else {
    bug.x = bug.x + 1;
    if (bug.x > xSize - 1) {
      return initBug();
    }
  }
  return bug;
};

const moveBugs = (state) => {
  showBugs(state.bugs);
  state = removeBugs(state);

  showBugs(state.bugs);
  state.bugs.map((x) => {
    moveBug(x);
  });
  showBugs(state.bugs);
  state = placeBugs(state);
  showBugs(state.bugs);
  return state;
};

const placeBugs = (state) => {
  for (let bug of state.bugs) {
    state.game_arena[bug.x][bug.y].content = bug.direction;
  }
  return state;
};

const showBugs = (bugs) => {
  /*
  console.log('Show bugs start');
  for(let bug of bugs){
    console.log(`x: ${bug.x} y: ${bug.y}`);
  }
  console.log('Show bugs end');
  */
};

const showArena = (state) => {
  for (let line of state.game_arena) {
    for (let x of line) {
      if (x.content !== undefined) {
        console.log(x.content);
      }
    }
  }
  console.log("end");
};

const removeBugs = (state) => {
  //showArena(state);
  for (let bug of state.bugs) {
    console.log(`x:${bug.x} y:${bug.y} `);
    console.log(`content:${state.game_arena[bug.y][bug.x].content}`);
    let item = undefined;
    if (Math.random() < 0.1) {
      item = "mushroom";
    }
    state.game_arena[bug.x][bug.y].content = item;
  }
  return state;
};

const processGameState = (state, action) => {
  if (action.TYPE === "tick") {
    console.log("tick!");
    if (semaphore === 0) {
      semaphore = 1;
      let newState = Object.assign({}, state);
      newState = moveBugs(newState);
      newState.score = newState.score + 1;
      semaphore = 0;
      //gameStateDispatch(state);
      return newState;
    } else {
      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!1");
    }
  }
  return state;
};

const speed = 100;
function App() {
  
  const [gameState, gameStateDispatch] = useReducer(
    processGameState,
    prepareInitialState()
  );

  //const [gameState, setGameState] = useState(prepareInitialState());

  const effect = useEffect(() => {
    window.setInterval(() => {
      gameStateDispatch({ TYPE: "tick" });
    }, speed);
  },[]);
  const { game_arena } = gameState;
  const { score } = gameState;
  return (
    <>
      <Scores score={score} />
      <Arena arena={game_arena} />
    </>
  );
}

export default App;
