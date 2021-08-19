import "./App.css";
import Arena from "./Components/Arena/Arena";
import Scores from "./Components/Scores/Scores";
import React, { useEffect, useReducer } from "react";

const empty = "empty";

const mushroom_item = "mushroom";
const mushroom_place_ratio = 0.001;
const prepareItems = () => {
  const rnd = Math.random();
  if (rnd < mushroom_place_ratio) {
    return mushroom_item;
  }
  return empty;
};

const initBug = () => {
  const y = Math.floor(Math.random() * 18);
  let x = 0;
  const direction = Math.random() < 0.5 ? "bugleft" : "bugright";
  const speed = Math.floor(1 + Math.random() * 3);
  if (direction === "bugleft") {
    x = xSize - 1;
  } else {
    x = 0;
  }

  return { x: x, y: y, direction: direction, speed: speed, tick: 1 };
};

const initBugs = (x, y) => {
  let bugs = [];
  for (let x = 0; x < 5; x++) {
    bugs.push(initBug());
  }
  return bugs;
};

const prepareInitialMushrooms = (cx, cy) => {
  let mushrooms = [];
  for (let y = 0; y < cy; y++) {
    let yLine = [];
    for (let x = 0; x < cx; x++) {
      yLine.push(prepareItems() === mushroom_item ? 1 : 0);
    }
    mushrooms.push(yLine);
  }
  return mushrooms;
};

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

const xSize = 20;
const ySize = 20;
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

const initCentipede = () => {
  let centipede = [];
  const direction = Math.random() > 0.5 ? "right" : "left";
  const size = 5; // + Math.floor(Math.random() * 7);
  for (let cx = 0; cx < size; cx++) {
    if (direction === "right") {
      let segment = {
        x: xSize - size + cx,
        y: 0,
        direction: -1,
        speed: 1 + Math.floor(Math.random() * 3),
        tick: 1,
      };
      centipede.push(segment);
    } else {
      let segment = {
        x: cx,
        y: 0,
        direction: 1,
        speed: 1 + Math.floor(Math.random() * 3),
        tick: 1,
      };
      centipede.push(segment);
    }
  }
  return centipede;
};

const isMushroom = (x, y, state) => {
  let item = state.mushrooms[x][y];
  if (item === 1) {
    return true;
  } else {
    return false;
  }
};

const moveCentipedeItem = (item, state) => {
  item.tick++;

  let next_x = item.x + item.direction;
  let next_y = item.y;
  if (item.tick > item.speed) {
    if (next_x >= 0 && next_x < xSize) {
      if (isMushroom(next_x, next_y, state)) {
        console.log("IsMushroom");
        next_y = next_y + 1;
        next_x = item.x;
        if (next_y === ySize) {
          return undefined;
        }
        if (isMushroom(next_x, next_y, state)) {
          item.direction = -item.direction;
        }
        removeMushroom(next_x, next_y, state);
      }
    } else {
      next_y = next_y + 1;
      next_x = item.x;
      if (next_y === ySize) {
        return undefined;
      }
      item.direction = -item.direction;
      removeMushroom(next_x, next_y, state);
    }
  }
  return {
    x: next_x,
    y: next_y,
    direction: item.direction,
    tick: item.tick,
    speed: item.speed,
  };
};

const removeCentipedeItem = (item, state) => {
  let centipedes = state.centipede.filter((x) => x !== item);
  placeMushroom(item.x, item.y, state);
  return centipedes;
};

const moveCentipede = (state) => {
  let centipede = [];
  removeCentipede(state);
  for (let item of state.centipede) {
    let segment = moveCentipedeItem(item, state);
    if (segment !== undefined) {
      centipede.push(segment);
    }
  }
  if (centipede.length === 0) {
    centipede = initCentipede();
  }
  state.centipede = centipede;
  showCentipede(state);
  return centipede;
};

const removeCentipede = (state) => {
  for (let item of state.centipede) {
    state.game_arena[item.x].items[item.y].content = empty;
  }
};

const showCentipede = (state) => {
  for (let item of state.centipede) {
    state.game_arena[item.x].items[item.y].content =
      item.direction === "right" ? "ant-right" : "ant-left";
  }
};

const isMovePossible = (item) => {
  if (item === "empty" || item === "player") {
    return true;
  }
  return false;
};

const movePlayer = (direction, state) => {
  let position = { x: state.player_x, y: state.player_y };
  if (direction === "right") {
    position.x =
      state.player_x + 1 < xSize ? state.player_x + 1 : state.player_x;
  } else if (direction === "left") {
    position.x = state.player_x - 1 >= 0 ? state.player_x - 1 : state.player_x;
  } else if (direction === "up") {
    position.y =
      state.player_y - 1 >= ySize - 2 ? state.player_y - 1 : state.player_y;
  } else if (direction === "down") {
    position.y =
      state.player_y + 1 < xSize ? state.player_y + 1 : state.player_y;
  }

  console.log("---->> " + position.x + "  " + position.y);

  if (position.x !== state.player_x || position.y !== state.player_y) {
    if (
      isMovePossible(state.game_arena[position.x].items[position.y].content)
    ) {
      state.game_arena[state.player_x].items[state.player_y].content = empty;
      state.game_arena[position.x].items[position.y].content = "player";
    } else {
      console.log(
        "collision " + state.game_arena[position.x].items[position.y].content
      );
    }
  }

  return position;
};

const moveMissle = (state, missle) => {
  if (missle.to_remove === true) {
    return undefined;
  }
  let posx = missle.x;
  let posy = missle.y;
  if (posy > 0) {
    posy = posy - 1;
    return { x: posx, y: posy };
  } else {
    return undefined;
  }
};

const moveBug = (bug) => {
  if (bug.to_remove === true) {
    return initBug();
  }
  let posx = bug.x;
  let posy = bug.y;
  bug.tick++;
  if (bug.tick > bug.speed) {
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
    bug.tick = 1;
  }
  return {
    x: posx,
    y: posy,
    direction: bug.direction,
    speed: bug.speed,
    tick: bug.tick,
  };
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

const moveMissles = (state) => {
  removeMissles(state);
  let newPositions = [];
  for (let missle of state.missles) {
    const obj = moveMissle(state, missle);
    if (obj !== undefined) {
      newPositions.push(obj);
    }
  }
  state.missles = newPositions;
  placeMissles(state);
  return newPositions;
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

const placeMushroom = (cx, cy, state) => {
  state.game_arena[cx].items[cy].content = mushroom_item;
  state.mushrooms[cx][cy] = 1;
};

const removeMushroom = (cx, cy, state) => {
  state.game_arena[cx].items[cy].content = empty;
  state.mushrooms[cx][cy] = 0;
};

const placeMushrooms = (state) => {
  for (let x in state.mushrooms) {
    for (let y in state.mushrooms[x]) {
      const mushroom = state.mushrooms[x][y];
      state.game_arena[x].items[y].content =
        mushroom === 1 ? mushroom_item : empty;
    }
  }
  return state;
};

const placeBugs = (state) => {
  for (let bug of state.bugs) {
    state.game_arena[bug.x].items[bug.y].content = bug.direction;
  }
  return state;
};

const placePlayer = (state) => {
  state.game_arena[state.player_x].items[state.player_y].content = "player";
  return state;
}

const placeMissles = (state) => {
  for (let missle of state.missles) {
    state.game_arena[missle.x].items[missle.y].content = "missle";
  }
  return state;
};

const removeBugs = (state) => {
  for (let bug of state.bugs) {
    if (Math.random() < 0.4) {
      placeMushroom(bug.x, bug.y, state);
    } else {
      state.game_arena[bug.x].items[bug.y].content = empty;
    }
  }
  return state;
};

const removeMissles = (state) => {
  for (let missle of state.missles) {
    console.log("missle : " + missle.x + "  " + missle.y);
    console.log("player : " + state.player_x + "  " + state.player_y);
    console.log(state.player_x !== missle.x && state.player_y !== missle.y);
    if (state.player_x === missle.x && state.player_y === missle.y) {
      break;
    }
    state.game_arena[missle.x].items[missle.y].content = empty;
  }
  return state;
};

const addMissle = (state) => {
  state.missles.push({ x: state.player_x, y: state.player_y});
  return state.missles;
};

const missles_amount = 20;
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
      <Arena arena={game_arena} />
    </div>
  );
}

export default App;
