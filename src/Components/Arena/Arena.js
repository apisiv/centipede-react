import React from "react";
import Element from "../Element/Element";
import classes from "./Arena.module.css";

const Arena = (props) => {

  

let items = props.arena.map((x) => {
    return <div key={x.id} className={classes.line}>
      {x.items.map((xx) => {
        return <Element key={xx.id} background={xx.background} content={xx.content}/>;
      })}
    </div>;
  });

  return (
    <>
      {
          items
      }
    </>
  );
};

export default Arena;
