import { useState } from "react";
import HandwritingCanvas from "./handwriting-canvas";
import useEventListener from "./useEventListener";
const HandwritingInput = ({width, height, maxHeight, maxWidth, minHeight, minWidth, vw, vh, handleButton}) => {
  let [results, setResults] = useState()
  let [widthRes, setWidthRes] = useState(minMax(percentOf(vw, window.screen.width), minWidth || -Infinity, maxWidth || Infinity))
  let [heightRes, setHeightRes] = useState(minMax(percentOf(vh, window.screen.width), minWidth || -Infinity, maxWidth || Infinity))
  let [ink, setInk] = useState([])

  const handleResize = () => {
    setWidthRes(minMax(percentOf(vw, window.innerWidth), minWidth || -Infinity, maxWidth || Infinity))
    setHeightRes(minMax(percentOf(vh, window.innerHeight), minHeight || -Infinity, maxHeight || Infinity))
  }
  useEventListener("resize", handleResize, window, vw !== undefined || vh !== undefined)


  return(
    <div id="handwriting-wrapper">
      <HandwritingCanvas 
        w={widthRes || width} 
        h={heightRes || height}
        setResults={setResults}
        ink={ink}
        setInk={setInk}
      />
      <div className="flex">
        <button className="clear-ink-button" onClick={() => {setInk([]); setResults([])}} >Clear</button>
        <div className="handwriting-results">
          {
            results && results.map(item => {
              return(
                <button tabIndex={-1} onClick={handleButton} value={item} > {item} </button>
              )
            })
          }
        </div>
      </div>
      
    </div>
  )
}
export default HandwritingInput

const percentOf = (percent, parent) => {
  return percent / 100 * parent
}
const minMax = (num, min, max) => {
  return (
    num > max
    ? max
    : num < min
    ? min
    : num
  )
}