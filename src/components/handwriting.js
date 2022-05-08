import { useState } from "react";
import HandwritingCanvas from "./handwriting-canvas";
import useEventListener from "./useEventListener";
const HandwritingInput = ({width, height, maxHeight, maxWidth, minHeight, minWidth, vw, vh, handleButton, language, options}) => {
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
  
  let [results, setResults] = useState()
  let [widthRes, setWidthRes] = useState(minMax(percentOf(vw, window.screen.width), minWidth || -Infinity, maxWidth || Infinity))
  let [heightRes, setHeightRes] = useState(minMax(percentOf(vh, window.screen.height), minWidth || -Infinity, maxWidth || Infinity))
  let [ink, setInk] = useState([])

  const handleResize = () => {
    setWidthRes(minMax(percentOf(vw, window.innerWidth), minWidth || -Infinity, maxWidth || Infinity))
    setHeightRes(minMax(percentOf(vh, window.innerHeight), minHeight || -Infinity, maxHeight || Infinity))
  }
  useEventListener("resize", handleResize, window, vw !== undefined || vh !== undefined)

  return(
    <div className="handwriting">
      <HandwritingCanvas 
        w={widthRes || width} 
        h={heightRes || height}
        setResults={setResults}
        ink={ink}
        language={language}
        setInk={setInk}
        options={options}
      />
      <div className="handwriting-results-wrapper">
        <button className="clear-ink-button" onClick={() => {setInk([]); setResults([])}} >Clear</button>
        <div className="handwriting-results">
          {
            results && results.map((item, idx) => {
              return(
                <button key={idx} tabIndex={-1} onClick={handleButton} value={item}> {item} </button>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}
export default HandwritingInput

