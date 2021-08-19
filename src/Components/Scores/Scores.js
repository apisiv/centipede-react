import React from 'react'
import classes from './Scores.module.css'

const Scores = props => {
    const score = `Score : ${props.score}`;
    console.log(score);
    return(
        <div>
            <div className={classes.scores}>{score}</div>
            <div className={classes.logo}>Centipede</div>
        </div>
    );

}

export default Scores;