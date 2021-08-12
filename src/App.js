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
    let yLine = { id: y, items: [] };
    for (let x = 0; x < cx; x++) {
      yLine.items.push({
        background: Math.random() < 0.5 ? "green" : "yellow",
        content: prepareItems(),
        id: y * 1000 + x * 3,
      });
    }
    arena.push(yLine);
  }
  return arena;
};

const xSize = 20;
const ySize = 20;
const prepareInitialState = () => {
  const state = {
    player_is_alive: true,
    game_is_started: false,
    game_arena: prepareArena(xSize, ySize),
    player_x: xSize / 2,
    player_y: ySize - 1,
    score: 0,
    bugs: initBugs(),
  };
  return placeBugs(state);
};

const movePlayer = (direction, state) => {
  let position = state.player_x;
  if(direction === 'right'){
    position = state.player_x + 1 < xSize ? state.player_x + 1 : state.player_x;
  }
  else if(direction === 'left') {
    position = state.player_x - 1 >= 0 ? state.player_x - 1 : state.player_x;
  }
 
  if(position != state.player_x){
    state.game_arena[state.player_x].items[state.player_y].content = undefined;
    state.game_arena[position].items[state.player_y].content = "player";
  }
  
  return position;
}

const moveBug = (bug) => {
  let posx = bug.x;
  let posy = bug.y;
  if (bug.direction === "bugleft") {
    posx = posx - 1;
    if (posx < 0) {
      return initBug();
    }
  } else {
    posx = posx + 1;
    if (posx > xSize - 1) {
      return initBug();
    }
  }
  return { x: posx, y: posy, direction: bug.direction };
};

const moveBugs = (state) => {
  removeBugs(state);

  let newPositions = [];
  for (let bug of state.bugs) {
    newPositions.push(moveBug(bug));
  }
  state.bugs = newPositions;
  placeBugs(state);
  return state.bugs;
};

const placeBugs = (state) => {
  for (let bug of state.bugs) {
    state.game_arena[bug.x].items[bug.y].content = bug.direction;
  }
  return state;
};

const showArena = (state) => {
  for (let line of state.game_arena.items) {
    for (let x of line) {
      if (x.content !== undefined) {
        console.log(x.content);
      }
    }
  }
  console.log("end");
};

const removeBugs = (state) => {
  for (let bug of state.bugs) {
    let item = undefined;
    if (Math.random() < 0.1) {
      item = "mushroom";
    }
    state.game_arena[bug.x].items[bug.y].content = item;
  }
  return state;
};

const processGameState = (state, action) => {
  if (action.TYPE === "tick") {
    return {
      ...state,
      score: state.score + 1,
      bugs: moveBugs(state),
    };
  } else if (action.TYPE === "usermove") {
      return {
        ...state,
        player_x : movePlayer(action.direction, state)
      }
    }  
  return state;
};

const speed = 100;

const initialState = prepareInitialState();

function App() {
  const [gameState, gameStateDispatch] = useReducer(
    processGameState,
    initialState
  );

  useEffect(() => {
    let interval = window.setInterval(() => {
      gameStateDispatch({ TYPE: "tick" });
    }, speed);
    window.onkeydown = (event) => {
      if (event.code === "ArrowRight") {
        gameStateDispatch({ TYPE: "usermove", direction: "right" });
      } else if (event.code === "ArrowLeft") {
        gameStateDispatch({ TYPE: "usermove", direction: "left" });
      }
    };
    return () => clearInterval(interval);
  }, []);

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
