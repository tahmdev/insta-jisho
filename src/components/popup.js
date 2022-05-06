import { useEffect } from "react";
import React from "react";

const Popup = ({setShow, children, classes, }) => {
  let ref = React.createRef();
  useEffect(() => {
    window.addEventListener("mousedown", handleClick)
    return () => {
      window.removeEventListener("mousedown", handleClick)
    }
  })
  const handleClick = (e) => {
    if (!ref.current.contains(e.target)){
      handleHide()
    }
  }
  const handleHide = () => {
    setShow(false)
  }
  return(
    <div className="popup-bg">
      <div className={classes} ref={ref}>
      {children}
        <button className="close-popup" aria-label="Popup schließen" onClick={handleHide} >
              X
        </button>
      </div>
    </div>
  )
}
export default Popup