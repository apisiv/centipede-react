import './App.css';
import Arena from './Components/Arena/Arena';
import Scores from './Components/Scores/Scores'
import React, {useReducer} from 'react';

const prepareItems=() => {
  const rnd = Math.random();
  if(rnd < 0.03) {
    return 'mushroom'
  }
  else if(rnd > 0.97){
    return 'bugleft'
  }
  return undefined;
}

const prepareArena = (cx,cy) => {
  let arena = [];  
  for(let y =0; y < cy; y++ ){
    let yLine = [];
    for(let x = 0; x < cx; x++){
      yLine.push({
        background : Math.random() < 0.5 ? 'green' : 'yellow',
        content: prepareItems(),
        id : y*100 + x,
      })
    }  
    arena.push(yLine)
  }
  return arena;
}

const prepareInitialState = () => { 
  return {
    player_is_alive : true,
    game_is_started : false,
    game_arena : prepareArena(20,20),
    player_x : 0,
    player_y : 0,
    score : 0,
    bugs: [],
  };
}

const processGameState = (state, action) => {
  return state;
}

function App() {
  console.log(prepareInitialState());
  const [gameState, gameStateDispatch] = useReducer (processGameState,prepareInitialState())
  const {game_arena} = gameState;
  const {score} = gameState;
  console.log(game_arena)
  return (
    <>
    <Scores score={score}/>
    <Arena arena={game_arena}/>
    </>
  );
}

export default App;
