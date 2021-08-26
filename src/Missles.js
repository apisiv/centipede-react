import {empty} from "./Empty";

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


const placeMissles = (state) => {
    for (let missle of state.missles) {
      state.game_arena[missle.x].items[missle.y].content = "missle";
    }
    return state;
  };

export const moveMissles = (state) => {
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

export const removeMissles = (state) => {
  for (let missle of state.missles) {
    if (state.player_x === missle.x && state.player_y === missle.y) {
      break;
    }
    state.game_arena[missle.x].items[missle.y].content = empty;
  }
  return state;
};

export const addMissle = (state) => {
  state.missles.push({ x: state.player_x, y: state.player_y });
  return state.missles;
};
