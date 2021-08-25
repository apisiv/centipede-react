import { xSize } from "./Config";
import { empty } from "./Empty";
import { placeMushroom } from "./Mushrooms"; 


 export const initBug = () => {
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
  
  export const initBugs = (x, y) => {
    let bugs = [];
    for (let x = 0; x < 5; x++) {
      bugs.push(initBug());
    }
    return bugs;
  };

  export const moveBug = (bug) => {
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

  export const moveBugs = (state) => {
    removeBugs(state);
  
    let newPositions = [];
    for (let bug of state.bugs) {
      newPositions.push(moveBug(bug));
    }
    state.bugs = newPositions;
    placeBugs(state);
    return state.bugs;
  };
  
  export const removeBugs = (state) => {
    for (let bug of state.bugs) {
      if (Math.random() < 0.4) {
        placeMushroom(bug.x, bug.y, state);
      } else {
        state.game_arena[bug.x].items[bug.y].content = empty;
      }
    }
    return state;
  };

  export const placeBugs = (state) => {
    for (let bug of state.bugs) {
      state.game_arena[bug.x].items[bug.y].content = bug.direction;
    }
    return state;
  };
  
  