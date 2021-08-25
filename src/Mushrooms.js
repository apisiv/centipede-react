import { empty } from "./Empty";

export const mushroom_item = "mushroom";
const mushroom_place_ratio = 0.001;

const prepareItems = () => {
  const rnd = Math.random();
  if (rnd < mushroom_place_ratio) {
    return mushroom_item;
  }
  return empty;
};

export const prepareInitialMushrooms = (cx, cy) => {
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

export const isMushroom = (x, y, state) => {
  let item = state.mushrooms[x][y];
  if (item === 1) {
    return true;
  } else {
    return false;
  }
};

export const placeMushroom = (cx, cy, state) => {
  state.game_arena[cx].items[cy].content = mushroom_item;
  state.mushrooms[cx][cy] = 1;
};

export const removeMushroom = (cx, cy, state) => {
  state.game_arena[cx].items[cy].content = empty;
  state.mushrooms[cx][cy] = 0;
};

export const placeMushrooms = (state) => {
  for (let x in state.mushrooms) {
    for (let y in state.mushrooms[x]) {
      const mushroom = state.mushrooms[x][y];
      state.game_arena[x].items[y].content =
        mushroom === 1 ? mushroom_item : empty;
    }
  }
  return state;
};
