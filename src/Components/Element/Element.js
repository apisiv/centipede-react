import React from 'react'
import classes from './Element.module.css'
const Element = (props) => {


    //const content = `${classes['game-item']} ${classes[props.background]} ${classes['image']} ${classes['bug']} `
    const content = `${classes['game-item']} ${classes[props.background]} ${classes['image']} ${props.content !== 'undefined' && classes[props.content]} `;
    


    return (
        <div key={props.id} className={content} ></div>
    );
}

export default Element;