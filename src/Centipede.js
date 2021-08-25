import { xSize, ySize } from "./Config";
import { empty } from "./Empty";
import { isMushroom, removeMushroom, placeMushroom } from "./Mushrooms";

const initCentipede = () => {
    let centipede = [];
    const direction = Math.random() > 0.5 ? "right" : "left";
    const size = 5 + Math.floor(Math.random() * 7);
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
  
  export const removeCentipedeItem = (item, state) => {
    let centipedes = state.centipede.filter((x) => x !== item);
    placeMushroom(item.x, item.y, state);
    return centipedes;
  };
  
  export const moveCentipede = (state) => {
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
  
  export const removeCentipede = (state) => {
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