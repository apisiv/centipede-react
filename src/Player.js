import { xSize, ySize } from "./Config";
import { empty } from "./Empty";

const isMovePossible = (item) => {
    if (item === "empty" || item === "player") {
      return true;
    }
    return false;
  };
  
  export const movePlayer = (direction, state) => {
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
  

export const placePlayer = (state) => {
  state.game_arena[state.player_x].items[state.player_y].content = "player";
  return state;
}