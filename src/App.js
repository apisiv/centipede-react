import "./App.css";
import Arena from "./Components/Arena/Arena";
import Scores from "./Components/Scores/Scores";
import React, { useEffect, useReducer } from "react";

const empty = "empty";

const prepareItems = (x, y) => {
  const rnd = Math.random();
  if (rnd < 0.03) {
    return "mushroom";
  }
  return empty;
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
    missles: []
  };
  return placeBugs(state);
};

const isMovePossible = (item) => {
  if (item === "empty" || item === "player") {
    return true;
  }
  return false;
};

const movePlayer = (direction, state) => {
  let position = state.player_x;
  if (direction === "right") {
    position = state.player_x + 1 < xSize ? state.player_x + 1 : state.player_x;
  } else if (direction === "left") {
    position = state.player_x - 1 >= 0 ? state.player_x - 1 : state.player_x;
  }

  if (position !== state.player_x) {
    if (
      isMovePossible(state.game_arena[position].items[state.player_y].content)
    ) {
      state.game_arena[state.player_x].items[state.player_y].content = empty;
      state.game_arena[position].items[state.player_y].content = "player";
    } else {
      console.log(
        "collision " + state.game_arena[position].items[state.player_y].content
      );
    }
  }

  return position;
};

const moveMissle = (missle) => {
  let posx = missle.x;
  let posy = missle.y;
  if(posy > 0){
    posy = posy-1;
    return {x : posx, y : posy}
  } 
  else {
    return undefined;
  }
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

const moveMissles = (state) => {
  removeMissles(state);
  let newPositions = [];
  for (let missle of state.missles) {
    const obj = moveMissle(missle);
    if(obj !== undefined){
      newPositions.push(obj);
    }    
  }
  state.missles = newPositions;
  placeMissles(state)
  return newPositions;
}

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

const placeMissles = (state) => {
  for (let missle of state.missles) {
    state.game_arena[missle.x].items[missle.y].content = "missle";
  }
  return state;
}

const removeBugs = (state) => {
  for (let bug of state.bugs) {
    let item = empty;
    if (Math.random() < 0.4) {
      item = "mushroom";
    }
    state.game_arena[bug.x].items[bug.y].content = item;
  }
  return state;
};

const removeMissles = (state) => {
  for (let missle of state.missles) {
    console.log(missle.x + '  ' + missle.y);
    state.game_arena[missle.x].items[missle.y].content = empty;
  }
  return state;
};

const addMissle = (state) => {
  state.missles.push({x: state.player_x,y:  18});
  return state.missles;
}

const missles_amount = 10;
const processGameState = (state, action) => {
  if (action.TYPE === "tick") {
    return {
      ...state,
      score: state.score + 1,
      bugs: moveBugs(state),
      missles: moveMissles(state),
    };
  } else if (action.TYPE === "usermove") {
    return {
      ...state,
      player_x: movePlayer(action.direction, state),
    };
  }
  else if (action.TYPE === 'fire'){
    if(state.missles.length < missles_amount){
      return {
        ...state,
        missles: addMissle(state)
      }
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
      else if( event.code === "Space") {
        gameStateDispatch({ TYPE: "fire"});
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
