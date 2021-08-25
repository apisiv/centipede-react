import "./App.css";
import Arena from "./Components/Arena/Arena";
import Scores from "./Components/Scores/Scores";
import React, { useEffect, useReducer } from "react";
import ErrorBoundary from "./ErrorBoundary"
import { initBugs, moveBugs, placeBugs } from "./Bugs";
import { prepareInitialMushrooms , placeMushrooms, removeMushroom} from "./Mushrooms";
import { removeCentipedeItem, moveCentipede} from "./Centipede";
import { xSize, ySize, missles_amount } from "./Config";
import { empty } from "./Empty"; 
import { moveMissles, addMissle } from "./Missles"
import { movePlayer,placePlayer } from "./Player";


const prepareArena = (cx, cy, mushrooms) => {
  let arena = [];
  for (let y = 0; y < cy; y++) {
    let yLine = { id: y, items: [] };
    for (let x = 0; x < cx; x++) {
      yLine.items.push({
        background: Math.random() < 0.5 ? "green" : "yellow",
        content: empty,
        id: y * 1000 + x * 3,
      });
    }
    arena.push(yLine);
  }
  return arena;
};


const prepareInitialState = () => {
  const mushrooms = prepareInitialMushrooms(xSize, ySize);
  const arena = prepareArena(xSize, ySize);
  let state = {
    player_is_alive: true,
    game_is_over: false,
    game_arena: arena,
    player_x: xSize / 2,
    player_y: ySize - 1,
    score: 0,
    bugs: initBugs(),
    missles: [],
    centipede: [],
    mushrooms: mushrooms,
  };
  state = placeBugs(state);
  state = placeMushrooms(state);
  state = placePlayer(state);
  return state;
};







const detectCollisions = (state) => {
  //1. does missle hit a bug
  for (let missle of state.missles) {
    let bugs = state.bugs.filter(
      (bug) => bug.x === missle.x && bug.y === missle.y
    );
    if (bugs.length > 0) {
      missle.to_remove = true;
      for (let bug of bugs) {
        bug.to_remove = true;
      }
      state.score += 10;
    }
  }
  //2 does missle hit a mushroom
  for (let missle of state.missles) {
    if (state.mushrooms[missle.x][missle.y] === 1) {
      missle.to_remove = true;
      removeMushroom(missle.x, missle.y, state);
      state.score += 1;
    }
  }

  for (let missle of state.missles) {
    let segments = state.centipede.filter(
      (segment) => segment.x === missle.x && segment.y === missle.y
    );
    if (segments.length > 0) {
      state.score += 25;
      for (let segment of segments) {
        state.centipede = removeCentipedeItem(segment, state);
      }
    }
  }

  const isUserDead =
    state.centipede.find(
      (x) => x.x === state.player_x && x.y === state.player_y
    ) !== undefined;
  if (isUserDead) {
    state.player_is_alive = false;
  }
};


const processGameState = (state, action) => {
  if (action.TYPE === "tick") {
    if (state.player_is_alive) {
      let next_state = { ...state };
      next_state.missles = moveMissles(state);
      next_state.bugs = moveBugs(state);
      next_state.centipede = moveCentipede(state);
      detectCollisions(next_state);

      return next_state;
    } else {
      let next_state = prepareInitialState();
      return next_state;
    }
  } else if (action.TYPE === "usermove") {
    var position = movePlayer(action.direction, state);
    return {
      ...state,
      player_x: position.x,
      player_y: position.y,
    };
  } else if (action.TYPE === "fire") {
    if (state.missles.length < missles_amount) {
      return {
        ...state,
        missles: addMissle(state),
      };
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
      } else if (event.code === "ArrowUp") {
        gameStateDispatch({ TYPE: "usermove", direction: "up" });
      } else if (event.code === "ArrowDown") {
        gameStateDispatch({ TYPE: "usermove", direction: "down" });
      } else if (event.code === "Space") {
        gameStateDispatch({ TYPE: "fire" });
      }
    };
    return () => clearInterval(interval);
  }, []);

  const { game_arena } = gameState;
  const { score } = gameState;
  return (
    <div className="game">
      <Scores score={score} />
      <ErrorBoundary>
        <Arena arena={game_arena} />
      </ErrorBoundary>
    </div>
  );
}

export default App;
