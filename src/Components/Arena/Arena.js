import React from "react";
import Element from "../Element/Element";
import classes from "./Arena.module.css";

const Arena = (props) => {

  

let items = props.arena.map((x) => {
    return <div className={classes.line}>
      {x.map((xx) => {
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
