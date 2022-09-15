import * as React from 'react';
import { useEffect, useState, useMemo } from "react";
import { collapseToast } from 'react-toastify';

export default function Hover(props) {
  let {shiftX,shiftY, showPopup}=props
  const [position, setPosition] = useState({ x: 0, y: 0  });  
    const hoverComponentStyle = {position: 'absolute',  zIndex: '5'};
    const {children}=props;


    // useEffect(() => {
    //   const setFromEvent = (e) => setPosition({ x: e.clientX, y: e.clientY });
    //   window.addEventListener("mousemove", setFromEvent);
    //   return () => {
    //     window.removeEventListener("mousemove", setFromEvent);
    //   };
    // }, []);
    const hoverStyle= useMemo(() => {
      if (isNaN(shiftX)) {
        shiftX = 0;
      }
      if (isNaN(shiftY)) {
        shiftY = 0;
      }
      const left= window.innerWidth/2>position.x
      const top= window.innerHeight/2>position.y
      const shiftXX= left ? -10 : shiftX
      const shiftYY= top ? -10 : shiftY      

      return {...hoverComponentStyle,top:position.y-shiftYY,left:position.x-shiftXX ,display: showPopup ? 'block': 'none'}
    }, [position, showPopup]);


    var getCursorPos = function getCursorPos(e) {
      var cursorX = e.pageX;
      var cursorY = e.pageY;
      setPosition({ x: cursorX, y: cursorY });
    }

    const childrenWithProps = React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        if (child.type.name === 'Trigger' || child.props.type === 'trigger') {
            return React.createElement("div", {
            onMouseMove: function onMouseMove(e) { return getCursorPos(e);},
            style:{position: 'relative'},
          }, child);
          ;
          }
          if (child.type.name === 'Hover' || child.props.type === 'hover') {
                return React.createElement("div", {style: hoverStyle }, child);
        }
      }
      return child;
    });

    return (<div>{childrenWithProps}</div>);
}
