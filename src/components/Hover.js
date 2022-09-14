import * as React from 'react';
import { useEffect, useState, useMemo } from "react";

export default function Hover(props) {
  let {shiftX,shiftY}=props
  const [position, setPosition] = useState({ x: 0, y: 0  });  
    const [visibility, setVisibility] = useState(false);
    const hoverComponentStyle = {position: 'absolute',  zIndex: '2'};
    const {children}=props;


    useEffect(() => {
      const setFromEvent = (e) => setPosition({ x: e.clientX, y: e.clientY });
      window.addEventListener("mousemove", setFromEvent);
      return () => {
        window.removeEventListener("mousemove", setFromEvent);
      };
    }, []);
    const hoverStyle= useMemo(() => {
      if (isNaN(shiftX)) {
        shiftX = 0;
      }
      if (isNaN(shiftY)) {
        shiftY = 0;
      }
      const left= window.innerWidth/2>position.x
      const shift= left ? 0 : shiftX
      return {...hoverComponentStyle,top:position.y,left:position.x-shift ,display: visibility ? 'block': 'none'}
    }, [position, visibility]);

    const childrenWithProps = React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        if (child.type.name === 'Trigger' || child.props.type === 'trigger') {
          return React.cloneElement(child, { setVisibility: setVisibility });
          }
          if (child.type.name === 'Hover' || child.props.type === 'hover') {
                return React.createElement("div", {style: hoverStyle }, child);
        }
      }
      return child;
    });

    return (<div>{childrenWithProps}</div>);
}
