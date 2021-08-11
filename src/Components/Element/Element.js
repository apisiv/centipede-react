import React, {useMemo} from 'react'
import classes from './Element.module.css'
const Element = (props) => {

    console.log("Element!");

    //const content = `${classes['game-item']} ${classes[props.background]} ${classes['image']} ${classes['bug']} `
    const content = `${classes['game-item']} ${classes[props.background]} ${classes['image']} ${props.content !== 'undefined' && classes[props.content]} `;
    


    return (
        <div key={props.id} className={content} ></div>
    );
}

export default React.memo(Element);
