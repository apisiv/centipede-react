import React from 'react'
import classes from './Scores.module.css'

const Scores = props => {
    const score = `Score : ${props.score}`;
    console.log(score);
    return(
        <div>
            <span className={classes.scores}>{score}</span>
        </div>
    );

}

export default Scores;